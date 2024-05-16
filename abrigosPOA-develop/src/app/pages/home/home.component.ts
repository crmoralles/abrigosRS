import { Component, inject } from '@angular/core'
import { Analytics } from '@angular/fire/analytics'
import { Router } from '@angular/router'

import { BehaviorSubject, Subscription } from 'rxjs'
import { AuthorizationService } from 'src/app/core/services/authorization.service'
import { AbrigadosService } from 'src/app/core/services/repository/abrigados.service'
import { Abrigo, AbrigoService, ItemUteis } from 'src/app/core/services/repository/abrigo.service'
import { AuthService } from 'src/app/core/services/repository/firebase/auth.service'
import { LGDPTermsService } from 'src/app/core/services/repository/lgdpTerms.service'
import { LoaderService } from 'src/app/shared/components/loader/loader.service'
import { ABRIGADO } from 'src/app/shared/constants/routes.const'

export class Totalizadores {
  city: string
  totalVagas: number
  totalOcupadas: number
  totalLivre: number
  totalOcupacao: number
  totalOcupacaoColor: string
  superLotado: boolean

  totalColchoes?: number
  totalMarmitas?: number
}

const VALOR_SEM_CIDADE = ' Sem cidade informada'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  private unsub: Subscription
  public abrigos: Abrigo[] = []
  public abrigo: Abrigo

  public totalVagas: number = 0
  public totalOcupada: number = 0
  public totalLivre: number = 0
  public totalColchoes: number = 0
  public totalMarmitas: number = 0
  public totalOcupacao: number = 0
  public superLotado: boolean = false
  public totalOcupacaoColor: string = 'green'
  public listaFiltrada: Abrigo[] = []
  public totalizadorPorCidade: Totalizadores[]

  public currentPage: number = 1
  public itemsPerPage: number = 9
  public totalPages: number = 0
  public totalItems: number = 0

  public citieOptions: {
    value: string
    label: string
    selected: boolean
  }[] = [
    {
      value: '- Todos -',
      label: '- Todos -',
      selected: true,
    },
    {
      value: VALOR_SEM_CIDADE,
      label: '- Sem cidade informada -',
      selected: false,
    },
  ]

  public busca = null
  public selectedCity: Totalizadores
  public totalizadorGeral: Totalizadores
  public showSection: boolean = false

  private timeout: any
  private refreshInterval: any
  private analytics: Analytics = inject(Analytics)

  loadSearch = new BehaviorSubject(false)

  constructor(
    private abrigoService: AbrigoService,
    private abrigadoService: AbrigadosService,
    private LGPD: LGDPTermsService,
    private authService: AuthService,
    public authorizationService: AuthorizationService,
    private router: Router,
    private loaderService: LoaderService
  ) {}

  async ngOnInit() {
    this.loaderService.show()
    this.startAutomaticRefresh()
  }

  toggleSection() {
    this.showSection = !this.showSection
  }

  calcOcupacaoCor(totalOcupacao) {
    return totalOcupacao < 50 ? 'green' : this.totalOcupacao < 80 ? 'orange' : 'red'
  }

  getOccupationPercentage(abrigo: any) {
    abrigo['vagas_ocupacao'] = abrigo['vagas_ocupacao'].replace(/[^\d.]/g, '')
    const ocupacaoString = abrigo['vagas_ocupacao'] || '0'
    const numericValue = ocupacaoString.replace(/[^\d.]/g, '')
    return parseFloat(numericValue).toFixed(2) || 0.0
  }

  totalizaColchoes(abrigo) {
    if (!abrigo.itensUteis) return 0
    console.log(abrigo.itensUteis)
    const colchoes = abrigo.itensUteis.filter((x) => (x.item ? x.item?.toLowerCase().startsWith('colc') : false))
    const sumColchoes = colchoes.reduce((acc, cur) => acc + Number(cur.quantidade), 0)
    return sumColchoes
  }

  totalizaMarmitas(abrigo) {
    if (!abrigo.itensUteis) return 0
    const marmitas = abrigo.itensUteis.filter((x) => (x.item ? x.item?.toLowerCase().startsWith('marmita') : false))
    const sumMarmitas = marmitas.reduce((acc, cur) => acc + Number(cur.quantidade), 0)
    return sumMarmitas
  }

  groupByCity(abrigos) {
    const VALOR_SEM_CIDADE = 'Sem cidade'
    const totalizer = []

    abrigos.forEach((abrigo) => {
      const city = abrigo.city || VALOR_SEM_CIDADE
      let cityTotalizer = totalizer.find((c) => c.city === city)

      if (!cityTotalizer) {
        cityTotalizer = {
          city: city,
          totalVagas: 0,
          totalOcupadas: 0,
          totalLivre: 0,
          totalOcupacao: 0,
          totalOcupacaoColor: '',
          superLotado: false,
          totalColchoes: 0,
          totalMarmitas: 0,
        }
        totalizer.push(cityTotalizer)
      }

      cityTotalizer.totalVagas += isNaN(Number(abrigo.vagas)) ? 0 : Number(abrigo.vagas)
      cityTotalizer.totalOcupadas += isNaN(Number(abrigo.vagas_ocupadas)) ? 0 : Number(abrigo.vagas_ocupadas)
      cityTotalizer.totalLivre = cityTotalizer.totalVagas - cityTotalizer.totalOcupadas
      cityTotalizer.totalOcupacao = (cityTotalizer.totalOcupadas / cityTotalizer.totalVagas) * 100 || 0
      cityTotalizer.totalOcupacaoColor = this.calcOcupacaoCor(cityTotalizer.totalOcupacao)
      cityTotalizer.superLotado = cityTotalizer.totalOcupacao > 100
      cityTotalizer.totalColchoes += this.totalizaColchoes(abrigo)
      cityTotalizer.totalMarmitas += this.totalizaMarmitas(abrigo)
    })

    return totalizer.sort((a, b) => (a.city || '').localeCompare(b.city || ''))
  }

  startAutomaticRefresh() {
    //só faz a segunda chamada depois de retornar a primeira
    this.fetchAbrigos().then(() => {
      setTimeout(() => {
        this.startAutomaticRefresh()
      }, 300000)
    })
  }

  async fetchAbrigos() {
    this.unsub = this.abrigoService.getAbrigos().subscribe((abrigos) => {
      this.totalVagas = abrigos.reduce((acc, cur) => acc + Number(cur.vagas || 0), 0)
      this.totalLivre = abrigos.reduce((acc, cur) => acc + Number(cur.vagas || 0) - Number(cur.vagas_ocupadas || 0), 0)
      this.totalOcupada = this.totalVagas - this.totalLivre
      this.totalOcupacao = (this.totalOcupada / this.totalVagas) * 100
      this.totalOcupacaoColor = this.calcOcupacaoCor(this.totalOcupacao)
      this.superLotado = this.totalOcupacao > 100

      // Procurar por colchões e marmitas dessa maneira não é ideal, mas infelizmente é o que consigo por hora
      this.totalColchoes = abrigos.reduce((acc, cur) => {
        return acc + this.totalizaColchoes(cur)
      }, 0)

      this.totalMarmitas = abrigos.reduce((acc, cur) => {
        return acc + this.totalizaMarmitas(cur)
      }, 0)

      this.totalizadorGeral = {
        city: null,
        superLotado: this.superLotado,
        totalLivre: this.totalLivre,
        totalOcupacao: this.totalOcupacao,
        totalOcupadas: this.totalOcupada,
        totalOcupacaoColor: this.totalOcupacaoColor,
        totalVagas: this.totalVagas,
        totalColchoes: this.totalColchoes,
        totalMarmitas: this.totalMarmitas,
      }

      this.selectedCity = this.totalizadorGeral

      this.abrigos = abrigos.map((abrigo: Abrigo) => {
        let ocupacao = (abrigo.vagas_ocupadas / abrigo.vagas) * 100
        abrigo['vagas_ocupacao_color'] = this.calcOcupacaoCor(ocupacao)
        abrigo['vagas_super_lotado'] = ocupacao > 100
        if (ocupacao > 100) ocupacao = 100
        abrigo['vagas_ocupacao'] = `${ocupacao.toString()}%`

        if (Array.isArray(abrigo.city as any)) {
          abrigo.city = abrigo.city[0]
        }

        return abrigo
      })
      this.citieOptions = this.abrigoService.getCityToFilter(abrigos)

      this.totalizadorPorCidade = this.groupByCity(abrigos)

      this.listaFiltrada = !this.busca
        ? abrigos
        : this.abrigos.filter(
            (abrigo) =>
              abrigo?.nome?.toString().toLowerCase().trim().includes(this.busca.toLowerCase().trim()) ||
              abrigo?.address?.toString().toLowerCase().trim().includes(this.busca.toLowerCase().trim())
          )

      this.countVisibleAbrigados()

      this.loaderService.hide()
    })
  }

  async countVisibleAbrigados() {
    const start = (this.currentPage - 1) * this.itemsPerPage
    const end = start + this.itemsPerPage

    const items = this.listaFiltrada.slice(start, end)

    try {
      items?.forEach(async (abrigo) => {
        if (!abrigo.abrigadosRegistrados && isNaN(abrigo.abrigadosRegistrados) && abrigo.id) {
          const count = await this.abrigadoService.count({
            where: [{ key: 'abrigoId', condition: '==', value: abrigo.id }],
          })
          abrigo.abrigadosRegistrados = count
        }
      })
    } catch (error) {
      console.error('error->countAbrigados()', error)
    }
  }

  ngOnDestroy() {
    clearInterval(this.refreshInterval)
    this.unsub?.unsubscribe()
    this.abrigoService.unsubscribe(`getAbrigos`)
  }

  addAbrigado(abrigoId: string = null) {
    if (abrigoId) {
      this.router.navigate([ABRIGADO.BASE, abrigoId])
    } else {
      this.router.navigate([ABRIGADO.BASE])
    }
  }

  itensUteis(id: string) {
    this.abrigoService.get(id).then((res) => {
      this.abrigo = res
      this.openModal()
    })
  }

  openModal() {
    const modal = document.getElementById('myModal')
    modal.style.display = 'block'
  }

  closeModal() {
    const modal = document.getElementById('myModal')
    modal.style.display = 'none'
  }

  getTitles(columnsToExport) {
    return columnsToExport.map((c) => `"${c}"`).join(';') // cabeçalhos
  }

  getContentItensUteis(itensUteis: ItemUteis[]) {
    if (itensUteis && itensUteis.length) {
      const content = itensUteis.reduce((content, item) => (content += `${item.item}, Qtd: ${item.quantidade}\n`), '')
      return `"${content}"`
    }
    return ''
  }

  getContent(columnsToExport) {
    return this.abrigos
      .map((e) =>
        columnsToExport.map((cn) => (cn === 'itensUteis' ? this.getContentItensUteis(e[cn]) : `"${e[cn]}"`)).join(';')
      )
      .join('\n') // corpo do csv já formatado
  }

  downloadCSV(csvContent) {
    const link = document.createElement('a')
    link.setAttribute('href', 'data:text/csv;charset=utf-8,\uFEFF' + encodeURIComponent(csvContent))
    link.setAttribute('download', `abrigos.csv`)
    document.body.appendChild(link) // Required for FF

    // simula o click no link para iniciar o download
    link.click()
    document.body.removeChild(link)
  }

  exportAbrigos() {
    const columnsToExport = Object.getOwnPropertyNames(this.abrigos[0])
    let csvContent = this.getTitles(columnsToExport) + '\n' + this.getContent(columnsToExport)
    this.downloadCSV(csvContent)
  }

  limparLGPD() {
    this.LGPD.clearSigned(this.authService.currentUser.uid)
  }

  search(event: Event): void {
    clearTimeout(this.timeout)
    this.loadSearch.next(true)
    this.timeout = setTimeout(() => {
      this.searchAbrigo(event)
    }, 500)
  }

  searchAbrigo(event): void {
    let searchValue = event.detail[0]

    this.busca = searchValue ? searchValue.tim() : null
    this.updateList(
      this.busca
        ? this.abrigos.filter(
            (abrigo) =>
              abrigo?.nome?.toString()?.toLowerCase()?.trim()?.includes(searchValue.toLowerCase().trim()) ||
              abrigo?.address?.toString()?.toLowerCase()?.trim()?.includes(searchValue.toLowerCase().trim())
          )
        : this.abrigos
    )

    this.loadSearch.next(false)
  }

  changeSelectCityFilter(event: any) {
    const value = event.detail?.[0]?.value
    if (value === '- Todos -') {
      this.updateList(this.abrigos)
      this.selectedCity = this.totalizadorGeral
    } else if (value === VALOR_SEM_CIDADE) {
      this.updateList(this.abrigos.filter((abrigo) => abrigo.city === null || abrigo.city === undefined))
      this.selectedCity = this.totalizadorPorCidade.filter((total) => total.city === value)[0]
    } else {
      this.updateList(this.abrigos.filter((abrigo) => abrigo.city === value))
      this.selectedCity = this.totalizadorPorCidade.filter((total) => total.city === value)[0]
    }
  }

  updateList(data: Abrigo[]) {
    this.listaFiltrada = data
    this.totalItems = this.listaFiltrada.length
    this.handleResetPagination()
  }

  handlePageChange(newPage: number) {
    this.currentPage = newPage

    this.countVisibleAbrigados()
  }

  handleItemsPerPageChange(newItemsPerPage: number) {
    this.itemsPerPage = newItemsPerPage
    this.handleResetPagination()
  }

  handleResetPagination() {
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage)
    this.currentPage = 1
  }

  get currentPageItems(): Abrigo[] {
    const start = (this.currentPage - 1) * this.itemsPerPage
    const end = start + this.itemsPerPage
    return this.listaFiltrada.slice(start, end)
  }
}
