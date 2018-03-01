/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ElementRef, OnInit, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BaseFxDirective } from '../core/base';
import { MediaMonitor } from '../../media-query/media-monitor';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { StyleUtils } from '../../utils/styling/style-utils';
/**
 * 'layout' flexbox styling directive
 * Defines the positioning flow direction for the child elements: row or column
 * Optional values: column or row (default)
 * @see https://css-tricks.com/almanac/properties/f/flex-direction/
 *
 */
export declare class LayoutDirective extends BaseFxDirective implements OnInit, OnChanges, OnDestroy {
    /**
     * Create Observable for nested/child 'flex' directives. This allows
     * child flex directives to subscribe/listen for flexbox direction changes.
     */
    protected _announcer: ReplaySubject<string>;
    /**
     * Publish observer to enabled nested, dependent directives to listen
     * to parent 'layout' direction changes
     */
    layout$: Observable<string>;
    layout: any;
    layoutXs: any;
    layoutSm: any;
    layoutMd: any;
    layoutLg: any;
    layoutXl: any;
    layoutGtXs: any;
    layoutGtSm: any;
    layoutGtMd: any;
    layoutGtLg: any;
    layoutLtSm: any;
    layoutLtMd: any;
    layoutLtLg: any;
    layoutLtXl: any;
    /**
     *
     */
    constructor(monitor: MediaMonitor, elRef: ElementRef, styleUtils: StyleUtils);
    /**
     * On changes to any @Input properties...
     * Default to use the non-responsive Input value ('fxLayout')
     * Then conditionally override with the mq-activated Input's current value
     */
    ngOnChanges(changes: SimpleChanges): void;
    /**
     * After the initial onChanges, build an mqActivation object that bridges
     * mql change events to onMediaQueryChange handlers
     */
    ngOnInit(): void;
    /**
     * Validate the direction value and then update the host's inline flexbox styles
     */
    protected _updateWithDirection(value?: string): void;
}
