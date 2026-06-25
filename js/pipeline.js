/* Fantasías Heladas CRM — vista Pipeline (kanban por estado) */

inicializarDatos();

const fmtUsd = (n) => "$" + Number(n).toLocaleString("en-US", { maximumFractionDigits: 0 });

const COLORES_ESTADO = {
  "Nuevo Lead": "#9aa3b2",
  Contactado: "#4fd1f0",
  Interesado: "#845ef7",
  Propuesta: "#f5a623",
  Ganado: "#2bb673",
  Perdido: "#e5484d",
};

function renderKanban() {
  const columnas = Store.pipelinePorEstado();
  const cont = document.getElementById("kanbanContainer");
  cont.innerHTML = columnas
    .map((col) => {
      const valorTotal = col.leads.reduce((s, l) => s + l.valorUsd, 0);
      const tarjetas = col.leads
        .map(
          (l) => `
        <div class="kanban-card">
          <b>${l.cliente}</b>
          <div class="meta">${l.producto} · ${fmtUsd(l.valorUsd)}</div>
          <div class="meta">${l.fuente}</div>
        </div>
      `
        )
        .join("");
      return `
        <div class="kanban-col">
          <h4><span class="dot" style="background:${COLORES_ESTADO[col.estado]}"></span>${col.estado}</h4>
          <div class="subtotal">${col.leads.length} · ${fmtUsd(valorTotal)}</div>
          ${tarjetas || '<div class="meta" style="color:#b3acc4">Sin registros</div>'}
        </div>
      `;
    })
    .join("");
}

renderKanban();
