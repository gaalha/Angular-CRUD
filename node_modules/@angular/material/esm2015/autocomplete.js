/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, Directive, ElementRef, EventEmitter, Host, Inject, InjectionToken, Input, NgModule, NgZone, Optional, Output, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation, forwardRef } from '@angular/core';
import { MAT_OPTION_PARENT_COMPONENT, MatCommonModule, MatOptgroup, MatOption, MatOptionModule, _countGroupLabelsBeforeOption, _getOptionScrollPosition, mixinDisableRipple } from '@angular/material/core';
import { ActiveDescendantKeyManager } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { CommonModule, DOCUMENT } from '@angular/common';
import { Overlay, OverlayConfig, OverlayModule } from '@angular/cdk/overlay';
import { Directionality } from '@angular/cdk/bidi';
import { DOWN_ARROW, ENTER, ESCAPE, TAB, UP_ARROW } from '@angular/cdk/keycodes';
import { TemplatePortal } from '@angular/cdk/portal';
import { filter } from 'rxjs/operators/filter';
import { take } from 'rxjs/operators/take';
import { switchMap } from 'rxjs/operators/switchMap';
import { tap } from 'rxjs/operators/tap';
import { delay } from 'rxjs/operators/delay';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { Subject } from 'rxjs/Subject';
import { defer } from 'rxjs/observable/defer';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { merge } from 'rxjs/observable/merge';
import { of } from 'rxjs/observable/of';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Autocomplete IDs need to be unique across components, so this counter exists outside of
 * the component definition.
 */
let _uniqueAutocompleteIdCounter = 0;
/**
 * Event object that is emitted when an autocomplete option is selected.
 */
class MatAutocompleteSelectedEvent {
    /**
     * @param {?} source
     * @param {?} option
     */
    constructor(source, option) {
        this.source = source;
        this.option = option;
    }
}
/**
 * \@docs-private
 */
class MatAutocompleteBase {
}
const _MatAutocompleteMixinBase = mixinDisableRipple(MatAutocompleteBase);
/**
 * Default `mat-autocomplete` options that can be overridden.
 * @record
 */

/**
 * Injection token to be used to override the default options for `mat-autocomplete`.
 */
