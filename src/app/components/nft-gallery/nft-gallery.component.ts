import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nft-gallery',
  templateUrl: './nft-gallery.component.html',
  styleUrls: ['./nft-gallery.component.scss', '../../app.component.scss']
})
export class NftGalleryComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  hasmeClick(){
    alert("a");
  }

}
