import { ItemUteis } from 'src/app/core/services/repository/abrigo.service'

interface Endereco {
  cep?: string
  rua: string
  cidade: string
}

export interface EquipeApoio {
  apoio_responsavel: string
  apoio_telefone: string
}

interface VagasInfo {
  vagas_totais: number
  vagas_ocupadas: number
  vaga_mulher: boolean
  vaga_mulher_quantidade: number
  vaga_mulher_quantidade_ocupadas: number
  vaga_pets: boolean
  vaga_pets_quantidade: number
  vaga_pets_quantidade_ocupadas: number
}

interface LocalInfo {
  tipo_local?: string[]
  classificacao_local?: string
  classificacao_local_outro?: string
  tipo_abrigo?: string[]
}

export interface InfraInfo {
  cozinha: boolean
  metragem: string
  banheiros: number
  colchoes: number
  chuveiros: number
  acessibilidade: string
  fornecimento_agua: boolean
  obs_agua: string
  fornecimento_eletrica: boolean
  obs_eletrica: string
  gerador: boolean
  climatizacao: string
  enfermaria: boolean
}

export interface AtendimentoInfo {
  qtd_voluntarios: number
  atendimento: boolean
  apoio_medico: string[]
  medicamentos: boolean
  apoio_medicamentos: string
}

export default interface AbrigoDTO {
  id?: string
  nome: string
  endereco: Endereco
  ponto_referencia: string
  orientacao_acesso: string
  nome_gestor: string
  telefone_gestor: string
  equipe_apoio: EquipeApoio[]
  vagas_info: VagasInfo
  local_info: LocalInfo
  infra_info: InfraInfo
  atendimento_info: AtendimentoInfo
  itensUteis: ItemUteis[]
  observations: string
  update_in?: string
  ativo: boolean
}
