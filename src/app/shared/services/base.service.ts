import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { inject } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';

/**
 * Abstract base service class providing common CRUD operations for REST API endpoints.
 * @template T The type of resource this service manages
 */
export abstract class BaseService<T> {
  /** HTTP headers configuration for JSON communication */
  protected httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Accept': 'application/json' }),

  };
  /** Base URL for the server API */
  protected serverBaseUrl: string = `${environment.apiUrl}`;
  /** Endpoint path for the specific resource */
  protected resourceEndpoint: string = '';
  /** HTTP client for making API requests */
  protected http: HttpClient = inject(HttpClient);

  /**
   * Handles HTTP errors and transforms them into an Observable error
   * @param error - The HTTP error response
   * @returns An Observable error with a user-friendly message
   */
  protected handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error(`An error occurred: ${error.error.message}`);
    } else {
      console.error(
        `Backend returned code ${error.status}, body was: ${error.error}`
      );
    }
    return throwError(
      () => new Error('Something bad happened; please try again later.')
    );
  }

  /**
   * Constructs the full resource URL path
   * @returns The complete URL for the resource endpoint
   */
  protected resourcePath(): string {
    return `${this.serverBaseUrl}${this.resourceEndpoint}`;
  }

  /**
   * Creates a new resource
   * @param resource - The resource to create
   * @returns An Observable of the created resource
   */
  public create(resource: T | Partial<T>, token?: string): Observable<T> {
    const httpOptions = token ? {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': `Bearer ${token}` })
    } : this.httpOptions;
    return this.http
      .post<T>(this.resourcePath(), JSON.stringify(resource), httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  /**
   * Deletes a resource by ID
   * @param id - The ID of the resource to delete
   * @returns An Observable of the deletion result
   */
  public delete(id: unknown, token?: string): Observable<any> {
    const httpOptions = token ? {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': `Bearer ${token}` })
    } : this.httpOptions;
    return this.http
      .delete(`${this.resourcePath()}/${id}`, httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  /**
   * Updates an existing resource
   * @param id - The ID of the resource to update
   * @param resource - The updated resource data
   * @returns An Observable of the updated resource
   */
  public update(id: any, resource: T | Partial<T>, token?: string): Observable<T> {
    const httpOptions = token ? {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': `Bearer ${token}` })
    } : this.httpOptions;
    return this.http
      .put<T>(
        `${this.resourcePath()}/${id}`,
        JSON.stringify(resource),
        httpOptions
      )
      .pipe(retry(2), catchError(this.handleError));
  }
  /**
   * Partially updates an existing resource (PATCH)
   * @param id - The ID of the resource to update
   * @param resource - The partial resource data
   * @returns An Observable of the updated resource
   */
  public patch(id: any, resource: Partial<T>, token?: string): Observable<T> {
    const httpOptions = token ? {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': `Bearer ${token}` })
    } : this.httpOptions;
    return this.http
      .patch<T>(
        `${this.resourcePath()}/${id}`,
        JSON.stringify(resource),
        httpOptions
      )
      .pipe(retry(2), catchError(this.handleError));
  }
  /**
   * Retrieves all resources
   * @returns An Observable array of all resources
   */
  public getAll(token?: string): Observable<Array<T>> {
    const httpOptions = token ? {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': `Bearer ${token}` })
    } : this.httpOptions;
    return this.http
      .get<Array<T>>(this.resourcePath(), httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  /**
   * Retrieves resources with search parameters
   * @param params - Object containing search parameters as key-value pairs
   * @returns An Observable array of matching resources
   */
  public search(params: Record<string, any>, token?: string): Observable<Array<T>> {
    const httpOptions = token ? {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': `Bearer ${token}` })
    } : this.httpOptions;
    // Create URLSearchParams from the object
    const searchParams = new URLSearchParams();

    // Add each parameter to the search params
    Object.keys(params).forEach((key) => {
      if (params[key] !== null && params[key] !== undefined) {
        searchParams.append(key, params[key].toString());
      }
    });

    // Construct URL with search parameters
    const url = `${this.resourcePath()}?${searchParams.toString()}`;

    return this.http
      .get<Array<T>>(url, httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  /**
   * Retrieves a resource by ID
   * @param id - The ID of the resource to retrieve
   * @returns An Observable of the requested resource
   */
  public getById(id: any, token?: string): Observable<T> {
    const httpOptions = token ? {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': `Bearer ${token}` })
    } : this.httpOptions;
    return this.http
      .get<T>(`${this.resourcePath()}/${id}`, httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }
}
