import { ComponentFixture, TestBed } from '@angular/core/testing'

import { CardTotalizerComponent } from './card-totalizer.component'

describe('CardTotalizerComponent', () => {
  let component: CardTotalizerComponent
  let fixture: ComponentFixture<CardTotalizerComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CardTotalizerComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(CardTotalizerComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
