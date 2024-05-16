import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Abrigado, AbrigadosService, HistoricoAbrigado } from 'src/app/core/services/repository/abrigados.service'
import { Abrigo, AbrigoService } from 'src/app/core/services/repository/abrigo.service'

@Component({
  selector: 'app-abrigado-checkout',
  templateUrl: './abrigado-checkout.component.html',
  styleUrls: ['./abrigado-checkout.component.scss'],
})
export class AbrigadoCheckoutComponent implements OnInit, OnChanges {
  @Input() show: boolean
  @Input() abrigado: Abrigado

  @Output() onClose = new EventEmitter<boolean>()

  newStatus: string
  selectedAbrigo: string
  form: FormGroup
  abrigosMapped: any

  submitted: boolean = false
  message: string
  messageType: string

  constructor(
    private abrigadoService: AbrigadosService,
    private _formBuilder: FormBuilder,
    private abrigosService: AbrigoService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.newStatus = null
    this.selectedAbrigo = null
    if (this.form) {
      this.form.reset()
      this.form.get('data').reset()
      this.form.get('hora').reset()
    }
  }

  async ngOnInit(): Promise<void> {
    this.form = this._formBuilder.group({
      data: [null, [Validators.required]],
      hora: [null, [Validators.required]],
      observacao: [null],
    })

    this.abrigosMapped = (await this.abrigosService.load()).map((abrigo: Abrigo) => ({
      value: abrigo.id,
      label: abrigo.nome,
      selected: false,
    }))
  }

  setStatus(status: string) {
    this.newStatus = status
  }

  onAbrigoChange(event) {
    const selectedItemValue = event.detail?.[0]?.value
    this.selectedAbrigo = selectedItemValue
  }

  private showFormSubmitted(message: string, type: string): void {
    this.submitted = true
    this.message = message
    this.messageType = type
    setTimeout(() => (this.submitted = false), 10000)
  }

  async closeModal(success) {
    if (success) {
      if (!this.newStatus) {
        this.showFormSubmitted('Precisa escolher uma ação para continuar!', 'danger')
        return
      }
      if (this.form.invalid) {
        this.form.markAllAsTouched()
        this.showFormSubmitted('Formulário inválido!', 'danger')
        return
      }
      const abrigoId = this.selectedAbrigo ? this.selectedAbrigo : null
      const data = this.form.value.data
      const hora = this.form.value.hora
      const dataHora = new Date(`${data} ${hora}`)
      const observacao = this.form.value.observacao

      this.abrigado.status = this.newStatus
      if (!this.abrigado.historico) this.abrigado.historico = []
      const historico: HistoricoAbrigado = {
        acao: this.newStatus,
        dataHora,
        observacao,
        transferidoParaAbrigoId: abrigoId,
        create_in: new Date(),
      }

      this.abrigado.historico.push(historico)
      this.abrigado = await this.abrigadoService.addOrUpdate(this.abrigado)
    }
    this.onClose.emit(success)
  }
}
