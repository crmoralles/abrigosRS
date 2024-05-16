import { Injectable } from '@angular/core'
import { redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard'
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router'
import { Observable } from 'rxjs'
import { AUTH, HOME } from '../../shared/constants/routes.const'
import { AuthorizationService } from '../services/authorization.service'
import { AuthService } from '../services/repository/firebase/auth.service'

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private authorization: AuthorizationService,
    private authService: AuthService,
    private router: Router
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Promise<boolean | UrlTree>((res) => {
      this.authService.isAuthenticated$.subscribe((value) => {
        if (!value) {
          this.router.navigateByUrl('/login')
          res(false)
          return
        }

        this.authorization.loadDone$.subscribe((load) => {
          if (!load) return
          if (!this.authorization.userRole) {
            //this.router.navigateByUrl('/forbidden')
            res(this.router.parseUrl('/forbidden'))
            return
          }

          if (!route.data.role) {
            res(true)
            return
          }

          const allow = this.authorization.currentUserRole <= route.data.role
          if (!allow) {
            res(this.router.parseUrl('/forbidden'))
            return
          }
          res(true)
        })
      })
    })
  }
}

export const redirectUnauthorized = () => redirectUnauthorizedTo([AUTH])
export const redirectLogged = () => redirectLoggedInTo([HOME])
