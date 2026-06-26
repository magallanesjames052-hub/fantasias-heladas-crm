/* Fantasías Heladas CRM — vista Seguimientos */

const fmtUsd = (n) => "$" + Number(n).toLocaleString("en-US", { maximumFractionDigits: 0 });

const CLASE_ESTADO = {
  "Nuevo Lead": "estado-nuevo",
  Contactado: "estado-contactado",
  Interesado: "estado-interesado",
  Propuesta: "estado-propuesta",
  Ganado: "estado-ganado",
  Perdido: "estado-perdido",
};

function renderSeguimientos() {
  const datos = Store.seguimientos();
  const tbody = document.getElementById("tablaSeguimientos");

  if (!datos.length) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:#9890ad;padding:24px">No hay seguimientos pendientes 🎉</td></tr>`;
    return;
  }

  tbody.innerHTML = datos
    .map(
      (l) => `
    <tr>
      <td><b>${l.cliente}</b><br><span style="color:#9890ad;font-size:11px">${l.telefono}</span></td>
      <td>${l.producto}</td>
      <td><span class="badge ${CLASE_ESTADO[l.estado]}">${l.estado}</span></td>
      <td>${fmtUsd(l.valorUsd)}</td>
      <td>${l.fuente}</td>
      <td class="${l.vencido ? "seguimiento-vencido" : "seguimiento-pendiente"}">
        ${l.fechaSeguimiento}${l.vencido ? " · vencido" : ""}
      </td>
      <td class="acciones">
        <button class="icon-btn" onclick="marcarContactado(${l.id})">✓ Marcar contactado</button>
      </td>
    </tr>
  `
    )
    .join("");
}

function marcarContactado(id) {
  Store.update(id, { estado: "Contactado", fechaSeguimiento: "" });
  renderSeguimientos();
}

(async function iniciar() {
  mostrarCargando();
  await cargarDatosIniciales();
  renderSeguimientos();
  ocultarCargando();
})();
