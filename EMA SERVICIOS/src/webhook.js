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

function obtenerExtension(contentType) {
  if (contentType === "image/png") return "png";
  if (contentType === "image/webp") return "webp";
  if (contentType === "image/jpeg") return "jpg";
  return "jpg";
}

function obtenerFechaArchivo() {
  return new Date()
    .toLocaleDateString("es-AR")
    .replace(/\//g, "-");
}

function limpiarNombreArchivo(valor) {
  return String(valor || "")
    .replace(/[\\/:*?"<>|]/g, "")
    .replace(/\s+/g, "_")
    .trim();
}

function generarNombreFoto(usuario, contentType) {
  const extension = obtenerExtension(contentType);
  const fecha = obtenerFechaArchivo();

  const numeroMedidor =
    usuario.numeroMedidor ||
    usuario.poliza ||
    "SIN_MEDIDOR";

  const nombreBase = limpiarNombreArchivo(numeroMedidor);

  return `${nombreBase}(${fecha}).${extension}`;
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

  const usuario = obtenerSesion(numeroWhatsapp);

  let linkFoto = "";

  if (tieneFoto) {
    const media = await descargarMediaDesdeMeta(mediaId);

    const nombreArchivo = generarNombreFoto(
      usuario,
      media.contentType
    );

    linkFoto = await subirFotoAS3({
      buffer: media.buffer,
      nombreArchivo,
      contentType: media.contentType
    });
  }

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
