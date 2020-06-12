import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'lib-guitar-looper',
  template: `
    <svg width="307" height="559" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient cx="50%" cy="0%" fx="50%" fy="0%" r="445.455%" gradientTransform="matrix(0 .22449 -1 0 .5 -.112)" id="a">
          <stop stop-color="#DCDCDC" offset="0%"/>
          <stop stop-color="#0F0E0E" offset="100%"/>
        </radialGradient>
        <radialGradient cx="65.305%" cy="25.731%" fx="65.305%" fy="25.731%" r="103.333%" gradientTransform="matrix(0 .96774 -1.01393 0 .914 -.375)" id="b">
          <stop stop-color="#E31111" offset="0%"/>
          <stop offset="100%"/>
        </radialGradient>
        <radialGradient cx="50%" cy="50%" fx="50%" fy="50%" r="100%" id="c">
          <stop stop-color="#AEADAB" offset="0%"/>
          <stop stop-color="#767573" offset="100%"/>
        </radialGradient>
      </defs>
      <g fill="none" fill-rule="evenodd">
        <g transform="translate(0 179)">
          <rect x="11" width="19" height="80" rx="9"/>
          <rect fill="url(#a)" y="16" width="11" height="49" rx="3.5"/>
        </g>
        <g transform="translate(277 368)">
          <rect width="19" height="80" rx="9"/>
          <rect fill="url(#a)" x="19" y="16" width="11" height="49" rx="3.5"/>
        </g>
        <g transform="translate(28)">
          <rect stroke="#979797" fill="#2A2A2C" x=".5" y=".5" width="252" height="558" rx="42"/>
          <ellipse stroke="#979797" fill="url(#b)" cx="125" cy="297.5" rx="14.5" ry="15"/>
          <g transform="translate(73 44)">
            <ellipse stroke="#464648" fill="#121117" cx="54" cy="54.5" rx="53.5" ry="54"/>
            <rect stroke="#979797" fill="#FFF" x="52.5" y="3.5" width="5" height="41" rx="2.5"/>
          </g>
          <g transform="translate(49 372)">
            <circle fill="#AEADAB" opacity=".811" cx="77.5" cy="78.5" r="57.5"/>
            <path fill="#BBB9B3" d="M105.75 28.57L134 77.5l-28.25 48.93h-56.5L21 77.5l28.25-48.93z"/>
            <circle fill="url(#c)" cx="77.5" cy="77.5" r="33.5"/>
          </g>
        </g>
        <text font-family="ShreeDev0714, Shree Devanagari 714" font-size="16" fill="#FFF" transform="translate(-14)">
          <tspan x="147.72" y="31" font-family="LucidaGrande, Lucida Grande"> Level</tspan>
        </text>
        <text font-family="ShreeDev0714, Shree Devanagari 714" font-size="16" fill="#FFF" transform="translate(-14)">
          <tspan x="60" y="544"> fk electronic</tspan>
        </text>
        <text font-family="ShreeDev0714, Shree Devanagari 714" font-size="16" fill="#FFF" transform="translate(-14)">
          <tspan x="0" y="281"> LOOPER</tspan>
        </text>
        <text font-family="Noteworthy-Light, Noteworthy" font-size="16" font-weight="300" fill="#FFF" transform="translate(-14)">
          <tspan x="63" y="157" font-size="88">LITTO</tspan>
        </text>
      </g>
    </svg>  `,
  styles: [
  ]
})
export class GuitarLooperComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
