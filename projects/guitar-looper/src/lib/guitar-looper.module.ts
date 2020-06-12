import { NgModule } from '@angular/core';
import { GuitarLooperComponent } from './guitar-looper.component';
import { PotentiometerComponent } from './potentiometer/potentiometer.component';
import { LooperPedalComponent } from './pedal/looper-pedal.component';
import { StompBtnComponent } from './stomp-btn/stomp-btn.component';



@NgModule({
  declarations: [GuitarLooperComponent, PotentiometerComponent, LooperPedalComponent, StompBtnComponent],
  imports: [
  ],
  exports: [GuitarLooperComponent, PotentiometerComponent]
})
export class GuitarLooperModule { }
