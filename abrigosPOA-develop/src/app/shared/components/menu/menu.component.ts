import { Component } from '@angular/core'
import { Router } from '@angular/router'
import { SharedService } from '../../../core/services/shared.service'
import { MAP } from '../../constants/routes.const'

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent {
  public id: string = 'main-navigation'

  constructor(
    private router: Router,
    public sharedService: SharedService
  ) {}

  get showMenu() {
    return window.innerWidth > 580
  }

  public menuItems: any[] = [
    {
      id: 1,
      icon: 'home',
      name: 'Página Inicial',
      url: '/',
      isSpaLinkBehavior: true,
      level: 10,
    },
    {
      id: 2,
      icon: 'users-cog',
      name: 'Mapa de abrigos',
      url: `/${MAP}`,
      isSpaLinkBehavior: true,
      level: 20,
    },
    {
      id: 3,
      icon: 'users-cog',
      name: 'Gerenciar abrigos',
      url: '/abrigo/add',
      isSpaLinkBehavior: true,
      level: 10,
    },
    {
      id: 4,
      icon: 'users-cog',
      name: 'Lista de abrigados',
      url: '/abrigados',
      isSpaLinkBehavior: true,
    },
    {
      id: 6,
      icon: 'users-cog',
      name: 'Gerenciar usuários ',
      url: '/usuarios',
      isSpaLinkBehavior: true,
    },
    {
      id: 5,
      icon: 'users-cog',
      name: 'Ajuda',
      url: 'https://abrigospoa.agidesk.com/br/formulario/2?app_token=66379c93b658c_FR2&embed',
    },
  ]

  navigate(route: any) {
    if (window.innerWidth < 580) {
      this.sharedService.isOpen = false
    }

    const { detail: pathRouter } = route

    if (typeof pathRouter === 'string' && pathRouter.includes('https')) {
      const newWindow = window.open(pathRouter, '_blank')
      if (newWindow) {
        newWindow.focus()
      } else {
        console.error('Não foi possível abrir a URL em uma nova aba. Verifique as permissões do navegador.')
      }
    } else {
      this.router.navigate(pathRouter)
    }
  }
}
