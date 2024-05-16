import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  isOpen: boolean = window.innerWidth > 580
}
