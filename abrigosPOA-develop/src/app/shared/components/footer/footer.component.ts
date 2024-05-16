import { Component } from '@angular/core'

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  public license: string = ''
  public logo = {
    url: '/assets/pref-poa.svg',
    description: 'Brasão de Porto Alegre',
  }
}
