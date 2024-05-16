const express = require("express");
const router = express.Router();

const { verifyJWTToken } = require("../middleware/verifyToken.js");


const FirebaseAuthController = require("../controllers/firebaseAuthController.js");

router.post("/signIn", async function (req, res, next) {
  await FirebaseAuthController.signIn(req, res);
});

router.post("/signOut", async function (req, res, next) {
  await FirebaseAuthController.signOut(req, res);
});


router.post("/generateToken", async function (req, res, next) {
  await FirebaseAuthController.createCustomToken(req, res);
});


module.exports = router;
