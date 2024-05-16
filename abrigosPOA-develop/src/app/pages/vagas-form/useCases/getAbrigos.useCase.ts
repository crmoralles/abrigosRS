import { Injectable } from '@angular/core'
import { Abrigo, AbrigoService } from 'src/app/core/services/repository/abrigo.service'
import AbrigoDTO from '../DTOs/AbrigoDTO'

@Injectable({
  providedIn: 'root',
})
export class GetAbrigoUseCase {
  constructor(private readonly abrigoService: AbrigoService) {}

  async run(): Promise<AbrigoDTO[]> {
    const abrigos = await (await this.abrigoService.getAbrigos()).toPromise()
    const abrigosFormValues: AbrigoDTO[] = abrigos?.map<AbrigoDTO>((abrigo) => ({
      id: abrigo.id,
      nome: abrigo.nome,
      endereco: {
        cep: abrigo.cep,
        rua: abrigo.address,
        cidade: abrigo.city,
      },
      ponto_referencia: abrigo.ponto_referencia ?? '',
      orientacao_acesso: abrigo.orientacao_acesso ?? '',
      nome_gestor: abrigo.nome_contato,
      telefone_gestor: abrigo.telefone,
      equipe_apoio: abrigo.equipe_apoio ?? [],
      vagas_info: {
        vaga_mulher: !!abrigo.vagas_mulher,
        vaga_mulher_quantidade: abrigo.vagas_mulher,
        vaga_mulher_quantidade_ocupadas: abrigo.vagas_mulher_ocupadas,
        vaga_pets: !!abrigo.vagas_pet,
        vaga_pets_quantidade: abrigo.vagas_pet,
        vaga_pets_quantidade_ocupadas: abrigo.vagas_pet_ocupadas,
        vagas_totais: abrigo.vagas,
        vagas_ocupadas: abrigo.vagas_ocupadas,
      },
      atendimento_info: abrigo.atendimento_info,
      infra_info: {
        ...abrigo.infra_info,
        banheiros: abrigo.banheiros,
      },
      local_info: {
        tipo_local: abrigo.tipo,
        classificacao_local: abrigo.classificacao_local,
        classificacao_local_outro: abrigo.classificacao_local_outro,
        tipo_abrigo: typeof abrigo.abrigopm === 'boolean' ? ['Abrigo Rede Prefeitura'] : abrigo.abrigopm,
      },
      itensUteis: abrigo.itensUteis,
      observations: abrigo.observations,
      update_in: abrigo.update_in,
      ativo: abrigo.ativo !== undefined ? abrigo.ativo : true,
    }))

    return abrigosFormValues
  }

  async run2(): Promise<Abrigo[]> {
    return await (await this.abrigoService.getAbrigos()).toPromise()
  }
}
