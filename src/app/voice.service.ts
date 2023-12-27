import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VoiceService {
  private synthesis: SpeechSynthesis;
  public speaking: boolean = false;
  private sentenceSubject = new Subject<string>();

  constructor() {
    this.synthesis = window.speechSynthesis;
  }

  private speakSentenceWithDelay(sentence: string, delay: number
  ): void {
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(sentence);
      this.synthesis.speak(utterance);
      this.sentenceSubject.next(sentence);// Emit the sentence when spoken
    }, delay);
  }

  speak(sentences: string[], delayBetweenSentences: number): void {
    this.synthesis.cancel();
    this.speaking = true;
    sentences.forEach((sentence, index) => {
      const delay = index * delayBetweenSentences;
      this.speakSentenceWithDelay(sentence, delay);
    });
  }


  stop(): void {
    this.synthesis.cancel();
    this.speaking = false;
  }

  isSpeaking(): boolean {
    return this.speaking;
  }

  getSentenceSubject(): Subject<string> {
    return this.sentenceSubject;
  }

}
