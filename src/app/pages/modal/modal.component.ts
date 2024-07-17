import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {
  title: string = '';
  @Output() save = new EventEmitter<string>();
  @Output() close = new EventEmitter<void>();

  constructor(private toastrService: ToastrService){}

  onSave() {
    this.title = this.title.trim();

    if (this.title.length > 0) {
      this.save.emit(this.title);
    } else {
      this.toastrService.error('required','Title is required');
    }
  }

  onClose() {
    this.close.emit();
  }

}
