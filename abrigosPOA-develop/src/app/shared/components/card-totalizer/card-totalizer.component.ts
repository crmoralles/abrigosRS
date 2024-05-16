import { Component, Input, OnInit } from '@angular/core'

@Component({
  selector: 'app-card-totalizer',
  templateUrl: './card-totalizer.component.html',
  styleUrls: ['./card-totalizer.component.scss'],
})
export class CardTotalizerComponent implements OnInit {
  @Input() label
  @Input() superLotado
  @Input() totalOcupacao
  @Input() totalOcupacaoColor
  @Input() totalVagas
  @Input() totalLivre

  ngOnInit(): void {}

  getTotalOcupacaoPercentage(totalOcupacao: any) {
    const ocupacaoString = totalOcupacao || '0'
    return parseFloat(`${Math.min(ocupacaoString, 100)}`).toFixed(2) || 0.0
  }
}
