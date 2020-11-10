import { Component, OnInit, Input } from '@angular/core';
import { Product } from 'src/model/product.model';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ProductsService } from '../products.service';
import { switchMap, tap, mergeMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { UserService } from '../user.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent implements OnInit {
  @Input() product: Product;
  @Input() isFavorite: boolean;

  public product$: Observable<Product>;

  constructor(
    private route: ActivatedRoute,
    private ps: ProductsService,
    private us: UserService
  ) {}

  ngOnInit(): void {
    if (this.product) {
      this.product$ = of(this.product);
    } else {
      this.product$ = this.us.getFavorites().pipe(
        mergeMap((favorites) => {
          return this.route.paramMap.pipe(
            switchMap((params: ParamMap) =>
              this.ps.getProduct(params.get('id'))
            ),
            tap((product) => (this.isFavorite = favorites.includes(product.id)))
          );
        })
      );
    }
  }

  public addToFavorites(id: string) {
    this.us.addToFavorites(id).subscribe();
  }
}
