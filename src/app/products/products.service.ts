import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Product } from './product.class';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

    private static productslist: Product[] = null;
    private products$: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>([]);

    constructor(private http: HttpClient) { }

    getProducts(): Observable<Product[]> {
        if( ! ProductsService.productslist )
        {
            this.http.get<any>('http://localhost:9090/products').subscribe(data => {
                ProductsService.productslist = data;               
                this.products$.next(ProductsService.productslist);
            });
        }
        else
        {
            this.products$.next(ProductsService.productslist);

        }
        return this.products$;
    }

    



    create(prod: Product): Observable<any> {
        console.log('onCreate method id = ' + JSON.stringify(prod));

        return this.http.post<any>('http://localhost:9090/products', prod).pipe(
            map(createdProduct => {
              // Add the newly created product to the local productslist
              ProductsService.productslist.push(createdProduct);
      
              // Notify observers about the updated productslist
              this.products$.next(ProductsService.productslist);
              // Return the updated productslist
              return ProductsService.productslist;
            })
          );
    }

    update(prod: Product): Observable<any>{
        console.log('update prod = '  + prod);
        return this.http.put<any>(`http://localhost:9090/products/${prod.id}`, prod).pipe(
            map(() => {
              // Add the newly updated product to the local productslist
              ProductsService.productslist.forEach(element => {
                if(element.id == prod.id)
                {
                    element.name = prod.name;
                    element.category = prod.category;
                    element.code = prod.code;
                    element.description = prod.description;
                    element.image = prod.image;
                    element.inventoryStatus = prod.inventoryStatus;
                    element.price = prod.price;
                    element.quantity = prod.quantity;
                    element.rating = prod.rating;
                }
            });
      
              // Notify observers about the updated productslist
              this.products$.next(ProductsService.productslist);
              // Return the updated productslist
              return ProductsService.productslist;
            })
          );
    }


    delete(id: number): Observable<any>{
        console.log('onDelete method id = ' + id);
        return this.http.delete<any>(`http://localhost:9090/products/${id}`).pipe(
            map(() => {
              // Add the newly created product to the local productslist
              ProductsService.productslist = ProductsService.productslist.filter(value => { return value.id !== id } );
      
              // Notify observers about the updated productslist
              this.products$.next(ProductsService.productslist);
              // Return the updated productslist
              return ProductsService.productslist;
            })
          );
    }
}