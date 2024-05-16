import { Component, inject, OnInit } from '@angular/core'
import { Analytics } from '@angular/fire/analytics'
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { BehaviorSubject } from 'rxjs'
import { AuthorizationService } from 'src/app/core/services/authorization.service'
import { Abrigo, AbrigoService, ItemUteis } from 'src/app/core/services/repository/abrigo.service'
import { removeAccents } from 'src/app/shared/utils/removeAccents'
import { CreateOrUpdateAbrigoUseCase } from './useCases/createOrUpdateAbrigo.useCase'
import { GetAbrigoUseCase } from './useCases/getAbrigos.useCase'

import { HttpClient } from '@angular/common/http'

import { ExcelService } from 'src/app/core/services/excel.service'
import { AuthService } from 'src/app/core/services/repository/firebase/auth.service'
import { LoaderService } from 'src/app/shared/components/loader/loader.service'
import AbrigoDTO, { EquipeApoio } from './DTOs/AbrigoDTO'
import { AbrigoOptionsDTO } from './DTOs/AbrigoOptionsDTO'
import { AtendimentoOptiosnDTO } from './DTOs/AtendimentoOptionsDTO'
import { ClassificacaoOptionsDTO } from './DTOs/ClassificacaoOptionsDTO'
import { LocalOptionsDTO } from './DTOs/LocalOptionsDTO'

const itensUteis: { value: string; label: string; selected: boolean }[] = [
  { value: 'agua', label: 'Água', selected: false },
  { value: 'comida pronta', label: 'Comida pronta', selected: false },
  { value: 'leite', label: 'Leite', selected: false },
  {
    value: 'Comida não perecivel(Arroz, Feijão, Massas, Conservas)',
    label: 'Comida não perecivel(Arroz, Feijão, Massas, Conservas)',
    selected: false,
  },
  { value: 'Formulas infantis', label: 'Formulas infantis', selected: false },
  { value: 'Papinha', label: 'Papinha', selected: false },
  { value: 'andador para adulto', label: 'Andador para adulto', selected: false },
  { value: 'cadeira de rodas', label: 'Cadeira de rodas', selected: false },
  { value: 'cadeira higiência e de banho', label: 'Cadeira higiência e de banho', selected: false },
  { value: 'cobertores', label: 'Cobertores', selected: false },
  { value: 'lençois', label: 'Lençois', selected: false },
  { value: 'muletas', label: 'Muletas', selected: false },
  { value: 'toalhas', label: 'Toalhas', selected: false },
  { value: 'travesseiro', label: 'Travesseiro', selected: false },
  { value: 'carregador de celular', label: 'Carregador de celular', selected: false },
  { value: 'absorvente', label: 'Absorvente', selected: false },
  { value: 'fralda geriatrica', label: 'Fralda geriatrica', selected: false },
  { value: 'fralda infantil', label: 'Fralda infantil', selected: false },
  {
    value: 'kit de higiene pessoal - papel higiênico, pasta de dente, shampoo, escova dental, desodorante',
    label: 'Kit de higiene pessoal - papel higienico, pasta de dente, shampoo, escova dental, desodorante',
    selected: false,
  },
  { value: 'kit de primeiros socorros', label: 'Kit de primeiros socorros', selected: false },
  { value: 'lenço humedecido', label: 'Lenço humedecido', selected: false },
  { value: 'Desodorante', label: 'Desodorante', selected: false },
  { value: 'Shampoo e condicionador', label: 'Shampoo e condicionador', selected: false },
  { value: 'Escova de dente e pasta de dente', label: 'Escova e pasta de dente', selected: false },
  { value: 'Papel Higienico', label: 'Papel Higiênico', selected: false },
  { value: 'Sabonete', label: 'Sabonete', selected: false },
  { value: 'baldes, varroura e rodo', label: 'Baldes, vassoura e rodo', selected: false },
  { value: 'panos para limpeza', label: 'Panos para limpeza', selected: false },
  { value: 'potes para alimentação', label: 'Potes para alimentação', selected: false },
  { value: 'produtos de limpeza do abrigo', label: 'Produtos de limpeza do abrigo', selected: false },
  { value: 'sacos plasticos para lixo', label: 'Sacos plasticos para lixo', selected: false },
  { value: 'coleira', label: 'coleira', selected: false },
  { value: 'ração para cachorro', label: 'Ração para cachorro', selected: false },
  { value: 'ração para gato', label: 'Ração para gato', selected: false },
  { value: 'Areia Higienica / Saco para fezes', label: 'Areia Higiênica / Saco para fezes', selected: false },
  { value: 'Medicamentos veterinarios', label: 'Medicamentos veterinários', selected: false },
  { value: 'creme para assaduras', label: 'Creme para assaduras', selected: false },
  { value: 'remedios', label: 'Remédios', selected: false },
  { value: 'Medicamentos infantis', label: 'Medicamentos infantis', selected: false },
  { value: 'roupas feminino', label: 'Roupas femininas', selected: false },
  { value: 'roupas masculino', label: 'Roupas masculinas', selected: false },
  { value: 'Roupas infantis', label: 'Roupas infantis', selected: false },
  { value: 'Sapatos femininos', label: 'Sapatos femininos', selected: false },
  { value: 'Sapatos masculino', label: 'Sapatos masculino', selected: false },
  { value: 'Sapatos Infantis', label: 'Sapatos infantis', selected: false },
]
@Component({
  selector: 'app-vagas-form',
  templateUrl: './new-vagas-form.component.html',
  styleUrls: ['./vagas-form.component.scss'],
})
export class VagasFormComponent implements OnInit {
  static readonly CADASTRO_GERAL = 0
  static readonly CADASTRO_DADOS_ABRIGO = 1
  static readonly CADASTRO_NECESSIDADE_ABRIGO = 2

