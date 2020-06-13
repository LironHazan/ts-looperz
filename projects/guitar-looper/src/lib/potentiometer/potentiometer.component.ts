import {ChangeDetectionStrategy, Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild} from '@angular/core';

// !! some of the functions are taken from https://github.com/vitaliy-bobrov/js-rocks knob component
// used https://github.com/wokwi/wokwi-elements potentiometer-element as main reference..

interface Point {
  x: number;
  y: number;
}

@Component({
  selector: 'lib-potentiometer',
  template: `
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
    <svg role="slider" width="108" height="109"
         (click)="onFocus()"
         (mousedown)="down($event)"
         (mouseup)="up()"
         (mousemove)="move($event)">
        <ellipse class="knob" #knob cx="54" cy="54" rx="53" ry="54"/>
        <rect [style.--knob-angle]="calcKnobDeg()" id="rotating"  x="52" y="3" width="5" height="41" rx="2"/>
    </svg>
  `,
  styleUrls: ['./potentiometer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PotentiometerComponent  {
  @ViewChild('knob', { read: ElementRef, static: true }) knob;
  @ViewChild('input', { read: ElementRef, static: true }) input;

  @Input() min = 0;
  @Input() max = 100;
  @Input() value = 0;
  @Input() step = 1;
  @Input() startDegree = -135;
  @Input() endDegree = 135;

  @Output() vol: EventEmitter<number> = new EventEmitter();

  private center: Point = { x: 0, y: 0 };
  private pressed = false;

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

}
