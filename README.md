# Fantasías Heladas CRM

CRM web (HTML/CSS/JS puro, sin backend ni instalación) para gestionar clientes potenciales de **Fantasías Heladas**.

## Cómo abrirlo

Doble clic en `index.html` (o `login.html`) y se abre en tu navegador. No necesita Node, Python ni conexión a internet, salvo para cargar los gráficos (Chart.js se carga desde un CDN).

## Acceso

- Usuario: `admin`
- Contraseña: `Heladas2026`

> La protección por contraseña es del lado del cliente (pensada para uso local/demo). No usar como control de acceso real en un entorno multiusuario expuesto a internet.

## Estructura

- `login.html` — pantalla de inicio de sesión.
- `dashboard.html` (Resumen) — KPIs, embudo de ventas por estado (dona), gráficos (por fuente, por producto, por mes).
- `pipeline.html` — tablero kanban con los clientes potenciales agrupados por estado.
- `fuentes.html` — desempeño por canal de adquisición (cantidad, ganados, valor, tasa de conversión).
- `leads.html` (Leads) — tabla de clientes potenciales con búsqueda, filtros, paginación y alta/edición/borrado.
- `seguimientos.html` — clientes potenciales con fecha de seguimiento pendiente o vencida, con acción rápida para marcarlos como contactados.
- `js/data.js` — genera 130 clientes potenciales simulados la primera vez que se abre, replicando la estructura real del negocio (`CLIENTES.xlsx`): Cliente, Producto, Valor USD, Estado, Fuente, Prioridad, Notas, Fecha de seguimiento.
- `js/store.js` — capa de datos (CRUD) sobre `localStorage`.
- `js/auth.js` — login y protección de páginas.
- `assets/logo.png` — coloca aquí el logo real de Fantasías Heladas (si no existe, se usa un logo de respaldo automáticamente).

## Estructura de datos (basada en CLIENTES.xlsx)

| Campo | Valores |
|---|---|
| Cliente | nombre del cliente particular |
| Producto | Waffle, Banana Split, Helado Soft, Sundae, Helado con Queso, Tulipán con Queso |
| Valor USD | precio estimado de la venta |
| Estado | Nuevo Lead, Contactado, Interesado, Propuesta, Ganado, Perdido |
| Fuente | Facebook, Instagram, TikTok, WhatsApp, Referido, Google |
| Prioridad | Alta, Media, Baja |
| Notas / Fecha de seguimiento | texto libre / fecha |

## Datos

Los datos se guardan en el `localStorage` del navegador. Si los borras (o limpias datos del sitio), se regeneran automáticamente la próxima vez que abras la app.

## Pendiente / próximos pasos

- Reemplazar `assets/logo.png` con el archivo de logo real.

## Versión para Google Sheets

`FantasiasHeladas_CRM_GoogleSheets.xlsx` es una versión alterna pensada para subir a Google Sheets (como en el vídeo de referencia), con hoja "Leads" (ID, Fecha, Cliente, Telefono, Producto, Valor USD, Estado, Fuente, Prioridad, Notas, Fecha Seguimiento — con listas desplegables y colores por estado) y hoja "Dashboard" (KPIs y 4 gráficos, todo con fórmulas nativas, no valores fijos). `build_sheets_crm.py` es el script que la generó — se puede volver a ejecutar para regenerar datos simulados nuevos.

## Sincronizar el CRM web con Google Sheets

Cada página del CRM (excepto el login) tiene un botón **"🔗 Sincronizar"** en la barra lateral. Para que funcione:

1. Abre tu Google Sheet (la hoja importada desde el .xlsx).
2. Menú **Extensiones → Apps Script**.
3. Borra el contenido por defecto y pega todo el contenido de [`google-apps-script/Code.gs`](google-apps-script/Code.gs).
4. Guarda, luego **Implementar → Nueva implementación**.
5. Tipo: "Aplicación web". Ejecutar como: "Yo". Acceso: "Cualquier usuario". Implementar y autoriza los permisos.
6. Copia la URL que te entrega Google (termina en `/exec`).
7. En el CRM web, clic en "🔗 Sincronizar", pega esa URL en el botón "Guardar URL".
8. Usa "⬇ Traer de Sheets" para cargar lo que esté en la hoja, o "⬆ Subir a Sheets" para subir lo que tengas en el CRM web (cada acción reemplaza por completo el lado de destino — no hace una mezcla automática).

> Nota: no pude probar esta conexión en vivo porque requiere tu propia cuenta de Google. Verifiqué que el código del CRM maneja correctamente los casos de URL faltante o de error de red, pero la implementación real de Apps Script (pasos 1-6) la debes hacer y probar tú mismo.
