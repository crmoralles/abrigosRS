import { Component, OnInit } from '@angular/core'
import { AuthorizationService } from 'src/app/core/services/authorization.service'
import { AuthService } from 'src/app/core/services/repository/firebase/auth.service'
import { LGDPTermsService, LGPDSignedTerms } from 'src/app/core/services/repository/lgdpTerms.service'
import { LGDP_TERMS } from 'src/app/shared/constants/collections.const'

@Component({
  selector: 'app-lgpd-terms',
  templateUrl: './lgpd-terms.component.html',
  styleUrls: ['./lgpd-terms.component.scss'],
})
export class LgpdTermsComponent implements OnInit {
  signedLGDP: LGPDSignedTerms = { userId: '' }
  userId: string

  constructor(
    private _LGPDService: LGDPTermsService,
    private _authService: AuthService,
    public _authorization: AuthorizationService
  ) {}

  async ngOnInit(): Promise<void> {
    this.userId = this._authService.currentUser.uid
    this.signedLGDP = await this._LGPDService.getLGPDSigned(this.userId)[0]
    if (!this.signedLGDP) this.signedLGDP = { userId: this.userId }
  }

  signed(term: LGDP_TERMS) {
    switch (term) {
      case LGDP_TERMS.LGDP_TERMS_DADOS:
        this.signedLGDP.signed_tratamento_dados = new Date()
        break
      case LGDP_TERMS.LGDP_TERMS_CONTROLADOR:
        this.signedLGDP.signed_usuaria_controlador = new Date()
        break
      case LGDP_TERMS.LGDP_TERMS_VOLUNTARIO:
        this.signedLGDP.signed_voluntario = new Date()
        break
    }

    let singDados = false
    let singControlador = false
    let singVoluntario = false

    if (this._authorization.currentUserRole == this._authorization.AUTHORIZATION_LEVEL_VOLUNTARIO) {
      if (this.signedLGDP.signed_voluntario) singVoluntario = true
    } else singVoluntario = true

    if (this._authorization.currentUserRole == this._authorization.AUTHORIZATION_LEVEL_CONTROLADOR) {
      if (this.signedLGDP.signed_usuaria_controlador) singControlador = true
    } else singControlador = true

    if (this.signedLGDP.signed_tratamento_dados) singDados = true

    if (singDados && singControlador && singVoluntario) {
      this.saveSigned()
    }
  }

  saveSigned() {
    const signed = {
      userId: this.userId,
    }
    this._LGPDService.signed(this.userId, this.signedLGDP)
  }
}
