
const {
  createData,
  listData,
  retrieveData,
  deleteData,
  updateData,
} = require("../controllers/crudFuncions");

const { verifyJWTToken } = require("../middleware/verifyToken.js");

function addShelterEndPoints(router) {  
  router.get("/abrigos", verifyJWTToken, async function (req, res, next) {
    return listData(
      "abrigo", //collectionName
      "Erro ao buscar todos os abrigos", //errorMessage
      req, res, next
    );
  });
  
  router.get("/abrigo/:id", verifyJWTToken, async function (req, res, next) {
    return retrieveData(
      "abrigo", //collectionName
      "Abrigo não encontrado", //notFoundMessage
      "Erro ao buscar abrigo por ID", //errorMessage
      req, res, next
    );
  });

  router.post("/abrigo", verifyJWTToken, async function (req, res, next) {
    return createData(
      "abrigo", //collectionName
      "Abrigo criado com sucesso", //successMessage
      "Erro ao criar novo abrigo", //errorMessage
      req, res, next
    );
  });
  
  router.delete("/abrigo/:id", verifyJWTToken, async function (req, res, next) {
    return deleteData(
      "abrigo", //collectionName
      "Abrigo deletado com sucesso", //successMessage
      "Erro ao deletar abrigo", //errorMessage
      req, res, next
    );
  });
  
  router.put("/abrigo/:id", verifyJWTToken, async function (req, res, next) {
    return updateData(
      "abrigo", //collectionName
      "Abrigo atualizada com sucesso", //successMessage
      "Erro ao atualizar o abrigo", //errorMessage
      req, res, next
    );
  });

  return router
}

module.exports = addShelterEndPoints;
