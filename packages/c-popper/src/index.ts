import { filterUndefined } from '@chakra-ui/utils';
import { ref, onUnmounted, onBeforeUpdate, onMounted, nextTick, watch } from 'vue';
import { popperGenerator, eventListeners, arrow, offset, flip, preventOverflow, popperOffsets, computeStyles, applyStyles } from '@popperjs/core';

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

var toVar = function toVar(value, fallback) {
  return {
    "var": value,
    varRef: fallback ? "var(" + value + ", " + fallback + ")" : "var(" + value + ")"
  };
};

var popperCSSVars = {
  arrowShadowColor: toVar("--popper-arrow-shadow-color"),
  arrowSize: toVar("--popper-arrow-size", "8px"),
  arrowSizeHalf: toVar("--popper-arrow-size-half"),
  arrowBg: toVar("--popper-arrow-bg"),
  transformOrigin: toVar("--popper-transform-origin"),
  arrowOffset: toVar("--popper-arrow-offset")
};
function getBoxShadow(placement) {
  if (placement.includes("top")) return "1px 1px 1px 0 var(--popper-arrow-shadow-color)";
  if (placement.includes("bottom")) return "-1px -1px 1px 0 var(--popper-arrow-shadow-color)";
  if (placement.includes("right")) return "-1px 1px 1px 0 var(--popper-arrow-shadow-color)";
  if (placement.includes("left")) return "1px -1px 1px 0 var(--popper-arrow-shadow-color)";
}
var transforms = {
  top: "bottom center",
  "top-start": "bottom left",
  "top-end": "bottom right",
  bottom: "top center",
  "bottom-start": "top left",
  "bottom-end": "top right",
  left: "right center",
  "left-start": "right top",
  "left-end": "right bottom",
  right: "left center",
  "right-start": "left top",
  "right-end": "left bottom"
};
var toTransformOrigin = function toTransformOrigin(placement) {
  return transforms[placement];
};
var defaultEventListeners = {
  scroll: true,
  resize: true
};
function getEventListenerOptions(value) {
  var eventListeners;

  if (typeof value === "object") {
    eventListeners = {
      enabled: true,
      options: Object.assign(defaultEventListeners, value)
    };
  } else {
    eventListeners = {
      enabled: value,
      options: defaultEventListeners
    };
  }

  return eventListeners;
}

/* -------------------------------------------------------------------------------------------------
 The match width modifier sets the popper width to match the reference.
 It us useful for custom selects, autocomplete, etc.
* -----------------------------------------------------------------------------------------------*/

var matchWidth = {
  name: "matchWidth",
  enabled: true,
  phase: "beforeWrite",
  requires: ["computeStyles"],
  fn: function fn(_ref) {
    var state = _ref.state;
    state.styles.popper.width = state.rects.reference.width + "px";
  },
  effect: function effect(_ref2) {
    var state = _ref2.state;
    return function () {
      var reference = state.elements.reference;
      state.elements.popper.style.width = reference.offsetWidth + "px";
    };
  }
};
/* -------------------------------------------------------------------------------------------------
  The transform origin modifier sets the css `transformOrigin` value of the popper
  based on the dynamic placement state of the popper.
  
  Useful when we need to animate/transition the popper.
* -----------------------------------------------------------------------------------------------*/

var transformOrigin = {
  name: "transformOrigin",
  enabled: true,
  phase: "write",
  fn: function fn(_ref3) {
    var state = _ref3.state;
    setTransformOrigin(state);
  },
  effect: function effect(_ref4) {
    var state = _ref4.state;
    return function () {
      setTransformOrigin(state);
    };
  }
};

var setTransformOrigin = function setTransformOrigin(state) {
  state.elements.popper.style.setProperty(popperCSSVars.transformOrigin["var"], toTransformOrigin(state.placement));
};
/* -------------------------------------------------------------------------------------------------
  The position arrow modifier adds width, height and overrides the `top/left/right/bottom`
  styles generated by popper.js to properly position the arrow
* -----------------------------------------------------------------------------------------------*/


var positionArrow = {
  name: "positionArrow",
  enabled: true,
  phase: "afterWrite",
  fn: function fn(_ref5) {
    var state = _ref5.state;
    setArrowStyles(state);
  }
};

var setArrowStyles = function setArrowStyles(state) {
  var _state$elements;

  if (!state.placement) return;
  var overrides = getArrowStyle(state.placement);

  if ((_state$elements = state.elements) != null && _state$elements.arrow && overrides) {
    var _Object$assign, _vars;

    Object.assign(state.elements.arrow.style, (_Object$assign = {}, _Object$assign[overrides.property] = overrides.value, _Object$assign.width = popperCSSVars.arrowSize.varRef, _Object$assign.height = popperCSSVars.arrowSize.varRef, _Object$assign.zIndex = -1, _Object$assign));
    var vars = (_vars = {}, _vars[popperCSSVars.arrowSizeHalf["var"]] = "calc(" + popperCSSVars.arrowSize.varRef + " / 2)", _vars[popperCSSVars.arrowOffset["var"]] = "calc(" + popperCSSVars.arrowSizeHalf.varRef + " * -1)", _vars);

    for (var property in vars) {
      state.elements.arrow.style.setProperty(property, vars[property]);
    }
  }
};

