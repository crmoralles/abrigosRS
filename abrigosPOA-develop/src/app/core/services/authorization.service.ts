import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { AuthService } from './repository/firebase/auth.service'
import { Params } from './repository/firebase/firestore.service'
import { User, UserService } from './repository/user.service'

@Injectable({
  providedIn: 'root',
})
export class AuthorizationService {
  public AUTHORIZATION_LEVEL_ADMINISTRADOR = 10
  public AUTHORIZATION_LEVEL_SUPORTE = 20
  public AUTHORIZATION_LEVEL_CONTROLADOR = 30
  public AUTHORIZATION_LEVEL_VOLUNTARIO = 40

  userRole: User
  currentUserRole: number

  public loadDone$ = new BehaviorSubject<boolean>(false)
  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {
    this.authService.isAuthenticated$.subscribe(async (isAuthencated) => {
      if (!isAuthencated) return
      const userId = this.authService.currentUser.uid
      this.userRole = await this.userService.getUserRole(userId)
      if (this.userRole) {
        this.currentUserRole = this.userRole.role
      }
      this.loadDone$.next(true)
    })
  }

  allow(level: number, condition: '==' | '!=' | '>=' | '<=' | '>' | '<' = '>='): Promise<boolean> {
    return new Promise((res, rej) => {
      this.loadDone$.subscribe((load) => {
        if (!load) return
        switch (condition) {
          case '==':
            res(level == this.userRole.role)
            break
          case '!=':
            res(level != this.userRole.role)
            break
          case '>=':
            res(level >= this.userRole.role)
            break
          case '<=':
            res(level <= this.userRole.role)
            break
          case '>':
            res(level > this.userRole.role)
            break
          case '<':
            res(level < this.userRole.role)
            break
        }
      })
    })
  }

  async getFiltroAcessarAbrigos() {
    let filtraAbrigoVinculado: Params = {}
    const podeAcessarTodosAbrigos = await this.allow(this.AUTHORIZATION_LEVEL_SUPORTE)
    if (
      !podeAcessarTodosAbrigos &&
      (this.userRole.abrigoId || (this.userRole.abrigos && this.userRole.abrigos.length))
    ) {
      if (this.userRole.abrigos?.length) {
        filtraAbrigoVinculado = {
          where: [{ key: 'id', condition: 'in', value: this.userRole.abrigos.map((abrigo) => abrigo.abrigoId) }],
        }
      } else filtraAbrigoVinculado = { where: [{ key: 'id', condition: '==', value: this.userRole.abrigoId }] }
    }
    return filtraAbrigoVinculado
  }

  async getFiltroAcessarMenor18() {
    let filtraAbrigadosMenor18: Params = null
    const podeAcessarMenor18 = await this.allow(this.AUTHORIZATION_LEVEL_CONTROLADOR)
    //TODO: Colocar calcula de idade no banco para poder fitrar na origem
    // if (!podeAcessarMenor18) {
    //   filtraAbrigadosMenor18 = { where: [{ key: 'id', condition: '==', value: this.userRole.abrigoId }] }
    // }
    // return filtraAbrigadosMenor18
    return podeAcessarMenor18
  }
}
