import { ComponentFixture, TestBed } from '@angular/core/testing'

import { AbrigadosComponent } from './abrigados.component'

describe('AbrigadosComponent', () => {
  let component: AbrigadosComponent
  let fixture: ComponentFixture<AbrigadosComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AbrigadosComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(AbrigadosComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
