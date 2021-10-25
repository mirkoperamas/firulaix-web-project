import { TestBed } from '@angular/core/testing';

import { CoinUpdateService } from './coin-update.service';

describe('CoinUpdateService', () => {
  let service: CoinUpdateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoinUpdateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
