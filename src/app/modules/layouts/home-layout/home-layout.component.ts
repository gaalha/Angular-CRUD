import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-home-layout',
    template: `<app-sidenav></app-sidenav>`,
    styles: []
})
export class HomeLayoutComponent implements OnInit {
    constructor() { }
    ngOnInit() { }
}
