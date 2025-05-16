import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LogoApiService } from './logo-api.service';

describe('LogoApiService', () => {
  let service: LogoApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LogoApiService]
    });
    service = TestBed.inject(LogoApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should fetch logo URL', () => {
    const dummyUrl = 'https://…/logo.png';

    service.getLogo('test').subscribe(url => {
      expect(url).toBe(dummyUrl);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/test`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyUrl);
  });
});
