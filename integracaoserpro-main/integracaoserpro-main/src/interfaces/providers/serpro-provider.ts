import axios from "axios";

import { CPF } from "../../entities/cpf";

export interface SerproProvider {
  consultCPF: (cpf_number: string) => Promise<{
    nome: string;
    nascimento: string;
    situacaoCodigo: string;
    situacaoDescricao: string;
  }>;
}

const axiosInstance = axios.create({
  baseURL: "https://gateway.apiserpro.serpro.gov.br/"
});

export class SerproHelper {
  async obterToken() {
    try {
      const params = new URLSearchParams();
      params.append('grant_type', 'client_credentials');

      const { data } = await axiosInstance.post('/token', params, {
        headers: {
          'Authorization': `Basic ${process.env.SERPRO_BEARER_TOKEN}`
        }
      });

      return data.access_token;
    } catch(err: any) {
      if (!err.response) {
        throw err;
      }

      if (!err.response.status) {
        throw new Error("Erro ao obter token de acesso.");
      }
    }
  }
}

export const serproProvider: SerproProvider = {
  consultCPF: async (cpf_number: string) => {
    try {
      const serproHelper = new SerproHelper();
      const token = await serproHelper.obterToken();

      const { data } = await axiosInstance.get(`/consulta-cpf-df/v1/cpf/${cpf_number}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return {
        nome: data.nome,
        nascimento: data.nascimento,
        situacaoCodigo: data.situacao.codigo,
        situacaoDescricao: data.situacao.descricao
      };
    } catch (err: any) {
      if (!err.response) {
        throw err;
      }

      if (!err.response.status) {
        throw new Error("Erro ao se comunicar com a Serpro.");
      }

      throw err;
    }
  },
};
