async function descargarMediaDesdeMeta(mediaId) {
  const token = process.env.META_ACCESS_TOKEN;

  if (!token) {
    throw new Error("Falta META_ACCESS_TOKEN");
  }

  const infoResponse = await fetch(
    `https://graph.facebook.com/v23.0/${mediaId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  if (!infoResponse.ok) {
    throw new Error("No se pudo obtener la URL del archivo de Meta");
  }

  const info = await infoResponse.json();

  const fileResponse = await fetch(info.url, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!fileResponse.ok) {
    throw new Error("No se pudo descargar la foto desde Meta");
  }

  const arrayBuffer = await fileResponse.arrayBuffer();

  return {
    buffer: Buffer.from(arrayBuffer),
    contentType: info.mime_type || "image/jpeg"
  };
}

module.exports = {
  descargarMediaDesdeMeta
};