  private analytics: Analytics = inject(Analytics)

  public message: string
  public categories: any[]
  public messageType: string
  public submitted: boolean = false
  public selectedCategorie: string
  public form: FormGroup
  public formUteis: FormGroup
  public abrigos: AbrigoDTO[] = []
  public abrigos2: Abrigo[] = []
  public editIndex: number = null
  private idAbrigo: string = ''
  public nomeAbrigo: string = ''
  public modalShow: boolean = false
  public titleModal: string = ''
  public typeEdit: number = VagasFormComponent.CADASTRO_GERAL
  public searchText: string = ''
  public listaFiltrada: BehaviorSubject<AbrigoDTO[]> = new BehaviorSubject([])

  public itensUteis = JSON.parse(JSON.stringify(itensUteis))

  public usuario = null
  public itensUtilOpened: boolean = false
  public erroCEP: boolean = false

  public permission: boolean = false
  public localOptions = LocalOptionsDTO
  public classificacaoOptions = ClassificacaoOptionsDTO
  public abrigoOptions = AbrigoOptionsDTO
  public atendimentoOptions = AtendimentoOptiosnDTO
  public volunteersArray: FormArray

  public classificacaoOptionsSearch = ClassificacaoOptionsDTO
  public citiesOptionsSearch: any

  private timeout: any

  public currentPage: number = 1
  public itemsPerPage: number = 9
  public totalPages: number = 0
  public totalItems: number = 0

  constructor(
    private fb: FormBuilder,
    private _http: HttpClient,
    public authorizationService: AuthorizationService,
    private excelService: ExcelService,
    private _authService: AuthService,
    private loaderService: LoaderService,
    private abrigoService: AbrigoService,
    private getAbrigoUseCase: GetAbrigoUseCase,
    private createOrUpdateAbrigoUseCase: CreateOrUpdateAbrigoUseCase
  ) {
    this.usuario = this._authService.currentUser

    this.listaFiltrada.subscribe((data) => this._onListUpdated(data))
  }

