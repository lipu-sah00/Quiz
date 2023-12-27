import { Component, OnInit } from '@angular/core';
import { PageVisibilityService } from './page-visibility.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { BoxComponent } from './box/box.component';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = '';
  showWarning = false;
  constructor(public dialog: MatDialog, public navigateUser: Router) {
  }
}


