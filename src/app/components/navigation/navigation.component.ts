import { Component, OnInit } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { MatDialog } from '@angular/material/dialog';
import { TemplateRef } from '@angular/core';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  
  langs: string[] = [];

  constructor(public translate: TranslateService, private dialog: MatDialog) {

    this.translate.addLangs(['es', 'en']);
    this.langs = this.translate.getLangs();
    this.translate.setDefaultLang('es');
   }


  changeLang(lang: string){
    this.translate.use(lang);
  }

  ngOnInit(): void {
  }

  openDialogWithRef(ref: TemplateRef<any>) {
    this.dialog.open(ref);
  }

}
