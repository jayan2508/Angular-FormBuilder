import { Component, Injectable, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../../model/tab-modal/tab-modal.component';
import { FormsModule } from '@angular/forms';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { v4 as uuidv4 } from 'uuid';
import { ToastrService } from 'ngx-toastr';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragPlaceholder,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import {
  DiagramComponent,
  DiagramModule,
  NodeModel,
  ShapeStyleModel,
  TextModel,
  TextStyleModel,
} from '@syncfusion/ej2-angular-diagrams';
import { Tab } from '../../utils/interface/tab.interface';
import { TabService } from '../../services/tab service/tab.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ComponentService } from '../../services/component service/component.service';
import { CurrentElementComponent } from '../../components/current-element/current-element.component';
import { ConfirmModalComponent } from '../../model/confirm-modal/confirm-modal.component';
import { CurrentElementService } from '../../services/cuurent element service/current-element.service';

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./dashboard.component.scss'],
  imports: [
    CommonModule,
    ModalComponent,
    FormsModule,
    CdkDrag,
    CdkDragPlaceholder,
    CdkDropList,
    DiagramModule,
    CurrentElementComponent,
    ConfirmModalComponent,
  ],
})
export class DashboardComponent implements OnInit {
  tabs: Tab[] = [];
  showModal: boolean = false;
  showEmployees: boolean = false;
  showSectionModal: boolean = false;
  employees: string[] = [
    'Jayan Ribadiya',
    'Nishant Rabadiya',
    'Darshan Nimavat',
    'Tejas Radadiya',
    'Piyush Dudhat',
    'Krushil Ghadiya',
    'Fenil Shingala',
    'Meet V',
  ];
  selectedLayout: string | null = null;
  draggedLayout: string | null = null;
  draggedItem: any = null;
  components: any[] = [];
  showDeleteModal = false;
  componentToDeleteIndex: number | null = null;

  // @ViewChild('diagram')
  // public diagram?: DiagramComponent;

