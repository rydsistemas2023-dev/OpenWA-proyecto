const axios = require("axios");

async function enviarTexto(destinatario, mensaje) {

  const url =
    `https://graph.facebook.com/v23.0/${process.env.META_PHONE_NUMBER_ID}/messages`;

  const body = {
    messaging_product: "whatsapp",
    to: destinatario,
    type: "text",
    text: {
      body: mensaje
    }
  };

  const headers = {
    Authorization:
      `Bearer ${process.env.META_ACCESS_TOKEN}`,
    "Content-Type":
      "application/json"
  };

  const response = await axios.post(
    url,
    body,
    { headers }
  );

  return response.data;
}

module.exports = {
  enviarTexto
};
