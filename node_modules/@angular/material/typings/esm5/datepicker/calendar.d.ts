import { AfterContentInit, ChangeDetectorRef, ElementRef, EventEmitter, NgZone, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { DateAdapter, MatDateFormats } from '@angular/material/core';
import { MatDatepickerIntl } from './datepicker-intl';
import { MatMonthView } from './month-view';
import { MatMultiYearView } from './multi-year-view';
import { MatYearView } from './year-view';
import { Directionality } from '@angular/cdk/bidi';
/**
 * A calendar that is used as part of the datepicker.
 * @docs-private
 */
export declare class MatCalendar<D> implements AfterContentInit, OnDestroy, OnChanges {
    private _elementRef;
    private _intl;
    private _ngZone;
    private _dateAdapter;
    private _dateFormats;
    private _dir;
    private _intlChanges;
    /** A date representing the period (month or year) to start the calendar in. */
    startAt: D | null;
    private _startAt;
    /** Whether the calendar should be started in month or year view. */
    startView: 'month' | 'year' | 'multi-year';
    /** The currently selected date. */
    selected: D | null;
    private _selected;
    /** The minimum selectable date. */
    minDate: D | null;
    private _minDate;
    /** The maximum selectable date. */
    maxDate: D | null;
    private _maxDate;
    /** A function used to filter which dates are selectable. */
    dateFilter: (date: D) => boolean;
    /** Emits when the currently selected date changes. */
    readonly selectedChange: EventEmitter<D>;
    /** Emits when any date is selected. */
    readonly _userSelection: EventEmitter<void>;
    /** Reference to the current month view component. */
    monthView: MatMonthView<D>;
    /** Reference to the current year view component. */
    yearView: MatYearView<D>;
    /** Reference to the current multi-year view component. */
    multiYearView: MatMultiYearView<D>;
    /**
     * The current active date. This determines which time period is shown and which date is
     * highlighted when using keyboard navigation.
     */
    _activeDate: D;
    private _clampedActiveDate;
    /** Whether the calendar is in month view. */
    _currentView: 'month' | 'year' | 'multi-year';
    /** The label for the current calendar view. */
    readonly _periodButtonText: string;
    readonly _periodButtonLabel: string;
    /** The label for the the previous button. */
    readonly _prevButtonLabel: string;
    /** The label for the the next button. */
    readonly _nextButtonLabel: string;
    constructor(_elementRef: ElementRef, _intl: MatDatepickerIntl, _ngZone: NgZone, _dateAdapter: DateAdapter<D>, _dateFormats: MatDateFormats, changeDetectorRef: ChangeDetectorRef, _dir?: Directionality | undefined);
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
    ngOnChanges(changes: SimpleChanges): void;
    /** Handles date selection in the month view. */
    _dateSelected(date: D): void;
    _userSelected(): void;
    /** Handles month selection in the multi-year view. */
    _goToDateInView(date: D, view: 'month' | 'year' | 'multi-year'): void;
    /** Handles user clicks on the period label. */
    _currentPeriodClicked(): void;
    /** Handles user clicks on the previous button. */
    _previousClicked(): void;
    /** Handles user clicks on the next button. */
    _nextClicked(): void;
    /** Whether the previous period button is enabled. */
    _previousEnabled(): boolean;
    /** Whether the next period button is enabled. */
    _nextEnabled(): boolean;
    /** Handles keydown events on the calendar body. */
    _handleCalendarBodyKeydown(event: KeyboardEvent): void;
    /** Focuses the active cell after the microtask queue is empty. */
    _focusActiveCell(): void;
    /** Whether the two dates represent the same view in the current view mode (month or year). */
    private _isSameView(date1, date2);
    /** Handles keydown events on the calendar body when calendar is in month view. */
    private _handleCalendarBodyKeydownInMonthView(event);
    /** Handles keydown events on the calendar body when calendar is in year view. */
    private _handleCalendarBodyKeydownInYearView(event);
    /** Handles keydown events on the calendar body when calendar is in multi-year view. */
    private _handleCalendarBodyKeydownInMultiYearView(event);
    /**
     * @param obj The object to check.
     * @returns The given object if it is both a date instance and valid, otherwise null.
     */
    private _getValidDateOrNull(obj);
    /** Determines whether the user has the RTL layout direction. */
    private _isRtl();
}