  async ngOnInit() {
    this.buildFormGroup()
    this.loaderService.show()
    this.categories = [
      { value: 'alimentos', viewValue: 'Alimentos' },
      { value: 'alojamento', viewValue: 'Alojamento' },
      { value: 'higiene', viewValue: 'Higiene' },
      { value: 'limpeza', viewValue: 'Limpeza' },
      { value: 'pet', viewValue: 'Pet' },
      { value: 'socorros', viewValue: 'Primeiros Socorros' },
      { value: 'vestuario', viewValue: 'Vestuario' },
    ]
    await this.fetchAbrigos()

    // TODO: Implementar regras, faze provisória
    this.permission = this.usuario.email === 'liana.rigon@procempa.com.br'

    this.loaderService.hide()
  }

  async fetchAbrigos() {
    this.submitted = true
    this.abrigos = await this.getAbrigoUseCase.run()
    this.abrigos2 = await this.getAbrigoUseCase.run2()
    this.citiesOptionsSearch = this.abrigoService.getCityToFilter(this.abrigos2, false)
    this.search()
    this.submitted = false
    // this.listaFiltrada.next(this.abrigos)
  }

  converterParaNumero(valor: any): number {
    const numero = parseFloat(valor)
    return isNaN(numero) ? 0 : numero
  }

  calcularTotalVagas(abrigos: any[]): number {
    return abrigos.reduce((total, abrigo) => total + this.converterParaNumero(abrigo.vagas_info.vagas_totais), 0)
  }

  calcularTotalVagasOcupadas(abrigos: any[]): number {
    return abrigos.reduce((total, abrigo) => total + this.converterParaNumero(abrigo.vagas_info.vagas_ocupadas), 0)
  }

  calcularVagasDisponiveis(abrigos: any[]): number {
    return abrigos.reduce(
      (total, abrigo) =>
        total +
        (this.converterParaNumero(abrigo.vagas_info.vagas_totais) -
          this.converterParaNumero(abrigo.vagas_info.vagas_ocupadas)),
      0
    )
  }

  calcularPorcentagemVagasOcupadas(abrigos: any[]): string {
    const totalVagas = this.calcularTotalVagas(abrigos)
    const totalVagasOcupadas = this.calcularTotalVagasOcupadas(abrigos)
    if (totalVagas === 0) {
      return '0'
    }
    return ((totalVagasOcupadas / totalVagas) * 100).toFixed(2)
  }

  async buscarEnderecoPorCep(cep: string) {
    if (!cep) return
    const cepNumerico = cep.replace(/\D/g, '')

    const endereco = await this._http
      .get<any>(`https://viacep.com.br/ws/${cepNumerico}/json/`)
      .toPromise()
      .catch((error) => {
        console.error('Erro ao buscar endereço:', error)
      })

    if (endereco.erro) {
      this.erroCEP = true
      this.form.get(['endereco', 'cep'])?.setErrors({ invalidCEP: true, opts: { emitEvent: true } })
      this.form.get(['endereco', 'cep'])?.markAsUntouched()
      this.form.patchValue({
        endereco: {
          rua: '',
          cidade: '',
        },
      })
    } else {
      this.erroCEP = false
      this.form.get(['endereco', 'cep'])?.setErrors(null)
      this.form.patchValue({
        endereco: {
          rua: this.formatarEndereco(endereco),
          cidade: endereco.localidade,
        },
      })
    }
  }

  formatarEndereco(data: any): string {
    if (data.erro) return ''
    return `${data.logradouro}, ${data.complemento ? data.complemento + ', ' : ''}${data.bairro}, ${data.localidade} - ${data.uf}, CEP: ${data.cep}`
  }

  changeSelect(event: any, name: string[]): void {
    const value = Array.isArray(event.detail[0])
      ? event.detail[0]?.reduce((acc, cur) => [...acc, cur.value], [])
      : event.detail[0]?.value
    this.form.get(name)?.setValue(value)
  }

  showFormSubmitted(message: string, type: string) {
    this.submitted = true
    this.message = message
    this.messageType = type

    setTimeout(() => {
      this.submitted = false
    }, 10000)
  }

  validBoolValue(value: any): boolean {
    if (value === undefined) return false
    return value
  }

  validStringValue(value: any): string {
    if (value === undefined) return null
    return value
  }

