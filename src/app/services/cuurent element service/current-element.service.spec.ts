import { TestBed } from '@angular/core/testing';

import { CurrentElementService } from './current-element.service';

describe('CurrentElementService', () => {
  let service: CurrentElementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CurrentElementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
