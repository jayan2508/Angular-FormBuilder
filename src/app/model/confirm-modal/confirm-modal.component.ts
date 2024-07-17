import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [],
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.scss'
})
export class ConfirmModalComponent {

  @Output() deleteConfirmed = new EventEmitter<boolean>();
  @Output() modalClosed = new EventEmitter<void>();

  confirmDelete(): void {
    this.deleteConfirmed.emit(true);
    this.closeModal();
  }

  closeModal(): void {
    this.modalClosed.emit();
  }
}
