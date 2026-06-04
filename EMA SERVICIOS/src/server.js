require("dotenv").config();

const express = require("express");
const { recibirMensaje } = require("./webhook");

const app = express();

app.use(express.json());

app.get("/webhook", (req, res) => {

  const verifyToken =
    process.env.META_VERIFY_TOKEN;

  const mode =
    req.query["hub.mode"];

  const token =
    req.query["hub.verify_token"];

  const challenge =
    req.query["hub.challenge"];

  if (
    mode === "subscribe" &&
    token === verifyToken
  ) {

    return res.status(200)
      .send(challenge);

  }

  return res.sendStatus(403);

});

app.post("/webhook", async (req, res) => {

  try {

    await recibirMensaje(req.body);

    res.sendStatus(200);

  } catch (error) {

    console.error(error);

    res.sendStatus(500);

  }

});

const PORT =
  process.env.PORT || 3000;

app.listen(PORT, () => {

  console.log(
    `Servidor iniciado en puerto ${PORT}`
  );

});
