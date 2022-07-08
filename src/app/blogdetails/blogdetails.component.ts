import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SharedService } from 'src/app/shared.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-blogdetails',
  templateUrl: './blogdetails.component.html',
  styleUrls: ['./blogdetails.component.css']
})
export class BlogdetailsComponent implements OnInit {
  productSlug: any;
  blogdetails: any;
  recent_posts: any;
  cmnt_name:any
  cmnt_mail:any
  cmnt_site:any
  cmnt_cnt:any
  warn:boolean=false
  success:boolean=false
  approvedcmnts: any;
  approved_cmnts_test: any;
  approved_blog_cmntId: any;
  tagproduct: any;
  tagproductID: any;
  apiService: any;
  tagproductdetails: any;
  productweight: any;
  loading: boolean=false;
  bottomspace: any;
  constructor(private apiservice:ApiService,private route:ActivatedRoute) { }

  ngOnInit(): void {
    this.productSlug = this.route.snapshot.paramMap.get('id');
    this.getblogdetails(this.productSlug);
    this.removesapcePRE()


  }

getblogdetails(id:number){

  this.apiservice.getData('getBlogDetailsById',id).subscribe(data => {
    this.blogdetails= data.data
    this.recent_posts = data.code
    window.scrollTo(0,0)
  })
}
cmnt_sub(){
  var cmntname:string= this.cmnt_name
  var cmntemail:string=this.cmnt_mail
  var cmntweb:string=this.cmnt_site
  var cmnt:string= this.cmnt_cnt
  if(cmntname.length<=1||cmntemail.length<=1||cmnt.length<=1){
   this.warn=true
  }
  else{
    const cmnt_value={
      name:this.cmnt_name,
      email:this.cmnt_mail,
      website:this.cmnt_site,
      comments:this.cmnt_cnt,
      blog_details_id:this.blogdetails[0].id
    }
    this.apiservice.postData(cmnt_value, 'blogComment').subscribe(data =>{


    });
    this.cmnt_name=''
    this.cmnt_mail=''
    this.cmnt_cnt=''
    this.cmnt_site=''
    this.success=true
  }

}
closealert(){
  this.warn=false
  this.success=false
}

alertingfunc(){
  this.blogdetails[0].tag_name.forEach((element: { itemName: any; }) => {
    var testingtags = element.itemName


  });

}
removesapcePRE(){
  this.bottomspace=document.querySelector("blog-details-content-section");
  this.bottomspace.textContent=this.bottomspace.replace(/^\s+/mg, "");
}
}
