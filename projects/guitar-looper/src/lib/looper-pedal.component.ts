import {Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild} from '@angular/core';

// !! some of the functions are taken from https://github.com/vitaliy-bobrov/js-rocks knob component
// used https://github.com/wokwi/wokwi-elements potentiometer-element as main reference..

interface Point {
  x: number;
  y: number;
}
type LooperState = 'idle' | 'rec' | 'overlap' | 'stop' | 'cleared'; // todo: enum

// Based on the Ditto looper of tc electronic (which I sold few months ago but I liked as a product..)
@Component({
  selector: 'lib-looper-pedal',
  template: `
    <input type="range" min="1" max="200" value="100" class="slider" (input)="onZoomChanged($event)">
    <span id="zoomValue">100%</span>
    <input
      #input
      autofocus
      tabindex="0"
      type="range"
      class="hide-input"
      [max]="max"
      [min]="min"
      [value]="value"
      [step]="step"
      (change)="onValueChange($event)"/>
    <svg [style.transform]="scale()"
      id="zoom-pedal" width="307" height="559" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient cx="50%" cy="0%" fx="50%" fy="0%" r="445.455%" gradientTransform="matrix(0 .22449 -1 0 .5 -.112)" id="a">
          <stop stop-color="#DCDCDC" offset="0%"/>
          <stop stop-color="#0F0E0E" offset="100%"/>
        </radialGradient>
        <radialGradient cx="65.305%" cy="25.731%" fx="65.305%" fy="25.731%" r="103.333%"
                        gradientTransform="matrix(0 .96774 -1.01393 0 .914 -.375)" id="led-filter">
          <stop [attr.stop-color]="ledColor" offset="0%"/> <!-- Yellow #FBFF6E Red: E31111 Gray: #998B7F-->
          <stop offset="100%"/>
        </radialGradient>
        <radialGradient cx="50%" cy="50%" fx="50%" fy="50%" r="100%" id="c">
          <stop stop-color="#AEADAB" offset="0%"/>
          <stop stop-color="#767573" offset="100%"/>
        </radialGradient>
        <radialGradient cx="50%" cy="50%" fx="50%" fy="50%" r="100%" id="stomp-btn-filter">
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
      <!-- potentiometer -->
      <g  transform="translate(73 44)"
          (click)="onFocus()"
          (mousedown)="down($event)"
          (mouseup)="up()"
          (mousemove)="move($event)">
          <ellipse class="knob" #knob cx="54" cy="54" rx="53" ry="54"/>
          <rect [style.--knob-angle]="calcKnobDeg()" id="rotating"  x="52" y="3" width="5" height="41" rx="2"/>
      </g>
        <!-- LED -->
        <ellipse class="led" stroke="#979797" fill="url(#led-filter)" cx="125" cy="297.5" rx="14.5" ry="15"/>
        <!-- stomp btn -->
        <g class="stomp-btn">
          <circle fill="#AEADAB" opacity=".811" cx="77.5" cy="78.5" r="57.5"/>
          <path d="M105.461 29.07H49.54L21.577 77.5l27.962 48.43h55.922l27.962-48.43-27.962-48.43z" stroke="#969292" fill="#A3A098"/>
          <circle (click)="changeLoopState()" class="push-area" stroke="#7F7C7C" fill="url(#stomp-btn-filter)" cx="76.5" cy="78.5" r="32"/>
        </g>
        <!-- labels -->
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
  @ViewChild('knob', { read: ElementRef, static: true }) knob;
  @ViewChild('input', { read: ElementRef, static: true }) input;
  private zoomRange: 100;
  private center: Point = { x: 0, y: 0 };
  private pressed = false;

  // State machine:
  // White: idle --> press to record
  // Red: recording --> press to stop recording
  // Yellow: Press to recording (overlap)
  // Red : recording --> X5 times
  // double press to stop
  // single press after double to delete
  private looperState: LooperState = 'idle';
  ledColor = '#998B7F';

  @Input() min = 0;
  @Input() max = 100;
  @Input() value = 0;
  @Input() step = 1;
  @Input() startDegree = -135;
  @Input() endDegree = 135;

  @Output() vol: EventEmitter<number> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  @HostListener('focus')
  onFocus() {
    this.input.nativeElement.focus();
  }

  calcKnobDeg() {
    const percent = this.clamp(0, 1, this.percentFromMinMax(this.value, this.min, this.max));
    const deg = (this.endDegree - this.startDegree) * percent + this.startDegree;
    return `${deg}deg`;
  }

  clamp(min: number, max: number, value: number): number {
    return Math.min(Math.max(value, min), max);
  }

  mapToMinMax(value: number, min: number, max: number): number {
    return value * (max - min) + min;
  }

  percentFromMinMax(value: number, min: number, max: number): number {
    return (value - min) / (max - min);
  }

  onValueChange({target}) {
    this.updateValue(parseFloat(target?.value));
  }

  down(event: MouseEvent) {
    if (event.button === 0 || window.navigator.maxTouchPoints) {
      this.pressed = true;
      this.updatePotentiometerPosition(event);
    }
  }

  move(event: MouseEvent) {
    const { pressed } = this;
    if (pressed) {
      this.rotateHandler(event);
    }
  }

  up() {
    this.pressed = false;
  }

  private updatePotentiometerPosition(event: MouseEvent | TouchEvent) {
    event.stopPropagation();
    event.preventDefault();

    const potentiometerRect = this.knob?.nativeElement?.getBoundingClientRect();

    if (potentiometerRect) {
      this.center = {
        x: window.scrollX + potentiometerRect.left + potentiometerRect.width / 2,
        y: window.scrollY + potentiometerRect.top + potentiometerRect.height / 2,
      };
    }
  }

  private rotateHandler(event: MouseEvent | TouchEvent) {
    event.stopPropagation();
    event.preventDefault();
    // TODO: support touch events
    const isTouch = event.type === 'touchmove';
    const pageX = isTouch ? (event as TouchEvent).touches[0].pageX : (event as MouseEvent).pageX;
    const pageY = isTouch ? (event as TouchEvent).touches[0].pageY : (event as MouseEvent).pageY;
    const x = this.center.x - pageX;
    const y = this.center.y - pageY;
    let deg = Math.round((Math.atan2(y, x) * 180) / Math.PI);

    if (deg < 0) {
      deg += 360;
    }

    deg -= 90;

    if (x > 0 && y <= 0) {
      deg -= 360;
    }

    deg = this.clamp(this.startDegree, this.endDegree, deg);
    const percent = this.percentFromMinMax(deg, this.startDegree, this.endDegree);
    const value = this.mapToMinMax(percent, this.min, this.max);

    this.updateValue(value);
  }

  private updateValue(value: number) {
    const clamped = this.clamp(this.min, this.max, value);
    const updated = Math.round(clamped / this.step) * this.step;
    this.value = Math.round(updated * 100) / 100;
    this.vol.emit(this.value);
  }

  // Zooming
  onZoomChanged({target}) {
    this.zoomRange = target.value;
  }

  scale() {
    return `scale(${this.zoomRange / 100})`;
  }

  private handleIdle() {
    this.ledColor = '#E31111';
    this.looperState = 'rec';
  }

  private handleRec() {
    this.ledColor = '#FBFF6E';
    this.looperState = 'overlap';

  }

  private handleOverlap() {}
  private handleStop() {}
  private handleClear() {}

  changeLoopState() {
    switch (this.looperState) {
      case 'idle':
        this.handleIdle();
        break;
      case 'rec':
        this.handleRec();
        break;
      case 'overlap':
        this.handleOverlap();
        break;
      case 'stop':
        this.handleStop();
        break;
      case 'cleared':
        this.handleClear();
        break;
    }
  }

}
