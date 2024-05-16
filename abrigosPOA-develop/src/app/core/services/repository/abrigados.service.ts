import { Injectable } from '@angular/core'
import { COLLECTION_NAMES } from '../../../shared/constants/collections.const'
import { AuthorizationService } from '../authorization.service'
import { FirestoreService, Params } from './firebase/firestore.service'

export interface IAcompanhandoMenor {
  nome?: string
  grauParentesco?: string
  dataNascimento?: string
}

export interface HistoricoAbrigado {
  dataHora: any
  acao: string
  observacao: string
  transferidoParaAbrigoId: string
  create_in: any
}

export interface Abrigado {
  id?: string
  abrigoId?: string
  nome?: string
  nomeMae?: string
  dataNascimento?: string | Date | null
  dataEntrada?: string
  horaEntrada?: string
  endereco?: string
  genero?: string
  temDocumento?: boolean
  grupoFamiliar?: boolean
  acompanhadoMenor?: boolean
  menor: IAcompanhandoMenor[]
  temRenda?: boolean
  renda?: number
  temHabitacao?: boolean
  situacaoMoradia?: string
  necessidadesImediatas?: string
  cadastradoCadUnico?: boolean
  abrigoNome?: string
  //documentação
  tipoDocumento?: number
  cpf?: string | string[]
  rg?: string
  cnh?: string
  cep?: string
  codCadUnico?: string
  cidade?: string
  pessoaSozinha?: boolean
  acompanhante: AbrigadoAcompanhante[]
  alocado?: boolean
  status?: string
  historico?: HistoricoAbrigado[]
}

export interface AbrigadoAcompanhante {
  id?: string
  abrigadoId?: string
  nome?: string
  dataNascimento?: string
  grauParentesco?: number
  outroGrau?: string
}

@Injectable({
  providedIn: 'root',
})
export class AbrigadosService extends FirestoreService {
  constructor(private authorizationService: AuthorizationService) {
    super()

    this.setCollectionRef(COLLECTION_NAMES.ABRIGADO)
  }

  async getAbrigadoByCPF(cpf: string) {
    const abrigado = await this.load({
      where: [{ key: 'cpf', condition: '==', value: cpf }],
    })
    return abrigado
  }

  public override async load(params: Params = {}) {
    //filtrar abrigados pelo abrigo
    let filtraAbrigoVinculado = await this.authorizationService.getFiltroAcessarAbrigos()
    if (filtraAbrigoVinculado && filtraAbrigoVinculado.where && filtraAbrigoVinculado.where[0])
      filtraAbrigoVinculado.where[0].key = 'abrigoId'
    else filtraAbrigoVinculado = {}

    //TODO: ligar filtro menor 18 na origem
    // const roleFilter = this.authorizationService.getFiltroAcessarAbrigados()
    // const filter: Params = {
    //   ...params,
    //   ...roleFilter,
    // }

    return super.load(filtraAbrigoVinculado)
  }
}
