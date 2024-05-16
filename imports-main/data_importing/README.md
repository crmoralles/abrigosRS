# Workspace de importação de dados - AbrigosRS
O workspace de importação é uma estrutura criada para fazer a ingestão, processamento e evolução dos dados de abrigados recebidos de diversas fontes durante os eventos climáticos no RS em maio/2024.

A estrutura foi construida uutilizando python, pandas e notebooks jupyter no vscode. Foi aplicado uma estratégia de pipeline standalone em quatro etapas, sendo raw, transforming, staging e commited. Na seção datapipeline tem mais detalhes.

## Endereços e informações de serviços
Endereços e informações de serviços utilizados no ambiente.

| Serviço        | Tipo     | Ambiente    | Descrição                                         | Dado                           |
| :------------- | :------- | :---------- | :------------------------------------------------ | :----------------------------- |
| Firestore      | Database | development | Persistência para desenvolvimento e staging.      | abrigospoa-dev.firebaseapp.com |
| GCP Project Id | Config   | development | ID de projeto no GCP para env de desenvolvimento. | abrigospoa-dev                 |
| Firestore      | Database | production  | Persistência em produção.                         | abrigospoa-dev.firebaseapp.com |
| GCP Project Id | Config   | production  | ID de projeto no GCP para env de produtivo.       | abrigospoa                     |

## Configuração do ambiente
O setup do ambiente tem uma complexidade baixa e possui automação do processo de criação e atualização de ambiente. 
Para que o processo de configuração e atualização de ambiente funcione é essencial que seja criado o arquivo .env na raíz do projeto definindo o basepath do projeto e o pythonpath para os módulos desenvolvidos. Com o uso do VSCODE o .env é processado automaticamente. Em outros ambientes certifique-se que as variáveis de ambiente do projeto estejam atribuidas.

> Recomendado o uso do vscode em função da simplicidade e automação na configuração do ambiente.

### Paths e variáveis
Os notebook estão utilizando o python-dotenv para gerenciar as configurações do notebook. Ao todo são definidos três arquivos .env**, que devem ser criados na raíz do projeto. Abaixo está uma descrição de cada um dos arquivos. Os notebook possuem no seu início a função `environmnent_selector`, que definirá qual o ambiente que será utilizado. 

| Arquivo          | Descrição                                                                |
| :--------------- | :----------------------------------------------------------------------- |
| .env             | É arquivo padrão utilizado para configurar as variáveis base do projeto. |
| .env.development | Define as variáveis para ambientes de desenvolvimento e\ou staging       |
| .env.production  | Define as variáveis para o ambiente produtivo                            |

#### Configure o .env das variáveis base do projeto.

- Crie um arquivo .env no diretório raiz do workspace e configure as variáveis bases para o projeto.

**file: $workspace/.env**
```env
SOSRS_BASEPATH = E:\thiagoborba.me\sosrs\data_management\data_importing
PYTHONPATH = E:\thiagoborba.me\sosrs\data_management\data_importing\modules
```
> Caso tenha algum problema com o uso do python-dotenv ou processamento do .env configure as variáveis diretamente no sistema operacional.

#### Lista de variáveis
Descrição das variáveis utilizadas.

| Variável                | Descrição                                                                      | Exemplo                         |
| :---------------------- | :----------------------------------------------------------------------------- | :------------------------------ |
| SOSRS_BASEPATH          | Atribui o path absoluto do projeto.                                            | E:\(...)\data_importing         |
| PYTHONPATH              | Atribui o path absoluto da pasta de módulos.                                   | E:\(...)\data_importing\modules |
| SOSRS_ENVIRONMENT       | Atribui automaticamente o ambiente selecionado (development ou production)     | 'production'                    |
| SOSRS_FIRESTORE_KEYFILE | Informa o path, relativo ou absoluta, da chave do service-account do Firestore | '.keys\abrigospoa--a(...).json' |

### Setup do ambiente
O projeto possui o script `setup_and_start_environment.ps1`, que é responsável por fazer a criação do ambiente virtual no python `.venv.abrigosrs`, instalar dependencias e módulos.

> Utilize o script para configurar e/ou atualizar o ambiente.

## Data pipeline
Organização do pipeline de dados.

| Estágio                | Objetivo                                                              |
| :--------------------- | :-------------------------------------------------------------------- |
| 1 - raw                | Arquivos recebidos para processamento.                                |
| - - raw\processed      | Arquivo com dados extraídos que foram enviados para transformação.    |
| - - raw\out-of-context | Arquivos recebidos para importação mas não faziam parte do contexto.  |
| 2 - transforming       | Arquivos em processo de transformação e data quality.                 |
| 3 - staging            | Arquivos transformados que estão aguardando importação para Firebase. |
| 4 - commited           | Arquivos processados e persistido com sucesso no Firebase.            |
| .working               | Diretório de trabalho para notebooks, importações, etc.               |


