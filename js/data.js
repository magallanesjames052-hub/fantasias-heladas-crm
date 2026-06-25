/* Fantasías Heladas CRM — generación de datos simulados
   Estructura basada en el Excel real de clientes potenciales del negocio
   (venta al detalle de postres a clientes particulares vía redes sociales). */

const ESTADOS = ["Nuevo Lead", "Contactado", "Interesado", "Propuesta", "Ganado", "Perdido"];
const FUENTES = ["Facebook", "Instagram", "TikTok", "WhatsApp", "Referido", "Google"];
const PRODUCTOS = ["Waffle", "Banana Split", "Helado Soft", "Sundae", "Helado con Queso", "Tulipán con Queso"];
const PRIORIDADES = ["Alta", "Media", "Baja"];

const PRECIO_BASE = {
  Waffle: 25,
  "Banana Split": 18,
  "Helado Soft": 20,
  Sundae: 15,
  "Helado con Queso": 22,
  "Tulipán con Queso": 24,
};

const NOMBRES_CLIENTE = [
  "María López", "Carlos Vera", "Andrea Torres", "Luis Vera", "María Zambrano", "Juan Tomalá",
  "Carla Reyes", "David Suárez", "Patricia González", "Jorge Mendoza", "Paola Vera", "Roberto Castillo",
  "Sofía López", "Kevin Rodríguez", "Daniela Cedeño", "Fernando Vega", "Isabel Navarro", "Tomás Herrera",
  "Camila Vargas", "Diego Salazar", "Natalia Cordero", "Eduardo Paredes", "Lucía Fonseca", "Mateo Bravo",
  "Joaquín Reyes", "Renata Morales", "Iván Cabrera", "Gabriela Ortiz", "Ricardo Salas", "Valentina Gómez",
];

const NOTAS_POR_ESTADO = {
  "Nuevo Lead": ["Consulta precios", "Primera consulta", "Preguntó por el menú", "Escribió por redes"],
  Contactado: ["Solicitó precios", "Se le envió catálogo", "Llamada de seguimiento realizada"],
  Interesado: ["Interesado en promoción", "Pidió muestra", "Preguntó por pedidos grandes"],
  Propuesta: ["Cotización enviada", "Esperando confirmación de pedido"],
  Ganado: ["Compra realizada", "Pedido entregado", "Cliente satisfecho"],
  Perdido: ["No respondió", "Eligió otra opción", "Precio fuera de presupuesto"],
};

function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function pick(arr) { return arr[randInt(0, arr.length - 1)]; }
function fechaISO(fecha) { return fecha.toISOString().slice(0, 10); }
function randomDateWithin(diasAtras) {
  const ahora = new Date();
  return new Date(ahora.getTime() - randInt(0, diasAtras) * 24 * 60 * 60 * 1000);
}

function generarClientesPotenciales(cantidad) {
  const leads = [];

  for (let i = 1; i <= cantidad; i++) {
    const producto = pick(PRODUCTOS);
    const estado = pick(ESTADOS);
    const fecha = randomDateWithin(120);
    const base = PRECIO_BASE[producto];
    const valorUsd = Math.max(base + randInt(-4, 6), 10);

    let fechaSeguimiento = "";
    if (estado !== "Ganado" && estado !== "Perdido") {
      const seguimiento = new Date(fecha.getTime() + randInt(2, 10) * 24 * 60 * 60 * 1000);
      fechaSeguimiento = fechaISO(seguimiento);
    }

    leads.push({
      id: i,
      fecha: fechaISO(fecha),
      cliente: pick(NOMBRES_CLIENTE),
      empresa: "Particular",
      telefono: `09${randInt(10000000, 99999999)}`,
      producto: producto,
      valorUsd: valorUsd,
      estado: estado,
      fuente: pick(FUENTES),
      prioridad: pick(PRIORIDADES),
      notas: pick(NOTAS_POR_ESTADO[estado]),
      fechaSeguimiento: fechaSeguimiento,
    });
  }
  return leads;
}

const STORAGE_KEY = "fh_crm_leads";
const STORAGE_VERSION_KEY = "fh_crm_seed_version";
const SEED_VERSION = "2";

function inicializarDatos() {
  const versionGuardada = localStorage.getItem(STORAGE_VERSION_KEY);
  if (!localStorage.getItem(STORAGE_KEY) || versionGuardada !== SEED_VERSION) {
    const leads = generarClientesPotenciales(130);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
    localStorage.setItem(STORAGE_VERSION_KEY, SEED_VERSION);
  }
}
