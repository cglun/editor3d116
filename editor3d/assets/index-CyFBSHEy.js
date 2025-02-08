import { importShared } from './__federation_fn_import-DkmQLHYr.js';
import Viewer3d, { j as jsxRuntimeExports, s as setScene, a as addGridHelper, g as getCamera, b as getScene, c as getObjectNameByName, d as setTransformControls, e as setCamera, f as getDivElement, r as raycasterSelect, h as createScene, o as onWindowResize, i as getRenderer, k as setCameraType, l as getTransfControls } from './__federation_expose_Viewer3d-BCRozzVR.js';
import { g as getDefaultExportFromCjs } from './_commonjsHelpers-B85MJLTf.js';
import { r as requireReactDom } from './index-CQoTOKjm.js';
import { r as requireReact } from './index-fT0rZ_0F.js';
import { S as Scene, A as APP_COLOR, D as DELAY, takeScreenshot, U as UserDataType, C as Color, F as Fog, V as Vector3, O as Object3D } from './__federation_expose_Init3dViewer-BtTbt1Ug.js';

var client = {};

var hasRequiredClient;

function requireClient () {
	if (hasRequiredClient) return client;
	hasRequiredClient = 1;
	var m = requireReactDom();
	{
	  client.createRoot = m.createRoot;
	  client.hydrateRoot = m.hydrateRoot;
	}
	return client;
}

var clientExports = requireClient();
const ReactDOM$3 = /*@__PURE__*/getDefaultExportFromCjs(clientExports);

const stateIndexKey = "__TSR_index";
const popStateEvent = "popstate";
const beforeUnloadEvent = "beforeunload";
function createHistory(opts) {
  let location = opts.getLocation();
  const subscribers = /* @__PURE__ */ new Set();
  const notify = (action) => {
    location = opts.getLocation();
    subscribers.forEach((subscriber) => subscriber({ location, action }));
  };
  const handleIndexChange = (action) => {
    if (opts.notifyOnIndexChange ?? true) notify(action);
    else location = opts.getLocation();
  };
  const tryNavigation = async ({
    task,
    navigateOpts,
    ...actionInfo
  }) => {
    var _a, _b;
    const ignoreBlocker = (navigateOpts == null ? undefined : navigateOpts.ignoreBlocker) ?? false;
    if (ignoreBlocker) {
      task();
      return;
    }
    const blockers = ((_a = opts.getBlockers) == null ? undefined : _a.call(opts)) ?? [];
    const isPushOrReplace = actionInfo.type === "PUSH" || actionInfo.type === "REPLACE";
    if (typeof document !== "undefined" && blockers.length && isPushOrReplace) {
      for (const blocker of blockers) {
        const nextLocation = parseHref(actionInfo.path, actionInfo.state);
        const isBlocked = await blocker.blockerFn({
          currentLocation: location,
          nextLocation,
          action: actionInfo.type
        });
        if (isBlocked) {
          (_b = opts.onBlocked) == null ? undefined : _b.call(opts);
          return;
        }
      }
    }
    task();
  };
  return {
    get location() {
      return location;
    },
    get length() {
      return opts.getLength();
    },
    subscribers,
    subscribe: (cb) => {
      subscribers.add(cb);
      return () => {
        subscribers.delete(cb);
      };
    },
    push: (path, state, navigateOpts) => {
      const currentIndex = location.state[stateIndexKey];
      state = assignKeyAndIndex(currentIndex + 1, state);
      tryNavigation({
        task: () => {
          opts.pushState(path, state);
          notify({ type: "PUSH" });
        },
        navigateOpts,
        type: "PUSH",
        path,
        state
      });
    },
    replace: (path, state, navigateOpts) => {
      const currentIndex = location.state[stateIndexKey];
      state = assignKeyAndIndex(currentIndex, state);
      tryNavigation({
        task: () => {
          opts.replaceState(path, state);
          notify({ type: "REPLACE" });
        },
        navigateOpts,
        type: "REPLACE",
        path,
        state
      });
    },
    go: (index, navigateOpts) => {
      tryNavigation({
        task: () => {
          opts.go(index);
          handleIndexChange({ type: "GO", index });
        },
        navigateOpts,
        type: "GO"
      });
    },
    back: (navigateOpts) => {
      tryNavigation({
        task: () => {
          opts.back((navigateOpts == null ? undefined : navigateOpts.ignoreBlocker) ?? false);
          handleIndexChange({ type: "BACK" });
        },
        navigateOpts,
        type: "BACK"
      });
    },
    forward: (navigateOpts) => {
      tryNavigation({
        task: () => {
          opts.forward((navigateOpts == null ? undefined : navigateOpts.ignoreBlocker) ?? false);
          handleIndexChange({ type: "FORWARD" });
        },
        navigateOpts,
        type: "FORWARD"
      });
    },
    canGoBack: () => location.state[stateIndexKey] !== 0,
    createHref: (str) => opts.createHref(str),
    block: (blocker) => {
      var _a;
      if (!opts.setBlockers) return () => {
      };
      const blockers = ((_a = opts.getBlockers) == null ? undefined : _a.call(opts)) ?? [];
      opts.setBlockers([...blockers, blocker]);
      return () => {
        var _a2, _b;
        const blockers2 = ((_a2 = opts.getBlockers) == null ? undefined : _a2.call(opts)) ?? [];
        (_b = opts.setBlockers) == null ? undefined : _b.call(opts, blockers2.filter((b) => b !== blocker));
      };
    },
    flush: () => {
      var _a;
      return (_a = opts.flush) == null ? undefined : _a.call(opts);
    },
    destroy: () => {
      var _a;
      return (_a = opts.destroy) == null ? undefined : _a.call(opts);
    },
    notify
  };
}
function assignKeyAndIndex(index, state) {
  if (!state) {
    state = {};
  }
  return {
    ...state,
    key: createRandomKey(),
    [stateIndexKey]: index
  };
}
function createBrowserHistory(opts) {
  const win = (typeof document !== "undefined" ? window : undefined);
  const originalPushState = win.history.pushState;
  const originalReplaceState = win.history.replaceState;
  let blockers = [];
  const _getBlockers = () => blockers;
  const _setBlockers = (newBlockers) => blockers = newBlockers;
  const createHref = ((path) => path);
  const parseLocation = (() => parseHref(
    `${win.location.pathname}${win.location.search}${win.location.hash}`,
    win.history.state
  ));
  let currentLocation = parseLocation();
  let rollbackLocation;
  let nextPopIsGo = false;
  let ignoreNextPop = false;
  let skipBlockerNextPop = false;
  let ignoreNextBeforeUnload = false;
  const getLocation = () => currentLocation;
  let next;
  let scheduled;
  const flush = () => {
    if (!next) {
      return;
    }
    history._ignoreSubscribers = true;
    (next.isPush ? win.history.pushState : win.history.replaceState)(
      next.state,
      "",
      next.href
    );
    history._ignoreSubscribers = false;
    next = undefined;
    scheduled = undefined;
    rollbackLocation = undefined;
  };
  const queueHistoryAction = (type, destHref, state) => {
    const href = createHref(destHref);
    if (!scheduled) {
      rollbackLocation = currentLocation;
    }
    currentLocation = parseHref(destHref, state);
    next = {
      href,
      state,
      isPush: (next == null ? undefined : next.isPush) || type === "push"
    };
    if (!scheduled) {
      scheduled = Promise.resolve().then(() => flush());
    }
  };
  const onPushPop = (type) => {
    currentLocation = parseLocation();
    history.notify({ type });
  };
  const onPushPopEvent = async () => {
    if (ignoreNextPop) {
      ignoreNextPop = false;
      return;
    }
    const nextLocation = parseLocation();
    const delta = nextLocation.state[stateIndexKey] - currentLocation.state[stateIndexKey];
    const isForward = delta === 1;
    const isBack = delta === -1;
    const isGo = !isForward && !isBack || nextPopIsGo;
    nextPopIsGo = false;
    const action = isGo ? "GO" : isBack ? "BACK" : "FORWARD";
    const notify = isGo ? {
      type: "GO",
      index: delta
    } : {
      type: isBack ? "BACK" : "FORWARD"
    };
    if (skipBlockerNextPop) {
      skipBlockerNextPop = false;
    } else {
      const blockers2 = _getBlockers();
      if (typeof document !== "undefined" && blockers2.length) {
        for (const blocker of blockers2) {
          const isBlocked = await blocker.blockerFn({
            currentLocation,
            nextLocation,
            action
          });
          if (isBlocked) {
            ignoreNextPop = true;
            win.history.go(1);
            history.notify(notify);
            return;
          }
        }
      }
    }
    currentLocation = parseLocation();
    history.notify(notify);
  };
  const onBeforeUnload = (e) => {
    if (ignoreNextBeforeUnload) {
      ignoreNextBeforeUnload = false;
      return;
    }
    let shouldBlock = false;
    const blockers2 = _getBlockers();
    if (typeof document !== "undefined" && blockers2.length) {
      for (const blocker of blockers2) {
        const shouldHaveBeforeUnload = blocker.enableBeforeUnload ?? true;
        if (shouldHaveBeforeUnload === true) {
          shouldBlock = true;
          break;
        }
        if (typeof shouldHaveBeforeUnload === "function" && shouldHaveBeforeUnload() === true) {
          shouldBlock = true;
          break;
        }
      }
    }
    if (shouldBlock) {
      e.preventDefault();
      return e.returnValue = "";
    }
    return;
  };
  const history = createHistory({
    getLocation,
    getLength: () => win.history.length,
    pushState: (href, state) => queueHistoryAction("push", href, state),
    replaceState: (href, state) => queueHistoryAction("replace", href, state),
    back: (ignoreBlocker) => {
      if (ignoreBlocker) skipBlockerNextPop = true;
      ignoreNextBeforeUnload = true;
      return win.history.back();
    },
    forward: (ignoreBlocker) => {
      if (ignoreBlocker) skipBlockerNextPop = true;
      ignoreNextBeforeUnload = true;
      win.history.forward();
    },
    go: (n) => {
      nextPopIsGo = true;
      win.history.go(n);
    },
    createHref: (href) => createHref(href),
    flush,
    destroy: () => {
      win.history.pushState = originalPushState;
      win.history.replaceState = originalReplaceState;
      win.removeEventListener(beforeUnloadEvent, onBeforeUnload, {
        capture: true
      });
      win.removeEventListener(popStateEvent, onPushPopEvent);
    },
    onBlocked: () => {
      if (rollbackLocation && currentLocation !== rollbackLocation) {
        currentLocation = rollbackLocation;
      }
    },
    getBlockers: _getBlockers,
    setBlockers: _setBlockers,
    notifyOnIndexChange: false
  });
  win.addEventListener(beforeUnloadEvent, onBeforeUnload, { capture: true });
  win.addEventListener(popStateEvent, onPushPopEvent);
  win.history.pushState = function(...args) {
    const res = originalPushState.apply(win.history, args);
    if (!history._ignoreSubscribers) onPushPop("PUSH");
    return res;
  };
  win.history.replaceState = function(...args) {
    const res = originalReplaceState.apply(win.history, args);
    if (!history._ignoreSubscribers) onPushPop("REPLACE");
    return res;
  };
  return history;
}
function createMemoryHistory(opts = {
  initialEntries: ["/"]
}) {
  const entries = opts.initialEntries;
  let index = opts.initialIndex ? Math.min(Math.max(opts.initialIndex, 0), entries.length - 1) : entries.length - 1;
  const states = entries.map(
    (_entry, index2) => assignKeyAndIndex(index2, undefined)
  );
  const getLocation = () => parseHref(entries[index], states[index]);
  return createHistory({
    getLocation,
    getLength: () => entries.length,
    pushState: (path, state) => {
      if (index < entries.length - 1) {
        entries.splice(index + 1);
        states.splice(index + 1);
      }
      states.push(state);
      entries.push(path);
      index = Math.max(entries.length - 1, 0);
    },
    replaceState: (path, state) => {
      states[index] = state;
      entries[index] = path;
    },
    back: () => {
      index = Math.max(index - 1, 0);
    },
    forward: () => {
      index = Math.min(index + 1, entries.length - 1);
    },
    go: (n) => {
      index = Math.min(Math.max(index + n, 0), entries.length - 1);
    },
    createHref: (path) => path
  });
}
function parseHref(href, state) {
  const hashIndex = href.indexOf("#");
  const searchIndex = href.indexOf("?");
  return {
    href,
    pathname: href.substring(
      0,
      hashIndex > 0 ? searchIndex > 0 ? Math.min(hashIndex, searchIndex) : hashIndex : searchIndex > 0 ? searchIndex : href.length
    ),
    hash: hashIndex > -1 ? href.substring(hashIndex) : "",
    search: searchIndex > -1 ? href.slice(searchIndex, hashIndex === -1 ? undefined : hashIndex) : "",
    state: state || { [stateIndexKey]: 0 }
  };
}
function createRandomKey() {
  return (Math.random() + 1).toString(36).substring(7);
}

var prefix = "Invariant failed";
function invariant(condition, message) {
  if (condition) {
    return;
  }
  {
    throw new Error(prefix);
  }
}

function warning$1(condition, message) {
}

const React$1N = await importShared('react');

const routerContext = React$1N.createContext(null);
function getRouterContext() {
  if (typeof document === "undefined") {
    return routerContext;
  }
  if (window.__TSR_ROUTER_CONTEXT__) {
    return window.__TSR_ROUTER_CONTEXT__;
  }
  window.__TSR_ROUTER_CONTEXT__ = routerContext;
  return routerContext;
}

const React$1M = await importShared('react');
function useRouter(opts) {
  const value = React$1M.useContext(getRouterContext());
  warning$1(
    !(((opts == null ? undefined : opts.warn) ?? true) && !value));
  return value;
}

var withSelector = {exports: {}};

var withSelector_production = {};

var shim = {exports: {}};

var useSyncExternalStoreShim_production = {};

/**
 * @license React
 * use-sync-external-store-shim.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var hasRequiredUseSyncExternalStoreShim_production;

function requireUseSyncExternalStoreShim_production () {
	if (hasRequiredUseSyncExternalStoreShim_production) return useSyncExternalStoreShim_production;
	hasRequiredUseSyncExternalStoreShim_production = 1;
	var React = requireReact();
	function is(x, y) {
	  return (x === y && (0 !== x || 1 / x === 1 / y)) || (x !== x && y !== y);
	}
	var objectIs = "function" === typeof Object.is ? Object.is : is,
	  useState = React.useState,
	  useEffect = React.useEffect,
	  useLayoutEffect = React.useLayoutEffect,
	  useDebugValue = React.useDebugValue;
	function useSyncExternalStore$2(subscribe, getSnapshot) {
	  var value = getSnapshot(),
	    _useState = useState({ inst: { value: value, getSnapshot: getSnapshot } }),
	    inst = _useState[0].inst,
	    forceUpdate = _useState[1];
	  useLayoutEffect(
	    function () {
	      inst.value = value;
	      inst.getSnapshot = getSnapshot;
	      checkIfSnapshotChanged(inst) && forceUpdate({ inst: inst });
	    },
	    [subscribe, value, getSnapshot]
	  );
	  useEffect(
	    function () {
	      checkIfSnapshotChanged(inst) && forceUpdate({ inst: inst });
	      return subscribe(function () {
	        checkIfSnapshotChanged(inst) && forceUpdate({ inst: inst });
	      });
	    },
	    [subscribe]
	  );
	  useDebugValue(value);
	  return value;
	}
	function checkIfSnapshotChanged(inst) {
	  var latestGetSnapshot = inst.getSnapshot;
	  inst = inst.value;
	  try {
	    var nextValue = latestGetSnapshot();
	    return !objectIs(inst, nextValue);
	  } catch (error) {
	    return true;
	  }
	}
	function useSyncExternalStore$1(subscribe, getSnapshot) {
	  return getSnapshot();
	}
	var shim =
	  "undefined" === typeof window ||
	  "undefined" === typeof window.document ||
	  "undefined" === typeof window.document.createElement
	    ? useSyncExternalStore$1
	    : useSyncExternalStore$2;
	useSyncExternalStoreShim_production.useSyncExternalStore =
	  undefined !== React.useSyncExternalStore ? React.useSyncExternalStore : shim;
	return useSyncExternalStoreShim_production;
}

var hasRequiredShim;

function requireShim () {
	if (hasRequiredShim) return shim.exports;
	hasRequiredShim = 1;
	{
	  shim.exports = requireUseSyncExternalStoreShim_production();
	}
	return shim.exports;
}

/**
 * @license React
 * use-sync-external-store-shim/with-selector.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var hasRequiredWithSelector_production;

function requireWithSelector_production () {
	if (hasRequiredWithSelector_production) return withSelector_production;
	hasRequiredWithSelector_production = 1;
	var React = requireReact(),
	  shim = requireShim();
	function is(x, y) {
	  return (x === y && (0 !== x || 1 / x === 1 / y)) || (x !== x && y !== y);
	}
	var objectIs = "function" === typeof Object.is ? Object.is : is,
	  useSyncExternalStore = shim.useSyncExternalStore,
	  useRef = React.useRef,
	  useEffect = React.useEffect,
	  useMemo = React.useMemo,
	  useDebugValue = React.useDebugValue;
	withSelector_production.useSyncExternalStoreWithSelector = function (
	  subscribe,
	  getSnapshot,
	  getServerSnapshot,
	  selector,
	  isEqual
	) {
	  var instRef = useRef(null);
	  if (null === instRef.current) {
	    var inst = { hasValue: false, value: null };
	    instRef.current = inst;
	  } else inst = instRef.current;
	  instRef = useMemo(
	    function () {
	      function memoizedSelector(nextSnapshot) {
	        if (!hasMemo) {
	          hasMemo = true;
	          memoizedSnapshot = nextSnapshot;
	          nextSnapshot = selector(nextSnapshot);
	          if (undefined !== isEqual && inst.hasValue) {
	            var currentSelection = inst.value;
	            if (isEqual(currentSelection, nextSnapshot))
	              return (memoizedSelection = currentSelection);
	          }
	          return (memoizedSelection = nextSnapshot);
	        }
	        currentSelection = memoizedSelection;
	        if (objectIs(memoizedSnapshot, nextSnapshot)) return currentSelection;
	        var nextSelection = selector(nextSnapshot);
	        if (undefined !== isEqual && isEqual(currentSelection, nextSelection))
	          return (memoizedSnapshot = nextSnapshot), currentSelection;
	        memoizedSnapshot = nextSnapshot;
	        return (memoizedSelection = nextSelection);
	      }
	      var hasMemo = false,
	        memoizedSnapshot,
	        memoizedSelection,
	        maybeGetServerSnapshot =
	          undefined === getServerSnapshot ? null : getServerSnapshot;
	      return [
	        function () {
	          return memoizedSelector(getSnapshot());
	        },
	        null === maybeGetServerSnapshot
	          ? undefined
	          : function () {
	              return memoizedSelector(maybeGetServerSnapshot());
	            }
	      ];
	    },
	    [getSnapshot, getServerSnapshot, selector, isEqual]
	  );
	  var value = useSyncExternalStore(subscribe, instRef[0], instRef[1]);
	  useEffect(
	    function () {
	      inst.hasValue = true;
	      inst.value = value;
	    },
	    [value]
	  );
	  useDebugValue(value);
	  return value;
	};
	return withSelector_production;
}

var hasRequiredWithSelector;

function requireWithSelector () {
	if (hasRequiredWithSelector) return withSelector.exports;
	hasRequiredWithSelector = 1;
	{
	  withSelector.exports = requireWithSelector_production();
	}
	return withSelector.exports;
}

var withSelectorExports = requireWithSelector();

const __storeToDerived = /* @__PURE__ */ new WeakMap();
const __derivedToStore = /* @__PURE__ */ new WeakMap();
const __depsThatHaveWrittenThisTick = {
  current: []
};
let __isFlushing = false;
let __batchDepth = 0;
const __pendingUpdates = /* @__PURE__ */ new Set();
const __initialBatchValues = /* @__PURE__ */ new Map();
function __flush_internals(relatedVals) {
  const sorted = Array.from(relatedVals).sort((a, b) => {
    if (a instanceof Derived && a.options.deps.includes(b)) return 1;
    if (b instanceof Derived && b.options.deps.includes(a)) return -1;
    return 0;
  });
  for (const derived of sorted) {
    if (__depsThatHaveWrittenThisTick.current.includes(derived)) {
      continue;
    }
    __depsThatHaveWrittenThisTick.current.push(derived);
    derived.recompute();
    const stores = __derivedToStore.get(derived);
    if (stores) {
      for (const store of stores) {
        const relatedLinkedDerivedVals = __storeToDerived.get(store);
        if (!relatedLinkedDerivedVals) continue;
        __flush_internals(relatedLinkedDerivedVals);
      }
    }
  }
}
function __notifyListeners(store) {
  store.listeners.forEach(
    (listener) => listener({
      prevVal: store.prevState,
      currentVal: store.state
    })
  );
}
function __notifyDerivedListeners(derived) {
  derived.listeners.forEach(
    (listener) => listener({
      prevVal: derived.prevState,
      currentVal: derived.state
    })
  );
}
function __flush(store) {
  if (__batchDepth > 0 && !__initialBatchValues.has(store)) {
    __initialBatchValues.set(store, store.prevState);
  }
  __pendingUpdates.add(store);
  if (__batchDepth > 0) return;
  if (__isFlushing) return;
  try {
    __isFlushing = true;
    while (__pendingUpdates.size > 0) {
      const stores = Array.from(__pendingUpdates);
      __pendingUpdates.clear();
      for (const store2 of stores) {
        const prevState = __initialBatchValues.get(store2) ?? store2.prevState;
        store2.prevState = prevState;
        __notifyListeners(store2);
      }
      for (const store2 of stores) {
        const derivedVals = __storeToDerived.get(store2);
        if (!derivedVals) continue;
        __depsThatHaveWrittenThisTick.current.push(store2);
        __flush_internals(derivedVals);
      }
      for (const store2 of stores) {
        const derivedVals = __storeToDerived.get(store2);
        if (!derivedVals) continue;
        for (const derived of derivedVals) {
          __notifyDerivedListeners(derived);
        }
      }
    }
  } finally {
    __isFlushing = false;
    __depsThatHaveWrittenThisTick.current = [];
    __initialBatchValues.clear();
  }
}
function batch(fn) {
  __batchDepth++;
  try {
    fn();
  } finally {
    __batchDepth--;
    if (__batchDepth === 0) {
      const pendingUpdateToFlush = Array.from(__pendingUpdates)[0];
      if (pendingUpdateToFlush) {
        __flush(pendingUpdateToFlush);
      }
    }
  }
}

class Store {
  constructor(initialState, options) {
    this.listeners = /* @__PURE__ */ new Set();
    this.subscribe = (listener) => {
      var _a, _b;
      this.listeners.add(listener);
      const unsub = (_b = (_a = this.options) == null ? undefined : _a.onSubscribe) == null ? undefined : _b.call(_a, listener, this);
      return () => {
        this.listeners.delete(listener);
        unsub == null ? undefined : unsub();
      };
    };
    this.setState = (updater) => {
      var _a, _b, _c;
      this.prevState = this.state;
      this.state = ((_a = this.options) == null ? undefined : _a.updateFn) ? this.options.updateFn(this.prevState)(updater) : updater(this.prevState);
      (_c = (_b = this.options) == null ? undefined : _b.onUpdate) == null ? undefined : _c.call(_b);
      __flush(this);
    };
    this.prevState = initialState;
    this.state = initialState;
    this.options = options;
  }
}

class Derived {
  constructor(options) {
    this.listeners = /* @__PURE__ */ new Set();
    this._subscriptions = [];
    this.lastSeenDepValues = [];
    this.getDepVals = () => {
      const prevDepVals = [];
      const currDepVals = [];
      for (const dep of this.options.deps) {
        prevDepVals.push(dep.prevState);
        currDepVals.push(dep.state);
      }
      this.lastSeenDepValues = currDepVals;
      return {
        prevDepVals,
        currDepVals,
        prevVal: this.prevState ?? undefined
      };
    };
    this.recompute = () => {
      var _a, _b;
      this.prevState = this.state;
      const { prevDepVals, currDepVals, prevVal } = this.getDepVals();
      this.state = this.options.fn({
        prevDepVals,
        currDepVals,
        prevVal
      });
      (_b = (_a = this.options).onUpdate) == null ? undefined : _b.call(_a);
    };
    this.checkIfRecalculationNeededDeeply = () => {
      for (const dep of this.options.deps) {
        if (dep instanceof Derived) {
          dep.checkIfRecalculationNeededDeeply();
        }
      }
      let shouldRecompute = false;
      const lastSeenDepValues = this.lastSeenDepValues;
      const { currDepVals } = this.getDepVals();
      for (let i = 0; i < currDepVals.length; i++) {
        if (currDepVals[i] !== lastSeenDepValues[i]) {
          shouldRecompute = true;
          break;
        }
      }
      if (shouldRecompute) {
        this.recompute();
      }
    };
    this.mount = () => {
      this.registerOnGraph();
      this.checkIfRecalculationNeededDeeply();
      return () => {
        this.unregisterFromGraph();
        for (const cleanup of this._subscriptions) {
          cleanup();
        }
      };
    };
    this.subscribe = (listener) => {
      var _a, _b;
      this.listeners.add(listener);
      const unsub = (_b = (_a = this.options).onSubscribe) == null ? undefined : _b.call(_a, listener, this);
      return () => {
        this.listeners.delete(listener);
        unsub == null ? undefined : unsub();
      };
    };
    this.options = options;
    this.state = options.fn({
      prevDepVals: undefined,
      prevVal: undefined,
      currDepVals: this.getDepVals().currDepVals
    });
  }
  registerOnGraph(deps = this.options.deps) {
    for (const dep of deps) {
      if (dep instanceof Derived) {
        dep.registerOnGraph();
        this.registerOnGraph(dep.options.deps);
      } else if (dep instanceof Store) {
        let relatedLinkedDerivedVals = __storeToDerived.get(dep);
        if (!relatedLinkedDerivedVals) {
          relatedLinkedDerivedVals = /* @__PURE__ */ new Set();
          __storeToDerived.set(dep, relatedLinkedDerivedVals);
        }
        relatedLinkedDerivedVals.add(this);
        let relatedStores = __derivedToStore.get(this);
        if (!relatedStores) {
          relatedStores = /* @__PURE__ */ new Set();
          __derivedToStore.set(this, relatedStores);
        }
        relatedStores.add(dep);
      }
    }
  }
  unregisterFromGraph(deps = this.options.deps) {
    for (const dep of deps) {
      if (dep instanceof Derived) {
        this.unregisterFromGraph(dep.options.deps);
      } else if (dep instanceof Store) {
        const relatedLinkedDerivedVals = __storeToDerived.get(dep);
        if (relatedLinkedDerivedVals) {
          relatedLinkedDerivedVals.delete(this);
        }
        const relatedStores = __derivedToStore.get(this);
        if (relatedStores) {
          relatedStores.delete(dep);
        }
      }
    }
  }
}

function useStore(store, selector = (d) => d) {
  const slice = withSelectorExports.useSyncExternalStoreWithSelector(
    store.subscribe,
    () => store.state,
    () => store.state,
    selector,
    shallow
  );
  return slice;
}
function shallow(objA, objB) {
  if (Object.is(objA, objB)) {
    return true;
  }
  if (typeof objA !== "object" || objA === null || typeof objB !== "object" || objB === null) {
    return false;
  }
  if (objA instanceof Map && objB instanceof Map) {
    if (objA.size !== objB.size) return false;
    for (const [k, v] of objA) {
      if (!objB.has(k) || !Object.is(v, objB.get(k))) return false;
    }
    return true;
  }
  if (objA instanceof Set && objB instanceof Set) {
    if (objA.size !== objB.size) return false;
    for (const v of objA) {
      if (!objB.has(v)) return false;
    }
    return true;
  }
  const keysA = Object.keys(objA);
  if (keysA.length !== Object.keys(objB).length) {
    return false;
  }
  for (let i = 0; i < keysA.length; i++) {
    if (!Object.prototype.hasOwnProperty.call(objB, keysA[i]) || !Object.is(objA[keysA[i]], objB[keysA[i]])) {
      return false;
    }
  }
  return true;
}

var jsesc_1;
var hasRequiredJsesc;

function requireJsesc () {
	if (hasRequiredJsesc) return jsesc_1;
	hasRequiredJsesc = 1;

	const object = {};
	const hasOwnProperty = object.hasOwnProperty;
	const forOwn = (object, callback) => {
		for (const key in object) {
			if (hasOwnProperty.call(object, key)) {
				callback(key, object[key]);
			}
		}
	};

	const extend = (destination, source) => {
		if (!source) {
			return destination;
		}
		forOwn(source, (key, value) => {
			destination[key] = value;
		});
		return destination;
	};

	const forEach = (array, callback) => {
		const length = array.length;
		let index = -1;
		while (++index < length) {
			callback(array[index]);
		}
	};

	const fourHexEscape = (hex) => {
		return '\\u' + ('0000' + hex).slice(-4);
	};

	const hexadecimal = (code, lowercase) => {
		let hexadecimal = code.toString(16);
		if (lowercase) return hexadecimal;
		return hexadecimal.toUpperCase();
	};

	const toString = object.toString;
	const isArray = Array.isArray;
	const isBuffer = (value) => {
		return typeof Buffer === 'function' && Buffer.isBuffer(value);
	};
	const isObject = (value) => {
		// This is a very simple check, but it’s good enough for what we need.
		return toString.call(value) == '[object Object]';
	};
	const isString = (value) => {
		return typeof value == 'string' ||
			toString.call(value) == '[object String]';
	};
	const isNumber = (value) => {
		return typeof value == 'number' ||
			toString.call(value) == '[object Number]';
	};
	const isBigInt = (value) => {
	  return typeof value == 'bigint';
	};
	const isFunction = (value) => {
		return typeof value == 'function';
	};
	const isMap = (value) => {
		return toString.call(value) == '[object Map]';
	};
	const isSet = (value) => {
		return toString.call(value) == '[object Set]';
	};

	/*--------------------------------------------------------------------------*/

	// https://mathiasbynens.be/notes/javascript-escapes#single
	const singleEscapes = {
		'\\': '\\\\',
		'\b': '\\b',
		'\f': '\\f',
		'\n': '\\n',
		'\r': '\\r',
		'\t': '\\t'
		// `\v` is omitted intentionally, because in IE < 9, '\v' == 'v'.
		// '\v': '\\x0B'
	};
	const regexSingleEscape = /[\\\b\f\n\r\t]/;

	const regexDigit = /[0-9]/;
	const regexWhitespace = /[\xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000]/;

	const escapeEverythingRegex = /([\uD800-\uDBFF][\uDC00-\uDFFF])|([\uD800-\uDFFF])|(['"`])|[^]/g;
	const escapeNonAsciiRegex = /([\uD800-\uDBFF][\uDC00-\uDFFF])|([\uD800-\uDFFF])|(['"`])|[^ !#-&\(-\[\]-_a-~]/g;

	const jsesc = (argument, options) => {
		const increaseIndentation = () => {
			oldIndent = indent;
			++options.indentLevel;
			indent = options.indent.repeat(options.indentLevel);
		};
		// Handle options
		const defaults = {
			'escapeEverything': false,
			'minimal': false,
			'isScriptContext': false,
			'quotes': 'single',
			'wrap': false,
			'es6': false,
			'json': false,
			'compact': true,
			'lowercaseHex': false,
			'numbers': 'decimal',
			'indent': '\t',
			'indentLevel': 0,
			'__inline1__': false,
			'__inline2__': false
		};
		const json = options && options.json;
		if (json) {
			defaults.quotes = 'double';
			defaults.wrap = true;
		}
		options = extend(defaults, options);
		if (
			options.quotes != 'single' &&
			options.quotes != 'double' &&
			options.quotes != 'backtick'
		) {
			options.quotes = 'single';
		}
		const quote = options.quotes == 'double' ?
			'"' :
			(options.quotes == 'backtick' ?
				'`' :
				'\''
			);
		const compact = options.compact;
		const lowercaseHex = options.lowercaseHex;
		let indent = options.indent.repeat(options.indentLevel);
		let oldIndent = '';
		const inline1 = options.__inline1__;
		const inline2 = options.__inline2__;
		const newLine = compact ? '' : '\n';
		let result;
		let isEmpty = true;
		const useBinNumbers = options.numbers == 'binary';
		const useOctNumbers = options.numbers == 'octal';
		const useDecNumbers = options.numbers == 'decimal';
		const useHexNumbers = options.numbers == 'hexadecimal';

		if (json && argument && isFunction(argument.toJSON)) {
			argument = argument.toJSON();
		}

		if (!isString(argument)) {
			if (isMap(argument)) {
				if (argument.size == 0) {
					return 'new Map()';
				}
				if (!compact) {
					options.__inline1__ = true;
					options.__inline2__ = false;
				}
				return 'new Map(' + jsesc(Array.from(argument), options) + ')';
			}
			if (isSet(argument)) {
				if (argument.size == 0) {
					return 'new Set()';
				}
				return 'new Set(' + jsesc(Array.from(argument), options) + ')';
			}
			if (isBuffer(argument)) {
				if (argument.length == 0) {
					return 'Buffer.from([])';
				}
				return 'Buffer.from(' + jsesc(Array.from(argument), options) + ')';
			}
			if (isArray(argument)) {
				result = [];
				options.wrap = true;
				if (inline1) {
					options.__inline1__ = false;
					options.__inline2__ = true;
				}
				if (!inline2) {
					increaseIndentation();
				}
				forEach(argument, (value) => {
					isEmpty = false;
					if (inline2) {
						options.__inline2__ = false;
					}
					result.push(
						(compact || inline2 ? '' : indent) +
						jsesc(value, options)
					);
				});
				if (isEmpty) {
					return '[]';
				}
				if (inline2) {
					return '[' + result.join(', ') + ']';
				}
				return '[' + newLine + result.join(',' + newLine) + newLine +
					(compact ? '' : oldIndent) + ']';
			} else if (isNumber(argument) || isBigInt(argument)) {
				if (json) {
					// Some number values (e.g. `Infinity`) cannot be represented in JSON.
					// `BigInt` values less than `-Number.MAX_VALUE` or greater than
	        // `Number.MAX_VALUE` cannot be represented in JSON so they will become
	        // `-Infinity` or `Infinity`, respectively, and then become `null` when
	        // stringified.
					return JSON.stringify(Number(argument));
				}

	      let result;
				if (useDecNumbers) {
					result = String(argument);
				} else if (useHexNumbers) {
					let hexadecimal = argument.toString(16);
					if (!lowercaseHex) {
						hexadecimal = hexadecimal.toUpperCase();
					}
					result = '0x' + hexadecimal;
				} else if (useBinNumbers) {
					result = '0b' + argument.toString(2);
				} else if (useOctNumbers) {
					result = '0o' + argument.toString(8);
				}

	      if (isBigInt(argument)) {
	        return result + 'n';
	      }
	      return result;
			} else if (isBigInt(argument)) {
				if (json) {
					// `BigInt` values less than `-Number.MAX_VALUE` or greater than
	        // `Number.MAX_VALUE` will become `-Infinity` or `Infinity`,
	        // respectively, and cannot be represented in JSON.
					return JSON.stringify(Number(argument));
				}
	      return argument + 'n';
	    } else if (!isObject(argument)) {
				if (json) {
					// For some values (e.g. `undefined`, `function` objects),
					// `JSON.stringify(value)` returns `undefined` (which isn’t valid
					// JSON) instead of `'null'`.
					return JSON.stringify(argument) || 'null';
				}
				return String(argument);
			} else { // it’s an object
				result = [];
				options.wrap = true;
				increaseIndentation();
				forOwn(argument, (key, value) => {
					isEmpty = false;
					result.push(
						(compact ? '' : indent) +
						jsesc(key, options) + ':' +
						(compact ? '' : ' ') +
						jsesc(value, options)
					);
				});
				if (isEmpty) {
					return '{}';
				}
				return '{' + newLine + result.join(',' + newLine) + newLine +
					(compact ? '' : oldIndent) + '}';
			}
		}

		const regex = options.escapeEverything ? escapeEverythingRegex : escapeNonAsciiRegex;
		result = argument.replace(regex, (char, pair, lone, quoteChar, index, string) => {
			if (pair) {
				if (options.minimal) return pair;
				const first = pair.charCodeAt(0);
				const second = pair.charCodeAt(1);
				if (options.es6) {
					// https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
					const codePoint = (first - 0xD800) * 0x400 + second - 0xDC00 + 0x10000;
					const hex = hexadecimal(codePoint, lowercaseHex);
					return '\\u{' + hex + '}';
				}
				return fourHexEscape(hexadecimal(first, lowercaseHex)) + fourHexEscape(hexadecimal(second, lowercaseHex));
			}

			if (lone) {
				return fourHexEscape(hexadecimal(lone.charCodeAt(0), lowercaseHex));
			}

			if (
				char == '\0' &&
				!json &&
				!regexDigit.test(string.charAt(index + 1))
			) {
				return '\\0';
			}

			if (quoteChar) {
				if (quoteChar == quote || options.escapeEverything) {
					return '\\' + quoteChar;
				}
				return quoteChar;
			}

			if (regexSingleEscape.test(char)) {
				// no need for a `hasOwnProperty` check here
				return singleEscapes[char];
			}

			if (options.minimal && !regexWhitespace.test(char)) {
				return char;
			}

			const hex = hexadecimal(char.charCodeAt(0), lowercaseHex);
			if (json || hex.length > 2) {
				return fourHexEscape(hex);
			}

			return '\\x' + ('00' + hex).slice(-2);
		});

		if (quote == '`') {
			result = result.replace(/\$\{/g, '\\${');
		}
		if (options.isScriptContext) {
			// https://mathiasbynens.be/notes/etago
			result = result
				.replace(/<\/(script|style)/gi, '<\\/$1')
				.replace(/<!--/g, json ? '\\u003C!--' : '\\x3C!--');
		}
		if (options.wrap) {
			result = quote + result + quote;
		}
		return result;
	};

	jsesc.version = '3.0.2';

	jsesc_1 = jsesc;
	return jsesc_1;
}

requireJsesc();

const rootRouteId = "__root__";

function encode(obj, pfx) {
  let k, i, tmp, str = "";
  for (k in obj) {
    if ((tmp = obj[k]) !== undefined) {
      if (Array.isArray(tmp)) {
        for (i = 0; i < tmp.length; i++) {
          str && (str += "&");
          str += encodeURIComponent(k) + "=" + encodeURIComponent(tmp[i]);
        }
      } else {
        str && (str += "&");
        str += encodeURIComponent(k) + "=" + encodeURIComponent(tmp);
      }
    }
  }
  return ("") + str;
}
function toValue(mix) {
  if (!mix) return "";
  const str = decodeURIComponent(mix);
  if (str === "false") return false;
  if (str === "true") return true;
  return +str * 0 === 0 && +str + "" === str ? +str : str;
}
function decode(str, pfx) {
  let tmp, k;
  const out = {}, arr = (str).split("&");
  while (tmp = arr.shift()) {
    const equalIndex = tmp.indexOf("=");
    if (equalIndex !== -1) {
      k = tmp.slice(0, equalIndex);
      k = decodeURIComponent(k);
      const value = tmp.slice(equalIndex + 1);
      if (out[k] !== undefined) {
        out[k] = [].concat(out[k], toValue(value));
      } else {
        out[k] = toValue(value);
      }
    } else {
      k = tmp;
      k = decodeURIComponent(k);
      out[k] = "";
    }
  }
  return out;
}

const defaultParseSearch = parseSearchWith(JSON.parse);
const defaultStringifySearch = stringifySearchWith(
  JSON.stringify,
  JSON.parse
);
function parseSearchWith(parser) {
  return (searchStr) => {
    if (searchStr.substring(0, 1) === "?") {
      searchStr = searchStr.substring(1);
    }
    const query = decode(searchStr);
    for (const key in query) {
      const value = query[key];
      if (typeof value === "string") {
        try {
          query[key] = parser(value);
        } catch (err) {
        }
      }
    }
    return query;
  };
}
function stringifySearchWith(stringify, parser) {
  function stringifyValue(val) {
    if (typeof val === "object" && val !== null) {
      try {
        return stringify(val);
      } catch (err) {
      }
    } else if (typeof val === "string" && typeof parser === "function") {
      try {
        parser(val);
        return stringify(val);
      } catch (err) {
      }
    }
    return val;
  }
  return (search) => {
    search = { ...search };
    Object.keys(search).forEach((key) => {
      const val = search[key];
      if (typeof val === "undefined" || val === undefined) {
        delete search[key];
      } else {
        search[key] = stringifyValue(val);
      }
    });
    const searchStr = encode(search).toString();
    return searchStr ? `?${searchStr}` : "";
  };
}

const React$1L = await importShared('react');

function last(arr) {
  return arr[arr.length - 1];
}
function isFunction(d) {
  return typeof d === "function";
}
function functionalUpdate(updater, previous) {
  if (isFunction(updater)) {
    return updater(previous);
  }
  return updater;
}
function pick(parent, keys) {
  return keys.reduce((obj, key) => {
    obj[key] = parent[key];
    return obj;
  }, {});
}
function replaceEqualDeep(prev, _next) {
  if (prev === _next) {
    return prev;
  }
  const next = _next;
  const array = isPlainArray(prev) && isPlainArray(next);
  if (array || isPlainObject(prev) && isPlainObject(next)) {
    const prevItems = array ? prev : Object.keys(prev);
    const prevSize = prevItems.length;
    const nextItems = array ? next : Object.keys(next);
    const nextSize = nextItems.length;
    const copy = array ? [] : {};
    let equalItems = 0;
    for (let i = 0; i < nextSize; i++) {
      const key = array ? i : nextItems[i];
      if ((!array && prevItems.includes(key) || array) && prev[key] === undefined && next[key] === undefined) {
        copy[key] = undefined;
        equalItems++;
      } else {
        copy[key] = replaceEqualDeep(prev[key], next[key]);
        if (copy[key] === prev[key] && prev[key] !== undefined) {
          equalItems++;
        }
      }
    }
    return prevSize === nextSize && equalItems === prevSize ? prev : copy;
  }
  return next;
}
function isPlainObject(o) {
  if (!hasObjectPrototype(o)) {
    return false;
  }
  const ctor = o.constructor;
  if (typeof ctor === "undefined") {
    return true;
  }
  const prot = ctor.prototype;
  if (!hasObjectPrototype(prot)) {
    return false;
  }
  if (!prot.hasOwnProperty("isPrototypeOf")) {
    return false;
  }
  return true;
}
function hasObjectPrototype(o) {
  return Object.prototype.toString.call(o) === "[object Object]";
}
function isPlainArray(value) {
  return Array.isArray(value) && value.length === Object.keys(value).length;
}
function getObjectKeys(obj, ignoreUndefined) {
  let keys = Object.keys(obj);
  if (ignoreUndefined) {
    keys = keys.filter((key) => obj[key] !== undefined);
  }
  return keys;
}
function deepEqual(a, b, opts) {
  if (a === b) {
    return true;
  }
  if (typeof a !== typeof b) {
    return false;
  }
  if (isPlainObject(a) && isPlainObject(b)) {
    const ignoreUndefined = (opts == null ? undefined : opts.ignoreUndefined) ?? true;
    const aKeys = getObjectKeys(a, ignoreUndefined);
    const bKeys = getObjectKeys(b, ignoreUndefined);
    if (!(opts == null ? undefined : opts.partial) && aKeys.length !== bKeys.length) {
      return false;
    }
    return bKeys.every((key) => deepEqual(a[key], b[key], opts));
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) {
      return false;
    }
    return !a.some((item, index) => !deepEqual(item, b[index], opts));
  }
  return false;
}
const useLayoutEffect$2 = typeof window !== "undefined" ? React$1L.useLayoutEffect : React$1L.useEffect;
function createControlledPromise(onResolve) {
  let resolveLoadPromise;
  let rejectLoadPromise;
  const controlledPromise = new Promise((resolve, reject) => {
    resolveLoadPromise = resolve;
    rejectLoadPromise = reject;
  });
  controlledPromise.status = "pending";
  controlledPromise.resolve = (value) => {
    controlledPromise.status = "resolved";
    controlledPromise.value = value;
    resolveLoadPromise(value);
    onResolve == null ? undefined : onResolve(value);
  };
  controlledPromise.reject = (e) => {
    controlledPromise.status = "rejected";
    rejectLoadPromise(e);
  };
  return controlledPromise;
}
function usePrevious$1(value) {
  const ref = React$1L.useRef({
    value,
    prev: null
  });
  const current = ref.current.value;
  if (value !== current) {
    ref.current = {
      value,
      prev: current
    };
  }
  return ref.current.prev;
}
function useIntersectionObserver(ref, callback, intersectionObserverOptions = {}, options = {}) {
  const isIntersectionObserverAvailable = React$1L.useRef(
    typeof IntersectionObserver === "function"
  );
  const observerRef = React$1L.useRef(null);
  React$1L.useEffect(() => {
    if (!ref.current || !isIntersectionObserverAvailable.current || options.disabled) {
      return;
    }
    observerRef.current = new IntersectionObserver(([entry]) => {
      callback(entry);
    }, intersectionObserverOptions);
    observerRef.current.observe(ref.current);
    return () => {
      var _a;
      (_a = observerRef.current) == null ? undefined : _a.disconnect();
    };
  }, [callback, intersectionObserverOptions, options.disabled, ref]);
  return observerRef.current;
}
function useForwardedRef(ref) {
  const innerRef = React$1L.useRef(null);
  React$1L.useEffect(() => {
    if (!ref) return;
    if (typeof ref === "function") {
      ref(innerRef.current);
    } else {
      ref.current = innerRef.current;
    }
  });
  return innerRef;
}

function joinPaths(paths) {
  return cleanPath(
    paths.filter((val) => {
      return val !== undefined;
    }).join("/")
  );
}
function cleanPath(path) {
  return path.replace(/\/{2,}/g, "/");
}
function trimPathLeft(path) {
  return path === "/" ? path : path.replace(/^\/{1,}/, "");
}
function trimPathRight(path) {
  return path === "/" ? path : path.replace(/\/{1,}$/, "");
}
function trimPath(path) {
  return trimPathRight(trimPathLeft(path));
}
function removeTrailingSlash(value, basepath) {
  if (value.endsWith("/") && value !== "/" && value !== `${basepath}/`) {
    return value.slice(0, -1);
  }
  return value;
}
function exactPathTest(pathName1, pathName2, basepath) {
  return removeTrailingSlash(pathName1, basepath) === removeTrailingSlash(pathName2, basepath);
}
function resolvePath({
  basepath,
  base,
  to,
  trailingSlash = "never",
  caseSensitive
}) {
  var _a, _b;
  base = removeBasepath(basepath, base, caseSensitive);
  to = removeBasepath(basepath, to, caseSensitive);
  let baseSegments = parsePathname(base);
  const toSegments = parsePathname(to);
  if (baseSegments.length > 1 && ((_a = last(baseSegments)) == null ? undefined : _a.value) === "/") {
    baseSegments.pop();
  }
  toSegments.forEach((toSegment, index) => {
    if (toSegment.value === "/") {
      if (!index) {
        baseSegments = [toSegment];
      } else if (index === toSegments.length - 1) {
        baseSegments.push(toSegment);
      } else ;
    } else if (toSegment.value === "..") {
      baseSegments.pop();
    } else if (toSegment.value === ".") ;
    else {
      baseSegments.push(toSegment);
    }
  });
  if (baseSegments.length > 1) {
    if (((_b = last(baseSegments)) == null ? undefined : _b.value) === "/") {
      if (trailingSlash === "never") {
        baseSegments.pop();
      }
    } else if (trailingSlash === "always") {
      baseSegments.push({ type: "pathname", value: "/" });
    }
  }
  const joined = joinPaths([basepath, ...baseSegments.map((d) => d.value)]);
  return cleanPath(joined);
}
function parsePathname(pathname) {
  if (!pathname) {
    return [];
  }
  pathname = cleanPath(pathname);
  const segments = [];
  if (pathname.slice(0, 1) === "/") {
    pathname = pathname.substring(1);
    segments.push({
      type: "pathname",
      value: "/"
    });
  }
  if (!pathname) {
    return segments;
  }
  const split = pathname.split("/").filter(Boolean);
  segments.push(
    ...split.map((part) => {
      if (part === "$" || part === "*") {
        return {
          type: "wildcard",
          value: part
        };
      }
      if (part.charAt(0) === "$") {
        return {
          type: "param",
          value: part
        };
      }
      return {
        type: "pathname",
        value: decodeURI(part)
      };
    })
  );
  if (pathname.slice(-1) === "/") {
    pathname = pathname.substring(1);
    segments.push({
      type: "pathname",
      value: "/"
    });
  }
  return segments;
}
function interpolatePath({
  path,
  params,
  leaveWildcards,
  leaveParams,
  decodeCharMap
}) {
  const interpolatedPathSegments = parsePathname(path);
  const encodedParams = {};
  for (const [key, value] of Object.entries(params)) {
    const isValueString = typeof value === "string";
    if (["*", "_splat"].includes(key)) {
      encodedParams[key] = isValueString ? encodeURI(value) : value;
    } else {
      encodedParams[key] = isValueString ? encodePathParam(value, decodeCharMap) : value;
    }
  }
  return joinPaths(
    interpolatedPathSegments.map((segment) => {
      if (segment.type === "wildcard") {
        const value = encodedParams._splat;
        if (leaveWildcards) return `${segment.value}${value ?? ""}`;
        return value;
      }
      if (segment.type === "param") {
        if (leaveParams) {
          const value = encodedParams[segment.value];
          return `${segment.value}${value ?? ""}`;
        }
        return encodedParams[segment.value.substring(1)] ?? "undefined";
      }
      return segment.value;
    })
  );
}
function encodePathParam(value, decodeCharMap) {
  let encoded = encodeURIComponent(value);
  if (decodeCharMap) {
    for (const [encodedChar, char] of decodeCharMap) {
      encoded = encoded.replaceAll(encodedChar, char);
    }
  }
  return encoded;
}
function matchPathname(basepath, currentPathname, matchLocation) {
  const pathParams = matchByPath(basepath, currentPathname, matchLocation);
  if (matchLocation.to && !pathParams) {
    return;
  }
  return pathParams ?? {};
}
function removeBasepath(basepath, pathname, caseSensitive = false) {
  const normalizedBasepath = caseSensitive ? basepath : basepath.toLowerCase();
  const normalizedPathname = caseSensitive ? pathname : pathname.toLowerCase();
  switch (true) {
    // default behaviour is to serve app from the root - pathname
    // left untouched
    case normalizedBasepath === "/":
      return pathname;
    // shortcut for removing the basepath if it matches the pathname
    case normalizedPathname === normalizedBasepath:
      return "";
    // in case pathname is shorter than basepath - there is
    // nothing to remove
    case pathname.length < basepath.length:
      return pathname;
    // avoid matching partial segments - strict equality handled
    // earlier, otherwise, basepath separated from pathname with
    // separator, therefore lack of separator means partial
    // segment match (`/app` should not match `/application`)
    case normalizedPathname[normalizedBasepath.length] !== "/":
      return pathname;
    // remove the basepath from the pathname if it starts with it
    case normalizedPathname.startsWith(normalizedBasepath):
      return pathname.slice(basepath.length);
    // otherwise, return the pathname as is
    default:
      return pathname;
  }
}
function matchByPath(basepath, from, matchLocation) {
  if (basepath !== "/" && !from.startsWith(basepath)) {
    return undefined;
  }
  from = removeBasepath(basepath, from, matchLocation.caseSensitive);
  const to = removeBasepath(
    basepath,
    `${matchLocation.to ?? "$"}`,
    matchLocation.caseSensitive
  );
  const baseSegments = parsePathname(from);
  const routeSegments = parsePathname(to);
  if (!from.startsWith("/")) {
    baseSegments.unshift({
      type: "pathname",
      value: "/"
    });
  }
  if (!to.startsWith("/")) {
    routeSegments.unshift({
      type: "pathname",
      value: "/"
    });
  }
  const params = {};
  const isMatch = (() => {
    for (let i = 0; i < Math.max(baseSegments.length, routeSegments.length); i++) {
      const baseSegment = baseSegments[i];
      const routeSegment = routeSegments[i];
      const isLastBaseSegment = i >= baseSegments.length - 1;
      const isLastRouteSegment = i >= routeSegments.length - 1;
      if (routeSegment) {
        if (routeSegment.type === "wildcard") {
          const _splat = decodeURI(
            joinPaths(baseSegments.slice(i).map((d) => d.value))
          );
          params["*"] = _splat;
          params["_splat"] = _splat;
          return true;
        }
        if (routeSegment.type === "pathname") {
          if (routeSegment.value === "/" && !(baseSegment == null ? undefined : baseSegment.value)) {
            return true;
          }
          if (baseSegment) {
            if (matchLocation.caseSensitive) {
              if (routeSegment.value !== baseSegment.value) {
                return false;
              }
            } else if (routeSegment.value.toLowerCase() !== baseSegment.value.toLowerCase()) {
              return false;
            }
          }
        }
        if (!baseSegment) {
          return false;
        }
        if (routeSegment.type === "param") {
          if (baseSegment.value === "/") {
            return false;
          }
          if (baseSegment.value.charAt(0) !== "$") {
            params[routeSegment.value.substring(1)] = decodeURIComponent(
              baseSegment.value
            );
          }
        }
      }
      if (!isLastBaseSegment && isLastRouteSegment) {
        params["**"] = joinPaths(baseSegments.slice(i + 1).map((d) => d.value));
        return !!matchLocation.fuzzy && (routeSegment == null ? undefined : routeSegment.value) !== "/";
      }
    }
    return true;
  })();
  return isMatch ? params : undefined;
}

function isRedirect(obj) {
  return !!(obj == null ? undefined : obj.isRedirect);
}
function isResolvedRedirect(obj) {
  return !!(obj == null ? undefined : obj.isRedirect) && obj.href;
}

const React$1K = await importShared('react');

function CatchBoundary(props) {
  const errorComponent = props.errorComponent ?? ErrorComponent;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    CatchBoundaryImpl,
    {
      getResetKey: props.getResetKey,
      onCatch: props.onCatch,
      children: ({ error, reset }) => {
        if (error) {
          return React$1K.createElement(errorComponent, {
            error,
            reset
          });
        }
        return props.children;
      }
    }
  );
}
class CatchBoundaryImpl extends React$1K.Component {
  constructor() {
    super(...arguments);
    this.state = { error: null };
  }
  static getDerivedStateFromProps(props) {
    return { resetKey: props.getResetKey() };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  reset() {
    this.setState({ error: null });
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.error && prevState.resetKey !== this.state.resetKey) {
      this.reset();
    }
  }
  componentDidCatch(error, errorInfo) {
    if (this.props.onCatch) {
      this.props.onCatch(error, errorInfo);
    }
  }
  render() {
    return this.props.children({
      error: this.state.resetKey !== this.props.getResetKey() ? null : this.state.error,
      reset: () => {
        this.reset();
      }
    });
  }
}
function ErrorComponent({ error }) {
  const [show, setShow] = React$1K.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: ".5rem", maxWidth: "100%" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: ".5rem" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { style: { fontSize: "1rem" }, children: "Something went wrong!" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          style: {
            appearance: "none",
            fontSize: ".6em",
            border: "1px solid currentColor",
            padding: ".1rem .2rem",
            fontWeight: "bold",
            borderRadius: ".25rem"
          },
          onClick: () => setShow((d) => !d),
          children: show ? "Hide Error" : "Show Error"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: ".25rem" } }),
    show ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "pre",
      {
        style: {
          fontSize: ".7em",
          border: "1px solid red",
          borderRadius: ".25rem",
          padding: ".3rem",
          color: "red",
          overflow: "auto"
        },
        children: error.message ? /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: error.message }) : null
      }
    ) }) : null
  ] });
}

const {useRef: useRef$o} = await importShared('react');
function useRouterState(opts) {
  const contextRouter = useRouter({
    warn: (opts == null ? undefined : opts.router) === undefined
  });
  const router = (opts == null ? undefined : opts.router) || contextRouter;
  const previousResult = useRef$o();
  return useStore(router.__store, (state) => {
    if (opts == null ? undefined : opts.select) {
      if (opts.structuralSharing ?? router.options.defaultStructuralSharing) {
        const newSlice = replaceEqualDeep(
          previousResult.current,
          opts.select(state)
        );
        previousResult.current = newSlice;
        return newSlice;
      }
      return opts.select(state);
    }
    return state;
  });
}

function isNotFound(obj) {
  return !!(obj == null ? undefined : obj.isNotFound);
}
function CatchNotFound(props) {
  const resetKey = useRouterState({
    select: (s) => `not-found-${s.location.pathname}-${s.status}`
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    CatchBoundary,
    {
      getResetKey: () => resetKey,
      onCatch: (error, errorInfo) => {
        var _a;
        if (isNotFound(error)) {
          (_a = props.onCatch) == null ? undefined : _a.call(props, error, errorInfo);
        } else {
          throw error;
        }
      },
      errorComponent: ({ error }) => {
        var _a;
        if (isNotFound(error)) {
          return (_a = props.fallback) == null ? undefined : _a.call(props, error);
        } else {
          throw error;
        }
      },
      children: props.children
    }
  );
}
function DefaultGlobalNotFound() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Not Found" });
}

const defaultTransformer = {
  stringify: (value) => JSON.stringify(value, function replacer(key, val) {
    const ogVal = this[key];
    const transformer = transformers.find((t) => t.stringifyCondition(ogVal));
    if (transformer) {
      return transformer.stringify(ogVal);
    }
    return val;
  }),
  parse: (value) => JSON.parse(value, function parser(key, val) {
    const ogVal = this[key];
    if (isPlainObject(ogVal)) {
      const transformer = transformers.find((t) => t.parseCondition(ogVal));
      if (transformer) {
        return transformer.parse(ogVal);
      }
    }
    return val;
  }),
  encode: (value) => {
    if (Array.isArray(value)) {
      return value.map((v) => defaultTransformer.encode(v));
    }
    if (isPlainObject(value)) {
      return Object.fromEntries(
        Object.entries(value).map(([key, v]) => [
          key,
          defaultTransformer.encode(v)
        ])
      );
    }
    const transformer = transformers.find((t) => t.stringifyCondition(value));
    if (transformer) {
      return transformer.stringify(value);
    }
    return value;
  },
  decode: (value) => {
    if (isPlainObject(value)) {
      const transformer = transformers.find((t) => t.parseCondition(value));
      if (transformer) {
        return transformer.parse(value);
      }
    }
    if (Array.isArray(value)) {
      return value.map((v) => defaultTransformer.decode(v));
    }
    if (isPlainObject(value)) {
      return Object.fromEntries(
        Object.entries(value).map(([key, v]) => [
          key,
          defaultTransformer.decode(v)
        ])
      );
    }
    return value;
  }
};
const createTransformer = (key, check, toValue, fromValue) => ({
  key,
  stringifyCondition: check,
  stringify: (value) => ({ [`$${key}`]: toValue(value) }),
  parseCondition: (value) => Object.hasOwn(value, `$${key}`),
  parse: (value) => fromValue(value[`$${key}`])
});
const transformers = [
  createTransformer(
    // Key
    "undefined",
    // Check
    (v) => v === undefined,
    // To
    () => 0,
    // From
    () => undefined
  ),
  createTransformer(
    // Key
    "date",
    // Check
    (v) => v instanceof Date,
    // To
    (v) => v.toISOString(),
    // From
    (v) => new Date(v)
  ),
  createTransformer(
    // Key
    "error",
    // Check
    (v) => v instanceof Error,
    // To
    (v) => ({ ...v, message: v.message, stack: v.stack, cause: v.cause }),
    // From
    (v) => Object.assign(new Error(v.message), v)
  ),
  createTransformer(
    // Key
    "formData",
    // Check
    (v) => v instanceof FormData,
    // To
    (v) => {
      const entries = {};
      v.forEach((value, key) => {
        const entry = entries[key];
        if (entry !== undefined) {
          if (Array.isArray(entry)) {
            entry.push(value);
          } else {
            entries[key] = [entry, value];
          }
        } else {
          entries[key] = value;
        }
      });
      return entries;
    },
    // From
    (v) => {
      const formData = new FormData();
      Object.entries(v).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((val) => formData.append(key, val));
        } else {
          formData.append(key, value);
        }
      });
      return formData;
    }
  )
];

const componentTypes = [
  "component",
  "errorComponent",
  "pendingComponent",
  "notFoundComponent"
];
function routeNeedsPreload(route) {
  var _a;
  for (const componentType of componentTypes) {
    if ((_a = route.options[componentType]) == null ? undefined : _a.preload) {
      return true;
    }
  }
  return false;
}
function validateSearch(validateSearch2, input) {
  if (validateSearch2 == null) return {};
  if ("~standard" in validateSearch2) {
    const result = validateSearch2["~standard"].validate(input);
    if (result instanceof Promise)
      throw new SearchParamError("Async validation not supported");
    if (result.issues)
      throw new SearchParamError(JSON.stringify(result.issues, undefined, 2));
    return result.value;
  }
  if ("parse" in validateSearch2) {
    return validateSearch2.parse(input);
  }
  if (typeof validateSearch2 === "function") {
    return validateSearch2(input);
  }
  return {};
}
function createRouter(options) {
  return new Router(options);
}
class Router {
  /**
   * @deprecated Use the `createRouter` function instead
   */
  constructor(options) {
    this.tempLocationKey = `${Math.round(
      Math.random() * 1e7
    )}`;
    this.resetNextScroll = true;
    this.shouldViewTransition = undefined;
    this.isViewTransitionTypesSupported = undefined;
    this.subscribers = /* @__PURE__ */ new Set();
    this.startReactTransition = (fn) => fn();
    this.update = (newOptions) => {
      var _a;
      if (newOptions.notFoundRoute) {
        console.warn(
          "The notFoundRoute API is deprecated and will be removed in the next major version. See https://tanstack.com/router/v1/docs/guide/not-found-errors#migrating-from-notfoundroute for more info."
        );
      }
      const previousOptions = this.options;
      this.options = {
        ...this.options,
        ...newOptions
      };
      this.isServer = this.options.isServer ?? typeof document === "undefined";
      this.pathParamsDecodeCharMap = this.options.pathParamsAllowedCharacters ? new Map(
        this.options.pathParamsAllowedCharacters.map((char) => [
          encodeURIComponent(char),
          char
        ])
      ) : undefined;
      if (!this.basepath || newOptions.basepath && newOptions.basepath !== previousOptions.basepath) {
        if (newOptions.basepath === undefined || newOptions.basepath === "" || newOptions.basepath === "/") {
          this.basepath = "/";
        } else {
          this.basepath = `/${trimPath(newOptions.basepath)}`;
        }
      }
      if (
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        !this.history || this.options.history && this.options.history !== this.history
      ) {
        this.history = this.options.history ?? (this.isServer ? createMemoryHistory({
          initialEntries: [this.basepath || "/"]
        }) : createBrowserHistory());
        this.latestLocation = this.parseLocation();
      }
      if (this.options.routeTree !== this.routeTree) {
        this.routeTree = this.options.routeTree;
        this.buildRouteTree();
      }
      if (!this.__store) {
        this.__store = new Store(getInitialRouterState(this.latestLocation), {
          onUpdate: () => {
            this.__store.state = {
              ...this.state,
              cachedMatches: this.state.cachedMatches.filter(
                (d) => !["redirected"].includes(d.status)
              )
            };
          }
        });
      }
      if (typeof window !== "undefined" && "CSS" in window && // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      typeof ((_a = window.CSS) == null ? undefined : _a.supports) === "function") {
        this.isViewTransitionTypesSupported = window.CSS.supports(
          "selector(:active-view-transition-type(a)"
        );
      }
    };
    this.buildRouteTree = () => {
      this.routesById = {};
      this.routesByPath = {};
      const notFoundRoute = this.options.notFoundRoute;
      if (notFoundRoute) {
        notFoundRoute.init({
          originalIndex: 99999999999,
          defaultSsr: this.options.defaultSsr
        });
        this.routesById[notFoundRoute.id] = notFoundRoute;
      }
      const recurseRoutes = (childRoutes) => {
        childRoutes.forEach((childRoute, i) => {
          childRoute.init({
            originalIndex: i,
            defaultSsr: this.options.defaultSsr
          });
          const existingRoute = this.routesById[childRoute.id];
          invariant(
            !existingRoute,
            `Duplicate routes found with id: ${String(childRoute.id)}`
          );
          this.routesById[childRoute.id] = childRoute;
          if (!childRoute.isRoot && childRoute.path) {
            const trimmedFullPath = trimPathRight(childRoute.fullPath);
            if (!this.routesByPath[trimmedFullPath] || childRoute.fullPath.endsWith("/")) {
              this.routesByPath[trimmedFullPath] = childRoute;
            }
          }
          const children = childRoute.children;
          if (children == null ? undefined : children.length) {
            recurseRoutes(children);
          }
        });
      };
      recurseRoutes([this.routeTree]);
      const scoredRoutes = [];
      const routes = Object.values(this.routesById);
      routes.forEach((d, i) => {
        var _a;
        if (d.isRoot || !d.path) {
          return;
        }
        const trimmed = trimPathLeft(d.fullPath);
        const parsed = parsePathname(trimmed);
        while (parsed.length > 1 && ((_a = parsed[0]) == null ? undefined : _a.value) === "/") {
          parsed.shift();
        }
        const scores = parsed.map((segment) => {
          if (segment.value === "/") {
            return 0.75;
          }
          if (segment.type === "param") {
            return 0.5;
          }
          if (segment.type === "wildcard") {
            return 0.25;
          }
          return 1;
        });
        scoredRoutes.push({ child: d, trimmed, parsed, index: i, scores });
      });
      this.flatRoutes = scoredRoutes.sort((a, b) => {
        const minLength = Math.min(a.scores.length, b.scores.length);
        for (let i = 0; i < minLength; i++) {
          if (a.scores[i] !== b.scores[i]) {
            return b.scores[i] - a.scores[i];
          }
        }
        if (a.scores.length !== b.scores.length) {
          return b.scores.length - a.scores.length;
        }
        for (let i = 0; i < minLength; i++) {
          if (a.parsed[i].value !== b.parsed[i].value) {
            return a.parsed[i].value > b.parsed[i].value ? 1 : -1;
          }
        }
        return a.index - b.index;
      }).map((d, i) => {
        d.child.rank = i;
        return d.child;
      });
    };
    this.subscribe = (eventType, fn) => {
      const listener = {
        eventType,
        fn
      };
      this.subscribers.add(listener);
      return () => {
        this.subscribers.delete(listener);
      };
    };
    this.emit = (routerEvent) => {
      this.subscribers.forEach((listener) => {
        if (listener.eventType === routerEvent.type) {
          listener.fn(routerEvent);
        }
      });
    };
    this.parseLocation = (previousLocation, locationToParse) => {
      const parse = ({
        pathname,
        search,
        hash,
        state
      }) => {
        const parsedSearch = this.options.parseSearch(search);
        const searchStr = this.options.stringifySearch(parsedSearch);
        return {
          pathname,
          searchStr,
          search: replaceEqualDeep(previousLocation == null ? undefined : previousLocation.search, parsedSearch),
          hash: hash.split("#").reverse()[0] ?? "",
          href: `${pathname}${searchStr}${hash}`,
          state: replaceEqualDeep(previousLocation == null ? undefined : previousLocation.state, state)
        };
      };
      const location = parse(locationToParse ?? this.history.location);
      const { __tempLocation, __tempKey } = location.state;
      if (__tempLocation && (!__tempKey || __tempKey === this.tempLocationKey)) {
        const parsedTempLocation = parse(__tempLocation);
        parsedTempLocation.state.key = location.state.key;
        delete parsedTempLocation.state.__tempLocation;
        return {
          ...parsedTempLocation,
          maskedLocation: location
        };
      }
      return location;
    };
    this.resolvePathWithBase = (from, path) => {
      const resolvedPath = resolvePath({
        basepath: this.basepath,
        base: from,
        to: cleanPath(path),
        trailingSlash: this.options.trailingSlash,
        caseSensitive: this.options.caseSensitive
      });
      return resolvedPath;
    };
    this.getMatchedRoutes = (next, dest) => {
      let routeParams = {};
      const trimmedPath = trimPathRight(next.pathname);
      const getMatchedParams = (route) => {
        const result = matchPathname(this.basepath, trimmedPath, {
          to: route.fullPath,
          caseSensitive: route.options.caseSensitive ?? this.options.caseSensitive,
          fuzzy: true
        });
        return result;
      };
      let foundRoute = (dest == null ? undefined : dest.to) !== undefined ? this.routesByPath[dest.to] : undefined;
      if (foundRoute) {
        routeParams = getMatchedParams(foundRoute);
      } else {
        foundRoute = this.flatRoutes.find((route) => {
          const matchedParams = getMatchedParams(route);
          if (matchedParams) {
            routeParams = matchedParams;
            return true;
          }
          return false;
        });
      }
      let routeCursor = foundRoute || this.routesById[rootRouteId];
      const matchedRoutes = [routeCursor];
      while (routeCursor.parentRoute) {
        routeCursor = routeCursor.parentRoute;
        matchedRoutes.unshift(routeCursor);
      }
      return { matchedRoutes, routeParams, foundRoute };
    };
    this.cancelMatch = (id) => {
      const match = this.getMatch(id);
      if (!match) return;
      match.abortController.abort();
      clearTimeout(match.pendingTimeout);
    };
    this.cancelMatches = () => {
      var _a;
      (_a = this.state.pendingMatches) == null ? undefined : _a.forEach((match) => {
        this.cancelMatch(match.id);
      });
    };
    this.buildLocation = (opts) => {
      const build = (dest = {}, matchedRoutesResult) => {
        var _a, _b, _c, _d, _e, _f;
        const fromMatches = dest._fromLocation ? this.matchRoutes(dest._fromLocation, { _buildLocation: true }) : this.state.matches;
        const fromMatch = dest.from != null ? fromMatches.find(
          (d) => matchPathname(this.basepath, trimPathRight(d.pathname), {
            to: dest.from,
            caseSensitive: false,
            fuzzy: false
          })
        ) : undefined;
        const fromPath = (fromMatch == null ? undefined : fromMatch.pathname) || this.latestLocation.pathname;
        invariant(
          dest.from == null || fromMatch != null,
          "Could not find match for from: " + dest.from
        );
        const fromSearch = ((_a = this.state.pendingMatches) == null ? undefined : _a.length) ? (_b = last(this.state.pendingMatches)) == null ? undefined : _b.search : ((_c = last(fromMatches)) == null ? undefined : _c.search) || this.latestLocation.search;
        const stayingMatches = matchedRoutesResult == null ? undefined : matchedRoutesResult.matchedRoutes.filter(
          (d) => fromMatches.find((e) => e.routeId === d.id)
        );
        let pathname;
        if (dest.to) {
          pathname = this.resolvePathWithBase(fromPath, `${dest.to}`);
        } else {
          const fromRouteByFromPathRouteId = this.routesById[(_d = stayingMatches == null ? undefined : stayingMatches.find((route) => {
            const interpolatedPath = interpolatePath({
              path: route.fullPath,
              params: (matchedRoutesResult == null ? undefined : matchedRoutesResult.routeParams) ?? {},
              decodeCharMap: this.pathParamsDecodeCharMap
            });
            const pathname2 = joinPaths([this.basepath, interpolatedPath]);
            return pathname2 === fromPath;
          })) == null ? undefined : _d.id];
          pathname = this.resolvePathWithBase(
            fromPath,
            (fromRouteByFromPathRouteId == null ? undefined : fromRouteByFromPathRouteId.to) ?? fromPath
          );
        }
        const prevParams = { ...(_e = last(fromMatches)) == null ? undefined : _e.params };
        let nextParams = (dest.params ?? true) === true ? prevParams : {
          ...prevParams,
          ...functionalUpdate(dest.params, prevParams)
        };
        if (Object.keys(nextParams).length > 0) {
          matchedRoutesResult == null ? undefined : matchedRoutesResult.matchedRoutes.map((route) => {
            var _a2;
            return ((_a2 = route.options.params) == null ? undefined : _a2.stringify) ?? route.options.stringifyParams;
          }).filter(Boolean).forEach((fn) => {
            nextParams = { ...nextParams, ...fn(nextParams) };
          });
        }
        pathname = interpolatePath({
          path: pathname,
          params: nextParams ?? {},
          leaveWildcards: false,
          leaveParams: opts.leaveParams,
          decodeCharMap: this.pathParamsDecodeCharMap
        });
        let search = fromSearch;
        if (opts._includeValidateSearch && ((_f = this.options.search) == null ? undefined : _f.strict)) {
          let validatedSearch = {};
          matchedRoutesResult == null ? undefined : matchedRoutesResult.matchedRoutes.forEach((route) => {
            try {
              if (route.options.validateSearch) {
                validatedSearch = {
                  ...validatedSearch,
                  ...validateSearch(route.options.validateSearch, {
                    ...validatedSearch,
                    ...search
                  }) ?? {}
                };
              }
            } catch (e) {
            }
          });
          search = validatedSearch;
        }
        const applyMiddlewares = (search2) => {
          const allMiddlewares = (matchedRoutesResult == null ? undefined : matchedRoutesResult.matchedRoutes.reduce(
            (acc, route) => {
              var _a2;
              const middlewares = [];
              if ("search" in route.options) {
                if ((_a2 = route.options.search) == null ? undefined : _a2.middlewares) {
                  middlewares.push(...route.options.search.middlewares);
                }
              } else if (route.options.preSearchFilters || route.options.postSearchFilters) {
                const legacyMiddleware = ({
                  search: search3,
                  next
                }) => {
                  let nextSearch = search3;
                  if ("preSearchFilters" in route.options && route.options.preSearchFilters) {
                    nextSearch = route.options.preSearchFilters.reduce(
                      (prev, next2) => next2(prev),
                      search3
                    );
                  }
                  const result = next(nextSearch);
                  if ("postSearchFilters" in route.options && route.options.postSearchFilters) {
                    return route.options.postSearchFilters.reduce(
                      (prev, next2) => next2(prev),
                      result
                    );
                  }
                  return result;
                };
                middlewares.push(legacyMiddleware);
              }
              if (opts._includeValidateSearch && route.options.validateSearch) {
                const validate = ({ search: search3, next }) => {
                  try {
                    const result = next(search3);
                    const validatedSearch = {
                      ...result,
                      ...validateSearch(
                        route.options.validateSearch,
                        result
                      ) ?? {}
                    };
                    return validatedSearch;
                  } catch (e) {
                  }
                };
                middlewares.push(validate);
              }
              return acc.concat(middlewares);
            },
            []
          )) ?? [];
          const final = ({ search: search3 }) => {
            if (!dest.search) {
              return {};
            }
            if (dest.search === true) {
              return search3;
            }
            return functionalUpdate(dest.search, search3);
          };
          allMiddlewares.push(final);
          const applyNext = (index, currentSearch) => {
            if (index >= allMiddlewares.length) {
              return currentSearch;
            }
            const middleware = allMiddlewares[index];
            const next = (newSearch) => {
              return applyNext(index + 1, newSearch);
            };
            return middleware({ search: currentSearch, next });
          };
          return applyNext(0, search2);
        };
        search = applyMiddlewares(search);
        search = replaceEqualDeep(fromSearch, search);
        const searchStr = this.options.stringifySearch(search);
        const hash = dest.hash === true ? this.latestLocation.hash : dest.hash ? functionalUpdate(dest.hash, this.latestLocation.hash) : undefined;
        const hashStr = hash ? `#${hash}` : "";
        let nextState = dest.state === true ? this.latestLocation.state : dest.state ? functionalUpdate(dest.state, this.latestLocation.state) : {};
        nextState = replaceEqualDeep(this.latestLocation.state, nextState);
        return {
          pathname,
          search,
          searchStr,
          state: nextState,
          hash: hash ?? "",
          href: `${pathname}${searchStr}${hashStr}`,
          unmaskOnReload: dest.unmaskOnReload
        };
      };
      const buildWithMatches = (dest = {}, maskedDest) => {
        var _a;
        const next = build(dest);
        let maskedNext = maskedDest ? build(maskedDest) : undefined;
        if (!maskedNext) {
          let params = {};
          const foundMask = (_a = this.options.routeMasks) == null ? undefined : _a.find((d) => {
            const match = matchPathname(this.basepath, next.pathname, {
              to: d.from,
              caseSensitive: false,
              fuzzy: false
            });
            if (match) {
              params = match;
              return true;
            }
            return false;
          });
          if (foundMask) {
            const { from: _from, ...maskProps } = foundMask;
            maskedDest = {
              ...pick(opts, ["from"]),
              ...maskProps,
              params
            };
            maskedNext = build(maskedDest);
          }
        }
        const nextMatches = this.getMatchedRoutes(next, dest);
        const final = build(dest, nextMatches);
        if (maskedNext) {
          const maskedMatches = this.getMatchedRoutes(maskedNext, maskedDest);
          const maskedFinal = build(maskedDest, maskedMatches);
          final.maskedLocation = maskedFinal;
        }
        return final;
      };
      if (opts.mask) {
        return buildWithMatches(opts, {
          ...pick(opts, ["from"]),
          ...opts.mask
        });
      }
      return buildWithMatches(opts);
    };
    this.commitLocation = ({
      viewTransition,
      ignoreBlocker,
      ...next
    }) => {
      const isSameState = () => {
        next.state.key = this.latestLocation.state.key;
        const isEqual = deepEqual(next.state, this.latestLocation.state);
        delete next.state.key;
        return isEqual;
      };
      const isSameUrl = this.latestLocation.href === next.href;
      const previousCommitPromise = this.commitLocationPromise;
      this.commitLocationPromise = createControlledPromise(() => {
        previousCommitPromise == null ? undefined : previousCommitPromise.resolve();
      });
      if (isSameUrl && isSameState()) {
        this.load();
      } else {
        let { maskedLocation, hashScrollIntoView, ...nextHistory } = next;
        if (maskedLocation) {
          nextHistory = {
            ...maskedLocation,
            state: {
              ...maskedLocation.state,
              __tempKey: undefined,
              __tempLocation: {
                ...nextHistory,
                search: nextHistory.searchStr,
                state: {
                  ...nextHistory.state,
                  __tempKey: undefined,
                  __tempLocation: undefined,
                  key: undefined
                }
              }
            }
          };
          if (nextHistory.unmaskOnReload ?? this.options.unmaskOnReload ?? false) {
            nextHistory.state.__tempKey = this.tempLocationKey;
          }
        }
        nextHistory.state.__hashScrollIntoViewOptions = hashScrollIntoView ?? this.options.defaultHashScrollIntoView ?? true;
        this.shouldViewTransition = viewTransition;
        this.history[next.replace ? "replace" : "push"](
          nextHistory.href,
          nextHistory.state,
          { ignoreBlocker }
        );
      }
      this.resetNextScroll = next.resetScroll ?? true;
      if (!this.history.subscribers.size) {
        this.load();
      }
      return this.commitLocationPromise;
    };
    this.buildAndCommitLocation = ({
      replace,
      resetScroll,
      hashScrollIntoView,
      viewTransition,
      ignoreBlocker,
      href,
      ...rest
    } = {}) => {
      if (href) {
        const currentIndex = this.history.location.state.__TSR_index;
        const parsed = parseHref(href, {
          __TSR_index: replace ? currentIndex : currentIndex + 1
        });
        rest.to = parsed.pathname;
        rest.search = this.options.parseSearch(parsed.search);
        rest.hash = parsed.hash.slice(1);
      }
      const location = this.buildLocation({
        ...rest,
        _includeValidateSearch: true
      });
      return this.commitLocation({
        ...location,
        viewTransition,
        replace,
        resetScroll,
        hashScrollIntoView,
        ignoreBlocker
      });
    };
    this.navigate = ({ to, reloadDocument, href, ...rest }) => {
      if (reloadDocument) {
        if (!href) {
          const location = this.buildLocation({ to, ...rest });
          href = location.href;
        }
        if (rest.replace) {
          window.location.replace(href);
        } else {
          window.location.href = href;
        }
        return;
      }
      return this.buildAndCommitLocation({
        ...rest,
        href,
        to
      });
    };
    this.load = async (opts) => {
      this.latestLocation = this.parseLocation(this.latestLocation);
      let redirect;
      let notFound;
      let loadPromise;
      loadPromise = new Promise((resolve) => {
        this.startReactTransition(async () => {
          var _a;
          try {
            const next = this.latestLocation;
            const prevLocation = this.state.resolvedLocation;
            const hrefChanged = prevLocation.href !== next.href;
            const pathChanged = prevLocation.pathname !== next.pathname;
            this.cancelMatches();
            let pendingMatches;
            batch(() => {
              pendingMatches = this.matchRoutes(next);
              this.__store.setState((s) => ({
                ...s,
                status: "pending",
                isLoading: true,
                location: next,
                pendingMatches,
                // If a cached moved to pendingMatches, remove it from cachedMatches
                cachedMatches: s.cachedMatches.filter((d) => {
                  return !pendingMatches.find((e) => e.id === d.id);
                })
              }));
            });
            if (!this.state.redirect) {
              this.emit({
                type: "onBeforeNavigate",
                fromLocation: prevLocation,
                toLocation: next,
                pathChanged,
                hrefChanged
              });
            }
            this.emit({
              type: "onBeforeLoad",
              fromLocation: prevLocation,
              toLocation: next,
              pathChanged,
              hrefChanged
            });
            await this.loadMatches({
              sync: opts == null ? void 0 : opts.sync,
              matches: pendingMatches,
              location: next,
              // eslint-disable-next-line @typescript-eslint/require-await
              onReady: async () => {
                this.startViewTransition(async () => {
                  let exitingMatches;
                  let enteringMatches;
                  let stayingMatches;
                  batch(() => {
                    this.__store.setState((s) => {
                      const previousMatches = s.matches;
                      const newMatches = s.pendingMatches || s.matches;
                      exitingMatches = previousMatches.filter(
                        (match) => !newMatches.find((d) => d.id === match.id)
                      );
                      enteringMatches = newMatches.filter(
                        (match) => !previousMatches.find((d) => d.id === match.id)
                      );
                      stayingMatches = previousMatches.filter(
                        (match) => newMatches.find((d) => d.id === match.id)
                      );
                      return {
                        ...s,
                        isLoading: false,
                        loadedAt: Date.now(),
                        matches: newMatches,
                        pendingMatches: void 0,
                        cachedMatches: [
                          ...s.cachedMatches,
                          ...exitingMatches.filter((d) => d.status !== "error")
                        ]
                      };
                    });
                    this.clearExpiredCache();
                  });
                  [
                    [exitingMatches, "onLeave"],
                    [enteringMatches, "onEnter"],
                    [stayingMatches, "onStay"]
                  ].forEach(([matches, hook]) => {
                    matches.forEach((match) => {
                      var _a2, _b;
                      (_b = (_a2 = this.looseRoutesById[match.routeId].options)[hook]) == null ? void 0 : _b.call(_a2, match);
                    });
                  });
                });
              }
            });
          } catch (err) {
            if (isResolvedRedirect(err)) {
              redirect = err;
              if (!this.isServer) {
                this.navigate({
                  ...redirect,
                  replace: true,
                  ignoreBlocker: true
                });
              }
            } else if (isNotFound(err)) {
              notFound = err;
            }
            this.__store.setState((s) => ({
              ...s,
              statusCode: redirect ? redirect.statusCode : notFound ? 404 : s.matches.some((d) => d.status === "error") ? 500 : 200,
              redirect
            }));
          }
          if (this.latestLoadPromise === loadPromise) {
            (_a = this.commitLocationPromise) == null ? undefined : _a.resolve();
            this.latestLoadPromise = undefined;
            this.commitLocationPromise = undefined;
          }
          resolve();
        });
      });
      this.latestLoadPromise = loadPromise;
      await loadPromise;
      while (this.latestLoadPromise && loadPromise !== this.latestLoadPromise) {
        await this.latestLoadPromise;
      }
    };
    this.startViewTransition = (fn) => {
      const shouldViewTransition = this.shouldViewTransition ?? this.options.defaultViewTransition;
      delete this.shouldViewTransition;
      if (shouldViewTransition && typeof document !== "undefined" && "startViewTransition" in document && typeof document.startViewTransition === "function") {
        let startViewTransitionParams;
        if (typeof shouldViewTransition === "object" && this.isViewTransitionTypesSupported) {
          startViewTransitionParams = {
            update: fn,
            types: shouldViewTransition.types
          };
        } else {
          startViewTransitionParams = fn;
        }
        document.startViewTransition(startViewTransitionParams);
      } else {
        fn();
      }
    };
    this.updateMatch = (id, updater) => {
      var _a;
      let updated;
      const isPending = (_a = this.state.pendingMatches) == null ? undefined : _a.find((d) => d.id === id);
      const isMatched = this.state.matches.find((d) => d.id === id);
      const isCached = this.state.cachedMatches.find((d) => d.id === id);
      const matchesKey = isPending ? "pendingMatches" : isMatched ? "matches" : isCached ? "cachedMatches" : "";
      if (matchesKey) {
        this.__store.setState((s) => {
          var _a2;
          return {
            ...s,
            [matchesKey]: (_a2 = s[matchesKey]) == null ? undefined : _a2.map(
              (d) => d.id === id ? updated = updater(d) : d
            )
          };
        });
      }
      return updated;
    };
    this.getMatch = (matchId) => {
      return [
        ...this.state.cachedMatches,
        ...this.state.pendingMatches ?? [],
        ...this.state.matches
      ].find((d) => d.id === matchId);
    };
    this.loadMatches = async ({
      location,
      matches,
      preload: allPreload,
      onReady,
      updateMatch = this.updateMatch,
      sync
    }) => {
      let firstBadMatchIndex;
      let rendered = false;
      const triggerOnReady = async () => {
        if (!rendered) {
          rendered = true;
          await (onReady == null ? undefined : onReady());
        }
      };
      const resolvePreload = (matchId) => {
        return !!(allPreload && !this.state.matches.find((d) => d.id === matchId));
      };
      if (!this.isServer && !this.state.matches.length) {
        triggerOnReady();
      }
      const handleRedirectAndNotFound = (match, err) => {
        var _a, _b, _c;
        if (isResolvedRedirect(err)) {
          if (!err.reloadDocument) {
            throw err;
          }
        }
        if (isRedirect(err) || isNotFound(err)) {
          updateMatch(match.id, (prev) => ({
            ...prev,
            status: isRedirect(err) ? "redirected" : isNotFound(err) ? "notFound" : "error",
            isFetching: false,
            error: err,
            beforeLoadPromise: undefined,
            loaderPromise: undefined
          }));
          if (!err.routeId) {
            err.routeId = match.routeId;
          }
          (_a = match.beforeLoadPromise) == null ? undefined : _a.resolve();
          (_b = match.loaderPromise) == null ? undefined : _b.resolve();
          (_c = match.loadPromise) == null ? undefined : _c.resolve();
          if (isRedirect(err)) {
            rendered = true;
            err = this.resolveRedirect({ ...err, _fromLocation: location });
            throw err;
          } else if (isNotFound(err)) {
            this._handleNotFound(matches, err, {
              updateMatch
            });
            throw err;
          }
        }
      };
      try {
        await new Promise((resolveAll, rejectAll) => {
          ;
          (async () => {
            var _a, _b, _c;
            try {
              const handleSerialError = (index, err, routerCode) => {
                var _a2, _b2;
                const { id: matchId, routeId } = matches[index];
                const route = this.looseRoutesById[routeId];
                if (err instanceof Promise) {
                  throw err;
                }
                err.routerCode = routerCode;
                firstBadMatchIndex = firstBadMatchIndex ?? index;
                handleRedirectAndNotFound(this.getMatch(matchId), err);
                try {
                  (_b2 = (_a2 = route.options).onError) == null ? void 0 : _b2.call(_a2, err);
                } catch (errorHandlerErr) {
                  err = errorHandlerErr;
                  handleRedirectAndNotFound(this.getMatch(matchId), err);
                }
                updateMatch(matchId, (prev) => {
                  var _a3, _b3;
                  (_a3 = prev.beforeLoadPromise) == null ? void 0 : _a3.resolve();
                  (_b3 = prev.loadPromise) == null ? void 0 : _b3.resolve();
                  return {
                    ...prev,
                    error: err,
                    status: "error",
                    isFetching: false,
                    updatedAt: Date.now(),
                    abortController: new AbortController(),
                    beforeLoadPromise: void 0
                  };
                });
              };
              for (const [index, { id: matchId, routeId }] of matches.entries()) {
                const existingMatch = this.getMatch(matchId);
                const parentMatchId = (_a = matches[index - 1]) == null ? void 0 : _a.id;
                const route = this.looseRoutesById[routeId];
                const pendingMs = route.options.pendingMs ?? this.options.defaultPendingMs;
                const shouldPending = !!(onReady && !this.isServer && !resolvePreload(matchId) && (route.options.loader || route.options.beforeLoad) && typeof pendingMs === "number" && pendingMs !== Infinity && (route.options.pendingComponent ?? this.options.defaultPendingComponent));
                let executeBeforeLoad = true;
                if (
                  // If we are in the middle of a load, either of these will be present
                  // (not to be confused with `loadPromise`, which is always defined)
                  existingMatch.beforeLoadPromise || existingMatch.loaderPromise
                ) {
                  if (shouldPending) {
                    setTimeout(() => {
                      try {
                        triggerOnReady();
                      } catch {
                      }
                    }, pendingMs);
                  }
                  await existingMatch.beforeLoadPromise;
                  executeBeforeLoad = this.getMatch(matchId).status !== "success";
                }
                if (executeBeforeLoad) {
                  try {
                    updateMatch(matchId, (prev) => ({
                      ...prev,
                      loadPromise: createControlledPromise(() => {
                        var _a2;
                        (_a2 = prev.loadPromise) == null ? void 0 : _a2.resolve();
                      }),
                      beforeLoadPromise: createControlledPromise()
                    }));
                    const abortController = new AbortController();
                    let pendingTimeout;
                    if (shouldPending) {
                      pendingTimeout = setTimeout(() => {
                        try {
                          triggerOnReady();
                        } catch {
                        }
                      }, pendingMs);
                    }
                    const { paramsError, searchError } = this.getMatch(matchId);
                    if (paramsError) {
                      handleSerialError(index, paramsError, "PARSE_PARAMS");
                    }
                    if (searchError) {
                      handleSerialError(index, searchError, "VALIDATE_SEARCH");
                    }
                    const getParentMatchContext = () => parentMatchId ? this.getMatch(parentMatchId).context : this.options.context ?? {};
                    updateMatch(matchId, (prev) => ({
                      ...prev,
                      isFetching: "beforeLoad",
                      fetchCount: prev.fetchCount + 1,
                      abortController,
                      pendingTimeout,
                      context: {
                        ...getParentMatchContext(),
                        ...prev.__routeContext
                      }
                    }));
                    const { search, params, context, cause } = this.getMatch(matchId);
                    const preload = resolvePreload(matchId);
                    const beforeLoadFnContext = {
                      search,
                      abortController,
                      params,
                      preload,
                      context,
                      location,
                      navigate: (opts) => this.navigate({ ...opts, _fromLocation: location }),
                      buildLocation: this.buildLocation,
                      cause: preload ? "preload" : cause,
                      matches
                    };
                    let beforeLoadContext = await ((_c = (_b = route.options).beforeLoad) == null ? void 0 : _c.call(_b, beforeLoadFnContext)) ?? {};
                    if (this.serializeLoaderData) {
                      beforeLoadContext = this.serializeLoaderData(
                        "__beforeLoadContext",
                        beforeLoadContext,
                        {
                          router: this,
                          match: this.getMatch(matchId)
                        }
                      );
                    }
                    if (isRedirect(beforeLoadContext) || isNotFound(beforeLoadContext)) {
                      handleSerialError(index, beforeLoadContext, "BEFORE_LOAD");
                    }
                    updateMatch(matchId, (prev) => {
                      return {
                        ...prev,
                        __beforeLoadContext: beforeLoadContext,
                        context: {
                          ...getParentMatchContext(),
                          ...prev.__routeContext,
                          ...beforeLoadContext
                        },
                        abortController
                      };
                    });
                  } catch (err) {
                    handleSerialError(index, err, "BEFORE_LOAD");
                  }
                  updateMatch(matchId, (prev) => {
                    var _a2;
                    (_a2 = prev.beforeLoadPromise) == null ? void 0 : _a2.resolve();
                    return {
                      ...prev,
                      beforeLoadPromise: void 0,
                      isFetching: false
                    };
                  });
                }
              }
              const validResolvedMatches = matches.slice(0, firstBadMatchIndex);
              const matchPromises = [];
              validResolvedMatches.forEach(({ id: matchId, routeId }, index) => {
                matchPromises.push(
                  (async () => {
                    const { loaderPromise: prevLoaderPromise } = this.getMatch(matchId);
                    let loaderShouldRunAsync = false;
                    let loaderIsRunningAsync = false;
                    if (prevLoaderPromise) {
                      await prevLoaderPromise;
                      const match = this.getMatch(matchId);
                      if (match.error) {
                        handleRedirectAndNotFound(match, match.error);
                      }
                    } else {
                      const parentMatchPromise = matchPromises[index - 1];
                      const route = this.looseRoutesById[routeId];
                      const getLoaderContext = () => {
                        const {
                          params,
                          loaderDeps,
                          abortController,
                          context,
                          cause
                        } = this.getMatch(matchId);
                        const preload2 = resolvePreload(matchId);
                        return {
                          params,
                          deps: loaderDeps,
                          preload: !!preload2,
                          parentMatchPromise,
                          abortController,
                          context,
                          location,
                          navigate: (opts) => this.navigate({ ...opts, _fromLocation: location }),
                          cause: preload2 ? "preload" : cause,
                          route
                        };
                      };
                      const age = Date.now() - this.getMatch(matchId).updatedAt;
                      const preload = resolvePreload(matchId);
                      const staleAge = preload ? route.options.preloadStaleTime ?? this.options.defaultPreloadStaleTime ?? 3e4 : route.options.staleTime ?? this.options.defaultStaleTime ?? 0;
                      const shouldReloadOption = route.options.shouldReload;
                      const shouldReload = typeof shouldReloadOption === "function" ? shouldReloadOption(getLoaderContext()) : shouldReloadOption;
                      updateMatch(matchId, (prev) => ({
                        ...prev,
                        loaderPromise: createControlledPromise(),
                        preload: !!preload && !this.state.matches.find((d) => d.id === matchId)
                      }));
                      const runLoader = async () => {
                        var _a2, _b2, _c2, _d, _e, _f, _g, _h;
                        try {
                          const potentialPendingMinPromise = async () => {
                            const latestMatch = this.getMatch(matchId);
                            if (latestMatch.minPendingPromise) {
                              await latestMatch.minPendingPromise;
                            }
                          };
                          try {
                            this.loadRouteChunk(route);
                            updateMatch(matchId, (prev) => ({
                              ...prev,
                              isFetching: "loader"
                            }));
                            let loaderData = await ((_b2 = (_a2 = route.options).loader) == null ? void 0 : _b2.call(_a2, getLoaderContext()));
                            if (this.serializeLoaderData) {
                              loaderData = this.serializeLoaderData(
                                "loaderData",
                                loaderData,
                                {
                                  router: this,
                                  match: this.getMatch(matchId)
                                }
                              );
                            }
                            handleRedirectAndNotFound(
                              this.getMatch(matchId),
                              loaderData
                            );
                            await route._lazyPromise;
                            await potentialPendingMinPromise();
                            const headFnContent = (_d = (_c2 = route.options).head) == null ? void 0 : _d.call(_c2, {
                              matches,
                              match: this.getMatch(matchId),
                              params: this.getMatch(matchId).params,
                              loaderData
                            });
                            const meta = headFnContent == null ? void 0 : headFnContent.meta;
                            const links = headFnContent == null ? void 0 : headFnContent.links;
                            const scripts = headFnContent == null ? void 0 : headFnContent.scripts;
                            const headers = (_f = (_e = route.options).headers) == null ? void 0 : _f.call(_e, {
                              loaderData
                            });
                            updateMatch(matchId, (prev) => ({
                              ...prev,
                              error: void 0,
                              status: "success",
                              isFetching: false,
                              updatedAt: Date.now(),
                              loaderData,
                              meta,
                              links,
                              scripts,
                              headers
                            }));
                          } catch (e) {
                            let error = e;
                            await potentialPendingMinPromise();
                            handleRedirectAndNotFound(this.getMatch(matchId), e);
                            try {
                              (_h = (_g = route.options).onError) == null ? void 0 : _h.call(_g, e);
                            } catch (onErrorError) {
                              error = onErrorError;
                              handleRedirectAndNotFound(
                                this.getMatch(matchId),
                                onErrorError
                              );
                            }
                            updateMatch(matchId, (prev) => ({
                              ...prev,
                              error,
                              status: "error",
                              isFetching: false
                            }));
                          }
                          await route._componentsPromise;
                        } catch (err) {
                          updateMatch(matchId, (prev) => ({
                            ...prev,
                            loaderPromise: void 0
                          }));
                          handleRedirectAndNotFound(this.getMatch(matchId), err);
                        }
                      };
                      const { status, invalid } = this.getMatch(matchId);
                      loaderShouldRunAsync = status === "success" && (invalid || (shouldReload ?? age > staleAge));
                      if (preload && route.options.preload === false) {
                      } else if (loaderShouldRunAsync && !sync) {
                        loaderIsRunningAsync = true;
                        (async () => {
                          try {
                            await runLoader();
                            const { loaderPromise, loadPromise } = this.getMatch(matchId);
                            loaderPromise == null ? void 0 : loaderPromise.resolve();
                            loadPromise == null ? void 0 : loadPromise.resolve();
                            updateMatch(matchId, (prev) => ({
                              ...prev,
                              loaderPromise: void 0
                            }));
                          } catch (err) {
                            if (isResolvedRedirect(err)) {
                              await this.navigate(err);
                            }
                          }
                        })();
                      } else if (status !== "success" || loaderShouldRunAsync && sync) {
                        await runLoader();
                      }
                    }
                    if (!loaderIsRunningAsync) {
                      const { loaderPromise, loadPromise } = this.getMatch(matchId);
                      loaderPromise == null ? void 0 : loaderPromise.resolve();
                      loadPromise == null ? void 0 : loadPromise.resolve();
                    }
                    updateMatch(matchId, (prev) => ({
                      ...prev,
                      isFetching: loaderIsRunningAsync ? prev.isFetching : false,
                      loaderPromise: loaderIsRunningAsync ? prev.loaderPromise : void 0,
                      invalid: false
                    }));
                    return this.getMatch(matchId);
                  })()
                );
              });
              await Promise.all(matchPromises);
              resolveAll();
            } catch (err) {
              rejectAll(err);
            }
          })();
        });
        await triggerOnReady();
      } catch (err) {
        if (isRedirect(err) || isNotFound(err)) {
          if (isNotFound(err) && !allPreload) {
            await triggerOnReady();
          }
          throw err;
        }
      }
      return matches;
    };
    this.invalidate = (opts) => {
      const invalidate = (d) => {
        var _a;
        if (((_a = opts == null ? undefined : opts.filter) == null ? undefined : _a.call(opts, d)) ?? true) {
          return {
            ...d,
            invalid: true,
            ...d.status === "error" ? { status: "pending", error: undefined } : {}
          };
        }
        return d;
      };
      this.__store.setState((s) => {
        var _a;
        return {
          ...s,
          matches: s.matches.map(invalidate),
          cachedMatches: s.cachedMatches.map(invalidate),
          pendingMatches: (_a = s.pendingMatches) == null ? undefined : _a.map(invalidate)
        };
      });
      return this.load({ sync: opts == null ? undefined : opts.sync });
    };
    this.resolveRedirect = (err) => {
      const redirect = err;
      if (!redirect.href) {
        redirect.href = this.buildLocation(redirect).href;
      }
      return redirect;
    };
    this.clearCache = (opts) => {
      const filter = opts == null ? undefined : opts.filter;
      if (filter !== undefined) {
        this.__store.setState((s) => {
          return {
            ...s,
            cachedMatches: s.cachedMatches.filter(
              (m) => !filter(m)
            )
          };
        });
      } else {
        this.__store.setState((s) => {
          return {
            ...s,
            cachedMatches: []
          };
        });
      }
    };
    this.clearExpiredCache = () => {
      const filter = (d) => {
        const route = this.looseRoutesById[d.routeId];
        if (!route.options.loader) {
          return true;
        }
        const gcTime = (d.preload ? route.options.preloadGcTime ?? this.options.defaultPreloadGcTime : route.options.gcTime ?? this.options.defaultGcTime) ?? 5 * 60 * 1e3;
        return !(d.status !== "error" && Date.now() - d.updatedAt < gcTime);
      };
      this.clearCache({ filter });
    };
    this.loadRouteChunk = (route) => {
      if (route._lazyPromise === undefined) {
        if (route.lazyFn) {
          route._lazyPromise = route.lazyFn().then((lazyRoute) => {
            const { id: _id, ...options2 } = lazyRoute.options;
            Object.assign(route.options, options2);
          });
        } else {
          route._lazyPromise = Promise.resolve();
        }
      }
      if (route._componentsPromise === undefined) {
        route._componentsPromise = route._lazyPromise.then(
          () => Promise.all(
            componentTypes.map(async (type) => {
              const component = route.options[type];
              if (component == null ? undefined : component.preload) {
                await component.preload();
              }
            })
          )
        );
      }
      return route._componentsPromise;
    };
    this.preloadRoute = async (opts) => {
      const next = this.buildLocation(opts);
      let matches = this.matchRoutes(next, {
        throwOnError: true,
        preload: true,
        dest: opts
      });
      const activeMatchIds = new Set(
        [...this.state.matches, ...this.state.pendingMatches ?? []].map(
          (d) => d.id
        )
      );
      const loadedMatchIds = /* @__PURE__ */ new Set([
        ...activeMatchIds,
        ...this.state.cachedMatches.map((d) => d.id)
      ]);
      batch(() => {
        matches.forEach((match) => {
          if (!loadedMatchIds.has(match.id)) {
            this.__store.setState((s) => ({
              ...s,
              cachedMatches: [...s.cachedMatches, match]
            }));
          }
        });
      });
      try {
        matches = await this.loadMatches({
          matches,
          location: next,
          preload: true,
          updateMatch: (id, updater) => {
            if (activeMatchIds.has(id)) {
              matches = matches.map((d) => d.id === id ? updater(d) : d);
            } else {
              this.updateMatch(id, updater);
            }
          }
        });
        return matches;
      } catch (err) {
        if (isRedirect(err)) {
          if (err.reloadDocument) {
            return undefined;
          }
          return await this.preloadRoute({
            ...err,
            _fromLocation: next
          });
        }
        console.error(err);
        return undefined;
      }
    };
    this.matchRoute = (location, opts) => {
      const matchLocation = {
        ...location,
        to: location.to ? this.resolvePathWithBase(
          location.from || "",
          location.to
        ) : undefined,
        params: location.params || {},
        leaveParams: true
      };
      const next = this.buildLocation(matchLocation);
      if ((opts == null ? undefined : opts.pending) && this.state.status !== "pending") {
        return false;
      }
      const pending = (opts == null ? undefined : opts.pending) === undefined ? !this.state.isLoading : opts.pending;
      const baseLocation = pending ? this.latestLocation : this.state.resolvedLocation;
      const match = matchPathname(this.basepath, baseLocation.pathname, {
        ...opts,
        to: next.pathname
      });
      if (!match) {
        return false;
      }
      if (location.params) {
        if (!deepEqual(match, location.params, { partial: true })) {
          return false;
        }
      }
      if (match && ((opts == null ? undefined : opts.includeSearch) ?? true)) {
        return deepEqual(baseLocation.search, next.search, { partial: true }) ? match : false;
      }
      return match;
    };
    this.dehydrate = () => {
      var _a;
      const pickError = ((_a = this.options.errorSerializer) == null ? undefined : _a.serialize) ?? defaultSerializeError;
      return {
        state: {
          dehydratedMatches: this.state.matches.map((d) => {
            return {
              ...pick(d, ["id", "status", "updatedAt"]),
              // If an error occurs server-side during SSRing,
              // send a small subset of the error to the client
              error: d.error ? {
                data: pickError(d.error),
                __isServerError: true
              } : undefined
              // NOTE: We don't send the loader data here, because
              // there is a potential that it needs to be streamed.
              // Instead, we render it next to the route match in the HTML
              // which gives us the potential to stream it via suspense.
            };
          })
        },
        manifest: this.manifest
      };
    };
    this.hydrate = () => {
      var _a, _b, _c;
      let ctx;
      if (typeof document !== "undefined") {
        ctx = this.options.transformer.parse((_a = window.__TSR__) == null ? undefined : _a.dehydrated);
      }
      invariant(
        ctx);
      this.dehydratedData = ctx.payload;
      (_c = (_b = this.options).hydrate) == null ? undefined : _c.call(_b, ctx.payload);
      const dehydratedState = ctx.router.state;
      const matches = this.matchRoutes(this.state.location).map((match) => {
        const dehydratedMatch = dehydratedState.dehydratedMatches.find(
          (d) => d.id === match.id
        );
        invariant(
          dehydratedMatch,
          `Could not find a client-side match for dehydrated match with id: ${match.id}!`
        );
        return {
          ...match,
          ...dehydratedMatch
        };
      });
      this.__store.setState((s) => {
        return {
          ...s,
          matches
        };
      });
      this.manifest = ctx.router.manifest;
    };
    this.injectedHtml = [];
    this.injectHtml = (html) => {
      const cb = () => {
        this.injectedHtml = this.injectedHtml.filter((d) => d !== cb);
        return html;
      };
      this.injectedHtml.push(cb);
    };
    this.injectScript = (script, opts) => {
      this.injectHtml(
        `<script class='tsr-once'>${script}${""}; if (typeof __TSR__ !== 'undefined') __TSR__.cleanScripts()</script>`
      );
    };
    this.streamedKeys = /* @__PURE__ */ new Set();
    this.getStreamedValue = (key) => {
      var _a;
      if (this.isServer) {
        return undefined;
      }
      const streamedValue = (_a = window.__TSR__) == null ? undefined : _a.streamedValues[key];
      if (!streamedValue) {
        return;
      }
      if (!streamedValue.parsed) {
        streamedValue.parsed = this.options.transformer.parse(streamedValue.value);
      }
      return streamedValue.parsed;
    };
    this.streamValue = (key, value) => {
      var _a;
      warning$1(
        !this.streamedKeys.has(key));
      this.streamedKeys.add(key);
      this.injectScript(
        `__TSR__.streamedValues['${key}'] = { value: ${(_a = this.serializer) == null ? undefined : _a.call(this, this.options.transformer.stringify(value))}}`
      );
    };
    this._handleNotFound = (matches, err, {
      updateMatch = this.updateMatch
    } = {}) => {
      const matchesByRouteId = Object.fromEntries(
        matches.map((match2) => [match2.routeId, match2])
      );
      let routeCursor = (err.global ? this.looseRoutesById[rootRouteId] : this.looseRoutesById[err.routeId]) || this.looseRoutesById[rootRouteId];
      while (!routeCursor.options.notFoundComponent && !this.options.defaultNotFoundComponent && routeCursor.id !== rootRouteId) {
        routeCursor = routeCursor.parentRoute;
        invariant(
          routeCursor);
      }
      const match = matchesByRouteId[routeCursor.id];
      invariant(match, "Could not find match for route: " + routeCursor.id);
      updateMatch(match.id, (prev) => ({
        ...prev,
        status: "notFound",
        error: err,
        isFetching: false
      }));
      if (err.routerCode === "BEFORE_LOAD" && routeCursor.parentRoute) {
        err.routeId = routeCursor.parentRoute.id;
        this._handleNotFound(matches, err, {
          updateMatch
        });
      }
    };
    this.hasNotFoundMatch = () => {
      return this.__store.state.matches.some(
        (d) => d.status === "notFound" || d.globalNotFound
      );
    };
    this.update({
      defaultPreloadDelay: 50,
      defaultPendingMs: 1e3,
      defaultPendingMinMs: 500,
      context: undefined,
      ...options,
      caseSensitive: options.caseSensitive ?? false,
      notFoundMode: options.notFoundMode ?? "fuzzy",
      stringifySearch: options.stringifySearch ?? defaultStringifySearch,
      parseSearch: options.parseSearch ?? defaultParseSearch,
      transformer: options.transformer ?? defaultTransformer
    });
    if (typeof document !== "undefined") {
      window.__TSR__ROUTER__ = this;
    }
  }
  get state() {
    return this.__store.state;
  }
  get looseRoutesById() {
    return this.routesById;
  }
  matchRoutes(pathnameOrNext, locationSearchOrOpts, opts) {
    if (typeof pathnameOrNext === "string") {
      return this.matchRoutesInternal(
        {
          pathname: pathnameOrNext,
          search: locationSearchOrOpts
        },
        opts
      );
    } else {
      return this.matchRoutesInternal(pathnameOrNext, locationSearchOrOpts);
    }
  }
  matchRoutesInternal(next, opts) {
    const { foundRoute, matchedRoutes, routeParams } = this.getMatchedRoutes(
      next,
      opts == null ? undefined : opts.dest
    );
    let isGlobalNotFound = false;
    if (
      // If we found a route, and it's not an index route and we have left over path
      foundRoute ? foundRoute.path !== "/" && routeParams["**"] : (
        // Or if we didn't find a route and we have left over path
        trimPathRight(next.pathname)
      )
    ) {
      if (this.options.notFoundRoute) {
        matchedRoutes.push(this.options.notFoundRoute);
      } else {
        isGlobalNotFound = true;
      }
    }
    const globalNotFoundRouteId = (() => {
      if (!isGlobalNotFound) {
        return undefined;
      }
      if (this.options.notFoundMode !== "root") {
        for (let i = matchedRoutes.length - 1; i >= 0; i--) {
          const route = matchedRoutes[i];
          if (route.children) {
            return route.id;
          }
        }
      }
      return rootRouteId;
    })();
    const parseErrors = matchedRoutes.map((route) => {
      var _a;
      let parsedParamsError;
      const parseParams = ((_a = route.options.params) == null ? undefined : _a.parse) ?? route.options.parseParams;
      if (parseParams) {
        try {
          const parsedParams = parseParams(routeParams);
          Object.assign(routeParams, parsedParams);
        } catch (err) {
          parsedParamsError = new PathParamError(err.message, {
            cause: err
          });
          if (opts == null ? undefined : opts.throwOnError) {
            throw parsedParamsError;
          }
          return parsedParamsError;
        }
      }
      return;
    });
    const matches = [];
    const getParentContext = (parentMatch) => {
      const parentMatchId = parentMatch == null ? undefined : parentMatch.id;
      const parentContext = !parentMatchId ? this.options.context ?? {} : parentMatch.context ?? this.options.context ?? {};
      return parentContext;
    };
    matchedRoutes.forEach((route, index) => {
      var _a, _b, _c, _d;
      const parentMatch = matches[index - 1];
      const [preMatchSearch, searchError] = (() => {
        const parentSearch = (parentMatch == null ? undefined : parentMatch.search) ?? next.search;
        try {
          const search = validateSearch(route.options.validateSearch, parentSearch) ?? {};
          return [
            {
              ...parentSearch,
              ...search
            },
            void 0
          ];
        } catch (err) {
          const searchParamError = new SearchParamError(err.message, {
            cause: err
          });
          if (opts == null ? undefined : opts.throwOnError) {
            throw searchParamError;
          }
          return [parentSearch, searchParamError];
        }
      })();
      const loaderDeps = ((_b = (_a = route.options).loaderDeps) == null ? undefined : _b.call(_a, {
        search: preMatchSearch
      })) ?? "";
      const loaderDepsHash = loaderDeps ? JSON.stringify(loaderDeps) : "";
      const interpolatedPath = interpolatePath({
        path: route.fullPath,
        params: routeParams,
        decodeCharMap: this.pathParamsDecodeCharMap
      });
      const matchId = interpolatePath({
        path: route.id,
        params: routeParams,
        leaveWildcards: true,
        decodeCharMap: this.pathParamsDecodeCharMap
      }) + loaderDepsHash;
      const existingMatch = this.getMatch(matchId);
      const previousMatch = this.state.matches.find(
        (d) => d.routeId === route.id
      );
      const cause = previousMatch ? "stay" : "enter";
      let match;
      if (existingMatch) {
        match = {
          ...existingMatch,
          cause,
          params: previousMatch ? replaceEqualDeep(previousMatch.params, routeParams) : routeParams,
          search: previousMatch ? replaceEqualDeep(previousMatch.search, preMatchSearch) : replaceEqualDeep(existingMatch.search, preMatchSearch)
        };
      } else {
        const status = route.options.loader || route.options.beforeLoad || route.lazyFn || routeNeedsPreload(route) ? "pending" : "success";
        match = {
          id: matchId,
          index,
          routeId: route.id,
          params: previousMatch ? replaceEqualDeep(previousMatch.params, routeParams) : routeParams,
          pathname: joinPaths([this.basepath, interpolatedPath]),
          updatedAt: Date.now(),
          search: previousMatch ? replaceEqualDeep(previousMatch.search, preMatchSearch) : preMatchSearch,
          searchError: undefined,
          status,
          isFetching: false,
          error: undefined,
          paramsError: parseErrors[index],
          __routeContext: {},
          __beforeLoadContext: {},
          context: {},
          abortController: new AbortController(),
          fetchCount: 0,
          cause,
          loaderDeps: previousMatch ? replaceEqualDeep(previousMatch.loaderDeps, loaderDeps) : loaderDeps,
          invalid: false,
          preload: false,
          links: undefined,
          scripts: undefined,
          meta: undefined,
          staticData: route.options.staticData || {},
          loadPromise: createControlledPromise(),
          fullPath: route.fullPath
        };
      }
      if (match.status === "success") {
        match.headers = (_d = (_c = route.options).headers) == null ? undefined : _d.call(_c, {
          loaderData: match.loaderData
        });
      }
      if (!(opts == null ? undefined : opts.preload)) {
        match.globalNotFound = globalNotFoundRouteId === route.id;
      }
      match.searchError = searchError;
      const parentContext = getParentContext(parentMatch);
      match.context = {
        ...parentContext,
        ...match.__routeContext,
        ...match.__beforeLoadContext
      };
      matches.push(match);
    });
    matches.forEach((match, index) => {
      var _a, _b, _c, _d;
      const route = this.looseRoutesById[match.routeId];
      const existingMatch = this.getMatch(match.id);
      if (!existingMatch && (opts == null ? undefined : opts._buildLocation) !== true) {
        const parentMatch = matches[index - 1];
        const parentContext = getParentContext(parentMatch);
        const contextFnContext = {
          deps: match.loaderDeps,
          params: match.params,
          context: parentContext,
          location: next,
          navigate: (opts2) => this.navigate({ ...opts2, _fromLocation: next }),
          buildLocation: this.buildLocation,
          cause: match.cause,
          abortController: match.abortController,
          preload: !!match.preload,
          matches
        };
        match.__routeContext = ((_b = (_a = route.options).context) == null ? undefined : _b.call(_a, contextFnContext)) ?? {};
        match.context = {
          ...parentContext,
          ...match.__routeContext,
          ...match.__beforeLoadContext
        };
      }
      const headFnContent = (_d = (_c = route.options).head) == null ? undefined : _d.call(_c, {
        matches,
        match,
        params: match.params,
        loaderData: match.loaderData ?? undefined
      });
      match.links = headFnContent == null ? undefined : headFnContent.links;
      match.scripts = headFnContent == null ? undefined : headFnContent.scripts;
      match.meta = headFnContent == null ? undefined : headFnContent.meta;
    });
    return matches;
  }
}
class SearchParamError extends Error {
}
class PathParamError extends Error {
}
function getInitialRouterState(location) {
  return {
    loadedAt: 0,
    isLoading: false,
    isTransitioning: false,
    status: "idle",
    resolvedLocation: { ...location },
    location,
    matches: [],
    pendingMatches: [],
    cachedMatches: [],
    statusCode: 200
  };
}
function defaultSerializeError(err) {
  if (err instanceof Error) {
    const obj = {
      name: err.name,
      message: err.message
    };
    return obj;
  }
  return {
    data: err
  };
}

function isServerSideError(error) {
  if (!(typeof error === "object" && error && "data" in error)) return false;
  if (!("__isServerError" in error && error.__isServerError)) return false;
  if (!(typeof error.data === "object" && error.data)) return false;
  return error.__isServerError === true;
}
function defaultDeserializeError(serializedData) {
  if ("name" in serializedData && "message" in serializedData) {
    const error = new Error(serializedData.message);
    error.name = serializedData.name;
    return error;
  }
  return serializedData.data;
}

const React$1J = await importShared('react');

const matchContext = React$1J.createContext(undefined);
const dummyMatchContext = React$1J.createContext(
  undefined
);

const React$1I = await importShared('react');
function useMatch(opts) {
  const nearestMatchId = React$1I.useContext(
    opts.from ? dummyMatchContext : matchContext
  );
  const matchSelection = useRouterState({
    select: (state) => {
      const match = state.matches.find(
        (d) => opts.from ? opts.from === d.routeId : d.id === nearestMatchId
      );
      invariant(
        !((opts.shouldThrow ?? true) && !match),
        `Could not find ${opts.from ? `an active match from "${opts.from}"` : "a nearest match!"}`
      );
      if (match === undefined) {
        return undefined;
      }
      return opts.select ? opts.select(match) : match;
    },
    structuralSharing: opts.structuralSharing
  });
  return matchSelection;
}

function useLoaderData(opts) {
  return useMatch({
    from: opts.from,
    strict: opts.strict,
    structuralSharing: opts.structuralSharing,
    select: (s) => {
      return opts.select ? opts.select(s.loaderData) : s.loaderData;
    }
  });
}

function useLoaderDeps(opts) {
  const { select, ...rest } = opts;
  return useMatch({
    ...rest,
    select: (s) => {
      return select ? select(s.loaderDeps) : s.loaderDeps;
    }
  });
}

function useParams(opts) {
  return useMatch({
    from: opts.from,
    strict: opts.strict,
    structuralSharing: opts.structuralSharing,
    select: (match) => {
      return opts.select ? opts.select(match.params) : match.params;
    }
  });
}

function useSearch(opts) {
  return useMatch({
    from: opts.from,
    strict: opts.strict,
    structuralSharing: opts.structuralSharing,
    select: (match) => {
      return opts.select ? opts.select(match.search) : match.search;
    }
  });
}

const React$1H = await importShared('react');
function useNavigate(_defaultOpts) {
  const { navigate } = useRouter();
  return React$1H.useCallback(
    (options) => {
      return navigate({
        ...options
      });
    },
    [navigate]
  );
}

let Route$1 = class Route {
  /**
   * @deprecated Use the `createRoute` function instead.
   */
  constructor(options) {
    this.init = (opts) => {
      var _a, _b;
      this.originalIndex = opts.originalIndex;
      const options2 = this.options;
      const isRoot = !(options2 == null ? undefined : options2.path) && !(options2 == null ? undefined : options2.id);
      this.parentRoute = (_b = (_a = this.options).getParentRoute) == null ? undefined : _b.call(_a);
      if (isRoot) {
        this._path = rootRouteId;
      } else {
        invariant(
          this.parentRoute);
      }
      let path = isRoot ? rootRouteId : options2.path;
      if (path && path !== "/") {
        path = trimPathLeft(path);
      }
      const customId = (options2 == null ? undefined : options2.id) || path;
      let id = isRoot ? rootRouteId : joinPaths([
        this.parentRoute.id === rootRouteId ? "" : this.parentRoute.id,
        customId
      ]);
      if (path === rootRouteId) {
        path = "/";
      }
      if (id !== rootRouteId) {
        id = joinPaths(["/", id]);
      }
      const fullPath = id === rootRouteId ? "/" : joinPaths([this.parentRoute.fullPath, path]);
      this._path = path;
      this._id = id;
      this._fullPath = fullPath;
      this._to = fullPath;
      this._ssr = (options2 == null ? undefined : options2.ssr) ?? opts.defaultSsr ?? true;
    };
    this.updateLoader = (options2) => {
      Object.assign(this.options, options2);
      return this;
    };
    this.update = (options2) => {
      Object.assign(this.options, options2);
      return this;
    };
    this.lazy = (lazyFn) => {
      this.lazyFn = lazyFn;
      return this;
    };
    this.useMatch = (opts) => {
      return useMatch({
        select: opts == null ? undefined : opts.select,
        from: this.id,
        structuralSharing: opts == null ? undefined : opts.structuralSharing
      });
    };
    this.useRouteContext = (opts) => {
      return useMatch({
        ...opts,
        from: this.id,
        select: (d) => (opts == null ? undefined : opts.select) ? opts.select(d.context) : d.context
      });
    };
    this.useSearch = (opts) => {
      return useSearch({
        select: opts == null ? undefined : opts.select,
        structuralSharing: opts == null ? undefined : opts.structuralSharing,
        from: this.id
      });
    };
    this.useParams = (opts) => {
      return useParams({
        select: opts == null ? undefined : opts.select,
        structuralSharing: opts == null ? undefined : opts.structuralSharing,
        from: this.id
      });
    };
    this.useLoaderDeps = (opts) => {
      return useLoaderDeps({ ...opts, from: this.id });
    };
    this.useLoaderData = (opts) => {
      return useLoaderData({ ...opts, from: this.id });
    };
    this.useNavigate = () => {
      return useNavigate({ from: this.id });
    };
    this.options = options || {};
    this.isRoot = !(options == null ? undefined : options.getParentRoute);
    invariant(
      !((options == null ? undefined : options.id) && (options == null ? undefined : options.path)));
    this.$$typeof = Symbol.for("react.memo");
  }
  get to() {
    return this._to;
  }
  get id() {
    return this._id;
  }
  get path() {
    return this._path;
  }
  get fullPath() {
    return this._fullPath;
  }
  get ssr() {
    return this._ssr;
  }
  addChildren(children) {
    return this._addFileChildren(children);
  }
  _addFileChildren(children) {
    if (Array.isArray(children)) {
      this.children = children;
    }
    if (typeof children === "object" && children !== null) {
      this.children = Object.values(children);
    }
    return this;
  }
};
function createRoute(options) {
  return new Route$1(options);
}
class RootRoute extends Route$1 {
  /**
   * @deprecated `RootRoute` is now an internal implementation detail. Use `createRootRoute()` instead.
   */
  constructor(options) {
    super(options);
  }
  addChildren(children) {
    super.addChildren(children);
    return this;
  }
  _addFileChildren(children) {
    super._addFileChildren(children);
    return this;
  }
  _addFileTypes() {
    return this;
  }
}
function createRootRoute(options) {
  return new RootRoute(options);
}

function createFileRoute(path) {
  return new FileRoute(path, {
    silent: true
  }).createRoute;
}
class FileRoute {
  constructor(path, _opts) {
    this.path = path;
    this.createRoute = (options) => {
      warning$1(
        this.silent);
      const route = createRoute(options);
      route.isRoot = false;
      return route;
    };
    this.silent = _opts == null ? undefined : _opts.silent;
  }
}
class LazyRoute {
  constructor(opts) {
    this.useMatch = (opts2) => {
      return useMatch({
        select: opts2 == null ? undefined : opts2.select,
        from: this.options.id,
        structuralSharing: opts2 == null ? undefined : opts2.structuralSharing
      });
    };
    this.useRouteContext = (opts2) => {
      return useMatch({
        from: this.options.id,
        select: (d) => (opts2 == null ? undefined : opts2.select) ? opts2.select(d.context) : d.context
      });
    };
    this.useSearch = (opts2) => {
      return useSearch({
        select: opts2 == null ? undefined : opts2.select,
        structuralSharing: opts2 == null ? undefined : opts2.structuralSharing,
        from: this.options.id
      });
    };
    this.useParams = (opts2) => {
      return useParams({
        select: opts2 == null ? undefined : opts2.select,
        structuralSharing: opts2 == null ? undefined : opts2.structuralSharing,
        from: this.options.id
      });
    };
    this.useLoaderDeps = (opts2) => {
      return useLoaderDeps({ ...opts2, from: this.options.id });
    };
    this.useLoaderData = (opts2) => {
      return useLoaderData({ ...opts2, from: this.options.id });
    };
    this.useNavigate = () => {
      return useNavigate({ from: this.options.id });
    };
    this.options = opts;
    this.$$typeof = Symbol.for("react.memo");
  }
}
function createLazyFileRoute(id) {
  return (opts) => new LazyRoute({ id, ...opts });
}

function SafeFragment(props) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: props.children });
}

function renderRouteNotFound(router, route, data) {
  if (!route.options.notFoundComponent) {
    if (router.options.defaultNotFoundComponent) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(router.options.defaultNotFoundComponent, { data });
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(DefaultGlobalNotFound, {});
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(route.options.notFoundComponent, { data });
}

const React$1G = await importShared('react');
const Match = React$1G.memo(function MatchImpl({
  matchId
}) {
  var _a, _b;
  const router = useRouter();
  const routeId = useRouterState({
    select: (s) => {
      var _a2;
      return (_a2 = s.matches.find((d) => d.id === matchId)) == null ? undefined : _a2.routeId;
    }
  });
  invariant(
    routeId);
  const route = router.routesById[routeId];
  const PendingComponent = route.options.pendingComponent ?? router.options.defaultPendingComponent;
  const pendingElement = PendingComponent ? /* @__PURE__ */ jsxRuntimeExports.jsx(PendingComponent, {}) : null;
  const routeErrorComponent = route.options.errorComponent ?? router.options.defaultErrorComponent;
  const routeOnCatch = route.options.onCatch ?? router.options.defaultOnCatch;
  const routeNotFoundComponent = route.isRoot ? (
    // If it's the root route, use the globalNotFound option, with fallback to the notFoundRoute's component
    route.options.notFoundComponent ?? ((_a = router.options.notFoundRoute) == null ? undefined : _a.options.component)
  ) : route.options.notFoundComponent;
  const ResolvedSuspenseBoundary = (
    // If we're on the root route, allow forcefully wrapping in suspense
    (!route.isRoot || route.options.wrapInSuspense) && (route.options.wrapInSuspense ?? PendingComponent ?? ((_b = route.options.errorComponent) == null ? undefined : _b.preload)) ? React$1G.Suspense : SafeFragment
  );
  const ResolvedCatchBoundary = routeErrorComponent ? CatchBoundary : SafeFragment;
  const ResolvedNotFoundBoundary = routeNotFoundComponent ? CatchNotFound : SafeFragment;
  const resetKey = useRouterState({
    select: (s) => s.loadedAt
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(matchContext.Provider, { value: matchId, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResolvedSuspenseBoundary, { fallback: pendingElement, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    ResolvedCatchBoundary,
    {
      getResetKey: () => resetKey,
      errorComponent: routeErrorComponent || ErrorComponent,
      onCatch: (error, errorInfo) => {
        if (isNotFound(error)) throw error;
        routeOnCatch == null ? undefined : routeOnCatch(error, errorInfo);
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        ResolvedNotFoundBoundary,
        {
          fallback: (error) => {
            if (!routeNotFoundComponent || error.routeId && error.routeId !== routeId || !error.routeId && !route.isRoot)
              throw error;
            return React$1G.createElement(routeNotFoundComponent, error);
          },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(MatchInner, { matchId })
        }
      )
    }
  ) }) });
});
const MatchInner = React$1G.memo(function MatchInnerImpl({
  matchId
}) {
  var _a, _b, _c, _d, _e;
  const router = useRouter();
  const { match, matchIndex, routeId } = useRouterState({
    select: (s) => {
      const matchIndex2 = s.matches.findIndex((d) => d.id === matchId);
      const match2 = s.matches[matchIndex2];
      const routeId2 = match2.routeId;
      return {
        routeId: routeId2,
        matchIndex: matchIndex2,
        match: pick(match2, ["id", "status", "error"])
      };
    },
    structuralSharing: true
  });
  const route = router.routesById[routeId];
  const out = React$1G.useMemo(() => {
    const Comp = route.options.component ?? router.options.defaultComponent;
    return Comp ? /* @__PURE__ */ jsxRuntimeExports.jsx(Comp, {}) : /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {});
  }, [route.options.component, router.options.defaultComponent]);
  const RouteErrorComponent = (route.options.errorComponent ?? router.options.defaultErrorComponent) || ErrorComponent;
  if (match.status === "notFound") {
    let error;
    if (isServerSideError(match.error)) {
      const deserializeError = ((_a = router.options.errorSerializer) == null ? undefined : _a.deserialize) ?? defaultDeserializeError;
      error = deserializeError(match.error.data);
    } else {
      error = match.error;
    }
    invariant(isNotFound(error));
    return renderRouteNotFound(router, route, error);
  }
  if (match.status === "redirected") {
    invariant(isRedirect(match.error));
    throw (_b = router.getMatch(match.id)) == null ? undefined : _b.loadPromise;
  }
  if (match.status === "error") {
    if (router.isServer) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        RouteErrorComponent,
        {
          error: match.error,
          info: {
            componentStack: ""
          }
        }
      );
    }
    if (isServerSideError(match.error)) {
      const deserializeError = ((_c = router.options.errorSerializer) == null ? undefined : _c.deserialize) ?? defaultDeserializeError;
      throw deserializeError(match.error.data);
    } else {
      throw match.error;
    }
  }
  if (match.status === "pending") {
    const pendingMinMs = route.options.pendingMinMs ?? router.options.defaultPendingMinMs;
    if (pendingMinMs && !((_d = router.getMatch(match.id)) == null ? undefined : _d.minPendingPromise)) {
      if (!router.isServer) {
        const minPendingPromise = createControlledPromise();
        Promise.resolve().then(() => {
          router.updateMatch(match.id, (prev) => ({
            ...prev,
            minPendingPromise
          }));
        });
        setTimeout(() => {
          minPendingPromise.resolve();
          router.updateMatch(match.id, (prev) => ({
            ...prev,
            minPendingPromise: undefined
          }));
        }, pendingMinMs);
      }
    }
    throw (_e = router.getMatch(match.id)) == null ? undefined : _e.loadPromise;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    out,
    router.AfterEachMatch ? /* @__PURE__ */ jsxRuntimeExports.jsx(router.AfterEachMatch, { match, matchIndex }) : null
  ] });
});
const Outlet = React$1G.memo(function OutletImpl() {
  const router = useRouter();
  const matchId = React$1G.useContext(matchContext);
  const routeId = useRouterState({
    select: (s) => {
      var _a;
      return (_a = s.matches.find((d) => d.id === matchId)) == null ? undefined : _a.routeId;
    }
  });
  const route = router.routesById[routeId];
  const parentGlobalNotFound = useRouterState({
    select: (s) => {
      const matches = s.matches;
      const parentMatch = matches.find((d) => d.id === matchId);
      invariant(
        parentMatch);
      return parentMatch.globalNotFound;
    }
  });
  const childMatchId = useRouterState({
    select: (s) => {
      var _a;
      const matches = s.matches;
      const index = matches.findIndex((d) => d.id === matchId);
      return (_a = matches[index + 1]) == null ? undefined : _a.id;
    }
  });
  if (parentGlobalNotFound) {
    return renderRouteNotFound(router, route, undefined);
  }
  if (!childMatchId) {
    return null;
  }
  const nextMatch = /* @__PURE__ */ jsxRuntimeExports.jsx(Match, { matchId: childMatchId });
  const pendingElement = router.options.defaultPendingComponent ? /* @__PURE__ */ jsxRuntimeExports.jsx(router.options.defaultPendingComponent, {}) : null;
  if (matchId === rootRouteId) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(React$1G.Suspense, { fallback: pendingElement, children: nextMatch });
  }
  return nextMatch;
});

const React$1F = await importShared('react');

const {flushSync} = await importShared('react-dom');
const preloadWarning = "Error preloading route! ☝️";
function useLinkProps(options, forwardedRef) {
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = React$1F.useState(false);
  const hasRenderFetched = React$1F.useRef(false);
  const innerRef = useForwardedRef(forwardedRef);
  const {
    // custom props
    activeProps = () => ({ className: "active" }),
    inactiveProps = () => ({}),
    activeOptions,
    to,
    preload: userPreload,
    preloadDelay: userPreloadDelay,
    hashScrollIntoView,
    replace,
    startTransition,
    resetScroll,
    viewTransition,
    // element props
    children,
    target,
    disabled,
    style,
    className,
    onClick,
    onFocus,
    onMouseEnter,
    onMouseLeave,
    onTouchStart,
    ignoreBlocker,
    ...rest
  } = options;
  const {
    // prevent these from being returned
    params: _params,
    search: _search,
    hash: _hash,
    state: _state,
    mask: _mask,
    reloadDocument: _reloadDocument,
    ...propsSafeToSpread
  } = rest;
  const type = React$1F.useMemo(() => {
    try {
      new URL(`${to}`);
      return "external";
    } catch {
    }
    return "internal";
  }, [to]);
  const currentSearch = useRouterState({
    select: (s) => s.location.search,
    structuralSharing: true
  });
  const parentRouteId = useMatch({ strict: false, select: (s) => s.pathname });
  options = {
    from: parentRouteId,
    ...options
  };
  const next = React$1F.useMemo(
    () => router.buildLocation(options),
    [router, options, currentSearch]
  );
  const preload = React$1F.useMemo(() => {
    if (options.reloadDocument) {
      return false;
    }
    return userPreload ?? router.options.defaultPreload;
  }, [router.options.defaultPreload, userPreload, options.reloadDocument]);
  const preloadDelay = userPreloadDelay ?? router.options.defaultPreloadDelay ?? 0;
  const isActive = useRouterState({
    select: (s) => {
      if (activeOptions == null ? undefined : activeOptions.exact) {
        const testExact = exactPathTest(
          s.location.pathname,
          next.pathname,
          router.basepath
        );
        if (!testExact) {
          return false;
        }
      } else {
        const currentPathSplit = removeTrailingSlash(
          s.location.pathname,
          router.basepath
        ).split("/");
        const nextPathSplit = removeTrailingSlash(
          next.pathname,
          router.basepath
        ).split("/");
        const pathIsFuzzyEqual = nextPathSplit.every(
          (d, i) => d === currentPathSplit[i]
        );
        if (!pathIsFuzzyEqual) {
          return false;
        }
      }
      if ((activeOptions == null ? undefined : activeOptions.includeSearch) ?? true) {
        const searchTest = deepEqual(s.location.search, next.search, {
          partial: !(activeOptions == null ? undefined : activeOptions.exact),
          ignoreUndefined: !(activeOptions == null ? undefined : activeOptions.explicitUndefined)
        });
        if (!searchTest) {
          return false;
        }
      }
      if (activeOptions == null ? undefined : activeOptions.includeHash) {
        return s.location.hash === next.hash;
      }
      return true;
    }
  });
  const doPreload = React$1F.useCallback(() => {
    router.preloadRoute(options).catch((err) => {
      console.warn(err);
      console.warn(preloadWarning);
    });
  }, [options, router]);
  const preloadViewportIoCallback = React$1F.useCallback(
    (entry) => {
      if (entry == null ? undefined : entry.isIntersecting) {
        doPreload();
      }
    },
    [doPreload]
  );
  useIntersectionObserver(
    innerRef,
    preloadViewportIoCallback,
    { rootMargin: "100px" },
    { disabled: !!disabled || !(preload === "viewport") }
  );
  useLayoutEffect$2(() => {
    if (hasRenderFetched.current) {
      return;
    }
    if (!disabled && preload === "render") {
      doPreload();
      hasRenderFetched.current = true;
    }
  }, [disabled, doPreload, preload]);
  if (type === "external") {
    return {
      ...propsSafeToSpread,
      ref: innerRef,
      type,
      href: to,
      ...children && { children },
      ...target && { target },
      ...disabled && { disabled },
      ...style && { style },
      ...className && { className },
      ...onClick && { onClick },
      ...onFocus && { onFocus },
      ...onMouseEnter && { onMouseEnter },
      ...onMouseLeave && { onMouseLeave },
      ...onTouchStart && { onTouchStart }
    };
  }
  const handleClick = (e) => {
    if (!disabled && !isCtrlEvent(e) && !e.defaultPrevented && (!target || target === "_self") && e.button === 0) {
      e.preventDefault();
      flushSync(() => {
        setIsTransitioning(true);
      });
      const unsub = router.subscribe("onResolved", () => {
        unsub();
        setIsTransitioning(false);
      });
      return router.navigate({
        ...options,
        replace,
        resetScroll,
        hashScrollIntoView,
        startTransition,
        viewTransition,
        ignoreBlocker
      });
    }
  };
  const handleFocus = (_) => {
    if (disabled) return;
    if (preload) {
      doPreload();
    }
  };
  const handleTouchStart = handleFocus;
  const handleEnter = (e) => {
    if (disabled) return;
    const eventTarget = e.target || {};
    if (preload) {
      if (eventTarget.preloadTimeout) {
        return;
      }
      eventTarget.preloadTimeout = setTimeout(() => {
        eventTarget.preloadTimeout = null;
        doPreload();
      }, preloadDelay);
    }
  };
  const handleLeave = (e) => {
    if (disabled) return;
    const eventTarget = e.target || {};
    if (eventTarget.preloadTimeout) {
      clearTimeout(eventTarget.preloadTimeout);
      eventTarget.preloadTimeout = null;
    }
  };
  const composeHandlers = (handlers) => (e) => {
    var _a;
    (_a = e.persist) == null ? undefined : _a.call(e);
    handlers.filter(Boolean).forEach((handler) => {
      if (e.defaultPrevented) return;
      handler(e);
    });
  };
  const resolvedActiveProps = isActive ? functionalUpdate(activeProps, {}) ?? {} : {};
  const resolvedInactiveProps = isActive ? {} : functionalUpdate(inactiveProps, {});
  const resolvedClassName = [
    className,
    resolvedActiveProps.className,
    resolvedInactiveProps.className
  ].filter(Boolean).join(" ");
  const resolvedStyle = {
    ...style,
    ...resolvedActiveProps.style,
    ...resolvedInactiveProps.style
  };
  return {
    ...propsSafeToSpread,
    ...resolvedActiveProps,
    ...resolvedInactiveProps,
    href: disabled ? undefined : next.maskedLocation ? router.history.createHref(next.maskedLocation.href) : router.history.createHref(next.href),
    ref: innerRef,
    onClick: composeHandlers([onClick, handleClick]),
    onFocus: composeHandlers([onFocus, handleFocus]),
    onMouseEnter: composeHandlers([onMouseEnter, handleEnter]),
    onMouseLeave: composeHandlers([onMouseLeave, handleLeave]),
    onTouchStart: composeHandlers([onTouchStart, handleTouchStart]),
    disabled: !!disabled,
    target,
    ...Object.keys(resolvedStyle).length && { style: resolvedStyle },
    ...resolvedClassName && { className: resolvedClassName },
    ...disabled && {
      role: "link",
      "aria-disabled": true
    },
    ...isActive && { "data-status": "active", "aria-current": "page" },
    ...isTransitioning && { "data-transitioning": "transitioning" }
  };
}
const Link = React$1F.forwardRef(
  (props, ref) => {
    const { _asChild, ...rest } = props;
    const {
      type: _type,
      ref: innerRef,
      ...linkProps
    } = useLinkProps(rest, ref);
    const children = typeof rest.children === "function" ? rest.children({
      isActive: linkProps["data-status"] === "active"
    }) : rest.children;
    if (typeof _asChild === "undefined") {
      delete linkProps.disabled;
    }
    return React$1F.createElement(
      _asChild ? _asChild : "a",
      {
        ...linkProps,
        ref: innerRef
      },
      children
    );
  }
);
function isCtrlEvent(e) {
  return !!(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey);
}

const React$1E = await importShared('react');
function Transitioner() {
  const router = useRouter();
  const mountLoadForRouter = React$1E.useRef({ router, mounted: false });
  const isLoading = useRouterState({
    select: ({ isLoading: isLoading2 }) => isLoading2
  });
  const [isTransitioning, setIsTransitioning] = React$1E.useState(false);
  const hasPendingMatches = useRouterState({
    select: (s) => s.matches.some((d) => d.status === "pending"),
    structuralSharing: true
  });
  const previousIsLoading = usePrevious$1(isLoading);
  const isAnyPending = isLoading || isTransitioning || hasPendingMatches;
  const previousIsAnyPending = usePrevious$1(isAnyPending);
  const isPagePending = isLoading || hasPendingMatches;
  const previousIsPagePending = usePrevious$1(isPagePending);
  if (!router.isServer) {
    router.startReactTransition = (fn) => {
      setIsTransitioning(true);
      React$1E.startTransition(() => {
        fn();
        setIsTransitioning(false);
      });
    };
  }
  React$1E.useEffect(() => {
    const unsub = router.history.subscribe(router.load);
    const nextLocation = router.buildLocation({
      to: router.latestLocation.pathname,
      search: true,
      params: true,
      hash: true,
      state: true,
      _includeValidateSearch: true
    });
    if (trimPathRight(router.latestLocation.href) !== trimPathRight(nextLocation.href)) {
      router.commitLocation({ ...nextLocation, replace: true });
    }
    return () => {
      unsub();
    };
  }, [router, router.history]);
  useLayoutEffect$2(() => {
    var _a;
    if (typeof window !== "undefined" && ((_a = window.__TSR__) == null ? undefined : _a.dehydrated) || mountLoadForRouter.current.router === router && mountLoadForRouter.current.mounted) {
      return;
    }
    mountLoadForRouter.current = { router, mounted: true };
    const tryLoad = async () => {
      try {
        await router.load();
      } catch (err) {
        console.error(err);
      }
    };
    tryLoad();
  }, [router]);
  useLayoutEffect$2(() => {
    if (previousIsLoading && !isLoading) {
      const toLocation = router.state.location;
      const fromLocation = router.state.resolvedLocation;
      const pathChanged = fromLocation.pathname !== toLocation.pathname;
      const hrefChanged = fromLocation.href !== toLocation.href;
      router.emit({
        type: "onLoad",
        // When the new URL has committed, when the new matches have been loaded into state.matches
        fromLocation,
        toLocation,
        pathChanged,
        hrefChanged
      });
    }
  }, [previousIsLoading, router, isLoading]);
  useLayoutEffect$2(() => {
    if (previousIsPagePending && !isPagePending) {
      const toLocation = router.state.location;
      const fromLocation = router.state.resolvedLocation;
      const pathChanged = fromLocation.pathname !== toLocation.pathname;
      const hrefChanged = fromLocation.href !== toLocation.href;
      router.emit({
        type: "onBeforeRouteMount",
        fromLocation,
        toLocation,
        pathChanged,
        hrefChanged
      });
    }
  }, [isPagePending, previousIsPagePending, router]);
  useLayoutEffect$2(() => {
    if (previousIsAnyPending && !isAnyPending) {
      const toLocation = router.state.location;
      const fromLocation = router.state.resolvedLocation;
      const pathChanged = fromLocation.pathname !== toLocation.pathname;
      const hrefChanged = fromLocation.href !== toLocation.href;
      router.emit({
        type: "onResolved",
        fromLocation,
        toLocation,
        pathChanged,
        hrefChanged
      });
      router.__store.setState((s) => ({
        ...s,
        status: "idle",
        resolvedLocation: s.location
      }));
      if (typeof document !== "undefined" && document.querySelector) {
        const hashScrollIntoViewOptions = router.state.location.state.__hashScrollIntoViewOptions ?? true;
        if (hashScrollIntoViewOptions && router.state.location.hash !== "") {
          const el = document.getElementById(router.state.location.hash);
          if (el) {
            el.scrollIntoView(hashScrollIntoViewOptions);
          }
        }
      }
    }
  }, [isAnyPending, previousIsAnyPending, router]);
  return null;
}

const React$1D = await importShared('react');
function Matches() {
  const router = useRouter();
  const pendingElement = router.options.defaultPendingComponent ? /* @__PURE__ */ jsxRuntimeExports.jsx(router.options.defaultPendingComponent, {}) : null;
  const ResolvedSuspense = router.isServer || typeof document !== "undefined" && window.__TSR__ ? SafeFragment : React$1D.Suspense;
  const inner = /* @__PURE__ */ jsxRuntimeExports.jsxs(ResolvedSuspense, { fallback: pendingElement, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Transitioner, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(MatchesInner, {})
  ] });
  return router.options.InnerWrap ? /* @__PURE__ */ jsxRuntimeExports.jsx(router.options.InnerWrap, { children: inner }) : inner;
}
function MatchesInner() {
  const matchId = useRouterState({
    select: (s) => {
      var _a;
      return (_a = s.matches[0]) == null ? undefined : _a.id;
    }
  });
  const resetKey = useRouterState({
    select: (s) => s.loadedAt
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(matchContext.Provider, { value: matchId, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    CatchBoundary,
    {
      getResetKey: () => resetKey,
      errorComponent: ErrorComponent,
      onCatch: (error) => {
        warning$1(false, error.message || error.toString());
      },
      children: matchId ? /* @__PURE__ */ jsxRuntimeExports.jsx(Match, { matchId }) : null
    }
  ) });
}

function RouterContextProvider({
  router,
  children,
  ...rest
}) {
  router.update({
    ...router.options,
    ...rest,
    context: {
      ...router.options.context,
      ...rest.context
    }
  });
  const routerContext = getRouterContext();
  const provider = /* @__PURE__ */ jsxRuntimeExports.jsx(routerContext.Provider, { value: router, children });
  if (router.options.Wrap) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(router.options.Wrap, { children: provider });
  }
  return provider;
}
function RouterProvider({ router, ...rest }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(RouterContextProvider, { router, ...rest, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Matches, {}) });
}

const scriptRel = /* @__PURE__ */ (function detectScriptRel() {
  const relList = typeof document !== "undefined" && document.createElement("link").relList;
  return relList && relList.supports && relList.supports("modulepreload") ? "modulepreload" : "preload";
})();const assetsURL = function(dep) { return "/"+dep };const seen = {};const __vitePreload = function preload(baseModule, deps, importerUrl) {
  let promise = Promise.resolve();
  if (true && deps && deps.length > 0) {
    document.getElementsByTagName("link");
    const cspNonceMeta = document.querySelector(
      "meta[property=csp-nonce]"
    );
    const cspNonce = cspNonceMeta?.nonce || cspNonceMeta?.getAttribute("nonce");
    promise = Promise.allSettled(
      deps.map((dep) => {
        dep = assetsURL(dep);
        if (dep in seen) return;
        seen[dep] = true;
        const isCss = dep.endsWith(".css");
        const cssSelector = isCss ? '[rel="stylesheet"]' : "";
        if (document.querySelector(`link[href="${dep}"]${cssSelector}`)) {
          return;
        }
        const link = document.createElement("link");
        link.rel = isCss ? "stylesheet" : scriptRel;
        if (!isCss) {
          link.as = "script";
        }
        link.crossOrigin = "";
        link.href = dep;
        if (cspNonce) {
          link.setAttribute("nonce", cspNonce);
        }
        document.head.appendChild(link);
        if (isCss) {
          return new Promise((res, rej) => {
            link.addEventListener("load", res);
            link.addEventListener(
              "error",
              () => rej(new Error(`Unable to preload CSS for ${dep}`))
            );
          });
        }
      })
    );
  }
  function handlePreloadError(err) {
    const e = new Event("vite:preloadError", {
      cancelable: true
    });
    e.payload = err;
    window.dispatchEvent(e);
    if (!e.defaultPrevented) {
      throw err;
    }
  }
  return promise.then((res) => {
    for (const item of res || []) {
      if (item.status !== "rejected") continue;
      handlePreloadError(item.reason);
    }
    return baseModule().catch(handlePreloadError);
  });
};

const {createContext: createContext$1} = await importShared('react');
const initScene = {
  type: "scene",
  payload: new Scene()
};
const MyContext = createContext$1({
  scene: initScene,
  dispatchScene: () => {
  }
});

function reducerScene(scene, action) {
  switch (action.type) {
    case "setScene":
      return { ...scene, payload: { ...action.payload } };
    default:
      return scene;
  }
}

var classnames = {exports: {}};

/*!
	Copyright (c) 2018 Jed Watson.
	Licensed under the MIT License (MIT), see
	http://jedwatson.github.io/classnames
*/

var hasRequiredClassnames;

function requireClassnames () {
	if (hasRequiredClassnames) return classnames.exports;
	hasRequiredClassnames = 1;
	(function (module) {
		/* global define */

		(function () {

			var hasOwn = {}.hasOwnProperty;

			function classNames () {
				var classes = '';

				for (var i = 0; i < arguments.length; i++) {
					var arg = arguments[i];
					if (arg) {
						classes = appendClass(classes, parseValue(arg));
					}
				}

				return classes;
			}

			function parseValue (arg) {
				if (typeof arg === 'string' || typeof arg === 'number') {
					return arg;
				}

				if (typeof arg !== 'object') {
					return '';
				}

				if (Array.isArray(arg)) {
					return classNames.apply(null, arg);
				}

				if (arg.toString !== Object.prototype.toString && !arg.toString.toString().includes('[native code]')) {
					return arg.toString();
				}

				var classes = '';

				for (var key in arg) {
					if (hasOwn.call(arg, key) && arg[key]) {
						classes = appendClass(classes, key);
					}
				}

				return classes;
			}

			function appendClass (value, newClass) {
				if (!newClass) {
					return value;
				}
			
				if (value) {
					return value + ' ' + newClass;
				}
			
				return value + newClass;
			}

			if (module.exports) {
				classNames.default = classNames;
				module.exports = classNames;
			} else {
				window.classNames = classNames;
			}
		}()); 
	} (classnames));
	return classnames.exports;
}

var classnamesExports = requireClassnames();
const classNames = /*@__PURE__*/getDefaultExportFromCjs(classnamesExports);

const React$1C = await importShared('react');

const {useContext: useContext$s,useMemo: useMemo$h} = await importShared('react');
const DEFAULT_BREAKPOINTS = ['xxl', 'xl', 'lg', 'md', 'sm', 'xs'];
const DEFAULT_MIN_BREAKPOINT = 'xs';
const ThemeContext = /*#__PURE__*/React$1C.createContext({
  prefixes: {},
  breakpoints: DEFAULT_BREAKPOINTS,
  minBreakpoint: DEFAULT_MIN_BREAKPOINT
});
function useBootstrapPrefix(prefix, defaultPrefix) {
  const {
    prefixes
  } = useContext$s(ThemeContext);
  return prefix || prefixes[defaultPrefix] || defaultPrefix;
}
function useBootstrapBreakpoints() {
  const {
    breakpoints
  } = useContext$s(ThemeContext);
  return breakpoints;
}
function useBootstrapMinBreakpoint() {
  const {
    minBreakpoint
  } = useContext$s(ThemeContext);
  return minBreakpoint;
}
function useIsRTL() {
  const {
    dir
  } = useContext$s(ThemeContext);
  return dir === 'rtl';
}

const React$1B = await importShared('react');
const Container = /*#__PURE__*/React$1B.forwardRef(({
  bsPrefix,
  fluid = false,
  // Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
  as: Component = 'div',
  className,
  ...props
}, ref) => {
  const prefix = useBootstrapPrefix(bsPrefix, 'container');
  const suffix = typeof fluid === 'string' ? `-${fluid}` : '-fluid';
  return /*#__PURE__*/jsxRuntimeExports.jsx(Component, {
    ref: ref,
    ...props,
    className: classNames(className, fluid ? `${prefix}${suffix}` : prefix)
  });
});
Container.displayName = 'Container';

const React$1A = await importShared('react');
const Row = /*#__PURE__*/React$1A.forwardRef(({
  bsPrefix,
  className,
  // Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
  as: Component = 'div',
  ...props
}, ref) => {
  const decoratedBsPrefix = useBootstrapPrefix(bsPrefix, 'row');
  const breakpoints = useBootstrapBreakpoints();
  const minBreakpoint = useBootstrapMinBreakpoint();
  const sizePrefix = `${decoratedBsPrefix}-cols`;
  const classes = [];
  breakpoints.forEach(brkPoint => {
    const propValue = props[brkPoint];
    delete props[brkPoint];
    let cols;
    if (propValue != null && typeof propValue === 'object') {
      ({
        cols
      } = propValue);
    } else {
      cols = propValue;
    }
    const infix = brkPoint !== minBreakpoint ? `-${brkPoint}` : '';
    if (cols != null) classes.push(`${sizePrefix}${infix}-${cols}`);
  });
  return /*#__PURE__*/jsxRuntimeExports.jsx(Component, {
    ref: ref,
    ...props,
    className: classNames(className, decoratedBsPrefix, ...classes)
  });
});
Row.displayName = 'Row';

function _extends() {
  return _extends = Object.assign ? Object.assign.bind() : function (n) {
    for (var e = 1; e < arguments.length; e++) {
      var t = arguments[e];
      for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
    }
    return n;
  }, _extends.apply(null, arguments);
}

function _objectWithoutPropertiesLoose$a(r, e) {
  if (null == r) return {};
  var t = {};
  for (var n in r) if ({}.hasOwnProperty.call(r, n)) {
    if (e.includes(n)) continue;
    t[n] = r[n];
  }
  return t;
}

function defaultKey(key) {
  return "default" + key.charAt(0).toUpperCase() + key.substr(1);
}

function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }

function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (String )(input); }

const {useCallback: useCallback$f,useRef: useRef$n,useState: useState$h} = await importShared('react');

function useUncontrolledProp$1(propValue, defaultValue, handler) {
  var wasPropRef = useRef$n(propValue !== undefined);

  var _useState = useState$h(defaultValue),
      stateValue = _useState[0],
      setState = _useState[1];

  var isProp = propValue !== undefined;
  var wasProp = wasPropRef.current;
  wasPropRef.current = isProp;
  /**
   * If a prop switches from controlled to Uncontrolled
   * reset its value to the defaultValue
   */

  if (!isProp && wasProp && stateValue !== defaultValue) {
    setState(defaultValue);
  }

  return [isProp ? propValue : stateValue, useCallback$f(function (value) {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    if (handler) handler.apply(undefined, [value].concat(args));
    setState(value);
  }, [handler])];
}
function useUncontrolled(props, config) {
  return Object.keys(config).reduce(function (result, fieldName) {
    var _extends2;

    var _ref = result,
        defaultValue = _ref[defaultKey(fieldName)],
        propsValue = _ref[fieldName],
        rest = _objectWithoutPropertiesLoose$a(_ref, [defaultKey(fieldName), fieldName].map(_toPropertyKey));

    var handlerName = config[fieldName];

    var _useUncontrolledProp = useUncontrolledProp$1(propsValue, defaultValue, props[handlerName]),
        value = _useUncontrolledProp[0],
        handler = _useUncontrolledProp[1];

    return _extends({}, rest, (_extends2 = {}, _extends2[fieldName] = value, _extends2[handlerName] = handler, _extends2));
  }, props);
}

function _setPrototypeOf(t, e) {
  return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) {
    return t.__proto__ = e, t;
  }, _setPrototypeOf(t, e);
}

function _inheritsLoose(t, o) {
  t.prototype = Object.create(o.prototype), t.prototype.constructor = t, _setPrototypeOf(t, o);
}

await importShared('react');

/**
 * Returns the owner document of a given element.
 * 
 * @param node the element
 */
function ownerDocument(node) {
  return node && node.ownerDocument || document;
}

/**
 * Returns the owner window of a given element.
 * 
 * @param node the element
 */

function ownerWindow(node) {
  var doc = ownerDocument(node);
  return doc && doc.defaultView || window;
}

/**
 * Returns one or all computed style properties of an element.
 * 
 * @param node the element
 * @param psuedoElement the style property
 */

function getComputedStyle$1(node, psuedoElement) {
  return ownerWindow(node).getComputedStyle(node, psuedoElement);
}

var rUpper = /([A-Z])/g;
function hyphenate(string) {
  return string.replace(rUpper, '-$1').toLowerCase();
}

/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 * https://github.com/facebook/react/blob/2aeb8a2a6beb00617a4217f7f8284924fa2ad819/src/vendor/core/hyphenateStyleName.js
 */
var msPattern = /^ms-/;
function hyphenateStyleName(string) {
  return hyphenate(string).replace(msPattern, '-ms-');
}

var supportedTransforms = /^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i;
function isTransform(value) {
  return !!(value && supportedTransforms.test(value));
}

function style(node, property) {
  var css = '';
  var transforms = '';

  if (typeof property === 'string') {
    return node.style.getPropertyValue(hyphenateStyleName(property)) || getComputedStyle$1(node).getPropertyValue(hyphenateStyleName(property));
  }

  Object.keys(property).forEach(function (key) {
    var value = property[key];

    if (!value && value !== 0) {
      node.style.removeProperty(hyphenateStyleName(key));
    } else if (isTransform(key)) {
      transforms += key + "(" + value + ") ";
    } else {
      css += hyphenateStyleName(key) + ": " + value + ";";
    }
  });

  if (transforms) {
    css += "transform: " + transforms + ";";
  }

  node.style.cssText += ";" + css;
}

var propTypes$3 = {exports: {}};

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var ReactPropTypesSecret_1;
var hasRequiredReactPropTypesSecret;

function requireReactPropTypesSecret () {
	if (hasRequiredReactPropTypesSecret) return ReactPropTypesSecret_1;
	hasRequiredReactPropTypesSecret = 1;

	var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

	ReactPropTypesSecret_1 = ReactPropTypesSecret;
	return ReactPropTypesSecret_1;
}

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var factoryWithThrowingShims;
var hasRequiredFactoryWithThrowingShims;

function requireFactoryWithThrowingShims () {
	if (hasRequiredFactoryWithThrowingShims) return factoryWithThrowingShims;
	hasRequiredFactoryWithThrowingShims = 1;

	var ReactPropTypesSecret = /*@__PURE__*/ requireReactPropTypesSecret();

	function emptyFunction() {}
	function emptyFunctionWithReset() {}
	emptyFunctionWithReset.resetWarningCache = emptyFunction;

	factoryWithThrowingShims = function() {
	  function shim(props, propName, componentName, location, propFullName, secret) {
	    if (secret === ReactPropTypesSecret) {
	      // It is still safe when called from React.
	      return;
	    }
	    var err = new Error(
	      'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
	      'Use PropTypes.checkPropTypes() to call them. ' +
	      'Read more at http://fb.me/use-check-prop-types'
	    );
	    err.name = 'Invariant Violation';
	    throw err;
	  }	  shim.isRequired = shim;
	  function getShim() {
	    return shim;
	  }	  // Important!
	  // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.
	  var ReactPropTypes = {
	    array: shim,
	    bigint: shim,
	    bool: shim,
	    func: shim,
	    number: shim,
	    object: shim,
	    string: shim,
	    symbol: shim,

	    any: shim,
	    arrayOf: getShim,
	    element: shim,
	    elementType: shim,
	    instanceOf: getShim,
	    node: shim,
	    objectOf: getShim,
	    oneOf: getShim,
	    oneOfType: getShim,
	    shape: getShim,
	    exact: getShim,

	    checkPropTypes: emptyFunctionWithReset,
	    resetWarningCache: emptyFunction
	  };

	  ReactPropTypes.PropTypes = ReactPropTypes;

	  return ReactPropTypes;
	};
	return factoryWithThrowingShims;
}

var hasRequiredPropTypes;

function requirePropTypes () {
	if (hasRequiredPropTypes) return propTypes$3.exports;
	hasRequiredPropTypes = 1;
	{
	  propTypes$3.exports = /*@__PURE__*/ requireFactoryWithThrowingShims()();
	}
	return propTypes$3.exports;
}

var propTypesExports = /*@__PURE__*/ requirePropTypes();
const PropTypes = /*@__PURE__*/getDefaultExportFromCjs(propTypesExports);

const config = {
  disabled: false
};

const React$1z = await importShared('react');

const TransitionGroupContext = React$1z.createContext(null);

var forceReflow = function forceReflow(node) {
  return node.scrollTop;
};

const React$1y = await importShared('react');

const ReactDOM$2 = await importShared('react-dom');
var UNMOUNTED = "unmounted";
var EXITED = "exited";
var ENTERING = "entering";
var ENTERED = "entered";
var EXITING = "exiting";
var Transition = /* @__PURE__ */ function(_React$Component) {
  _inheritsLoose(Transition2, _React$Component);
  function Transition2(props, context) {
    var _this;
    _this = _React$Component.call(this, props, context) || this;
    var parentGroup = context;
    var appear = parentGroup && !parentGroup.isMounting ? props.enter : props.appear;
    var initialStatus;
    _this.appearStatus = null;
    if (props.in) {
      if (appear) {
        initialStatus = EXITED;
        _this.appearStatus = ENTERING;
      } else {
        initialStatus = ENTERED;
      }
    } else {
      if (props.unmountOnExit || props.mountOnEnter) {
        initialStatus = UNMOUNTED;
      } else {
        initialStatus = EXITED;
      }
    }
    _this.state = {
      status: initialStatus
    };
    _this.nextCallback = null;
    return _this;
  }
  Transition2.getDerivedStateFromProps = function getDerivedStateFromProps(_ref, prevState) {
    var nextIn = _ref.in;
    if (nextIn && prevState.status === UNMOUNTED) {
      return {
        status: EXITED
      };
    }
    return null;
  };
  var _proto = Transition2.prototype;
  _proto.componentDidMount = function componentDidMount() {
    this.updateStatus(true, this.appearStatus);
  };
  _proto.componentDidUpdate = function componentDidUpdate(prevProps) {
    var nextStatus = null;
    if (prevProps !== this.props) {
      var status = this.state.status;
      if (this.props.in) {
        if (status !== ENTERING && status !== ENTERED) {
          nextStatus = ENTERING;
        }
      } else {
        if (status === ENTERING || status === ENTERED) {
          nextStatus = EXITING;
        }
      }
    }
    this.updateStatus(false, nextStatus);
  };
  _proto.componentWillUnmount = function componentWillUnmount() {
    this.cancelNextCallback();
  };
  _proto.getTimeouts = function getTimeouts() {
    var timeout2 = this.props.timeout;
    var exit, enter, appear;
    exit = enter = appear = timeout2;
    if (timeout2 != null && typeof timeout2 !== "number") {
      exit = timeout2.exit;
      enter = timeout2.enter;
      appear = timeout2.appear !== undefined ? timeout2.appear : enter;
    }
    return {
      exit,
      enter,
      appear
    };
  };
  _proto.updateStatus = function updateStatus(mounting, nextStatus) {
    if (mounting === undefined) {
      mounting = false;
    }
    if (nextStatus !== null) {
      this.cancelNextCallback();
      if (nextStatus === ENTERING) {
        if (this.props.unmountOnExit || this.props.mountOnEnter) {
          var node = this.props.nodeRef ? this.props.nodeRef.current : ReactDOM$2.findDOMNode(this);
          if (node) forceReflow(node);
        }
        this.performEnter(mounting);
      } else {
        this.performExit();
      }
    } else if (this.props.unmountOnExit && this.state.status === EXITED) {
      this.setState({
        status: UNMOUNTED
      });
    }
  };
  _proto.performEnter = function performEnter(mounting) {
    var _this2 = this;
    var enter = this.props.enter;
    var appearing = this.context ? this.context.isMounting : mounting;
    var _ref2 = this.props.nodeRef ? [appearing] : [ReactDOM$2.findDOMNode(this), appearing], maybeNode = _ref2[0], maybeAppearing = _ref2[1];
    var timeouts = this.getTimeouts();
    var enterTimeout = appearing ? timeouts.appear : timeouts.enter;
    if (!mounting && !enter || config.disabled) {
      this.safeSetState({
        status: ENTERED
      }, function() {
        _this2.props.onEntered(maybeNode);
      });
      return;
    }
    this.props.onEnter(maybeNode, maybeAppearing);
    this.safeSetState({
      status: ENTERING
    }, function() {
      _this2.props.onEntering(maybeNode, maybeAppearing);
      _this2.onTransitionEnd(enterTimeout, function() {
        _this2.safeSetState({
          status: ENTERED
        }, function() {
          _this2.props.onEntered(maybeNode, maybeAppearing);
        });
      });
    });
  };
  _proto.performExit = function performExit() {
    var _this3 = this;
    var exit = this.props.exit;
    var timeouts = this.getTimeouts();
    var maybeNode = this.props.nodeRef ? undefined : ReactDOM$2.findDOMNode(this);
    if (!exit || config.disabled) {
      this.safeSetState({
        status: EXITED
      }, function() {
        _this3.props.onExited(maybeNode);
      });
      return;
    }
    this.props.onExit(maybeNode);
    this.safeSetState({
      status: EXITING
    }, function() {
      _this3.props.onExiting(maybeNode);
      _this3.onTransitionEnd(timeouts.exit, function() {
        _this3.safeSetState({
          status: EXITED
        }, function() {
          _this3.props.onExited(maybeNode);
        });
      });
    });
  };
  _proto.cancelNextCallback = function cancelNextCallback() {
    if (this.nextCallback !== null) {
      this.nextCallback.cancel();
      this.nextCallback = null;
    }
  };
  _proto.safeSetState = function safeSetState(nextState, callback) {
    callback = this.setNextCallback(callback);
    this.setState(nextState, callback);
  };
  _proto.setNextCallback = function setNextCallback(callback) {
    var _this4 = this;
    var active = true;
    this.nextCallback = function(event) {
      if (active) {
        active = false;
        _this4.nextCallback = null;
        callback(event);
      }
    };
    this.nextCallback.cancel = function() {
      active = false;
    };
    return this.nextCallback;
  };
  _proto.onTransitionEnd = function onTransitionEnd(timeout2, handler) {
    this.setNextCallback(handler);
    var node = this.props.nodeRef ? this.props.nodeRef.current : ReactDOM$2.findDOMNode(this);
    var doesNotHaveTimeoutOrListener = timeout2 == null && !this.props.addEndListener;
    if (!node || doesNotHaveTimeoutOrListener) {
      setTimeout(this.nextCallback, 0);
      return;
    }
    if (this.props.addEndListener) {
      var _ref3 = this.props.nodeRef ? [this.nextCallback] : [node, this.nextCallback], maybeNode = _ref3[0], maybeNextCallback = _ref3[1];
      this.props.addEndListener(maybeNode, maybeNextCallback);
    }
    if (timeout2 != null) {
      setTimeout(this.nextCallback, timeout2);
    }
  };
  _proto.render = function render() {
    var status = this.state.status;
    if (status === UNMOUNTED) {
      return null;
    }
    var _this$props = this.props, children = _this$props.children; _this$props.in; _this$props.mountOnEnter; _this$props.unmountOnExit; _this$props.appear; _this$props.enter; _this$props.exit; _this$props.timeout; _this$props.addEndListener; _this$props.onEnter; _this$props.onEntering; _this$props.onEntered; _this$props.onExit; _this$props.onExiting; _this$props.onExited; _this$props.nodeRef; var childProps = _objectWithoutPropertiesLoose$a(_this$props, ["children", "in", "mountOnEnter", "unmountOnExit", "appear", "enter", "exit", "timeout", "addEndListener", "onEnter", "onEntering", "onEntered", "onExit", "onExiting", "onExited", "nodeRef"]);
    return (
      // allows for nested Transitions
      /* @__PURE__ */ React$1y.createElement(TransitionGroupContext.Provider, {
        value: null
      }, typeof children === "function" ? children(status, childProps) : React$1y.cloneElement(React$1y.Children.only(children), childProps))
    );
  };
  return Transition2;
}(React$1y.Component);
Transition.contextType = TransitionGroupContext;
Transition.propTypes = {};
function noop$4() {
}
Transition.defaultProps = {
  in: false,
  mountOnEnter: false,
  unmountOnExit: false,
  appear: false,
  enter: true,
  exit: true,
  onEnter: noop$4,
  onEntering: noop$4,
  onEntered: noop$4,
  onExit: noop$4,
  onExiting: noop$4,
  onExited: noop$4
};
Transition.UNMOUNTED = UNMOUNTED;
Transition.EXITED = EXITED;
Transition.ENTERING = ENTERING;
Transition.ENTERED = ENTERED;
Transition.EXITING = EXITING;

const React$1x = await importShared('react');

function isEscKey(e) {
  return e.code === 'Escape' || e.keyCode === 27;
}
function getReactVersion() {
  const parts = React$1x.version.split('.');
  return {
    major: +parts[0],
    minor: +parts[1],
    patch: +parts[2]
  };
}
function getChildRef(element) {
  if (!element || typeof element === 'function') {
    return null;
  }
  const {
    major
  } = getReactVersion();
  const childRef = major >= 19 ? element.props.ref : element.ref;
  return childRef;
}

const canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);

/* eslint-disable no-return-assign */
var optionsSupported = false;
var onceSupported = false;

try {
  var options = {
    get passive() {
      return optionsSupported = true;
    },

    get once() {
      // eslint-disable-next-line no-multi-assign
      return onceSupported = optionsSupported = true;
    }

  };

  if (canUseDOM) {
    window.addEventListener('test', options, options);
    window.removeEventListener('test', options, true);
  }
} catch (e) {
  /* */
}

/**
 * An `addEventListener` ponyfill, supports the `once` option
 * 
 * @param node the element
 * @param eventName the event name
 * @param handle the handler
 * @param options event options
 */
function addEventListener(node, eventName, handler, options) {
  if (options && typeof options !== 'boolean' && !onceSupported) {
    var once = options.once,
        capture = options.capture;
    var wrappedHandler = handler;

    if (!onceSupported && once) {
      wrappedHandler = handler.__once || function onceHandler(event) {
        this.removeEventListener(eventName, onceHandler, capture);
        handler.call(this, event);
      };

      handler.__once = wrappedHandler;
    }

    node.addEventListener(eventName, wrappedHandler, optionsSupported ? options : capture);
  }

  node.addEventListener(eventName, handler, options);
}

/**
 * A `removeEventListener` ponyfill
 * 
 * @param node the element
 * @param eventName the event name
 * @param handle the handler
 * @param options event options
 */
function removeEventListener(node, eventName, handler, options) {
  var capture = options && typeof options !== 'boolean' ? options.capture : options;
  node.removeEventListener(eventName, handler, capture);

  if (handler.__once) {
    node.removeEventListener(eventName, handler.__once, capture);
  }
}

function listen(node, eventName, handler, options) {
  addEventListener(node, eventName, handler, options);
  return function () {
    removeEventListener(node, eventName, handler, options);
  };
}

/**
 * Triggers an event on a given element.
 * 
 * @param node the element
 * @param eventName the event name to trigger
 * @param bubbles whether the event should bubble up
 * @param cancelable whether the event should be cancelable
 */
function triggerEvent(node, eventName, bubbles, cancelable) {

  if (cancelable === undefined) {
    cancelable = true;
  }

  if (node) {
    var event = document.createEvent('HTMLEvents');
    event.initEvent(eventName, bubbles, cancelable);
    node.dispatchEvent(event);
  }
}

function parseDuration$1(node) {
  var str = style(node, 'transitionDuration') || '';
  var mult = str.indexOf('ms') === -1 ? 1000 : 1;
  return parseFloat(str) * mult;
}

function emulateTransitionEnd(element, duration, padding) {
  if (padding === undefined) {
    padding = 5;
  }

  var called = false;
  var handle = setTimeout(function () {
    if (!called) triggerEvent(element, 'transitionend', true);
  }, duration + padding);
  var remove = listen(element, 'transitionend', function () {
    called = true;
  }, {
    once: true
  });
  return function () {
    clearTimeout(handle);
    remove();
  };
}

function transitionEnd(element, handler, duration, padding) {
  if (duration == null) duration = parseDuration$1(element) || 0;
  var removeEmulate = emulateTransitionEnd(element, duration, padding);
  var remove = listen(element, 'transitionend', handler);
  return function () {
    removeEmulate();
    remove();
  };
}

function parseDuration(node, property) {
  const str = style(node, property) || '';
  const mult = str.indexOf('ms') === -1 ? 1000 : 1;
  return parseFloat(str) * mult;
}
function transitionEndListener(element, handler) {
  const duration = parseDuration(element, 'transitionDuration');
  const delay = parseDuration(element, 'transitionDelay');
  const remove = transitionEnd(element, e => {
    if (e.target === element) {
      remove();
      handler(e);
    }
  }, duration + delay);
}

/**
 * Safe chained function
 *
 * Will only create a new function if needed,
 * otherwise will pass back existing functions or null.
 *
 * @param {function} functions to chain
 * @returns {function|null}
 */
function createChainedFunction(...funcs) {
  return funcs.filter(f => f != null).reduce((acc, f) => {
    if (typeof f !== 'function') {
      throw new Error('Invalid Argument Type, must only provide functions, undefined, or null.');
    }
    if (acc === null) return f;
    return function chainedFunction(...args) {
      // @ts-ignore
      acc.apply(this, args);
      // @ts-ignore
      f.apply(this, args);
    };
  }, null);
}

// reading a dimension prop will cause the browser to recalculate,
// which will let our animations work
function triggerBrowserReflow(node) {
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  node.offsetHeight;
}

const {useMemo: useMemo$g} = await importShared('react');

const toFnRef$1 = ref => !ref || typeof ref === 'function' ? ref : value => {
  ref.current = value;
};
function mergeRefs$1(refA, refB) {
  const a = toFnRef$1(refA);
  const b = toFnRef$1(refB);
  return value => {
    if (a) a(value);
    if (b) b(value);
  };
}

/**
 * Create and returns a single callback ref composed from two other Refs.
 *
 * ```tsx
 * const Button = React.forwardRef((props, ref) => {
 *   const [element, attachRef] = useCallbackRef<HTMLButtonElement>();
 *   const mergedRef = useMergedRefs(ref, attachRef);
 *
 *   return <button ref={mergedRef} {...props}/>
 * })
 * ```
 *
 * @param refA A Callback or mutable Ref
 * @param refB A Callback or mutable Ref
 * @category refs
 */
function useMergedRefs$1(refA, refB) {
  return useMemo$g(() => mergeRefs$1(refA, refB), [refA, refB]);
}

const ReactDOM$1 = await importShared('react-dom');

function safeFindDOMNode(componentOrElement) {
  if (componentOrElement && 'setState' in componentOrElement) {
    return ReactDOM$1.findDOMNode(componentOrElement);
  }
  return componentOrElement != null ? componentOrElement : null;
}

const React$1w = await importShared('react');
const {useCallback: useCallback$e,useRef: useRef$m} = React$1w;
// Normalizes Transition callbacks when nodeRef is used.
const TransitionWrapper = /*#__PURE__*/React$1w.forwardRef(({
  onEnter,
  onEntering,
  onEntered,
  onExit,
  onExiting,
  onExited,
  addEndListener,
  children,
  childRef,
  ...props
}, ref) => {
  const nodeRef = useRef$m(null);
  const mergedRef = useMergedRefs$1(nodeRef, childRef);
  const attachRef = r => {
    mergedRef(safeFindDOMNode(r));
  };
  const normalize = callback => param => {
    if (callback && nodeRef.current) {
      callback(nodeRef.current, param);
    }
  };

  /* eslint-disable react-hooks/exhaustive-deps */
  const handleEnter = useCallback$e(normalize(onEnter), [onEnter]);
  const handleEntering = useCallback$e(normalize(onEntering), [onEntering]);
  const handleEntered = useCallback$e(normalize(onEntered), [onEntered]);
  const handleExit = useCallback$e(normalize(onExit), [onExit]);
  const handleExiting = useCallback$e(normalize(onExiting), [onExiting]);
  const handleExited = useCallback$e(normalize(onExited), [onExited]);
  const handleAddEndListener = useCallback$e(normalize(addEndListener), [addEndListener]);
  /* eslint-enable react-hooks/exhaustive-deps */

  return /*#__PURE__*/jsxRuntimeExports.jsx(Transition, {
    ref: ref,
    ...props,
    onEnter: handleEnter,
    onEntered: handleEntered,
    onEntering: handleEntering,
    onExit: handleExit,
    onExited: handleExited,
    onExiting: handleExiting,
    addEndListener: handleAddEndListener,
    nodeRef: nodeRef,
    children: typeof children === 'function' ? (status, innerProps) =>
    // TODO: Types for RTG missing innerProps, so need to cast.
    children(status, {
      ...innerProps,
      ref: attachRef
    }) : /*#__PURE__*/React$1w.cloneElement(children, {
      ref: attachRef
    })
  });
});

const React$1v = await importShared('react');
const {useMemo: useMemo$f} = React$1v;
const MARGINS = {
  height: ['marginTop', 'marginBottom'],
  width: ['marginLeft', 'marginRight']
};
function getDefaultDimensionValue(dimension, elem) {
  const offset = `offset${dimension[0].toUpperCase()}${dimension.slice(1)}`;
  const value = elem[offset];
  const margins = MARGINS[dimension];
  return value +
  // @ts-ignore
  parseInt(style(elem, margins[0]), 10) +
  // @ts-ignore
  parseInt(style(elem, margins[1]), 10);
}
const collapseStyles = {
  [EXITED]: 'collapse',
  [EXITING]: 'collapsing',
  [ENTERING]: 'collapsing',
  [ENTERED]: 'collapse show'
};
const Collapse = /*#__PURE__*/React$1v.forwardRef(({
  onEnter,
  onEntering,
  onEntered,
  onExit,
  onExiting,
  className,
  children,
  dimension = 'height',
  in: inProp = false,
  timeout = 300,
  mountOnEnter = false,
  unmountOnExit = false,
  appear = false,
  getDimensionValue = getDefaultDimensionValue,
  ...props
}, ref) => {
  /* Compute dimension */
  const computedDimension = typeof dimension === 'function' ? dimension() : dimension;

  /* -- Expanding -- */
  const handleEnter = useMemo$f(() => createChainedFunction(elem => {
    elem.style[computedDimension] = '0';
  }, onEnter), [computedDimension, onEnter]);
  const handleEntering = useMemo$f(() => createChainedFunction(elem => {
    const scroll = `scroll${computedDimension[0].toUpperCase()}${computedDimension.slice(1)}`;
    elem.style[computedDimension] = `${elem[scroll]}px`;
  }, onEntering), [computedDimension, onEntering]);
  const handleEntered = useMemo$f(() => createChainedFunction(elem => {
    elem.style[computedDimension] = null;
  }, onEntered), [computedDimension, onEntered]);

  /* -- Collapsing -- */
  const handleExit = useMemo$f(() => createChainedFunction(elem => {
    elem.style[computedDimension] = `${getDimensionValue(computedDimension, elem)}px`;
    triggerBrowserReflow(elem);
  }, onExit), [onExit, getDimensionValue, computedDimension]);
  const handleExiting = useMemo$f(() => createChainedFunction(elem => {
    elem.style[computedDimension] = null;
  }, onExiting), [computedDimension, onExiting]);
  return /*#__PURE__*/jsxRuntimeExports.jsx(TransitionWrapper, {
    ref: ref,
    addEndListener: transitionEndListener,
    ...props,
    "aria-expanded": props.role ? inProp : null,
    onEnter: handleEnter,
    onEntering: handleEntering,
    onEntered: handleEntered,
    onExit: handleExit,
    onExiting: handleExiting,
    childRef: getChildRef(children),
    in: inProp,
    timeout: timeout,
    mountOnEnter: mountOnEnter,
    unmountOnExit: unmountOnExit,
    appear: appear,
    children: (state, innerProps) => /*#__PURE__*/React$1v.cloneElement(children, {
      ...innerProps,
      className: classNames(className, children.props.className, collapseStyles[state], computedDimension === 'width' && 'collapse-horizontal')
    })
  });
});

const React$1u = await importShared('react');

function isAccordionItemSelected(activeEventKey, eventKey) {
  return Array.isArray(activeEventKey) ? activeEventKey.includes(eventKey) : activeEventKey === eventKey;
}
const context$4 = /*#__PURE__*/React$1u.createContext({});
context$4.displayName = 'AccordionContext';

const React$1t = await importShared('react');

const {useContext: useContext$r} = await importShared('react');
/**
 * This component accepts all of [`Collapse`'s props](/docs/utilities/transitions#collapse-1).
 */
const AccordionCollapse = /*#__PURE__*/React$1t.forwardRef(({
  as: Component = 'div',
  bsPrefix,
  className,
  children,
  eventKey,
  ...props
}, ref) => {
  const {
    activeEventKey
  } = useContext$r(context$4);
  bsPrefix = useBootstrapPrefix(bsPrefix, 'accordion-collapse');
  return /*#__PURE__*/jsxRuntimeExports.jsx(Collapse, {
    ref: ref,
    in: isAccordionItemSelected(activeEventKey, eventKey),
    ...props,
    className: classNames(className, bsPrefix),
    children: /*#__PURE__*/jsxRuntimeExports.jsx(Component, {
      children: React$1t.Children.only(children)
    })
  });
});
AccordionCollapse.displayName = 'AccordionCollapse';

const React$1s = await importShared('react');

const context$3 = /*#__PURE__*/React$1s.createContext({
  eventKey: ''
});
context$3.displayName = 'AccordionItemContext';

const React$1r = await importShared('react');

const {useContext: useContext$q} = await importShared('react');
const AccordionBody = /*#__PURE__*/React$1r.forwardRef(({
  // Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
  as: Component = 'div',
  bsPrefix,
  className,
  onEnter,
  onEntering,
  onEntered,
  onExit,
  onExiting,
  onExited,
  ...props
}, ref) => {
  bsPrefix = useBootstrapPrefix(bsPrefix, 'accordion-body');
  const {
    eventKey
  } = useContext$q(context$3);
  return /*#__PURE__*/jsxRuntimeExports.jsx(AccordionCollapse, {
    eventKey: eventKey,
    onEnter: onEnter,
    onEntering: onEntering,
    onEntered: onEntered,
    onExit: onExit,
    onExiting: onExiting,
    onExited: onExited,
    children: /*#__PURE__*/jsxRuntimeExports.jsx(Component, {
      ref: ref,
      ...props,
      className: classNames(className, bsPrefix)
    })
  });
});
AccordionBody.displayName = 'AccordionBody';

const React$1q = await importShared('react');

const {useContext: useContext$p} = await importShared('react');
function useAccordionButton(eventKey, onClick) {
  const {
    activeEventKey,
    onSelect,
    alwaysOpen
  } = useContext$p(context$4);
  return e => {
    /*
      Compare the event key in context with the given event key.
      If they are the same, then collapse the component.
    */
    let eventKeyPassed = eventKey === activeEventKey ? null : eventKey;
    if (alwaysOpen) {
      if (Array.isArray(activeEventKey)) {
        if (activeEventKey.includes(eventKey)) {
          eventKeyPassed = activeEventKey.filter(k => k !== eventKey);
        } else {
          eventKeyPassed = [...activeEventKey, eventKey];
        }
      } else {
        // activeEventKey is undefined.
        eventKeyPassed = [eventKey];
      }
    }
    onSelect == null || onSelect(eventKeyPassed, e);
    onClick == null || onClick(e);
  };
}
const AccordionButton = /*#__PURE__*/React$1q.forwardRef(({
  // Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
  as: Component = 'button',
  bsPrefix,
  className,
  onClick,
  ...props
}, ref) => {
  bsPrefix = useBootstrapPrefix(bsPrefix, 'accordion-button');
  const {
    eventKey
  } = useContext$p(context$3);
  const accordionOnClick = useAccordionButton(eventKey, onClick);
  const {
    activeEventKey
  } = useContext$p(context$4);
  if (Component === 'button') {
    props.type = 'button';
  }
  return /*#__PURE__*/jsxRuntimeExports.jsx(Component, {
    ref: ref,
    onClick: accordionOnClick,
    ...props,
    "aria-expanded": Array.isArray(activeEventKey) ? activeEventKey.includes(eventKey) : eventKey === activeEventKey,
    className: classNames(className, bsPrefix, !isAccordionItemSelected(activeEventKey, eventKey) && 'collapsed')
  });
});
AccordionButton.displayName = 'AccordionButton';

const React$1p = await importShared('react');
const AccordionHeader = /*#__PURE__*/React$1p.forwardRef(({
  // Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
  as: Component = 'h2',
  'aria-controls': ariaControls,
  bsPrefix,
  className,
  children,
  onClick,
  ...props
}, ref) => {
  bsPrefix = useBootstrapPrefix(bsPrefix, 'accordion-header');
  return /*#__PURE__*/jsxRuntimeExports.jsx(Component, {
    ref: ref,
    ...props,
    className: classNames(className, bsPrefix),
    children: /*#__PURE__*/jsxRuntimeExports.jsx(AccordionButton, {
      onClick: onClick,
      "aria-controls": ariaControls,
      children: children
    })
  });
});
AccordionHeader.displayName = 'AccordionHeader';

const React$1o = await importShared('react');

const {useMemo: useMemo$e} = await importShared('react');
const AccordionItem = /*#__PURE__*/React$1o.forwardRef(({
  // Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
  as: Component = 'div',
  bsPrefix,
  className,
  eventKey,
  ...props
}, ref) => {
  bsPrefix = useBootstrapPrefix(bsPrefix, 'accordion-item');
  const contextValue = useMemo$e(() => ({
    eventKey
  }), [eventKey]);
  return /*#__PURE__*/jsxRuntimeExports.jsx(context$3.Provider, {
    value: contextValue,
    children: /*#__PURE__*/jsxRuntimeExports.jsx(Component, {
      ref: ref,
      ...props,
      className: classNames(className, bsPrefix)
    })
  });
});
AccordionItem.displayName = 'AccordionItem';

const React$1n = await importShared('react');

const {useMemo: useMemo$d} = await importShared('react');
const Accordion = /*#__PURE__*/React$1n.forwardRef((props, ref) => {
  const {
    // Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
    as: Component = 'div',
    activeKey,
    bsPrefix,
    className,
    onSelect,
    flush,
    alwaysOpen,
    ...controlledProps
  } = useUncontrolled(props, {
    activeKey: 'onSelect'
  });
  const prefix = useBootstrapPrefix(bsPrefix, 'accordion');
  const contextValue = useMemo$d(() => ({
    activeEventKey: activeKey,
    onSelect,
    alwaysOpen
  }), [activeKey, onSelect, alwaysOpen]);
  return /*#__PURE__*/jsxRuntimeExports.jsx(context$4.Provider, {
    value: contextValue,
    children: /*#__PURE__*/jsxRuntimeExports.jsx(Component, {
      ref: ref,
      ...controlledProps,
      className: classNames(className, prefix, flush && `${prefix}-flush`)
    })
  });
});
Accordion.displayName = 'Accordion';
const Accordion$1 = Object.assign(Accordion, {
  Button: AccordionButton,
  Collapse: AccordionCollapse,
  Item: AccordionItem,
  Header: AccordionHeader,
  Body: AccordionBody
});

const {useEffect: useEffect$n,useRef: useRef$l} = await importShared('react');


/**
 * Creates a `Ref` whose value is updated in an effect, ensuring the most recent
 * value is the one rendered with. Generally only required for Concurrent mode usage
 * where previous work in `render()` may be discarded before being used.
 *
 * This is safe to access in an event handler.
 *
 * @param value The `Ref` value
 */
function useCommittedRef$1(value) {
  const ref = useRef$l(value);
  useEffect$n(() => {
    ref.current = value;
  }, [value]);
  return ref;
}

const {useCallback: useCallback$d} = await importShared('react');
function useEventCallback$1(fn) {
  const ref = useCommittedRef$1(fn);
  return useCallback$d(function (...args) {
    return ref.current && ref.current(...args);
  }, [ref]);
}

const React$1m = await importShared('react');
const divWithClassName = (className => /*#__PURE__*/React$1m.forwardRef((p, ref) => /*#__PURE__*/jsxRuntimeExports.jsx("div", {
  ...p,
  ref: ref,
  className: classNames(p.className, className)
})));

const React$1l = await importShared('react');
const DivStyledAsH4$1 = divWithClassName('h4');
DivStyledAsH4$1.displayName = 'DivStyledAsH4';
const AlertHeading = /*#__PURE__*/React$1l.forwardRef(({
  className,
  bsPrefix,
  as: Component = DivStyledAsH4$1,
  ...props
}, ref) => {
  bsPrefix = useBootstrapPrefix(bsPrefix, 'alert-heading');
  return /*#__PURE__*/jsxRuntimeExports.jsx(Component, {
    ref: ref,
    className: classNames(className, bsPrefix),
    ...props
  });
});
AlertHeading.displayName = 'AlertHeading';

const {useState: useState$g} = await importShared('react');


/**
 * A convenience hook around `useState` designed to be paired with
 * the component [callback ref](https://reactjs.org/docs/refs-and-the-dom.html#callback-refs) api.
 * Callback refs are useful over `useRef()` when you need to respond to the ref being set
 * instead of lazily accessing it in an effect.
 *
 * ```ts
 * const [element, attachRef] = useCallbackRef<HTMLDivElement>()
 *
 * useEffect(() => {
 *   if (!element) return
 *
 *   const calendar = new FullCalendar.Calendar(element)
 *
 *   return () => {
 *     calendar.destroy()
 *   }
 * }, [element])
 *
 * return <div ref={attachRef} />
 * ```
 *
 * @category refs
 */
function useCallbackRef$1() {
  return useState$g(null);
}

const {useEffect: useEffect$m,useRef: useRef$k} = await importShared('react');


/**
 * Creates a `Ref` whose value is updated in an effect, ensuring the most recent
 * value is the one rendered with. Generally only required for Concurrent mode usage
 * where previous work in `render()` may be discarded before being used.
 *
 * This is safe to access in an event handler.
 *
 * @param value The `Ref` value
 */
function useCommittedRef(value) {
  const ref = useRef$k(value);
  useEffect$m(() => {
    ref.current = value;
  }, [value]);
  return ref;
}

const {useCallback: useCallback$c} = await importShared('react');
function useEventCallback(fn) {
  const ref = useCommittedRef(fn);
  return useCallback$c(function (...args) {
    return ref.current && ref.current(...args);
  }, [ref]);
}

const {useEffect: useEffect$l} = await importShared('react');
/**
 * Attaches an event handler outside directly to specified DOM element
 * bypassing the react synthetic event system.
 *
 * @param element The target to listen for events on
 * @param event The DOM event name
 * @param handler An event handler
 * @param capture Whether or not to listen during the capture event phase
 */
function useEventListener(eventTarget, event, listener, capture = false) {
  const handler = useEventCallback(listener);
  useEffect$l(() => {
    const target = typeof eventTarget === 'function' ? eventTarget() : eventTarget;
    target.addEventListener(event, handler, capture);
    return () => target.removeEventListener(event, handler, capture);
  }, [eventTarget]);
}

await importShared('react');

await importShared('react');

await importShared('react');

await importShared('react');

const {useRef: useRef$j,useEffect: useEffect$k} = await importShared('react');


/**
 * Track whether a component is current mounted. Generally less preferable than
 * properlly canceling effects so they don't run after a component is unmounted,
 * but helpful in cases where that isn't feasible, such as a `Promise` resolution.
 *
 * @returns a function that returns the current isMounted state of the component
 *
 * ```ts
 * const [data, setData] = useState(null)
 * const isMounted = useMounted()
 *
 * useEffect(() => {
 *   fetchdata().then((newData) => {
 *      if (isMounted()) {
 *        setData(newData);
 *      }
 *   })
 * })
 * ```
 */
function useMounted$1() {
  const mounted = useRef$j(true);
  const isMounted = useRef$j(() => mounted.current);
  useEffect$k(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  return isMounted.current;
}

const {useEffect: useEffect$j,useRef: useRef$i} = await importShared('react');


/**
 * Store the last of some value. Tracked via a `Ref` only updating it
 * after the component renders.
 *
 * Helpful if you need to compare a prop value to it's previous value during render.
 *
 * ```ts
 * function Component(props) {
 *   const lastProps = usePrevious(props)
 *
 *   if (lastProps.foo !== props.foo)
 *     resetValueFromProps(props.foo)
 * }
 * ```
 *
 * @param value the value to track
 */
function usePrevious(value) {
  const ref = useRef$i(null);
  useEffect$j(() => {
    ref.current = value;
  });
  return ref.current;
}

await importShared('react');

const {useEffect: useEffect$i,useLayoutEffect: useLayoutEffect$1} = await importShared('react');

const isReactNative$1 = typeof global !== 'undefined' &&
// @ts-ignore
global.navigator &&
// @ts-ignore
global.navigator.product === 'ReactNative';
const isDOM$1 = typeof document !== 'undefined';

/**
 * Is `useLayoutEffect` in a DOM or React Native environment, otherwise resolves to useEffect
 * Only useful to avoid the console warning.
 *
 * PREFER `useEffect` UNLESS YOU KNOW WHAT YOU ARE DOING.
 *
 * @category effects
 */
const useIsomorphicEffect$1 = isDOM$1 || isReactNative$1 ? useLayoutEffect$1 : useEffect$i;

await importShared('react');

const _excluded$9 = ["as", "disabled"];
function _objectWithoutPropertiesLoose$9(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (e.indexOf(n) >= 0) continue; t[n] = r[n]; } return t; }
const React$1k = await importShared('react');
function isTrivialHref$1(href) {
  return !href || href.trim() === '#';
}
function useButtonProps({
  tagName,
  disabled,
  href,
  target,
  rel,
  role,
  onClick,
  tabIndex = 0,
  type
}) {
  if (!tagName) {
    if (href != null || target != null || rel != null) {
      tagName = 'a';
    } else {
      tagName = 'button';
    }
  }
  const meta = {
    tagName
  };
  if (tagName === 'button') {
    return [{
      type: type || 'button',
      disabled
    }, meta];
  }
  const handleClick = event => {
    if (disabled || tagName === 'a' && isTrivialHref$1(href)) {
      event.preventDefault();
    }
    if (disabled) {
      event.stopPropagation();
      return;
    }
    onClick == null ? undefined : onClick(event);
  };
  const handleKeyDown = event => {
    if (event.key === ' ') {
      event.preventDefault();
      handleClick(event);
    }
  };
  if (tagName === 'a') {
    // Ensure there's a href so Enter can trigger anchor button.
    href || (href = '#');
    if (disabled) {
      href = undefined;
    }
  }
  return [{
    role: role != null ? role : 'button',
    // explicitly undefined so that it overrides the props disabled in a spread
    // e.g. <Tag {...props} {...hookProps} />
    disabled: undefined,
    tabIndex: disabled ? undefined : tabIndex,
    href,
    target: tagName === 'a' ? target : undefined,
    'aria-disabled': !disabled ? undefined : disabled,
    rel: tagName === 'a' ? rel : undefined,
    onClick: handleClick,
    onKeyDown: handleKeyDown
  }, meta];
}
const Button$1 = /*#__PURE__*/React$1k.forwardRef((_ref, ref) => {
  let {
      as: asProp,
      disabled
    } = _ref,
    props = _objectWithoutPropertiesLoose$9(_ref, _excluded$9);
  const [buttonProps, {
    tagName: Component
  }] = useButtonProps(Object.assign({
    tagName: asProp,
    disabled
  }, props));
  return /*#__PURE__*/jsxRuntimeExports.jsx(Component, Object.assign({}, props, buttonProps, {
    ref: ref
  }));
});
Button$1.displayName = 'Button';

const _excluded$8 = ["onKeyDown"];
function _objectWithoutPropertiesLoose$8(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (e.indexOf(n) >= 0) continue; t[n] = r[n]; } return t; }
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/anchor-has-content */

const React$1j = await importShared('react');
function isTrivialHref(href) {
  return !href || href.trim() === '#';
}
/**
 * An generic `<a>` component that covers a few A11y cases, ensuring that
 * cases where the `href` is missing or trivial like "#" are treated like buttons.
 */
const Anchor = /*#__PURE__*/React$1j.forwardRef((_ref, ref) => {
  let {
      onKeyDown
    } = _ref,
    props = _objectWithoutPropertiesLoose$8(_ref, _excluded$8);
  const [buttonProps] = useButtonProps(Object.assign({
    tagName: 'a'
  }, props));
  const handleKeyDown = useEventCallback(e => {
    buttonProps.onKeyDown(e);
    onKeyDown == null ? undefined : onKeyDown(e);
  });
  if (isTrivialHref(props.href) || props.role === 'button') {
    return /*#__PURE__*/jsxRuntimeExports.jsx("a", Object.assign({
      ref: ref
    }, props, buttonProps, {
      onKeyDown: handleKeyDown
    }));
  }
  return /*#__PURE__*/jsxRuntimeExports.jsx("a", Object.assign({
    ref: ref
  }, props, {
    onKeyDown: onKeyDown
  }));
});
Anchor.displayName = 'Anchor';

const React$1i = await importShared('react');
const AlertLink = /*#__PURE__*/React$1i.forwardRef(({
  className,
  bsPrefix,
  as: Component = Anchor,
  ...props
}, ref) => {
  bsPrefix = useBootstrapPrefix(bsPrefix, 'alert-link');
  return /*#__PURE__*/jsxRuntimeExports.jsx(Component, {
    ref: ref,
    className: classNames(className, bsPrefix),
    ...props
  });
});
AlertLink.displayName = 'AlertLink';

const React$1h = await importShared('react');

const {useCallback: useCallback$b} = await importShared('react');
const fadeStyles$1 = {
  [ENTERING]: 'show',
  [ENTERED]: 'show'
};
const Fade = /*#__PURE__*/React$1h.forwardRef(({
  className,
  children,
  transitionClasses = {},
  onEnter,
  ...rest
}, ref) => {
  const props = {
    in: false,
    timeout: 300,
    mountOnEnter: false,
    unmountOnExit: false,
    appear: false,
    ...rest
  };
  const handleEnter = useCallback$b((node, isAppearing) => {
    triggerBrowserReflow(node);
    onEnter == null || onEnter(node, isAppearing);
  }, [onEnter]);
  return /*#__PURE__*/jsxRuntimeExports.jsx(TransitionWrapper, {
    ref: ref,
    addEndListener: transitionEndListener,
    ...props,
    onEnter: handleEnter,
    childRef: getChildRef(children),
    children: (status, innerProps) => /*#__PURE__*/React$1h.cloneElement(children, {
      ...innerProps,
      className: classNames('fade', className, children.props.className, fadeStyles$1[status], transitionClasses[status])
    })
  });
});
Fade.displayName = 'Fade';

const React$1g = await importShared('react');
const propTypes$2 = {
  /** An accessible label indicating the relevant information about the Close Button. */
  'aria-label': PropTypes.string,
  /** A callback fired after the Close Button is clicked. */
  onClick: PropTypes.func,
  /**
   * Render different color variant for the button.
   *
   * Omitting this will render the default dark color.
   */
  variant: PropTypes.oneOf(['white'])
};
const CloseButton = /*#__PURE__*/React$1g.forwardRef(({
  className,
  variant,
  'aria-label': ariaLabel = 'Close',
  ...props
}, ref) => /*#__PURE__*/jsxRuntimeExports.jsx("button", {
  ref: ref,
  type: "button",
  className: classNames('btn-close', variant && `btn-close-${variant}`, className),
  "aria-label": ariaLabel,
  ...props
}));
CloseButton.displayName = 'CloseButton';
CloseButton.propTypes = propTypes$2;

const React$1f = await importShared('react');
const Alert = /*#__PURE__*/React$1f.forwardRef((uncontrolledProps, ref) => {
  const {
    bsPrefix,
    show = true,
    closeLabel = 'Close alert',
    closeVariant,
    className,
    children,
    variant = 'primary',
    onClose,
    dismissible,
    transition = Fade,
    ...props
  } = useUncontrolled(uncontrolledProps, {
    show: 'onClose'
  });
  const prefix = useBootstrapPrefix(bsPrefix, 'alert');
  const handleClose = useEventCallback$1(e => {
    if (onClose) {
      onClose(false, e);
    }
  });
  const Transition = transition === true ? Fade : transition;
  const alert = /*#__PURE__*/jsxRuntimeExports.jsxs("div", {
    role: "alert",
    ...(!Transition ? props : undefined),
    ref: ref,
    className: classNames(className, prefix, variant && `${prefix}-${variant}`, dismissible && `${prefix}-dismissible`),
    children: [dismissible && /*#__PURE__*/jsxRuntimeExports.jsx(CloseButton, {
      onClick: handleClose,
      "aria-label": closeLabel,
      variant: closeVariant
    }), children]
  });
  if (!Transition) return show ? alert : null;
  return /*#__PURE__*/jsxRuntimeExports.jsx(Transition, {
    unmountOnExit: true,
    ...props,
    ref: undefined,
    in: show,
    children: alert
  });
});
Alert.displayName = 'Alert';
const Alert$1 = Object.assign(Alert, {
  Link: AlertLink,
  Heading: AlertHeading
});

const React$1e = await importShared('react');
const Button = /*#__PURE__*/React$1e.forwardRef(({
  as,
  bsPrefix,
  variant = 'primary',
  size,
  active = false,
  disabled = false,
  className,
  ...props
}, ref) => {
  const prefix = useBootstrapPrefix(bsPrefix, 'btn');
  const [buttonProps, {
    tagName
  }] = useButtonProps({
    tagName: as,
    disabled,
    ...props
  });
  const Component = tagName;
  return /*#__PURE__*/jsxRuntimeExports.jsx(Component, {
    ...buttonProps,
    ...props,
    ref: ref,
    disabled: disabled,
    className: classNames(className, prefix, active && 'active', variant && `${prefix}-${variant}`, size && `${prefix}-${size}`, props.href && disabled && 'disabled')
  });
});
Button.displayName = 'Button';

const React$1d = await importShared('react');
const ButtonGroup = /*#__PURE__*/React$1d.forwardRef(({
  bsPrefix,
  size,
  vertical = false,
  className,
  role = 'group',
  // Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
  as: Component = 'div',
  ...rest
}, ref) => {
  const prefix = useBootstrapPrefix(bsPrefix, 'btn-group');
  let baseClass = prefix;
  if (vertical) baseClass = `${prefix}-vertical`;
  return /*#__PURE__*/jsxRuntimeExports.jsx(Component, {
    ...rest,
    ref: ref,
    role: role,
    className: classNames(className, baseClass, size && `${prefix}-${size}`)
  });
});
ButtonGroup.displayName = 'ButtonGroup';

const React$1c = await importShared('react');
const CardBody = /*#__PURE__*/React$1c.forwardRef(({
  className,
  bsPrefix,
  as: Component = 'div',
  ...props
}, ref) => {
  bsPrefix = useBootstrapPrefix(bsPrefix, 'card-body');
  return /*#__PURE__*/jsxRuntimeExports.jsx(Component, {
    ref: ref,
    className: classNames(className, bsPrefix),
    ...props
  });
});
CardBody.displayName = 'CardBody';

const React$1b = await importShared('react');
const CardFooter = /*#__PURE__*/React$1b.forwardRef(({
  className,
  bsPrefix,
  as: Component = 'div',
  ...props
}, ref) => {
  bsPrefix = useBootstrapPrefix(bsPrefix, 'card-footer');
  return /*#__PURE__*/jsxRuntimeExports.jsx(Component, {
    ref: ref,
    className: classNames(className, bsPrefix),
    ...props
  });
});
CardFooter.displayName = 'CardFooter';

const React$1a = await importShared('react');

const context$2 = /*#__PURE__*/React$1a.createContext(null);
context$2.displayName = 'CardHeaderContext';

const React$19 = await importShared('react');

const {useMemo: useMemo$c} = await importShared('react');
const CardHeader = /*#__PURE__*/React$19.forwardRef(({
  bsPrefix,
  className,
  // Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
  as: Component = 'div',
  ...props
}, ref) => {
  const prefix = useBootstrapPrefix(bsPrefix, 'card-header');
  const contextValue = useMemo$c(() => ({
    cardHeaderBsPrefix: prefix
  }), [prefix]);
  return /*#__PURE__*/jsxRuntimeExports.jsx(context$2.Provider, {
    value: contextValue,
    children: /*#__PURE__*/jsxRuntimeExports.jsx(Component, {
      ref: ref,
      ...props,
      className: classNames(className, prefix)
    })
  });
});
CardHeader.displayName = 'CardHeader';

const React$18 = await importShared('react');
const CardImg = /*#__PURE__*/React$18.forwardRef(
// Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
({
  bsPrefix,
  className,
  variant,
  as: Component = 'img',
  ...props
}, ref) => {
  const prefix = useBootstrapPrefix(bsPrefix, 'card-img');
  return /*#__PURE__*/jsxRuntimeExports.jsx(Component, {
    ref: ref,
    className: classNames(variant ? `${prefix}-${variant}` : prefix, className),
    ...props
  });
});
CardImg.displayName = 'CardImg';

const React$17 = await importShared('react');
const CardImgOverlay = /*#__PURE__*/React$17.forwardRef(({
  className,
  bsPrefix,
  as: Component = 'div',
  ...props
}, ref) => {
  bsPrefix = useBootstrapPrefix(bsPrefix, 'card-img-overlay');
  return /*#__PURE__*/jsxRuntimeExports.jsx(Component, {
    ref: ref,
    className: classNames(className, bsPrefix),
    ...props
  });
});
CardImgOverlay.displayName = 'CardImgOverlay';

const React$16 = await importShared('react');
const CardLink = /*#__PURE__*/React$16.forwardRef(({
  className,
  bsPrefix,
  as: Component = 'a',
  ...props
}, ref) => {
  bsPrefix = useBootstrapPrefix(bsPrefix, 'card-link');
  return /*#__PURE__*/jsxRuntimeExports.jsx(Component, {
    ref: ref,
    className: classNames(className, bsPrefix),
    ...props
  });
});
CardLink.displayName = 'CardLink';

const React$15 = await importShared('react');
const DivStyledAsH6 = divWithClassName('h6');
const CardSubtitle = /*#__PURE__*/React$15.forwardRef(({
  className,
  bsPrefix,
  as: Component = DivStyledAsH6,
  ...props
}, ref) => {
  bsPrefix = useBootstrapPrefix(bsPrefix, 'card-subtitle');
  return /*#__PURE__*/jsxRuntimeExports.jsx(Component, {
    ref: ref,
    className: classNames(className, bsPrefix),
    ...props
  });
});
CardSubtitle.displayName = 'CardSubtitle';

const React$14 = await importShared('react');
const CardText = /*#__PURE__*/React$14.forwardRef(({
  className,
  bsPrefix,
  as: Component = 'p',
  ...props
}, ref) => {
  bsPrefix = useBootstrapPrefix(bsPrefix, 'card-text');
  return /*#__PURE__*/jsxRuntimeExports.jsx(Component, {
    ref: ref,
    className: classNames(className, bsPrefix),
    ...props
  });
});
CardText.displayName = 'CardText';

const React$13 = await importShared('react');
const DivStyledAsH5$1 = divWithClassName('h5');
const CardTitle = /*#__PURE__*/React$13.forwardRef(({
  className,
  bsPrefix,
  as: Component = DivStyledAsH5$1,
  ...props
}, ref) => {
  bsPrefix = useBootstrapPrefix(bsPrefix, 'card-title');
  return /*#__PURE__*/jsxRuntimeExports.jsx(Component, {
    ref: ref,
    className: classNames(className, bsPrefix),
    ...props
  });
});
CardTitle.displayName = 'CardTitle';

const React$12 = await importShared('react');
const Card = /*#__PURE__*/React$12.forwardRef(({
  bsPrefix,
  className,
  bg,
  text,
  border,
  body = false,
  children,
  // Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
  as: Component = 'div',
  ...props
}, ref) => {
  const prefix = useBootstrapPrefix(bsPrefix, 'card');
  return /*#__PURE__*/jsxRuntimeExports.jsx(Component, {
    ref: ref,
    ...props,
    className: classNames(className, prefix, bg && `bg-${bg}`, text && `text-${text}`, border && `border-${border}`),
    children: body ? /*#__PURE__*/jsxRuntimeExports.jsx(CardBody, {
      children: children
    }) : children
  });
});
Card.displayName = 'Card';
const Card$1 = Object.assign(Card, {
  Img: CardImg,
  Title: CardTitle,
  Subtitle: CardSubtitle,
  Body: CardBody,
  Link: CardLink,
  Text: CardText,
  Header: CardHeader,
  Footer: CardFooter,
  ImgOverlay: CardImgOverlay
});

const {useRef: useRef$h,useEffect: useEffect$h} = await importShared('react');


/**
 * Track whether a component is current mounted. Generally less preferable than
 * properlly canceling effects so they don't run after a component is unmounted,
 * but helpful in cases where that isn't feasible, such as a `Promise` resolution.
 *
 * @returns a function that returns the current isMounted state of the component
 *
 * ```ts
 * const [data, setData] = useState(null)
 * const isMounted = useMounted()
 *
 * useEffect(() => {
 *   fetchdata().then((newData) => {
 *      if (isMounted()) {
 *        setData(newData);
 *      }
 *   })
 * })
 * ```
 */
function useMounted() {
  const mounted = useRef$h(true);
  const isMounted = useRef$h(() => mounted.current);
  useEffect$h(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  return isMounted.current;
}

const {useRef: useRef$g} = await importShared('react');


/**
 * Returns a ref that is immediately updated with the new value
 *
 * @param value The Ref value
 * @category refs
 */
function useUpdatedRef$1(value) {
  const valueRef = useRef$g(value);
  valueRef.current = value;
  return valueRef;
}

const {useEffect: useEffect$g} = await importShared('react');


/**
 * Attach a callback that fires when a component unmounts
 *
 * @param fn Handler to run when the component unmounts
 * @category effects
 */
function useWillUnmount$1(fn) {
  const onUnmount = useUpdatedRef$1(fn);
  useEffect$g(() => () => onUnmount.current(), []);
}

const {useMemo: useMemo$b,useRef: useRef$f} = await importShared('react');

/*
 * Browsers including Internet Explorer, Chrome, Safari, and Firefox store the
 * delay as a 32-bit signed integer internally. This causes an integer overflow
 * when using delays larger than 2,147,483,647 ms (about 24.8 days),
 * resulting in the timeout being executed immediately.
 *
 * via: https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout
 */
const MAX_DELAY_MS = 2 ** 31 - 1;
function setChainedTimeout(handleRef, fn, timeoutAtMs) {
  const delayMs = timeoutAtMs - Date.now();
  handleRef.current = delayMs <= MAX_DELAY_MS ? setTimeout(fn, delayMs) : setTimeout(() => setChainedTimeout(handleRef, fn, timeoutAtMs), MAX_DELAY_MS);
}

/**
 * Returns a controller object for setting a timeout that is properly cleaned up
 * once the component unmounts. New timeouts cancel and replace existing ones.
 *
 *
 *
 * ```tsx
 * const { set, clear } = useTimeout();
 * const [hello, showHello] = useState(false);
 * //Display hello after 5 seconds
 * set(() => showHello(true), 5000);
 * return (
 *   <div className="App">
 *     {hello ? <h3>Hello</h3> : null}
 *   </div>
 * );
 * ```
 */
function useTimeout() {
  const isMounted = useMounted();

  // types are confused between node and web here IDK
  const handleRef = useRef$f();
  useWillUnmount$1(() => clearTimeout(handleRef.current));
  return useMemo$b(() => {
    const clear = () => clearTimeout(handleRef.current);
    function set(fn, delayMs = 0) {
      if (!isMounted()) return;
      clear();
      if (delayMs <= MAX_DELAY_MS) {
        // For simplicity, if the timeout is short, just set a normal timeout.
        handleRef.current = setTimeout(fn, delayMs);
      } else {
        setChainedTimeout(handleRef, fn, Date.now() + delayMs);
      }
    }
    return {
      set,
      clear,
      handleRef
    };
  }, []);
}

const React$11 = await importShared('react');


/**
 * Iterates through children that are typically specified as `props.children`,
 * but only maps over children that are "valid elements".
 *
 * The mapFunction provided index will be normalised to the components mapped,
 * so an invalid component would not increase the index.
 *
 */
function map(children, func) {
  let index = 0;
  return React$11.Children.map(children, child => /*#__PURE__*/React$11.isValidElement(child) ? func(child, index++) : child);
}

/**
 * Finds whether a component's `children` prop includes a React element of the
 * specified type.
 */
function hasChildOfType(children, type) {
  return React$11.Children.toArray(children).some(child => /*#__PURE__*/React$11.isValidElement(child) && child.type === type);
}

const React$10 = await importShared('react');
function useCol({
  as,
  bsPrefix,
  className,
  ...props
}) {
  bsPrefix = useBootstrapPrefix(bsPrefix, 'col');
  const breakpoints = useBootstrapBreakpoints();
  const minBreakpoint = useBootstrapMinBreakpoint();
  const spans = [];
  const classes = [];
  breakpoints.forEach(brkPoint => {
    const propValue = props[brkPoint];
    delete props[brkPoint];
    let span;
    let offset;
    let order;
    if (typeof propValue === 'object' && propValue != null) {
      ({
        span,
        offset,
        order
      } = propValue);
    } else {
      span = propValue;
    }
    const infix = brkPoint !== minBreakpoint ? `-${brkPoint}` : '';
    if (span) spans.push(span === true ? `${bsPrefix}${infix}` : `${bsPrefix}${infix}-${span}`);
    if (order != null) classes.push(`order${infix}-${order}`);
    if (offset != null) classes.push(`offset${infix}-${offset}`);
  });
  return [{
    ...props,
    className: classNames(className, ...spans, ...classes)
  }, {
    as,
    bsPrefix,
    spans
  }];
}
const Col = /*#__PURE__*/React$10.forwardRef(
// Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
(props, ref) => {
  const [{
    className,
    ...colProps
  }, {
    as: Component = 'div',
    bsPrefix,
    spans
  }] = useCol(props);
  return /*#__PURE__*/jsxRuntimeExports.jsx(Component, {
    ...colProps,
    ref: ref,
    className: classNames(className, !spans.length && bsPrefix)
  });
});
Col.displayName = 'Col';

var toArray = Function.prototype.bind.call(Function.prototype.call, [].slice);
/**
 * Runs `querySelectorAll` on a given element.
 * 
 * @param element the element
 * @param selector the selector
 */

function qsa(element, selector) {
  return toArray(element.querySelectorAll(selector));
}

const {useCallback: useCallback$a,useRef: useRef$e,useState: useState$f} = await importShared('react');
function useUncontrolledProp(propValue, defaultValue, handler) {
  const wasPropRef = useRef$e(propValue !== undefined);
  const [stateValue, setState] = useState$f(defaultValue);
  const isProp = propValue !== undefined;
  const wasProp = wasPropRef.current;
  wasPropRef.current = isProp;

  /**
   * If a prop switches from controlled to Uncontrolled
   * reset its value to the defaultValue
   */
  if (!isProp && wasProp && stateValue !== defaultValue) {
    setState(defaultValue);
  }
  return [isProp ? propValue : stateValue, useCallback$a((...args) => {
    const [value, ...rest] = args;
    let returnValue = handler == null ? undefined : handler(value, ...rest);
    setState(value);
    return returnValue;
  }, [handler])];
}

const {useReducer} = await importShared('react');


/**
 * Returns a function that triggers a component update. the hook equivalent to
 * `this.forceUpdate()` in a class component. In most cases using a state value directly
 * is preferable but may be required in some advanced usages of refs for interop or
 * when direct DOM manipulation is required.
 *
 * ```ts
 * const forceUpdate = useForceUpdate();
 *
 * const updateOnClick = useCallback(() => {
 *  forceUpdate()
 * }, [forceUpdate])
 *
 * return <button type="button" onClick={updateOnClick}>Hi there</button>
 * ```
 */
function useForceUpdate() {
  // The toggling state value is designed to defeat React optimizations for skipping
  // updates when they are strictly equal to the last state value
  const [, dispatch] = useReducer(revision => revision + 1, 0);
  return dispatch;
}

const React$$ = await importShared('react');

const DropdownContext$1 = /*#__PURE__*/React$$.createContext(null);

var has = Object.prototype.hasOwnProperty;

function find(iter, tar, key) {
	for (key of iter.keys()) {
		if (dequal(key, tar)) return key;
	}
}

function dequal(foo, bar) {
	var ctor, len, tmp;
	if (foo === bar) return true;

	if (foo && bar && (ctor=foo.constructor) === bar.constructor) {
		if (ctor === Date) return foo.getTime() === bar.getTime();
		if (ctor === RegExp) return foo.toString() === bar.toString();

		if (ctor === Array) {
			if ((len=foo.length) === bar.length) {
				while (len-- && dequal(foo[len], bar[len]));
			}
			return len === -1;
		}

		if (ctor === Set) {
			if (foo.size !== bar.size) {
				return false;
			}
			for (len of foo) {
				tmp = len;
				if (tmp && typeof tmp === 'object') {
					tmp = find(bar, tmp);
					if (!tmp) return false;
				}
				if (!bar.has(tmp)) return false;
			}
			return true;
		}

		if (ctor === Map) {
			if (foo.size !== bar.size) {
				return false;
			}
			for (len of foo) {
				tmp = len[0];
				if (tmp && typeof tmp === 'object') {
					tmp = find(bar, tmp);
					if (!tmp) return false;
				}
				if (!dequal(len[1], bar.get(tmp))) {
					return false;
				}
			}
			return true;
		}

		if (ctor === ArrayBuffer) {
			foo = new Uint8Array(foo);
			bar = new Uint8Array(bar);
		} else if (ctor === DataView) {
			if ((len=foo.byteLength) === bar.byteLength) {
				while (len-- && foo.getInt8(len) === bar.getInt8(len));
			}
			return len === -1;
		}

		if (ArrayBuffer.isView(foo)) {
			if ((len=foo.byteLength) === bar.byteLength) {
				while (len-- && foo[len] === bar[len]);
			}
			return len === -1;
		}

		if (!ctor || typeof foo === 'object') {
			len = 0;
			for (ctor in foo) {
				if (has.call(foo, ctor) && ++len && !has.call(bar, ctor)) return false;
				if (!(ctor in bar) || !dequal(foo[ctor], bar[ctor])) return false;
			}
			return Object.keys(bar).length === len;
		}
	}

	return foo !== foo && bar !== bar;
}

const {useCallback: useCallback$9} = await importShared('react');

/**
 * `useSafeState` takes the return value of a `useState` hook and wraps the
 * setter to prevent updates onces the component has unmounted. Can used
 * with `useMergeState` and `useStateAsync` as well
 *
 * @param state The return value of a useStateHook
 *
 * ```ts
 * const [show, setShow] = useSafeState(useState(true));
 * ```
 */

function useSafeState(state) {
  const isMounted = useMounted$1();
  return [state[0], useCallback$9(nextState => {
    if (!isMounted()) return;
    return state[1](nextState);
  }, [isMounted, state[1]])];
}

var top = 'top';
var bottom = 'bottom';
var right = 'right';
var left = 'left';
var auto = 'auto';
var basePlacements = [top, bottom, right, left];
var start = 'start';
var end = 'end';
var clippingParents = 'clippingParents';
var viewport = 'viewport';
var popper = 'popper';
var reference = 'reference';
var variationPlacements = /*#__PURE__*/basePlacements.reduce(function (acc, placement) {
  return acc.concat([placement + "-" + start, placement + "-" + end]);
}, []);
var placements = /*#__PURE__*/[].concat(basePlacements, [auto]).reduce(function (acc, placement) {
  return acc.concat([placement, placement + "-" + start, placement + "-" + end]);
}, []); // modifiers that need to read the DOM

var beforeRead = 'beforeRead';
var read = 'read';
var afterRead = 'afterRead'; // pure-logic modifiers

var beforeMain = 'beforeMain';
var main = 'main';
var afterMain = 'afterMain'; // modifier with the purpose to write to the DOM (or write into a framework state)

var beforeWrite = 'beforeWrite';
var write = 'write';
var afterWrite = 'afterWrite';
var modifierPhases = [beforeRead, read, afterRead, beforeMain, main, afterMain, beforeWrite, write, afterWrite];

function getBasePlacement(placement) {
  return placement.split('-')[0];
}

function getWindow(node) {
  if (node == null) {
    return window;
  }

  if (node.toString() !== '[object Window]') {
    var ownerDocument = node.ownerDocument;
    return ownerDocument ? ownerDocument.defaultView || window : window;
  }

  return node;
}

function isElement(node) {
  var OwnElement = getWindow(node).Element;
  return node instanceof OwnElement || node instanceof Element;
}

function isHTMLElement(node) {
  var OwnElement = getWindow(node).HTMLElement;
  return node instanceof OwnElement || node instanceof HTMLElement;
}

function isShadowRoot(node) {
  // IE 11 has no ShadowRoot
  if (typeof ShadowRoot === 'undefined') {
    return false;
  }

  var OwnElement = getWindow(node).ShadowRoot;
  return node instanceof OwnElement || node instanceof ShadowRoot;
}

var max = Math.max;
var min = Math.min;
var round = Math.round;

function getUAString() {
  var uaData = navigator.userAgentData;

  if (uaData != null && uaData.brands && Array.isArray(uaData.brands)) {
    return uaData.brands.map(function (item) {
      return item.brand + "/" + item.version;
    }).join(' ');
  }

  return navigator.userAgent;
}

function isLayoutViewport() {
  return !/^((?!chrome|android).)*safari/i.test(getUAString());
}

function getBoundingClientRect(element, includeScale, isFixedStrategy) {
  if (includeScale === undefined) {
    includeScale = false;
  }

  if (isFixedStrategy === undefined) {
    isFixedStrategy = false;
  }

  var clientRect = element.getBoundingClientRect();
  var scaleX = 1;
  var scaleY = 1;

  if (includeScale && isHTMLElement(element)) {
    scaleX = element.offsetWidth > 0 ? round(clientRect.width) / element.offsetWidth || 1 : 1;
    scaleY = element.offsetHeight > 0 ? round(clientRect.height) / element.offsetHeight || 1 : 1;
  }

  var _ref = isElement(element) ? getWindow(element) : window,
      visualViewport = _ref.visualViewport;

  var addVisualOffsets = !isLayoutViewport() && isFixedStrategy;
  var x = (clientRect.left + (addVisualOffsets && visualViewport ? visualViewport.offsetLeft : 0)) / scaleX;
  var y = (clientRect.top + (addVisualOffsets && visualViewport ? visualViewport.offsetTop : 0)) / scaleY;
  var width = clientRect.width / scaleX;
  var height = clientRect.height / scaleY;
  return {
    width: width,
    height: height,
    top: y,
    right: x + width,
    bottom: y + height,
    left: x,
    x: x,
    y: y
  };
}

// means it doesn't take into account transforms.

function getLayoutRect(element) {
  var clientRect = getBoundingClientRect(element); // Use the clientRect sizes if it's not been transformed.
  // Fixes https://github.com/popperjs/popper-core/issues/1223

  var width = element.offsetWidth;
  var height = element.offsetHeight;

  if (Math.abs(clientRect.width - width) <= 1) {
    width = clientRect.width;
  }

  if (Math.abs(clientRect.height - height) <= 1) {
    height = clientRect.height;
  }

  return {
    x: element.offsetLeft,
    y: element.offsetTop,
    width: width,
    height: height
  };
}

function contains$1(parent, child) {
  var rootNode = child.getRootNode && child.getRootNode(); // First, attempt with faster native method

  if (parent.contains(child)) {
    return true;
  } // then fallback to custom implementation with Shadow DOM support
  else if (rootNode && isShadowRoot(rootNode)) {
      var next = child;

      do {
        if (next && parent.isSameNode(next)) {
          return true;
        } // $FlowFixMe[prop-missing]: need a better way to handle this...


        next = next.parentNode || next.host;
      } while (next);
    } // Give up, the result is false


  return false;
}

function getNodeName(element) {
  return element ? (element.nodeName || '').toLowerCase() : null;
}

function getComputedStyle(element) {
  return getWindow(element).getComputedStyle(element);
}

function isTableElement(element) {
  return ['table', 'td', 'th'].indexOf(getNodeName(element)) >= 0;
}

function getDocumentElement(element) {
  // $FlowFixMe[incompatible-return]: assume body is always available
  return ((isElement(element) ? element.ownerDocument : // $FlowFixMe[prop-missing]
  element.document) || window.document).documentElement;
}

function getParentNode(element) {
  if (getNodeName(element) === 'html') {
    return element;
  }

  return (// this is a quicker (but less type safe) way to save quite some bytes from the bundle
    // $FlowFixMe[incompatible-return]
    // $FlowFixMe[prop-missing]
    element.assignedSlot || // step into the shadow DOM of the parent of a slotted node
    element.parentNode || ( // DOM Element detected
    isShadowRoot(element) ? element.host : null) || // ShadowRoot detected
    // $FlowFixMe[incompatible-call]: HTMLElement is a Node
    getDocumentElement(element) // fallback

  );
}

function getTrueOffsetParent(element) {
  if (!isHTMLElement(element) || // https://github.com/popperjs/popper-core/issues/837
  getComputedStyle(element).position === 'fixed') {
    return null;
  }

  return element.offsetParent;
} // `.offsetParent` reports `null` for fixed elements, while absolute elements
// return the containing block


function getContainingBlock(element) {
  var isFirefox = /firefox/i.test(getUAString());
  var isIE = /Trident/i.test(getUAString());

  if (isIE && isHTMLElement(element)) {
    // In IE 9, 10 and 11 fixed elements containing block is always established by the viewport
    var elementCss = getComputedStyle(element);

    if (elementCss.position === 'fixed') {
      return null;
    }
  }

  var currentNode = getParentNode(element);

  if (isShadowRoot(currentNode)) {
    currentNode = currentNode.host;
  }

  while (isHTMLElement(currentNode) && ['html', 'body'].indexOf(getNodeName(currentNode)) < 0) {
    var css = getComputedStyle(currentNode); // This is non-exhaustive but covers the most common CSS properties that
    // create a containing block.
    // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block

    if (css.transform !== 'none' || css.perspective !== 'none' || css.contain === 'paint' || ['transform', 'perspective'].indexOf(css.willChange) !== -1 || isFirefox && css.willChange === 'filter' || isFirefox && css.filter && css.filter !== 'none') {
      return currentNode;
    } else {
      currentNode = currentNode.parentNode;
    }
  }

  return null;
} // Gets the closest ancestor positioned element. Handles some edge cases,
// such as table ancestors and cross browser bugs.


function getOffsetParent(element) {
  var window = getWindow(element);
  var offsetParent = getTrueOffsetParent(element);

  while (offsetParent && isTableElement(offsetParent) && getComputedStyle(offsetParent).position === 'static') {
    offsetParent = getTrueOffsetParent(offsetParent);
  }

  if (offsetParent && (getNodeName(offsetParent) === 'html' || getNodeName(offsetParent) === 'body' && getComputedStyle(offsetParent).position === 'static')) {
    return window;
  }

  return offsetParent || getContainingBlock(element) || window;
}

function getMainAxisFromPlacement(placement) {
  return ['top', 'bottom'].indexOf(placement) >= 0 ? 'x' : 'y';
}

function within(min$1, value, max$1) {
  return max(min$1, min(value, max$1));
}
function withinMaxClamp(min, value, max) {
  var v = within(min, value, max);
  return v > max ? max : v;
}

function getFreshSideObject() {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };
}

function mergePaddingObject(paddingObject) {
  return Object.assign({}, getFreshSideObject(), paddingObject);
}

function expandToHashMap(value, keys) {
  return keys.reduce(function (hashMap, key) {
    hashMap[key] = value;
    return hashMap;
  }, {});
}

var toPaddingObject = function toPaddingObject(padding, state) {
  padding = typeof padding === 'function' ? padding(Object.assign({}, state.rects, {
    placement: state.placement
  })) : padding;
  return mergePaddingObject(typeof padding !== 'number' ? padding : expandToHashMap(padding, basePlacements));
};

function arrow(_ref) {
  var _state$modifiersData$;

  var state = _ref.state,
      name = _ref.name,
      options = _ref.options;
  var arrowElement = state.elements.arrow;
  var popperOffsets = state.modifiersData.popperOffsets;
  var basePlacement = getBasePlacement(state.placement);
  var axis = getMainAxisFromPlacement(basePlacement);
  var isVertical = [left, right].indexOf(basePlacement) >= 0;
  var len = isVertical ? 'height' : 'width';

  if (!arrowElement || !popperOffsets) {
    return;
  }

  var paddingObject = toPaddingObject(options.padding, state);
  var arrowRect = getLayoutRect(arrowElement);
  var minProp = axis === 'y' ? top : left;
  var maxProp = axis === 'y' ? bottom : right;
  var endDiff = state.rects.reference[len] + state.rects.reference[axis] - popperOffsets[axis] - state.rects.popper[len];
  var startDiff = popperOffsets[axis] - state.rects.reference[axis];
  var arrowOffsetParent = getOffsetParent(arrowElement);
  var clientSize = arrowOffsetParent ? axis === 'y' ? arrowOffsetParent.clientHeight || 0 : arrowOffsetParent.clientWidth || 0 : 0;
  var centerToReference = endDiff / 2 - startDiff / 2; // Make sure the arrow doesn't overflow the popper if the center point is
  // outside of the popper bounds

  var min = paddingObject[minProp];
  var max = clientSize - arrowRect[len] - paddingObject[maxProp];
  var center = clientSize / 2 - arrowRect[len] / 2 + centerToReference;
  var offset = within(min, center, max); // Prevents breaking syntax highlighting...

  var axisProp = axis;
  state.modifiersData[name] = (_state$modifiersData$ = {}, _state$modifiersData$[axisProp] = offset, _state$modifiersData$.centerOffset = offset - center, _state$modifiersData$);
}

function effect$1(_ref2) {
  var state = _ref2.state,
      options = _ref2.options;
  var _options$element = options.element,
      arrowElement = _options$element === undefined ? '[data-popper-arrow]' : _options$element;

  if (arrowElement == null) {
    return;
  } // CSS selector


  if (typeof arrowElement === 'string') {
    arrowElement = state.elements.popper.querySelector(arrowElement);

    if (!arrowElement) {
      return;
    }
  }

  if (!contains$1(state.elements.popper, arrowElement)) {
    return;
  }

  state.elements.arrow = arrowElement;
} // eslint-disable-next-line import/no-unused-modules


const arrow$1 = {
  name: 'arrow',
  enabled: true,
  phase: 'main',
  fn: arrow,
  effect: effect$1,
  requires: ['popperOffsets'],
  requiresIfExists: ['preventOverflow']
};

function getVariation(placement) {
  return placement.split('-')[1];
}

var unsetSides = {
  top: 'auto',
  right: 'auto',
  bottom: 'auto',
  left: 'auto'
}; // Round the offsets to the nearest suitable subpixel based on the DPR.
// Zooming can change the DPR, but it seems to report a value that will
// cleanly divide the values into the appropriate subpixels.

function roundOffsetsByDPR(_ref, win) {
  var x = _ref.x,
      y = _ref.y;
  var dpr = win.devicePixelRatio || 1;
  return {
    x: round(x * dpr) / dpr || 0,
    y: round(y * dpr) / dpr || 0
  };
}

function mapToStyles(_ref2) {
  var _Object$assign2;

  var popper = _ref2.popper,
      popperRect = _ref2.popperRect,
      placement = _ref2.placement,
      variation = _ref2.variation,
      offsets = _ref2.offsets,
      position = _ref2.position,
      gpuAcceleration = _ref2.gpuAcceleration,
      adaptive = _ref2.adaptive,
      roundOffsets = _ref2.roundOffsets,
      isFixed = _ref2.isFixed;
  var _offsets$x = offsets.x,
      x = _offsets$x === undefined ? 0 : _offsets$x,
      _offsets$y = offsets.y,
      y = _offsets$y === undefined ? 0 : _offsets$y;

  var _ref3 = typeof roundOffsets === 'function' ? roundOffsets({
    x: x,
    y: y
  }) : {
    x: x,
    y: y
  };

  x = _ref3.x;
  y = _ref3.y;
  var hasX = offsets.hasOwnProperty('x');
  var hasY = offsets.hasOwnProperty('y');
  var sideX = left;
  var sideY = top;
  var win = window;

  if (adaptive) {
    var offsetParent = getOffsetParent(popper);
    var heightProp = 'clientHeight';
    var widthProp = 'clientWidth';

    if (offsetParent === getWindow(popper)) {
      offsetParent = getDocumentElement(popper);

      if (getComputedStyle(offsetParent).position !== 'static' && position === 'absolute') {
        heightProp = 'scrollHeight';
        widthProp = 'scrollWidth';
      }
    } // $FlowFixMe[incompatible-cast]: force type refinement, we compare offsetParent with window above, but Flow doesn't detect it


    offsetParent = offsetParent;

    if (placement === top || (placement === left || placement === right) && variation === end) {
      sideY = bottom;
      var offsetY = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.height : // $FlowFixMe[prop-missing]
      offsetParent[heightProp];
      y -= offsetY - popperRect.height;
      y *= gpuAcceleration ? 1 : -1;
    }

    if (placement === left || (placement === top || placement === bottom) && variation === end) {
      sideX = right;
      var offsetX = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.width : // $FlowFixMe[prop-missing]
      offsetParent[widthProp];
      x -= offsetX - popperRect.width;
      x *= gpuAcceleration ? 1 : -1;
    }
  }

  var commonStyles = Object.assign({
    position: position
  }, adaptive && unsetSides);

  var _ref4 = roundOffsets === true ? roundOffsetsByDPR({
    x: x,
    y: y
  }, getWindow(popper)) : {
    x: x,
    y: y
  };

  x = _ref4.x;
  y = _ref4.y;

  if (gpuAcceleration) {
    var _Object$assign;

    return Object.assign({}, commonStyles, (_Object$assign = {}, _Object$assign[sideY] = hasY ? '0' : '', _Object$assign[sideX] = hasX ? '0' : '', _Object$assign.transform = (win.devicePixelRatio || 1) <= 1 ? "translate(" + x + "px, " + y + "px)" : "translate3d(" + x + "px, " + y + "px, 0)", _Object$assign));
  }

  return Object.assign({}, commonStyles, (_Object$assign2 = {}, _Object$assign2[sideY] = hasY ? y + "px" : '', _Object$assign2[sideX] = hasX ? x + "px" : '', _Object$assign2.transform = '', _Object$assign2));
}

function computeStyles(_ref5) {
  var state = _ref5.state,
      options = _ref5.options;
  var _options$gpuAccelerat = options.gpuAcceleration,
      gpuAcceleration = _options$gpuAccelerat === undefined ? true : _options$gpuAccelerat,
      _options$adaptive = options.adaptive,
      adaptive = _options$adaptive === undefined ? true : _options$adaptive,
      _options$roundOffsets = options.roundOffsets,
      roundOffsets = _options$roundOffsets === undefined ? true : _options$roundOffsets;
  var commonStyles = {
    placement: getBasePlacement(state.placement),
    variation: getVariation(state.placement),
    popper: state.elements.popper,
    popperRect: state.rects.popper,
    gpuAcceleration: gpuAcceleration,
    isFixed: state.options.strategy === 'fixed'
  };

  if (state.modifiersData.popperOffsets != null) {
    state.styles.popper = Object.assign({}, state.styles.popper, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state.modifiersData.popperOffsets,
      position: state.options.strategy,
      adaptive: adaptive,
      roundOffsets: roundOffsets
    })));
  }

  if (state.modifiersData.arrow != null) {
    state.styles.arrow = Object.assign({}, state.styles.arrow, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state.modifiersData.arrow,
      position: 'absolute',
      adaptive: false,
      roundOffsets: roundOffsets
    })));
  }

  state.attributes.popper = Object.assign({}, state.attributes.popper, {
    'data-popper-placement': state.placement
  });
} // eslint-disable-next-line import/no-unused-modules


const computeStyles$1 = {
  name: 'computeStyles',
  enabled: true,
  phase: 'beforeWrite',
  fn: computeStyles,
  data: {}
};

var passive = {
  passive: true
};

function effect(_ref) {
  var state = _ref.state,
      instance = _ref.instance,
      options = _ref.options;
  var _options$scroll = options.scroll,
      scroll = _options$scroll === undefined ? true : _options$scroll,
      _options$resize = options.resize,
      resize = _options$resize === undefined ? true : _options$resize;
  var window = getWindow(state.elements.popper);
  var scrollParents = [].concat(state.scrollParents.reference, state.scrollParents.popper);

  if (scroll) {
    scrollParents.forEach(function (scrollParent) {
      scrollParent.addEventListener('scroll', instance.update, passive);
    });
  }

  if (resize) {
    window.addEventListener('resize', instance.update, passive);
  }

  return function () {
    if (scroll) {
      scrollParents.forEach(function (scrollParent) {
        scrollParent.removeEventListener('scroll', instance.update, passive);
      });
    }

    if (resize) {
      window.removeEventListener('resize', instance.update, passive);
    }
  };
} // eslint-disable-next-line import/no-unused-modules


const eventListeners = {
  name: 'eventListeners',
  enabled: true,
  phase: 'write',
  fn: function fn() {},
  effect: effect,
  data: {}
};

var hash$1 = {
  left: 'right',
  right: 'left',
  bottom: 'top',
  top: 'bottom'
};
function getOppositePlacement(placement) {
  return placement.replace(/left|right|bottom|top/g, function (matched) {
    return hash$1[matched];
  });
}

var hash = {
  start: 'end',
  end: 'start'
};
function getOppositeVariationPlacement(placement) {
  return placement.replace(/start|end/g, function (matched) {
    return hash[matched];
  });
}

function getWindowScroll(node) {
  var win = getWindow(node);
  var scrollLeft = win.pageXOffset;
  var scrollTop = win.pageYOffset;
  return {
    scrollLeft: scrollLeft,
    scrollTop: scrollTop
  };
}

function getWindowScrollBarX(element) {
  // If <html> has a CSS width greater than the viewport, then this will be
  // incorrect for RTL.
  // Popper 1 is broken in this case and never had a bug report so let's assume
  // it's not an issue. I don't think anyone ever specifies width on <html>
  // anyway.
  // Browsers where the left scrollbar doesn't cause an issue report `0` for
  // this (e.g. Edge 2019, IE11, Safari)
  return getBoundingClientRect(getDocumentElement(element)).left + getWindowScroll(element).scrollLeft;
}

function getViewportRect(element, strategy) {
  var win = getWindow(element);
  var html = getDocumentElement(element);
  var visualViewport = win.visualViewport;
  var width = html.clientWidth;
  var height = html.clientHeight;
  var x = 0;
  var y = 0;

  if (visualViewport) {
    width = visualViewport.width;
    height = visualViewport.height;
    var layoutViewport = isLayoutViewport();

    if (layoutViewport || !layoutViewport && strategy === 'fixed') {
      x = visualViewport.offsetLeft;
      y = visualViewport.offsetTop;
    }
  }

  return {
    width: width,
    height: height,
    x: x + getWindowScrollBarX(element),
    y: y
  };
}

// of the `<html>` and `<body>` rect bounds if horizontally scrollable

function getDocumentRect(element) {
  var _element$ownerDocumen;

  var html = getDocumentElement(element);
  var winScroll = getWindowScroll(element);
  var body = (_element$ownerDocumen = element.ownerDocument) == null ? undefined : _element$ownerDocumen.body;
  var width = max(html.scrollWidth, html.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0);
  var height = max(html.scrollHeight, html.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0);
  var x = -winScroll.scrollLeft + getWindowScrollBarX(element);
  var y = -winScroll.scrollTop;

  if (getComputedStyle(body || html).direction === 'rtl') {
    x += max(html.clientWidth, body ? body.clientWidth : 0) - width;
  }

  return {
    width: width,
    height: height,
    x: x,
    y: y
  };
}

function isScrollParent(element) {
  // Firefox wants us to check `-x` and `-y` variations as well
  var _getComputedStyle = getComputedStyle(element),
      overflow = _getComputedStyle.overflow,
      overflowX = _getComputedStyle.overflowX,
      overflowY = _getComputedStyle.overflowY;

  return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
}

function getScrollParent(node) {
  if (['html', 'body', '#document'].indexOf(getNodeName(node)) >= 0) {
    // $FlowFixMe[incompatible-return]: assume body is always available
    return node.ownerDocument.body;
  }

  if (isHTMLElement(node) && isScrollParent(node)) {
    return node;
  }

  return getScrollParent(getParentNode(node));
}

/*
given a DOM element, return the list of all scroll parents, up the list of ancesors
until we get to the top window object. This list is what we attach scroll listeners
to, because if any of these parent elements scroll, we'll need to re-calculate the
reference element's position.
*/

function listScrollParents(element, list) {
  var _element$ownerDocumen;

  if (list === undefined) {
    list = [];
  }

  var scrollParent = getScrollParent(element);
  var isBody = scrollParent === ((_element$ownerDocumen = element.ownerDocument) == null ? undefined : _element$ownerDocumen.body);
  var win = getWindow(scrollParent);
  var target = isBody ? [win].concat(win.visualViewport || [], isScrollParent(scrollParent) ? scrollParent : []) : scrollParent;
  var updatedList = list.concat(target);
  return isBody ? updatedList : // $FlowFixMe[incompatible-call]: isBody tells us target will be an HTMLElement here
  updatedList.concat(listScrollParents(getParentNode(target)));
}

function rectToClientRect(rect) {
  return Object.assign({}, rect, {
    left: rect.x,
    top: rect.y,
    right: rect.x + rect.width,
    bottom: rect.y + rect.height
  });
}

function getInnerBoundingClientRect(element, strategy) {
  var rect = getBoundingClientRect(element, false, strategy === 'fixed');
  rect.top = rect.top + element.clientTop;
  rect.left = rect.left + element.clientLeft;
  rect.bottom = rect.top + element.clientHeight;
  rect.right = rect.left + element.clientWidth;
  rect.width = element.clientWidth;
  rect.height = element.clientHeight;
  rect.x = rect.left;
  rect.y = rect.top;
  return rect;
}

function getClientRectFromMixedType(element, clippingParent, strategy) {
  return clippingParent === viewport ? rectToClientRect(getViewportRect(element, strategy)) : isElement(clippingParent) ? getInnerBoundingClientRect(clippingParent, strategy) : rectToClientRect(getDocumentRect(getDocumentElement(element)));
} // A "clipping parent" is an overflowable container with the characteristic of
// clipping (or hiding) overflowing elements with a position different from
// `initial`


function getClippingParents(element) {
  var clippingParents = listScrollParents(getParentNode(element));
  var canEscapeClipping = ['absolute', 'fixed'].indexOf(getComputedStyle(element).position) >= 0;
  var clipperElement = canEscapeClipping && isHTMLElement(element) ? getOffsetParent(element) : element;

  if (!isElement(clipperElement)) {
    return [];
  } // $FlowFixMe[incompatible-return]: https://github.com/facebook/flow/issues/1414


  return clippingParents.filter(function (clippingParent) {
    return isElement(clippingParent) && contains$1(clippingParent, clipperElement) && getNodeName(clippingParent) !== 'body';
  });
} // Gets the maximum area that the element is visible in due to any number of
// clipping parents


function getClippingRect(element, boundary, rootBoundary, strategy) {
  var mainClippingParents = boundary === 'clippingParents' ? getClippingParents(element) : [].concat(boundary);
  var clippingParents = [].concat(mainClippingParents, [rootBoundary]);
  var firstClippingParent = clippingParents[0];
  var clippingRect = clippingParents.reduce(function (accRect, clippingParent) {
    var rect = getClientRectFromMixedType(element, clippingParent, strategy);
    accRect.top = max(rect.top, accRect.top);
    accRect.right = min(rect.right, accRect.right);
    accRect.bottom = min(rect.bottom, accRect.bottom);
    accRect.left = max(rect.left, accRect.left);
    return accRect;
  }, getClientRectFromMixedType(element, firstClippingParent, strategy));
  clippingRect.width = clippingRect.right - clippingRect.left;
  clippingRect.height = clippingRect.bottom - clippingRect.top;
  clippingRect.x = clippingRect.left;
  clippingRect.y = clippingRect.top;
  return clippingRect;
}

function computeOffsets(_ref) {
  var reference = _ref.reference,
      element = _ref.element,
      placement = _ref.placement;
  var basePlacement = placement ? getBasePlacement(placement) : null;
  var variation = placement ? getVariation(placement) : null;
  var commonX = reference.x + reference.width / 2 - element.width / 2;
  var commonY = reference.y + reference.height / 2 - element.height / 2;
  var offsets;

  switch (basePlacement) {
    case top:
      offsets = {
        x: commonX,
        y: reference.y - element.height
      };
      break;

    case bottom:
      offsets = {
        x: commonX,
        y: reference.y + reference.height
      };
      break;

    case right:
      offsets = {
        x: reference.x + reference.width,
        y: commonY
      };
      break;

    case left:
      offsets = {
        x: reference.x - element.width,
        y: commonY
      };
      break;

    default:
      offsets = {
        x: reference.x,
        y: reference.y
      };
  }

  var mainAxis = basePlacement ? getMainAxisFromPlacement(basePlacement) : null;

  if (mainAxis != null) {
    var len = mainAxis === 'y' ? 'height' : 'width';

    switch (variation) {
      case start:
        offsets[mainAxis] = offsets[mainAxis] - (reference[len] / 2 - element[len] / 2);
        break;

      case end:
        offsets[mainAxis] = offsets[mainAxis] + (reference[len] / 2 - element[len] / 2);
        break;
    }
  }

  return offsets;
}

function detectOverflow(state, options) {
  if (options === undefined) {
    options = {};
  }

  var _options = options,
      _options$placement = _options.placement,
      placement = _options$placement === undefined ? state.placement : _options$placement,
      _options$strategy = _options.strategy,
      strategy = _options$strategy === undefined ? state.strategy : _options$strategy,
      _options$boundary = _options.boundary,
      boundary = _options$boundary === undefined ? clippingParents : _options$boundary,
      _options$rootBoundary = _options.rootBoundary,
      rootBoundary = _options$rootBoundary === undefined ? viewport : _options$rootBoundary,
      _options$elementConte = _options.elementContext,
      elementContext = _options$elementConte === undefined ? popper : _options$elementConte,
      _options$altBoundary = _options.altBoundary,
      altBoundary = _options$altBoundary === undefined ? false : _options$altBoundary,
      _options$padding = _options.padding,
      padding = _options$padding === undefined ? 0 : _options$padding;
  var paddingObject = mergePaddingObject(typeof padding !== 'number' ? padding : expandToHashMap(padding, basePlacements));
  var altContext = elementContext === popper ? reference : popper;
  var popperRect = state.rects.popper;
  var element = state.elements[altBoundary ? altContext : elementContext];
  var clippingClientRect = getClippingRect(isElement(element) ? element : element.contextElement || getDocumentElement(state.elements.popper), boundary, rootBoundary, strategy);
  var referenceClientRect = getBoundingClientRect(state.elements.reference);
  var popperOffsets = computeOffsets({
    reference: referenceClientRect,
    element: popperRect,
    strategy: 'absolute',
    placement: placement
  });
  var popperClientRect = rectToClientRect(Object.assign({}, popperRect, popperOffsets));
  var elementClientRect = elementContext === popper ? popperClientRect : referenceClientRect; // positive = overflowing the clipping rect
  // 0 or negative = within the clipping rect

  var overflowOffsets = {
    top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
    bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
    left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
    right: elementClientRect.right - clippingClientRect.right + paddingObject.right
  };
  var offsetData = state.modifiersData.offset; // Offsets can be applied only to the popper element

  if (elementContext === popper && offsetData) {
    var offset = offsetData[placement];
    Object.keys(overflowOffsets).forEach(function (key) {
      var multiply = [right, bottom].indexOf(key) >= 0 ? 1 : -1;
      var axis = [top, bottom].indexOf(key) >= 0 ? 'y' : 'x';
      overflowOffsets[key] += offset[axis] * multiply;
    });
  }

  return overflowOffsets;
}

function computeAutoPlacement(state, options) {
  if (options === undefined) {
    options = {};
  }

  var _options = options,
      placement = _options.placement,
      boundary = _options.boundary,
      rootBoundary = _options.rootBoundary,
      padding = _options.padding,
      flipVariations = _options.flipVariations,
      _options$allowedAutoP = _options.allowedAutoPlacements,
      allowedAutoPlacements = _options$allowedAutoP === undefined ? placements : _options$allowedAutoP;
  var variation = getVariation(placement);
  var placements$1 = variation ? flipVariations ? variationPlacements : variationPlacements.filter(function (placement) {
    return getVariation(placement) === variation;
  }) : basePlacements;
  var allowedPlacements = placements$1.filter(function (placement) {
    return allowedAutoPlacements.indexOf(placement) >= 0;
  });

  if (allowedPlacements.length === 0) {
    allowedPlacements = placements$1;
  } // $FlowFixMe[incompatible-type]: Flow seems to have problems with two array unions...


  var overflows = allowedPlacements.reduce(function (acc, placement) {
    acc[placement] = detectOverflow(state, {
      placement: placement,
      boundary: boundary,
      rootBoundary: rootBoundary,
      padding: padding
    })[getBasePlacement(placement)];
    return acc;
  }, {});
  return Object.keys(overflows).sort(function (a, b) {
    return overflows[a] - overflows[b];
  });
}

function getExpandedFallbackPlacements(placement) {
  if (getBasePlacement(placement) === auto) {
    return [];
  }

  var oppositePlacement = getOppositePlacement(placement);
  return [getOppositeVariationPlacement(placement), oppositePlacement, getOppositeVariationPlacement(oppositePlacement)];
}

function flip(_ref) {
  var state = _ref.state,
      options = _ref.options,
      name = _ref.name;

  if (state.modifiersData[name]._skip) {
    return;
  }

  var _options$mainAxis = options.mainAxis,
      checkMainAxis = _options$mainAxis === undefined ? true : _options$mainAxis,
      _options$altAxis = options.altAxis,
      checkAltAxis = _options$altAxis === undefined ? true : _options$altAxis,
      specifiedFallbackPlacements = options.fallbackPlacements,
      padding = options.padding,
      boundary = options.boundary,
      rootBoundary = options.rootBoundary,
      altBoundary = options.altBoundary,
      _options$flipVariatio = options.flipVariations,
      flipVariations = _options$flipVariatio === undefined ? true : _options$flipVariatio,
      allowedAutoPlacements = options.allowedAutoPlacements;
  var preferredPlacement = state.options.placement;
  var basePlacement = getBasePlacement(preferredPlacement);
  var isBasePlacement = basePlacement === preferredPlacement;
  var fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipVariations ? [getOppositePlacement(preferredPlacement)] : getExpandedFallbackPlacements(preferredPlacement));
  var placements = [preferredPlacement].concat(fallbackPlacements).reduce(function (acc, placement) {
    return acc.concat(getBasePlacement(placement) === auto ? computeAutoPlacement(state, {
      placement: placement,
      boundary: boundary,
      rootBoundary: rootBoundary,
      padding: padding,
      flipVariations: flipVariations,
      allowedAutoPlacements: allowedAutoPlacements
    }) : placement);
  }, []);
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var checksMap = new Map();
  var makeFallbackChecks = true;
  var firstFittingPlacement = placements[0];

  for (var i = 0; i < placements.length; i++) {
    var placement = placements[i];

    var _basePlacement = getBasePlacement(placement);

    var isStartVariation = getVariation(placement) === start;
    var isVertical = [top, bottom].indexOf(_basePlacement) >= 0;
    var len = isVertical ? 'width' : 'height';
    var overflow = detectOverflow(state, {
      placement: placement,
      boundary: boundary,
      rootBoundary: rootBoundary,
      altBoundary: altBoundary,
      padding: padding
    });
    var mainVariationSide = isVertical ? isStartVariation ? right : left : isStartVariation ? bottom : top;

    if (referenceRect[len] > popperRect[len]) {
      mainVariationSide = getOppositePlacement(mainVariationSide);
    }

    var altVariationSide = getOppositePlacement(mainVariationSide);
    var checks = [];

    if (checkMainAxis) {
      checks.push(overflow[_basePlacement] <= 0);
    }

    if (checkAltAxis) {
      checks.push(overflow[mainVariationSide] <= 0, overflow[altVariationSide] <= 0);
    }

    if (checks.every(function (check) {
      return check;
    })) {
      firstFittingPlacement = placement;
      makeFallbackChecks = false;
      break;
    }

    checksMap.set(placement, checks);
  }

  if (makeFallbackChecks) {
    // `2` may be desired in some cases – research later
    var numberOfChecks = flipVariations ? 3 : 1;

    var _loop = function _loop(_i) {
      var fittingPlacement = placements.find(function (placement) {
        var checks = checksMap.get(placement);

        if (checks) {
          return checks.slice(0, _i).every(function (check) {
            return check;
          });
        }
      });

      if (fittingPlacement) {
        firstFittingPlacement = fittingPlacement;
        return "break";
      }
    };

    for (var _i = numberOfChecks; _i > 0; _i--) {
      var _ret = _loop(_i);

      if (_ret === "break") break;
    }
  }

  if (state.placement !== firstFittingPlacement) {
    state.modifiersData[name]._skip = true;
    state.placement = firstFittingPlacement;
    state.reset = true;
  }
} // eslint-disable-next-line import/no-unused-modules


const flip$1 = {
  name: 'flip',
  enabled: true,
  phase: 'main',
  fn: flip,
  requiresIfExists: ['offset'],
  data: {
    _skip: false
  }
};

function getSideOffsets(overflow, rect, preventedOffsets) {
  if (preventedOffsets === undefined) {
    preventedOffsets = {
      x: 0,
      y: 0
    };
  }

  return {
    top: overflow.top - rect.height - preventedOffsets.y,
    right: overflow.right - rect.width + preventedOffsets.x,
    bottom: overflow.bottom - rect.height + preventedOffsets.y,
    left: overflow.left - rect.width - preventedOffsets.x
  };
}

function isAnySideFullyClipped(overflow) {
  return [top, right, bottom, left].some(function (side) {
    return overflow[side] >= 0;
  });
}

function hide(_ref) {
  var state = _ref.state,
      name = _ref.name;
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var preventedOffsets = state.modifiersData.preventOverflow;
  var referenceOverflow = detectOverflow(state, {
    elementContext: 'reference'
  });
  var popperAltOverflow = detectOverflow(state, {
    altBoundary: true
  });
  var referenceClippingOffsets = getSideOffsets(referenceOverflow, referenceRect);
  var popperEscapeOffsets = getSideOffsets(popperAltOverflow, popperRect, preventedOffsets);
  var isReferenceHidden = isAnySideFullyClipped(referenceClippingOffsets);
  var hasPopperEscaped = isAnySideFullyClipped(popperEscapeOffsets);
  state.modifiersData[name] = {
    referenceClippingOffsets: referenceClippingOffsets,
    popperEscapeOffsets: popperEscapeOffsets,
    isReferenceHidden: isReferenceHidden,
    hasPopperEscaped: hasPopperEscaped
  };
  state.attributes.popper = Object.assign({}, state.attributes.popper, {
    'data-popper-reference-hidden': isReferenceHidden,
    'data-popper-escaped': hasPopperEscaped
  });
} // eslint-disable-next-line import/no-unused-modules


const hide$1 = {
  name: 'hide',
  enabled: true,
  phase: 'main',
  requiresIfExists: ['preventOverflow'],
  fn: hide
};

function distanceAndSkiddingToXY(placement, rects, offset) {
  var basePlacement = getBasePlacement(placement);
  var invertDistance = [left, top].indexOf(basePlacement) >= 0 ? -1 : 1;

  var _ref = typeof offset === 'function' ? offset(Object.assign({}, rects, {
    placement: placement
  })) : offset,
      skidding = _ref[0],
      distance = _ref[1];

  skidding = skidding || 0;
  distance = (distance || 0) * invertDistance;
  return [left, right].indexOf(basePlacement) >= 0 ? {
    x: distance,
    y: skidding
  } : {
    x: skidding,
    y: distance
  };
}

function offset(_ref2) {
  var state = _ref2.state,
      options = _ref2.options,
      name = _ref2.name;
  var _options$offset = options.offset,
      offset = _options$offset === undefined ? [0, 0] : _options$offset;
  var data = placements.reduce(function (acc, placement) {
    acc[placement] = distanceAndSkiddingToXY(placement, state.rects, offset);
    return acc;
  }, {});
  var _data$state$placement = data[state.placement],
      x = _data$state$placement.x,
      y = _data$state$placement.y;

  if (state.modifiersData.popperOffsets != null) {
    state.modifiersData.popperOffsets.x += x;
    state.modifiersData.popperOffsets.y += y;
  }

  state.modifiersData[name] = data;
} // eslint-disable-next-line import/no-unused-modules


const offset$1 = {
  name: 'offset',
  enabled: true,
  phase: 'main',
  requires: ['popperOffsets'],
  fn: offset
};

function popperOffsets(_ref) {
  var state = _ref.state,
      name = _ref.name;
  // Offsets are the actual position the popper needs to have to be
  // properly positioned near its reference element
  // This is the most basic placement, and will be adjusted by
  // the modifiers in the next step
  state.modifiersData[name] = computeOffsets({
    reference: state.rects.reference,
    element: state.rects.popper,
    strategy: 'absolute',
    placement: state.placement
  });
} // eslint-disable-next-line import/no-unused-modules


const popperOffsets$1 = {
  name: 'popperOffsets',
  enabled: true,
  phase: 'read',
  fn: popperOffsets,
  data: {}
};

function getAltAxis(axis) {
  return axis === 'x' ? 'y' : 'x';
}

function preventOverflow(_ref) {
  var state = _ref.state,
      options = _ref.options,
      name = _ref.name;
  var _options$mainAxis = options.mainAxis,
      checkMainAxis = _options$mainAxis === undefined ? true : _options$mainAxis,
      _options$altAxis = options.altAxis,
      checkAltAxis = _options$altAxis === undefined ? false : _options$altAxis,
      boundary = options.boundary,
      rootBoundary = options.rootBoundary,
      altBoundary = options.altBoundary,
      padding = options.padding,
      _options$tether = options.tether,
      tether = _options$tether === undefined ? true : _options$tether,
      _options$tetherOffset = options.tetherOffset,
      tetherOffset = _options$tetherOffset === undefined ? 0 : _options$tetherOffset;
  var overflow = detectOverflow(state, {
    boundary: boundary,
    rootBoundary: rootBoundary,
    padding: padding,
    altBoundary: altBoundary
  });
  var basePlacement = getBasePlacement(state.placement);
  var variation = getVariation(state.placement);
  var isBasePlacement = !variation;
  var mainAxis = getMainAxisFromPlacement(basePlacement);
  var altAxis = getAltAxis(mainAxis);
  var popperOffsets = state.modifiersData.popperOffsets;
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var tetherOffsetValue = typeof tetherOffset === 'function' ? tetherOffset(Object.assign({}, state.rects, {
    placement: state.placement
  })) : tetherOffset;
  var normalizedTetherOffsetValue = typeof tetherOffsetValue === 'number' ? {
    mainAxis: tetherOffsetValue,
    altAxis: tetherOffsetValue
  } : Object.assign({
    mainAxis: 0,
    altAxis: 0
  }, tetherOffsetValue);
  var offsetModifierState = state.modifiersData.offset ? state.modifiersData.offset[state.placement] : null;
  var data = {
    x: 0,
    y: 0
  };

  if (!popperOffsets) {
    return;
  }

  if (checkMainAxis) {
    var _offsetModifierState$;

    var mainSide = mainAxis === 'y' ? top : left;
    var altSide = mainAxis === 'y' ? bottom : right;
    var len = mainAxis === 'y' ? 'height' : 'width';
    var offset = popperOffsets[mainAxis];
    var min$1 = offset + overflow[mainSide];
    var max$1 = offset - overflow[altSide];
    var additive = tether ? -popperRect[len] / 2 : 0;
    var minLen = variation === start ? referenceRect[len] : popperRect[len];
    var maxLen = variation === start ? -popperRect[len] : -referenceRect[len]; // We need to include the arrow in the calculation so the arrow doesn't go
    // outside the reference bounds

    var arrowElement = state.elements.arrow;
    var arrowRect = tether && arrowElement ? getLayoutRect(arrowElement) : {
      width: 0,
      height: 0
    };
    var arrowPaddingObject = state.modifiersData['arrow#persistent'] ? state.modifiersData['arrow#persistent'].padding : getFreshSideObject();
    var arrowPaddingMin = arrowPaddingObject[mainSide];
    var arrowPaddingMax = arrowPaddingObject[altSide]; // If the reference length is smaller than the arrow length, we don't want
    // to include its full size in the calculation. If the reference is small
    // and near the edge of a boundary, the popper can overflow even if the
    // reference is not overflowing as well (e.g. virtual elements with no
    // width or height)

    var arrowLen = within(0, referenceRect[len], arrowRect[len]);
    var minOffset = isBasePlacement ? referenceRect[len] / 2 - additive - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis : minLen - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis;
    var maxOffset = isBasePlacement ? -referenceRect[len] / 2 + additive + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis : maxLen + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis;
    var arrowOffsetParent = state.elements.arrow && getOffsetParent(state.elements.arrow);
    var clientOffset = arrowOffsetParent ? mainAxis === 'y' ? arrowOffsetParent.clientTop || 0 : arrowOffsetParent.clientLeft || 0 : 0;
    var offsetModifierValue = (_offsetModifierState$ = offsetModifierState == null ? undefined : offsetModifierState[mainAxis]) != null ? _offsetModifierState$ : 0;
    var tetherMin = offset + minOffset - offsetModifierValue - clientOffset;
    var tetherMax = offset + maxOffset - offsetModifierValue;
    var preventedOffset = within(tether ? min(min$1, tetherMin) : min$1, offset, tether ? max(max$1, tetherMax) : max$1);
    popperOffsets[mainAxis] = preventedOffset;
    data[mainAxis] = preventedOffset - offset;
  }

  if (checkAltAxis) {
    var _offsetModifierState$2;

    var _mainSide = mainAxis === 'x' ? top : left;

    var _altSide = mainAxis === 'x' ? bottom : right;

    var _offset = popperOffsets[altAxis];

    var _len = altAxis === 'y' ? 'height' : 'width';

    var _min = _offset + overflow[_mainSide];

    var _max = _offset - overflow[_altSide];

    var isOriginSide = [top, left].indexOf(basePlacement) !== -1;

    var _offsetModifierValue = (_offsetModifierState$2 = offsetModifierState == null ? undefined : offsetModifierState[altAxis]) != null ? _offsetModifierState$2 : 0;

    var _tetherMin = isOriginSide ? _min : _offset - referenceRect[_len] - popperRect[_len] - _offsetModifierValue + normalizedTetherOffsetValue.altAxis;

    var _tetherMax = isOriginSide ? _offset + referenceRect[_len] + popperRect[_len] - _offsetModifierValue - normalizedTetherOffsetValue.altAxis : _max;

    var _preventedOffset = tether && isOriginSide ? withinMaxClamp(_tetherMin, _offset, _tetherMax) : within(tether ? _tetherMin : _min, _offset, tether ? _tetherMax : _max);

    popperOffsets[altAxis] = _preventedOffset;
    data[altAxis] = _preventedOffset - _offset;
  }

  state.modifiersData[name] = data;
} // eslint-disable-next-line import/no-unused-modules


const preventOverflow$1 = {
  name: 'preventOverflow',
  enabled: true,
  phase: 'main',
  fn: preventOverflow,
  requiresIfExists: ['offset']
};

function getHTMLElementScroll(element) {
  return {
    scrollLeft: element.scrollLeft,
    scrollTop: element.scrollTop
  };
}

function getNodeScroll(node) {
  if (node === getWindow(node) || !isHTMLElement(node)) {
    return getWindowScroll(node);
  } else {
    return getHTMLElementScroll(node);
  }
}

function isElementScaled(element) {
  var rect = element.getBoundingClientRect();
  var scaleX = round(rect.width) / element.offsetWidth || 1;
  var scaleY = round(rect.height) / element.offsetHeight || 1;
  return scaleX !== 1 || scaleY !== 1;
} // Returns the composite rect of an element relative to its offsetParent.
// Composite means it takes into account transforms as well as layout.


function getCompositeRect(elementOrVirtualElement, offsetParent, isFixed) {
  if (isFixed === undefined) {
    isFixed = false;
  }

  var isOffsetParentAnElement = isHTMLElement(offsetParent);
  var offsetParentIsScaled = isHTMLElement(offsetParent) && isElementScaled(offsetParent);
  var documentElement = getDocumentElement(offsetParent);
  var rect = getBoundingClientRect(elementOrVirtualElement, offsetParentIsScaled, isFixed);
  var scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  var offsets = {
    x: 0,
    y: 0
  };

  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if (getNodeName(offsetParent) !== 'body' || // https://github.com/popperjs/popper-core/issues/1078
    isScrollParent(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }

    if (isHTMLElement(offsetParent)) {
      offsets = getBoundingClientRect(offsetParent, true);
      offsets.x += offsetParent.clientLeft;
      offsets.y += offsetParent.clientTop;
    } else if (documentElement) {
      offsets.x = getWindowScrollBarX(documentElement);
    }
  }

  return {
    x: rect.left + scroll.scrollLeft - offsets.x,
    y: rect.top + scroll.scrollTop - offsets.y,
    width: rect.width,
    height: rect.height
  };
}

function order(modifiers) {
  var map = new Map();
  var visited = new Set();
  var result = [];
  modifiers.forEach(function (modifier) {
    map.set(modifier.name, modifier);
  }); // On visiting object, check for its dependencies and visit them recursively

  function sort(modifier) {
    visited.add(modifier.name);
    var requires = [].concat(modifier.requires || [], modifier.requiresIfExists || []);
    requires.forEach(function (dep) {
      if (!visited.has(dep)) {
        var depModifier = map.get(dep);

        if (depModifier) {
          sort(depModifier);
        }
      }
    });
    result.push(modifier);
  }

  modifiers.forEach(function (modifier) {
    if (!visited.has(modifier.name)) {
      // check for visited object
      sort(modifier);
    }
  });
  return result;
}

function orderModifiers(modifiers) {
  // order based on dependencies
  var orderedModifiers = order(modifiers); // order based on phase

  return modifierPhases.reduce(function (acc, phase) {
    return acc.concat(orderedModifiers.filter(function (modifier) {
      return modifier.phase === phase;
    }));
  }, []);
}

function debounce(fn) {
  var pending;
  return function () {
    if (!pending) {
      pending = new Promise(function (resolve) {
        Promise.resolve().then(function () {
          pending = undefined;
          resolve(fn());
        });
      });
    }

    return pending;
  };
}

function mergeByName(modifiers) {
  var merged = modifiers.reduce(function (merged, current) {
    var existing = merged[current.name];
    merged[current.name] = existing ? Object.assign({}, existing, current, {
      options: Object.assign({}, existing.options, current.options),
      data: Object.assign({}, existing.data, current.data)
    }) : current;
    return merged;
  }, {}); // IE11 does not support Object.values

  return Object.keys(merged).map(function (key) {
    return merged[key];
  });
}

var DEFAULT_OPTIONS = {
  placement: 'bottom',
  modifiers: [],
  strategy: 'absolute'
};

function areValidElements() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return !args.some(function (element) {
    return !(element && typeof element.getBoundingClientRect === 'function');
  });
}

function popperGenerator(generatorOptions) {
  if (generatorOptions === undefined) {
    generatorOptions = {};
  }

  var _generatorOptions = generatorOptions,
      _generatorOptions$def = _generatorOptions.defaultModifiers,
      defaultModifiers = _generatorOptions$def === undefined ? [] : _generatorOptions$def,
      _generatorOptions$def2 = _generatorOptions.defaultOptions,
      defaultOptions = _generatorOptions$def2 === undefined ? DEFAULT_OPTIONS : _generatorOptions$def2;
  return function createPopper(reference, popper, options) {
    if (options === undefined) {
      options = defaultOptions;
    }

    var state = {
      placement: 'bottom',
      orderedModifiers: [],
      options: Object.assign({}, DEFAULT_OPTIONS, defaultOptions),
      modifiersData: {},
      elements: {
        reference: reference,
        popper: popper
      },
      attributes: {},
      styles: {}
    };
    var effectCleanupFns = [];
    var isDestroyed = false;
    var instance = {
      state: state,
      setOptions: function setOptions(setOptionsAction) {
        var options = typeof setOptionsAction === 'function' ? setOptionsAction(state.options) : setOptionsAction;
        cleanupModifierEffects();
        state.options = Object.assign({}, defaultOptions, state.options, options);
        state.scrollParents = {
          reference: isElement(reference) ? listScrollParents(reference) : reference.contextElement ? listScrollParents(reference.contextElement) : [],
          popper: listScrollParents(popper)
        }; // Orders the modifiers based on their dependencies and `phase`
        // properties

        var orderedModifiers = orderModifiers(mergeByName([].concat(defaultModifiers, state.options.modifiers))); // Strip out disabled modifiers

        state.orderedModifiers = orderedModifiers.filter(function (m) {
          return m.enabled;
        });
        runModifierEffects();
        return instance.update();
      },
      // Sync update – it will always be executed, even if not necessary. This
      // is useful for low frequency updates where sync behavior simplifies the
      // logic.
      // For high frequency updates (e.g. `resize` and `scroll` events), always
      // prefer the async Popper#update method
      forceUpdate: function forceUpdate() {
        if (isDestroyed) {
          return;
        }

        var _state$elements = state.elements,
            reference = _state$elements.reference,
            popper = _state$elements.popper; // Don't proceed if `reference` or `popper` are not valid elements
        // anymore

        if (!areValidElements(reference, popper)) {
          return;
        } // Store the reference and popper rects to be read by modifiers


        state.rects = {
          reference: getCompositeRect(reference, getOffsetParent(popper), state.options.strategy === 'fixed'),
          popper: getLayoutRect(popper)
        }; // Modifiers have the ability to reset the current update cycle. The
        // most common use case for this is the `flip` modifier changing the
        // placement, which then needs to re-run all the modifiers, because the
        // logic was previously ran for the previous placement and is therefore
        // stale/incorrect

        state.reset = false;
        state.placement = state.options.placement; // On each update cycle, the `modifiersData` property for each modifier
        // is filled with the initial data specified by the modifier. This means
        // it doesn't persist and is fresh on each update.
        // To ensure persistent data, use `${name}#persistent`

        state.orderedModifiers.forEach(function (modifier) {
          return state.modifiersData[modifier.name] = Object.assign({}, modifier.data);
        });

        for (var index = 0; index < state.orderedModifiers.length; index++) {
          if (state.reset === true) {
            state.reset = false;
            index = -1;
            continue;
          }

          var _state$orderedModifie = state.orderedModifiers[index],
              fn = _state$orderedModifie.fn,
              _state$orderedModifie2 = _state$orderedModifie.options,
              _options = _state$orderedModifie2 === undefined ? {} : _state$orderedModifie2,
              name = _state$orderedModifie.name;

          if (typeof fn === 'function') {
            state = fn({
              state: state,
              options: _options,
              name: name,
              instance: instance
            }) || state;
          }
        }
      },
      // Async and optimistically optimized update – it will not be executed if
      // not necessary (debounced to run at most once-per-tick)
      update: debounce(function () {
        return new Promise(function (resolve) {
          instance.forceUpdate();
          resolve(state);
        });
      }),
      destroy: function destroy() {
        cleanupModifierEffects();
        isDestroyed = true;
      }
    };

    if (!areValidElements(reference, popper)) {
      return instance;
    }

    instance.setOptions(options).then(function (state) {
      if (!isDestroyed && options.onFirstUpdate) {
        options.onFirstUpdate(state);
      }
    }); // Modifiers have the ability to execute arbitrary code before the first
    // update cycle runs. They will be executed in the same order as the update
    // cycle. This is useful when a modifier adds some persistent data that
    // other modifiers need to use, but the modifier is run after the dependent
    // one.

    function runModifierEffects() {
      state.orderedModifiers.forEach(function (_ref) {
        var name = _ref.name,
            _ref$options = _ref.options,
            options = _ref$options === undefined ? {} : _ref$options,
            effect = _ref.effect;

        if (typeof effect === 'function') {
          var cleanupFn = effect({
            state: state,
            name: name,
            instance: instance,
            options: options
          });

          var noopFn = function noopFn() {};

          effectCleanupFns.push(cleanupFn || noopFn);
        }
      });
    }

    function cleanupModifierEffects() {
      effectCleanupFns.forEach(function (fn) {
        return fn();
      });
      effectCleanupFns = [];
    }

    return instance;
  };
}

// For the common JS build we will turn this file into a bundle with no imports.
// This is b/c the Popper lib is all esm files, and would break in a common js only environment
const createPopper = popperGenerator({
  defaultModifiers: [hide$1, popperOffsets$1, computeStyles$1, eventListeners, offset$1, flip$1, preventOverflow$1, arrow$1]
});

const _excluded$7 = ["enabled", "placement", "strategy", "modifiers"];
function _objectWithoutPropertiesLoose$7(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (e.indexOf(n) >= 0) continue; t[n] = r[n]; } return t; }
const {useCallback: useCallback$8,useEffect: useEffect$f,useMemo: useMemo$a,useRef: useRef$d,useState: useState$e} = await importShared('react');
const disabledApplyStylesModifier = {
  name: 'applyStyles',
  enabled: false,
  phase: 'afterWrite',
  fn: () => undefined
};

// until docjs supports type exports...

const ariaDescribedByModifier = {
  name: 'ariaDescribedBy',
  enabled: true,
  phase: 'afterWrite',
  effect: ({
    state
  }) => () => {
    const {
      reference,
      popper
    } = state.elements;
    if ('removeAttribute' in reference) {
      const ids = (reference.getAttribute('aria-describedby') || '').split(',').filter(id => id.trim() !== popper.id);
      if (!ids.length) reference.removeAttribute('aria-describedby');else reference.setAttribute('aria-describedby', ids.join(','));
    }
  },
  fn: ({
    state
  }) => {
    var _popper$getAttribute;
    const {
      popper,
      reference
    } = state.elements;
    const role = (_popper$getAttribute = popper.getAttribute('role')) == null ? undefined : _popper$getAttribute.toLowerCase();
    if (popper.id && role === 'tooltip' && 'setAttribute' in reference) {
      const ids = reference.getAttribute('aria-describedby');
      if (ids && ids.split(',').indexOf(popper.id) !== -1) {
        return;
      }
      reference.setAttribute('aria-describedby', ids ? `${ids},${popper.id}` : popper.id);
    }
  }
};
const EMPTY_MODIFIERS = [];
/**
 * Position an element relative some reference element using Popper.js
 *
 * @param referenceElement
 * @param popperElement
 * @param {object}      options
 * @param {object=}     options.modifiers Popper.js modifiers
 * @param {boolean=}    options.enabled toggle the popper functionality on/off
 * @param {string=}     options.placement The popper element placement relative to the reference element
 * @param {string=}     options.strategy the positioning strategy
 * @param {function=}   options.onCreate called when the popper is created
 * @param {function=}   options.onUpdate called when the popper is updated
 *
 * @returns {UsePopperState} The popper state
 */
function usePopper(referenceElement, popperElement, _ref = {}) {
  let {
      enabled = true,
      placement = 'bottom',
      strategy = 'absolute',
      modifiers = EMPTY_MODIFIERS
    } = _ref,
    config = _objectWithoutPropertiesLoose$7(_ref, _excluded$7);
  const prevModifiers = useRef$d(modifiers);
  const popperInstanceRef = useRef$d();
  const update = useCallback$8(() => {
    var _popperInstanceRef$cu;
    (_popperInstanceRef$cu = popperInstanceRef.current) == null ? undefined : _popperInstanceRef$cu.update();
  }, []);
  const forceUpdate = useCallback$8(() => {
    var _popperInstanceRef$cu2;
    (_popperInstanceRef$cu2 = popperInstanceRef.current) == null ? undefined : _popperInstanceRef$cu2.forceUpdate();
  }, []);
  const [popperState, setState] = useSafeState(useState$e({
    placement,
    update,
    forceUpdate,
    attributes: {},
    styles: {
      popper: {},
      arrow: {}
    }
  }));
  const updateModifier = useMemo$a(() => ({
    name: 'updateStateModifier',
    enabled: true,
    phase: 'write',
    requires: ['computeStyles'],
    fn: ({
      state
    }) => {
      const styles = {};
      const attributes = {};
      Object.keys(state.elements).forEach(element => {
        styles[element] = state.styles[element];
        attributes[element] = state.attributes[element];
      });
      setState({
        state,
        styles,
        attributes,
        update,
        forceUpdate,
        placement: state.placement
      });
    }
  }), [update, forceUpdate, setState]);
  const nextModifiers = useMemo$a(() => {
    if (!dequal(prevModifiers.current, modifiers)) {
      prevModifiers.current = modifiers;
    }
    return prevModifiers.current;
  }, [modifiers]);
  useEffect$f(() => {
    if (!popperInstanceRef.current || !enabled) return;
    popperInstanceRef.current.setOptions({
      placement,
      strategy,
      modifiers: [...nextModifiers, updateModifier, disabledApplyStylesModifier]
    });
  }, [strategy, placement, updateModifier, enabled, nextModifiers]);
  useEffect$f(() => {
    if (!enabled || referenceElement == null || popperElement == null) {
      return undefined;
    }
    popperInstanceRef.current = createPopper(referenceElement, popperElement, Object.assign({}, config, {
      placement,
      strategy,
      modifiers: [...nextModifiers, ariaDescribedByModifier, updateModifier]
    }));
    return () => {
      if (popperInstanceRef.current != null) {
        popperInstanceRef.current.destroy();
        popperInstanceRef.current = undefined;
        setState(s => Object.assign({}, s, {
          attributes: {},
          styles: {
            popper: {}
          }
        }));
      }
    };
    // This is only run once to _create_ the popper
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, referenceElement, popperElement]);
  return popperState;
}

/* eslint-disable no-bitwise, no-cond-assign */

/**
 * Checks if an element contains another given element.
 * 
 * @param context the context element
 * @param node the element to check
 */
function contains(context, node) {
  // HTML DOM and SVG DOM may have different support levels,
  // so we need to check on context instead of a document root element.
  if (context.contains) return context.contains(node);
  if (context.compareDocumentPosition) return context === node || !!(context.compareDocumentPosition(node) & 16);
}

var warning_1;
var hasRequiredWarning;

function requireWarning () {
	if (hasRequiredWarning) return warning_1;
	hasRequiredWarning = 1;
	var warning = function() {
	};
	warning_1 = warning;
	return warning_1;
}

var warningExports = requireWarning();
const warning = /*@__PURE__*/getDefaultExportFromCjs(warningExports);

const {useCallback: useCallback$7,useEffect: useEffect$e,useRef: useRef$c} = await importShared('react');
const noop$3 = () => {};
function isLeftClickEvent(event) {
  return event.button === 0;
}
function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}
const getRefTarget = ref => ref && ('current' in ref ? ref.current : ref);
const InitialTriggerEvents = {
  click: 'mousedown',
  mouseup: 'mousedown',
  pointerup: 'pointerdown'
};

/**
 * The `useClickOutside` hook registers your callback on the document that fires
 * when a pointer event is registered outside of the provided ref or element.
 *
 * @param {Ref<HTMLElement>| HTMLElement} ref  The element boundary
 * @param {function} onClickOutside
 * @param {object=}  options
 * @param {boolean=} options.disabled
 * @param {string=}  options.clickTrigger The DOM event name (click, mousedown, etc) to attach listeners on
 */
function useClickOutside(ref, onClickOutside = noop$3, {
  disabled,
  clickTrigger = 'click'
} = {}) {
  const preventMouseClickOutsideRef = useRef$c(false);
  const waitingForTrigger = useRef$c(false);
  const handleMouseCapture = useCallback$7(e => {
    const currentTarget = getRefTarget(ref);
    warning(!!currentTarget, 'ClickOutside captured a close event but does not have a ref to compare it to. ' + 'useClickOutside(), should be passed a ref that resolves to a DOM node');
    preventMouseClickOutsideRef.current = !currentTarget || isModifiedEvent(e) || !isLeftClickEvent(e) || !!contains(currentTarget, e.target) || waitingForTrigger.current;
    waitingForTrigger.current = false;
  }, [ref]);
  const handleInitialMouse = useEventCallback(e => {
    const currentTarget = getRefTarget(ref);
    if (currentTarget && contains(currentTarget, e.target)) {
      waitingForTrigger.current = true;
    } else {
      // When clicking on scrollbars within current target, click events are not triggered, so this ref
      // is never reset inside `handleMouseCapture`. This would cause a bug where it requires 2 clicks
      // to close the overlay.
      waitingForTrigger.current = false;
    }
  });
  const handleMouse = useEventCallback(e => {
    if (!preventMouseClickOutsideRef.current) {
      onClickOutside(e);
    }
  });
  useEffect$e(() => {
    var _ownerWindow$event, _ownerWindow$parent;
    if (disabled || ref == null) return undefined;
    const doc = ownerDocument(getRefTarget(ref));
    const ownerWindow = doc.defaultView || window;

    // Store the current event to avoid triggering handlers immediately
    // For things rendered in an iframe, the event might originate on the parent window
    // so we should fall back to that global event if the local one doesn't exist
    // https://github.com/facebook/react/issues/20074
    let currentEvent = (_ownerWindow$event = ownerWindow.event) != null ? _ownerWindow$event : (_ownerWindow$parent = ownerWindow.parent) == null ? undefined : _ownerWindow$parent.event;
    let removeInitialTriggerListener = null;
    if (InitialTriggerEvents[clickTrigger]) {
      removeInitialTriggerListener = listen(doc, InitialTriggerEvents[clickTrigger], handleInitialMouse, true);
    }

    // Use capture for this listener so it fires before React's listener, to
    // avoid false positives in the contains() check below if the target DOM
    // element is removed in the React mouse callback.
    const removeMouseCaptureListener = listen(doc, clickTrigger, handleMouseCapture, true);
    const removeMouseListener = listen(doc, clickTrigger, e => {
      // skip if this event is the same as the one running when we added the handlers
      if (e === currentEvent) {
        currentEvent = undefined;
        return;
      }
      handleMouse(e);
    });
    let mobileSafariHackListeners = [];
    if ('ontouchstart' in doc.documentElement) {
      mobileSafariHackListeners = [].slice.call(doc.body.children).map(el => listen(el, 'mousemove', noop$3));
    }
    return () => {
      removeInitialTriggerListener == null ? undefined : removeInitialTriggerListener();
      removeMouseCaptureListener();
      removeMouseListener();
      mobileSafariHackListeners.forEach(remove => remove());
    };
  }, [ref, disabled, clickTrigger, handleMouseCapture, handleInitialMouse, handleMouse]);
}

function toModifierMap(modifiers) {
  const result = {};
  if (!Array.isArray(modifiers)) {
    return modifiers || result;
  }

  // eslint-disable-next-line no-unused-expressions
  modifiers == null ? undefined : modifiers.forEach(m => {
    result[m.name] = m;
  });
  return result;
}
function toModifierArray(map = {}) {
  if (Array.isArray(map)) return map;
  return Object.keys(map).map(k => {
    map[k].name = k;
    return map[k];
  });
}
function mergeOptionsWithPopperConfig({
  enabled,
  enableEvents,
  placement,
  flip,
  offset,
  fixed,
  containerPadding,
  arrowElement,
  popperConfig = {}
}) {
  var _modifiers$eventListe, _modifiers$preventOve, _modifiers$preventOve2, _modifiers$offset, _modifiers$arrow;
  const modifiers = toModifierMap(popperConfig.modifiers);
  return Object.assign({}, popperConfig, {
    placement,
    enabled,
    strategy: fixed ? 'fixed' : popperConfig.strategy,
    modifiers: toModifierArray(Object.assign({}, modifiers, {
      eventListeners: {
        enabled: enableEvents,
        options: (_modifiers$eventListe = modifiers.eventListeners) == null ? undefined : _modifiers$eventListe.options
      },
      preventOverflow: Object.assign({}, modifiers.preventOverflow, {
        options: containerPadding ? Object.assign({
          padding: containerPadding
        }, (_modifiers$preventOve = modifiers.preventOverflow) == null ? undefined : _modifiers$preventOve.options) : (_modifiers$preventOve2 = modifiers.preventOverflow) == null ? undefined : _modifiers$preventOve2.options
      }),
      offset: {
        options: Object.assign({
          offset
        }, (_modifiers$offset = modifiers.offset) == null ? undefined : _modifiers$offset.options)
      },
      arrow: Object.assign({}, modifiers.arrow, {
        enabled: !!arrowElement,
        options: Object.assign({}, (_modifiers$arrow = modifiers.arrow) == null ? undefined : _modifiers$arrow.options, {
          element: arrowElement
        })
      }),
      flip: Object.assign({
        enabled: !!flip
      }, modifiers.flip)
    }))
  });
}

const _excluded$6 = ["children", "usePopper"];
function _objectWithoutPropertiesLoose$6(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (e.indexOf(n) >= 0) continue; t[n] = r[n]; } return t; }
const {useContext: useContext$o,useRef: useRef$b} = await importShared('react');

await importShared('react');
const noop$2 = () => {};

/**
 * @memberOf Dropdown
 * @param {object}  options
 * @param {boolean} options.flip Automatically adjust the menu `drop` position based on viewport edge detection
 * @param {[number, number]} options.offset Define an offset distance between the Menu and the Toggle
 * @param {boolean} options.show Display the menu manually, ignored in the context of a `Dropdown`
 * @param {boolean} options.usePopper opt in/out of using PopperJS to position menus. When disabled you must position it yourself.
 * @param {string}  options.rootCloseEvent The pointer event to listen for when determining "clicks outside" the menu for triggering a close.
 * @param {object}  options.popperConfig Options passed to the [`usePopper`](/api/usePopper) hook.
 */
function useDropdownMenu(options = {}) {
  const context = useContext$o(DropdownContext$1);
  const [arrowElement, attachArrowRef] = useCallbackRef$1();
  const hasShownRef = useRef$b(false);
  const {
    flip,
    offset,
    rootCloseEvent,
    fixed = false,
    placement: placementOverride,
    popperConfig = {},
    enableEventListeners = true,
    usePopper: shouldUsePopper = !!context
  } = options;
  const show = (context == null ? undefined : context.show) == null ? !!options.show : context.show;
  if (show && !hasShownRef.current) {
    hasShownRef.current = true;
  }
  const handleClose = e => {
    context == null ? undefined : context.toggle(false, e);
  };
  const {
    placement,
    setMenu,
    menuElement,
    toggleElement
  } = context || {};
  const popper = usePopper(toggleElement, menuElement, mergeOptionsWithPopperConfig({
    placement: placementOverride || placement || 'bottom-start',
    enabled: shouldUsePopper,
    enableEvents: enableEventListeners == null ? show : enableEventListeners,
    offset,
    flip,
    fixed,
    arrowElement,
    popperConfig
  }));
  const menuProps = Object.assign({
    ref: setMenu || noop$2,
    'aria-labelledby': toggleElement == null ? undefined : toggleElement.id
  }, popper.attributes.popper, {
    style: popper.styles.popper
  });
  const metadata = {
    show,
    placement,
    hasShown: hasShownRef.current,
    toggle: context == null ? undefined : context.toggle,
    popper: shouldUsePopper ? popper : null,
    arrowProps: shouldUsePopper ? Object.assign({
      ref: attachArrowRef
    }, popper.attributes.arrow, {
      style: popper.styles.arrow
    }) : {}
  };
  useClickOutside(menuElement, handleClose, {
    clickTrigger: rootCloseEvent,
    disabled: !show
  });
  return [menuProps, metadata];
}
/**
 * Also exported as `<Dropdown.Menu>` from `Dropdown`.
 *
 * @displayName DropdownMenu
 * @memberOf Dropdown
 */
function DropdownMenu$1(_ref) {
  let {
      children,
      usePopper: usePopperProp = true
    } = _ref,
    options = _objectWithoutPropertiesLoose$6(_ref, _excluded$6);
  const [props, meta] = useDropdownMenu(Object.assign({}, options, {
    usePopper: usePopperProp
  }));
  return /*#__PURE__*/jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, {
    children: children(props, meta)
  });
}
DropdownMenu$1.displayName = 'DropdownMenu';

const $670gB$react = await importShared('react');
const {useContext:$670gB$useContext,useState:$670gB$useState,useMemo:$670gB$useMemo,useLayoutEffect:$670gB$useLayoutEffect,useRef:$670gB$useRef} = $670gB$react;

const $b5e257d569688ac6$var$defaultContext = {
  prefix: String(Math.round(Math.random() * 1e10)),
  current: 0
};
const $b5e257d569688ac6$var$SSRContext = /* @__PURE__ */ ($670gB$react).createContext($b5e257d569688ac6$var$defaultContext);
const $b5e257d569688ac6$var$IsSSRContext = /* @__PURE__ */ ($670gB$react).createContext(false);
let $b5e257d569688ac6$var$canUseDOM = Boolean(typeof window !== "undefined" && window.document && window.document.createElement);
let $b5e257d569688ac6$var$componentIds = /* @__PURE__ */ new WeakMap();
function $b5e257d569688ac6$var$useCounter(isDisabled = false) {
  let ctx = ($670gB$useContext)($b5e257d569688ac6$var$SSRContext);
  let ref = ($670gB$useRef)(null);
  if (ref.current === null && !isDisabled) {
    var _React___SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED_ReactCurrentOwner, _React___SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    let currentOwner = (_React___SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = ($670gB$react).__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED) === null || _React___SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED === undefined ? undefined : (_React___SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED_ReactCurrentOwner = _React___SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner) === null || _React___SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED_ReactCurrentOwner === undefined ? undefined : _React___SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED_ReactCurrentOwner.current;
    if (currentOwner) {
      let prevComponentValue = $b5e257d569688ac6$var$componentIds.get(currentOwner);
      if (prevComponentValue == null)
        $b5e257d569688ac6$var$componentIds.set(currentOwner, {
          id: ctx.current,
          state: currentOwner.memoizedState
        });
      else if (currentOwner.memoizedState !== prevComponentValue.state) {
        ctx.current = prevComponentValue.id;
        $b5e257d569688ac6$var$componentIds.delete(currentOwner);
      }
    }
    ref.current = ++ctx.current;
  }
  return ref.current;
}
function $b5e257d569688ac6$var$useLegacySSRSafeId(defaultId) {
  let ctx = ($670gB$useContext)($b5e257d569688ac6$var$SSRContext);
  if (ctx === $b5e257d569688ac6$var$defaultContext && !$b5e257d569688ac6$var$canUseDOM) console.warn("When server rendering, you must wrap your application in an <SSRProvider> to ensure consistent ids are generated between the client and server.");
  let counter = $b5e257d569688ac6$var$useCounter(!!defaultId);
  let prefix = `react-aria${ctx.prefix}`;
  return defaultId || `${prefix}-${counter}`;
}
function $b5e257d569688ac6$var$useModernSSRSafeId(defaultId) {
  let id = ($670gB$react).useId();
  let [didSSR] = ($670gB$useState)($b5e257d569688ac6$export$535bd6ca7f90a273());
  let prefix = didSSR || false ? "react-aria" : `react-aria${$b5e257d569688ac6$var$defaultContext.prefix}`;
  return defaultId || `${prefix}-${id}`;
}
const $b5e257d569688ac6$export$619500959fc48b26 = typeof ($670gB$react)["useId"] === "function" ? $b5e257d569688ac6$var$useModernSSRSafeId : $b5e257d569688ac6$var$useLegacySSRSafeId;
function $b5e257d569688ac6$var$getSnapshot() {
  return false;
}
function $b5e257d569688ac6$var$getServerSnapshot() {
  return true;
}
function $b5e257d569688ac6$var$subscribe(onStoreChange) {
  return () => {
  };
}
function $b5e257d569688ac6$export$535bd6ca7f90a273() {
  if (typeof ($670gB$react)["useSyncExternalStore"] === "function") return ($670gB$react)["useSyncExternalStore"]($b5e257d569688ac6$var$subscribe, $b5e257d569688ac6$var$getSnapshot, $b5e257d569688ac6$var$getServerSnapshot);
  return ($670gB$useContext)($b5e257d569688ac6$var$IsSSRContext);
}

const {useContext: useContext$n,useCallback: useCallback$6} = await importShared('react');

await importShared('react');
const isRoleMenu = el => {
  var _el$getAttribute;
  return ((_el$getAttribute = el.getAttribute('role')) == null ? undefined : _el$getAttribute.toLowerCase()) === 'menu';
};
const noop$1 = () => {};

/**
 * Wires up Dropdown toggle functionality, returning a set a props to attach
 * to the element that functions as the dropdown toggle (generally a button).
 *
 * @memberOf Dropdown
 */
function useDropdownToggle() {
  const id = $b5e257d569688ac6$export$619500959fc48b26();
  const {
    show = false,
    toggle = noop$1,
    setToggle,
    menuElement
  } = useContext$n(DropdownContext$1) || {};
  const handleClick = useCallback$6(e => {
    toggle(!show, e);
  }, [show, toggle]);
  const props = {
    id,
    ref: setToggle || noop$1,
    onClick: handleClick,
    'aria-expanded': !!show
  };

  // This is maybe better down in an effect, but
  // the component is going to update anyway when the menu element
  // is set so might return new props.
  if (menuElement && isRoleMenu(menuElement)) {
    props['aria-haspopup'] = true;
  }
  return [props, {
    show,
    toggle
  }];
}
/**
 * Also exported as `<Dropdown.Toggle>` from `Dropdown`.
 *
 * @displayName DropdownToggle
 * @memberOf Dropdown
 */
function DropdownToggle$1({
  children
}) {
  const [props, meta] = useDropdownToggle();
  return /*#__PURE__*/jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, {
    children: children(props, meta)
  });
}
DropdownToggle$1.displayName = 'DropdownToggle';

const React$_ = await importShared('react');

const SelectableContext = /*#__PURE__*/React$_.createContext(null);
const makeEventKey = (eventKey, href = null) => {
  if (eventKey != null) return String(eventKey);
  return href || null;
};

const React$Z = await importShared('react');

const NavContext = /*#__PURE__*/React$Z.createContext(null);
NavContext.displayName = 'NavContext';

const ATTRIBUTE_PREFIX = `data-rr-ui-`;
const PROPERTY_PREFIX = `rrUi`;
function dataAttr(property) {
  return `${ATTRIBUTE_PREFIX}${property}`;
}
function dataProp(property) {
  return `${PROPERTY_PREFIX}${property}`;
}

const _excluded$5 = ["eventKey", "disabled", "onClick", "active", "as"];
function _objectWithoutPropertiesLoose$5(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (e.indexOf(n) >= 0) continue; t[n] = r[n]; } return t; }
const React$Y = await importShared('react');

const {useContext: useContext$m} = await importShared('react');
/**
 * Create a dropdown item. Returns a set of props for the dropdown item component
 * including an `onClick` handler that prevents selection when the item is disabled
 */
function useDropdownItem({
  key,
  href,
  active,
  disabled,
  onClick
}) {
  const onSelectCtx = useContext$m(SelectableContext);
  const navContext = useContext$m(NavContext);
  const {
    activeKey
  } = navContext || {};
  const eventKey = makeEventKey(key, href);
  const isActive = active == null && key != null ? makeEventKey(activeKey) === eventKey : active;
  const handleClick = useEventCallback(event => {
    if (disabled) return;
    onClick == null ? undefined : onClick(event);
    if (onSelectCtx && !event.isPropagationStopped()) {
      onSelectCtx(eventKey, event);
    }
  });
  return [{
    onClick: handleClick,
    'aria-disabled': disabled || undefined,
    'aria-selected': isActive,
    [dataAttr('dropdown-item')]: ''
  }, {
    isActive
  }];
}
const DropdownItem$1 = /*#__PURE__*/React$Y.forwardRef((_ref, ref) => {
  let {
      eventKey,
      disabled,
      onClick,
      active,
      as: Component = Button$1
    } = _ref,
    props = _objectWithoutPropertiesLoose$5(_ref, _excluded$5);
  const [dropdownItemProps] = useDropdownItem({
    key: eventKey,
    href: props.href,
    disabled,
    onClick,
    active
  });
  return /*#__PURE__*/jsxRuntimeExports.jsx(Component, Object.assign({}, props, {
    ref: ref
  }, dropdownItemProps));
});
DropdownItem$1.displayName = 'DropdownItem';

const {createContext,useContext: useContext$l} = await importShared('react');
const Context = /*#__PURE__*/createContext(canUseDOM ? window : undefined);
Context.Provider;

/**
 * The document "window" placed in React context. Helpful for determining
 * SSR context, or when rendering into an iframe.
 *
 * @returns the current window
 */
function useWindow() {
  return useContext$l(Context);
}

const {useCallback: useCallback$5,useRef: useRef$a,useEffect: useEffect$d,useMemo: useMemo$9,useContext: useContext$k} = await importShared('react');

await importShared('react');
function useRefWithUpdate() {
  const forceUpdate = useForceUpdate();
  const ref = useRef$a(null);
  const attachRef = useCallback$5(element => {
    ref.current = element;
    // ensure that a menu set triggers an update for consumers
    forceUpdate();
  }, [forceUpdate]);
  return [ref, attachRef];
}

/**
 * @displayName Dropdown
 * @public
 */
function Dropdown$2({
  defaultShow,
  show: rawShow,
  onSelect,
  onToggle: rawOnToggle,
  itemSelector = `* [${dataAttr('dropdown-item')}]`,
  focusFirstItemOnShow,
  placement = 'bottom-start',
  children
}) {
  const window = useWindow();
  const [show, onToggle] = useUncontrolledProp(rawShow, defaultShow, rawOnToggle);

  // We use normal refs instead of useCallbackRef in order to populate the
  // the value as quickly as possible, otherwise the effect to focus the element
  // may run before the state value is set
  const [menuRef, setMenu] = useRefWithUpdate();
  const menuElement = menuRef.current;
  const [toggleRef, setToggle] = useRefWithUpdate();
  const toggleElement = toggleRef.current;
  const lastShow = usePrevious(show);
  const lastSourceEvent = useRef$a(null);
  const focusInDropdown = useRef$a(false);
  const onSelectCtx = useContext$k(SelectableContext);
  const toggle = useCallback$5((nextShow, event, source = event == null ? undefined : event.type) => {
    onToggle(nextShow, {
      originalEvent: event,
      source
    });
  }, [onToggle]);
  const handleSelect = useEventCallback((key, event) => {
    onSelect == null ? undefined : onSelect(key, event);
    toggle(false, event, 'select');
    if (!event.isPropagationStopped()) {
      onSelectCtx == null ? undefined : onSelectCtx(key, event);
    }
  });
  const context = useMemo$9(() => ({
    toggle,
    placement,
    show,
    menuElement,
    toggleElement,
    setMenu,
    setToggle
  }), [toggle, placement, show, menuElement, toggleElement, setMenu, setToggle]);
  if (menuElement && lastShow && !show) {
    focusInDropdown.current = menuElement.contains(menuElement.ownerDocument.activeElement);
  }
  const focusToggle = useEventCallback(() => {
    if (toggleElement && toggleElement.focus) {
      toggleElement.focus();
    }
  });
  const maybeFocusFirst = useEventCallback(() => {
    const type = lastSourceEvent.current;
    let focusType = focusFirstItemOnShow;
    if (focusType == null) {
      focusType = menuRef.current && isRoleMenu(menuRef.current) ? 'keyboard' : false;
    }
    if (focusType === false || focusType === 'keyboard' && !/^key.+$/.test(type)) {
      return;
    }
    const first = qsa(menuRef.current, itemSelector)[0];
    if (first && first.focus) first.focus();
  });
  useEffect$d(() => {
    if (show) maybeFocusFirst();else if (focusInDropdown.current) {
      focusInDropdown.current = false;
      focusToggle();
    }
    // only `show` should be changing
  }, [show, focusInDropdown, focusToggle, maybeFocusFirst]);
  useEffect$d(() => {
    lastSourceEvent.current = null;
  });
  const getNextFocusedChild = (current, offset) => {
    if (!menuRef.current) return null;
    const items = qsa(menuRef.current, itemSelector);
    let index = items.indexOf(current) + offset;
    index = Math.max(0, Math.min(index, items.length));
    return items[index];
  };
  useEventListener(useCallback$5(() => window.document, [window]), 'keydown', event => {
    var _menuRef$current, _toggleRef$current;
    const {
      key
    } = event;
    const target = event.target;
    const fromMenu = (_menuRef$current = menuRef.current) == null ? undefined : _menuRef$current.contains(target);
    const fromToggle = (_toggleRef$current = toggleRef.current) == null ? undefined : _toggleRef$current.contains(target);

    // Second only to https://github.com/twbs/bootstrap/blob/8cfbf6933b8a0146ac3fbc369f19e520bd1ebdac/js/src/dropdown.js#L400
    // in inscrutability
    const isInput = /input|textarea/i.test(target.tagName);
    if (isInput && (key === ' ' || key !== 'Escape' && fromMenu || key === 'Escape' && target.type === 'search')) {
      return;
    }
    if (!fromMenu && !fromToggle) {
      return;
    }
    if (key === 'Tab' && (!menuRef.current || !show)) {
      return;
    }
    lastSourceEvent.current = event.type;
    const meta = {
      originalEvent: event,
      source: event.type
    };
    switch (key) {
      case 'ArrowUp':
        {
          const next = getNextFocusedChild(target, -1);
          if (next && next.focus) next.focus();
          event.preventDefault();
          return;
        }
      case 'ArrowDown':
        event.preventDefault();
        if (!show) {
          onToggle(true, meta);
        } else {
          const next = getNextFocusedChild(target, 1);
          if (next && next.focus) next.focus();
        }
        return;
      case 'Tab':
        // on keydown the target is the element being tabbed FROM, we need that
        // to know if this event is relevant to this dropdown (e.g. in this menu).
        // On `keyup` the target is the element being tagged TO which we use to check
        // if focus has left the menu
        addEventListener(target.ownerDocument, 'keyup', e => {
          var _menuRef$current2;
          if (e.key === 'Tab' && !e.target || !((_menuRef$current2 = menuRef.current) != null && _menuRef$current2.contains(e.target))) {
            onToggle(false, meta);
          }
        }, {
          once: true
        });
        break;
      case 'Escape':
        if (key === 'Escape') {
          event.preventDefault();
          event.stopPropagation();
        }
        onToggle(false, meta);
        break;
    }
  });
  return /*#__PURE__*/jsxRuntimeExports.jsx(SelectableContext.Provider, {
    value: handleSelect,
    children: /*#__PURE__*/jsxRuntimeExports.jsx(DropdownContext$1.Provider, {
      value: context,
      children: children
    })
  });
}
Dropdown$2.displayName = 'Dropdown';
Dropdown$2.Menu = DropdownMenu$1;
Dropdown$2.Toggle = DropdownToggle$1;
Dropdown$2.Item = DropdownItem$1;

const React$X = await importShared('react');

const DropdownContext = /*#__PURE__*/React$X.createContext({});
DropdownContext.displayName = 'DropdownContext';

const React$W = await importShared('react');
const DropdownDivider = /*#__PURE__*/React$W.forwardRef(({
  className,
  bsPrefix,
  as: Component = 'hr',
  role = 'separator',
  ...props
}, ref) => {
  bsPrefix = useBootstrapPrefix(bsPrefix, 'dropdown-divider');
  return /*#__PURE__*/jsxRuntimeExports.jsx(Component, {
    ref: ref,
    className: classNames(className, bsPrefix),
    role: role,
    ...props
  });
});
DropdownDivider.displayName = 'DropdownDivider';

const React$V = await importShared('react');
const DropdownHeader = /*#__PURE__*/React$V.forwardRef(({
  className,
  bsPrefix,
  as: Component = 'div',
  role = 'heading',
  ...props
}, ref) => {
  bsPrefix = useBootstrapPrefix(bsPrefix, 'dropdown-header');
  return /*#__PURE__*/jsxRuntimeExports.jsx(Component, {
    ref: ref,
    className: classNames(className, bsPrefix),
    role: role,
    ...props
  });
});
DropdownHeader.displayName = 'DropdownHeader';

const React$U = await importShared('react');
const DropdownItem = /*#__PURE__*/React$U.forwardRef(({
  bsPrefix,
  className,
  eventKey,
  disabled = false,
  onClick,
  active,
  as: Component = Anchor,
  ...props
}, ref) => {
  const prefix = useBootstrapPrefix(bsPrefix, 'dropdown-item');
  const [dropdownItemProps, meta] = useDropdownItem({
    key: eventKey,
    href: props.href,
    disabled,
    onClick,
    active
  });
  return /*#__PURE__*/jsxRuntimeExports.jsx(Component, {
    ...props,
    ...dropdownItemProps,
    ref: ref,
    className: classNames(className, prefix, meta.isActive && 'active', disabled && 'disabled')
  });
});
DropdownItem.displayName = 'DropdownItem';

const React$T = await importShared('react');
const DropdownItemText = /*#__PURE__*/React$T.forwardRef(({
  className,
  bsPrefix,
  as: Component = 'span',
  ...props
}, ref) => {
  bsPrefix = useBootstrapPrefix(bsPrefix, 'dropdown-item-text');
  return /*#__PURE__*/jsxRuntimeExports.jsx(Component, {
    ref: ref,
    className: classNames(className, bsPrefix),
    ...props
  });
});
DropdownItemText.displayName = 'DropdownItemText';

const {useEffect: useEffect$c,useLayoutEffect} = await importShared('react');

const isReactNative = typeof global !== 'undefined' &&
// @ts-ignore
global.navigator &&
// @ts-ignore
global.navigator.product === 'ReactNative';
const isDOM = typeof document !== 'undefined';

/**
 * Is `useLayoutEffect` in a DOM or React Native environment, otherwise resolves to useEffect
 * Only useful to avoid the console warning.
 *
 * PREFER `useEffect` UNLESS YOU KNOW WHAT YOU ARE DOING.
 *
 * @category effects
 */
const useIsomorphicEffect = isDOM || isReactNative ? useLayoutEffect : useEffect$c;

const React$S = await importShared('react');

const context$1 = /*#__PURE__*/React$S.createContext(null);
context$1.displayName = 'InputGroupContext';

const React$R = await importShared('react');


// TODO: check

const context = /*#__PURE__*/React$R.createContext(null);
context.displayName = 'NavbarContext';

await importShared('react');
function useWrappedRefWithWarning(ref, componentName) {
  return ref;
}

const React$Q = await importShared('react');

const {useContext: useContext$j} = await importShared('react');
function getDropdownMenuPlacement(alignEnd, dropDirection, isRTL) {
  const topStart = isRTL ? "top-end" : "top-start";
  const topEnd = isRTL ? "top-start" : "top-end";
  const bottomStart = isRTL ? "bottom-end" : "bottom-start";
  const bottomEnd = isRTL ? "bottom-start" : "bottom-end";
  const leftStart = isRTL ? "right-start" : "left-start";
  const leftEnd = isRTL ? "right-end" : "left-end";
  const rightStart = isRTL ? "left-start" : "right-start";
  const rightEnd = isRTL ? "left-end" : "right-end";
  let placement = alignEnd ? bottomEnd : bottomStart;
  if (dropDirection === "up") placement = alignEnd ? topEnd : topStart;
  else if (dropDirection === "end") placement = alignEnd ? rightEnd : rightStart;
  else if (dropDirection === "start") placement = alignEnd ? leftEnd : leftStart;
  else if (dropDirection === "down-centered") placement = "bottom";
  else if (dropDirection === "up-centered") placement = "top";
  return placement;
}
const DropdownMenu = /* @__PURE__ */ React$Q.forwardRef(({
  bsPrefix,
  className,
  align,
  rootCloseEvent,
  flip = true,
  show: showProps,
  renderOnMount,
  // Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
  as: Component = "div",
  popperConfig,
  variant,
  ...props
}, ref) => {
  let alignEnd = false;
  const isNavbar = useContext$j(context);
  const prefix = useBootstrapPrefix(bsPrefix, "dropdown-menu");
  const {
    align: contextAlign,
    drop,
    isRTL
  } = useContext$j(DropdownContext);
  align = align || contextAlign;
  const isInputGroup = useContext$j(context$1);
  const alignClasses = [];
  if (align) {
    if (typeof align === "object") {
      const keys = Object.keys(align);
      if (keys.length) {
        const brkPoint = keys[0];
        const direction = align[brkPoint];
        alignEnd = direction === "start";
        alignClasses.push(`${prefix}-${brkPoint}-${direction}`);
      }
    } else if (align === "end") {
      alignEnd = true;
    }
  }
  const placement = getDropdownMenuPlacement(alignEnd, drop, isRTL);
  const [menuProps, {
    hasShown,
    popper,
    show,
    toggle
  }] = useDropdownMenu({
    flip,
    rootCloseEvent,
    show: showProps,
    usePopper: !isNavbar && alignClasses.length === 0,
    offset: [0, 2],
    popperConfig,
    placement
  });
  menuProps.ref = useMergedRefs$1(useWrappedRefWithWarning(ref), menuProps.ref);
  useIsomorphicEffect(() => {
    if (show) popper == null || popper.update();
  }, [show]);
  if (!hasShown && !renderOnMount && !isInputGroup) return null;
  if (typeof Component !== "string") {
    menuProps.show = show;
    menuProps.close = () => toggle == null ? undefined : toggle(false);
    menuProps.align = align;
  }
  let style = props.style;
  if (popper != null && popper.placement) {
    style = {
      ...props.style,
      ...menuProps.style
    };
    props["x-placement"] = popper.placement;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Component, {
    ...props,
    ...menuProps,
    style,
    ...(alignClasses.length || isNavbar) && {
      "data-bs-popper": "static"
    },
    className: classNames(className, prefix, show && "show", alignEnd && `${prefix}-end`, variant && `${prefix}-${variant}`, ...alignClasses)
  });
});
DropdownMenu.displayName = "DropdownMenu";

const React$P = await importShared('react');

const {useContext: useContext$i} = await importShared('react');
const DropdownToggle = /*#__PURE__*/React$P.forwardRef(({
  bsPrefix,
  split,
  className,
  childBsPrefix,
  // Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
  as: Component = Button,
  ...props
}, ref) => {
  const prefix = useBootstrapPrefix(bsPrefix, 'dropdown-toggle');
  const dropdownContext = useContext$i(DropdownContext$1);
  if (childBsPrefix !== undefined) {
    props.bsPrefix = childBsPrefix;
  }
  const [toggleProps] = useDropdownToggle();
  toggleProps.ref = useMergedRefs$1(toggleProps.ref, useWrappedRefWithWarning(ref));

  // This intentionally forwards size and variant (if set) to the
  // underlying component, to allow it to render size and style variants.
  return /*#__PURE__*/jsxRuntimeExports.jsx(Component, {
    className: classNames(className, prefix, split && `${prefix}-split`, (dropdownContext == null ? undefined : dropdownContext.show) && 'show'),
    ...toggleProps,
    ...props
  });
});
DropdownToggle.displayName = 'DropdownToggle';

const React$O = await importShared('react');

const {useContext: useContext$h,useMemo: useMemo$8} = await importShared('react');
const Dropdown = /*#__PURE__*/React$O.forwardRef((pProps, ref) => {
  const {
    bsPrefix,
    drop = 'down',
    show,
    className,
    align = 'start',
    onSelect,
    onToggle,
    focusFirstItemOnShow,
    // Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
    as: Component = 'div',
    navbar: _4,
    autoClose = true,
    ...props
  } = useUncontrolled(pProps, {
    show: 'onToggle'
  });
  const isInputGroup = useContext$h(context$1);
  const prefix = useBootstrapPrefix(bsPrefix, 'dropdown');
  const isRTL = useIsRTL();
  const isClosingPermitted = source => {
    // autoClose=false only permits close on button click
    if (autoClose === false) return source === 'click';

    // autoClose=inside doesn't permit close on rootClose
    if (autoClose === 'inside') return source !== 'rootClose';

    // autoClose=outside doesn't permit close on select
    if (autoClose === 'outside') return source !== 'select';
    return true;
  };
  const handleToggle = useEventCallback$1((nextShow, meta) => {
    var _meta$originalEvent;
    /** Checking if target of event is ToggleButton,
     * if it is then nullify mousedown event
     */
    const isToggleButton = (_meta$originalEvent = meta.originalEvent) == null || (_meta$originalEvent = _meta$originalEvent.target) == null ? undefined : _meta$originalEvent.classList.contains('dropdown-toggle');
    if (isToggleButton && meta.source === 'mousedown') {
      return;
    }
    if (meta.originalEvent.currentTarget === document && (meta.source !== 'keydown' || meta.originalEvent.key === 'Escape')) meta.source = 'rootClose';
    if (isClosingPermitted(meta.source)) onToggle == null || onToggle(nextShow, meta);
  });
  const alignEnd = align === 'end';
  const placement = getDropdownMenuPlacement(alignEnd, drop, isRTL);
  const contextValue = useMemo$8(() => ({
    align,
    drop,
    isRTL
  }), [align, drop, isRTL]);
  const directionClasses = {
    down: prefix,
    'down-centered': `${prefix}-center`,
    up: 'dropup',
    'up-centered': 'dropup-center dropup',
    end: 'dropend',
    start: 'dropstart'
  };
  return /*#__PURE__*/jsxRuntimeExports.jsx(DropdownContext.Provider, {
    value: contextValue,
    children: /*#__PURE__*/jsxRuntimeExports.jsx(Dropdown$2, {
      placement: placement,
      show: show,
      onSelect: onSelect,
      onToggle: handleToggle,
      focusFirstItemOnShow: focusFirstItemOnShow,
      itemSelector: `.${prefix}-item:not(.disabled):not(:disabled)`,
      children: isInputGroup ? props.children : /*#__PURE__*/jsxRuntimeExports.jsx(Component, {
        ...props,
        ref: ref,
        className: classNames(className, show && 'show', directionClasses[drop])
      })
    })
  });
});
Dropdown.displayName = 'Dropdown';
const Dropdown$1 = Object.assign(Dropdown, {
  Toggle: DropdownToggle,
  Menu: DropdownMenu,
  Item: DropdownItem,
  ItemText: DropdownItemText,
  Divider: DropdownDivider,
  Header: DropdownHeader
});

const React$N = await importShared('react');
({
  /**
   * @default 'img'
   */
  bsPrefix: PropTypes.string,
  /**
   * Sets image as fluid image.
   */
  fluid: PropTypes.bool,
  /**
   * Sets image shape as rounded.
   */
  rounded: PropTypes.bool,
  /**
   * Sets image shape as circle.
   */
  roundedCircle: PropTypes.bool,
  /**
   * Sets image shape as thumbnail.
   */
  thumbnail: PropTypes.bool
});
const Image$1 = /*#__PURE__*/React$N.forwardRef(({
  bsPrefix,
  className,
  fluid = false,
  rounded = false,
  roundedCircle = false,
  thumbnail = false,
  ...props
}, ref) => {
  bsPrefix = useBootstrapPrefix(bsPrefix, 'img');
  return /*#__PURE__*/jsxRuntimeExports.jsx("img", {
    // eslint-disable-line jsx-a11y/alt-text
    ref: ref,
    ...props,
    className: classNames(className, fluid && `${bsPrefix}-fluid`, rounded && `rounded`, roundedCircle && `rounded-circle`, thumbnail && `${bsPrefix}-thumbnail`)
  });
});
Image$1.displayName = 'Image';

const React$M = await importShared('react');
const propTypes$1 = {
  /**
   * Specify whether the feedback is for valid or invalid fields
   *
   * @type {('valid'|'invalid')}
   */
  type: PropTypes.string,
  /** Display feedback as a tooltip. */
  tooltip: PropTypes.bool,
  as: PropTypes.elementType
};
const Feedback = /*#__PURE__*/React$M.forwardRef(
// Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
({
  as: Component = 'div',
  className,
  type = 'valid',
  tooltip = false,
  ...props
}, ref) => /*#__PURE__*/jsxRuntimeExports.jsx(Component, {
  ...props,
  ref: ref,
  className: classNames(className, `${type}-${tooltip ? 'tooltip' : 'feedback'}`)
}));
Feedback.displayName = 'Feedback';
Feedback.propTypes = propTypes$1;

const React$L = await importShared('react');


// TODO

const FormContext = /*#__PURE__*/React$L.createContext({});

const React$K = await importShared('react');

const {useContext: useContext$g} = await importShared('react');
const FormCheckInput = /*#__PURE__*/React$K.forwardRef(({
  id,
  bsPrefix,
  className,
  type = 'checkbox',
  isValid = false,
  isInvalid = false,
  // Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
  as: Component = 'input',
  ...props
}, ref) => {
  const {
    controlId
  } = useContext$g(FormContext);
  bsPrefix = useBootstrapPrefix(bsPrefix, 'form-check-input');
  return /*#__PURE__*/jsxRuntimeExports.jsx(Component, {
    ...props,
    ref: ref,
    type: type,
    id: id || controlId,
    className: classNames(className, bsPrefix, isValid && 'is-valid', isInvalid && 'is-invalid')
  });
});
FormCheckInput.displayName = 'FormCheckInput';

const React$J = await importShared('react');

const {useContext: useContext$f} = await importShared('react');
const FormCheckLabel = /*#__PURE__*/React$J.forwardRef(({
  bsPrefix,
  className,
  htmlFor,
  ...props
}, ref) => {
  const {
    controlId
  } = useContext$f(FormContext);
  bsPrefix = useBootstrapPrefix(bsPrefix, 'form-check-label');
  return /*#__PURE__*/jsxRuntimeExports.jsx("label", {
    ...props,
    ref: ref,
    htmlFor: htmlFor || controlId,
    className: classNames(className, bsPrefix)
  });
});
FormCheckLabel.displayName = 'FormCheckLabel';

const React$I = await importShared('react');

const {useContext: useContext$e,useMemo: useMemo$7} = await importShared('react');
const FormCheck = /*#__PURE__*/React$I.forwardRef(({
  id,
  bsPrefix,
  bsSwitchPrefix,
  inline = false,
  reverse = false,
  disabled = false,
  isValid = false,
  isInvalid = false,
  feedbackTooltip = false,
  feedback,
  feedbackType,
  className,
  style,
  title = '',
  type = 'checkbox',
  label,
  children,
  // Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
  as = 'input',
  ...props
}, ref) => {
  bsPrefix = useBootstrapPrefix(bsPrefix, 'form-check');
  bsSwitchPrefix = useBootstrapPrefix(bsSwitchPrefix, 'form-switch');
  const {
    controlId
  } = useContext$e(FormContext);
  const innerFormContext = useMemo$7(() => ({
    controlId: id || controlId
  }), [controlId, id]);
  const hasLabel = !children && label != null && label !== false || hasChildOfType(children, FormCheckLabel);
  const input = /*#__PURE__*/jsxRuntimeExports.jsx(FormCheckInput, {
    ...props,
    type: type === 'switch' ? 'checkbox' : type,
    ref: ref,
    isValid: isValid,
    isInvalid: isInvalid,
    disabled: disabled,
    as: as
  });
  return /*#__PURE__*/jsxRuntimeExports.jsx(FormContext.Provider, {
    value: innerFormContext,
    children: /*#__PURE__*/jsxRuntimeExports.jsx("div", {
      style: style,
      className: classNames(className, hasLabel && bsPrefix, inline && `${bsPrefix}-inline`, reverse && `${bsPrefix}-reverse`, type === 'switch' && bsSwitchPrefix),
      children: children || /*#__PURE__*/jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, {
        children: [input, hasLabel && /*#__PURE__*/jsxRuntimeExports.jsx(FormCheckLabel, {
          title: title,
          children: label
        }), feedback && /*#__PURE__*/jsxRuntimeExports.jsx(Feedback, {
          type: feedbackType,
          tooltip: feedbackTooltip,
          children: feedback
        })]
      })
    })
  });
});
FormCheck.displayName = 'FormCheck';
const FormCheck$1 = Object.assign(FormCheck, {
  Input: FormCheckInput,
  Label: FormCheckLabel
});

const React$H = await importShared('react');

const {useContext: useContext$d} = await importShared('react');
const FormControl = /* @__PURE__ */ React$H.forwardRef(({
  bsPrefix,
  type,
  size,
  htmlSize,
  id,
  className,
  isValid = false,
  isInvalid = false,
  plaintext,
  readOnly,
  // Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
  as: Component = "input",
  ...props
}, ref) => {
  const {
    controlId
  } = useContext$d(FormContext);
  bsPrefix = useBootstrapPrefix(bsPrefix, "form-control");
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Component, {
    ...props,
    type,
    size: htmlSize,
    ref,
    readOnly,
    id: id || controlId,
    className: classNames(className, plaintext ? `${bsPrefix}-plaintext` : bsPrefix, size && `${bsPrefix}-${size}`, type === "color" && `${bsPrefix}-color`, isValid && "is-valid", isInvalid && "is-invalid")
  });
});
FormControl.displayName = "FormControl";
const FormControl$1 = Object.assign(FormControl, {
  Feedback
});

const React$G = await importShared('react');
const FormFloating = /*#__PURE__*/React$G.forwardRef(({
  className,
  bsPrefix,
  as: Component = 'div',
  ...props
}, ref) => {
  bsPrefix = useBootstrapPrefix(bsPrefix, 'form-floating');
  return /*#__PURE__*/jsxRuntimeExports.jsx(Component, {
    ref: ref,
    className: classNames(className, bsPrefix),
    ...props
  });
});
FormFloating.displayName = 'FormFloating';

const React$F = await importShared('react');

const {useMemo: useMemo$6} = await importShared('react');
const FormGroup = /*#__PURE__*/React$F.forwardRef(({
  controlId,
  // Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
  as: Component = 'div',
  ...props
}, ref) => {
  const context = useMemo$6(() => ({
    controlId
  }), [controlId]);
  return /*#__PURE__*/jsxRuntimeExports.jsx(FormContext.Provider, {
    value: context,
    children: /*#__PURE__*/jsxRuntimeExports.jsx(Component, {
      ...props,
      ref: ref
    })
  });
});
FormGroup.displayName = 'FormGroup';

const React$E = await importShared('react');

const {useContext: useContext$c} = await importShared('react');
const FormLabel = /* @__PURE__ */ React$E.forwardRef(({
  // Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
  as: Component = "label",
  bsPrefix,
  column = false,
  visuallyHidden = false,
  className,
  htmlFor,
  ...props
}, ref) => {
  const {
    controlId
  } = useContext$c(FormContext);
  bsPrefix = useBootstrapPrefix(bsPrefix, "form-label");
  let columnClass = "col-form-label";
  if (typeof column === "string") columnClass = `${columnClass} ${columnClass}-${column}`;
  const classes = classNames(className, bsPrefix, visuallyHidden && "visually-hidden", column && columnClass);
  htmlFor = htmlFor || controlId;
  if (column) return /* @__PURE__ */ jsxRuntimeExports.jsx(Col, {
    ref,
    as: "label",
    className: classes,
    htmlFor,
    ...props
  });
  return (
    // eslint-disable-next-line jsx-a11y/label-has-for, jsx-a11y/label-has-associated-control
    /* @__PURE__ */ jsxRuntimeExports.jsx(Component, {
      ref,
      className: classes,
      htmlFor,
      ...props
    })
  );
});
FormLabel.displayName = "FormLabel";

const React$D = await importShared('react');

const {useContext: useContext$b} = await importShared('react');
const FormRange = /*#__PURE__*/React$D.forwardRef(({
  bsPrefix,
  className,
  id,
  ...props
}, ref) => {
  const {
    controlId
  } = useContext$b(FormContext);
  bsPrefix = useBootstrapPrefix(bsPrefix, 'form-range');
  return /*#__PURE__*/jsxRuntimeExports.jsx("input", {
    ...props,
    type: "range",
    ref: ref,
    className: classNames(className, bsPrefix),
    id: id || controlId
  });
});
FormRange.displayName = 'FormRange';

const React$C = await importShared('react');

const {useContext: useContext$a} = await importShared('react');
const FormSelect = /*#__PURE__*/React$C.forwardRef(({
  bsPrefix,
  size,
  htmlSize,
  className,
  isValid = false,
  isInvalid = false,
  id,
  ...props
}, ref) => {
  const {
    controlId
  } = useContext$a(FormContext);
  bsPrefix = useBootstrapPrefix(bsPrefix, 'form-select');
  return /*#__PURE__*/jsxRuntimeExports.jsx("select", {
    ...props,
    size: htmlSize,
    ref: ref,
    className: classNames(className, bsPrefix, size && `${bsPrefix}-${size}`, isValid && `is-valid`, isInvalid && `is-invalid`),
    id: id || controlId
  });
});
FormSelect.displayName = 'FormSelect';

const React$B = await importShared('react');
const FormText = /*#__PURE__*/React$B.forwardRef(
// Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
({
  bsPrefix,
  className,
  as: Component = 'small',
  muted,
  ...props
}, ref) => {
  bsPrefix = useBootstrapPrefix(bsPrefix, 'form-text');
  return /*#__PURE__*/jsxRuntimeExports.jsx(Component, {
    ...props,
    ref: ref,
    className: classNames(className, bsPrefix, muted && 'text-muted')
  });
});
FormText.displayName = 'FormText';

const React$A = await importShared('react');
const Switch = /*#__PURE__*/React$A.forwardRef((props, ref) => /*#__PURE__*/jsxRuntimeExports.jsx(FormCheck$1, {
  ...props,
  ref: ref,
  type: "switch"
}));
Switch.displayName = 'Switch';
const Switch$1 = Object.assign(Switch, {
  Input: FormCheck$1.Input,
  Label: FormCheck$1.Label
});

const React$z = await importShared('react');
const FloatingLabel = /*#__PURE__*/React$z.forwardRef(({
  bsPrefix,
  className,
  children,
  controlId,
  label,
  ...props
}, ref) => {
  bsPrefix = useBootstrapPrefix(bsPrefix, 'form-floating');
  return /*#__PURE__*/jsxRuntimeExports.jsxs(FormGroup, {
    ref: ref,
    className: classNames(className, bsPrefix),
    controlId: controlId,
    ...props,
    children: [children, /*#__PURE__*/jsxRuntimeExports.jsx("label", {
      htmlFor: controlId,
      children: label
    })]
  });
});
FloatingLabel.displayName = 'FloatingLabel';

const React$y = await importShared('react');
const propTypes = {
  /**
   * The Form `ref` will be forwarded to the underlying element,
   * which means, unless it's rendered `as` a composite component,
   * it will be a DOM node, when resolved.
   *
   * @type {ReactRef}
   * @alias ref
   */
  _ref: PropTypes.any,
  /**
   * Mark a form as having been validated. Setting it to `true` will
   * toggle any validation styles on the forms elements.
   */
  validated: PropTypes.bool,
  as: PropTypes.elementType
};
const Form = /*#__PURE__*/React$y.forwardRef(({
  className,
  validated,
  // Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
  as: Component = 'form',
  ...props
}, ref) => /*#__PURE__*/jsxRuntimeExports.jsx(Component, {
  ...props,
  ref: ref,
  className: classNames(className, validated && 'was-validated')
}));
Form.displayName = 'Form';
Form.propTypes = propTypes;
const Form$1 = Object.assign(Form, {
  Group: FormGroup,
  Control: FormControl$1,
  Floating: FormFloating,
  Check: FormCheck$1,
  Switch: Switch$1,
  Label: FormLabel,
  Text: FormText,
  Range: FormRange,
  Select: FormSelect,
  FloatingLabel
});

const React$x = await importShared('react');
const InputGroupText = /*#__PURE__*/React$x.forwardRef(({
  className,
  bsPrefix,
  as: Component = 'span',
  ...props
}, ref) => {
  bsPrefix = useBootstrapPrefix(bsPrefix, 'input-group-text');
  return /*#__PURE__*/jsxRuntimeExports.jsx(Component, {
    ref: ref,
    className: classNames(className, bsPrefix),
    ...props
  });
});
InputGroupText.displayName = 'InputGroupText';

const React$w = await importShared('react');

const {useMemo: useMemo$5} = await importShared('react');
const InputGroupCheckbox = props => /*#__PURE__*/jsxRuntimeExports.jsx(InputGroupText, {
  children: /*#__PURE__*/jsxRuntimeExports.jsx(FormCheckInput, {
    type: "checkbox",
    ...props
  })
});
const InputGroupRadio = props => /*#__PURE__*/jsxRuntimeExports.jsx(InputGroupText, {
  children: /*#__PURE__*/jsxRuntimeExports.jsx(FormCheckInput, {
    type: "radio",
    ...props
  })
});
const InputGroup = /*#__PURE__*/React$w.forwardRef(({
  bsPrefix,
  size,
  hasValidation,
  className,
  // Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
  as: Component = 'div',
  ...props
}, ref) => {
  bsPrefix = useBootstrapPrefix(bsPrefix, 'input-group');

  // Intentionally an empty object. Used in detecting if a dropdown
  // exists under an input group.
  const contextValue = useMemo$5(() => ({}), []);
  return /*#__PURE__*/jsxRuntimeExports.jsx(context$1.Provider, {
    value: contextValue,
    children: /*#__PURE__*/jsxRuntimeExports.jsx(Component, {
      ref: ref,
      ...props,
      className: classNames(className, bsPrefix, size && `${bsPrefix}-${size}`, hasValidation && 'has-validation')
    })
  });
});
InputGroup.displayName = 'InputGroup';
const InputGroup$1 = Object.assign(InputGroup, {
  Text: InputGroupText,
  Radio: InputGroupRadio,
  Checkbox: InputGroupCheckbox
});

const {useMemo: useMemo$4} = await importShared('react');

const toFnRef = ref => !ref || typeof ref === 'function' ? ref : value => {
  ref.current = value;
};
function mergeRefs(refA, refB) {
  const a = toFnRef(refA);
  const b = toFnRef(refB);
  return value => {
    if (a) a(value);
    if (b) b(value);
  };
}

/**
 * Create and returns a single callback ref composed from two other Refs.
 *
 * ```tsx
 * const Button = React.forwardRef((props, ref) => {
 *   const [element, attachRef] = useCallbackRef<HTMLButtonElement>();
 *   const mergedRef = useMergedRefs(ref, attachRef);
 *
 *   return <button ref={mergedRef} {...props}/>
 * })
 * ```
 *
 * @param refA A Callback or mutable Ref
 * @param refB A Callback or mutable Ref
 * @category refs
 */
function useMergedRefs(refA, refB) {
  return useMemo$4(() => mergeRefs(refA, refB), [refA, refB]);
}

const React$v = await importShared('react');

const TabContext = /*#__PURE__*/React$v.createContext(null);

const _excluded$4 = ["as", "active", "eventKey"];
function _objectWithoutPropertiesLoose$4(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (e.indexOf(n) >= 0) continue; t[n] = r[n]; } return t; }
const React$u = await importShared('react');

const {useContext: useContext$9} = await importShared('react');
function useNavItem({
  key,
  onClick,
  active,
  id,
  role,
  disabled
}) {
  const parentOnSelect = useContext$9(SelectableContext);
  const navContext = useContext$9(NavContext);
  const tabContext = useContext$9(TabContext);
  let isActive = active;
  const props = {
    role
  };
  if (navContext) {
    if (!role && navContext.role === 'tablist') props.role = 'tab';
    const contextControllerId = navContext.getControllerId(key != null ? key : null);
    const contextControlledId = navContext.getControlledId(key != null ? key : null);

    // @ts-ignore
    props[dataAttr('event-key')] = key;
    props.id = contextControllerId || id;
    isActive = active == null && key != null ? navContext.activeKey === key : active;

    /**
     * Simplified scenario for `mountOnEnter`.
     *
     * While it would make sense to keep 'aria-controls' for tabs that have been mounted at least
     * once, it would also complicate the code quite a bit, for very little gain.
     * The following implementation is probably good enough.
     *
     * @see https://github.com/react-restart/ui/pull/40#issuecomment-1009971561
     */
    if (isActive || !(tabContext != null && tabContext.unmountOnExit) && !(tabContext != null && tabContext.mountOnEnter)) props['aria-controls'] = contextControlledId;
  }
  if (props.role === 'tab') {
    props['aria-selected'] = isActive;
    if (!isActive) {
      props.tabIndex = -1;
    }
    if (disabled) {
      props.tabIndex = -1;
      props['aria-disabled'] = true;
    }
  }
  props.onClick = useEventCallback(e => {
    if (disabled) return;
    onClick == null ? undefined : onClick(e);
    if (key == null) {
      return;
    }
    if (parentOnSelect && !e.isPropagationStopped()) {
      parentOnSelect(key, e);
    }
  });
  return [props, {
    isActive
  }];
}
const NavItem$1 = /*#__PURE__*/React$u.forwardRef((_ref, ref) => {
  let {
      as: Component = Button$1,
      active,
      eventKey
    } = _ref,
    options = _objectWithoutPropertiesLoose$4(_ref, _excluded$4);
  const [props, meta] = useNavItem(Object.assign({
    key: makeEventKey(eventKey, options.href),
    active
  }, options));

  // @ts-ignore
  props[dataAttr('active')] = meta.isActive;
  return /*#__PURE__*/jsxRuntimeExports.jsx(Component, Object.assign({}, options, props, {
    ref: ref
  }));
});
NavItem$1.displayName = 'NavItem';

const _excluded$3 = ["as", "onSelect", "activeKey", "role", "onKeyDown"];
function _objectWithoutPropertiesLoose$3(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (e.indexOf(n) >= 0) continue; t[n] = r[n]; } return t; }
const React$t = await importShared('react');

const {useContext: useContext$8,useEffect: useEffect$b,useRef: useRef$9} = await importShared('react');
// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};
const EVENT_KEY_ATTR = dataAttr('event-key');
const Nav$2 = /*#__PURE__*/React$t.forwardRef((_ref, ref) => {
  let {
      // Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
      as: Component = 'div',
      onSelect,
      activeKey,
      role,
      onKeyDown
    } = _ref,
    props = _objectWithoutPropertiesLoose$3(_ref, _excluded$3);
  // A ref and forceUpdate for refocus, b/c we only want to trigger when needed
  // and don't want to reset the set in the effect
  const forceUpdate = useForceUpdate();
  const needsRefocusRef = useRef$9(false);
  const parentOnSelect = useContext$8(SelectableContext);
  const tabContext = useContext$8(TabContext);
  let getControlledId, getControllerId;
  if (tabContext) {
    role = role || 'tablist';
    activeKey = tabContext.activeKey;
    // TODO: do we need to duplicate these?
    getControlledId = tabContext.getControlledId;
    getControllerId = tabContext.getControllerId;
  }
  const listNode = useRef$9(null);
  const getNextActiveTab = offset => {
    const currentListNode = listNode.current;
    if (!currentListNode) return null;
    const items = qsa(currentListNode, `[${EVENT_KEY_ATTR}]:not([aria-disabled=true])`);
    const activeChild = currentListNode.querySelector('[aria-selected=true]');
    if (!activeChild || activeChild !== document.activeElement) return null;
    const index = items.indexOf(activeChild);
    if (index === -1) return null;
    let nextIndex = index + offset;
    if (nextIndex >= items.length) nextIndex = 0;
    if (nextIndex < 0) nextIndex = items.length - 1;
    return items[nextIndex];
  };
  const handleSelect = (key, event) => {
    if (key == null) return;
    onSelect == null ? undefined : onSelect(key, event);
    parentOnSelect == null ? undefined : parentOnSelect(key, event);
  };
  const handleKeyDown = event => {
    onKeyDown == null ? undefined : onKeyDown(event);
    if (!tabContext) {
      return;
    }
    let nextActiveChild;
    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        nextActiveChild = getNextActiveTab(-1);
        break;
      case 'ArrowRight':
      case 'ArrowDown':
        nextActiveChild = getNextActiveTab(1);
        break;
      default:
        return;
    }
    if (!nextActiveChild) return;
    event.preventDefault();
    handleSelect(nextActiveChild.dataset[dataProp('EventKey')] || null, event);
    needsRefocusRef.current = true;
    forceUpdate();
  };
  useEffect$b(() => {
    if (listNode.current && needsRefocusRef.current) {
      const activeChild = listNode.current.querySelector(`[${EVENT_KEY_ATTR}][aria-selected=true]`);
      activeChild == null ? undefined : activeChild.focus();
    }
    needsRefocusRef.current = false;
  });
  const mergedRef = useMergedRefs(ref, listNode);
  return /*#__PURE__*/jsxRuntimeExports.jsx(SelectableContext.Provider, {
    value: handleSelect,
    children: /*#__PURE__*/jsxRuntimeExports.jsx(NavContext.Provider, {
      value: {
        role,
        // used by NavLink to determine it's role
        activeKey: makeEventKey(activeKey),
        getControlledId: getControlledId || noop,
        getControllerId: getControllerId || noop
      },
      children: /*#__PURE__*/jsxRuntimeExports.jsx(Component, Object.assign({}, props, {
        onKeyDown: handleKeyDown,
        ref: mergedRef,
        role: role
      }))
    })
  });
});
Nav$2.displayName = 'Nav';
const BaseNav = Object.assign(Nav$2, {
  Item: NavItem$1
});

const React$s = await importShared('react');
const ListGroupItem = /* @__PURE__ */ React$s.forwardRef(({
  bsPrefix,
  active,
  disabled,
  eventKey,
  className,
  variant,
  action,
  as,
  ...props
}, ref) => {
  bsPrefix = useBootstrapPrefix(bsPrefix, "list-group-item");
  const [navItemProps, meta] = useNavItem({
    key: makeEventKey(eventKey, props.href),
    active,
    ...props
  });
  const handleClick = useEventCallback$1((event) => {
    if (disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    navItemProps.onClick(event);
  });
  if (disabled && props.tabIndex === undefined) {
    props.tabIndex = -1;
    props["aria-disabled"] = true;
  }
  const Component = as || (action ? props.href ? "a" : "button" : "div");
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Component, {
    ref,
    ...props,
    ...navItemProps,
    onClick: handleClick,
    className: classNames(className, bsPrefix, meta.isActive && "active", disabled && "disabled", variant && `${bsPrefix}-${variant}`, action && `${bsPrefix}-action`)
  });
});
ListGroupItem.displayName = "ListGroupItem";

const React$r = await importShared('react');
const ListGroup = /* @__PURE__ */ React$r.forwardRef((props, ref) => {
  const {
    className,
    bsPrefix: initialBsPrefix,
    variant,
    horizontal,
    numbered,
    // Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
    as = "div",
    ...controlledProps
  } = useUncontrolled(props, {
    activeKey: "onSelect"
  });
  const bsPrefix = useBootstrapPrefix(initialBsPrefix, "list-group");
  let horizontalVariant;
  if (horizontal) {
    horizontalVariant = horizontal === true ? "horizontal" : `horizontal-${horizontal}`;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(BaseNav, {
    ref,
    ...controlledProps,
    as,
    className: classNames(className, bsPrefix, variant && `${bsPrefix}-${variant}`, horizontalVariant && `${bsPrefix}-${horizontalVariant}`, numbered && `${bsPrefix}-numbered`)
  });
});
ListGroup.displayName = "ListGroup";
const ListGroup$1 = Object.assign(ListGroup, {
  Item: ListGroupItem
});

var size;
function scrollbarSize(recalc) {
  if (!size && size !== 0 || recalc) {
    if (canUseDOM) {
      var scrollDiv = document.createElement('div');
      scrollDiv.style.position = 'absolute';
      scrollDiv.style.top = '-9999px';
      scrollDiv.style.width = '50px';
      scrollDiv.style.height = '50px';
      scrollDiv.style.overflow = 'scroll';
      document.body.appendChild(scrollDiv);
      size = scrollDiv.offsetWidth - scrollDiv.clientWidth;
      document.body.removeChild(scrollDiv);
    }
  }

  return size;
}

const {useState: useState$d} = await importShared('react');


/**
 * A convenience hook around `useState` designed to be paired with
 * the component [callback ref](https://reactjs.org/docs/refs-and-the-dom.html#callback-refs) api.
 * Callback refs are useful over `useRef()` when you need to respond to the ref being set
 * instead of lazily accessing it in an effect.
 *
 * ```ts
 * const [element, attachRef] = useCallbackRef<HTMLDivElement>()
 *
 * useEffect(() => {
 *   if (!element) return
 *
 *   const calendar = new FullCalendar.Calendar(element)
 *
 *   return () => {
 *     calendar.destroy()
 *   }
 * }, [element])
 *
 * return <div ref={attachRef} />
 * ```
 *
 * @category refs
 */
function useCallbackRef() {
  return useState$d(null);
}

/**
 * Returns the actively focused element safely.
 *
 * @param doc the document to check
 */

function activeElement(doc) {
  if (doc === undefined) {
    doc = ownerDocument();
  }

  // Support: IE 9 only
  // IE9 throws an "Unspecified error" accessing document.activeElement from an <iframe>
  try {
    var active = doc.activeElement; // IE11 returns a seemingly empty object in some cases when accessing
    // document.activeElement from an <iframe>

    if (!active || !active.nodeName) return null;
    return active;
  } catch (e) {
    /* ie throws if no active element */
    return doc.body;
  }
}

const {useRef: useRef$8} = await importShared('react');


/**
 * Returns a ref that is immediately updated with the new value
 *
 * @param value The Ref value
 * @category refs
 */
function useUpdatedRef(value) {
  const valueRef = useRef$8(value);
  valueRef.current = value;
  return valueRef;
}

const {useEffect: useEffect$a} = await importShared('react');


/**
 * Attach a callback that fires when a component unmounts
 *
 * @param fn Handler to run when the component unmounts
 * @deprecated Use `useMounted` and normal effects, this is not StrictMode safe
 * @category effects
 */
function useWillUnmount(fn) {
  const onUnmount = useUpdatedRef(fn);
  useEffect$a(() => () => onUnmount.current(), []);
}

/**
 * Get the width of the vertical window scrollbar if it's visible
 */
function getBodyScrollbarWidth(ownerDocument = document) {
  const window = ownerDocument.defaultView;
  return Math.abs(window.innerWidth - ownerDocument.documentElement.clientWidth);
}

const OPEN_DATA_ATTRIBUTE = dataAttr('modal-open');

/**
 * Manages a stack of Modals as well as ensuring
 * body scrolling is is disabled and padding accounted for
 */
class ModalManager {
  constructor({
    ownerDocument,
    handleContainerOverflow = true,
    isRTL = false
  } = {}) {
    this.handleContainerOverflow = handleContainerOverflow;
    this.isRTL = isRTL;
    this.modals = [];
    this.ownerDocument = ownerDocument;
  }
  getScrollbarWidth() {
    return getBodyScrollbarWidth(this.ownerDocument);
  }
  getElement() {
    return (this.ownerDocument || document).body;
  }
  setModalAttributes(_modal) {
    // For overriding
  }
  removeModalAttributes(_modal) {
    // For overriding
  }
  setContainerStyle(containerState) {
    const style$1 = {
      overflow: 'hidden'
    };

    // we are only interested in the actual `style` here
    // because we will override it
    const paddingProp = this.isRTL ? 'paddingLeft' : 'paddingRight';
    const container = this.getElement();
    containerState.style = {
      overflow: container.style.overflow,
      [paddingProp]: container.style[paddingProp]
    };
    if (containerState.scrollBarWidth) {
      // use computed style, here to get the real padding
      // to add our scrollbar width
      style$1[paddingProp] = `${parseInt(style(container, paddingProp) || '0', 10) + containerState.scrollBarWidth}px`;
    }
    container.setAttribute(OPEN_DATA_ATTRIBUTE, '');
    style(container, style$1);
  }
  reset() {
    [...this.modals].forEach(m => this.remove(m));
  }
  removeContainerStyle(containerState) {
    const container = this.getElement();
    container.removeAttribute(OPEN_DATA_ATTRIBUTE);
    Object.assign(container.style, containerState.style);
  }
  add(modal) {
    let modalIdx = this.modals.indexOf(modal);
    if (modalIdx !== -1) {
      return modalIdx;
    }
    modalIdx = this.modals.length;
    this.modals.push(modal);
    this.setModalAttributes(modal);
    if (modalIdx !== 0) {
      return modalIdx;
    }
    this.state = {
      scrollBarWidth: this.getScrollbarWidth(),
      style: {}
    };
    if (this.handleContainerOverflow) {
      this.setContainerStyle(this.state);
    }
    return modalIdx;
  }
  remove(modal) {
    const modalIdx = this.modals.indexOf(modal);
    if (modalIdx === -1) {
      return;
    }
    this.modals.splice(modalIdx, 1);

    // if that was the last modal in a container,
    // clean up the container
    if (!this.modals.length && this.handleContainerOverflow) {
      this.removeContainerStyle(this.state);
    }
    this.removeModalAttributes(modal);
  }
  isTopModal(modal) {
    return !!this.modals.length && this.modals[this.modals.length - 1] === modal;
  }
}

const {useState: useState$c,useEffect: useEffect$9} = await importShared('react');
const resolveContainerRef = (ref, document) => {
  if (!canUseDOM) return null;
  if (ref == null) return (document || ownerDocument()).body;
  if (typeof ref === 'function') ref = ref();
  if (ref && 'current' in ref) ref = ref.current;
  if (ref && ('nodeType' in ref || ref.getBoundingClientRect)) return ref;
  return null;
};
function useWaitForDOMRef(ref, onResolved) {
  const window = useWindow();
  const [resolvedRef, setRef] = useState$c(() => resolveContainerRef(ref, window == null ? undefined : window.document));
  if (!resolvedRef) {
    const earlyRef = resolveContainerRef(ref);
    if (earlyRef) setRef(earlyRef);
  }
  useEffect$9(() => {
  }, [onResolved, resolvedRef]);
  useEffect$9(() => {
    const nextRef = resolveContainerRef(ref);
    if (nextRef !== resolvedRef) {
      setRef(nextRef);
    }
  }, [ref, resolvedRef]);
  return resolvedRef;
}

const {cloneElement: cloneElement$2,useEffect: useEffect$8,useRef: useRef$7} = await importShared('react');

function NoopTransition({
  children,
  in: inProp,
  onExited,
  mountOnEnter,
  unmountOnExit
}) {
  const ref = useRef$7(null);
  const hasEnteredRef = useRef$7(inProp);
  const handleExited = useEventCallback(onExited);
  useEffect$8(() => {
    if (inProp) hasEnteredRef.current = true;else {
      handleExited(ref.current);
    }
  }, [inProp, handleExited]);
  const combinedRef = useMergedRefs(ref, children.ref);
  const child = /*#__PURE__*/cloneElement$2(children, {
    ref: combinedRef
  });
  if (inProp) return child;
  if (unmountOnExit) {
    return null;
  }
  if (!hasEnteredRef.current && mountOnEnter) {
    return null;
  }
  return child;
}

const _excluded$2 = ["onEnter", "onEntering", "onEntered", "onExit", "onExiting", "onExited", "addEndListener", "children"];
function _objectWithoutPropertiesLoose$2(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (e.indexOf(n) >= 0) continue; t[n] = r[n]; } return t; }
const {cloneElement: cloneElement$1,useCallback: useCallback$4,useRef: useRef$6} = await importShared('react');
/**
 * Normalizes RTG transition callbacks with nodeRef to better support
 * strict mode.
 *
 * @param props Transition props.
 * @returns Normalized transition props.
 */
function useRTGTransitionProps(_ref) {
  let {
      onEnter,
      onEntering,
      onEntered,
      onExit,
      onExiting,
      onExited,
      addEndListener,
      children
    } = _ref,
    props = _objectWithoutPropertiesLoose$2(_ref, _excluded$2);
  const nodeRef = useRef$6(null);
  const mergedRef = useMergedRefs(nodeRef, getChildRef(children));
  const normalize = callback => param => {
    if (callback && nodeRef.current) {
      callback(nodeRef.current, param);
    }
  };

  /* eslint-disable react-hooks/exhaustive-deps */
  const handleEnter = useCallback$4(normalize(onEnter), [onEnter]);
  const handleEntering = useCallback$4(normalize(onEntering), [onEntering]);
  const handleEntered = useCallback$4(normalize(onEntered), [onEntered]);
  const handleExit = useCallback$4(normalize(onExit), [onExit]);
  const handleExiting = useCallback$4(normalize(onExiting), [onExiting]);
  const handleExited = useCallback$4(normalize(onExited), [onExited]);
  const handleAddEndListener = useCallback$4(normalize(addEndListener), [addEndListener]);
  /* eslint-enable react-hooks/exhaustive-deps */

  return Object.assign({}, props, {
    nodeRef
  }, onEnter && {
    onEnter: handleEnter
  }, onEntering && {
    onEntering: handleEntering
  }, onEntered && {
    onEntered: handleEntered
  }, onExit && {
    onExit: handleExit
  }, onExiting && {
    onExiting: handleExiting
  }, onExited && {
    onExited: handleExited
  }, addEndListener && {
    addEndListener: handleAddEndListener
  }, {
    children: typeof children === 'function' ? (status, innerProps) =>
    // TODO: Types for RTG missing innerProps, so need to cast.
    children(status, Object.assign({}, innerProps, {
      ref: mergedRef
    })) : /*#__PURE__*/cloneElement$1(children, {
      ref: mergedRef
    })
  });
}

const _excluded$1 = ["component"];
function _objectWithoutPropertiesLoose$1(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (e.indexOf(n) >= 0) continue; t[n] = r[n]; } return t; }
const React$q = await importShared('react');
// Normalizes Transition callbacks when nodeRef is used.
const RTGTransition = /*#__PURE__*/React$q.forwardRef((_ref, ref) => {
  let {
      component: Component
    } = _ref,
    props = _objectWithoutPropertiesLoose$1(_ref, _excluded$1);
  const transitionProps = useRTGTransitionProps(props);
  return /*#__PURE__*/jsxRuntimeExports.jsx(Component, Object.assign({
    ref: ref
  }, transitionProps));
});

const React$p = await importShared('react');
const {useRef: useRef$5,cloneElement,useState: useState$b} = React$p;
function useTransition({
  in: inProp,
  onTransition
}) {
  const ref = useRef$5(null);
  const isInitialRef = useRef$5(true);
  const handleTransition = useEventCallback(onTransition);
  useIsomorphicEffect$1(() => {
    if (!ref.current) {
      return undefined;
    }
    let stale = false;
    handleTransition({
      in: inProp,
      element: ref.current,
      initial: isInitialRef.current,
      isStale: () => stale
    });
    return () => {
      stale = true;
    };
  }, [inProp, handleTransition]);
  useIsomorphicEffect$1(() => {
    isInitialRef.current = false;
    // this is for strict mode
    return () => {
      isInitialRef.current = true;
    };
  }, []);
  return ref;
}
/**
 * Adapts an imperative transition function to a subset of the RTG `<Transition>` component API.
 *
 * ImperativeTransition does not support mounting options or `appear` at the moment, meaning
 * that it always acts like: `mountOnEnter={true} unmountOnExit={true} appear={true}`
 */
function ImperativeTransition({
  children,
  in: inProp,
  onExited,
  onEntered,
  transition
}) {
  const [exited, setExited] = useState$b(!inProp);

  // TODO: I think this needs to be in an effect
  if (inProp && exited) {
    setExited(false);
  }
  const ref = useTransition({
    in: !!inProp,
    onTransition: options => {
      const onFinish = () => {
        if (options.isStale()) return;
        if (options.in) {
          onEntered == null ? undefined : onEntered(options.element, options.initial);
        } else {
          setExited(true);
          onExited == null ? undefined : onExited(options.element);
        }
      };
      Promise.resolve(transition(options)).then(onFinish, error => {
        if (!options.in) setExited(true);
        throw error;
      });
    }
  });
  const combinedRef = useMergedRefs(ref, children.ref);
  return exited && !inProp ? null : /*#__PURE__*/cloneElement(children, {
    ref: combinedRef
  });
}
function renderTransition(component, runTransition, props) {
  if (component) {
    return /*#__PURE__*/jsxRuntimeExports.jsx(RTGTransition, Object.assign({}, props, {
      component: component
    }));
  }
  if (runTransition) {
    return /*#__PURE__*/jsxRuntimeExports.jsx(ImperativeTransition, Object.assign({}, props, {
      transition: runTransition
    }));
  }
  return /*#__PURE__*/jsxRuntimeExports.jsx(NoopTransition, Object.assign({}, props));
}

const _excluded = ["show", "role", "className", "style", "children", "backdrop", "keyboard", "onBackdropClick", "onEscapeKeyDown", "transition", "runTransition", "backdropTransition", "runBackdropTransition", "autoFocus", "enforceFocus", "restoreFocus", "restoreFocusOptions", "renderDialog", "renderBackdrop", "manager", "container", "onShow", "onHide", "onExit", "onExited", "onExiting", "onEnter", "onEntering", "onEntered"];
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (e.indexOf(n) >= 0) continue; t[n] = r[n]; } return t; }
const {useState: useState$a,useRef: useRef$4,useCallback: useCallback$3,useImperativeHandle,forwardRef,useEffect: useEffect$7} = await importShared('react');

const React$o = await importShared('react');

const ReactDOM = await importShared('react-dom');
let manager;

/*
  Modal props are split into a version with and without index signature so that you can fully use them in another projects
  This is due to Typescript not playing well with index signatures e.g. when using Omit
*/

function getManager(window) {
  if (!manager) manager = new ModalManager({
    ownerDocument: window == null ? undefined : window.document
  });
  return manager;
}
function useModalManager(provided) {
  const window = useWindow();
  const modalManager = provided || getManager(window);
  const modal = useRef$4({
    dialog: null,
    backdrop: null
  });
  return Object.assign(modal.current, {
    add: () => modalManager.add(modal.current),
    remove: () => modalManager.remove(modal.current),
    isTopModal: () => modalManager.isTopModal(modal.current),
    setDialogRef: useCallback$3(ref => {
      modal.current.dialog = ref;
    }, []),
    setBackdropRef: useCallback$3(ref => {
      modal.current.backdrop = ref;
    }, [])
  });
}
const Modal$2 = /*#__PURE__*/forwardRef((_ref, ref) => {
  let {
      show = false,
      role = 'dialog',
      className,
      style,
      children,
      backdrop = true,
      keyboard = true,
      onBackdropClick,
      onEscapeKeyDown,
      transition,
      runTransition,
      backdropTransition,
      runBackdropTransition,
      autoFocus = true,
      enforceFocus = true,
      restoreFocus = true,
      restoreFocusOptions,
      renderDialog,
      renderBackdrop = props => /*#__PURE__*/jsxRuntimeExports.jsx("div", Object.assign({}, props)),
      manager: providedManager,
      container: containerRef,
      onShow,
      onHide = () => {},
      onExit,
      onExited,
      onExiting,
      onEnter,
      onEntering,
      onEntered
    } = _ref,
    rest = _objectWithoutPropertiesLoose(_ref, _excluded);
  const ownerWindow = useWindow();
  const container = useWaitForDOMRef(containerRef);
  const modal = useModalManager(providedManager);
  const isMounted = useMounted$1();
  const prevShow = usePrevious(show);
  const [exited, setExited] = useState$a(!show);
  const lastFocusRef = useRef$4(null);
  useImperativeHandle(ref, () => modal, [modal]);
  if (canUseDOM && !prevShow && show) {
    lastFocusRef.current = activeElement(ownerWindow == null ? undefined : ownerWindow.document);
  }

  // TODO: I think this needs to be in an effect
  if (show && exited) {
    setExited(false);
  }
  const handleShow = useEventCallback(() => {
    modal.add();
    removeKeydownListenerRef.current = listen(document, 'keydown', handleDocumentKeyDown);
    removeFocusListenerRef.current = listen(document, 'focus',
    // the timeout is necessary b/c this will run before the new modal is mounted
    // and so steals focus from it
    () => setTimeout(handleEnforceFocus), true);
    if (onShow) {
      onShow();
    }

    // autofocus after onShow to not trigger a focus event for previous
    // modals before this one is shown.
    if (autoFocus) {
      var _modal$dialog$ownerDo, _modal$dialog;
      const currentActiveElement = activeElement((_modal$dialog$ownerDo = (_modal$dialog = modal.dialog) == null ? undefined : _modal$dialog.ownerDocument) != null ? _modal$dialog$ownerDo : ownerWindow == null ? undefined : ownerWindow.document);
      if (modal.dialog && currentActiveElement && !contains(modal.dialog, currentActiveElement)) {
        lastFocusRef.current = currentActiveElement;
        modal.dialog.focus();
      }
    }
  });
  const handleHide = useEventCallback(() => {
    modal.remove();
    removeKeydownListenerRef.current == null ? undefined : removeKeydownListenerRef.current();
    removeFocusListenerRef.current == null ? undefined : removeFocusListenerRef.current();
    if (restoreFocus) {
      var _lastFocusRef$current;
      // Support: <=IE11 doesn't support `focus()` on svg elements (RB: #917)
      (_lastFocusRef$current = lastFocusRef.current) == null ? undefined : _lastFocusRef$current.focus == null ? undefined : _lastFocusRef$current.focus(restoreFocusOptions);
      lastFocusRef.current = null;
    }
  });

  // TODO: try and combine these effects: https://github.com/react-bootstrap/react-overlays/pull/794#discussion_r409954120

  // Show logic when:
  //  - show is `true` _and_ `container` has resolved
  useEffect$7(() => {
    if (!show || !container) return;
    handleShow();
  }, [show, container, /* should never change: */handleShow]);

  // Hide cleanup logic when:
  //  - `exited` switches to true
  //  - component unmounts;
  useEffect$7(() => {
    if (!exited) return;
    handleHide();
  }, [exited, handleHide]);
  useWillUnmount(() => {
    handleHide();
  });

  // --------------------------------

  const handleEnforceFocus = useEventCallback(() => {
    if (!enforceFocus || !isMounted() || !modal.isTopModal()) {
      return;
    }
    const currentActiveElement = activeElement(ownerWindow == null ? undefined : ownerWindow.document);
    if (modal.dialog && currentActiveElement && !contains(modal.dialog, currentActiveElement)) {
      modal.dialog.focus();
    }
  });
  const handleBackdropClick = useEventCallback(e => {
    if (e.target !== e.currentTarget) {
      return;
    }
    onBackdropClick == null ? undefined : onBackdropClick(e);
    if (backdrop === true) {
      onHide();
    }
  });
  const handleDocumentKeyDown = useEventCallback(e => {
    if (keyboard && isEscKey(e) && modal.isTopModal()) {
      onEscapeKeyDown == null ? undefined : onEscapeKeyDown(e);
      if (!e.defaultPrevented) {
        onHide();
      }
    }
  });
  const removeFocusListenerRef = useRef$4();
  const removeKeydownListenerRef = useRef$4();
  const handleHidden = (...args) => {
    setExited(true);
    onExited == null ? undefined : onExited(...args);
  };
  if (!container) {
    return null;
  }
  const dialogProps = Object.assign({
    role,
    ref: modal.setDialogRef,
    // apparently only works on the dialog role element
    'aria-modal': role === 'dialog' ? true : undefined
  }, rest, {
    style,
    className,
    tabIndex: -1
  });
  let dialog = renderDialog ? renderDialog(dialogProps) : /*#__PURE__*/jsxRuntimeExports.jsx("div", Object.assign({}, dialogProps, {
    children: /*#__PURE__*/React$o.cloneElement(children, {
      role: 'document'
    })
  }));
  dialog = renderTransition(transition, runTransition, {
    unmountOnExit: true,
    mountOnEnter: true,
    appear: true,
    in: !!show,
    onExit,
    onExiting,
    onExited: handleHidden,
    onEnter,
    onEntering,
    onEntered,
    children: dialog
  });
  let backdropElement = null;
  if (backdrop) {
    backdropElement = renderBackdrop({
      ref: modal.setBackdropRef,
      onClick: handleBackdropClick
    });
    backdropElement = renderTransition(backdropTransition, runBackdropTransition, {
      in: !!show,
      appear: true,
      mountOnEnter: true,
      unmountOnExit: true,
      children: backdropElement
    });
  }
  return /*#__PURE__*/jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, {
    children: /*#__PURE__*/ReactDOM.createPortal( /*#__PURE__*/jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, {
      children: [backdropElement, dialog]
    }), container)
  });
});
Modal$2.displayName = 'Modal';
const BaseModal = Object.assign(Modal$2, {
  Manager: ModalManager
});

/**
 * Checks if a given element has a CSS class.
 * 
 * @param element the element
 * @param className the CSS class name
 */
function hasClass(element, className) {
  if (element.classList) return element.classList.contains(className);
  return (" " + (element.className.baseVal || element.className) + " ").indexOf(" " + className + " ") !== -1;
}

/**
 * Adds a CSS class to a given element.
 * 
 * @param element the element
 * @param className the CSS class name
 */

function addClass(element, className) {
  if (element.classList) element.classList.add(className);else if (!hasClass(element, className)) if (typeof element.className === 'string') element.className = element.className + " " + className;else element.setAttribute('class', (element.className && element.className.baseVal || '') + " " + className);
}

function replaceClassName(origClass, classToRemove) {
  return origClass.replace(new RegExp("(^|\\s)" + classToRemove + "(?:\\s|$)", 'g'), '$1').replace(/\s+/g, ' ').replace(/^\s*|\s*$/g, '');
}
/**
 * Removes a CSS class from a given element.
 * 
 * @param element the element
 * @param className the CSS class name
 */


function removeClass(element, className) {
  if (element.classList) {
    element.classList.remove(className);
  } else if (typeof element.className === 'string') {
    element.className = replaceClassName(element.className, className);
  } else {
    element.setAttribute('class', replaceClassName(element.className && element.className.baseVal || '', className));
  }
}

const Selector = {
  FIXED_CONTENT: '.fixed-top, .fixed-bottom, .is-fixed, .sticky-top',
  STICKY_CONTENT: '.sticky-top',
  NAVBAR_TOGGLER: '.navbar-toggler'
};
class BootstrapModalManager extends ModalManager {
  adjustAndStore(prop, element, adjust) {
    const actual = element.style[prop];
    // TODO: DOMStringMap and CSSStyleDeclaration aren't strictly compatible
    // @ts-ignore
    element.dataset[prop] = actual;
    style(element, {
      [prop]: `${parseFloat(style(element, prop)) + adjust}px`
    });
  }
  restore(prop, element) {
    const value = element.dataset[prop];
    if (value !== undefined) {
      delete element.dataset[prop];
      style(element, {
        [prop]: value
      });
    }
  }
  setContainerStyle(containerState) {
    super.setContainerStyle(containerState);
    const container = this.getElement();
    addClass(container, 'modal-open');
    if (!containerState.scrollBarWidth) return;
    const paddingProp = this.isRTL ? 'paddingLeft' : 'paddingRight';
    const marginProp = this.isRTL ? 'marginLeft' : 'marginRight';
    qsa(container, Selector.FIXED_CONTENT).forEach(el => this.adjustAndStore(paddingProp, el, containerState.scrollBarWidth));
    qsa(container, Selector.STICKY_CONTENT).forEach(el => this.adjustAndStore(marginProp, el, -containerState.scrollBarWidth));
    qsa(container, Selector.NAVBAR_TOGGLER).forEach(el => this.adjustAndStore(marginProp, el, containerState.scrollBarWidth));
  }
  removeContainerStyle(containerState) {
    super.removeContainerStyle(containerState);
    const container = this.getElement();
    removeClass(container, 'modal-open');
    const paddingProp = this.isRTL ? 'paddingLeft' : 'paddingRight';
    const marginProp = this.isRTL ? 'marginLeft' : 'marginRight';
    qsa(container, Selector.FIXED_CONTENT).forEach(el => this.restore(paddingProp, el));
    qsa(container, Selector.STICKY_CONTENT).forEach(el => this.restore(marginProp, el));
    qsa(container, Selector.NAVBAR_TOGGLER).forEach(el => this.restore(marginProp, el));
  }
}
let sharedManager;
function getSharedManager(options) {
  if (!sharedManager) sharedManager = new BootstrapModalManager(options);
  return sharedManager;
}

const React$n = await importShared('react');
const ModalBody = /*#__PURE__*/React$n.forwardRef(({
  className,
  bsPrefix,
  as: Component = 'div',
  ...props
}, ref) => {
  bsPrefix = useBootstrapPrefix(bsPrefix, 'modal-body');
  return /*#__PURE__*/jsxRuntimeExports.jsx(Component, {
    ref: ref,
    className: classNames(className, bsPrefix),
    ...props
  });
});
ModalBody.displayName = 'ModalBody';

const React$m = await importShared('react');

const ModalContext = /*#__PURE__*/React$m.createContext({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onHide() {}
});

const React$l = await importShared('react');
const ModalDialog = /*#__PURE__*/React$l.forwardRef(({
  bsPrefix,
  className,
  contentClassName,
  centered,
  size,
  fullscreen,
  children,
  scrollable,
  ...props
}, ref) => {
  bsPrefix = useBootstrapPrefix(bsPrefix, 'modal');
  const dialogClass = `${bsPrefix}-dialog`;
  const fullScreenClass = typeof fullscreen === 'string' ? `${bsPrefix}-fullscreen-${fullscreen}` : `${bsPrefix}-fullscreen`;
  return /*#__PURE__*/jsxRuntimeExports.jsx("div", {
    ...props,
    ref: ref,
    className: classNames(dialogClass, className, size && `${bsPrefix}-${size}`, centered && `${dialogClass}-centered`, scrollable && `${dialogClass}-scrollable`, fullscreen && fullScreenClass),
    children: /*#__PURE__*/jsxRuntimeExports.jsx("div", {
      className: classNames(`${bsPrefix}-content`, contentClassName),
      children: children
    })
  });
});
ModalDialog.displayName = 'ModalDialog';

const React$k = await importShared('react');
const ModalFooter = /*#__PURE__*/React$k.forwardRef(({
  className,
  bsPrefix,
  as: Component = 'div',
  ...props
}, ref) => {
  bsPrefix = useBootstrapPrefix(bsPrefix, 'modal-footer');
  return /*#__PURE__*/jsxRuntimeExports.jsx(Component, {
    ref: ref,
    className: classNames(className, bsPrefix),
    ...props
  });
});
ModalFooter.displayName = 'ModalFooter';

const React$j = await importShared('react');

const {useContext: useContext$7} = await importShared('react');
const AbstractModalHeader = /*#__PURE__*/React$j.forwardRef(({
  closeLabel = 'Close',
  closeVariant,
  closeButton = false,
  onHide,
  children,
  ...props
}, ref) => {
  const context = useContext$7(ModalContext);
  const handleClick = useEventCallback$1(() => {
    context == null || context.onHide();
    onHide == null || onHide();
  });
  return /*#__PURE__*/jsxRuntimeExports.jsxs("div", {
    ref: ref,
    ...props,
    children: [children, closeButton && /*#__PURE__*/jsxRuntimeExports.jsx(CloseButton, {
      "aria-label": closeLabel,
      variant: closeVariant,
      onClick: handleClick
    })]
  });
});

const React$i = await importShared('react');
const ModalHeader = /*#__PURE__*/React$i.forwardRef(({
  bsPrefix,
  className,
  closeLabel = 'Close',
  closeButton = false,
  ...props
}, ref) => {
  bsPrefix = useBootstrapPrefix(bsPrefix, 'modal-header');
  return /*#__PURE__*/jsxRuntimeExports.jsx(AbstractModalHeader, {
    ref: ref,
    ...props,
    className: classNames(className, bsPrefix),
    closeLabel: closeLabel,
    closeButton: closeButton
  });
});
ModalHeader.displayName = 'ModalHeader';

const React$h = await importShared('react');
const DivStyledAsH4 = divWithClassName('h4');
const ModalTitle = /*#__PURE__*/React$h.forwardRef(({
  className,
  bsPrefix,
  as: Component = DivStyledAsH4,
  ...props
}, ref) => {
  bsPrefix = useBootstrapPrefix(bsPrefix, 'modal-title');
  return /*#__PURE__*/jsxRuntimeExports.jsx(Component, {
    ref: ref,
    className: classNames(className, bsPrefix),
    ...props
  });
});
ModalTitle.displayName = 'ModalTitle';

const React$g = await importShared('react');

const {useCallback: useCallback$2,useMemo: useMemo$3,useRef: useRef$3,useState: useState$9} = await importShared('react');
/* eslint-disable no-use-before-define, react/no-multi-comp */
function DialogTransition$1(props) {
  return /*#__PURE__*/jsxRuntimeExports.jsx(Fade, {
    ...props,
    timeout: null
  });
}
function BackdropTransition$1(props) {
  return /*#__PURE__*/jsxRuntimeExports.jsx(Fade, {
    ...props,
    timeout: null
  });
}

/* eslint-enable no-use-before-define */
const Modal = /*#__PURE__*/React$g.forwardRef(({
  bsPrefix,
  className,
  style,
  dialogClassName,
  contentClassName,
  children,
  dialogAs: Dialog = ModalDialog,
  'data-bs-theme': dataBsTheme,
  'aria-labelledby': ariaLabelledby,
  'aria-describedby': ariaDescribedby,
  'aria-label': ariaLabel,
  /* BaseModal props */

  show = false,
  animation = true,
  backdrop = true,
  keyboard = true,
  onEscapeKeyDown,
  onShow,
  onHide,
  container,
  autoFocus = true,
  enforceFocus = true,
  restoreFocus = true,
  restoreFocusOptions,
  onEntered,
  onExit,
  onExiting,
  onEnter,
  onEntering,
  onExited,
  backdropClassName,
  manager: propsManager,
  ...props
}, ref) => {
  const [modalStyle, setStyle] = useState$9({});
  const [animateStaticModal, setAnimateStaticModal] = useState$9(false);
  const waitingForMouseUpRef = useRef$3(false);
  const ignoreBackdropClickRef = useRef$3(false);
  const removeStaticModalAnimationRef = useRef$3(null);
  const [modal, setModalRef] = useCallbackRef();
  const mergedRef = useMergedRefs$1(ref, setModalRef);
  const handleHide = useEventCallback$1(onHide);
  const isRTL = useIsRTL();
  bsPrefix = useBootstrapPrefix(bsPrefix, 'modal');
  const modalContext = useMemo$3(() => ({
    onHide: handleHide
  }), [handleHide]);
  function getModalManager() {
    if (propsManager) return propsManager;
    return getSharedManager({
      isRTL
    });
  }
  function updateDialogStyle(node) {
    if (!canUseDOM) return;
    const containerIsOverflowing = getModalManager().getScrollbarWidth() > 0;
    const modalIsOverflowing = node.scrollHeight > ownerDocument(node).documentElement.clientHeight;
    setStyle({
      paddingRight: containerIsOverflowing && !modalIsOverflowing ? scrollbarSize() : undefined,
      paddingLeft: !containerIsOverflowing && modalIsOverflowing ? scrollbarSize() : undefined
    });
  }
  const handleWindowResize = useEventCallback$1(() => {
    if (modal) {
      updateDialogStyle(modal.dialog);
    }
  });
  useWillUnmount$1(() => {
    removeEventListener(window, 'resize', handleWindowResize);
    removeStaticModalAnimationRef.current == null || removeStaticModalAnimationRef.current();
  });

  // We prevent the modal from closing during a drag by detecting where the
  // click originates from. If it starts in the modal and then ends outside
  // don't close.
  const handleDialogMouseDown = () => {
    waitingForMouseUpRef.current = true;
  };
  const handleMouseUp = e => {
    if (waitingForMouseUpRef.current && modal && e.target === modal.dialog) {
      ignoreBackdropClickRef.current = true;
    }
    waitingForMouseUpRef.current = false;
  };
  const handleStaticModalAnimation = () => {
    setAnimateStaticModal(true);
    removeStaticModalAnimationRef.current = transitionEnd(modal.dialog, () => {
      setAnimateStaticModal(false);
    });
  };
  const handleStaticBackdropClick = e => {
    if (e.target !== e.currentTarget) {
      return;
    }
    handleStaticModalAnimation();
  };
  const handleClick = e => {
    if (backdrop === 'static') {
      handleStaticBackdropClick(e);
      return;
    }
    if (ignoreBackdropClickRef.current || e.target !== e.currentTarget) {
      ignoreBackdropClickRef.current = false;
      return;
    }
    onHide == null || onHide();
  };
  const handleEscapeKeyDown = e => {
    if (keyboard) {
      onEscapeKeyDown == null || onEscapeKeyDown(e);
    } else {
      // Call preventDefault to stop modal from closing in @restart/ui.
      e.preventDefault();
      if (backdrop === 'static') {
        // Play static modal animation.
        handleStaticModalAnimation();
      }
    }
  };
  const handleEnter = (node, isAppearing) => {
    if (node) {
      updateDialogStyle(node);
    }
    onEnter == null || onEnter(node, isAppearing);
  };
  const handleExit = node => {
    removeStaticModalAnimationRef.current == null || removeStaticModalAnimationRef.current();
    onExit == null || onExit(node);
  };
  const handleEntering = (node, isAppearing) => {
    onEntering == null || onEntering(node, isAppearing);

    // FIXME: This should work even when animation is disabled.
    addEventListener(window, 'resize', handleWindowResize);
  };
  const handleExited = node => {
    if (node) node.style.display = ''; // RHL removes it sometimes
    onExited == null || onExited(node);

    // FIXME: This should work even when animation is disabled.
    removeEventListener(window, 'resize', handleWindowResize);
  };
  const renderBackdrop = useCallback$2(backdropProps => /*#__PURE__*/jsxRuntimeExports.jsx("div", {
    ...backdropProps,
    className: classNames(`${bsPrefix}-backdrop`, backdropClassName, !animation && 'show')
  }), [animation, backdropClassName, bsPrefix]);
  const baseModalStyle = {
    ...style,
    ...modalStyle
  };

  // If `display` is not set to block, autoFocus inside the modal fails
  // https://github.com/react-bootstrap/react-bootstrap/issues/5102
  baseModalStyle.display = 'block';
  const renderDialog = dialogProps => /*#__PURE__*/jsxRuntimeExports.jsx("div", {
    role: "dialog",
    ...dialogProps,
    style: baseModalStyle,
    className: classNames(className, bsPrefix, animateStaticModal && `${bsPrefix}-static`, !animation && 'show'),
    onClick: backdrop ? handleClick : undefined,
    onMouseUp: handleMouseUp,
    "data-bs-theme": dataBsTheme,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledby,
    "aria-describedby": ariaDescribedby,
    children: /*#__PURE__*/jsxRuntimeExports.jsx(Dialog, {
      ...props,
      onMouseDown: handleDialogMouseDown,
      className: dialogClassName,
      contentClassName: contentClassName,
      children: children
    })
  });
  return /*#__PURE__*/jsxRuntimeExports.jsx(ModalContext.Provider, {
    value: modalContext,
    children: /*#__PURE__*/jsxRuntimeExports.jsx(BaseModal, {
      show: show,
      ref: mergedRef,
      backdrop: backdrop,
      container: container,
      keyboard: true // Always set true - see handleEscapeKeyDown
      ,
      autoFocus: autoFocus,
      enforceFocus: enforceFocus,
      restoreFocus: restoreFocus,
      restoreFocusOptions: restoreFocusOptions,
      onEscapeKeyDown: handleEscapeKeyDown,
      onShow: onShow,
      onHide: onHide,
      onEnter: handleEnter,
      onEntering: handleEntering,
      onEntered: onEntered,
      onExit: handleExit,
      onExiting: onExiting,
      onExited: handleExited,
      manager: getModalManager(),
      transition: animation ? DialogTransition$1 : undefined,
      backdropTransition: animation ? BackdropTransition$1 : undefined,
      renderBackdrop: renderBackdrop,
      renderDialog: renderDialog
    })
  });
});
Modal.displayName = 'Modal';
const Modal$1 = Object.assign(Modal, {
  Body: ModalBody,
  Header: ModalHeader,
  Title: ModalTitle,
  Footer: ModalFooter,
  Dialog: ModalDialog,
  TRANSITION_DURATION: 300,
  BACKDROP_TRANSITION_DURATION: 150
});

const React$f = await importShared('react');
const NavItem = /*#__PURE__*/React$f.forwardRef(({
  className,
  bsPrefix,
  as: Component = 'div',
  ...props
}, ref) => {
  bsPrefix = useBootstrapPrefix(bsPrefix, 'nav-item');
  return /*#__PURE__*/jsxRuntimeExports.jsx(Component, {
    ref: ref,
    className: classNames(className, bsPrefix),
    ...props
  });
});
NavItem.displayName = 'NavItem';

const React$e = await importShared('react');
const NavLink = /*#__PURE__*/React$e.forwardRef(({
  bsPrefix,
  className,
  as: Component = Anchor,
  active,
  eventKey,
  disabled = false,
  ...props
}, ref) => {
  bsPrefix = useBootstrapPrefix(bsPrefix, 'nav-link');
  const [navItemProps, meta] = useNavItem({
    key: makeEventKey(eventKey, props.href),
    active,
    disabled,
    ...props
  });
  return /*#__PURE__*/jsxRuntimeExports.jsx(Component, {
    ...props,
    ...navItemProps,
    ref: ref,
    disabled: disabled,
    className: classNames(className, bsPrefix, disabled && 'disabled', meta.isActive && 'active')
  });
});
NavLink.displayName = 'NavLink';

const React$d = await importShared('react');

const {useContext: useContext$6} = await importShared('react');
const Nav = /*#__PURE__*/React$d.forwardRef((uncontrolledProps, ref) => {
  const {
    as = 'div',
    bsPrefix: initialBsPrefix,
    variant,
    fill = false,
    justify = false,
    navbar,
    navbarScroll,
    className,
    activeKey,
    ...props
  } = useUncontrolled(uncontrolledProps, {
    activeKey: 'onSelect'
  });
  const bsPrefix = useBootstrapPrefix(initialBsPrefix, 'nav');
  let navbarBsPrefix;
  let cardHeaderBsPrefix;
  let isNavbar = false;
  const navbarContext = useContext$6(context);
  const cardHeaderContext = useContext$6(context$2);
  if (navbarContext) {
    navbarBsPrefix = navbarContext.bsPrefix;
    isNavbar = navbar == null ? true : navbar;
  } else if (cardHeaderContext) {
    ({
      cardHeaderBsPrefix
    } = cardHeaderContext);
  }
  return /*#__PURE__*/jsxRuntimeExports.jsx(BaseNav, {
    as: as,
    ref: ref,
    activeKey: activeKey,
    className: classNames(className, {
      [bsPrefix]: !isNavbar,
      [`${navbarBsPrefix}-nav`]: isNavbar,
      [`${navbarBsPrefix}-nav-scroll`]: isNavbar && navbarScroll,
      [`${cardHeaderBsPrefix}-${variant}`]: !!cardHeaderBsPrefix,
      [`${bsPrefix}-${variant}`]: !!variant,
      [`${bsPrefix}-fill`]: fill,
      [`${bsPrefix}-justified`]: justify
    }),
    ...props
  });
});
Nav.displayName = 'Nav';
const Nav$1 = Object.assign(Nav, {
  Item: NavItem,
  Link: NavLink
});

const {useState: useState$8} = await importShared('react');

const matchersByWindow = new WeakMap();
const getMatcher = (query, targetWindow) => {
  if (!query || !targetWindow) return undefined;
  const matchers = matchersByWindow.get(targetWindow) || new Map();
  matchersByWindow.set(targetWindow, matchers);
  let mql = matchers.get(query);
  if (!mql) {
    mql = targetWindow.matchMedia(query);
    mql.refCount = 0;
    matchers.set(mql.media, mql);
  }
  return mql;
};
/**
 * Match a media query and get updates as the match changes. The media string is
 * passed directly to `window.matchMedia` and run as a Layout Effect, so initial
 * matches are returned before the browser has a chance to paint.
 *
 * ```tsx
 * function Page() {
 *   const isWide = useMediaQuery('min-width: 1000px')
 *
 *   return isWide ? "very wide" : 'not so wide'
 * }
 * ```
 *
 * Media query lists are also reused globally, hook calls for the same query
 * will only create a matcher once under the hood.
 *
 * @param query A media query
 * @param targetWindow The window to match against, uses the globally available one as a default.
 */
function useMediaQuery(query, targetWindow = typeof window === 'undefined' ? undefined : window) {
  const mql = getMatcher(query, targetWindow);
  const [matches, setMatches] = useState$8(() => mql ? mql.matches : false);
  useIsomorphicEffect(() => {
    let mql = getMatcher(query, targetWindow);
    if (!mql) {
      return setMatches(false);
    }
    let matchers = matchersByWindow.get(targetWindow);
    const handleChange = () => {
      setMatches(mql.matches);
    };
    mql.refCount++;
    mql.addListener(handleChange);
    handleChange();
    return () => {
      mql.removeListener(handleChange);
      mql.refCount--;
      if (mql.refCount <= 0) {
        matchers == null ? undefined : matchers.delete(mql.media);
      }
      mql = undefined;
    };
  }, [query]);
  return matches;
}

const {useMemo: useMemo$2} = await importShared('react');

/**
 * Create a responsive hook we a set of breakpoint names and widths.
 * You can use any valid css units as well as a numbers (for pixels).
 *
 * **NOTE:** The object key order is important! it's assumed to be in order from smallest to largest
 *
 * ```ts
 * const useBreakpoint = createBreakpointHook({
 *  xs: 0,
 *  sm: 576,
 *  md: 768,
 *  lg: 992,
 *  xl: 1200,
 * })
 * ```
 *
 * **Watch out!** using string values will sometimes construct media queries using css `calc()` which
 * is NOT supported in media queries by all browsers at the moment. use numbers for
 * the widest range of browser support.
 *
 * @param breakpointValues A object hash of names to breakpoint dimensions
 */
function createBreakpointHook(breakpointValues) {
  const names = Object.keys(breakpointValues);
  function and(query, next) {
    if (query === next) {
      return next;
    }
    return query ? `${query} and ${next}` : next;
  }
  function getNext(breakpoint) {
    return names[Math.min(names.indexOf(breakpoint) + 1, names.length - 1)];
  }
  function getMaxQuery(breakpoint) {
    const next = getNext(breakpoint);
    let value = breakpointValues[next];
    if (typeof value === 'number') value = `${value - 0.2}px`;else value = `calc(${value} - 0.2px)`;
    return `(max-width: ${value})`;
  }
  function getMinQuery(breakpoint) {
    let value = breakpointValues[breakpoint];
    if (typeof value === 'number') {
      value = `${value}px`;
    }
    return `(min-width: ${value})`;
  }

  /**
   * Match a set of breakpoints
   *
   * ```tsx
   * const MidSizeOnly = () => {
   *   const isMid = useBreakpoint({ lg: 'down', sm: 'up' });
   *
   *   if (isMid) return <div>On a Reasonable sized Screen!</div>
   *   return null;
   * }
   * ```
   * @param breakpointMap An object map of breakpoints and directions, queries are constructed using "and" to join
   * breakpoints together
   * @param window Optionally specify the target window to match against (useful when rendering into iframes)
   */

  /**
   * Match a single breakpoint exactly, up, or down.
   *
   * ```tsx
   * const PhoneOnly = () => {
   *   const isSmall = useBreakpoint('sm', 'down');
   *
   *   if (isSmall) return <div>On a Small Screen!</div>
   *   return null;
   * }
   * ```
   *
   * @param breakpoint The breakpoint key
   * @param direction A direction 'up' for a max, 'down' for min, true to match only the breakpoint
   * @param window Optionally specify the target window to match against (useful when rendering into iframes)
   */

  function useBreakpoint(breakpointOrMap, direction, window) {
    let breakpointMap;
    if (typeof breakpointOrMap === 'object') {
      breakpointMap = breakpointOrMap;
      window = direction;
      direction = true;
    } else {
      direction = direction || true;
      breakpointMap = {
        [breakpointOrMap]: direction
      };
    }
    let query = useMemo$2(() => Object.entries(breakpointMap).reduce((query, [key, direction]) => {
      if (direction === 'up' || direction === true) {
        query = and(query, getMinQuery(key));
      }
      if (direction === 'down' || direction === true) {
        query = and(query, getMaxQuery(key));
      }
      return query;
    }, ''), [JSON.stringify(breakpointMap)]);
    return useMediaQuery(query, window);
  }
  return useBreakpoint;
}
const useBreakpoint = createBreakpointHook({
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1400
});

const React$c = await importShared('react');
const OffcanvasBody = /*#__PURE__*/React$c.forwardRef(({
  className,
  bsPrefix,
  as: Component = 'div',
  ...props
}, ref) => {
  bsPrefix = useBootstrapPrefix(bsPrefix, 'offcanvas-body');
  return /*#__PURE__*/jsxRuntimeExports.jsx(Component, {
    ref: ref,
    className: classNames(className, bsPrefix),
    ...props
  });
});
OffcanvasBody.displayName = 'OffcanvasBody';

const React$b = await importShared('react');
const transitionStyles = {
  [ENTERING]: 'show',
  [ENTERED]: 'show'
};
const OffcanvasToggling = /*#__PURE__*/React$b.forwardRef(({
  bsPrefix,
  className,
  children,
  in: inProp = false,
  mountOnEnter = false,
  unmountOnExit = false,
  appear = false,
  ...props
}, ref) => {
  bsPrefix = useBootstrapPrefix(bsPrefix, 'offcanvas');
  return /*#__PURE__*/jsxRuntimeExports.jsx(TransitionWrapper, {
    ref: ref,
    addEndListener: transitionEndListener,
    in: inProp,
    mountOnEnter: mountOnEnter,
    unmountOnExit: unmountOnExit,
    appear: appear,
    ...props,
    childRef: getChildRef(children),
    children: (status, innerProps) => /*#__PURE__*/React$b.cloneElement(children, {
      ...innerProps,
      className: classNames(className, children.props.className, (status === ENTERING || status === EXITING) && `${bsPrefix}-toggling`, transitionStyles[status])
    })
  });
});
OffcanvasToggling.displayName = 'OffcanvasToggling';

const React$a = await importShared('react');
const OffcanvasHeader = /*#__PURE__*/React$a.forwardRef(({
  bsPrefix,
  className,
  closeLabel = 'Close',
  closeButton = false,
  ...props
}, ref) => {
  bsPrefix = useBootstrapPrefix(bsPrefix, 'offcanvas-header');
  return /*#__PURE__*/jsxRuntimeExports.jsx(AbstractModalHeader, {
    ref: ref,
    ...props,
    className: classNames(className, bsPrefix),
    closeLabel: closeLabel,
    closeButton: closeButton
  });
});
OffcanvasHeader.displayName = 'OffcanvasHeader';

const React$9 = await importShared('react');
const DivStyledAsH5 = divWithClassName('h5');
const OffcanvasTitle = /*#__PURE__*/React$9.forwardRef(({
  className,
  bsPrefix,
  as: Component = DivStyledAsH5,
  ...props
}, ref) => {
  bsPrefix = useBootstrapPrefix(bsPrefix, 'offcanvas-title');
  return /*#__PURE__*/jsxRuntimeExports.jsx(Component, {
    ref: ref,
    className: classNames(className, bsPrefix),
    ...props
  });
});
OffcanvasTitle.displayName = 'OffcanvasTitle';

const React$8 = await importShared('react');

const {useCallback: useCallback$1,useEffect: useEffect$6,useMemo: useMemo$1,useRef: useRef$2,useState: useState$7} = await importShared('react');
function DialogTransition(props) {
  return /*#__PURE__*/jsxRuntimeExports.jsx(OffcanvasToggling, {
    ...props
  });
}
function BackdropTransition(props) {
  return /*#__PURE__*/jsxRuntimeExports.jsx(Fade, {
    ...props
  });
}
const Offcanvas = /*#__PURE__*/React$8.forwardRef(({
  bsPrefix,
  className,
  children,
  'aria-labelledby': ariaLabelledby,
  placement = 'start',
  responsive,
  /* BaseModal props */

  show = false,
  backdrop = true,
  keyboard = true,
  scroll = false,
  onEscapeKeyDown,
  onShow,
  onHide,
  container,
  autoFocus = true,
  enforceFocus = true,
  restoreFocus = true,
  restoreFocusOptions,
  onEntered,
  onExit,
  onExiting,
  onEnter,
  onEntering,
  onExited,
  backdropClassName,
  manager: propsManager,
  renderStaticNode = false,
  ...props
}, ref) => {
  const modalManager = useRef$2();
  bsPrefix = useBootstrapPrefix(bsPrefix, 'offcanvas');
  const [showOffcanvas, setShowOffcanvas] = useState$7(false);
  const handleHide = useEventCallback$1(onHide);
  const hideResponsiveOffcanvas = useBreakpoint(responsive || 'xs', 'up');
  useEffect$6(() => {
    // Handles the case where screen is resized while the responsive
    // offcanvas is shown. If `responsive` not provided, just use `show`.
    setShowOffcanvas(responsive ? show && !hideResponsiveOffcanvas : show);
  }, [show, responsive, hideResponsiveOffcanvas]);
  const modalContext = useMemo$1(() => ({
    onHide: handleHide
  }), [handleHide]);
  function getModalManager() {
    if (propsManager) return propsManager;
    if (scroll) {
      // Have to use a different modal manager since the shared
      // one handles overflow.
      if (!modalManager.current) modalManager.current = new BootstrapModalManager({
        handleContainerOverflow: false
      });
      return modalManager.current;
    }
    return getSharedManager();
  }
  const handleEnter = (node, ...args) => {
    if (node) node.style.visibility = 'visible';
    onEnter == null || onEnter(node, ...args);
  };
  const handleExited = (node, ...args) => {
    if (node) node.style.visibility = '';
    onExited == null || onExited(...args);
  };
  const renderBackdrop = useCallback$1(backdropProps => /*#__PURE__*/jsxRuntimeExports.jsx("div", {
    ...backdropProps,
    className: classNames(`${bsPrefix}-backdrop`, backdropClassName)
  }), [backdropClassName, bsPrefix]);
  const renderDialog = dialogProps => /*#__PURE__*/jsxRuntimeExports.jsx("div", {
    ...dialogProps,
    ...props,
    className: classNames(className, responsive ? `${bsPrefix}-${responsive}` : bsPrefix, `${bsPrefix}-${placement}`),
    "aria-labelledby": ariaLabelledby,
    children: children
  });
  return /*#__PURE__*/jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, {
    children: [!showOffcanvas && (responsive || renderStaticNode) && renderDialog({}), /*#__PURE__*/jsxRuntimeExports.jsx(ModalContext.Provider, {
      value: modalContext,
      children: /*#__PURE__*/jsxRuntimeExports.jsx(BaseModal, {
        show: showOffcanvas,
        ref: ref,
        backdrop: backdrop,
        container: container,
        keyboard: keyboard,
        autoFocus: autoFocus,
        enforceFocus: enforceFocus && !scroll,
        restoreFocus: restoreFocus,
        restoreFocusOptions: restoreFocusOptions,
        onEscapeKeyDown: onEscapeKeyDown,
        onShow: onShow,
        onHide: handleHide,
        onEnter: handleEnter,
        onEntering: onEntering,
        onEntered: onEntered,
        onExit: onExit,
        onExiting: onExiting,
        onExited: handleExited,
        manager: getModalManager(),
        transition: DialogTransition,
        backdropTransition: BackdropTransition,
        renderBackdrop: renderBackdrop,
        renderDialog: renderDialog
      })
    })]
  });
});
Offcanvas.displayName = 'Offcanvas';
const Offcanvas$1 = Object.assign(Offcanvas, {
  Body: OffcanvasBody,
  Header: OffcanvasHeader,
  Title: OffcanvasTitle
});

const React$7 = await importShared('react');
const Spinner = /*#__PURE__*/React$7.forwardRef(({
  bsPrefix,
  variant,
  animation = 'border',
  size,
  // Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
  as: Component = 'div',
  className,
  ...props
}, ref) => {
  bsPrefix = useBootstrapPrefix(bsPrefix, 'spinner');
  const bsSpinnerPrefix = `${bsPrefix}-${animation}`;
  return /*#__PURE__*/jsxRuntimeExports.jsx(Component, {
    ref: ref,
    ...props,
    className: classNames(className, bsSpinnerPrefix, size && `${bsSpinnerPrefix}-${size}`, variant && `text-${variant}`)
  });
});
Spinner.displayName = 'Spinner';

const React$6 = await importShared('react');
const fadeStyles = {
  [ENTERING]: 'showing',
  [EXITING]: 'showing show'
};
const ToastFade = /*#__PURE__*/React$6.forwardRef((props, ref) => /*#__PURE__*/jsxRuntimeExports.jsx(Fade, {
  ...props,
  ref: ref,
  transitionClasses: fadeStyles
}));
ToastFade.displayName = 'ToastFade';

const React$5 = await importShared('react');

const ToastContext = /*#__PURE__*/React$5.createContext({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onClose() {}
});

const React$4 = await importShared('react');

const {useContext: useContext$5} = await importShared('react');
const ToastHeader = /*#__PURE__*/React$4.forwardRef(({
  bsPrefix,
  closeLabel = 'Close',
  closeVariant,
  closeButton = true,
  className,
  children,
  ...props
}, ref) => {
  bsPrefix = useBootstrapPrefix(bsPrefix, 'toast-header');
  const context = useContext$5(ToastContext);
  const handleClick = useEventCallback$1(e => {
    context == null || context.onClose == null || context.onClose(e);
  });
  return /*#__PURE__*/jsxRuntimeExports.jsxs("div", {
    ref: ref,
    ...props,
    className: classNames(bsPrefix, className),
    children: [children, closeButton && /*#__PURE__*/jsxRuntimeExports.jsx(CloseButton, {
      "aria-label": closeLabel,
      variant: closeVariant,
      onClick: handleClick,
      "data-dismiss": "toast"
    })]
  });
});
ToastHeader.displayName = 'ToastHeader';

const React$3 = await importShared('react');
const ToastBody = /*#__PURE__*/React$3.forwardRef(({
  className,
  bsPrefix,
  as: Component = 'div',
  ...props
}, ref) => {
  bsPrefix = useBootstrapPrefix(bsPrefix, 'toast-body');
  return /*#__PURE__*/jsxRuntimeExports.jsx(Component, {
    ref: ref,
    className: classNames(className, bsPrefix),
    ...props
  });
});
ToastBody.displayName = 'ToastBody';

const React$2 = await importShared('react');

const {useEffect: useEffect$5,useMemo,useRef: useRef$1,useCallback} = await importShared('react');
const Toast = /*#__PURE__*/React$2.forwardRef(({
  bsPrefix,
  className,
  transition: Transition = ToastFade,
  show = true,
  animation = true,
  delay = 5000,
  autohide = false,
  onClose,
  onEntered,
  onExit,
  onExiting,
  onEnter,
  onEntering,
  onExited,
  bg,
  ...props
}, ref) => {
  bsPrefix = useBootstrapPrefix(bsPrefix, 'toast');

  // We use refs for these, because we don't want to restart the autohide
  // timer in case these values change.
  const delayRef = useRef$1(delay);
  const onCloseRef = useRef$1(onClose);
  useEffect$5(() => {
    delayRef.current = delay;
    onCloseRef.current = onClose;
  }, [delay, onClose]);
  const autohideTimeout = useTimeout();
  const autohideToast = !!(autohide && show);
  const autohideFunc = useCallback(() => {
    if (autohideToast) {
      onCloseRef.current == null || onCloseRef.current();
    }
  }, [autohideToast]);
  useEffect$5(() => {
    // Only reset timer if show or autohide changes.
    autohideTimeout.set(autohideFunc, delayRef.current);
  }, [autohideTimeout, autohideFunc]);
  const toastContext = useMemo(() => ({
    onClose
  }), [onClose]);
  const hasAnimation = !!(Transition && animation);
  const toast = /*#__PURE__*/jsxRuntimeExports.jsx("div", {
    ...props,
    ref: ref,
    className: classNames(bsPrefix, className, bg && `bg-${bg}`, !hasAnimation && (show ? 'show' : 'hide')),
    role: "alert",
    "aria-live": "assertive",
    "aria-atomic": "true"
  });
  return /*#__PURE__*/jsxRuntimeExports.jsx(ToastContext.Provider, {
    value: toastContext,
    children: hasAnimation && Transition ? /*#__PURE__*/jsxRuntimeExports.jsx(Transition, {
      in: show,
      onEnter: onEnter,
      onEntering: onEntering,
      onEntered: onEntered,
      onExit: onExit,
      onExiting: onExiting,
      onExited: onExited,
      unmountOnExit: true,
      children: toast
    }) : toast
  });
});
Toast.displayName = 'Toast';
const BootToast = Object.assign(Toast, {
  Body: ToastBody,
  Header: ToastHeader
});

let THEME = APP_COLOR.Dark.toString();
const SPACE = " ";
function initThemeColor() {
  const themeColor = localStorage.getItem("app_theme");
  if (themeColor !== null) {
    THEME = themeColor;
    document.body.setAttribute("data-bs-theme", themeColor);
  } else {
    document.body.setAttribute("data-bs-theme", "dark");
  }
}
function getThemeColor() {
  return THEME;
}
function getButtonColor() {
  const color = THEME === APP_COLOR.Dark ? "light" : "dark";
  return "outline-" + color;
}
function setThemeColor(color) {
  THEME = color;
}

function setClassName(className) {
  return `bi bi-${className}`;
}

const props = {
  type: APP_COLOR.Danger,
  text: "内容"
};
function AlertBase(_props = props) {
  const { type, text } = _props;
  let iconClassName = setClassName("info-circle") + " me-1";
  if (type === APP_COLOR.Success) {
    iconClassName = setClassName("check-circle") + " me-1";
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert$1, { variant: type, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: setClassName(iconClassName) }),
    text
  ] });
}

const {useEffect: useEffect$4,useState: useState$6} = await importShared('react');

const modalConfirm = {
  show: true,
  hasButton: true,
  closeButton: true
};
let container$1 = document.getElementById("toast");
if (container$1 === null) {
  container$1 = document.createElement("div");
  document.body.appendChild(container$1);
}
const root$1 = clientExports.createRoot(container$1);
function ModalConfirm({
  title,
  body,
  confirmButton,
  callback,
  update
}) {
  const themeColor = getThemeColor();
  const [show, setShow] = useState$6(confirmButton.show);
  useEffect$4(() => {
    setShow(confirmButton.show);
  }, [update]);
  const onClose = () => {
    setShow(false);
  };
  return show && /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Modal$1,
    {
      show,
      onHide: onClose,
      animation: true,
      "aria-labelledby": "contained-modal-title-vcenter",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Modal$1.Header, { closeButton: confirmButton.closeButton, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Modal$1.Title, { id: "contained-modal-title-vcenter", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: setClassName("info-circle") }),
          " ",
          title
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Modal$1.Body, { children: body }),
        confirmButton.hasButton && /* @__PURE__ */ jsxRuntimeExports.jsxs(Modal$1.Footer, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: themeColor, onClick: onClose, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: setClassName("x-circle") }),
            " 取消"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: themeColor,
              onClick: () => {
                callback();
                onClose();
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: setClassName("check-circle") }),
                " 确定"
              ]
            }
          )
        ] })
      ]
    }
  );
}
function ModalConfirm3d({
  title = "提示",
  body = "内容",
  confirmButton = modalConfirm
}, callback = () => {
}) {
  const update = (/* @__PURE__ */ new Date()).getTime();
  root$1.render(
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ModalConfirm,
      {
        title,
        body,
        confirmButton,
        callback,
        update
      }
    )
  );
}

const {useEffect: useEffect$3,useState: useState$5} = await importShared('react');
function App116({ update, _toast }) {
  const [toast, setToast] = useState$5(_toast);
  const { show, delay, type, title, content } = toast;
  useEffect$3(() => {
    setToast({ ..._toast, show: true });
  }, [update]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    BootToast,
    {
      className: "fixed-top mt-2 mx-auto",
      style: { zIndex: 116116 },
      onClose: () => {
        setToast({ ...toast, show: false });
      },
      show,
      delay,
      bg: type,
      autohide: true,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(BootToast.Header, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: setClassName("info-circle") + " me-1" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "me-auto ", children: title })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          BootToast.Body,
          {
            className: type.toString() === "Dark" ? "text-white" : "",
            children: content
          }
        )
      ]
    }
  );
}
let container = document.getElementById("toast");
if (container === null) {
  container = document.createElement("div");
  document.body.appendChild(container);
}
const root = clientExports.createRoot(container);
function Toast3d(content = "内容", title = "提示", type = APP_COLOR.Success, delay = DELAY.SHORT, show = false) {
  const update = (/* @__PURE__ */ new Date()).getTime();
  const toast = {
    title,
    content,
    type,
    delay,
    show
  };
  root.render(/* @__PURE__ */ jsxRuntimeExports.jsx(App116, { update, _toast: toast }));
}

const {useState: useState$4} = await importShared('react');
function EditorForm({
  item,
  getNewItem
}) {
  const [_item, _setItem] = useState$4({ ...item });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(InputGroup$1, { size: "sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(InputGroup$1.Text, { id: "inputGroup-sizing-sm", children: item.type }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Form$1.Control,
        {
          "aria-label": "Small",
          "aria-describedby": "inputGroup-sizing-sm",
          placeholder: _item.name,
          type: "text",
          value: _item.name,
          onChange: (e) => {
            const _item2 = { ...item, name: e.target.value };
            _setItem(_item2);
            getNewItem(_item2);
          }
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 d-flex flex-column align-items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Viewer3d, { canvasStyle: { height: "300px", width: "300px" } }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          className: "mt-2",
          variant: getButtonColor(),
          onClick: () => {
            const imgBase64 = takeScreenshot(300, 300);
            const __item = { ...item, imgUrl: imgBase64, name: _item.name };
            _setItem(__item);
            getNewItem(__item);
            Toast3d("截图成功");
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: setClassName("camera") }),
            " 设为封面"
          ]
        }
      )
    ] })
  ] });
}

const {memo: memo$1} = await importShared('react');
function ItemInfoCard(props) {
  const { list, getType, setList } = props;
  const { isLoading, error } = getType;
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { animation: "grow" });
  }
  if (error) {
    console.error(error);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(AlertBase, { type: APP_COLOR.Danger, text: "查看控制台" });
  }
  if (list.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(AlertBase, { type: APP_COLOR.Warning, text: "无数据" });
  }
  function deleteBtn(item, index) {
    ModalConfirm3d(
      {
        title: "删除",
        body: /* @__PURE__ */ jsxRuntimeExports.jsx(AlertBase, { type: APP_COLOR.Danger, text: item.name })
      },
      () => {
        const newList = list.filter((_, i) => i !== index);
        setList(newList);
        Toast3d(`【${item.name}】已删除`);
      }
    );
  }
  function editorBtn(item, _index) {
    function getNewItem(_newItem) {
      console.log("getNewItem", _newItem);
      const newList = list.map((item2, index) => {
        if (index === _index) {
          return _newItem;
        }
        return item2;
      });
      setList(newList);
    }
    ModalConfirm3d(
      {
        title: "编辑",
        body: /* @__PURE__ */ jsxRuntimeExports.jsx(EditorForm, { item, getNewItem })
      },
      () => {
        Toast3d(`【${item.name}】已修改 `);
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Container, { fluid: true, className: "d-flex flex-wrap", children: list.map((item, index) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card$1, { className: "ms-2 mt-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card$1.Header, { style: { width: "6rem" }, title: item.name, children: item.name.trim() === "" ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-warning", children: " 未命名" }) : item.name }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card$1.Body, { className: "d-flex flex-column text-center", children: [
        item.imgUrl.trim() !== "" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Card$1.Img, { src: item.imgUrl, variant: "top" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "bi bi-image", style: { fontSize: "4rem" } }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(ButtonGroup, { "aria-label": "Basic example", className: "mt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: getThemeColor(),
              size: "sm",
              onClick: () => editorBtn(item, index),
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: setClassName("pencil"), title: "编辑" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: getThemeColor(),
              size: "sm",
              onClick: () => deleteBtn(item, index),
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: setClassName("trash"), title: "删除" })
            }
          )
        ] })
      ] })
    ] }, index);
  }) });
}
const ListCard = memo$1(ItemInfoCard);

const testData1 = [
  {
    id: 1,
    name: "场景1",
    type: "场景",
    desc: "这是一个场景",
    imgUrl: "/common/images/test.jpg"
  },
  {
    id: 2,
    name: "场景2",
    type: "场景",
    desc: "这是一个场景",
    imgUrl: "/common/images/test.jpg"
  },
  {
    id: 3,
    name: "场景3",
    type: "场景",
    desc: "这是一个场景",
    imgUrl: "/common/images/test.jpg"
  },
  {
    id: 4,
    name: "场景4",
    type: "场景",
    desc: "这是一个场景",
    imgUrl: "/common/images/test.jpg"
  },
  {
    id: 5,
    name: "场景5",
    type: "场景",
    desc: "这是一个场景",
    imgUrl: " "
  },
  {
    id: 6,
    name: "场景6",
    type: "场景",
    desc: "这是一个场景",
    imgUrl: " "
  },
  {
    id: 7,
    name: "场景7",
    type: "场景",
    desc: "这是一个场景",
    imgUrl: " "
  },
  {
    id: 8,
    name: "场景8",
    type: "场景",
    desc: "这是一个场景",
    imgUrl: " "
  }
];
const testData2 = [
  {
    id: 1,
    name: "模型1",
    type: "模型",
    desc: "这是一个场景",
    imgUrl: "/common/images/test.jpg"
  },
  {
    id: 2,
    name: "模型2",
    type: "模型",
    desc: "这是一个场景",
    imgUrl: "/common/images/test.jpg"
  },
  {
    id: 3,
    name: "模型3",
    type: "模型",
    desc: "这是一个场景",
    imgUrl: "/common/images/test.jpg"
  },
  {
    id: 4,
    name: "模型4",
    type: "模型",
    desc: "这是一个场景",
    imgUrl: " "
  },
  {
    id: 5,
    name: "模型5",
    type: "模型",
    desc: "这是一个场景",
    imgUrl: " "
  },
  {
    id: 6,
    name: "模型6",
    type: "模型",
    desc: "这是一个场景",
    imgUrl: " "
  },
  {
    id: 7,
    name: "模型7",
    type: "模型",
    desc: "这是一个场景",
    imgUrl: " "
  },
  {
    id: 8,
    name: "模型8",
    type: "模型",
    desc: "这是一个场景",
    imgUrl: " "
  }
];

const {useContext: useContext$4,useState: useState$3} = await importShared('react');
function EditorTop() {
  initThemeColor();
  const themeColor = getThemeColor();
  const [showScene, setShowScene] = useState$3(false);
  const handleClose = () => setShowScene(false);
  const handleShow = () => setShowScene(true);
  const [appTheme, setAppTheme] = useState$3(themeColor);
  const { dispatchScene } = useContext$4(MyContext);
  function saveScene() {
    const scene = getScene();
    scene.children.forEach((item) => {
      if (item.userData.type === UserDataType.TransformHelper) {
        item.removeFromParent();
      }
    });
    scene.toJSON();
    const c = getCamera().toJSON();
    localStorage.setItem("scene", JSON.stringify(scene));
    localStorage.setItem("camera", JSON.stringify(c));
    Toast3d("保存成功");
  }
  function setTheme(color) {
    document.body.setAttribute("data-bs-theme", color);
    localStorage.setItem("app_theme", color);
    setThemeColor(color);
    setAppTheme(color);
  }
  function saveAsNewScene() {
    const item = {
      id: 0,
      name: "新建场景",
      type: "场景",
      desc: "无",
      imgUrl: ""
    };
    const getNewItem = (newItem) => {
      item.name = newItem.name;
    };
    ModalConfirm3d(
      {
        title: "另存场景",
        body: /* @__PURE__ */ jsxRuntimeExports.jsx(EditorForm, { item, getNewItem })
      },
      function() {
        Toast3d("保存成功" + item.name);
      }
    );
  }
  const [list, setList] = useState$3(testData1);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Row, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Col, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Image$1, { src: "/common/images/logo.png" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: themeColor, size: "sm", onClick: handleShow, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: setClassName("bi me-1 bi-badge-3d") }),
          "切换场景"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Col, { className: "d-flex justify-content-end", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(ButtonGroup, { "aria-label": "Basic example", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: themeColor,
              size: "sm",
              onClick: () => {
                localStorage.removeItem("camera");
                localStorage.removeItem("scene");
                const newScene = new Scene();
                setScene(newScene);
                addGridHelper();
                dispatchScene({
                  type: "setScene",
                  payload: newScene
                });
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: setClassName("plus-square") }),
                " 新建场景"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: themeColor,
              size: "sm",
              onClick: () => {
                saveScene();
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: setClassName("floppy") }),
                " 保存场景"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: themeColor,
              size: "sm",
              onClick: () => {
                saveAsNewScene();
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: setClassName("floppy2") }),
                " 场景另存"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: themeColor, size: "sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: setClassName("dash-circle") }),
            " 待续"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Dropdown$1, { className: "d-inline", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Dropdown$1.Toggle,
            {
              id: "dropdown-autoclose-true",
              variant: themeColor,
              size: "sm",
              children: [
                appTheme === "light" ? /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: setClassName("sun") }) : /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: setClassName("moon-stars") }),
                "模式"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Dropdown$1.Menu, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Dropdown$1.Item,
              {
                onClick: () => {
                  setTheme("light");
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: setClassName("sun") }),
                  "白天"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Dropdown$1.Item,
              {
                onClick: () => {
                  setTheme("dark");
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: setClassName("moon-stars") }),
                  "黑夜"
                ]
              }
            )
          ] })
        ] }) })
      ] })
    ] }),
    showScene && /* @__PURE__ */ jsxRuntimeExports.jsxs(Offcanvas$1, { show: showScene, onHide: handleClose, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Offcanvas$1.Header, { closeButton: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Offcanvas$1.Title, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: setClassName("badge-3d") }),
        " 所有场景"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Offcanvas$1.Body, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        ListCard,
        {
          list,
          setList,
          getType: {
            isLoading: false,
            error: false
          }
        }
      ) })
    ] })
  ] });
}

function BottomNav() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Nav$1, { variant: "tabs", defaultActiveKey: "/", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Nav$1.Item, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "nav-link", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: setClassName("box") }),
        " 模型列表"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Nav$1.Item, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/addMesh", className: "nav-link", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: setClassName("patch-plus") }),
        " 添加网格"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Nav$1.Item, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/mark", className: "nav-link", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: setClassName("pin-map") }),
        " 点位标注"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Nav$1.Item, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/about", className: "nav-link", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: setClassName("info-circle") }),
        " 关于"
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {})
  ] });
}

const {useContext: useContext$3,useEffect: useEffect$2,useState: useState$2} = await importShared('react');
const step = 0.1;
function Switch3d({
  title,
  curObj3d,
  attr
}) {
  const [checked, setChecked] = useState$2(curObj3d[attr]);
  useEffect$2(() => {
    setChecked(curObj3d[attr]);
  }, [curObj3d]);
  return curObj3d.hasOwnProperty(attr) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: " d-flex justify-content-between flex-wrap p-1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Form$1, { className: "ms-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Form$1.Check,
      {
        type: "switch",
        checked,
        onChange: () => {
          curObj3d[attr] = !checked;
          setChecked(!checked);
        }
      }
    ) })
  ] });
}
function Object3dInput({
  transform,
  title = "位置"
}) {
  const [checked, setChecked] = useState$2(true);
  const [lockValue, setLockValue] = useState$2(0);
  const _isScale = isScale(title);
  function setValue(value) {
    if (checked && _isScale) {
      setLockValue(value);
      transform.x = value;
      transform.y = value;
      transform.z = value;
      return;
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card$1, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card$1.Header, { className: "d-flex justify-content-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: title }),
      _isScale && /* @__PURE__ */ jsxRuntimeExports.jsx(Form$1, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Form$1.Check,
        {
          type: "switch",
          checked,
          onChange: (e) => {
            setChecked(e.target.checked);
          }
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card$1.Body, { className: "d-flex", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(InputGroup$1, { size: "sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(InputGroup$1.Text, { children: "X" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Form$1.Control,
          {
            "aria-label": "Small",
            "aria-describedby": "inputGroup-sizing-sm",
            placeholder: transform.x.toString(),
            type: "number",
            step,
            title: transform.x.toString(),
            onChange: (e) => {
              setValue(parseFloat(e.target.value));
              transform.x = parseFloat(e.target.value);
            }
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(InputGroup$1, { size: "sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(InputGroup$1.Text, { children: "Y" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Form$1.Control,
          {
            "aria-label": "Small",
            "aria-describedby": "inputGroup-sizing-sm",
            placeholder: transform.y.toString(),
            type: "number",
            step,
            disabled: _isScale && checked,
            title: _isScale && checked ? lockValue.toString() : transform.y.toString(),
            onChange: (e) => {
              setValue(parseFloat(e.target.value));
              transform.y = parseFloat(e.target.value);
            }
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(InputGroup$1, { size: "sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(InputGroup$1.Text, { children: "Z" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Form$1.Control,
          {
            "aria-label": "Small",
            "aria-describedby": "inputGroup-sizing-sm",
            placeholder: transform.z.toString(),
            type: "number",
            step,
            disabled: _isScale && checked,
            title: _isScale && checked ? lockValue.toString() : transform.z.toString(),
            onChange: (e) => {
              setValue(parseFloat(e.target.value));
              transform.z = parseFloat(e.target.value);
            }
          }
        )
      ] })
    ] })
  ] });
}
function AttrInputNumber({
  title,
  curObj3d,
  attr
}) {
  return curObj3d && curObj3d.hasOwnProperty(attr) && /* @__PURE__ */ jsxRuntimeExports.jsxs(InputGroup$1, { size: "sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(InputGroup$1.Text, { children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Form$1.Control,
      {
        "aria-label": "Small",
        "aria-describedby": "inputGroup-sizing-sm",
        placeholder: curObj3d[attr].toString(),
        type: "number",
        step,
        title: curObj3d[attr].toString(),
        onChange: (e) => {
          curObj3d[attr] = parseFloat(e.target.value);
        }
      }
    )
  ] });
}
function AttrInputText({
  title,
  curObj3d,
  attr
}) {
  const [value, setValue] = useState$2(getObjectNameByName(curObj3d));
  useEffect$2(() => {
    setValue(getObjectNameByName(curObj3d));
  }, [curObj3d]);
  return curObj3d && curObj3d.hasOwnProperty(attr) && /* @__PURE__ */ jsxRuntimeExports.jsxs(InputGroup$1, { size: "sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(InputGroup$1.Text, { children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Form$1.Control,
      {
        "aria-label": "Small",
        "aria-describedby": "inputGroup-sizing-sm",
        placeholder: value,
        type: "text",
        value,
        title: value,
        onChange: (e) => {
          curObj3d.name = e.target.value;
          setValue(e.target.value);
        }
      }
    )
  ] });
}
function sceneProperty(curObj3d) {
  const { dispatchScene } = useContext$3(MyContext);
  const backgroundColor = curObj3d.background?.getHexString() ? curObj3d.background?.getHexString() : "000000";
  const fogColor = curObj3d.fog?.color.getHexString() ? curObj3d.background?.getHexString() : "000000";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(InputGroup$1, { size: "sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(InputGroup$1.Text, { children: "背景色" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Form$1.Control,
        {
          "aria-label": "Small",
          "aria-describedby": "inputGroup-sizing-sm",
          type: "color",
          value: "#" + backgroundColor,
          onChange: (e) => {
            curObj3d.background = new Color(e.target.value);
            dispatchScene({
              type: "setScene",
              payload: getScene()
            });
          }
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(InputGroup$1, { size: "sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(InputGroup$1.Text, { children: "雾气色" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Form$1.Control,
        {
          "aria-label": "Small",
          "aria-describedby": "inputGroup-sizing-sm",
          type: "color",
          value: "#" + fogColor,
          onChange: (e) => {
            if (curObj3d.fog === null) {
              curObj3d.fog = new Fog(e.target.value, 0, 20);
            } else {
              curObj3d.fog.color = new Color(e.target.value);
            }
            dispatchScene({
              type: "setScene",
              payload: getScene()
            });
          }
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AttrInputNumber,
      {
        title: "雾气近端",
        curObj3d: curObj3d.fog,
        attr: "near"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AttrInputNumber,
      {
        title: "雾气远端",
        curObj3d: curObj3d.fog,
        attr: "far"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        variant: getThemeColor(),
        onClick: () => {
          curObj3d.fog = null;
        },
        children: "重置雾气"
      }
    )
  ] });
}
function commonProperty(curObj3d) {
  return curObj3d && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Object3dInput,
      {
        transform: curObj3d.position,
        title: "位置"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Object3dInput,
      {
        transform: curObj3d.rotation,
        title: "旋转"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Object3dInput,
      {
        transform: curObj3d.scale,
        title: "缩放"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card$1, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card$1.Header, { children: "其他属性" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card$1.Body, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          AttrInputText,
          {
            title: "名称",
            curObj3d,
            attr: "name"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          AttrInputNumber,
          {
            title: "亮度",
            curObj3d,
            attr: "intensity"
          }
        ),
        !curObj3d.isAmbientLight && /* @__PURE__ */ jsxRuntimeExports.jsxs(ButtonGroup, { className: " d-flex justify-content-between flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Switch3d,
            {
              title: "投射阴影",
              curObj3d,
              attr: "castShadow"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Switch3d,
            {
              title: "接收阴影",
              curObj3d,
              attr: "receiveShadow"
            }
          )
        ] })
      ] })
    ] })
  ] });
}
function ObjectPropertyChild({
  curObj3d
}) {
  if (curObj3d) {
    if (curObj3d.isScene) {
      return sceneProperty(curObj3d);
    }
    if (curObj3d.isCamera) {
      return cameraProperty();
    }
    return commonProperty(curObj3d);
  }
}
function cameraProperty() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AlertBase, { type: APP_COLOR.Info, text: "默认属性" });
}
function isScale(title) {
  return "缩放" === title ? true : false;
}

function ObjectProperty({
  curObj3d
}) {
  return curObj3d && /* @__PURE__ */ jsxRuntimeExports.jsxs(Accordion$1.Item, { eventKey: "1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Accordion$1.Header, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: setClassName("menu-button") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2 ellipsis-3d", children: "属性" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Accordion$1.Body, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(ObjectPropertyChild, { curObj3d }) })
  ] });
}

const React$1 = await importShared('react');
const {useContext: useContext$2,useState: useState$1} = React$1;
const TreeNode = ({
  node,
  setCurObj3d,
  onToggle,
  resetTextWarning
}) => {
  const hasChildren = node.children && node.children.length > 0;
  const [isExpanded, setIsExpanded] = React$1.useState(false);
  const [delBtn, setDelBtn] = React$1.useState(false);
  const [isSelected, setIsSelected] = useState$1(false);
  const { dispatchScene } = useContext$2(MyContext);
  const handleToggle = () => {
    setIsExpanded(!isExpanded);
    resetTextWarning(node);
    setIsSelected(!isSelected);
    setCurObj3d(node);
    setTransformControls([node]);
    onToggle(node.uuid, !isExpanded);
  };
  const delMesh = (e, item) => {
    e.stopPropagation();
    e.preventDefault();
    ModalConfirm3d(
      {
        title: "删除",
        body: /* @__PURE__ */ jsxRuntimeExports.jsx(AlertBase, { type: APP_COLOR.Danger, text: getObjectNameByName(item) })
      },
      () => {
        const scene = getScene();
        const targetItem = scene.getObjectByProperty("uuid", item.uuid);
        if (targetItem === undefined) {
          return;
        }
        if (targetItem.parent == null) {
          return;
        }
        targetItem.parent.remove(targetItem);
        dispatchScene({
          type: "setScene",
          payload: scene
        });
        Toast3d(`【${getObjectNameByName(item)}】已删除`);
      }
    );
  };
  function getLogo(item) {
    let logo = "hexagon";
    if (item.isMesh) logo = "box";
    if (item.isGroup) logo = "collection";
    if (item.isLight) logo = "lightbulb";
    return /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: setClassName(logo) });
  }
  const light = `d-flex justify-content-between ${node.userData.isSelected ? "text-warning" : ""}`;
  if (node.userData.type === UserDataType.TransformHelper) {
    return;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(ListGroupItem, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: light,
        onClick: handleToggle,
        onMouseEnter: () => setDelBtn(true),
        onMouseLeave: () => setDelBtn(false),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            getLogo(node),
            " ",
            SPACE,
            getObjectNameByName(node)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            delBtn ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "sm",
                variant: APP_COLOR.Dark,
                className: "me-1",
                onClick: (e) => delMesh(e, node),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: setClassName("trash") })
              }
            ) : "",
            hasChildren ? isExpanded ? /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: setClassName("dash-square") }) : /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: setClassName("plus-square") }) : ""
          ] })
        ]
      }
    ),
    isExpanded && hasChildren && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: node.children.map((child) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      TreeNode,
      {
        node: child,
        setCurObj3d,
        onToggle,
        resetTextWarning
      },
      child.uuid
    )) })
  ] }) });
};
const TreeList = ({
  data,
  setCurObj3d,
  resetTextWarning
}) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: data.map((node) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    TreeNode,
    {
      node,
      onToggle: () => {
      },
      setCurObj3d,
      resetTextWarning
    },
    node.uuid
  )) });
};

const {useContext: useContext$1,useEffect: useEffect$1,useState} = await importShared('react');
function OutlineView() {
  let [curObj3d, setCurObj3d] = useState();
  const [camera, _setCamera] = useState();
  const { scene, dispatchScene } = useContext$1(MyContext);
  useEffect$1(() => {
    const _camera = getCamera();
    _camera.userData.isSelected = false;
    _setCamera(_camera);
    const _scene = getScene();
    _scene.children = setD2(_scene.children);
    setCamera(_camera);
    dispatchScene({
      type: "setScene",
      payload: getScene()
    });
    getDivElement().addEventListener("click", function(event) {
      event.stopPropagation();
      event.preventDefault();
      const currentObject = raycasterSelect(event);
      const selectedMesh = [];
      for (let i = 0; i < currentObject.length; i++) {
        const { object } = currentObject[i];
        if (object.userData.type !== UserDataType.TransformHelper && object.userData.type !== UserDataType.GridHelper && object.type !== UserDataType.BoxHelper) {
          selectedMesh.push(object);
        }
      }
      setCurObj3d(selectedMesh[0]);
      setTransformControls(selectedMesh);
    });
    return () => {
      getDivElement().removeEventListener("click", () => {
      });
    };
  }, []);
  function sceneDiv(object3D) {
    return object3D && /* @__PURE__ */ jsxRuntimeExports.jsx(
      ListGroup$1.Item,
      {
        as: "button",
        className: `d-flex justify-content-between ${object3D.userData.isSelected ? "text-warning" : ""} `,
        onClick: () => {
          resetTextWarning(object3D);
          if (object3D.isScene || object3D.isCamera) {
            if (object3D.isScene) {
              object3D.userData.isSelected = !object3D.userData.isSelected;
              setScene(object3D);
              dispatchScene({
                type: "setScene",
                payload: object3D
              });
            }
            if (object3D.isCamera) {
              object3D.userData.isSelected = !object3D.userData.isSelected;
              _setCamera(object3D);
            }
          }
          setCurObj3d(object3D);
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          object3D.isCamera ? /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: setClassName("camera-reels") }) : /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: setClassName("box2") }),
          SPACE,
          getObjectNameByName(object3D)
        ] })
      }
    );
  }
  function resetTextWarning(targetItem, _children = scene.payload.children) {
    if (!targetItem.isCamera || !targetItem.isScene) {
      const scene2 = getScene();
      const camera2 = getCamera();
      scene2.userData.isSelected = false;
      camera2.userData.isSelected = false;
      _setCamera(camera2);
      setCamera(camera2);
      dispatchScene({
        type: "setScene",
        payload: scene2
      });
    }
    if (_children === undefined) {
      return;
    }
    return _children.map((item) => {
      if (item.uuid === targetItem.uuid) {
        item.userData.isSelected = true;
      } else {
        item.userData.isSelected = false;
      }
      if (item.children.length > 0) {
        if (item.uuid === targetItem.uuid) {
          item.userData.isSelected = true;
        } else {
          item.userData.isSelected = false;
        }
        resetTextWarning(targetItem, item.children);
      }
      return item;
    });
  }
  function setD2(children, show = true) {
    return children.map((item) => {
      item.userData.show = show;
      if (item.children.length > 0) {
        setD2(item.children, false);
      }
      return item;
    });
  }
  const lightList = [];
  const meshList = [];
  const array = scene.payload.children;
  for (let index = 0; index < array.length; index++) {
    const element = array[index];
    if (element.isLight) {
      lightList.push(element);
    } else {
      meshList.push(element);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Accordion$1, { defaultActiveKey: ["0", "1"], alwaysOpen: true, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Accordion$1.Item, { eventKey: "0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Accordion$1.Header, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: setClassName("archive") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2", children: "大纲视图" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Accordion$1.Body, { className: "outline-view", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card$1, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card$1.Header, { className: "text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: setClassName("camera-reels") }),
            " 相机"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Card$1.Body, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(ListGroup$1, { children: [
            " ",
            sceneDiv(camera)
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card$1, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card$1.Header, { className: "text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: setClassName("box2") }),
            " 场景"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Card$1.Body, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(ListGroup$1, { children: sceneDiv(getScene()) }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card$1, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card$1.Header, { className: "text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: setClassName("lightbulb") }),
            " 灯光"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Card$1.Body, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(ListGroup$1, { className: "da-gang", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            TreeList,
            {
              setCurObj3d,
              resetTextWarning,
              data: lightList
            }
          ) }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card$1, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card$1.Header, { className: "text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: setClassName("box") }),
            " 模型"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Card$1.Body, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(ListGroup$1, { className: "da-gang", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            TreeList,
            {
              setCurObj3d,
              resetTextWarning,
              data: meshList
            }
          ) }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ObjectProperty, { curObj3d })
  ] });
}

const {memo,useContext,useEffect,useRef} = await importShared('react');
function EditorViewer3d() {
  const editorCanvas = useRef(null);
  const { dispatchScene } = useContext(MyContext);
  useEffect(() => {
    if (editorCanvas.current) {
      createScene(editorCanvas.current);
    }
    dispatchScene({
      type: "setScene",
      payload: getScene().clone()
    });
    window.addEventListener(
      "resize",
      () => onWindowResize(editorCanvas, getCamera(), getRenderer())
    );
    return () => {
      editorCanvas.current?.children[0].remove();
      window.removeEventListener(
        "resize",
        () => onWindowResize(editorCanvas, getCamera(), getRenderer())
      );
    };
  }, []);
  const buttonColor = getThemeColor();
  function setMode(modeName) {
    const transfControls = getTransfControls();
    transfControls.setMode(modeName);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "position-relative", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: "70vh" }, ref: editorCanvas }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "position-absolute", style: { left: "1rem", top: "1rem" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(ButtonGroup, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: buttonColor,
          title: "移动",
          onClick: () => {
            setMode("translate");
          },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "bi bi-arrows-move" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: buttonColor,
          title: "旋转",
          onClick: () => {
            setMode("rotate");
          },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "bi bi-arrow-repeat" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: buttonColor,
          title: "缩放",
          onClick: () => {
            setMode("scale");
          },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "bi bi-arrows-angle-expand" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: buttonColor,
          title: "顶视",
          onClick: () => {
            setCameraType("OrthographicCamera", new Vector3(0, 1, 0));
          },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "bi bi-align-top" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: buttonColor,
          title: "前视",
          onClick: () => {
            setCameraType("OrthographicCamera", new Vector3(0, 0, 1));
          },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "bi bi-align-middle" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: buttonColor,
          title: "左视",
          onClick: () => {
            setCameraType("OrthographicCamera", new Vector3(1, 0, 0));
          },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "bi bi-align-start" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: buttonColor,
          title: "透视",
          onClick: () => {
            setCameraType("PerspectiveCamera", Object3D.DEFAULT_UP);
          },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: setClassName("box") })
        }
      )
    ] }) })
  ] });
}
const EditorViewer3d$1 = memo(EditorViewer3d);

function Index() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Container, { fluid: true, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(EditorTop, {}) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Row, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Col, { xl: 10, style: { margin: 0, padding: 0 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(EditorViewer3d$1, {}) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Col, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(BottomNav, {}) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Col,
        {
          xl: 2,
          style: { margin: 0, padding: 0 },
          className: "my-card-body ",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(OutlineView, {})
        }
      )
    ] })
  ] }) });
}

const React = await importShared('react');
const Route = createRootRoute({
  component: RootComponent
});
function RootComponent() {
  const [scene, dispatchScene] = React.useReducer(reducerScene, initScene);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(MyContext.Provider, { value: { scene, dispatchScene }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Index, {}) });
}

const MarkLazyImport = createFileRoute("/mark")();
const AddMeshLazyImport = createFileRoute("/addMesh")();
const AboutLazyImport = createFileRoute("/about")();
const IndexLazyImport = createFileRoute("/")();
const MarkLazyRoute = MarkLazyImport.update({
  id: "/mark",
  path: "/mark",
  getParentRoute: () => Route
}).lazy(() => __vitePreload(() => import('./mark.lazy-47e0wsl8.js'),true?[]:undefined).then((d) => d.Route));
const AddMeshLazyRoute = AddMeshLazyImport.update({
  id: "/addMesh",
  path: "/addMesh",
  getParentRoute: () => Route
}).lazy(() => __vitePreload(() => import('./addMesh.lazy-BJvJ6WN-.js'),true?[]:undefined).then((d) => d.Route));
const AboutLazyRoute = AboutLazyImport.update({
  id: "/about",
  path: "/about",
  getParentRoute: () => Route
}).lazy(() => __vitePreload(() => import('./about.lazy-d9mAyZcM.js'),true?[]:undefined).then((d) => d.Route));
const IndexLazyRoute = IndexLazyImport.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route
}).lazy(() => __vitePreload(() => import('./index.lazy-B7-VQJs_.js'),true?[]:undefined).then((d) => d.Route));
const rootRouteChildren = {
  IndexLazyRoute,
  AboutLazyRoute,
  AddMeshLazyRoute,
  MarkLazyRoute
};
const routeTree = Route._addFileChildren(rootRouteChildren)._addFileTypes();

const {StrictMode} = await importShared('react');
const router = createRouter({ routeTree });
const rootElement = document.getElementById("root");
if (!rootElement.innerHTML) {
  const root = ReactDOM$3.createRoot(rootElement);
  root.render(
    /* @__PURE__ */ jsxRuntimeExports.jsx(StrictMode, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(RouterProvider, { router }) })
  );
}

export { AlertBase as A, Button as B, Card$1 as C, Form$1 as F, Image$1 as I, ListGroup$1 as L, MyContext as M, Toast3d as T, ButtonGroup as a, ListGroupItem as b, createLazyFileRoute as c, classNames as d, getButtonColor as e, InputGroup$1 as f, getThemeColor as g, ListCard as h, map as m, setClassName as s, testData2 as t, useBootstrapPrefix as u };
