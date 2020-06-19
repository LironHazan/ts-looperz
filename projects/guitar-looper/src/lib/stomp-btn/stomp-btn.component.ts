import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'lib-stomp-btn',
  template: `
    <svg width="115" height="115">
      <defs>
        <radialGradient cx="50%" cy="50%" fx="50%" fy="50%" r="100%" id="a">
          <stop stop-color="#AEADAB" offset="0%"/>
          <stop stop-color="#767573" offset="100%"/>
        </radialGradient>
      </defs>
      <g transform="translate(-20 -21)">
        <circle fill="#AEADAB" opacity=".811" cx="77.5" cy="78.5" r="57.5"/>
        <path d="M105.461 29.07H49.54L21.577 77.5l27.962 48.43h55.922l27.962-48.43-27.962-48.43z" stroke="#969292" fill="#A3A098"/>
        <circle class="stomp-btn" stroke="#7F7C7C" fill="url(#a)" cx="76.5" cy="78.5" r="32"/>
      </g>
    </svg>
  `,
  styleUrls: ['./stomp-btn.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StompBtnComponent  {

 @Output() press = new EventEmitter();

}
