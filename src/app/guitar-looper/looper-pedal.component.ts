import {Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {GuitarLooperService} from './guitar-looper.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

// !! some of the functions are taken from https://github.com/vitaliy-bobrov/js-rocks knob component
// used https://github.com/wokwi/wokwi-elements potentiometer-element as main reference..

interface Point {
  x: number;
  y: number;
}

export enum State {
  idle = 'idle',
  rec = 'rec',
  overlap = 'overlap',
  stop = 'stop',
  cleared = 'cleared'
}

export interface RecChannel {
  index: number; // Max 5
  playable: HTMLAudioElement;
  blob: Blob;
}

// Based on the Ditto looper of tc electronic (which I sold few months ago but I liked as a product..)
@Component({
  selector: 'app-looper-pedal',
  templateUrl: './looper-pedal.component.html',
  styleUrls: ['./looper-pedal.component.css']
})
export class LooperPedalComponent implements OnInit, OnDestroy {
  @ViewChild('knob', { read: ElementRef, static: true }) knob;
  @ViewChild('input', { read: ElementRef, static: true }) input;
  private zoomRange: 100;
  private center: Point = { x: 0, y: 0 };
  private pressed = false;
  private ngUnSubscribe: Subject<void> = new Subject<void>();


  // State machine:
  // White: idle --> press to record
  // Red: recording --> press to stop recording
  // Yellow: Press to recording (overlap)
  // Red : recording --> X5 times
  // double press to stop
  // single press after double to delete
  private lineRef: MediaStreamAudioSourceNode;
  private looperState: State = State.idle;
  ledColor = '#998B7F';

  @Input() min = 0;
  @Input() max = 100;
  @Input() value = 0;
  @Input() step = 1;
  @Input() startDegree = -135;
  @Input() endDegree = 135;

  @Output() vol: EventEmitter<number> = new EventEmitter();

  constructor(private looperService: GuitarLooperService) { }

  async ngOnInit()  {
    this.looperService.onRecStop
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((chunks) => {
      this.onRecStop(chunks, {} as RecChannel);
    });
    this.lineRef = await this.looperService.setup();
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
    this.looperState = State.rec;
  }

  private handleRec() {
    this.ledColor = '#FBFF6E';
    this.looperState = State.overlap;

  }

  private handleOverlap() {}
  private handleStop() {}
  private handleClear() {}

  changeLoopState() {
    switch (this.looperState) {
      case State.idle:
        this.handleIdle();
        break;
      case State.rec:
        this.handleRec();
        break;
      case State.overlap:
        this.handleOverlap();
        break;
      case State.stop:
        this.handleStop();
        break;
      case State.cleared:
        this.handleClear();
        break;
    }
  }

  onRecStop(chunks: Blob[], channel: RecChannel) {
    channel.blob = new Blob(chunks, {
        type : 'audio/ogg; codecs=opus',
      });
      // Reset chunks
    chunks = [];

    const src = channel.blob &&  URL.createObjectURL(channel.blob);
    if (!src) { return; }
    channel.playable = new Audio(src);
    channel.playable.loop =  true;
    channel.playable.play();
  }

  ngOnDestroy(): void {
    this.ngUnSubscribe.next();
    this.ngUnSubscribe.complete();
    if (this.lineRef) {
      this.lineRef.disconnect();
    }
  }

}
