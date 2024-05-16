import { ComponentFixture, TestBed } from '@angular/core/testing'

import { LgpdTermsComponent } from './lgpd-terms.component'

describe('LgpdTermsComponent', () => {
  let component: LgpdTermsComponent
  let fixture: ComponentFixture<LgpdTermsComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LgpdTermsComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(LgpdTermsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
