import { Component, inject } from '@angular/core'
import { Analytics } from '@angular/fire/analytics'
import { DomSanitizer } from '@angular/platform-browser'
import { AuthService } from 'src/app/core/services/repository/firebase/auth.service'

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.scss'],
})
export class MapaComponent {
  private analytics: Analytics = inject(Analytics)

  public url

  constructor(
    private authService: AuthService,
    private sanitizer: DomSanitizer
  ) {}

  async ngOnInit() {
    const token = await this.authService.getToken()
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(`https://abrigars.com.br/?token=${token}`)
  }
}
