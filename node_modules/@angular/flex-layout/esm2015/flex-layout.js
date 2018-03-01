/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { APP_BOOTSTRAP_LISTENER, Directive, ElementRef, EventEmitter, Inject, Injectable, InjectionToken, Input, IterableDiffers, KeyValueDiffers, NgModule, NgZone, Optional, Output, PLATFORM_ID, Renderer2, SecurityContext, Self, SimpleChange, SkipSelf, Version } from '@angular/core';
import { map } from 'rxjs/operators/map';
import { DOCUMENT, NgClass, NgStyle, isPlatformBrowser, isPlatformServer } from '@angular/common';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { filter } from 'rxjs/operators/filter';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { DomSanitizer } from '@angular/platform-browser';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * Current version of Angular Flex-Layout.
 */
const VERSION = new Version('2.0.0-beta.12-8bdc586');

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

const INLINE = 'inline';
const LAYOUT_VALUES = ['row', 'column', 'row-reverse', 'column-reverse'];
/**
 * Validate the direction|'direction wrap' value and then update the host's inline flexbox styles
 * @param {?} value
 * @return {?}
 */
function buildLayoutCSS(value) {
    let [direction, wrap, isInline] = validateValue(value);
    return buildCSS(direction, wrap, isInline);
}
/**
 * Validate the value to be one of the acceptable value options
 * Use default fallback of 'row'
 * @param {?} value
 * @return {?}
 */
function validateValue(value) {
    value = value ? value.toLowerCase() : '';
    let [direction, wrap, inline] = value.split(' ');
    // First value must be the `flex-direction`
    if (!LAYOUT_VALUES.find(x => x === direction)) {
        direction = LAYOUT_VALUES[0];
    }
    if (wrap === INLINE) {
        wrap = (inline !== INLINE) ? inline : '';
        inline = INLINE;
    }
    return [direction, validateWrapValue(wrap), !!inline];
}
/**
 * Determine if the validated, flex-direction value specifies
 * a horizontal/row flow.
 * @param {?} value
 * @return {?}
 */
function isFlowHorizontal(value) {
    let [flow,] = validateValue(value);
    return flow.indexOf('row') > -1;
}
/**
 * Convert layout-wrap='<value>' to expected flex-wrap style
 * @param {?} value
 * @return {?}
 */
function validateWrapValue(value) {
    if (!!value) {
        switch (value.toLowerCase()) {
            case 'reverse':
            case 'wrap-reverse':
            case 'reverse-wrap':
                value = 'wrap-reverse';
                break;
            case 'no':
            case 'none':
            case 'nowrap':
                value = 'nowrap';
                break;
            // All other values fallback to 'wrap'
            default:
                value = 'wrap';
                break;
        }
    }
    return value;
}
/**
 * Build the CSS that should be assigned to the element instance
 * BUG:
 *   1) min-height on a column flex container won’t apply to its flex item children in IE 10-11.
 *      Use height instead if possible; height : <xxx>vh;
 *
 *  This way any padding or border specified on the child elements are
 *  laid out and drawn inside that element's specified width and height.
 * @param {?} direction
 * @param {?=} wrap
 * @param {?=} inline
 * @return {?}
 */
