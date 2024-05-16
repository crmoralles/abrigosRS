import { ComponentFixture, TestBed } from '@angular/core/testing'

import { AbrigadoFormComponent } from './abrigado-form.component'

describe('AbrigadoFormComponent', () => {
  let component: AbrigadoFormComponent
  let fixture: ComponentFixture<AbrigadoFormComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AbrigadoFormComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(AbrigadoFormComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
