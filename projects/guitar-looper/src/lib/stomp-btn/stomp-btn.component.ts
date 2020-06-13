import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'lib-stomp-btn',
  template: `
    <svg width="115" height="115" class="stomp-btn">
      <defs>
        <radialGradient cx="50%" cy="50%" fx="50%" fy="50%" r="190%" gradientTransform="matrix(0 1 -.5866 0 .793 0)" id="b">
          <stop stop-color="#C2C0BC" offset="0%"/>
          <stop stop-color="#BCBAB6" offset="8.808%"/>
          <stop stop-color="#767573" offset="100%"/>
        </radialGradient>
        <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="a">
          <stop stop-color="#DFDDDA" offset="0%"/>
          <stop stop-color="#BBB9B3" offset="100%"/>
        </linearGradient>
      </defs>
      <g transform="translate(-20 -21)">
        <circle fill="#AEADAB" cx="77" cy="77" r="57"/>
        <path d="M77.5 21.707L21.707 77.5 77.5 133.293 133.293 77.5 77.5 21.707z" stroke="url(#a)" fill="#C9C7C3" transform="rotate(30 77.5 77.5)"/>
        <path stroke="#979797" fill="#625F5F" opacity=".6" d="M108.545 90.52l18 10.816-3.09 5.143-18-10.815zM32.402 47.036l18 10.815-3.09 5.143-18-10.815z"/>
        <circle fill="url(#b)" cx="77" cy="77" r="33"/>
        <path stroke="#979797" fill="#625F5F" opacity=".6" d="M50.255 122.48l9.211-16.618 5.248 2.909-9.211 16.617zM91.286 46.23l10.18-18.368 5.248 2.909-10.18 18.367z"/>
      </g>
    </svg>
  `,
  styleUrls: ['./stomp-btn.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StompBtnComponent  {

 @Output() press = new EventEmitter();

}
