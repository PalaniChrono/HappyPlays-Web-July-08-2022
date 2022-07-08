import { Component, OnInit } from '@angular/core';
import { CarouselModule,OwlOptions } from 'ngx-owl-carousel-o';
import { ApiService } from '../api.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  bannerList:any = '';
  bottombannerList:any = '';
  loading = true;
  newArrivalList:any = '';
  subCategoryList:any = '';
  mobileBannerList:any = '';

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    navSpeed: 200,
    dotsEach:true,
    lazyLoad:true,
    // animateIn:true,
    slideTransition:'ease',
    autoplay:true,
    autoplayHoverPause:true,

    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 1
      },
      940: {
        items: 1
      }
    },
    nav: true
  }
  getcategories: any;
  WoodenTrayList: any;
  imaginativeList: any;
  submenus: any;

  constructor( private apiService: ApiService,) { }

  ngOnInit(): void {
    this. getHomeData();
    this.getcategory();
    this.getAllCategory();
  }
  pagetop(){
    window.scrollTo(0,0)
  }



  getHomeData() {
    this.apiService.getData('getHomeData').subscribe((data) => {
        let value = data.data;
        this.bannerList = value.banners;
        this.bottombannerList = value.bottomBanners;
        this.subCategoryList = value.getCategorySC;
        this.mobileBannerList = value.mobileBanners;
        this.newArrivalList = value.newarrivals;
        this.getcategories = data.getCategorySC
        this.WoodenTrayList = value.getWoodenTray[0].products;
        this.imaginativeList = value.getImaginativePlay[0].products;

        setTimeout(() => {
            this.loading = false;
        }, 100)
    });

}
getcategory(){
  this.apiService.getData('getCategorySC').subscribe((data) => {
    let value = data.data;
    this.bannerList = value.category_name;
    this.subCategoryList = value.category_image;
    this.mobileBannerList = value.mobileBanners;
    this.newArrivalList = value.newarrivals;
    console.log(this.newArrivalList);
    setTimeout(() => {
        this.loading = false;
    }, 100)
});
}
convertImage(url: string, type='') {
  if(type === 'sub-category') {
      return url.replace("/upload/", "/upload/h_418,w_313/");
  } else if(type === 'product') {
      return url.replace("/upload/", "/upload/h_418,w_313/");
  } else {
      return url.replace("/upload/", "/upload/h_5,w_10/");
  }
  // if(type === 'banner') {
      // return url.replace("/upload/", "/upload/h_5,w_10/");
  // }
}



getAllCategory() {
  this.loading = false;
  this.apiService.getData('getAllCategory').subscribe((data) => {
      this.subCategoryList = data.data;
      this.submenus = data.data[0].sub_categories_four;
      console.log("needed for listing page",this.submenus)
      this.loading = true;
  });


  }

}
