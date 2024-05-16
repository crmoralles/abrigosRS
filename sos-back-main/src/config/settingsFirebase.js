
const admin = require("firebase-admin");
const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");
const { getAuth } = require("firebase/auth");

const envs = require("../config/envHLG.js");

class FirebaseManager {
  constructor() {
    if (FirebaseManager.instance) {
      return FirebaseManager.instance;
    }

    const firebaseConfig = {
      apiKey: envs.FIREBASE_API_KEY,
      authDomain: envs.FIREBASE_AUTH_DOMAIN,
      databaseURL: envs.FIREBASE_DATABASE_URL,
      projectId: envs.FIREBASE_PROJECT_ID,
      storageBucket: envs.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: envs.FIREBASE_MESSAGING_SENDER_ID,
      appId: envs.FIREBASE_APP_ID,
    };

    this.firebaseApp = initializeApp(firebaseConfig);
    this.admin = admin.initializeApp({
      credential: admin.credential.cert(envs.FIREBASE_SERVICE_ACCOUNT),
      databaseURL: envs.FIREBASE_DATABASE_URL,
    });
    this.auth = getAuth();
    this.fireStoreDB = getFirestore();

    FirebaseManager.instance = this;
  }
}

module.exports = new FirebaseManager();