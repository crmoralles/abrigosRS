import { Directive, ElementRef } from '@angular/core'

@Directive({
  selector: '[appModal]',
})
export class ModalDirective {
  constructor(private el: ElementRef) {
    document.body.appendChild(el.nativeElement)
    el.nativeElement.style.backgroundColor = 'rgba(1, 1, 1, 0.4)'
    el.nativeElement.style.position = 'fixed'
    el.nativeElement.style.top = '0px'
    el.nativeElement.style.left = '0px'
    el.nativeElement.style.right = '0px'
    el.nativeElement.style.bottom = '0px'
    el.nativeElement.style.zIndex = 1000
    el.nativeElement.style.display = 'flex'
  }
}
