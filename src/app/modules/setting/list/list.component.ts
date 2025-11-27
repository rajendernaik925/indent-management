import { Component, OnInit } from '@angular/core';
import { COMMON_EXPORTS } from '../../../core/common-exports.constants';
import { SpeechRecognitionService } from '../speech-recognition.service';
import { TextToSpeechService } from '../text-to-speech.service';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [COMMON_EXPORTS],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  transcript = '';
  isListening = false;
  conversationHistory: string[] = [];

  constructor(
    private speechService: SpeechRecognitionService,
    private ttsService: TextToSpeechService
  ) { }

  ngOnInit(): void {
    this.loadHistory();
  }

  toggleListening(): void {
    if (this.isListening) {
      this.speechService.stopListening();
      this.isListening = false;
    } else {
      this.speechService.startListening((text: string) => {
        this.transcript = text;
        this.isListening = false;
        this.addToHistory(text);
      });
      this.isListening = true;
    }
  }

  speakText(text: string): void {
    this.ttsService.speak(text);
  }

  stopSpeaking(): void {
    this.ttsService.stop();
  }

  private addToHistory(text: string) {
    this.conversationHistory.unshift(text); // Add newest at top
    localStorage.setItem('conversationHistory', JSON.stringify(this.conversationHistory));
  }

  private loadHistory() {
    const history = localStorage.getItem('conversationHistory');
    if (history) {
      this.conversationHistory = JSON.parse(history);
    }
  }

  clearConversation(): void {
    this.conversationHistory = [];
    localStorage.removeItem('conversationHistory');
  }

}
