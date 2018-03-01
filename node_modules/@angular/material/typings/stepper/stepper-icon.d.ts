/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { TemplateRef } from '@angular/core';
/**
 * Template to be used to override the icons inside the step header.
 */
export declare class MatStepperIcon {
    templateRef: TemplateRef<any>;
    /** Name of the icon to be overridden. */
    name: 'edit' | 'done';
    constructor(templateRef: TemplateRef<any>);
}