  async onSubmit() {
    console.log(this.form)

    try {
      if (this.form.valid) {
        const abrigoSaved = await this.createOrUpdateAbrigoUseCase.run({
          abrigoId: this.idAbrigo,
          formValues: this.form.getRawValue(),
          update_in: new Date(),
        })
        this.modalShow = false
        //const itensUteisSelected = this.form.get('itensUteis')?.value
        this.form.reset()
        await this.fetchAbrigos()
        const uteisArray = this.form.get('itensUteis') as FormArray
        uteisArray.clear()
        this.idAbrigo = ''
        this.nomeAbrigo = ''
        this.itensUteis = JSON.parse(JSON.stringify(itensUteis))
        this.showFormSubmitted('Formulário enviado com sucesso!', 'success')
        // this.updateAbrigo(this.idAbrigo, abrigoSaved)
      } else {
        this.form.markAllAsTouched()
        this.showFormSubmitted('Formulário inválido!', 'danger')
      }
    } catch (err) {
      console.error('error:', err)
    }
  }

  updateAbrigo(idAbrigo, abrigoSaved) {
    this.abrigos.find((abrigo) => abrigo.id == idAbrigo).itensUteis = abrigoSaved.itensUteis
  }

  handleEditAbrigo(abrigo: AbrigoDTO) {
    this.localOptions = this.localOptions.map((local) => {
      local.selected = abrigo.local_info.tipo_local?.includes(local.value)
      return local
    })

    this.classificacaoOptions = this.classificacaoOptions.map((classification) => {
      classification.selected = abrigo.local_info.classificacao_local === classification.value
      return classification
    })

    this.abrigoOptions = this.abrigoOptions.map((abrigoOpt) => {
      abrigoOpt.selected = abrigo.local_info.tipo_abrigo?.includes(abrigoOpt.value)
      return abrigoOpt
    })

    this.atendimentoOptions = this.atendimentoOptions.map((atendimentoOpt) => {
      atendimentoOpt.selected = abrigo.atendimento_info?.apoio_medico?.includes(atendimentoOpt.value)
      return atendimentoOpt
    })

    abrigo.local_info['tipo_local_grid'] = Array.isArray(abrigo.local_info.tipo_local)
      ? abrigo.local_info.tipo_local.reduce((a, c) => a + ', ' + c, '')
      : abrigo.local_info.tipo_local
    abrigo.local_info['tipo_abrigo_grid'] = Array.isArray(abrigo.local_info.tipo_abrigo)
      ? abrigo.local_info.tipo_abrigo.reduce((a, c) => a + ', ' + c, '')
      : abrigo.local_info.tipo_abrigo

    this.itensUteis = JSON.parse(JSON.stringify(itensUteis))

    this.idAbrigo = abrigo.id
    this.itensUtilOpened = false
    this.nomeAbrigo = abrigo.nome

    const { cep } = abrigo.endereco

    this.form.patchValue(abrigo)
    this.form.get('endereco').patchValue({
      ...abrigo.endereco,
      cep,
    })

    if (cep) {
      this.form.get(['endereco', 'cep']).updateValueAndValidity()
    }

    let uteis = this.form.get('itensUteis') as FormArray
    if (!uteis) {
      uteis = this.fb.array([]) // Cria um FormArray vazio se não existir
      this.form.setControl('itensUteis', uteis)
    } else {
      uteis.clear() // Limpa os itens antes de adicionar os novos
    }

    if (abrigo.itensUteis) {
      this.itensUteis = this.itensUteis.map((itemUtil) => {
        itemUtil.selected = abrigo.itensUteis.some((item) => item.item === itemUtil.value)
        return itemUtil
      })

      abrigo.itensUteis.forEach((item: any) => {
        uteis.push(
          this.fb.group({
            item: item.item,
            quantidade: item.quantidade,
            type: item.type,
          })
        )
      })
    }

    let equipeApoio = this.form.get('equipe_apoio') as FormArray
    if (!equipeApoio) {
      equipeApoio = this.fb.array([]) // Cria um FormArray vazio se não existir
      this.form.setControl('equipe_apoio', equipeApoio)
    } else {
      equipeApoio.clear() // Limpa os itens antes de adicionar os novos
    }

    if (abrigo.equipe_apoio) {
      abrigo.equipe_apoio.forEach((item: any) => {
        equipeApoio.push(
          this.fb.group({
            apoio_responsavel: item.apoio_responsavel,
            apoio_telefone: item.apoio_telefone,
          })
        )
      })
    }
  }

