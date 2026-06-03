const ESTADOS = require("./estados");
const {
  esNumero,
  detectarDistribuidora,
  extraerLecturaYMedidor
} = require("./validaciones");

const { guardarRegistro } = require("./excel");

function mensajeBienvenida() {
  return (
    "Estimado/a, le escribe EMA Servicios S.A., empresa autorizada para la verificación y toma de estado de medidores domiciliarios.\n\n" +
    "Para avanzar con el proceso de validación, por favor indique a qué servicio corresponde la lectura:\n\n" +
    "1 - Edenor\n" +
    "2 - Naturgy\n\n" +
    "También puede responder escribiendo Edenor o Naturgy."
  );
}

function mensajePedidoPoliza() {
  return (
    "Por favor, indique el número de póliza, tal como figura en su factura de servicio.\n\n" +
    "El número de póliza debe contener solo números."
  );
}

function mensajePedidoFotoODatos() {
  return (
    "A continuación, por favor envíe una fotografía del medidor en la cual se visualice de manera nítida:\n\n" +
    "- Número de medidor\n" +
    "- Lectura actual del visor\n\n" +
    "Si no puede enviar la foto, indique por mensaje el número de medidor y la lectura actual."
  );
}

function mensajeConfirmacion(distribuidora) {
  return (
    "Estimado/a, le escribe EMA Servicios S.A., empresa autorizada por " +
    distribuidora +
    " para realizar la verificación y toma de estado de medidores.\n\n" +
    "Hemos recibido su lectura ✅\n\n" +
    "La información será enviada a " +
    distribuidora +
    " para su revisión.\n\n" +
    "Muchas gracias."
  );
}

async function procesarMensaje(usuario, mensaje) {
  if (!usuario.estado) {
    usuario.estado = ESTADOS.INICIO;
  }

  const texto = typeof mensaje === "string" ? mensaje : mensaje.texto || "";
  const tieneFoto = typeof mensaje === "object" && mensaje.tieneFoto;
  const linkFoto = typeof mensaje === "object" ? mensaje.linkFoto || "" : "";
  const fecha = typeof mensaje === "object" ? mensaje.fecha || "" : "";

  switch (usuario.estado) {
    case ESTADOS.INICIO:
      usuario.estado = ESTADOS.DISTRIBUIDORA;

      return {
        nuevoEstado: ESTADOS.DISTRIBUIDORA,
        respuesta: mensajeBienvenida()
      };

    case ESTADOS.DISTRIBUIDORA: {
      const distribuidora = detectarDistribuidora(texto);

      if (!distribuidora) {
        return {
          nuevoEstado: ESTADOS.DISTRIBUIDORA,
          respuesta:
            "No pude identificar la distribuidora. Por favor responda 1 para Edenor o 2 para Naturgy."
        };
      }

      usuario.distribuidora = distribuidora;
      usuario.estado = ESTADOS.POLIZA;

      return {
        nuevoEstado: ESTADOS.POLIZA,
        respuesta: mensajePedidoPoliza()
      };
    }

    case ESTADOS.POLIZA:
      if (!esNumero(texto)) {
        return {
          nuevoEstado: ESTADOS.POLIZA,
          respuesta:
            "La póliza ingresada no es válida. Por favor envíe solo números, sin letras, espacios ni símbolos."
        };
      }

      usuario.poliza = String(texto).trim();
      usuario.estado = ESTADOS.FOTO;

      return {
        nuevoEstado: ESTADOS.FOTO,
        respuesta: mensajePedidoFotoODatos()
      };

    case ESTADOS.FOTO:
      usuario.fechaMensaje = fecha;

      if (tieneFoto) {
        usuario.linkFoto = linkFoto;
        usuario.lecturaRecuperada = "Lectura cliente recibida por WhatsApp con foto";
        usuario.estado = ESTADOS.COMPLETADO;

        await guardarRegistro(usuario);

        return {
          nuevoEstado: ESTADOS.COMPLETADO,
          respuesta: mensajeConfirmacion(usuario.distribuidora),
          finalizado: true
        };
      }

      const datos = extraerLecturaYMedidor(texto);

      if (!datos.numeroMedidor || !datos.lectura) {
        return {
          nuevoEstado: ESTADOS.FOTO,
          respuesta:
            "Para continuar necesito que envíe una foto clara del medidor, o escriba en dos líneas:\n\n" +
            "1) Número de medidor\n" +
            "2) Lectura actual"
        };
      }

      usuario.numeroMedidor = datos.numeroMedidor;
      usuario.lectura = datos.lectura;
      usuario.lecturaRecuperada = "Lectura cliente: " + datos.lectura;
      usuario.estado = ESTADOS.COMPLETADO;

      await guardarRegistro(usuario);

      return {
        nuevoEstado: ESTADOS.COMPLETADO,
        respuesta: mensajeConfirmacion(usuario.distribuidora),
        finalizado: true
      };

    default:
      return {
        nuevoEstado: usuario.estado,
        respuesta: "La solicitud ya fue registrada. Muchas gracias."
      };
  }
}

module.exports = {
  procesarMensaje
};
