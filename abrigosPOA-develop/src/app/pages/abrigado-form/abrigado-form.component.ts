import { HttpClient } from '@angular/common/http'
import { Component, OnInit, inject } from '@angular/core'
import { Analytics } from '@angular/fire/analytics'
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'
import { BehaviorSubject } from 'rxjs'
import { Abrigado, AbrigadosService } from 'src/app/core/services/repository/abrigados.service'
import { Abrigo, AbrigoService } from 'src/app/core/services/repository/abrigo.service'

@Component({
  selector: 'app-abrigado-form',
  templateUrl: './abrigado-form.component.html',
  styleUrls: ['./abrigado-form.component.scss'],
})
export class AbrigadoFormComponent implements OnInit {
  public form!: FormGroup
  public message?: string
  public messageType?: string
  public submitted = false
  public abrigo!: Abrigo
  public infosAbrigo!: string[]
  public abrigadoId: string = ''
  public abrigados: Abrigado[] = []
  public abrigado: any = {}

  private _abrigoId: string = ''

  private analytics: Analytics = inject(Analytics)

  searchCPF = new BehaviorSubject(false)
  cpfError = new BehaviorSubject(false)

  get menores(): FormArray {
    return this.form.get('menor') as FormArray
  }

  public optionsHousingSituation = [
    {
      value: 'Destruída',
      label: 'Destruída',
      selected: false,
    },
    {
      value: 'Inundada',
      label: 'Inundada',
      selected: false,
    },
    {
      value: 'Sem danos',
      label: 'Sem danos',
      selected: false,
    },
  ]

  constructor(
    private _formBuilder: FormBuilder,
    private _route: ActivatedRoute,
    private _abrigadosService: AbrigadosService,
    private _abrigoService: AbrigoService,
    private _http: HttpClient
  ) {
    this._abrigoId = this._route.snapshot?.params?.abrigoId
  }

  async ngOnInit(): Promise<void> {
    this._initForm()
    this._initRules()
    this._getAbrigo()
    this.getAbrigado()
  }

  private async getAbrigado() {
    this.abrigadoId = this._route.snapshot?.params?.abrigadoId
    if (this.abrigadoId) {
      this.abrigados = await this._abrigadosService.load()
      if (this.abrigados.length > 0) {
        for (let i = 0; i < this.abrigados.length; i++) {
          if (this.abrigadoId === this.abrigados[i].id) {
            this.abrigado = this.abrigados[i]

            if (this.abrigado.menor) {
              this.menores.clear()
              this.abrigado.menor.forEach((menorAdd) => {
                const menor = this._formBuilder.group({
                  nome: menorAdd.nome,
                  grauParentesco: menorAdd.grauParentesco,
                  dataNascimento: menorAdd.dataNascimento,
                })

                this.menores.push(menor)
              })
            }
          }
        }
      }
    }
  }

  private _initForm(): void {
    this.form = this._formBuilder.group({
      nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      dataNascimento: [null],
      endereco: [''],
      temDocumento: [null],
      grupoFamiliar: [false],
      acompanhadoMenor: [false],
      menor: this._formBuilder.array([]),
      temRenda: [false],
      renda: [null],
      temHabitacao: [false],
      situacaoMoradia: [null],
      necessidadesImediatas: [null],
      cadastradoCadUnico: [false],
      cpf: [null],
      rg: [null],
      cep: [null],
      codCadUnico: [null],
      cidade: [null],
    })
  }

  private _initRules(): void {
    this.form.get('acompanhadoMenor')?.valueChanges?.subscribe((value: boolean) => {
      if (value && this.menores.length <= 0) {
        this.addMenor()
      }
    })
  }

  private async _getAbrigo(): Promise<void> {
    this.abrigo = await this._abrigoService.get(this._abrigoId)
    this.infosAbrigo = [this.abrigo.nome, this.abrigo.address]
  }

  buscarEnderecoPorCep(cep: string) {
    const cepNumerico = cep.replace(/\D/g, '')

    this._http.get<any>(`https://viacep.com.br/ws/${cepNumerico}/json/`).subscribe(
      (data) => {
        this.form.patchValue({
          endereco: this.formatarEndereco(data),
          cidade: data.localidade,
        })
      },
      (error) => {
        console.error('Erro ao buscar endereço:', error)
      }
    )
  }

  formatarEndereco(data: any): string {
    if (data.erro) return ''
    return `${data.logradouro}, ${data.complemento ? data.complemento + ', ' : ''}${data.bairro}, ${data.localidade} - ${data.uf}, CEP: ${data.cep}`
  }

  showFormSubmitted(message: string, type: string): void {
    this.submitted = true
    this.message = message
    this.messageType = type
    setTimeout(() => (this.submitted = false), 10000)
  }

  addMenor(): void {
    const menor = this._formBuilder.group({
      nome: [''],
      grauParentesco: [''],
      dataNascimento: [''],
    })

    this.menores.push(menor)
  }

  removeMenor(index: number): void {
    this.menores.removeAt(index)
  }

  housingSituationChange(event: any): void {
    const value = event.detail?.[0]?.value
    this.form.get('situacaoMoradia')?.setValue(value)
  }

  getMinorsName(index): string {
    return this.menores?.at(index)?.get('nome')?.value || 'Dados do menor'
  }

  getStateFromField(controlName: string): string {
    const control = this.form.get(controlName)
    if (control?.invalid && control?.touched) {
      return 'danger'
    }
    if (control?.valid) {
      return 'success'
    }
    return 'light'
  }

  changeSelect(event: any, name: string): void {
    const value = event.detail?.[0]?.value
    this.form.get(name)?.setValue(value)
  }

  async checkCPF() {
    const cpfField = this.form.get('cpf')
    const cpf: string = Array.isArray(cpfField.value) ? cpfField.value[0] : cpfField.value
    let abrigados = []
    if (cpf?.length > 0) {
      this.searchCPF.next(true)
      abrigados = await this._abrigadosService.getAbrigadoByCPF(cpf)
    }
    if (abrigados.length > 0) {
      cpfField.setErrors({ alreadyRegistered: true })
    } else {
      cpfField.setErrors(null)
    }
    this.cpfError.next(cpfField.getError('alreadyRegistered'))
    this.searchCPF.next(false)
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched()
      this.showFormSubmitted('Formulário inválido!', 'danger')
      return
    }

    try {
      this.submitted = true

      if (this.form.get('acompanhadoMenor').value === false) {
        this.menores.clear()
      }

      const abrigado: Abrigado = {
        ...this.form.value,
        abrigoId: this._abrigoId,
        abrigoNome: this.abrigo.nome,
      }

      await this._abrigadosService.addOrUpdate(abrigado)

      this.form.reset()
      this.form.get('nome').reset()
      this.showFormSubmitted('Abrigado cadastrado com sucesso!', 'success')
    } catch (error) {
      this.showFormSubmitted('Erro ao cadastrar abrigado!', 'danger')
      console.error(error)
    }
  }
}
