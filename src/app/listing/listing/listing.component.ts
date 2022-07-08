import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { ActivatedRoute } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.css']
})
export class ListingComponent implements OnInit {
  blogtagproduct: any ='';
  loading: boolean = true;
  Products: any = '';
  subCategoryName:any = '';
  subCategorySlug:any = '';
  allTags:any = '';
  productweight : any = ""
  categorySlug :any = ""
  defaultImage = 'assets/image/product-blur.jpg';
  customerId = localStorage.getItem('customer_id');
  filterTag = [];
  Blogtagdetails: any;
  tagproductID:any ='';
  tagproductdetails:any ='';
  tagproduct:any ='';
  productslisting:boolean=true
  tagslisting:boolean=false
  constructor(private apiService: ApiService,private route: ActivatedRoute, private deviceService: DeviceDetectorService)  { }
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.subCategorySlug = params.get('slug');
      if(this.subCategorySlug ){
        this.getProducts();
        this.productslisting=true
        this.tagslisting=false
      }
    });
    this.route.paramMap.subscribe(params => {
      this.tagproduct = params.get('tag');
      if(this.tagproduct ){
        this.gettagProducts();
        this.getBlogTagProducts();
        this.productslisting=false
        this.tagslisting=true
      }
    });
  }
  gettagProducts(){
    this.tagproduct = this.route.snapshot.paramMap.get('tag');
    this.tagproductID = this.route.snapshot.paramMap.get('id');
    this.apiService.getData('getTagProducts', this.tagproductID).subscribe((data) => {
      this.tagproductdetails = data.data;
      if(this.tagproductdetails.length==0){
        // alert("empty")

      }
     // this.productweight = value.product_sizes.
      this.productweight.style.cursor="pointer"
      setTimeout(() => {
          this.loading = false;
      }, 100);
  }, error => {
      this.loading = false;
  });

  }

  getBlogTagProducts(){
    this.blogtagproduct = this.route.snapshot.paramMap.get('tag');
    this.tagproductID = this.route.snapshot.paramMap.get('id');
    this.apiService.getData('getBlogTagProducts', this.tagproductID).subscribe((data) => {
      this.Blogtagdetails = data.data;
      if(this.Blogtagdetails.length==0){
        // alert("empty blog")

      }
      this.productweight.style.cursor="pointer"
      setTimeout(() => {
          this.loading = false;
      }, 100);
  }, error => {
      this.loading = false;
  });

  }
  getProducts() {
    this.subCategorySlug = this.route.snapshot.paramMap.get('slug');
    this.apiService.getData('getProducts', this.subCategorySlug).subscribe((data) => {
        const value = data.data[0];
        this.Products = value.products;
        this.subCategoryName = value.sub_category_name;
        this.allTags = value.tags[0].sub_category_tags;
        this.productweight = value.product_sizes.
        this.productweight.style.cursor="pointer"
        setTimeout(() => {
            this.loading = false;
        }, 100);
    }, error => {
        this.loading = false;
    });
}
convertImage(url:any) {
    if(this.deviceService.isDesktop()) {
        return url.replace("/upload/", "/upload/c_scale,h_300,w_300/");
    } else if(this.deviceService.isMobile()) {
        return url.replace("/upload/", "/upload/c_scale,h_760,w_760/");
    }
}
pagetop(){
  window.scrollTo(0,0)
}
}
