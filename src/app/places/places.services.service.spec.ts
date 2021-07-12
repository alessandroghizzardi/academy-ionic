import { TestBed } from '@angular/core/testing';

import { Places.ServicesService } from './places.services.service';

describe('Places.ServicesService', () => {
  let service: Places.ServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Places.ServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
