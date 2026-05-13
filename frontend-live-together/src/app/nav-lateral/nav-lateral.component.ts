import { Component, OnInit } from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {Router} from "@angular/router";

@Component({
  selector: 'app-nav-lateral',
  templateUrl: './nav-lateral.component.html',
  styleUrls: ['./nav-lateral.component.scss'],
  standalone: true,
  imports: [
    IonicModule
  ]
})
export class NavLateralComponent  implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {}

  navigateToComunidades() {
    this.router.navigate(['/comunidades']);
  }

  navigateToUnirseComunidad() {
    this.router.navigate(['/unirse-comunidad']);

  }

  navigateToCrearComunidad() {
    this.router.navigate(['/crear-comunidad']);
  }
}
