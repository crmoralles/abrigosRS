import { Pipe, PipeTransform } from '@angular/core'
import { AuthorizationService } from 'src/app/core/services/authorization.service'

@Pipe({
  name: 'formatRole',
})
export class FormaRolePipe implements PipeTransform {
  constructor(private authorizationService: AuthorizationService) {}
  transform(value: number): string {
    switch (value) {
      case this.authorizationService.AUTHORIZATION_LEVEL_ADMINISTRADOR:
        return 'Administrador'
      case this.authorizationService.AUTHORIZATION_LEVEL_SUPORTE:
        return 'Suporte'
      case this.authorizationService.AUTHORIZATION_LEVEL_CONTROLADOR:
        return 'Controlador'
      case this.authorizationService.AUTHORIZATION_LEVEL_VOLUNTARIO:
        return 'Voluntário'
    }

    return 'Desconhecido'
  }
}
