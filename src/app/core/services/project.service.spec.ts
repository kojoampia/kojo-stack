import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { ProjectService } from './project.service';
import { Project } from '../models/project.model';
import { SERVER_API_URL } from '@app/app.constants';

describe('ProjectService', () => {
  let service: ProjectService;
  let httpMock: HttpTestingController;

  const apiUrl = `${SERVER_API_URL}/api/v1/projects`;
  const project = { id: 'p-1', name: 'Command Center' } as Project;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProjectService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(ProjectService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('requests the versioned collection endpoint', () => {
    let received: Project[] | undefined;
    service.getProjects().subscribe(projects => (received = projects));

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush([project]);

    expect(received).toEqual([project]);
  });

  it('requests a single project by id', () => {
    service.getProjectById('p-1').subscribe();

    const req = httpMock.expectOne(`${apiUrl}/p-1`);
    expect(req.request.method).toBe('GET');
    req.flush(project);
  });

  it('posts a new project to the collection endpoint', () => {
    service.addProject(project).subscribe();

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(project);
    req.flush(project);
  });

  it('puts an updated project to the item endpoint', () => {
    service.updateProject('p-1', { name: 'Renamed' }).subscribe();

    const req = httpMock.expectOne(`${apiUrl}/p-1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ name: 'Renamed' });
    req.flush(project);
  });

  it('deletes a project by id', () => {
    service.deleteProject('p-1').subscribe();

    const req = httpMock.expectOne(`${apiUrl}/p-1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  describe('caching', () => {
    it('serves a second reader from cache instead of refetching', () => {
      service.getProjects().subscribe();
      httpMock.expectOne(apiUrl).flush([project]);

      let second: Project[] | undefined;
      service.getProjects().subscribe(p => (second = p));

      // No outstanding request: the value came from the replayed cache.
      httpMock.verify();
      expect(second).toEqual([project]);
    });

    it('refetches after a create invalidates the cache', () => {
      service.getProjects().subscribe();
      httpMock.expectOne(apiUrl).flush([project]);

      service.addProject(project).subscribe();
      httpMock.expectOne(r => r.method === 'POST').flush(project);

      service.getProjects().subscribe();
      const refetch = httpMock.expectOne(apiUrl);
      expect(refetch.request.method).toBe('GET');
      refetch.flush([project]);
    });

    it('refetches after a delete invalidates the cache', () => {
      service.getProjects().subscribe();
      httpMock.expectOne(apiUrl).flush([project]);

      service.deleteProject('p-1').subscribe();
      httpMock.expectOne(`${apiUrl}/p-1`).flush(null);

      let after: Project[] | undefined;
      service.getProjects().subscribe(p => (after = p));
      const refetch = httpMock.expectOne(apiUrl);
      expect(refetch.request.method).toBe('GET');
      refetch.flush([]);

      expect(after).toEqual([]);
    });
  });
});
