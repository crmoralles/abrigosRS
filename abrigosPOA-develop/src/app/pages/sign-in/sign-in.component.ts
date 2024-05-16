import { Component } from '@angular/core'

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent {
  isLogged: boolean = false
  userMenuVisible: boolean = false

  toggleSignIn(): void {
    console.info(`Fazendo o ${this.isLogged ? 'logout' : 'login'}`)
    this.isLogged = !this.isLogged
    this.userMenuVisible = false
  }

  toggleFunctionality(event: any): void {
    console.info(`Você clicou na ${event.target.textContent}`)
  }
}