  handleInput(fieldName: string[]) {
    const fieldControl = this.form.get(fieldName)

    if (fieldControl?.value?.toString()?.trim() === '') {
      fieldControl?.setValue('')
      fieldControl?.markAsUntouched()
      fieldControl?.markAsPristine()
      fieldControl?.updateValueAndValidity()
    }
  }

  editItem(i: number) {
    this.editIndex = i
    const uteis = this.form.get('itensUteis') as FormArray
    const item = uteis.at(i)
    this.formUteis.patchValue({
      item: item.get('item').value,
      quantidade: item.get('quantidade').value,
    })
  }

  updateItem(index, itemValue, isCustom) {
    const uteis = this.form.get('itensUteis') as FormArray
    const item = uteis.at(index)
    let itemToChange = {}
    if (isCustom) itemToChange['item'] = itemValue
    else itemToChange['quantidade'] = +itemValue

    const itemToUpdate = {
      ...item.value.item,
      ...itemToChange,
    }
    item.patchValue(itemToUpdate)
  }

  deleteItem(i: number) {
    const uteis = this.form.get('itensUteis') as FormArray
    uteis.removeAt(i)
  }

  addItem(itemValue) {
    const uteis = this.form.get('itensUteis') as FormArray
    uteis.insert(
      0,
      this.fb.group({
        item: itemValue,
        quantidade: 0,
        type: null,
      })
    )
  }

  handleInputItenUtil(i, ev, isCustom) {
    let itemValue = ev.detail[0]
    if (typeof itemValue === 'string') {
      itemValue = itemValue.replace(',', '.')
    }
    this.updateItem(i, parseFloat(itemValue), isCustom)
  }

  ///Voluntários
  handleInputVolunteer(i, fieldName, ev) {
    const itemValue = ev.detail[0]
    this.updateVolunteer(i, fieldName, itemValue)
  }

  updateVolunteer(index, fieldName, itemValue) {
    const uteis = this.form.get('equipe_apoio') as FormArray
    const item = uteis.at(index)
    const itemToChange = {}
    itemToChange[fieldName] = itemValue
    const newItem = {
      ...item.value,
      ...itemToChange,
    }
    item.setValue(newItem)
  }

  volunteerTrack(index, volunteer) {
    return index
  }

  addVolunteer(): void {
    const volunteers = this.form.get('equipe_apoio') as FormArray
    volunteers.push(
      this.fb.group({
        apoio_responsavel: null,
        apoio_telefone: null,
      })
    )
  }

  removeVolunteer(index): void {
    const volunteers = this.form.get('equipe_apoio') as FormArray
    volunteers.removeAt(index)
  }
  ///

  trackByItemUtil(index, item) {
    return item.item
  }

  toggleSelectItemUteis() {
    this.itensUtilOpened = !this.itensUtilOpened

    const uteis = this.form.get('itensUteis') as { value: Array<{ item: string }> }

    this.itensUteis = this.itensUteis.map((itemUtil) => {
      itemUtil.selected = uteis.value.some(({ item }) => item === itemUtil.value)

      return itemUtil
    })
  }

  selectItemUteis(item) {
    const uteis = this.form.get('itensUteis') as FormArray
    let foundItemIndex = -1
    for (let i = 0; i < uteis.value.length; i++) {
      const itemForm = uteis.at(i)
      if (itemForm.value.item === item.value) foundItemIndex = i
    }
    if (foundItemIndex >= 0) this.deleteItem(foundItemIndex)
    else this.addItem(item.value)
  }

  addOtherItem() {
    const uteis = this.form.get('itensUteis') as FormArray
    uteis.push(
      this.fb.group({
        item: null,
        quantidade: 0,
        type: 'custom',
      })
    )
  }

