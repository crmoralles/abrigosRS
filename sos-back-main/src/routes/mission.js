const express = require("express");
const router = express.Router();

const {
  createData,
  listData,
  retrieveData,
  deleteData,
  updateData,
} = require("../controllers/crudFuncions");

const { verifyFirebaseToken } = require("../middleware/verifyToken.js");

function addMissionEndPoints(router) {
  router.post("/missao", verifyFirebaseToken,  async function (req, res, next) {
    return createData(
      "missao", //collectionName
      "Missão criada com sucesso", //successMessage
      "Erro ao criar nova missão", //errorMessage
      req,
      res,
      next
    );
  });
  
  router.get("/missoes", verifyFirebaseToken, async function (req, res, next) {
    return listData(
      "missao", //collectionName
      "Erro ao buscar todas as missões", //errorMessage
      req,
      res,
      next
    );
  });
  
  router.get("/missao/:id", verifyFirebaseToken, async function (req, res, next) {
    return retrieveData(
      "missao", //collectionName
      "Missão não encontrado", //notFoundMessage
      "Erro ao buscar missão por ID", //errorMessage
      req,
      res,
      next
    );
  });
  
  router.delete("/missao/:id", verifyFirebaseToken, async function (req, res, next) {
    return deleteData(
      "missao", //collectionName
      "Missão deletada com sucesso", //successMessage
      "Erro ao deletar missão", //errorMessage
      req,
      res,
      next
    );
  });
  
  router.put("/missao/:id", verifyFirebaseToken, async function (req, res, next) {
    return updateData(
      "missao", //collectionName
      "Missão atualizada com sucesso", //successMessage
      "Erro ao atualizar a missão", //errorMessage
      req,
      res,
      next
    );
  });

  return router;
}

module.exports = addMissionEndPoints;
