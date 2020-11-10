import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../products.service';
import { Observable } from 'rxjs';
import { Product } from 'src/model/product.model';
import { UserService } from '../user.service';
import { ActivatedRoute } from '@angular/router';
import { mergeMap, filter } from 'rxjs/operators';

@Component({
  selector: 'app-products-list',
  template: `
    <h1 class="mb-3">All products</h1>
    <div class="row">
      <app-product-details
        *ngFor="let product of products$ | async"
        [product]="product"
        [isFavorite]="(userFavorites$ | async)?.includes(product.id)"
        class="col-md-4"
      ></app-product-details>
    </div>
  `,
  styles: [],
})
export class ProductsListComponent implements OnInit {
  public products$: Observable<Product[]>;
  public userFavorites$: Observable<string[]>;

  constructor(
    private ps: ProductsService,
    private us: UserService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        filter((params) => params.keys.length > 0),
        mergeMap((params) => this.us.addToFavorites(params.get('pid')))
      )
      .subscribe();
    this.products$ = this.ps.getProducts();
    this.userFavorites$ = this.us.getFavorites();
  }
}
