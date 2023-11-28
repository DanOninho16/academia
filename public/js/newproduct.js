var btn_add = document.getElementById('add');
var btn_finish = document.getElementById('finish');
var formtreino = document.getElementById('formtreino');
var box = document.getElementById('box');
var contador = 1;

btn_add.addEventListener('click', function(){
    contador++;
    var linha = createLinha();
    box.appendChild(linha);
});

function createLinha() {
    var linha = document.createElement('div'); // Create a div to hold the elements of the line
    linha.setAttribute('class', 'row gx-1 text-center justify-content-center align-items-center my-2')

    // Create the select element
    var select = document.createElement('select');
    select.setAttribute('class', 'form-control')
    select.setAttribute('name', 'exercício_' + contador);
    select.setAttribute('id', 'exercicio_' + contador);

    // Fetch data from the API endpoint
    fetch('http://localhost:3000/api/exercises')
        .then(res => res.json())
        .then(results => {
            // Iterate over the API response and create options
            for (var i = 0; i < results.length; i++) {
                var option = document.createElement('option');
                var txt = document.createTextNode(results[i].nomeexercicio);
                option.appendChild(txt);
                option.setAttribute('value', results[i].idexercicio);
                select.appendChild(option);
            }
        });

    // Create the div that will contain the select element
    var divSelect = document.createElement('div');
    divSelect.setAttribute('class', 'form-group col-auto');
    divSelect.appendChild(select);

    // Create the input elements
    var inputSeries = document.createElement('input');
    inputSeries.setAttribute('type', 'number');
    inputSeries.setAttribute('class', 'form-control');
    inputSeries.setAttribute('name', 'Séries_' + contador);
    inputSeries.setAttribute('id', 'series_' + contador);


    // Create the div that will contain the input element
    var divSeries = document.createElement('div');
    divSeries.setAttribute('class', 'form-group col-auto');
    divSeries.appendChild(inputSeries);

    var inputRepeticoes = document.createElement('input');
    inputRepeticoes.setAttribute('type', 'number');
    inputRepeticoes.setAttribute('class', 'form-control');
    inputRepeticoes.setAttribute('name', 'Repetições_' + contador);
    inputRepeticoes.setAttribute('id', 'repeticoes_' + contador);

    // Create the div that will contain the input element
    var divRepeticoes = document.createElement('div');
    divRepeticoes.setAttribute('class', 'form-group col-auto');
    divRepeticoes.appendChild(inputRepeticoes);

    var inputCarga = document.createElement('input');
    inputCarga.setAttribute('type', 'number');
    inputCarga.setAttribute('class', 'form-control');
    inputCarga.setAttribute('name', 'carga_' + contador);
    inputCarga.setAttribute('id', 'carga_' + contador);
    inputCarga.setAttribute('placeholder', 'KG');

    // Create the div that will contain the input element
    var divCarga = document.createElement('div');
    divCarga.setAttribute('class', 'form-group col-auto');
    divCarga.appendChild(inputCarga);

    // Create the remove button
    var botaoRemover = document.createElement('button');
    botaoRemover.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi text-danger bi-dash-circle-fill" viewBox="0 0 16 16">
  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M4.5 7.5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1z"/>
</svg>`;
    botaoRemover.setAttribute('class', 'btn btn-sm align-middle');
    botaoRemover.setAttribute('id', 'remover_' + contador);
    botaoRemover.setAttribute('type', 'button');




    // Create the div that will contain the remove button
    var divRemover = document.createElement('div');
    divRemover.setAttribute('class', 'form-group col-auto');
    divRemover.appendChild(botaoRemover);

    // Add all the elements to the line div
    linha.appendChild(divSelect);
    linha.appendChild(divSeries);
    linha.appendChild(divRepeticoes);
    linha.appendChild(divCarga);
    linha.appendChild(divRemover);

    botaoRemover.addEventListener('click', function() {
        // Remove the parent element of the remove button (the line)
        linha.parentNode.removeChild(linha);

    });

    return linha;
}



formtreino.addEventListener('submit', (event) => {
  event.preventDefault();
  const exercicios = [];

  for (let i = 1; i <= contador; i++) {
    const diaTreino = document.getElementById(`data-exercicio`);
    const exercicio = document.getElementById(`exercicio_${i}`);
    const series = document.getElementById(`series_${i}`);
    const repeticoes = document.getElementById(`repeticoes_${i}`);
    const carga = document.getElementById(`carga_${i}`);

    if (exercicio.value && series.value && repeticoes.value) {
        const dataFicha = {
            dia_treino: diaTreino.value,
            exercicio_id: exercicio.value,
            series: parseInt(series.value),
            repeticoes: parseInt(repeticoes.value),
            carga: parseInt(carga.value),
        };
        exercicios.push(dataFicha);
    }
    console.log(exercicios); 
  }
  fetch('api/cadastro', {
    method: 'POST',
    body: JSON.stringify(exercicios),
    headers:{
        'Content-Type': 'application/json'
    }
  }).then(res => res.json())
  .then(data => {
    if(data.status == 'error') {
        success.style.display = 'none'
        error.style.display = 'block'
        error.innerText = data.error
    } else {
        error.style.display = 'none'
        success.style.display = 'block'
        success.innerText = data.success
    }
  })
})


// form.addEventListener("submit", ()=> {
//     const ficha
//     fetch("/api/register", {
//         method: "POST",
//         body: JSON.stringify(ficha),
//         headers: {
//             'Content-Type': 'application/json'
//         }
//     }).then(res => res.json())
//     .then(data => {
//         if(data => {
//             if (data.status == "error") {
//                 success.style.display = "none"
//                 error.style. display = "block"
//                 error.innerText = data.error
//             } else {
//                 error.style.display = "none"
//                 success.style. display = "block"
//                 success.innerText = data.success
//             }
//         })
//     })
// })