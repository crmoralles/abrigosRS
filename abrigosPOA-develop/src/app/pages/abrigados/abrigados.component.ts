import { Component, inject } from '@angular/core'
import { Analytics } from '@angular/fire/analytics'
import { Router } from '@angular/router'
import { AuthorizationService } from 'src/app/core/services/authorization.service'
import { ExcelService } from 'src/app/core/services/excel.service'
import { Abrigado, AbrigadosService } from 'src/app/core/services/repository/abrigados.service'
import { Abrigo, AbrigoService } from 'src/app/core/services/repository/abrigo.service'
import { AuthService } from 'src/app/core/services/repository/firebase/auth.service'
import { LoaderService } from 'src/app/shared/components/loader/loader.service'
import { removeAccents } from 'src/app/shared/utils/removeAccents'
import { ABRIGADO } from '../../shared/constants/routes.const'

interface AbrigadoWithCollapse extends Abrigado {
  isCollapsed: boolean
  listaMenor: any[]
  create_in: Date
}

@Component({
  selector: 'app-abrigados',
  templateUrl: './abrigados.component.html',
  styleUrls: ['./abrigados.component.scss'],
})
export class AbrigadosComponent {
  public abrigados: AbrigadoWithCollapse[] = []
  public listaFiltrada: AbrigadoWithCollapse[] = []
  public usuario = null
  public busca = null
  public shelterOrder: boolean = true
  public nameOrder: boolean = true
  public abrigos: Abrigo[] = []
  public listaMenor: any[] = []
  public currentPage: number = 1
  public itemsPerPage: number = 100
  public totalPages: number = 0
  public totalItems: number = 0
  public abrigosMapped: any[]
  private selectedAbrigo: Abrigo

  private timeoutSearch: any

  public permission: boolean = false

  private analytics: Analytics = inject(Analytics)

  constructor(
    private _abrigadosService: AbrigadosService,
    private _authService: AuthService,
    public authorizationService: AuthorizationService,
    private _abrigoService: AbrigoService,
    private excelService: ExcelService,
    private router: Router,
    private loaderService: LoaderService
  ) {
    // TODO: Implementar regras pra quando não for usuario comum
    this.usuario = this._authService.currentUser
  }

  get totalAbrigados() {
    return this.listaFiltrada.reduce((acc, abrigado) => {
      return acc + (abrigado.acompanhante?.length || 0) + 1
    }, 0)
  }

  async ngOnInit() {
    this.loaderService.show()

    this.abrigados = await this._abrigadosService.load()
    this.abrigos = await this._abrigoService.load()

    const allowMenorIdade = await this.authorizationService.getFiltroAcessarMenor18()
    this.abrigados = this.abrigados
      .map((abrigado) => {
        //verifica se tem nome nos menores

        abrigado.dataNascimento = this.formateMaskDate(abrigado.dataNascimento)
          ? this.formateMaskDate(new Date(abrigado.dataNascimento))
          : null
        //atualiza campos
        abrigado['idade'] = this.getAge(abrigado)
        abrigado.abrigoNome ? abrigado.abrigoNome : this.getShelters(abrigado.abrigoId)

        return {
          ...abrigado,
          isCollapsed: false,
        }
      })
      .filter((abrigado) => {
        if (allowMenorIdade) return true
        return abrigado['idade'] >= 18
      })

    this.abrigados = this.abrigados.sort((a: Abrigado, b: Abrigado) => {
      return (
        a.abrigoNome?.toUpperCase().localeCompare(b.abrigoNome?.toUpperCase()) ||
        a.nome?.toUpperCase().localeCompare(b.nome?.toUpperCase())
      )
    })

    this.listaFiltrada = this.abrigados
    this.totalItems = this.abrigados.length

    for (let abrigado of this.abrigados) {
      if (abrigado.menor?.length > 0) {
        abrigado.listaMenor = abrigado.menor
      } else if (abrigado.acompanhante?.length > 0 && abrigado.acompanhante[0].nome !== null) {
        abrigado.listaMenor = abrigado.acompanhante
      } else {
        abrigado.listaMenor = []
      }
    }

    this.totalPages = Math.ceil(this.listaFiltrada.length / this.itemsPerPage)
    this.fetchAbrigos()
    this.loaderService.hide()
  }

  getShelters(abrigoId) {
    let shelterName = ''
    for (let abrigo of this.abrigos) {
      if (abrigo.id === abrigoId) {
        shelterName = abrigo.nome
      }
    }
    return shelterName
  }

