import { TestBed } from '@angular/core/testing';

import { ConfirmationDialogBoxService } from './confirmation-dialog-box.service';

describe('ConfirmationDialogBoxService', () => {
  let service: ConfirmationDialogBoxService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfirmationDialogBoxService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
