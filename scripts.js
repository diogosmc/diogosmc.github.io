function toggleList(category, element) {
    // Seleciona todas as linhas de categoria e as oculta
    document.querySelectorAll('tbody tr').forEach(row => {
        row.classList.add('hidden');
    });

    // Exibe a linha da categoria clicada
    const selectedRow = document.getElementById(category);
    selectedRow.classList.toggle('hidden');

    // Remove a classe 'active' de todos os th
    document.querySelectorAll('.opcoes_tabela').forEach(th => {
        th.classList.remove('active');
    });

    // Adiciona a classe 'active' ao th clicado
    element.classList.add('active');
}