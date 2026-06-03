const ESTADOS = require("./estados");
const {
  esNumero,
  detectarDistribuidora
} = require("./validaciones");

function procesarMensaje(usuario, mensaje) {

  switch (usuario.estado) {

    case ESTADOS.INICIO:

      return {
        nuevoEstado: ESTADOS.DISTRIBUIDORA,
        respuesta:
          "Indique distribuidora:\n\n1 - Edenor\n2 - Naturgy"
      };

    case ESTADOS.DISTRIBUIDORA:

      const distribuidora =
        detectarDistribuidora(mensaje);

      if (!distribuidora) {

        return {
          nuevoEstado: ESTADOS.DISTRIBUIDORA,
          respuesta:
            "No pude identificar la distribuidora. Escriba Edenor o Naturgy."
        };

      }

      return {
        nuevoEstado: ESTADOS.POLIZA,
        respuesta:
          "Ingrese número de póliza."
      };

    case ESTADOS.POLIZA:

      if (!esNumero(mensaje)) {

        return {
          nuevoEstado: ESTADOS.POLIZA,
          respuesta:
            "La póliza debe contener únicamente números."
        };

      }

      return {
        nuevoEstado: ESTADOS.MEDIDOR,
        respuesta:
          "Ingrese número de medidor o envíe una foto."
      };

    default:

      return {
        nuevoEstado: usuario.estado,
        respuesta:
          "Estado no implementado."
      };

  }

}

module.exports = {
  procesarMensaje
};
