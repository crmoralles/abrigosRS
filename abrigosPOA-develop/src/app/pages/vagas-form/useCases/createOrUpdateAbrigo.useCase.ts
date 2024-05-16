import { Injectable } from '@angular/core'
import { Abrigo, AbrigoService } from 'src/app/core/services/repository/abrigo.service'
import AbrigoDTO from '../DTOs/AbrigoDTO'

interface InputPayload {
  formValues: AbrigoDTO
  abrigoId?: string
  update_in?: Date
}

@Injectable({
  providedIn: 'root',
})
export class CreateOrUpdateAbrigoUseCase {
  constructor(private readonly abrigoService: AbrigoService) {}

  async run({ formValues, abrigoId }: InputPayload) {
    const payload: Abrigo = {
      tipo: formValues.local_info.tipo_local ?? null,
      classificacao_local: formValues.local_info.classificacao_local ?? null,
      classificacao_local_outro: formValues.local_info.classificacao_local_outro ?? null,
      orientacao_acesso: formValues.orientacao_acesso || null,
      nome: formValues.nome ?? null,
      abrigopm: formValues.local_info.tipo_abrigo ?? null,
      nome_contato: formValues.nome_gestor ?? null,
      telefone: formValues.telefone_gestor ?? null,
      equipe_apoio: formValues.equipe_apoio ?? null,
      vagas: formValues.vagas_info.vagas_totais ?? null,
      vagas_ocupadas: formValues.vagas_info.vagas_ocupadas ?? null,
      vagas_mulher: formValues.vagas_info.vaga_mulher_quantidade ?? null,
      vagas_mulher_ocupadas: formValues.vagas_info.vaga_mulher_quantidade_ocupadas ?? null,
      vagas_pet: formValues.vagas_info.vaga_pets_quantidade ?? null,
      vagas_pet_ocupadas: formValues.vagas_info.vaga_pets_quantidade_ocupadas ?? null,
      banheiros: formValues.infra_info.banheiros ?? null,
      colchoes: formValues.infra_info.colchoes ?? null,
      cozinha: formValues.infra_info.cozinha ?? null,
      cep: formValues.endereco.cep ?? null,
      city: formValues.endereco.cidade ?? null,
      address: formValues.endereco.rua ?? null,
      ponto_referencia: formValues.ponto_referencia ?? null,
      atendimento_info: formValues.atendimento_info ?? null,
      infra_info: formValues.infra_info ?? null,
      itensUteis: formValues.itensUteis ?? null,
      observations: formValues.observations ?? null,
      ativo: formValues.ativo,
      update_in: formValues.update_in ?? null,
    }

    if (abrigoId) payload.id = abrigoId
    return this.abrigoService.addOrUpdate(payload)
  }
}
