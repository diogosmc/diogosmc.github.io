function toggleList(category, element) {

    document.querySelectorAll('tbody tr').forEach(row => {
        row.classList.add('hidden');
    });


    const selectedRow = document.getElementById(category);
    selectedRow.classList.toggle('hidden');

  
    document.querySelectorAll('.opcoes_tabela').forEach(th => {
        th.classList.remove('active');
    });

 
    element.classList.add('active');
}