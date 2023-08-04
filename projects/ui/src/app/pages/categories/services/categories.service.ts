import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Endpoints } from 'src/app/shared/models/endpoints.model';
import { Observable, map } from 'rxjs';
import { Category } from 'dddapp-common';
import { NewCategoryForRequest } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(
    private http: HttpClient,
  ) { }

  fetchCategories(): Observable<{ categories: Category[] }> {
    return this.http.get<{ categories: Category[] }>(`${environment.api}/${Endpoints.CATEGORIES}`).pipe(
      map(({categories}) => ({categories: categories.sort((catA) => { // Set default category as first one
        if(catA.isDefault) {
          return -1;
        }
        return 0;
      })}))
    );
  }

  createTarget(category: NewCategoryForRequest): Observable<{ category: Category }> {
    return this.http.post<{ category: Category }>(`${environment.api}/${Endpoints.CATEGORIES}`, category);
  }

  deleteCategory(id: string): Observable<{ id: string }> {
    return this.http.delete<{ id: string }>(`${environment.api}/${Endpoints.CATEGORIES}/${id}`)
  }

  updateCategory(category: Category) {
    return this.http.patch<{ category: Category }>(`${environment.api}/${Endpoints.CATEGORIES}/${category.id}`, category)
  }
}
