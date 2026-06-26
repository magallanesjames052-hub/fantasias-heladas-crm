/* Fantasías Heladas CRM — utilidades de interfaz (menú móvil + estado de carga) */

function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("abierto");
  document.getElementById("sidebarBackdrop").classList.toggle("abierto");
}

function mostrarCargando() {
  if (document.getElementById("cargandoOverlay")) return;
  const div = document.createElement("div");
  div.id = "cargandoOverlay";
  div.className = "cargando-overlay";
  div.innerHTML = `<div class="cargando-spinner"></div><p>Cargando datos...</p>`;
  document.body.appendChild(div);
}

function ocultarCargando() {
  const el = document.getElementById("cargandoOverlay");
  if (el) el.remove();
}
