import { Component, inject } from '@angular/core'
import { Analytics } from '@angular/fire/analytics'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { AuthEmailService } from 'src/app/core/services/repository/firebase/auth-email.service'
import { AuthService } from 'src/app/core/services/repository/firebase/auth.service'
import { HOME } from 'src/app/shared/constants/routes.const'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  public message: string
  public messageType: string
  public submitted: boolean = false
  public form: FormGroup

  public formRecovery: FormGroup

  private analytics: Analytics = inject(Analytics)
  isLogged!: boolean

  public formType: 'login' | 'recovery' = 'login'

  constructor(
    private _formBuilder: FormBuilder,
    private _authEmailService: AuthEmailService,
    private _router: Router,
    private _authService: AuthService
  ) {}

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      email: [null, Validators.required],
      password: [null, Validators.required],
    })

    this.formRecovery = this._formBuilder.group({
      email: [null, Validators.required],
    })

    this._authService.authStateChange()
    this._authService.isAuthenticated$.subscribe((value: boolean) => {
      this.isLogged = value
      this._router.navigate([HOME])
    })
  }

  showFormSubmitted(message: string, type: string): void {
    this.submitted = true
    this.message = message
    this.messageType = type
    setTimeout(() => (this.submitted = false), 10000)
  }

  changeFormType() {
    this.formType = this.formType === 'login' ? 'recovery' : 'login'
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.showFormSubmitted('Login inválido!', 'danger')
      return
    }

    try {
      const email = this.form.get('email')?.value?.trim()
      const password = this.form.get('password')?.value
      await this._authEmailService.doLogin(email, password)
      this._router.navigate([HOME])
    } catch (err) {
      console.error('LoginComponent->onSubmit()', err)
      this.showFormSubmitted(err.message, 'danger')
    }
  }

  async onRecovery(): Promise<void> {
    if (this.formRecovery.invalid) {
      this.showFormSubmitted('Email inválido!', 'danger')
      return
    }

    try {
      const email = this.formRecovery.get('email')?.value?.trim()
      await this._authEmailService.sendPasswordResetEmail(email)
      this.showFormSubmitted('Email enviado com sucesso!', 'success')
      this.formRecovery.reset()
    } catch (err) {
      this.showFormSubmitted('Email enviado com sucesso!', 'success')
      this.formRecovery.reset()
    }
  }
}
