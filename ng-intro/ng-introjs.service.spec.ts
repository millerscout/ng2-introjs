import { TestBed, inject } from '@angular/core/testing';

import { IntrojsService } from './ng-introjs.service';

describe('IntrojsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IntrojsService]
    });
  });

  it('should ...', inject([IntrojsService], (service: IntrojsService) => {
    expect(service).toBeTruthy();
  }));
});
