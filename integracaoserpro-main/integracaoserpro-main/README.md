### Referências:

- https://apicenter.estaleiro.serpro.gov.br/documentacao/consulta-cpf/pt/demonstracao/
- https://apicenter.estaleiro.serpro.gov.br/documentacao/consulta-cpf/pt/quick_start/#como-utilizar-a-api-cpf-demonstracao

### Rodando:

1. Configurar variáveis ambiente
   1. Chave da Serpro (a chave demo vem no .env.example)
   2. URL do firebase correspondente ao certificado (do passo 2)
   3. Porta (opcional)
2. Gerar chave privada do projeto no firebase e salvar no arquivo 'firebase-cert.json'
3. Rodando com Node.js
   1. npm i
   2. npm run build
   3. npm run start
