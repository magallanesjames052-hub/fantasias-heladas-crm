/* Fantasías Heladas CRM — autenticación local (protección por contraseña)
   Nota: esta es una protección de acceso para uso local/demo, basada en
   sessionStorage + hash SHA-256 del lado del cliente. No sustituye un
   backend de autenticación real para un entorno multiusuario en producción. */

const AUTH_USER = "admin";
const AUTH_PASS_HASH = "556e8e681ceda66549d49d50e9ec447fd9f2b72ba720e43a7ebd0f00c8b60227"; // sha256("Heladas2026")
const AUTH_SESSION_KEY = "fh_crm_auth";

async function sha256Hex(texto) {
  const buffer = new TextEncoder().encode(texto);
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function intentarLogin(usuario, contrasena) {
  const hash = await sha256Hex(contrasena);
  if (usuario === AUTH_USER && hash === AUTH_PASS_HASH) {
    sessionStorage.setItem(AUTH_SESSION_KEY, "1");
    return true;
  }
  return false;
}

function estaAutenticado() {
  return sessionStorage.getItem(AUTH_SESSION_KEY) === "1";
}

function cerrarSesion() {
  sessionStorage.removeItem(AUTH_SESSION_KEY);
  window.location.href = "login.html";
}

function protegerPagina() {
  if (!estaAutenticado()) {
    window.location.href = "login.html";
  }
}