  updateIn(value: any): any {
    if (typeof value === 'string') {
      const date = new Date(value)
      if (!isNaN(date.getTime())) {
        return date.toLocaleString('pt-BR')
      }
      return 'Data inválida'
    }
    return value
  }

  closeModal() {
    this.modalShow = false
  }

  openModalAdd() {
    this.form.reset()
    this.form.get('ativo').setValue(true)
    const uteis = this.form.get('itensUteis') as FormArray
    uteis.clear()
    this.itensUteis = this.itensUteis.map((itemUtil) => {
      itemUtil.selected = false
      return itemUtil
    })

    this.localOptions = this.localOptions.map((local) => {
      local.selected = false
      return local
    })

    this.classificacaoOptions = this.classificacaoOptions.map((classification) => {
      classification.selected = false
      return classification
    })

    this.abrigoOptions = this.abrigoOptions.map((abrigoOpt) => {
      abrigoOpt.selected = false
      return abrigoOpt
    })

    this.atendimentoOptions = this.atendimentoOptions.map((atendimentoOpt) => {
      atendimentoOpt.selected = false
      return atendimentoOpt
    })

    this.modalShow = true
    this.typeEdit = VagasFormComponent.CADASTRO_GERAL
    this.titleModal = 'Cadastrar abrigo'
    this.itensUtilOpened = true
  }

  openEditModalData() {
    this.modalShow = true
    this.typeEdit = VagasFormComponent.CADASTRO_DADOS_ABRIGO
    this.titleModal = 'Editar dados do abrigo'
  }

  openEditModalNeed() {
    this.modalShow = true
    this.typeEdit = VagasFormComponent.CADASTRO_NECESSIDADE_ABRIGO
    this.titleModal = 'Editar necessidades do abrigo'
  }

  searchCities: string[]
  handleChangeCity(ev: any) {
    this.searchCities = Array.isArray(ev.detail[0]) ? ev.detail[0]?.map((city) => city.value) : [ev.detail[0].value]
    this.search()
  }

  searchClassif: string[]
  handleChangeClassificacao(ev: any) {
    this.searchClassif = Array.isArray(ev.detail[0])
      ? ev.detail[0]?.map((classif) => classif.value)
      : [ev.detail[0].value]
    this.search()
  }

  timeoutSearch: any
  search() {
    if (this.timeoutSearch) clearTimeout(this.timeoutSearch)

    this.timeoutSearch = setTimeout(() => {
      let searchTerm = Array.isArray(this.searchText) ? this.searchText[0] : this.searchText
      searchTerm = removeAccents(searchTerm?.toLowerCase())

      if (!searchTerm || searchTerm?.trim() === '') searchTerm = null

      if (this.searchText || this.searchCities?.length || this.searchClassif?.length) {
        const achados = this.abrigos.filter((abrigo) => {
          const nome = typeof abrigo.nome === 'string' ? removeAccents(abrigo.nome.toLowerCase()) : ''
          const rua = removeAccents(abrigo.endereco.rua?.toLowerCase())
          const cidade = abrigo.endereco.cidade
          const classif = abrigo.local_info.classificacao_local

          const bNome = nome.includes(searchTerm) || rua.includes(searchTerm) || searchTerm === null
          const bCidade = this.searchCities.includes(cidade) || this.searchCities.length === 0
          const bClassi = this.searchClassif.includes(classif) || this.searchClassif.length === 0

          return bNome && bCidade && bClassi
        })
        this.listaFiltrada.next(achados)
      } else {
        this.listaFiltrada.next(this.abrigos)
      }
    }, 500)
  }

