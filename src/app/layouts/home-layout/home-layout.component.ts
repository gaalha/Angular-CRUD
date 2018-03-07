import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-home-layout',
    template: `<app-sidebar></app-sidebar>`,
    styles: []
})
export class HomeLayoutComponent implements OnInit {
    constructor() { }
    ngOnInit() { }
}
