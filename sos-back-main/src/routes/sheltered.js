const express = require("express");
const router = express.Router();

const {
  createData,
  listData,
  retrieveData,
  deleteData,
  updateData,
} = require("../controllers/crudFuncions");

const { verifyJWTToken } = require("../middleware/verifyToken.js");

function addShelteredEndPoints(router) {
  router.post("/abrigado", verifyJWTToken,  async function (req, res, next) {
    return createData(
      "abrigado", //collectionName
      "Abrigado cadastrado com sucesso", //successMessage
      "Erro ao cadastrar novo abrigado", //errorMessage
      req, res, next
    );
  });
  
  router.get("/abrigados", verifyJWTToken, async function (req, res, next) {
    return listData(
      "abrigado", //collectionName
      "Erro ao buscar todos os abrigados", //errorMessage
      req, res, next
    );
  });
  
  router.get("/abrigado/:id", verifyJWTToken, async function (req, res, next) {
    return retrieveData(
      "abrigado", //collectionName
      "Abrigado não encontrado", //notFoundMessage
      "Erro ao buscar abrigado por ID", //errorMessage
      req, res, next
    );
  });
  
  router.delete("/abrigado/:id", verifyJWTToken, async function (req, res, next) {
    return deleteData(
      "abrigado", //collectionName
      "Abrigado deletado com sucesso", //successMessage
      "Erro ao deletar abrigado", //errorMessage
      req, res, next
    );
  });
  
  router.put("/abrigado/:id", verifyJWTToken, async function (req, res, next) {
    return updateData(
      "abrigado", //collectionName
      "Abrigado atualizada com sucesso", //successMessage
      "Erro ao atualizar o abrigado", //errorMessage
      req, res, next
    );
  });

  return router
}

module.exports = addShelteredEndPoints;
