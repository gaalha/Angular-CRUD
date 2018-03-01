/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { FocusMonitor } from '@angular/cdk/a11y';
import { Platform } from '@angular/cdk/platform';
import { ElementRef, OnDestroy } from '@angular/core';
import { CanColor, CanDisable, CanDisableRipple, MatRipple } from '@angular/material/core';
/** @docs-private */
export declare class MatButtonBase {
    _elementRef: ElementRef;
    constructor(_elementRef: ElementRef);
}
export declare const _MatButtonMixinBase: (new (...args: any[]) => CanColor) & (new (...args: any[]) => CanDisable) & (new (...args: any[]) => CanDisableRipple) & typeof MatButtonBase;
/**
 * Material design button.
 */
export declare class MatButton extends _MatButtonMixinBase implements OnDestroy, CanDisable, CanColor, CanDisableRipple {
    private _platform;
    private _focusMonitor;
    /** Whether the button is round. */
    _isRoundButton: boolean;
    /** Whether the button is icon button. */
    _isIconButton: boolean;
    /** Reference to the MatRipple instance of the button. */
    ripple: MatRipple;
    constructor(elementRef: ElementRef, _platform: Platform, _focusMonitor: FocusMonitor);
    ngOnDestroy(): void;
    /** Focuses the button. */
    focus(): void;
    _getHostElement(): any;
    _isRippleDisabled(): boolean;
    /** Gets whether the button has one of the given attributes. */
    _hasHostAttributes(...attributes: string[]): boolean;
}
/**
 * Raised Material design button.
 */
export declare class MatAnchor extends MatButton {
    constructor(platform: Platform, focusMonitor: FocusMonitor, elementRef: ElementRef);
    _haltDisabledEvents(event: Event): void;
}
