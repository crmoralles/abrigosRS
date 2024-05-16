# Pipeline de dados
O pipeline de dados consiste no processo de leitura, processamento, transformação e persistência dos dados recebidos no layour do template. 

> Solicite acesso ao Google Drive com a Veridiana ou Melissa.
> 
## Processo atual 
O processamento dos arquivos é um processo de várias etapas envolvendo várias pessoas atuando em momentos diferentes. Para garantir a integridade foi estebecido um fluxo mínimo que consiste nos passos abaixo. 

O controle do arquivos que precisam ser importados estão sendo feitos no [Board Trello](https://trello.com/invite/b/6638ddec229f05b27d42232a/ATTIcc03d21b8e67d7c9a4c7f103029aeae737DC9D3D/AbrigaRS%20-%20Opera%C3%A7%C3%A3o%20de%20Suporte).

> Assine um card e mão na massa :)

### 1 - Recebimento de arquivos (landing)
Os arquivos são coletados e/ou recebidos por pessoas do AbrigosRS. Ao receber esses arquivos  [eles são depositados no Google Drive](https://drive.google.com/drive/folders/1LzTaMtUBix7hQ2Yo8k0Si2zA855vgd55) na pasta **1 - Recebidos (raw)**.
Nesse momento o time avaliará se arquivo já está no layout do template ou se precisa ser convertido.
- Quando um arquivo está no layout do template e está validado de acordo com o [Checklist de Validação](#checklist-de-validação) então ele deve movido para a pasta **3 - Prontos para Importação (staging)**
- Quando o arquivo não está no layout e precisa ser convertido então ele segue para a próxima etapa, preparação, sendo movido para a pasta **2 - Em convesão (transforming)o**.

### 2 - Preparação do arquivo
Na etapa de preparação, os arquivos que estão na pasta **Em Conversão** são convertidos manualmente para o layout do template. Isso é feito por um time de voluntários que faz essa preparação. O resultado final desse processo é o envio dos dados de abrigados de diversos formatos de arquivos (pdf, docx, xlsx, etc) para o layout do template. Uma vez que a preparação é concluída então o arquivo é movido para a pasta citada anteriormente, **3 - Prontos para Importação (staging)**.

> Importante! Caso não existam mais arquivos na etapa **3 - Prontos para Importação (staging)** mas existem arquivos na área de landing (etapa **1 - Recebidos (raw)**), vamos atuar para carregar os dados para o template e fazer a importação.

### 3 - Importação
Todos os arquivos que estiverem na pasta **3 - Prontos para Importação (staging)** devem ser importados utilizando o notebook **imports\import_template_loader_v2.ipynb**. Esse é o notebook responsável por fazer validações, transformações e persistência no Firestore. 

> **A missão dos voluntários em python é garantir essa etapa.**

Siga as orientções do arquivo README.md para configurar o ambiente e realizar a importação do arquivo. Se achar um bug ou oportunidade de melhoria, abra um PR da alteração para a branch **main** no [Repositório do Projeto](https://github.com/abrigosPOA/imports).

> Importante: Antes de commitar as alterações no Firebase de produção, execute a carga em uma base de staging (intermediária) para garantir a importação.

Uma vez finalizado o processo de importação, acesse a [plataforma AbrigosRS](https://abrigospoa.web.app/abrigados) e por amostragem pesquise os dados importados para verificar se foram importados com sucesso.

Ao finalizar esse processo, notifique no grupo do whatsapp `[INT] Importações de dados - AbrigosRS` que a importação foi finalizada com sucesso e principalmente, mova o card no Trello para identificar a carga que foi realizada.

### 4 - Finalização
Após realizado a importação, o arquivo original deve ser persistido na pasta **pipeline\1 - raw\processed** do repositório do projeto. O objetivo é manter um relacionamento mínimo entre o arquivo recebido e o arquivo importado via template. O arquivo com os dados processados, deve ser persistido na pasta **pipeline\4 - commited**. Essa mesma lógic deve ser replicada no google drive.

Para finalizar, edite o arquivo [Controle de Importações.md](Controle%20de%20Importações.md) criando uma linha a relação entre o arquivo original recebido e o arquivo do template que foi processado.

> Copie os arquivos do google drive para a respectiva pasta em `imports\pipeline`. Essa etapa é essencial pois ela é um dos marcadores para identificarmos o que já processado e reprocessado.

> Faça o commit das alterções no repositório do projeto.

## Checklist de Validação
Confira o checklist de importação do template_v2 para garantir uma importação mais suave.

- [ ] Certifique-se que o layout utilizado é a v2, que está disponível em [disponível nos template](./imports/templates/import_abrigados_template_v2.googlesheets.md).
- [ ] Certifique-se que todos os abrigos que estão na planilha estão cadastrados na plataforma e estão no [dicionário de abrigos](./modules/data_type_handler/src/abrigo_dict.py). Para mais detalhes sobre abrigos, [acesse a seção sobre abrigos](#cadastro-de-abrigos).
- [ ] Por amostragem, verifique se todos os campos estão na sua respectiva coluna e não há um problema posicional.
- [ ] A aba da planilha deve estar nomeada como `abrigados`. Certifique-se que o nome da aba náo foi alterado.

## Cadastro de abrigos
O cadastro de abrigos é realizado por vários canais, como abrigos, importações, voluntários e suporte. Atualmente não há uma chave forte para identfiicar um Abrigo, como um cnpj. Dessa forma, uma falha na pesquisa ou entenidmento incorreto de um nome mais complexo pode duplicar abrigos, impactar nos números e gerar problemas na operação.
Para contornar esse problema, foi adotado a estratégia de manter um [dicionário de abrigos](./modules/data_type_handler/src/abrigo_dict.py) cujo a função é manter um dicinário que ligue uma chave a uma tupla<abrigo_nome, abrigo_identificador>, entregando as seguintes vantagens:
- Redução do número de abrigos duplicados.
- Redução do custo operacional para consultar abrigos no firestore.
- Permite uma validação dos abrigos da planilha com o que está persistido no firestore, adicionando mais força na relação.

### Para localizar um abrigo
- Acesse a plataforma [AbrigosRS](https://abrigospoa.web.app/home) e consulte o nome do abrigo. Certifique-se pesquisar pelo nome completo ou partes mais significativas.
- Uma vez encontrado o abrigo, copie o nome exato do abrigo e faça a consulta do seu `document_id` no firestore, utilizando `nome=={nome_completo_abrigo}`.
- De posse das informações de nome do abrigo e seu document_id, verifique se o abrigo já está no dicinário.
- Se o abrigo já estiver no dicionário, utilize a chave normalizada do dicinário para preencher o nome do abrigo na planilha.
- Se o abrigo não existir, adicione-o e faça o commit do novo abrigo.

> A chave do dicionário é o nome completo do abrigo normalizado com todos os caracteres minúsculos, sem caracteres especiais e sem espaço.

> Quando um abrigo não é encontrado no dicionário o notebook irá persistir o arquivo `missing_abrigos.json`, no path configurado no próprio notebook e irá fazer um dump do dataframe que contém o nome dos abrigos não encontrados. Utilize essa informação para criar novos abrigos.

## Dúvidas
Em caso de dúvida é só mandar mensagem no grupo do whatsapp e pedir ajuda :)
