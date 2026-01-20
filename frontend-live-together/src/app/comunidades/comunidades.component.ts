import { Component, OnInit } from '@angular/core';
import {IonicModule, Platform} from "@ionic/angular";
import {HeaderComponent} from "../header/header.component";
import {FooterComponent} from "../footer/footer.component";
import {NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {NavLateralComponent} from "../nav-lateral/nav-lateral.component";

@Component({
  selector: 'app-comunidades',
  templateUrl: './comunidades.component.html',
  styleUrls: ['./comunidades.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    HeaderComponent,
    FooterComponent,
    NgForOf,
    NgOptimizedImage,
    NavLateralComponent,
    NgIf
  ]
})
export class ComunidadesComponent  implements OnInit {
  isDesktop: boolean = false;

  constructor(private platform: Platform) { }

  ngOnInit() {
    this.isDesktop = this.platform.width() >= 992;
  }

}
