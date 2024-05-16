import { Component, EventEmitter, Input, Output } from '@angular/core'

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent {
  @Input() label: string
  @Input() hideItemsPerPage?: true
  @Input() itemsPerPage: number
  @Input() currentPage: number
  @Input() totalPages: number
  @Input() totalItems: number
  @Output() pageChange = new EventEmitter<number>()
  @Output() itemsPerPageChange = new EventEmitter<number>()

  showList: boolean = false
  showPages: boolean = false

  constructor() {}

  get pageStart() {
    return (this.currentPage - 1) * this.itemsPerPage + 1
  }

  get pageEnd() {
    return Math.min(this.totalItems, this.currentPage * this.itemsPerPage)
  }

  showListItems() {
    this.showList = !this.showList
  }

  showPagesItems() {
    this.showPages = !this.showPages
  }

  updateItemsPerPage(items: number) {
    this.itemsPerPage = items
    this.itemsPerPageChange.emit(this.itemsPerPage)
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--
      this.pageChange.emit(this.currentPage)
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++
      this.pageChange.emit(this.currentPage)
    }
  }

  changePage(page: number) {
    this.currentPage = page
    this.pageChange.emit(this.currentPage)
  }

  getTotalPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1)
  }
}
