/**
 * ALOTAR Booking App · Configuración global multiempresa
 * V2.3 · Candidata conectada
 *
 * UNA sola PWA para todas las empresas.
 * El tenant se identifica dinámicamente mediante company_id.
 */
window.ALOTAR_CONFIG = {
  WEBAPP_URL: "https://script.google.com/macros/s/AKfycbz44h-ZfoVv_52OamhNQCTyW2ZtEPtsodYf-4uuQixY42fDt1B3LXqB6a6T2pziW_u2/exec",

  // Mantener vacío salvo que el backend exija una API key pública específica.
  API_KEY: "",

  // PRODUCCIÓN MULTIEMPRESA:
  // Debe permanecer vacío para no amarrar la App a una empresa.
  DEFAULT_COMPANY_ID: "",

  COMPANY_NAME: "ALOTAR Booking",
  REBOOK_PREFILL: {}
};
