import {Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild} from '@angular/core';
import {GuitarLooperService} from './guitar-looper.service';

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
  templateUrl: './looper-pedal.component.html',
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

  constructor(private looperService: GuitarLooperService) { }

  ngOnInit(): void {
  }

  @HostListener('focus')
  onFocus() {
    this.input.nativeElement.focus();
  }

  calcKnobDeg() {
    const percent = this.looperService.clamp(0, 1, this.looperService.percentFromMinMax(this.value, this.min, this.max));
    const deg = (this.endDegree - this.startDegree) * percent + this.startDegree;
    return `${deg}deg`;
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

    deg = this.looperService.clamp(this.startDegree, this.endDegree, deg);
    const percent = this.looperService.percentFromMinMax(deg, this.startDegree, this.endDegree);
    const value = this.looperService.mapToMinMax(percent, this.min, this.max);

    this.updateValue(value);
  }

  private updateValue(value: number) {
    const clamped = this.looperService.clamp(this.min, this.max, value);
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
