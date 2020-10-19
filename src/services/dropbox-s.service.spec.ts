import { TestBed } from '@angular/core/testing';

import { DropboxSService } from './dropbox-s.service';

describe('DropboxSService', () => {
  let service: DropboxSService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DropboxSService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
