import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TextToSpeechService {
  private synth = window.speechSynthesis;

  speak(text: string): void {
    if (!this.synth) {
      console.error('Speech Synthesis not supported in this browser.');
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 1;
    utterance.pitch = 1;
    this.synth.speak(utterance);
  }

  stop(): void {
    this.synth.cancel();
  }

  isSpeaking(): boolean {
    return this.synth.speaking;
  }
}
