import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Endpoints } from 'src/app/shared/models/endpoints.model';
import { Observable } from 'rxjs';
import { Category } from 'dddapp-common';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(
    private http: HttpClient,
  ) { }

  fetchCategories(): Observable<{ categories: Category[] }> {
    console.log('getchujey kategorie');
    return this.http.get<{ categories: Category[] }>(`${environment.api}/${Endpoints.CATEGORIES}`);
  }

  createTarget(category: Category): Observable<{ category: Category }> {
    return this.http.post<{ category: Category }>(`${environment.api}/${Endpoints.CATEGORIES}`, category);
  }

  deleteCategory(id: string): Observable<{ id: string }> {
    return this.http.delete<{ id: string }>(`${environment.api}/${Endpoints.CATEGORIES}/${id}`)
  }

  updateCategory(category: Category) {
    return this.http.patch<{ category: Category }>(`${environment.api}/${Endpoints.CATEGORIES}/${category.id}`, category)
  }
}
