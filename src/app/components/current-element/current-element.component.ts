import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { CurrentElementService } from '../../services/cuurent element service/current-element.service';
import { ComponentService } from '../../services/component service/component.service';
import { error } from 'console';
import { DashboardComponent } from '../../pages/dashboard/dashboard.component';

@Component({
  selector: 'app-current-element',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './current-element.component.html',
  styleUrl: './current-element.component.scss',
})
export class CurrentElementComponent implements OnInit {
  formDesign!: FormGroup;
  formValue: any;

  constructor(
    private formBuilder: FormBuilder,
    private currentElement: CurrentElementService,
    private componentService: ComponentService,
    private DashboardComponent: DashboardComponent,
  ) {}

  ngOnInit(): void {
    this.formDesign = this.formBuilder.group({
      width: [100, Validators.required],
      height: [100, Validators.required],
      alignment: ['flex-start', Validators.required],
      background: ['#ffffff', Validators.required],
      padding: [15, Validators.required],
      // margin: [10, Validators.required],
      font: ['Arial', Validators.required],
      roundedCorners: [5, Validators.required],
      border: [2, Validators.required],
      borderColor: ['#000000', Validators.required],
    });

    this.loadSelectedComponent();

    setTimeout(() => {
      this.formDesign.valueChanges
        .pipe(debounceTime(1000))
        .subscribe((value) => {
          this.updateFormDesign(value);
          // this.updateFormDesign2(value);
        });
    }, 0);


    // Subscribe to currentElement changes
    this.currentElement.currentElement$.subscribe((element) => {
      if (element) {
        this.formDesign.patchValue(element.element, { emitEvent: false });
      }
    });
  }

  loadSelectedComponent(): void {
    this.componentService.getComponents().subscribe(
      (components) => {
        const selectedComponent = components.find((comp) => comp.isSelected);
        if (selectedComponent) {
          this.formDesign.patchValue(selectedComponent.element);
        }
      },
      (error) => {
        console.error('Error fetching components', error);
      }
    );
  }

  // updateFormDesign2(value: any) {
  //   console.log(value);
  //   this.currentElement.updateElement(value).subscribe(
  //     (response) => {
  //       console.log('Element updated successfully', response);
  //     },
  //     (error) => {
  //       console.error('Error updating element', error);
  //     }
  //   );
  // }

  updateFormDesign(value: any) {
    console.log('current element data', value);
    this.componentService.getComponents().subscribe(
      (components) => {
        const selectedComponent = components.find((comp) => comp.isSelected);
        if (selectedComponent) {
          selectedComponent.element = value;
          this.componentService.updateComponent(selectedComponent).subscribe(
            (response) => {
              console.log('Element updated successfully', response);
              this.DashboardComponent.loadComponents()
            },
            (error) => {
              console.error('Error updating element', error);
            }
          );
        }
      },
      (error) => {
        console.error('Error fetching components', error);
      }
    );
  }
}
