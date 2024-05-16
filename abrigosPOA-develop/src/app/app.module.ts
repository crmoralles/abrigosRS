import { HttpClient, HttpClientModule } from '@angular/common/http'
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, SecurityContext, isDevMode } from '@angular/core'
import { getAnalytics, provideAnalytics } from '@angular/fire/analytics'
import { getApp, initializeApp, provideFirebaseApp } from '@angular/fire/app'
import { getAuth, provideAuth } from '@angular/fire/auth'
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  provideFirestore,
} from '@angular/fire/firestore'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { BrowserModule } from '@angular/platform-browser'
import { ServiceWorkerModule } from '@angular/service-worker'
import { MarkdownModule, MarkedOptions } from 'ngx-markdown'

import { environment } from 'src/environments/environment'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { AbrigadoFormV2Component } from './pages/abrigado-form-v2/abrigado-form-v2.component'
import { AbrigadoFormComponent } from './pages/abrigado-form/abrigado-form.component'
import { AbrigadoCheckoutComponent } from './pages/abrigados/abrigado-checkout/abrigado-checkout.component'
import { AbrigadosComponent } from './pages/abrigados/abrigados.component'
import { ForbiddenComponent } from './pages/forbidden/forbidden.component'
import { HomeComponent } from './pages/home/home.component'
import { LgpdTermsComponent } from './pages/lgpd-terms/lgpd-terms.component'
import { LoginComponent } from './pages/login/login.component'
import { MapaComponent } from './pages/mapa/mapa.component'
import { SignInComponent } from './pages/sign-in/sign-in.component'
import { UsersComponent } from './pages/users/users.component'
import { VagasFormComponent } from './pages/vagas-form/vagas-form.component'
import { AuthorizationDirective } from './shared/directives/authorization.directive'
import { SharedModule } from './shared/shared.module'

@NgModule({
  declarations: [
    AppComponent,
    UsersComponent,
    SignInComponent,
    VagasFormComponent,
    LoginComponent,
    HomeComponent,
    AbrigadoFormComponent,
    AbrigadosComponent,
    MapaComponent,
    AbrigadoFormV2Component,
    LgpdTermsComponent,
    AuthorizationDirective,
    ForbiddenComponent,
    AbrigadoCheckoutComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => {
      return initializeFirestore(getApp(), {
        localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
      })
    }),
    provideAnalytics(() => getAnalytics()),
    // provideAppCheck(() =>
    //   initializeAppCheck(getApp(), {
    //     provider: new ReCaptchaV3Provider(environment.appCheck),
    //   })
    // ),
    MarkdownModule.forRoot({
      loader: HttpClient,
      markedOptions: {
        provide: MarkedOptions,
        useValue: {
          breaks: true,
          smartLists: true,
          smartypants: true,
          tables: true,
        },
      },
      sanitize: SecurityContext.NONE,
    }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
