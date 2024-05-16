import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { AuthGuard } from './core/guards/auth.guard'
import { AbrigadoFormV2Component } from './pages/abrigado-form-v2/abrigado-form-v2.component'
import { AbrigadosComponent } from './pages/abrigados/abrigados.component'
import { ForbiddenComponent } from './pages/forbidden/forbidden.component'
import { HomeComponent } from './pages/home/home.component'
import { LoginComponent } from './pages/login/login.component'
import { MapaComponent } from './pages/mapa/mapa.component'
import { UsersComponent } from './pages/users/users.component'
import { VagasFormComponent } from './pages/vagas-form/vagas-form.component'
import { ABRIGADO, ABRIGOS, AUTH, HOME, MAP, USUARIOS } from './shared/constants/routes.const'

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: AUTH,
    component: LoginComponent,
  },
  {
    path: HOME,
    component: HomeComponent,
    data: { breadCrumb: 'Página Inicial' },
    canActivate: [AuthGuard],
  },
  {
    path: `${ABRIGOS.BASE}/${ABRIGOS.ADD}`,
    component: VagasFormComponent,
    data: { breadCrumb: 'Gerenciar abrigos' },
    canActivate: [AuthGuard],
  },
  {
    path: `${ABRIGADO.BASE}/:abrigoId`,
    component: AbrigadoFormV2Component,
    data: { breadCrumb: 'Cadastrar abrigados' },
    canActivate: [AuthGuard],
  },
  {
    path: `${ABRIGADO.BASE}`,
    component: AbrigadoFormV2Component,
    data: { breadCrumb: 'Cadastrar abrigados' },
    canActivate: [AuthGuard],
  },
  {
    path: `${ABRIGADO.BASE}/:abrigoId/:abrigadoId`,
    component: AbrigadoFormV2Component,
    data: { breadCrumb: 'Editar abrigados' },
    canActivate: [AuthGuard],
  },
  {
    path: `${ABRIGADO.LIST}`,
    component: AbrigadosComponent,
    data: { breadCrumb: 'Lista de abrigados' },
    canActivate: [AuthGuard],
  },
  {
    path: USUARIOS,
    component: UsersComponent,
    data: { breadCrumb: 'Gerenciar usuários', role: 30 }, //Controladores
    canActivate: [AuthGuard],
    // ...canActivate(redirectUnauthorized),
  },
  {
    path: `${MAP}`,
    component: MapaComponent,
    data: { breadCrumb: 'Mapa de abrigos' },
    canActivate: [AuthGuard],
  },
  {
    path: `forbidden`,
    component: ForbiddenComponent,
    data: { breadCrumb: '' },
  },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
