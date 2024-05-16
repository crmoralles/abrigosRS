import axios from 'axios'

export class MunicipiosService {
  static async getMunicipios() {
    // 'https://servicodados.ibge.gov.br/api/v1/localidades/estados/43/municipios'
    const result = await axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados/43/municipios')
    return result.data.map((citie: any) => citie.nome)
  }

  static async getMunicipiosList() {
    return await MunicipiosService.getMunicipios().then((cidades) => {
      return cidades.map((cidade) => ({
        value: cidade,
        label: cidade,
        selected: cidade === 'Porto Alegre',
      }))
    })
  }
}
