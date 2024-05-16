# Web Components GovBR-DS - Quickstart Angular

## Descrição

Projeto exemplificando o uso da [biblioteca de Web Components do GovBR-DS](https://gov.br/ds/webcomponents 'Biblioteca de Web Components do GovBR-DS') em projetos [Angular](https://angular.io/ 'Angular').

[Visualização ao vivo](https://govbr-ds.gitlab.io/bibliotecas/wc/govbr-ds-wc-quickstart-angular//main/).

## O que é um quickstart?

É um projeto modelo pré-configurado que facilita o início das atividades assim como serve de exemplo para projetos já em andamento.

## Considerações sobre segurança, qualidade e boas práticas

É importante entender que um projeto Quickstart em software não deve ser usado diretamente em um ambiente de produção. Isso porque esses projetos são simplificados e podem não lidar com todos os desafios do mundo real.

O código do projeto Quickstart pode não lidar com questões avançadas, como segurança, escalabilidade ou gerenciamento de erros. Portanto, antes de implantar o código em um ambiente de produção real, **é crucial revisar**, testar e personalizar o código para atender às necessidades específicas do projeto e garantir que seja robusto e seguro.

Além disso, em projetos Quickstart de software, às vezes são tomadas liberdades na forma como o código é escrito para torná-lo mais fácil de entender. Isso pode significar que algumas boas práticas de programação não são seguidas ou que o código não está otimizado para desempenho máximo. Portanto, é responsabilidade do desenvolvedor adaptar o projeto Quickstart para atender às necessidades e padrões de produção adequados.

Em resumo, um projeto Quickstart em software é **um ponto de partida** útil, mas não deve ser implantado diretamente em um ambiente de produção sem revisão e ajustes adequados. Os desenvolvedores devem lembrar que a simplicidade é frequentemente priorizada em projetos Quickstart em detrimento da complexidade do mundo real e devem personalizar o código para atender às necessidades específicas de seu projeto.

## Tecnologias

Esse projeto é desenvolvido usando:

1. [Biblioteca de Web Components do GovBR-DS](https://gov.br/ds/webcomponents 'Biblioteca de Web Components do GovBR-DS')
1. [Angular](https://angular.io/ 'Angular')

> Esse projeto foi construído usando uma versão nova do Angular, mas a [Biblioteca de Web Components do GovBR-DS](https://gov.br/ds/webcomponents 'Biblioteca de Web Components do GovBR-DS') funciona com versões mais antigas.

Para saber mais detalhes sobre Web Components sugerimos que consulte o [MDN](https://developer.mozilla.org/pt-BR/docs/Web/Web_Components 'Web Components | MDN').

## Dependências

As principais dependências do projeto são:

1. [GovBR-DS](https://www.gov.br/ds/ 'GovBR-DS')

1. [Web Components](https://gov.br/ds/webcomponents/ 'Web Components GovBR-DS')

1. [Font Awesome](https://fontawesome.com/ 'Font Awesome')

1. [Fonte Rawline](https://www.cdnfonts.com/rawline.font/ 'Fonte Rawline')

1. [Angular](https://angular.io/guide/setup-local 'Angular')

> O fontawesome e a fonte rawline podem ser importadas de um CDN. Consulte a documentação no site do [GovBR-DS](https://www.gov.br/ds/ 'GovBR-DS') para mais detalhes.

## Como executar o projeto?

```sh
git clone git@gitlab.com:govbr-ds/bibliotecas/wc/govbr-ds-wc-quickstart-angular.git

npm install

npm run serve
```

Após isso o projeto vai estar disponível no endereço `http://localhost:4200/`.

OBS: Para contribuir com o projeto o clone pode não ser a maneira correta. Por favor consulte nossos guias sobre como contribuir na nossa [wiki](https://gov.br/ds/wiki/ 'Wiki').

## Explicando

Para usar os Web Components GovBR-DS com o Angular é preciso seguir os seguintes passos:

## Configure o arquivo `angular.json`

Inclua as referências a biblioteca de Web Components e ao GovBR-DS

```json
    "styles": [
      ...,
      "node_modules/@govbr-ds/core/dist/core.min.css",
      ...
    ],
    "scripts": [
      ...,
      "node_modules/@govbr-ds/webcomponents/dist/webcomponents.umd.min.js",
      ...
    ]
```

## Inclua as dependências no index.html

Inclua no index.html da aplicação as seguintes dependências:

```html
<link rel="stylesheet" href="https://cdngovbr-ds.estaleiro.serpro.gov.br/design-system/fonts/rawline/css/rawline.css" />
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />
```

## Adicione o suporte aos Web Components

## app.module.ts

- Importe o `CUSTOM_ELEMENTS_SCHEMA` de `@angular/core`.

```typescript
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
```

- Adicione os `schemas` e inclua o `CUSTOM_ELEMENTS_SCHEMA`.

```typescript
schemas: [CUSTOM_ELEMENTS_SCHEMA]
```

- O código final deve ficar como abaixo:

```typescript
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA, // Informa ao Angular para aceitar elementos customizados
  ],
})
export class AppModule {}
```

Agora os elementos customizados e importados da [biblioteca de Web Components do GovBR-DS](https://gov.br/ds/webcomponents 'Biblioteca de Web Components do GovBR-DS') podem ser usados conforme suas documentações.

## Integração do ngModel e do FormGroup do Angular com os Web Components

Os Web Components se comunicam por meio de propriedades e eventos personalizados, assim como o Angular. No entanto, se formos utilizar estes Web Components com um formulario Angular, ele não funcionaria muito bem quanto um `Custom Angular Form Control`. Nós não temos como utilizar a validação personalizada ou outras API(s) de formularios do Angular.

Com a implementação de uma diretiva customizada podemos anexar a lógica da API(s) específica do Angular aos nossos Web Components.

Fazendo o uso de diretivas do Angular, podemos aplicar a API de controle de formulário personalizado aos nossos componentes da web.

Para ajudá-lo com essa questão criamos essa diretiva customizada. Não sendo necessária nenhuma implementação da parte que quem vai utilizar.

A diretiva está localizada na pasta `src/app/directives/` com o nome `CustomValueAccessor.directives.ts` ela deve ser incluída no module da sua aplicação. Conforme o exemplo abaixo:

```typescript
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { CustomValueAccessor } from './directives/CustomValueAccessor.directives'

@NgModule({
  declarations: [AppComponent, CustomValueAccessor],
  imports: [BrowserModule, AppRoutingModule],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
```

Basta seguir os passos acima e poderá utilizar o ngModel e o FormControl em seus campos de formulários. Pois agora os Web Components do GovBR já tem toda a API(s) de controle de formulários do Angular integrada em sua tag.

## Utilizando Web Components com ngModel

```html
<br-input
  id="input"
  label="Sobrenome"
  [value]="sobrenome"
  type="text"
  [placeholder]="sobrenome"
  [(ngModel)]="sobrenome"
></br-input>
<p>{{ sobrenome }}</p>
```

## Utilizando Web Components com Reactive Forms

```html
<br-input id="counter" label="Counter" type="number" [formControl]="counter" (change)="saveRange($event)"></br-input>
<p>valor do input: {{ counter.value }}</p>
<p>Valid (min value 0): {{ counter.valid }}</p>
```

## Rotas com os web componentes e Frameworks

O atributo isSpaLinkBehavior foi criado para adicionar suporte a um comportamento específico nos links do componente br-menu em aplicativos de página única (SPA). O objetivo principal é permitir que os links dentro do menu se comportem de forma diferente quando o aplicativo está em execução como SPA, em comparação com um comportamento tradicional de reload de página.

Em aplicações SPA, onde as páginas são carregadas dinamicamente sem a necessidade de recarregar a página inteira, o comportamento padrão dos links é executar uma ação interna dentro da aplicação, navegando para a nova rota sem atualizar toda a página. No entanto, quando se trata de um link tradicional, ao clicar nele, a página é recarregada do zero, o que pode causar uma experiência mais lenta e indesejada para o usuário.

Em resumo, o atributo isSpaLinkBehavior foi criado para o componente br-menu com o objetivo de oferecer suporte a aplicativos de página única (SPA). Quando definido como true para um item do menu, o link associado a esse item se comporta como um link interno do SPA, evitando o reload da página ao ser clicado. Isso proporciona uma navegação mais suave e eficiente para os usuários, melhorando a experiência geral do aplicativo. O atributo é particularmente útil em cenários com várias rotas no SPA, onde a necessidade de navegação interna é frequente. Recomenda-se usar o isSpaLinkBehavior sempre que houver links internos em um SPA, garantindo uma experiência de usuário mais agradável.

menu.component.ts:

```javascript
import { Component, EventEmitter, Input, Output } from '@angular/core';

interface MenuItem {
  id: number;
  name: string;
  url?: string;
  isSpaLinkBehavior?: boolean;
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {
  @Input() menuItems: MenuItem[] = [];
  @Output() navigate: EventEmitter<string> = new EventEmitter<string>();

  handleClick(menuItem: MenuItem, event: Event): void {
    event.preventDefault();

    if (menuItem.isSpaLinkBehavior && menuItem.url) {
      this.navigate.emit(menuItem.url);
    } else if (menuItem.url) {
      window.location.href = menuItem.url;
    }
  }
}
```

menu.component.html:

```html
<nav>
  <ul>
    <li *ngFor="let menuItem of menuItems">
      <a href="javascript:void(0)" (click)="handleClick(menuItem, $event)"> {{ menuItem.name }} </a>
    </li>
  </ul>
</nav>
```

app.component.ts (exemplo de utilização):

```javascript
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <h1>Exemplo de uso do Menu</h1>
    <app-menu [menuItems]="menuItems" (navigate)="onNavigate($event)"></app-menu>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  menuItems = [
    { id: 1, name: 'Home', url: '/' },
    { id: 2, name: 'Sobre', url: '/about' },
    { id: 3, name: 'Serviços', url: '/services', isSpaLinkBehavior: true },
    { id: 4, name: 'Contato', url: '/contact', isSpaLinkBehavior: true },
    { id: 5, name: 'Link Externo', url: 'https://www.google.com', isSpaLinkBehavior: false },
  ];

  onNavigate(url: string): void {
    console.log('Navegando para:', url);
    // Lógica de navegação no SPA
  }
}
```

Neste exemplo, criamos um componente de menu chamado MenuComponent com um atributo de entrada menuItems, que é uma lista de objetos que representam os itens do menu. Cada item do menu pode ter um atributo isSpaLinkBehavior definido como true para indicar que o link deve ser tratado como um link interno do SPA. No método handleClick, verificamos se o isSpaLinkBehavior está definido para tratar a navegação de acordo com a necessidade.

Lembre-se de que este é apenas um exemplo básico de como implementar o uso do atributo isSpaLinkBehavior em um componente Angular. Em um projeto real, você pode estender e personalizar esse exemplo de acordo com as necessidades específicas do seu aplicativo.

## Precisa de ajuda?

> Por favor **não** crie issues para fazer perguntas...

Use nossos canais abaixo para obter tirar suas dúvidas:

- Site do GovBR-DS [http://gov.br/ds](http://gov.br/ds)

- Web Components [https://gov.br/ds/webcomponents/](https://gov.br/ds/webcomponents/)

- Usando nosso canal no discord [https://discord.gg/U5GwPfqhUP](https://discord.gg/U5GwPfqhUP)

## Como contribuir?

Antes de abrir um Merge Request tenha em mente algumas informações:

- Esse é um projeto opensource e contribuições são bem-vindas.
- Para facilitar a aprovação da sua contribuição, escolha um título curto, simples e explicativo para o MR, e siga os padrões da nossa [wiki](https://gov.br/ds/wiki/ 'Wiki').
- Quer contribuir com o projeto? Confira o nosso guia [como contribuir](./CONTRIBUTING.md 'Como contribuir?').

## Commits

Nesse projeto usamos um padrão para branches e commits. Por favor observe a documentação na nossa [wiki](https://gov.br/ds/wiki/ 'Wiki') para aprender sobre os nossos padrões.

## Créditos

Os Web Components do GovBR-DS são criados pelo [SERPRO](https://www.serpro.gov.br/ 'SERPRO | Serviço Federal de Processamento de Dados') e [Dataprev](https://www.dataprev.gov.br/ 'Dataprev | Empresa de Tecnologia e Informações da Previdência') juntamente com a participação da comunidade.

## Licença

Nesse projeto usamos a licença MIT.
