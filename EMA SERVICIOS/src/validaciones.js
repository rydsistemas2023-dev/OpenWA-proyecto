function esNumero(valor) {
  return /^\d+$/.test(valor);
}

function detectarDistribuidora(texto) {

  texto = texto.toLowerCase();

  if (
    texto.includes("1") ||
    texto.includes("edenor") ||
    texto.includes("edeno") ||
    texto.includes("eden")
  ) {
    return "EDENOR";
  }

  if (
    texto.includes("2") ||
    texto.includes("naturgy") ||
    texto.includes("natur")
  ) {
    return "NATURGY";
  }

  return null;
}

module.exports = {
  esNumero,
  detectarDistribuidora
};
