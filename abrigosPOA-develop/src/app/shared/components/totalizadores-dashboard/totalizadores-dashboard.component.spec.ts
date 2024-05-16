import { ComponentFixture, TestBed } from '@angular/core/testing'

import { TotalizadoresDashboardComponent } from './totalizadores-dashboard.component'

describe('TotalizadoresDashboardComponent', () => {
  let component: TotalizadoresDashboardComponent
  let fixture: ComponentFixture<TotalizadoresDashboardComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TotalizadoresDashboardComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(TotalizadoresDashboardComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
