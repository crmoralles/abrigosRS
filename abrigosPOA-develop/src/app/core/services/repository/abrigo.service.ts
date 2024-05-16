import { Injectable } from '@angular/core'
import { Params } from '@angular/router'
import { Observable } from 'rxjs'
import { AtendimentoInfo, EquipeApoio, InfraInfo } from 'src/app/pages/vagas-form/DTOs/AbrigoDTO'
import { COLLECTION_NAMES } from '../../../shared/constants/collections.const'
import { AuthorizationService } from '../authorization.service'
import { FirestoreService } from './firebase/firestore.service'

export interface ItemUteis {
  item: string
  quantidade: number
  type: string
}

export interface Abrigo {
  id?: string
  tipo?: string[]
  classificacao_local?: string
  classificacao_local_outro?: string
  nome?: string
  pmpa?: string
  abrigopm?: string[]
  nome_contato?: string
  telefone?: string
  vagas?: number
  vagas_ocupadas?: number
  vagas_mulher?: number
  vagas_mulher_ocupadas?: number
  vagas_pet?: number
  vagas_pet_ocupadas?: number

  abrigadosRegistrados?: number

  demanda?: string
  roupa_cama?: string
  banheiros?: number

  colchoes?: number
  marmita?: number
  insumos_refeicao?: boolean
  cozinha?: boolean
  estrutura_pessoas?: string
  cep?: string
  city?: string
  address?: string
  ponto_referencia?: string
  orientacao_acesso?: string
  equipe_apoio?: EquipeApoio[]
  atendimento_info?: AtendimentoInfo
  infra_info?: InfraInfo
  latitude?: number
  longitude?: number
  observations?: string
  update_in?: any
  create_in?: any
  itensUteis?: ItemUteis[]
  ativo?: boolean
}

@Injectable({
  providedIn: 'root',
})
export class AbrigoService extends FirestoreService {
  private unsubscribes: any = {}

  constructor(private authorizationService: AuthorizationService) {
    super()
    this.setCollectionRef(COLLECTION_NAMES.ABRIGO)
  }

  unsubscribe(funcName: string) {
    if (this.unsubscribes[funcName]) {
      this.unsubscribes[funcName]()
    }
  }

  unsubscribeAll() {
    const funcs = Object.keys(this.unsubscribes)
    funcs.forEach((item) => {
      this.unsubscribes[item]
    })
  }

  getAbrigos(filter: Params = null) {
    return new Observable<Abrigo[]>((obs) => {
      this.authorizationService.getFiltroAcessarAbrigos().then((roleFilter) => {
        const params: Params = {
          ...{
            orders: [
              {
                fieldPath: 'nome',
                direction: 'asc',
              },
            ],
          },
          ...filter,
          ...roleFilter,
        }

        let q = this.getQuery(params)

        this.unsubscribes[`getAbrigos`] = this.onSnapshot(q, (querySnapshot) => {
          const docs = querySnapshot.docs.map((doc) => {
            const abrigo = doc.data() as Abrigo
            abrigo.update_in = this.convertDatetime(abrigo.update_in)
            abrigo.create_in = this.convertDatetime(abrigo.create_in)
            return abrigo
          })

          obs.next(docs)
          obs.complete()
        })
      })
    })
  }

  getCityToFilter(abrigos: Abrigo[], showItemAll: boolean = true) {
    let citieOptions: {
      value: string
      label: string
      selected: boolean
    }[] = []

    if (showItemAll)
      citieOptions.push({
        value: '- Todos -',
        label: '- Todos -',
        selected: true,
      })

    function addCityToFilter(city: string) {
      if (!city) return
      if (citieOptions.filter((c) => c.value === city).length === 0) {
        citieOptions = [...citieOptions, { value: city, label: city, selected: false }]
        citieOptions = citieOptions.sort((a, b) => {
          try {
            return a.label?.localeCompare(b.label)
          } catch (ex) {
            return 0
          }
        })
      }
    }

    abrigos.forEach((abrigo) => addCityToFilter(abrigo.city))
    return citieOptions
  }
}
