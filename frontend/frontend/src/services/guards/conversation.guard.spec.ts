import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { conversationGuard } from './conversation.guard';

describe('conversationGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => conversationGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
