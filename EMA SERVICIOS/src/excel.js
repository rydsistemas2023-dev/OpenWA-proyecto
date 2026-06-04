const { enviarAPowerAutomate } = require("./powerautomate");

async function guardarRegistro(datos) {
  const fila = {
    poliza: datos.poliza || "",
    numeroMedidor: datos.numeroMedidor || "",
    estado: datos.lectura || datos.estado || "",
    linkFoto: datos.linkFoto || ""
  };

  console.log("Enviando registro a Power Automate:");
  console.log(fila);

  await enviarAPowerAutomate(fila);

  return fila;
}

module.exports = {
  guardarRegistro
};
