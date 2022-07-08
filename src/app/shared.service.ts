import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  public choosedAddress: any = "";


  constructor() { }
  private address = new  BehaviorSubject(this.choosedAddress);

  cartCount: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  
  currentSelectedAddress = this.address.asObservable();

  changeSelectedAddress(message: string) {
  this.address.next(message)
  }
}
