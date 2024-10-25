// Adiciona tópicos à pauta
document.getElementById('pautaForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const topicoInput = document.getElementById('topicoInput');
    const descricaoInput = document.getElementById('descricaoInput');

    const topicoText = topicoInput.value;
    const descricaoText = descricaoInput.value;

    if (topicoText === '' || descricaoText === '') return;

    const li = document.createElement('li');

    const span = document.createElement('span');
    span.textContent = topicoText;

    // Adiciona a descrição ao item da lista
    const descricaoSpan = document.createElement('span');
    descricaoSpan.textContent = descricaoText;
    descricaoSpan.className = 'descricao';

    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remover';
    removeButton.addEventListener('click', function() {
        li.remove();
    });

    li.appendChild(span);
    li.appendChild(descricaoSpan);
    li.appendChild(removeButton);
    document.getElementById('topicosList').appendChild(li);

    // Limpa os campos de entrada
    topicoInput.value = '';
    descricaoInput.value = '';
});

// Função para salvar a pauta em PDF
document.getElementById('savePdfBtn').addEventListener('click', function() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF(); // Inicializa o jsPDF
    let y = 20; // Posição inicial no PDF

    doc.setFontSize(16);
    doc.text('Pauta de Reunião', 20, y);
    y += 10;

    // Adiciona uma linha horizontal
    doc.setLineWidth(0.5);
    doc.line(20, y, 190, y);
    y += 5;

    const topicos = document.querySelectorAll('#topicosList li');
    topicos.forEach((topico, index) => {
        const titulo = topico.querySelector('span').textContent;
        const descricao = topico.querySelector('.descricao').textContent; // Captura a descrição
        
        doc.setFontSize(12);
        doc.text(`${index + 1}. ${titulo}`, 20, y);
        y += 5;

        if (descricao) {
            doc.setFontSize(10);
            doc.text(`Descrição: ${descricao}`, 30, y);
            y += 5;
        }

        // Adiciona uma linha em branco entre os tópicos
        y += 5;

        // Adiciona uma linha horizontal entre os tópicos
        doc.setLineWidth(0.5);
        doc.line(20, y, 190, y);
        y += 5;
    });

    // Adiciona um rodapé
    doc.setFontSize(10);
    doc.text('Gerado em: ' + new Date().toLocaleString(), 20, y);
    
    // Salva o PDF
    doc.save('pauta.pdf'); 
});
