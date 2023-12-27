import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { ManualComponent } from './manual/manual.component';
import { TestComponent } from './test/test.component';
import { VoiceComponent } from './voice/voice.component';
import { CanDeactivateFn, CanDeactivateGuard } from './can-deactivate.guard';

const routes: Routes = [
  { path: "about", component: AboutComponent },
  { path: "test", component: TestComponent },
  { path: "manual", component: ManualComponent },
  { path: "voice", component: VoiceComponent },
  // {path:"voice",component:VoiceComponent,canDeactivate: [CanDeactivateGuard] as unknown as CanDeactivateFn[],},
  { path: "", component: ManualComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
