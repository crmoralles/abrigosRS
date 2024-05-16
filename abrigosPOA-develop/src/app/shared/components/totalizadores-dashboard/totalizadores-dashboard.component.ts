import { Component, Input, OnInit } from '@angular/core'
import { Abrigado, AbrigadosService } from '../../../core/services/repository/abrigados.service'

@Component({
  selector: 'app-totalizadores-dashboard',
  templateUrl: './totalizadores-dashboard.component.html',
  styleUrls: ['./totalizadores-dashboard.component.scss'],
})
export class TotalizadoresDashboardComponent implements OnInit {
  @Input() listaFiltrada

  public abrigados: Abrigado[] = []

  async ngOnInit(): Promise<void> {
    this.abrigados = await this._abrigadosService.load()
  }

  constructor(private _abrigadosService: AbrigadosService) {}

  converterParaNumero(valor: any): number {
    const numero = parseFloat(valor)
    return isNaN(numero) ? 0 : numero
  }

  calcularTotalVagas(abrigos: any[]): number {
    return abrigos.reduce((total, abrigo) => total + this.converterParaNumero(abrigo.vagas), 0)
  }

  calcularTotalVagasOcupadas(abrigos: any[]): number {
    return abrigos.reduce((total, abrigo) => total + this.converterParaNumero(abrigo.vagas_ocupadas), 0)
  }

  calcularVagasDisponiveis(abrigos: any[]): number {
    return abrigos.reduce(
      (total, abrigo) =>
        total + (this.converterParaNumero(abrigo.vagas) - this.converterParaNumero(abrigo.vagas_ocupadas)),
      0
    )
  }

  calcularTotalFamiliasRegistrados(abrigos: any[]): number {
    if (!abrigos || abrigos.length === 0) {
      return 0
    }

    let total = 0

    for (const abrigo of abrigos) {
      const abrigadosNoAbrigo = this.abrigados.filter((abrigado) => abrigado.abrigoId === abrigo.id)
      total += abrigadosNoAbrigo.length
    }

    return total
  }

  calcularTotalAbrigadosRegistrados(): number {
    return this.abrigados.length
  }
}