const MAT_AUTOCOMPLETE_DEFAULT_OPTIONS = new InjectionToken('mat-autocomplete-default-options');
class MatAutocomplete extends _MatAutocompleteMixinBase {
    /**
     * @param {?} _changeDetectorRef
     * @param {?} _elementRef
     * @param {?=} defaults
     */
    constructor(_changeDetectorRef, _elementRef, 
        // @deletion-target Turn into required param in 6.0.0
        defaults) {
        super();
        this._changeDetectorRef = _changeDetectorRef;
        this._elementRef = _elementRef;
        /**
         * Whether the autocomplete panel should be visible, depending on option length.
         */
        this.showPanel = false;
        this._isOpen = false;
        /**
         * Function that maps an option's control value to its display value in the trigger.
         */
        this.displayWith = null;
        /**
         * Event that is emitted whenever an option from the list is selected.
         */
        this.optionSelected = new EventEmitter();
        this._classList = {};
        /**
         * Unique ID to be used by autocomplete trigger's "aria-owns" property.
         */
        this.id = `mat-autocomplete-${_uniqueAutocompleteIdCounter++}`;
        this._autoActiveFirstOption = defaults &&
            typeof defaults.autoActiveFirstOption !== 'undefined' ?
            defaults.autoActiveFirstOption :
            false;
    }
    /**
     * Whether the autocomplete panel is open.
     * @return {?}
     */
    get isOpen() { return this._isOpen && this.showPanel; }
    /**
     * Whether the first option should be highlighted when the autocomplete panel is opened.
     * Can be configured globally through the `MAT_AUTOCOMPLETE_DEFAULT_OPTIONS` token.
     * @return {?}
     */
    get autoActiveFirstOption() { return this._autoActiveFirstOption; }
    /**
     * @param {?} value
     * @return {?}
     */
    set autoActiveFirstOption(value) {
        this._autoActiveFirstOption = coerceBooleanProperty(value);
    }
    /**
     * Takes classes set on the host mat-autocomplete element and applies them to the panel
     * inside the overlay container to allow for easy styling.
     * @param {?} value
     * @return {?}
     */
    set classList(value) {
        if (value && value.length) {
            value.split(' ').forEach(className => this._classList[className.trim()] = true);
            this._elementRef.nativeElement.className = '';
        }
    }
    /**
     * @return {?}
     */
    ngAfterContentInit() {
        this._keyManager = new ActiveDescendantKeyManager(this.options).withWrap();
        // Set the initial visibiity state.
        this._setVisibility();
    }
    /**
     * Sets the panel scrollTop. This allows us to manually scroll to display options
     * above or below the fold, as they are not actually being focused when active.
     * @param {?} scrollTop
     * @return {?}
     */
    _setScrollTop(scrollTop) {
        if (this.panel) {
            this.panel.nativeElement.scrollTop = scrollTop;
        }
    }
    /**
     * Returns the panel's scrollTop.
     * @return {?}
     */
    _getScrollTop() {
        return this.panel ? this.panel.nativeElement.scrollTop : 0;
    }
    /**
     * Panel should hide itself when the option list is empty.
     * @return {?}
     */
    _setVisibility() {
        this.showPanel = !!this.options.length;
        this._classList['mat-autocomplete-visible'] = this.showPanel;
        this._classList['mat-autocomplete-hidden'] = !this.showPanel;
        this._changeDetectorRef.markForCheck();
    }
    /**
     * Emits the `select` event.
     * @param {?} option
     * @return {?}
     */
    _emitSelectEvent(option) {
        const /** @type {?} */ event = new MatAutocompleteSelectedEvent(this, option);
        this.optionSelected.emit(event);
    }
}
MatAutocomplete.decorators = [
    { type: Component, args: [{selector: 'mat-autocomplete',
                template: "<ng-template><div class=\"mat-autocomplete-panel\" role=\"listbox\" [id]=\"id\" [ngClass]=\"_classList\" #panel><ng-content></ng-content></div></ng-template>",
                styles: [".mat-autocomplete-panel{min-width:112px;max-width:280px;overflow:auto;-webkit-overflow-scrolling:touch;visibility:hidden;max-width:none;max-height:256px;position:relative}.mat-autocomplete-panel:not([class*=mat-elevation-z]){box-shadow:0 5px 5px -3px rgba(0,0,0,.2),0 8px 10px 1px rgba(0,0,0,.14),0 3px 14px 2px rgba(0,0,0,.12)}.mat-autocomplete-panel.mat-autocomplete-visible{visibility:visible}.mat-autocomplete-panel.mat-autocomplete-hidden{visibility:hidden}"],
                encapsulation: ViewEncapsulation.None,
                preserveWhitespaces: false,
                changeDetection: ChangeDetectionStrategy.OnPush,
                exportAs: 'matAutocomplete',
                inputs: ['disableRipple'],
                host: {
                    'class': 'mat-autocomplete'
                },
                providers: [
                    { provide: MAT_OPTION_PARENT_COMPONENT, useExisting: MatAutocomplete }
                ]
            },] },
];
/** @nocollapse */
MatAutocomplete.ctorParameters = () => [
    { type: ChangeDetectorRef, },
    { type: ElementRef, },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MAT_AUTOCOMPLETE_DEFAULT_OPTIONS,] },] },
];
MatAutocomplete.propDecorators = {
    "template": [{ type: ViewChild, args: [TemplateRef,] },],
    "panel": [{ type: ViewChild, args: ['panel',] },],
    "options": [{ type: ContentChildren, args: [MatOption, { descendants: true },] },],
    "optionGroups": [{ type: ContentChildren, args: [MatOptgroup,] },],
    "displayWith": [{ type: Input },],
    "autoActiveFirstOption": [{ type: Input },],
    "optionSelected": [{ type: Output },],
    "classList": [{ type: Input, args: ['class',] },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * The height of each autocomplete option.
 */
const AUTOCOMPLETE_OPTION_HEIGHT = 48;
/**
 * The total height of the autocomplete panel.
 */
const AUTOCOMPLETE_PANEL_HEIGHT = 256;
/**
 * Injection token that determines the scroll handling while the autocomplete panel is open.
 */
const MAT_AUTOCOMPLETE_SCROLL_STRATEGY = new InjectionToken('mat-autocomplete-scroll-strategy');
/**
 * \@docs-private
 * @param {?} overlay
 * @return {?}
 */
function MAT_AUTOCOMPLETE_SCROLL_STRATEGY_PROVIDER_FACTORY(overlay) {
    return () => overlay.scrollStrategies.reposition();
}
/**
 * \@docs-private
 */
const MAT_AUTOCOMPLETE_SCROLL_STRATEGY_PROVIDER = {
    provide: MAT_AUTOCOMPLETE_SCROLL_STRATEGY,
    deps: [Overlay],
    useFactory: MAT_AUTOCOMPLETE_SCROLL_STRATEGY_PROVIDER_FACTORY,
};
/**
 * Provider that allows the autocomplete to register as a ControlValueAccessor.
 * \@docs-private
 */
const MAT_AUTOCOMPLETE_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MatAutocompleteTrigger),
    multi: true
};
/**
 * Creates an error to be thrown when attempting to use an autocomplete trigger without a panel.
 * @return {?}
 */
