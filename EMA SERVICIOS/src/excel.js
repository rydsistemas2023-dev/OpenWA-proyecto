async function guardarRegistro(datos) {
  const fila = {
    TURNO: datos.turno || "",
    POLIZA: datos.poliza || "",
    CLIENTE: datos.cliente || "",
    LOCALIDAD_RUTA: datos.localidadRuta || "",
    CALLE: datos.calle || "",
    NRO_MEDIDOR: datos.numeroMedidor || "",
    LECTURA_RECUPERADA: datos.lecturaRecuperada || "",
    FECHA_MENSAJE: datos.fechaMensaje || "",
    LECTURA: datos.lectura || "",
    INCIDENCIA: datos.incidencia || "",
    AVISO_AL_LECTURISTA: datos.avisoLecturista || "",
    "VER FOTO": datos.linkFoto ? "Ver Imagen" : "",
    LINK: datos.linkFoto || "",
    TELEFONO_WHATSAPP: datos.telefono || "",
    DISTRIBUIDORA: datos.distribuidora || ""
  };

  console.log("Registro preparado para Excel/SharePoint:");
  console.log(fila);

  return fila;
}

module.exports = {
  guardarRegistro
};