> O controle da importação está disponível em [Controle de importações](./Controle%20de%20Importações.md)

## Serviços e credenciais
Para executar as cargas é necessário a solicitação de uma `service-account` para o time de infra do projeto. Essa `service-account` é um arquivo com chaves para autenticação no `Firestore` via serviço. Para o ambiente de desenvolvimento pode ser solicitado também uma `service-account` para o time de infra ou utilizado um serviço do Firestore baseado em uma conta pessoal.
As credenciais devem estar na pasta `.keys` que não é versionada para fins de segurança. A pasta contém os arquivos de `service-account` que são referenciados nos arquivos `.env`.

## Alterações na estrutura do projeto e archiving
O commit `bd7b72171e9b47d5443c72a263491773cd88e80a` reestruturou o projeto, focando pricipalmente em redução de complexidade, remoção de ativos legados e evoluções na documentação. As execuções especializadas (um notebok por arquivo) do início do projeto quando ainda não tinhamos a definição de um template foram removidas do HEAD da branch `master` porém estão no histórico.
Para consultar importações antigas ou resgatar alguma informação consulte a história anterior ao commit de referência citado.

## Notebook Playground
O notebook `playground.ipynb` possui diversas funções de fluxos utilitários como normalização de dados e tipo, dump das collection, pesquisas de documentos (equal, in e fuzzy) entre outros.

## Documentação de notebooks
Os notebook estão documentos. Acesse o notebook para entender as suas funcionalidades e uso.

## Processo de carga
Para mais detalhes do processo de ingestão, acesse [Pipeline de Dados](Pipeline%20de%20dados.md).

## Configurações adicionais para IDE Jetbrains 
Para IDES da familia Jetbrains, como pycharm, são necessárias configurações adicionais. Caso tenha problemas para executar o projeto, siga os passos abaixo.

#### Configuração do ambiente virtual python
1. **Abra seu projeto no PyCharm**:
   - Inicie o PyCharm e abra o projeto onde você deseja configurar o ambiente virtual.

2. **Acesse as Configurações do Projeto**:
   - No menu principal, clique em `File` > `Settings` para usuários Windows e Linux.
   - Para usuários Mac, clique em `PyCharm` > `Preferences`.

3. **Vá para o Interpretador Python**:
   - Dentro de Settings/Preferences, navegue até `Project: [nome_do_seu_projeto]` > `Python Interpreter`.

4. **Crie um Novo Ambiente Virtual**:
   - Clique no ícone de engrenagem ao lado do menu de seleção do interpretador e escolha `Add`.
   - Na janela que aparece, selecione `Virtualenv Environment` e depois `New environment`.

5. **Configure o Local do Ambiente Virtual**:
   - Defina o local onde o ambiente virtual será criado ou aceite o local padrão.
   - Assegure-se de que o interpretador base está corretamente selecionado, geralmente apontando para a instalação padrão do Python no seu sistema.

6. **Finalize a Criação do Ambiente Virtual**:
   - Clique em `OK` para criar o ambiente virtual. O PyCharm irá configurar o ambiente e associá-lo ao seu projeto.


#### Configuração do plugin envFile
1. **Instale o Plugin EnvFile**:
   - Ainda nas configurações (`File` > `Settings` ou `PyCharm` > `Preferences`), vá para `Plugins`.
   - Na barra de pesquisa, digite `EnvFile` e pressione Enter.
   - Encontre o plugin `EnvFile` nos resultados da pesquisa e clique em `Install`.

2. **Habilitar o Plugin no Projeto**:
   - Após a instalação, navegue até `Run` > `Edit Configurations` no menu principal.
   - Selecione sua configuração de execução à esquerda.
   - Na aba de configurações à direita, encontre e marque a opção `Enable EnvFile`.

3. **Configure os Arquivos de Variáveis de Ambiente**:
   - Dentro da mesma janela de configuração, clique no ícone de adição (`+`) sob o painel `EnvFile` para adicionar um novo arquivo de variáveis de ambiente.
   - Selecione o tipo de arquivo (como `.env`) e navegue até o arquivo que contém suas variáveis de ambiente.

4. **Salve e Aplique as Configurações**:
   - Clique em `Apply` e `OK` para salvar suas configurações e começar a usar as variáveis de ambiente na execução do seu projeto.

#### Informações adicionais
Caso ainda tenha problemas na leitura das variáveis de ambiente, execute a célula abaixo no notebook para forçar a leitura do arquivo `.env`.

```python
import os
from dotenv import load_dotenv, find_dotenv

def reload_dotenv():
    load_dotenv(find_dotenv(), override=True)
    print(".env reload.")

reload_dotenv()
```