function getMatAutocompleteMissingPanelError() {
    return Error('Attempting to open an undefined instance of `mat-autocomplete`. ' +
        'Make sure that the id passed to the `matAutocomplete` is correct and that ' +
        'you\'re attempting to open it after the ngAfterContentInit hook.');
}
class MatAutocompleteTrigger {
    /**
     * @param {?} _element
     * @param {?} _overlay
     * @param {?} _viewContainerRef
     * @param {?} _zone
     * @param {?} _changeDetectorRef
     * @param {?} _scrollStrategy
     * @param {?} _dir
     * @param {?} _formField
     * @param {?} _document
     */
    constructor(_element, _overlay, _viewContainerRef, _zone, _changeDetectorRef, _scrollStrategy, _dir, _formField, _document) {
        this._element = _element;
        this._overlay = _overlay;
        this._viewContainerRef = _viewContainerRef;
        this._zone = _zone;
        this._changeDetectorRef = _changeDetectorRef;
        this._scrollStrategy = _scrollStrategy;
        this._dir = _dir;
        this._formField = _formField;
        this._document = _document;
        this._componentDestroyed = false;
        /**
         * Whether or not the label state is being overridden.
         */
        this._manuallyFloatingLabel = false;
        /**
         * Stream of keyboard events that can close the panel.
         */
        this._closeKeyEventStream = new Subject();
        /**
         * `View -> model callback called when value changes`
         */
        this._onChange = () => { };
        /**
         * `View -> model callback called when autocomplete has been touched`
         */
        this._onTouched = () => { };
        this._panelOpen = false;
        /**
         * Stream of autocomplete option selections.
         */
        this.optionSelections = defer(() => {
            if (this.autocomplete && this.autocomplete.options) {
                return merge(...this.autocomplete.options.map(option => option.onSelectionChange));
            }
            // If there are any subscribers before `ngAfterViewInit`, the `autocomplete` will be undefined.
            // Return a stream that we'll replace with the real one once everything is in place.
            return this._zone.onStable
                .asObservable()
                .pipe(take(1), switchMap(() => this.optionSelections));
        });
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this._componentDestroyed = true;
        this._destroyPanel();
        this._closeKeyEventStream.complete();
    }
    /**
     * Whether or not the autocomplete panel is open.
     * @return {?}
     */
    get panelOpen() { return this._panelOpen && this.autocomplete.showPanel; }
    /**
     * Opens the autocomplete suggestion panel.
     * @return {?}
     */
    openPanel() {
        this._attachOverlay();
        this._floatLabel();
    }
    /**
     * Closes the autocomplete suggestion panel.
     * @return {?}
     */
    closePanel() {
        this._resetLabel();
        if (this._panelOpen) {
            this.autocomplete._isOpen = this._panelOpen = false;
            if (this._overlayRef && this._overlayRef.hasAttached()) {
                this._overlayRef.detach();
                this._closingActionsSubscription.unsubscribe();
            }
            // Note that in some cases this can end up being called after the component is destroyed.
            // Add a check to ensure that we don't try to run change detection on a destroyed view.
            if (!this._componentDestroyed) {
                // We need to trigger change detection manually, because
                // `fromEvent` doesn't seem to do it at the proper time.
                // This ensures that the label is reset when the
                // user clicks outside.
                this._changeDetectorRef.detectChanges();
            }
        }
    }
    /**
     * A stream of actions that should close the autocomplete panel, including
     * when an option is selected, on blur, and when TAB is pressed.
     * @return {?}
     */
    get panelClosingActions() {
        return merge(this.optionSelections, this.autocomplete._keyManager.tabOut.pipe(filter(() => this._panelOpen)), this._closeKeyEventStream, this._outsideClickStream, this._overlayRef ?
            this._overlayRef.detachments().pipe(filter(() => this._panelOpen)) :
            of());
    }
    /**
     * The currently active option, coerced to MatOption type.
     * @return {?}
     */
    get activeOption() {
        if (this.autocomplete && this.autocomplete._keyManager) {
            return this.autocomplete._keyManager.activeItem;
        }
        return null;
    }
    /**
     * Stream of clicks outside of the autocomplete panel.
     * @return {?}
     */
    get _outsideClickStream() {
        if (!this._document) {
            return of(null);
        }
        return merge(fromEvent(this._document, 'click'), fromEvent(this._document, 'touchend'))
            .pipe(filter((event) => {
            const /** @type {?} */ clickTarget = /** @type {?} */ (event.target);
            const /** @type {?} */ formField = this._formField ?
                this._formField._elementRef.nativeElement : null;
            return this._panelOpen &&
                clickTarget !== this._element.nativeElement &&
                (!formField || !formField.contains(clickTarget)) &&
                (!!this._overlayRef && !this._overlayRef.overlayElement.contains(clickTarget));
        }));
    }
    /**
     * @param {?} value
     * @return {?}
     */
    writeValue(value) {
        Promise.resolve(null).then(() => this._setTriggerValue(value));
    }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnChange(fn) {
        this._onChange = fn;
    }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnTouched(fn) {
        this._onTouched = fn;
    }
    /**
     * @param {?} isDisabled
     * @return {?}
     */
    setDisabledState(isDisabled) {
        this._element.nativeElement.disabled = isDisabled;
    }
    /**
     * @param {?} event
     * @return {?}
     */
    _handleKeydown(event) {
        const /** @type {?} */ keyCode = event.keyCode;
        // Prevent the default action on all escape key presses. This is here primarily to bring IE
        // in line with other browsers. By default, pressing escape on IE will cause it to revert
        // the input value to the one that it had on focus, however it won't dispatch any events
        // which means that the model value will be out of sync with the view.
        if (keyCode === ESCAPE) {
            event.preventDefault();
        }
        // Close when pressing ESCAPE or ALT + UP_ARROW, based on the a11y guidelines.
        // See: https://www.w3.org/TR/wai-aria-practices-1.1/#textbox-keyboard-interaction
        if (this.panelOpen && (keyCode === ESCAPE || (keyCode === UP_ARROW && event.altKey))) {
            this._resetActiveItem();
            this._closeKeyEventStream.next();
            event.stopPropagation();
        }
        else if (this.activeOption && keyCode === ENTER && this.panelOpen) {
            this.activeOption._selectViaInteraction();
            this._resetActiveItem();
            event.preventDefault();
        }
        else {
            const /** @type {?} */ prevActiveItem = this.autocomplete._keyManager.activeItem;
            const /** @type {?} */ isArrowKey = keyCode === UP_ARROW || keyCode === DOWN_ARROW;
            if (this.panelOpen || keyCode === TAB) {
                this.autocomplete._keyManager.onKeydown(event);
            }
            else if (isArrowKey && this._canOpen()) {
                this.openPanel();
            }
            if (isArrowKey || this.autocomplete._keyManager.activeItem !== prevActiveItem) {
                this._scrollToOption();
            }
        }
    }
    /**
     * @param {?} event
     * @return {?}
     */
    _handleInput(event) {
        let /** @type {?} */ target = /** @type {?} */ (event.target);
        let /** @type {?} */ value = target.value;
        // Based on `NumberValueAccessor` from forms.
        if (target.type === 'number') {
            value = value == '' ? null : parseFloat(value);
        }
        // If the input has a placeholder, IE will fire the `input` event on page load,
        // focus and blur, in addition to when the user actually changed the value. To
        // filter out all of the extra events, we save the value on focus and between
        // `input` events, and we check whether it changed.
        // See: https://connect.microsoft.com/IE/feedback/details/885747/
        if (this._canOpen() && this._previousValue !== value &&
            document.activeElement === event.target) {
            this._previousValue = value;
            this._onChange(value);
            this.openPanel();
        }
    }
    /**
     * @return {?}
     */
    _handleFocus() {
        if (this._canOpen()) {
            this._previousValue = this._element.nativeElement.value;
            this._attachOverlay();
            this._floatLabel(true);
        }
    }
    /**
     * In "auto" mode, the label will animate down as soon as focus is lost.
     * This causes the value to jump when selecting an option with the mouse.
     * This method manually floats the label until the panel can be closed.
     * @param {?=} shouldAnimate Whether the label should be animated when it is floated.
     * @return {?}
     */
    _floatLabel(shouldAnimate = false) {
        if (this._formField && this._formField.floatLabel === 'auto') {
            if (shouldAnimate) {
                this._formField._animateAndLockLabel();
            }
            else {
                this._formField.floatLabel = 'always';
            }
            this._manuallyFloatingLabel = true;
        }
    }
    /**
     * If the label has been manually elevated, return it to its normal state.
     * @return {?}
     */
    _resetLabel() {
        if (this._manuallyFloatingLabel) {
            this._formField.floatLabel = 'auto';
            this._manuallyFloatingLabel = false;
        }
    }
    /**
     * Given that we are not actually focusing active options, we must manually adjust scroll
     * to reveal options below the fold. First, we find the offset of the option from the top
     * of the panel. If that offset is below the fold, the new scrollTop will be the offset -
     * the panel height + the option height, so the active option will be just visible at the
     * bottom of the panel. If that offset is above the top of the visible panel, the new scrollTop
     * will become the offset. If that offset is visible within the panel already, the scrollTop is
     * not adjusted.
     * @return {?}
     */
    _scrollToOption() {
        const /** @type {?} */ index = this.autocomplete._keyManager.activeItemIndex || 0;
        const /** @type {?} */ labelCount = _countGroupLabelsBeforeOption(index, this.autocomplete.options, this.autocomplete.optionGroups);
        const /** @type {?} */ newScrollPosition = _getOptionScrollPosition(index + labelCount, AUTOCOMPLETE_OPTION_HEIGHT, this.autocomplete._getScrollTop(), AUTOCOMPLETE_PANEL_HEIGHT);
        this.autocomplete._setScrollTop(newScrollPosition);
    }
    /**
     * This method listens to a stream of panel closing actions and resets the
     * stream every time the option list changes.
     * @return {?}
     */
    _subscribeToClosingActions() {
        const /** @type {?} */ firstStable = this._zone.onStable.asObservable().pipe(take(1));
        const /** @type {?} */ optionChanges = this.autocomplete.options.changes.pipe(tap(() => this._positionStrategy.recalculateLastPosition()), 
        // Defer emitting to the stream until the next tick, because changing
        // bindings in here will cause "changed after checked" errors.
        delay(0));
        // When the zone is stable initially, and when the option list changes...
        return merge(firstStable, optionChanges)
            .pipe(
        // create a new stream of panelClosingActions, replacing any previous streams
        // that were created, and flatten it so our stream only emits closing events...
        switchMap(() => {
            this._resetActiveItem();
            this.autocomplete._setVisibility();
            return this.panelClosingActions;
        }), 
        // when the first closing event occurs...
        take(1))
            .subscribe(event => this._setValueAndClose(event));
    }
    /**
     * Destroys the autocomplete suggestion panel.
     * @return {?}
     */
    _destroyPanel() {
        if (this._overlayRef) {
            this.closePanel();
            this._overlayRef.dispose();
            this._overlayRef = null;
        }
    }
    /**
     * @param {?} value
     * @return {?}
     */
    _setTriggerValue(value) {
        const /** @type {?} */ toDisplay = this.autocomplete && this.autocomplete.displayWith ?
            this.autocomplete.displayWith(value) :
            value;
        // Simply falling back to an empty string if the display value is falsy does not work properly.
        // The display value can also be the number zero and shouldn't fall back to an empty string.
        const /** @type {?} */ inputValue = toDisplay != null ? toDisplay : '';
        // If it's used within a `MatFormField`, we should set it through the property so it can go
        // through change detection.
        if (this._formField) {
            this._formField._control.value = inputValue;
        }
        else {
            this._element.nativeElement.value = inputValue;
        }
    }
    /**
     * This method closes the panel, and if a value is specified, also sets the associated
     * control to that value. It will also mark the control as dirty if this interaction
     * stemmed from the user.
     * @param {?} event
     * @return {?}
     */
    _setValueAndClose(event) {
        if (event && event.source) {
            this._clearPreviousSelectedOption(event.source);
            this._setTriggerValue(event.source.value);
            this._onChange(event.source.value);
            this._element.nativeElement.focus();
            this.autocomplete._emitSelectEvent(event.source);
        }
        this.closePanel();
    }
    /**
     * Clear any previous selected option and emit a selection change event for this option
     * @param {?} skip
     * @return {?}
     */
    _clearPreviousSelectedOption(skip) {
        this.autocomplete.options.forEach(option => {
            if (option != skip && option.selected) {
                option.deselect();
            }
        });
    }
    /**
     * @return {?}
     */
    _attachOverlay() {
        if (!this.autocomplete) {
            throw getMatAutocompleteMissingPanelError();
        }
        if (!this._overlayRef) {
            this._portal = new TemplatePortal(this.autocomplete.template, this._viewContainerRef);
            this._overlayRef = this._overlay.create(this._getOverlayConfig());
        }
        else {
            /** Update the panel width, in case the host width has changed */
            this._overlayRef.updateSize({ width: this._getHostWidth() });
        }
        if (this._overlayRef && !this._overlayRef.hasAttached()) {
            this._overlayRef.attach(this._portal);
            this._closingActionsSubscription = this._subscribeToClosingActions();
        }
        this.autocomplete._setVisibility();
        this.autocomplete._isOpen = this._panelOpen = true;
    }
    /**
     * @return {?}
     */
    _getOverlayConfig() {
        return new OverlayConfig({
            positionStrategy: this._getOverlayPosition(),
            scrollStrategy: this._scrollStrategy(),
            width: this._getHostWidth(),
            direction: this._dir ? this._dir.value : 'ltr'
        });
    }
    /**
     * @return {?}
     */
    _getOverlayPosition() {
        this._positionStrategy = this._overlay.position().connectedTo(this._getConnectedElement(), { originX: 'start', originY: 'bottom' }, { overlayX: 'start', overlayY: 'top' })
            .withFallbackPosition({ originX: 'start', originY: 'top' }, { overlayX: 'start', overlayY: 'bottom' });
        return this._positionStrategy;
    }
    /**
     * @return {?}
     */
    _getConnectedElement() {
        return this._formField ? this._formField._connectionContainerRef : this._element;
    }
    /**
     * Returns the width of the input element, so the panel width can match it.
     * @return {?}
     */
    _getHostWidth() {
        return this._getConnectedElement().nativeElement.getBoundingClientRect().width;
    }
    /**
     * Resets the active item to -1 so arrow events will activate the
     * correct options, or to 0 if the consumer opted into it.
     * @return {?}
     */
    _resetActiveItem() {
        this.autocomplete._keyManager.setActiveItem(this.autocomplete.autoActiveFirstOption ? 0 : -1);
    }
    /**
     * Determines whether the panel can be opened.
     * @return {?}
     */
    _canOpen() {
        const /** @type {?} */ element = this._element.nativeElement;
        return !element.readOnly && !element.disabled;
    }
}
MatAutocompleteTrigger.decorators = [
    { type: Directive, args: [{
                selector: `input[matAutocomplete], textarea[matAutocomplete]`,
                host: {
                    'role': 'combobox',
                    'autocomplete': 'off',
                    'aria-autocomplete': 'list',
                    '[attr.aria-activedescendant]': 'activeOption?.id',
                    '[attr.aria-expanded]': 'panelOpen.toString()',
                    '[attr.aria-owns]': 'autocomplete?.id',
                    // Note: we use `focusin`, as opposed to `focus`, in order to open the panel
                    // a little earlier. This avoids issues where IE delays the focusing of the input.
                    '(focusin)': '_handleFocus()',
                    '(blur)': '_onTouched()',
                    '(input)': '_handleInput($event)',
                    '(keydown)': '_handleKeydown($event)',
                },
                exportAs: 'matAutocompleteTrigger',
                providers: [MAT_AUTOCOMPLETE_VALUE_ACCESSOR]
            },] },
];
/** @nocollapse */
MatAutocompleteTrigger.ctorParameters = () => [
    { type: ElementRef, },
    { type: Overlay, },
    { type: ViewContainerRef, },
    { type: NgZone, },
    { type: ChangeDetectorRef, },
    { type: undefined, decorators: [{ type: Inject, args: [MAT_AUTOCOMPLETE_SCROLL_STRATEGY,] },] },
    { type: Directionality, decorators: [{ type: Optional },] },
    { type: MatFormField, decorators: [{ type: Optional }, { type: Host },] },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [DOCUMENT,] },] },
];
MatAutocompleteTrigger.propDecorators = {
    "autocomplete": [{ type: Input, args: ['matAutocomplete',] },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

class MatAutocompleteModule {
}
MatAutocompleteModule.decorators = [
    { type: NgModule, args: [{
                imports: [MatOptionModule, OverlayModule, MatCommonModule, CommonModule],
                exports: [MatAutocomplete, MatOptionModule, MatAutocompleteTrigger, MatCommonModule],
                declarations: [MatAutocomplete, MatAutocompleteTrigger],
                providers: [MAT_AUTOCOMPLETE_SCROLL_STRATEGY_PROVIDER],
            },] },
];
/** @nocollapse */
MatAutocompleteModule.ctorParameters = () => [];

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

export { MatAutocompleteSelectedEvent, MatAutocompleteBase, _MatAutocompleteMixinBase, MAT_AUTOCOMPLETE_DEFAULT_OPTIONS, MatAutocomplete, MatAutocompleteModule, AUTOCOMPLETE_OPTION_HEIGHT, AUTOCOMPLETE_PANEL_HEIGHT, MAT_AUTOCOMPLETE_SCROLL_STRATEGY, MAT_AUTOCOMPLETE_SCROLL_STRATEGY_PROVIDER_FACTORY, MAT_AUTOCOMPLETE_SCROLL_STRATEGY_PROVIDER, MAT_AUTOCOMPLETE_VALUE_ACCESSOR, getMatAutocompleteMissingPanelError, MatAutocompleteTrigger };
//# sourceMappingURL=autocomplete.js.map
