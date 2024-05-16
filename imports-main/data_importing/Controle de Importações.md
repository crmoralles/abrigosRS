# Importações via template realizadas 
Notebook: import_template_loader.ipynb

### Importações concluídas
> **Collection: abrigado**
> 
| Operação | pipeline\1 - raw\processed                                         | pipeline\4 - processed                                                                   | Data Importação  |
| :------- | :----------------------------------------------------------------- | :--------------------------------------------------------------------------------------- | :--------------- |
| insert   | Cadastros  - Abrigados Elyseu (1).xlsx                             | cadastros_abrigados_elyseu_1.xlsx                                                        | 10/05/2024 06:00 |
| insert   | Cadastros Abrigos ADRA.pdf                                         | cadastros_abrigos_adra.xlsx                                                              | 10/05/2024 06:00 |
| insert   | Interno - Abrigo Julhinho NOVA.pdf                                 | interno_abrigo_julinho_nova.xlsx                                                         | 10/05/2024 07:06 |
| insert   | Familias SESC Protasio Alves_transformed.xlsx                      | familias_sesc_protasio_alves.xlsx                                                        | 10/05/2024 07:37 |
| insert   | RESGATADOS PONTAL - NOVA.xlsx                                      | resgatados_pontal_nova.xlsx                                                              | 10/05/2024 08:37 |
| insert   | Usuários no alojamento provisório 2024 AMURT-AMURTEL.xlsx          | usuarios_no_alojamento_provisorio_2024_amurt_amurtel.xlsx                                | 10/05/2024 19:51 |
| insert   | Abrigados CALAMIDADE POA 2024.google_sheets                        | abrigados_calamidade_poa_2024.google_sheets                                              | 10/05/2024 21:37 |
| insert   | Lista de Acolhidos CAJU.06 de maio.pdf                             | lista_de_acolhidos_caju_06_de_maio.xlsx                                                  | 11/05/2024 00:08 |
| insert   | Cadastro GERALDO SANTANA e Renascenca.xlsx                         | cadastro_geraldo_santana_e_renascenca.xlsx                                               | 11/05/2024 02:15 |
| insert   | ACOLHIMENTO PORTO ALEGRE PAROQUIA NOSSA SENHORA DE FATIMA (3).xlsx | acolhimento_porto_alegre_paroquia_nossa_senhara_de_fatima_3.xlsx                         | 11/05/2024 02:25 |
| insert   | Acolhimento Dona Alzira.xlsx                                       | acolhimento_dona_alzira.xlsx                                                             | 11/05/2024 02:34 |
| insert   | Abrigados_lindoia.xlsx - LISTA ATULIZADA EXPORT.pdf                | abrigados_lindoia_tenis_clube_ abrigados                                                 | 12/05/2024 04:52 |
| insert   | Controle dos desabrigados 04 de maio Santa Doroteia                | colegio_santa_doroteia_template_abrigados_abrigados.xlsx                                 | 11/05/2024 03:10 |
| insert   | Abrigados fapa - 09 mai - 14h30                                    | fapa_uni_ritter_template_abrigados_abrigados.xlsx                                        | 11/05/2024 03:34 |
| insert   | Abrigados Grande Oriente.xlsx                                      | abrigados_grande_oriente_template_abrigados_abrigados.xlsx                               | 11/05/2024 04:00 |
| insert   | Abrigados Colégio Bom Conselho - Página1 (3)                       | colegio_bom_conselho_abrigados.xlsx                                                      | 12/05/2024 06:00 |
| insert   | ACOLHIDOS ASTTI - BECO SOUZA COSTA 750 - PORTO ALEGRE              | astti.xlsx                                                                               | 12/05/2024 06:15 |
| insert   | Lista Infos Atualizada 2024_EEEM Alcides Cunha_                    | eeem_alcides_cunha_template_abrigados_abrigados.xlsx                                     | 12/05/2024 06:25 |
| insert   | -                                                                  | sem_abrigo_vinculado.xlsx                                                                | 12/05/2024 06:35 |
| insert   | Enjoy Sushi - LISTA DE ABRIGADOS  - Página1.pdf                    | enjoy_sushi_lista_abrigados_pagina_1.xlsx                                                | 14/05/2024 05:00 |
| update   | Abrigados Grande Oriente.xlsx                                      | ajuste_grande_oriente_nome_abrigo.xlsx                                                   | 14/05/2024 19:00 |
| update   | Abrigados CALAMIDADE POA 2024.google_sheets                        | ajuste_nome_sem_abrigo.xlsx                                                              | 14/05/2024 19:50 |
| insert   | formulário_triagem_iapi_igreja_nossa_senhora_de_fatima.xlsx        | formulário_triagem_iapi_igreja_nossa_senhora_de_fatima.xlsx                              | 15/05/2024 02:20 |
| insert   | Ginásio 2 Tancredo Neves atualização em 09-05-2024.pdf             | ginásio_2_tancredo_neves_atualização_em_09_05_2024_dante_20240513_1609.xlsx              | 15/05/2024 02:40 |
| insert   | Abrigo Igreja Nexos atualizada_1305                                | igreja_batista_nacional_de_porto_alegre_nexus_1005_gustavogr_20240510_2032_template.xlsx | 15/05/2024 02:55 |

---

# Problemas de consistência conhecidos
                                                                                                                                                                                                                 
> **Duplicidade de abrigados**
> 
> Alguns abrigados aparecem em mais de uma linha das planilhas com informações diferentes, por exemplo, em um linha tem nome e idade, na outra linha somente o nome. É utilizado um conjunto de campos (regra no notebook) para considerar duplicidade de registro em função de pessoas diferentes com o mesmo nome.