  // public shape: TextModel = {
  //   type: 'Text',
  //   content: 'Text Element',
  // };
  // public getNodeDefaults(node: NodeModel): NodeModel {
  //   node.height = 100;
  //   node.width = 100;
  //   ((node as NodeModel).style as ShapeStyleModel).fill = 'none';
  //   ((node as NodeModel).style as ShapeStyleModel).strokeColor = 'none';
  //   (node.style as TextStyleModel).color = 'black';
  //   (node.style as TextStyleModel).textAlign = 'Center';
  //   return node;
  // }
  dropList(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.employees, event.previousIndex, event.currentIndex);
  }

  constructor(
    private tabService: TabService,
    private toastrService: ToastrService,
    private componentService: ComponentService,
    private currentElement: CurrentElementService,
  ) {}

  ngOnInit(): void {
    this.loadTabs();
    this.loadComponents();
  }

  generatePDF() {
    const formContainer = document.querySelector('.drop-container');
    if (formContainer) {
      html2canvas(formContainer as HTMLElement).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 297; // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;

        const doc = new jsPDF('p', 'mm', 'a4');
        let position = 0;

        doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          doc.addPage();
          doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        doc.save('Form_Builder.pdf');
      });
    }
  }

  loadTabs(): void {
    this.tabService.getTabs().subscribe((tabs) => {
      this.tabs = tabs;
    });
  }

  // Method to handle drag start
  onDragStart(event: MouseEvent, componentName: string): void {
    this.draggedItem = { id: this.generateUniqueId(), name: componentName }; // Example data structure
  }

  allowDrop(event: DragEvent): void {
    event.preventDefault();
  }

  dropTab(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.tabs, event.previousIndex, event.currentIndex);
  }

  onDrop(event: DragEvent): void {
    if (this.draggedItem) {
      const dropContainer = document.querySelector('.drop-container');
      if (dropContainer) {
        const offsetX =
          event.clientX - dropContainer.getBoundingClientRect().left;
        const offsetY =
          event.clientY - dropContainer.getBoundingClientRect().top;

        const newComponent = {
          id: this.generateUniqueId(),
          activeTabId: this.getActiveTabId(),
          isSelected: false,
          name: this.draggedItem.name,
          icon: this.getComponentIcon(this.draggedItem.name),
          position: { x: offsetX, y: offsetY },
          gridComponent: [],
          element: {
            width: 100,
            height: 100,
            alignment: 'flex-start',
            background: '#ffffff',
            padding: 15,
            margin: 10,
            font: 'Arial',
            roundedCorners: 5,
            border: 2,
            borderColor: '#000000',
          },
        };

        this.componentService.addComponent(newComponent).subscribe(
          () => {
            this.toastrService.success('Component added successfully!');
            this.loadComponents(); // Reload components after addition
          },
          (error) => {
            this.toastrService.error(
              'Failed to add component: ' + error.message
            );
          }
        );
      }

      this.draggedItem = null; // Reset dragged item
    }
    if (this.draggedLayout) {
      const formContainer = document.querySelector(
        '.drop-container'
      ) as HTMLElement;
      this.createLayout(this.draggedLayout, formContainer);
      const offsetX =
        event.clientX - formContainer.getBoundingClientRect().left;
      const offsetY = event.clientY - formContainer.getBoundingClientRect().top;

      const newLayout = {
        id: this.generateUniqueId(),
        activeTabId: this.getActiveTabId(),
        isSelected: false,
        name: this.draggedLayout,
        icon: 'icon-placeholder', // Placeholder icon for layout
        position: { x: offsetX, y: offsetY },
        gridComponent: this.getGridComponentCount(this.draggedLayout),
        element: {
          width: 100,
          height: 100,
          alignment: 'flex-start',
          background: '#ffffff',
          padding: 15,
          margin: 10,
          font: 'Arial',
          roundedCorners: 5,
          border: 2,
          borderColor: '#000000',
        },
      };

      // Add layout to components array and save to JSON Server
      this.componentService.addComponent(newLayout).subscribe(
        () => {
          this.toastrService.success('Layout added successfully!');
          this.loadComponents(); // Reload components after addition
        },
        (error) => {
          this.toastrService.error('Failed to add layout: ' + error.message);
        }
      );
    }
    this.draggedLayout = null;
    this.showSectionModal = false;
  }
  createLayout(layout: string, formContainer: HTMLElement): void {
    const gridRow = document.createElement('div');
    gridRow.classList.add('grid-row');

    switch (layout) {
      case 'col2':
        gridRow.innerHTML = `
          <div class="grid"></div>
          <div class="grid"></div>
        `;
        break;
      case 'col3':
        gridRow.innerHTML = `
          <div class="grid"></div>
          <div class="grid"></div>
          <div class="grid"></div>
        `;
        break;
      case 'col4':
        gridRow.innerHTML = `
          <div class="grid"></div>
          <div class="grid"></div>
          <div class="grid"></div>
          <div class="grid"></div>
        `;
        break;
      case 'col5':
        gridRow.innerHTML = `
          <div class="grid"></div>
          <div class="grid"></div>
          <div class="grid"></div>
          <div class="grid"></div>
          <div class="grid"></div>
        `;
        break;
      case 'col2-1-3':
        gridRow.innerHTML = `
          <div class="grid-col-1"></div>
          <div class="grid-col-2"></div>
        `;
        break;
      case 'col2-3-1':
        gridRow.innerHTML = `
          <div class="grid-col-2"></div>
          <div class="grid-col-1"></div>
        `;
        break;
      default:
        break;
    }

    formContainer.appendChild(gridRow);
  }

  loadComponents(): void {
    this.componentService.getComponents().subscribe(
      (components) => {
        this.components = components
          .map((component) => ({
            id: component.id,
            activeTabId: component.activeTabId,
            isSelected: component.isSelected,
            name: component.name,
            icon: this.getComponentIcon(component.name),
            position: component.position,
            gridComponent: [],
            element: component.element,
          }))
          .filter(
            (component) => component.activeTabId === this.getActiveTabId()
          ); // Filter components by active tab
      },
      (error) => {
        this.toastrService.error('Failed to load components: ' + error.message);
      }
    );
  }

  getActiveTabId(): string | null {
    const activeTab = this.tabs.find((tab) => tab.active);
    return activeTab ? activeTab.id : null;
  }

  onDragEnded(event: any) {
    const element = event.source.getRootElement();
    const rect = element.getBoundingClientRect();

    // Calculate offsetX and offsetY relative to the .drop-container
    const dropContainerRect = document
      .querySelector('.drop-container')
      ?.getBoundingClientRect();

    console.log(rect);
    console.log(dropContainerRect);

    if (dropContainerRect) {
      console.log(rect.left + '-' + dropContainerRect.left);
      console.log(rect.top + '-' + dropContainerRect.top);

      const offsetX = rect.left - dropContainerRect.left;
      const offsetY = rect.top - dropContainerRect.top;

      console.log(offsetX);
      console.log(offsetY);

      const componentId = event.source.data?.id;

      if (componentId) {
        const component = this.components.find(
          (comp) => comp.id === componentId
        );

        if (component) {
          component.position = { x: offsetX, y: offsetY };
          this.componentService.updateComponent(component).subscribe(
            () => {
              this.toastrService.success(
                'Component position updated successfully!'
              );
            },
            (error) => {
              this.toastrService.error(
                'Failed to update component position: ' + error.message
              );
            }
          );
        } else {
          this.toastrService.error('Component not found.');
        }
      } else {
        this.toastrService.error('Invalid component id.');
      }
    } else {
      this.toastrService.error('Failed to find drop container.');
    }
  }

  private generateUniqueId(): string {
    return uuidv4();
  }

  // Method to get the appropriate icon based on component name (adjust as needed)
  private getComponentIcon(componentName: string): string {
    switch (componentName) {
      case 'HR':
        return 'fa-solid fa-house-user';
      case 'PM':
        return 'fa-solid fa-house-user';
      case 'MD':
        return 'fa-solid fa-house-user';
      case 'ACCOUNTANT':
        return 'fa-solid fa-house-user';
      case 'Water':
        return 'fa-solid fa-faucet-drip';
      case 'Washroom':
        return 'fa-solid fa-sink';
      case 'Employee':
        return 'fa-solid fa-user-tie';
      case 'Meeting Area':
        return 'fa-solid fa-handshake';
      default:
        return 'fa-solid fa-question';
    }
  }

  addTab(title: string): void {
    const newTab: Tab = {
      id: '',
      title,
      active: false,
      added_components: [],
    };

    this.tabService.addTab(newTab).subscribe((tab) => {
      this.tabs.push(tab);
      this.showModal = false;
    });
  }

  removeTab(index: number): void {
    const tab = this.tabs[index];
    this.tabService.getTabById(tab.id).subscribe(
      (existingTab) => {
        if (existingTab) {
          this.tabService.removeTab(existingTab.id).subscribe(
            () => {
              this.tabs.splice(index, 1);
              this.toastrService.success('Tab removed successfully!');
            },
            (error) => {
              this.toastrService.error(
                'Failed to remove tab: ' + error.message
              );
            }
          );
        } else {
          this.toastrService.error('Tab not found.');
        }
      },
      (error) => {
        this.toastrService.error('Error fetching tab: ' + error.message);
      }
    );
  }

  selectTab(index: number): void {
    this.tabs.forEach((tab, i) => (tab.active = i === index));
    this.tabs.forEach((tab) => {
      this.tabService.updateTab(tab).subscribe();
    });
    this.loadComponents();
  }

  openModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  showEmployeeList(): void {
    this.showEmployees = !this.showEmployees;
  }

  updateTabComponents(tab: Tab): void {
    this.tabService.updateTab(tab).subscribe(
      () => console.log('Tab updated successfully.'),
      (error) => console.error('Failed to update tab:', error)
    );
  }

  openSectionModal(): void {
    this.showSectionModal = true;
  }

  closeSectionModal(): void {
    this.showSectionModal = false;
    this.selectedLayout = null;
  }

  selectLayout(layout: string): void {
    this.selectedLayout = layout;
    console.log('Selected layout:', layout);
  }

  onLayoutDragStart(event: DragEvent, layout: string) {
    this.draggedLayout = layout;
  }

  private getGridComponentCount(layout: string): any[] {
    switch (layout) {
      case 'col2':
        return [
          { class: 'grid', child: [] },
          { class: 'grid', child: [] },
        ];
      case 'col3':
        return [
          { class: 'grid', child: [] },
          { class: 'grid', child: [] },
          { class: 'grid', child: [] },
        ];
      case 'col4':
        return [
          { class: 'grid', child: [] },
          { class: 'grid', child: [] },
          { class: 'grid', child: [] },
          { class: 'grid', child: [] },
        ];
      case 'col5':
        return [
          { class: 'grid', child: [] },
          { class: 'grid', child: [] },
          { class: 'grid', child: [] },
          { class: 'grid', child: [] },
          { class: 'grid', child: [] },
        ];
      case 'col2-1-3':
        return [
          { class: 'grid-col-1', child: [] },
          { class: 'grid-col-2', child: [] },
        ];
      case 'col2-3-1':
        return [
          { class: 'grid-col-2', child: [] },
          { class: 'grid-col-1', child: [] },
        ];
      default:
        return [];
    }
  }

  // delete functionality

  showDeleteButton(index: number): void {
    this.components[index].showDelete = true;
  }

  hideDeleteButton(index: number): void {
    this.components[index].showDelete = false;
  }

  showComponentLog(index: number) {
    const component = this.components[index];

    this.components.forEach((comp) => {
      if (comp.id !== component.id && comp.isSelected) {
        comp.isSelected = false;
        this.componentService.updateComponent(comp).subscribe(
          () => {
            this.currentElement.setCurrentElement(component);
          },
          (error) => {
            console.error('Failed to update component:', error);
          }
        );
      }
    });
    component.isSelected = true;

    this.componentService.updateComponent(component).subscribe(
      () => {
        this.currentElement.setCurrentElement(component);
      },
      (error) => {
        console.error('Failed to update component:', error);
      }
    );
  }

  showDeleteConfirmationModal(index: number): void {
    this.componentToDeleteIndex = index;
    this.showDeleteModal = true;
  }

  // deleteComponent(id: number,name: string): void {
  //   // Log component ID before deletion
  //   console.log(`Deleting component: ${name} with ID: ${id}`);
  // }

  deleteConfirmed(confirmed: boolean): void {
    if (confirmed && this.componentToDeleteIndex !== null) {
      const componentId = this.components[this.componentToDeleteIndex].id;
      console.log(componentId);
      this.componentService.deleteComponent(componentId).subscribe(
        () => {
          // Update components list after deletion
          // this.components.splice(this.componentToDeleteIndex, 1);
        },
        (error) => {
          console.error('Error deleting component:', error);
        }
      );
    }
    this.closeDeleteConfirmationModal();
    this.loadComponents();
  }

  closeDeleteConfirmationModal(): void {
    this.showDeleteModal = false;
    this.componentToDeleteIndex = null;
  }
}
