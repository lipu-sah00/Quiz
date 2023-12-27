import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class VoiceRecorderService {
  private mediaRecorder: MediaRecorder | undefined;
  private recordedChunks: Blob[] = [];
  public isRecording = false;
  public isdownloading = false;

  startRecording(): Promise<void> {
    this.isRecording = true;
    return navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        this.mediaRecorder = new MediaRecorder(stream);

        this.mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            this.recordedChunks.push(event.data);
          }
        };
        this.mediaRecorder.onstop = () => {
          const audioBlob = new Blob(this.recordedChunks, { type: 'audio/wav/mp3' });
          this.recordedChunks = [];
          // Handle the recorded audio blob (e.g., send it to a server, save to storage, etc.)
          console.log('Recording finished:', audioBlob);
          this.saveAudioToFile(audioBlob, 'recorded-audio.mp3');
          this.isdownloading = true;
        };
        this.mediaRecorder.start();
      })
      .catch((err) => console.error('Error accessing microphone:', err));
  }

  stopRecording(): void {
    this.isRecording = false;
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
  }

  private saveAudioToFile(blob: Blob, fileName: string): void {
    const url = URL.createObjectURL(blob);
    // Create a link element and trigger a click event to download the audio
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.style.display = 'none';
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
