import { CommonModule } from '@angular/common'
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component'
import { CookiebarComponent } from './components/cookiebar/cookiebar.component'
import { FooterComponent } from './components/footer/footer.component'
import { HeaderComponent } from './components/header/header.component'
import { LoaderComponent } from './components/loader/loader.component'
import { MenuComponent } from './components/menu/menu.component'
import { MessageComponent } from './components/message/message.component'
import { TotalizadoresDashboardComponent } from './components/totalizadores-dashboard/totalizadores-dashboard.component'

import { CardTotalizerComponent } from './components/card-totalizer/card-totalizer.component'
import { CustomValueAccessorDirective } from './directives/custom-value-accessor.directive'
import { ModalDirective } from './directives/modal.directive'
import { FormaRolePipe } from './pipes/formatRole.pipe'
import { SimNaoPipe } from './pipes/sim-nao.pipe'
import { PaginationComponent } from './components/paginate/pagination.component'

@NgModule({
  imports: [CommonModule, BrowserModule],
  declarations: [
    FooterComponent,
    MenuComponent,
    HeaderComponent,
    BreadcrumbComponent,
    CookiebarComponent,
    MessageComponent,
    LoaderComponent,
    CustomValueAccessorDirective,
    SimNaoPipe,
    FormaRolePipe,
    CardTotalizerComponent,
    TotalizadoresDashboardComponent,
    ModalDirective,
    PaginationComponent,
  ],
  exports: [
    FooterComponent,
    MenuComponent,
    HeaderComponent,
    BreadcrumbComponent,
    CookiebarComponent,
    MessageComponent,
    LoaderComponent,
    CustomValueAccessorDirective,
    SimNaoPipe,
    FormaRolePipe,
    CardTotalizerComponent,
    TotalizadoresDashboardComponent,
    ModalDirective,
    PaginationComponent,
  ],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule {}
