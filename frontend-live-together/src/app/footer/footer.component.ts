import { Component, OnInit } from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {Router} from "@angular/router";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
  imports: [
    IonicModule
  ]
})
export class FooterComponent  implements OnInit {

  popoverId = 'popover-agregar-' + Math.random().toString(36).substring(2, 11);

  constructor(private router: Router) { }

  ngOnInit() {}

  navigateToComunidades() {
    this.router.navigate(['/comunidades']);
  }

  navigateToUnirseComunidad() {
    this.router.navigate(['/unirse-comunidad']);

  }

}
