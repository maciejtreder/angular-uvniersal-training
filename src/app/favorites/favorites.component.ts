import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { ProductsService } from '../products.service';
import { map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-favorites',
  template: `
    <h1 class="mb-3">Your favorite</h1>
    <div class="row">
      <app-product-details
        *ngFor="let product of favorite$ | async"
        [product]="product"
        [isFavorite]="true"
        class="col-md-4"
      >
      </app-product-details>
    </div>
  `,
  styles: [],
})
export class FavoritesComponent implements OnInit {
  public favorite$;

  constructor(private us: UserService, private ps: ProductsService) {}

  ngOnInit(): void {
    this.favorite$ = this.us.getFavorites().pipe(
      mergeMap((favoriteProducts) => {
        return this.ps.getProducts().pipe(
          map((allProducts) => {
            return allProducts.filter((product) =>
              favoriteProducts.includes(product.id)
            );
          })
        );
      })
    );
  }
}
