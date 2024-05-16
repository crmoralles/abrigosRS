import { ComponentFixture, TestBed } from '@angular/core/testing'

import { AbrigadoFormV2Component } from './abrigado-form-v2.component'

describe('AbrigadoFormV2Component', () => {
  let component: AbrigadoFormV2Component
  let fixture: ComponentFixture<AbrigadoFormV2Component>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AbrigadoFormV2Component],
    }).compileComponents()

    fixture = TestBed.createComponent(AbrigadoFormV2Component)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
