import { Component, OnInit, OnDestroy } from '@angular/core';
import { ShoppingCart } from 'src/app/models/shoppingcart';
import { CartService } from 'src/app/services/cart.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-shoppingcart',
  templateUrl: './shoppingcart.component.html',
  styleUrls: ['./shoppingcart.component.scss']
})
export class ShoppingcartComponent implements OnInit, OnDestroy {
  public cartItems: ShoppingCart[];
  userId;
  totalPrice: number;
  private unsubscribe$ = new Subject<void>();

  constructor(
    private cartService: CartService,
    private snackBarService: SnackbarService,
    private userService: UserService) {
    this.userId = localStorage.getItem('userId');
  }

  ngOnInit() {
    this.cartItems = [];
    this.getShoppingCartItems();
  }

  getShoppingCartItems() {
    this.cartService.getCartItems(this.userId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (result: ShoppingCart[]) => {
          this.cartItems = result;
          this.getTotalPrice();
        }, error => {
          console.log('Error ocurred while fetching shopping cart item : ', error);
        });
  }

  getTotalPrice() {
    this.totalPrice = 0;
    this.cartItems.forEach(item => {
      //this.totalPrice += (item.document.price * item.quantity);
    });
  }

  deleteCartItem(documentId: number) {
    this.cartService.removeCartItems(this.userId, documentId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        result => {
          this.userService.cartItemcount$.next(result);
          this.snackBarService.showSnackBar('Product removed from cart');
          this.getShoppingCartItems();
        }, error => {
          console.log('Error ocurred while deleting cart item : ', error);
        });
  }

  addToCart(documentId: number) {
    this.cartService.addBookToCart(this.userId, documentId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        result => {
          this.userService.cartItemcount$.next(result);
          this.snackBarService.showSnackBar('One item added to cart');
          this.getShoppingCartItems();
        }, error => {
          console.log('Error ocurred while addToCart data : ', error);
        });
  }

  deleteOneCartItem(documentId: number) {
    this.cartService.deleteOneCartItem(this.userId, documentId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        result => {
          this.userService.cartItemcount$.next(result);
          this.snackBarService.showSnackBar('One item removed from cart');
          this.getShoppingCartItems();
        }, error => {
          console.log('Error ocurred while fetching book data : ', error);
        });
  }

  clearCart() {
    this.cartService.clearCart(this.userId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        result => {
          this.userService.cartItemcount$.next(result);
          this.snackBarService.showSnackBar('Cart cleared!!!');
          this.getShoppingCartItems();
        }, error => {
          console.log('Error ocurred while deleting cart item : ', error);
        });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
