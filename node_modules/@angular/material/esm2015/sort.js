/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Directive, EventEmitter, Injectable, Input, NgModule, Optional, Output, SkipSelf, ViewEncapsulation, isDevMode } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { CdkColumnDef } from '@angular/cdk/table';
import { merge } from 'rxjs/observable/merge';
import { AnimationCurves, AnimationDurations, mixinDisabled } from '@angular/material/core';
import { Subject } from 'rxjs/Subject';
import { animate, animateChild, keyframes, query, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * \@docs-private
 * @param {?} id
 * @return {?}
 */
function getSortDuplicateSortableIdError(id) {
    return Error(`Cannot have two MatSortables with the same id (${id}).`);
}
/**
 * \@docs-private
 * @return {?}
 */
function getSortHeaderNotContainedWithinSortError() {
    return Error(`MatSortHeader must be placed within a parent element with the MatSort directive.`);
}
/**
 * \@docs-private
 * @return {?}
 */
function getSortHeaderMissingIdError() {
    return Error(`MatSortHeader must be provided with a unique id.`);
}
/**
 * \@docs-private
 * @param {?} direction
 * @return {?}
 */
function getSortInvalidDirectionError(direction) {
    return Error(`${direction} is not a valid sort direction ('asc' or 'desc').`);
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * Interface for a directive that holds sorting state consumed by `MatSortHeader`.
 * @record
 */

/**
 * The current sort state.
 * @record
 */

/**
 * \@docs-private
 */
class MatSortBase {
}
const _MatSortMixinBase = mixinDisabled(MatSortBase);
/**
 * Container for MatSortables to manage the sort state and provide default sort parameters.
 */
class MatSort extends _MatSortMixinBase {
    constructor() {
        super(...arguments);
        /**
         * Collection of all registered sortables that this directive manages.
         */
        this.sortables = new Map();
        /**
         * Used to notify any child components listening to state changes.
         */
        this._stateChanges = new Subject();
        /**
         * The direction to set when an MatSortable is initially sorted.
         * May be overriden by the MatSortable's sort start.
         */
        this.start = 'asc';
        this._direction = '';
        /**
         * Event emitted when the user changes either the active sort or sort direction.
         */
        this.sortChange = new EventEmitter();
    }
    /**
     * The sort direction of the currently active MatSortable.
     * @return {?}
     */
    get direction() { return this._direction; }
    /**
     * @param {?} direction
     * @return {?}
     */
    set direction(direction) {
        if (isDevMode() && direction && direction !== 'asc' && direction !== 'desc') {
            throw getSortInvalidDirectionError(direction);
        }
        this._direction = direction;
    }
    /**
     * Whether to disable the user from clearing the sort by finishing the sort direction cycle.
     * May be overriden by the MatSortable's disable clear input.
     * @return {?}
     */
    get disableClear() { return this._disableClear; }
    /**
     * @param {?} v
     * @return {?}
     */
    set disableClear(v) { this._disableClear = coerceBooleanProperty(v); }
    /**
     * Register function to be used by the contained MatSortables. Adds the MatSortable to the
     * collection of MatSortables.
     * @param {?} sortable
     * @return {?}
     */
    register(sortable) {
        if (!sortable.id) {
            throw getSortHeaderMissingIdError();
        }
        if (this.sortables.has(sortable.id)) {
            throw getSortDuplicateSortableIdError(sortable.id);
        }
        this.sortables.set(sortable.id, sortable);
    }
    /**
     * Unregister function to be used by the contained MatSortables. Removes the MatSortable from the
     * collection of contained MatSortables.
     * @param {?} sortable
     * @return {?}
     */
    deregister(sortable) {
        this.sortables.delete(sortable.id);
    }
    /**
     * Sets the active sort id and determines the new sort direction.
     * @param {?} sortable
     * @return {?}
     */
    sort(sortable) {
        if (this.active != sortable.id) {
            this.active = sortable.id;
            this.direction = sortable.start ? sortable.start : this.start;
        }
        else {
            this.direction = this.getNextSortDirection(sortable);
        }
        this.sortChange.emit({ active: this.active, direction: this.direction });
    }
    /**
     * Returns the next sort direction of the active sortable, checking for potential overrides.
     * @param {?} sortable
     * @return {?}
     */
    getNextSortDirection(sortable) {
        if (!sortable) {
            return '';
        }
        // Get the sort direction cycle with the potential sortable overrides.
        const /** @type {?} */ disableClear = sortable.disableClear != null ? sortable.disableClear : this.disableClear;
        let /** @type {?} */ sortDirectionCycle = getSortDirectionCycle(sortable.start || this.start, disableClear);
        // Get and return the next direction in the cycle
        let /** @type {?} */ nextDirectionIndex = sortDirectionCycle.indexOf(this.direction) + 1;
        if (nextDirectionIndex >= sortDirectionCycle.length) {
            nextDirectionIndex = 0;
        }
        return sortDirectionCycle[nextDirectionIndex];
    }
    /**
     * @return {?}
     */
    ngOnChanges() {
        this._stateChanges.next();
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this._stateChanges.complete();
    }
}
MatSort.decorators = [
    { type: Directive, args: [{
                selector: '[matSort]',
                exportAs: 'matSort',
                inputs: ['disabled: matSortDisabled']
            },] },
];
/** @nocollapse */
MatSort.ctorParameters = () => [];
MatSort.propDecorators = {
    "active": [{ type: Input, args: ['matSortActive',] },],
    "start": [{ type: Input, args: ['matSortStart',] },],
    "direction": [{ type: Input, args: ['matSortDirection',] },],
    "disableClear": [{ type: Input, args: ['matSortDisableClear',] },],
    "sortChange": [{ type: Output, args: ['matSortChange',] },],
};
/**
 * Returns the sort direction cycle to use given the provided parameters of order and clear.
 * @param {?} start
 * @param {?} disableClear
 * @return {?}
 */
function getSortDirectionCycle(start, disableClear) {
    let /** @type {?} */ sortOrder = ['asc', 'desc'];
    if (start == 'desc') {
        sortOrder.reverse();
    }
    if (!disableClear) {
        sortOrder.push('');
    }
    return sortOrder;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * To modify the labels and text displayed, create a new instance of MatSortHeaderIntl and
 * include it in a custom provider.
 */
class MatSortHeaderIntl {
    constructor() {
        /**
         * Stream that emits whenever the labels here are changed. Use this to notify
         * components if the labels have changed after initialization.
         */
        this.changes = new Subject();
        /**
         * ARIA label for the sorting button.
         */
        this.sortButtonLabel = (id) => {
            return `Change sorting for ${id}`;
        };
        /**
         * A label to describe the current sort (visible only to screenreaders).
         */
        this.sortDescriptionLabel = (id, direction) => {
            return `Sorted by ${id} ${direction == 'asc' ? 'ascending' : 'descending'}`;
        };
    }
}
MatSortHeaderIntl.decorators = [
    { type: Injectable },
];
/** @nocollapse */
MatSortHeaderIntl.ctorParameters = () => [];
/**
 * \@docs-private
 * @param {?} parentIntl
 * @return {?}
 */
function MAT_SORT_HEADER_INTL_PROVIDER_FACTORY(parentIntl) {
    return parentIntl || new MatSortHeaderIntl();
}
/**
 * \@docs-private
 */
const MAT_SORT_HEADER_INTL_PROVIDER = {
    // If there is already an MatSortHeaderIntl available, use that. Otherwise, provide a new one.
    provide: MatSortHeaderIntl,
    deps: [[new Optional(), new SkipSelf(), MatSortHeaderIntl]],
    useFactory: MAT_SORT_HEADER_INTL_PROVIDER_FACTORY
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
const SORT_ANIMATION_TRANSITION = AnimationDurations.ENTERING + ' ' +
    AnimationCurves.STANDARD_CURVE;
/**
 * Animations used by MatSort.
 */
const matSortAnimations = {
    /** Animation that moves the sort indicator. */
    indicator: trigger('indicator', [
        state('active-asc, asc', style({ transform: 'translateY(0px)' })),
        // 10px is the height of the sort indicator, minus the width of the pointers
        state('active-desc, desc', style({ transform: 'translateY(10px)' })),
        transition('active-asc <=> active-desc', animate(SORT_ANIMATION_TRANSITION))
    ]),
    /** Animation that rotates the left pointer of the indicator based on the sorting direction. */
    leftPointer: trigger('leftPointer', [
        state('active-asc, asc', style({ transform: 'rotate(-45deg)' })),
        state('active-desc, desc', style({ transform: 'rotate(45deg)' })),
        transition('active-asc <=> active-desc', animate(SORT_ANIMATION_TRANSITION))
    ]),
    /** Animation that rotates the right pointer of the indicator based on the sorting direction. */
    rightPointer: trigger('rightPointer', [
        state('active-asc, asc', style({ transform: 'rotate(45deg)' })),
        state('active-desc, desc', style({ transform: 'rotate(-45deg)' })),
        transition('active-asc <=> active-desc', animate(SORT_ANIMATION_TRANSITION))
    ]),
    /** Animation that controls the arrow opacity. */
    arrowOpacity: trigger('arrowOpacity', [
        state('desc-to-active, asc-to-active, active', style({ opacity: 1 })),
        state('desc-to-hint, asc-to-hint, hint', style({ opacity: .54 })),
        state('hint-to-desc, active-to-desc, desc, hint-to-asc, active-to-asc, asc', style({ opacity: 0 })),
        // Transition between all states except for immediate transitions
        transition('* => asc, * => desc, * => active, * => hint', animate('0ms')),
        transition('* <=> *', animate(SORT_ANIMATION_TRANSITION))
    ]),
    /**
       * Animation for the translation of the arrow as a whole. States are separated into two
       * groups: ones with animations and others that are immediate. Immediate states are asc, desc,
       * peek, and active. The other states define a specific animation (source-to-destination)
       * and are determined as a function of their prev user-perceived state and what the next state
       * should be.
       */
    arrowPosition: trigger('arrowPosition', [
        // Hidden Above => Hint Center
        transition('* => desc-to-hint, * => desc-to-active', animate(SORT_ANIMATION_TRANSITION, keyframes([
            style({ transform: 'translateY(-25%)' }),
            style({ transform: 'translateY(0)' })
        ]))),
        // Hint Center => Hidden Below
        transition('* => hint-to-desc, * => active-to-desc', animate(SORT_ANIMATION_TRANSITION, keyframes([
            style({ transform: 'translateY(0)' }),
            style({ transform: 'translateY(25%)' })
        ]))),
        // Hidden Below => Hint Center
        transition('* => asc-to-hint, * => asc-to-active', animate(SORT_ANIMATION_TRANSITION, keyframes([
            style({ transform: 'translateY(25%)' }),
            style({ transform: 'translateY(0)' })
        ]))),
        // Hint Center => Hidden Above
        transition('* => hint-to-asc, * => active-to-asc', animate(SORT_ANIMATION_TRANSITION, keyframes([
            style({ transform: 'translateY(0)' }),
            style({ transform: 'translateY(-25%)' })
        ]))),
        state('desc-to-hint, asc-to-hint, hint, desc-to-active, asc-to-active, active', style({ transform: 'translateY(0)' })),
        state('hint-to-desc, active-to-desc, desc', style({ transform: 'translateY(-25%)' })),
        state('hint-to-asc, active-to-asc, asc', style({ transform: 'translateY(25%)' })),
    ]),
    /** Necessary trigger that calls animate on children animations. */
    allowChildren: trigger('allowChildren', [
        transition('* <=> *', [
            query('@*', animateChild(), { optional: true })
        ])
    ]),
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * \@docs-private
 */
class MatSortHeaderBase {
}
const _MatSortHeaderMixinBase = mixinDisabled(MatSortHeaderBase);
/**
 * States describing the arrow's animated position (animating fromState to toState).
 * If the fromState is not defined, there will be no animated transition to the toState.
 * \@docs-private
 * @record
 */

/**
 * Applies sorting behavior (click to change sort) and styles to an element, including an
 * arrow to display the current sort direction.
 *
 * Must be provided with an id and contained within a parent MatSort directive.
 *
 * If used on header cells in a CdkTable, it will automatically default its id from its containing
 * column definition.
 */
class MatSortHeader extends _MatSortHeaderMixinBase {
    /**
     * @param {?} _intl
     * @param {?} changeDetectorRef
     * @param {?} _sort
     * @param {?} _cdkColumnDef
     */
    constructor(_intl, changeDetectorRef, _sort, _cdkColumnDef) {
        super();
        this._intl = _intl;
        this._sort = _sort;
        this._cdkColumnDef = _cdkColumnDef;
        /**
         * Flag set to true when the indicator should be displayed while the sort is not active. Used to
         * provide an affordance that the header is sortable by showing on focus and hover.
         */
        this._showIndicatorHint = false;
        /**
         * The direction the arrow should be facing according to the current state.
         */
        this._arrowDirection = '';
        /**
         * Whether the view state animation should show the transition between the `from` and `to` states.
         */
        this._disableViewStateAnimation = false;
        /**
         * Sets the position of the arrow that displays when sorted.
         */
        this.arrowPosition = 'after';
        if (!_sort) {
            throw getSortHeaderNotContainedWithinSortError();
        }
        this._rerenderSubscription = merge(_sort.sortChange, _sort._stateChanges, _intl.changes)
            .subscribe(() => {
            if (this._isSorted()) {
                this._updateArrowDirection();
            }
            // If this header was recently active and now no longer sorted, animate away the arrow.
            if (!this._isSorted() && this._viewState && this._viewState.toState === 'active') {
                this._disableViewStateAnimation = false;
                this._setAnimationTransitionState({ fromState: 'active', toState: this._arrowDirection });
            }
            changeDetectorRef.markForCheck();
        });
    }
    /**
     * Overrides the disable clear value of the containing MatSort for this MatSortable.
     * @return {?}
     */
    get disableClear() { return this._disableClear; }
    /**
     * @param {?} v
     * @return {?}
     */
    set disableClear(v) { this._disableClear = coerceBooleanProperty(v); }
    /**
     * @return {?}
     */
    ngOnInit() {
        if (!this.id && this._cdkColumnDef) {
            this.id = this._cdkColumnDef.name;
        }
        // Initialize the direction of the arrow and set the view state to be immediately that state.
        this._updateArrowDirection();
        this._setAnimationTransitionState({ toState: this._isSorted() ? 'active' : this._arrowDirection });
        this._sort.register(this);
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this._sort.deregister(this);
        this._rerenderSubscription.unsubscribe();
    }
    /**
     * Sets the "hint" state such that the arrow will be semi-transparently displayed as a hint to the
     * user showing what the active sort will become. If set to false, the arrow will fade away.
     * @param {?} visible
     * @return {?}
     */
    _setIndicatorHintVisible(visible) {
        // No-op if the sort header is disabled - should not make the hint visible.
        if (this._isDisabled() && visible) {
            return;
        }
        this._showIndicatorHint = visible;
        if (!this._isSorted()) {
            this._updateArrowDirection();
            if (this._showIndicatorHint) {
                this._setAnimationTransitionState({ fromState: this._arrowDirection, toState: 'hint' });
            }
            else {
                this._setAnimationTransitionState({ fromState: 'hint', toState: this._arrowDirection });
            }
        }
    }
    /**
     * Sets the animation transition view state for the arrow's position and opacity. If the
     * `disableViewStateAnimation` flag is set to true, the `fromState` will be ignored so that
     * no animation appears.
     * @param {?} viewState
     * @return {?}
     */
    _setAnimationTransitionState(viewState) {
        this._viewState = viewState;
        // If the animation for arrow position state (opacity/translation) should be disabled,
        // remove the fromState so that it jumps right to the toState.
        if (this._disableViewStateAnimation) {
            this._viewState = { toState: viewState.toState };
        }
    }
    /**
     * Triggers the sort on this sort header and removes the indicator hint.
     * @return {?}
     */
    _handleClick() {
        if (this._isDisabled()) {
            return;
        }
        this._sort.sort(this);
        // Do not show the animation if the header was already shown in the right position.
        if (this._viewState.toState === 'hint' || this._viewState.toState === 'active') {
            this._disableViewStateAnimation = true;
        }
        // If the arrow is now sorted, animate the arrow into place. Otherwise, animate it away into
        // the direction it is facing.
        const /** @type {?} */ viewState = this._isSorted() ?
            { fromState: this._arrowDirection, toState: 'active' } :
            { fromState: 'active', toState: this._arrowDirection };
        this._setAnimationTransitionState(viewState);
        this._showIndicatorHint = false;
    }
    /**
     * Whether this MatSortHeader is currently sorted in either ascending or descending order.
     * @return {?}
     */
    _isSorted() {
        return this._sort.active == this.id &&
            (this._sort.direction === 'asc' || this._sort.direction === 'desc');
    }
    /**
     * Returns the animation state for the arrow direction (indicator and pointers).
     * @return {?}
     */
    _getArrowDirectionState() {
        return `${this._isSorted() ? 'active-' : ''}${this._arrowDirection}`;
    }
    /**
     * Returns the arrow position state (opacity, translation).
     * @return {?}
     */
    _getArrowViewState() {
        const /** @type {?} */ fromState = this._viewState.fromState;
        return (fromState ? `${fromState}-to-` : '') + this._viewState.toState;
    }
    /**
     * Updates the direction the arrow should be pointing. If it is not sorted, the arrow should be
     * facing the start direction. Otherwise if it is sorted, the arrow should point in the currently
     * active sorted direction. The reason this is updated through a function is because the direction
     * should only be changed at specific times - when deactivated but the hint is displayed and when
     * the sort is active and the direction changes. Otherwise the arrow's direction should linger
     * in cases such as the sort becoming deactivated but we want to animate the arrow away while
     * preserving its direction, even though the next sort direction is actually different and should
     * only be changed once the arrow displays again (hint or activation).
     * @return {?}
     */
    _updateArrowDirection() {
        this._arrowDirection = this._isSorted() ?
            this._sort.direction :
            (this.start || this._sort.start);
    }
    /**
     * @return {?}
     */
    _isDisabled() {
        return this._sort.disabled || this.disabled;
    }
}
MatSortHeader.decorators = [
    { type: Component, args: [{selector: '[mat-sort-header]',
                exportAs: 'matSortHeader',
                template: "<div class=\"mat-sort-header-container\" [class.mat-sort-header-sorted]=\"_isSorted()\" [class.mat-sort-header-position-before]=\"arrowPosition == 'before'\"><button class=\"mat-sort-header-button\" type=\"button\" [attr.disabled]=\"_isDisabled() || null\" [attr.aria-label]=\"_intl.sortButtonLabel(id)\" (focus)=\"_setIndicatorHintVisible(true)\" (blur)=\"_setIndicatorHintVisible(false)\"><ng-content></ng-content></button><div class=\"mat-sort-header-arrow\" [@arrowOpacity]=\"_getArrowViewState()\" [@arrowPosition]=\"_getArrowViewState()\" [@allowChildren]=\"_getArrowDirectionState()\" (@arrowPosition.start)=\"_disableViewStateAnimation = true\" (@arrowPosition.done)=\"_disableViewStateAnimation = false\"><div class=\"mat-sort-header-stem\"></div><div class=\"mat-sort-header-indicator\" [@indicator]=\"_getArrowDirectionState()\"><div class=\"mat-sort-header-pointer-left\" [@leftPointer]=\"_getArrowDirectionState()\"></div><div class=\"mat-sort-header-pointer-right\" [@rightPointer]=\"_getArrowDirectionState()\"></div><div class=\"mat-sort-header-pointer-middle\"></div></div></div></div><span class=\"cdk-visually-hidden\" *ngIf=\"_isSorted()\">&nbsp;{{_intl.sortDescriptionLabel(id, _sort.direction)}}</span>",
                styles: [".mat-sort-header-container{display:flex;cursor:pointer}.mat-sort-header-disabled .mat-sort-header-container{cursor:default}.mat-sort-header-position-before{flex-direction:row-reverse}.mat-sort-header-button{border:none;background:0 0;display:flex;align-items:center;padding:0;cursor:inherit;outline:0;font:inherit;color:currentColor}.mat-sort-header-arrow{height:12px;width:12px;min-width:12px;margin:0 0 0 6px;position:relative;display:flex}.mat-sort-header-position-before .mat-sort-header-arrow{margin:0 6px 0 0}.mat-sort-header-stem{background:currentColor;height:10px;width:2px;margin:auto;display:flex;align-items:center}.mat-sort-header-indicator{width:100%;height:2px;display:flex;align-items:center;position:absolute;top:0;left:0}.mat-sort-header-pointer-middle{margin:auto;height:2px;width:2px;background:currentColor;transform:rotate(45deg)}.mat-sort-header-pointer-left,.mat-sort-header-pointer-right{background:currentColor;width:6px;height:2px;position:absolute;top:0}.mat-sort-header-pointer-left{transform-origin:right;left:0}.mat-sort-header-pointer-right{transform-origin:left;right:0}"],
                host: {
                    '(click)': '_handleClick()',
                    '(mouseenter)': '_setIndicatorHintVisible(true)',
                    '(longpress)': '_setIndicatorHintVisible(true)',
                    '(mouseleave)': '_setIndicatorHintVisible(false)',
                    '[class.mat-sort-header-disabled]': '_isDisabled()',
                },
                encapsulation: ViewEncapsulation.None,
                preserveWhitespaces: false,
                changeDetection: ChangeDetectionStrategy.OnPush,
                inputs: ['disabled'],
                animations: [
                    matSortAnimations.indicator,
                    matSortAnimations.leftPointer,
                    matSortAnimations.rightPointer,
                    matSortAnimations.arrowOpacity,
                    matSortAnimations.arrowPosition,
                    matSortAnimations.allowChildren,
                ]
            },] },
];
/** @nocollapse */
MatSortHeader.ctorParameters = () => [
    { type: MatSortHeaderIntl, },
    { type: ChangeDetectorRef, },
    { type: MatSort, decorators: [{ type: Optional },] },
    { type: CdkColumnDef, decorators: [{ type: Optional },] },
];
MatSortHeader.propDecorators = {
    "id": [{ type: Input, args: ['mat-sort-header',] },],
    "arrowPosition": [{ type: Input },],
    "start": [{ type: Input },],
    "disableClear": [{ type: Input },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

class MatSortModule {
}
MatSortModule.decorators = [
    { type: NgModule, args: [{
                imports: [CommonModule],
                exports: [MatSort, MatSortHeader],
                declarations: [MatSort, MatSortHeader],
                providers: [MAT_SORT_HEADER_INTL_PROVIDER]
            },] },
];
/** @nocollapse */
MatSortModule.ctorParameters = () => [];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Generated bundle index. Do not edit.
 */

export { MatSortModule, MatSortHeaderBase, _MatSortHeaderMixinBase, MatSortHeader, MatSortHeaderIntl, MAT_SORT_HEADER_INTL_PROVIDER_FACTORY, MAT_SORT_HEADER_INTL_PROVIDER, MatSortBase, _MatSortMixinBase, MatSort, matSortAnimations };
//# sourceMappingURL=sort.js.map
