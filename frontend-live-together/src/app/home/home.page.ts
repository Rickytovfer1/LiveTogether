import {Component, OnInit} from '@angular/core';
import {IonContent, IonButton, IonIcon} from '@ionic/angular/standalone';
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonContent, IonButton, IonIcon],
})
export class HomePage implements OnInit {
  deviceView: 'mobile' | 'desktop' = 'mobile';

  mobileImages = [
    'assets/screen/gastos.png',
    'assets/screen/vivienda.png',
    'assets/screen/elecciones.png',
    'assets/screen/sancion.png',
  ];

  desktopImages = [
    'assets/screen/ordenador-gasto.png',
    'assets/screen/ordenador-vivienda.png',
    'assets/screen/ordenador-voto.png',
  ];

  currentImage = 0;
  private intervalId: any;

  constructor(private router: Router,) {
  }
  ngOnInit() {

    this.intervalId = setInterval(() => {

      const images =
        this.deviceView === 'mobile'
          ? this.mobileImages
          : this.desktopImages;

      this.currentImage =
        (this.currentImage + 1) % images.length;

    }, 3000);
  }

  changeDevice(device: 'mobile' | 'desktop') {
    this.deviceView = device;
    this.currentImage = 0;
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }

  navigateToInicioSesion() {
    this.router.navigate(["/inicio-sesion"]);
  }

  navigateToRegistrar() {
    this.router.navigate(["/registro-vecino-index"]);
  }
}
