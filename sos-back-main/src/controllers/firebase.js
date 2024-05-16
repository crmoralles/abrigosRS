const NodeGeocoder = require("node-geocoder");

const FirebaseManager = require("../config/settingsFirebase.js");

class FirestoreCRUD {
  constructor() {
    this.db = FirebaseManager.fireStoreDB;
    this.firestore = FirebaseManager.admin.firestore();
  }

  async createDocument(collectionName, data) {
    try {
      const docRef = await this.firestore.collection(collectionName).add(data);
      console.log("Document written with ID: ", docRef.id);
      return docRef.id;
    } catch (error) {
      console.error("Error adding document: ", error);
      throw error;
    }
  }

  async updateDocument(collectionName, docId, newData) {
    try {
      const docRef = this.firestore.collection(collectionName).doc(docId);
      await docRef.update(newData);
      console.log("Document updated successfully");
    } catch (error) {
      console.error("Error updating document: ", error);
      throw error;
    }
  }

  async readCollection(collectionName, filters = {}) {
    try {
      let queryRef = this.firestore.collection(collectionName);

      Object.keys(filters).forEach((key) => {
        queryRef = queryRef.where(key, "==", filters[key]);
      });

      const querySnapshot = await queryRef.get();
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });

      return data;
    } catch (error) {
      console.error("Error getting documents: ", error);
      throw error;
    }
  }

  async getItemById(collectionName, itemId) {
    try {
      const docRef = this.firestore.collection(collectionName).doc(itemId);
      const docSnap = await docRef.get();

      if (docSnap.exists) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        console.error("No such document!");
        return null;
      }
    } catch (error) {
      console.error("Error getting document:", error);
      throw error;
    }
  }

  async deleteDocument(collectionName, docId) {
    try {
      const docRef = this.firestore.collection(collectionName).doc(docId);
      await docRef.delete();
      console.log("Document deleted successfully");
    } catch (error) {
      console.error("Error deleting document: ", error);
      throw error;
    }
  }

  async getCoordinates(address) {
    try {
      const options = {
        provider: "google",
        apiKey: "API_KEY",
      };

      const geocoder = NodeGeocoder(options);
      const res = await geocoder.geocode(address);
      return res;
    } catch (error) {
      console.error("Erro ao buscar dados do Firestore:", error);
      throw error;
    }
  }
}

module.exports = FirestoreCRUD;
