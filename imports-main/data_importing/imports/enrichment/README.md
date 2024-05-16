# Enrichment

## CPF enricher

Serviço: SERPO
Serviço: https://apicenter.estaleiro.serpro.gov.br/

#### Informações técnicas

| Informação                             | Detalhe                                                          |
| :------------------------------------- | :--------------------------------------------------------------- |
| Body com o tipo fluxo de autenticação  | grant_type=client_credentials                                    |
| Autenticação BASIC                     | base64(consumer_key:consumer_secret)                             |
| Header de autenticação                 | "Authorization: Basic **_base64(consumer_key:consumer_secret)_** |
| Header de content-type na autenticação | Content-Type: application/x-www-form-urlencoded                  |
| Route: /consulta-cpf/v1/cpf/{cpf}      | Busca as informações de um CPF.                                  |
| Reoute: /consulta-cpf/v1/status/       | Retorna o status da API de consulta.                             |

#### Códigos de retorno

| Código                            | Descrição                                                                                                                                                                             |
| :-------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 200 OK                            | Tudo funcionou como esperado e a validação dos dados foi realizada com sucesso.                                                                                                       |
| 206 Conteúdo Parcial              | As informações foram retornadas, mas não completamente.                                                                                                                               |
| 400 Requisição Inválida           | O número de CPF informado não é válido.                                                                                                                                               |
| 401 Não Autorizado                | Problemas durante a autenticação.                                                                                                                                                     |
| 403 Proibido                      | Este erro ocorre quando há algum caminho errado na requisição. Certifique-se de chamar a API da seguinte forma: "https://gateway.apiserpro.serpro.gov.br/consulta-cpf-df/v1/cpf/{ni}" |
| 404 Não Encontrado                | Não existe CPF com o número de inscrição informado.                                                                                                                                   |
| 422 LGPD: Dados de Menor de Idade | Dados de menor de idade bloqueados em atendimento à Lei Geral de Proteção de Dados - LGPD.                                                                                            |
| 504 Time-out                      | Tempo Esgotado do Gateway                                                                                                                                                             |
