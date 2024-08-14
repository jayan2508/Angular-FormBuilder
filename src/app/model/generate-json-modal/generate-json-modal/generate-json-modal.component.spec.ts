import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateJsonModalComponent } from './generate-json-modal.component';

describe('GenerateJsonModalComponent', () => {
  let component: GenerateJsonModalComponent;
  let fixture: ComponentFixture<GenerateJsonModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenerateJsonModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GenerateJsonModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
