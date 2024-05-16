const FirestoreCRUD = require("./firebase");

const firestoreCRUD = new FirestoreCRUD();

async function createData(collectionName, successMessage, errorMessage, req, res, next){
  try {
    const data = req.body;
    const id = await firestoreCRUD.createDocument(collectionName, data);

    return res.json({ message: successMessage, id: id });
  } catch (error) {
    console.error(errorMessage, ": ", error);
    res.status(500).json({ error: errorMessage });
  }
}

async function listData(collectionName, errorMessage, req, res, next) {
  try {
    const filters = { ...req.query };
    const response = await firestoreCRUD.readCollection(collectionName, filters);

    return res.json(response);
  } catch (error) {
    console.error(errorMessage, ": ", error);
    res.status(500).json({ error: errorMessage });
  }
}

async function retrieveData(collectionName, notFoundMessage, errorMessage, req, res, next){
  try {
    const { id } = req.params;
    const response = await firestoreCRUD.getItemById(collectionName, id);

    if (!response) {
      return res.status(404).json({ error: notFoundMessage });
    }

    return res.json(response);
  } catch (error) {
    console.error(errorMessage, ": ", error);
    res.status(500).json({ error: errorMessage });
  }
}

async function deleteData(collectionName, successMessage, errorMessage, req, res, next){
  try {
    const { id } = req.params;
    await firestoreCRUD.deleteDocument(collectionName, id);

    return res.json({ message: successMessage });
  } catch (error) {
    console.error(errorMessage, ": ", error);
    res.status(500).json({ error: errorMessage });
  }
}

async function updateData(collectionName, successMessage, errorMessage, req, res, next){
  try {
    const { id } = req.params;
    const data = req.body;
    await firestoreCRUD.updateDocument(collectionName, id, data);

    return res.json({ message: successMessage });
  } catch (error) {
    console.error(errorMessage, ": ", error);
    res.status(500).json({ error: errorMessage });
  }
}

module.exports = { createData, listData, retrieveData, deleteData, updateData};