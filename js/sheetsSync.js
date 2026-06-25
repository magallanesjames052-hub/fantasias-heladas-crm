/* Fantasías Heladas CRM — sincronización manual con Google Sheets (Apps Script) */

const SHEETS_URL_KEY = "fh_crm_sheets_url";
const SHEETS_LAST_SYNC_KEY = "fh_crm_last_sync";

function getSheetsUrl() {
  return localStorage.getItem(SHEETS_URL_KEY) || "";
}

function setSheetsUrl(url) {
  localStorage.setItem(SHEETS_URL_KEY, url.trim());
}

function marcarUltimaSync() {
  localStorage.setItem(SHEETS_LAST_SYNC_KEY, new Date().toLocaleString("es-EC"));
}

function abrirModalSync() {
  document.getElementById("syncUrlInput").value = getSheetsUrl();
  const ultima = localStorage.getItem(SHEETS_LAST_SYNC_KEY);
  document.getElementById("syncUltima").textContent = ultima ? `Última sincronización: ${ultima}` : "Todavía no has sincronizado.";
  document.getElementById("syncEstado").textContent = "";
  document.getElementById("syncModalOverlay").classList.add("abierto");
}

function cerrarModalSync() {
  document.getElementById("syncModalOverlay").classList.remove("abierto");
}

function guardarUrlSync() {
  const url = document.getElementById("syncUrlInput").value.trim();
  if (!url) {
    document.getElementById("syncEstado").textContent = "Pega primero la URL de tu Apps Script.";
    return;
  }
  setSheetsUrl(url);
  document.getElementById("syncEstado").textContent = "URL guardada.";
}

async function traerDeSheets() {
  const url = getSheetsUrl();
  const estado = document.getElementById("syncEstado");
  if (!url) {
    estado.textContent = "Primero guarda la URL de tu Apps Script.";
    return;
  }
  estado.textContent = "Trayendo datos de Google Sheets...";
  try {
    const resp = await fetch(url, { method: "GET" });
    if (!resp.ok) throw new Error("HTTP " + resp.status);
    const datos = await resp.json();
    const soloFecha = (v) => (v ? String(v).slice(0, 10) : "");
    const leads = datos.map((l) => ({
      id: Number(l.id),
      fecha: soloFecha(l.fecha),
      cliente: l.cliente || "",
      telefono: l.telefono ? String(l.telefono) : "",
      producto: l.producto || "",
      valorUsd: Number(l.valorUsd) || 0,
      estado: l.estado || "Nuevo Lead",
      fuente: l.fuente || "",
      prioridad: l.prioridad || "Media",
      notas: l.notas || "",
      fechaSeguimiento: soloFecha(l.fechaSeguimiento),
    }));
    Store.saveAll(leads);
    marcarUltimaSync();
    estado.textContent = `Listo: se trajeron ${leads.length} clientes potenciales. Recargando...`;
    setTimeout(() => window.location.reload(), 800);
  } catch (err) {
    estado.textContent = "Error al traer datos: " + err.message + ". Revisa que la URL sea correcta y que la implementación esté publicada con acceso 'Cualquier usuario'.";
  }
}

async function subirASheets() {
  const url = getSheetsUrl();
  const estado = document.getElementById("syncEstado");
  if (!url) {
    estado.textContent = "Primero guarda la URL de tu Apps Script.";
    return;
  }
  estado.textContent = "Subiendo datos a Google Sheets...";
  try {
    const leads = Store.getAll();
    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ accion: "reemplazarTodo", leads }),
    });
    if (!resp.ok) throw new Error("HTTP " + resp.status);
    const resultado = await resp.json();
    if (!resultado.ok) throw new Error(resultado.error || "Error desconocido");
    marcarUltimaSync();
    estado.textContent = `Listo: se subieron ${resultado.total} clientes potenciales a Google Sheets.`;
  } catch (err) {
    estado.textContent = "Error al subir datos: " + err.message + ". Revisa que la URL sea correcta y que la implementación esté publicada con acceso 'Cualquier usuario'.";
  }
}
