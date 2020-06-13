import { Component, OnInit } from '@angular/core';
// Based on the Ditto looper of tc electronic (which I sold few months ago but I liked as a product..)
@Component({
  selector: 'lib-looper-pedal',
  template: `
    <ng-content select="[potentiometer]"></ng-content>
    <ng-content select="[stomp]"></ng-content>
    <ng-content select="[led]"></ng-content>
    <svg width="307" height="559" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient cx="50%" cy="0%" fx="50%" fy="0%" r="445.455%" gradientTransform="matrix(0 .22449 -1 0 .5 -.112)" id="a">
          <stop stop-color="#DCDCDC" offset="0%"/>
          <stop stop-color="#0F0E0E" offset="100%"/>
        </radialGradient>
        <radialGradient cx="50%" cy="50%" fx="50%" fy="50%" r="100%" id="c">
          <stop stop-color="#AEADAB" offset="0%"/>
          <stop stop-color="#767573" offset="100%"/>
        </radialGradient>
      </defs>
      <!-- INPUT and OUTPUT -->
      <g transform="translate(0 179)" fill="url(#a)">
        <rect x="11" width="19" height="80" rx="9"/>
        <rect y="16" width="11" height="49" rx="3.5"/>
      </g>
      <g transform="translate(277 368)" fill="url(#a)">
        <rect width="19" height="80" rx="9"/>
        <rect x="19" y="16" width="11" height="49" rx="3.5"/>
      </g>
      <!-- Looper's body -->
      <g transform="translate(28)">
        <rect fill="#2A2A2C" x=".5" y=".5" width="252" height="558" rx="42"/>
        <g font-family="Noteworthy-Light,Noteworthy">
          <text
            font-size="16"
            fill="#FFF"
            transform="translate(110, 30)">
            Level
          </text>
          <text font-size="16"
                fill="#FFF"
                transform="translate(85, 535)">
            fk electronic
          </text>
          <text
            font-size="16"
            fill="#FFF"
            transform="translate(20, 280)">
            LOOPER
          </text>
          <text
            font-size="88"
            font-weight="300"
            fill="#FFF"
            transform="translate(20, 250)">
            LITTO
          </text>
        </g>
      </g>
    </svg> `,
  styleUrls: ['./looper-pedal.component.css']
})
export class LooperPedalComponent implements OnInit {

  // State machine:
  // White: idle --> press to record
  // Red: recording --> press to stop recording
  // Yellow: Press to recording (overlap)
  // Red : recording --> X5 times
  // double press to stop
  // single press after double to delete

  constructor() { }

  ngOnInit(): void {
  }

}
