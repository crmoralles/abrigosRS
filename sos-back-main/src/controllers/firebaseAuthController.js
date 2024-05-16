const {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithCustomToken,
} = require("firebase/auth");

const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');

const validations = require("../utils/validations.js");
const FirebaseManager = require("../config/settingsFirebase.js");


const envs = require("../config/envHLG.js");


class FirebaseAuthController {
  constructor() {
    this.validations = validations;
    this.firebaseManager = FirebaseManager
  }

  async signIn(req, res) {
    try {
      const { email, password } = req.body;
      if (
        !validations.isEmailValid(email) ||
        !validations.isPasswordValid(password)
      ) {
        return res.status(400).json({
          message: "Invalid email or password",
        });
      }

      const user = await signInWithEmailAndPassword(this.firebaseManager.auth, email, password);
      const idToken = await user.user.getIdToken();

      if (idToken) {
        res.cookie("access_token", idToken, {
          httpOnly: true,
        });

        const response = {
          message: "User logged in successfully",
          user: {
            uui: user.user.uid,
            email: user.user.email,
            token: user.user.stsTokenManager
          },
        };

        res
          .status(200)
          .json(response);
      }

    } catch (error) {
      if (error.code === "auth/user-not-found") {
        return res.status(404).json({ error: "User not found" });
      }

      if (error.code === "auth/wrong-password") {
        return res.status(401).json({ error: "Invalid password" });
      }

      if (error.code === "auth/invalid-credential") {
        return res.status(429).json({ error: "Too many requests" });
      }

      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async signOut(req, res) {
    try {
      await signOut(this.auth);
      res.clearCookie("access_token");
      res.status(200).json({ message: "User signed out successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async createCustomToken(req, res) {
    try {

      const { additionalClaims } = req.body;
      const uid = uuidv4();

      const tokenSign = jwt.sign({...additionalClaims }, envs.FIREBASE_SERVICE_ACCOUNT.private_key, {
        algorithm: 'RS256',
        jwtid: uid,
        mutatePayload: true,
        
      }) 

      res.status(200).json({ token: tokenSign });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

module.exports = new FirebaseAuthController();
