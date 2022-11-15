import { TestBed } from '@angular/core/testing';

import { AuditoriasServiceService } from './auditorias-service.service';

describe('AuditoriasServiceService', () => {
  let service: AuditoriasServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuditoriasServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
