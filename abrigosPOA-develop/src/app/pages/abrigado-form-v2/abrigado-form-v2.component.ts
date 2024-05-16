import { HttpClient, HttpHeaders } from '@angular/common/http'
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'
import { Subscription } from 'rxjs'
import { Abrigado, AbrigadoAcompanhante, AbrigadosService } from 'src/app/core/services/repository/abrigados.service'
import { Abrigo, AbrigoService } from 'src/app/core/services/repository/abrigo.service'
import { AuthService } from 'src/app/core/services/repository/firebase/auth.service'
import { environment } from 'src/environments/environment'
import { TipoDocumentoEnum } from './tipo-documento.enum'
import { TipoGeneroEnum } from './tipo-genero.enum'
import { TipoParentescoEnum } from './tipo-parentesco.enum'

@Component({
  selector: 'app-abrigado-form-v2',
  templateUrl: './abrigado-form-v2.component.html',
  styleUrls: ['./abrigado-form-v2.component.scss'],
})
export class AbrigadoFormV2Component implements OnInit, AfterViewInit, OnDestroy {
  private unsub: Subscription
  private selectedAbrigo: Abrigo

  public tipoDocEnum: any = TipoDocumentoEnum
  public tipoParentescoEnum: any = TipoParentescoEnum
  public form!: FormGroup
  public abrigos: Abrigo[]
  public abrigosMapped: any[]
  public tipoDocumentoSelecionado
  public tipoGeneroSelecionado
  public message?: string
  public messageType?: string
  public submitted = false
  private _abrigoId: string = ''
  public abrigadoId: string = ''
  public abrigados: Abrigado[] = []
  public abrigado: any = {}

  public listaAcompanhantes: AbrigadoAcompanhante[] = []

  public tipoDocumentos: any[]
  public tipoGenero: any = [
    {
      value: TipoGeneroEnum.HOMEM,
      label: TipoGeneroEnum.HOMEM,
      selected: true,
    },
    {
      value: TipoGeneroEnum.MULHER,
      label: TipoGeneroEnum.MULHER,
      selected: false,
    },
    {
      value: TipoGeneroEnum.NAO_IDENTIFICADO,
      label: TipoGeneroEnum.NAO_IDENTIFICADO,
      selected: false,
    },
  ]

  public tipoParentescos: any = [
    {
      value: TipoParentescoEnum.Conjuge,
      label: 'Cônjuge',
      selected: false,
    },
    {
      value: TipoParentescoEnum.Irmao,
      label: 'Irmão / Irmã',
      selected: false,
    },
    {
      value: TipoParentescoEnum.Filho,
      label: 'Filho / Filha',
      selected: false,
    },
    {
      value: TipoParentescoEnum.Mae,
      label: 'Mãe',
      selected: false,
    },
    {
      value: TipoParentescoEnum.Pai,
      label: 'Pai',
      selected: false,
    },
    {
      value: TipoParentescoEnum.Outro,
      label: 'Outro',
      selected: false,
    },
  ]

  public tipoParentescoEdit: any[] = []

  get abrigoNaoEncontrado(): boolean {
    return this.selectedAbrigo?.id === '0'
  }

  get abrigoEncontrado(): boolean {
    if (this.selectedAbrigo != null) {
      return this.selectedAbrigo && this.selectedAbrigo?.id !== '0'
    }

    return false
  }

  get pessoaSozinha(): boolean {
    const pessoaSozinha = this.form.get('pessoaSozinha')?.value
    return pessoaSozinha?.toString() === 'true'
  }

  @ViewChild('ddlAbrigos') ddlAbrigos: ElementRef

  constructor(
    private _formBuilder: FormBuilder,
    private abrigoService: AbrigoService,
    private _abrigadosService: AbrigadosService,
    private _http: HttpClient,
    private _route: ActivatedRoute,
    private _authService: AuthService
  ) {
    this._abrigoId = this._route.snapshot?.params?.abrigoId
  }

  async ngOnInit() {
    this._initForm()
    this.fetchAbrigos()
    await this.getAbrigado()
    this.getDocumentType()
  }

