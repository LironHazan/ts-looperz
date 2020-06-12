import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {GuitarLooperModule} from '../../projects/guitar-looper/src/lib/guitar-looper.module';

@NgModule({
  declarations: [
    AppComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        GuitarLooperModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
