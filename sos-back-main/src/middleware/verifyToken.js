const jwt = require('jsonwebtoken');


const FirebaseManager = require("../config/settingsFirebase.js");
const envs = require("../config/envHLG.js");

const admin = FirebaseManager.admin;


const verifyFirebaseToken = async (req, res, next) => {
  try {
    const idToken = req.headers.authorization.split(" ")[1];

    if (!idToken) {
      return res.status(403).json({ error: "No token provided" });
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    console.log("Decoded token ===============: ", decodedToken);

    next();
  } catch (error) {
    console.log("Error verifying token:", error);

    if (error.errorInfo.code === "auth/id-token-expired") {
      return res.status(403).json({ error: "Token expired" });
    }

    return res.status(403).json({ error: "Invalid token" });
  }
};


const verifyJWTToken = async (req, res, next) => {

  try {
    const token = req.headers.authorization.split(" ")[1];
    
    if (!token) {
      return res.status(403).json({ error: "No token provided" });
    }

    const decodedToken = jwt.verify(token, envs.FIREBASE_SERVICE_ACCOUNT.private_key, { algorithms: ['RS256'] });
    console.log("Decoded token ===============: ", decodedToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(403).json({ error: "Token expired" });
    }
    return res.status(403).json({ error: "Invalid token" });
  }
};

module.exports = { verifyFirebaseToken, verifyJWTToken };
