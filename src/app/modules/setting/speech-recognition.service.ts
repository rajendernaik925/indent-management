import { Injectable, NgZone } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpeechRecognitionService {
  private recognition: any;
  private isListening = false;

  constructor(private zone: NgZone) {
    const SpeechRecognition = (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error('Speech recognition not supported in this browser.');
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.lang = 'en-IN';
    this.recognition.interimResults = false;
    this.recognition.continuous = false;
  }

  startListening(callback: (text: string) => void): void {
    if (!this.recognition || this.isListening) return;

    this.recognition.start();
    this.isListening = true;
    console.log('🎙️ Listening started...');

    this.recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      console.log('📝 Transcript:', transcript);
      this.zone.run(() => callback(transcript));
    };

    this.recognition.onerror = (event: any) => {
      console.error('❌ Speech recognition error:', event.error);
      this.isListening = false;
    };

    this.recognition.onend = () => {
      console.log('🛑 Listening stopped.');
      this.isListening = false;
    };
  }

  stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  get isRecognizing(): boolean {
    return this.isListening;
  }
}
