import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GuitarLooperService {

  constructor() { }

  // potentiometer
  clamp(min: number, max: number, value: number): number {
    return Math.min(Math.max(value, min), max);
  }

  mapToMinMax(value: number, min: number, max: number): number {
    return value * (max - min) + min;
  }

  percentFromMinMax(value: number, min: number, max: number): number {
    return (value - min) / (max - min);
  }
}
