import { Component, OnInit } from '@angular/core';
import { ProgressBarService } from './progress-bar.service';

@Component({
  selector: 'app-progress-bar',
  template: `<div *ngIf="active" class="spinner loading">
                  <mat-progress-bar mode="indeterminate"></mat-progress-bar>
              </div>`,
  styleUrls: ['./progress-bar.component.css']
})
export class ProgressBarComponent implements OnInit {
    public active: boolean;
    constructor() { }    

    ngOnInit() {
    }

}
