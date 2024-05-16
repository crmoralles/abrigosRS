import admin from "firebase-admin";

import { AuthorizationProvider } from "./authorization-provider";

export class FirebaseAuthorizationProvider implements AuthorizationProvider {
  private auth;

  constructor() {
    this.auth = admin
      .initializeApp({
        credential: admin.credential.cert(
          require("../../../../firebase-cert.json")
        ),
        databaseURL: process.env.FIREBASE_DATABASE_URL,
      })
      .auth();
  }

  async authorize(token: string) {
    try {
      await this.auth.verifyIdToken(token);

      return true;
    } catch (err: any) {
      if (err.errorInfo.code === "auth/id-token-expired") {
        return false;
      }

      console.error(err);
      return false;
    }
  }
}
