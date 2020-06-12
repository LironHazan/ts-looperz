import { TestBed } from '@angular/core/testing';

import { GuitarLooperService } from './guitar-looper.service';

describe('GuitarLooperService', () => {
  let service: GuitarLooperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GuitarLooperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
