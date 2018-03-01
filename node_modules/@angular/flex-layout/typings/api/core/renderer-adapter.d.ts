/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Renderer2, RendererStyleFlags2 } from '@angular/core';
/**
 * Adapts the 'deprecated' Angular Renderer v1 API to use the new Renderer2 instance
 * This is required for older versions of NgStyle and NgClass that require
 * the v1 API (but should use the v2 instances)
 */
export declare class RendererAdapter {
    private _renderer;
    constructor(_renderer: Renderer2);
    setElementClass(el: any, className: string, isAdd: boolean): void;
    setElementStyle(el: any, styleName: string, styleValue: string): void;
    addClass(el: any, name: string): void;
    removeClass(el: any, name: string): void;
    setStyle(el: any, style: string, value: any, flags?: RendererStyleFlags2): void;
    removeStyle(el: any, style: string, flags?: RendererStyleFlags2): void;
    animate(): any;
    attachViewAfter(): void;
    detachView(): void;
    destroyView(): void;
    createElement(): any;
    createViewRoot(): any;
    createTemplateAnchor(): any;
    createText(): any;
    invokeElementMethod(): void;
    projectNodes(): void;
    selectRootElement(): any;
    setBindingDebugInfo(): void;
    setElementProperty(): void;
    setElementAttribute(): void;
    setText(): void;
    listen(): Function;
    listenGlobal(): Function;
}
