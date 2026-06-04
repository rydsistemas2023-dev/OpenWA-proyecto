const { procesarMensaje } = require("./flujo");
const { descargarMediaDesdeMeta } = require("./metaMedia");
const { subirFotoAS3 } = require("./s3");

const sesiones = {};

function obtenerSesion(telefono) {
  if (!sesiones[telefono]) {
    sesiones[telefono] = {
      telefono
    };
  }

  return sesiones[telefono];
}

async function recibirMensaje(payload) {
  const value = payload?.entry?.[0]?.changes?.[0]?.value;
  const message = value?.messages?.[0];

  if (!message) {
    return {
      ok: true,
      ignorado: true,
      motivo: "Payload sin mensaje"
    };
  }

  const numeroWhatsapp = message.from;
  const textoRecibido = message.text?.body || "";
  const mediaId = message.image?.id || null;
  const tieneFoto = Boolean(mediaId);

  let linkFoto = "";

  if (tieneFoto) {
    const media = await descargarMediaDesdeMeta(mediaId);

    linkFoto = await subirFotoAS3({
      buffer: media.buffer,
      nombreArchivo: `${numeroWhatsapp}-${Date.now()}.jpg`,
      contentType: media.contentType
    });
  }

  const usuario = obtenerSesion(numeroWhatsapp);

  const mensaje = {
    texto: textoRecibido,
    tieneFoto,
    mediaId,
    linkFoto,
    fecha: new Date().toISOString()
  };

  const respuesta = await procesarMensaje(usuario, mensaje);

  return {
    ok: true,
    telefono: numeroWhatsapp,
    respuesta
  };
}

module.exports = {
  recibirMensaje
};
