/**
 * Fantasías Heladas CRM — API de sincronización con Google Sheets
 *
 * INSTRUCCIONES DE INSTALACIÓN:
 * 1. Abre tu Google Sheet (el que importaste desde FantasiasHeladas_CRM_GoogleSheets.xlsx).
 * 2. Menú "Extensiones" → "Apps Script".
 * 3. Borra el contenido de "Código.gs" y pega TODO este archivo.
 * 4. Guarda (icono de disquete).
 * 5. Botón azul "Implementar" → "Nueva implementación".
 * 6. Tipo: "Aplicación web". Ejecutar como: "Yo". Quién tiene acceso: "Cualquier usuario".
 * 7. Clic en "Implementar" → autoriza los permisos que pida Google (es tu propia hoja).
 * 8. Copia la "URL de la aplicación web" que te entrega — esa es la que pegas en el CRM web.
 *
 * Cada vez que cambies este código, debes crear una "Nueva implementación" otra vez
 * (o editar la implementación existente) para que los cambios surtan efecto.
 */

const NOMBRE_HOJA = "Leads";
const CAMPOS = ["id", "fecha", "cliente", "telefono", "producto", "valorUsd", "estado", "fuente", "prioridad", "notas", "fechaSeguimiento"];
const ENCABEZADOS = ["ID", "Fecha", "Cliente", "Telefono", "Producto", "Valor USD", "Estado", "Fuente", "Prioridad", "Notas", "Fecha Seguimiento"];

function doGet(e) {
  const hoja = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(NOMBRE_HOJA);
  const filas = hoja.getDataRange().getValues();
  const datos = filas.slice(1)
    .filter((fila) => fila[1]) // descarta filas sin cliente
    .map((fila) => {
      const lead = {};
      CAMPOS.forEach((campo, i) => {
        let valor = fila[i];
        if (valor instanceof Date) {
          valor = Utilities.formatDate(valor, Session.getScriptTimeZone(), "yyyy-MM-dd");
        }
        lead[campo] = valor;
      });
      return lead;
    });
  return ContentService.createTextOutput(JSON.stringify(datos)).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const hoja = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(NOMBRE_HOJA);
  const body = JSON.parse(e.postData.contents);

  if (body.accion === "reemplazarTodo") {
    hoja.clearContents();
    hoja.appendRow(ENCABEZADOS);
    const filas = body.leads.map((lead) => CAMPOS.map((campo) => (lead[campo] !== undefined ? lead[campo] : "")));
    if (filas.length) {
      hoja.getRange(2, 1, filas.length, CAMPOS.length).setValues(filas);
    }
    return ContentService.createTextOutput(JSON.stringify({ ok: true, total: filas.length })).setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService.createTextOutput(JSON.stringify({ ok: false, error: "Acción no reconocida" })).setMimeType(ContentService.MimeType.JSON);
}
