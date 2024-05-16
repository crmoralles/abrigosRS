const axios = require('axios');
const express = require('express');
const router = express.Router();

router.get("/:cep", async function (req, res, next) {
  try {
    const { cep } = req.params;
    const response = await axios.get(`https://GET_zip-to-address/?zip=${cep}`);
    const data = response.data;
    res.json(data);
  } catch (error) {
    const errorMessage = "Erro ao buscar CEP";
    console.error(errorMessage, ": ", error);
    res.status(500).json({ error: errorMessage });
  }
});

module.exports = router;
