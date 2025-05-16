import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NewsApiService } from './news-api.service';
import { ArticleEntity } from '../model/article.entity';
import { SourceEntity } from '../model/source.entity';

describe('NewsApiService', () => {
  let service: NewsApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [NewsApiService]
    });
    service = TestBed.inject(NewsApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch top headlines', () => {
    const dummy: ArticleEntity[] = [{ id: '1', title: 'Test', url: '', summary: '', publishedAt: '', sourceId: '' }];

    service.getTopHeadlines().subscribe(data => {
      expect(data).toEqual(dummy);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/top-headlines`);
    expect(req.request.method).toBe('GET');
    req.flush(dummy);
  });

  it('should fetch sources', () => {
    const dummy: SourceEntity[] = [{ id: 's1', name: 'Src', url: '', description: '' }];

    service.getSources().subscribe(data => {
      expect(data).toEqual(dummy);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/sources`);
    expect(req.request.method).toBe('GET');
    req.flush(dummy);
  });
});