function buildCSS(direction, wrap = null, inline = false) {
    return {
        'display': inline ? 'inline-flex' : 'flex',
        'box-sizing': 'border-box',
        'flex-direction': direction,
        'flex-wrap': !!wrap ? wrap : null
    };
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Extends an object with the *enumerable* and *own* properties of one or more source objects,
 * similar to Object.assign.
 *
 * @param {?} dest The object which will have properties copied to it.
 * @param {...?} sources The source objects from which properties will be copied.
 * @return {?}
 */
function extendObject(dest, ...sources) {
    if (dest == null) {
        throw TypeError('Cannot convert undefined or null to object');
    }
    for (let /** @type {?} */ source of sources) {
        if (source != null) {
            for (let /** @type {?} */ key in source) {
                if (source.hasOwnProperty(key)) {
                    dest[key] = source[key];
                }
            }
        }
    }
    return dest;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @record
 */

class KeyOptions {
    /**
     * @param {?} baseKey
     * @param {?} defaultValue
     * @param {?} inputKeys
     */
    constructor(baseKey, defaultValue, inputKeys) {
        this.baseKey = baseKey;
        this.defaultValue = defaultValue;
        this.inputKeys = inputKeys;
    }
}
/**
 * ResponsiveActivation acts as a proxy between the MonitorMedia service (which emits mediaQuery
 * changes) and the fx API directives. The MQA proxies mediaQuery change events and notifies the
 * directive via the specified callback.
 *
 * - The MQA also determines which directive property should be used to determine the
 *   current change 'value'... BEFORE the original `onMediaQueryChanges()` method is called.
 * - The `ngOnDestroy()` method is also head-hooked to enable auto-unsubscribe from the
 *   MediaQueryServices.
 *
 * NOTE: these interceptions enables the logic in the fx API directives to remain terse and clean.
 */
class ResponsiveActivation {
    /**
     * Constructor
     * @param {?} _options
     * @param {?} _mediaMonitor
     * @param {?} _onMediaChanges
     */
    constructor(_options, _mediaMonitor, _onMediaChanges) {
        this._options = _options;
        this._mediaMonitor = _mediaMonitor;
        this._onMediaChanges = _onMediaChanges;
        this._subscribers = [];
        this._registryMap = this._buildRegistryMap();
        this._subscribers = this._configureChangeObservers();
    }
    /**
     * Get a readonly sorted list of the breakpoints corresponding to the directive properties
     * defined in the HTML markup: the sorting is done from largest to smallest. The order is
     * important when several media queries are 'registered' and from which, the browser uses the
     * first matching media query.
     * @return {?}
     */
    get registryFromLargest() {
        return [...this._registryMap].reverse();
    }
    /**
     * Accessor to the DI'ed directive property
     * Each directive instance has a reference to the MediaMonitor which is
     * used HERE to subscribe to mediaQuery change notifications.
     * @return {?}
     */
    get mediaMonitor() {
        return this._mediaMonitor;
    }
    /**
     * Determine which directive \@Input() property is currently active (for the viewport size):
     * The key must be defined (in use) or fallback to the 'closest' overlapping property key
     * that is defined; otherwise the default property key will be used.
     * e.g.
     *      if `<div fxHide fxHide.gt-sm="false">` is used but the current activated mediaQuery alias
     *      key is `.md` then `.gt-sm` should be used instead
     * @return {?}
     */
    get activatedInputKey() {
        return this._activatedInputKey || this._options.baseKey;
    }
    /**
     * Get the currently activated \@Input value or the fallback default \@Input value
     * @return {?}
     */
    get activatedInput() {
        let /** @type {?} */ key = this.activatedInputKey;
        return this.hasKeyValue(key) ? this._lookupKeyValue(key) : this._options.defaultValue;
    }
    /**
     * Fast validator for presence of attribute on the host element
     * @param {?} key
     * @return {?}
     */
    hasKeyValue(key) {
        let /** @type {?} */ value = this._options.inputKeys[key];
        return typeof value !== 'undefined';
    }
    /**
     * Remove interceptors, restore original functions, and forward the onDestroy() call
     * @return {?}
     */
    destroy() {
        this._subscribers.forEach((link) => {
            link.unsubscribe();
        });
        this._subscribers = [];
    }
    /**
     * For each *defined* API property, register a callback to `_onMonitorEvents( )`
     * Cache 1..n subscriptions for internal auto-unsubscribes when the the directive destructs
     * @return {?}
     */
    _configureChangeObservers() {
        let /** @type {?} */ subscriptions = [];
        this._registryMap.forEach((bp) => {
            if (this._keyInUse(bp.key)) {
                // Inject directive default property key name: to let onMediaChange() calls
                // know which property is being triggered...
                let /** @type {?} */ buildChanges = (change) => {
                    change = change.clone();
                    change.property = this._options.baseKey;
                    return change;
                };
                subscriptions.push(this.mediaMonitor
                    .observe(bp.alias)
                    .pipe(map(buildChanges))
                    .subscribe(change => {
                    this._onMonitorEvents(change);
                }));
            }
        });
        return subscriptions;
    }
    /**
     * Build mediaQuery key-hashmap; only for the directive properties that are actually defined/used
     * in the HTML markup
     * @return {?}
     */
    _buildRegistryMap() {
        return this.mediaMonitor.breakpoints
            .map(bp => {
            return /** @type {?} */ (extendObject({}, bp, {
                baseKey: this._options.baseKey,
                // e.g. layout, hide, self-align, flex-wrap
                key: this._options.baseKey + bp.suffix // e.g.  layoutGtSm, layoutMd, layoutGtLg
            }));
        })
            .filter(bp => this._keyInUse(bp.key));
    }
    /**
     * Synchronizes change notifications with the current mq-activated \@Input and calculates the
     * mq-activated input value or the default value
     * @param {?} change
     * @return {?}
     */
    _onMonitorEvents(change) {
        if (change.property == this._options.baseKey) {
            change.value = this._calculateActivatedValue(change);
            this._onMediaChanges(change);
        }
    }
    /**
     * Has the key been specified in the HTML markup and thus is intended
     * to participate in activation processes.
     * @param {?} key
     * @return {?}
     */
    _keyInUse(key) {
        return this._lookupKeyValue(key) !== undefined;
    }
    /**
     *  Map input key associated with mediaQuery activation to closest defined input key
     *  then return the values associated with the targeted input property
     *
     *  !! change events may arrive out-of-order (activate before deactivate)
     *     so make sure the deactivate is used ONLY when the keys match
     *     (since a different activate may be in use)
     * @param {?} current
     * @return {?}
     */
    _calculateActivatedValue(current) {
        const /** @type {?} */ currentKey = this._options.baseKey + current.suffix; // e.g. suffix == 'GtSm',
        let /** @type {?} */ newKey = this._activatedInputKey; // e.g. newKey == hideGtSm
        newKey = current.matches ? currentKey : ((newKey == currentKey) ? '' : newKey);
        this._activatedInputKey = this._validateInputKey(newKey);
        return this.activatedInput;
    }
    /**
     * For the specified input property key, validate it is defined (used in the markup)
     * If not see if a overlapping mediaQuery-related input key fallback has been defined
     *
     * NOTE: scans in the order defined by activeOverLaps (largest viewport ranges -> smallest ranges)
     * @param {?} inputKey
     * @return {?}
     */
    _validateInputKey(inputKey) {
        let /** @type {?} */ isMissingKey = (key) => !this._keyInUse(key);
        if (isMissingKey(inputKey)) {
            this.mediaMonitor.activeOverlaps.some(bp => {
                let /** @type {?} */ key = this._options.baseKey + bp.suffix;
                if (!isMissingKey(key)) {
                    inputKey = key;
                    return true; // exit .some()
                }
                return false;
            });
        }
        return inputKey;
    }
    /**
     * Get the value (if any) for the directive instances \@Input property (aka key)
     * @param {?} key
     * @return {?}
     */
    _lookupKeyValue(key) {
        return this._options.inputKeys[key];
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Abstract base class for the Layout API styling directives.
 * @abstract
 */
class BaseFxDirective {
    /**
     * Constructor
     * @param {?} _mediaMonitor
     * @param {?} _elementRef
     * @param {?} _styler
     */
    constructor(_mediaMonitor, _elementRef, _styler) {
        this._mediaMonitor = _mediaMonitor;
        this._elementRef = _elementRef;
        this._styler = _styler;
        /**
         *  Dictionary of input keys with associated values
         */
        this._inputMap = {};
        /**
         * Has the `ngOnInit()` method fired
         *
         * Used to allow *ngFor tasks to finish and support queries like
         * getComputedStyle() during ngOnInit().
         */
        this._hasInitialized = false;
    }
    /**
     * @return {?}
     */
    get hasMediaQueryListener() {
        return !!this._mqActivation;
    }
    /**
     * Imperatively determine the current activated [input] value;
     * if called before ngOnInit() this will return `undefined`
     * @return {?}
     */
    get activatedValue() {
        return this._mqActivation ? this._mqActivation.activatedInput : undefined;
    }
    /**
     * Change the currently activated input value and force-update
     * the injected CSS (by-passing change detection).
     *
     * NOTE: Only the currently activated input value will be modified;
     *       other input values will NOT be affected.
     * @param {?} value
     * @return {?}
     */
    set activatedValue(value) {
        let /** @type {?} */ key = 'baseKey', /** @type {?} */ previousVal;
        if (this._mqActivation) {
            key = this._mqActivation.activatedInputKey;
            previousVal = this._inputMap[key];
            this._inputMap[key] = value;
        }
        let /** @type {?} */ change = new SimpleChange(previousVal, value, false);
        this.ngOnChanges(/** @type {?} */ ({ [key]: change }));
    }
    /**
     * Access to host element's parent DOM node
     * @return {?}
     */
    get parentElement() {
        return this._elementRef.nativeElement.parentNode;
    }
    /**
     * @return {?}
     */
    get nativeElement() {
        return this._elementRef.nativeElement;
    }
    /**
     * Access the current value (if any) of the \@Input property.
     * @param {?} key
     * @return {?}
     */
    _queryInput(key) {
        return this._inputMap[key];
    }
    /**
     * Use post-component-initialization event to perform extra
     * querying such as computed Display style
     * @return {?}
     */
    ngOnInit() {
        this._display = this._getDisplayStyle();
        this._hasInitialized = true;
    }
    /**
     * @param {?} change
     * @return {?}
     */
    ngOnChanges(change) {
        throw new Error(`BaseFxDirective::ngOnChanges should be overridden in subclass: ${change}`);
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        if (this._mqActivation) {
            this._mqActivation.destroy();
        }
        delete this._mediaMonitor;
    }
    /**
     * Was the directive's default selector used ?
     * If not, use the fallback value!
     * @param {?} key
     * @param {?} fallbackVal
     * @return {?}
     */
    _getDefaultVal(key, fallbackVal) {
        let /** @type {?} */ val = this._queryInput(key);
        let /** @type {?} */ hasDefaultVal = (val !== undefined && val !== null);
        return (hasDefaultVal && val !== '') ? val : fallbackVal;
    }
    /**
     * Quick accessor to the current HTMLElement's `display` style
     * Note: this allows us to preserve the original style
     * and optional restore it when the mediaQueries deactivate
     * @param {?=} source
     * @return {?}
     */
    _getDisplayStyle(source = this.nativeElement) {
        const /** @type {?} */ query = 'display';
        return this._styler.lookupStyle(source, query);
    }
    /**
     * Quick accessor to raw attribute value on the target DOM element
     * @param {?} attribute
     * @param {?=} source
     * @return {?}
     */
    _getAttributeValue(attribute, source = this.nativeElement) {
        return this._styler.lookupAttributeValue(source, attribute);
    }
    /**
     * Determine the DOM element's Flexbox flow (flex-direction).
     *
     * Check inline style first then check computed (stylesheet) style.
     * And optionally add the flow value to element's inline style.
     * @param {?} target
     * @param {?=} addIfMissing
     * @return {?}
     */
    _getFlowDirection(target, addIfMissing = false) {
        let /** @type {?} */ value = 'row';
        let /** @type {?} */ hasInlineValue = '';
        if (target) {
            [value, hasInlineValue] = this._styler.getFlowDirection(target);
            if (!hasInlineValue && addIfMissing) {
                const /** @type {?} */ style = buildLayoutCSS(value);
                const /** @type {?} */ elements = [target];
                this._styler.applyStyleToElements(style, elements);
            }
        }
        return value.trim() || 'row';
    }
    /**
     * Applies styles given via string pair or object map to the directive element.
     * @param {?} style
     * @param {?=} value
     * @param {?=} element
     * @return {?}
     */
    _applyStyleToElement(style, value, element = this.nativeElement) {
        this._styler.applyStyleToElement(element, style, value);
    }
    /**
     * Applies styles given via string pair or object map to the directive's element.
     * @param {?} style
     * @param {?} elements
     * @return {?}
     */
    _applyStyleToElements(style, elements) {
        this._styler.applyStyleToElements(style, elements);
    }
    /**
     *  Save the property value; which may be a complex object.
     *  Complex objects support property chains
     * @param {?=} key
     * @param {?=} source
     * @return {?}
     */
    _cacheInput(key, source) {
        if (typeof source === 'object') {
            for (let /** @type {?} */ prop in source) {
                this._inputMap[prop] = source[prop];
            }
        }
        else {
            if (!!key) {
                this._inputMap[key] = source;
            }
        }
    }
    /**
     *  Build a ResponsiveActivation object used to manage subscriptions to mediaChange notifications
     *  and intelligent lookup of the directive's property value that corresponds to that mediaQuery
     *  (or closest match).
     * @param {?} key
     * @param {?} defaultValue
     * @param {?} onMediaQueryChange
     * @return {?}
     */
    _listenForMediaQueryChanges(key, defaultValue, onMediaQueryChange) {
        // tslint:disable-line:max-line-length
        if (!this._mqActivation) {
            let /** @type {?} */ keyOptions = new KeyOptions(key, defaultValue, this._inputMap);
            this._mqActivation = new ResponsiveActivation(keyOptions, this._mediaMonitor, (change) => onMediaQueryChange(change));
        }
        return this._mqActivation;
    }
    /**
     * Special accessor to query for all child 'element' nodes regardless of type, class, etc.
     * @return {?}
     */
    get childrenNodes() {
        const /** @type {?} */ obj = this.nativeElement.children;
        const /** @type {?} */ buffer = [];
        // iterate backwards ensuring that length is an UInt32
        for (let /** @type {?} */ i = obj.length; i--;) {
            buffer[i] = obj[i];
        }
        return buffer;
    }
    /**
     * Does this directive have 1 or more responsive keys defined
     * Note: we exclude the 'baseKey' key (which is NOT considered responsive)
     * @param {?} baseKey
     * @return {?}
     */
    hasResponsiveAPI(baseKey) {
        const /** @type {?} */ totalKeys = Object.keys(this._inputMap).length;
        const /** @type {?} */ baseValue = this._inputMap[baseKey];
        return (totalKeys - (!!baseValue ? 1 : 0)) > 0;
    }
    /**
     * Fast validator for presence of attribute on the host element
     * @param {?} key
     * @return {?}
     */
    hasKeyValue(key) {
        return this._mqActivation.hasKeyValue(key);
    }
    /**
     * @return {?}
     */
    get hasInitialized() {
        return this._hasInitialized;
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Adapter to the BaseFxDirective abstract class so it can be used via composition.
 * @see BaseFxDirective
 */
class BaseFxDirectiveAdapter extends BaseFxDirective {
    /**
     * BaseFxDirectiveAdapter constructor
     * @param {?} _baseKey
     * @param {?} _mediaMonitor
     * @param {?} _elementRef
     * @param {?} _styler
     */
    constructor(_baseKey, // non-responsive @Input property name
        // non-responsive @Input property name
        _mediaMonitor, _elementRef, _styler) {
        super(_mediaMonitor, _elementRef, _styler);
        this._baseKey = _baseKey;
        this._mediaMonitor = _mediaMonitor;
        this._elementRef = _elementRef;
        this._styler = _styler;
    }
    /**
     * Accessor to determine which \@Input property is "active"
     * e.g. which property value will be used.
     * @return {?}
     */
    get activeKey() {
        let /** @type {?} */ mqa = this._mqActivation;
        let /** @type {?} */ key = mqa ? mqa.activatedInputKey : this._baseKey;
        // Note: ClassDirective::SimpleChanges uses 'klazz' instead of 'class' as a key
        return (key === 'class') ? 'klazz' : key;
    }
    /**
     * Hash map of all \@Input keys/values defined/used
     * @return {?}
     */
    get inputMap() {
        return this._inputMap;
    }
    /**
     * @see BaseFxDirective._mqActivation
     * @return {?}
     */
    get mqActivation() {
        return this._mqActivation;
    }
    /**
     * Does this directive have 1 or more responsive keys defined
     * Note: we exclude the 'baseKey' key (which is NOT considered responsive)
     * @return {?}
     */
    hasResponsiveAPI() {
        return super.hasResponsiveAPI(this._baseKey);
    }
    /**
     * @see BaseFxDirective._queryInput
     * @param {?} key
     * @return {?}
     */
    queryInput(key) {
        return key ? this._queryInput(key) : undefined;
    }
    /**
     *  Save the property value.
     * @param {?=} key
     * @param {?=} source
     * @param {?=} cacheRaw
     * @return {?}
     */
    cacheInput(key, source, cacheRaw = false) {
        if (cacheRaw) {
            this._cacheInputRaw(key, source);
        }
        else if (Array.isArray(source)) {
            this._cacheInputArray(key, source);
        }
        else if (typeof source === 'object') {
            this._cacheInputObject(key, source);
        }
        else if (typeof source === 'string') {
            this._cacheInputString(key, source);
        }
        else {
            throw new Error(`Invalid class value '${key}' provided. Did you want to cache the raw value?`);
        }
    }
    /**
     * @see BaseFxDirective._listenForMediaQueryChanges
     * @param {?} key
     * @param {?} defaultValue
     * @param {?} onMediaQueryChange
     * @return {?}
     */
    listenForMediaQueryChanges(key, defaultValue, onMediaQueryChange) {
        return this._listenForMediaQueryChanges(key, defaultValue, onMediaQueryChange);
    }
    /**
     * No implicit transforms of the source.
     * Required when caching values expected later for KeyValueDiffers
     * @param {?=} key
     * @param {?=} source
     * @return {?}
     */
    _cacheInputRaw(key, source) {
        if (key) {
            this._inputMap[key] = source;
        }
    }
    /**
     *  Save the property value for Array values.
     * @param {?=} key
     * @param {?=} source
     * @return {?}
     */
    _cacheInputArray(key = '', source) {
        this._inputMap[key] = source ? source.join(' ') : '';
    }
    /**
     *  Save the property value for key/value pair values.
     * @param {?=} key
     * @param {?=} source
     * @return {?}
     */
    _cacheInputObject(key = '', source) {
        let /** @type {?} */ classes = [];
        if (source) {
            for (let /** @type {?} */ prop in source) {
                if (!!source[prop]) {
                    classes.push(prop);
                }
            }
        }
        this._inputMap[key] = classes.join(' ');
    }
    /**
     *  Save the property value for string values.
     * @param {?=} key
     * @param {?=} source
     * @return {?}
     */
    _cacheInputString(key = '', source) {
        this._inputMap[key] = source;
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 *  Injection token unique to the flex-layout library.
 *  Use this token when build a custom provider (see below).
 */
const BREAKPOINTS = new InjectionToken('Token (@angular/flex-layout) Breakpoints');

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Registry of 1..n MediaQuery breakpoint ranges
 * This is published as a provider and may be overriden from custom, application-specific ranges
 *
 */
class BreakPointRegistry {
    /**
     * @param {?} _registry
     */
    constructor(_registry) {
        this._registry = _registry;
    }
    /**
     * Accessor to raw list
     * @return {?}
     */
    get items() {
        return [...this._registry];
    }
    /**
     * Accessor to sorted list used for registration with matchMedia API
     *
     * NOTE: During breakpoint registration, we want to register the overlaps FIRST
     *       so the non-overlaps will trigger the MatchMedia:BehaviorSubject last!
     *       And the largest, non-overlap, matching breakpoint should be the lastReplay value
     * @return {?}
     */
    get sortedItems() {
        let /** @type {?} */ overlaps = this._registry.filter(it => it.overlapping === true);
        let /** @type {?} */ nonOverlaps = this._registry.filter(it => it.overlapping !== true);
        return [...overlaps, ...nonOverlaps];
    }
    /**
     * Search breakpoints by alias (e.g. gt-xs)
     * @param {?} alias
     * @return {?}
     */
    findByAlias(alias) {
        return this._registry.find(bp => bp.alias == alias) || null;
    }
    /**
     * @param {?} query
     * @return {?}
     */
    findByQuery(query) {
        return this._registry.find(bp => bp.mediaQuery == query) || null;
    }
    /**
     * Get all the breakpoints whose ranges could overlapping `normal` ranges;
     * e.g. gt-sm overlaps md, lg, and xl
     * @return {?}
     */
    get overlappings() {
        return this._registry.filter(it => it.overlapping == true);
    }
    /**
     * Get list of all registered (non-empty) breakpoint aliases
     * @return {?}
     */
    get aliases() {
        return this._registry.map(it => it.alias);
    }
    /**
     * Aliases are mapped to properties using suffixes
     * e.g.  'gt-sm' for property 'layout'  uses suffix 'GtSm'
     * for property layoutGtSM.
     * @return {?}
     */
    get suffixes() {
        return this._registry.map(it => !!it.suffix ? it.suffix : '');
    }
}
BreakPointRegistry.decorators = [
    { type: Injectable },
];
/** @nocollapse */
BreakPointRegistry.ctorParameters = () => [
    { type: Array, decorators: [{ type: Inject, args: [BREAKPOINTS,] },] },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Class instances emitted [to observers] for each mql notification
 */
class MediaChange {
    /**
     * @param {?=} matches
     * @param {?=} mediaQuery
     * @param {?=} mqAlias
     * @param {?=} suffix
     */
    constructor(matches = false, mediaQuery = 'all', mqAlias = '', suffix = '' // e.g.   GtSM, Md, GtLg
    ) {
        this.matches = matches;
        this.mediaQuery = mediaQuery;
        this.mqAlias = mqAlias;
        this.suffix = suffix;
    }
    /**
     * @return {?}
     */
    clone() {
        return new MediaChange(this.matches, this.mediaQuery, this.mqAlias, this.suffix);
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * MediaMonitor configures listeners to mediaQuery changes and publishes an Observable facade to
 * convert mediaQuery change callbacks to subscriber notifications. These notifications will be
 * performed within the ng Zone to trigger change detections and component updates.
 *
 * NOTE: both mediaQuery activations and de-activations are announced in notifications
 */
class MatchMedia {
    /**
     * @param {?} _zone
     * @param {?} _platformId
     * @param {?} _document
     */
    constructor(_zone, _platformId, _document) {
        this._zone = _zone;
        this._platformId = _platformId;
        this._document = _document;
        this._registry = new Map();
        this._source = new BehaviorSubject(new MediaChange(true));
        this._observable$ = this._source.asObservable();
    }
    /**
     * For the specified mediaQuery?
     * @param {?} mediaQuery
     * @return {?}
     */
    isActive(mediaQuery) {
        let /** @type {?} */ mql = this._registry.get(mediaQuery);
        return !!mql ? mql.matches : false;
    }
    /**
     * External observers can watch for all (or a specific) mql changes.
     * Typically used by the MediaQueryAdaptor; optionally available to components
     * who wish to use the MediaMonitor as mediaMonitor$ observable service.
     *
     * NOTE: if a mediaQuery is not specified, then ALL mediaQuery activations will
     *       be announced.
     * @param {?=} mediaQuery
     * @return {?}
     */
    observe(mediaQuery) {
        if (mediaQuery) {
            this.registerQuery(mediaQuery);
        }
        return this._observable$.pipe(filter((change) => {
            return mediaQuery ? (change.mediaQuery === mediaQuery) : true;
        }));
    }
    /**
     * Based on the BreakPointRegistry provider, register internal listeners for each unique
     * mediaQuery. Each listener emits specific MediaChange data to observers
     * @param {?} mediaQuery
     * @return {?}
     */
    registerQuery(mediaQuery) {
        let /** @type {?} */ list = normalizeQuery(mediaQuery);
        if (list.length > 0) {
            this._prepareQueryCSS(list, this._document);
            list.forEach(query => {
                let /** @type {?} */ mql = this._registry.get(query);
                let /** @type {?} */ onMQLEvent = (e) => {
                    this._zone.run(() => {
                        let /** @type {?} */ change = new MediaChange(e.matches, query);
                        this._source.next(change);
                    });
                };
                if (!mql) {
                    mql = this._buildMQL(query);
                    mql.addListener(onMQLEvent);
                    this._registry.set(query, mql);
                }
                if (mql.matches) {
                    onMQLEvent(mql); // Announce activate range for initial subscribers
                }
            });
        }
    }
    /**
     * Call window.matchMedia() to build a MediaQueryList; which
     * supports 0..n listeners for activation/deactivation
     * @param {?} query
     * @return {?}
     */
    _buildMQL(query) {
        let /** @type {?} */ canListen = isPlatformBrowser(this._platformId) &&
            !!(/** @type {?} */ (window)).matchMedia('all').addListener;
        return canListen ? (/** @type {?} */ (window)).matchMedia(query) : /** @type {?} */ ({
            matches: query === 'all' || query === '',
            media: query,
            addListener: () => {
            },
            removeListener: () => {
            }
        });
    }
    /**
     * For Webkit engines that only trigger the MediaQueryList Listener
     * when there is at least one CSS selector for the respective media query.
     *
     * @param {?} mediaQueries
     * @param {?} _document
     * @return {?}
     */
    _prepareQueryCSS(mediaQueries, _document) {
        let /** @type {?} */ list = mediaQueries.filter(it => !ALL_STYLES[it]);
        if (list.length > 0) {
            let /** @type {?} */ query = list.join(', ');
            try {
                let /** @type {?} */ styleEl = _document.createElement('style');
                styleEl.setAttribute('type', 'text/css');
                if (!styleEl['styleSheet']) {
                    let /** @type {?} */ cssText = `
/*
  @angular/flex-layout - workaround for possible browser quirk with mediaQuery listeners
  see http://bit.ly/2sd4HMP
*/
@media ${query} {.fx-query-test{ }}
`;
                    styleEl.appendChild(_document.createTextNode(cssText));
                }
                _document.head.appendChild(styleEl);
                // Store in private global registry
                list.forEach(mq => ALL_STYLES[mq] = styleEl);
            }
            catch (/** @type {?} */ e) {
                console.error(e);
            }
        }
    }
}
MatchMedia.decorators = [
    { type: Injectable },
];
/** @nocollapse */
MatchMedia.ctorParameters = () => [
    { type: NgZone, },
    { type: Object, decorators: [{ type: Inject, args: [PLATFORM_ID,] },] },
    { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] },] },
];
/**
 * Private global registry for all dynamically-created, injected style tags
 * @see prepare(query)
 */
const ALL_STYLES = {};
/**
 * Always convert to unique list of queries; for iteration in ::registerQuery()
 * @param {?} mediaQuery
 * @return {?}
 */
function normalizeQuery(mediaQuery) {
    return (typeof mediaQuery === 'undefined') ? [] :
        (typeof mediaQuery === 'string') ? [mediaQuery] : unique(/** @type {?} */ (mediaQuery));
}
/**
 * Filter duplicate mediaQueries in the list
 * @param {?} list
 * @return {?}
 */
function unique(list) {
    let /** @type {?} */ seen = {};
    return list.filter(item => {
        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    });
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * For the specified MediaChange, make sure it contains the breakpoint alias
 * and suffix (if available).
 * @param {?} dest
 * @param {?} source
 * @return {?}
 */
function mergeAlias(dest, source) {
    return extendObject(dest, source ? {
        mqAlias: source.alias,
        suffix: source.suffix
    } : {});
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * MediaMonitor uses the MatchMedia service to observe mediaQuery changes (both activations and
 * deactivations). These changes are are published as MediaChange notifications.
 *
 * Note: all notifications will be performed within the
 * ng Zone to trigger change detections and component updates.
 *
 * It is the MediaMonitor that:
 *  - auto registers all known breakpoints
 *  - injects alias information into each raw MediaChange event
 *  - provides accessor to the currently active BreakPoint
 *  - publish list of overlapping BreakPoint(s); used by ResponsiveActivation
 */
class MediaMonitor {
    /**
     * @param {?} _breakpoints
     * @param {?} _matchMedia
     */
    constructor(_breakpoints, _matchMedia) {
        this._breakpoints = _breakpoints;
        this._matchMedia = _matchMedia;
        this._registerBreakpoints();
    }
    /**
     * Read-only accessor to the list of breakpoints configured in the BreakPointRegistry provider
     * @return {?}
     */
    get breakpoints() {
        return [...this._breakpoints.items];
    }
    /**
     * @return {?}
     */
    get activeOverlaps() {
        let /** @type {?} */ items = this._breakpoints.overlappings.reverse();
        return items.filter((bp) => {
            return this._matchMedia.isActive(bp.mediaQuery);
        });
    }
    /**
     * @return {?}
     */
    get active() {
        let /** @type {?} */ found = null, /** @type {?} */ items = this.breakpoints.reverse();
        items.forEach(bp => {
            if (bp.alias !== '') {
                if (!found && this._matchMedia.isActive(bp.mediaQuery)) {
                    found = bp;
                }
            }
        });
        let /** @type {?} */ first = this.breakpoints[0];
        return found || (this._matchMedia.isActive(first.mediaQuery) ? first : null);
    }
    /**
     * For the specified mediaQuery alias, is the mediaQuery range active?
     * @param {?} alias
     * @return {?}
     */
    isActive(alias) {
        let /** @type {?} */ bp = this._breakpoints.findByAlias(alias) || this._breakpoints.findByQuery(alias);
        return this._matchMedia.isActive(bp ? bp.mediaQuery : alias);
    }
    /**
     * External observers can watch for all (or a specific) mql changes.
     * If specific breakpoint is observed, only return *activated* events
     * otherwise return all events for BOTH activated + deactivated changes.
     * @param {?=} alias
     * @return {?}
     */
    observe(alias) {
        let /** @type {?} */ bp = this._breakpoints.findByAlias(alias || '') ||
            this._breakpoints.findByQuery(alias || '');
        let /** @type {?} */ hasAlias = (change) => (bp ? change.mqAlias !== '' : true);
        // Note: the raw MediaChange events [from MatchMedia] do not contain important alias information
        let /** @type {?} */ media$ = this._matchMedia.observe(bp ? bp.mediaQuery : alias);
        return media$.pipe(map(change => mergeAlias(change, bp)), filter(hasAlias));
    }
    /**
     * Immediate calls to matchMedia() to establish listeners
     * and prepare for immediate subscription notifications
     * @return {?}
     */
    _registerBreakpoints() {
        let /** @type {?} */ queries = this._breakpoints.sortedItems.map(bp => bp.mediaQuery);
        this._matchMedia.registerQuery(queries);
    }
}
MediaMonitor.decorators = [
    { type: Injectable },
];
/** @nocollapse */
MediaMonitor.ctorParameters = () => [
    { type: BreakPointRegistry, },
    { type: MatchMedia, },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * Applies CSS prefixes to appropriate style keys.
 *
 * Note: `-ms-`, `-moz` and `-webkit-box` are no longer supported. e.g.
 *    {
 *      display: -webkit-flex;     NEW - Safari 6.1+. iOS 7.1+, BB10
 *      display: flex;             NEW, Spec - Firefox, Chrome, Opera
 *      // display: -webkit-box;   OLD - iOS 6-, Safari 3.1-6, BB7
 *      // display: -ms-flexbox;   TWEENER - IE 10
 *      // display: -moz-flexbox;  OLD - Firefox
 *    }
 * @param {?} target
 * @return {?}
 */
function applyCssPrefixes(target) {
    for (let /** @type {?} */ key in target) {
        let /** @type {?} */ value = target[key] || '';
        switch (key) {
            case 'display':
                if (value === 'flex') {
                    target['display'] = [
                        '-webkit-flex',
                        'flex'
                    ];
                }
                else if (value === 'inline-flex') {
                    target['display'] = [
                        '-webkit-inline-flex',
                        'inline-flex'
                    ];
                }
                else {
                    target['display'] = value;
                }
                break;
            case 'align-items':
            case 'align-self':
            case 'align-content':
            case 'flex':
            case 'flex-basis':
            case 'flex-flow':
            case 'flex-grow':
            case 'flex-shrink':
            case 'flex-wrap':
            case 'justify-content':
                target['-webkit-' + key] = value;
                break;
            case 'flex-direction':
                value = value || 'row';
                target['-webkit-flex-direction'] = value;
                target['flex-direction'] = value;
                break;
            case 'order':
                target['order'] = target['-webkit-' + key] = isNaN(value) ? '0' : value;
                break;
        }
    }
    return target;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Utility to emulate a CSS stylesheet
 *
 * This stores all of the styles for a given HTML element
 * and returns them later
 */
class ServerStylesheet {
    constructor() {
        this.stylesheet = new Map();
    }
    /**
     * Add an individual style to an HTML element
     * @param {?} element
     * @param {?} style
     * @param {?} value
     * @return {?}
     */
    addStyleToElement(element, style, value) {
        const /** @type {?} */ stylesheet = this.stylesheet.get(element);
        if (stylesheet) {
            stylesheet.set(style, value);
        }
        else {
            this.stylesheet.set(element, new Map([[style, value]]));
        }
    }
    /**
     * Clear the virtual stylesheet
     * @return {?}
     */
    clearStyles() {
        this.stylesheet.clear();
    }
    /**
     * Retrieve a given style for an HTML element
     * @param {?} el
     * @param {?} styleName
     * @return {?}
     */
    getStyleForElement(el, styleName) {
        const /** @type {?} */ styles = this.stylesheet.get(el);
        return (styles && styles.get(styleName)) || '';
    }
}
ServerStylesheet.decorators = [
    { type: Injectable },
];
/** @nocollapse */
ServerStylesheet.ctorParameters = () => [];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Token that is provided to tell whether the FlexLayoutServerModule
 * has been included in the bundle
 *
 * NOTE: This can be manually provided to disable styles when using SSR
 */
const SERVER_TOKEN = new InjectionToken('FlexLayoutServerLoaded');

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class StyleUtils {
    /**
     * @param {?} _serverStylesheet
     * @param {?} _serverModuleLoaded
     * @param {?} _platformId
     */
    constructor(_serverStylesheet, _serverModuleLoaded, _platformId) {
        this._serverStylesheet = _serverStylesheet;
        this._serverModuleLoaded = _serverModuleLoaded;
        this._platformId = _platformId;
    }
    /**
     * Applies styles given via string pair or object map to the directive element
     * @param {?} element
     * @param {?} style
     * @param {?=} value
     * @return {?}
     */
    applyStyleToElement(element, style, value) {
        let /** @type {?} */ styles = {};
        if (typeof style === 'string') {
            styles[style] = value;
            style = styles;
        }
        styles = applyCssPrefixes(style);
        this._applyMultiValueStyleToElement(styles, element);
    }
    /**
     * Applies styles given via string pair or object map to the directive's element
     * @param {?} style
     * @param {?=} elements
     * @return {?}
     */
    applyStyleToElements(style, elements = []) {
        const /** @type {?} */ styles = applyCssPrefixes(style);
        elements.forEach(el => {
            this._applyMultiValueStyleToElement(styles, el);
        });
    }
    /**
     * Determine the DOM element's Flexbox flow (flex-direction)
     *
     * Check inline style first then check computed (stylesheet) style
     * @param {?} target
     * @return {?}
     */
    getFlowDirection(target) {
        const /** @type {?} */ query = 'flex-direction';
        let /** @type {?} */ value = this.lookupStyle(target, query);
        if (value === FALLBACK_STYLE) {
            value = '';
        }
        const /** @type {?} */ hasInlineValue = this.lookupInlineStyle(target, query) ||
            (isPlatformServer(this._platformId) && this._serverModuleLoaded) ? value : '';
        return [value || 'row', hasInlineValue];
    }
    /**
     * Find the DOM element's raw attribute value (if any)
     * @param {?} element
     * @param {?} attribute
     * @return {?}
     */
    lookupAttributeValue(element, attribute) {
        return element.getAttribute(attribute) || '';
    }
    /**
     * Find the DOM element's inline style value (if any)
     * @param {?} element
     * @param {?} styleName
     * @return {?}
     */
    lookupInlineStyle(element, styleName) {
        return element.style[styleName] || element.style.getPropertyValue(styleName);
    }
    /**
     * Determine the inline or inherited CSS style
     * NOTE: platform-server has no implementation for getComputedStyle
     * @param {?} element
     * @param {?} styleName
     * @param {?=} inlineOnly
     * @return {?}
     */
    lookupStyle(element, styleName, inlineOnly = false) {
        let /** @type {?} */ value = '';
        if (element) {
            let /** @type {?} */ immediateValue = value = this.lookupInlineStyle(element, styleName);
            if (!immediateValue) {
                if (isPlatformBrowser(this._platformId)) {
                    if (!inlineOnly) {
                        value = getComputedStyle(element).getPropertyValue(styleName);
                    }
                }
                else {
                    if (this._serverModuleLoaded) {
                        value = `${this._serverStylesheet.getStyleForElement(element, styleName)}`;
                    }
                }
            }
        }
        // Note: 'inline' is the default of all elements, unless UA stylesheet overrides;
        //       in which case getComputedStyle() should determine a valid value.
        return value ? value.trim() : FALLBACK_STYLE;
    }
    /**
     * Applies the styles to the element. The styles object map may contain an array of values
     * Each value will be added as element style
     * Keys are sorted to add prefixed styles (like -webkit-x) first, before the standard ones
     * @param {?} styles
     * @param {?} element
     * @return {?}
     */
    _applyMultiValueStyleToElement(styles, element) {
        Object.keys(styles).sort().forEach(key => {
            const /** @type {?} */ values = Array.isArray(styles[key]) ? styles[key] : [styles[key]];
            values.sort();
            for (let /** @type {?} */ value of values) {
                if (isPlatformBrowser(this._platformId) || !this._serverModuleLoaded) {
                    element.style.setProperty(key, value);
                }
                else {
                    this._serverStylesheet.addStyleToElement(element, key, value);
                }
            }
        });
    }
}
StyleUtils.decorators = [
    { type: Injectable },
];
/** @nocollapse */
StyleUtils.ctorParameters = () => [
    { type: ServerStylesheet, decorators: [{ type: Optional },] },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [SERVER_TOKEN,] },] },
    { type: undefined, decorators: [{ type: Inject, args: [PLATFORM_ID,] },] },
];
const FALLBACK_STYLE = 'block';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * 'layout' flexbox styling directive
 * Defines the positioning flow direction for the child elements: row or column
 * Optional values: column or row (default)
 * @see https://css-tricks.com/almanac/properties/f/flex-direction/
 *
 */
class LayoutDirective extends BaseFxDirective {
    /**
     *
     * @param {?} monitor
     * @param {?} elRef
     * @param {?} styleUtils
     */
    constructor(monitor, elRef, styleUtils) {
        super(monitor, elRef, styleUtils);
        this._announcer = new ReplaySubject(1);
        this.layout$ = this._announcer.asObservable();
    }
    /**
     * @param {?} val
     * @return {?}
     */
    set layout(val) { this._cacheInput('layout', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set layoutXs(val) { this._cacheInput('layoutXs', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set layoutSm(val) { this._cacheInput('layoutSm', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set layoutMd(val) { this._cacheInput('layoutMd', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set layoutLg(val) { this._cacheInput('layoutLg', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set layoutXl(val) { this._cacheInput('layoutXl', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set layoutGtXs(val) { this._cacheInput('layoutGtXs', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set layoutGtSm(val) { this._cacheInput('layoutGtSm', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set layoutGtMd(val) { this._cacheInput('layoutGtMd', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set layoutGtLg(val) { this._cacheInput('layoutGtLg', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set layoutLtSm(val) { this._cacheInput('layoutLtSm', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set layoutLtMd(val) { this._cacheInput('layoutLtMd', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set layoutLtLg(val) { this._cacheInput('layoutLtLg', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set layoutLtXl(val) { this._cacheInput('layoutLtXl', val); }
    ;
    /**
     * On changes to any \@Input properties...
     * Default to use the non-responsive Input value ('fxLayout')
     * Then conditionally override with the mq-activated Input's current value
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (changes['layout'] != null || this._mqActivation) {
            this._updateWithDirection();
        }
    }
    /**
     * After the initial onChanges, build an mqActivation object that bridges
     * mql change events to onMediaQueryChange handlers
     * @return {?}
     */
    ngOnInit() {
        super.ngOnInit();
        this._listenForMediaQueryChanges('layout', 'row', (changes) => {
            this._updateWithDirection(changes.value);
        });
        this._updateWithDirection();
    }
    /**
     * Validate the direction value and then update the host's inline flexbox styles
     * @param {?=} value
     * @return {?}
     */
    _updateWithDirection(value) {
        value = value || this._queryInput('layout') || 'row';
        if (this._mqActivation) {
            value = this._mqActivation.activatedInput;
        }
        // Update styles and announce to subscribers the *new* direction
        let /** @type {?} */ css = buildLayoutCSS(!!value ? value : '');
        this._applyStyleToElement(css);
        this._announcer.next(css['flex-direction']);
    }
}
LayoutDirective.decorators = [
    { type: Directive, args: [{ selector: `
  [fxLayout],
  [fxLayout.xs], [fxLayout.sm], [fxLayout.md], [fxLayout.lg], [fxLayout.xl],
  [fxLayout.lt-sm], [fxLayout.lt-md], [fxLayout.lt-lg], [fxLayout.lt-xl],
  [fxLayout.gt-xs], [fxLayout.gt-sm], [fxLayout.gt-md], [fxLayout.gt-lg]
` },] },
];
/** @nocollapse */
LayoutDirective.ctorParameters = () => [
    { type: MediaMonitor, },
    { type: ElementRef, },
    { type: StyleUtils, },
];
LayoutDirective.propDecorators = {
    "layout": [{ type: Input, args: ['fxLayout',] },],
    "layoutXs": [{ type: Input, args: ['fxLayout.xs',] },],
    "layoutSm": [{ type: Input, args: ['fxLayout.sm',] },],
    "layoutMd": [{ type: Input, args: ['fxLayout.md',] },],
    "layoutLg": [{ type: Input, args: ['fxLayout.lg',] },],
    "layoutXl": [{ type: Input, args: ['fxLayout.xl',] },],
    "layoutGtXs": [{ type: Input, args: ['fxLayout.gt-xs',] },],
    "layoutGtSm": [{ type: Input, args: ['fxLayout.gt-sm',] },],
    "layoutGtMd": [{ type: Input, args: ['fxLayout.gt-md',] },],
    "layoutGtLg": [{ type: Input, args: ['fxLayout.gt-lg',] },],
    "layoutLtSm": [{ type: Input, args: ['fxLayout.lt-sm',] },],
    "layoutLtMd": [{ type: Input, args: ['fxLayout.lt-md',] },],
    "layoutLtLg": [{ type: Input, args: ['fxLayout.lt-lg',] },],
    "layoutLtXl": [{ type: Input, args: ['fxLayout.lt-xl',] },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * 'layout-align' flexbox styling directive
 *  Defines positioning of child elements along main and cross axis in a layout container
 *  Optional values: {main-axis} values or {main-axis cross-axis} value pairs
 *
 *  \@see https://css-tricks.com/almanac/properties/j/justify-content/
 *  \@see https://css-tricks.com/almanac/properties/a/align-items/
 *  \@see https://css-tricks.com/almanac/properties/a/align-content/
 */
class LayoutAlignDirective extends BaseFxDirective {
    /**
     * @param {?} monitor
     * @param {?} elRef
     * @param {?} container
     * @param {?} styleUtils
     */
    constructor(monitor, elRef, container, styleUtils) {
        super(monitor, elRef, styleUtils);
        this._layout = 'row';
        if (container) {
            // Subscribe to layout direction changes
            this._layoutWatcher = container.layout$.subscribe(this._onLayoutChange.bind(this));
        }
    }
    /**
     * @param {?} val
     * @return {?}
     */
    set align(val) { this._cacheInput('align', val); }
    /**
     * @param {?} val
     * @return {?}
     */
    set alignXs(val) { this._cacheInput('alignXs', val); }
    /**
     * @param {?} val
     * @return {?}
     */
    set alignSm(val) { this._cacheInput('alignSm', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set alignMd(val) { this._cacheInput('alignMd', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set alignLg(val) { this._cacheInput('alignLg', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set alignXl(val) { this._cacheInput('alignXl', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set alignGtXs(val) { this._cacheInput('alignGtXs', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set alignGtSm(val) { this._cacheInput('alignGtSm', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set alignGtMd(val) { this._cacheInput('alignGtMd', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set alignGtLg(val) { this._cacheInput('alignGtLg', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set alignLtSm(val) { this._cacheInput('alignLtSm', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set alignLtMd(val) { this._cacheInput('alignLtMd', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set alignLtLg(val) { this._cacheInput('alignLtLg', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set alignLtXl(val) { this._cacheInput('alignLtXl', val); }
    ;
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (changes['align'] != null || this._mqActivation) {
            this._updateWithValue();
        }
    }
    /**
     * After the initial onChanges, build an mqActivation object that bridges
     * mql change events to onMediaQueryChange handlers
     * @return {?}
     */
    ngOnInit() {
        super.ngOnInit();
        this._listenForMediaQueryChanges('align', 'start stretch', (changes) => {
            this._updateWithValue(changes.value);
        });
        this._updateWithValue();
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        super.ngOnDestroy();
        if (this._layoutWatcher) {
            this._layoutWatcher.unsubscribe();
        }
    }
    /**
     *
     * @param {?=} value
     * @return {?}
     */
    _updateWithValue(value) {
        value = value || this._queryInput('align') || 'start stretch';
        if (this._mqActivation) {
            value = this._mqActivation.activatedInput;
        }
        this._applyStyleToElement(this._buildCSS(value));
        this._allowStretching(value, !this._layout ? 'row' : this._layout);
    }
    /**
     * Cache the parent container 'flex-direction' and update the 'flex' styles
     * @param {?} direction
     * @return {?}
     */
    _onLayoutChange(direction) {
        this._layout = (direction || '').toLowerCase();
        if (!LAYOUT_VALUES.find(x => x === this._layout)) {
            this._layout = 'row';
        }
        let /** @type {?} */ value = this._queryInput('align') || 'start stretch';
        if (this._mqActivation) {
            value = this._mqActivation.activatedInput;
        }
        this._allowStretching(value, this._layout || 'row');
    }
    /**
     * @param {?} align
     * @return {?}
     */
    _buildCSS(align) {
        let /** @type {?} */ css = {}, [main_axis, cross_axis] = align.split(' '); // tslint:disable-line:variable-name
        // Main axis
        switch (main_axis) {
            case 'center':
                css['justify-content'] = 'center';
                break;
            case 'space-around':
                css['justify-content'] = 'space-around';
                break;
            case 'space-between':
                css['justify-content'] = 'space-between';
                break;
            case 'space-evenly':
                css['justify-content'] = 'space-evenly';
                break;
            case 'end':
            case 'flex-end':
                css['justify-content'] = 'flex-end';
                break;
            case 'start':
            case 'flex-start':
            default:
                css['justify-content'] = 'flex-start'; // default main axis
                break;
        }
        // Cross-axis
        switch (cross_axis) {
            case 'start':
            case 'flex-start':
                css['align-items'] = css['align-content'] = 'flex-start';
                break;
            case 'baseline':
                css['align-items'] = 'baseline';
                break;
            case 'center':
                css['align-items'] = css['align-content'] = 'center';
                break;
            case 'end':
            case 'flex-end':
                css['align-items'] = css['align-content'] = 'flex-end';
                break;
            case 'stretch':
            default:
                // 'stretch'
                css['align-items'] = css['align-content'] = 'stretch'; // default cross axis
                break;
        }
        return extendObject(css, {
            'display': 'flex',
            'flex-direction': this._layout || 'row',
            'box-sizing': 'border-box'
        });
    }
    /**
     * Update container element to 'stretch' as needed...
     * NOTE: this is only done if the crossAxis is explicitly set to 'stretch'
     * @param {?} align
     * @param {?} layout
     * @return {?}
     */
    _allowStretching(align, layout) {
        let [, cross_axis] = align.split(' '); // tslint:disable-line:variable-name
        if (cross_axis == 'stretch') {
            // Use `null` values to remove style
            this._applyStyleToElement({
                'box-sizing': 'border-box',
                'max-width': !isFlowHorizontal(layout) ? '100%' : null,
                'max-height': isFlowHorizontal(layout) ? '100%' : null
            });
        }
    }
}
LayoutAlignDirective.decorators = [
    { type: Directive, args: [{ selector: `
  [fxLayoutAlign],
  [fxLayoutAlign.xs], [fxLayoutAlign.sm], [fxLayoutAlign.md], [fxLayoutAlign.lg],[fxLayoutAlign.xl],
  [fxLayoutAlign.lt-sm], [fxLayoutAlign.lt-md], [fxLayoutAlign.lt-lg], [fxLayoutAlign.lt-xl],
  [fxLayoutAlign.gt-xs], [fxLayoutAlign.gt-sm], [fxLayoutAlign.gt-md], [fxLayoutAlign.gt-lg]
` },] },
];
/** @nocollapse */
LayoutAlignDirective.ctorParameters = () => [
    { type: MediaMonitor, },
    { type: ElementRef, },
    { type: LayoutDirective, decorators: [{ type: Optional }, { type: Self },] },
    { type: StyleUtils, },
];
LayoutAlignDirective.propDecorators = {
    "align": [{ type: Input, args: ['fxLayoutAlign',] },],
    "alignXs": [{ type: Input, args: ['fxLayoutAlign.xs',] },],
    "alignSm": [{ type: Input, args: ['fxLayoutAlign.sm',] },],
    "alignMd": [{ type: Input, args: ['fxLayoutAlign.md',] },],
    "alignLg": [{ type: Input, args: ['fxLayoutAlign.lg',] },],
    "alignXl": [{ type: Input, args: ['fxLayoutAlign.xl',] },],
    "alignGtXs": [{ type: Input, args: ['fxLayoutAlign.gt-xs',] },],
    "alignGtSm": [{ type: Input, args: ['fxLayoutAlign.gt-sm',] },],
    "alignGtMd": [{ type: Input, args: ['fxLayoutAlign.gt-md',] },],
    "alignGtLg": [{ type: Input, args: ['fxLayoutAlign.gt-lg',] },],
    "alignLtSm": [{ type: Input, args: ['fxLayoutAlign.lt-sm',] },],
    "alignLtMd": [{ type: Input, args: ['fxLayoutAlign.lt-md',] },],
    "alignLtLg": [{ type: Input, args: ['fxLayoutAlign.lt-lg',] },],
    "alignLtXl": [{ type: Input, args: ['fxLayoutAlign.lt-xl',] },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * Injection token used to inject the document into Directionality.
 * This is used so that the value can be faked in tests.
 *
 * We can't use the real document in tests because changing the real `dir` causes geometry-based
 * tests in Safari to fail.
 *
 * We also can't re-provide the DOCUMENT token from platform-brower because the unit tests
 * themselves use things like `querySelector` in test code.
 */
const DIR_DOCUMENT = new InjectionToken('cdk-dir-doc');
/**
 * The directionality (LTR / RTL) context for the application (or a subtree of it).
 * Exposes the current direction and a stream of direction changes.
 */
class Directionality {
    /**
     * @param {?=} _document
     */
    constructor(_document) {
        /**
         * The current 'ltr' or 'rtl' value.
         */
        this.value = 'ltr';
        /**
         * Stream that emits whenever the 'ltr' / 'rtl' state changes.
         */
        this.change = new EventEmitter();
        if (_document) {
            // TODO: handle 'auto' value -
            // We still need to account for dir="auto".
            // It looks like HTMLElemenet.dir is also "auto" when that's set to the attribute,
            // but getComputedStyle return either "ltr" or "rtl". avoiding getComputedStyle for now
            const /** @type {?} */ bodyDir = _document.body ? _document.body.dir : null;
            const /** @type {?} */ htmlDir = _document.documentElement ? _document.documentElement.dir : null;
            this.value = /** @type {?} */ ((bodyDir || htmlDir || 'ltr'));
        }
    }
}
Directionality.decorators = [
    { type: Injectable },
];
/** @nocollapse */
Directionality.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [DIR_DOCUMENT,] },] },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * 'layout-padding' styling directive
 *  Defines padding of child elements in a layout container
 */
class LayoutGapDirective extends BaseFxDirective {
    /**
     * @param {?} monitor
     * @param {?} elRef
     * @param {?} container
     * @param {?} _zone
     * @param {?} _directionality
     * @param {?} styleUtils
     */
    constructor(monitor, elRef, container, _zone, _directionality, styleUtils) {
        super(monitor, elRef, styleUtils);
        this._zone = _zone;
        this._directionality = _directionality;
        this._layout = 'row';
        if (container) {
            // Subscribe to layout direction changes
            this._layoutWatcher = container.layout$.subscribe(this._onLayoutChange.bind(this));
        }
        this._directionWatcher =
            this._directionality.change.subscribe(this._updateWithValue.bind(this));
    }
    /**
     * @param {?} val
     * @return {?}
     */
    set gap(val) { this._cacheInput('gap', val); }
    /**
     * @param {?} val
     * @return {?}
     */
    set gapXs(val) { this._cacheInput('gapXs', val); }
    /**
     * @param {?} val
     * @return {?}
     */
    set gapSm(val) { this._cacheInput('gapSm', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set gapMd(val) { this._cacheInput('gapMd', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set gapLg(val) { this._cacheInput('gapLg', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set gapXl(val) { this._cacheInput('gapXl', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set gapGtXs(val) { this._cacheInput('gapGtXs', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set gapGtSm(val) { this._cacheInput('gapGtSm', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set gapGtMd(val) { this._cacheInput('gapGtMd', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set gapGtLg(val) { this._cacheInput('gapGtLg', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set gapLtSm(val) { this._cacheInput('gapLtSm', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set gapLtMd(val) { this._cacheInput('gapLtMd', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set gapLtLg(val) { this._cacheInput('gapLtLg', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set gapLtXl(val) { this._cacheInput('gapLtXl', val); }
    ;
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (changes['gap'] != null || this._mqActivation) {
            this._updateWithValue();
        }
    }
    /**
     * After the initial onChanges, build an mqActivation object that bridges
     * mql change events to onMediaQueryChange handlers
     * @return {?}
     */
    ngAfterContentInit() {
        this._watchContentChanges();
        this._listenForMediaQueryChanges('gap', '0', (changes) => {
            this._updateWithValue(changes.value);
        });
        this._updateWithValue();
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        super.ngOnDestroy();
        if (this._layoutWatcher) {
            this._layoutWatcher.unsubscribe();
        }
        if (this._observer) {
            this._observer.disconnect();
        }
        if (this._directionWatcher) {
            this._directionWatcher.unsubscribe();
        }
    }
    /**
     * Watch for child nodes to be added... and apply the layout gap styles to each.
     * NOTE: this does NOT! differentiate between viewChildren and contentChildren
     * @return {?}
     */
    _watchContentChanges() {
        this._zone.runOutsideAngular(() => {
            if (typeof MutationObserver !== 'undefined') {
                this._observer = new MutationObserver((mutations) => {
                    const /** @type {?} */ validatedChanges = (it) => {
                        return (it.addedNodes && it.addedNodes.length > 0) ||
                            (it.removedNodes && it.removedNodes.length > 0);
                    };
                    // update gap styles only for child 'added' or 'removed' events
                    if (mutations.some(validatedChanges)) {
                        this._updateWithValue();
                    }
                });
                this._observer.observe(this.nativeElement, { childList: true });
            }
        });
    }
    /**
     * Cache the parent container 'flex-direction' and update the 'margin' styles
     * @param {?} direction
     * @return {?}
     */
    _onLayoutChange(direction) {
        this._layout = (direction || '').toLowerCase();
        if (!LAYOUT_VALUES.find(x => x === this._layout)) {
            this._layout = 'row';
        }
        this._updateWithValue();
    }
    /**
     *
     * @param {?=} value
     * @return {?}
     */
    _updateWithValue(value) {
        value = value || this._queryInput('gap') || '0';
        if (this._mqActivation) {
            value = this._mqActivation.activatedInput;
        }
        // Gather all non-hidden Element nodes
        const /** @type {?} */ items = this.childrenNodes
            .filter(el => el.nodeType === 1 && this._getDisplayStyle(el) != 'none')
            .sort((a, b) => {
            const /** @type {?} */ orderA = +this._styler.lookupStyle(a, 'order');
            const /** @type {?} */ orderB = +this._styler.lookupStyle(b, 'order');
            if (isNaN(orderA) || isNaN(orderB) || orderA === orderB) {
                return 0;
            }
            else {
                return orderA > orderB ? 1 : -1;
            }
        });
        if (items.length > 0) {
            const /** @type {?} */ lastItem = items.pop();
            // For each `element` children EXCEPT the last,
            // set the margin right/bottom styles...
            this._applyStyleToElements(this._buildCSS(value), items);
            // Clear all gaps for all visible elements
            this._applyStyleToElements(this._buildCSS(), [lastItem]);
        }
    }
    /**
     * Prepare margin CSS, remove any previous explicitly
     * assigned margin assignments
     * @param {?=} value
     * @return {?}
     */
    _buildCSS(value = null) {
        let /** @type {?} */ key, /** @type {?} */ margins = {
            'margin-left': null,
            'margin-right': null,
            'margin-top': null,
            'margin-bottom': null
        };
        switch (this._layout) {
            case 'column':
            case 'column-reverse':
                key = 'margin-bottom';
                break;
            case 'row':
            case 'row-reverse':
            default:
                key = this._directionality.value === 'rtl' ? 'margin-left' : 'margin-right';
                break;
        }
        margins[key] = value;
        return margins;
    }
}
LayoutGapDirective.decorators = [
    { type: Directive, args: [{
                selector: `
  [fxLayoutGap],
  [fxLayoutGap.xs], [fxLayoutGap.sm], [fxLayoutGap.md], [fxLayoutGap.lg], [fxLayoutGap.xl],
  [fxLayoutGap.lt-sm], [fxLayoutGap.lt-md], [fxLayoutGap.lt-lg], [fxLayoutGap.lt-xl],
  [fxLayoutGap.gt-xs], [fxLayoutGap.gt-sm], [fxLayoutGap.gt-md], [fxLayoutGap.gt-lg]
`
            },] },
];
/** @nocollapse */
LayoutGapDirective.ctorParameters = () => [
    { type: MediaMonitor, },
    { type: ElementRef, },
    { type: LayoutDirective, decorators: [{ type: Optional }, { type: Self },] },
    { type: NgZone, },
    { type: Directionality, },
    { type: StyleUtils, },
];
LayoutGapDirective.propDecorators = {
    "gap": [{ type: Input, args: ['fxLayoutGap',] },],
    "gapXs": [{ type: Input, args: ['fxLayoutGap.xs',] },],
    "gapSm": [{ type: Input, args: ['fxLayoutGap.sm',] },],
    "gapMd": [{ type: Input, args: ['fxLayoutGap.md',] },],
    "gapLg": [{ type: Input, args: ['fxLayoutGap.lg',] },],
    "gapXl": [{ type: Input, args: ['fxLayoutGap.xl',] },],
    "gapGtXs": [{ type: Input, args: ['fxLayoutGap.gt-xs',] },],
    "gapGtSm": [{ type: Input, args: ['fxLayoutGap.gt-sm',] },],
    "gapGtMd": [{ type: Input, args: ['fxLayoutGap.gt-md',] },],
    "gapGtLg": [{ type: Input, args: ['fxLayoutGap.gt-lg',] },],
    "gapLtSm": [{ type: Input, args: ['fxLayoutGap.lt-sm',] },],
    "gapLtMd": [{ type: Input, args: ['fxLayoutGap.lt-md',] },],
    "gapLtLg": [{ type: Input, args: ['fxLayoutGap.lt-lg',] },],
    "gapLtXl": [{ type: Input, args: ['fxLayoutGap.lt-xl',] },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * The flex API permits 3 or 1 parts of the value:
 *    - `flex-grow flex-shrink flex-basis`, or
 *    - `flex-basis`
 * @param {?} basis
 * @param {?=} grow
 * @param {?=} shrink
 * @return {?}
 */
function validateBasis(basis, grow = '1', shrink = '1') {
    let /** @type {?} */ parts = [grow, shrink, basis];
    let /** @type {?} */ j = basis.indexOf('calc');
    if (j > 0) {
        parts[2] = _validateCalcValue(basis.substring(j).trim());
        let /** @type {?} */ matches = basis.substr(0, j).trim().split(' ');
        if (matches.length == 2) {
            parts[0] = matches[0];
            parts[1] = matches[1];
        }
    }
    else if (j == 0) {
        parts[2] = _validateCalcValue(basis.trim());
    }
    else {
        let /** @type {?} */ matches = basis.split(' ');
        parts = (matches.length === 3) ? matches : [
            grow, shrink, basis
        ];
    }
    return parts;
}
/**
 * Calc expressions require whitespace before & after any expression operators
 * This is a simple, crude whitespace padding solution.
 *   - '3 3 calc(15em + 20px)'
 *   - calc(100% / 7 * 2)
 *   - 'calc(15em + 20px)'
 *   - 'calc(15em+20px)'
 *   - '37px'
 *   = '43%'
 * @param {?} calc
 * @return {?}
 */
function _validateCalcValue(calc) {
    return calc.replace(/[\s]/g, '').replace(/[\/\*\+\-]/g, ' $& ');
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Directive to control the size of a flex item using flex-basis, flex-grow, and flex-shrink.
 * Corresponds to the css `flex` shorthand property.
 *
 * @see https://css-tricks.com/snippets/css/a-guide-to-flexbox/
 */
class FlexDirective extends BaseFxDirective {
    /**
     * @param {?} monitor
     * @param {?} elRef
     * @param {?} _container
     * @param {?} styleUtils
     */
    constructor(monitor, elRef, _container, styleUtils) {
        super(monitor, elRef, styleUtils);
        this._container = _container;
        this.styleUtils = styleUtils;
        this._cacheInput('flex', '');
        this._cacheInput('shrink', 1);
        this._cacheInput('grow', 1);
        if (_container) {
            // If this flex item is inside of a flex container marked with
            // Subscribe to layout immediate parent direction changes
            this._layoutWatcher = _container.layout$.subscribe((direction) => {
                // `direction` === null if parent container does not have a `fxLayout`
                this._onLayoutChange(direction);
            });
        }
    }
    /**
     * @param {?} val
     * @return {?}
     */
    set shrink(val) { this._cacheInput('shrink', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set grow(val) { this._cacheInput('grow', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set flex(val) { this._cacheInput('flex', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set flexXs(val) { this._cacheInput('flexXs', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set flexSm(val) { this._cacheInput('flexSm', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set flexMd(val) { this._cacheInput('flexMd', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set flexLg(val) { this._cacheInput('flexLg', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set flexXl(val) { this._cacheInput('flexXl', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set flexGtXs(val) { this._cacheInput('flexGtXs', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set flexGtSm(val) { this._cacheInput('flexGtSm', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set flexGtMd(val) { this._cacheInput('flexGtMd', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set flexGtLg(val) { this._cacheInput('flexGtLg', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set flexLtSm(val) { this._cacheInput('flexLtSm', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set flexLtMd(val) { this._cacheInput('flexLtMd', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set flexLtLg(val) { this._cacheInput('flexLtLg', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set flexLtXl(val) { this._cacheInput('flexLtXl', val); }
    ;
    /**
     * For \@Input changes on the current mq activation property, see onMediaQueryChanges()
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (changes['flex'] != null || this._mqActivation) {
            this._updateStyle();
        }
    }
    /**
     * After the initial onChanges, build an mqActivation object that bridges
     * mql change events to onMediaQueryChange handlers
     * @return {?}
     */
    ngOnInit() {
        super.ngOnInit();
        this._listenForMediaQueryChanges('flex', '', (changes) => {
            this._updateStyle(changes.value);
        });
        this._updateStyle();
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        super.ngOnDestroy();
        if (this._layoutWatcher) {
            this._layoutWatcher.unsubscribe();
        }
    }
    /**
     * Caches the parent container's 'flex-direction' and updates the element's style.
     * Used as a handler for layout change events from the parent flex container.
     * @param {?=} direction
     * @return {?}
     */
    _onLayoutChange(direction) {
        this._layout = direction || this._layout || 'row';
        this._updateStyle();
    }
    /**
     * @param {?=} value
     * @return {?}
     */
    _updateStyle(value) {
        let /** @type {?} */ flexBasis = value || this._queryInput('flex') || '';
        if (this._mqActivation) {
            flexBasis = this._mqActivation.activatedInput;
        }
        let /** @type {?} */ basis = String(flexBasis).replace(';', '');
        let /** @type {?} */ parts = validateBasis(basis, this._queryInput('grow'), this._queryInput('shrink'));
        this._applyStyleToElement(this._validateValue.apply(this, parts));
    }
    /**
     * Validate the value to be one of the acceptable value options
     * Use default fallback of 'row'
     * @param {?} grow
     * @param {?} shrink
     * @param {?} basis
     * @return {?}
     */
    _validateValue(grow, shrink, basis) {
        // The flex-direction of this element's flex container. Defaults to 'row'.
        let /** @type {?} */ layout = this._getFlowDirection(this.parentElement, true);
        let /** @type {?} */ direction = (layout.indexOf('column') > -1) ? 'column' : 'row';
        let /** @type {?} */ css, /** @type {?} */ isValue;
        grow = (grow == '0') ? 0 : grow;
        shrink = (shrink == '0') ? 0 : shrink;
        // flex-basis allows you to specify the initial/starting main-axis size of the element,
        // before anything else is computed. It can either be a percentage or an absolute value.
        // It is, however, not the breaking point for flex-grow/shrink properties
        //
        // flex-grow can be seen as this:
        //   0: Do not stretch. Either size to element's content width, or obey 'flex-basis'.
        //   1: (Default value). Stretch; will be the same size to all other flex items on
        //       the same row since they have a default value of 1.
        //   ≥2 (integer n): Stretch. Will be n times the size of other elements
        //      with 'flex-grow: 1' on the same row.
        // Use `null` to clear existing styles.
        let /** @type {?} */ clearStyles = {
            'max-width': null,
            'max-height': null,
            'min-width': null,
            'min-height': null
        };
        switch (basis || '') {
            case '':
                css = extendObject(clearStyles, { 'flex': `${grow} ${shrink} 0.000000001px` });
                break;
            case 'initial': // default
            case 'nogrow':
                grow = 0;
                css = extendObject(clearStyles, { 'flex': '0 1 auto' });
                break;
            case 'grow':
                css = extendObject(clearStyles, { 'flex': '1 1 100%' });
                break;
            case 'noshrink':
                shrink = 0;
                css = extendObject(clearStyles, { 'flex': '1 0 auto' });
                break;
            case 'auto':
                css = extendObject(clearStyles, { 'flex': `${grow} ${shrink} auto` });
                break;
            case 'none':
                grow = 0;
                shrink = 0;
                css = extendObject(clearStyles, { 'flex': '0 0 auto' });
                break;
            default:
                let /** @type {?} */ hasCalc = String(basis).indexOf('calc') > -1;
                let /** @type {?} */ isPercent = String(basis).indexOf('%') > -1 && !hasCalc;
                isValue = hasCalc ||
                    String(basis).indexOf('px') > -1 ||
                    String(basis).indexOf('em') > -1 ||
                    String(basis).indexOf('vw') > -1 ||
                    String(basis).indexOf('vh') > -1;
                // Defaults to percentage sizing unless `px` is explicitly set
                if (!isValue && !isPercent && !isNaN(/** @type {?} */ (basis))) {
                    basis = basis + '%';
                }
                if (basis === '0px') {
                    basis = '0%';
                }
                css = extendObject(clearStyles, {
                    // fix issue #5345
                    'flex': `${grow} ${shrink} ${isValue ? basis : '100%'}`
                });
                break;
        }
        let /** @type {?} */ max = isFlowHorizontal(direction) ? 'max-width' : 'max-height';
        let /** @type {?} */ min = isFlowHorizontal(direction) ? 'min-width' : 'min-height';
        let /** @type {?} */ usingCalc = (String(basis).indexOf('calc') > -1) || (basis == 'auto');
        let /** @type {?} */ isPx = String(basis).indexOf('px') > -1 || usingCalc;
        // make box inflexible when shrink and grow are both zero
        // should not set a min when the grow is zero
        // should not set a max when the shrink is zero
        let /** @type {?} */ isFixed = !grow && !shrink;
        css[min] = (basis == '0%') ? 0 : isFixed || (isPx && grow) ? basis : null;
        css[max] = (basis == '0%') ? 0 : isFixed || (!usingCalc && shrink) ? basis : null;
        return extendObject(css, { 'box-sizing': 'border-box' });
    }
}
FlexDirective.decorators = [
    { type: Directive, args: [{ selector: `
  [fxFlex],
  [fxFlex.xs], [fxFlex.sm], [fxFlex.md], [fxFlex.lg], [fxFlex.xl],
  [fxFlex.lt-sm], [fxFlex.lt-md], [fxFlex.lt-lg], [fxFlex.lt-xl],
  [fxFlex.gt-xs], [fxFlex.gt-sm], [fxFlex.gt-md], [fxFlex.gt-lg],
`
            },] },
];
/** @nocollapse */
FlexDirective.ctorParameters = () => [
    { type: MediaMonitor, },
    { type: ElementRef, },
    { type: LayoutDirective, decorators: [{ type: Optional }, { type: SkipSelf },] },
    { type: StyleUtils, },
];
FlexDirective.propDecorators = {
    "shrink": [{ type: Input, args: ['fxShrink',] },],
    "grow": [{ type: Input, args: ['fxGrow',] },],
    "flex": [{ type: Input, args: ['fxFlex',] },],
    "flexXs": [{ type: Input, args: ['fxFlex.xs',] },],
    "flexSm": [{ type: Input, args: ['fxFlex.sm',] },],
    "flexMd": [{ type: Input, args: ['fxFlex.md',] },],
    "flexLg": [{ type: Input, args: ['fxFlex.lg',] },],
    "flexXl": [{ type: Input, args: ['fxFlex.xl',] },],
    "flexGtXs": [{ type: Input, args: ['fxFlex.gt-xs',] },],
    "flexGtSm": [{ type: Input, args: ['fxFlex.gt-sm',] },],
    "flexGtMd": [{ type: Input, args: ['fxFlex.gt-md',] },],
    "flexGtLg": [{ type: Input, args: ['fxFlex.gt-lg',] },],
    "flexLtSm": [{ type: Input, args: ['fxFlex.lt-sm',] },],
    "flexLtMd": [{ type: Input, args: ['fxFlex.lt-md',] },],
    "flexLtLg": [{ type: Input, args: ['fxFlex.lt-lg',] },],
    "flexLtXl": [{ type: Input, args: ['fxFlex.lt-xl',] },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * 'flex-align' flexbox styling directive
 * Allows element-specific overrides for cross-axis alignments in a layout container
 * @see https://css-tricks.com/almanac/properties/a/align-self/
 */
class FlexAlignDirective extends BaseFxDirective {
    /**
     * @param {?} monitor
     * @param {?} elRef
     * @param {?} styleUtils
     */
    constructor(monitor, elRef, styleUtils) {
        super(monitor, elRef, styleUtils);
    }
    /**
     * @param {?} val
     * @return {?}
     */
    set align(val) { this._cacheInput('align', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set alignXs(val) { this._cacheInput('alignXs', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set alignSm(val) { this._cacheInput('alignSm', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set alignMd(val) { this._cacheInput('alignMd', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set alignLg(val) { this._cacheInput('alignLg', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set alignXl(val) { this._cacheInput('alignXl', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set alignLtSm(val) { this._cacheInput('alignLtSm', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set alignLtMd(val) { this._cacheInput('alignLtMd', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set alignLtLg(val) { this._cacheInput('alignLtLg', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set alignLtXl(val) { this._cacheInput('alignLtXl', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set alignGtXs(val) { this._cacheInput('alignGtXs', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set alignGtSm(val) { this._cacheInput('alignGtSm', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set alignGtMd(val) { this._cacheInput('alignGtMd', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set alignGtLg(val) { this._cacheInput('alignGtLg', val); }
    ;
    /**
     * For \@Input changes on the current mq activation property, see onMediaQueryChanges()
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (changes['align'] != null || this._mqActivation) {
            this._updateWithValue();
        }
    }
    /**
     * After the initial onChanges, build an mqActivation object that bridges
     * mql change events to onMediaQueryChange handlers
     * @return {?}
     */
    ngOnInit() {
        super.ngOnInit();
        this._listenForMediaQueryChanges('align', 'stretch', (changes) => {
            this._updateWithValue(changes.value);
        });
        this._updateWithValue();
    }
    /**
     * @param {?=} value
     * @return {?}
     */
    _updateWithValue(value) {
        value = value || this._queryInput('align') || 'stretch';
        if (this._mqActivation) {
            value = this._mqActivation.activatedInput;
        }
        this._applyStyleToElement(this._buildCSS(value));
    }
    /**
     * @param {?} align
     * @return {?}
     */
    _buildCSS(align) {
        let /** @type {?} */ css = {};
        // Cross-axis
        switch (align) {
            case 'start':
                css['align-self'] = 'flex-start';
                break;
            case 'end':
                css['align-self'] = 'flex-end';
                break;
            default:
                css['align-self'] = align;
                break;
        }
        return css;
    }
}
FlexAlignDirective.decorators = [
    { type: Directive, args: [{
                selector: `
  [fxFlexAlign],
  [fxFlexAlign.xs], [fxFlexAlign.sm], [fxFlexAlign.md], [fxFlexAlign.lg], [fxFlexAlign.xl],
  [fxFlexAlign.lt-sm], [fxFlexAlign.lt-md], [fxFlexAlign.lt-lg], [fxFlexAlign.lt-xl],
  [fxFlexAlign.gt-xs], [fxFlexAlign.gt-sm], [fxFlexAlign.gt-md], [fxFlexAlign.gt-lg]
`
            },] },
];
/** @nocollapse */
FlexAlignDirective.ctorParameters = () => [
    { type: MediaMonitor, },
    { type: ElementRef, },
    { type: StyleUtils, },
];
FlexAlignDirective.propDecorators = {
    "align": [{ type: Input, args: ['fxFlexAlign',] },],
    "alignXs": [{ type: Input, args: ['fxFlexAlign.xs',] },],
    "alignSm": [{ type: Input, args: ['fxFlexAlign.sm',] },],
    "alignMd": [{ type: Input, args: ['fxFlexAlign.md',] },],
    "alignLg": [{ type: Input, args: ['fxFlexAlign.lg',] },],
    "alignXl": [{ type: Input, args: ['fxFlexAlign.xl',] },],
    "alignLtSm": [{ type: Input, args: ['fxFlexAlign.lt-sm',] },],
    "alignLtMd": [{ type: Input, args: ['fxFlexAlign.lt-md',] },],
    "alignLtLg": [{ type: Input, args: ['fxFlexAlign.lt-lg',] },],
    "alignLtXl": [{ type: Input, args: ['fxFlexAlign.lt-xl',] },],
    "alignGtXs": [{ type: Input, args: ['fxFlexAlign.gt-xs',] },],
    "alignGtSm": [{ type: Input, args: ['fxFlexAlign.gt-sm',] },],
    "alignGtMd": [{ type: Input, args: ['fxFlexAlign.gt-md',] },],
    "alignGtLg": [{ type: Input, args: ['fxFlexAlign.gt-lg',] },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
const FLEX_FILL_CSS = {
    'margin': 0,
    'width': '100%',
    'height': '100%',
    'min-width': '100%',
    'min-height': '100%'
};
/**
 * 'fxFill' flexbox styling directive
 *  Maximizes width and height of element in a layout container
 *
 *  NOTE: fxFill is NOT responsive API!!
 */
class FlexFillDirective extends BaseFxDirective {
    /**
     * @param {?} monitor
     * @param {?} elRef
     * @param {?} styleUtils
     */
    constructor(monitor, elRef, styleUtils) {
        super(monitor, elRef, styleUtils);
        this.elRef = elRef;
        this._applyStyleToElement(FLEX_FILL_CSS);
    }
}
FlexFillDirective.decorators = [
    { type: Directive, args: [{ selector: `
  [fxFill],
  [fxFlexFill]
` },] },
];
/** @nocollapse */
FlexFillDirective.ctorParameters = () => [
    { type: MediaMonitor, },
    { type: ElementRef, },
    { type: StyleUtils, },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * 'flex-offset' flexbox styling directive
 * Configures the 'margin-left' of the element in a layout container
 */
class FlexOffsetDirective extends BaseFxDirective {
    /**
     * @param {?} monitor
     * @param {?} elRef
     * @param {?} _container
     * @param {?} _directionality
     * @param {?} styleUtils
     */
    constructor(monitor, elRef, _container, _directionality, styleUtils) {
        super(monitor, elRef, styleUtils);
        this._container = _container;
        this._directionality = _directionality;
        /**
         * The flex-direction of this element's host container. Defaults to 'row'.
         */
        this._layout = 'row';
        this._directionWatcher =
            this._directionality.change.subscribe(this._updateWithValue.bind(this));
        this.watchParentFlow();
    }
    /**
     * @param {?} val
     * @return {?}
     */
    set offset(val) { this._cacheInput('offset', val); }
    /**
     * @param {?} val
     * @return {?}
     */
    set offsetXs(val) { this._cacheInput('offsetXs', val); }
    /**
     * @param {?} val
     * @return {?}
     */
    set offsetSm(val) { this._cacheInput('offsetSm', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set offsetMd(val) { this._cacheInput('offsetMd', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set offsetLg(val) { this._cacheInput('offsetLg', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set offsetXl(val) { this._cacheInput('offsetXl', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set offsetLtSm(val) { this._cacheInput('offsetLtSm', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set offsetLtMd(val) { this._cacheInput('offsetLtMd', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set offsetLtLg(val) { this._cacheInput('offsetLtLg', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set offsetLtXl(val) { this._cacheInput('offsetLtXl', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set offsetGtXs(val) { this._cacheInput('offsetGtXs', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set offsetGtSm(val) { this._cacheInput('offsetGtSm', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set offsetGtMd(val) { this._cacheInput('offsetGtMd', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set offsetGtLg(val) { this._cacheInput('offsetGtLg', val); }
    ;
    /**
     * For \@Input changes on the current mq activation property, see onMediaQueryChanges()
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (changes['offset'] != null || this._mqActivation) {
            this._updateWithValue();
        }
    }
    /**
     * Cleanup
     * @return {?}
     */
    ngOnDestroy() {
        super.ngOnDestroy();
        if (this._layoutWatcher) {
            this._layoutWatcher.unsubscribe();
        }
        if (this._directionWatcher) {
            this._directionWatcher.unsubscribe();
        }
    }
    /**
     * After the initial onChanges, build an mqActivation object that bridges
     * mql change events to onMediaQueryChange handlers
     * @return {?}
     */
    ngOnInit() {
        super.ngOnInit();
        this._listenForMediaQueryChanges('offset', 0, (changes) => {
            this._updateWithValue(changes.value);
        });
    }
    /**
     * If parent flow-direction changes, then update the margin property
     * used to offset
     * @return {?}
     */
    watchParentFlow() {
        if (this._container) {
            // Subscribe to layout immediate parent direction changes (if any)
            this._layoutWatcher = this._container.layout$.subscribe((direction) => {
                // `direction` === null if parent container does not have a `fxLayout`
                this._onLayoutChange(direction);
            });
        }
    }
    /**
     * Caches the parent container's 'flex-direction' and updates the element's style.
     * Used as a handler for layout change events from the parent flex container.
     * @param {?=} direction
     * @return {?}
     */
    _onLayoutChange(direction) {
        this._layout = direction || this._layout || 'row';
        this._updateWithValue();
    }
    /**
     * Using the current fxFlexOffset value, update the inline CSS
     * NOTE: this will assign `margin-left` if the parent flex-direction == 'row',
     *       otherwise `margin-top` is used for the offset.
     * @param {?=} value
     * @return {?}
     */
    _updateWithValue(value) {
        value = value || this._queryInput('offset') || 0;
        if (this._mqActivation) {
            value = this._mqActivation.activatedInput;
        }
        this._applyStyleToElement(this._buildCSS(value));
    }
    /**
     * @param {?} offset
     * @return {?}
     */
    _buildCSS(offset) {
        let /** @type {?} */ isPercent = String(offset).indexOf('%') > -1;
        let /** @type {?} */ isPx = String(offset).indexOf('px') > -1;
        if (!isPx && !isPercent && !isNaN(offset)) {
            offset = offset + '%';
        }
        const /** @type {?} */ horizontalLayoutKey = this._directionality.value === 'rtl' ? 'margin-right' : 'margin-left';
        // The flex-direction of this element's flex container. Defaults to 'row'.
        let /** @type {?} */ layout = this._getFlowDirection(this.parentElement, true);
        return isFlowHorizontal(layout) ? { [horizontalLayoutKey]: `${offset}` } :
            { 'margin-top': `${offset}` };
    }
}
FlexOffsetDirective.decorators = [
    { type: Directive, args: [{ selector: `
  [fxFlexOffset],
  [fxFlexOffset.xs], [fxFlexOffset.sm], [fxFlexOffset.md], [fxFlexOffset.lg], [fxFlexOffset.xl],
  [fxFlexOffset.lt-sm], [fxFlexOffset.lt-md], [fxFlexOffset.lt-lg], [fxFlexOffset.lt-xl],
  [fxFlexOffset.gt-xs], [fxFlexOffset.gt-sm], [fxFlexOffset.gt-md], [fxFlexOffset.gt-lg]
` },] },
];
/** @nocollapse */
FlexOffsetDirective.ctorParameters = () => [
    { type: MediaMonitor, },
    { type: ElementRef, },
    { type: LayoutDirective, decorators: [{ type: Optional }, { type: SkipSelf },] },
    { type: Directionality, },
    { type: StyleUtils, },
];
FlexOffsetDirective.propDecorators = {
    "offset": [{ type: Input, args: ['fxFlexOffset',] },],
    "offsetXs": [{ type: Input, args: ['fxFlexOffset.xs',] },],
    "offsetSm": [{ type: Input, args: ['fxFlexOffset.sm',] },],
    "offsetMd": [{ type: Input, args: ['fxFlexOffset.md',] },],
    "offsetLg": [{ type: Input, args: ['fxFlexOffset.lg',] },],
    "offsetXl": [{ type: Input, args: ['fxFlexOffset.xl',] },],
    "offsetLtSm": [{ type: Input, args: ['fxFlexOffset.lt-sm',] },],
    "offsetLtMd": [{ type: Input, args: ['fxFlexOffset.lt-md',] },],
    "offsetLtLg": [{ type: Input, args: ['fxFlexOffset.lt-lg',] },],
    "offsetLtXl": [{ type: Input, args: ['fxFlexOffset.lt-xl',] },],
    "offsetGtXs": [{ type: Input, args: ['fxFlexOffset.gt-xs',] },],
    "offsetGtSm": [{ type: Input, args: ['fxFlexOffset.gt-sm',] },],
    "offsetGtMd": [{ type: Input, args: ['fxFlexOffset.gt-md',] },],
    "offsetGtLg": [{ type: Input, args: ['fxFlexOffset.gt-lg',] },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * 'flex-order' flexbox styling directive
 * Configures the positional ordering of the element in a sorted layout container
 * @see https://css-tricks.com/almanac/properties/o/order/
 */
class FlexOrderDirective extends BaseFxDirective {
    /**
     * @param {?} monitor
     * @param {?} elRef
     * @param {?} styleUtils
     */
    constructor(monitor, elRef, styleUtils) {
        super(monitor, elRef, styleUtils);
    }
    /**
     * @param {?} val
     * @return {?}
     */
    set order(val) { this._cacheInput('order', val); }
    /**
     * @param {?} val
     * @return {?}
     */
    set orderXs(val) { this._cacheInput('orderXs', val); }
    /**
     * @param {?} val
     * @return {?}
     */
    set orderSm(val) { this._cacheInput('orderSm', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set orderMd(val) { this._cacheInput('orderMd', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set orderLg(val) { this._cacheInput('orderLg', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set orderXl(val) { this._cacheInput('orderXl', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set orderGtXs(val) { this._cacheInput('orderGtXs', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set orderGtSm(val) { this._cacheInput('orderGtSm', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set orderGtMd(val) { this._cacheInput('orderGtMd', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set orderGtLg(val) { this._cacheInput('orderGtLg', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set orderLtSm(val) { this._cacheInput('orderLtSm', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set orderLtMd(val) { this._cacheInput('orderLtMd', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set orderLtLg(val) { this._cacheInput('orderLtLg', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set orderLtXl(val) { this._cacheInput('orderLtXl', val); }
    ;
    /**
     * For \@Input changes on the current mq activation property, see onMediaQueryChanges()
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (changes['order'] != null || this._mqActivation) {
            this._updateWithValue();
        }
    }
    /**
     * After the initial onChanges, build an mqActivation object that bridges
     * mql change events to onMediaQueryChange handlers
     * @return {?}
     */
    ngOnInit() {
        super.ngOnInit();
        this._listenForMediaQueryChanges('order', '0', (changes) => {
            this._updateWithValue(changes.value);
        });
        this._updateWithValue();
    }
    /**
     * @param {?=} value
     * @return {?}
     */
    _updateWithValue(value) {
        value = value || this._queryInput('order') || '0';
        if (this._mqActivation) {
            value = this._mqActivation.activatedInput;
        }
        this._applyStyleToElement(this._buildCSS(value));
    }
    /**
     * @param {?} value
     * @return {?}
     */
    _buildCSS(value) {
        value = parseInt(value, 10);
        return { order: isNaN(value) ? 0 : value };
    }
}
FlexOrderDirective.decorators = [
    { type: Directive, args: [{ selector: `
  [fxFlexOrder],
  [fxFlexOrder.xs], [fxFlexOrder.sm], [fxFlexOrder.md], [fxFlexOrder.lg], [fxFlexOrder.xl],
  [fxFlexOrder.lt-sm], [fxFlexOrder.lt-md], [fxFlexOrder.lt-lg], [fxFlexOrder.lt-xl],
  [fxFlexOrder.gt-xs], [fxFlexOrder.gt-sm], [fxFlexOrder.gt-md], [fxFlexOrder.gt-lg]
` },] },
];
/** @nocollapse */
FlexOrderDirective.ctorParameters = () => [
    { type: MediaMonitor, },
    { type: ElementRef, },
    { type: StyleUtils, },
];
FlexOrderDirective.propDecorators = {
    "order": [{ type: Input, args: ['fxFlexOrder',] },],
    "orderXs": [{ type: Input, args: ['fxFlexOrder.xs',] },],
    "orderSm": [{ type: Input, args: ['fxFlexOrder.sm',] },],
    "orderMd": [{ type: Input, args: ['fxFlexOrder.md',] },],
    "orderLg": [{ type: Input, args: ['fxFlexOrder.lg',] },],
    "orderXl": [{ type: Input, args: ['fxFlexOrder.xl',] },],
    "orderGtXs": [{ type: Input, args: ['fxFlexOrder.gt-xs',] },],
    "orderGtSm": [{ type: Input, args: ['fxFlexOrder.gt-sm',] },],
    "orderGtMd": [{ type: Input, args: ['fxFlexOrder.gt-md',] },],
    "orderGtLg": [{ type: Input, args: ['fxFlexOrder.gt-lg',] },],
    "orderLtSm": [{ type: Input, args: ['fxFlexOrder.lt-sm',] },],
    "orderLtMd": [{ type: Input, args: ['fxFlexOrder.lt-md',] },],
    "orderLtLg": [{ type: Input, args: ['fxFlexOrder.lt-lg',] },],
    "orderLtXl": [{ type: Input, args: ['fxFlexOrder.lt-xl',] },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Adapts the 'deprecated' Angular Renderer v1 API to use the new Renderer2 instance
 * This is required for older versions of NgStyle and NgClass that require
 * the v1 API (but should use the v2 instances)
 */
class RendererAdapter {
    /**
     * @param {?} _renderer
     */
    constructor(_renderer) {
        this._renderer = _renderer;
    }
    /**
     * @param {?} el
     * @param {?} className
     * @param {?} isAdd
     * @return {?}
     */
    setElementClass(el, className, isAdd) {
        if (isAdd) {
            this._renderer.addClass(el, className);
        }
        else {
            this._renderer.removeClass(el, className);
        }
    }
    /**
     * @param {?} el
     * @param {?} styleName
     * @param {?} styleValue
     * @return {?}
     */
    setElementStyle(el, styleName, styleValue) {
        if (styleValue) {
            this._renderer.setStyle(el, styleName, styleValue);
        }
        else {
            this._renderer.removeStyle(el, styleName);
        }
    }
    /**
     * @param {?} el
     * @param {?} name
     * @return {?}
     */
    addClass(el, name) {
        this._renderer.addClass(el, name);
    }
    /**
     * @param {?} el
     * @param {?} name
     * @return {?}
     */
    removeClass(el, name) {
        this._renderer.removeClass(el, name);
    }
    /**
     * @param {?} el
     * @param {?} style
     * @param {?} value
     * @param {?=} flags
     * @return {?}
     */
    setStyle(el, style, value, flags) {
        this._renderer.setStyle(el, style, value, flags);
    }
    /**
     * @param {?} el
     * @param {?} style
     * @param {?=} flags
     * @return {?}
     */
    removeStyle(el, style, flags) {
        this._renderer.removeStyle(el, style, flags);
    }
    /**
     * @return {?}
     */
    animate() { throw _notImplemented('animate'); }
    /**
     * @return {?}
     */
    attachViewAfter() { throw _notImplemented('attachViewAfter'); }
    /**
     * @return {?}
     */
    detachView() { throw _notImplemented('detachView'); }
    /**
     * @return {?}
     */
    destroyView() { throw _notImplemented('destroyView'); }
    /**
     * @return {?}
     */
    createElement() { throw _notImplemented('createElement'); }
    /**
     * @return {?}
     */
    createViewRoot() { throw _notImplemented('createViewRoot'); }
    /**
     * @return {?}
     */
    createTemplateAnchor() { throw _notImplemented('createTemplateAnchor'); }
    /**
     * @return {?}
     */
    createText() { throw _notImplemented('createText'); }
    /**
     * @return {?}
     */
    invokeElementMethod() { throw _notImplemented('invokeElementMethod'); }
    /**
     * @return {?}
     */
    projectNodes() { throw _notImplemented('projectNodes'); }
    /**
     * @return {?}
     */
    selectRootElement() { throw _notImplemented('selectRootElement'); }
    /**
     * @return {?}
     */
    setBindingDebugInfo() { throw _notImplemented('setBindingDebugInfo'); }
    /**
     * @return {?}
     */
    setElementProperty() { throw _notImplemented('setElementProperty'); }
    /**
     * @return {?}
     */
    setElementAttribute() { throw _notImplemented('setElementAttribute'); }
    /**
     * @return {?}
     */
    setText() { throw _notImplemented('setText'); }
    /**
     * @return {?}
     */
    listen() { throw _notImplemented('listen'); }
    /**
     * @return {?}
     */
    listenGlobal() { throw _notImplemented('listenGlobal'); }
}
/**
 * @param {?} methodName
 * @return {?}
 */
function _notImplemented(methodName) {
    return new Error(`The method RendererAdapter::${methodName}() has not been implemented`);
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Directive to add responsive support for ngClass.
 * This maintains the core functionality of 'ngClass' and adds responsive API
 * Note: this class is a no-op when rendered on the server
 */
class ClassDirective extends BaseFxDirective {
    /**
     * @param {?} monitor
     * @param {?} _iterableDiffers
     * @param {?} _keyValueDiffers
     * @param {?} _ngEl
     * @param {?} _renderer
     * @param {?} _ngClassInstance
     * @param {?} _styler
     */
    constructor(monitor, _iterableDiffers, _keyValueDiffers, _ngEl, _renderer, _ngClassInstance, _styler) {
        super(monitor, _ngEl, _styler);
        this.monitor = monitor;
        this._iterableDiffers = _iterableDiffers;
        this._keyValueDiffers = _keyValueDiffers;
        this._ngEl = _ngEl;
        this._renderer = _renderer;
        this._ngClassInstance = _ngClassInstance;
        this._styler = _styler;
        this._configureAdapters();
    }
    /**
     * Intercept ngClass assignments so we cache the default classes
     * which are merged with activated styles or used as fallbacks.
     * Note: Base ngClass values are applied during ngDoCheck()
     * @param {?} val
     * @return {?}
     */
    set ngClassBase(val) {
        const /** @type {?} */ key = 'ngClass';
        this._base.cacheInput(key, val, true);
        this._ngClassInstance.ngClass = this._base.queryInput(key);
    }
    /**
     * Capture class assignments so we cache the default classes
     * which are merged with activated styles and used as fallbacks.
     * @param {?} val
     * @return {?}
     */
    set klazz(val) {
        const /** @type {?} */ key = 'class';
        this._base.cacheInput(key, val);
        this._ngClassInstance.klass = val;
    }
    /**
     * @param {?} val
     * @return {?}
     */
    set ngClassXs(val) { this._base.cacheInput('ngClassXs', val, true); }
    /**
     * @param {?} val
     * @return {?}
     */
    set ngClassSm(val) { this._base.cacheInput('ngClassSm', val, true); }
    /**
     * @param {?} val
     * @return {?}
     */
    set ngClassMd(val) { this._base.cacheInput('ngClassMd', val, true); }
    /**
     * @param {?} val
     * @return {?}
     */
    set ngClassLg(val) { this._base.cacheInput('ngClassLg', val, true); }
    /**
     * @param {?} val
     * @return {?}
     */
    set ngClassXl(val) { this._base.cacheInput('ngClassXl', val, true); }
    /**
     * @param {?} val
     * @return {?}
     */
    set ngClassLtSm(val) { this._base.cacheInput('ngClassLtSm', val, true); }
    /**
     * @param {?} val
     * @return {?}
     */
    set ngClassLtMd(val) { this._base.cacheInput('ngClassLtMd', val, true); }
    /**
     * @param {?} val
     * @return {?}
     */
    set ngClassLtLg(val) { this._base.cacheInput('ngClassLtLg', val, true); }
    /**
     * @param {?} val
     * @return {?}
     */
    set ngClassLtXl(val) { this._base.cacheInput('ngClassLtXl', val, true); }
    /**
     * @param {?} val
     * @return {?}
     */
    set ngClassGtXs(val) { this._base.cacheInput('ngClassGtXs', val, true); }
    /**
     * @param {?} val
     * @return {?}
     */
    set ngClassGtSm(val) { this._base.cacheInput('ngClassGtSm', val, true); }
    /**
     * @param {?} val
     * @return {?}
     */
    set ngClassGtMd(val) { this._base.cacheInput('ngClassGtMd', val, true); }
    /**
     * @param {?} val
     * @return {?}
     */
    set ngClassGtLg(val) { this._base.cacheInput('ngClassGtLg', val, true); }
    /**
     * For \@Input changes on the current mq activation property
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (this._base.activeKey in changes) {
            this._ngClassInstance.ngClass = this._base.mqActivation.activatedInput || '';
        }
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this._configureMQListener();
    }
    /**
     * For ChangeDetectionStrategy.onPush and ngOnChanges() updates
     * @return {?}
     */
    ngDoCheck() {
        this._ngClassInstance.ngDoCheck();
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this._base.ngOnDestroy();
        delete this._ngClassInstance;
    }
    /**
     * Configure adapters (that delegate to an internal ngClass instance) if responsive
     * keys have been defined.
     * @return {?}
     */
    _configureAdapters() {
        this._base = new BaseFxDirectiveAdapter('ngClass', this.monitor, this._ngEl, this._styler);
        if (!this._ngClassInstance) {
            // Create an instance NgClass Directive instance only if `ngClass=""` has NOT been defined on
            // the same host element; since the responsive variations may be defined...
            let /** @type {?} */ adapter = new RendererAdapter(this._renderer);
            this._ngClassInstance = new NgClass(this._iterableDiffers, this._keyValueDiffers, this._ngEl, /** @type {?} */ (adapter));
        }
    }
    /**
     * Build an mqActivation object that bridges mql change events to onMediaQueryChange handlers
     * NOTE: We delegate subsequent activity to the NgClass logic
     *       Identify the activated input value and update the ngClass iterables...
     *       Use ngDoCheck() to actually apply the values to the element
     * @param {?=} baseKey
     * @return {?}
     */
    _configureMQListener(baseKey = 'ngClass') {
        const /** @type {?} */ fallbackValue = this._base.queryInput(baseKey);
        this._base.listenForMediaQueryChanges(baseKey, fallbackValue, (changes) => {
            this._ngClassInstance.ngClass = changes.value || '';
            this._ngClassInstance.ngDoCheck();
        });
    }
}
ClassDirective.decorators = [
    { type: Directive, args: [{
                selector: `
    [ngClass.xs], [ngClass.sm], [ngClass.md], [ngClass.lg], [ngClass.xl],
    [ngClass.lt-sm], [ngClass.lt-md], [ngClass.lt-lg], [ngClass.lt-xl],
    [ngClass.gt-xs], [ngClass.gt-sm], [ngClass.gt-md], [ngClass.gt-lg]
  `
            },] },
];
/** @nocollapse */
ClassDirective.ctorParameters = () => [
    { type: MediaMonitor, },
    { type: IterableDiffers, },
    { type: KeyValueDiffers, },
    { type: ElementRef, },
    { type: Renderer2, },
    { type: NgClass, decorators: [{ type: Optional }, { type: Self },] },
    { type: StyleUtils, },
];
ClassDirective.propDecorators = {
    "ngClassBase": [{ type: Input, args: ['ngClass',] },],
    "klazz": [{ type: Input, args: ['class',] },],
    "ngClassXs": [{ type: Input, args: ['ngClass.xs',] },],
    "ngClassSm": [{ type: Input, args: ['ngClass.sm',] },],
    "ngClassMd": [{ type: Input, args: ['ngClass.md',] },],
    "ngClassLg": [{ type: Input, args: ['ngClass.lg',] },],
    "ngClassXl": [{ type: Input, args: ['ngClass.xl',] },],
    "ngClassLtSm": [{ type: Input, args: ['ngClass.lt-sm',] },],
    "ngClassLtMd": [{ type: Input, args: ['ngClass.lt-md',] },],
    "ngClassLtLg": [{ type: Input, args: ['ngClass.lt-lg',] },],
    "ngClassLtXl": [{ type: Input, args: ['ngClass.lt-xl',] },],
    "ngClassGtXs": [{ type: Input, args: ['ngClass.gt-xs',] },],
    "ngClassGtSm": [{ type: Input, args: ['ngClass.gt-sm',] },],
    "ngClassGtMd": [{ type: Input, args: ['ngClass.gt-md',] },],
    "ngClassGtLg": [{ type: Input, args: ['ngClass.gt-lg',] },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * NgStyle allowed inputs
 */
class NgStyleKeyValue {
    /**
     * @param {?} key
     * @param {?} value
     * @param {?=} noQuotes
     */
    constructor(key, value, noQuotes = true) {
        this.key = key;
        this.value = value;
        this.key = noQuotes ? key.replace(/['"]/g, '').trim() : key.trim();
        this.value = noQuotes ? value.replace(/['"]/g, '').trim() : value.trim();
        this.value = this.value.replace(/;/, '');
    }
}
/**
 * Transform Operators for \@angular/flex-layout NgStyle Directive
 */
const ngStyleUtils = {
    getType,
    buildRawList,
    buildMapFromList,
    buildMapFromSet
};
/**
 * @param {?} target
 * @return {?}
 */
function getType(target) {
    let /** @type {?} */ what = typeof target;
    if (what === 'object') {
        return (target.constructor === Array) ? 'array' :
            (target.constructor === Set) ? 'set' : 'object';
    }
    return what;
}
/**
 * Split string of key:value pairs into Array of k-v pairs
 * e.g.  'key:value; key:value; key:value;' -> ['key:value',...]
 * @param {?} source
 * @param {?=} delimiter
 * @return {?}
 */
function buildRawList(source, delimiter = ';') {
    return String(source)
        .trim()
        .split(delimiter)
        .map((val) => val.trim())
        .filter(val => val !== '');
}
/**
 * Convert array of key:value strings to a iterable map object
 * @param {?} styles
 * @param {?=} sanitize
 * @return {?}
 */
function buildMapFromList(styles, sanitize) {
    let /** @type {?} */ sanitizeValue = (it) => {
        if (sanitize) {
            it.value = sanitize(it.value);
        }
        return it;
    };
    return styles
        .map(stringToKeyValue)
        .filter(entry => !!entry)
        .map(sanitizeValue)
        .reduce(keyValuesToMap, {});
}
/**
 * Convert Set<string> or raw Object to an iterable NgStyleMap
 * @param {?} source
 * @param {?=} sanitize
 * @return {?}
 */
function buildMapFromSet(source, sanitize) {
    let /** @type {?} */ list = new Array();
    if (getType(source) == 'set') {
        source.forEach(entry => list.push(entry));
    }
    else {
        // simple hashmap
        Object.keys(source).forEach(key => {
            list.push(`${key}:${source[key]}`);
        });
    }
    return buildMapFromList(list, sanitize);
}
/**
 * Convert 'key:value' -> [key, value]
 * @param {?} it
 * @return {?}
 */
function stringToKeyValue(it) {
    let [key, val] = it.split(':');
    return val ? new NgStyleKeyValue(key, val) : null;
}
/**
 * Convert [ [key,value] ] -> { key : value }
 * @param {?} map
 * @param {?} entry
 * @return {?}
 */
function keyValuesToMap(map$$1, entry) {
    if (!!entry.key) {
        map$$1[entry.key] = entry.value;
    }
    return map$$1;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Directive to add responsive support for ngStyle.
 *
 */
class StyleDirective extends BaseFxDirective {
    /**
     *  Constructor for the ngStyle subclass; which adds selectors and
     *  a MediaQuery Activation Adapter
     * @param {?} monitor
     * @param {?} _sanitizer
     * @param {?} _ngEl
     * @param {?} _renderer
     * @param {?} _differs
     * @param {?} _ngStyleInstance
     * @param {?} _styler
     */
    constructor(monitor, _sanitizer, _ngEl, _renderer, _differs, _ngStyleInstance, _styler) {
        super(monitor, _ngEl, _styler);
        this.monitor = monitor;
        this._sanitizer = _sanitizer;
        this._ngEl = _ngEl;
        this._renderer = _renderer;
        this._differs = _differs;
        this._ngStyleInstance = _ngStyleInstance;
        this._styler = _styler;
        this._configureAdapters();
    }
    /**
     * Intercept ngStyle assignments so we cache the default styles
     * which are merged with activated styles or used as fallbacks.
     * @param {?} val
     * @return {?}
     */
    set ngStyleBase(val) {
        const /** @type {?} */ key = 'ngStyle';
        this._base.cacheInput(key, val, true); // convert val to hashmap
        this._ngStyleInstance.ngStyle = this._base.queryInput(key);
    }
    /**
     * @param {?} val
     * @return {?}
     */
    set ngStyleXs(val) { this._base.cacheInput('ngStyleXs', val, true); }
    /**
     * @param {?} val
     * @return {?}
     */
    set ngStyleSm(val) { this._base.cacheInput('ngStyleSm', val, true); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set ngStyleMd(val) { this._base.cacheInput('ngStyleMd', val, true); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set ngStyleLg(val) { this._base.cacheInput('ngStyleLg', val, true); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set ngStyleXl(val) { this._base.cacheInput('ngStyleXl', val, true); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set ngStyleLtSm(val) { this._base.cacheInput('ngStyleLtSm', val, true); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set ngStyleLtMd(val) { this._base.cacheInput('ngStyleLtMd', val, true); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set ngStyleLtLg(val) { this._base.cacheInput('ngStyleLtLg', val, true); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set ngStyleLtXl(val) { this._base.cacheInput('ngStyleLtXl', val, true); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set ngStyleGtXs(val) { this._base.cacheInput('ngStyleGtXs', val, true); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set ngStyleGtSm(val) { this._base.cacheInput('ngStyleGtSm', val, true); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set ngStyleGtMd(val) { this._base.cacheInput('ngStyleGtMd', val, true); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set ngStyleGtLg(val) { this._base.cacheInput('ngStyleGtLg', val, true); }
    ;
    /**
     * For \@Input changes on the current mq activation property
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (this._base.activeKey in changes) {
            this._ngStyleInstance.ngStyle = this._base.mqActivation.activatedInput || '';
        }
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this._configureMQListener();
    }
    /**
     * For ChangeDetectionStrategy.onPush and ngOnChanges() updates
     * @return {?}
     */
    ngDoCheck() {
        this._ngStyleInstance.ngDoCheck();
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this._base.ngOnDestroy();
        delete this._ngStyleInstance;
    }
    /**
     * Configure adapters (that delegate to an internal ngClass instance) if responsive
     * keys have been defined.
     * @return {?}
     */
    _configureAdapters() {
        this._base = new BaseFxDirectiveAdapter('ngStyle', this.monitor, this._ngEl, this._styler);
        if (!this._ngStyleInstance) {
            // Create an instance NgClass Directive instance only if `ngClass=""` has NOT been
            // defined on the same host element; since the responsive variations may be defined...
            let /** @type {?} */ adapter = new RendererAdapter(this._renderer);
            this._ngStyleInstance = new NgStyle(this._differs, this._ngEl, /** @type {?} */ (adapter));
        }
        this._buildCacheInterceptor();
        this._fallbackToStyle();
    }
    /**
     * Build an mqActivation object that bridges
     * mql change events to onMediaQueryChange handlers
     * @param {?=} baseKey
     * @return {?}
     */
    _configureMQListener(baseKey = 'ngStyle') {
        const /** @type {?} */ fallbackValue = this._base.queryInput(baseKey);
        this._base.listenForMediaQueryChanges(baseKey, fallbackValue, (changes) => {
            this._ngStyleInstance.ngStyle = changes.value || '';
            this._ngStyleInstance.ngDoCheck();
        });
    }
    /**
     * Build intercept to convert raw strings to ngStyleMap
     * @return {?}
     */
    _buildCacheInterceptor() {
        let /** @type {?} */ cacheInput = this._base.cacheInput.bind(this._base);
        this._base.cacheInput = (key, source, cacheRaw = false, merge = true) => {
            let /** @type {?} */ styles = this._buildStyleMap(source);
            if (merge) {
                styles = extendObject({}, this._base.inputMap['ngStyle'], styles);
            }
            cacheInput(key, styles, cacheRaw);
        };
    }
    /**
     * Convert raw strings to ngStyleMap; which is required by ngStyle
     * NOTE: Raw string key-value pairs MUST be delimited by `;`
     *       Comma-delimiters are not supported due to complexities of
     *       possible style values such as `rgba(x,x,x,x)` and others
     * @param {?} styles
     * @return {?}
     */
    _buildStyleMap(styles) {
        let /** @type {?} */ sanitizer = (val) => {
            // Always safe-guard (aka sanitize) style property values
            return this._sanitizer.sanitize(SecurityContext.STYLE, val) || '';
        };
        if (styles) {
            switch (ngStyleUtils.getType(styles)) {
                case 'string': return ngStyleUtils.buildMapFromList(ngStyleUtils.buildRawList(styles), sanitizer);
                case 'array': return ngStyleUtils.buildMapFromList(/** @type {?} */ (styles), sanitizer);
                case 'set': return ngStyleUtils.buildMapFromSet(styles, sanitizer);
                default: return ngStyleUtils.buildMapFromSet(styles, sanitizer);
            }
        }
        return styles;
    }
    /**
     * Initial lookup of raw 'class' value (if any)
     * @return {?}
     */
    _fallbackToStyle() {
        if (!this._base.queryInput('ngStyle')) {
            this.ngStyleBase = this._getAttributeValue('style') || '';
        }
    }
}
StyleDirective.decorators = [
    { type: Directive, args: [{
                selector: `
    [ngStyle.xs], [ngStyle.sm], [ngStyle.md], [ngStyle.lg], [ngStyle.xl],
    [ngStyle.lt-sm], [ngStyle.lt-md], [ngStyle.lt-lg], [ngStyle.lt-xl],
    [ngStyle.gt-xs], [ngStyle.gt-sm], [ngStyle.gt-md], [ngStyle.gt-lg]
  `
            },] },
];
/** @nocollapse */
StyleDirective.ctorParameters = () => [
    { type: MediaMonitor, },
    { type: DomSanitizer, },
    { type: ElementRef, },
    { type: Renderer2, },
    { type: KeyValueDiffers, },
    { type: NgStyle, decorators: [{ type: Optional }, { type: Self },] },
    { type: StyleUtils, },
];
StyleDirective.propDecorators = {
    "ngStyleBase": [{ type: Input, args: ['ngStyle',] },],
    "ngStyleXs": [{ type: Input, args: ['ngStyle.xs',] },],
    "ngStyleSm": [{ type: Input, args: ['ngStyle.sm',] },],
    "ngStyleMd": [{ type: Input, args: ['ngStyle.md',] },],
    "ngStyleLg": [{ type: Input, args: ['ngStyle.lg',] },],
    "ngStyleXl": [{ type: Input, args: ['ngStyle.xl',] },],
    "ngStyleLtSm": [{ type: Input, args: ['ngStyle.lt-sm',] },],
    "ngStyleLtMd": [{ type: Input, args: ['ngStyle.lt-md',] },],
    "ngStyleLtLg": [{ type: Input, args: ['ngStyle.lt-lg',] },],
    "ngStyleLtXl": [{ type: Input, args: ['ngStyle.lt-xl',] },],
    "ngStyleGtXs": [{ type: Input, args: ['ngStyle.gt-xs',] },],
    "ngStyleGtSm": [{ type: Input, args: ['ngStyle.gt-sm',] },],
    "ngStyleGtMd": [{ type: Input, args: ['ngStyle.gt-md',] },],
    "ngStyleGtLg": [{ type: Input, args: ['ngStyle.gt-lg',] },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
const FALSY = ['false', false, 0];
/**
 * For fxHide selectors, we invert the 'value'
 * and assign to the equivalent fxShow selector cache
 *  - When 'hide' === '' === true, do NOT show the element
 *  - When 'hide' === false or 0... we WILL show the element
 * @param {?} hide
 * @return {?}
 */
function negativeOf(hide) {
    return (hide === '') ? false :
        ((hide === 'false') || (hide === 0)) ? true : !hide;
}
/**
 * 'show' Layout API directive
 *
 */
class ShowHideDirective extends BaseFxDirective {
    /**
     *
     * @param {?} monitor
     * @param {?} layout
     * @param {?} elRef
     * @param {?} styleUtils
     * @param {?} platformId
     * @param {?} serverModuleLoaded
     */
    constructor(monitor, layout, elRef, styleUtils, platformId, serverModuleLoaded) {
        super(monitor, elRef, styleUtils);
        this.layout = layout;
        this.elRef = elRef;
        this.styleUtils = styleUtils;
        this.platformId = platformId;
        this.serverModuleLoaded = serverModuleLoaded;
        if (layout) {
            /**
                   * The Layout can set the display:flex (and incorrectly affect the Hide/Show directives.
                   * Whenever Layout [on the same element] resets its CSS, then update the Hide/Show CSS
                   */
            this._layoutWatcher = layout.layout$.subscribe(() => this._updateWithValue());
        }
    }
    /**
     * @param {?} val
     * @return {?}
     */
    set show(val) { this._cacheInput('show', val); }
    /**
     * @param {?} val
     * @return {?}
     */
    set showXs(val) { this._cacheInput('showXs', val); }
    /**
     * @param {?} val
     * @return {?}
     */
    set showSm(val) { this._cacheInput('showSm', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set showMd(val) { this._cacheInput('showMd', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set showLg(val) { this._cacheInput('showLg', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set showXl(val) { this._cacheInput('showXl', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set showLtSm(val) { this._cacheInput('showLtSm', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set showLtMd(val) { this._cacheInput('showLtMd', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set showLtLg(val) { this._cacheInput('showLtLg', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set showLtXl(val) { this._cacheInput('showLtXl', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set showGtXs(val) { this._cacheInput('showGtXs', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set showGtSm(val) { this._cacheInput('showGtSm', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set showGtMd(val) { this._cacheInput('showGtMd', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set showGtLg(val) { this._cacheInput('showGtLg', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set hide(val) { this._cacheInput('show', negativeOf(val)); }
    /**
     * @param {?} val
     * @return {?}
     */
    set hideXs(val) { this._cacheInput('showXs', negativeOf(val)); }
    /**
     * @param {?} val
     * @return {?}
     */
    set hideSm(val) { this._cacheInput('showSm', negativeOf(val)); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set hideMd(val) { this._cacheInput('showMd', negativeOf(val)); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set hideLg(val) { this._cacheInput('showLg', negativeOf(val)); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set hideXl(val) { this._cacheInput('showXl', negativeOf(val)); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set hideLtSm(val) { this._cacheInput('showLtSm', negativeOf(val)); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set hideLtMd(val) { this._cacheInput('showLtMd', negativeOf(val)); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set hideLtLg(val) { this._cacheInput('showLtLg', negativeOf(val)); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set hideLtXl(val) { this._cacheInput('showLtXl', negativeOf(val)); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set hideGtXs(val) { this._cacheInput('showGtXs', negativeOf(val)); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set hideGtSm(val) { this._cacheInput('showGtSm', negativeOf(val)); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set hideGtMd(val) { this._cacheInput('showGtMd', negativeOf(val)); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set hideGtLg(val) { this._cacheInput('showGtLg', negativeOf(val)); }
    ;
    /**
     * Override accessor to the current HTMLElement's `display` style
     * Note: Show/Hide will not change the display to 'flex' but will set it to 'block'
     * unless it was already explicitly specified inline or in a CSS stylesheet.
     * @return {?}
     */
    _getDisplayStyle() {
        return this.layout ? 'flex' : super._getDisplayStyle();
    }
    /**
     * On changes to any \@Input properties...
     * Default to use the non-responsive Input value ('fxShow')
     * Then conditionally override with the mq-activated Input's current value
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (this.hasInitialized && (changes['show'] != null || this._mqActivation)) {
            this._updateWithValue();
        }
    }
    /**
     * After the initial onChanges, build an mqActivation object that bridges
     * mql change events to onMediaQueryChange handlers
     * @return {?}
     */
    ngOnInit() {
        super.ngOnInit();
        let /** @type {?} */ value = this._getDefaultVal('show', true);
        // Build _mqActivation controller
        this._listenForMediaQueryChanges('show', value, (changes) => {
            this._updateWithValue(changes.value);
        });
        this._updateWithValue();
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        super.ngOnDestroy();
        if (this._layoutWatcher) {
            this._layoutWatcher.unsubscribe();
        }
    }
    /**
     * Validate the visibility value and then update the host's inline display style
     * @param {?=} value
     * @return {?}
     */
    _updateWithValue(value) {
        value = value || this._getDefaultVal('show', true);
        if (this._mqActivation) {
            value = this._mqActivation.activatedInput;
        }
        let /** @type {?} */ shouldShow = this._validateTruthy(value);
        this._applyStyleToElement(this._buildCSS(shouldShow));
        if (isPlatformServer(this.platformId) && this.serverModuleLoaded) {
            this.nativeElement.style.setProperty('display', '');
        }
    }
    /**
     * Build the CSS that should be assigned to the element instance
     * @param {?} show
     * @return {?}
     */
    _buildCSS(show) {
        return { 'display': show ? this._display : 'none' };
    }
    /**
     * Validate the to be not FALSY
     * @param {?} show
     * @return {?}
     */
    _validateTruthy(show) {
        return (FALSY.indexOf(show) == -1);
    }
}
ShowHideDirective.decorators = [
    { type: Directive, args: [{
                selector: `
  [fxShow],
  [fxShow.xs], [fxShow.sm], [fxShow.md], [fxShow.lg], [fxShow.xl],
  [fxShow.lt-sm], [fxShow.lt-md], [fxShow.lt-lg], [fxShow.lt-xl],
  [fxShow.gt-xs], [fxShow.gt-sm], [fxShow.gt-md], [fxShow.gt-lg],
  [fxHide],
  [fxHide.xs], [fxHide.sm], [fxHide.md], [fxHide.lg], [fxHide.xl],
  [fxHide.lt-sm], [fxHide.lt-md], [fxHide.lt-lg], [fxHide.lt-xl],
  [fxHide.gt-xs], [fxHide.gt-sm], [fxHide.gt-md], [fxHide.gt-lg]
`
            },] },
];
/** @nocollapse */
ShowHideDirective.ctorParameters = () => [
    { type: MediaMonitor, },
    { type: LayoutDirective, decorators: [{ type: Optional }, { type: Self },] },
    { type: ElementRef, },
    { type: StyleUtils, },
    { type: Object, decorators: [{ type: Inject, args: [PLATFORM_ID,] },] },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [SERVER_TOKEN,] },] },
];
ShowHideDirective.propDecorators = {
    "show": [{ type: Input, args: ['fxShow',] },],
    "showXs": [{ type: Input, args: ['fxShow.xs',] },],
    "showSm": [{ type: Input, args: ['fxShow.sm',] },],
    "showMd": [{ type: Input, args: ['fxShow.md',] },],
    "showLg": [{ type: Input, args: ['fxShow.lg',] },],
    "showXl": [{ type: Input, args: ['fxShow.xl',] },],
    "showLtSm": [{ type: Input, args: ['fxShow.lt-sm',] },],
    "showLtMd": [{ type: Input, args: ['fxShow.lt-md',] },],
    "showLtLg": [{ type: Input, args: ['fxShow.lt-lg',] },],
    "showLtXl": [{ type: Input, args: ['fxShow.lt-xl',] },],
    "showGtXs": [{ type: Input, args: ['fxShow.gt-xs',] },],
    "showGtSm": [{ type: Input, args: ['fxShow.gt-sm',] },],
    "showGtMd": [{ type: Input, args: ['fxShow.gt-md',] },],
    "showGtLg": [{ type: Input, args: ['fxShow.gt-lg',] },],
    "hide": [{ type: Input, args: ['fxHide',] },],
    "hideXs": [{ type: Input, args: ['fxHide.xs',] },],
    "hideSm": [{ type: Input, args: ['fxHide.sm',] },],
    "hideMd": [{ type: Input, args: ['fxHide.md',] },],
    "hideLg": [{ type: Input, args: ['fxHide.lg',] },],
    "hideXl": [{ type: Input, args: ['fxHide.xl',] },],
    "hideLtSm": [{ type: Input, args: ['fxHide.lt-sm',] },],
    "hideLtMd": [{ type: Input, args: ['fxHide.lt-md',] },],
    "hideLtLg": [{ type: Input, args: ['fxHide.lt-lg',] },],
    "hideLtXl": [{ type: Input, args: ['fxHide.lt-xl',] },],
    "hideGtXs": [{ type: Input, args: ['fxHide.gt-xs',] },],
    "hideGtSm": [{ type: Input, args: ['fxHide.gt-sm',] },],
    "hideGtMd": [{ type: Input, args: ['fxHide.gt-md',] },],
    "hideGtLg": [{ type: Input, args: ['fxHide.gt-lg',] },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * This directive provides a responsive API for the HTML <img> 'src' attribute
 * and will update the img.src property upon each responsive activation.
 *
 * e.g.
 *      <img src="defaultScene.jpg" src.xs="mobileScene.jpg"></img>
 *
 * @see https://css-tricks.com/responsive-images-youre-just-changing-resolutions-use-src/
 */
class ImgSrcDirective extends BaseFxDirective {
    /**
     * @param {?} _elRef
     * @param {?} _monitor
     * @param {?} _styler
     * @param {?} _platformId
     * @param {?} _serverModuleLoaded
     */
    constructor(_elRef, _monitor, _styler, _platformId, _serverModuleLoaded) {
        super(_monitor, _elRef, _styler);
        this._elRef = _elRef;
        this._monitor = _monitor;
        this._styler = _styler;
        this._platformId = _platformId;
        this._serverModuleLoaded = _serverModuleLoaded;
        this._cacheInput('src', _elRef.nativeElement.getAttribute('src') || '');
        if (isPlatformServer(this._platformId) && this._serverModuleLoaded) {
            this.nativeElement.setAttribute('src', '');
        }
    }
    /**
     * @param {?} val
     * @return {?}
     */
    set srcBase(val) { this.cacheDefaultSrc(val); }
    /**
     * @param {?} val
     * @return {?}
     */
    set srcXs(val) { this._cacheInput('srcXs', val); }
    /**
     * @param {?} val
     * @return {?}
     */
    set srcSm(val) { this._cacheInput('srcSm', val); }
    /**
     * @param {?} val
     * @return {?}
     */
    set srcMd(val) { this._cacheInput('srcMd', val); }
    /**
     * @param {?} val
     * @return {?}
     */
    set srcLg(val) { this._cacheInput('srcLg', val); }
    /**
     * @param {?} val
     * @return {?}
     */
    set srcXl(val) { this._cacheInput('srcXl', val); }
    /**
     * @param {?} val
     * @return {?}
     */
    set srcLtSm(val) { this._cacheInput('srcLtSm', val); }
    /**
     * @param {?} val
     * @return {?}
     */
    set srcLtMd(val) { this._cacheInput('srcLtMd', val); }
    /**
     * @param {?} val
     * @return {?}
     */
    set srcLtLg(val) { this._cacheInput('srcLtLg', val); }
    /**
     * @param {?} val
     * @return {?}
     */
    set srcLtXl(val) { this._cacheInput('srcLtXl', val); }
    /**
     * @param {?} val
     * @return {?}
     */
    set srcGtXs(val) { this._cacheInput('srcGtXs', val); }
    /**
     * @param {?} val
     * @return {?}
     */
    set srcGtSm(val) { this._cacheInput('srcGtSm', val); }
    /**
     * @param {?} val
     * @return {?}
     */
    set srcGtMd(val) { this._cacheInput('srcGtMd', val); }
    /**
     * @param {?} val
     * @return {?}
     */
    set srcGtLg(val) { this._cacheInput('srcGtLg', val); }
    /**
     * Listen for responsive changes to update the img.src attribute
     * @return {?}
     */
    ngOnInit() {
        super.ngOnInit();
        if (this.hasResponsiveKeys) {
            // Listen for responsive changes
            this._listenForMediaQueryChanges('src', this.defaultSrc, () => {
                this._updateSrcFor();
            });
        }
        this._updateSrcFor();
    }
    /**
     * Update the 'src' property of the host <img> element
     * @return {?}
     */
    ngOnChanges() {
        if (this.hasInitialized) {
            this._updateSrcFor();
        }
    }
    /**
     * Use the [responsively] activated input value to update
     * the host img src attribute or assign a default `img.src=''`
     * if the src has not been defined.
     *
     * Do nothing to standard `<img src="">` usages, only when responsive
     * keys are present do we actually call `setAttribute()`
     * @return {?}
     */
    _updateSrcFor() {
        if (this.hasResponsiveKeys) {
            let /** @type {?} */ url = this.activatedValue || this.defaultSrc;
            if (isPlatformServer(this._platformId) && this._serverModuleLoaded) {
                this._styler.applyStyleToElement(this.nativeElement, { 'content': url ? `url(${url})` : '' });
            }
            else {
                this.nativeElement.setAttribute('src', String(url));
            }
        }
    }
    /**
     * Cache initial value of 'src', this will be used as fallback when breakpoint
     * activations change.
     * NOTE: The default 'src' property is not bound using \@Input(), so perform
     * a post-ngOnInit() lookup of the default src value (if any).
     * @param {?=} value
     * @return {?}
     */
    cacheDefaultSrc(value) {
        this._cacheInput('src', value || '');
    }
    /**
     * Empty values are maintained, undefined values are exposed as ''
     * @return {?}
     */
    get defaultSrc() {
        return this._queryInput('src') || '';
    }
    /**
     * Does the <img> have 1 or more src.<xxx> responsive inputs
     * defined... these will be mapped to activated breakpoints.
     * @return {?}
     */
    get hasResponsiveKeys() {
        return Object.keys(this._inputMap).length > 1;
    }
}
ImgSrcDirective.decorators = [
    { type: Directive, args: [{
                selector: `
  img[src.xs],    img[src.sm],    img[src.md],    img[src.lg],   img[src.xl],
  img[src.lt-sm], img[src.lt-md], img[src.lt-lg], img[src.lt-xl],
  img[src.gt-xs], img[src.gt-sm], img[src.gt-md], img[src.gt-lg]
`
            },] },
];
/** @nocollapse */
ImgSrcDirective.ctorParameters = () => [
    { type: ElementRef, },
    { type: MediaMonitor, },
    { type: StyleUtils, },
    { type: Object, decorators: [{ type: Inject, args: [PLATFORM_ID,] },] },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [SERVER_TOKEN,] },] },
];
ImgSrcDirective.propDecorators = {
    "srcBase": [{ type: Input, args: ['src',] },],
    "srcXs": [{ type: Input, args: ['src.xs',] },],
    "srcSm": [{ type: Input, args: ['src.sm',] },],
    "srcMd": [{ type: Input, args: ['src.md',] },],
    "srcLg": [{ type: Input, args: ['src.lg',] },],
    "srcXl": [{ type: Input, args: ['src.xl',] },],
    "srcLtSm": [{ type: Input, args: ['src.lt-sm',] },],
    "srcLtMd": [{ type: Input, args: ['src.lt-md',] },],
    "srcLtLg": [{ type: Input, args: ['src.lt-lg',] },],
    "srcLtXl": [{ type: Input, args: ['src.lt-xl',] },],
    "srcGtXs": [{ type: Input, args: ['src.gt-xs',] },],
    "srcGtSm": [{ type: Input, args: ['src.gt-sm',] },],
    "srcGtMd": [{ type: Input, args: ['src.gt-md',] },],
    "srcGtLg": [{ type: Input, args: ['src.gt-lg',] },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
const RESPONSIVE_ALIASES = [
    'xs', 'gt-xs', 'sm', 'gt-sm', 'md', 'gt-md', 'lg', 'gt-lg', 'xl'
];
const DEFAULT_BREAKPOINTS = [
    {
        alias: 'xs',
        mediaQuery: '(min-width: 0px) and (max-width: 599px)'
    },
    {
        alias: 'gt-xs',
        overlapping: true,
        mediaQuery: '(min-width: 600px)'
    },
    {
        alias: 'lt-sm',
        overlapping: true,
        mediaQuery: '(max-width: 599px)'
    },
    {
        alias: 'sm',
        mediaQuery: '(min-width: 600px) and (max-width: 959px)'
    },
    {
        alias: 'gt-sm',
        overlapping: true,
        mediaQuery: '(min-width: 960px)'
    },
    {
        alias: 'lt-md',
        overlapping: true,
        mediaQuery: '(max-width: 959px)'
    },
    {
        alias: 'md',
        mediaQuery: '(min-width: 960px) and (max-width: 1279px)'
    },
    {
        alias: 'gt-md',
        overlapping: true,
        mediaQuery: '(min-width: 1280px)'
    },
    {
        alias: 'lt-lg',
        overlapping: true,
        mediaQuery: '(max-width: 1279px)'
    },
    {
        alias: 'lg',
        mediaQuery: '(min-width: 1280px) and (max-width: 1919px)'
    },
    {
        alias: 'gt-lg',
        overlapping: true,
        mediaQuery: '(min-width: 1920px)'
    },
    {
        alias: 'lt-xl',
        overlapping: true,
        mediaQuery: '(max-width: 1920px)'
    },
    {
        alias: 'xl',
        mediaQuery: '(min-width: 1920px) and (max-width: 5000px)'
    }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/* tslint:disable */
const HANDSET_PORTRAIT = '(orientations: portrait) and (max-width: 599px)';
const HANDSET_LANDSCAPE = '(orientations: landscape) and (max-width: 959px)';
const TABLET_LANDSCAPE = '(orientations: landscape) and (min-width: 960px) and (max-width: 1279px)';
const TABLET_PORTRAIT = '(orientations: portrait) and (min-width: 600px) and (max-width: 839px)';
const WEB_PORTRAIT = '(orientations: portrait) and (min-width: 840px)';
const WEB_LANDSCAPE = '(orientations: landscape) and (min-width: 1280px)';
const ScreenTypes = {
    'HANDSET': `${HANDSET_PORTRAIT}, ${HANDSET_LANDSCAPE}`,
    'TABLET': `${TABLET_PORTRAIT} , ${TABLET_LANDSCAPE}`,
    'WEB': `${WEB_PORTRAIT}, ${WEB_LANDSCAPE} `,
    'HANDSET_PORTRAIT': `${HANDSET_PORTRAIT}`,
    'TABLET_PORTRAIT': `${TABLET_PORTRAIT} `,
    'WEB_PORTRAIT': `${WEB_PORTRAIT}`,
    'HANDSET_LANDSCAPE': `${HANDSET_LANDSCAPE}]`,
    'TABLET_LANDSCAPE': `${TABLET_LANDSCAPE}`,
    'WEB_LANDSCAPE': `${WEB_LANDSCAPE}`
};
/**
 * Extended Breakpoints for handset/tablets with landscape or portrait orientations
 */
const ORIENTATION_BREAKPOINTS = [
    { 'alias': 'handset', 'mediaQuery': ScreenTypes.HANDSET },
    { 'alias': 'handset.landscape', 'mediaQuery': ScreenTypes.HANDSET_LANDSCAPE },
    { 'alias': 'handset.portrait', 'mediaQuery': ScreenTypes.HANDSET_PORTRAIT },
    { 'alias': 'tablet', 'mediaQuery': ScreenTypes.TABLET },
    { 'alias': 'tablet.landscape', 'mediaQuery': ScreenTypes.TABLET },
    { 'alias': 'tablet.portrait', 'mediaQuery': ScreenTypes.TABLET_PORTRAIT },
    { 'alias': 'web', 'mediaQuery': ScreenTypes.WEB, overlapping: true },
    { 'alias': 'web.landscape', 'mediaQuery': ScreenTypes.WEB_LANDSCAPE, overlapping: true },
    { 'alias': 'web.portrait', 'mediaQuery': ScreenTypes.WEB_PORTRAIT, overlapping: true }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Base class for MediaService and pseudo-token for
 * @abstract
 */
class ObservableMedia {
}
/**
 * Class internalizes a MatchMedia service and exposes an Subscribable and Observable interface.
 * This an Observable with that exposes a feature to subscribe to mediaQuery
 * changes and a validator method (`isActive(<alias>)`) to test if a mediaQuery (or alias) is
 * currently active.
 *
 * !! Only mediaChange activations (not de-activations) are announced by the ObservableMedia
 *
 * This class uses the BreakPoint Registry to inject alias information into the raw MediaChange
 * notification. For custom mediaQuery notifications, alias information will not be injected and
 * those fields will be ''.
 *
 * !! This is not an actual Observable. It is a wrapper of an Observable used to publish additional
 * methods like `isActive(<alias>). To access the Observable and use RxJS operators, use
 * `.asObservable()` with syntax like media.asObservable().map(....).
 *
 *  \@usage
 *
 *  // RxJS
 *  import {filter} from 'rxjs/operators/filter';
 *  import { ObservableMedia } from '\@angular/flex-layout';
 *
 *  \@Component({ ... })
 *  export class AppComponent {
 *    status : string = '';
 *
 *    constructor(  media:ObservableMedia ) {
 *      let onChange = (change:MediaChange) => {
 *        this.status = change ? `'${change.mqAlias}' = (${change.mediaQuery})` : '';
 *      };
 *
 *      // Subscribe directly or access observable to use filter/map operators
 *      // e.g.
 *      //      media.subscribe(onChange);
 *
 *      media.asObservable()
 *        .pipe(
 *          filter((change:MediaChange) => true)   // silly noop filter
 *        ).subscribe(onChange);
 *    }
 *  }
 */
class MediaService {
    /**
     * @param {?} breakpoints
     * @param {?} mediaWatcher
     */
    constructor(breakpoints, mediaWatcher) {
        this.breakpoints = breakpoints;
        this.mediaWatcher = mediaWatcher;
        /**
         * Should we announce gt-<xxx> breakpoint activations ?
         */
        this.filterOverlaps = true;
        this._registerBreakPoints();
        this.observable$ = this._buildObservable();
    }
    /**
     * Test if specified query/alias is active.
     * @param {?} alias
     * @return {?}
     */
    isActive(alias) {
        let /** @type {?} */ query = this._toMediaQuery(alias);
        return this.mediaWatcher.isActive(query);
    }
    /**
     * Proxy to the Observable subscribe method
     * @param {?=} next
     * @param {?=} error
     * @param {?=} complete
     * @return {?}
     */
    subscribe(next, error, complete) {
        return this.observable$.subscribe(next, error, complete);
    }
    /**
     * Access to observable for use with operators like
     * .filter(), .map(), etc.
     * @return {?}
     */
    asObservable() {
        return this.observable$;
    }
    /**
     * Register all the mediaQueries registered in the BreakPointRegistry
     * This is needed so subscribers can be auto-notified of all standard, registered
     * mediaQuery activations
     * @return {?}
     */
    _registerBreakPoints() {
        let /** @type {?} */ queries = this.breakpoints.sortedItems.map(bp => bp.mediaQuery);
        this.mediaWatcher.registerQuery(queries);
    }
    /**
     * Prepare internal observable
     *
     * NOTE: the raw MediaChange events [from MatchMedia] do not
     *       contain important alias information; as such this info
     *       must be injected into the MediaChange
     * @return {?}
     */
    _buildObservable() {
        const /** @type {?} */ self = this;
        const /** @type {?} */ media$ = this.mediaWatcher.observe();
        const /** @type {?} */ activationsOnly = (change) => {
            return change.matches === true;
        };
        const /** @type {?} */ addAliasInformation = (change) => {
            return mergeAlias(change, this._findByQuery(change.mediaQuery));
        };
        const /** @type {?} */ excludeOverlaps = (change) => {
            let /** @type {?} */ bp = this.breakpoints.findByQuery(change.mediaQuery);
            return !bp ? true : !(self.filterOverlaps && bp.overlapping);
        };
        /**
             * Only pass/announce activations (not de-activations)
             * Inject associated (if any) alias information into the MediaChange event
             * Exclude mediaQuery activations for overlapping mQs. List bounded mQ ranges only
             */
        return media$.pipe(filter(activationsOnly), filter(excludeOverlaps), map(addAliasInformation));
    }
    /**
     * Breakpoint locator by alias
     * @param {?} alias
     * @return {?}
     */
    _findByAlias(alias) {
        return this.breakpoints.findByAlias(alias);
    }
    /**
     * Breakpoint locator by mediaQuery
     * @param {?} query
     * @return {?}
     */
    _findByQuery(query) {
        return this.breakpoints.findByQuery(query);
    }
    /**
     * Find associated breakpoint (if any)
     * @param {?} query
     * @return {?}
     */
    _toMediaQuery(query) {
        let /** @type {?} */ bp = this._findByAlias(query) || this._findByQuery(query);
        return bp ? bp.mediaQuery : query;
    }
}
MediaService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
MediaService.ctorParameters = () => [
    { type: BreakPointRegistry, },
    { type: MatchMedia, },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

const ALIAS_DELIMITERS = /(\.|-|_)/g;
/**
 * @param {?} part
 * @return {?}
 */
function firstUpperCase(part) {
    let /** @type {?} */ first = part.length > 0 ? part.charAt(0) : '';
    let /** @type {?} */ remainder = (part.length > 1) ? part.slice(1) : '';
    return first.toUpperCase() + remainder;
}
/**
 * Converts snake-case to SnakeCase.
 * @param {?} name Text to UpperCamelCase
 * @return {?}
 */
function camelCase(name) {
    return name
        .replace(ALIAS_DELIMITERS, '|')
        .split('|')
        .map(firstUpperCase)
        .join('');
}
/**
 * For each breakpoint, ensure that a Suffix is defined;
 * fallback to UpperCamelCase the unique Alias value
 * @param {?} list
 * @return {?}
 */
function validateSuffixes(list) {
    list.forEach((bp) => {
        if (!bp.suffix || bp.suffix === '') {
            bp.suffix = camelCase(bp.alias); // create Suffix value based on alias
            bp.overlapping = bp.overlapping || false; // ensure default value
        }
    });
    return list;
}
/**
 * Merge a custom breakpoint list with the default list based on unique alias values
 *  - Items are added if the alias is not in the default list
 *  - Items are merged with the custom override if the alias exists in the default list
 * @param {?} defaults
 * @param {?=} custom
 * @return {?}
 */
function mergeByAlias(defaults, custom = []) {
    const /** @type {?} */ merged = defaults.map((bp) => extendObject({}, bp));
    const /** @type {?} */ findByAlias = (alias) => merged.reduce((result, bp) => {
        return result || ((bp.alias === alias) ? bp : null);
    }, null);
    // Merge custom breakpoints
    custom.forEach((bp) => {
        let /** @type {?} */ target = findByAlias(bp.alias);
        if (target) {
            extendObject(target, bp);
        }
        else {
            merged.push(bp);
        }
    });
    return validateSuffixes(merged);
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Options to identify which breakpoint types to include as part of
 * a BreakPoint provider
 * @record
 */

/**
 * Add new custom items to the default list or override existing default with custom overrides
 * @param {?=} _custom
 * @param {?=} options
 * @return {?}
 */
function buildMergedBreakPoints(_custom, options) {
    options = extendObject({}, {
        defaults: true,
        // exclude pre-configured, internal default breakpoints
        orientation: false // exclude pre-configured, internal orientations breakpoints
    }, options || {});
    return () => {
        // Order so the defaults are loaded last; so ObservableMedia will report these last!
        let /** @type {?} */ defaults = (options && options.orientations) ?
            ORIENTATION_BREAKPOINTS.concat(DEFAULT_BREAKPOINTS) : DEFAULT_BREAKPOINTS;
        return (options && options.defaults) ?
            mergeByAlias(defaults, _custom || []) : mergeByAlias(_custom || []);
    };
}
/**
 *  Ensure that only a single global BreakPoint list is instantiated...
 * @return {?}
 */
function DEFAULT_BREAKPOINTS_PROVIDER_FACTORY() {
    return validateSuffixes(DEFAULT_BREAKPOINTS);
}
/**
 * Default Provider that does not support external customization nor provide
 * the extra extended breakpoints:   "handset", "tablet", and "web"
 *
 *  NOTE: !! breakpoints are considered to have unique 'alias' properties,
 *        custom breakpoints matching existing breakpoints will override the properties
 *        of the existing (and not be added as an extra breakpoint entry).
 *        [xs, gt-xs, sm, gt-sm, md, gt-md, lg, gt-lg, xl]
 */
const DEFAULT_BREAKPOINTS_PROVIDER = {
    // tslint:disable-line:variable-name
    provide: BREAKPOINTS,
    useFactory: DEFAULT_BREAKPOINTS_PROVIDER_FACTORY
};
/**
 * Use with FlexLayoutModule.CUSTOM_BREAKPOINTS_PROVIDER_FACTORY!
 * @param {?=} _custom
 * @param {?=} options
 * @return {?}
 */
function CUSTOM_BREAKPOINTS_PROVIDER_FACTORY(_custom, options) {
    return {
        provide: /** @type {?} */ (BREAKPOINTS),
        useFactory: buildMergedBreakPoints(_custom, options)
    };
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Ensure a single global ObservableMedia service provider
 * @param {?} parentService
 * @param {?} matchMedia
 * @param {?} breakpoints
 * @return {?}
 */
function OBSERVABLE_MEDIA_PROVIDER_FACTORY(parentService, matchMedia, breakpoints) {
    return parentService || new MediaService(breakpoints, matchMedia);
}
/**
 *  Provider to return global service for observable service for all MediaQuery activations
 */
const OBSERVABLE_MEDIA_PROVIDER = {
    // tslint:disable-line:variable-name
    provide: ObservableMedia,
    deps: [
        [new Optional(), new SkipSelf(), ObservableMedia],
        MatchMedia,
        BreakPointRegistry
    ],
    useFactory: OBSERVABLE_MEDIA_PROVIDER_FACTORY
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Ensure a single global service provider
 * @param {?} parentMonitor
 * @param {?} breakpoints
 * @param {?} matchMedia
 * @return {?}
 */
function MEDIA_MONITOR_PROVIDER_FACTORY(parentMonitor, breakpoints, matchMedia) {
    return parentMonitor || new MediaMonitor(breakpoints, matchMedia);
}
/**
 * Export provider that uses a global service factory (above)
 */
const MEDIA_MONITOR_PROVIDER = {
    provide: MediaMonitor,
    deps: [
        [new Optional(), new SkipSelf(), MediaMonitor],
        BreakPointRegistry,
        MatchMedia,
    ],
    useFactory: MEDIA_MONITOR_PROVIDER_FACTORY
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Special server-only class to simulate a MediaQueryList and
 * - supports manual activation to simulate mediaQuery matching
 * - manages listeners
 */
class ServerMediaQueryList {
    /**
     * @param {?} _mediaQuery
     */
    constructor(_mediaQuery) {
        this._mediaQuery = _mediaQuery;
        this._isActive = false;
        this._listeners = [];
    }
    /**
     * @return {?}
     */
    get matches() {
        return this._isActive;
    }
    /**
     * @return {?}
     */
    get media() {
        return this._mediaQuery;
    }
    /**
     * Destroy the current list by deactivating the
     * listeners and clearing the internal list
     * @return {?}
     */
    destroy() {
        this.deactivate();
        this._listeners = [];
    }
    /**
     * Notify all listeners that 'matches === TRUE'
     * @return {?}
     */
    activate() {
        if (!this._isActive) {
            this._isActive = true;
            this._listeners.forEach((callback) => {
                callback(this);
            });
        }
        return this;
    }
    /**
     * Notify all listeners that 'matches === false'
     * @return {?}
     */
    deactivate() {
        if (this._isActive) {
            this._isActive = false;
            this._listeners.forEach((callback) => {
                callback(this);
            });
        }
        return this;
    }
    /**
     * Add a listener to our internal list to activate later
     * @param {?} listener
     * @return {?}
     */
    addListener(listener) {
        if (this._listeners.indexOf(listener) === -1) {
            this._listeners.push(listener);
        }
        if (this._isActive) {
            listener(this);
        }
    }
    /**
     * Don't need to remove listeners in the server environment
     * @param {?} _
     * @return {?}
     */
    removeListener(_) {
    }
}
/**
 * Special server-only implementation of MatchMedia that uses the above
 * ServerMediaQueryList as its internal representation
 *
 * Also contains methods to activate and deactivate breakpoints
 */
class ServerMatchMedia extends MatchMedia {
    /**
     * @param {?} _zone
     * @param {?} _platformId
     * @param {?} _document
     */
    constructor(_zone, _platformId, _document) {
        super(_zone, _platformId, _document);
        this._zone = _zone;
        this._platformId = _platformId;
        this._document = _document;
        this._registry = new Map();
        this._source = new BehaviorSubject(new MediaChange(true));
        this._observable$ = this._source.asObservable();
    }
    /**
     * Activate the specified breakpoint if we're on the server, no-op otherwise
     * @param {?} bp
     * @return {?}
     */
    activateBreakpoint(bp) {
        const /** @type {?} */ lookupBreakpoint = this._registry.get(bp.mediaQuery);
        if (lookupBreakpoint) {
            lookupBreakpoint.activate();
        }
    }
    /**
     * Deactivate the specified breakpoint if we're on the server, no-op otherwise
     * @param {?} bp
     * @return {?}
     */
    deactivateBreakpoint(bp) {
        const /** @type {?} */ lookupBreakpoint = this._registry.get(bp.mediaQuery);
        if (lookupBreakpoint) {
            lookupBreakpoint.deactivate();
        }
    }
    /**
     * Call window.matchMedia() to build a MediaQueryList; which
     * supports 0..n listeners for activation/deactivation
     * @param {?} query
     * @return {?}
     */
    _buildMQL(query) {
        return new ServerMediaQueryList(query);
    }
}
ServerMatchMedia.decorators = [
    { type: Injectable },
];
/** @nocollapse */
ServerMatchMedia.ctorParameters = () => [
    { type: NgZone, },
    { type: Object, decorators: [{ type: Inject, args: [PLATFORM_ID,] },] },
    { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] },] },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * *****************************************************************
 * Define module for the MediaQuery API
 * *****************************************************************
 */
class MediaQueriesModule {
}
MediaQueriesModule.decorators = [
    { type: NgModule, args: [{
                providers: [
                    DEFAULT_BREAKPOINTS_PROVIDER,
                    BreakPointRegistry,
                    MatchMedia,
                    MediaMonitor,
                    OBSERVABLE_MEDIA_PROVIDER
                ]
            },] },
];
/** @nocollapse */
MediaQueriesModule.ctorParameters = () => [];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Find all of the server-generated stylings, if any, and remove them
 * This will be in the form of inline classes and the style block in the
 * head of the DOM
 * @param {?} _document
 * @param {?} platformId
 * @return {?}
 */
function removeStyles(_document, platformId) {
    return () => {
        if (isPlatformBrowser(platformId)) {
            const /** @type {?} */ elements = Array.from(_document.querySelectorAll(`[class*=${CLASS_NAME}]`));
            const /** @type {?} */ classRegex = new RegExp(/\bflex-layout-.+?\b/, 'g');
            elements.forEach(el => {
                el.classList.contains(`${CLASS_NAME}ssr`) && el.parentNode ?
                    el.parentNode.removeChild(el) : el.className.replace(classRegex, '');
            });
        }
    };
}
/**
 *  Provider to remove SSR styles on the browser
 */
const BROWSER_PROVIDER = {
    provide: /** @type {?} */ (APP_BOOTSTRAP_LISTENER),
    useFactory: removeStyles,
    deps: [DOCUMENT, PLATFORM_ID],
    multi: true
};
const CLASS_NAME = 'flex-layout-';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * Directive to listen for changes of direction of part of the DOM.
 *
 * Provides itself as Directionality such that descendant directives only need to ever inject
 * Directionality to get the closest direction.
 */
class Dir {
    constructor() {
        this._dir = 'ltr';
        /**
         * Whether the `value` has been set to its initial value.
         */
        this._isInitialized = false;
        /**
         * Event emitted when the direction changes.
         */
        this.change = new EventEmitter();
    }
    /**
     * \@docs-private
     * @return {?}
     */
    get dir() { return this._dir; }
    /**
     * @param {?} v
     * @return {?}
     */
    set dir(v) {
        const /** @type {?} */ old = this._dir;
        this._dir = v;
        if (old !== this._dir && this._isInitialized) {
            this.change.emit(this._dir);
        }
    }
    /**
     * Current layout direction of the element.
     * @return {?}
     */
    get value() { return this.dir; }
    /**
     * Initialize once default value has been set.
     * @return {?}
     */
    ngAfterContentInit() {
        this._isInitialized = true;
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.change.complete();
    }
}
Dir.decorators = [
    { type: Directive, args: [{
                selector: '[dir]',
                providers: [{ provide: Directionality, useExisting: Dir }],
                host: { '[dir]': 'dir' },
                exportAs: 'dir',
            },] },
];
/** @nocollapse */
Dir.ctorParameters = () => [];
Dir.propDecorators = {
    "change": [{ type: Output, args: ['dirChange',] },],
    "dir": [{ type: Input },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

class BidiModule {
}
BidiModule.decorators = [
    { type: NgModule, args: [{
                exports: [Dir],
                declarations: [Dir],
                providers: [
                    { provide: DIR_DOCUMENT, useExisting: DOCUMENT },
                    Directionality,
                ]
            },] },
];
/** @nocollapse */
BidiModule.ctorParameters = () => [];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * Since the equivalent results are easily achieved with a css class attached to each
 * layout child, these have been deprecated and removed from the API.
 *
 *  import {LayoutPaddingDirective} from './api/flexbox/layout-padding';
 *  import {LayoutMarginDirective} from './api/flexbox/layout-margin';
 */
const ALL_DIRECTIVES = [
    LayoutDirective,
    LayoutGapDirective,
    LayoutAlignDirective,
    FlexDirective,
    FlexOrderDirective,
    FlexOffsetDirective,
    FlexFillDirective,
    FlexAlignDirective,
    ShowHideDirective,
    ClassDirective,
    StyleDirective,
    ImgSrcDirective
];
/**
 *
 */
class FlexLayoutModule {
    /**
     * @param {?} serverModuleLoaded
     * @param {?} platformId
     */
    constructor(serverModuleLoaded, platformId) {
        if (isPlatformServer(platformId) && !serverModuleLoaded) {
            console.warn('Warning: Flex Layout loaded on the server without FlexLayoutServerModule');
        }
    }
    /**
     * External uses can easily add custom breakpoints AND include internal orientations
     * breakpoints; which are not available by default.
     *
     * !! Selector aliases are not auto-configured. Developers must subclass
     * the API directives to support extra selectors for the orientations breakpoints !!
     * @param {?} breakpoints
     * @param {?=} options
     * @return {?}
     */
    static provideBreakPoints(breakpoints, options) {
        return {
            ngModule: FlexLayoutModule,
            providers: [
                CUSTOM_BREAKPOINTS_PROVIDER_FACTORY(breakpoints, options || { orientations: false })
            ]
        };
    }
}
FlexLayoutModule.decorators = [
    { type: NgModule, args: [{
                imports: [MediaQueriesModule, BidiModule],
                exports: [MediaQueriesModule, ...ALL_DIRECTIVES],
                declarations: [...ALL_DIRECTIVES],
                providers: [
                    ServerStylesheet,
                    StyleUtils,
                    BROWSER_PROVIDER,
                ]
            },] },
];
/** @nocollapse */
FlexLayoutModule.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [SERVER_TOKEN,] },] },
    { type: Object, decorators: [{ type: Inject, args: [PLATFORM_ID,] },] },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @module
 * @description
 * Entry point for all public APIs of Angular Flex-Layout.
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Generated bundle index. Do not edit.
 */

export { VERSION, BaseFxDirective, BaseFxDirectiveAdapter, KeyOptions, ResponsiveActivation, LayoutDirective, LayoutAlignDirective, LayoutGapDirective, FlexDirective, FlexAlignDirective, FlexFillDirective, FlexOffsetDirective, FlexOrderDirective, ClassDirective, StyleDirective, negativeOf, ShowHideDirective, ImgSrcDirective, RESPONSIVE_ALIASES, DEFAULT_BREAKPOINTS, ScreenTypes, ORIENTATION_BREAKPOINTS, BREAKPOINTS, BreakPointRegistry, ObservableMedia, MediaService, MatchMedia, MediaChange, MediaMonitor, buildMergedBreakPoints, DEFAULT_BREAKPOINTS_PROVIDER_FACTORY, DEFAULT_BREAKPOINTS_PROVIDER, CUSTOM_BREAKPOINTS_PROVIDER_FACTORY, OBSERVABLE_MEDIA_PROVIDER_FACTORY, OBSERVABLE_MEDIA_PROVIDER, MEDIA_MONITOR_PROVIDER_FACTORY, MEDIA_MONITOR_PROVIDER, ServerMediaQueryList, ServerMatchMedia, MediaQueriesModule, mergeAlias, applyCssPrefixes, validateBasis, INLINE, LAYOUT_VALUES, buildLayoutCSS, validateValue, isFlowHorizontal, validateWrapValue, validateSuffixes, mergeByAlias, extendObject, StyleUtils, NgStyleKeyValue, ngStyleUtils, removeStyles, BROWSER_PROVIDER, CLASS_NAME, ServerStylesheet, SERVER_TOKEN, FlexLayoutModule, BidiModule as ɵc, Dir as ɵd, DIR_DOCUMENT as ɵa, Directionality as ɵb };
//# sourceMappingURL=flex-layout.js.map
