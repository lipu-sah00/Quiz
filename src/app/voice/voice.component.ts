import { Component, OnDestroy, OnInit } from '@angular/core';
import { VoiceService } from '../voice.service';
import { Subject, Subscription, interval, takeUntil } from 'rxjs';
import { VoiceRecorderService } from '../audio-processing.service';
import { NavigationEnd, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-voice',
  templateUrl: './voice.component.html',
  styleUrls: ['./voice.component.scss']
})

export class VoiceComponent implements OnDestroy, OnInit {
  errorObject = '';
  public allSentencesCompleted: boolean = false;
  private sentenceSubscription: Subscription | undefined;
  private destroy$ = new Subject<void>();
  public timer = 60;
  private interval$ = interval(1000);
  private currentSentenceIndex = 0;
  private videoElement!: HTMLVideoElement;
  private mediaStream!: MediaStream | null;
  public spokenSentences: string[] = [];
  public isSpeakerOn = false;

  sentences: string[] = [
    'What is html?',
    'What is Angular?',
    'Difference between localstorage and session storage?',
    'Difference between call,bind and apply ?',
    'what is prototype in javascript?',
    'thanks you.'
  ];

  constructor(public textToSpeechService: VoiceService,
    public userResponse: VoiceRecorderService,
    private router: Router) { }

  speakSentences(): void {
    if (this.currentSentenceIndex == 0) {
      this.allSentencesCompleted = true;
    }
    this.userResponse.startRecording();

    if (this.currentSentenceIndex < this.sentences.length) {
      const currentSentence = this.sentences[this.currentSentenceIndex];
      console.log(`Speaking: ${currentSentence}`);
      // Reset the timer for each sentence spoken
      // Move to the next sentence

      this.currentSentenceIndex++;
      console.log('after' + this.currentSentenceIndex)
      this.timer = 60;

    }
    else {
      console.log('All sentences spoken.');
    }
    if (!this.textToSpeechService.isSpeaking()) {
      this.isSpeakerOn = true;
      this.spokenSentences = [];
      this.textToSpeechService.speak(this.sentences, 60000);
      this.setupTimer();
    }
  }

  private setupTimer(): void {
    this.interval$
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        if (this.timer > 0) {
          this.timer--;
        } else {
          this.userResponse.stopRecording();
          // Timer reached 0
          if (this.currentSentenceIndex < this.sentences.length) {
            this.speakSentences();
          }
        }
      });
  }

  private async setupCamera(): Promise<void> {
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (this.mediaStream) {
        this.videoElement.srcObject = this.mediaStream;
      } else {
        this.errorObject = 'Could not obtain video stream'

        console.error('Could not obtain video stream');
      }
    } catch (error) {
      this.errorObject = 'Error accessing camera'
      console.error('Error accessing camera:', error);
    }
  }

  private closeCamera(): void {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
    }
  }

  ngOnInit(): void {
    this.setupCamera();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        window.location.reload();
        this.closeCamera();
      }
    });
    this.sentenceSubscription = this.textToSpeechService.getSentenceSubject()
      .pipe(takeUntil(this.destroy$))
      .subscribe((sentence) => {
        this.spokenSentences.push(sentence);
      });
  }

  ngAfterViewInit(): void {
    this.videoElement = document.querySelector('video')!;
  }

  ngOnDestroy(): void {
    this.sentenceSubscription?.unsubscribe();
    this.closeCamera();
    this.destroy$.next();
    this.destroy$.complete();

  }
}
