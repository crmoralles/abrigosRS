import { AfterContentChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core'

import { environment } from 'src/environments/environment'
import { AuthorizationService } from './core/services/authorization.service'
import { AuthService } from './core/services/repository/firebase/auth.service'
import { LGDPTermsService } from './core/services/repository/lgdpTerms.service'
import { SharedService } from './core/services/shared.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, AfterContentChecked {
  // private appCheck: AppCheck = inject(AppCheck)

  public production = environment?.production
  isLogged!: boolean
  isLoading: boolean = false
  isLGDPAccept: boolean = false
  UID: string

  constructor(
    public sharedService: SharedService,
    private _authService: AuthService,
    private _LGPDService: LGDPTermsService,
    public _authorizationService: AuthorizationService,
    private _changeDetector: ChangeDetectorRef
  ) {
    _authService.isAuthenticated$.subscribe(() => (this.UID = _authService.currentUser?.uid))
  }

  ngOnInit(): void {
    this._authService.authStateChange()
    this._authService.isAuthenticated$.subscribe(async (value: boolean) => {
      if (value) {
        if (this._authService.currentUser) {
          const userId = this._authService.currentUser.uid
          this._LGPDService.signedNotify$.subscribe((signed) => {
            this.isLGDPAccept = signed
          })
          const signed = await this._LGPDService.getLGPDSigned(userId)
          this.isLGDPAccept = signed.length > 0
          this.isLogged = value
        }
      } else this.isLogged = value

      // TODO: Verificar o motivo do `authState` do firebase não completar o Observable
      setTimeout(() => (this.isLoading = false), 2000)
    })
  }

  ngAfterContentChecked(): void {
    this._changeDetector.detectChanges()
  }
}