var getArrowStyle = function getArrowStyle(placement) {
  if (placement.startsWith("top")) {
    return {
      property: "bottom",
      value: popperCSSVars.arrowOffset.varRef
    };
  }

  if (placement.startsWith("bottom")) {
    return {
      property: "top",
      value: popperCSSVars.arrowOffset.varRef
    };
  }

  if (placement.startsWith("left")) {
    return {
      property: "right",
      value: popperCSSVars.arrowOffset.varRef
    };
  }

  if (placement.startsWith("right")) {
    return {
      property: "left",
      value: popperCSSVars.arrowOffset.varRef
    };
  }
};
/* -------------------------------------------------------------------------------------------------
  The inner arrow modifier, sets the placement styles for the inner arrow that forms
  the popper arrow tip.
* -----------------------------------------------------------------------------------------------*/


var innerArrow = {
  name: "innerArrow",
  enabled: true,
  phase: "main",
  requires: ["arrow"],
  fn: function fn(_ref6) {
    var state = _ref6.state;
    setInnerArrowStyles(state);
  },
  effect: function effect(_ref7) {
    var state = _ref7.state;
    return function () {
      setInnerArrowStyles(state);
    };
  }
};

var setInnerArrowStyles = function setInnerArrowStyles(state) {
  if (!state.elements.arrow) return;
  var inner = state.elements.arrow.querySelector("[data-popper-arrow-inner]");
  if (!inner) return;
  Object.assign(inner.style, {
    transform: "rotate(45deg)",
    background: popperCSSVars.arrowBg.varRef,
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    position: "absolute",
    zIndex: "inherit",
    boxShadow: getBoxShadow(state.placement)
  });
};

/* -------------------------------------------------------------------------------------------------
  We're initializing our own `createPopper` function with our opinionated defaults to
  keep the bundle size low.

  @see https://popper.js.org/docs/v2/tree-shaking/
* -----------------------------------------------------------------------------------------------*/

var defaultModifiers = [eventListeners, popperOffsets, computeStyles, applyStyles];
function createPopperFn(options) {
  var _options$offset;

  return popperGenerator({
    defaultOptions: {
      placement: "bottom",
      strategy: "absolute",
      modifiers: []
    },
    defaultModifiers: [].concat(defaultModifiers, [positionArrow, innerArrow, transformOrigin, _extends({}, eventListeners, getEventListenerOptions(options.eventListeners)), _extends({}, arrow, {
      options: {
        padding: options.arrowPadding
      }
    }), _extends({}, offset, {
      options: {
        offset: (_options$offset = options.offset) != null ? _options$offset : [0, options.gutter]
      }
    }), _extends({}, flip, {
      enabled: !!options.flip,
      options: {
        padding: 8
      }
    }), _extends({}, preventOverflow, {
      enabled: !!options.preventOverflow,
      options: {
        boundary: options.boundary || "clippingParents"
      }
    }), _extends({}, matchWidth, {
      enabled: !!options.matchWidth
    })])
  });
}

var defaultProps = {
  placement: "bottom",
  strategy: "absolute",
  flip: true,
  gutter: 8,
  arrowPadding: 8,
  preventOverflow: true,
  eventListeners: true,
  modifiers: []
};
function usePopper(props) {
  var _popperInstance$value2, _popperInstance$value3;

  if (props === void 0) {
    props = {};
  }

  var options = _extends({}, defaultProps, filterUndefined(props));

  var _options$modifiers = options.modifiers,
      modifiers = _options$modifiers === void 0 ? [] : _options$modifiers,
      placement = options.placement,
      strategy = options.strategy;
  var createPopper = ref(createPopperFn(options));

  var _reference = ref(null);

  var _popper = ref(null);

  var popperInstance = ref(null); // cleanup previous instance handler

  var cleanup = ref(function () {});
  var unsubscribe;
  onUnmounted(function () {
    var _popperInstance$value;

    (_popperInstance$value = popperInstance.value) == null ? void 0 : _popperInstance$value.destroy();
    popperInstance.value = null;
    unsubscribe == null ? void 0 : unsubscribe();
  });

  var setup = function setup() {
    nextTick().then(function () {
      if (!_reference.value || !_popper.value) return;
      cleanup.value == null ? void 0 : cleanup.value();
      popperInstance.value = createPopper.value(_reference.value, _popper.value, {
        placement: placement,
        modifiers: modifiers,
        strategy: strategy
      });
      popperInstance.value.forceUpdate();
      cleanup.value = popperInstance.value.destroy;
    });
  };

  onBeforeUpdate(function () {
    // clear refs
    _reference.value = null;
    _popper.value = null;
  });
  onMounted(function () {
    nextTick().then(function () {
      unsubscribe = watch(function () {
        return [_reference, _popper];
      }, setup, {
        immediate: true,
        flush: "post"
      });
    });
  });
  return {
    update: (_popperInstance$value2 = popperInstance.value) == null ? void 0 : _popperInstance$value2.update,
    forceUpdate: (_popperInstance$value3 = popperInstance.value) == null ? void 0 : _popperInstance$value3.forceUpdate,
    reference: function reference(el) {
      if (el) {
        _reference.value = el.$el || el;
        setup();
      }
    },
    referenceEl: _reference,
    popper: function popper(el) {
      if (el) {
        _popper.value = el.$el || el;
        setup();
      }
    },
    popperEl: _popper
  };
}

export { popperCSSVars, usePopper };