  isChild(abrigado) {
    // Verifica data de Nascimento
    if (abrigado.dataNascimento !== null) {
      let dateAtual = new Date()
      let dateBirth = new Date(abrigado.dataNascimento)
      let diff = dateAtual.getTime() - dateBirth.getTime()
      let age = diff / (1000 * 60 * 60 * 24 * 365.25)

      return age < 18
    } else {
      // Verfica se tem idade no nome
      if (abrigado.nome === null) return false

      let nome = abrigado.nome
      let regex = /\d+/
      let age = nome.match(regex)
      let result = age ? parseInt(age[0]) : -1

      return result < 18
    }
  }

  getAge(abrigado) {
    if (abrigado.dataNascimento && abrigado.dataNascimento !== '') {
      let dateAtual = new Date()
      let dateBirth = new Date(abrigado.dataNascimento)
      let diff = dateAtual.getTime() - dateBirth.getTime()
      let age = diff / (1000 * 60 * 60 * 24 * 365.25)
      return !isNaN(Math.floor(age)) ? Math.floor(age) : '-'
    } else {
      if (!abrigado.nome) return null

      let nome = abrigado.nome
      let regex = /\d+/
      let age = nome.match(regex)
      let result = age && age[0] ? parseInt(age[0]) : null

      if (result > 120) return null

      return result ? result : '-'
    }
  }

  toggleCollapse(abrigado: AbrigadoWithCollapse): void {
    abrigado.isCollapsed = !abrigado.isCollapsed
  }

  search(event: Event): void {
    const searchValue = removeAccents(event.target['value'][0])

    if (this.timeoutSearch) clearTimeout(this.timeoutSearch)

    this.timeoutSearch = setTimeout(() => {
      if (searchValue) {
        this.busca = searchValue
        this.listaFiltrada = this.abrigados.filter((abrigado) => {
          const nome = removeAccents(abrigado.nome?.toLowerCase().trim())
          const abrigo = removeAccents(abrigado.abrigoNome?.toLowerCase().trim())
          const cpf = abrigado.cpf instanceof Array ? abrigado.cpf[0] : abrigado.cpf
          const cpfLimpo = cpf?.replace(/[^0-9]/g, '')

          return (
            nome?.includes(searchValue.toLowerCase().trim()) ||
            abrigo?.includes(searchValue.toLowerCase().trim()) ||
            cpf?.includes(searchValue) ||
            cpfLimpo?.includes(searchValue)
          )
        })

        if (this.listaFiltrada.length > 0) {
          this.listaFiltrada = this.listaFiltrada.map((abrigado) => {
            if (abrigado.menor) {
              const existeMenor = abrigado.menor.filter(
                (menor) => menor.nome !== null || menor.dataNascimento !== null || menor.grauParentesco !== null
              )
              if (!existeMenor.length) {
                abrigado.menor = []
              }
            }

            return { ...abrigado, isCollapsed: false }
          })
        }
        this.getQtdItems()
      } else {
        //this.busca = null
        //TODO: Implementar regras pra quando não for usuario comum
        //if (this.usuario.isAdmin) {
        //  this.listaFiltrada = this.abrigados
        //} else {
        this.listaFiltrada = this.abrigados
        //}
      }
    }, 1000)
  }

  trackAbrigados(abrigado) {
    return abrigado.id
  }

  shelterSortTable() {
    this.shelterOrder = !this.shelterOrder
    this.abrigados = this.abrigados.sort((a, b) => {
      const nomeA = a.abrigoNome ? a.abrigoNome.toUpperCase() : ''
      const nomeB = b.abrigoNome ? b.abrigoNome.toUpperCase() : ''

      if (this.shelterOrder) {
        return nomeA.localeCompare(nomeB)
      } else {
        return nomeB.localeCompare(nomeA)
      }
    })
  }

  nameSortTable() {
    this.nameOrder = !this.nameOrder
    this.abrigados = this.abrigados.sort((a, b) => {
      const nomeA = a.nome ? a.nome.toUpperCase() : ''
      const nomeB = b.nome ? b.nome.toUpperCase() : ''

      if (this.nameOrder) {
        return nomeA.localeCompare(nomeB)
      } else {
        return nomeB.localeCompare(nomeA)
      }
    })
  }

  getParentesco(parentesco) {
    if (parentesco === 0) {
      return 'Pai'
    } else if (parentesco === 1) {
      return 'Mãe'
    } else if (parentesco === 2) {
      return 'Irmão / Irmã'
    } else if (parentesco === 3) {
      return 'Filho / Filha'
    } else if (parentesco === 4) {
      return 'Cônjuge'
    } else if (parentesco === 5) {
      return 'Outro'
    }
    return parentesco
  }

