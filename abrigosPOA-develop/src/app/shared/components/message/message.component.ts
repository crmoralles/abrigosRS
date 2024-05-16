import { Component, Input } from '@angular/core'
import { AbstractControl } from '@angular/forms'

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
})
export class MessageComponent {
  /**
   * O controle associado ao campo de formulário.
   */
  @Input() control: AbstractControl

  /**
   * O erro específico relacionado ao campo de formulário.
   */
  @Input() error: string

  /**
   * A mensagem genérica relacionada ao campo de formulário.
   */
  @Input() message: string
}
