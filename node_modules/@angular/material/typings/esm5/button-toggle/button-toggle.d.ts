/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { FocusMonitor } from '@angular/cdk/a11y';
import { UniqueSelectionDispatcher } from '@angular/cdk/collections';
import { ChangeDetectorRef, ElementRef, EventEmitter, OnDestroy, OnInit, QueryList } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { CanDisable } from '@angular/material/core';
/** Acceptable types for a button toggle. */
export declare type ToggleType = 'checkbox' | 'radio';
/** @docs-private */
export declare class MatButtonToggleGroupBase {
}
export declare const _MatButtonToggleGroupMixinBase: (new (...args: any[]) => CanDisable) & typeof MatButtonToggleGroupBase;
/**
 * Provider Expression that allows mat-button-toggle-group to register as a ControlValueAccessor.
 * This allows it to support [(ngModel)].
 * @docs-private
 */
export declare const MAT_BUTTON_TOGGLE_GROUP_VALUE_ACCESSOR: any;
/** Change event object emitted by MatButtonToggle. */
export declare class MatButtonToggleChange {
    /** The MatButtonToggle that emits the event. */
    source: MatButtonToggle | null;
    /** The value assigned to the MatButtonToggle. */
    value: any;
}
/** Exclusive selection button toggle group that behaves like a radio-button group. */
export declare class MatButtonToggleGroup extends _MatButtonToggleGroupMixinBase implements ControlValueAccessor, CanDisable {
    private _changeDetector;
    /**
     * The method to be called in order to update ngModel.
     * Now `ngModel` binding is not supported in multiple selection mode.
     */
    _controlValueAccessorChangeFn: (value: any) => void;
    /** onTouch function registered via registerOnTouch (ControlValueAccessor). */
    _onTouched: () => any;
    /** Child button toggle buttons. */
    _buttonToggles: QueryList<MatButtonToggle>;
    /** `name` attribute for the underlying `input` element. */
    name: string;
    private _name;
    /** Whether the toggle group is vertical. */
    vertical: boolean;
    private _vertical;
    /** Value of the toggle group. */
    value: any;
    private _value;
    /**
     * Event that emits whenever the value of the group changes.
     * Used to facilitate two-way data binding.
     * @docs-private
     */
    readonly valueChange: EventEmitter<any>;
    /** The currently selected button toggle, should match the value. */
    selected: MatButtonToggle | null;
    private _selected;
    /** Event emitted when the group's value changes. */
    readonly change: EventEmitter<MatButtonToggleChange>;
    constructor(_changeDetector: ChangeDetectorRef);
    private _updateButtonToggleNames();
    private _updateSelectedButtonToggleFromValue();
    /** Dispatch change event with current selection and group value. */
    _emitChangeEvent(): void;
    writeValue(value: any): void;
    registerOnChange(fn: (value: any) => void): void;
    registerOnTouched(fn: any): void;
    setDisabledState(isDisabled: boolean): void;
    private _markButtonTogglesForCheck();
}
/** Multiple selection button-toggle group. `ngModel` is not supported in this mode. */
export declare class MatButtonToggleGroupMultiple extends _MatButtonToggleGroupMixinBase implements CanDisable {
    /** Whether the toggle group is vertical. */
    vertical: boolean;
    private _vertical;
}
/** Single button inside of a toggle group. */
export declare class MatButtonToggle implements OnInit, OnDestroy {
    private _changeDetectorRef;
    private _buttonToggleDispatcher;
    private _elementRef;
    private _focusMonitor;
    /**
     * Attached to the aria-label attribute of the host element. In most cases, arial-labelledby will
     * take precedence so this may be omitted.
     */
    ariaLabel: string;
    /**
     * Users can specify the `aria-labelledby` attribute which will be forwarded to the input element
     */
    ariaLabelledby: string | null;
    /** Type of the button toggle. Either 'radio' or 'checkbox'. */
    _type: ToggleType;
    /** Whether or not the button toggle is a single selection. */
    private _isSingleSelector;
    /** Unregister function for _buttonToggleDispatcher */
    private _removeUniqueSelectionListener;
    _inputElement: ElementRef;
    /** The parent button toggle group (exclusive selection). Optional. */
    buttonToggleGroup: MatButtonToggleGroup;
    /** The parent button toggle group (multiple selection). Optional. */
    buttonToggleGroupMultiple: MatButtonToggleGroupMultiple;
    /** Unique ID for the underlying `input` element. */
    readonly inputId: string;
    /** The unique ID for this button toggle. */
    id: string;
    /** HTML's 'name' attribute used to group radios for unique selection. */
    name: string;
    /** Whether the button is checked. */
    checked: boolean;
    private _checked;
    /** MatButtonToggleGroup reads this to assign its own value. */
    value: any;
    private _value;
    /** Whether the button is disabled. */
    disabled: boolean;
    private _disabled;
    /** Event emitted when the group value changes. */
    readonly change: EventEmitter<MatButtonToggleChange>;
    constructor(toggleGroup: MatButtonToggleGroup, toggleGroupMultiple: MatButtonToggleGroupMultiple, _changeDetectorRef: ChangeDetectorRef, _buttonToggleDispatcher: UniqueSelectionDispatcher, _elementRef: ElementRef, _focusMonitor: FocusMonitor);
    ngOnInit(): void;
    /** Focuses the button. */
    focus(): void;
    /** Toggle the state of the current button toggle. */
    private _toggle();
    /** Checks the button toggle due to an interaction with the underlying native input. */
    _onInputChange(event: Event): void;
    _onInputClick(event: Event): void;
    /** Dispatch change event with current value. */
    private _emitChangeEvent();
    ngOnDestroy(): void;
    /**
     * Marks the button toggle as needing checking for change detection.
     * This method is exposed because the parent button toggle group will directly
     * update bound properties of the radio button.
     */
    _markForCheck(): void;
}
