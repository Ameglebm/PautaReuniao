// Função para adicionar quebra de linha para descrições longas
function quebraDeLinha(doc, texto, x, y, maxWidth) {
    const linhas = doc.splitTextToSize(texto, maxWidth);
    linhas.forEach((linha) => {
        doc.text(linha, x, y);
        y += 5; // Ajuste o espaçamento entre as linhas de descrição
    });
    return y;
}

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

        // Define a fonte em negrito e aumenta o tamanho para o título
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text(`${index + 1}. ${titulo}`, 20, y);
        y += 8;

        if (descricao) {
            // Define a fonte para negrito e tamanho menor para o título "Descrição"
            doc.setFontSize(10);
            doc.setFont("helvetica", "bold");
            doc.text("Descrição:", 30, y);

            // Define a fonte normal para o texto da descrição
            doc.setFont("helvetica", "normal");
            y = quebraDeLinha(doc, descricao, 50, y, 150); // Ajusta para o texto da descrição com quebras de linha automáticas
            y += 5;
        }

        // Adiciona uma linha horizontal automaticamente após o conteúdo da descrição
        doc.setLineWidth(0.5);
        doc.line(20, y, 190, y);
        y += 10;

        // Verifica se está no limite da página para adicionar uma nova
        if (y > 270) { // margem inferior da página
            doc.addPage();
            y = 20; // Reinicia a posição `y` na nova página
        }
    });

    // Adiciona o rodapé com a data e hora de geração do PDF
    const dataAtual = new Date().toLocaleString();
    doc.setFontSize(10);
    doc.text('Gerado em: ' + dataAtual, 20, y);

    // Salva o PDF
    doc.save('pauta.pdf');
});
