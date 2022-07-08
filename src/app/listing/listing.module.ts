import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListingRoutingModule } from './listing-routing.module';
import { ListingComponent } from './listing/listing.component';


@NgModule({
  declarations: [
    ListingComponent
  ],
  imports: [
    CommonModule,
    ListingRoutingModule
  ]
})
export class ListingModule { }
