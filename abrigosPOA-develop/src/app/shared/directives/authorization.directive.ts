import { Directive, ElementRef, Input, OnInit } from '@angular/core'
import { AuthorizationService } from 'src/app/core/services/authorization.service'

@Directive({
  selector: '[appAuthorization]',
})
export class AuthorizationDirective implements OnInit {
  @Input() level: number
  @Input() condition: '==' | '!=' | '>=' | '<=' | '>' | '<'
  constructor(
    private el: ElementRef,
    private authorizationService: AuthorizationService
  ) {}
  ngOnInit(): void {
    this.authorizationService.allow(this.level, this.condition).then((allow) => {
      if (!allow) this.el.nativeElement.remove()
    })
  }
}
