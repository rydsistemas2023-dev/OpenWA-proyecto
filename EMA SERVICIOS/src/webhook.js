const ESTADOS = require("./estados");
const { procesarMensaje } = require("./flujo");
const { descargarMediaDesdeMeta } = require("./metaMedia");
const { subirFotoAS3 } = require("./s3");
const { enviarTexto } = require("./metaSend");

const sesiones = {};

function obtenerSesion(telefono) {
  if (!sesiones[telefono]) {
    sesiones[telefono] = { telefono };
  }

  return sesiones[telefono];
}

function obtenerExtension(contentType) {
  if (contentType === "image/png") return "png";
  if (contentType === "image/webp") return "webp";
  if (contentType === "image/jpeg") return "jpg";
  return "jpg";
}

function limpiarNombreArchivo(valor) {
  return String(valor || "")
    .replace(/[\\/:*?"<>|]/g, "")
    .replace(/\s+/g, "_")
    .trim();
}

function generarNombreFoto(usuario, contentType) {
  const extension = obtenerExtension(contentType);

  const fecha = new Date()
    .toLocaleDateString("es-AR")
    .replace(/\//g, "-");

  const nombreBase = limpiarNombreArchivo(
    usuario.numeroMedidor || usuario.poliza || "SIN_MEDIDOR"
  );

  return `${nombreBase}(${fecha}).${extension}`;
}

async function recibirMensaje(payload) {
  const value = payload?.entry?.[0]?.changes?.[0]?.value;
  const message = value?.messages?.[0];

  if (!message) {
    return { ok: true, ignorado: true };
  }

  const numeroWhatsapp = message.from;
  const textoRecibido = message.text?.body || "";
  const mediaId = message.image?.id || null;
  const tieneFoto = Boolean(mediaId);

  const usuario = obtenerSesion(numeroWhatsapp);

  let linkFoto = "";

  if (tieneFoto && usuario.estado === ESTADOS.FOTO) {
    const media = await descargarMediaDesdeMeta(mediaId);

    linkFoto = await subirFotoAS3({
      buffer: media.buffer,
      nombreArchivo: generarNombreFoto(usuario, media.contentType),
      contentType: media.contentType
    });
  }

  const respuesta = await procesarMensaje(usuario, {
    texto: textoRecibido,
    tieneFoto,
    mediaId,
    linkFoto,
    fecha: new Date().toISOString()
  });

  if (respuesta?.respuesta) {
    await enviarTexto(numeroWhatsapp, respuesta.respuesta);
  }

  return {
    ok: true,
    telefono: numeroWhatsapp,
    respuesta
  };
}

module.exports = {
  recibirMensaje
};
