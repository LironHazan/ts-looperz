import { Injectable } from '@angular/core';
import {Observable, of, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GuitarLooperService {

  stream: MediaStream;
  mediaRecorder: MediaRecorder;
  onRecStop: Subject<Blob[]> = new Subject<Blob[]>();

  constructor() { }

  // potentiometer
  public clamp(min: number, max: number, value: number): number {
    return Math.min(Math.max(value, min), max);
  }

  public mapToMinMax(value: number, min: number, max: number): number {
    return value * (max - min) + min;
  }

  public percentFromMinMax(value: number, min: number, max: number): number {
    return (value - min) / (max - min);
  }

  public async setup(): Promise<MediaStreamAudioSourceNode> {
    // Getting permission status.
    await navigator.permissions.query({name: 'microphone'});

    // Streaming audio:
    const lineInRef = await this.setupAudioLine();

    // Recording streamed audio!
    await this.setupRecorder();

    return lineInRef;
  }

  private async setupAudioLine(): Promise<MediaStreamAudioSourceNode> {
    const context = new AudioContext();

    if (context.state === 'suspended') {
      await context.resume();
    }

    this.stream = await navigator.mediaDevices
      .getUserMedia({
        audio: {
          echoCancellation: false,
          autoGainControl: false,
          noiseSuppression: false,
          latency: 0
        }
      });

    const lineInSource = context.createMediaStreamSource(this.stream);
    lineInSource.connect(context.destination);
    return lineInSource;
  }

  private async setupRecorder(): Promise<void> {
    this.mediaRecorder = new MediaRecorder(this.stream);
    const chunks: Blob[] = [];

    this.mediaRecorder.ondataavailable = (event) => {
      chunks.push(event.data);
    };

    this.mediaRecorder.onstop = () => {
      this.onRecStop.next(chunks);
    };
  }
}
