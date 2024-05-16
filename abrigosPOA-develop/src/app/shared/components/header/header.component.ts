import { Component } from '@angular/core'
import { AuthorizationService } from 'src/app/core/services/authorization.service'
import { AuthService } from 'src/app/core/services/repository/firebase/auth.service'
import { SharedService } from '../../../core/services/shared.service'

/**
 * Componente do cabeçalho da aplicação.
 */
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  public title: string = 'Gestão de abrigos'
  public subtitle: string = ''
  public signature: string = ''
  public image = {
    src: 'assets/imgs/logo.png',
    alt: 'Logo abriga RS',
  }

  userName: string = ''
  userRole: number
  constructor(
    public sharedService: SharedService,
    private _authService: AuthService,
    private authorization: AuthorizationService
  ) {
    this._authService.isAuthenticated$.subscribe(async (value: boolean) => {
      if (this._authService.currentUser) this.userName = this._authService.currentUser.email
      this.userRole = this.authorization.currentUserRole
    })
  }

  public links: any[] = [
    {
      name: 'Web Components',
      href: 'https://www.gov.br/ds/webcomponents',
      title: 'Web Components',
      target: '_blank',
    },
    {
      name: 'Padrão Digital de Governo',
      href: 'https://gov.br/ds',
      title: 'Padrão Digital de Governo',
      target: '_blank',
    },
  ]

  public functions: any[] = [
    {
      icon: 'code',
      name: 'Repositórios de Web Components',
      url: 'https://gitlab.com/govbr-ds/bibliotecas/wc',
      tooltipText: 'Contribua com os projetos de Web Components',
      tooltipPlace: 'bottom',
    },
    {
      icon: 'book',
      name: 'Wiki',
      url: 'https://gov.br/ds/wiki/',
      tooltipText: 'Conheça nossa Wiki',
      tooltipPlace: 'bottom',
    },
  ]

  public toggleMenu(): void {
    this.sharedService.isOpen = !this.sharedService.isOpen
  }

  public signOut(): void {
    this._authService.signOut()
  }
}
