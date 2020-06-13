import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

@Component({
  selector: 'lib-stomp-btn',
  template: `
    <svg width="115" height="115" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient cx="50%" cy="50%" fx="50%" fy="50%" r="100%" id="a">
          <stop stop-color="#AEADAB" offset="0%"/>
          <stop stop-color="#767573" offset="100%"/>
        </radialGradient>
      </defs>
      <g transform="translate(-20 -21)" fill="none" fill-rule="evenodd">
        <circle fill="#AEADAB" opacity=".811" cx="77.5" cy="78.5" r="57.5"/>
        <path fill="#BBB9B3" d="M105.75 28.57L134 77.5l-28.25 48.93h-56.5L21 77.5l28.25-48.93z"/>
        <circle fill="url(#a)" cx="77.5" cy="77.5" r="33.5"/>
      </g>
    </svg>
  `,
  styleUrls: ['./stomp-btn.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StompBtnComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
