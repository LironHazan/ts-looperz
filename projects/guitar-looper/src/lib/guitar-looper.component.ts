import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'lib-guitar-looper',
  template: `
      <lib-looper-pedal>
        <lib-potentiometer potentiometer></lib-potentiometer>
        <lib-stomp-btn stomp></lib-stomp-btn>
      </lib-looper-pedal>
    `,
  styleUrls: ['./guitar-looper.component.css']
})
export class GuitarLooperComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
