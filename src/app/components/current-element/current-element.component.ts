import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-current-element',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './current-element.component.html',
  styleUrl: './current-element.component.scss',
})
export class CurrentElementComponent implements OnInit {
  formDesign!: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.formDesign = this.formBuilder.group({
      width: [100, Validators.required],
      height: [100, Validators.required],
      alignment: ['flex-start', Validators.required],
      background: ['#ffffff', Validators.required],
      padding: [15, Validators.required],
      margin: [10, Validators.required],
      font: ['Arial', Validators.required],
      roundedCorners: [5, Validators.required],
      border: [2, Validators.required],
      borderColor: ['#000000', Validators.required],
    });

    setTimeout(() => {
      this.formDesign.valueChanges
        .pipe(debounceTime(1000))
        .subscribe((value) => {
          this.updateFormDesign(value);
        });
    }, 0);
  }

  updateFormDesign(value: any) {
    console.log(value);
  }
}
