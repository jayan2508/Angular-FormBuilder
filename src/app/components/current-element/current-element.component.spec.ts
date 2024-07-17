import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentElementComponent } from './current-element.component';

describe('CurrentElementComponent', () => {
  let component: CurrentElementComponent;
  let fixture: ComponentFixture<CurrentElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrentElementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CurrentElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
