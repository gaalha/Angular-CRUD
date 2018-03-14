import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/share';

@Injectable()
export class ProgressBarService {
    constructor() { }

    public status: Subject<boolean> = new Subject();
    private _active: boolean = false;

    public get active(): boolean {
        return this._active;
    }

    public set active(v: boolean) {
        this._active = v;
        this.status.next(v);
    }

    public start(): void {
        this.active = true;
    }

    public stop(): void {
        this.active = false;
    }
}