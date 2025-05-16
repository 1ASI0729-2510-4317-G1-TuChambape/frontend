import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogoApiService {
  private baseUrl = 'https://api.example.com/logos';

  constructor(private http: HttpClient) {}

  getLogo(name: string): Observable<string> {
    return this.http.get<string>(`${this.baseUrl}/${name}`);
  }
}
