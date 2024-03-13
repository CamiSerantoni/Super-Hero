document.addEventListener("DOMContentLoaded", function () {
  $("#buscar").click(() => {
    buscarSuperhero();
  });

  $("#limpiar").click(() => {
    limpiar();
  });
});

function buscarSuperhero() {
  let id_Superhero = $("#input_busqueda").val();

  if (validacion(id_Superhero) == false) {
    errorInput();
    return;
  }

  // Limpiar tarjetas anteriores
  $("#cards").empty();

  // Obtener el superhéroe
  getSuperhero(id_Superhero);
}

function limpiar() {
  $("#input_busqueda").val(""); 
  $("#cards").empty(); 
}

function validacion(id) {
  let expresion = /^\d{1,3}$/;

  return expresion.test(id);
}

function errorInput() {
  Swal.fire({
    icon: "error",
    title: "Oops...",
    text: 'Favor revisa, ingresa un número entre el 1 al 731',
    confirmButtonColor: '#008000'
  });
  $("#input_busqueda").focus();
}

function getSuperhero(id) {
  const apiUrl = `https://superheroapi.com/api.php/10232387440806343/${id}`;

  $.ajax({
    type: "GET",
    url: apiUrl,
    success: function (response) {
      $("#cards").append(creacionCard(response));
      $("#input_busqueda").val("");
      $("#input_busqueda").focus();
    },
    error: function (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: 'No logramos encontrar tu superhéroe. Por favor, inténtalo de nuevo más tarde.',
        confirmButtonColor: '#008000'
      });
    },
  });
}

function creacionCard(Superhero) {


  let card = `
  <div class="col-12 col-md-7 col-lg-8 mb-5 my-3">
    <div class="row">
    <h4 class="card-title text-center fw-bold text-white mb-3">Super Héroe seleccionado: </h4>
      <div class="col-md-6 mt-1 mb-4">
        <div class="card mx-auto">
          <div class="row">
            <div class="col-md-12">
              <img src="${Superhero.image.url}" class="card-img-top rounded-start" alt="Superhero Image">
            </div>
            <div class="col-md-12">
              <div class="card-body">
                <h5 class="card-title text-center fw-bold">${Superhero.name}</h5>
                <p class="card-text"><strong>Conexiones:</strong> ${Superhero.connections["group-affiliation"]}</p>
                <ul class="list-group list-group-flush">
                  <li class="list-group-item"><strong>Publicado por:</strong> ${Superhero.biography.publisher}</li>
                  <li class="list-group-item"><strong>Ocupación:</strong> ${Superhero.work.occupation}</li>
                  <li class="list-group-item"><strong>Primera aparición:</strong> ${Superhero.biography["first-appearance"]}</li>
                  <li class="list-group-item"><strong>Altura:</strong> ${Superhero.appearance.height}</li>
                  <li class="list-group-item"><strong>Peso:</strong> ${Superhero.appearance.weight}</li>
                  <li class="list-group-item"><strong>Alias:</strong> ${Superhero.biography.aliases}</li>
                </ul>
                <div class=" text-center">
                <button class="btn btn-warning btn-show-chart fw-bold " data-id="${Superhero.id}">Ver poderes 👁️‍🗨️</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="chart-container">
        <div id="chartContainer-${Superhero.id}" class="chart rounded" style="border-radius: 10px;"></div>
        </div>
      </div>
    </div>
  </div>
`;
  // Agrega la tarjeta al DOM
  $("#cards").append(card);

  // Agrega un listener de eventos al botón "Mostrar gráfico"
  $(`#chartContainer-${Superhero.id}`).hide(); // Oculta el gráfico al principio
  $(`button[data-id="${Superhero.id}"]`).click(function () {
    $(`#chartContainer-${Superhero.id}`).toggle("fadeIn");

  // Crea el gráfico de pastel
  const ctxPie = document.getElementById(`chartContainer-${Superhero.id}`);
  if (ctxPie) {
    let powerstats = Superhero.powerstats;

    const labels = Object.keys(powerstats);
    const data = Object.values(powerstats);

    // Valida si data es "null" y asigna 0 por defecto
    const validatedData = data.map((value) => (value === "null" ? 0 : value));
    // Si todos los valores son 0, cambia los valores a 1 para que se muestre el gráfico
    const allZeros = validatedData.every((value) => value === 0);
    if (allZeros) {
      validatedData.fill(0.01);
    }
    let chartPie = new CanvasJS.Chart(`chartContainer-${Superhero.id}`, {
      animationEnabled: true,
      exportEnabled: false,
      animationEnabled: true,

      theme: "light2",
      title: {
        text: `Estadísticas de Poder de ${Superhero.name}`,
      },
      data: [
        {
          type: "pie",
          showInLegend: true,
          legendText: "{indexLabel}",
          toolTipContent: "{indexLabel}", 
          dataPoints: labels.map((label, index) => ({
            label: label,
            y: validatedData[index],
          })),
        },
      ],
    });
  
    // Cambia los labels al español usando indexLabel
    chartPie.options.data[0].dataPoints.forEach((dataPoint) => {
      switch (dataPoint.label) {
        case "intelligence":
          dataPoint.indexLabel = "Inteligencia - " + dataPoint.y;
          break;
        case "strength":
          dataPoint.indexLabel = "Fuerza - " + dataPoint.y;
          break;
        case "speed":
          dataPoint.indexLabel = "Velocidad - " + dataPoint.y;
          break;
        case "durability":
          dataPoint.indexLabel = "Durabilidad - " + dataPoint.y;
          break;
        case "power":
          dataPoint.indexLabel = "Poder - " + dataPoint.y;
          break;
        case "combat":
          dataPoint.indexLabel = "Combate - " + dataPoint.y;
          break;
        default:
          dataPoint.indexLabel = dataPoint.label + " - " + dataPoint.y;
      }
    });
  
    chartPie.render();
  }}
  )
}