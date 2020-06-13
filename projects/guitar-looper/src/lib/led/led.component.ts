import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'lib-led',
  template: `
  <svg width="30" height="30">
    <defs>
      <radialGradient cx="65.305%" cy="25.731%" fx="65.305%" fy="25.731%" r="103.333%"
                      gradientTransform="matrix(0 .96774 -1.01393 0 .914 -.375)" id="b">
        <stop stop-color="#E31111" offset="0%"/>
        <stop offset="100%"/>
      </radialGradient>
    </defs>
    <ellipse class="led" stroke="#979797" fill="#E31111" cx="125" cy="297.5" rx="14.5" ry="15"/>
  </svg>`,
  styleUrls: ['./led.component.css']
})
export class LedComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
