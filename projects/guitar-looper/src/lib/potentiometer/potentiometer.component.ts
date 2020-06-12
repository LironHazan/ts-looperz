import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'lib-potentiometer',
  template: `
    <svg width="108" height="109" xmlns="http://www.w3.org/2000/svg">
      <g fill="none" fill-rule="evenodd">
        <ellipse stroke="#464648" fill="#121117" cx="54" cy="54.5" rx="53.5" ry="54"/>
        <rect stroke="#979797" fill="#FFF" x="52.5" y="3.5" width="5" height="41" rx="2.5"/>
      </g>
    </svg>
  `,
  styleUrls: ['./potentiometer.component.css']
})
export class PotentiometerComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