  exportToExcel() {
    let abrigos = []
    for (const abrig of this.abrigos) {
      abrigos.push({
        nome: abrig.nome_gestor,
        cidade: abrig.endereco.cidade,
        endereco: abrig.endereco.rua,
        telefone: abrig.telefone_gestor,
        vagas: abrig.vagas_info.vagas_totais,
        vagas_ocupadas: abrig.vagas_info.vagas_ocupadas,
        vagas_totais: abrig.vagas_info.vagas_totais - abrig.vagas_info.vagas_ocupadas,
      })
    }

    let dateAtual = new Date()
    let day = String(dateAtual.getDate()).padStart(2, '0')
    let month = String(dateAtual.getMonth() + 1).padStart(2, '0') // Adicionamos +1 ao mês porque o método getMonth retorna de 0 a 11
    let year = dateAtual.getFullYear()
    let concateDate = day + '_' + month + '_' + year
    this.excelService.exportToExcel(abrigos, `lista_abrigos_${concateDate}.xlsx`)
  }

  private buildFormGroup() {
    this.form = this.fb.group({
      ativo: new FormControl(true, Validators.required),
      nome: new FormControl(null, Validators.required),
      endereco: this.fb.group({
        cep: new FormControl(null, Validators.required),
        rua: new FormControl(null, Validators.required),
        bairro: new FormControl(null),
        cidade: new FormControl(null, Validators.required),
      }),
      ponto_referencia: new FormControl(null),
      orientacao_acesso: new FormControl(null),
      nome_gestor: new FormControl(null, Validators.required),
      telefone_gestor: new FormControl(null, Validators.required),
      vagas_info: this.fb.group({
        vagas_totais: new FormControl(0, Validators.required),
        vagas_ocupadas: new FormControl(0, Validators.required),
        vaga_mulher: new FormControl(false),
        vaga_mulher_quantidade: new FormControl(0),
        vaga_mulher_quantidade_ocupadas: new FormControl(0),
        vaga_pets: new FormControl(false),
        vaga_pets_quantidade: new FormControl(0),
        vaga_pets_quantidade_ocupadas: new FormControl(0),
      }),
      local_info: this.fb.group({
        tipo_local: new FormControl(null),
        classificacao_local: new FormControl(null),
        classificacao_local_outro: new FormControl(null),
        tipo_abrigo: new FormControl(null),
      }),
      infra_info: this.fb.group({
        cozinha: new FormControl(false),
        metragem: new FormControl(null),
        banheiros: new FormControl(null),
        colchoes: new FormControl(null),
        chuveiros: new FormControl(null),
        acessibilidade: new FormControl(false),
        obs_acessibilidade: new FormControl(null),
        fornecimento_agua: new FormControl(false),
        fornecimento_eletrica: new FormControl(false),
        gerador: new FormControl(false),
        climatizacao: new FormControl(null),
        obs_climatizacao: new FormControl(null),
        enfermaria: new FormControl(false),
      }),
      atendimento_info: this.fb.group({
        qtd_voluntarios: new FormControl(0),
        atendimento: new FormControl(false),
        apoio_medico: new FormControl([]),
        medicamentos: new FormControl(false),
        apoio_medicamentos: new FormControl(null),
      }),
      equipe_apoio: this.fb.array<EquipeApoio>([]),
      itensUteis: this.fb.array<ItemUteis>([]),
      observations: new FormControl(null),
      update_in: new FormControl(null),
    })
  }

  private _onListUpdated(items: AbrigoDTO[]) {
    this.totalItems = items.length
    this.handleResetPagination()
  }

  handlePageChange(newPage: number) {
    this.currentPage = newPage
  }

  handleItemsPerPageChange(newItemsPerPage: number) {
    this.itemsPerPage = newItemsPerPage
    this.handleResetPagination()
  }

  handleResetPagination() {
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage)
    this.currentPage = 1
  }

  changeSwitch($event, elements) {
    const { checked } = $event.target

    elements.forEach((element) => {
      const value = this.form.get(element).getRawValue()

      if ([null, '0', ''].includes(value)) {
        this.form.get(element).setValue(checked ? '0' : null)
      }
    })
  }

  get currentPageItems(): AbrigoDTO[] {
    const start = (this.currentPage - 1) * this.itemsPerPage
    const end = start + this.itemsPerPage
    return this.listaFiltrada.value.slice(start, end)
  }

  isValidDate(dateString: string): boolean {
    const date = new Date(dateString)
    return !isNaN(date.getTime())
  }
}
