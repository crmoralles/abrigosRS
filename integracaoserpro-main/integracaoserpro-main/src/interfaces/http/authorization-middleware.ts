import { NextFunction, Response, Request } from "express";

import { FirebaseAuthorizationProvider } from "../providers/authorization/firebase-auth-provider";

const firebaseAuthProvider = new FirebaseAuthorizationProvider();

export const authenticateRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .send(
        "Formato inválido de token. Esperado: 'Bearer ${token}', no header 'authorization'"
      );
  }
  const token = authHeader.split(" ")[1];

  const isAuthorized = await firebaseAuthProvider.authorize(token);

  if (!isAuthorized) return res.status(403).send("Token expirado ou inválido.");

  next();
};
