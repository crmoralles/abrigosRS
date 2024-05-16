import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  constructor(private _http: HttpClient) {}
  buscarEnderecoPorCep(cep: string, formatarEndereco: boolean): Promise<any> {
    function formatAddress(data: any): string {
      if (data.erro) return ''
      return `${data.logradouro}, ${data.complemento ? data.complemento + ', ' : ''}${data.bairro}, ${data.localidade} - ${data.uf}, CEP: ${data.cep}`
    }

    return new Promise<any>((res, rej) => {
      const cepNumerico = cep.replace(/\D/g, '')

      this._http.get<any>(`https://viacep.com.br/ws/${cepNumerico}/json/`).subscribe(
        (data) => {
          if (formatarEndereco)
            res({
              endereco: formatAddress(data),
              cidade: data.localidade,
            })
          else
            res({
              cep: data.cep,
              endereco: data.logradouro,
              complemento: data.complemento,
              bairro: data.bairro,
              cidade: data.localidade,
              uf: data.uf,
            })
        },
        (error) => {
          console.error('Erro ao buscar endereço:', error)
        }
      )
    })
  }
}
