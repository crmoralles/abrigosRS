import { Injectable } from '@angular/core'
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updateEmail,
  updatePassword,
} from '@angular/fire/auth'
import { AuthError } from 'src/app/shared/errors/auth-error'
import { AuthService } from './auth.service'

@Injectable({
  providedIn: 'root',
})
export class AuthEmailService extends AuthService {
  constructor() {
    super()
  }

  async doRegister(email: string, password: string) {
    try {
      const result = await createUserWithEmailAndPassword(this.auth, email, password)

      return result?.user
    } catch (err) {
      throw new AuthError(err)
    }
  }

  async doLogin(email: string, password: string) {
    try {
      const result = await signInWithEmailAndPassword(this.auth, email, password)

      return result?.user
    } catch (err) {
      throw new AuthError(err)
    }
  }

  async updateEmail(newEmail: string) {
    try {
      await updateEmail(this.currentUser, newEmail)

      return true
    } catch (err) {
      throw new AuthError(err)
    }
  }

  async updatePassword(newPassword: string) {
    try {
      await updatePassword(this.currentUser, newPassword)

      return true
    } catch (err) {
      throw new AuthError(err)
    }
  }

  async sendPasswordResetEmail(email: string) {
    try {
      await sendPasswordResetEmail(this.auth, email)

      return true
    } catch (err) {
      throw new AuthError(err)
    }
  }
}
