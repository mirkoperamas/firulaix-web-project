import { Component, OnInit } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css','../general-style-components.css']
})
export class NavigationComponent implements OnInit {

  langs: string[] = [];


  constructor(public translate: TranslateService) {

    this.translate.addLangs(['es', 'en']);
    this.langs = this.translate.getLangs();
    this.translate.setDefaultLang('es');
   }


  changeLang(lang: string){
    this.translate.use(lang);
  }

  ngOnInit(): void {
  }

}
