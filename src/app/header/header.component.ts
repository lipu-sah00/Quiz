import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  isOnline: boolean = navigator.onLine;
  statusMessage: string = this.isOnline ? 'Online' : 'Offline';

  ngOnInit() {
    this.checkOnlineStatus();
  }

  @HostListener('window:online', ['$event'])
  onOnlineEvent(event: Event) {
    this.isOnline = true;
    this.statusMessage = 'Online';
  }

  @HostListener('window:offline', ['$event'])
  onOfflineEvent(event: Event) {
    this.isOnline = false;
    this.statusMessage = 'Offline';
  }

  private checkOnlineStatus() {
    this.isOnline = navigator.onLine;
    this.statusMessage = this.isOnline ? 'Online' : 'Offline';
  }
}
