import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { AccountService } from './account.service';
import { StateStorageService } from './state-storage.service';
import { UserRouteAccessService } from './user-route-access-service';
import { Account } from '../login/account.model';

describe('UserRouteAccessService', () => {
  let service: UserRouteAccessService;
  let accountService: jasmine.SpyObj<AccountService>;
  let stateStorageService: jasmine.SpyObj<StateStorageService>;
  let router: jasmine.SpyObj<Router>;

  const adminAccount = { login: 'admin', authorities: ['ROLE_ADMIN'] } as unknown as Account;

  beforeEach(() => {
    accountService = jasmine.createSpyObj('AccountService', ['identity', 'hasAnyAuthority']);
    stateStorageService = jasmine.createSpyObj('StateStorageService', ['storeUrl']);
    router = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        UserRouteAccessService,
        { provide: AccountService, useValue: accountService },
        { provide: StateStorageService, useValue: stateStorageService },
        { provide: Router, useValue: router },
      ],
    });

    service = TestBed.inject(UserRouteAccessService);
  });

  it('allows a route that declares no required authorities', done => {
    accountService.identity.and.returnValue(of(null));

    service.checkLogin([], '/dashboard').subscribe(allowed => {
      expect(allowed).toBeTrue();
      expect(router.navigate).not.toHaveBeenCalled();
      done();
    });
  });

  it('allows an authenticated user holding a required authority', done => {
    accountService.identity.and.returnValue(of(adminAccount));
    accountService.hasAnyAuthority.and.returnValue(true);

    service.checkLogin(['ROLE_ADMIN'], '/management').subscribe(allowed => {
      expect(allowed).toBeTrue();
      expect(router.navigate).not.toHaveBeenCalled();
      done();
    });
  });

  it('blocks an authenticated user lacking the required authority and returns them home', done => {
    accountService.identity.and.returnValue(of(adminAccount));
    accountService.hasAnyAuthority.and.returnValue(false);

    service.checkLogin(['ROLE_ADMIN'], '/management').subscribe(allowed => {
      expect(allowed).toBeFalse();
      expect(router.navigate).toHaveBeenCalledWith(['/']);
      done();
    });
  });

  it('redirects an anonymous user to login and remembers the target url', done => {
    accountService.identity.and.returnValue(of(null));

    service.checkLogin(['ROLE_ADMIN'], '/management/inquiries').subscribe(allowed => {
      expect(allowed).toBeFalse();
      expect(stateStorageService.storeUrl).toHaveBeenCalledWith('/management/inquiries');
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
      done();
    });
  });

  it('does not leak the admin area when identity resolves to null', done => {
    accountService.identity.and.returnValue(of(null));

    service.checkLogin(['ROLE_ADMIN'], '/management').subscribe(allowed => {
      expect(allowed).toBeFalse();
      expect(accountService.hasAnyAuthority).not.toHaveBeenCalled();
      done();
    });
  });
});
