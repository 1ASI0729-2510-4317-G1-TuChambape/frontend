import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ArticleEntity } from '../model/article.entity';
import { SourceEntity } from '../model/source.entity';

@Injectable({
  providedIn: 'root'
})
export class NewsApiService {
  private baseUrl = 'https://api.example.com/news';

  constructor(private http: HttpClient) {}

  getTopHeadlines(): Observable<ArticleEntity[]> {
    return this.http.get<ArticleEntity[]>(`${this.baseUrl}/top-headlines`);
  }

  getSources(): Observable<SourceEntity[]> {
    return this.http.get<SourceEntity[]>(`${this.baseUrl}/sources`);
  }
}
