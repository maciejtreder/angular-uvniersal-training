import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../model/product.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private API_URL = '/api';

  constructor(private httpClient: HttpClient) {}

  public getProducts(): Observable<Product[]> {
    return this.httpClient.get<Product[]>(`${this.API_URL}/products`);
  }

  public getProduct(productId: string): Observable<Product> {
    return this.httpClient.get<Product>(
      `${this.API_URL}/products/${productId}`
    );
  }
}
