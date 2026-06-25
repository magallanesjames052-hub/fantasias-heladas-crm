/* Fantasías Heladas CRM — vista Fuentes (desempeño por canal) */

const fmtUsd = (n) => "$" + Number(n).toLocaleString("en-US", { maximumFractionDigits: 0 });

function renderFuentes() {
  const datos = Store.fuentesDetalle();
  const grid = document.getElementById("fuentesGrid");
  grid.innerHTML = datos
    .map(
      (f) => `
    <div class="fuente-card">
      <h4>${f.fuente}</h4>
      <div class="fila"><span>Clientes potenciales</span><b>${f.cantidad}</b></div>
      <div class="fila"><span>Ganados</span><b>${f.ganados}</b></div>
      <div class="fila"><span>Valor ganado</span><b>${fmtUsd(f.valorGanado)}</b></div>
      <div class="fila"><span>Tasa de conversión</span><b>${f.tasaConversion.toFixed(1)}%</b></div>
    </div>
  `
    )
    .join("");

  new Chart(document.getElementById("chartFuentesValor"), {
    type: "bar",
    data: {
      labels: datos.map((f) => f.fuente),
      datasets: [
        {
          label: "Valor ganado (USD)",
          data: datos.map((f) => f.valorGanado),
          backgroundColor: "#6c2bd9",
          borderRadius: 6,
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true } },
    },
  });
}

(async function iniciar() {
  await cargarDatosIniciales();
  renderFuentes();
})();