  ngAfterViewInit(): void {
    this.adicionarParente()
  }

  ngOnDestroy(): void {
    this.unsub.unsubscribe()
  }

  private _initForm(): void {
    this.form = this._formBuilder.group({
      abrigoId: [null, Validators.required],
      nome: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      nomeSocial: [null],
      nomeMae: [null, [Validators.minLength(3), Validators.maxLength(255)]],
      dataNascimento: [null, Validators.required],
      genero: [null, Validators.required],
      dataEntrada: [null, Validators.required],
      horaEntrada: [null, Validators.required],
      cpf: [null],
      rg: [null],
      cnh: [null],
      codCadUnico: [null],
      semDocumento: [false],
      cep: [null],
      endereco: [null, Validators.required],
      cidade: [null, Validators.required],
      bairro: [null],
      telefone: [null, Validators.required],
      pessoaSozinha: [false, Validators.required],
      contatoEmergenciaNome: [null],
      contatoEmergenciaTelefone: [null],
      alocado: [true],
    })
  }

  getStateFromField(controlName: string): string {
    const control = this.form.get(controlName)
    if (control?.invalid && control?.touched && !this._abrigoId) {
      return 'danger'
    }
    if (control?.valid) {
      return 'success'
    }
    return 'light'
  }

  async fetchAbrigos() {
    this.unsub = (await this.abrigoService.getAbrigos()).subscribe((abrigos) => {
      this.abrigos = abrigos

      this.abrigos.push({
        id: '0',
        nome: 'Abrigo não cadastrado',
      })

      this.abrigosMapped = this.abrigos.map((abrigo: Abrigo) => {
        return {
          value: abrigo?.id,
          label: abrigo?.nome,
          selected: this._abrigoId && this._abrigoId.length > 0 ? abrigo?.id === this._abrigoId : false,
        }
      })

      this.selectedAbrigo = null
    })
  }

  onAbrigoChange(event: any): void {
    const selectedItemValue = event.detail?.[0]?.value
    this.selectedAbrigo = this.abrigos.find((item) => item.id === selectedItemValue)

    if (this.abrigoEncontrado && this.selectedAbrigo) {
      this.form.get('abrigoId').setValue(this.selectedAbrigo.id)
    }

    if (!this.abrigadoId) {
      this.tipoDocumentoSelecionado = TipoDocumentoEnum.RG
      this.getDocumentType()

      this.form.get('dataEntrada').setValue(new Date().toISOString().split('T')[0])
      const currentDateTime = new Date()
      const formattedTime = currentDateTime.toLocaleTimeString('pt-BR', { hour12: false })
      this.form.get('horaEntrada').setValue(formattedTime.slice(0, 8))
    }
  }

  onTipoDocumentoChange(event: any): void {
    const selectedItemValue = event.detail?.[0]?.value
    this.tipoDocumentoSelecionado = selectedItemValue
  }

  onTipoGeneroChange(event: any): void {
    const selectedItemValue = event.detail?.[0]?.value
    this.tipoGeneroSelecionado = selectedItemValue

    this.form.patchValue({
      genero: this.tipoGeneroSelecionado,
    })
  }

  onPessoaSozinhaChange(event: any): void {
    const selectedItemValue = event.detail?.[0]?.value
    const pessoaSozinha = selectedItemValue?.toString() === 'true' ? false : true
    this.form.get('pessoaSozinha').setValue(pessoaSozinha)
  }

  onAlocadoChange(event: any): void {
    const selectedItemValue = event.detail?.[0]?.value
    const alocado = selectedItemValue?.toString() === 'true' ? false : true
    this.form.get('alocado').setValue(alocado)
  }

  onSemDocumentoChange(event: any): void {
    const selectedItemValue = event.detail?.[0]?.value
    const semDocumento = selectedItemValue === 'true' ? false : true

    this.form.get('semDocumento').setValue(semDocumento)
  }

