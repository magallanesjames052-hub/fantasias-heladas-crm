/* Fantasías Heladas CRM — lógica del dashboard */

const fmtUsd = (n) =>
  "$" + Number(n).toLocaleString("en-US", { maximumFractionDigits: 0 });

const COLORES_ESTADO = {
  "Nuevo Lead": "#9aa3b2",
  Contactado: "#4fd1f0",
  Interesado: "#845ef7",
  Propuesta: "#f5a623",
  Ganado: "#2bb673",
  Perdido: "#e5484d",
};

function renderKpis() {
  const s = Store.stats();
  document.getElementById("kpiTotal").textContent = s.total;
  document.getElementById("kpiPipeline").textContent = fmtUsd(s.valorPipeline);
  document.getElementById("kpiGanado").textContent = fmtUsd(s.valorGanado);
  document.getElementById("kpiConversion").textContent = s.tasaConversion.toFixed(1) + "%";
}

function renderChartEmbudo() {
  const datos = Store.funnelPorEstado().filter((d) => d.cantidad > 0);
  new Chart(document.getElementById("chartEmbudo"), {
    type: "doughnut",
    data: {
      labels: datos.map((d) => `${d.estado} (${d.cantidad})`),
      datasets: [
        {
          data: datos.map((d) => d.cantidad),
          backgroundColor: datos.map((d) => COLORES_ESTADO[d.estado]),
          borderWidth: 0,
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "bottom", labels: { boxWidth: 12, font: { size: 11 } } },
        tooltip: {
          callbacks: {
            label: (ctx) => `${datos[ctx.dataIndex].estado}: ${ctx.parsed} · ${fmtUsd(datos[ctx.dataIndex].valor)}`,
          },
        },
      },
    },
  });
}

function renderChartFuente() {
  const datos = Store.porFuente();
  new Chart(document.getElementById("chartFuente"), {
    type: "doughnut",
    data: {
      labels: datos.map((d) => d.fuente),
      datasets: [
        {
          data: datos.map((d) => d.cantidad),
          backgroundColor: ["#6c2bd9", "#ff5fa2", "#4fd1f0", "#845ef7", "#f5a623", "#2bb673"],
          borderWidth: 0,
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      plugins: { legend: { position: "bottom", labels: { boxWidth: 12, font: { size: 11 } } } },
    },
  });
}

function renderChartProducto() {
  const datos = Store.porProducto();
  new Chart(document.getElementById("chartProducto"), {
    type: "bar",
    data: {
      labels: datos.map((d) => d.producto),
      datasets: [
        {
          label: "Clientes potenciales",
          data: datos.map((d) => d.cantidad),
          backgroundColor: "#ff5fa2",
          borderRadius: 6,
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      indexAxis: "y",
      plugins: { legend: { display: false } },
      scales: { x: { beginAtZero: true } },
    },
  });
}

function renderChartMeses() {
  const datos = Store.porMes();
  new Chart(document.getElementById("chartMeses"), {
    type: "bar",
    data: {
      labels: datos.map((d) => d.mes),
      datasets: [
        {
          label: "Nuevos clientes potenciales",
          data: datos.map((d) => d.cantidad),
          backgroundColor: "#4fd1f0",
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
  mostrarCargando();
  await cargarDatosIniciales();
  renderKpis();
  renderChartEmbudo();
  renderChartFuente();
  renderChartProducto();
  renderChartMeses();
  ocultarCargando();
})();
