async function enviarAPowerAutomate(datos) {
  const url = process.env.POWER_AUTOMATE_URL;

  if (!url) {
    throw new Error("Falta POWER_AUTOMATE_URL en variables de entorno");
  }

  const body = {
    POLIZA: datos.poliza || "",
    NRO_MEDIDOR: datos.numeroMedidor || "",
    ESTADO: datos.lectura || datos.estado || "",
    FOTOS: datos.linkFoto || ""
  };

  const respuesta = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  if (!respuesta.ok) {
    const error = await respuesta.text();
    throw new Error("Error enviando a Power Automate: " + error);
  }

  return await respuesta.text();
}

module.exports = {
  enviarAPowerAutomate
};