  async buscarCpf(event: any) {
    if (this.isExistCPF(event.detail?.[0])) {
      this.showFormSubmitted('CPF já cadastrado!', 'danger')
      return
    }

    let cpf = event.detail?.[0]?.replace('-', '')
    do {
      cpf = cpf.replace('.', '')
    } while (cpf.indexOf('.') > -1)

    if (!this.validarCPF(cpf)) {
      this.showFormSubmitted('Número de CPF inválido!', 'danger')
      return
    }

    if (environment.serProEndpoint) {
      const token = await this._authService.getAuthorization()

      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `${token.Authorization}`,
      })

      this._http.get<any>(`${environment.serProEndpoint}/pessoas/${cpf}`, { headers: headers }).subscribe(
        (data) => {
          this.form.patchValue({
            nome: data?.nome,
            dataNascimento: data?.nascimento.substring(0, data?.nascimento.indexOf('T')),
          })
        },
        (error) => {
          console.error('Erro ao buscar CPF:', error)
        }
      )
    }
  }

  buscarEnderecoPorCep(cep: string) {
    if (!cep) return

    const cepNumerico = cep.replace(/\D/g, '')

    this._http.get<any>(`https://viacep.com.br/ws/${cepNumerico}/json/`).subscribe(
      (data) => {
        this.form.patchValue({
          endereco: this.formatarEndereco(data),
          cidade: data.localidade,
          bairro: data.bairro,
        })
      },
      (error) => {
        console.error('Erro ao buscar endereço:', error)
      }
    )
  }

  adicionarParente(): void {
    this.listaAcompanhantes.push({
      id: (this.listaAcompanhantes.length + 1).toString(),
      nome: null,
      dataNascimento: null,
      grauParentesco: null,
    })
  }

  atualizarAcompanhante(acompanhante: AbrigadoAcompanhante, prop: string, event: any): void {
    const value = event.detail?.[0]?.value ? event.detail?.[0]?.value : event.detail?.[0]
    acompanhante[prop] = value
  }

  removerAcompanhante(acompanhante: AbrigadoAcompanhante): void {
    this.listaAcompanhantes = this.listaAcompanhantes.filter((item) => item.id !== acompanhante.id)
  }

  private formatarEndereco(data: any): string {
    if (data.erro) return ''
    return `${data.logradouro}, ${data.complemento ? data.complemento + ', ' : ''}${data.bairro}, ${data.localidade} - ${data.uf}, CEP: ${data.cep}`
  }

  private showFormSubmitted(message: string, type: string): void {
    this.submitted = true
    this.message = message
    this.messageType = type
    setTimeout(() => (this.submitted = false), 10000)
  }

  private documentoInvalido(): boolean {
    switch (this.tipoDocumentoSelecionado) {
      case TipoDocumentoEnum.RG:
        return false
      case TipoDocumentoEnum.CNH:
        return !this.validarCNH(this.form.get('cnh').value)
      default:
        return false
    }
  }

  private validarCPF(cpf): boolean {
    cpf = cpf.replace(/\D/g, '')
    if (cpf.toString().length != 11 || /^(\d)\1{10}$/.test(cpf)) return false
    var result = true
    ;[9, 10].forEach(function (j) {
      var soma = 0,
        r
      cpf
        .split(/(?=)/)
        .splice(0, j)
        .forEach(function (e, i) {
          soma += parseInt(e) * (j + 2 - (i + 1))
        })
      r = soma % 11
      r = r < 2 ? 0 : 11 - r
      if (r != cpf.substring(j, j + 1)) result = false
    })

    return result
  }

  private validarCNH(cnh): boolean {
    var char1 = cnh.charAt(0)

    if (cnh.replace(/[^\d]/g, '').length !== 11 || char1.repeat(11) === cnh) {
      return false
    }

    for (var i = 0, j = 9, v = 0; i < 9; ++i, --j) {
      v += +(cnh.charAt(i) * j)
    }

    var dsc = 0,
      vl1 = v % 11

    if (vl1 >= 10) {
      vl1 = 0
      dsc = 2
    }

    for (i = 0, j = 1, v = 0; i < 9; ++i, ++j) {
      v += +(cnh.charAt(i) * j)
    }

    var x = v % 11
    var vl2 = x >= 10 ? 0 : x - dsc

    return '' + vl1 + vl2 === cnh.substr(-2)
  }

  private acompanhantesInvalidos(): boolean {
    if (this.pessoaSozinha) return false

    return (
      this.listaAcompanhantes.filter(
        (item) => !item.nome || item.nome?.length < 3 || !item.dataNascimento || !item.grauParentesco
      ).length > 0
    )
  }

  async onSubmit(): Promise<void> {
    if (this.isExistCPF(this.form.get('cpf').value)) {
      this.showFormSubmitted('CPF já cadastrado!', 'danger')
      return
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched()
      this.showFormSubmitted('Formulário inválido!', 'danger')
      return
    }

    if (this.documentoInvalido()) {
      this.form.markAllAsTouched()
      this.showFormSubmitted('Documento inválido!', 'danger')
      return
    }

    if (this.acompanhantesInvalidos()) {
      this.form.markAllAsTouched()
      this.showFormSubmitted('Preencha corretamente os dados do(s) acompanhante(s)!', 'danger')
      return
    }

    try {
      const abrigado: Abrigado = {
        ...this.form.value,
        acompanhante: this.listaAcompanhantes,
        tipoDocumento: this.tipoDocumentoSelecionado,
      }

      if (this.abrigadoId) {
        abrigado.id = this.abrigadoId
      }

      await this._abrigadosService.addOrUpdate(abrigado)

      this.showFormSubmitted('Abrigado cadastrado com sucesso!', 'success')
      this.form.reset()
      this.form.markAsPristine()
      this.form.markAsUntouched()
      this.form.updateValueAndValidity()

      this.form.get('abrigoId').setValue(this.selectedAbrigo.id)
      this.form.get('pessoaSozinha').setValue(abrigado?.pessoaSozinha)
      this.form.get('genero').setValue(this.tipoGenero[0].value)

      this.listaAcompanhantes = []
      this.adicionarParente()
    } catch (error) {
      this.showFormSubmitted('Erro ao cadastrar abrigado!', 'danger')
      console.error(error)
    }
  }

  private async getAbrigado() {
    this.abrigadoId = this._route.snapshot?.params?.abrigadoId
    this.abrigados = await this._abrigadosService.load()
    if (this.abrigadoId) {
      if (this.abrigados.length > 0) {
        for (let i = 0; i < this.abrigados.length; i++) {
          if (this.abrigadoId === this.abrigados[i].id) {
            this.abrigado = this.abrigados[i]
            this.form.patchValue(this.abrigado)

            if (this.abrigado.acompanhante) {
              this.listaAcompanhantes = []
              for (let j = 0; j < this.abrigado.acompanhante.length; j++) {
                let acompanhante = {
                  id: this.abrigado.acompanhante[j]?.id,
                  nome: this.abrigado.acompanhante[j]?.nome,
                  dataNascimento: this.abrigado.acompanhante[j]?.dataNascimento,
                  grauParentesco: this.abrigado.acompanhante[j]?.grauParentesco,
                }
                this.listaAcompanhantes.push(acompanhante)
                this.tipoParentescoEdit.push(
                  this.tipoParentescos.map((tp) => ({
                    ...tp,
                    selected: tp.value === acompanhante.grauParentesco,
                  }))
                )
              }
            }
          }
        }
      }
    }
  }

  getDocumentType() {
    this.tipoDocumentos = [
      {
        value: TipoDocumentoEnum.RG,
        label: TipoDocumentoEnum[TipoDocumentoEnum.RG],
        selected: !this.abrigado?.tipoDocumento ? true : this.abrigado?.tipoDocumento === TipoDocumentoEnum.RG,
      },
      {
        value: TipoDocumentoEnum.CNH,
        label: TipoDocumentoEnum[TipoDocumentoEnum.CNH],
        selected: this.abrigado?.tipoDocumento === TipoDocumentoEnum.CNH,
      },
    ]
  }

  isExistCPF(cpf) {
    return this.abrigados.some((abrigado) => abrigado.cpf === cpf)
  }
}
