import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router'

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
})
export class BreadcrumbComponent implements OnInit {
  showBreadcrumb = false
  links: any[] = []

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  /**
   * Método do ciclo de vida do Angular que é executado ao inicializar o componente.
   * Realiza a configuração inicial do breadcrumb e atualiza-o conforme a navegação ocorre.
   */
  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Obtém o snapshot da rota atual
        const currentRoute = this.route.root.firstChild.snapshot

        this.links = [
          {
            label: 'Página Inicial',
            url: '/',
            home: true,
          },
        ]
        this.showBreadcrumb = false

        // Verifica se a rota atual é diferente de 'home' para adicionar o link correspondente no breadcrumb
        if (currentRoute.routeConfig.path !== 'home') {
          this.links.push({
            // Obtém o rótulo do breadcrumb definido nos metadados da rota
            label: currentRoute.data.breadCrumb,
            // Obtém o URL da rota atual
            url: currentRoute.routeConfig.path,
            // Define o link como ativo
            active: true,
          })

          // Exibe o breadcrumb na página
          this.showBreadcrumb = true
        }
      }
    })
  }
}
