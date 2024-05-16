import { Injectable, inject } from '@angular/core'
import { Auth, AuthCredential, authState, deleteUser, signInWithCredential, signOut } from '@angular/fire/auth'
import { BehaviorSubject } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  protected auth: Auth = inject(Auth)
  private _authState$ = authState(this.auth)
  private static isInit = false
  private _isAuthenticated = new BehaviorSubject<boolean>(false)
  public isAuthenticated$ = this._isAuthenticated.asObservable()

  constructor() {}

  get currentUser() {
    return this.auth.currentUser
  }

  getToken() {
    return this.currentUser.getIdToken()
  }

  async getAuthorization() {
    const idToken = await this.getToken()
    return { Authorization: 'Bearer ' + idToken }
  }

  authStateChange(): void {
    if (AuthService.isInit) return
    AuthService.isInit = true

    this._authState$.subscribe((user) => this._isAuthenticated.next(!!user))
  }

  signInWithCredential(credential: AuthCredential) {
    return signInWithCredential(this.auth, credential)
  }

  deleteUser() {
    return deleteUser(this.currentUser)
  }

  signOut() {
    this._isAuthenticated.next(false)
    return Promise.all([signOut(this.auth)])
  }
}
