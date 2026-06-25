/* Fantasías Heladas CRM — gestión de clientes potenciales (tabla + CRUD) */

inicializarDatos();

const fmtUsd = (n) => "$" + Number(n).toLocaleString("en-US", { maximumFractionDigits: 0 });

const POR_PAGINA = 12;
let paginaActual = 1;

function poblarSelects() {
  const selEstadoFiltro = document.getElementById("filtroEstado");
  const selFuenteFiltro = document.getElementById("filtroFuente");
  const selPrioridadFiltro = document.getElementById("filtroPrioridad");
  const selProductoForm = document.getElementById("fProducto");
  const selEstadoForm = document.getElementById("fEstado");
  const selFuenteForm = document.getElementById("fFuente");
  const selPrioridadForm = document.getElementById("fPrioridad");

  ESTADOS.forEach((e) => {
    selEstadoFiltro.appendChild(new Option(e, e));
    selEstadoForm.appendChild(new Option(e, e));
  });
  FUENTES.forEach((f) => {
    selFuenteFiltro.appendChild(new Option(f, f));
    selFuenteForm.appendChild(new Option(f, f));
  });
  PRIORIDADES.forEach((p) => {
    selPrioridadFiltro.appendChild(new Option(p, p));
    selPrioridadForm.appendChild(new Option(p, p));
  });
  PRODUCTOS.forEach((p) => selProductoForm.appendChild(new Option(p, p)));
}

function leadsFiltrados() {
  const q = document.getElementById("buscador").value.trim().toLowerCase();
  const estado = document.getElementById("filtroEstado").value;
  const fuente = document.getElementById("filtroFuente").value;
  const prioridad = document.getElementById("filtroPrioridad").value;

  return Store.getAll().filter((l) => {
    const coincideTexto = !q || l.cliente.toLowerCase().includes(q);
    const coincideEstado = !estado || l.estado === estado;
    const coincideFuente = !fuente || l.fuente === fuente;
    const coincidePrioridad = !prioridad || l.prioridad === prioridad;
    return coincideTexto && coincideEstado && coincideFuente && coincidePrioridad;
  });
}

const CLASE_ESTADO = {
  "Nuevo Lead": "estado-nuevo",
  Contactado: "estado-contactado",
  Interesado: "estado-interesado",
  Propuesta: "estado-propuesta",
  Ganado: "estado-ganado",
  Perdido: "estado-perdido",
};
const CLASE_PRIORIDAD = { Alta: "estado-perdido", Media: "estado-propuesta", Baja: "estado-nuevo" };

function renderTabla() {
  const datos = leadsFiltrados();
  const totalPaginas = Math.max(Math.ceil(datos.length / POR_PAGINA), 1);
  if (paginaActual > totalPaginas) paginaActual = totalPaginas;

  const inicio = (paginaActual - 1) * POR_PAGINA;
  const pagina = datos.slice(inicio, inicio + POR_PAGINA);

  const tbody = document.getElementById("tablaBody");
  tbody.innerHTML = pagina
    .map(
      (l) => `
    <tr>
      <td><b>${l.cliente}</b><br><span style="color:#9890ad;font-size:11px">${l.telefono}</span></td>
      <td>${l.producto}</td>
      <td><span class="badge ${CLASE_ESTADO[l.estado]}">${l.estado}</span></td>
      <td>${fmtUsd(l.valorUsd)}</td>
      <td>${l.fuente}</td>
      <td><span class="badge ${CLASE_PRIORIDAD[l.prioridad]}">${l.prioridad}</span></td>
      <td>${l.fechaSeguimiento || "—"}</td>
      <td style="max-width:160px;font-size:12px;color:#6e6480">${l.notas || ""}</td>
      <td class="acciones">
        <button class="icon-btn" onclick="abrirModalEditar(${l.id})">✎ Editar</button>
        <button class="icon-btn borrar" onclick="borrarLead(${l.id})">🗑</button>
      </td>
    </tr>
  `
    )
    .join("");

  renderPaginacion(totalPaginas);
}

function renderPaginacion(totalPaginas) {
  const cont = document.getElementById("paginacion");
  cont.innerHTML = "";
  for (let i = 1; i <= totalPaginas; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    if (i === paginaActual) btn.classList.add("activo");
    btn.onclick = () => {
      paginaActual = i;
      renderTabla();
    };
    cont.appendChild(btn);
  }
}

function abrirModalNuevo() {
  document.getElementById("modalTitulo").textContent = "Nuevo cliente potencial";
  document.getElementById("leadForm").reset();
  document.getElementById("leadId").value = "";
  document.getElementById("modalOverlay").classList.add("abierto");
}

function abrirModalEditar(id) {
  const l = Store.getById(id);
  if (!l) return;
  document.getElementById("modalTitulo").textContent = "Editar cliente potencial";
  document.getElementById("leadId").value = l.id;
  document.getElementById("fCliente").value = l.cliente;
  document.getElementById("fTelefono").value = l.telefono;
  document.getElementById("fProducto").value = l.producto;
  document.getElementById("fEstado").value = l.estado;
  document.getElementById("fValorUsd").value = l.valorUsd;
  document.getElementById("fFuente").value = l.fuente;
  document.getElementById("fPrioridad").value = l.prioridad;
  document.getElementById("fFechaSeguimiento").value = l.fechaSeguimiento || "";
  document.getElementById("fNotas").value = l.notas;
  document.getElementById("modalOverlay").classList.add("abierto");
}

function cerrarModal() {
  document.getElementById("modalOverlay").classList.remove("abierto");
}

function borrarLead(id) {
  if (confirm("¿Eliminar este cliente potencial? Esta acción no se puede deshacer.")) {
    Store.remove(id);
    renderTabla();
  }
}

document.getElementById("leadForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const id = document.getElementById("leadId").value;
  const datos = {
    cliente: document.getElementById("fCliente").value.trim(),
    telefono: document.getElementById("fTelefono").value.trim(),
    producto: document.getElementById("fProducto").value,
    estado: document.getElementById("fEstado").value,
    valorUsd: document.getElementById("fValorUsd").value,
    fuente: document.getElementById("fFuente").value,
    prioridad: document.getElementById("fPrioridad").value,
    fechaSeguimiento: document.getElementById("fFechaSeguimiento").value,
    notas: document.getElementById("fNotas").value.trim(),
  };

  if (id) {
    Store.update(id, datos);
  } else {
    Store.create(datos);
  }
  cerrarModal();
  renderTabla();
});

document.getElementById("buscador").addEventListener("input", () => {
  paginaActual = 1;
  renderTabla();
});
document.getElementById("filtroEstado").addEventListener("change", () => {
  paginaActual = 1;
  renderTabla();
});
document.getElementById("filtroFuente").addEventListener("change", () => {
  paginaActual = 1;
  renderTabla();
});
document.getElementById("filtroPrioridad").addEventListener("change", () => {
  paginaActual = 1;
  renderTabla();
});

poblarSelects();
renderTabla();
