function normalizarTexto(texto) {
  return String(texto || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function esNumero(valor) {
  return /^[0-9]+$/.test(String(valor || "").trim());
}

function detectarDistribuidora(texto) {
  const t = normalizarTexto(texto);

  if (
    t === "1" ||
    t.includes("edenor") ||
    t.includes("eden") ||
    t.includes("ednor") ||
    t.includes("edenro")
  ) {
    return "EDENOR";
  }

  if (
    t === "2" ||
    t.includes("naturgy") ||
    t.includes("natur") ||
    t.includes("natugy") ||
    t.includes("naturgi")
  ) {
    return "NATURGY";
  }

  return null;
}

function extraerLecturaYMedidor(texto) {
  const lineas = String(texto || "")
    .split("\n")
    .map(l => l.trim())
    .filter(Boolean);

  return {
    numeroMedidor: lineas[0] || "",
    lectura: lineas.slice(1).join(" ") || ""
  };
}

module.exports = {
  normalizarTexto,
  esNumero,
  detectarDistribuidora,
  extraerLecturaYMedidor
};