  exportToExcel() {
    let abrigados = []

    for (let i = 0; i < this.abrigados.length; i++) {
      let abrigado = {
        nome: this.abrigados[i].nome,
        cpf: this.formateCPF(this.abrigados[i].cpf),
        data_nascimento: this.abrigados[i].dataNascimento,
        idade: this.getAge(this.abrigados[i]),
        nome_abrigo: this.abrigados[i].abrigoNome,
        endereco: this.abrigados[i].endereco,
        cadastro: this.convertFirestoreTimestampToDate(this.abrigados[i].create_in),
      }

      abrigados.push(abrigado)
    }

    let dateAtual = new Date()
    let day = String(dateAtual.getDate()).padStart(2, '0')
    let month = String(dateAtual.getMonth() + 1).padStart(2, '0') // Adicionamos +1 ao mês porque o método getMonth retorna de 0 a 11
    let year = dateAtual.getFullYear()
    let concateDate = day + '_' + month + '_' + year
    this.excelService.exportToExcel(abrigados, `lista_abrigados_${concateDate}.xlsx`)
  }

  convertFirestoreTimestampToDate(timestamp) {
    if (!timestamp) return null
    const data = new Date(timestamp.seconds * 1000)

    if (isNaN(data.getTime())) {
      return ''
    }

    const day = String(data.getDate()).padStart(2, '0')
    const month = String(data.getMonth() + 1).padStart(2, '0') // Adicionamos +1 ao mês porque o método getMonth retorna de 0 a 11
    const year = data.getFullYear()
    const hout = String(data.getHours()).padStart(2, '0')
    const minute = String(data.getMinutes()).padStart(2, '0')
    const second = String(data.getSeconds()).padStart(2, '0')

    return `${day}/${month}/${year} ${hout}:${minute}:${second}`
  }

  formateCPF(cpf) {
    if (typeof cpf !== 'string') return ''
    cpf = cpf.replace(/\D/g, '')
    const visiblePart = cpf.slice(-6)
    cpf = `***.${visiblePart.slice(0, 3)}.${visiblePart.slice(3, 6)}-**`

    return cpf
  }

  formateMaskDate(date) {
    if (!date) return ''
    let data = new Date(date)
    let day = String(data.getDate()).padStart(2, '0')
    let month = String(data.getMonth() + 1).padStart(2, '0') // Adicionamos +1 ao mês porque o método getMonth retorna de 0 a 11
    let year = data.getFullYear()
    return `${day}/${month}/${year}`
  }

  get currentPageItems(): AbrigadoWithCollapse[] {
    const start = (this.currentPage - 1) * this.itemsPerPage
    const end = start + this.itemsPerPage
    return this.listaFiltrada.slice(start, end)
  }

  handlePageChange(newPage: number) {
    this.currentPage = newPage
    // Atualize a lista de itens exibidos aqui
  }

  handleItemsPerPageChange(newItemsPerPage: number) {
    this.itemsPerPage = newItemsPerPage
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage)
    this.currentPage = 1 // Reset the current page to 1
  }

  getQtdItems() {
    this.totalItems = this.listaFiltrada.length
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage)
  }

  showModalAbrigadosCheckout: boolean
  selectedAbrigadoCheckout: Abrigado
  checkout(abrigado: Abrigado) {
    this.showModalAbrigadosCheckout = true
    this.selectedAbrigadoCheckout = abrigado
  }

  closeModalAbrigados(close: boolean) {
    this.showModalAbrigadosCheckout = false
  }

  addAbrigado(abrigoId: string = null) {
    if (abrigoId) {
      this.router.navigate([ABRIGADO.BASE, abrigoId])
    } else {
      this.router.navigate([ABRIGADO.BASE])
    }
  }

  fetchAbrigos() {
    this.abrigosMapped = [{ value: '-1', label: 'Todos' }]
    this.abrigos.forEach((abrigo) => {
      this.abrigosMapped.push({
        value: abrigo.id.toString(), // Certifique-se de que o valor seja uma string
        label: abrigo.nome,
      })
    })
  }

  onAbrigoChange(event: any) {
    if (event.detail?.[0].length === 0) return
    const selectedItemValue = event.detail?.[0]?.value
    this.filterTableByAbrigo(selectedItemValue)
  }

  filterTableByAbrigo(abrigoId: string) {
    if (abrigoId == '-1') {
      this.listaFiltrada = this.abrigados
      this.getQtdItems()
      return
    }

    this.listaFiltrada = this.abrigados.filter((abrigado) => {
      return abrigado?.abrigoId == abrigoId
    })
    this.getQtdItems()
  }

  interpolacaoData(data: any): string {
    return data?.indexOf('NaN') > -1 ? '' : data
  }

  formatarNomeProprio(value: string): string {
    if (!value) return ''

    value = value.trim().toLowerCase()
    let palavras = value.split(' ').filter((item) => item.trim().length > 0)

    for (let i = 0; i <= palavras.length - 1; i++) {
      const inicial = palavras[i].substring(0, 1).toUpperCase()
      palavras[i] = inicial + palavras[i].substring(1)
    }

    return palavras.join(' ')
  }
}
