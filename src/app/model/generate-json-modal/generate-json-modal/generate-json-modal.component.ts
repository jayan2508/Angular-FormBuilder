import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ComponentService } from '../../../services/component service/component.service';
import { IComponent } from '../../../utils/interface/tab.interface';

@Component({
  selector: 'app-generate-json-modal',
  standalone: true,
  imports: [],
  templateUrl: './generate-json-modal.component.html',
  styleUrl: './generate-json-modal.component.scss'
})
export class GenerateJsonModalComponent implements OnInit {
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>(); // EventEmitter to close the modal
  jsonData: string = '';  // Store JSON data as a string


  constructor(private componentService: ComponentService) {}

  ngOnInit(): void {
    this.loadJsonData();
  }

  loadJsonData(): void {
    this.componentService.getComponents().subscribe(
      (data: IComponent[]) => {
        this.jsonData = JSON.stringify(data, null, 2); // Convert to JSON string with indentation
      },
      (error) => {
        console.error('Error fetching JSON data:', error);
      }
    );
  }
  onClose(): void {
    this.closeModal.emit(); // Emit the close event
  }
}
