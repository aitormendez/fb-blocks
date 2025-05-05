/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@floating-ui/core/dist/floating-ui.core.mjs":
/*!******************************************************************!*\
  !*** ./node_modules/@floating-ui/core/dist/floating-ui.core.mjs ***!
  \******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   arrow: () => (/* binding */ arrow),
/* harmony export */   autoPlacement: () => (/* binding */ autoPlacement),
/* harmony export */   computePosition: () => (/* binding */ computePosition),
/* harmony export */   detectOverflow: () => (/* binding */ detectOverflow),
/* harmony export */   flip: () => (/* binding */ flip),
/* harmony export */   hide: () => (/* binding */ hide),
/* harmony export */   inline: () => (/* binding */ inline),
/* harmony export */   limitShift: () => (/* binding */ limitShift),
/* harmony export */   offset: () => (/* binding */ offset),
/* harmony export */   rectToClientRect: () => (/* reexport safe */ _floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.rectToClientRect),
/* harmony export */   shift: () => (/* binding */ shift),
/* harmony export */   size: () => (/* binding */ size)
/* harmony export */ });
/* harmony import */ var _floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @floating-ui/utils */ "./node_modules/@floating-ui/utils/dist/floating-ui.utils.mjs");



function computeCoordsFromPlacement(_ref, placement, rtl) {
  let {
    reference,
    floating
  } = _ref;
  const sideAxis = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSideAxis)(placement);
  const alignmentAxis = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignmentAxis)(placement);
  const alignLength = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAxisLength)(alignmentAxis);
  const side = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(placement);
  const isVertical = sideAxis === 'y';
  const commonX = reference.x + reference.width / 2 - floating.width / 2;
  const commonY = reference.y + reference.height / 2 - floating.height / 2;
  const commonAlign = reference[alignLength] / 2 - floating[alignLength] / 2;
  let coords;
  switch (side) {
    case 'top':
      coords = {
        x: commonX,
        y: reference.y - floating.height
      };
      break;
    case 'bottom':
      coords = {
        x: commonX,
        y: reference.y + reference.height
      };
      break;
    case 'right':
      coords = {
        x: reference.x + reference.width,
        y: commonY
      };
      break;
    case 'left':
      coords = {
        x: reference.x - floating.width,
        y: commonY
      };
      break;
    default:
      coords = {
        x: reference.x,
        y: reference.y
      };
  }
  switch ((0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignment)(placement)) {
    case 'start':
      coords[alignmentAxis] -= commonAlign * (rtl && isVertical ? -1 : 1);
      break;
    case 'end':
      coords[alignmentAxis] += commonAlign * (rtl && isVertical ? -1 : 1);
      break;
  }
  return coords;
}

/**
 * Computes the `x` and `y` coordinates that will place the floating element
 * next to a given reference element.
 *
 * This export does not have any `platform` interface logic. You will need to
 * write one for the platform you are using Floating UI with.
 */
const computePosition = async (reference, floating, config) => {
  const {
    placement = 'bottom',
    strategy = 'absolute',
    middleware = [],
    platform
  } = config;
  const validMiddleware = middleware.filter(Boolean);
  const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(floating));
  let rects = await platform.getElementRects({
    reference,
    floating,
    strategy
  });
  let {
    x,
    y
  } = computeCoordsFromPlacement(rects, placement, rtl);
  let statefulPlacement = placement;
  let middlewareData = {};
  let resetCount = 0;
  for (let i = 0; i < validMiddleware.length; i++) {
    const {
      name,
      fn
    } = validMiddleware[i];
    const {
      x: nextX,
      y: nextY,
      data,
      reset
    } = await fn({
      x,
      y,
      initialPlacement: placement,
      placement: statefulPlacement,
      strategy,
      middlewareData,
      rects,
      platform,
      elements: {
        reference,
        floating
      }
    });
    x = nextX != null ? nextX : x;
    y = nextY != null ? nextY : y;
    middlewareData = {
      ...middlewareData,
      [name]: {
        ...middlewareData[name],
        ...data
      }
    };
    if (reset && resetCount <= 50) {
      resetCount++;
      if (typeof reset === 'object') {
        if (reset.placement) {
          statefulPlacement = reset.placement;
        }
        if (reset.rects) {
          rects = reset.rects === true ? await platform.getElementRects({
            reference,
            floating,
            strategy
          }) : reset.rects;
        }
        ({
          x,
          y
        } = computeCoordsFromPlacement(rects, statefulPlacement, rtl));
      }
      i = -1;
    }
  }
  return {
    x,
    y,
    placement: statefulPlacement,
    strategy,
    middlewareData
  };
};

/**
 * Resolves with an object of overflow side offsets that determine how much the
 * element is overflowing a given clipping boundary on each side.
 * - positive = overflowing the boundary by that number of pixels
 * - negative = how many pixels left before it will overflow
 * - 0 = lies flush with the boundary
 * @see https://floating-ui.com/docs/detectOverflow
 */
async function detectOverflow(state, options) {
  var _await$platform$isEle;
  if (options === void 0) {
    options = {};
  }
  const {
    x,
    y,
    platform,
    rects,
    elements,
    strategy
  } = state;
  const {
    boundary = 'clippingAncestors',
    rootBoundary = 'viewport',
    elementContext = 'floating',
    altBoundary = false,
    padding = 0
  } = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(options, state);
  const paddingObject = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getPaddingObject)(padding);
  const altContext = elementContext === 'floating' ? 'reference' : 'floating';
  const element = elements[altBoundary ? altContext : elementContext];
  const clippingClientRect = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.rectToClientRect)(await platform.getClippingRect({
    element: ((_await$platform$isEle = await (platform.isElement == null ? void 0 : platform.isElement(element))) != null ? _await$platform$isEle : true) ? element : element.contextElement || (await (platform.getDocumentElement == null ? void 0 : platform.getDocumentElement(elements.floating))),
    boundary,
    rootBoundary,
    strategy
  }));
  const rect = elementContext === 'floating' ? {
    x,
    y,
    width: rects.floating.width,
    height: rects.floating.height
  } : rects.reference;
  const offsetParent = await (platform.getOffsetParent == null ? void 0 : platform.getOffsetParent(elements.floating));
  const offsetScale = (await (platform.isElement == null ? void 0 : platform.isElement(offsetParent))) ? (await (platform.getScale == null ? void 0 : platform.getScale(offsetParent))) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  };
  const elementClientRect = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.rectToClientRect)(platform.convertOffsetParentRelativeRectToViewportRelativeRect ? await platform.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements,
    rect,
    offsetParent,
    strategy
  }) : rect);
  return {
    top: (clippingClientRect.top - elementClientRect.top + paddingObject.top) / offsetScale.y,
    bottom: (elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom) / offsetScale.y,
    left: (clippingClientRect.left - elementClientRect.left + paddingObject.left) / offsetScale.x,
    right: (elementClientRect.right - clippingClientRect.right + paddingObject.right) / offsetScale.x
  };
}

/**
 * Provides data to position an inner element of the floating element so that it
 * appears centered to the reference element.
 * @see https://floating-ui.com/docs/arrow
 */
const arrow = options => ({
  name: 'arrow',
  options,
  async fn(state) {
    const {
      x,
      y,
      placement,
      rects,
      platform,
      elements,
      middlewareData
    } = state;
    // Since `element` is required, we don't Partial<> the type.
    const {
      element,
      padding = 0
    } = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(options, state) || {};
    if (element == null) {
      return {};
    }
    const paddingObject = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getPaddingObject)(padding);
    const coords = {
      x,
      y
    };
    const axis = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignmentAxis)(placement);
    const length = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAxisLength)(axis);
    const arrowDimensions = await platform.getDimensions(element);
    const isYAxis = axis === 'y';
    const minProp = isYAxis ? 'top' : 'left';
    const maxProp = isYAxis ? 'bottom' : 'right';
    const clientProp = isYAxis ? 'clientHeight' : 'clientWidth';
    const endDiff = rects.reference[length] + rects.reference[axis] - coords[axis] - rects.floating[length];
    const startDiff = coords[axis] - rects.reference[axis];
    const arrowOffsetParent = await (platform.getOffsetParent == null ? void 0 : platform.getOffsetParent(element));
    let clientSize = arrowOffsetParent ? arrowOffsetParent[clientProp] : 0;

    // DOM platform can return `window` as the `offsetParent`.
    if (!clientSize || !(await (platform.isElement == null ? void 0 : platform.isElement(arrowOffsetParent)))) {
      clientSize = elements.floating[clientProp] || rects.floating[length];
    }
    const centerToReference = endDiff / 2 - startDiff / 2;

    // If the padding is large enough that it causes the arrow to no longer be
    // centered, modify the padding so that it is centered.
    const largestPossiblePadding = clientSize / 2 - arrowDimensions[length] / 2 - 1;
    const minPadding = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.min)(paddingObject[minProp], largestPossiblePadding);
    const maxPadding = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.min)(paddingObject[maxProp], largestPossiblePadding);

    // Make sure the arrow doesn't overflow the floating element if the center
    // point is outside the floating element's bounds.
    const min$1 = minPadding;
    const max = clientSize - arrowDimensions[length] - maxPadding;
    const center = clientSize / 2 - arrowDimensions[length] / 2 + centerToReference;
    const offset = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.clamp)(min$1, center, max);

    // If the reference is small enough that the arrow's padding causes it to
    // to point to nothing for an aligned placement, adjust the offset of the
    // floating element itself. To ensure `shift()` continues to take action,
    // a single reset is performed when this is true.
    const shouldAddOffset = !middlewareData.arrow && (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignment)(placement) != null && center !== offset && rects.reference[length] / 2 - (center < min$1 ? minPadding : maxPadding) - arrowDimensions[length] / 2 < 0;
    const alignmentOffset = shouldAddOffset ? center < min$1 ? center - min$1 : center - max : 0;
    return {
      [axis]: coords[axis] + alignmentOffset,
      data: {
        [axis]: offset,
        centerOffset: center - offset - alignmentOffset,
        ...(shouldAddOffset && {
          alignmentOffset
        })
      },
      reset: shouldAddOffset
    };
  }
});

function getPlacementList(alignment, autoAlignment, allowedPlacements) {
  const allowedPlacementsSortedByAlignment = alignment ? [...allowedPlacements.filter(placement => (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignment)(placement) === alignment), ...allowedPlacements.filter(placement => (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignment)(placement) !== alignment)] : allowedPlacements.filter(placement => (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(placement) === placement);
  return allowedPlacementsSortedByAlignment.filter(placement => {
    if (alignment) {
      return (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignment)(placement) === alignment || (autoAlignment ? (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getOppositeAlignmentPlacement)(placement) !== placement : false);
    }
    return true;
  });
}
/**
 * Optimizes the visibility of the floating element by choosing the placement
 * that has the most space available automatically, without needing to specify a
 * preferred placement. Alternative to `flip`.
 * @see https://floating-ui.com/docs/autoPlacement
 */
const autoPlacement = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: 'autoPlacement',
    options,
    async fn(state) {
      var _middlewareData$autoP, _middlewareData$autoP2, _placementsThatFitOnE;
      const {
        rects,
        middlewareData,
        placement,
        platform,
        elements
      } = state;
      const {
        crossAxis = false,
        alignment,
        allowedPlacements = _floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.placements,
        autoAlignment = true,
        ...detectOverflowOptions
      } = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(options, state);
      const placements$1 = alignment !== undefined || allowedPlacements === _floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.placements ? getPlacementList(alignment || null, autoAlignment, allowedPlacements) : allowedPlacements;
      const overflow = await detectOverflow(state, detectOverflowOptions);
      const currentIndex = ((_middlewareData$autoP = middlewareData.autoPlacement) == null ? void 0 : _middlewareData$autoP.index) || 0;
      const currentPlacement = placements$1[currentIndex];
      if (currentPlacement == null) {
        return {};
      }
      const alignmentSides = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignmentSides)(currentPlacement, rects, await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating)));

      // Make `computeCoords` start from the right place.
      if (placement !== currentPlacement) {
        return {
          reset: {
            placement: placements$1[0]
          }
        };
      }
      const currentOverflows = [overflow[(0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(currentPlacement)], overflow[alignmentSides[0]], overflow[alignmentSides[1]]];
      const allOverflows = [...(((_middlewareData$autoP2 = middlewareData.autoPlacement) == null ? void 0 : _middlewareData$autoP2.overflows) || []), {
        placement: currentPlacement,
        overflows: currentOverflows
      }];
      const nextPlacement = placements$1[currentIndex + 1];

      // There are more placements to check.
      if (nextPlacement) {
        return {
          data: {
            index: currentIndex + 1,
            overflows: allOverflows
          },
          reset: {
            placement: nextPlacement
          }
        };
      }
      const placementsSortedByMostSpace = allOverflows.map(d => {
        const alignment = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignment)(d.placement);
        return [d.placement, alignment && crossAxis ?
        // Check along the mainAxis and main crossAxis side.
        d.overflows.slice(0, 2).reduce((acc, v) => acc + v, 0) :
        // Check only the mainAxis.
        d.overflows[0], d.overflows];
      }).sort((a, b) => a[1] - b[1]);
      const placementsThatFitOnEachSide = placementsSortedByMostSpace.filter(d => d[2].slice(0,
      // Aligned placements should not check their opposite crossAxis
      // side.
      (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignment)(d[0]) ? 2 : 3).every(v => v <= 0));
      const resetPlacement = ((_placementsThatFitOnE = placementsThatFitOnEachSide[0]) == null ? void 0 : _placementsThatFitOnE[0]) || placementsSortedByMostSpace[0][0];
      if (resetPlacement !== placement) {
        return {
          data: {
            index: currentIndex + 1,
            overflows: allOverflows
          },
          reset: {
            placement: resetPlacement
          }
        };
      }
      return {};
    }
  };
};

/**
 * Optimizes the visibility of the floating element by flipping the `placement`
 * in order to keep it in view when the preferred placement(s) will overflow the
 * clipping boundary. Alternative to `autoPlacement`.
 * @see https://floating-ui.com/docs/flip
 */
const flip = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: 'flip',
    options,
    async fn(state) {
      var _middlewareData$arrow, _middlewareData$flip;
      const {
        placement,
        middlewareData,
        rects,
        initialPlacement,
        platform,
        elements
      } = state;
      const {
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = true,
        fallbackPlacements: specifiedFallbackPlacements,
        fallbackStrategy = 'bestFit',
        fallbackAxisSideDirection = 'none',
        flipAlignment = true,
        ...detectOverflowOptions
      } = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(options, state);

      // If a reset by the arrow was caused due to an alignment offset being
      // added, we should skip any logic now since `flip()` has already done its
      // work.
      // https://github.com/floating-ui/floating-ui/issues/2549#issuecomment-1719601643
      if ((_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) {
        return {};
      }
      const side = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(placement);
      const initialSideAxis = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSideAxis)(initialPlacement);
      const isBasePlacement = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(initialPlacement) === initialPlacement;
      const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating));
      const fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipAlignment ? [(0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getOppositePlacement)(initialPlacement)] : (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getExpandedPlacements)(initialPlacement));
      const hasFallbackAxisSideDirection = fallbackAxisSideDirection !== 'none';
      if (!specifiedFallbackPlacements && hasFallbackAxisSideDirection) {
        fallbackPlacements.push(...(0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getOppositeAxisPlacements)(initialPlacement, flipAlignment, fallbackAxisSideDirection, rtl));
      }
      const placements = [initialPlacement, ...fallbackPlacements];
      const overflow = await detectOverflow(state, detectOverflowOptions);
      const overflows = [];
      let overflowsData = ((_middlewareData$flip = middlewareData.flip) == null ? void 0 : _middlewareData$flip.overflows) || [];
      if (checkMainAxis) {
        overflows.push(overflow[side]);
      }
      if (checkCrossAxis) {
        const sides = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignmentSides)(placement, rects, rtl);
        overflows.push(overflow[sides[0]], overflow[sides[1]]);
      }
      overflowsData = [...overflowsData, {
        placement,
        overflows
      }];

      // One or more sides is overflowing.
      if (!overflows.every(side => side <= 0)) {
        var _middlewareData$flip2, _overflowsData$filter;
        const nextIndex = (((_middlewareData$flip2 = middlewareData.flip) == null ? void 0 : _middlewareData$flip2.index) || 0) + 1;
        const nextPlacement = placements[nextIndex];
        if (nextPlacement) {
          // Try next placement and re-run the lifecycle.
          return {
            data: {
              index: nextIndex,
              overflows: overflowsData
            },
            reset: {
              placement: nextPlacement
            }
          };
        }

        // First, find the candidates that fit on the mainAxis side of overflow,
        // then find the placement that fits the best on the main crossAxis side.
        let resetPlacement = (_overflowsData$filter = overflowsData.filter(d => d.overflows[0] <= 0).sort((a, b) => a.overflows[1] - b.overflows[1])[0]) == null ? void 0 : _overflowsData$filter.placement;

        // Otherwise fallback.
        if (!resetPlacement) {
          switch (fallbackStrategy) {
            case 'bestFit':
              {
                var _overflowsData$filter2;
                const placement = (_overflowsData$filter2 = overflowsData.filter(d => {
                  if (hasFallbackAxisSideDirection) {
                    const currentSideAxis = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSideAxis)(d.placement);
                    return currentSideAxis === initialSideAxis ||
                    // Create a bias to the `y` side axis due to horizontal
                    // reading directions favoring greater width.
                    currentSideAxis === 'y';
                  }
                  return true;
                }).map(d => [d.placement, d.overflows.filter(overflow => overflow > 0).reduce((acc, overflow) => acc + overflow, 0)]).sort((a, b) => a[1] - b[1])[0]) == null ? void 0 : _overflowsData$filter2[0];
                if (placement) {
                  resetPlacement = placement;
                }
                break;
              }
            case 'initialPlacement':
              resetPlacement = initialPlacement;
              break;
          }
        }
        if (placement !== resetPlacement) {
          return {
            reset: {
              placement: resetPlacement
            }
          };
        }
      }
      return {};
    }
  };
};

function getSideOffsets(overflow, rect) {
  return {
    top: overflow.top - rect.height,
    right: overflow.right - rect.width,
    bottom: overflow.bottom - rect.height,
    left: overflow.left - rect.width
  };
}
function isAnySideFullyClipped(overflow) {
  return _floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.sides.some(side => overflow[side] >= 0);
}
/**
 * Provides data to hide the floating element in applicable situations, such as
 * when it is not in the same clipping context as the reference element.
 * @see https://floating-ui.com/docs/hide
 */
const hide = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: 'hide',
    options,
    async fn(state) {
      const {
        rects
      } = state;
      const {
        strategy = 'referenceHidden',
        ...detectOverflowOptions
      } = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(options, state);
      switch (strategy) {
        case 'referenceHidden':
          {
            const overflow = await detectOverflow(state, {
              ...detectOverflowOptions,
              elementContext: 'reference'
            });
            const offsets = getSideOffsets(overflow, rects.reference);
            return {
              data: {
                referenceHiddenOffsets: offsets,
                referenceHidden: isAnySideFullyClipped(offsets)
              }
            };
          }
        case 'escaped':
          {
            const overflow = await detectOverflow(state, {
              ...detectOverflowOptions,
              altBoundary: true
            });
            const offsets = getSideOffsets(overflow, rects.floating);
            return {
              data: {
                escapedOffsets: offsets,
                escaped: isAnySideFullyClipped(offsets)
              }
            };
          }
        default:
          {
            return {};
          }
      }
    }
  };
};

function getBoundingRect(rects) {
  const minX = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.min)(...rects.map(rect => rect.left));
  const minY = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.min)(...rects.map(rect => rect.top));
  const maxX = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.max)(...rects.map(rect => rect.right));
  const maxY = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.max)(...rects.map(rect => rect.bottom));
  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY
  };
}
function getRectsByLine(rects) {
  const sortedRects = rects.slice().sort((a, b) => a.y - b.y);
  const groups = [];
  let prevRect = null;
  for (let i = 0; i < sortedRects.length; i++) {
    const rect = sortedRects[i];
    if (!prevRect || rect.y - prevRect.y > prevRect.height / 2) {
      groups.push([rect]);
    } else {
      groups[groups.length - 1].push(rect);
    }
    prevRect = rect;
  }
  return groups.map(rect => (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.rectToClientRect)(getBoundingRect(rect)));
}
/**
 * Provides improved positioning for inline reference elements that can span
 * over multiple lines, such as hyperlinks or range selections.
 * @see https://floating-ui.com/docs/inline
 */
const inline = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: 'inline',
    options,
    async fn(state) {
      const {
        placement,
        elements,
        rects,
        platform,
        strategy
      } = state;
      // A MouseEvent's client{X,Y} coords can be up to 2 pixels off a
      // ClientRect's bounds, despite the event listener being triggered. A
      // padding of 2 seems to handle this issue.
      const {
        padding = 2,
        x,
        y
      } = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(options, state);
      const nativeClientRects = Array.from((await (platform.getClientRects == null ? void 0 : platform.getClientRects(elements.reference))) || []);
      const clientRects = getRectsByLine(nativeClientRects);
      const fallback = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.rectToClientRect)(getBoundingRect(nativeClientRects));
      const paddingObject = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getPaddingObject)(padding);
      function getBoundingClientRect() {
        // There are two rects and they are disjoined.
        if (clientRects.length === 2 && clientRects[0].left > clientRects[1].right && x != null && y != null) {
          // Find the first rect in which the point is fully inside.
          return clientRects.find(rect => x > rect.left - paddingObject.left && x < rect.right + paddingObject.right && y > rect.top - paddingObject.top && y < rect.bottom + paddingObject.bottom) || fallback;
        }

        // There are 2 or more connected rects.
        if (clientRects.length >= 2) {
          if ((0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSideAxis)(placement) === 'y') {
            const firstRect = clientRects[0];
            const lastRect = clientRects[clientRects.length - 1];
            const isTop = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(placement) === 'top';
            const top = firstRect.top;
            const bottom = lastRect.bottom;
            const left = isTop ? firstRect.left : lastRect.left;
            const right = isTop ? firstRect.right : lastRect.right;
            const width = right - left;
            const height = bottom - top;
            return {
              top,
              bottom,
              left,
              right,
              width,
              height,
              x: left,
              y: top
            };
          }
          const isLeftSide = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(placement) === 'left';
          const maxRight = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.max)(...clientRects.map(rect => rect.right));
          const minLeft = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.min)(...clientRects.map(rect => rect.left));
          const measureRects = clientRects.filter(rect => isLeftSide ? rect.left === minLeft : rect.right === maxRight);
          const top = measureRects[0].top;
          const bottom = measureRects[measureRects.length - 1].bottom;
          const left = minLeft;
          const right = maxRight;
          const width = right - left;
          const height = bottom - top;
          return {
            top,
            bottom,
            left,
            right,
            width,
            height,
            x: left,
            y: top
          };
        }
        return fallback;
      }
      const resetRects = await platform.getElementRects({
        reference: {
          getBoundingClientRect
        },
        floating: elements.floating,
        strategy
      });
      if (rects.reference.x !== resetRects.reference.x || rects.reference.y !== resetRects.reference.y || rects.reference.width !== resetRects.reference.width || rects.reference.height !== resetRects.reference.height) {
        return {
          reset: {
            rects: resetRects
          }
        };
      }
      return {};
    }
  };
};

// For type backwards-compatibility, the `OffsetOptions` type was also
// Derivable.

async function convertValueToCoords(state, options) {
  const {
    placement,
    platform,
    elements
  } = state;
  const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating));
  const side = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(placement);
  const alignment = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignment)(placement);
  const isVertical = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSideAxis)(placement) === 'y';
  const mainAxisMulti = ['left', 'top'].includes(side) ? -1 : 1;
  const crossAxisMulti = rtl && isVertical ? -1 : 1;
  const rawValue = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(options, state);

  // eslint-disable-next-line prefer-const
  let {
    mainAxis,
    crossAxis,
    alignmentAxis
  } = typeof rawValue === 'number' ? {
    mainAxis: rawValue,
    crossAxis: 0,
    alignmentAxis: null
  } : {
    mainAxis: rawValue.mainAxis || 0,
    crossAxis: rawValue.crossAxis || 0,
    alignmentAxis: rawValue.alignmentAxis
  };
  if (alignment && typeof alignmentAxis === 'number') {
    crossAxis = alignment === 'end' ? alignmentAxis * -1 : alignmentAxis;
  }
  return isVertical ? {
    x: crossAxis * crossAxisMulti,
    y: mainAxis * mainAxisMulti
  } : {
    x: mainAxis * mainAxisMulti,
    y: crossAxis * crossAxisMulti
  };
}

/**
 * Modifies the placement by translating the floating element along the
 * specified axes.
 * A number (shorthand for `mainAxis` or distance), or an axes configuration
 * object may be passed.
 * @see https://floating-ui.com/docs/offset
 */
const offset = function (options) {
  if (options === void 0) {
    options = 0;
  }
  return {
    name: 'offset',
    options,
    async fn(state) {
      var _middlewareData$offse, _middlewareData$arrow;
      const {
        x,
        y,
        placement,
        middlewareData
      } = state;
      const diffCoords = await convertValueToCoords(state, options);

      // If the placement is the same and the arrow caused an alignment offset
      // then we don't need to change the positioning coordinates.
      if (placement === ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse.placement) && (_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) {
        return {};
      }
      return {
        x: x + diffCoords.x,
        y: y + diffCoords.y,
        data: {
          ...diffCoords,
          placement
        }
      };
    }
  };
};

/**
 * Optimizes the visibility of the floating element by shifting it in order to
 * keep it in view when it will overflow the clipping boundary.
 * @see https://floating-ui.com/docs/shift
 */
const shift = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: 'shift',
    options,
    async fn(state) {
      const {
        x,
        y,
        placement
      } = state;
      const {
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = false,
        limiter = {
          fn: _ref => {
            let {
              x,
              y
            } = _ref;
            return {
              x,
              y
            };
          }
        },
        ...detectOverflowOptions
      } = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(options, state);
      const coords = {
        x,
        y
      };
      const overflow = await detectOverflow(state, detectOverflowOptions);
      const crossAxis = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSideAxis)((0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(placement));
      const mainAxis = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getOppositeAxis)(crossAxis);
      let mainAxisCoord = coords[mainAxis];
      let crossAxisCoord = coords[crossAxis];
      if (checkMainAxis) {
        const minSide = mainAxis === 'y' ? 'top' : 'left';
        const maxSide = mainAxis === 'y' ? 'bottom' : 'right';
        const min = mainAxisCoord + overflow[minSide];
        const max = mainAxisCoord - overflow[maxSide];
        mainAxisCoord = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.clamp)(min, mainAxisCoord, max);
      }
      if (checkCrossAxis) {
        const minSide = crossAxis === 'y' ? 'top' : 'left';
        const maxSide = crossAxis === 'y' ? 'bottom' : 'right';
        const min = crossAxisCoord + overflow[minSide];
        const max = crossAxisCoord - overflow[maxSide];
        crossAxisCoord = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.clamp)(min, crossAxisCoord, max);
      }
      const limitedCoords = limiter.fn({
        ...state,
        [mainAxis]: mainAxisCoord,
        [crossAxis]: crossAxisCoord
      });
      return {
        ...limitedCoords,
        data: {
          x: limitedCoords.x - x,
          y: limitedCoords.y - y,
          enabled: {
            [mainAxis]: checkMainAxis,
            [crossAxis]: checkCrossAxis
          }
        }
      };
    }
  };
};
/**
 * Built-in `limiter` that will stop `shift()` at a certain point.
 */
const limitShift = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    options,
    fn(state) {
      const {
        x,
        y,
        placement,
        rects,
        middlewareData
      } = state;
      const {
        offset = 0,
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = true
      } = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(options, state);
      const coords = {
        x,
        y
      };
      const crossAxis = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSideAxis)(placement);
      const mainAxis = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getOppositeAxis)(crossAxis);
      let mainAxisCoord = coords[mainAxis];
      let crossAxisCoord = coords[crossAxis];
      const rawOffset = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(offset, state);
      const computedOffset = typeof rawOffset === 'number' ? {
        mainAxis: rawOffset,
        crossAxis: 0
      } : {
        mainAxis: 0,
        crossAxis: 0,
        ...rawOffset
      };
      if (checkMainAxis) {
        const len = mainAxis === 'y' ? 'height' : 'width';
        const limitMin = rects.reference[mainAxis] - rects.floating[len] + computedOffset.mainAxis;
        const limitMax = rects.reference[mainAxis] + rects.reference[len] - computedOffset.mainAxis;
        if (mainAxisCoord < limitMin) {
          mainAxisCoord = limitMin;
        } else if (mainAxisCoord > limitMax) {
          mainAxisCoord = limitMax;
        }
      }
      if (checkCrossAxis) {
        var _middlewareData$offse, _middlewareData$offse2;
        const len = mainAxis === 'y' ? 'width' : 'height';
        const isOriginSide = ['top', 'left'].includes((0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(placement));
        const limitMin = rects.reference[crossAxis] - rects.floating[len] + (isOriginSide ? ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse[crossAxis]) || 0 : 0) + (isOriginSide ? 0 : computedOffset.crossAxis);
        const limitMax = rects.reference[crossAxis] + rects.reference[len] + (isOriginSide ? 0 : ((_middlewareData$offse2 = middlewareData.offset) == null ? void 0 : _middlewareData$offse2[crossAxis]) || 0) - (isOriginSide ? computedOffset.crossAxis : 0);
        if (crossAxisCoord < limitMin) {
          crossAxisCoord = limitMin;
        } else if (crossAxisCoord > limitMax) {
          crossAxisCoord = limitMax;
        }
      }
      return {
        [mainAxis]: mainAxisCoord,
        [crossAxis]: crossAxisCoord
      };
    }
  };
};

/**
 * Provides data that allows you to change the size of the floating element —
 * for instance, prevent it from overflowing the clipping boundary or match the
 * width of the reference element.
 * @see https://floating-ui.com/docs/size
 */
const size = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: 'size',
    options,
    async fn(state) {
      var _state$middlewareData, _state$middlewareData2;
      const {
        placement,
        rects,
        platform,
        elements
      } = state;
      const {
        apply = () => {},
        ...detectOverflowOptions
      } = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(options, state);
      const overflow = await detectOverflow(state, detectOverflowOptions);
      const side = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(placement);
      const alignment = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignment)(placement);
      const isYAxis = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSideAxis)(placement) === 'y';
      const {
        width,
        height
      } = rects.floating;
      let heightSide;
      let widthSide;
      if (side === 'top' || side === 'bottom') {
        heightSide = side;
        widthSide = alignment === ((await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating))) ? 'start' : 'end') ? 'left' : 'right';
      } else {
        widthSide = side;
        heightSide = alignment === 'end' ? 'top' : 'bottom';
      }
      const maximumClippingHeight = height - overflow.top - overflow.bottom;
      const maximumClippingWidth = width - overflow.left - overflow.right;
      const overflowAvailableHeight = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.min)(height - overflow[heightSide], maximumClippingHeight);
      const overflowAvailableWidth = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.min)(width - overflow[widthSide], maximumClippingWidth);
      const noShift = !state.middlewareData.shift;
      let availableHeight = overflowAvailableHeight;
      let availableWidth = overflowAvailableWidth;
      if ((_state$middlewareData = state.middlewareData.shift) != null && _state$middlewareData.enabled.x) {
        availableWidth = maximumClippingWidth;
      }
      if ((_state$middlewareData2 = state.middlewareData.shift) != null && _state$middlewareData2.enabled.y) {
        availableHeight = maximumClippingHeight;
      }
      if (noShift && !alignment) {
        const xMin = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.max)(overflow.left, 0);
        const xMax = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.max)(overflow.right, 0);
        const yMin = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.max)(overflow.top, 0);
        const yMax = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.max)(overflow.bottom, 0);
        if (isYAxis) {
          availableWidth = width - 2 * (xMin !== 0 || xMax !== 0 ? xMin + xMax : (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.max)(overflow.left, overflow.right));
        } else {
          availableHeight = height - 2 * (yMin !== 0 || yMax !== 0 ? yMin + yMax : (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.max)(overflow.top, overflow.bottom));
        }
      }
      await apply({
        ...state,
        availableWidth,
        availableHeight
      });
      const nextDimensions = await platform.getDimensions(elements.floating);
      if (width !== nextDimensions.width || height !== nextDimensions.height) {
        return {
          reset: {
            rects: true
          }
        };
      }
      return {};
    }
  };
};




/***/ }),

/***/ "./node_modules/@floating-ui/dom/dist/floating-ui.dom.mjs":
/*!****************************************************************!*\
  !*** ./node_modules/@floating-ui/dom/dist/floating-ui.dom.mjs ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   arrow: () => (/* binding */ arrow),
/* harmony export */   autoPlacement: () => (/* binding */ autoPlacement),
/* harmony export */   autoUpdate: () => (/* binding */ autoUpdate),
/* harmony export */   computePosition: () => (/* binding */ computePosition),
/* harmony export */   detectOverflow: () => (/* binding */ detectOverflow),
/* harmony export */   flip: () => (/* binding */ flip),
/* harmony export */   getOverflowAncestors: () => (/* reexport safe */ _floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getOverflowAncestors),
/* harmony export */   hide: () => (/* binding */ hide),
/* harmony export */   inline: () => (/* binding */ inline),
/* harmony export */   limitShift: () => (/* binding */ limitShift),
/* harmony export */   offset: () => (/* binding */ offset),
/* harmony export */   platform: () => (/* binding */ platform),
/* harmony export */   shift: () => (/* binding */ shift),
/* harmony export */   size: () => (/* binding */ size)
/* harmony export */ });
/* harmony import */ var _floating_ui_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @floating-ui/utils */ "./node_modules/@floating-ui/utils/dist/floating-ui.utils.mjs");
/* harmony import */ var _floating_ui_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @floating-ui/core */ "./node_modules/@floating-ui/core/dist/floating-ui.core.mjs");
/* harmony import */ var _floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @floating-ui/utils/dom */ "./node_modules/@floating-ui/utils/dist/floating-ui.utils.dom.mjs");





function getCssDimensions(element) {
  const css = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getComputedStyle)(element);
  // In testing environments, the `width` and `height` properties are empty
  // strings for SVG elements, returning NaN. Fallback to `0` in this case.
  let width = parseFloat(css.width) || 0;
  let height = parseFloat(css.height) || 0;
  const hasOffset = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(element);
  const offsetWidth = hasOffset ? element.offsetWidth : width;
  const offsetHeight = hasOffset ? element.offsetHeight : height;
  const shouldFallback = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_1__.round)(width) !== offsetWidth || (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_1__.round)(height) !== offsetHeight;
  if (shouldFallback) {
    width = offsetWidth;
    height = offsetHeight;
  }
  return {
    width,
    height,
    $: shouldFallback
  };
}

function unwrapElement(element) {
  return !(0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.isElement)(element) ? element.contextElement : element;
}

function getScale(element) {
  const domElement = unwrapElement(element);
  if (!(0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(domElement)) {
    return (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_1__.createCoords)(1);
  }
  const rect = domElement.getBoundingClientRect();
  const {
    width,
    height,
    $
  } = getCssDimensions(domElement);
  let x = ($ ? (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_1__.round)(rect.width) : rect.width) / width;
  let y = ($ ? (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_1__.round)(rect.height) : rect.height) / height;

  // 0, NaN, or Infinity should always fallback to 1.

  if (!x || !Number.isFinite(x)) {
    x = 1;
  }
  if (!y || !Number.isFinite(y)) {
    y = 1;
  }
  return {
    x,
    y
  };
}

const noOffsets = /*#__PURE__*/(0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_1__.createCoords)(0);
function getVisualOffsets(element) {
  const win = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getWindow)(element);
  if (!(0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.isWebKit)() || !win.visualViewport) {
    return noOffsets;
  }
  return {
    x: win.visualViewport.offsetLeft,
    y: win.visualViewport.offsetTop
  };
}
function shouldAddVisualOffsets(element, isFixed, floatingOffsetParent) {
  if (isFixed === void 0) {
    isFixed = false;
  }
  if (!floatingOffsetParent || isFixed && floatingOffsetParent !== (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getWindow)(element)) {
    return false;
  }
  return isFixed;
}

function getBoundingClientRect(element, includeScale, isFixedStrategy, offsetParent) {
  if (includeScale === void 0) {
    includeScale = false;
  }
  if (isFixedStrategy === void 0) {
    isFixedStrategy = false;
  }
  const clientRect = element.getBoundingClientRect();
  const domElement = unwrapElement(element);
  let scale = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_1__.createCoords)(1);
  if (includeScale) {
    if (offsetParent) {
      if ((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.isElement)(offsetParent)) {
        scale = getScale(offsetParent);
      }
    } else {
      scale = getScale(element);
    }
  }
  const visualOffsets = shouldAddVisualOffsets(domElement, isFixedStrategy, offsetParent) ? getVisualOffsets(domElement) : (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_1__.createCoords)(0);
  let x = (clientRect.left + visualOffsets.x) / scale.x;
  let y = (clientRect.top + visualOffsets.y) / scale.y;
  let width = clientRect.width / scale.x;
  let height = clientRect.height / scale.y;
  if (domElement) {
    const win = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getWindow)(domElement);
    const offsetWin = offsetParent && (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.isElement)(offsetParent) ? (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getWindow)(offsetParent) : offsetParent;
    let currentWin = win;
    let currentIFrame = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getFrameElement)(currentWin);
    while (currentIFrame && offsetParent && offsetWin !== currentWin) {
      const iframeScale = getScale(currentIFrame);
      const iframeRect = currentIFrame.getBoundingClientRect();
      const css = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getComputedStyle)(currentIFrame);
      const left = iframeRect.left + (currentIFrame.clientLeft + parseFloat(css.paddingLeft)) * iframeScale.x;
      const top = iframeRect.top + (currentIFrame.clientTop + parseFloat(css.paddingTop)) * iframeScale.y;
      x *= iframeScale.x;
      y *= iframeScale.y;
      width *= iframeScale.x;
      height *= iframeScale.y;
      x += left;
      y += top;
      currentWin = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getWindow)(currentIFrame);
      currentIFrame = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getFrameElement)(currentWin);
    }
  }
  return (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_1__.rectToClientRect)({
    width,
    height,
    x,
    y
  });
}

// If <html> has a CSS width greater than the viewport, then this will be
// incorrect for RTL.
function getWindowScrollBarX(element, rect) {
  const leftScroll = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getNodeScroll)(element).scrollLeft;
  if (!rect) {
    return getBoundingClientRect((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getDocumentElement)(element)).left + leftScroll;
  }
  return rect.left + leftScroll;
}

function getHTMLOffset(documentElement, scroll, ignoreScrollbarX) {
  if (ignoreScrollbarX === void 0) {
    ignoreScrollbarX = false;
  }
  const htmlRect = documentElement.getBoundingClientRect();
  const x = htmlRect.left + scroll.scrollLeft - (ignoreScrollbarX ? 0 :
  // RTL <body> scrollbar.
  getWindowScrollBarX(documentElement, htmlRect));
  const y = htmlRect.top + scroll.scrollTop;
  return {
    x,
    y
  };
}

function convertOffsetParentRelativeRectToViewportRelativeRect(_ref) {
  let {
    elements,
    rect,
    offsetParent,
    strategy
  } = _ref;
  const isFixed = strategy === 'fixed';
  const documentElement = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getDocumentElement)(offsetParent);
  const topLayer = elements ? (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.isTopLayer)(elements.floating) : false;
  if (offsetParent === documentElement || topLayer && isFixed) {
    return rect;
  }
  let scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  let scale = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_1__.createCoords)(1);
  const offsets = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_1__.createCoords)(0);
  const isOffsetParentAnElement = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(offsetParent);
  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if ((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getNodeName)(offsetParent) !== 'body' || (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.isOverflowElement)(documentElement)) {
      scroll = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getNodeScroll)(offsetParent);
    }
    if ((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(offsetParent)) {
      const offsetRect = getBoundingClientRect(offsetParent);
      scale = getScale(offsetParent);
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    }
  }
  const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll, true) : (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_1__.createCoords)(0);
  return {
    width: rect.width * scale.x,
    height: rect.height * scale.y,
    x: rect.x * scale.x - scroll.scrollLeft * scale.x + offsets.x + htmlOffset.x,
    y: rect.y * scale.y - scroll.scrollTop * scale.y + offsets.y + htmlOffset.y
  };
}

function getClientRects(element) {
  return Array.from(element.getClientRects());
}

// Gets the entire size of the scrollable document area, even extending outside
// of the `<html>` and `<body>` rect bounds if horizontally scrollable.
function getDocumentRect(element) {
  const html = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getDocumentElement)(element);
  const scroll = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getNodeScroll)(element);
  const body = element.ownerDocument.body;
  const width = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_1__.max)(html.scrollWidth, html.clientWidth, body.scrollWidth, body.clientWidth);
  const height = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_1__.max)(html.scrollHeight, html.clientHeight, body.scrollHeight, body.clientHeight);
  let x = -scroll.scrollLeft + getWindowScrollBarX(element);
  const y = -scroll.scrollTop;
  if ((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getComputedStyle)(body).direction === 'rtl') {
    x += (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_1__.max)(html.clientWidth, body.clientWidth) - width;
  }
  return {
    width,
    height,
    x,
    y
  };
}

function getViewportRect(element, strategy) {
  const win = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getWindow)(element);
  const html = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getDocumentElement)(element);
  const visualViewport = win.visualViewport;
  let width = html.clientWidth;
  let height = html.clientHeight;
  let x = 0;
  let y = 0;
  if (visualViewport) {
    width = visualViewport.width;
    height = visualViewport.height;
    const visualViewportBased = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.isWebKit)();
    if (!visualViewportBased || visualViewportBased && strategy === 'fixed') {
      x = visualViewport.offsetLeft;
      y = visualViewport.offsetTop;
    }
  }
  return {
    width,
    height,
    x,
    y
  };
}

// Returns the inner client rect, subtracting scrollbars if present.
function getInnerBoundingClientRect(element, strategy) {
  const clientRect = getBoundingClientRect(element, true, strategy === 'fixed');
  const top = clientRect.top + element.clientTop;
  const left = clientRect.left + element.clientLeft;
  const scale = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(element) ? getScale(element) : (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_1__.createCoords)(1);
  const width = element.clientWidth * scale.x;
  const height = element.clientHeight * scale.y;
  const x = left * scale.x;
  const y = top * scale.y;
  return {
    width,
    height,
    x,
    y
  };
}
function getClientRectFromClippingAncestor(element, clippingAncestor, strategy) {
  let rect;
  if (clippingAncestor === 'viewport') {
    rect = getViewportRect(element, strategy);
  } else if (clippingAncestor === 'document') {
    rect = getDocumentRect((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getDocumentElement)(element));
  } else if ((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.isElement)(clippingAncestor)) {
    rect = getInnerBoundingClientRect(clippingAncestor, strategy);
  } else {
    const visualOffsets = getVisualOffsets(element);
    rect = {
      x: clippingAncestor.x - visualOffsets.x,
      y: clippingAncestor.y - visualOffsets.y,
      width: clippingAncestor.width,
      height: clippingAncestor.height
    };
  }
  return (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_1__.rectToClientRect)(rect);
}
function hasFixedPositionAncestor(element, stopNode) {
  const parentNode = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getParentNode)(element);
  if (parentNode === stopNode || !(0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.isElement)(parentNode) || (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.isLastTraversableNode)(parentNode)) {
    return false;
  }
  return (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getComputedStyle)(parentNode).position === 'fixed' || hasFixedPositionAncestor(parentNode, stopNode);
}

// A "clipping ancestor" is an `overflow` element with the characteristic of
// clipping (or hiding) child elements. This returns all clipping ancestors
// of the given element up the tree.
function getClippingElementAncestors(element, cache) {
  const cachedResult = cache.get(element);
  if (cachedResult) {
    return cachedResult;
  }
  let result = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getOverflowAncestors)(element, [], false).filter(el => (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.isElement)(el) && (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getNodeName)(el) !== 'body');
  let currentContainingBlockComputedStyle = null;
  const elementIsFixed = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getComputedStyle)(element).position === 'fixed';
  let currentNode = elementIsFixed ? (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getParentNode)(element) : element;

  // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block
  while ((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.isElement)(currentNode) && !(0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.isLastTraversableNode)(currentNode)) {
    const computedStyle = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getComputedStyle)(currentNode);
    const currentNodeIsContaining = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.isContainingBlock)(currentNode);
    if (!currentNodeIsContaining && computedStyle.position === 'fixed') {
      currentContainingBlockComputedStyle = null;
    }
    const shouldDropCurrentNode = elementIsFixed ? !currentNodeIsContaining && !currentContainingBlockComputedStyle : !currentNodeIsContaining && computedStyle.position === 'static' && !!currentContainingBlockComputedStyle && ['absolute', 'fixed'].includes(currentContainingBlockComputedStyle.position) || (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.isOverflowElement)(currentNode) && !currentNodeIsContaining && hasFixedPositionAncestor(element, currentNode);
    if (shouldDropCurrentNode) {
      // Drop non-containing blocks.
      result = result.filter(ancestor => ancestor !== currentNode);
    } else {
      // Record last containing block for next iteration.
      currentContainingBlockComputedStyle = computedStyle;
    }
    currentNode = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getParentNode)(currentNode);
  }
  cache.set(element, result);
  return result;
}

// Gets the maximum area that the element is visible in due to any number of
// clipping ancestors.
function getClippingRect(_ref) {
  let {
    element,
    boundary,
    rootBoundary,
    strategy
  } = _ref;
  const elementClippingAncestors = boundary === 'clippingAncestors' ? (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.isTopLayer)(element) ? [] : getClippingElementAncestors(element, this._c) : [].concat(boundary);
  const clippingAncestors = [...elementClippingAncestors, rootBoundary];
  const firstClippingAncestor = clippingAncestors[0];
  const clippingRect = clippingAncestors.reduce((accRect, clippingAncestor) => {
    const rect = getClientRectFromClippingAncestor(element, clippingAncestor, strategy);
    accRect.top = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_1__.max)(rect.top, accRect.top);
    accRect.right = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_1__.min)(rect.right, accRect.right);
    accRect.bottom = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_1__.min)(rect.bottom, accRect.bottom);
    accRect.left = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_1__.max)(rect.left, accRect.left);
    return accRect;
  }, getClientRectFromClippingAncestor(element, firstClippingAncestor, strategy));
  return {
    width: clippingRect.right - clippingRect.left,
    height: clippingRect.bottom - clippingRect.top,
    x: clippingRect.left,
    y: clippingRect.top
  };
}

function getDimensions(element) {
  const {
    width,
    height
  } = getCssDimensions(element);
  return {
    width,
    height
  };
}

function getRectRelativeToOffsetParent(element, offsetParent, strategy) {
  const isOffsetParentAnElement = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(offsetParent);
  const documentElement = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getDocumentElement)(offsetParent);
  const isFixed = strategy === 'fixed';
  const rect = getBoundingClientRect(element, true, isFixed, offsetParent);
  let scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const offsets = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_1__.createCoords)(0);
  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if ((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getNodeName)(offsetParent) !== 'body' || (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.isOverflowElement)(documentElement)) {
      scroll = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getNodeScroll)(offsetParent);
    }
    if (isOffsetParentAnElement) {
      const offsetRect = getBoundingClientRect(offsetParent, true, isFixed, offsetParent);
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    } else if (documentElement) {
      // If the <body> scrollbar appears on the left (e.g. RTL systems). Use
      // Firefox with layout.scrollbar.side = 3 in about:config to test this.
      offsets.x = getWindowScrollBarX(documentElement);
    }
  }
  const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll) : (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_1__.createCoords)(0);
  const x = rect.left + scroll.scrollLeft - offsets.x - htmlOffset.x;
  const y = rect.top + scroll.scrollTop - offsets.y - htmlOffset.y;
  return {
    x,
    y,
    width: rect.width,
    height: rect.height
  };
}

function isStaticPositioned(element) {
  return (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getComputedStyle)(element).position === 'static';
}

function getTrueOffsetParent(element, polyfill) {
  if (!(0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(element) || (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getComputedStyle)(element).position === 'fixed') {
    return null;
  }
  if (polyfill) {
    return polyfill(element);
  }
  let rawOffsetParent = element.offsetParent;

  // Firefox returns the <html> element as the offsetParent if it's non-static,
  // while Chrome and Safari return the <body> element. The <body> element must
  // be used to perform the correct calculations even if the <html> element is
  // non-static.
  if ((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getDocumentElement)(element) === rawOffsetParent) {
    rawOffsetParent = rawOffsetParent.ownerDocument.body;
  }
  return rawOffsetParent;
}

// Gets the closest ancestor positioned element. Handles some edge cases,
// such as table ancestors and cross browser bugs.
function getOffsetParent(element, polyfill) {
  const win = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getWindow)(element);
  if ((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.isTopLayer)(element)) {
    return win;
  }
  if (!(0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(element)) {
    let svgOffsetParent = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getParentNode)(element);
    while (svgOffsetParent && !(0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.isLastTraversableNode)(svgOffsetParent)) {
      if ((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.isElement)(svgOffsetParent) && !isStaticPositioned(svgOffsetParent)) {
        return svgOffsetParent;
      }
      svgOffsetParent = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getParentNode)(svgOffsetParent);
    }
    return win;
  }
  let offsetParent = getTrueOffsetParent(element, polyfill);
  while (offsetParent && (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.isTableElement)(offsetParent) && isStaticPositioned(offsetParent)) {
    offsetParent = getTrueOffsetParent(offsetParent, polyfill);
  }
  if (offsetParent && (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.isLastTraversableNode)(offsetParent) && isStaticPositioned(offsetParent) && !(0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.isContainingBlock)(offsetParent)) {
    return win;
  }
  return offsetParent || (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getContainingBlock)(element) || win;
}

const getElementRects = async function (data) {
  const getOffsetParentFn = this.getOffsetParent || getOffsetParent;
  const getDimensionsFn = this.getDimensions;
  const floatingDimensions = await getDimensionsFn(data.floating);
  return {
    reference: getRectRelativeToOffsetParent(data.reference, await getOffsetParentFn(data.floating), data.strategy),
    floating: {
      x: 0,
      y: 0,
      width: floatingDimensions.width,
      height: floatingDimensions.height
    }
  };
};

function isRTL(element) {
  return (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getComputedStyle)(element).direction === 'rtl';
}

const platform = {
  convertOffsetParentRelativeRectToViewportRelativeRect,
  getDocumentElement: _floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getDocumentElement,
  getClippingRect,
  getOffsetParent,
  getElementRects,
  getClientRects,
  getDimensions,
  getScale,
  isElement: _floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.isElement,
  isRTL
};

function rectsAreEqual(a, b) {
  return a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height;
}

// https://samthor.au/2021/observing-dom/
function observeMove(element, onMove) {
  let io = null;
  let timeoutId;
  const root = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getDocumentElement)(element);
  function cleanup() {
    var _io;
    clearTimeout(timeoutId);
    (_io = io) == null || _io.disconnect();
    io = null;
  }
  function refresh(skip, threshold) {
    if (skip === void 0) {
      skip = false;
    }
    if (threshold === void 0) {
      threshold = 1;
    }
    cleanup();
    const elementRectForRootMargin = element.getBoundingClientRect();
    const {
      left,
      top,
      width,
      height
    } = elementRectForRootMargin;
    if (!skip) {
      onMove();
    }
    if (!width || !height) {
      return;
    }
    const insetTop = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_1__.floor)(top);
    const insetRight = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_1__.floor)(root.clientWidth - (left + width));
    const insetBottom = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_1__.floor)(root.clientHeight - (top + height));
    const insetLeft = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_1__.floor)(left);
    const rootMargin = -insetTop + "px " + -insetRight + "px " + -insetBottom + "px " + -insetLeft + "px";
    const options = {
      rootMargin,
      threshold: (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_1__.max)(0, (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_1__.min)(1, threshold)) || 1
    };
    let isFirstUpdate = true;
    function handleObserve(entries) {
      const ratio = entries[0].intersectionRatio;
      if (ratio !== threshold) {
        if (!isFirstUpdate) {
          return refresh();
        }
        if (!ratio) {
          // If the reference is clipped, the ratio is 0. Throttle the refresh
          // to prevent an infinite loop of updates.
          timeoutId = setTimeout(() => {
            refresh(false, 1e-7);
          }, 1000);
        } else {
          refresh(false, ratio);
        }
      }
      if (ratio === 1 && !rectsAreEqual(elementRectForRootMargin, element.getBoundingClientRect())) {
        // It's possible that even though the ratio is reported as 1, the
        // element is not actually fully within the IntersectionObserver's root
        // area anymore. This can happen under performance constraints. This may
        // be a bug in the browser's IntersectionObserver implementation. To
        // work around this, we compare the element's bounding rect now with
        // what it was at the time we created the IntersectionObserver. If they
        // are not equal then the element moved, so we refresh.
        refresh();
      }
      isFirstUpdate = false;
    }

    // Older browsers don't support a `document` as the root and will throw an
    // error.
    try {
      io = new IntersectionObserver(handleObserve, {
        ...options,
        // Handle <iframe>s
        root: root.ownerDocument
      });
    } catch (e) {
      io = new IntersectionObserver(handleObserve, options);
    }
    io.observe(element);
  }
  refresh(true);
  return cleanup;
}

/**
 * Automatically updates the position of the floating element when necessary.
 * Should only be called when the floating element is mounted on the DOM or
 * visible on the screen.
 * @returns cleanup function that should be invoked when the floating element is
 * removed from the DOM or hidden from the screen.
 * @see https://floating-ui.com/docs/autoUpdate
 */
function autoUpdate(reference, floating, update, options) {
  if (options === void 0) {
    options = {};
  }
  const {
    ancestorScroll = true,
    ancestorResize = true,
    elementResize = typeof ResizeObserver === 'function',
    layoutShift = typeof IntersectionObserver === 'function',
    animationFrame = false
  } = options;
  const referenceEl = unwrapElement(reference);
  const ancestors = ancestorScroll || ancestorResize ? [...(referenceEl ? (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getOverflowAncestors)(referenceEl) : []), ...(0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_0__.getOverflowAncestors)(floating)] : [];
  ancestors.forEach(ancestor => {
    ancestorScroll && ancestor.addEventListener('scroll', update, {
      passive: true
    });
    ancestorResize && ancestor.addEventListener('resize', update);
  });
  const cleanupIo = referenceEl && layoutShift ? observeMove(referenceEl, update) : null;
  let reobserveFrame = -1;
  let resizeObserver = null;
  if (elementResize) {
    resizeObserver = new ResizeObserver(_ref => {
      let [firstEntry] = _ref;
      if (firstEntry && firstEntry.target === referenceEl && resizeObserver) {
        // Prevent update loops when using the `size` middleware.
        // https://github.com/floating-ui/floating-ui/issues/1740
        resizeObserver.unobserve(floating);
        cancelAnimationFrame(reobserveFrame);
        reobserveFrame = requestAnimationFrame(() => {
          var _resizeObserver;
          (_resizeObserver = resizeObserver) == null || _resizeObserver.observe(floating);
        });
      }
      update();
    });
    if (referenceEl && !animationFrame) {
      resizeObserver.observe(referenceEl);
    }
    resizeObserver.observe(floating);
  }
  let frameId;
  let prevRefRect = animationFrame ? getBoundingClientRect(reference) : null;
  if (animationFrame) {
    frameLoop();
  }
  function frameLoop() {
    const nextRefRect = getBoundingClientRect(reference);
    if (prevRefRect && !rectsAreEqual(prevRefRect, nextRefRect)) {
      update();
    }
    prevRefRect = nextRefRect;
    frameId = requestAnimationFrame(frameLoop);
  }
  update();
  return () => {
    var _resizeObserver2;
    ancestors.forEach(ancestor => {
      ancestorScroll && ancestor.removeEventListener('scroll', update);
      ancestorResize && ancestor.removeEventListener('resize', update);
    });
    cleanupIo == null || cleanupIo();
    (_resizeObserver2 = resizeObserver) == null || _resizeObserver2.disconnect();
    resizeObserver = null;
    if (animationFrame) {
      cancelAnimationFrame(frameId);
    }
  };
}

/**
 * Resolves with an object of overflow side offsets that determine how much the
 * element is overflowing a given clipping boundary on each side.
 * - positive = overflowing the boundary by that number of pixels
 * - negative = how many pixels left before it will overflow
 * - 0 = lies flush with the boundary
 * @see https://floating-ui.com/docs/detectOverflow
 */
const detectOverflow = _floating_ui_core__WEBPACK_IMPORTED_MODULE_2__.detectOverflow;

/**
 * Modifies the placement by translating the floating element along the
 * specified axes.
 * A number (shorthand for `mainAxis` or distance), or an axes configuration
 * object may be passed.
 * @see https://floating-ui.com/docs/offset
 */
const offset = _floating_ui_core__WEBPACK_IMPORTED_MODULE_2__.offset;

/**
 * Optimizes the visibility of the floating element by choosing the placement
 * that has the most space available automatically, without needing to specify a
 * preferred placement. Alternative to `flip`.
 * @see https://floating-ui.com/docs/autoPlacement
 */
const autoPlacement = _floating_ui_core__WEBPACK_IMPORTED_MODULE_2__.autoPlacement;

/**
 * Optimizes the visibility of the floating element by shifting it in order to
 * keep it in view when it will overflow the clipping boundary.
 * @see https://floating-ui.com/docs/shift
 */
const shift = _floating_ui_core__WEBPACK_IMPORTED_MODULE_2__.shift;

/**
 * Optimizes the visibility of the floating element by flipping the `placement`
 * in order to keep it in view when the preferred placement(s) will overflow the
 * clipping boundary. Alternative to `autoPlacement`.
 * @see https://floating-ui.com/docs/flip
 */
const flip = _floating_ui_core__WEBPACK_IMPORTED_MODULE_2__.flip;

/**
 * Provides data that allows you to change the size of the floating element —
 * for instance, prevent it from overflowing the clipping boundary or match the
 * width of the reference element.
 * @see https://floating-ui.com/docs/size
 */
const size = _floating_ui_core__WEBPACK_IMPORTED_MODULE_2__.size;

/**
 * Provides data to hide the floating element in applicable situations, such as
 * when it is not in the same clipping context as the reference element.
 * @see https://floating-ui.com/docs/hide
 */
const hide = _floating_ui_core__WEBPACK_IMPORTED_MODULE_2__.hide;

/**
 * Provides data to position an inner element of the floating element so that it
 * appears centered to the reference element.
 * @see https://floating-ui.com/docs/arrow
 */
const arrow = _floating_ui_core__WEBPACK_IMPORTED_MODULE_2__.arrow;

/**
 * Provides improved positioning for inline reference elements that can span
 * over multiple lines, such as hyperlinks or range selections.
 * @see https://floating-ui.com/docs/inline
 */
const inline = _floating_ui_core__WEBPACK_IMPORTED_MODULE_2__.inline;

/**
 * Built-in `limiter` that will stop `shift()` at a certain point.
 */
const limitShift = _floating_ui_core__WEBPACK_IMPORTED_MODULE_2__.limitShift;

/**
 * Computes the `x` and `y` coordinates that will place the floating element
 * next to a given reference element.
 */
const computePosition = (reference, floating, options) => {
  // This caches the expensive `getClippingElementAncestors` function so that
  // multiple lifecycle resets re-use the same result. It only lives for a
  // single call. If other functions become expensive, we can add them as well.
  const cache = new Map();
  const mergedOptions = {
    platform,
    ...options
  };
  const platformWithCache = {
    ...mergedOptions.platform,
    _c: cache
  };
  return (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_2__.computePosition)(reference, floating, {
    ...mergedOptions,
    platform: platformWithCache
  });
};




/***/ }),

/***/ "./node_modules/@floating-ui/utils/dist/floating-ui.utils.dom.mjs":
/*!************************************************************************!*\
  !*** ./node_modules/@floating-ui/utils/dist/floating-ui.utils.dom.mjs ***!
  \************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getComputedStyle: () => (/* binding */ getComputedStyle),
/* harmony export */   getContainingBlock: () => (/* binding */ getContainingBlock),
/* harmony export */   getDocumentElement: () => (/* binding */ getDocumentElement),
/* harmony export */   getFrameElement: () => (/* binding */ getFrameElement),
/* harmony export */   getNearestOverflowAncestor: () => (/* binding */ getNearestOverflowAncestor),
/* harmony export */   getNodeName: () => (/* binding */ getNodeName),
/* harmony export */   getNodeScroll: () => (/* binding */ getNodeScroll),
/* harmony export */   getOverflowAncestors: () => (/* binding */ getOverflowAncestors),
/* harmony export */   getParentNode: () => (/* binding */ getParentNode),
/* harmony export */   getWindow: () => (/* binding */ getWindow),
/* harmony export */   isContainingBlock: () => (/* binding */ isContainingBlock),
/* harmony export */   isElement: () => (/* binding */ isElement),
/* harmony export */   isHTMLElement: () => (/* binding */ isHTMLElement),
/* harmony export */   isLastTraversableNode: () => (/* binding */ isLastTraversableNode),
/* harmony export */   isNode: () => (/* binding */ isNode),
/* harmony export */   isOverflowElement: () => (/* binding */ isOverflowElement),
/* harmony export */   isShadowRoot: () => (/* binding */ isShadowRoot),
/* harmony export */   isTableElement: () => (/* binding */ isTableElement),
/* harmony export */   isTopLayer: () => (/* binding */ isTopLayer),
/* harmony export */   isWebKit: () => (/* binding */ isWebKit)
/* harmony export */ });
function hasWindow() {
  return typeof window !== 'undefined';
}
function getNodeName(node) {
  if (isNode(node)) {
    return (node.nodeName || '').toLowerCase();
  }
  // Mocked nodes in testing environments may not be instances of Node. By
  // returning `#document` an infinite loop won't occur.
  // https://github.com/floating-ui/floating-ui/issues/2317
  return '#document';
}
function getWindow(node) {
  var _node$ownerDocument;
  return (node == null || (_node$ownerDocument = node.ownerDocument) == null ? void 0 : _node$ownerDocument.defaultView) || window;
}
function getDocumentElement(node) {
  var _ref;
  return (_ref = (isNode(node) ? node.ownerDocument : node.document) || window.document) == null ? void 0 : _ref.documentElement;
}
function isNode(value) {
  if (!hasWindow()) {
    return false;
  }
  return value instanceof Node || value instanceof getWindow(value).Node;
}
function isElement(value) {
  if (!hasWindow()) {
    return false;
  }
  return value instanceof Element || value instanceof getWindow(value).Element;
}
function isHTMLElement(value) {
  if (!hasWindow()) {
    return false;
  }
  return value instanceof HTMLElement || value instanceof getWindow(value).HTMLElement;
}
function isShadowRoot(value) {
  if (!hasWindow() || typeof ShadowRoot === 'undefined') {
    return false;
  }
  return value instanceof ShadowRoot || value instanceof getWindow(value).ShadowRoot;
}
function isOverflowElement(element) {
  const {
    overflow,
    overflowX,
    overflowY,
    display
  } = getComputedStyle(element);
  return /auto|scroll|overlay|hidden|clip/.test(overflow + overflowY + overflowX) && !['inline', 'contents'].includes(display);
}
function isTableElement(element) {
  return ['table', 'td', 'th'].includes(getNodeName(element));
}
function isTopLayer(element) {
  return [':popover-open', ':modal'].some(selector => {
    try {
      return element.matches(selector);
    } catch (e) {
      return false;
    }
  });
}
function isContainingBlock(elementOrCss) {
  const webkit = isWebKit();
  const css = isElement(elementOrCss) ? getComputedStyle(elementOrCss) : elementOrCss;

  // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block
  // https://drafts.csswg.org/css-transforms-2/#individual-transforms
  return ['transform', 'translate', 'scale', 'rotate', 'perspective'].some(value => css[value] ? css[value] !== 'none' : false) || (css.containerType ? css.containerType !== 'normal' : false) || !webkit && (css.backdropFilter ? css.backdropFilter !== 'none' : false) || !webkit && (css.filter ? css.filter !== 'none' : false) || ['transform', 'translate', 'scale', 'rotate', 'perspective', 'filter'].some(value => (css.willChange || '').includes(value)) || ['paint', 'layout', 'strict', 'content'].some(value => (css.contain || '').includes(value));
}
function getContainingBlock(element) {
  let currentNode = getParentNode(element);
  while (isHTMLElement(currentNode) && !isLastTraversableNode(currentNode)) {
    if (isContainingBlock(currentNode)) {
      return currentNode;
    } else if (isTopLayer(currentNode)) {
      return null;
    }
    currentNode = getParentNode(currentNode);
  }
  return null;
}
function isWebKit() {
  if (typeof CSS === 'undefined' || !CSS.supports) return false;
  return CSS.supports('-webkit-backdrop-filter', 'none');
}
function isLastTraversableNode(node) {
  return ['html', 'body', '#document'].includes(getNodeName(node));
}
function getComputedStyle(element) {
  return getWindow(element).getComputedStyle(element);
}
function getNodeScroll(element) {
  if (isElement(element)) {
    return {
      scrollLeft: element.scrollLeft,
      scrollTop: element.scrollTop
    };
  }
  return {
    scrollLeft: element.scrollX,
    scrollTop: element.scrollY
  };
}
function getParentNode(node) {
  if (getNodeName(node) === 'html') {
    return node;
  }
  const result =
  // Step into the shadow DOM of the parent of a slotted node.
  node.assignedSlot ||
  // DOM Element detected.
  node.parentNode ||
  // ShadowRoot detected.
  isShadowRoot(node) && node.host ||
  // Fallback.
  getDocumentElement(node);
  return isShadowRoot(result) ? result.host : result;
}
function getNearestOverflowAncestor(node) {
  const parentNode = getParentNode(node);
  if (isLastTraversableNode(parentNode)) {
    return node.ownerDocument ? node.ownerDocument.body : node.body;
  }
  if (isHTMLElement(parentNode) && isOverflowElement(parentNode)) {
    return parentNode;
  }
  return getNearestOverflowAncestor(parentNode);
}
function getOverflowAncestors(node, list, traverseIframes) {
  var _node$ownerDocument2;
  if (list === void 0) {
    list = [];
  }
  if (traverseIframes === void 0) {
    traverseIframes = true;
  }
  const scrollableAncestor = getNearestOverflowAncestor(node);
  const isBody = scrollableAncestor === ((_node$ownerDocument2 = node.ownerDocument) == null ? void 0 : _node$ownerDocument2.body);
  const win = getWindow(scrollableAncestor);
  if (isBody) {
    const frameElement = getFrameElement(win);
    return list.concat(win, win.visualViewport || [], isOverflowElement(scrollableAncestor) ? scrollableAncestor : [], frameElement && traverseIframes ? getOverflowAncestors(frameElement) : []);
  }
  return list.concat(scrollableAncestor, getOverflowAncestors(scrollableAncestor, [], traverseIframes));
}
function getFrameElement(win) {
  return win.parent && Object.getPrototypeOf(win.parent) ? win.frameElement : null;
}




/***/ }),

/***/ "./node_modules/@floating-ui/utils/dist/floating-ui.utils.mjs":
/*!********************************************************************!*\
  !*** ./node_modules/@floating-ui/utils/dist/floating-ui.utils.mjs ***!
  \********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   alignments: () => (/* binding */ alignments),
/* harmony export */   clamp: () => (/* binding */ clamp),
/* harmony export */   createCoords: () => (/* binding */ createCoords),
/* harmony export */   evaluate: () => (/* binding */ evaluate),
/* harmony export */   expandPaddingObject: () => (/* binding */ expandPaddingObject),
/* harmony export */   floor: () => (/* binding */ floor),
/* harmony export */   getAlignment: () => (/* binding */ getAlignment),
/* harmony export */   getAlignmentAxis: () => (/* binding */ getAlignmentAxis),
/* harmony export */   getAlignmentSides: () => (/* binding */ getAlignmentSides),
/* harmony export */   getAxisLength: () => (/* binding */ getAxisLength),
/* harmony export */   getExpandedPlacements: () => (/* binding */ getExpandedPlacements),
/* harmony export */   getOppositeAlignmentPlacement: () => (/* binding */ getOppositeAlignmentPlacement),
/* harmony export */   getOppositeAxis: () => (/* binding */ getOppositeAxis),
/* harmony export */   getOppositeAxisPlacements: () => (/* binding */ getOppositeAxisPlacements),
/* harmony export */   getOppositePlacement: () => (/* binding */ getOppositePlacement),
/* harmony export */   getPaddingObject: () => (/* binding */ getPaddingObject),
/* harmony export */   getSide: () => (/* binding */ getSide),
/* harmony export */   getSideAxis: () => (/* binding */ getSideAxis),
/* harmony export */   max: () => (/* binding */ max),
/* harmony export */   min: () => (/* binding */ min),
/* harmony export */   placements: () => (/* binding */ placements),
/* harmony export */   rectToClientRect: () => (/* binding */ rectToClientRect),
/* harmony export */   round: () => (/* binding */ round),
/* harmony export */   sides: () => (/* binding */ sides)
/* harmony export */ });
/**
 * Custom positioning reference element.
 * @see https://floating-ui.com/docs/virtual-elements
 */

const sides = ['top', 'right', 'bottom', 'left'];
const alignments = ['start', 'end'];
const placements = /*#__PURE__*/sides.reduce((acc, side) => acc.concat(side, side + "-" + alignments[0], side + "-" + alignments[1]), []);
const min = Math.min;
const max = Math.max;
const round = Math.round;
const floor = Math.floor;
const createCoords = v => ({
  x: v,
  y: v
});
const oppositeSideMap = {
  left: 'right',
  right: 'left',
  bottom: 'top',
  top: 'bottom'
};
const oppositeAlignmentMap = {
  start: 'end',
  end: 'start'
};
function clamp(start, value, end) {
  return max(start, min(value, end));
}
function evaluate(value, param) {
  return typeof value === 'function' ? value(param) : value;
}
function getSide(placement) {
  return placement.split('-')[0];
}
function getAlignment(placement) {
  return placement.split('-')[1];
}
function getOppositeAxis(axis) {
  return axis === 'x' ? 'y' : 'x';
}
function getAxisLength(axis) {
  return axis === 'y' ? 'height' : 'width';
}
function getSideAxis(placement) {
  return ['top', 'bottom'].includes(getSide(placement)) ? 'y' : 'x';
}
function getAlignmentAxis(placement) {
  return getOppositeAxis(getSideAxis(placement));
}
function getAlignmentSides(placement, rects, rtl) {
  if (rtl === void 0) {
    rtl = false;
  }
  const alignment = getAlignment(placement);
  const alignmentAxis = getAlignmentAxis(placement);
  const length = getAxisLength(alignmentAxis);
  let mainAlignmentSide = alignmentAxis === 'x' ? alignment === (rtl ? 'end' : 'start') ? 'right' : 'left' : alignment === 'start' ? 'bottom' : 'top';
  if (rects.reference[length] > rects.floating[length]) {
    mainAlignmentSide = getOppositePlacement(mainAlignmentSide);
  }
  return [mainAlignmentSide, getOppositePlacement(mainAlignmentSide)];
}
function getExpandedPlacements(placement) {
  const oppositePlacement = getOppositePlacement(placement);
  return [getOppositeAlignmentPlacement(placement), oppositePlacement, getOppositeAlignmentPlacement(oppositePlacement)];
}
function getOppositeAlignmentPlacement(placement) {
  return placement.replace(/start|end/g, alignment => oppositeAlignmentMap[alignment]);
}
function getSideList(side, isStart, rtl) {
  const lr = ['left', 'right'];
  const rl = ['right', 'left'];
  const tb = ['top', 'bottom'];
  const bt = ['bottom', 'top'];
  switch (side) {
    case 'top':
    case 'bottom':
      if (rtl) return isStart ? rl : lr;
      return isStart ? lr : rl;
    case 'left':
    case 'right':
      return isStart ? tb : bt;
    default:
      return [];
  }
}
function getOppositeAxisPlacements(placement, flipAlignment, direction, rtl) {
  const alignment = getAlignment(placement);
  let list = getSideList(getSide(placement), direction === 'start', rtl);
  if (alignment) {
    list = list.map(side => side + "-" + alignment);
    if (flipAlignment) {
      list = list.concat(list.map(getOppositeAlignmentPlacement));
    }
  }
  return list;
}
function getOppositePlacement(placement) {
  return placement.replace(/left|right|bottom|top/g, side => oppositeSideMap[side]);
}
function expandPaddingObject(padding) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...padding
  };
}
function getPaddingObject(padding) {
  return typeof padding !== 'number' ? expandPaddingObject(padding) : {
    top: padding,
    right: padding,
    bottom: padding,
    left: padding
  };
}
function rectToClientRect(rect) {
  const {
    x,
    y,
    width,
    height
  } = rect;
  return {
    width,
    height,
    top: y,
    left: x,
    right: x + width,
    bottom: y + height,
    x,
    y
  };
}




/***/ }),

/***/ "./node_modules/@vidstack/react/dev/chunks/vidstack--AIGOV5A.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@vidstack/react/dev/chunks/vidstack--AIGOV5A.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AirPlayButton: () => (/* binding */ AirPlayButton),
/* harmony export */   Button: () => (/* binding */ Button),
/* harmony export */   CaptionButton: () => (/* binding */ CaptionButton),
/* harmony export */   ChapterTitle: () => (/* binding */ ChapterTitle),
/* harmony export */   Chapters: () => (/* binding */ Chapters),
/* harmony export */   FullscreenButton: () => (/* binding */ FullscreenButton),
/* harmony export */   Gesture: () => (/* binding */ Gesture),
/* harmony export */   Img: () => (/* binding */ Img),
/* harmony export */   Item: () => (/* binding */ Item$1),
/* harmony export */   Items: () => (/* binding */ Items),
/* harmony export */   LiveButton: () => (/* binding */ LiveButton),
/* harmony export */   MuteButton: () => (/* binding */ MuteButton),
/* harmony export */   PIPButton: () => (/* binding */ PIPButton),
/* harmony export */   PlayButton: () => (/* binding */ PlayButton),
/* harmony export */   Portal: () => (/* binding */ Portal),
/* harmony export */   Preview: () => (/* binding */ Preview),
/* harmony export */   Progress: () => (/* binding */ Progress),
/* harmony export */   Root: () => (/* binding */ Root$3),
/* harmony export */   Root$1: () => (/* binding */ Root$2),
/* harmony export */   Root$2: () => (/* binding */ Root),
/* harmony export */   Root$3: () => (/* binding */ Root$1),
/* harmony export */   Root$4: () => (/* binding */ Root$4),
/* harmony export */   Root$5: () => (/* binding */ Root$5),
/* harmony export */   SeekButton: () => (/* binding */ SeekButton),
/* harmony export */   Steps: () => (/* binding */ Steps),
/* harmony export */   Thumb: () => (/* binding */ Thumb),
/* harmony export */   Thumbnail: () => (/* binding */ Thumbnail),
/* harmony export */   Time: () => (/* binding */ Time),
/* harmony export */   Track: () => (/* binding */ Track),
/* harmony export */   TrackFill: () => (/* binding */ TrackFill),
/* harmony export */   Value: () => (/* binding */ Value),
/* harmony export */   appendParamsToURL: () => (/* binding */ appendParamsToURL),
/* harmony export */   menu: () => (/* binding */ menu),
/* harmony export */   radioGroup: () => (/* binding */ radioGroup),
/* harmony export */   slider: () => (/* binding */ slider),
/* harmony export */   sliderCallbacks: () => (/* binding */ sliderCallbacks),
/* harmony export */   thumbnail: () => (/* binding */ thumbnail),
/* harmony export */   timeSlider: () => (/* binding */ timeSlider),
/* harmony export */   useAudioOptions: () => (/* binding */ useAudioOptions),
/* harmony export */   useCaptionOptions: () => (/* binding */ useCaptionOptions),
/* harmony export */   useMediaContext: () => (/* binding */ useMediaContext),
/* harmony export */   useMediaPlayer: () => (/* binding */ useMediaPlayer),
/* harmony export */   volumeSlider: () => (/* binding */ volumeSlider)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./vidstack-D_bWd66h.js */ "./node_modules/@vidstack/react/dev/chunks/vidstack-D_bWd66h.js");
/* harmony import */ var _vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./vidstack-DUlCophs.js */ "./node_modules/@vidstack/react/dev/chunks/vidstack-DUlCophs.js");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "react-dom");
"use client"

;




function useMediaContext() {
  return (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.useReactContext)(_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_3__.mediaContext);
}

const AirPlayButtonBridge = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.createReactComponent)(_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_3__.AirPlayButtonInstance, {
  domEventsRegex: /^onMedia/
});
const AirPlayButton = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(
  ({ children, ...props }, forwardRef) => {
    return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(AirPlayButtonBridge, { ...props }, (props2) => /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
      _vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_3__.Primitive.button,
      {
        ...props2,
        ref: (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.composeRefs)(props2.ref, forwardRef)
      },
      children
    ));
  }
);
AirPlayButton.displayName = "AirPlayButton";

const PlayButtonBridge = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.createReactComponent)(_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_3__.PlayButtonInstance, {
  domEventsRegex: /^onMedia/
});
const PlayButton = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(
  ({ children, ...props }, forwardRef) => {
    return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(PlayButtonBridge, { ...props }, (props2) => /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
      _vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_3__.Primitive.button,
      {
        ...props2,
        ref: (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.composeRefs)(props2.ref, forwardRef)
      },
      children
    ));
  }
);
PlayButton.displayName = "PlayButton";

const CaptionButtonBridge = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.createReactComponent)(_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_3__.CaptionButtonInstance, {
  domEventsRegex: /^onMedia/
});
const CaptionButton = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(
  ({ children, ...props }, forwardRef) => {
    return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(CaptionButtonBridge, { ...props }, (props2) => /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
      _vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_3__.Primitive.button,
      {
        ...props2,
        ref: (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.composeRefs)(props2.ref, forwardRef)
      },
      children
    ));
  }
);
CaptionButton.displayName = "CaptionButton";

const FullscreenButtonBridge = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.createReactComponent)(_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_3__.FullscreenButtonInstance, {
  domEventsRegex: /^onMedia/
});
const FullscreenButton = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(
  ({ children, ...props }, forwardRef) => {
    return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(FullscreenButtonBridge, { ...props }, (props2) => /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
      _vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_3__.Primitive.button,
      {
        ...props2,
        ref: (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.composeRefs)(props2.ref, forwardRef)
      },
      children
    ));
  }
);
FullscreenButton.displayName = "FullscreenButton";

const MuteButtonBridge = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.createReactComponent)(_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_3__.MuteButtonInstance, {
  domEventsRegex: /^onMedia/
});
const MuteButton = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(
  ({ children, ...props }, forwardRef) => {
    return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(MuteButtonBridge, { ...props }, (props2) => /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
      _vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_3__.Primitive.button,
      {
        ...props2,
        ref: (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.composeRefs)(props2.ref, forwardRef)
      },
      children
    ));
  }
);
MuteButton.displayName = "MuteButton";

const PIPButtonBridge = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.createReactComponent)(_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_3__.PIPButtonInstance, {
  domEventsRegex: /^onMedia/
});
const PIPButton = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(
  ({ children, ...props }, forwardRef) => {
    return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(PIPButtonBridge, { ...props }, (props2) => /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
      _vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_3__.Primitive.button,
      {
        ...props2,
        ref: (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.composeRefs)(props2.ref, forwardRef)
      },
      children
    ));
  }
);
PIPButton.displayName = "PIPButton";

const SeekButtonBridge = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.createReactComponent)(_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_3__.SeekButtonInstance, {
  domEventsRegex: /^onMedia/
});
const SeekButton = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(
  ({ children, ...props }, forwardRef) => {
    return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(SeekButtonBridge, { ...props }, (props2) => /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
      _vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_3__.Primitive.button,
      {
        ...props2,
        ref: (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.composeRefs)(props2.ref, forwardRef)
      },
      children
    ));
  }
);
SeekButton.displayName = "SeekButton";

const LiveButtonBridge = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.createReactComponent)(_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_3__.LiveButtonInstance, {
  domEventsRegex: /^onMedia/
});
const LiveButton = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(
  ({ children, ...props }, forwardRef) => {
    return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(LiveButtonBridge, { ...props }, (props2) => /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
      _vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_3__.Primitive.button,
      {
        ...props2,
        ref: (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.composeRefs)(props2.ref, forwardRef)
      },
      children
    ));
  }
);
LiveButton.displayName = "LiveButton";

const sliderCallbacks = [
  "onDragStart",
  "onDragEnd",
  "onDragValueChange",
  "onValueChange",
  "onPointerValueChange"
];

const SliderValueBridge = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.createReactComponent)(_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_3__.SliderValueInstance);

const SliderBridge = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.createReactComponent)(_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_3__.SliderInstance, {
  events: sliderCallbacks
});
const Root$5 = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(({ children, ...props }, forwardRef) => {
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(SliderBridge, { ...props, ref: forwardRef }, (props2) => /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_3__.Primitive.div, { ...props2 }, children));
});
Root$5.displayName = "Slider";
const Thumb = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef((props, forwardRef) => /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_3__.Primitive.div, { ...props, ref: forwardRef }));
Thumb.displayName = "SliderThumb";
const Track = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef((props, forwardRef) => /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_3__.Primitive.div, { ...props, ref: forwardRef }));
Track.displayName = "SliderTrack";
const TrackFill = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef((props, forwardRef) => /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_3__.Primitive.div, { ...props, ref: forwardRef }));
TrackFill.displayName = "SliderTrackFill";
const PreviewBridge = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.createReactComponent)(_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_3__.SliderPreviewInstance);
const Preview = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(
  ({ children, ...props }, forwardRef) => {
    return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(PreviewBridge, { ...props }, (props2) => /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
      _vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_3__.Primitive.div,
      {
        ...props2,
        ref: (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.composeRefs)(props2.ref, forwardRef)
      },
      children
    ));
  }
);
Preview.displayName = "SliderPreview";
const Value = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(({ children, ...props }, forwardRef) => {
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(SliderValueBridge, { ...props }, (props2, instance) => {
    const $text = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.useSignal)(() => instance.getValueText(), instance);
    return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_3__.Primitive.div, { ...props2, ref: forwardRef }, $text, children);
  });
});
Value.displayName = "SliderValue";
const Steps = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(({ children, ...props }, forwardRef) => {
  const $min = (0,_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_3__.useSliderState)("min"), $max = (0,_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_3__.useSliderState)("max"), $step = (0,_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_3__.useSliderState)("step"), steps = ($max - $min) / $step;
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_3__.Primitive.div, { ...props, ref: forwardRef }, Array.from({ length: Math.floor(steps) + 1 }).map((_, step) => children(step)));
});
Steps.displayName = "SliderSteps";

var slider = /*#__PURE__*/Object.freeze({
  __proto__: null,
  Preview: Preview,
  Root: Root$5,
  Steps: Steps,
  Thumb: Thumb,
  Track: Track,
  TrackFill: TrackFill,
  Value: Value
});

const VolumeSliderBridge = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.createReactComponent)(_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_3__.VolumeSliderInstance, {
  events: sliderCallbacks,
  domEventsRegex: /^onMedia/
});
const Root$4 = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(
  ({ children, ...props }, forwardRef) => {
    return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(VolumeSliderBridge, { ...props, ref: forwardRef }, (props2) => /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_3__.Primitive.div, { ...props2 }, children));
  }
);
Root$4.displayName = "VolumeSlider";

var volumeSlider = /*#__PURE__*/Object.freeze({
  __proto__: null,
  Preview: Preview,
  Root: Root$4,
  Steps: Steps,
  Thumb: Thumb,
  Track: Track,
  TrackFill: TrackFill,
  Value: Value
});

function createVTTCue(startTime = 0, endTime = 0, text = "") {
  if (_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_3__.IS_SERVER) {
    return {
      startTime,
      endTime,
      text,
      addEventListener: _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.noop,
      removeEventListener: _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.noop,
      dispatchEvent: _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.noop
    };
  }
  return new window.VTTCue(startTime, endTime, text);
}
function appendParamsToURL(baseUrl, params) {
  const url = new URL(baseUrl);
  for (const key of Object.keys(params)) {
    url.searchParams.set(key, params[key] + "");
  }
  return url.toString();
}

const ThumbnailBridge = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.createReactComponent)(_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_3__.ThumbnailInstance);
const Root$3 = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(({ children, ...props }, forwardRef) => {
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(ThumbnailBridge, { ...props }, (props2) => /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
    _vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_3__.Primitive.div,
    {
      ...props2,
      ref: (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.composeRefs)(props2.ref, forwardRef)
    },
    children
  ));
});
Root$3.displayName = "Thumbnail";
const Img = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(({ children, ...props }, forwardRef) => {
  const { src, img, crossOrigin } = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.useStateContext)(_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_3__.ThumbnailInstance.state), $src = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.useSignal)(src), $crossOrigin = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.useSignal)(crossOrigin);
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
    _vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_3__.Primitive.img,
    {
      crossOrigin: $crossOrigin,
      ...props,
      src: $src || void 0,
      ref: (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.composeRefs)(img.set, forwardRef)
    },
    children
  );
});
Img.displayName = "ThumbnailImg";

var thumbnail = /*#__PURE__*/Object.freeze({
  __proto__: null,
  Img: Img,
  Root: Root$3
});

const TimeSliderContext = react__WEBPACK_IMPORTED_MODULE_0__.createContext({
  $chapters: (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.signal)(null)
});
TimeSliderContext.displayName = "TimeSliderContext";
const TimeSliderBridge = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.createReactComponent)(_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_3__.TimeSliderInstance, {
  events: sliderCallbacks,
  domEventsRegex: /^onMedia/
});
const Root$2 = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(
  ({ children, ...props }, forwardRef) => {
    const $chapters = react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.signal)(null), []);
    return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(TimeSliderContext.Provider, { value: { $chapters } }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(TimeSliderBridge, { ...props, ref: forwardRef }, (props2) => /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_3__.Primitive.div, { ...props2 }, children)));
  }
);
Root$2.displayName = "TimeSlider";
const SliderChaptersBridge = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.createReactComponent)(_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_3__.SliderChaptersInstance);
const Chapters = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(
  ({ children, ...props }, forwardRef) => {
    return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(SliderChaptersBridge, { ...props }, (props2, instance) => /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
      _vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_3__.Primitive.div,
      {
        ...props2,
        ref: (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.composeRefs)(props2.ref, forwardRef)
      },
      /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(ChapterTracks, { instance }, children)
    ));
  }
);
Chapters.displayName = "SliderChapters";
function ChapterTracks({ instance, children }) {
  const $cues = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.useSignal)(() => instance.cues, instance), refs = react__WEBPACK_IMPORTED_MODULE_0__.useRef([]), emptyCue = react__WEBPACK_IMPORTED_MODULE_0__.useRef(null), { $chapters } = react__WEBPACK_IMPORTED_MODULE_0__.useContext(TimeSliderContext);
  if (!emptyCue.current) {
    emptyCue.current = createVTTCue();
  }
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    $chapters.set(instance);
    return () => void $chapters.set(null);
  }, [instance]);
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    instance.setRefs(refs.current);
  }, [$cues]);
  return children($cues.length ? $cues : [emptyCue.current], (el) => {
    if (!el) {
      refs.current.length = 0;
      return;
    }
    refs.current.push(el);
  });
}
ChapterTracks.displayName = "SliderChapterTracks";
const ChapterTitle = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(
  ({ children, ...props }, forwardRef) => {
    const { $chapters } = react__WEBPACK_IMPORTED_MODULE_0__.useContext(TimeSliderContext), [title, setTitle] = react__WEBPACK_IMPORTED_MODULE_0__.useState();
    react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
      return (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.effect)(() => {
        const chapters = $chapters(), cue = chapters?.activePointerCue || chapters?.activeCue;
        setTitle(cue?.text || "");
      });
    }, []);
    return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_3__.Primitive.div, { ...props, ref: forwardRef }, title, children);
  }
);
ChapterTitle.displayName = "SliderChapterTitle";
const Progress = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef((props, forwardRef) => /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_3__.Primitive.div, { ...props, ref: forwardRef }));
Progress.displayName = "SliderProgress";
const SliderThumbnailBridge = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.createReactComponent)(_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_3__.SliderThumbnailInstance);
const ThumbnailRoot = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(
  ({ children, ...props }, forwardRef) => {
    return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(SliderThumbnailBridge, { ...props }, (props2) => /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_3__.Primitive.div, { ...props2, ref: (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.composeRefs)(props2.ref, forwardRef) }, children));
  }
);
ThumbnailRoot.displayName = "SliderThumbnail";
const Thumbnail = {
  Root: ThumbnailRoot,
  Img: Img
};
const VideoBridge = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.createReactComponent)(_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_3__.SliderVideoInstance, {
  events: ["onCanPlay", "onError"]
});
const Video = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(
  ({ children, ...props }, forwardRef) => {
    return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(VideoBridge, { ...props }, (props2, instance) => /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
      VideoProvider,
      {
        ...props2,
        instance,
        ref: (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.composeRefs)(props2.ref, forwardRef)
      },
      children
    ));
  }
);
Video.displayName = "SliderVideo";
const VideoProvider = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(
  ({ instance, children, ...props }, forwardRef) => {
    const { canLoad } = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.useStateContext)(_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_3__.mediaState), { src, video, crossOrigin } = instance.$state, $src = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.useSignal)(src), $canLoad = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.useSignal)(canLoad), $crossOrigin = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.useSignal)(crossOrigin);
    return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
      _vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_3__.Primitive.video,
      {
        style: { maxWidth: "unset" },
        ...props,
        src: $src || void 0,
        muted: true,
        playsInline: true,
        preload: $canLoad ? "auto" : "none",
        crossOrigin: $crossOrigin || void 0,
        ref: (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.composeRefs)(video.set, forwardRef)
      },
      children
    );
  }
);
VideoProvider.displayName = "SliderVideoProvider";

var timeSlider = /*#__PURE__*/Object.freeze({
  __proto__: null,
  ChapterTitle: ChapterTitle,
  Chapters: Chapters,
  Preview: Preview,
  Progress: Progress,
  Root: Root$2,
  Steps: Steps,
  Thumb: Thumb,
  Thumbnail: Thumbnail,
  Track: Track,
  TrackFill: TrackFill,
  Value: Value,
  Video: Video
});

const RadioGroupBridge = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.createReactComponent)(_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_3__.RadioGroupInstance, {
  events: ["onChange"]
});
const Root$1 = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(
  ({ children, ...props }, forwardRef) => {
    return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(RadioGroupBridge, { ...props, ref: forwardRef }, (props2) => /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_3__.Primitive.div, { ...props2 }, children));
  }
);
Root$1.displayName = "RadioGroup";
const ItemBridge$1 = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.createReactComponent)(_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_3__.RadioInstance, {
  events: ["onChange", "onSelect"]
});
const Item$1 = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(({ children, ...props }, forwardRef) => {
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(ItemBridge$1, { ...props }, (props2) => /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
    _vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_3__.Primitive.div,
    {
      ...props2,
      ref: (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.composeRefs)(props2.ref, forwardRef)
    },
    children
  ));
});
Item$1.displayName = "RadioItem";

var radioGroup = /*#__PURE__*/Object.freeze({
  __proto__: null,
  Item: Item$1,
  Root: Root$1
});

const MenuBridge = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.createReactComponent)(_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_3__.MenuInstance, {
  events: ["onOpen", "onClose"],
  domEventsRegex: /^onMedia/
});
const Root = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(({ children, ...props }, forwardRef) => {
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(MenuBridge, { ...props, ref: forwardRef }, (props2, instance) => /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
    _vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_3__.Primitive.div,
    {
      ...props2,
      style: { display: !instance.isSubmenu ? "contents" : void 0, ...props2.style }
    },
    children
  ));
});
Root.displayName = "Menu";
const ButtonBridge = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.createReactComponent)(_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_3__.MenuButtonInstance, {
  events: ["onSelect"]
});
const Button = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(
  ({ children, ...props }, forwardRef) => {
    return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(ButtonBridge, { ...props }, (props2) => /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
      _vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_3__.Primitive.button,
      {
        ...props2,
        ref: (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.composeRefs)(props2.ref, forwardRef)
      },
      children
    ));
  }
);
Button.displayName = "MenuButton";
const Portal = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(
  ({ container = null, disabled = false, children, ...props }, forwardRef) => {
    let fullscreen = (0,_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_3__.useMediaState)("fullscreen"), shouldPortal = disabled === "fullscreen" ? !fullscreen : !disabled;
    const target = react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => {
      if (_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_3__.IS_SERVER) return null;
      const node = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.isString)(container) ? document.querySelector(container) : container;
      return node ?? document.body;
    }, [container]);
    return !target || !shouldPortal ? children : (0,react_dom__WEBPACK_IMPORTED_MODULE_1__.createPortal)(
      /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
        _vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_3__.Primitive.div,
        {
          ...props,
          style: { display: "contents", ...props.style },
          ref: forwardRef
        },
        children
      ),
      target
    );
  }
);
Portal.displayName = "MenuPortal";
const ItemsBridge = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.createReactComponent)(_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_3__.MenuItemsInstance);
const Items = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(({ children, ...props }, forwardRef) => {
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(ItemsBridge, { ...props }, (props2) => /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
    _vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_3__.Primitive.div,
    {
      ...props2,
      ref: (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.composeRefs)(props2.ref, forwardRef)
    },
    children
  ));
});
Items.displayName = "MenuItems";
const ItemBridge = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.createReactComponent)(_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_3__.MenuItemInstance);
const Item = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(({ children, ...props }, forwardRef) => {
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(ItemBridge, { ...props }, (props2) => /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
    _vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_3__.Primitive.div,
    {
      ...props2,
      ref: (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.composeRefs)(props2.ref, forwardRef)
    },
    children
  ));
});
Item.displayName = "MenuItem";

var menu = /*#__PURE__*/Object.freeze({
  __proto__: null,
  Button: Button,
  Content: Items,
  Item: Item,
  Items: Items,
  Portal: Portal,
  Radio: Item$1,
  RadioGroup: Root$1,
  Root: Root
});

const GestureBridge = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.createReactComponent)(_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_3__.GestureInstance, {
  events: ["onWillTrigger", "onTrigger"]
});
const Gesture = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(
  ({ children, ...props }, forwardRef) => {
    return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(GestureBridge, { ...props, ref: forwardRef }, (props2) => /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_3__.Primitive.div, { ...props2 }, children));
  }
);
Gesture.displayName = "Gesture";

const TimeBridge = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.createReactComponent)(_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_3__.TimeInstance);
const Time = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(({ children, ...props }, forwardRef) => {
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(TimeBridge, { ...props }, (props2, instance) => /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
    TimeText,
    {
      ...props2,
      instance,
      ref: (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.composeRefs)(props2.ref, forwardRef)
    },
    children
  ));
});
Time.displayName = "Time";
const TimeText = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(
  ({ instance, children, ...props }, forwardRef) => {
    const { timeText } = instance.$state, $timeText = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.useSignal)(timeText);
    return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_3__.Primitive.div, { ...props, ref: forwardRef }, $timeText, children);
  }
);
TimeText.displayName = "TimeText";

function useMediaPlayer() {
  const context = useMediaContext();
  if (!context) {
    throw Error(
      "[vidstack] no media context was found - was this called outside of `<MediaPlayer>`?"
    );
  }
  return context?.player || null;
}

function useAudioOptions() {
  const media = useMediaContext(), { audioTracks, audioTrack } = media.$state, $audioTracks = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.useSignal)(audioTracks);
  (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.useSignal)(audioTrack);
  return react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => {
    const options = $audioTracks.map((track) => ({
      track,
      label: track.label,
      value: getTrackValue$1(track),
      get selected() {
        return audioTrack() === track;
      },
      select(trigger) {
        const index = audioTracks().indexOf(track);
        if (index >= 0) media.remote.changeAudioTrack(index, trigger);
      }
    }));
    Object.defineProperty(options, "disabled", {
      get() {
        return options.length <= 1;
      }
    });
    Object.defineProperty(options, "selectedTrack", {
      get() {
        return audioTrack();
      }
    });
    Object.defineProperty(options, "selectedValue", {
      get() {
        const track = audioTrack();
        return track ? getTrackValue$1(track) : void 0;
      }
    });
    return options;
  }, [$audioTracks]);
}
function getTrackValue$1(track) {
  return track.label.toLowerCase();
}

function useCaptionOptions({ off = true } = {}) {
  const media = useMediaContext(), { textTracks, textTrack } = media.$state, $textTracks = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.useSignal)(textTracks);
  (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.useSignal)(textTrack);
  return react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => {
    const captionTracks = $textTracks.filter(_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_3__.isTrackCaptionKind), options = captionTracks.map((track) => ({
      track,
      label: track.label,
      value: getTrackValue(track),
      get selected() {
        return textTrack() === track;
      },
      select(trigger) {
        const index = textTracks().indexOf(track);
        if (index >= 0) media.remote.changeTextTrackMode(index, "showing", trigger);
      }
    }));
    if (off) {
      options.unshift({
        track: null,
        label: (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.isString)(off) ? off : "Off",
        value: "off",
        get selected() {
          return !textTrack();
        },
        select(trigger) {
          media.remote.toggleCaptions(trigger);
        }
      });
    }
    Object.defineProperty(options, "disabled", {
      get() {
        return !captionTracks.length;
      }
    });
    Object.defineProperty(options, "selectedTrack", {
      get() {
        return textTrack();
      }
    });
    Object.defineProperty(options, "selectedValue", {
      get() {
        const track = textTrack();
        return track ? getTrackValue(track) : "off";
      }
    });
    return options;
  }, [$textTracks]);
}
function getTrackValue(track) {
  return track.id + ":" + track.kind + "-" + track.label.toLowerCase();
}




/***/ }),

/***/ "./node_modules/@vidstack/react/dev/chunks/vidstack-BIA_pmri.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@vidstack/react/dev/chunks/vidstack-BIA_pmri.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DefaultAudioLayout: () => (/* binding */ DefaultAudioLayout),
/* harmony export */   DefaultBufferingIndicator: () => (/* binding */ DefaultBufferingIndicator),
/* harmony export */   DefaultKeyboardDisplay: () => (/* binding */ DefaultKeyboardDisplay),
/* harmony export */   DefaultLayoutContext: () => (/* binding */ DefaultLayoutContext),
/* harmony export */   DefaultMenuButton: () => (/* binding */ DefaultMenuButton),
/* harmony export */   DefaultMenuCheckbox: () => (/* binding */ DefaultMenuCheckbox),
/* harmony export */   DefaultMenuItem: () => (/* binding */ DefaultMenuItem),
/* harmony export */   DefaultMenuRadioGroup: () => (/* binding */ DefaultMenuRadioGroup),
/* harmony export */   DefaultMenuSection: () => (/* binding */ DefaultMenuSection),
/* harmony export */   DefaultMenuSliderItem: () => (/* binding */ DefaultMenuSliderItem),
/* harmony export */   DefaultSliderParts: () => (/* binding */ DefaultSliderParts),
/* harmony export */   DefaultSliderSteps: () => (/* binding */ DefaultSliderSteps),
/* harmony export */   DefaultTooltip: () => (/* binding */ DefaultTooltip),
/* harmony export */   DefaultVideoGestures: () => (/* binding */ DefaultVideoGestures),
/* harmony export */   DefaultVideoLargeLayout: () => (/* binding */ DefaultVideoLargeLayout),
/* harmony export */   DefaultVideoLayout: () => (/* binding */ DefaultVideoLayout),
/* harmony export */   DefaultVideoSmallLayout: () => (/* binding */ DefaultVideoSmallLayout),
/* harmony export */   createRadioOptions: () => (/* binding */ createRadioOptions),
/* harmony export */   i18n: () => (/* binding */ i18n),
/* harmony export */   useDefaultLayoutContext: () => (/* binding */ useDefaultLayoutContext),
/* harmony export */   useDefaultLayoutWord: () => (/* binding */ useDefaultLayoutWord)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./vidstack-D_bWd66h.js */ "./node_modules/@vidstack/react/dev/chunks/vidstack-D_bWd66h.js");
/* harmony import */ var _vidstack_GeL5yun1_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./vidstack-GeL5yun1.js */ "./node_modules/@vidstack/react/dev/chunks/vidstack-GeL5yun1.js");
/* harmony import */ var _vidstack_BPOD0tS4_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./vidstack-BPOD0tS4.js */ "./node_modules/@vidstack/react/dev/chunks/vidstack-BPOD0tS4.js");
/* harmony import */ var _vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./vidstack--AIGOV5A.js */ "./node_modules/@vidstack/react/dev/chunks/vidstack--AIGOV5A.js");
/* harmony import */ var _vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./vidstack-DUlCophs.js */ "./node_modules/@vidstack/react/dev/chunks/vidstack-DUlCophs.js");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "react-dom");
/* harmony import */ var _vidstack_D_hQD1eE_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./vidstack-D-hQD1eE.js */ "./node_modules/@vidstack/react/dev/chunks/vidstack-D-hQD1eE.js");
"use client"

;








const DefaultLayoutContext = react__WEBPACK_IMPORTED_MODULE_0__.createContext({});
DefaultLayoutContext.displayName = "DefaultLayoutContext";
function useDefaultLayoutContext() {
  return react__WEBPACK_IMPORTED_MODULE_0__.useContext(DefaultLayoutContext);
}
function useDefaultLayoutWord(word) {
  const { translations } = useDefaultLayoutContext();
  return i18n(translations, word);
}
function i18n(translations, word) {
  return translations?.[word] ?? word;
}

function useColorSchemeClass(colorScheme) {
  const systemColorPreference = (0,_vidstack_BPOD0tS4_js__WEBPACK_IMPORTED_MODULE_2__.useColorSchemePreference)();
  if (colorScheme === "default") {
    return null;
  } else if (colorScheme === "system") {
    return systemColorPreference;
  } else {
    return colorScheme;
  }
}

function createDefaultMediaLayout({
  type,
  smLayoutWhen,
  renderLayout
}) {
  const Layout = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(
    ({
      children,
      className,
      disableTimeSlider = false,
      hideQualityBitrate = false,
      icons,
      colorScheme = "system",
      download = null,
      menuContainer = null,
      menuGroup = "bottom",
      noAudioGain = false,
      audioGains = { min: 0, max: 300, step: 25 },
      noGestures = false,
      noKeyboardAnimations = false,
      noModal = false,
      noScrubGesture,
      playbackRates = { min: 0, max: 2, step: 0.25 },
      seekStep = 10,
      showMenuDelay,
      showTooltipDelay = 700,
      sliderChaptersMinWidth = 325,
      slots,
      smallLayoutWhen = smLayoutWhen,
      thumbnails = null,
      translations,
      ...props
    }, forwardRef) => {
      const media = (0,_vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.useMediaContext)(), $load = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_4__.useSignal)(media.$props.load), $canLoad = (0,_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_5__.useMediaState)("canLoad"), $viewType = (0,_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_5__.useMediaState)("viewType"), $streamType = (0,_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_5__.useMediaState)("streamType"), $smallWhen = (0,_vidstack_GeL5yun1_js__WEBPACK_IMPORTED_MODULE_6__.createComputed)(() => {
        return (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_4__.isBoolean)(smallLayoutWhen) ? smallLayoutWhen : smallLayoutWhen(media.player.state);
      }, [smallLayoutWhen]), userPrefersAnnouncements = (0,_vidstack_GeL5yun1_js__WEBPACK_IMPORTED_MODULE_6__.createSignal)(true), userPrefersKeyboardAnimations = (0,_vidstack_GeL5yun1_js__WEBPACK_IMPORTED_MODULE_6__.createSignal)(true), isMatch = $viewType === type, isSmallLayout = $smallWhen(), isForcedLayout = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_4__.isBoolean)(smallLayoutWhen), isLoadLayout = $load === "play" && !$canLoad, canRender = $canLoad || isForcedLayout || isLoadLayout, colorSchemeClass = useColorSchemeClass(colorScheme), layoutEl = (0,_vidstack_GeL5yun1_js__WEBPACK_IMPORTED_MODULE_6__.createSignal)(null);
      (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_4__.useSignal)($smallWhen);
      return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
        "div",
        {
          ...props,
          className: `vds-${type}-layout` + (colorSchemeClass ? ` ${colorSchemeClass}` : "") + (className ? ` ${className}` : ""),
          "data-match": isMatch ? "" : null,
          "data-sm": isSmallLayout ? "" : null,
          "data-lg": !isSmallLayout ? "" : null,
          "data-size": isSmallLayout ? "sm" : "lg",
          "data-no-scrub-gesture": noScrubGesture ? "" : null,
          ref: (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_4__.composeRefs)(layoutEl.set, forwardRef)
        },
        canRender && isMatch ? /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
          DefaultLayoutContext.Provider,
          {
            value: {
              disableTimeSlider,
              hideQualityBitrate,
              icons,
              colorScheme,
              download,
              isSmallLayout,
              menuContainer,
              menuGroup,
              noAudioGain,
              audioGains,
              layoutEl,
              noGestures,
              noKeyboardAnimations,
              noModal,
              noScrubGesture,
              showMenuDelay,
              showTooltipDelay,
              sliderChaptersMinWidth,
              slots,
              seekStep,
              playbackRates,
              thumbnails,
              translations,
              userPrefersAnnouncements,
              userPrefersKeyboardAnimations
            }
          },
          renderLayout({ streamType: $streamType, isSmallLayout, isLoadLayout }),
          children
        ) : null
      );
    }
  );
  Layout.displayName = "DefaultMediaLayout";
  return Layout;
}

function useDefaultAudioLayoutSlots() {
  return react__WEBPACK_IMPORTED_MODULE_0__.useContext(DefaultLayoutContext).slots;
}
function useDefaultVideoLayoutSlots() {
  return react__WEBPACK_IMPORTED_MODULE_0__.useContext(DefaultLayoutContext).slots;
}
function slot(slots, name, defaultValue) {
  const slot2 = slots?.[name], capitalizedName = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_4__.uppercaseFirstChar)(name);
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, slots?.[`before${capitalizedName}`], (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_4__.isUndefined)(slot2) ? defaultValue : slot2, slots?.[`after${capitalizedName}`]);
}

function DefaultAnnouncer() {
  const { userPrefersAnnouncements, translations } = useDefaultLayoutContext(), $userPrefersAnnouncements = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_4__.useSignal)(userPrefersAnnouncements);
  if (!$userPrefersAnnouncements) return null;
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_vidstack_GeL5yun1_js__WEBPACK_IMPORTED_MODULE_6__.MediaAnnouncer, { translations });
}
DefaultAnnouncer.displayName = "DefaultAnnouncer";

function DefaultTooltip({ content, placement, children }) {
  const { showTooltipDelay } = useDefaultLayoutContext();
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_vidstack_GeL5yun1_js__WEBPACK_IMPORTED_MODULE_6__.Root, { showDelay: showTooltipDelay }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_vidstack_GeL5yun1_js__WEBPACK_IMPORTED_MODULE_6__.Trigger, { asChild: true }, children), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_vidstack_GeL5yun1_js__WEBPACK_IMPORTED_MODULE_6__.Content, { className: "vds-tooltip-content", placement }, content));
}
DefaultTooltip.displayName = "DefaultTooltip";

function DefaultPlayButton({ tooltip }) {
  const { icons: Icons } = useDefaultLayoutContext(), playText = useDefaultLayoutWord("Play"), pauseText = useDefaultLayoutWord("Pause"), $paused = (0,_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_5__.useMediaState)("paused"), $ended = (0,_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_5__.useMediaState)("ended");
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultTooltip, { content: $paused ? playText : pauseText, placement: tooltip }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.PlayButton, { className: "vds-play-button vds-button", "aria-label": playText }, $ended ? /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(Icons.PlayButton.Replay, { className: "vds-icon" }) : $paused ? /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(Icons.PlayButton.Play, { className: "vds-icon" }) : /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(Icons.PlayButton.Pause, { className: "vds-icon" })));
}
DefaultPlayButton.displayName = "DefaultPlayButton";
const DefaultMuteButton = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(
  ({ tooltip }, forwardRef) => {
    const { icons: Icons } = useDefaultLayoutContext(), muteText = useDefaultLayoutWord("Mute"), unmuteText = useDefaultLayoutWord("Unmute"), $muted = (0,_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_5__.useMediaState)("muted"), $volume = (0,_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_5__.useMediaState)("volume");
    return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultTooltip, { content: $muted ? unmuteText : muteText, placement: tooltip }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.MuteButton, { className: "vds-mute-button vds-button", "aria-label": muteText, ref: forwardRef }, $muted || $volume == 0 ? /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(Icons.MuteButton.Mute, { className: "vds-icon" }) : $volume < 0.5 ? /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(Icons.MuteButton.VolumeLow, { className: "vds-icon" }) : /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(Icons.MuteButton.VolumeHigh, { className: "vds-icon" })));
  }
);
DefaultMuteButton.displayName = "DefaultMuteButton";
function DefaultCaptionButton({ tooltip }) {
  const { icons: Icons } = useDefaultLayoutContext(), captionsText = useDefaultLayoutWord("Captions"), onText = useDefaultLayoutWord("Closed-Captions On"), offText = useDefaultLayoutWord("Closed-Captions Off"), $track = (0,_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_5__.useMediaState)("textTrack"), isOn = $track && (0,_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_5__.isTrackCaptionKind)($track);
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultTooltip, { content: isOn ? onText : offText, placement: tooltip }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.CaptionButton, { className: "vds-caption-button vds-button", "aria-label": captionsText }, isOn ? /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(Icons.CaptionButton.On, { className: "vds-icon" }) : /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(Icons.CaptionButton.Off, { className: "vds-icon" })));
}
DefaultCaptionButton.displayName = "DefaultCaptionButton";
function DefaultPIPButton({ tooltip }) {
  const { icons: Icons } = useDefaultLayoutContext(), pipText = useDefaultLayoutWord("PiP"), enterText = useDefaultLayoutWord("Enter PiP"), exitText = useDefaultLayoutWord("Exit PiP"), $pip = (0,_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_5__.useMediaState)("pictureInPicture");
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultTooltip, { content: $pip ? exitText : enterText, placement: tooltip }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.PIPButton, { className: "vds-pip-button vds-button", "aria-label": pipText }, $pip ? /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(Icons.PIPButton.Exit, { className: "vds-icon" }) : /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(Icons.PIPButton.Enter, { className: "vds-icon" })));
}
DefaultPIPButton.displayName = "DefaultPIPButton";
function DefaultFullscreenButton({ tooltip }) {
  const { icons: Icons } = useDefaultLayoutContext(), fullscreenText = useDefaultLayoutWord("Fullscreen"), enterText = useDefaultLayoutWord("Enter Fullscreen"), exitText = useDefaultLayoutWord("Exit Fullscreen"), $fullscreen = (0,_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_5__.useMediaState)("fullscreen");
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultTooltip, { content: $fullscreen ? exitText : enterText, placement: tooltip }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.FullscreenButton, { className: "vds-fullscreen-button vds-button", "aria-label": fullscreenText }, $fullscreen ? /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(Icons.FullscreenButton.Exit, { className: "vds-icon" }) : /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(Icons.FullscreenButton.Enter, { className: "vds-icon" })));
}
DefaultFullscreenButton.displayName = "DefaultFullscreenButton";
function DefaultSeekButton({
  backward,
  tooltip
}) {
  const { icons: Icons, seekStep } = useDefaultLayoutContext(), seekForwardText = useDefaultLayoutWord("Seek Forward"), seekBackwardText = useDefaultLayoutWord("Seek Backward"), seconds = (backward ? -1 : 1) * seekStep, label = seconds >= 0 ? seekForwardText : seekBackwardText;
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultTooltip, { content: label, placement: tooltip }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.SeekButton, { className: "vds-seek-button vds-button", seconds, "aria-label": label }, seconds >= 0 ? /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(Icons.SeekButton.Forward, { className: "vds-icon" }) : /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(Icons.SeekButton.Backward, { className: "vds-icon" })));
}
DefaultSeekButton.displayName = "DefaultSeekButton";
function DefaultAirPlayButton({ tooltip }) {
  const { icons: Icons } = useDefaultLayoutContext(), airPlayText = useDefaultLayoutWord("AirPlay"), $state = (0,_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_5__.useMediaState)("remotePlaybackState"), stateText = useDefaultLayoutWord((0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_4__.uppercaseFirstChar)($state)), label = `${airPlayText} ${stateText}`, Icon = ($state === "connecting" ? Icons.AirPlayButton.Connecting : $state === "connected" ? Icons.AirPlayButton.Connected : null) ?? Icons.AirPlayButton.Default;
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultTooltip, { content: airPlayText, placement: tooltip }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.AirPlayButton, { className: "vds-airplay-button vds-button", "aria-label": label }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(Icon, { className: "vds-icon" })));
}
DefaultAirPlayButton.displayName = "DefaultAirPlayButton";
function DefaultGoogleCastButton({ tooltip }) {
  const { icons: Icons } = useDefaultLayoutContext(), googleCastText = useDefaultLayoutWord("Google Cast"), $state = (0,_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_5__.useMediaState)("remotePlaybackState"), stateText = useDefaultLayoutWord((0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_4__.uppercaseFirstChar)($state)), label = `${googleCastText} ${stateText}`, Icon = ($state === "connecting" ? Icons.GoogleCastButton.Connecting : $state === "connected" ? Icons.GoogleCastButton.Connected : null) ?? Icons.GoogleCastButton.Default;
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultTooltip, { content: googleCastText, placement: tooltip }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_vidstack_GeL5yun1_js__WEBPACK_IMPORTED_MODULE_6__.GoogleCastButton, { className: "vds-google-cast-button vds-button", "aria-label": label }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(Icon, { className: "vds-icon" })));
}
DefaultGoogleCastButton.displayName = "DefaultGoogleCastButton";
function DefaultLiveButton() {
  const $live = (0,_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_5__.useMediaState)("live"), label = useDefaultLayoutWord("Skip To Live"), liveText = useDefaultLayoutWord("LIVE");
  return $live ? /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.LiveButton, { className: "vds-live-button", "aria-label": label }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { className: "vds-live-button-text" }, liveText)) : null;
}
DefaultLiveButton.displayName = "DefaultLiveButton";
function DefaultDownloadButton() {
  const { download, icons: Icons } = useDefaultLayoutContext(), $src = (0,_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_5__.useMediaState)("source"), $title = (0,_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_5__.useMediaState)("title"), file = (0,_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_5__.getDownloadFile)({
    title: $title,
    src: $src,
    download
  }), downloadText = useDefaultLayoutWord("Download");
  return (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_4__.isString)(file?.url) ? /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultTooltip, { content: downloadText, placement: "top" }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
    "a",
    {
      role: "button",
      className: "vds-download-button vds-button",
      "aria-label": downloadText,
      href: (0,_vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.appendParamsToURL)(file.url, { download: file.name }),
      download: file.name,
      target: "_blank"
    },
    Icons.DownloadButton ? /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(Icons.DownloadButton.Default, { className: "vds-icon" }) : null
  )) : null;
}
DefaultDownloadButton.displayName = "DefaultDownloadButton";

function DefaultCaptions() {
  const exampleText = useDefaultLayoutWord("Captions look like this");
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_vidstack_GeL5yun1_js__WEBPACK_IMPORTED_MODULE_6__.Captions, { className: "vds-captions", exampleText });
}
DefaultCaptions.displayName = "DefaultCaptions";

function DefaultControlsSpacer() {
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: "vds-controls-spacer" });
}
DefaultControlsSpacer.displayName = "DefaultControlsSpacer";

function useParentDialogEl() {
  const { layoutEl } = useDefaultLayoutContext(), $layoutEl = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_4__.useSignal)(layoutEl);
  return react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => $layoutEl?.closest("dialog"), [$layoutEl]);
}

function DefaultChaptersMenu({ tooltip, placement, portalClass = "" }) {
  const {
    showMenuDelay,
    noModal,
    isSmallLayout,
    icons: Icons,
    menuGroup,
    menuContainer,
    colorScheme
  } = useDefaultLayoutContext(), chaptersText = useDefaultLayoutWord("Chapters"), options = (0,_vidstack_GeL5yun1_js__WEBPACK_IMPORTED_MODULE_6__.useChapterOptions)(), disabled = !options.length, { thumbnails } = useDefaultLayoutContext(), $src = (0,_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_5__.useMediaState)("currentSrc"), $viewType = (0,_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_5__.useMediaState)("viewType"), $offset = !isSmallLayout && menuGroup === "bottom" && $viewType === "video" ? 26 : 0, $RemotionThumbnail = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_4__.useSignal)(_vidstack_D_hQD1eE_js__WEBPACK_IMPORTED_MODULE_7__.RemotionThumbnail), colorSchemeClass = useColorSchemeClass(colorScheme), [isOpen, setIsOpen] = react__WEBPACK_IMPORTED_MODULE_0__.useState(false), dialogEl = useParentDialogEl();
  if (disabled) return null;
  function onOpen() {
    (0,react_dom__WEBPACK_IMPORTED_MODULE_1__.flushSync)(() => {
      setIsOpen(true);
    });
  }
  function onClose() {
    setIsOpen(false);
  }
  const Content = /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
    _vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.Items,
    {
      className: "vds-chapters-menu-items vds-menu-items",
      placement,
      offset: $offset
    },
    isOpen ? /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
      _vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.Root$3,
      {
        className: "vds-chapters-radio-group vds-radio-group",
        value: options.selectedValue,
        "data-thumbnails": thumbnails ? "" : null
      },
      options.map(
        ({ cue, label, value, startTimeText, durationText, select, setProgressVar }) => /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
          _vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.Item,
          {
            className: "vds-chapter-radio vds-radio",
            value,
            key: value,
            onSelect: select,
            ref: setProgressVar
          },
          thumbnails ? /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.Root, { src: thumbnails, className: "vds-thumbnail", time: cue.startTime }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.Img, null)) : $RemotionThumbnail && (0,_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_5__.isRemotionSrc)($src) ? /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement($RemotionThumbnail, { className: "vds-thumbnail", frame: cue.startTime * $src.fps }) : null,
          /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: "vds-chapter-radio-content" }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { className: "vds-chapter-radio-label" }, label), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { className: "vds-chapter-radio-start-time" }, startTimeText), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { className: "vds-chapter-radio-duration" }, durationText))
        )
      )
    ) : null
  );
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
    _vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.Root$2,
    {
      className: "vds-chapters-menu vds-menu",
      showDelay: showMenuDelay,
      onOpen,
      onClose
    },
    /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultTooltip, { content: chaptersText, placement: tooltip }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
      _vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.Button,
      {
        className: "vds-menu-button vds-button",
        disabled,
        "aria-label": chaptersText
      },
      /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(Icons.Menu.Chapters, { className: "vds-icon" })
    )),
    noModal || !isSmallLayout ? Content : /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
      _vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.Portal,
      {
        container: menuContainer ?? dialogEl,
        className: portalClass + (colorSchemeClass ? ` ${colorSchemeClass}` : ""),
        disabled: "fullscreen",
        "data-sm": isSmallLayout ? "" : null,
        "data-lg": !isSmallLayout ? "" : null,
        "data-size": isSmallLayout ? "sm" : "lg"
      },
      Content
    )
  );
}
DefaultChaptersMenu.displayName = "DefaultChaptersMenu";

const FONT_COLOR_OPTION = {
  type: "color"
};
const FONT_FAMILY_OPTION = {
  type: "radio",
  values: {
    "Monospaced Serif": "mono-serif",
    "Proportional Serif": "pro-serif",
    "Monospaced Sans-Serif": "mono-sans",
    "Proportional Sans-Serif": "pro-sans",
    Casual: "casual",
    Cursive: "cursive",
    "Small Capitals": "capitals"
  }
};
const FONT_SIZE_OPTION = {
  type: "slider",
  min: 0,
  max: 400,
  step: 25,
  upIcon: null,
  downIcon: null
};
const FONT_OPACITY_OPTION = {
  type: "slider",
  min: 0,
  max: 100,
  step: 5,
  upIcon: null,
  downIcon: null
};
const FONT_TEXT_SHADOW_OPTION = {
  type: "radio",
  values: ["None", "Drop Shadow", "Raised", "Depressed", "Outline"]
};
const FONT_DEFAULTS = {
  fontFamily: "pro-sans",
  fontSize: "100%",
  textColor: "#ffffff",
  textOpacity: "100%",
  textShadow: "none",
  textBg: "#000000",
  textBgOpacity: "100%",
  displayBg: "#000000",
  displayBgOpacity: "0%"
};
const FONT_SIGNALS = Object.keys(FONT_DEFAULTS).reduce(
  (prev, type) => ({
    ...prev,
    [type]: (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_4__.signal)(FONT_DEFAULTS[type])
  }),
  {}
);
if (!_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_5__.IS_SERVER) {
  for (const type of Object.keys(FONT_SIGNALS)) {
    const value = localStorage.getItem(`vds-player:${(0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_4__.camelToKebabCase)(type)}`);
    if ((0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_4__.isString)(value)) FONT_SIGNALS[type].set(value);
  }
}
function onFontReset() {
  for (const type of Object.keys(FONT_SIGNALS)) {
    const defaultValue = FONT_DEFAULTS[type];
    FONT_SIGNALS[type].set(defaultValue);
  }
}

function hexToRgb(hex) {
  const { style } = new Option();
  style.color = hex;
  return style.color.match(/\((.*?)\)/)[1].replace(/,/g, " ");
}

let isWatchingVars = false, players = /* @__PURE__ */ new Set();
function updateFontCssVars() {
  if (_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_5__.IS_SERVER) return;
  const { player } = (0,_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_5__.useMediaContext)();
  players.add(player);
  (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_4__.onDispose)(() => players.delete(player));
  if (!isWatchingVars) {
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_4__.scoped)(() => {
      for (const type of (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_4__.keysOf)(FONT_SIGNALS)) {
        const $value = FONT_SIGNALS[type], defaultValue = FONT_DEFAULTS[type], varName = `--media-user-${(0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_4__.camelToKebabCase)(type)}`, storageKey = `vds-player:${(0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_4__.camelToKebabCase)(type)}`;
        (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_4__.effect)(() => {
          const value = $value(), isDefaultVarValue = value === defaultValue, varValue = !isDefaultVarValue ? getCssVarValue(player, type, value) : null;
          for (const player2 of players) {
            player2.el?.style.setProperty(varName, varValue);
          }
          if (isDefaultVarValue) {
            localStorage.removeItem(storageKey);
          } else {
            localStorage.setItem(storageKey, value);
          }
        });
      }
    }, null);
    isWatchingVars = true;
  }
}
function getCssVarValue(player, type, value) {
  switch (type) {
    case "fontFamily":
      const fontVariant = value === "capitals" ? "small-caps" : "";
      player.el?.style.setProperty("--media-user-font-variant", fontVariant);
      return getFontFamilyCSSVarValue(value);
    case "fontSize":
    case "textOpacity":
    case "textBgOpacity":
    case "displayBgOpacity":
      return percentToRatio(value);
    case "textColor":
      return `rgb(${hexToRgb(value)} / var(--media-user-text-opacity, 1))`;
    case "textShadow":
      return getTextShadowCssVarValue(value);
    case "textBg":
      return `rgb(${hexToRgb(value)} / var(--media-user-text-bg-opacity, 1))`;
    case "displayBg":
      return `rgb(${hexToRgb(value)} / var(--media-user-display-bg-opacity, 1))`;
  }
}
function percentToRatio(value) {
  return (parseInt(value) / 100).toString();
}
function getFontFamilyCSSVarValue(value) {
  switch (value) {
    case "mono-serif":
      return '"Courier New", Courier, "Nimbus Mono L", "Cutive Mono", monospace';
    case "mono-sans":
      return '"Deja Vu Sans Mono", "Lucida Console", Monaco, Consolas, "PT Mono", monospace';
    case "pro-sans":
      return 'Roboto, "Arial Unicode Ms", Arial, Helvetica, Verdana, "PT Sans Caption", sans-serif';
    case "casual":
      return '"Comic Sans MS", Impact, Handlee, fantasy';
    case "cursive":
      return '"Monotype Corsiva", "URW Chancery L", "Apple Chancery", "Dancing Script", cursive';
    case "capitals":
      return '"Arial Unicode Ms", Arial, Helvetica, Verdana, "Marcellus SC", sans-serif + font-variant=small-caps';
    default:
      return '"Times New Roman", Times, Georgia, Cambria, "PT Serif Caption", serif';
  }
}
function getTextShadowCssVarValue(value) {
  switch (value) {
    case "drop shadow":
      return "rgb(34, 34, 34) 1.86389px 1.86389px 2.79583px, rgb(34, 34, 34) 1.86389px 1.86389px 3.72778px, rgb(34, 34, 34) 1.86389px 1.86389px 4.65972px";
    case "raised":
      return "rgb(34, 34, 34) 1px 1px, rgb(34, 34, 34) 2px 2px";
    case "depressed":
      return "rgb(204, 204, 204) 1px 1px, rgb(34, 34, 34) -1px -1px";
    case "outline":
      return "rgb(34, 34, 34) 0px 0px 1.86389px, rgb(34, 34, 34) 0px 0px 1.86389px, rgb(34, 34, 34) 0px 0px 1.86389px, rgb(34, 34, 34) 0px 0px 1.86389px, rgb(34, 34, 34) 0px 0px 1.86389px";
    default:
      return "";
  }
}

function DefaultMenuSection({ label, value, children }) {
  const id = react__WEBPACK_IMPORTED_MODULE_0__.useId();
  if (!label) {
    return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: "vds-menu-section" }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: "vds-menu-section-body" }, children));
  }
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement("section", { className: "vds-menu-section", role: "group", "aria-labelledby": id }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: "vds-menu-section-title" }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement("header", { id }, label), value ? /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: "vds-menu-section-value" }, value) : null), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: "vds-menu-section-body" }, children));
}
DefaultMenuSection.displayName = "DefaultMenuSection";
function DefaultMenuButton({ label, hint = "", Icon, disabled = false }) {
  const { icons: Icons } = react__WEBPACK_IMPORTED_MODULE_0__.useContext(DefaultLayoutContext);
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.Button, { className: "vds-menu-item", disabled }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(Icons.Menu.ArrowLeft, { className: "vds-menu-close-icon vds-icon" }), Icon ? /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(Icon, { className: "vds-menu-item-icon vds-icon" }) : null, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { className: "vds-menu-item-label" }, label), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { className: "vds-menu-item-hint" }, hint), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(Icons.Menu.ArrowRight, { className: "vds-menu-open-icon vds-icon" }));
}
DefaultMenuButton.displayName = "DefaultMenuButton";
function DefaultMenuItem({ label, children }) {
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: "vds-menu-item" }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: "vds-menu-item-label" }, label), children);
}
DefaultMenuItem.displayName = "DefaultMenuItem";
function DefaultMenuRadioGroup({ value, options, onChange }) {
  const { icons: Icons } = useDefaultLayoutContext();
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.Root$3, { className: "vds-radio-group", value, onChange }, options.map((option) => /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.Item, { className: "vds-radio", value: option.value, key: option.value }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(Icons.Menu.RadioCheck, { className: "vds-icon" }), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { className: "vds-radio-label", "data-part": "label" }, option.label))));
}
DefaultMenuRadioGroup.displayName = "DefaultMenuRadioGroup";
function createRadioOptions(entries) {
  return react__WEBPACK_IMPORTED_MODULE_0__.useMemo(
    () => (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_4__.isArray)(entries) ? entries.map((entry) => ({ label: entry, value: entry.toLowerCase() })) : Object.keys(entries).map((label) => ({ label, value: entries[label] })),
    [entries]
  );
}

function DefaultMenuSliderItem({
  label,
  value,
  UpIcon,
  DownIcon,
  children,
  isMin,
  isMax
}) {
  const hasTitle = label || value, Content = /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, DownIcon ? /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DownIcon, { className: "vds-icon down" }) : null, children, UpIcon ? /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(UpIcon, { className: "vds-icon up" }) : null);
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
    "div",
    {
      className: `vds-menu-item vds-menu-slider-item${hasTitle ? " group" : ""}`,
      "data-min": isMin ? "" : null,
      "data-max": isMax ? "" : null
    },
    hasTitle ? /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: "vds-menu-slider-title" }, label ? /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null, label) : null, value ? /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null, value) : null), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: "vds-menu-slider-body" }, Content)) : Content
  );
}
DefaultMenuSliderItem.displayName = "DefaultMenuSliderItem";
function DefaultSliderParts() {
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.Track, { className: "vds-slider-track" }), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.TrackFill, { className: "vds-slider-track-fill vds-slider-track" }), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.Thumb, { className: "vds-slider-thumb" }));
}
DefaultSliderParts.displayName = "DefaultSliderParts";
function DefaultSliderSteps() {
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.Steps, { className: "vds-slider-steps" }, (step) => /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: "vds-slider-step", key: String(step) }));
}
DefaultSliderSteps.displayName = "DefaultSliderSteps";

function DefaultFontMenu() {
  const label = useDefaultLayoutWord("Caption Styles"), $hasCaptions = (0,_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_5__.useMediaState)("hasCaptions"), fontSectionLabel = useDefaultLayoutWord("Font"), textSectionLabel = useDefaultLayoutWord("Text"), textBgSectionLabel = useDefaultLayoutWord("Text Background"), displayBgSectionLabel = useDefaultLayoutWord("Display Background");
  if (!$hasCaptions) return null;
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.Root$2, { className: "vds-font-menu vds-menu" }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultMenuButton, { label }), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.Items, { className: "vds-font-style-items vds-menu-items" }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultMenuSection, { label: fontSectionLabel }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultFontFamilyMenu, null), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultFontSizeSlider, null)), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultMenuSection, { label: textSectionLabel }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultTextColorInput, null), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultTextShadowMenu, null), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultTextOpacitySlider, null)), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultMenuSection, { label: textBgSectionLabel }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultTextBgInput, null), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultTextBgOpacitySlider, null)), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultMenuSection, { label: displayBgSectionLabel }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultDisplayBgInput, null), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultDisplayBgOpacitySlider, null)), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultMenuSection, null, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultResetMenuItem, null))));
}
DefaultFontMenu.displayName = "DefaultFontMenu";
function DefaultFontFamilyMenu() {
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultFontSetting, { label: "Family", type: "fontFamily", option: FONT_FAMILY_OPTION });
}
DefaultFontFamilyMenu.displayName = "DefaultFontFamilyMenu";
function DefaultFontSizeSlider() {
  const { icons: Icons } = useDefaultLayoutContext(), option = {
    ...FONT_SIZE_OPTION,
    upIcon: Icons.Menu.FontSizeUp,
    downIcon: Icons.Menu.FontSizeDown
  };
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultFontSetting, { label: "Size", type: "fontSize", option });
}
DefaultFontSizeSlider.displayName = "DefaultFontSizeSlider";
function DefaultTextColorInput() {
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultFontSetting, { label: "Color", type: "textColor", option: FONT_COLOR_OPTION });
}
DefaultTextColorInput.displayName = "DefaultTextColorInput";
function DefaultTextOpacitySlider() {
  const { icons: Icons } = useDefaultLayoutContext(), option = {
    ...FONT_OPACITY_OPTION,
    upIcon: Icons.Menu.OpacityUp,
    downIcon: Icons.Menu.OpacityDown
  };
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultFontSetting, { label: "Opacity", type: "textOpacity", option });
}
DefaultTextOpacitySlider.displayName = "DefaultTextOpacitySlider";
function DefaultTextShadowMenu() {
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultFontSetting, { label: "Shadow", type: "textShadow", option: FONT_TEXT_SHADOW_OPTION });
}
DefaultTextShadowMenu.displayName = "DefaultTextShadowMenu";
function DefaultTextBgInput() {
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultFontSetting, { label: "Color", type: "textBg", option: FONT_COLOR_OPTION });
}
DefaultTextBgInput.displayName = "DefaultTextBgInput";
function DefaultTextBgOpacitySlider() {
  const { icons: Icons } = useDefaultLayoutContext(), option = {
    ...FONT_OPACITY_OPTION,
    upIcon: Icons.Menu.OpacityUp,
    downIcon: Icons.Menu.OpacityDown
  };
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultFontSetting, { label: "Opacity", type: "textBgOpacity", option });
}
DefaultTextBgOpacitySlider.displayName = "DefaultTextBgOpacitySlider";
function DefaultDisplayBgInput() {
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultFontSetting, { label: "Color", type: "displayBg", option: FONT_COLOR_OPTION });
}
DefaultDisplayBgInput.displayName = "DefaultDisplayBgInput";
function DefaultDisplayBgOpacitySlider() {
  const { icons: Icons } = useDefaultLayoutContext(), option = {
    ...FONT_OPACITY_OPTION,
    upIcon: Icons.Menu.OpacityUp,
    downIcon: Icons.Menu.OpacityDown
  };
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultFontSetting, { label: "Opacity", type: "displayBgOpacity", option });
}
DefaultDisplayBgOpacitySlider.displayName = "DefaultDisplayBgOpacitySlider";
function DefaultFontSetting({ label, option, type }) {
  const player = (0,_vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.useMediaPlayer)(), $currentValue = FONT_SIGNALS[type], $value = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_4__.useSignal)($currentValue), translatedLabel = useDefaultLayoutWord(label);
  const notify = react__WEBPACK_IMPORTED_MODULE_0__.useCallback(() => {
    player?.dispatchEvent(new Event("vds-font-change"));
  }, [player]);
  const onChange = react__WEBPACK_IMPORTED_MODULE_0__.useCallback(
    (newValue) => {
      $currentValue.set(newValue);
      notify();
    },
    [$currentValue, notify]
  );
  if (option.type === "color") {
    let onColorChange2 = function(event) {
      onChange(event.target.value);
    };
    return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultMenuItem, { label: translatedLabel }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement("input", { className: "vds-color-picker", type: "color", value: $value, onChange: onColorChange2 }));
  }
  if (option.type === "slider") {
    let onSliderValueChange2 = function(value) {
      onChange(value + "%");
    };
    const { min, max, step, upIcon, downIcon } = option;
    return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
      DefaultMenuSliderItem,
      {
        label: translatedLabel,
        value: $value,
        UpIcon: upIcon,
        DownIcon: downIcon,
        isMin: $value === min + "%",
        isMax: $value === max + "%"
      },
      /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
        _vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.Root$5,
        {
          className: "vds-slider",
          min,
          max,
          step,
          keyStep: step,
          value: parseInt($value),
          "aria-label": translatedLabel,
          onValueChange: onSliderValueChange2,
          onDragValueChange: onSliderValueChange2
        },
        /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultSliderParts, null),
        /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultSliderSteps, null)
      )
    );
  }
  if (option.type === "radio") {
    return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
      DefaultFontRadioGroup,
      {
        id: (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_4__.camelToKebabCase)(type),
        label: translatedLabel,
        value: $value,
        values: option.values,
        onChange
      }
    );
  }
  return null;
}
DefaultFontSetting.displayName = "DefaultFontSetting";
function DefaultFontRadioGroup({ id, label, value, values, onChange }) {
  const radioOptions = createRadioOptions(values), { translations } = useDefaultLayoutContext(), hint = react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => {
    const label2 = radioOptions.find((radio) => radio.value === value)?.label || "";
    return i18n(translations, label2);
  }, [value, radioOptions]);
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.Root$2, { className: `vds-${id}-menu vds-menu` }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultMenuButton, { label, hint }), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.Items, { className: "vds-menu-items" }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultMenuRadioGroup, { value, options: radioOptions, onChange })));
}
DefaultFontRadioGroup.displayName = "DefaultFontRadioGroup";
function DefaultResetMenuItem() {
  const resetText = useDefaultLayoutWord("Reset");
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement("button", { className: "vds-menu-item", role: "menuitem", onClick: onFontReset }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { className: "vds-menu-item-label" }, resetText));
}
DefaultResetMenuItem.displayName = "DefaultResetMenuItem";

function DefaultMenuCheckbox({
  label,
  checked,
  storageKey,
  defaultChecked = false,
  onChange
}) {
  const [isChecked, setIsChecked] = react__WEBPACK_IMPORTED_MODULE_0__.useState(defaultChecked), [isActive, setIsActive] = react__WEBPACK_IMPORTED_MODULE_0__.useState(false);
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    const savedValue = storageKey ? localStorage.getItem(storageKey) : null, checked2 = !!(savedValue ?? defaultChecked);
    setIsChecked(checked2);
    onChange?.(checked2);
  }, []);
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    if ((0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_4__.isBoolean)(checked)) setIsChecked(checked);
  }, [checked]);
  function onPress(event) {
    if (event && "button" in event && event?.button === 1) return;
    const toggledCheck = !isChecked;
    setIsChecked(toggledCheck);
    if (storageKey) localStorage.setItem(storageKey, toggledCheck ? "1" : "");
    onChange?.(toggledCheck, event?.nativeEvent);
    setIsActive(false);
  }
  function onActive(event) {
    if (event.button !== 0) return;
    setIsActive(true);
  }
  function onKeyDown(event) {
    if ((0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_4__.isKeyboardClick)(event.nativeEvent)) onPress();
  }
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
    "div",
    {
      className: "vds-menu-checkbox",
      role: "menuitemcheckbox",
      tabIndex: 0,
      "aria-label": label,
      "aria-checked": isChecked ? "true" : "false",
      "data-active": isActive ? "" : null,
      onPointerUp: onPress,
      onPointerDown: onActive,
      onKeyDown
    }
  );
}
DefaultMenuCheckbox.displayName = "DefaultMenuCheckbox";

function DefaultAccessibilityMenu({ slots }) {
  const label = useDefaultLayoutWord("Accessibility"), { icons: Icons } = useDefaultLayoutContext();
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.Root$2, { className: "vds-accessibility-menu vds-menu" }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultMenuButton, { label, Icon: Icons.Menu.Accessibility }), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.Items, { className: "vds-menu-items" }, slot(slots, "accessibilityMenuItemsStart", null), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultMenuSection, null, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultAnnouncementsMenuCheckbox, null), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultKeyboardAnimationsMenuCheckbox, null)), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultMenuSection, null, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultFontMenu, null)), slot(slots, "accessibilityMenuItemsEnd", null)));
}
DefaultAccessibilityMenu.displayName = "DefaultAccessibilityMenu";
function DefaultAnnouncementsMenuCheckbox() {
  const { userPrefersAnnouncements } = useDefaultLayoutContext(), label = useDefaultLayoutWord("Announcements");
  function onChange(checked) {
    userPrefersAnnouncements.set(checked);
  }
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultMenuItem, { label }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
    DefaultMenuCheckbox,
    {
      label,
      defaultChecked: true,
      storageKey: "vds-player::announcements",
      onChange
    }
  ));
}
DefaultAnnouncementsMenuCheckbox.displayName = "DefaultAnnouncementsMenuCheckbox";
function DefaultKeyboardAnimationsMenuCheckbox() {
  const $viewType = (0,_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_5__.useMediaState)("viewType"), { userPrefersKeyboardAnimations, noKeyboardAnimations } = useDefaultLayoutContext(), label = useDefaultLayoutWord("Keyboard Animations");
  if ($viewType !== "video" || noKeyboardAnimations) return null;
  function onChange(checked) {
    userPrefersKeyboardAnimations.set(checked);
  }
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultMenuItem, { label }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
    DefaultMenuCheckbox,
    {
      label,
      defaultChecked: true,
      storageKey: "vds-player::keyboard-animations",
      onChange
    }
  ));
}
DefaultKeyboardAnimationsMenuCheckbox.displayName = "DefaultKeyboardAnimationsMenuCheckbox";

function DefaultAudioMenu({ slots }) {
  const label = useDefaultLayoutWord("Audio"), $canSetAudioGain = (0,_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_5__.useMediaState)("canSetAudioGain"), $audioTracks = (0,_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_5__.useMediaState)("audioTracks"), { noAudioGain, icons: Icons } = useDefaultLayoutContext(), hasGainSlider = $canSetAudioGain && !noAudioGain, $disabled = !hasGainSlider && $audioTracks.length <= 1;
  if ($disabled) return null;
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.Root$2, { className: "vds-audio-menu vds-menu" }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultMenuButton, { label, Icon: Icons.Menu.Audio }), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.Items, { className: "vds-menu-items" }, slot(slots, "audioMenuItemsStart", null), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultAudioTracksMenu, null), hasGainSlider ? /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultAudioBoostMenuSection, null) : null, slot(slots, "audioMenuItemsEnd", null)));
}
DefaultAudioMenu.displayName = "DefaultAudioMenu";
function DefaultAudioBoostMenuSection() {
  const $audioGain = (0,_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_5__.useMediaState)("audioGain"), label = useDefaultLayoutWord("Boost"), value = Math.round((($audioGain ?? 1) - 1) * 100) + "%", $canSetAudioGain = (0,_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_5__.useMediaState)("canSetAudioGain"), { noAudioGain, icons: Icons } = useDefaultLayoutContext(), $disabled = !$canSetAudioGain || noAudioGain, min = useGainMin(), max = useGainMax();
  if ($disabled) return null;
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultMenuSection, { label, value }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
    DefaultMenuSliderItem,
    {
      UpIcon: Icons.Menu.AudioBoostUp,
      DownIcon: Icons.Menu.AudioBoostDown,
      isMin: (($audioGain ?? 1) - 1) * 100 <= min,
      isMax: (($audioGain ?? 1) - 1) * 100 === max
    },
    /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultAudioGainSlider, null)
  ));
}
DefaultAudioBoostMenuSection.displayName = "DefaultAudioBoostMenuSection";
function useGainMin() {
  const { audioGains } = useDefaultLayoutContext(), min = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_4__.isArray)(audioGains) ? audioGains[0] : audioGains?.min;
  return min ?? 0;
}
function useGainMax() {
  const { audioGains } = useDefaultLayoutContext(), max = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_4__.isArray)(audioGains) ? audioGains[audioGains.length - 1] : audioGains?.max;
  return max ?? 300;
}
function useGainStep() {
  const { audioGains } = useDefaultLayoutContext(), step = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_4__.isArray)(audioGains) ? audioGains[1] - audioGains[0] : audioGains?.step;
  return step || 25;
}
function DefaultAudioGainSlider() {
  const label = useDefaultLayoutWord("Audio Boost"), min = useGainMin(), max = useGainMax(), step = useGainStep();
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
    _vidstack_GeL5yun1_js__WEBPACK_IMPORTED_MODULE_6__.Root$1,
    {
      className: "vds-audio-gain-slider vds-slider",
      "aria-label": label,
      min,
      max,
      step,
      keyStep: step
    },
    /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultSliderParts, null),
    /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultSliderSteps, null)
  );
}
DefaultAudioGainSlider.displayName = "DefaultAudioGainSlider";
function DefaultAudioTracksMenu() {
  const { icons: Icons } = useDefaultLayoutContext(), label = useDefaultLayoutWord("Track"), defaultText = useDefaultLayoutWord("Default"), $track = (0,_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_5__.useMediaState)("audioTrack"), options = (0,_vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.useAudioOptions)();
  if (options.disabled) return null;
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.Root$2, { className: "vds-audio-track-menu vds-menu" }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
    DefaultMenuButton,
    {
      label,
      hint: $track?.label ?? defaultText,
      disabled: options.disabled,
      Icon: Icons.Menu.Audio
    }
  ), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.Items, { className: "vds-menu-items" }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
    _vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.Root$3,
    {
      className: "vds-audio-radio-group vds-radio-group",
      value: options.selectedValue
    },
    options.map(({ label: label2, value, select }) => /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
      _vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.Item,
      {
        className: "vds-audio-radio vds-radio",
        value,
        onSelect: select,
        key: value
      },
      /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(Icons.Menu.RadioCheck, { className: "vds-icon" }),
      /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { className: "vds-radio-label" }, label2)
    ))
  )));
}
DefaultAudioTracksMenu.displayName = "DefaultAudioTracksMenu";

function DefaultCaptionMenu({ slots }) {
  const { icons: Icons } = useDefaultLayoutContext(), label = useDefaultLayoutWord("Captions"), offText = useDefaultLayoutWord("Off"), options = (0,_vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.useCaptionOptions)({ off: offText }), hint = options.selectedTrack?.label ?? offText;
  if (options.disabled) return null;
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.Root$2, { className: "vds-captions-menu vds-menu" }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
    DefaultMenuButton,
    {
      label,
      hint,
      disabled: options.disabled,
      Icon: Icons.Menu.Captions
    }
  ), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.Items, { className: "vds-menu-items" }, slot(slots, "captionsMenuItemsStart", null), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
    _vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.Root$3,
    {
      className: "vds-captions-radio-group vds-radio-group",
      value: options.selectedValue
    },
    options.map(({ label: label2, value, select }) => /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
      _vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.Item,
      {
        className: "vds-caption-radio vds-radio",
        value,
        onSelect: select,
        key: value
      },
      /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(Icons.Menu.RadioCheck, { className: "vds-icon" }),
      /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { className: "vds-radio-label" }, label2)
    ))
  ), slot(slots, "captionsMenuItemsEnd", null)));
}
DefaultCaptionMenu.displayName = "DefaultCaptionMenu";

function DefaultPlaybackMenu({ slots }) {
  const label = useDefaultLayoutWord("Playback"), { icons: Icons } = useDefaultLayoutContext();
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.Root$2, { className: "vds-playback-menu vds-menu" }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultMenuButton, { label, Icon: Icons.Menu.Playback }), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.Items, { className: "vds-menu-items" }, slot(slots, "playbackMenuItemsStart", null), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultMenuSection, null, slot(slots, "playbackMenuLoop", /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultLoopMenuCheckbox, null))), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultSpeedMenuSection, null), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultQualityMenuSection, null), slot(slots, "playbackMenuItemsEnd", null)));
}
DefaultPlaybackMenu.displayName = "DefaultPlaybackMenu";
function DefaultLoopMenuCheckbox() {
  const { remote } = (0,_vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.useMediaContext)(), label = useDefaultLayoutWord("Loop");
  function onChange(checked, trigger) {
    remote.userPrefersLoopChange(checked, trigger);
  }
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultMenuItem, { label }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultMenuCheckbox, { label, storageKey: "vds-player::user-loop", onChange }));
}
DefaultLoopMenuCheckbox.displayName = "DefaultLoopMenuCheckbox";
function DefaultAutoQualityMenuCheckbox() {
  const { remote, qualities } = (0,_vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.useMediaContext)(), $autoQuality = (0,_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_5__.useMediaState)("autoQuality"), label = useDefaultLayoutWord("Auto");
  function onChange(checked, trigger) {
    if (checked) {
      remote.requestAutoQuality(trigger);
    } else {
      remote.changeQuality(qualities.selectedIndex, trigger);
    }
  }
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultMenuItem, { label }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
    DefaultMenuCheckbox,
    {
      label,
      checked: $autoQuality,
      onChange,
      defaultChecked: $autoQuality
    }
  ));
}
DefaultAutoQualityMenuCheckbox.displayName = "DefaultAutoQualityMenuCheckbox";
function DefaultQualityMenuSection() {
  const { hideQualityBitrate, icons: Icons } = useDefaultLayoutContext(), $canSetQuality = (0,_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_5__.useMediaState)("canSetQuality"), $qualities = (0,_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_5__.useMediaState)("qualities"), $quality = (0,_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_5__.useMediaState)("quality"), label = useDefaultLayoutWord("Quality"), autoText = useDefaultLayoutWord("Auto"), sortedQualities = react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => (0,_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_5__.sortVideoQualities)($qualities), [$qualities]);
  if (!$canSetQuality || $qualities.length <= 1) return null;
  const height = $quality?.height, bitrate = !hideQualityBitrate ? $quality?.bitrate : null, bitrateText = bitrate && bitrate > 0 ? `${(bitrate / 1e6).toFixed(2)} Mbps` : null, value = height ? `${height}p${bitrateText ? ` (${bitrateText})` : ""}` : autoText, isMin = sortedQualities[0] === $quality, isMax = sortedQualities.at(-1) === $quality;
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultMenuSection, { label, value }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
    DefaultMenuSliderItem,
    {
      UpIcon: Icons.Menu.QualityUp,
      DownIcon: Icons.Menu.QualityDown,
      isMin,
      isMax
    },
    /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultQualitySlider, null)
  ), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultAutoQualityMenuCheckbox, null));
}
DefaultQualityMenuSection.displayName = "DefaultQualityMenuSection";
function DefaultQualitySlider() {
  const label = useDefaultLayoutWord("Quality");
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_vidstack_GeL5yun1_js__WEBPACK_IMPORTED_MODULE_6__.Root$3, { className: "vds-quality-slider vds-slider", "aria-label": label }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultSliderParts, null), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultSliderSteps, null));
}
DefaultQualitySlider.displayName = "DefaultQualitySlider";
function DefaultSpeedMenuSection() {
  const { icons: Icons } = useDefaultLayoutContext(), $playbackRate = (0,_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_5__.useMediaState)("playbackRate"), $canSetPlaybackRate = (0,_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_5__.useMediaState)("canSetPlaybackRate"), label = useDefaultLayoutWord("Speed"), normalText = useDefaultLayoutWord("Normal"), min = useSpeedMin(), max = useSpeedMax(), value = $playbackRate === 1 ? normalText : $playbackRate + "x";
  if (!$canSetPlaybackRate) return null;
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultMenuSection, { label, value }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
    DefaultMenuSliderItem,
    {
      UpIcon: Icons.Menu.SpeedUp,
      DownIcon: Icons.Menu.SpeedDown,
      isMin: $playbackRate === min,
      isMax: $playbackRate === max
    },
    /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultSpeedSlider, null)
  ));
}
function useSpeedMin() {
  const { playbackRates } = useDefaultLayoutContext(), rates = playbackRates;
  return ((0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_4__.isArray)(rates) ? rates[0] : rates?.min) ?? 0;
}
function useSpeedMax() {
  const { playbackRates } = useDefaultLayoutContext(), rates = playbackRates;
  return ((0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_4__.isArray)(rates) ? rates[rates.length - 1] : rates?.max) ?? 2;
}
function useSpeedStep() {
  const { playbackRates } = useDefaultLayoutContext(), rates = playbackRates;
  return ((0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_4__.isArray)(rates) ? rates[1] - rates[0] : rates?.step) || 0.25;
}
function DefaultSpeedSlider() {
  const label = useDefaultLayoutWord("Speed"), min = useSpeedMin(), max = useSpeedMax(), step = useSpeedStep();
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
    _vidstack_GeL5yun1_js__WEBPACK_IMPORTED_MODULE_6__.Root$2,
    {
      className: "vds-speed-slider vds-slider",
      "aria-label": label,
      min,
      max,
      step,
      keyStep: step
    },
    /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultSliderParts, null),
    /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultSliderSteps, null)
  );
}
DefaultSpeedSlider.displayName = "DefaultSpeedSlider";

function DefaultSettingsMenu({
  tooltip,
  placement,
  portalClass = "",
  slots
}) {
  const {
    showMenuDelay,
    icons: Icons,
    isSmallLayout,
    menuContainer,
    menuGroup,
    noModal,
    colorScheme
  } = useDefaultLayoutContext(), settingsText = useDefaultLayoutWord("Settings"), $viewType = (0,_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_5__.useMediaState)("viewType"), $offset = !isSmallLayout && menuGroup === "bottom" && $viewType === "video" ? 26 : 0, colorSchemeClass = useColorSchemeClass(colorScheme), [isOpen, setIsOpen] = react__WEBPACK_IMPORTED_MODULE_0__.useState(false), dialogEl = useParentDialogEl();
  (0,_vidstack_GeL5yun1_js__WEBPACK_IMPORTED_MODULE_6__.useScoped)(updateFontCssVars);
  function onOpen() {
    (0,react_dom__WEBPACK_IMPORTED_MODULE_1__.flushSync)(() => {
      setIsOpen(true);
    });
  }
  function onClose() {
    setIsOpen(false);
  }
  const Content = /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
    _vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.Items,
    {
      className: "vds-settings-menu-items vds-menu-items",
      placement,
      offset: $offset
    },
    isOpen ? /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, slot(slots, "settingsMenuItemsStart", null), slot(slots, "settingsMenuStartItems", null), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultPlaybackMenu, { slots }), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultAccessibilityMenu, { slots }), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultAudioMenu, { slots }), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultCaptionMenu, { slots }), slot(slots, "settingsMenuEndItems", null), slot(slots, "settingsMenuItemsEnd", null)) : null
  );
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
    _vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.Root$2,
    {
      className: "vds-settings-menu vds-menu",
      showDelay: showMenuDelay,
      onOpen,
      onClose
    },
    /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultTooltip, { content: settingsText, placement: tooltip }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.Button, { className: "vds-menu-button vds-button", "aria-label": settingsText }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(Icons.Menu.Settings, { className: "vds-icon vds-rotate-icon" }))),
    noModal || !isSmallLayout ? Content : /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
      _vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.Portal,
      {
        className: portalClass + (colorSchemeClass ? ` ${colorSchemeClass}` : ""),
        container: menuContainer ?? dialogEl,
        disabled: "fullscreen",
        "data-sm": isSmallLayout ? "" : null,
        "data-lg": !isSmallLayout ? "" : null,
        "data-size": isSmallLayout ? "sm" : "lg",
        "data-view-type": $viewType
      },
      Content
    )
  );
}
DefaultSettingsMenu.displayName = "DefaultSettingsMenu";

function DefaultVolumePopup({ tooltip, orientation, slots }) {
  const $pointer = (0,_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_5__.useMediaState)("pointer"), $muted = (0,_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_5__.useMediaState)("muted"), $canSetVolume = (0,_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_5__.useMediaState)("canSetVolume"), [rootEl, setRootEl] = react__WEBPACK_IMPORTED_MODULE_0__.useState(null), isRootActive = (0,_vidstack_BPOD0tS4_js__WEBPACK_IMPORTED_MODULE_2__.useActive)(rootEl), muteButton = slot(slots, "muteButton", /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultMuteButton, { tooltip }));
  if (!$canSetVolume) {
    return muteButton;
  }
  return $pointer === "coarse" && !$muted ? null : /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: "vds-volume", "data-active": isRootActive ? "" : null, ref: setRootEl }, muteButton, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: "vds-volume-popup" }, slot(slots, "volumeSlider", /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultVolumeSlider, { orientation }))));
}
DefaultVolumePopup.displayName = "DefaultVolumePopup";
function DefaultVolumeSlider(props) {
  const label = useDefaultLayoutWord("Volume");
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.Root$4, { className: "vds-volume-slider vds-slider", "aria-label": label, ...props }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.Track, { className: "vds-slider-track" }), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.TrackFill, { className: "vds-slider-track-fill vds-slider-track" }), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.Thumb, { className: "vds-slider-thumb" }), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.Preview, { className: "vds-slider-preview", noClamp: true }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.Value, { className: "vds-slider-value" })));
}
DefaultVolumeSlider.displayName = "DefaultVolumeSlider";
function DefaultTimeSlider() {
  const [instance, setInstance] = react__WEBPACK_IMPORTED_MODULE_0__.useState(null), [width, setWidth] = react__WEBPACK_IMPORTED_MODULE_0__.useState(0), $src = (0,_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_5__.useMediaState)("currentSrc"), { thumbnails, sliderChaptersMinWidth, disableTimeSlider, seekStep, noScrubGesture } = useDefaultLayoutContext(), label = useDefaultLayoutWord("Seek"), $RemotionSliderThumbnail = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_4__.useSignal)(_vidstack_D_hQD1eE_js__WEBPACK_IMPORTED_MODULE_7__.RemotionSliderThumbnail);
  const onResize = react__WEBPACK_IMPORTED_MODULE_0__.useCallback(() => {
    const el = instance?.el;
    el && setWidth(el.clientWidth);
  }, [instance]);
  (0,_vidstack_BPOD0tS4_js__WEBPACK_IMPORTED_MODULE_2__.useResizeObserver)(instance?.el, onResize);
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
    _vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.Root$1,
    {
      className: "vds-time-slider vds-slider",
      "aria-label": label,
      disabled: disableTimeSlider,
      noSwipeGesture: noScrubGesture,
      keyStep: seekStep,
      ref: setInstance
    },
    /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
      _vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.Chapters,
      {
        className: "vds-slider-chapters",
        disabled: width < sliderChaptersMinWidth
      },
      (cues, forwardRef) => cues.map((cue) => /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: "vds-slider-chapter", key: cue.startTime, ref: forwardRef }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.Track, { className: "vds-slider-track" }), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.TrackFill, { className: "vds-slider-track-fill vds-slider-track" }), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.Progress, { className: "vds-slider-progress vds-slider-track" })))
    ),
    /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.Thumb, { className: "vds-slider-thumb" }),
    /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.Preview, { className: "vds-slider-preview" }, thumbnails ? /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
      _vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.Thumbnail.Root,
      {
        src: thumbnails,
        className: "vds-slider-thumbnail vds-thumbnail"
      },
      /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.Thumbnail.Img, null)
    ) : $RemotionSliderThumbnail && (0,_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_5__.isRemotionSrc)($src) ? /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement($RemotionSliderThumbnail, { className: "vds-slider-thumbnail vds-thumbnail" }) : null, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.ChapterTitle, { className: "vds-slider-chapter-title" }), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.Value, { className: "vds-slider-value" }))
  );
}
DefaultTimeSlider.displayName = "DefaultTimeSlider";

function DefaultTimeGroup({ slots }) {
  const $duration = (0,_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_5__.useMediaState)("duration");
  if (!$duration) return null;
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: "vds-time-group" }, slot(slots, "currentTime", /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.Time, { className: "vds-time", type: "current" })), slot(slots, "timeDivider", /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: "vds-time-divider" }, "/")), slot(slots, "endTime", /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.Time, { className: "vds-time", type: "duration" })));
}
DefaultTimeGroup.displayName = "DefaultTimeGroup";
function DefaultTimeInfo({ slots }) {
  const $live = (0,_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_5__.useMediaState)("live");
  return $live ? slot(slots, "liveButton", /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultLiveButton, null)) : /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultTimeGroup, { slots });
}
DefaultTimeInfo.displayName = "DefaultTimeInfo";
function DefaultTimeInvert({ slots }) {
  const $live = (0,_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_5__.useMediaState)("live"), $duration = (0,_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_5__.useMediaState)("duration");
  return $live ? slot(slots, "liveButton", /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultLiveButton, null)) : slot(
    slots,
    "endTime",
    $duration ? /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.Time, { className: "vds-time", type: "current", toggle: true, remainder: true }) : null
  );
}
DefaultTimeInvert.displayName = "DefaultTimeInvert";

const MediaLayout$1 = createDefaultMediaLayout({
  type: "audio",
  smLayoutWhen({ width }) {
    return width < 576;
  },
  renderLayout: () => /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(AudioLayout, null)
});
function DefaultAudioLayout(props) {
  const [scrubbing, setScrubbing] = react__WEBPACK_IMPORTED_MODULE_0__.useState(false), $pointer = (0,_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_5__.useMediaState)("pointer");
  const onStartScrubbing = react__WEBPACK_IMPORTED_MODULE_0__.useCallback((event) => {
    const { target } = event, hasTimeSlider = !!(target instanceof HTMLElement && target.closest(".vds-time-slider"));
    if (!hasTimeSlider) return;
    event.nativeEvent.stopImmediatePropagation();
    setScrubbing(true);
  }, []);
  const onStopScrubbing = react__WEBPACK_IMPORTED_MODULE_0__.useCallback(() => {
    setScrubbing(false);
  }, []);
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    if (scrubbing) return (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_4__.listenEvent)(window, "pointerdown", onStopScrubbing);
  }, [scrubbing, onStopScrubbing]);
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
    MediaLayout$1,
    {
      ...props,
      "data-scrubbing": scrubbing ? "" : null,
      onPointerDown: scrubbing ? (e) => e.stopPropagation() : void 0,
      onPointerDownCapture: $pointer === "coarse" && !scrubbing ? onStartScrubbing : void 0
    }
  );
}
DefaultAudioLayout.displayName = "DefaultAudioLayout";
function AudioLayout() {
  const slots = useDefaultAudioLayoutSlots();
  (0,_vidstack_BPOD0tS4_js__WEBPACK_IMPORTED_MODULE_2__.useLayoutName)("audio");
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultAnnouncer, null), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultCaptions, null), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_vidstack_GeL5yun1_js__WEBPACK_IMPORTED_MODULE_6__.Root$4, { className: "vds-controls" }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_vidstack_GeL5yun1_js__WEBPACK_IMPORTED_MODULE_6__.Group, { className: "vds-controls-group" }, slot(slots, "seekBackwardButton", /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultSeekButton, { backward: true, tooltip: "top start" })), slot(slots, "playButton", /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultPlayButton, { tooltip: "top center" })), slot(slots, "seekForwardButton", /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultSeekButton, { tooltip: "top center" })), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultAudioTitle, null), slot(slots, "timeSlider", /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultTimeSlider, null)), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultTimeInvert, { slots }), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultVolumePopup, { orientation: "vertical", tooltip: "top", slots }), slot(slots, "captionButton", /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultCaptionButton, { tooltip: "top center" })), slot(slots, "downloadButton", /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultDownloadButton, null)), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultAudioMenus, { slots }))));
}
AudioLayout.displayName = "AudioLayout";
function DefaultAudioMenus({ slots }) {
  const { isSmallLayout, noModal } = useDefaultLayoutContext(), placement = noModal ? "top end" : !isSmallLayout ? "top end" : null;
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, slot(
    slots,
    "chaptersMenu",
    /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultChaptersMenu, { tooltip: "top", placement, portalClass: "vds-audio-layout" })
  ), slot(
    slots,
    "settingsMenu",
    /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
      DefaultSettingsMenu,
      {
        tooltip: "top end",
        placement,
        portalClass: "vds-audio-layout",
        slots
      }
    )
  ));
}
DefaultAudioMenus.displayName = "DefaultAudioMenus";
function DefaultAudioTitle() {
  const [rootEl, setRootEl] = react__WEBPACK_IMPORTED_MODULE_0__.useState(null), media = (0,_vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.useMediaContext)(), { translations } = useDefaultLayoutContext(), [isTextOverflowing, setIsTextOverflowing] = react__WEBPACK_IMPORTED_MODULE_0__.useState(false);
  const isContinued = (0,_vidstack_GeL5yun1_js__WEBPACK_IMPORTED_MODULE_6__.createComputed)(() => {
    const { started, currentTime } = media.$state;
    return started() || currentTime() > 0;
  });
  const $title = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_4__.useSignal)(
    (0,_vidstack_GeL5yun1_js__WEBPACK_IMPORTED_MODULE_6__.createComputed)(() => {
      const { title, ended } = media.$state;
      if (!title()) return "";
      const word = ended() ? "Replay" : isContinued() ? "Continue" : "Play";
      return `${i18n(translations, word)}: ${title()}`;
    })
  );
  const chapterTitle = (0,_vidstack_GeL5yun1_js__WEBPACK_IMPORTED_MODULE_6__.useChapterTitle)(), $isContinued = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_4__.useSignal)(isContinued), $chapterTitle = $isContinued ? chapterTitle : "", isTransitionActive = (0,_vidstack_BPOD0tS4_js__WEBPACK_IMPORTED_MODULE_2__.useTransitionActive)(rootEl);
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    if (isTransitionActive && document.activeElement === document.body) {
      media.player.el?.focus({ preventScroll: true });
    }
  }, []);
  const onResize = react__WEBPACK_IMPORTED_MODULE_0__.useCallback(() => {
    const el = rootEl, isOverflowing = !!el && !isTransitionActive && el.clientWidth < el.children[0].clientWidth;
    if (el) (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_4__.toggleClass)(el, "vds-marquee", isOverflowing);
    setIsTextOverflowing(isOverflowing);
  }, [rootEl, isTransitionActive]);
  (0,_vidstack_BPOD0tS4_js__WEBPACK_IMPORTED_MODULE_2__.useResizeObserver)(rootEl, onResize);
  return $title ? /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { className: "vds-title", title: $title, ref: setRootEl }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(AudioTitle, { title: $title, chapterTitle: $chapterTitle }), isTextOverflowing && !isTransitionActive ? /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(AudioTitle, { title: $title, chapterTitle: $chapterTitle }) : null) : /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultControlsSpacer, null);
}
DefaultAudioTitle.displayName = "DefaultAudioTitle";
function AudioTitle({ title, chapterTitle }) {
  const slots = useDefaultAudioLayoutSlots();
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { className: "vds-title-text" }, slot(slots, "title", title), slot(slots, "chapterTitle", /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { className: "vds-chapter-title" }, chapterTitle)));
}
AudioTitle.displayName = "AudioTitle";

const DefaultKeyboardDisplay = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(
  ({ icons: Icons, ...props }, forwardRef) => {
    const [visible, setVisible] = react__WEBPACK_IMPORTED_MODULE_0__.useState(false), [Icon, setIcon] = react__WEBPACK_IMPORTED_MODULE_0__.useState(null), [count, setCount] = react__WEBPACK_IMPORTED_MODULE_0__.useState(0), $lastKeyboardAction = (0,_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_5__.useMediaState)("lastKeyboardAction");
    react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
      setCount((n) => n + 1);
    }, [$lastKeyboardAction]);
    const actionDataAttr = react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => {
      const action = $lastKeyboardAction?.action;
      return action && visible ? (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_4__.camelToKebabCase)(action) : null;
    }, [visible, $lastKeyboardAction]);
    const className = react__WEBPACK_IMPORTED_MODULE_0__.useMemo(
      () => `vds-kb-action${!visible ? " hidden" : ""}${props.className ? ` ${props.className}` : ""}`,
      [visible]
    );
    const $$text = (0,_vidstack_GeL5yun1_js__WEBPACK_IMPORTED_MODULE_6__.createComputed)(getText), $text = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_4__.useSignal)($$text);
    (0,_vidstack_GeL5yun1_js__WEBPACK_IMPORTED_MODULE_6__.createEffect)(() => {
      const Icon2 = getIcon(Icons);
      setIcon(() => Icon2);
    }, [Icons]);
    react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
      setVisible(!!$lastKeyboardAction);
      const id = setTimeout(() => setVisible(false), 500);
      return () => {
        setVisible(false);
        window.clearTimeout(id);
      };
    }, [$lastKeyboardAction]);
    return Icon ? /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
      _vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_5__.Primitive.div,
      {
        ...props,
        className,
        "data-action": actionDataAttr,
        ref: forwardRef
      },
      /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: "vds-kb-text-wrapper" }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: "vds-kb-text" }, $text)),
      /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: "vds-kb-bezel", key: count }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: "vds-kb-icon" }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(Icon, null)))
    ) : null;
  }
);
DefaultKeyboardDisplay.displayName = "DefaultKeyboardDisplay";
function getText() {
  const { $state } = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_4__.useContext)(_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_5__.mediaContext), action = $state.lastKeyboardAction()?.action, audioGain = $state.audioGain() ?? 1;
  switch (action) {
    case "toggleMuted":
      return $state.muted() ? "0%" : getVolumeText($state.volume(), audioGain);
    case "volumeUp":
    case "volumeDown":
      return getVolumeText($state.volume(), audioGain);
    default:
      return "";
  }
}
function getVolumeText(volume, gain) {
  return `${Math.round(volume * gain * 100)}%`;
}
function getIcon(Icons) {
  const { $state } = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_4__.useContext)(_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_5__.mediaContext), action = $state.lastKeyboardAction()?.action;
  switch (action) {
    case "togglePaused":
      return !$state.paused() ? Icons.Play : Icons.Pause;
    case "toggleMuted":
      return $state.muted() || $state.volume() === 0 ? Icons.Mute : $state.volume() >= 0.5 ? Icons.VolumeUp : Icons.VolumeDown;
    case "toggleFullscreen":
      return $state.fullscreen() ? Icons.EnterFullscreen : Icons.ExitFullscreen;
    case "togglePictureInPicture":
      return $state.pictureInPicture() ? Icons.EnterPiP : Icons.ExitPiP;
    case "toggleCaptions":
      return $state.hasCaptions() ? $state.textTrack() ? Icons.CaptionsOn : Icons.CaptionsOff : null;
    case "volumeUp":
      return Icons.VolumeUp;
    case "volumeDown":
      return Icons.VolumeDown;
    case "seekForward":
      return Icons.SeekForward;
    case "seekBackward":
      return Icons.SeekBackward;
    default:
      return null;
  }
}

function DefaultTitle() {
  const $started = (0,_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_5__.useMediaState)("started"), $title = (0,_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_5__.useMediaState)("title"), $hasChapters = (0,_vidstack_GeL5yun1_js__WEBPACK_IMPORTED_MODULE_6__.useActiveTextTrack)("chapters");
  return $hasChapters && ($started || !$title) ? /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_vidstack_GeL5yun1_js__WEBPACK_IMPORTED_MODULE_6__.ChapterTitle, { className: "vds-chapter-title" }) : /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_vidstack_GeL5yun1_js__WEBPACK_IMPORTED_MODULE_6__.Title, { className: "vds-chapter-title" });
}
DefaultTitle.displayName = "DefaultTitle";

const MediaLayout = createDefaultMediaLayout({
  type: "video",
  smLayoutWhen({ width, height }) {
    return width < 576 || height < 380;
  },
  renderLayout(props) {
    return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(VideoLayout, { ...props });
  }
});
function DefaultVideoLayout(props) {
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(MediaLayout, { ...props });
}
DefaultVideoLayout.displayName = "DefaultVideoLayout";
function VideoLayout({ streamType, isLoadLayout, isSmallLayout }) {
  (0,_vidstack_BPOD0tS4_js__WEBPACK_IMPORTED_MODULE_2__.useLayoutName)("video");
  return isLoadLayout ? /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultVideoLoadLayout, null) : streamType === "unknown" ? /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultBufferingIndicator, null) : isSmallLayout ? /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultVideoSmallLayout, null) : /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultVideoLargeLayout, null);
}
VideoLayout.displayName = "VideoLayout";
function DefaultVideoLargeLayout() {
  const { menuGroup } = useDefaultLayoutContext(), baseSlots = useDefaultVideoLayoutSlots(), slots = { ...baseSlots, ...baseSlots?.largeLayout };
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultAnnouncer, null), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultVideoGestures, null), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultVideoKeyboardDisplay, null), slot(slots, "bufferingIndicator", /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultBufferingIndicator, null)), slot(slots, "captions", /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultCaptions, null)), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_vidstack_GeL5yun1_js__WEBPACK_IMPORTED_MODULE_6__.Root$4, { className: "vds-controls" }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_vidstack_GeL5yun1_js__WEBPACK_IMPORTED_MODULE_6__.Group, { className: "vds-controls-group" }, slot(slots, "topControlsGroupStart", null), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultControlsSpacer, null), slot(slots, "topControlsGroupCenter", null), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultControlsSpacer, null), slot(slots, "topControlsGroupEnd", null), menuGroup === "top" && /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultVideoMenus, { slots })), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultControlsSpacer, null), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_vidstack_GeL5yun1_js__WEBPACK_IMPORTED_MODULE_6__.Group, { className: "vds-controls-group" }, slot(slots, "centerControlsGroupStart", null), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultControlsSpacer, null), slot(slots, "centerControlsGroupCenter", null), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultControlsSpacer, null), slot(slots, "centerControlsGroupEnd", null)), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultControlsSpacer, null), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_vidstack_GeL5yun1_js__WEBPACK_IMPORTED_MODULE_6__.Group, { className: "vds-controls-group" }, slot(slots, "timeSlider", /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultTimeSlider, null))), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_vidstack_GeL5yun1_js__WEBPACK_IMPORTED_MODULE_6__.Group, { className: "vds-controls-group" }, slot(slots, "playButton", /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultPlayButton, { tooltip: "top start" })), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultVolumePopup, { orientation: "horizontal", tooltip: "top", slots }), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultTimeInfo, { slots }), slot(slots, "chapterTitle", /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultTitle, null)), slot(slots, "captionButton", /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultCaptionButton, { tooltip: "top" })), menuGroup === "bottom" && /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultVideoMenus, { slots }), slot(slots, "airPlayButton", /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultAirPlayButton, { tooltip: "top" })), slot(slots, "googleCastButton", /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultGoogleCastButton, { tooltip: "top" })), slot(slots, "downloadButton", /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultDownloadButton, null)), slot(slots, "pipButton", /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultPIPButton, { tooltip: "top" })), slot(slots, "fullscreenButton", /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultFullscreenButton, { tooltip: "top end" })))));
}
DefaultVideoLargeLayout.displayName = "DefaultVideoLargeLayout";
function DefaultVideoSmallLayout() {
  const baseSlots = useDefaultVideoLayoutSlots(), slots = { ...baseSlots, ...baseSlots?.smallLayout };
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultAnnouncer, null), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultVideoGestures, null), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultVideoKeyboardDisplay, null), slot(slots, "bufferingIndicator", /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultBufferingIndicator, null)), slot(slots, "captions", /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultCaptions, null)), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_vidstack_GeL5yun1_js__WEBPACK_IMPORTED_MODULE_6__.Root$4, { className: "vds-controls" }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_vidstack_GeL5yun1_js__WEBPACK_IMPORTED_MODULE_6__.Group, { className: "vds-controls-group" }, slot(slots, "topControlsGroupStart", null), slot(slots, "airPlayButton", /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultAirPlayButton, { tooltip: "top start" })), slot(slots, "googleCastButton", /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultGoogleCastButton, { tooltip: "top start" })), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultControlsSpacer, null), slot(slots, "topControlsGroupCenter", null), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultControlsSpacer, null), slot(slots, "captionButton", /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultCaptionButton, { tooltip: "bottom" })), slot(slots, "downloadButton", /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultDownloadButton, null)), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultVideoMenus, { slots }), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultVolumePopup, { orientation: "vertical", tooltip: "bottom end", slots }), slot(slots, "topControlsGroupEnd", null)), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultControlsSpacer, null), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_vidstack_GeL5yun1_js__WEBPACK_IMPORTED_MODULE_6__.Group, { className: "vds-controls-group", style: { pointerEvents: "none" } }, slot(slots, "centerControlsGroupStart", null), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultControlsSpacer, null), slot(slots, "centerControlsGroupCenter", null), slot(slots, "playButton", /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultPlayButton, { tooltip: "top" })), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultControlsSpacer, null), slot(slots, "centerControlsGroupEnd", null)), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultControlsSpacer, null), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_vidstack_GeL5yun1_js__WEBPACK_IMPORTED_MODULE_6__.Group, { className: "vds-controls-group" }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultTimeInfo, { slots }), slot(slots, "chapterTitle", /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultTitle, null)), slot(slots, "fullscreenButton", /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultFullscreenButton, { tooltip: "top end" }))), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_vidstack_GeL5yun1_js__WEBPACK_IMPORTED_MODULE_6__.Group, { className: "vds-controls-group" }, slot(slots, "timeSlider", /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultTimeSlider, null)))), slot(slots, "startDuration", /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultVideoStartDuration, null)));
}
DefaultVideoSmallLayout.displayName = "DefaultVideoSmallLayout";
function DefaultVideoStartDuration() {
  const $duration = (0,_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_5__.useMediaState)("duration");
  if ($duration === 0) return null;
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: "vds-start-duration" }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.Time, { className: "vds-time", type: "duration" }));
}
DefaultVideoStartDuration.displayName = "DefaultVideoStartDuration";
function DefaultVideoGestures() {
  const { noGestures } = useDefaultLayoutContext();
  if (noGestures) return null;
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: "vds-gestures" }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.Gesture, { className: "vds-gesture", event: "pointerup", action: "toggle:paused" }), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.Gesture, { className: "vds-gesture", event: "pointerup", action: "toggle:controls" }), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.Gesture, { className: "vds-gesture", event: "dblpointerup", action: "toggle:fullscreen" }), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.Gesture, { className: "vds-gesture", event: "dblpointerup", action: "seek:-10" }), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.Gesture, { className: "vds-gesture", event: "dblpointerup", action: "seek:10" }));
}
DefaultVideoGestures.displayName = "DefaultVideoGestures";
function DefaultBufferingIndicator() {
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: "vds-buffering-indicator" }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_vidstack_GeL5yun1_js__WEBPACK_IMPORTED_MODULE_6__.Root$5, { className: "vds-buffering-spinner" }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_vidstack_GeL5yun1_js__WEBPACK_IMPORTED_MODULE_6__.Track, { className: "vds-buffering-track" }), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_vidstack_GeL5yun1_js__WEBPACK_IMPORTED_MODULE_6__.TrackFill, { className: "vds-buffering-track-fill" })));
}
DefaultBufferingIndicator.displayName = "DefaultBufferingIndicator";
function DefaultVideoMenus({ slots }) {
  const { isSmallLayout, noModal, menuGroup } = useDefaultLayoutContext(), side = menuGroup === "top" || isSmallLayout ? "bottom" : "top", tooltip = `${side} end`, placement = noModal ? `${side} end` : !isSmallLayout ? `${side} end` : null;
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, slot(
    slots,
    "chaptersMenu",
    /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
      DefaultChaptersMenu,
      {
        tooltip,
        placement,
        portalClass: "vds-video-layout"
      }
    )
  ), slot(
    slots,
    "settingsMenu",
    /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
      DefaultSettingsMenu,
      {
        tooltip,
        placement,
        portalClass: "vds-video-layout",
        slots
      }
    )
  ));
}
DefaultVideoMenus.displayName = "DefaultVideoMenus";
function DefaultVideoLoadLayout() {
  const { isSmallLayout } = useDefaultLayoutContext(), baseSlots = useDefaultVideoLayoutSlots(), slots = { ...baseSlots, ...baseSlots?.[isSmallLayout ? "smallLayout" : "largeLayout"] };
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: "vds-load-container" }, slot(slots, "bufferingIndicator", /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultBufferingIndicator, null)), slot(slots, "loadButton", /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultPlayButton, { tooltip: "top" })));
}
DefaultVideoLoadLayout.displayName = "DefaultVideoLoadLayout";
function DefaultVideoKeyboardDisplay() {
  const { noKeyboardAnimations, icons, userPrefersKeyboardAnimations } = useDefaultLayoutContext(), $userPrefersKeyboardAnimations = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_4__.useSignal)(userPrefersKeyboardAnimations), disabled = noKeyboardAnimations || !$userPrefersKeyboardAnimations;
  if (disabled || !icons.KeyboardDisplay) return null;
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultKeyboardDisplay, { icons: icons.KeyboardDisplay });
}
DefaultVideoKeyboardDisplay.displayName = "DefaultVideoKeyboardDisplay";




/***/ }),

/***/ "./node_modules/@vidstack/react/dev/chunks/vidstack-BPOD0tS4.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@vidstack/react/dev/chunks/vidstack-BPOD0tS4.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useActive: () => (/* binding */ useActive),
/* harmony export */   useClassName: () => (/* binding */ useClassName),
/* harmony export */   useColorSchemePreference: () => (/* binding */ useColorSchemePreference),
/* harmony export */   useLayoutName: () => (/* binding */ useLayoutName),
/* harmony export */   useResizeObserver: () => (/* binding */ useResizeObserver),
/* harmony export */   useTransitionActive: () => (/* binding */ useTransitionActive)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./vidstack-D_bWd66h.js */ "./node_modules/@vidstack/react/dev/chunks/vidstack-D_bWd66h.js");
/* harmony import */ var _vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./vidstack--AIGOV5A.js */ "./node_modules/@vidstack/react/dev/chunks/vidstack--AIGOV5A.js");
"use client"

;



function useClassName(el, className) {
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    if (!el || !className) return;
    const tokens = className.split(" ");
    for (const token of tokens) el.classList.add(token);
    return () => {
      for (const token of tokens) el.classList.remove(token);
    };
  }, [el, className]);
}
function useResizeObserver(el, callback) {
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    if (!el) return;
    callback();
    const observer = new ResizeObserver((0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.animationFrameThrottle)(callback));
    observer.observe(el);
    return () => observer.disconnect();
  }, [el, callback]);
}
function useTransitionActive(el) {
  const [isActive, setIsActive] = react__WEBPACK_IMPORTED_MODULE_0__.useState(false);
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    if (!el) return;
    const events = new _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.EventsController(el).add("transitionstart", () => setIsActive(true)).add("transitionend", () => setIsActive(false));
    return () => events.abort();
  }, [el]);
  return isActive;
}
function useMouseEnter(el) {
  const [isMouseEnter, setIsMouseEnter] = react__WEBPACK_IMPORTED_MODULE_0__.useState(false);
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    if (!el) return;
    const events = new _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.EventsController(el).add("mouseenter", () => setIsMouseEnter(true)).add("mouseleave", () => setIsMouseEnter(false));
    return () => events.abort();
  }, [el]);
  return isMouseEnter;
}
function useFocusIn(el) {
  const [isFocusIn, setIsFocusIn] = react__WEBPACK_IMPORTED_MODULE_0__.useState(false);
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    if (!el) return;
    const events = new _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.EventsController(el).add("focusin", () => setIsFocusIn(true)).add("focusout", () => setIsFocusIn(false));
    return () => events.abort();
  }, [el]);
  return isFocusIn;
}
function useActive(el) {
  const isMouseEnter = useMouseEnter(el), isFocusIn = useFocusIn(el), prevMouseEnter = react__WEBPACK_IMPORTED_MODULE_0__.useRef(false);
  if (prevMouseEnter.current && !isMouseEnter) return false;
  prevMouseEnter.current = isMouseEnter;
  return isMouseEnter || isFocusIn;
}
function useColorSchemePreference() {
  const [colorScheme, setColorScheme] = react__WEBPACK_IMPORTED_MODULE_0__.useState("dark");
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: light)");
    function onChange() {
      setColorScheme(media.matches ? "light" : "dark");
    }
    onChange();
    return (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.listenEvent)(media, "change", onChange);
  }, []);
  return colorScheme;
}

function useLayoutName(name) {
  const player = (0,_vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_2__.useMediaPlayer)();
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    if (!player) return;
    return (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(() => {
      const el = player.$el;
      el?.setAttribute("data-layout", name);
      return () => el?.removeAttribute("data-layout");
    });
  }, [player]);
}




/***/ }),

/***/ "./node_modules/@vidstack/react/dev/chunks/vidstack-CBF7iUqu.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@vidstack/react/dev/chunks/vidstack-CBF7iUqu.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Icon: () => (/* binding */ Icon)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
"use client"

;

const Icon = /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.forwardRef((props, ref) => {
  const { width, height, size = null, paths, ...restProps } = props;
  return react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg", {
    viewBox: "0 0 32 32",
    ...restProps,
    width: width ?? size,
    height: height ?? size,
    fill: "none",
    "aria-hidden": "true",
    focusable: "false",
    xmlns: "http://www.w3.org/2000/svg",
    ref,
    dangerouslySetInnerHTML: { __html: paths }
  });
});
Icon.displayName = "VidstackIcon";




/***/ }),

/***/ "./node_modules/@vidstack/react/dev/chunks/vidstack-CIHGgWPC.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@vidstack/react/dev/chunks/vidstack-CIHGgWPC.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DEFAULT_PLAYBACK_RATES: () => (/* binding */ DEFAULT_PLAYBACK_RATES),
/* harmony export */   useMediaRemote: () => (/* binding */ useMediaRemote),
/* harmony export */   usePlaybackRateOptions: () => (/* binding */ usePlaybackRateOptions),
/* harmony export */   useVideoQualityOptions: () => (/* binding */ useVideoQualityOptions)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var _vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./vidstack-DUlCophs.js */ "./node_modules/@vidstack/react/dev/chunks/vidstack-DUlCophs.js");
/* harmony import */ var _vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./vidstack--AIGOV5A.js */ "./node_modules/@vidstack/react/dev/chunks/vidstack--AIGOV5A.js");
/* harmony import */ var _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./vidstack-D_bWd66h.js */ "./node_modules/@vidstack/react/dev/chunks/vidstack-D_bWd66h.js");
"use client"

;




const DEFAULT_PLAYBACK_RATES = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
class SpeedRadioGroup extends _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.Component {
  static props = {
    normalLabel: "Normal",
    rates: DEFAULT_PLAYBACK_RATES
  };
  #media;
  #menu;
  #controller;
  get value() {
    return this.#controller.value;
  }
  get disabled() {
    const { rates } = this.$props, { canSetPlaybackRate } = this.#media.$state;
    return !canSetPlaybackRate() || rates().length === 0;
  }
  constructor() {
    super();
    this.#controller = new _vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_2__.RadioGroupController();
    this.#controller.onValueChange = this.#onValueChange.bind(this);
  }
  onSetup() {
    this.#media = (0,_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_2__.useMediaContext)();
    if ((0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.hasProvidedContext)(_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_2__.menuContext)) {
      this.#menu = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.useContext)(_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_2__.menuContext);
    }
  }
  onConnect(el) {
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#watchValue.bind(this));
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#watchHintText.bind(this));
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#watchControllerDisabled.bind(this));
  }
  getOptions() {
    const { rates, normalLabel } = this.$props;
    return rates().map((rate) => ({
      label: rate === 1 ? normalLabel : rate + "\xD7",
      value: rate.toString()
    }));
  }
  #watchValue() {
    this.#controller.value = this.#getValue();
  }
  #watchHintText() {
    const { normalLabel } = this.$props, { playbackRate } = this.#media.$state, rate = playbackRate();
    this.#menu?.hint.set(rate === 1 ? normalLabel() : rate + "\xD7");
  }
  #watchControllerDisabled() {
    this.#menu?.disable(this.disabled);
  }
  #getValue() {
    const { playbackRate } = this.#media.$state;
    return playbackRate().toString();
  }
  #onValueChange(value, trigger) {
    if (this.disabled) return;
    const rate = +value;
    this.#media.remote.changePlaybackRate(rate, trigger);
    this.dispatch("change", { detail: rate, trigger });
  }
}
const speedradiogroup__proto = SpeedRadioGroup.prototype;
(0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.prop)(speedradiogroup__proto, "value");
(0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.prop)(speedradiogroup__proto, "disabled");
(0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.method)(speedradiogroup__proto, "getOptions");

function useMediaRemote(target) {
  const media = (0,_vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.useMediaContext)(), remote = react__WEBPACK_IMPORTED_MODULE_0__.useRef(null);
  if (!remote.current) {
    remote.current = new _vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_2__.MediaRemoteControl();
  }
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    const ref = target && "current" in target ? target.current : target, isPlayerRef = ref instanceof _vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_2__.MediaPlayerInstance, player = isPlayerRef ? ref : media?.player;
    remote.current.setPlayer(player ?? null);
    remote.current.setTarget(ref ?? null);
  }, [media, target && "current" in target ? target.current : target]);
  return remote.current;
}

function useVideoQualityOptions({
  auto = true,
  sort = "descending"
} = {}) {
  const media = (0,_vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.useMediaContext)(), { qualities, quality, autoQuality, canSetQuality } = media.$state, $qualities = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.useSignal)(qualities);
  (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.useSignal)(quality);
  (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.useSignal)(autoQuality);
  (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.useSignal)(canSetQuality);
  return react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => {
    const sortedQualities = (0,_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_2__.sortVideoQualities)($qualities, sort === "descending"), options = sortedQualities.map((q) => {
      return {
        quality: q,
        label: q.height + "p",
        value: getQualityValue(q),
        bitrateText: q.bitrate && q.bitrate > 0 ? `${(q.bitrate / 1e6).toFixed(2)} Mbps` : null,
        get selected() {
          return q === quality();
        },
        get autoSelected() {
          return autoQuality();
        },
        select(trigger) {
          const index = qualities().indexOf(q);
          if (index >= 0) media.remote.changeQuality(index, trigger);
        }
      };
    });
    if (auto) {
      options.unshift({
        quality: null,
        label: (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isString)(auto) ? auto : "Auto",
        value: "auto",
        bitrateText: null,
        get selected() {
          return autoQuality();
        },
        get autoSelected() {
          return autoQuality();
        },
        select(trigger) {
          media.remote.requestAutoQuality(trigger);
        }
      });
    }
    Object.defineProperty(options, "disabled", {
      get() {
        return !canSetQuality() || $qualities.length <= 1;
      }
    });
    Object.defineProperty(options, "selectedQuality", {
      get() {
        return quality();
      }
    });
    Object.defineProperty(options, "selectedValue", {
      get() {
        const $quality = quality();
        return !autoQuality() && $quality ? getQualityValue($quality) : "auto";
      }
    });
    return options;
  }, [$qualities, sort]);
}
function getQualityValue(quality) {
  return quality.height + "_" + quality.bitrate;
}

function usePlaybackRateOptions({
  rates = DEFAULT_PLAYBACK_RATES,
  normalLabel = "Normal"
} = {}) {
  const media = (0,_vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.useMediaContext)(), { playbackRate, canSetPlaybackRate } = media.$state;
  (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.useSignal)(playbackRate);
  (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.useSignal)(canSetPlaybackRate);
  return react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => {
    const options = rates.map((opt) => {
      const label = typeof opt === "number" ? opt === 1 && normalLabel ? normalLabel : opt + "x" : opt.label, rate = typeof opt === "number" ? opt : opt.rate;
      return {
        label,
        value: rate.toString(),
        rate,
        get selected() {
          return playbackRate() === rate;
        },
        select(trigger) {
          media.remote.changePlaybackRate(rate, trigger);
        }
      };
    });
    Object.defineProperty(options, "disabled", {
      get() {
        return !canSetPlaybackRate() || !options.length;
      }
    });
    Object.defineProperty(options, "selectedValue", {
      get() {
        return playbackRate().toString();
      }
    });
    return options;
  }, [rates]);
}




/***/ }),

/***/ "./node_modules/@vidstack/react/dev/chunks/vidstack-D-hQD1eE.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@vidstack/react/dev/chunks/vidstack-D-hQD1eE.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RemotionPoster: () => (/* binding */ RemotionPoster),
/* harmony export */   RemotionSliderThumbnail: () => (/* binding */ RemotionSliderThumbnail),
/* harmony export */   RemotionThumbnail: () => (/* binding */ RemotionThumbnail)
/* harmony export */ });
/* harmony import */ var _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./vidstack-D_bWd66h.js */ "./node_modules/@vidstack/react/dev/chunks/vidstack-D_bWd66h.js");
"use client"

;

const RemotionThumbnail = /* @__PURE__ */ (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_0__.signal)(null);
const RemotionSliderThumbnail = /* @__PURE__ */ (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_0__.signal)(null);
const RemotionPoster = /* @__PURE__ */ (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_0__.signal)(null);




/***/ }),

/***/ "./node_modules/@vidstack/react/dev/chunks/vidstack-DUlCophs.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@vidstack/react/dev/chunks/vidstack-DUlCophs.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ARIAKeyShortcuts: () => (/* binding */ ARIAKeyShortcuts),
/* harmony export */   AUDIO_EXTENSIONS: () => (/* binding */ AUDIO_EXTENSIONS),
/* harmony export */   AUDIO_TYPES: () => (/* binding */ AUDIO_TYPES),
/* harmony export */   AirPlayButtonInstance: () => (/* binding */ AirPlayButtonInstance),
/* harmony export */   AudioGainSliderInstance: () => (/* binding */ AudioGainSliderInstance),
/* harmony export */   AudioProviderLoader: () => (/* binding */ AudioProviderLoader),
/* harmony export */   AudioTrackList: () => (/* binding */ AudioTrackList),
/* harmony export */   CaptionButtonInstance: () => (/* binding */ CaptionButtonInstance),
/* harmony export */   CaptionsInstance: () => (/* binding */ CaptionsInstance),
/* harmony export */   ControlsGroupInstance: () => (/* binding */ ControlsGroupInstance),
/* harmony export */   ControlsInstance: () => (/* binding */ ControlsInstance),
/* harmony export */   DASHProviderLoader: () => (/* binding */ DASHProviderLoader),
/* harmony export */   DASH_VIDEO_EXTENSIONS: () => (/* binding */ DASH_VIDEO_EXTENSIONS),
/* harmony export */   DASH_VIDEO_TYPES: () => (/* binding */ DASH_VIDEO_TYPES),
/* harmony export */   FullscreenButtonInstance: () => (/* binding */ FullscreenButtonInstance),
/* harmony export */   FullscreenController: () => (/* binding */ FullscreenController),
/* harmony export */   GestureInstance: () => (/* binding */ GestureInstance),
/* harmony export */   GoogleCastButtonInstance: () => (/* binding */ GoogleCastButtonInstance),
/* harmony export */   HLSProviderLoader: () => (/* binding */ HLSProviderLoader),
/* harmony export */   HLS_VIDEO_EXTENSIONS: () => (/* binding */ HLS_VIDEO_EXTENSIONS),
/* harmony export */   HLS_VIDEO_TYPES: () => (/* binding */ HLS_VIDEO_TYPES),
/* harmony export */   HTMLAirPlayAdapter: () => (/* binding */ HTMLAirPlayAdapter),
/* harmony export */   HTMLMediaProvider: () => (/* binding */ HTMLMediaProvider),
/* harmony export */   IS_CHROME: () => (/* binding */ IS_CHROME),
/* harmony export */   IS_IOS: () => (/* binding */ IS_IOS),
/* harmony export */   IS_SERVER: () => (/* binding */ IS_SERVER),
/* harmony export */   List: () => (/* binding */ List),
/* harmony export */   ListSymbol: () => (/* binding */ ListSymbol),
/* harmony export */   LiveButtonInstance: () => (/* binding */ LiveButtonInstance),
/* harmony export */   LocalMediaStorage: () => (/* binding */ LocalMediaStorage),
/* harmony export */   Logger: () => (/* binding */ Logger),
/* harmony export */   MEDIA_KEY_SHORTCUTS: () => (/* binding */ MEDIA_KEY_SHORTCUTS),
/* harmony export */   MediaAnnouncerInstance: () => (/* binding */ MediaAnnouncerInstance),
/* harmony export */   MediaControls: () => (/* binding */ MediaControls),
/* harmony export */   MediaPlayerInstance: () => (/* binding */ MediaPlayerInstance),
/* harmony export */   MediaProviderInstance: () => (/* binding */ MediaProviderInstance),
/* harmony export */   MediaRemoteControl: () => (/* binding */ MediaRemoteControl),
/* harmony export */   MenuButtonInstance: () => (/* binding */ MenuButtonInstance),
/* harmony export */   MenuInstance: () => (/* binding */ MenuInstance),
/* harmony export */   MenuItemInstance: () => (/* binding */ MenuItemInstance),
/* harmony export */   MenuItemsInstance: () => (/* binding */ MenuItemsInstance),
/* harmony export */   MenuPortalInstance: () => (/* binding */ MenuPortalInstance),
/* harmony export */   MuteButtonInstance: () => (/* binding */ MuteButtonInstance),
/* harmony export */   PIPButtonInstance: () => (/* binding */ PIPButtonInstance),
/* harmony export */   PlayButtonInstance: () => (/* binding */ PlayButtonInstance),
/* harmony export */   PosterInstance: () => (/* binding */ PosterInstance),
/* harmony export */   Primitive: () => (/* binding */ Primitive),
/* harmony export */   QualitySliderInstance: () => (/* binding */ QualitySliderInstance),
/* harmony export */   QualitySymbol: () => (/* binding */ QualitySymbol),
/* harmony export */   RAFLoop: () => (/* binding */ RAFLoop),
/* harmony export */   RadioGroupController: () => (/* binding */ RadioGroupController),
/* harmony export */   RadioGroupInstance: () => (/* binding */ RadioGroupInstance),
/* harmony export */   RadioInstance: () => (/* binding */ RadioInstance),
/* harmony export */   ScreenOrientationController: () => (/* binding */ ScreenOrientationController),
/* harmony export */   SeekButtonInstance: () => (/* binding */ SeekButtonInstance),
/* harmony export */   SliderChaptersInstance: () => (/* binding */ SliderChaptersInstance),
/* harmony export */   SliderInstance: () => (/* binding */ SliderInstance),
/* harmony export */   SliderPreviewInstance: () => (/* binding */ SliderPreviewInstance),
/* harmony export */   SliderThumbnailInstance: () => (/* binding */ SliderThumbnailInstance),
/* harmony export */   SliderValueInstance: () => (/* binding */ SliderValueInstance),
/* harmony export */   SliderVideoInstance: () => (/* binding */ SliderVideoInstance),
/* harmony export */   SpeedSliderInstance: () => (/* binding */ SpeedSliderInstance),
/* harmony export */   TextRenderers: () => (/* binding */ TextRenderers),
/* harmony export */   TextTrack: () => (/* binding */ TextTrack),
/* harmony export */   TextTrackList: () => (/* binding */ TextTrackList),
/* harmony export */   TextTrackSymbol: () => (/* binding */ TextTrackSymbol),
/* harmony export */   ThumbnailInstance: () => (/* binding */ ThumbnailInstance),
/* harmony export */   ThumbnailsLoader: () => (/* binding */ ThumbnailsLoader),
/* harmony export */   TimeInstance: () => (/* binding */ TimeInstance),
/* harmony export */   TimeRange: () => (/* binding */ TimeRange),
/* harmony export */   TimeSliderInstance: () => (/* binding */ TimeSliderInstance),
/* harmony export */   ToggleButtonInstance: () => (/* binding */ ToggleButtonInstance),
/* harmony export */   TooltipContentInstance: () => (/* binding */ TooltipContentInstance),
/* harmony export */   TooltipInstance: () => (/* binding */ TooltipInstance),
/* harmony export */   TooltipTriggerInstance: () => (/* binding */ TooltipTriggerInstance),
/* harmony export */   VIDEO_EXTENSIONS: () => (/* binding */ VIDEO_EXTENSIONS),
/* harmony export */   VIDEO_TYPES: () => (/* binding */ VIDEO_TYPES),
/* harmony export */   VideoProvider: () => (/* binding */ VideoProvider),
/* harmony export */   VideoProviderLoader: () => (/* binding */ VideoProviderLoader),
/* harmony export */   VideoQualityList: () => (/* binding */ VideoQualityList),
/* harmony export */   VimeoProviderLoader: () => (/* binding */ VimeoProviderLoader),
/* harmony export */   VolumeSliderInstance: () => (/* binding */ VolumeSliderInstance),
/* harmony export */   YouTubeProviderLoader: () => (/* binding */ YouTubeProviderLoader),
/* harmony export */   appendParamsToURL: () => (/* binding */ appendParamsToURL),
/* harmony export */   boundTime: () => (/* binding */ boundTime),
/* harmony export */   canChangeVolume: () => (/* binding */ canChangeVolume),
/* harmony export */   canFullscreen: () => (/* binding */ canFullscreen),
/* harmony export */   canGoogleCastSrc: () => (/* binding */ canGoogleCastSrc),
/* harmony export */   canOrientScreen: () => (/* binding */ canOrientScreen),
/* harmony export */   canPlayHLSNatively: () => (/* binding */ canPlayHLSNatively),
/* harmony export */   canRotateScreen: () => (/* binding */ canRotateScreen),
/* harmony export */   canUsePictureInPicture: () => (/* binding */ canUsePictureInPicture),
/* harmony export */   canUseVideoPresentation: () => (/* binding */ canUseVideoPresentation),
/* harmony export */   coerceToError: () => (/* binding */ coerceToError),
/* harmony export */   findActiveCue: () => (/* binding */ findActiveCue),
/* harmony export */   formatSpokenTime: () => (/* binding */ formatSpokenTime),
/* harmony export */   formatTime: () => (/* binding */ formatTime),
/* harmony export */   getDownloadFile: () => (/* binding */ getDownloadFile),
/* harmony export */   getTimeRangesEnd: () => (/* binding */ getTimeRangesEnd),
/* harmony export */   getTimeRangesStart: () => (/* binding */ getTimeRangesStart),
/* harmony export */   isAudioProvider: () => (/* binding */ isAudioProvider),
/* harmony export */   isAudioSrc: () => (/* binding */ isAudioSrc),
/* harmony export */   isCueActive: () => (/* binding */ isCueActive),
/* harmony export */   isDASHProvider: () => (/* binding */ isDASHProvider),
/* harmony export */   isDASHSrc: () => (/* binding */ isDASHSrc),
/* harmony export */   isGoogleCastProvider: () => (/* binding */ isGoogleCastProvider),
/* harmony export */   isHLSProvider: () => (/* binding */ isHLSProvider),
/* harmony export */   isHLSSrc: () => (/* binding */ isHLSSrc),
/* harmony export */   isHLSSupported: () => (/* binding */ isHLSSupported),
/* harmony export */   isHTMLAudioElement: () => (/* binding */ isHTMLAudioElement),
/* harmony export */   isHTMLIFrameElement: () => (/* binding */ isHTMLIFrameElement),
/* harmony export */   isHTMLMediaElement: () => (/* binding */ isHTMLMediaElement),
/* harmony export */   isHTMLVideoElement: () => (/* binding */ isHTMLVideoElement),
/* harmony export */   isMediaStream: () => (/* binding */ isMediaStream),
/* harmony export */   isRemotionProvider: () => (/* binding */ isRemotionProvider),
/* harmony export */   isRemotionSrc: () => (/* binding */ isRemotionSrc),
/* harmony export */   isTrackCaptionKind: () => (/* binding */ isTrackCaptionKind),
/* harmony export */   isVideoProvider: () => (/* binding */ isVideoProvider),
/* harmony export */   isVideoQualitySrc: () => (/* binding */ isVideoQualitySrc),
/* harmony export */   isVideoSrc: () => (/* binding */ isVideoSrc),
/* harmony export */   isVimeoProvider: () => (/* binding */ isVimeoProvider),
/* harmony export */   isYouTubeProvider: () => (/* binding */ isYouTubeProvider),
/* harmony export */   loadScript: () => (/* binding */ loadScript),
/* harmony export */   mediaContext: () => (/* binding */ mediaContext),
/* harmony export */   mediaState: () => (/* binding */ mediaState),
/* harmony export */   menuContext: () => (/* binding */ menuContext),
/* harmony export */   normalizeTimeIntervals: () => (/* binding */ normalizeTimeIntervals),
/* harmony export */   parseJSONCaptionsFile: () => (/* binding */ parseJSONCaptionsFile),
/* harmony export */   preconnect: () => (/* binding */ preconnect),
/* harmony export */   sliderState: () => (/* binding */ sliderState),
/* harmony export */   softResetMediaState: () => (/* binding */ softResetMediaState),
/* harmony export */   sortVideoQualities: () => (/* binding */ sortVideoQualities),
/* harmony export */   updateSliderPreviewPlacement: () => (/* binding */ updateSliderPreviewPlacement),
/* harmony export */   updateTimeIntervals: () => (/* binding */ updateTimeIntervals),
/* harmony export */   useMediaContext: () => (/* binding */ useMediaContext),
/* harmony export */   useMediaState: () => (/* binding */ useMediaState),
/* harmony export */   useMediaStore: () => (/* binding */ useMediaStore),
/* harmony export */   useSliderState: () => (/* binding */ useSliderState),
/* harmony export */   useSliderStore: () => (/* binding */ useSliderStore),
/* harmony export */   watchActiveTextTrack: () => (/* binding */ watchActiveTextTrack),
/* harmony export */   watchCueTextChange: () => (/* binding */ watchCueTextChange)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./vidstack-D_bWd66h.js */ "./node_modules/@vidstack/react/dev/chunks/vidstack-D_bWd66h.js");
/* harmony import */ var _floating_ui_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @floating-ui/dom */ "./node_modules/@floating-ui/dom/dist/floating-ui.dom.mjs");
"use client"

;



function isVideoQualitySrc(src) {
  return !(0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isString)(src) && "width" in src && "height" in src && (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isNumber)(src.width) && (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isNumber)(src.height);
}

const IS_SERVER = typeof document === "undefined";

const UA = IS_SERVER ? "" : navigator?.userAgent.toLowerCase() || "";
const IS_IOS = !IS_SERVER && /iphone|ipad|ipod|ios|crios|fxios/i.test(UA);
const IS_IPHONE = !IS_SERVER && /(iphone|ipod)/gi.test(navigator?.platform || "");
const IS_CHROME = !IS_SERVER && !!window.chrome;
const IS_SAFARI = !IS_SERVER && (!!window.safari || IS_IOS);
function canOrientScreen() {
  return canRotateScreen() && (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isFunction)(screen.orientation.unlock);
}
function canRotateScreen() {
  return !IS_SERVER && !(0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isUndefined)(window.screen.orientation) && !(0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isUndefined)(window.screen.orientation.lock);
}
function canPlayAudioType(audio, type) {
  if (IS_SERVER) return false;
  if (!audio) audio = document.createElement("audio");
  return audio.canPlayType(type).length > 0;
}
function canPlayVideoType(video, type) {
  if (IS_SERVER) return false;
  if (!video) video = document.createElement("video");
  return video.canPlayType(type).length > 0;
}
function canPlayHLSNatively(video) {
  if (IS_SERVER) return false;
  if (!video) video = document.createElement("video");
  return video.canPlayType("application/vnd.apple.mpegurl").length > 0;
}
function canUsePictureInPicture(video) {
  if (IS_SERVER) return false;
  return !!document.pictureInPictureEnabled && !video?.disablePictureInPicture;
}
function canUseVideoPresentation(video) {
  if (IS_SERVER) return false;
  return (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isFunction)(video?.webkitSupportsPresentationMode) && (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isFunction)(video?.webkitSetPresentationMode);
}
async function canChangeVolume() {
  const video = document.createElement("video");
  video.volume = 0.5;
  await (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.waitTimeout)(0);
  return video.volume === 0.5;
}
function getMediaSource() {
  return IS_SERVER ? void 0 : window?.ManagedMediaSource ?? window?.MediaSource ?? window?.WebKitMediaSource;
}
function getSourceBuffer() {
  return IS_SERVER ? void 0 : window?.SourceBuffer ?? window?.WebKitSourceBuffer;
}
function isHLSSupported() {
  if (IS_SERVER) return false;
  const MediaSource = getMediaSource();
  if ((0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isUndefined)(MediaSource)) return false;
  const isTypeSupported = MediaSource && (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isFunction)(MediaSource.isTypeSupported) && MediaSource.isTypeSupported('video/mp4; codecs="avc1.42E01E,mp4a.40.2"');
  const SourceBuffer = getSourceBuffer();
  const isSourceBufferValid = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isUndefined)(SourceBuffer) || !(0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isUndefined)(SourceBuffer.prototype) && (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isFunction)(SourceBuffer.prototype.appendBuffer) && (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isFunction)(SourceBuffer.prototype.remove);
  return !!isTypeSupported && !!isSourceBufferValid;
}
function isDASHSupported() {
  return isHLSSupported();
}

class TimeRange {
  #ranges;
  get length() {
    return this.#ranges.length;
  }
  constructor(start, end) {
    if ((0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isArray)(start)) {
      this.#ranges = start;
    } else if (!(0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isUndefined)(start) && !(0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isUndefined)(end)) {
      this.#ranges = [[start, end]];
    } else {
      this.#ranges = [];
    }
  }
  start(index) {
    throwIfEmpty(this.#ranges.length);
    throwIfOutOfRange("start", index, this.#ranges.length - 1);
    return this.#ranges[index][0] ?? Infinity;
  }
  end(index) {
    throwIfEmpty(this.#ranges.length);
    throwIfOutOfRange("end", index, this.#ranges.length - 1);
    return this.#ranges[index][1] ?? Infinity;
  }
}
function getTimeRangesStart(range) {
  if (!range.length) return null;
  let min = range.start(0);
  for (let i = 1; i < range.length; i++) {
    const value = range.start(i);
    if (value < min) min = value;
  }
  return min;
}
function getTimeRangesEnd(range) {
  if (!range.length) return null;
  let max = range.end(0);
  for (let i = 1; i < range.length; i++) {
    const value = range.end(i);
    if (value > max) max = value;
  }
  return max;
}
function throwIfEmpty(length) {
  if (!length) throw new Error("`TimeRanges` object is empty." );
}
function throwIfOutOfRange(fnName, index, end) {
  if (!(0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isNumber)(index) || index < 0 || index > end) {
    throw new Error(
      `Failed to execute '${fnName}' on 'TimeRanges': The index provided (${index}) is non-numeric or out of bounds (0-${end}).`
    );
  }
}
function normalizeTimeIntervals(intervals) {
  if (intervals.length <= 1) {
    return intervals;
  }
  intervals.sort((a, b) => a[0] - b[0]);
  let normalized = [], current = intervals[0];
  for (let i = 1; i < intervals.length; i++) {
    const next = intervals[i];
    if (current[1] >= next[0] - 1) {
      current = [current[0], Math.max(current[1], next[1])];
    } else {
      normalized.push(current);
      current = next;
    }
  }
  normalized.push(current);
  return normalized;
}
function updateTimeIntervals(intervals, interval, value) {
  let start = interval[0], end = interval[1];
  if (value < start) {
    return [value, -1];
  } else if (value === start) {
    return interval;
  } else if (start === -1) {
    interval[0] = value;
    return interval;
  } else if (value > start) {
    interval[1] = value;
    if (end === -1) intervals.push(interval);
  }
  normalizeTimeIntervals(intervals);
  return interval;
}

const AUDIO_EXTENSIONS = /\.(m4a|m4b|mp4a|mpga|mp2|mp2a|mp3|m2a|m3a|wav|weba|aac|oga|spx|flac)($|\?)/i;
const AUDIO_TYPES = /* @__PURE__ */ new Set([
  "audio/mpeg",
  "audio/ogg",
  "audio/3gp",
  "audio/mp3",
  "audio/webm",
  "audio/flac",
  "audio/m4a",
  "audio/m4b",
  "audio/mp4a",
  "audio/mp4"
]);
const VIDEO_EXTENSIONS = /\.(mp4|og[gv]|webm|mov|m4v)(#t=[,\d+]+)?($|\?)/i;
const VIDEO_TYPES = /* @__PURE__ */ new Set([
  "video/mp4",
  "video/webm",
  "video/3gp",
  "video/ogg",
  "video/avi",
  "video/mpeg"
]);
const HLS_VIDEO_EXTENSIONS = /\.(m3u8)($|\?)/i;
const DASH_VIDEO_EXTENSIONS = /\.(mpd)($|\?)/i;
const HLS_VIDEO_TYPES = /* @__PURE__ */ new Set([
  // Apple sanctioned
  "application/vnd.apple.mpegurl",
  // Apple sanctioned for backwards compatibility
  "audio/mpegurl",
  // Very common
  "audio/x-mpegurl",
  // Very common
  "application/x-mpegurl",
  // Included for completeness
  "video/x-mpegurl",
  "video/mpegurl",
  "application/mpegurl"
]);
const DASH_VIDEO_TYPES = /* @__PURE__ */ new Set(["application/dash+xml"]);
function isAudioSrc({ src, type }) {
  return (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isString)(src) ? AUDIO_EXTENSIONS.test(src) || AUDIO_TYPES.has(type) || src.startsWith("blob:") && type === "audio/object" : type === "audio/object";
}
function isVideoSrc(src) {
  return (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isString)(src.src) ? VIDEO_EXTENSIONS.test(src.src) || VIDEO_TYPES.has(src.type) || src.src.startsWith("blob:") && src.type === "video/object" || isHLSSrc(src) && (IS_SERVER || canPlayHLSNatively()) : src.type === "video/object";
}
function isHLSSrc({ src, type }) {
  return (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isString)(src) && HLS_VIDEO_EXTENSIONS.test(src) || HLS_VIDEO_TYPES.has(type);
}
function isDASHSrc({ src, type }) {
  return (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isString)(src) && DASH_VIDEO_EXTENSIONS.test(src) || DASH_VIDEO_TYPES.has(type);
}
function canGoogleCastSrc(src) {
  return (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isString)(src.src) && (isAudioSrc(src) || isVideoSrc(src) || isHLSSrc(src));
}
function isMediaStream(src) {
  return !IS_SERVER && typeof window.MediaStream !== "undefined" && src instanceof window.MediaStream;
}

function appendParamsToURL(baseUrl, params) {
  const url = new URL(baseUrl);
  for (const key of Object.keys(params)) {
    url.searchParams.set(key, params[key] + "");
  }
  return url.toString();
}
function preconnect(url, rel = "preconnect") {
  if (IS_SERVER) return false;
  const exists = document.querySelector(`link[href="${url}"]`);
  if (!(0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isNull)(exists)) return true;
  const link = document.createElement("link");
  link.rel = rel;
  link.href = url;
  link.crossOrigin = "true";
  document.head.append(link);
  return true;
}
const pendingRequests = {};
function loadScript(src) {
  if (pendingRequests[src]) return pendingRequests[src].promise;
  const promise = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.deferredPromise)(), exists = document.querySelector(`script[src="${src}"]`);
  if (!(0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isNull)(exists)) {
    promise.resolve();
    return promise.promise;
  }
  pendingRequests[src] = promise;
  const script = document.createElement("script");
  script.src = src;
  script.onload = () => {
    promise.resolve();
    delete pendingRequests[src];
  };
  script.onerror = () => {
    promise.reject();
    delete pendingRequests[src];
  };
  setTimeout(() => document.head.append(script), 0);
  return promise.promise;
}
function getRequestCredentials(crossOrigin) {
  return crossOrigin === "use-credentials" ? "include" : (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isString)(crossOrigin) ? "same-origin" : void 0;
}
function getDownloadFile({
  title,
  src,
  download
}) {
  const url = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isBoolean)(download) || download === "" ? src.src : (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isString)(download) ? download : download?.url;
  if (!isValidFileDownload({ url, src, download })) return null;
  return {
    url,
    name: !(0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isBoolean)(download) && !(0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isString)(download) && download?.filename || title.toLowerCase() || "media"
  };
}
function isValidFileDownload({
  url,
  src,
  download
}) {
  return (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isString)(url) && (download && download !== true || isAudioSrc(src) || isVideoSrc(src));
}

const CROSS_ORIGIN = Symbol("TEXT_TRACK_CROSS_ORIGIN" ), READY_STATE = Symbol("TEXT_TRACK_READY_STATE" ), UPDATE_ACTIVE_CUES = Symbol("TEXT_TRACK_UPDATE_ACTIVE_CUES" ), CAN_LOAD = Symbol("TEXT_TRACK_CAN_LOAD" ), ON_MODE_CHANGE = Symbol("TEXT_TRACK_ON_MODE_CHANGE" ), NATIVE = Symbol("TEXT_TRACK_NATIVE" ), NATIVE_HLS = Symbol("TEXT_TRACK_NATIVE_HLS" );
const TextTrackSymbol = {
  crossOrigin: CROSS_ORIGIN,
  readyState: READY_STATE,
  updateActiveCues: UPDATE_ACTIVE_CUES,
  canLoad: CAN_LOAD,
  onModeChange: ON_MODE_CHANGE,
  native: NATIVE,
  nativeHLS: NATIVE_HLS
};

function findActiveCue(cues, time) {
  for (let i = 0, len = cues.length; i < len; i++) {
    if (isCueActive(cues[i], time)) return cues[i];
  }
  return null;
}
function isCueActive(cue, time) {
  return time >= cue.startTime && time < cue.endTime;
}
function watchActiveTextTrack(tracks, kind, onChange) {
  let currentTrack = null, scope = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.getScope)();
  function onModeChange() {
    const kinds = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isString)(kind) ? [kind] : kind, track = tracks.toArray().find((track2) => kinds.includes(track2.kind) && track2.mode === "showing");
    if (track === currentTrack) return;
    if (!track) {
      onChange(null);
      currentTrack = null;
      return;
    }
    if (track.readyState == 2) {
      onChange(track);
    } else {
      onChange(null);
      (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.scoped)(() => {
        const off = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.listenEvent)(
          track,
          "load",
          () => {
            onChange(track);
            off();
          },
          { once: true }
        );
      }, scope);
    }
    currentTrack = track;
  }
  onModeChange();
  return (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.listenEvent)(tracks, "mode-change", onModeChange);
}
function watchCueTextChange(tracks, kind, callback) {
  watchActiveTextTrack(tracks, kind, (track) => {
    if (!track) {
      callback("");
      return;
    }
    const onCueChange = () => {
      const activeCue = track?.activeCues[0];
      callback(activeCue?.text || "");
    };
    onCueChange();
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.listenEvent)(track, "cue-change", onCueChange);
  });
}

class TextTrack extends _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.EventsTarget {
  static createId(track) {
    return `vds-${track.type}-${track.kind}-${track.src ?? track.label ?? "?"}`;
  }
  src;
  content;
  type;
  encoding;
  id = "";
  label = "";
  language = "";
  kind;
  default = false;
  #canLoad = false;
  #currentTime = 0;
  #mode = "disabled";
  #metadata = {};
  #regions = [];
  #cues = [];
  #activeCues = [];
  /** @internal */
  [TextTrackSymbol.readyState] = 0;
  /** @internal */
  [TextTrackSymbol.crossOrigin];
  /** @internal */
  [TextTrackSymbol.onModeChange] = null;
  /** @internal */
  [TextTrackSymbol.native] = null;
  get metadata() {
    return this.#metadata;
  }
  get regions() {
    return this.#regions;
  }
  get cues() {
    return this.#cues;
  }
  get activeCues() {
    return this.#activeCues;
  }
  /**
   * - 0: Not Loading
   * - 1: Loading
   * - 2: Ready
   * - 3: Error
   */
  get readyState() {
    return this[TextTrackSymbol.readyState];
  }
  get mode() {
    return this.#mode;
  }
  set mode(mode) {
    this.setMode(mode);
  }
  constructor(init) {
    super();
    for (const prop of Object.keys(init)) this[prop] = init[prop];
    if (!this.type) this.type = "vtt";
    if (!IS_SERVER && init.content) {
      this.#parseContent(init);
    } else if (!init.src) {
      this[TextTrackSymbol.readyState] = 2;
    }
    if (isTrackCaptionKind(this) && !this.label) {
      console.warn(`[vidstack] captions text track created without label: \`${this.src}\``);
    }
  }
  addCue(cue, trigger) {
    let i = 0, length = this.#cues.length;
    for (i = 0; i < length; i++) if (cue.endTime <= this.#cues[i].startTime) break;
    if (i === length) this.#cues.push(cue);
    else this.#cues.splice(i, 0, cue);
    if (!(cue instanceof TextTrackCue)) {
      this[TextTrackSymbol.native]?.track.addCue(cue);
    }
    this.dispatchEvent(new _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.DOMEvent("add-cue", { detail: cue, trigger }));
    if (isCueActive(cue, this.#currentTime)) {
      this[TextTrackSymbol.updateActiveCues](this.#currentTime, trigger);
    }
  }
  removeCue(cue, trigger) {
    const index = this.#cues.indexOf(cue);
    if (index >= 0) {
      const isActive = this.#activeCues.includes(cue);
      this.#cues.splice(index, 1);
      this[TextTrackSymbol.native]?.track.removeCue(cue);
      this.dispatchEvent(new _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.DOMEvent("remove-cue", { detail: cue, trigger }));
      if (isActive) {
        this[TextTrackSymbol.updateActiveCues](this.#currentTime, trigger);
      }
    }
  }
  setMode(mode, trigger) {
    if (this.#mode === mode) return;
    this.#mode = mode;
    if (mode === "disabled") {
      this.#activeCues = [];
      this.#activeCuesChanged();
    } else if (this.readyState === 2) {
      this[TextTrackSymbol.updateActiveCues](this.#currentTime, trigger);
    } else {
      this.#load();
    }
    this.dispatchEvent(new _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.DOMEvent("mode-change", { detail: this, trigger }));
    this[TextTrackSymbol.onModeChange]?.();
  }
  /** @internal */
  [TextTrackSymbol.updateActiveCues](currentTime, trigger) {
    this.#currentTime = currentTime;
    if (this.mode === "disabled" || !this.#cues.length) return;
    const activeCues = [];
    for (let i = 0, length = this.#cues.length; i < length; i++) {
      const cue = this.#cues[i];
      if (isCueActive(cue, currentTime)) activeCues.push(cue);
    }
    let changed = activeCues.length !== this.#activeCues.length;
    if (!changed) {
      for (let i = 0; i < activeCues.length; i++) {
        if (!this.#activeCues.includes(activeCues[i])) {
          changed = true;
          break;
        }
      }
    }
    this.#activeCues = activeCues;
    if (changed) this.#activeCuesChanged(trigger);
  }
  /** @internal */
  [TextTrackSymbol.canLoad]() {
    this.#canLoad = true;
    if (this.#mode !== "disabled") this.#load();
  }
  #parseContent(init) {
    __webpack_require__.e(/*! import() */ "vendors-node_modules_media-captions_dist_dev_js").then(__webpack_require__.bind(__webpack_require__, /*! media-captions */ "./node_modules/media-captions/dist/dev.js")).then(({ parseText, VTTCue, VTTRegion }) => {
      if (!(0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isString)(init.content) || init.type === "json") {
        this.#parseJSON(init.content, VTTCue, VTTRegion);
        if (this.readyState !== 3) this.#ready();
      } else {
        parseText(init.content, { type: init.type }).then(({ cues, regions }) => {
          this.#cues = cues;
          this.#regions = regions;
          this.#ready();
        });
      }
    });
  }
  async #load() {
    if (!this.#canLoad || this[TextTrackSymbol.readyState] > 0) return;
    this[TextTrackSymbol.readyState] = 1;
    this.dispatchEvent(new _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.DOMEvent("load-start"));
    if (!this.src) {
      this.#ready();
      return;
    }
    try {
      const { parseResponse, VTTCue, VTTRegion } = await __webpack_require__.e(/*! import() */ "vendors-node_modules_media-captions_dist_dev_js").then(__webpack_require__.bind(__webpack_require__, /*! media-captions */ "./node_modules/media-captions/dist/dev.js")), crossOrigin = this[TextTrackSymbol.crossOrigin]?.();
      const response = fetch(this.src, {
        headers: this.type === "json" ? { "Content-Type": "application/json" } : void 0,
        credentials: getRequestCredentials(crossOrigin)
      });
      if (this.type === "json") {
        this.#parseJSON(await (await response).text(), VTTCue, VTTRegion);
      } else {
        const { errors, metadata, regions, cues } = await parseResponse(response, {
          type: this.type,
          encoding: this.encoding
        });
        if (errors[0]?.code === 0) {
          throw errors[0];
        } else {
          this.#metadata = metadata;
          this.#regions = regions;
          this.#cues = cues;
        }
      }
      this.#ready();
    } catch (error) {
      this.#error(error);
    }
  }
  #ready() {
    this[TextTrackSymbol.readyState] = 2;
    if (!this.src || this.type !== "vtt") {
      const native = this[TextTrackSymbol.native];
      if (native && !native.managed) {
        for (const cue of this.#cues) native.track.addCue(cue);
      }
    }
    const loadEvent = new _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.DOMEvent("load");
    this[TextTrackSymbol.updateActiveCues](this.#currentTime, loadEvent);
    this.dispatchEvent(loadEvent);
  }
  #error(error) {
    this[TextTrackSymbol.readyState] = 3;
    this.dispatchEvent(new _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.DOMEvent("error", { detail: error }));
  }
  #parseJSON(json, VTTCue, VTTRegion) {
    try {
      const { regions, cues } = parseJSONCaptionsFile(json, VTTCue, VTTRegion);
      this.#regions = regions;
      this.#cues = cues;
    } catch (error) {
      {
        console.error(`[vidstack] failed to parse JSON captions at: \`${this.src}\`

`, error);
      }
      this.#error(error);
    }
  }
  #activeCuesChanged(trigger) {
    this.dispatchEvent(new _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.DOMEvent("cue-change", { trigger }));
  }
}
const captionRE = /captions|subtitles/;
function isTrackCaptionKind(track) {
  return captionRE.test(track.kind);
}
function parseJSONCaptionsFile(json, Cue, Region) {
  const content = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isString)(json) ? JSON.parse(json) : json;
  let regions = [], cues = [];
  if (content.regions && Region) {
    regions = content.regions.map((region) => Object.assign(new Region(), region));
  }
  if (content.cues || (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isArray)(content)) {
    cues = ((0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isArray)(content) ? content : content.cues).filter((content2) => (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isNumber)(content2.startTime) && (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isNumber)(content2.endTime)).map((cue) => Object.assign(new Cue(0, 0, ""), cue));
  }
  return { regions, cues };
}

const mediaState = new _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.State({
  artist: "",
  artwork: null,
  audioTrack: null,
  audioTracks: [],
  autoPlay: false,
  autoPlayError: null,
  audioGain: null,
  buffered: new TimeRange(),
  canLoad: false,
  canLoadPoster: false,
  canFullscreen: false,
  canOrientScreen: canOrientScreen(),
  canPictureInPicture: false,
  canPlay: false,
  clipStartTime: 0,
  clipEndTime: 0,
  controls: false,
  get iOSControls() {
    return IS_IPHONE && this.mediaType === "video" && (!this.playsInline || !_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.fscreen.fullscreenEnabled && this.fullscreen);
  },
  get nativeControls() {
    return this.controls || this.iOSControls;
  },
  controlsVisible: false,
  get controlsHidden() {
    return !this.controlsVisible;
  },
  crossOrigin: null,
  ended: false,
  error: null,
  fullscreen: false,
  get loop() {
    return this.providedLoop || this.userPrefersLoop;
  },
  logLevel: "warn" ,
  mediaType: "unknown",
  muted: false,
  paused: true,
  played: new TimeRange(),
  playing: false,
  playsInline: false,
  pictureInPicture: false,
  preload: "metadata",
  playbackRate: 1,
  qualities: [],
  quality: null,
  autoQuality: false,
  canSetQuality: true,
  canSetPlaybackRate: true,
  canSetVolume: false,
  canSetAudioGain: false,
  seekable: new TimeRange(),
  seeking: false,
  source: { src: "", type: "" },
  sources: [],
  started: false,
  textTracks: [],
  textTrack: null,
  get hasCaptions() {
    return this.textTracks.filter(isTrackCaptionKind).length > 0;
  },
  volume: 1,
  waiting: false,
  realCurrentTime: 0,
  get currentTime() {
    return this.ended ? this.duration : this.clipStartTime > 0 ? Math.max(0, Math.min(this.realCurrentTime - this.clipStartTime, this.duration)) : this.realCurrentTime;
  },
  providedDuration: -1,
  intrinsicDuration: 0,
  get duration() {
    return this.seekableWindow;
  },
  get title() {
    return this.providedTitle || this.inferredTitle;
  },
  get poster() {
    return this.providedPoster || this.inferredPoster;
  },
  get viewType() {
    return this.providedViewType !== "unknown" ? this.providedViewType : this.inferredViewType;
  },
  get streamType() {
    return this.providedStreamType !== "unknown" ? this.providedStreamType : this.inferredStreamType;
  },
  get currentSrc() {
    return this.source;
  },
  get bufferedStart() {
    const start = getTimeRangesStart(this.buffered) ?? 0;
    return Math.max(start, this.clipStartTime);
  },
  get bufferedEnd() {
    const end = getTimeRangesEnd(this.buffered) ?? 0;
    return Math.min(this.seekableEnd, Math.max(0, end - this.clipStartTime));
  },
  get bufferedWindow() {
    return Math.max(0, this.bufferedEnd - this.bufferedStart);
  },
  get seekableStart() {
    if (this.isLiveDVR && this.liveDVRWindow > 0) {
      return Math.max(0, this.seekableEnd - this.liveDVRWindow);
    }
    const start = getTimeRangesStart(this.seekable) ?? 0;
    return Math.max(start, this.clipStartTime);
  },
  get seekableEnd() {
    if (this.providedDuration > 0) return this.providedDuration;
    const end = this.liveSyncPosition > 0 ? this.liveSyncPosition : this.canPlay ? getTimeRangesEnd(this.seekable) ?? Infinity : 0;
    return this.clipEndTime > 0 ? Math.min(this.clipEndTime, end) : end;
  },
  get seekableWindow() {
    const window = this.seekableEnd - this.seekableStart;
    return !isNaN(window) ? Math.max(0, window) : Infinity;
  },
  // ~~ remote playback ~~
  canAirPlay: false,
  canGoogleCast: false,
  remotePlaybackState: "disconnected",
  remotePlaybackType: "none",
  remotePlaybackLoader: null,
  remotePlaybackInfo: null,
  get isAirPlayConnected() {
    return this.remotePlaybackType === "airplay" && this.remotePlaybackState === "connected";
  },
  get isGoogleCastConnected() {
    return this.remotePlaybackType === "google-cast" && this.remotePlaybackState === "connected";
  },
  // ~~ responsive design ~~
  pointer: "fine",
  orientation: "landscape",
  width: 0,
  height: 0,
  mediaWidth: 0,
  mediaHeight: 0,
  lastKeyboardAction: null,
  // ~~ user props ~~
  userBehindLiveEdge: false,
  // ~~ live props ~~
  liveEdgeTolerance: 10,
  minLiveDVRWindow: 60,
  get canSeek() {
    return /unknown|on-demand|:dvr/.test(this.streamType) && Number.isFinite(this.duration) && (!this.isLiveDVR || this.duration >= this.liveDVRWindow);
  },
  get live() {
    return this.streamType.includes("live") || !Number.isFinite(this.duration);
  },
  get liveEdgeStart() {
    return this.live && Number.isFinite(this.seekableEnd) ? Math.max(0, this.seekableEnd - this.liveEdgeTolerance) : 0;
  },
  get liveEdge() {
    return this.live && (!this.canSeek || !this.userBehindLiveEdge && this.currentTime >= this.liveEdgeStart);
  },
  get liveEdgeWindow() {
    return this.live && Number.isFinite(this.seekableEnd) ? this.seekableEnd - this.liveEdgeStart : 0;
  },
  get isLiveDVR() {
    return /:dvr/.test(this.streamType);
  },
  get liveDVRWindow() {
    return Math.max(this.inferredLiveDVRWindow, this.minLiveDVRWindow);
  },
  // ~~ internal props ~~
  autoPlaying: false,
  providedTitle: "",
  inferredTitle: "",
  providedLoop: false,
  userPrefersLoop: false,
  providedPoster: "",
  inferredPoster: "",
  inferredViewType: "unknown",
  providedViewType: "unknown",
  providedStreamType: "unknown",
  inferredStreamType: "unknown",
  liveSyncPosition: null,
  inferredLiveDVRWindow: 0,
  savedState: null
});
const RESET_ON_SRC_QUALITY_CHANGE = /* @__PURE__ */ new Set([
  "autoPlayError",
  "autoPlaying",
  "buffered",
  "canPlay",
  "error",
  "paused",
  "played",
  "playing",
  "seekable",
  "seeking",
  "waiting"
]);
const RESET_ON_SRC_CHANGE = /* @__PURE__ */ new Set([
  ...RESET_ON_SRC_QUALITY_CHANGE,
  "ended",
  "inferredPoster",
  "inferredStreamType",
  "inferredTitle",
  "intrinsicDuration",
  "inferredLiveDVRWindow",
  "liveSyncPosition",
  "realCurrentTime",
  "savedState",
  "started",
  "userBehindLiveEdge"
]);
function softResetMediaState($media, isSourceQualityChange = false) {
  const filter = isSourceQualityChange ? RESET_ON_SRC_QUALITY_CHANGE : RESET_ON_SRC_CHANGE;
  mediaState.reset($media, (prop) => filter.has(prop));
  (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.tick)();
}
function boundTime(time, store) {
  const clippedTime = time + store.clipStartTime(), isStart = Math.floor(time) === Math.floor(store.seekableStart()), isEnd = Math.floor(clippedTime) === Math.floor(store.seekableEnd());
  if (isStart) {
    return store.seekableStart();
  }
  if (isEnd) {
    return store.seekableEnd();
  }
  if (store.isLiveDVR() && store.liveDVRWindow() > 0 && clippedTime < store.seekableEnd() - store.liveDVRWindow()) {
    return store.bufferedStart();
  }
  return Math.min(Math.max(store.seekableStart() + 0.1, clippedTime), store.seekableEnd() - 0.1);
}

const mediaContext = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.createContext)();
function useMediaContext() {
  return (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.useContext)(mediaContext);
}

const GROUPED_LOG = Symbol("GROUPED_LOG" );
class GroupedLog {
  constructor(logger, level, title, root, parent) {
    this.logger = logger;
    this.level = level;
    this.title = title;
    this.root = root;
    this.parent = parent;
  }
  [GROUPED_LOG] = true;
  logs = [];
  log(...data) {
    this.logs.push({ data });
    return this;
  }
  labelledLog(label, ...data) {
    this.logs.push({ label, data });
    return this;
  }
  groupStart(title) {
    return new GroupedLog(this.logger, this.level, title, this.root ?? this, this);
  }
  groupEnd() {
    this.parent?.logs.push(this);
    return this.parent ?? this;
  }
  dispatch() {
    return this.logger.dispatch(this.level, this.root ?? this);
  }
}
function isGroupedLog(data) {
  return !!data?.[GROUPED_LOG];
}

class Logger {
  #target = null;
  error(...data) {
    return this.dispatch("error", ...data);
  }
  warn(...data) {
    return this.dispatch("warn", ...data);
  }
  info(...data) {
    return this.dispatch("info", ...data);
  }
  debug(...data) {
    return this.dispatch("debug", ...data);
  }
  errorGroup(title) {
    return new GroupedLog(this, "error", title);
  }
  warnGroup(title) {
    return new GroupedLog(this, "warn", title);
  }
  infoGroup(title) {
    return new GroupedLog(this, "info", title);
  }
  debugGroup(title) {
    return new GroupedLog(this, "debug", title);
  }
  setTarget(newTarget) {
    this.#target = newTarget;
  }
  dispatch(level, ...data) {
    return this.#target?.dispatchEvent(
      new _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.DOMEvent("vds-log", {
        bubbles: true,
        composed: true,
        detail: { level, data }
      })
    ) || false;
  }
}

class MediaRemoteControl {
  #target = null;
  #player = null;
  #prevTrackIndex = -1;
  #logger;
  constructor(logger = new Logger() ) {
    this.#logger = logger;
  }
  /**
   * Set the target from which to dispatch media requests events from. The events should bubble
   * up from this target to the player element.
   *
   * @example
   * ```ts
   * const button = document.querySelector('button');
   * remote.setTarget(button);
   * ```
   */
  setTarget(target) {
    this.#target = target;
    this.#logger?.setTarget(target);
  }
  /**
   * Returns the current player element. This method will attempt to find the player by
   * searching up from either the given `target` or default target set via `remote.setTarget`.
   *
   * @example
   * ```ts
   * const player = remote.getPlayer();
   * ```
   */
  getPlayer(target) {
    if (this.#player) return this.#player;
    (target ?? this.#target)?.dispatchEvent(
      new _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.DOMEvent("find-media-player", {
        detail: (player) => void (this.#player = player),
        bubbles: true,
        composed: true
      })
    );
    return this.#player;
  }
  /**
   * Set the current player element so the remote can support toggle methods such as
   * `togglePaused` as they rely on the current media state.
   */
  setPlayer(player) {
    this.#player = player;
  }
  /**
   * Dispatch a request to start the media loading process. This will only work if the media
   * player has been initialized with a custom loading strategy `load="custom">`.
   *
   * @docs {@link https://www.vidstack.io/docs/player/core-concepts/loading#load-strategies}
   */
  startLoading(trigger) {
    this.#dispatchRequest("media-start-loading", trigger);
  }
  /**
   * Dispatch a request to start the poster loading process. This will only work if the media
   * player has been initialized with a custom poster loading strategy `posterLoad="custom">`.
   *
   * @docs {@link https://www.vidstack.io/docs/player/core-concepts/loading#load-strategies}
   */
  startLoadingPoster(trigger) {
    this.#dispatchRequest("media-poster-start-loading", trigger);
  }
  /**
   * Dispatch a request to connect to AirPlay.
   *
   * @see {@link https://www.apple.com/au/airplay}
   */
  requestAirPlay(trigger) {
    this.#dispatchRequest("media-airplay-request", trigger);
  }
  /**
   * Dispatch a request to connect to Google Cast.
   *
   * @see {@link https://developers.google.com/cast/docs/overview}
   */
  requestGoogleCast(trigger) {
    this.#dispatchRequest("media-google-cast-request", trigger);
  }
  /**
   * Dispatch a request to begin/resume media playback.
   */
  play(trigger) {
    this.#dispatchRequest("media-play-request", trigger);
  }
  /**
   * Dispatch a request to pause media playback.
   */
  pause(trigger) {
    this.#dispatchRequest("media-pause-request", trigger);
  }
  /**
   * Dispatch a request to set the media volume to mute (0).
   */
  mute(trigger) {
    this.#dispatchRequest("media-mute-request", trigger);
  }
  /**
   * Dispatch a request to unmute the media volume and set it back to it's previous state.
   */
  unmute(trigger) {
    this.#dispatchRequest("media-unmute-request", trigger);
  }
  /**
   * Dispatch a request to enter fullscreen.
   *
   * @docs {@link https://www.vidstack.io/docs/player/api/fullscreen#remote-control}
   */
  enterFullscreen(target, trigger) {
    this.#dispatchRequest("media-enter-fullscreen-request", trigger, target);
  }
  /**
   * Dispatch a request to exit fullscreen.
   *
   * @docs {@link https://www.vidstack.io/docs/player/api/fullscreen#remote-control}
   */
  exitFullscreen(target, trigger) {
    this.#dispatchRequest("media-exit-fullscreen-request", trigger, target);
  }
  /**
   * Dispatch a request to lock the screen orientation.
   *
   * @docs {@link https://www.vidstack.io/docs/player/screen-orientation#remote-control}
   */
  lockScreenOrientation(lockType, trigger) {
    this.#dispatchRequest("media-orientation-lock-request", trigger, lockType);
  }
  /**
   * Dispatch a request to unlock the screen orientation.
   *
   * @docs {@link https://www.vidstack.io/docs/player/api/screen-orientation#remote-control}
   */
  unlockScreenOrientation(trigger) {
    this.#dispatchRequest("media-orientation-unlock-request", trigger);
  }
  /**
   * Dispatch a request to enter picture-in-picture mode.
   *
   * @docs {@link https://www.vidstack.io/docs/player/api/picture-in-picture#remote-control}
   */
  enterPictureInPicture(trigger) {
    this.#dispatchRequest("media-enter-pip-request", trigger);
  }
  /**
   * Dispatch a request to exit picture-in-picture mode.
   *
   * @docs {@link https://www.vidstack.io/docs/player/api/picture-in-picture#remote-control}
   */
  exitPictureInPicture(trigger) {
    this.#dispatchRequest("media-exit-pip-request", trigger);
  }
  /**
   * Notify the media player that a seeking process is happening and to seek to the given `time`.
   */
  seeking(time, trigger) {
    this.#dispatchRequest("media-seeking-request", trigger, time);
  }
  /**
   * Notify the media player that a seeking operation has completed and to seek to the given `time`.
   * This is generally called after a series of `remote.seeking()` calls.
   */
  seek(time, trigger) {
    this.#dispatchRequest("media-seek-request", trigger, time);
  }
  seekToLiveEdge(trigger) {
    this.#dispatchRequest("media-live-edge-request", trigger);
  }
  /**
   * Dispatch a request to update the length of the media in seconds.
   *
   * @example
   * ```ts
   * remote.changeDuration(100); // 100 seconds
   * ```
   */
  changeDuration(duration, trigger) {
    this.#dispatchRequest("media-duration-change-request", trigger, duration);
  }
  /**
   * Dispatch a request to update the clip start time. This is the time at which media playback
   * should start at.
   *
   * @example
   * ```ts
   * remote.changeClipStart(100); // start at 100 seconds
   * ```
   */
  changeClipStart(startTime, trigger) {
    this.#dispatchRequest("media-clip-start-change-request", trigger, startTime);
  }
  /**
   * Dispatch a request to update the clip end time. This is the time at which media playback
   * should end at.
   *
   * @example
   * ```ts
   * remote.changeClipEnd(100); // end at 100 seconds
   * ```
   */
  changeClipEnd(endTime, trigger) {
    this.#dispatchRequest("media-clip-end-change-request", trigger, endTime);
  }
  /**
   * Dispatch a request to update the media volume to the given `volume` level which is a value
   * between 0 and 1.
   *
   * @docs {@link https://www.vidstack.io/docs/player/api/audio-gain#remote-control}
   * @example
   * ```ts
   * remote.changeVolume(0); // 0%
   * remote.changeVolume(0.05); // 5%
   * remote.changeVolume(0.5); // 50%
   * remote.changeVolume(0.75); // 70%
   * remote.changeVolume(1); // 100%
   * ```
   */
  changeVolume(volume, trigger) {
    this.#dispatchRequest("media-volume-change-request", trigger, Math.max(0, Math.min(1, volume)));
  }
  /**
   * Dispatch a request to change the current audio track.
   *
   * @example
   * ```ts
   * remote.changeAudioTrack(1); // track at index 1
   * ```
   */
  changeAudioTrack(index, trigger) {
    this.#dispatchRequest("media-audio-track-change-request", trigger, index);
  }
  /**
   * Dispatch a request to change the video quality. The special value `-1` represents auto quality
   * selection.
   *
   * @example
   * ```ts
   * remote.changeQuality(-1); // auto
   * remote.changeQuality(1); // quality at index 1
   * ```
   */
  changeQuality(index, trigger) {
    this.#dispatchRequest("media-quality-change-request", trigger, index);
  }
  /**
   * Request auto quality selection.
   */
  requestAutoQuality(trigger) {
    this.changeQuality(-1, trigger);
  }
  /**
   * Dispatch a request to change the mode of the text track at the given index.
   *
   * @example
   * ```ts
   * remote.changeTextTrackMode(1, 'showing'); // track at index 1
   * ```
   */
  changeTextTrackMode(index, mode, trigger) {
    this.#dispatchRequest("media-text-track-change-request", trigger, {
      index,
      mode
    });
  }
  /**
   * Dispatch a request to change the media playback rate.
   *
   * @example
   * ```ts
   * remote.changePlaybackRate(0.5); // Half the normal speed
   * remote.changePlaybackRate(1); // Normal speed
   * remote.changePlaybackRate(1.5); // 50% faster than normal
   * remote.changePlaybackRate(2); // Double the normal speed
   * ```
   */
  changePlaybackRate(rate, trigger) {
    this.#dispatchRequest("media-rate-change-request", trigger, rate);
  }
  /**
   * Dispatch a request to change the media audio gain.
   *
   * @example
   * ```ts
   * remote.changeAudioGain(1); // Disable audio gain
   * remote.changeAudioGain(1.5); // 50% louder
   * remote.changeAudioGain(2); // 100% louder
   * ```
   */
  changeAudioGain(gain, trigger) {
    this.#dispatchRequest("media-audio-gain-change-request", trigger, gain);
  }
  /**
   * Dispatch a request to resume idle tracking on controls.
   */
  resumeControls(trigger) {
    this.#dispatchRequest("media-resume-controls-request", trigger);
  }
  /**
   * Dispatch a request to pause controls idle tracking. Pausing tracking will result in the
   * controls being visible until `remote.resumeControls()` is called. This method
   * is generally used when building custom controls and you'd like to prevent the UI from
   * disappearing.
   *
   * @example
   * ```ts
   * // Prevent controls hiding while menu is being interacted with.
   * function onSettingsOpen() {
   *   remote.pauseControls();
   * }
   *
   * function onSettingsClose() {
   *   remote.resumeControls();
   * }
   * ```
   */
  pauseControls(trigger) {
    this.#dispatchRequest("media-pause-controls-request", trigger);
  }
  /**
   * Dispatch a request to toggle the media playback state.
   */
  togglePaused(trigger) {
    const player = this.getPlayer(trigger?.target);
    if (!player) {
      this.#noPlayerWarning(this.togglePaused.name);
      return;
    }
    if (player.state.paused) this.play(trigger);
    else this.pause(trigger);
  }
  /**
   * Dispatch a request to toggle the controls visibility.
   */
  toggleControls(trigger) {
    const player = this.getPlayer(trigger?.target);
    if (!player) {
      this.#noPlayerWarning(this.toggleControls.name);
      return;
    }
    if (!player.controls.showing) {
      player.controls.show(0, trigger);
    } else {
      player.controls.hide(0, trigger);
    }
  }
  /**
   * Dispatch a request to toggle the media muted state.
   */
  toggleMuted(trigger) {
    const player = this.getPlayer(trigger?.target);
    if (!player) {
      this.#noPlayerWarning(this.toggleMuted.name);
      return;
    }
    if (player.state.muted) this.unmute(trigger);
    else this.mute(trigger);
  }
  /**
   * Dispatch a request to toggle the media fullscreen state.
   *
   * @docs {@link https://www.vidstack.io/docs/player/api/fullscreen#remote-control}
   */
  toggleFullscreen(target, trigger) {
    const player = this.getPlayer(trigger?.target);
    if (!player) {
      this.#noPlayerWarning(this.toggleFullscreen.name);
      return;
    }
    if (player.state.fullscreen) this.exitFullscreen(target, trigger);
    else this.enterFullscreen(target, trigger);
  }
  /**
   * Dispatch a request to toggle the media picture-in-picture mode.
   *
   * @docs {@link https://www.vidstack.io/docs/player/api/picture-in-picture#remote-control}
   */
  togglePictureInPicture(trigger) {
    const player = this.getPlayer(trigger?.target);
    if (!player) {
      this.#noPlayerWarning(this.togglePictureInPicture.name);
      return;
    }
    if (player.state.pictureInPicture) this.exitPictureInPicture(trigger);
    else this.enterPictureInPicture(trigger);
  }
  /**
   * Show captions.
   */
  showCaptions(trigger) {
    const player = this.getPlayer(trigger?.target);
    if (!player) {
      this.#noPlayerWarning(this.showCaptions.name);
      return;
    }
    let tracks = player.state.textTracks, index = this.#prevTrackIndex;
    if (!tracks[index] || !isTrackCaptionKind(tracks[index])) {
      index = -1;
    }
    if (index === -1) {
      index = tracks.findIndex((track) => isTrackCaptionKind(track) && track.default);
    }
    if (index === -1) {
      index = tracks.findIndex((track) => isTrackCaptionKind(track));
    }
    if (index >= 0) this.changeTextTrackMode(index, "showing", trigger);
    this.#prevTrackIndex = -1;
  }
  /**
   * Turn captions off.
   */
  disableCaptions(trigger) {
    const player = this.getPlayer(trigger?.target);
    if (!player) {
      this.#noPlayerWarning(this.disableCaptions.name);
      return;
    }
    const tracks = player.state.textTracks, track = player.state.textTrack;
    if (track) {
      const index = tracks.indexOf(track);
      this.changeTextTrackMode(index, "disabled", trigger);
      this.#prevTrackIndex = index;
    }
  }
  /**
   * Dispatch a request to toggle the current captions mode.
   */
  toggleCaptions(trigger) {
    const player = this.getPlayer(trigger?.target);
    if (!player) {
      this.#noPlayerWarning(this.toggleCaptions.name);
      return;
    }
    if (player.state.textTrack) {
      this.disableCaptions();
    } else {
      this.showCaptions();
    }
  }
  userPrefersLoopChange(prefersLoop, trigger) {
    this.#dispatchRequest("media-user-loop-change-request", trigger, prefersLoop);
  }
  #dispatchRequest(type, trigger, detail) {
    const request = new _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.DOMEvent(type, {
      bubbles: true,
      composed: true,
      cancelable: true,
      detail,
      trigger
    });
    let target = trigger?.target || null;
    if (target && target instanceof _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.Component) target = target.el;
    const shouldUsePlayer = !target || target === document || target === window || target === document.body || this.#player?.el && target instanceof Node && !this.#player.el.contains(target);
    target = shouldUsePlayer ? this.#target ?? this.getPlayer()?.el : target ?? this.#target;
    {
      this.#logger?.debugGroup(`\u{1F4E8} dispatching \`${type}\``).labelledLog("Target", target).labelledLog("Player", this.#player).labelledLog("Request Event", request).labelledLog("Trigger Event", trigger).dispatch();
    }
    if (this.#player) {
      if (type === "media-play-request" && !this.#player.state.canLoad) {
        target?.dispatchEvent(request);
      } else {
        this.#player.canPlayQueue.enqueue(type, () => target?.dispatchEvent(request));
      }
    } else {
      target?.dispatchEvent(request);
    }
  }
  #noPlayerWarning(method) {
    {
      console.warn(
        `[vidstack] attempted to call \`MediaRemoteControl.${method}\`() that requires player but failed because remote could not find a parent player element from target`
      );
    }
  }
}

class LocalMediaStorage {
  playerId = "vds-player";
  mediaId = null;
  #data = {
    volume: null,
    muted: null,
    audioGain: null,
    time: null,
    lang: null,
    captions: null,
    rate: null,
    quality: null
  };
  async getVolume() {
    return this.#data.volume;
  }
  async setVolume(volume) {
    this.#data.volume = volume;
    this.save();
  }
  async getMuted() {
    return this.#data.muted;
  }
  async setMuted(muted) {
    this.#data.muted = muted;
    this.save();
  }
  async getTime() {
    return this.#data.time;
  }
  async setTime(time, ended) {
    const shouldClear = time < 0;
    this.#data.time = !shouldClear ? time : null;
    if (shouldClear || ended) this.saveTime();
    else this.saveTimeThrottled();
  }
  async getLang() {
    return this.#data.lang;
  }
  async setLang(lang) {
    this.#data.lang = lang;
    this.save();
  }
  async getCaptions() {
    return this.#data.captions;
  }
  async setCaptions(enabled) {
    this.#data.captions = enabled;
    this.save();
  }
  async getPlaybackRate() {
    return this.#data.rate;
  }
  async setPlaybackRate(rate) {
    this.#data.rate = rate;
    this.save();
  }
  async getAudioGain() {
    return this.#data.audioGain;
  }
  async setAudioGain(gain) {
    this.#data.audioGain = gain;
    this.save();
  }
  async getVideoQuality() {
    return this.#data.quality;
  }
  async setVideoQuality(quality) {
    this.#data.quality = quality;
    this.save();
  }
  onChange(src, mediaId, playerId = "vds-player") {
    const savedData = playerId ? localStorage.getItem(playerId) : null, savedTime = mediaId ? localStorage.getItem(mediaId) : null;
    this.playerId = playerId;
    this.mediaId = mediaId;
    this.#data = {
      volume: null,
      muted: null,
      audioGain: null,
      lang: null,
      captions: null,
      rate: null,
      quality: null,
      ...savedData ? JSON.parse(savedData) : {},
      time: savedTime ? +savedTime : null
    };
  }
  save() {
    if (IS_SERVER || !this.playerId) return;
    const data = JSON.stringify({ ...this.#data, time: void 0 });
    localStorage.setItem(this.playerId, data);
  }
  saveTimeThrottled = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.functionThrottle)(this.saveTime.bind(this), 1e3);
  saveTime() {
    if (IS_SERVER || !this.mediaId) return;
    const data = (this.#data.time ?? 0).toString();
    localStorage.setItem(this.mediaId, data);
  }
}

const ADD = Symbol("LIST_ADD" ), REMOVE = Symbol("LIST_REMOVE" ), RESET = Symbol("LIST_RESET" ), SELECT = Symbol("LIST_SELECT" ), READONLY = Symbol("LIST_READONLY" ), SET_READONLY = Symbol("LIST_SET_READONLY" ), ON_RESET = Symbol("LIST_ON_RESET" ), ON_REMOVE = Symbol("LIST_ON_REMOVE" ), ON_USER_SELECT = Symbol("LIST_ON_USER_SELECT" );
const ListSymbol = {
  add: ADD,
  remove: REMOVE,
  reset: RESET,
  select: SELECT,
  readonly: READONLY,
  setReadonly: SET_READONLY,
  onReset: ON_RESET,
  onRemove: ON_REMOVE,
  onUserSelect: ON_USER_SELECT
};

class List extends _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.EventsTarget {
  items = [];
  /** @internal */
  [ListSymbol.readonly] = false;
  get length() {
    return this.items.length;
  }
  get readonly() {
    return this[ListSymbol.readonly];
  }
  /**
   * Returns the index of the first occurrence of the given item, or -1 if it is not present.
   */
  indexOf(item) {
    return this.items.indexOf(item);
  }
  /**
   * Returns an item matching the given `id`, or `null` if not present.
   */
  getById(id) {
    if (id === "") return null;
    return this.items.find((item) => item.id === id) ?? null;
  }
  /**
   * Transform list to an array.
   */
  toArray() {
    return [...this.items];
  }
  [Symbol.iterator]() {
    return this.items.values();
  }
  /** @internal */
  [ListSymbol.add](item, trigger) {
    const index = this.items.length;
    if (!("" + index in this)) {
      Object.defineProperty(this, index, {
        get() {
          return this.items[index];
        }
      });
    }
    if (this.items.includes(item)) return;
    this.items.push(item);
    this.dispatchEvent(new _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.DOMEvent("add", { detail: item, trigger }));
  }
  /** @internal */
  [ListSymbol.remove](item, trigger) {
    const index = this.items.indexOf(item);
    if (index >= 0) {
      this[ListSymbol.onRemove]?.(item, trigger);
      this.items.splice(index, 1);
      this.dispatchEvent(new _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.DOMEvent("remove", { detail: item, trigger }));
    }
  }
  /** @internal */
  [ListSymbol.reset](trigger) {
    for (const item of [...this.items]) this[ListSymbol.remove](item, trigger);
    this.items = [];
    this[ListSymbol.setReadonly](false, trigger);
    this[ListSymbol.onReset]?.();
  }
  /** @internal */
  [ListSymbol.setReadonly](readonly, trigger) {
    if (this[ListSymbol.readonly] === readonly) return;
    this[ListSymbol.readonly] = readonly;
    this.dispatchEvent(new _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.DOMEvent("readonly-change", { detail: readonly, trigger }));
  }
}

const SELECTED = Symbol("SELECTED" );
class SelectList extends List {
  get selected() {
    return this.items.find((item) => item.selected) ?? null;
  }
  get selectedIndex() {
    return this.items.findIndex((item) => item.selected);
  }
  /** @internal */
  [ListSymbol.onRemove](item, trigger) {
    this[ListSymbol.select](item, false, trigger);
  }
  /** @internal */
  [ListSymbol.add](item, trigger) {
    item[SELECTED] = false;
    Object.defineProperty(item, "selected", {
      get() {
        return this[SELECTED];
      },
      set: (selected) => {
        if (this.readonly) return;
        this[ListSymbol.onUserSelect]?.();
        this[ListSymbol.select](item, selected);
      }
    });
    super[ListSymbol.add](item, trigger);
  }
  /** @internal */
  [ListSymbol.select](item, selected, trigger) {
    if (selected === item?.[SELECTED]) return;
    const prev = this.selected;
    if (item) item[SELECTED] = selected;
    const changed = !selected ? prev === item : prev !== item;
    if (changed) {
      if (prev) prev[SELECTED] = false;
      this.dispatchEvent(
        new _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.DOMEvent("change", {
          detail: {
            prev,
            current: this.selected
          },
          trigger
        })
      );
    }
  }
}

class AudioTrackList extends SelectList {
}

function round(num, decimalPlaces = 2) {
  return Number(num.toFixed(decimalPlaces));
}
function getNumberOfDecimalPlaces(num) {
  return String(num).split(".")[1]?.length ?? 0;
}
function clampNumber(min, value, max) {
  return Math.max(min, Math.min(max, value));
}

function isEventInside(el, event) {
  const target = event.composedPath()[0];
  return (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isDOMNode)(target) && el.contains(target);
}
const rafJobs = /* @__PURE__ */ new Set();
if (!IS_SERVER) {
  let processJobs = function() {
    for (const job of rafJobs) {
      try {
        job();
      } catch (e) {
        console.error(`[vidstack] failed job:

${e}`);
      }
    }
    window.requestAnimationFrame(processJobs);
  };
  processJobs();
}
function scheduleRafJob(job) {
  rafJobs.add(job);
  return () => rafJobs.delete(job);
}
function setAttributeIfEmpty(target, name, value) {
  if (!target.hasAttribute(name)) target.setAttribute(name, value);
}
function setARIALabel(target, $label) {
  if (target.hasAttribute("aria-label") || target.hasAttribute("data-no-label")) return;
  if (!(0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isFunction)($label)) {
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.setAttribute)(target, "aria-label", $label);
    return;
  }
  function updateAriaDescription() {
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.setAttribute)(target, "aria-label", $label());
  }
  if (IS_SERVER) updateAriaDescription();
  else (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(updateAriaDescription);
}
function isElementVisible(el) {
  const style = getComputedStyle(el);
  return style.display !== "none" && parseInt(style.opacity) > 0;
}
function checkVisibility(el) {
  return !!el && ("checkVisibility" in el ? el.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true }) : isElementVisible(el));
}
function observeVisibility(el, callback) {
  return scheduleRafJob(() => callback(checkVisibility(el)));
}
function isElementParent(owner, node, test) {
  while (node) {
    if (node === owner) {
      return true;
    } else if (test?.(node)) {
      break;
    } else {
      node = node.parentElement;
    }
  }
  return false;
}
function onPress(target, handler) {
  return new _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.EventsController(target).add("pointerup", (event) => {
    if (event.button === 0 && !event.defaultPrevented) handler(event);
  }).add("keydown", (event) => {
    if ((0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isKeyboardClick)(event)) handler(event);
  });
}
function isTouchPinchEvent(event) {
  return (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isTouchEvent)(event) && (event.touches.length > 1 || event.changedTouches.length > 1);
}
function requestScopedAnimationFrame(callback) {
  if (IS_SERVER) return callback();
  let scope = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.getScope)(), id = window.requestAnimationFrame(() => {
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.scoped)(callback, scope);
    id = -1;
  });
  return () => void window.cancelAnimationFrame(id);
}
function autoPlacement(el, trigger, placement, {
  offsetVarName,
  xOffset,
  yOffset,
  ...options
}) {
  if (!el) return;
  const floatingPlacement = placement.replace(" ", "-").replace("-center", "");
  (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.setStyle)(el, "visibility", !trigger ? "hidden" : null);
  if (!trigger) return;
  let isTop = placement.includes("top");
  const negateX = (x) => placement.includes("left") ? `calc(-1 * ${x})` : x, negateY = (y) => isTop ? `calc(-1 * ${y})` : y;
  return (0,_floating_ui_dom__WEBPACK_IMPORTED_MODULE_2__.autoUpdate)(trigger, el, () => {
    (0,_floating_ui_dom__WEBPACK_IMPORTED_MODULE_2__.computePosition)(trigger, el, {
      placement: floatingPlacement,
      middleware: [
        ...options.middleware ?? [],
        (0,_floating_ui_dom__WEBPACK_IMPORTED_MODULE_2__.flip)({ fallbackAxisSideDirection: "start", crossAxis: false }),
        (0,_floating_ui_dom__WEBPACK_IMPORTED_MODULE_2__.shift)()
      ],
      ...options
    }).then(({ x, y, middlewareData }) => {
      const hasFlipped = !!middlewareData.flip?.index;
      isTop = placement.includes(hasFlipped ? "bottom" : "top");
      el.setAttribute(
        "data-placement",
        hasFlipped ? placement.startsWith("top") ? placement.replace("top", "bottom") : placement.replace("bottom", "top") : placement
      );
      Object.assign(el.style, {
        top: `calc(${y + "px"} + ${negateY(
          yOffset ? yOffset + "px" : `var(--${offsetVarName}-y-offset, 0px)`
        )})`,
        left: `calc(${x + "px"} + ${negateX(
          xOffset ? xOffset + "px" : `var(--${offsetVarName}-x-offset, 0px)`
        )})`
      });
    });
  });
}
function hasAnimation(el) {
  const styles = getComputedStyle(el);
  return styles.animationName !== "none";
}
function isHTMLElement(el) {
  return el instanceof HTMLElement;
}

class NativeTextRenderer {
  priority = 0;
  #display = true;
  #video = null;
  #track = null;
  #tracks = /* @__PURE__ */ new Set();
  canRender(_, video) {
    return !!video;
  }
  attach(video) {
    this.#video = video;
    if (video) video.textTracks.onchange = this.#onChange.bind(this);
  }
  addTrack(track) {
    this.#tracks.add(track);
    this.#attachTrack(track);
  }
  removeTrack(track) {
    track[TextTrackSymbol.native]?.remove?.();
    track[TextTrackSymbol.native] = null;
    this.#tracks.delete(track);
  }
  changeTrack(track) {
    const current = track?.[TextTrackSymbol.native];
    if (current && current.track.mode !== "showing") {
      current.track.mode = "showing";
    }
    this.#track = track;
  }
  setDisplay(display) {
    this.#display = display;
    this.#onChange();
  }
  detach() {
    if (this.#video) this.#video.textTracks.onchange = null;
    for (const track of this.#tracks) this.removeTrack(track);
    this.#tracks.clear();
    this.#video = null;
    this.#track = null;
  }
  #attachTrack(track) {
    if (!this.#video) return;
    const el = track[TextTrackSymbol.native] ??= this.#createTrackElement(track);
    if (isHTMLElement(el)) {
      this.#video.append(el);
      el.track.mode = el.default ? "showing" : "disabled";
    }
  }
  #createTrackElement(track) {
    const el = document.createElement("track"), isDefault = track.default || track.mode === "showing", isSupported = track.src && track.type === "vtt";
    el.id = track.id;
    el.src = isSupported ? track.src : "";
    el.label = track.label;
    el.kind = track.kind;
    el.default = isDefault;
    track.language && (el.srclang = track.language);
    if (isDefault && !isSupported) {
      this.#copyCues(track, el.track);
    }
    return el;
  }
  #copyCues(track, native) {
    if (track.src && track.type === "vtt" || native.cues?.length) return;
    for (const cue of track.cues) native.addCue(cue);
  }
  #onChange(event) {
    for (const track of this.#tracks) {
      const native = track[TextTrackSymbol.native];
      if (!native) continue;
      if (!this.#display) {
        native.track.mode = native.managed ? "hidden" : "disabled";
        continue;
      }
      const isShowing = native.track.mode === "showing";
      if (isShowing) this.#copyCues(track, native.track);
      track.setMode(isShowing ? "showing" : "disabled", event);
    }
  }
}

class TextRenderers {
  #video = null;
  #textTracks;
  #renderers = [];
  #media;
  #nativeDisplay = false;
  #nativeRenderer = null;
  #customRenderer = null;
  constructor(media) {
    this.#media = media;
    const textTracks = media.textTracks;
    this.#textTracks = textTracks;
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#watchControls.bind(this));
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.onDispose)(this.#detach.bind(this));
    new _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.EventsController(textTracks).add("add", this.#onAddTrack.bind(this)).add("remove", this.#onRemoveTrack.bind(this)).add("mode-change", this.#update.bind(this));
  }
  #watchControls() {
    const { nativeControls } = this.#media.$state;
    this.#nativeDisplay = nativeControls();
    this.#update();
  }
  add(renderer) {
    this.#renderers.push(renderer);
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.untrack)(this.#update.bind(this));
  }
  remove(renderer) {
    renderer.detach();
    this.#renderers.splice(this.#renderers.indexOf(renderer), 1);
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.untrack)(this.#update.bind(this));
  }
  /** @internal */
  attachVideo(video) {
    requestAnimationFrame(() => {
      this.#video = video;
      if (video) {
        this.#nativeRenderer = new NativeTextRenderer();
        this.#nativeRenderer.attach(video);
        for (const track of this.#textTracks) this.#addNativeTrack(track);
      }
      this.#update();
    });
  }
  #addNativeTrack(track) {
    if (!isTrackCaptionKind(track)) return;
    this.#nativeRenderer?.addTrack(track);
  }
  #removeNativeTrack(track) {
    if (!isTrackCaptionKind(track)) return;
    this.#nativeRenderer?.removeTrack(track);
  }
  #onAddTrack(event) {
    this.#addNativeTrack(event.detail);
  }
  #onRemoveTrack(event) {
    this.#removeNativeTrack(event.detail);
  }
  #update() {
    const currentTrack = this.#textTracks.selected;
    if (this.#video && (this.#nativeDisplay || currentTrack?.[TextTrackSymbol.nativeHLS])) {
      this.#customRenderer?.changeTrack(null);
      this.#nativeRenderer?.setDisplay(true);
      this.#nativeRenderer?.changeTrack(currentTrack);
      return;
    }
    this.#nativeRenderer?.setDisplay(false);
    this.#nativeRenderer?.changeTrack(null);
    if (!currentTrack) {
      this.#customRenderer?.changeTrack(null);
      return;
    }
    const customRenderer = this.#renderers.sort((a, b) => a.priority - b.priority).find((renderer) => renderer.canRender(currentTrack, this.#video));
    if (this.#customRenderer !== customRenderer) {
      this.#customRenderer?.detach();
      customRenderer?.attach(this.#video);
      this.#customRenderer = customRenderer ?? null;
    }
    customRenderer?.changeTrack(currentTrack);
  }
  #detach() {
    this.#nativeRenderer?.detach();
    this.#nativeRenderer = null;
    this.#customRenderer?.detach();
    this.#customRenderer = null;
  }
}

class TextTrackList extends List {
  #canLoad = false;
  #defaults = {};
  #storage = null;
  #preferredLang = null;
  /** @internal */
  [TextTrackSymbol.crossOrigin];
  constructor() {
    super();
  }
  get selected() {
    const track = this.items.find((t) => t.mode === "showing" && isTrackCaptionKind(t));
    return track ?? null;
  }
  get selectedIndex() {
    const selected = this.selected;
    return selected ? this.indexOf(selected) : -1;
  }
  get preferredLang() {
    return this.#preferredLang;
  }
  set preferredLang(lang) {
    this.#preferredLang = lang;
    this.#saveLang(lang);
  }
  add(init, trigger) {
    const isTrack = init instanceof TextTrack, track = isTrack ? init : new TextTrack(init), kind = init.kind === "captions" || init.kind === "subtitles" ? "captions" : init.kind;
    if (this.#defaults[kind] && init.default) delete init.default;
    track.addEventListener("mode-change", this.#onTrackModeChangeBind);
    this[ListSymbol.add](track, trigger);
    track[TextTrackSymbol.crossOrigin] = this[TextTrackSymbol.crossOrigin];
    if (this.#canLoad) track[TextTrackSymbol.canLoad]();
    if (init.default) this.#defaults[kind] = track;
    this.#selectTracks();
    return this;
  }
  remove(track, trigger) {
    this.#pendingRemoval = track;
    if (!this.items.includes(track)) return;
    if (track === this.#defaults[track.kind]) delete this.#defaults[track.kind];
    track.mode = "disabled";
    track[TextTrackSymbol.onModeChange] = null;
    track.removeEventListener("mode-change", this.#onTrackModeChangeBind);
    this[ListSymbol.remove](track, trigger);
    this.#pendingRemoval = null;
    return this;
  }
  clear(trigger) {
    for (const track of [...this.items]) {
      this.remove(track, trigger);
    }
    return this;
  }
  getByKind(kind) {
    const kinds = Array.isArray(kind) ? kind : [kind];
    return this.items.filter((track) => kinds.includes(track.kind));
  }
  /** @internal */
  [TextTrackSymbol.canLoad]() {
    if (this.#canLoad) return;
    for (const track of this.items) track[TextTrackSymbol.canLoad]();
    this.#canLoad = true;
    this.#selectTracks();
  }
  #selectTracks = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.functionDebounce)(async () => {
    if (!this.#canLoad) return;
    if (!this.#preferredLang && this.#storage) {
      this.#preferredLang = await this.#storage.getLang();
    }
    const showCaptions = await this.#storage?.getCaptions(), kinds = [
      ["captions", "subtitles"],
      "chapters",
      "descriptions",
      "metadata"
    ];
    for (const kind of kinds) {
      const tracks = this.getByKind(kind);
      if (tracks.find((t) => t.mode === "showing")) continue;
      const preferredTrack = this.#preferredLang ? tracks.find((track2) => track2.language === this.#preferredLang) : null;
      const defaultTrack = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isArray)(kind) ? this.#defaults[kind.find((kind2) => this.#defaults[kind2]) || ""] : this.#defaults[kind];
      const track = preferredTrack ?? defaultTrack, isCaptionsKind = track && isTrackCaptionKind(track);
      if (track && (!isCaptionsKind || showCaptions !== false)) {
        track.mode = "showing";
        if (isCaptionsKind) this.#saveCaptionsTrack(track);
      }
    }
  }, 300);
  #pendingRemoval = null;
  #onTrackModeChangeBind = this.#onTrackModeChange.bind(this);
  #onTrackModeChange(event) {
    const track = event.detail;
    if (this.#storage && isTrackCaptionKind(track) && track !== this.#pendingRemoval) {
      this.#saveCaptionsTrack(track);
    }
    if (track.mode === "showing") {
      const kinds = isTrackCaptionKind(track) ? ["captions", "subtitles"] : [track.kind];
      for (const t of this.items) {
        if (t.mode === "showing" && t != track && kinds.includes(t.kind)) {
          t.mode = "disabled";
        }
      }
    }
    this.dispatchEvent(
      new _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.DOMEvent("mode-change", {
        detail: event.detail,
        trigger: event
      })
    );
  }
  #saveCaptionsTrack(track) {
    if (track.mode !== "disabled") {
      this.#saveLang(track.language);
    }
    this.#storage?.setCaptions?.(track.mode === "showing");
  }
  #saveLang(lang) {
    this.#storage?.setLang?.(this.#preferredLang = lang);
  }
  setStorage(storage) {
    this.#storage = storage;
  }
}

const SET_AUTO = Symbol("SET_AUTO_QUALITY" ), ENABLE_AUTO = Symbol("ENABLE_AUTO_QUALITY" );
const QualitySymbol = {
  setAuto: SET_AUTO,
  enableAuto: ENABLE_AUTO
};

class VideoQualityList extends SelectList {
  #auto = false;
  /**
   * Configures quality switching:
   *
   * - `current`: Trigger an immediate quality level switch. This will abort the current fragment
   * request if any, flush the whole buffer, and fetch fragment matching with current position
   * and requested quality level.
   *
   * - `next`: Trigger a quality level switch for next fragment. This could eventually flush
   * already buffered next fragment.
   *
   * - `load`: Set quality level for next loaded fragment.
   *
   * @see {@link https://www.vidstack.io/docs/player/api/video-quality#switch}
   * @see {@link https://github.com/video-dev/hls.js/blob/master/docs/API.md#quality-switch-control-api}
   */
  switch = "current";
  /**
   * Whether automatic quality selection is enabled.
   */
  get auto() {
    return this.#auto || this.readonly;
  }
  /** @internal */
  [QualitySymbol.enableAuto];
  /** @internal */
  [ListSymbol.onUserSelect]() {
    this[QualitySymbol.setAuto](false);
  }
  /** @internal */
  [ListSymbol.onReset](trigger) {
    this[QualitySymbol.enableAuto] = void 0;
    this[QualitySymbol.setAuto](false, trigger);
  }
  /**
   * Request automatic quality selection (if supported). This will be a no-op if the list is
   * `readonly` as that already implies auto-selection.
   */
  autoSelect(trigger) {
    if (this.readonly || this.#auto || !this[QualitySymbol.enableAuto]) return;
    this[QualitySymbol.enableAuto]?.(trigger);
    this[QualitySymbol.setAuto](true, trigger);
  }
  getBySrc(src) {
    return this.items.find((quality) => quality.src === src);
  }
  /** @internal */
  [QualitySymbol.setAuto](auto, trigger) {
    if (this.#auto === auto) return;
    this.#auto = auto;
    this.dispatchEvent(
      new _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.DOMEvent("auto-change", {
        detail: auto,
        trigger
      })
    );
  }
}

function sortVideoQualities(qualities, desc) {
  return [...qualities].sort(desc ? compareVideoQualityDesc : compareVideoQualityAsc);
}
function compareVideoQualityAsc(a, b) {
  return a.height === b.height ? (a.bitrate ?? 0) - (b.bitrate ?? 0) : a.height - b.height;
}
function compareVideoQualityDesc(a, b) {
  return b.height === a.height ? (b.bitrate ?? 0) - (a.bitrate ?? 0) : b.height - a.height;
}

function isAudioProvider(provider) {
  return provider?.$$PROVIDER_TYPE === "AUDIO";
}
function isVideoProvider(provider) {
  return provider?.$$PROVIDER_TYPE === "VIDEO";
}
function isHLSProvider(provider) {
  return provider?.$$PROVIDER_TYPE === "HLS";
}
function isDASHProvider(provider) {
  return provider?.$$PROVIDER_TYPE === "DASH";
}
function isYouTubeProvider(provider) {
  return provider?.$$PROVIDER_TYPE === "YOUTUBE";
}
function isVimeoProvider(provider) {
  return provider?.$$PROVIDER_TYPE === "VIMEO";
}
function isGoogleCastProvider(provider) {
  return provider?.$$PROVIDER_TYPE === "GOOGLE_CAST";
}
function isHTMLAudioElement(element) {
  return !IS_SERVER && element instanceof HTMLAudioElement;
}
function isHTMLVideoElement(element) {
  return !IS_SERVER && element instanceof HTMLVideoElement;
}
function isHTMLMediaElement(element) {
  return isHTMLAudioElement(element) || isHTMLVideoElement(element);
}
function isHTMLIFrameElement(element) {
  return !IS_SERVER && element instanceof HTMLIFrameElement;
}

class MediaPlayerController extends _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.ViewController {
}

const MEDIA_KEY_SHORTCUTS = {
  togglePaused: "k Space",
  toggleMuted: "m",
  toggleFullscreen: "f",
  togglePictureInPicture: "i",
  toggleCaptions: "c",
  seekBackward: "j J ArrowLeft",
  seekForward: "l L ArrowRight",
  volumeUp: "ArrowUp",
  volumeDown: "ArrowDown",
  speedUp: ">",
  slowDown: "<"
};
const MODIFIER_KEYS = /* @__PURE__ */ new Set(["Shift", "Alt", "Meta", "Ctrl"]), BUTTON_SELECTORS = 'button, [role="button"]', IGNORE_SELECTORS = 'input, textarea, select, [contenteditable], [role^="menuitem"], [role="timer"]';
class MediaKeyboardController extends MediaPlayerController {
  #media;
  constructor(media) {
    super();
    this.#media = media;
  }
  onConnect() {
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#onTargetChange.bind(this));
  }
  #onTargetChange() {
    const { keyDisabled, keyTarget } = this.$props;
    if (keyDisabled()) return;
    const target = keyTarget() === "player" ? this.el : document, $active = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.signal)(false);
    if (target === this.el) {
      new _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.EventsController(this.el).add("focusin", () => $active.set(true)).add("focusout", (event) => {
        if (!this.el.contains(event.target)) $active.set(false);
      });
    } else {
      if (!(0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.peek)($active)) $active.set(document.querySelector("[data-media-player]") === this.el);
      (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.listenEvent)(document, "focusin", (event) => {
        const activePlayer = event.composedPath().find((el) => el instanceof Element && el.localName === "media-player");
        if (activePlayer !== void 0) $active.set(this.el === activePlayer);
      });
    }
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(() => {
      if (!$active()) return;
      new _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.EventsController(target).add("keyup", this.#onKeyUp.bind(this)).add("keydown", this.#onKeyDown.bind(this)).add("keydown", this.#onPreventVideoKeys.bind(this), { capture: true });
    });
  }
  #onKeyUp(event) {
    const focusedEl = document.activeElement;
    if (!event.key || !this.$state.canSeek() || focusedEl?.matches(IGNORE_SELECTORS)) {
      return;
    }
    let { method, value } = this.#getMatchingMethod(event);
    if (!(0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isString)(value) && !(0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isArray)(value)) {
      value?.onKeyUp?.({
        event,
        player: this.#media.player,
        remote: this.#media.remote
      });
      value?.callback?.(event, this.#media.remote);
      return;
    }
    if (method?.startsWith("seek")) {
      event.preventDefault();
      event.stopPropagation();
      if (this.#timeSlider) {
        this.#forwardTimeKeyboardEvent(event, method === "seekForward");
        this.#timeSlider = null;
      } else {
        this.#media.remote.seek(this.#seekTotal, event);
        this.#seekTotal = void 0;
      }
    }
    if (method?.startsWith("volume")) {
      const volumeSlider = this.el.querySelector("[data-media-volume-slider]");
      volumeSlider?.dispatchEvent(
        new KeyboardEvent("keyup", {
          key: method === "volumeUp" ? "Up" : "Down",
          shiftKey: event.shiftKey,
          trigger: event
        })
      );
    }
  }
  #onKeyDown(event) {
    if (!event.key || MODIFIER_KEYS.has(event.key)) return;
    const focusedEl = document.activeElement;
    if (focusedEl?.matches(IGNORE_SELECTORS) || (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isKeyboardClick)(event) && focusedEl?.matches(BUTTON_SELECTORS)) {
      return;
    }
    let { method, value } = this.#getMatchingMethod(event), isNumberPress = !event.metaKey && /^[0-9]$/.test(event.key);
    if (!(0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isString)(value) && !(0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isArray)(value) && !isNumberPress) {
      value?.onKeyDown?.({
        event,
        player: this.#media.player,
        remote: this.#media.remote
      });
      value?.callback?.(event, this.#media.remote);
      return;
    }
    if (!method && isNumberPress && !modifierKeyPressed(event)) {
      event.preventDefault();
      event.stopPropagation();
      this.#media.remote.seek(this.$state.duration() / 10 * Number(event.key), event);
      return;
    }
    if (!method) return;
    event.preventDefault();
    event.stopPropagation();
    switch (method) {
      case "seekForward":
      case "seekBackward":
        this.#seeking(event, method, method === "seekForward");
        break;
      case "volumeUp":
      case "volumeDown":
        const volumeSlider = this.el.querySelector("[data-media-volume-slider]");
        if (volumeSlider) {
          volumeSlider.dispatchEvent(
            new KeyboardEvent("keydown", {
              key: method === "volumeUp" ? "Up" : "Down",
              shiftKey: event.shiftKey,
              trigger: event
            })
          );
        } else {
          const value2 = event.shiftKey ? 0.1 : 0.05;
          this.#media.remote.changeVolume(
            this.$state.volume() + (method === "volumeUp" ? +value2 : -value2),
            event
          );
        }
        break;
      case "toggleFullscreen":
        this.#media.remote.toggleFullscreen("prefer-media", event);
        break;
      case "speedUp":
      case "slowDown":
        const playbackRate = this.$state.playbackRate();
        this.#media.remote.changePlaybackRate(
          Math.max(0.25, Math.min(2, playbackRate + (method === "speedUp" ? 0.25 : -0.25))),
          event
        );
        break;
      default:
        this.#media.remote[method]?.(event);
    }
    this.$state.lastKeyboardAction.set({
      action: method,
      event
    });
  }
  #onPreventVideoKeys(event) {
    if (isHTMLMediaElement(event.target) && this.#getMatchingMethod(event).method) {
      event.preventDefault();
    }
  }
  #getMatchingMethod(event) {
    const keyShortcuts = {
      ...this.$props.keyShortcuts(),
      ...this.#media.ariaKeys
    };
    const method = Object.keys(keyShortcuts).find((method2) => {
      const value = keyShortcuts[method2], keys = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isArray)(value) ? value.join(" ") : (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isString)(value) ? value : value?.keys;
      const combinations = ((0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isArray)(keys) ? keys : keys?.split(" "))?.map(
        (key) => replaceSymbolKeys(key).replace(/Control/g, "Ctrl").split("+")
      );
      return combinations?.some((combo) => {
        const modifierKeys = new Set(combo.filter((key) => MODIFIER_KEYS.has(key)));
        for (const modKey of MODIFIER_KEYS) {
          const modKeyProp = modKey.toLowerCase() + "Key";
          if (!modifierKeys.has(modKey) && event[modKeyProp]) {
            return false;
          }
        }
        return combo.every((key) => {
          return MODIFIER_KEYS.has(key) ? event[key.toLowerCase() + "Key"] : event.key === key.replace("Space", " ");
        });
      });
    });
    return {
      method,
      value: method ? keyShortcuts[method] : null
    };
  }
  #seekTotal;
  #calcSeekAmount(event, type) {
    const seekBy = event.shiftKey ? 10 : 5;
    return this.#seekTotal = Math.max(
      0,
      Math.min(
        (this.#seekTotal ?? this.$state.currentTime()) + (type === "seekForward" ? +seekBy : -seekBy),
        this.$state.duration()
      )
    );
  }
  #timeSlider = null;
  #forwardTimeKeyboardEvent(event, forward) {
    this.#timeSlider?.dispatchEvent(
      new KeyboardEvent(event.type, {
        key: !forward ? "Left" : "Right",
        shiftKey: event.shiftKey,
        trigger: event
      })
    );
  }
  #seeking(event, type, forward) {
    if (!this.$state.canSeek()) return;
    if (!this.#timeSlider) {
      this.#timeSlider = this.el.querySelector("[data-media-time-slider]");
    }
    if (this.#timeSlider) {
      this.#forwardTimeKeyboardEvent(event, forward);
    } else {
      this.#media.remote.seeking(this.#calcSeekAmount(event, type), event);
    }
  }
}
const SYMBOL_KEY_MAP = ["!", "@", "#", "$", "%", "^", "&", "*", "(", ")"];
function replaceSymbolKeys(key) {
  return key.replace(/Shift\+(\d)/g, (_, num) => SYMBOL_KEY_MAP[num - 1]);
}
function modifierKeyPressed(event) {
  for (const key of MODIFIER_KEYS) {
    if (event[key.toLowerCase() + "Key"]) {
      return true;
    }
  }
  return false;
}

class ARIAKeyShortcuts extends _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.ViewController {
  #shortcut;
  constructor(shortcut) {
    super();
    this.#shortcut = shortcut;
  }
  onAttach(el) {
    const { $props, ariaKeys } = useMediaContext(), keys = el.getAttribute("aria-keyshortcuts");
    if (keys) {
      ariaKeys[this.#shortcut] = keys;
      if (!IS_SERVER) {
        (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.onDispose)(() => {
          delete ariaKeys[this.#shortcut];
        });
      }
      return;
    }
    const shortcuts = $props.keyShortcuts()[this.#shortcut];
    if (shortcuts) {
      const keys2 = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isArray)(shortcuts) ? shortcuts.join(" ") : (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isString)(shortcuts) ? shortcuts : shortcuts?.keys;
      el.setAttribute("aria-keyshortcuts", (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isArray)(keys2) ? keys2.join(" ") : keys2);
    }
  }
}

class MediaControls extends MediaPlayerController {
  #idleTimer = -2;
  #pausedTracking = false;
  #hideOnMouseLeave = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.signal)(false);
  #isMouseOutside = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.signal)(false);
  #focusedItem = null;
  #canIdle = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.signal)(true);
  /**
   * The default amount of delay in milliseconds while media playback is progressing without user
   * activity to indicate an idle state (i.e., hide controls).
   *
   * @defaultValue 2000
   */
  defaultDelay = 2e3;
  /**
   * Whether controls can hide after a delay in user interaction. If this is false, controls will
   * not hide and be user controlled.
   */
  get canIdle() {
    return this.#canIdle();
  }
  set canIdle(canIdle) {
    this.#canIdle.set(canIdle);
  }
  /**
   * Whether controls visibility should be toggled when the mouse enters and leaves the player
   * container.
   *
   * @defaultValue false
   */
  get hideOnMouseLeave() {
    const { hideControlsOnMouseLeave } = this.$props;
    return this.#hideOnMouseLeave() || hideControlsOnMouseLeave();
  }
  set hideOnMouseLeave(hide) {
    this.#hideOnMouseLeave.set(hide);
  }
  /**
   * Whether media controls are currently visible.
   */
  get showing() {
    return this.$state.controlsVisible();
  }
  /**
   * Show controls.
   */
  show(delay = 0, trigger) {
    this.#clearIdleTimer();
    if (!this.#pausedTracking) {
      this.#changeVisibility(true, delay, trigger);
    }
  }
  /**
   * Hide controls.
   */
  hide(delay = this.defaultDelay, trigger) {
    this.#clearIdleTimer();
    if (!this.#pausedTracking) {
      this.#changeVisibility(false, delay, trigger);
    }
  }
  /**
   * Whether all idle tracking on controls should be paused until resumed again.
   */
  pause(trigger) {
    this.#pausedTracking = true;
    this.#clearIdleTimer();
    this.#changeVisibility(true, 0, trigger);
  }
  resume(trigger) {
    this.#pausedTracking = false;
    if (this.$state.paused()) return;
    this.#changeVisibility(false, this.defaultDelay, trigger);
  }
  onConnect() {
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#init.bind(this));
  }
  #init() {
    const { viewType } = this.$state;
    if (!this.el || !this.#canIdle()) return;
    if (viewType() === "audio") {
      this.show();
      return;
    }
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#watchMouse.bind(this));
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#watchPaused.bind(this));
    const onPlay = this.#onPlay.bind(this), onPause = this.#onPause.bind(this), onEnd = this.#onEnd.bind(this);
    new _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.EventsController(this.el).add("can-play", (event) => this.show(0, event)).add("play", onPlay).add("pause", onPause).add("end", onEnd).add("auto-play-fail", onPause);
  }
  #watchMouse() {
    if (!this.el) return;
    const { started, pointer, paused } = this.$state;
    if (!started() || pointer() !== "fine") return;
    const events = new _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.EventsController(this.el), shouldHideOnMouseLeave = this.hideOnMouseLeave;
    if (!shouldHideOnMouseLeave || !this.#isMouseOutside()) {
      (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(() => {
        if (!paused()) events.add("pointermove", this.#onStopIdle.bind(this));
      });
    }
    if (shouldHideOnMouseLeave) {
      events.add("mouseenter", this.#onMouseEnter.bind(this)).add("mouseleave", this.#onMouseLeave.bind(this));
    }
  }
  #watchPaused() {
    const { paused, started, autoPlayError } = this.$state;
    if (paused() || autoPlayError() && !started()) return;
    const onStopIdle = this.#onStopIdle.bind(this);
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(() => {
      if (!this.el) return;
      const pointer = this.$state.pointer(), isTouch = pointer === "coarse", events = new _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.EventsController(this.el), eventTypes = [isTouch ? "touchend" : "pointerup", "keydown"];
      for (const eventType of eventTypes) {
        events.add(eventType, onStopIdle, { passive: false });
      }
    });
  }
  #onPlay(event) {
    if (event.triggers.hasType("ended")) return;
    this.show(0, event);
    this.hide(void 0, event);
  }
  #onPause(event) {
    this.show(0, event);
  }
  #onEnd(event) {
    const { loop } = this.$state;
    if (loop()) this.hide(0, event);
  }
  #onMouseEnter(event) {
    this.#isMouseOutside.set(false);
    this.show(0, event);
    this.hide(void 0, event);
  }
  #onMouseLeave(event) {
    this.#isMouseOutside.set(true);
    this.hide(0, event);
  }
  #clearIdleTimer() {
    window.clearTimeout(this.#idleTimer);
    this.#idleTimer = -1;
  }
  #onStopIdle(event) {
    if (
      // @ts-expect-error
      event.MEDIA_GESTURE || this.#pausedTracking || isTouchPinchEvent(event)
    ) {
      return;
    }
    if ((0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isKeyboardEvent)(event)) {
      if (event.key === "Escape") {
        this.el?.focus();
        this.#focusedItem = null;
      } else if (this.#focusedItem) {
        event.preventDefault();
        requestAnimationFrame(() => {
          this.#focusedItem?.focus();
          this.#focusedItem = null;
        });
      }
    }
    this.show(0, event);
    this.hide(this.defaultDelay, event);
  }
  #changeVisibility(visible, delay, trigger) {
    if (delay === 0) {
      this.#onChange(visible, trigger);
      return;
    }
    this.#idleTimer = window.setTimeout(() => {
      if (!this.scope) return;
      this.#onChange(visible && !this.#pausedTracking, trigger);
    }, delay);
  }
  #onChange(visible, trigger) {
    if (this.$state.controlsVisible() === visible) return;
    this.$state.controlsVisible.set(visible);
    if (!visible && document.activeElement && this.el?.contains(document.activeElement)) {
      this.#focusedItem = document.activeElement;
      requestAnimationFrame(() => {
        this.el?.focus({ preventScroll: true });
      });
    }
    this.dispatch("controls-change", {
      detail: visible,
      trigger
    });
  }
}

const CAN_FULLSCREEN = _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.fscreen.fullscreenEnabled;
class FullscreenController extends _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.ViewController {
  /**
   * Tracks whether we're the active fullscreen event listener. Fullscreen events can only be
   * listened to globally on the document so we need to know if they relate to the current host
   * element or not.
   */
  #listening = false;
  #active = false;
  get active() {
    return this.#active;
  }
  get supported() {
    return CAN_FULLSCREEN;
  }
  onConnect() {
    new _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.EventsController(_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.fscreen).add("fullscreenchange", this.#onChange.bind(this)).add("fullscreenerror", this.#onError.bind(this));
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.onDispose)(this.#onDisconnect.bind(this));
  }
  async #onDisconnect() {
    if (CAN_FULLSCREEN) await this.exit();
  }
  #onChange(event) {
    const active = isFullscreen(this.el);
    if (active === this.#active) return;
    if (!active) this.#listening = false;
    this.#active = active;
    this.dispatch("fullscreen-change", { detail: active, trigger: event });
  }
  #onError(event) {
    if (!this.#listening) return;
    this.dispatch("fullscreen-error", { detail: null, trigger: event });
    this.#listening = false;
  }
  async enter() {
    try {
      this.#listening = true;
      if (!this.el || isFullscreen(this.el)) return;
      assertFullscreenAPI();
      return _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.fscreen.requestFullscreen(this.el);
    } catch (error) {
      this.#listening = false;
      throw error;
    }
  }
  async exit() {
    if (!this.el || !isFullscreen(this.el)) return;
    assertFullscreenAPI();
    return _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.fscreen.exitFullscreen();
  }
}
function canFullscreen() {
  return CAN_FULLSCREEN;
}
function isFullscreen(host) {
  if (_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.fscreen.fullscreenElement === host) return true;
  try {
    return host.matches(
      // @ts-expect-error - `fullscreenPseudoClass` is missing from `@types/fscreen`.
      _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.fscreen.fullscreenPseudoClass
    );
  } catch (error) {
    return false;
  }
}
function assertFullscreenAPI() {
  if (CAN_FULLSCREEN) return;
  throw Error(
    "[vidstack] fullscreen API is not enabled or supported in this environment" 
  );
}

class ScreenOrientationController extends _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.ViewController {
  #type = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.signal)(this.#getScreenOrientation());
  #locked = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.signal)(false);
  #currentLock;
  /**
   * The current screen orientation type.
   *
   * @signal
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/ScreenOrientation}
   * @see https://w3c.github.io/screen-orientation/#screen-orientation-types-and-locks
   */
  get type() {
    return this.#type();
  }
  /**
   * Whether the screen orientation is currently locked.
   *
   * @signal
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/ScreenOrientation}
   * @see https://w3c.github.io/screen-orientation/#screen-orientation-types-and-locks
   */
  get locked() {
    return this.#locked();
  }
  /**
   * Whether the viewport is in a portrait orientation.
   *
   * @signal
   */
  get portrait() {
    return this.#type().startsWith("portrait");
  }
  /**
   * Whether the viewport is in a landscape orientation.
   *
   * @signal
   */
  get landscape() {
    return this.#type().startsWith("landscape");
  }
  /**
   * Whether the native Screen Orientation API is available.
   */
  static supported = canOrientScreen();
  /**
   * Whether the native Screen Orientation API is available.
   */
  get supported() {
    return ScreenOrientationController.supported;
  }
  onConnect() {
    if (this.supported) {
      (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.listenEvent)(screen.orientation, "change", this.#onOrientationChange.bind(this));
    } else {
      const query = window.matchMedia("(orientation: landscape)");
      query.onchange = this.#onOrientationChange.bind(this);
      (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.onDispose)(() => query.onchange = null);
    }
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.onDispose)(this.#onDisconnect.bind(this));
  }
  async #onDisconnect() {
    if (this.supported && this.#locked()) await this.unlock();
  }
  #onOrientationChange(event) {
    this.#type.set(this.#getScreenOrientation());
    this.dispatch("orientation-change", {
      detail: {
        orientation: (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.peek)(this.#type),
        lock: this.#currentLock
      },
      trigger: event
    });
  }
  /**
   * Locks the orientation of the screen to the desired orientation type using the
   * Screen Orientation API.
   *
   * @param lockType - The screen lock orientation type.
   * @throws Error - If screen orientation API is unavailable.
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Screen/orientation}
   * @see {@link https://w3c.github.io/screen-orientation}
   */
  async lock(lockType) {
    if ((0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.peek)(this.#locked) || this.#currentLock === lockType) return;
    this.#assertScreenOrientationAPI();
    await screen.orientation.lock(lockType);
    this.#locked.set(true);
    this.#currentLock = lockType;
  }
  /**
   * Unlocks the orientation of the screen to it's default state using the Screen Orientation
   * API. This method will throw an error if the API is unavailable.
   *
   * @throws Error - If screen orientation API is unavailable.
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Screen/orientation}
   * @see {@link https://w3c.github.io/screen-orientation}
   */
  async unlock() {
    if (!(0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.peek)(this.#locked)) return;
    this.#assertScreenOrientationAPI();
    this.#currentLock = void 0;
    await screen.orientation.unlock();
    this.#locked.set(false);
  }
  #assertScreenOrientationAPI() {
    if (this.supported) return;
    throw Error(
      "[vidstack] screen orientation API is not available" 
    );
  }
  #getScreenOrientation() {
    if (IS_SERVER) return "portrait-primary";
    if (this.supported) return window.screen.orientation.type;
    return window.innerWidth >= window.innerHeight ? "landscape-primary" : "portrait-primary";
  }
}

class AudioProviderLoader {
  name = "audio";
  target;
  canPlay(src) {
    if (!isAudioSrc(src)) return false;
    return IS_SERVER || !(0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isString)(src.src) || src.type === "?" || canPlayAudioType(this.target, src.type);
  }
  mediaType() {
    return "audio";
  }
  async load(ctx) {
    if (IS_SERVER) {
      throw Error("[vidstack] can not load audio provider server-side");
    }
    if (!this.target) {
      throw Error(
        "[vidstack] `<audio>` element was not found - did you forget to include `<media-provider>`?"
      );
    }
    return new (await __webpack_require__.e(/*! import() */ "node_modules_vidstack_react_dev_chunks_vidstack-CnCZVzrO_js").then(__webpack_require__.bind(__webpack_require__, /*! ./vidstack-CnCZVzrO.js */ "./node_modules/@vidstack/react/dev/chunks/vidstack-CnCZVzrO.js"))).AudioProvider(this.target, ctx);
  }
}

class VideoProviderLoader {
  name = "video";
  target;
  canPlay(src) {
    if (!isVideoSrc(src)) return false;
    return IS_SERVER || !(0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isString)(src.src) || src.type === "?" || canPlayVideoType(this.target, src.type);
  }
  mediaType() {
    return "video";
  }
  async load(ctx) {
    if (IS_SERVER) {
      throw Error("[vidstack] can not load video provider server-side");
    }
    if (!this.target) {
      throw Error(
        "[vidstack] `<video>` element was not found - did you forget to include media provider?"
      );
    }
    return new (await Promise.resolve().then(function () { return provider$1; })).VideoProvider(this.target, ctx);
  }
}

class HLSProviderLoader extends VideoProviderLoader {
  static supported = isHLSSupported();
  name = "hls";
  canPlay(src) {
    return HLSProviderLoader.supported && isHLSSrc(src);
  }
  async load(context) {
    if (IS_SERVER) {
      throw Error("[vidstack] can not load hls provider server-side");
    }
    if (!this.target) {
      throw Error(
        "[vidstack] `<video>` element was not found - did you forget to include `<media-provider>`?"
      );
    }
    return new (await __webpack_require__.e(/*! import() */ "vendors-node_modules_vidstack_react_dev_chunks_vidstack-3ZPG_odG_js").then(__webpack_require__.bind(__webpack_require__, /*! ./vidstack-3ZPG_odG.js */ "./node_modules/@vidstack/react/dev/chunks/vidstack-3ZPG_odG.js"))).HLSProvider(this.target, context);
  }
}

let audioContext = null, gainNodes = [], elAudioSources = [];
function getOrCreateAudioCtx() {
  return audioContext ??= new AudioContext();
}
function createGainNode() {
  const audioCtx = getOrCreateAudioCtx(), gainNode = audioCtx.createGain();
  gainNode.connect(audioCtx.destination);
  gainNodes.push(gainNode);
  return gainNode;
}
function createElementSource(el, gainNode) {
  const audioCtx = getOrCreateAudioCtx(), src = audioCtx.createMediaElementSource(el);
  if (gainNode) {
    src.connect(gainNode);
  }
  elAudioSources.push(src);
  return src;
}
function destroyGainNode(node) {
  const idx = gainNodes.indexOf(node);
  if (idx !== -1) {
    gainNodes.splice(idx, 1);
    node.disconnect();
    freeAudioCtxWhenAllResourcesFreed();
  }
}
function destroyElementSource(src) {
  const idx = elAudioSources.indexOf(src);
  if (idx !== -1) {
    elAudioSources.splice(idx, 1);
    src.disconnect();
    freeAudioCtxWhenAllResourcesFreed();
  }
}
function freeAudioCtxWhenAllResourcesFreed() {
  if (audioContext && gainNodes.length === 0 && elAudioSources.length === 0) {
    audioContext.close().then(() => {
      audioContext = null;
    });
  }
}

class AudioGain {
  #media;
  #onChange;
  #gainNode = null;
  #srcAudioNode = null;
  get currentGain() {
    return this.#gainNode?.gain?.value ?? null;
  }
  get supported() {
    return true;
  }
  constructor(media, onChange) {
    this.#media = media;
    this.#onChange = onChange;
  }
  setGain(gain) {
    const currGain = this.currentGain;
    if (gain === this.currentGain) {
      return;
    }
    if (gain === 1 && currGain !== 1) {
      this.removeGain();
      return;
    }
    if (!this.#gainNode) {
      this.#gainNode = createGainNode();
      if (this.#srcAudioNode) {
        this.#srcAudioNode.connect(this.#gainNode);
      }
    }
    if (!this.#srcAudioNode) {
      this.#srcAudioNode = createElementSource(this.#media, this.#gainNode);
    }
    this.#gainNode.gain.value = gain;
    this.#onChange(gain);
  }
  removeGain() {
    if (!this.#gainNode) return;
    if (this.#srcAudioNode) {
      this.#srcAudioNode.connect(getOrCreateAudioCtx().destination);
    }
    this.#destroyGainNode();
    this.#onChange(null);
  }
  destroy() {
    this.#destroySrcNode();
    this.#destroyGainNode();
  }
  #destroySrcNode() {
    if (!this.#srcAudioNode) return;
    try {
      destroyElementSource(this.#srcAudioNode);
    } catch (e) {
    } finally {
      this.#srcAudioNode = null;
    }
  }
  #destroyGainNode() {
    if (!this.#gainNode) return;
    try {
      destroyGainNode(this.#gainNode);
    } catch (e) {
    } finally {
      this.#gainNode = null;
    }
  }
}

const PAGE_EVENTS = ["focus", "blur", "visibilitychange", "pageshow", "pagehide"];
class PageVisibility {
  #state = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.signal)(determinePageState());
  #visibility = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.signal)(IS_SERVER ? "visible" : document.visibilityState);
  #safariBeforeUnloadTimeout;
  connect() {
    const events = new _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.EventsController(window), handlePageEvent = this.#handlePageEvent.bind(this);
    for (const eventType of PAGE_EVENTS) {
      events.add(eventType, handlePageEvent);
    }
    if (IS_SAFARI) {
      events.add("beforeunload", (event) => {
        this.#safariBeforeUnloadTimeout = setTimeout(() => {
          if (!(event.defaultPrevented || event.returnValue.length > 0)) {
            this.#state.set("hidden");
            this.#visibility.set("hidden");
          }
        }, 0);
      });
    }
  }
  /**
   * The current page state. Important to note we only account for a subset of page states, as
   * the rest aren't valuable to the player at the moment.
   *
   * - **active:** A page is in the active state if it is visible and has input focus.
   * - **passive:** A page is in the passive state if it is visible and does not have input focus.
   * - **hidden:** A page is in the hidden state if it is not visible.
   *
   * @see https://developers.google.com/web/updates/2018/07/page-lifecycle-api#states
   */
  get pageState() {
    return this.#state();
  }
  /**
   * The current document visibility state.
   *
   * - **visible:** The page content may be at least partially visible. In practice, this means that
   * the page is the foreground tab of a non-minimized window.
   * - **hidden:** The page content is not visible to the user. In practice this means that the
   * document is either a background tab or part of a minimized window, or the OS screen lock is
   * active.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilityState
   */
  get visibility() {
    return this.#visibility();
  }
  #handlePageEvent(event) {
    if (IS_SAFARI) window.clearTimeout(this.#safariBeforeUnloadTimeout);
    if (event.type !== "blur" || this.#state() === "active") {
      this.#state.set(determinePageState(event));
      this.#visibility.set(document.visibilityState == "hidden" ? "hidden" : "visible");
    }
  }
}
function determinePageState(event) {
  if (IS_SERVER) return "hidden";
  if (event?.type === "blur" || document.visibilityState === "hidden") return "hidden";
  if (document.hasFocus()) return "active";
  return "passive";
}

class RAFLoop {
  #id;
  #callback;
  constructor(callback) {
    this.#callback = callback;
  }
  start() {
    if (!(0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isUndefined)(this.#id)) return;
    this.#loop();
  }
  stop() {
    if ((0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isNumber)(this.#id)) window.cancelAnimationFrame(this.#id);
    this.#id = void 0;
  }
  #loop() {
    this.#id = window.requestAnimationFrame(() => {
      if ((0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isUndefined)(this.#id)) return;
      this.#callback();
      this.#loop();
    });
  }
}

class HTMLMediaEvents {
  #provider;
  #ctx;
  #waiting = false;
  #attachedLoadStart = false;
  #attachedCanPlay = false;
  #timeRAF = new RAFLoop(this.#onAnimationFrame.bind(this));
  #pageVisibility = new PageVisibility();
  #events;
  get #media() {
    return this.#provider.media;
  }
  constructor(provider, ctx) {
    this.#provider = provider;
    this.#ctx = ctx;
    this.#events = new _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.EventsController(provider.media);
    this.#attachInitialListeners();
    this.#pageVisibility.connect();
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#attachTimeUpdate.bind(this));
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.onDispose)(this.#onDispose.bind(this));
  }
  #onDispose() {
    this.#attachedLoadStart = false;
    this.#attachedCanPlay = false;
    this.#timeRAF.stop();
    this.#events.abort();
    this.#devHandlers?.clear();
  }
  /**
   * The `timeupdate` event fires surprisingly infrequently during playback, meaning your progress
   * bar (or whatever else is synced to the currentTime) moves in a choppy fashion. This helps
   * resolve that by retrieving time updates in a request animation frame loop.
   */
  #lastSeenTime = 0;
  #seekedTo = -1;
  #onAnimationFrame() {
    const newTime = this.#media.currentTime;
    const didStutter = IS_SAFARI && newTime - this.#seekedTo < 0.35;
    if (!didStutter && this.#lastSeenTime !== newTime) {
      this.#updateCurrentTime(newTime);
      this.#lastSeenTime = newTime;
    }
  }
  #attachInitialListeners() {
    {
      this.#ctx.logger?.info("attaching initial listeners");
    }
    this.#attachEventListener("loadstart", this.#onLoadStart);
    this.#attachEventListener("abort", this.#onAbort);
    this.#attachEventListener("emptied", this.#onEmptied);
    this.#attachEventListener("error", this.#onError);
    this.#attachEventListener("volumechange", this.#onVolumeChange);
    this.#ctx.logger?.debug("attached initial media event listeners");
  }
  #attachLoadStartListeners() {
    if (this.#attachedLoadStart) return;
    {
      this.#ctx.logger?.info("attaching load start listeners");
    }
    this.#attachEventListener("loadeddata", this.#onLoadedData);
    this.#attachEventListener("loadedmetadata", this.#onLoadedMetadata);
    this.#attachEventListener("canplay", this.#onCanPlay);
    this.#attachEventListener("canplaythrough", this.#onCanPlayThrough);
    this.#attachEventListener("durationchange", this.#onDurationChange);
    this.#attachEventListener("play", this.#onPlay);
    this.#attachEventListener("progress", this.#onProgress);
    this.#attachEventListener("stalled", this.#onStalled);
    this.#attachEventListener("suspend", this.#onSuspend);
    this.#attachEventListener("ratechange", this.#onRateChange);
    this.#attachedLoadStart = true;
  }
  #attachCanPlayListeners() {
    if (this.#attachedCanPlay) return;
    {
      this.#ctx.logger?.info("attaching can play listeners");
    }
    this.#attachEventListener("pause", this.#onPause);
    this.#attachEventListener("playing", this.#onPlaying);
    this.#attachEventListener("seeked", this.#onSeeked);
    this.#attachEventListener("seeking", this.#onSeeking);
    this.#attachEventListener("ended", this.#onEnded);
    this.#attachEventListener("waiting", this.#onWaiting);
    this.#attachedCanPlay = true;
  }
  #devHandlers = /* @__PURE__ */ new Map() ;
  #handleDevEvent = this.#onDevEvent.bind(this) ;
  #attachEventListener(eventType, handler) {
    this.#devHandlers.set(eventType, handler);
    this.#events.add(eventType, this.#handleDevEvent );
  }
  #onDevEvent(event2) {
    this.#ctx.logger?.debugGroup(`\u{1F4FA} provider fired \`${event2.type}\``).labelledLog("Provider", this.#provider).labelledLog("Event", event2).labelledLog("Media Store", { ...this.#ctx.$state }).dispatch();
    this.#devHandlers.get(event2.type)?.call(this, event2);
  }
  #updateCurrentTime(time, trigger) {
    const newTime = Math.min(time, this.#ctx.$state.seekableEnd());
    this.#ctx.notify("time-change", newTime, trigger);
  }
  #onLoadStart(event2) {
    if (this.#media.networkState === 3) {
      this.#onAbort(event2);
      return;
    }
    this.#attachLoadStartListeners();
    this.#ctx.notify("load-start", void 0, event2);
  }
  #onAbort(event2) {
    this.#ctx.notify("abort", void 0, event2);
  }
  #onEmptied() {
    this.#ctx.notify("emptied", void 0, event);
  }
  #onLoadedData(event2) {
    this.#ctx.notify("loaded-data", void 0, event2);
  }
  #onLoadedMetadata(event2) {
    this.#lastSeenTime = 0;
    this.#seekedTo = -1;
    this.#attachCanPlayListeners();
    this.#ctx.notify("loaded-metadata", void 0, event2);
    if (IS_IOS || IS_SAFARI && isHLSSrc(this.#ctx.$state.source())) {
      this.#ctx.delegate.ready(this.#getCanPlayDetail(), event2);
    }
  }
  #getCanPlayDetail() {
    return {
      provider: (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.peek)(this.#ctx.$provider),
      duration: this.#media.duration,
      buffered: this.#media.buffered,
      seekable: this.#media.seekable
    };
  }
  #onPlay(event2) {
    if (!this.#ctx.$state.canPlay) return;
    this.#ctx.notify("play", void 0, event2);
  }
  #onPause(event2) {
    if (this.#media.readyState === 1 && !this.#waiting) return;
    this.#waiting = false;
    this.#timeRAF.stop();
    this.#ctx.notify("pause", void 0, event2);
  }
  #onCanPlay(event2) {
    this.#ctx.delegate.ready(this.#getCanPlayDetail(), event2);
  }
  #onCanPlayThrough(event2) {
    if (this.#ctx.$state.started()) return;
    this.#ctx.notify("can-play-through", this.#getCanPlayDetail(), event2);
  }
  #onPlaying(event2) {
    if (this.#media.paused) return;
    this.#waiting = false;
    this.#ctx.notify("playing", void 0, event2);
    this.#timeRAF.start();
  }
  #onStalled(event2) {
    this.#ctx.notify("stalled", void 0, event2);
    if (this.#media.readyState < 3) {
      this.#waiting = true;
      this.#ctx.notify("waiting", void 0, event2);
    }
  }
  #onWaiting(event2) {
    if (this.#media.readyState < 3) {
      this.#waiting = true;
      this.#ctx.notify("waiting", void 0, event2);
    }
  }
  #onEnded(event2) {
    this.#timeRAF.stop();
    this.#updateCurrentTime(this.#media.duration, event2);
    this.#ctx.notify("end", void 0, event2);
    if (this.#ctx.$state.loop()) {
      const hasCustomControls = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isNil)(this.#media.controls);
      if (hasCustomControls) this.#media.controls = false;
    }
  }
  #attachTimeUpdate() {
    const isPaused = this.#ctx.$state.paused(), isPageHidden = this.#pageVisibility.visibility === "hidden", shouldListenToTimeUpdates = isPaused || isPageHidden;
    if (shouldListenToTimeUpdates) {
      (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.listenEvent)(this.#media, "timeupdate", this.#onTimeUpdate.bind(this));
    }
  }
  #onTimeUpdate(event2) {
    this.#updateCurrentTime(this.#media.currentTime, event2);
  }
  #onDurationChange(event2) {
    if (this.#ctx.$state.ended()) {
      this.#updateCurrentTime(this.#media.duration, event2);
    }
    this.#ctx.notify("duration-change", this.#media.duration, event2);
  }
  #onVolumeChange(event2) {
    const detail = {
      volume: this.#media.volume,
      muted: this.#media.muted
    };
    this.#ctx.notify("volume-change", detail, event2);
  }
  #onSeeked(event2) {
    this.#seekedTo = this.#media.currentTime;
    this.#updateCurrentTime(this.#media.currentTime, event2);
    this.#ctx.notify("seeked", this.#media.currentTime, event2);
    if (Math.trunc(this.#media.currentTime) === Math.trunc(this.#media.duration) && getNumberOfDecimalPlaces(this.#media.duration) > getNumberOfDecimalPlaces(this.#media.currentTime)) {
      this.#updateCurrentTime(this.#media.duration, event2);
      if (!this.#media.ended) {
        this.#ctx.player.dispatch(
          new _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.DOMEvent("media-play-request", {
            trigger: event2
          })
        );
      }
    }
  }
  #onSeeking(event2) {
    this.#ctx.notify("seeking", this.#media.currentTime, event2);
  }
  #onProgress(event2) {
    const detail = {
      buffered: this.#media.buffered,
      seekable: this.#media.seekable
    };
    this.#ctx.notify("progress", detail, event2);
  }
  #onSuspend(event2) {
    this.#ctx.notify("suspend", void 0, event2);
  }
  #onRateChange(event2) {
    this.#ctx.notify("rate-change", this.#media.playbackRate, event2);
  }
  #onError(event2) {
    const error = this.#media.error;
    if (!error) return;
    const detail = {
      message: error.message,
      code: error.code,
      mediaError: error
    };
    this.#ctx.notify("error", detail, event2);
  }
}

class NativeAudioTracks {
  #provider;
  #ctx;
  get #nativeTracks() {
    return this.#provider.media.audioTracks;
  }
  constructor(provider, ctx) {
    this.#provider = provider;
    this.#ctx = ctx;
    this.#nativeTracks.onaddtrack = this.#onAddNativeTrack.bind(this);
    this.#nativeTracks.onremovetrack = this.#onRemoveNativeTrack.bind(this);
    this.#nativeTracks.onchange = this.#onChangeNativeTrack.bind(this);
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.listenEvent)(this.#ctx.audioTracks, "change", this.#onChangeTrack.bind(this));
  }
  #onAddNativeTrack(event) {
    const nativeTrack = event.track;
    if (nativeTrack.label === "") return;
    const id = nativeTrack.id.toString() || `native-audio-${this.#ctx.audioTracks.length}`, audioTrack = {
      id,
      label: nativeTrack.label,
      language: nativeTrack.language,
      kind: nativeTrack.kind,
      selected: false
    };
    this.#ctx.audioTracks[ListSymbol.add](audioTrack, event);
    if (nativeTrack.enabled) audioTrack.selected = true;
  }
  #onRemoveNativeTrack(event) {
    const track = this.#ctx.audioTracks.getById(event.track.id);
    if (track) this.#ctx.audioTracks[ListSymbol.remove](track, event);
  }
  #onChangeNativeTrack(event) {
    let enabledTrack = this.#getEnabledNativeTrack();
    if (!enabledTrack) return;
    const track = this.#ctx.audioTracks.getById(enabledTrack.id);
    if (track) this.#ctx.audioTracks[ListSymbol.select](track, true, event);
  }
  #getEnabledNativeTrack() {
    return Array.from(this.#nativeTracks).find((track) => track.enabled);
  }
  #onChangeTrack(event) {
    const { current } = event.detail;
    if (!current) return;
    const track = this.#nativeTracks.getTrackById(current.id);
    if (track) {
      const prev = this.#getEnabledNativeTrack();
      if (prev) prev.enabled = false;
      track.enabled = true;
    }
  }
}

class HTMLMediaProvider {
  constructor(media, ctx) {
    this.media = media;
    this.ctx = ctx;
    this.audioGain = new AudioGain(media, (gain) => {
      this.ctx.notify("audio-gain-change", gain);
    });
  }
  scope = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.createScope)();
  currentSrc = null;
  audioGain;
  setup() {
    new HTMLMediaEvents(this, this.ctx);
    if ("audioTracks" in this.media) new NativeAudioTracks(this, this.ctx);
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.onDispose)(() => {
      this.audioGain.destroy();
      this.media.srcObject = null;
      this.media.removeAttribute("src");
      for (const source of this.media.querySelectorAll("source")) source.remove();
      this.media.load();
    });
  }
  get type() {
    return "";
  }
  setPlaybackRate(rate) {
    this.media.playbackRate = rate;
  }
  async play() {
    return this.media.play();
  }
  async pause() {
    return this.media.pause();
  }
  setMuted(muted) {
    this.media.muted = muted;
  }
  setVolume(volume) {
    this.media.volume = volume;
  }
  setCurrentTime(time) {
    this.media.currentTime = time;
  }
  setPlaysInline(inline) {
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.setAttribute)(this.media, "playsinline", inline);
  }
  async loadSource({ src, type }, preload) {
    this.media.preload = preload || "";
    if (isMediaStream(src)) {
      this.removeSource();
      this.media.srcObject = src;
    } else {
      this.media.srcObject = null;
      if ((0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isString)(src)) {
        if (type !== "?") {
          this.appendSource({ src, type });
        } else {
          this.removeSource();
          this.media.src = this.#appendMediaFragment(src);
        }
      } else {
        this.removeSource();
        this.media.src = window.URL.createObjectURL(src);
      }
    }
    this.media.load();
    this.currentSrc = { src, type };
  }
  /**
   * Append source so it works when requesting AirPlay since hls.js will remove it.
   */
  appendSource(src, defaultType) {
    const prevSource = this.media.querySelector("source[data-vds]"), source = prevSource ?? document.createElement("source");
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.setAttribute)(source, "src", this.#appendMediaFragment(src.src));
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.setAttribute)(source, "type", src.type !== "?" ? src.type : defaultType);
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.setAttribute)(source, "data-vds", "");
    if (!prevSource) this.media.append(source);
  }
  removeSource() {
    this.media.querySelector("source[data-vds]")?.remove();
  }
  #appendMediaFragment(src) {
    const { clipStartTime, clipEndTime } = this.ctx.$state, startTime = clipStartTime(), endTime = clipEndTime();
    if (startTime > 0 && endTime > 0) {
      return `${src}#t=${startTime},${endTime}`;
    } else if (startTime > 0) {
      return `${src}#t=${startTime}`;
    } else if (endTime > 0) {
      return `${src}#t=0,${endTime}`;
    }
    return src;
  }
}

class HTMLRemotePlaybackAdapter {
  #media;
  #ctx;
  #state;
  #supported = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.signal)(false);
  get supported() {
    return this.#supported();
  }
  constructor(media, ctx) {
    this.#media = media;
    this.#ctx = ctx;
    this.#setup();
  }
  #setup() {
    if (IS_SERVER || !this.#media?.remote || !this.canPrompt) return;
    this.#media.remote.watchAvailability((available) => {
      this.#supported.set(available);
    }).catch(() => {
      this.#supported.set(false);
    });
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#watchSupported.bind(this));
  }
  #watchSupported() {
    if (!this.#supported()) return;
    const events = ["connecting", "connect", "disconnect"], onStateChange = this.#onStateChange.bind(this);
    onStateChange();
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.listenEvent)(this.#media, "playing", onStateChange);
    const remoteEvents = new _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.EventsController(this.#media.remote);
    for (const type of events) {
      remoteEvents.add(type, onStateChange);
    }
  }
  async prompt() {
    if (!this.supported) throw Error("Not supported on this platform.");
    if (this.type === "airplay" && this.#media.webkitShowPlaybackTargetPicker) {
      return this.#media.webkitShowPlaybackTargetPicker();
    }
    return this.#media.remote.prompt();
  }
  #onStateChange(event) {
    const state = this.#media.remote.state;
    if (state === this.#state) return;
    const detail = { type: this.type, state };
    this.#ctx.notify("remote-playback-change", detail, event);
    this.#state = state;
  }
}
class HTMLAirPlayAdapter extends HTMLRemotePlaybackAdapter {
  type = "airplay";
  get canPrompt() {
    return "WebKitPlaybackTargetAvailabilityEvent" in window;
  }
}

class NativeHLSTextTracks {
  #video;
  #ctx;
  constructor(video, ctx) {
    this.#video = video;
    this.#ctx = ctx;
    video.textTracks.onaddtrack = this.#onAddTrack.bind(this);
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.onDispose)(this.#onDispose.bind(this));
  }
  #onAddTrack(event) {
    const nativeTrack = event.track;
    if (!nativeTrack || findTextTrackElement(this.#video, nativeTrack)) return;
    const track = new TextTrack({
      id: nativeTrack.id,
      kind: nativeTrack.kind,
      label: nativeTrack.label ?? "",
      language: nativeTrack.language,
      type: "vtt"
    });
    track[TextTrackSymbol.native] = { track: nativeTrack };
    track[TextTrackSymbol.readyState] = 2;
    track[TextTrackSymbol.nativeHLS] = true;
    let lastIndex = 0;
    const onCueChange = (event2) => {
      if (!nativeTrack.cues) return;
      for (let i = lastIndex; i < nativeTrack.cues.length; i++) {
        track.addCue(nativeTrack.cues[i], event2);
        lastIndex++;
      }
    };
    onCueChange(event);
    nativeTrack.oncuechange = onCueChange;
    this.#ctx.textTracks.add(track, event);
    track.setMode(nativeTrack.mode, event);
  }
  #onDispose() {
    this.#video.textTracks.onaddtrack = null;
    for (const track of this.#ctx.textTracks) {
      const nativeTrack = track[TextTrackSymbol.native]?.track;
      if (nativeTrack?.oncuechange) nativeTrack.oncuechange = null;
    }
  }
}
function findTextTrackElement(video, track) {
  return Array.from(video.children).find((el) => el.track === track);
}

class VideoPictureInPicture {
  #video;
  #media;
  constructor(video, media) {
    this.#video = video;
    this.#media = media;
    new _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.EventsController(video).add("enterpictureinpicture", this.#onEnter.bind(this)).add("leavepictureinpicture", this.#onExit.bind(this));
  }
  get active() {
    return document.pictureInPictureElement === this.#video;
  }
  get supported() {
    return canUsePictureInPicture(this.#video);
  }
  async enter() {
    return this.#video.requestPictureInPicture();
  }
  exit() {
    return document.exitPictureInPicture();
  }
  #onEnter(event) {
    this.#onChange(true, event);
  }
  #onExit(event) {
    this.#onChange(false, event);
  }
  #onChange = (active, event) => {
    this.#media.notify("picture-in-picture-change", active, event);
  };
}

class VideoPresentation {
  #video;
  #media;
  #mode = "inline";
  get mode() {
    return this.#mode;
  }
  constructor(video, media) {
    this.#video = video;
    this.#media = media;
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.listenEvent)(video, "webkitpresentationmodechanged", this.#onModeChange.bind(this));
  }
  get supported() {
    return canUseVideoPresentation(this.#video);
  }
  async setPresentationMode(mode) {
    if (this.#mode === mode) return;
    this.#video.webkitSetPresentationMode(mode);
  }
  #onModeChange(event) {
    const prevMode = this.#mode;
    this.#mode = this.#video.webkitPresentationMode;
    {
      this.#media.logger?.infoGroup("presentation mode change").labelledLog("Mode", this.#mode).labelledLog("Event", event).dispatch();
    }
    this.#media.player?.dispatch(
      new _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.DOMEvent("video-presentation-change", {
        detail: this.#mode,
        trigger: event
      })
    );
    ["fullscreen", "picture-in-picture"].forEach((type) => {
      if (this.#mode === type || prevMode === type) {
        this.#media.notify(`${type}-change`, this.#mode === type, event);
      }
    });
  }
}
class FullscreenPresentationAdapter {
  #presentation;
  get active() {
    return this.#presentation.mode === "fullscreen";
  }
  get supported() {
    return this.#presentation.supported;
  }
  constructor(presentation) {
    this.#presentation = presentation;
  }
  async enter() {
    this.#presentation.setPresentationMode("fullscreen");
  }
  async exit() {
    this.#presentation.setPresentationMode("inline");
  }
}
class PIPPresentationAdapter {
  #presentation;
  get active() {
    return this.#presentation.mode === "picture-in-picture";
  }
  get supported() {
    return this.#presentation.supported;
  }
  constructor(presentation) {
    this.#presentation = presentation;
  }
  async enter() {
    this.#presentation.setPresentationMode("picture-in-picture");
  }
  async exit() {
    this.#presentation.setPresentationMode("inline");
  }
}

class VideoProvider extends HTMLMediaProvider {
  $$PROVIDER_TYPE = "VIDEO";
  get type() {
    return "video";
  }
  airPlay;
  fullscreen;
  pictureInPicture;
  constructor(video, ctx) {
    super(video, ctx);
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.scoped)(() => {
      this.airPlay = new HTMLAirPlayAdapter(video, ctx);
      if (canUseVideoPresentation(video)) {
        const presentation = new VideoPresentation(video, ctx);
        this.fullscreen = new FullscreenPresentationAdapter(presentation);
        this.pictureInPicture = new PIPPresentationAdapter(presentation);
      } else if (canUsePictureInPicture(video)) {
        this.pictureInPicture = new VideoPictureInPicture(video, ctx);
      }
    }, this.scope);
  }
  setup() {
    super.setup();
    if (canPlayHLSNatively(this.video)) {
      new NativeHLSTextTracks(this.video, this.ctx);
    }
    this.ctx.textRenderers.attachVideo(this.video);
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.onDispose)(() => {
      this.ctx.textRenderers.attachVideo(null);
    });
    if (this.type === "video") this.ctx.notify("provider-setup", this);
  }
  /**
   * The native HTML `<video>` element.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement}
   */
  get video() {
    return this.media;
  }
}

var provider$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  VideoProvider: VideoProvider
});

function getLangName(langCode) {
  try {
    const displayNames = new Intl.DisplayNames(navigator.languages, { type: "language" });
    const languageName = displayNames.of(langCode);
    return languageName ?? null;
  } catch (err) {
    return null;
  }
}

const toDOMEventType = (type) => `dash-${(0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.camelToKebabCase)(type)}`;
class DASHController {
  #video;
  #ctx;
  #instance = null;
  #callbacks = /* @__PURE__ */ new Set();
  #stopLiveSync = null;
  config = {};
  get instance() {
    return this.#instance;
  }
  constructor(video, ctx) {
    this.#video = video;
    this.#ctx = ctx;
  }
  setup(ctor) {
    this.#instance = ctor().create();
    const dispatcher = this.#dispatchDASHEvent.bind(this);
    for (const event of Object.values(ctor.events)) this.#instance.on(event, dispatcher);
    this.#instance.on(ctor.events.ERROR, this.#onError.bind(this));
    for (const callback of this.#callbacks) callback(this.#instance);
    this.#ctx.player.dispatch("dash-instance", {
      detail: this.#instance
    });
    this.#instance.initialize(this.#video, void 0, false);
    this.#instance.updateSettings({
      streaming: {
        text: {
          // Disabling text rendering by dash.
          defaultEnabled: false,
          dispatchForManualRendering: true
        },
        buffer: {
          /// Enables buffer replacement when switching bitrates for faster switching.
          fastSwitchEnabled: true
        }
      },
      ...this.config
    });
    this.#instance.on(ctor.events.FRAGMENT_LOADING_STARTED, this.#onFragmentLoadStart.bind(this));
    this.#instance.on(
      ctor.events.FRAGMENT_LOADING_COMPLETED,
      this.#onFragmentLoadComplete.bind(this)
    );
    this.#instance.on(ctor.events.MANIFEST_LOADED, this.#onManifestLoaded.bind(this));
    this.#instance.on(ctor.events.QUALITY_CHANGE_RENDERED, this.#onQualityChange.bind(this));
    this.#instance.on(ctor.events.TEXT_TRACKS_ADDED, this.#onTextTracksAdded.bind(this));
    this.#instance.on(ctor.events.TRACK_CHANGE_RENDERED, this.#onTrackChange.bind(this));
    this.#ctx.qualities[QualitySymbol.enableAuto] = this.#enableAutoQuality.bind(this);
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.listenEvent)(this.#ctx.qualities, "change", this.#onUserQualityChange.bind(this));
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.listenEvent)(this.#ctx.audioTracks, "change", this.#onUserAudioChange.bind(this));
    this.#stopLiveSync = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#liveSync.bind(this));
  }
  #createDOMEvent(event) {
    return new _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.DOMEvent(toDOMEventType(event.type), { detail: event });
  }
  #liveSync() {
    if (!this.#ctx.$state.live()) return;
    const raf = new RAFLoop(this.#liveSyncPosition.bind(this));
    raf.start();
    return raf.stop.bind(raf);
  }
  #liveSyncPosition() {
    if (!this.#instance) return;
    const position = this.#instance.duration() - this.#instance.time();
    this.#ctx.$state.liveSyncPosition.set(!isNaN(position) ? position : Infinity);
  }
  #dispatchDASHEvent(event) {
    this.#ctx.player?.dispatch(this.#createDOMEvent(event));
  }
  #currentTrack = null;
  #cueTracker = {};
  #onTextFragmentLoaded(event) {
    const native = this.#currentTrack?.[TextTrackSymbol.native], cues = (native?.track).cues;
    if (!native || !cues) return;
    const id = this.#currentTrack.id, startIndex = this.#cueTracker[id] ?? 0, trigger = this.#createDOMEvent(event);
    for (let i = startIndex; i < cues.length; i++) {
      const cue = cues[i];
      if (!cue.positionAlign) cue.positionAlign = "auto";
      this.#currentTrack.addCue(cue, trigger);
    }
    this.#cueTracker[id] = cues.length;
  }
  #onTextTracksAdded(event) {
    if (!this.#instance) return;
    const data = event.tracks, nativeTextTracks = [...this.#video.textTracks].filter((track) => "manualMode" in track), trigger = this.#createDOMEvent(event);
    for (let i = 0; i < nativeTextTracks.length; i++) {
      const textTrackInfo = data[i], nativeTextTrack = nativeTextTracks[i];
      const id = `dash-${textTrackInfo.kind}-${i}`, track = new TextTrack({
        id,
        label: textTrackInfo?.label ?? textTrackInfo.labels.find((t) => t.text)?.text ?? (textTrackInfo?.lang && getLangName(textTrackInfo.lang)) ?? textTrackInfo?.lang ?? void 0,
        language: textTrackInfo.lang ?? void 0,
        kind: textTrackInfo.kind,
        default: textTrackInfo.defaultTrack
      });
      track[TextTrackSymbol.native] = {
        managed: true,
        track: nativeTextTrack
      };
      track[TextTrackSymbol.readyState] = 2;
      track[TextTrackSymbol.onModeChange] = () => {
        if (!this.#instance) return;
        if (track.mode === "showing") {
          this.#instance.setTextTrack(i);
          this.#currentTrack = track;
        } else {
          this.#instance.setTextTrack(-1);
          this.#currentTrack = null;
        }
      };
      this.#ctx.textTracks.add(track, trigger);
    }
  }
  #onTrackChange(event) {
    const { mediaType, newMediaInfo } = event;
    if (mediaType === "audio") {
      const track = this.#ctx.audioTracks.getById(`dash-audio-${newMediaInfo.index}`);
      if (track) {
        const trigger = this.#createDOMEvent(event);
        this.#ctx.audioTracks[ListSymbol.select](track, true, trigger);
      }
    }
  }
  #onQualityChange(event) {
    if (event.mediaType !== "video") return;
    const quality = this.#ctx.qualities[event.newQuality];
    if (quality) {
      const trigger = this.#createDOMEvent(event);
      this.#ctx.qualities[ListSymbol.select](quality, true, trigger);
    }
  }
  #onManifestLoaded(event) {
    if (this.#ctx.$state.canPlay() || !this.#instance) return;
    const { type, mediaPresentationDuration } = event.data, trigger = this.#createDOMEvent(event);
    this.#ctx.notify("stream-type-change", type !== "static" ? "live" : "on-demand", trigger);
    this.#ctx.notify("duration-change", mediaPresentationDuration, trigger);
    this.#ctx.qualities[QualitySymbol.setAuto](true, trigger);
    const media = this.#instance.getVideoElement();
    const videoQualities = this.#instance.getTracksForTypeFromManifest(
      "video",
      event.data
    );
    const supportedVideoMimeType = [...new Set(videoQualities.map((e) => e.mimeType))].find(
      (type2) => type2 && canPlayVideoType(media, type2)
    );
    const videoQuality = videoQualities.filter(
      (track) => supportedVideoMimeType === track.mimeType
    )[0];
    let audioTracks = this.#instance.getTracksForTypeFromManifest(
      "audio",
      event.data
    );
    const supportedAudioMimeType = [...new Set(audioTracks.map((e) => e.mimeType))].find(
      (type2) => type2 && canPlayAudioType(media, type2)
    );
    audioTracks = audioTracks.filter((track) => supportedAudioMimeType === track.mimeType);
    videoQuality.bitrateList.forEach((bitrate, index) => {
      const quality = {
        id: bitrate.id?.toString() ?? `dash-bitrate-${index}`,
        width: bitrate.width ?? 0,
        height: bitrate.height ?? 0,
        bitrate: bitrate.bandwidth ?? 0,
        codec: videoQuality.codec,
        index
      };
      this.#ctx.qualities[ListSymbol.add](quality, trigger);
    });
    if ((0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isNumber)(videoQuality.index)) {
      const quality = this.#ctx.qualities[videoQuality.index];
      if (quality) this.#ctx.qualities[ListSymbol.select](quality, true, trigger);
    }
    audioTracks.forEach((audioTrack, index) => {
      const matchingLabel = audioTrack.labels.find((label2) => {
        return navigator.languages.some((language) => {
          return label2.lang && language.toLowerCase().startsWith(label2.lang.toLowerCase());
        });
      });
      const label = matchingLabel || audioTrack.labels[0];
      const localTrack = {
        id: `dash-audio-${audioTrack?.index}`,
        label: label?.text ?? (audioTrack.lang && getLangName(audioTrack.lang)) ?? audioTrack.lang ?? "",
        language: audioTrack.lang ?? "",
        kind: "main",
        mimeType: audioTrack.mimeType,
        codec: audioTrack.codec,
        index
      };
      this.#ctx.audioTracks[ListSymbol.add](localTrack, trigger);
    });
    media.dispatchEvent(new _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.DOMEvent("canplay", { trigger }));
  }
  #onError(event) {
    const { type: eventType, error: data } = event;
    {
      this.#ctx.logger?.errorGroup(`[vidstack] DASH error \`${data.message}\``).labelledLog("Media Element", this.#video).labelledLog("DASH Instance", this.#instance).labelledLog("Event Type", eventType).labelledLog("Data", data).labelledLog("Src", (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.peek)(this.#ctx.$state.source)).labelledLog("Media Store", { ...this.#ctx.$state }).dispatch();
    }
    switch (data.code) {
      case 27:
        this.#onNetworkError(data);
        break;
      default:
        this.#onFatalError(data);
        break;
    }
  }
  #onFragmentLoadStart() {
    if (this.#retryLoadingTimer >= 0) this.#clearRetryTimer();
  }
  #onFragmentLoadComplete(event) {
    const mediaType = event.mediaType;
    if (mediaType === "text") {
      requestAnimationFrame(this.#onTextFragmentLoaded.bind(this, event));
    }
  }
  #retryLoadingTimer = -1;
  #onNetworkError(error) {
    this.#clearRetryTimer();
    this.#instance?.play();
    this.#retryLoadingTimer = window.setTimeout(() => {
      this.#retryLoadingTimer = -1;
      this.#onFatalError(error);
    }, 5e3);
  }
  #clearRetryTimer() {
    clearTimeout(this.#retryLoadingTimer);
    this.#retryLoadingTimer = -1;
  }
  #onFatalError(error) {
    this.#ctx.notify("error", {
      message: error.message ?? "",
      code: 1,
      error
    });
  }
  #enableAutoQuality() {
    this.#switchAutoBitrate("video", true);
    const { qualities } = this.#ctx;
    this.#instance?.setQualityFor("video", qualities.selectedIndex, true);
  }
  #switchAutoBitrate(type, auto) {
    this.#instance?.updateSettings({
      streaming: { abr: { autoSwitchBitrate: { [type]: auto } } }
    });
  }
  #onUserQualityChange() {
    const { qualities } = this.#ctx;
    if (!this.#instance || qualities.auto || !qualities.selected) return;
    this.#switchAutoBitrate("video", false);
    this.#instance.setQualityFor("video", qualities.selectedIndex, qualities.switch === "current");
    if (IS_CHROME) {
      this.#video.currentTime = this.#video.currentTime;
    }
  }
  #onUserAudioChange() {
    if (!this.#instance) return;
    const { audioTracks } = this.#ctx, selectedTrack = this.#instance.getTracksFor("audio").find(
      (track) => audioTracks.selected && audioTracks.selected.id === `dash-audio-${track.index}`
    );
    if (selectedTrack) this.#instance.setCurrentTrack(selectedTrack);
  }
  #reset() {
    this.#clearRetryTimer();
    this.#currentTrack = null;
    this.#cueTracker = {};
  }
  onInstance(callback) {
    this.#callbacks.add(callback);
    return () => this.#callbacks.delete(callback);
  }
  loadSource(src) {
    this.#reset();
    if (!(0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isString)(src.src)) return;
    this.#instance?.attachSource(src.src);
  }
  destroy() {
    this.#reset();
    this.#instance?.destroy();
    this.#instance = null;
    this.#stopLiveSync?.();
    this.#stopLiveSync = null;
    this.#ctx?.logger?.info("\u{1F3D7}\uFE0F Destroyed DASH instance");
  }
}

function coerceToError(error) {
  return error instanceof Error ? error : Error(typeof error === "string" ? error : JSON.stringify(error));
}
function assert(condition, message) {
  if (!condition) {
    throw Error(message || "Assertion failed.");
  }
}

class DASHLibLoader {
  #lib;
  #ctx;
  #callback;
  constructor(lib, ctx, callback) {
    this.#lib = lib;
    this.#ctx = ctx;
    this.#callback = callback;
    this.#startLoading();
  }
  async #startLoading() {
    this.#ctx.logger?.info("\u{1F3D7}\uFE0F Loading DASH Library");
    const callbacks = {
      onLoadStart: this.#onLoadStart.bind(this),
      onLoaded: this.#onLoaded.bind(this),
      onLoadError: this.#onLoadError.bind(this)
    };
    let ctor = await loadDASHScript(this.#lib, callbacks);
    if ((0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isUndefined)(ctor) && !(0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isString)(this.#lib)) ctor = await importDASH(this.#lib, callbacks);
    if (!ctor) return null;
    if (!window.dashjs.supportsMediaSource()) {
      const message = "[vidstack] `dash.js` is not supported in this environment";
      this.#ctx.logger?.error(message);
      this.#ctx.player.dispatch(new _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.DOMEvent("dash-unsupported"));
      this.#ctx.notify("error", { message, code: 4 });
      return null;
    }
    return ctor;
  }
  #onLoadStart() {
    {
      this.#ctx.logger?.infoGroup("Starting to load `dash.js`").labelledLog("URL", this.#lib).dispatch();
    }
    this.#ctx.player.dispatch(new _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.DOMEvent("dash-lib-load-start"));
  }
  #onLoaded(ctor) {
    {
      this.#ctx.logger?.infoGroup("Loaded `dash.js`").labelledLog("Library", this.#lib).labelledLog("Constructor", ctor).dispatch();
    }
    this.#ctx.player.dispatch(
      new _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.DOMEvent("dash-lib-loaded", {
        detail: ctor
      })
    );
    this.#callback(ctor);
  }
  #onLoadError(e) {
    const error = coerceToError(e);
    {
      this.#ctx.logger?.errorGroup("[vidstack] Failed to load `dash.js`").labelledLog("Library", this.#lib).labelledLog("Error", e).dispatch();
    }
    this.#ctx.player.dispatch(
      new _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.DOMEvent("dash-lib-load-error", {
        detail: error
      })
    );
    this.#ctx.notify("error", {
      message: error.message,
      code: 4,
      error
    });
  }
}
async function importDASH(loader, callbacks = {}) {
  if ((0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isUndefined)(loader)) return void 0;
  callbacks.onLoadStart?.();
  if (isDASHConstructor(loader)) {
    callbacks.onLoaded?.(loader);
    return loader;
  }
  if (isDASHNamespace(loader)) {
    const ctor = loader.MediaPlayer;
    callbacks.onLoaded?.(ctor);
    return ctor;
  }
  try {
    const ctor = (await loader())?.default;
    if (isDASHNamespace(ctor)) {
      callbacks.onLoaded?.(ctor.MediaPlayer);
      return ctor.MediaPlayer;
    }
    if (ctor) {
      callbacks.onLoaded?.(ctor);
    } else {
      throw Error(
         true ? "[vidstack] failed importing `dash.js`. Dynamic import returned invalid object." : 0
      );
    }
    return ctor;
  } catch (err) {
    callbacks.onLoadError?.(err);
  }
  return void 0;
}
async function loadDASHScript(src, callbacks = {}) {
  if (!(0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isString)(src)) return void 0;
  callbacks.onLoadStart?.();
  try {
    await loadScript(src);
    if (!(0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isFunction)(window.dashjs.MediaPlayer)) {
      throw Error(
         true ? "[vidstack] failed loading `dash.js`. Could not find a valid `Dash` constructor on window" : 0
      );
    }
    const ctor = window.dashjs.MediaPlayer;
    callbacks.onLoaded?.(ctor);
    return ctor;
  } catch (err) {
    callbacks.onLoadError?.(err);
  }
  return void 0;
}
function isDASHConstructor(value) {
  return value && value.prototype && value.prototype !== Function;
}
function isDASHNamespace(value) {
  return value && "MediaPlayer" in value;
}

const JS_DELIVR_CDN = "https://cdn.jsdelivr.net";
class DASHProvider extends VideoProvider {
  $$PROVIDER_TYPE = "DASH";
  #ctor = null;
  #controller = new DASHController(this.video, this.ctx);
  /**
   * The `dash.js` constructor.
   */
  get ctor() {
    return this.#ctor;
  }
  /**
   * The current `dash.js` instance.
   */
  get instance() {
    return this.#controller.instance;
  }
  /**
   * Whether `dash.js` is supported in this environment.
   */
  static supported = isDASHSupported();
  get type() {
    return "dash";
  }
  get canLiveSync() {
    return true;
  }
  #library = `${JS_DELIVR_CDN}/npm/dashjs@4.7.4/dist/dash${".all.debug.js" }`;
  /**
   * The `dash.js` configuration object.
   *
   * @see {@link https://cdn.dashjs.org/latest/jsdoc/module-Settings.html}
   */
  get config() {
    return this.#controller.config;
  }
  set config(config) {
    this.#controller.config = config;
  }
  /**
   * The `dash.js` constructor (supports dynamic imports) or a URL of where it can be found.
   *
   * @defaultValue `https://cdn.jsdelivr.net/npm/dashjs@4.7.4/dist/dash.all.min.js`
   */
  get library() {
    return this.#library;
  }
  set library(library) {
    this.#library = library;
  }
  preconnect() {
    if (!(0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isString)(this.#library)) return;
    preconnect(this.#library);
  }
  setup() {
    super.setup();
    new DASHLibLoader(this.#library, this.ctx, (ctor) => {
      this.#ctor = ctor;
      this.#controller.setup(ctor);
      this.ctx.notify("provider-setup", this);
      const src = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.peek)(this.ctx.$state.source);
      if (src) this.loadSource(src);
    });
  }
  async loadSource(src, preload) {
    if (!(0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isString)(src.src)) {
      this.removeSource();
      return;
    }
    this.media.preload = preload || "";
    this.appendSource(src, "application/x-mpegurl");
    this.#controller.loadSource(src);
    this.currentSrc = src;
  }
  /**
   * The given callback is invoked when a new `dash.js` instance is created and right before it's
   * attached to media.
   */
  onInstance(callback) {
    const instance = this.#controller.instance;
    if (instance) callback(instance);
    return this.#controller.onInstance(callback);
  }
  destroy() {
    this.#controller.destroy();
  }
}

var provider = /*#__PURE__*/Object.freeze({
  __proto__: null,
  DASHProvider: DASHProvider
});

class DASHProviderLoader extends VideoProviderLoader {
  static supported = isDASHSupported();
  name = "dash";
  canPlay(src) {
    return DASHProviderLoader.supported && isDASHSrc(src);
  }
  async load(context) {
    if (IS_SERVER) {
      throw Error("[vidstack] can not load dash provider server-side");
    }
    if (!this.target) {
      throw Error(
        "[vidstack] `<video>` element was not found - did you forget to include `<media-provider>`?"
      );
    }
    return new (await Promise.resolve().then(function () { return provider; })).DASHProvider(this.target, context);
  }
}

class VimeoProviderLoader {
  name = "vimeo";
  target;
  preconnect() {
    const connections = [
      "https://i.vimeocdn.com",
      "https://f.vimeocdn.com",
      "https://fresnel.vimeocdn.com"
    ];
    for (const url of connections) {
      preconnect(url);
    }
  }
  canPlay(src) {
    return (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isString)(src.src) && src.type === "video/vimeo";
  }
  mediaType() {
    return "video";
  }
  async load(ctx) {
    if (IS_SERVER) {
      throw Error("[vidstack] can not load vimeo provider server-side");
    }
    if (!this.target) {
      throw Error(
        "[vidstack] `<iframe>` element was not found - did you forget to include media provider?"
      );
    }
    return new (await __webpack_require__.e(/*! import() */ "vendors-node_modules_vidstack_react_dev_chunks_vidstack-Bt-dOpts_js").then(__webpack_require__.bind(__webpack_require__, /*! ./vidstack-Bt-dOpts.js */ "./node_modules/@vidstack/react/dev/chunks/vidstack-Bt-dOpts.js"))).VimeoProvider(this.target, ctx);
  }
  async loadPoster(src, ctx, abort) {
    const { resolveVimeoVideoId, getVimeoVideoInfo } = await __webpack_require__.e(/*! import() */ "node_modules_vidstack_react_dev_chunks_vidstack-krOAtKMi_js").then(__webpack_require__.bind(__webpack_require__, /*! ./vidstack-krOAtKMi.js */ "./node_modules/@vidstack/react/dev/chunks/vidstack-krOAtKMi.js"));
    if (!(0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isString)(src.src)) return null;
    const { videoId, hash } = resolveVimeoVideoId(src.src);
    if (videoId) {
      return getVimeoVideoInfo(videoId, abort, hash).then((info) => info ? info.poster : null);
    }
    return null;
  }
}

class YouTubeProviderLoader {
  name = "youtube";
  target;
  preconnect() {
    const connections = [
      // Botguard script.
      "https://www.google.com",
      // Posters.
      "https://i.ytimg.com",
      // Ads.
      "https://googleads.g.doubleclick.net",
      "https://static.doubleclick.net"
    ];
    for (const url of connections) {
      preconnect(url);
    }
  }
  canPlay(src) {
    return (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isString)(src.src) && src.type === "video/youtube";
  }
  mediaType() {
    return "video";
  }
  async load(ctx) {
    if (IS_SERVER) {
      throw Error("[vidstack] can not load youtube provider server-side");
    }
    if (!this.target) {
      throw Error(
        "[vidstack] `<iframe>` element was not found - did you forget to include media provider?"
      );
    }
    return new (await __webpack_require__.e(/*! import() */ "vendors-node_modules_vidstack_react_dev_chunks_vidstack-CoE5RD0i_js").then(__webpack_require__.bind(__webpack_require__, /*! ./vidstack-CoE5RD0i.js */ "./node_modules/@vidstack/react/dev/chunks/vidstack-CoE5RD0i.js"))).YouTubeProvider(this.target, ctx);
  }
  async loadPoster(src, ctx, abort) {
    const { findYouTubePoster, resolveYouTubeVideoId } = await __webpack_require__.e(/*! import() */ "node_modules_vidstack_react_dev_chunks_vidstack-Dm1xEU9Q_js").then(__webpack_require__.bind(__webpack_require__, /*! ./vidstack-Dm1xEU9Q.js */ "./node_modules/@vidstack/react/dev/chunks/vidstack-Dm1xEU9Q.js"));
    const videoId = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isString)(src.src) && resolveYouTubeVideoId(src.src);
    if (videoId) return findYouTubePoster(videoId, abort);
    return null;
  }
}

function padNumberWithZeroes(num, expectedLength) {
  const str = String(num);
  const actualLength = str.length;
  const shouldPad = actualLength < expectedLength;
  if (shouldPad) {
    const padLength = expectedLength - actualLength;
    const padding = `0`.repeat(padLength);
    return `${padding}${num}`;
  }
  return str;
}
function parseTime(duration) {
  const hours = Math.trunc(duration / 3600);
  const minutes = Math.trunc(duration % 3600 / 60);
  const seconds = Math.trunc(duration % 60);
  const fraction = Number((duration - Math.trunc(duration)).toPrecision(3));
  return {
    hours,
    minutes,
    seconds,
    fraction
  };
}
function formatTime(duration, { padHrs = null, padMins = null, showHrs = false, showMs = false } = {}) {
  const { hours, minutes, seconds, fraction } = parseTime(duration), paddedHours = padHrs ? padNumberWithZeroes(hours, 2) : hours, paddedMinutes = padMins || (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isNull)(padMins) && duration >= 3600 ? padNumberWithZeroes(minutes, 2) : minutes, paddedSeconds = padNumberWithZeroes(seconds, 2), paddedMs = showMs && fraction > 0 ? `.${String(fraction).replace(/^0?\./, "")}` : "", time = `${paddedMinutes}:${paddedSeconds}${paddedMs}`;
  return hours > 0 || showHrs ? `${paddedHours}:${time}` : time;
}
function formatSpokenTime(duration) {
  const spokenParts = [];
  const { hours, minutes, seconds } = parseTime(duration);
  if (hours > 0) {
    spokenParts.push(`${hours} hour`);
  }
  if (minutes > 0) {
    spokenParts.push(`${minutes} min`);
  }
  if (seconds > 0 || spokenParts.length === 0) {
    spokenParts.push(`${seconds} sec`);
  }
  return spokenParts.join(" ");
}

const MEDIA_ATTRIBUTES = Symbol("MEDIA_ATTRIBUTES" );
const mediaAttributes = [
  "autoPlay",
  "canAirPlay",
  "canFullscreen",
  "canGoogleCast",
  "canLoad",
  "canLoadPoster",
  "canPictureInPicture",
  "canPlay",
  "canSeek",
  "ended",
  "fullscreen",
  "isAirPlayConnected",
  "isGoogleCastConnected",
  "live",
  "liveEdge",
  "loop",
  "mediaType",
  "muted",
  "paused",
  "pictureInPicture",
  "playing",
  "playsInline",
  "remotePlaybackState",
  "remotePlaybackType",
  "seeking",
  "started",
  "streamType",
  "viewType",
  "waiting"
];

const mediaPlayerProps = {
  artist: "",
  artwork: null,
  autoplay: false,
  autoPlay: false,
  clipStartTime: 0,
  clipEndTime: 0,
  controls: false,
  currentTime: 0,
  crossorigin: null,
  crossOrigin: null,
  duration: -1,
  fullscreenOrientation: "landscape",
  googleCast: {},
  load: "visible",
  posterLoad: "visible",
  logLevel: "warn" ,
  loop: false,
  muted: false,
  paused: true,
  playsinline: false,
  playsInline: false,
  playbackRate: 1,
  poster: "",
  preload: "metadata",
  preferNativeHLS: false,
  src: "",
  title: "",
  controlsDelay: 2e3,
  hideControlsOnMouseLeave: false,
  viewType: "unknown",
  streamType: "unknown",
  volume: 1,
  liveEdgeTolerance: 10,
  minLiveDVRWindow: 60,
  keyDisabled: false,
  keyTarget: "player",
  keyShortcuts: MEDIA_KEY_SHORTCUTS,
  storage: null
};

const MEDIA_EVENTS = [
  "abort",
  "can-play",
  "can-play-through",
  "duration-change",
  "emptied",
  "ended",
  "error",
  "fullscreen-change",
  "loaded-data",
  "loaded-metadata",
  "load-start",
  "media-type-change",
  "pause",
  "play",
  "playing",
  "progress",
  "seeked",
  "seeking",
  "source-change",
  "sources-change",
  "stalled",
  "started",
  "suspend",
  "stream-type-change",
  "replay",
  // time-change,
  // 'time-update',
  "view-type-change",
  "volume-change",
  "waiting"
] ;
class MediaEventsLogger extends MediaPlayerController {
  #media;
  constructor(media) {
    super();
    this.#media = media;
  }
  onConnect(el) {
    const events = new _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.EventsController(el), handler = this.#onMediaEvent.bind(this);
    for (const eventType of MEDIA_EVENTS) {
      events.add(eventType, handler);
    }
  }
  #onMediaEvent(event) {
    this.#media.logger?.debugGroup(`\u{1F4E1} dispatching \`${event.type}\``).labelledLog("Media Store", { ...this.$state }).labelledLog("Event", event).dispatch();
  }
}

class MediaLoadController extends MediaPlayerController {
  #type;
  #callback;
  constructor(type, callback) {
    super();
    this.#type = type;
    this.#callback = callback;
  }
  async onAttach(el) {
    if (IS_SERVER) return;
    const load = this.$props[this.#type]();
    if (load === "eager") {
      requestAnimationFrame(this.#callback);
    } else if (load === "idle") {
      (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.waitIdlePeriod)(this.#callback);
    } else if (load === "visible") {
      let dispose, observer = new IntersectionObserver((entries) => {
        if (!this.scope) return;
        if (entries[0].isIntersecting) {
          dispose?.();
          dispose = void 0;
          this.#callback();
        }
      });
      observer.observe(el);
      dispose = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.onDispose)(() => observer.disconnect());
    }
  }
}

let seenAutoplayWarning = false;
class MediaPlayerDelegate {
  #handle;
  #media;
  constructor(handle, media) {
    this.#handle = handle;
    this.#media = media;
  }
  notify(type, ...init) {
    if (IS_SERVER) return;
    this.#handle(
      new _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.DOMEvent(type, {
        detail: init?.[0],
        trigger: init?.[1]
      })
    );
  }
  async ready(info, trigger) {
    if (IS_SERVER) return;
    return (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.untrack)(async () => {
      const { logger } = this.#media, {
        autoPlay,
        canPlay,
        started,
        duration,
        seekable,
        buffered,
        remotePlaybackInfo,
        playsInline,
        savedState,
        source
      } = this.#media.$state;
      if (canPlay()) return;
      const detail = {
        duration: info?.duration ?? duration(),
        seekable: info?.seekable ?? seekable(),
        buffered: info?.buffered ?? buffered(),
        provider: this.#media.$provider()
      };
      this.notify("can-play", detail, trigger);
      (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.tick)();
      {
        logger?.infoGroup("-~-~-~-~-~-~- \u2705 MEDIA READY -~-~-~-~-~-~-").labelledLog("Media", this.#media).labelledLog("Trigger Event", trigger).dispatch();
      }
      let provider = this.#media.$provider(), { storage, qualities } = this.#media, { muted, volume, clipStartTime, playbackRate } = this.#media.$props;
      await storage?.onLoad?.(source());
      const savedPlaybackTime = savedState()?.currentTime, savedPausedState = savedState()?.paused, storageTime = await storage?.getTime(), startTime = savedPlaybackTime ?? storageTime ?? clipStartTime(), shouldAutoPlay = savedPausedState === false || savedPausedState !== true && !started() && autoPlay();
      if (provider) {
        provider.setVolume(await storage?.getVolume() ?? volume());
        provider.setMuted(muted() || !!await storage?.getMuted());
        const audioGain = await storage?.getAudioGain() ?? 1;
        if (audioGain > 1) provider.audioGain?.setGain?.(audioGain);
        provider.setPlaybackRate?.(await storage?.getPlaybackRate() ?? playbackRate());
        provider.setPlaysInline?.(playsInline());
        if (startTime > 0) provider.setCurrentTime(startTime);
      }
      const prefQuality = await storage?.getVideoQuality();
      if (prefQuality && qualities.length) {
        let currentQuality = null, currentScore = Infinity;
        for (const quality of qualities) {
          const score = Math.abs(prefQuality.width - quality.width) + Math.abs(prefQuality.height - quality.height) + (prefQuality.bitrate ? Math.abs(prefQuality.bitrate - (quality.bitrate ?? 0)) : 0);
          if (score < currentScore) {
            currentQuality = quality;
            currentScore = score;
          }
        }
        if (currentQuality) currentQuality.selected = true;
      }
      if (canPlay() && shouldAutoPlay) {
        await this.#attemptAutoplay(trigger);
      } else if (storageTime && storageTime > 0) {
        this.notify("started", void 0, trigger);
      }
      remotePlaybackInfo.set(null);
    });
  }
  async #attemptAutoplay(trigger) {
    const {
      player,
      $state: { autoPlaying, muted }
    } = this.#media;
    autoPlaying.set(true);
    const attemptEvent = new _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.DOMEvent("auto-play-attempt", { trigger });
    try {
      await player.play(attemptEvent);
    } catch (error) {
      if (!seenAutoplayWarning) {
        const muteMsg = !muted() ? " Attempting with volume muted will most likely resolve the issue." : "";
        this.#media.logger?.errorGroup("[vidstack] auto-play request failed").labelledLog(
          "Message",
          `Autoplay was requested but failed most likely due to browser autoplay policies or accessibility reasons.${muteMsg}`
        ).labelledLog("Trigger Event", trigger).labelledLog("Error", error).labelledLog("See", "https://developer.chrome.com/blog/autoplay").dispatch();
        seenAutoplayWarning = true;
      }
    }
  }
}

class Queue {
  #queue = /* @__PURE__ */ new Map();
  /**
   * Queue the given `item` under the given `key` to be processed at a later time by calling
   * `serve(key)`.
   */
  enqueue(key, item) {
    this.#queue.set(key, item);
  }
  /**
   * Process item in queue for the given `key`.
   */
  serve(key) {
    const value = this.peek(key);
    this.#queue.delete(key);
    return value;
  }
  /**
   * Peek at item in queue for the given `key`.
   */
  peek(key) {
    return this.#queue.get(key);
  }
  /**
   * Removes queued item under the given `key`.
   */
  delete(key) {
    this.#queue.delete(key);
  }
  /**
   * Clear all items in the queue.
   */
  clear() {
    this.#queue.clear();
  }
}

class RequestQueue {
  #serving = false;
  #pending = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.deferredPromise)();
  #queue = /* @__PURE__ */ new Map();
  /**
   * The number of callbacks that are currently in queue.
   */
  get size() {
    return this.#queue.size;
  }
  /**
   * Whether items in the queue are being served immediately, otherwise they're queued to
   * be processed later.
   */
  get isServing() {
    return this.#serving;
  }
  /**
   * Waits for the queue to be flushed (ie: start serving).
   */
  async waitForFlush() {
    if (this.#serving) return;
    await this.#pending.promise;
  }
  /**
   * Queue the given `callback` to be invoked at a later time by either calling the `serve()` or
   * `start()` methods. If the queue has started serving (i.e., `start()` was already called),
   * then the callback will be invoked immediately.
   *
   * @param key - Uniquely identifies this callback so duplicates are ignored.
   * @param callback - The function to call when this item in the queue is being served.
   */
  enqueue(key, callback) {
    if (this.#serving) {
      callback();
      return;
    }
    this.#queue.delete(key);
    this.#queue.set(key, callback);
  }
  /**
   * Invokes the callback with the given `key` in the queue (if it exists).
   */
  serve(key) {
    this.#queue.get(key)?.();
    this.#queue.delete(key);
  }
  /**
   * Flush all queued items and start serving future requests immediately until `stop()` is called.
   */
  start() {
    this.#flush();
    this.#serving = true;
    if (this.#queue.size > 0) this.#flush();
  }
  /**
   * Stop serving requests, they'll be queued until you begin processing again by calling `start()`.
   */
  stop() {
    this.#serving = false;
  }
  /**
   * Stop serving requests, empty the request queue, and release any promises waiting for the
   * queue to flush.
   */
  reset() {
    this.stop();
    this.#queue.clear();
    this.#release();
  }
  #flush() {
    for (const key of this.#queue.keys()) this.serve(key);
    this.#release();
  }
  #release() {
    this.#pending.resolve();
    this.#pending = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.deferredPromise)();
  }
}

function ariaBool(value) {
  return value ? "true" : "false";
}
function $ariaBool(signal) {
  return () => ariaBool(signal());
}
function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

class MediaRequestManager extends MediaPlayerController {
  #stateMgr;
  #request;
  #media;
  controls;
  #fullscreen;
  #orientation;
  #$provider;
  #providerQueue = new RequestQueue();
  constructor(stateMgr, request, media) {
    super();
    this.#stateMgr = stateMgr;
    this.#request = request;
    this.#media = media;
    this.#$provider = media.$provider;
    this.controls = new MediaControls();
    this.#fullscreen = new FullscreenController();
    this.#orientation = new ScreenOrientationController();
  }
  onAttach() {
    this.listen("fullscreen-change", this.#onFullscreenChange.bind(this));
  }
  onConnect(el) {
    const names = Object.getOwnPropertyNames(Object.getPrototypeOf(this)), events = new _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.EventsController(el), handleRequest = this.#handleRequest.bind(this);
    for (const name of names) {
      if (name.startsWith("media-")) {
        events.add(name, handleRequest);
      }
    }
    this.#attachLoadPlayListener();
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#watchProvider.bind(this));
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#watchControlsDelayChange.bind(this));
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#watchAudioGainSupport.bind(this));
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#watchAirPlaySupport.bind(this));
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#watchGoogleCastSupport.bind(this));
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#watchFullscreenSupport.bind(this));
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#watchPiPSupport.bind(this));
  }
  onDestroy() {
    try {
      const destroyEvent = this.createEvent("destroy"), { pictureInPicture, fullscreen } = this.$state;
      if (fullscreen()) this.exitFullscreen("prefer-media", destroyEvent);
      if (pictureInPicture()) this.exitPictureInPicture(destroyEvent);
    } catch (e) {
    }
    this.#providerQueue.reset();
  }
  #attachLoadPlayListener() {
    const { load } = this.$props, { canLoad } = this.$state;
    if (load() !== "play" || canLoad()) return;
    const off = this.listen("media-play-request", (event) => {
      this.#handleLoadPlayStrategy(event);
      off();
    });
  }
  #watchProvider() {
    const provider = this.#$provider(), canPlay = this.$state.canPlay();
    if (provider && canPlay) {
      this.#providerQueue.start();
    }
    return () => {
      this.#providerQueue.stop();
    };
  }
  #handleRequest(event) {
    event.stopPropagation();
    if (event.defaultPrevented) return;
    {
      this.#media.logger?.infoGroup(`\u{1F4EC} received \`${event.type}\``).labelledLog("Request", event).dispatch();
    }
    if (!this[event.type]) return;
    if ((0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.peek)(this.#$provider)) {
      this[event.type](event);
    } else {
      this.#providerQueue.enqueue(event.type, () => {
        if ((0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.peek)(this.#$provider)) this[event.type](event);
      });
    }
  }
  async play(trigger) {
    if (IS_SERVER) return;
    const { canPlay, paused, autoPlaying } = this.$state;
    if (this.#handleLoadPlayStrategy(trigger)) return;
    if (!(0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.peek)(paused)) return;
    if (trigger) this.#request.queue.enqueue("media-play-request", trigger);
    const isAutoPlaying = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.peek)(autoPlaying);
    try {
      const provider = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.peek)(this.#$provider);
      throwIfNotReadyForPlayback(provider, (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.peek)(canPlay));
      throwIfAutoplayingWithReducedMotion(isAutoPlaying);
      return await provider.play();
    } catch (error) {
      this.#logError("play request failed", error, trigger);
      const errorEvent = this.createEvent("play-fail", {
        detail: coerceToError(error),
        trigger
      });
      errorEvent.autoPlay = isAutoPlaying;
      this.#stateMgr.handle(errorEvent);
      throw error;
    }
  }
  #handleLoadPlayStrategy(trigger) {
    const { load } = this.$props, { canLoad } = this.$state;
    if (load() === "play" && !canLoad()) {
      const event = this.createEvent("media-start-loading", { trigger });
      this.dispatchEvent(event);
      this.#providerQueue.enqueue("media-play-request", async () => {
        try {
          await this.play(event);
        } catch (error) {
        }
      });
      return true;
    }
    return false;
  }
  async pause(trigger) {
    if (IS_SERVER) return;
    const { canPlay, paused } = this.$state;
    if ((0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.peek)(paused)) return;
    if (trigger) {
      this.#request.queue.enqueue("media-pause-request", trigger);
    }
    try {
      const provider = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.peek)(this.#$provider);
      throwIfNotReadyForPlayback(provider, (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.peek)(canPlay));
      return await provider.pause();
    } catch (error) {
      this.#request.queue.delete("media-pause-request");
      {
        this.#logError("pause request failed", error, trigger);
      }
      throw error;
    }
  }
  setAudioGain(gain, trigger) {
    const { audioGain, canSetAudioGain } = this.$state;
    if (audioGain() === gain) return;
    const provider = this.#$provider();
    if (!provider?.audioGain || !canSetAudioGain()) {
      throw Error("[vidstack] audio gain api not available");
    }
    if (trigger) {
      this.#request.queue.enqueue("media-audio-gain-change-request", trigger);
    }
    provider.audioGain.setGain(gain);
  }
  seekToLiveEdge(trigger) {
    if (IS_SERVER) return;
    const { canPlay, live, liveEdge, canSeek, liveSyncPosition, seekableEnd, userBehindLiveEdge } = this.$state;
    userBehindLiveEdge.set(false);
    if ((0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.peek)(() => !live() || liveEdge() || !canSeek())) return;
    const provider = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.peek)(this.#$provider);
    throwIfNotReadyForPlayback(provider, (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.peek)(canPlay));
    if (trigger) this.#request.queue.enqueue("media-seek-request", trigger);
    const end = seekableEnd() - 2;
    provider.setCurrentTime(Math.min(end, liveSyncPosition() ?? end));
  }
  #wasPIPActive = false;
  async enterFullscreen(target = "prefer-media", trigger) {
    if (IS_SERVER) return;
    const adapter = this.#getFullscreenAdapter(target);
    throwIfFullscreenNotSupported(target, adapter);
    if (adapter.active) return;
    if ((0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.peek)(this.$state.pictureInPicture)) {
      this.#wasPIPActive = true;
      await this.exitPictureInPicture(trigger);
    }
    if (trigger) {
      this.#request.queue.enqueue("media-enter-fullscreen-request", trigger);
    }
    return adapter.enter();
  }
  async exitFullscreen(target = "prefer-media", trigger) {
    if (IS_SERVER) return;
    const adapter = this.#getFullscreenAdapter(target);
    throwIfFullscreenNotSupported(target, adapter);
    if (!adapter.active) return;
    if (trigger) {
      this.#request.queue.enqueue("media-exit-fullscreen-request", trigger);
    }
    try {
      const result = await adapter.exit();
      if (this.#wasPIPActive && (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.peek)(this.$state.canPictureInPicture)) {
        await this.enterPictureInPicture();
      }
      return result;
    } finally {
      this.#wasPIPActive = false;
    }
  }
  #getFullscreenAdapter(target) {
    const provider = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.peek)(this.#$provider);
    return target === "prefer-media" && this.#fullscreen.supported || target === "media" ? this.#fullscreen : provider?.fullscreen;
  }
  async enterPictureInPicture(trigger) {
    if (IS_SERVER) return;
    this.#throwIfPIPNotSupported();
    if (this.$state.pictureInPicture()) return;
    if (trigger) {
      this.#request.queue.enqueue("media-enter-pip-request", trigger);
    }
    return await this.#$provider().pictureInPicture.enter();
  }
  async exitPictureInPicture(trigger) {
    if (IS_SERVER) return;
    this.#throwIfPIPNotSupported();
    if (!this.$state.pictureInPicture()) return;
    if (trigger) {
      this.#request.queue.enqueue("media-exit-pip-request", trigger);
    }
    return await this.#$provider().pictureInPicture.exit();
  }
  #throwIfPIPNotSupported() {
    if (this.$state.canPictureInPicture()) return;
    throw Error(
      `[vidstack] picture-in-picture is not currently available` 
    );
  }
  #watchControlsDelayChange() {
    this.controls.defaultDelay = this.$props.controlsDelay();
  }
  #watchAudioGainSupport() {
    const { canSetAudioGain } = this.$state, supported = !!this.#$provider()?.audioGain?.supported;
    canSetAudioGain.set(supported);
  }
  #watchAirPlaySupport() {
    const { canAirPlay } = this.$state, supported = !!this.#$provider()?.airPlay?.supported;
    canAirPlay.set(supported);
  }
  #watchGoogleCastSupport() {
    const { canGoogleCast, source } = this.$state, supported = IS_CHROME && !IS_IOS && canGoogleCastSrc(source());
    canGoogleCast.set(supported);
  }
  #watchFullscreenSupport() {
    const { canFullscreen } = this.$state, supported = this.#fullscreen.supported || !!this.#$provider()?.fullscreen?.supported;
    canFullscreen.set(supported);
  }
  #watchPiPSupport() {
    const { canPictureInPicture } = this.$state, supported = !!this.#$provider()?.pictureInPicture?.supported;
    canPictureInPicture.set(supported);
  }
  async ["media-airplay-request"](event) {
    try {
      await this.requestAirPlay(event);
    } catch (error) {
    }
  }
  async requestAirPlay(trigger) {
    try {
      const adapter = this.#$provider()?.airPlay;
      if (!adapter?.supported) {
        throw Error( true ? "AirPlay adapter not available on provider." : 0);
      }
      if (trigger) {
        this.#request.queue.enqueue("media-airplay-request", trigger);
      }
      return await adapter.prompt();
    } catch (error) {
      this.#request.queue.delete("media-airplay-request");
      {
        this.#logError("airplay request failed", error, trigger);
      }
      throw error;
    }
  }
  async ["media-google-cast-request"](event) {
    try {
      await this.requestGoogleCast(event);
    } catch (error) {
    }
  }
  #googleCastLoader;
  async requestGoogleCast(trigger) {
    try {
      const { canGoogleCast } = this.$state;
      if (!(0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.peek)(canGoogleCast)) {
        const error = Error(
           true ? "Google Cast not available on this platform." : 0
        );
        error.code = "CAST_NOT_AVAILABLE";
        throw error;
      }
      preconnect("https://www.gstatic.com");
      if (!this.#googleCastLoader) {
        const $module = await __webpack_require__.e(/*! import() */ "node_modules_vidstack_react_dev_chunks_vidstack-BM-FgV9W_js").then(__webpack_require__.bind(__webpack_require__, /*! ./vidstack-BM-FgV9W.js */ "./node_modules/@vidstack/react/dev/chunks/vidstack-BM-FgV9W.js")).then(function (n) { return n.loader; });
        this.#googleCastLoader = new $module.GoogleCastLoader();
      }
      await this.#googleCastLoader.prompt(this.#media);
      if (trigger) {
        this.#request.queue.enqueue("media-google-cast-request", trigger);
      }
      const isConnecting = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.peek)(this.$state.remotePlaybackState) !== "disconnected";
      if (isConnecting) {
        this.$state.savedState.set({
          paused: (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.peek)(this.$state.paused),
          currentTime: (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.peek)(this.$state.currentTime)
        });
      }
      this.$state.remotePlaybackLoader.set(isConnecting ? this.#googleCastLoader : null);
    } catch (error) {
      this.#request.queue.delete("media-google-cast-request");
      {
        this.#logError("google cast request failed", error, trigger);
      }
      throw error;
    }
  }
  ["media-clip-start-change-request"](event) {
    const { clipStartTime } = this.$state;
    clipStartTime.set(event.detail);
  }
  ["media-clip-end-change-request"](event) {
    const { clipEndTime } = this.$state;
    clipEndTime.set(event.detail);
    this.dispatch("duration-change", {
      detail: event.detail,
      trigger: event
    });
  }
  ["media-duration-change-request"](event) {
    const { providedDuration, clipEndTime } = this.$state;
    providedDuration.set(event.detail);
    if (clipEndTime() <= 0) {
      this.dispatch("duration-change", {
        detail: event.detail,
        trigger: event
      });
    }
  }
  ["media-audio-track-change-request"](event) {
    const { logger, audioTracks } = this.#media;
    if (audioTracks.readonly) {
      {
        logger?.warnGroup(`[vidstack] attempted to change audio track but it is currently read-only`).labelledLog("Request Event", event).dispatch();
      }
      return;
    }
    const index = event.detail, track = audioTracks[index];
    if (track) {
      const key = event.type;
      this.#request.queue.enqueue(key, event);
      track.selected = true;
    } else {
      logger?.warnGroup("[vidstack] failed audio track change request (invalid index)").labelledLog("Audio Tracks", audioTracks.toArray()).labelledLog("Index", index).labelledLog("Request Event", event).dispatch();
    }
  }
  async ["media-enter-fullscreen-request"](event) {
    try {
      await this.enterFullscreen(event.detail, event);
    } catch (error) {
      this.#onFullscreenError(error, event);
    }
  }
  async ["media-exit-fullscreen-request"](event) {
    try {
      await this.exitFullscreen(event.detail, event);
    } catch (error) {
      this.#onFullscreenError(error, event);
    }
  }
  async #onFullscreenChange(event) {
    const lockType = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.peek)(this.$props.fullscreenOrientation), isFullscreen = event.detail;
    if ((0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isUndefined)(lockType) || lockType === "none" || !this.#orientation.supported) return;
    if (isFullscreen) {
      if (this.#orientation.locked) return;
      this.dispatch("media-orientation-lock-request", {
        detail: lockType,
        trigger: event
      });
    } else if (this.#orientation.locked) {
      this.dispatch("media-orientation-unlock-request", {
        trigger: event
      });
    }
  }
  #onFullscreenError(error, request) {
    {
      this.#logError("fullscreen request failed", error, request);
    }
    this.#stateMgr.handle(
      this.createEvent("fullscreen-error", {
        detail: coerceToError(error)
      })
    );
  }
  async ["media-orientation-lock-request"](event) {
    const key = event.type;
    try {
      this.#request.queue.enqueue(key, event);
      await this.#orientation.lock(event.detail);
    } catch (error) {
      this.#request.queue.delete(key);
      {
        this.#logError("failed to lock screen orientation", error, event);
      }
    }
  }
  async ["media-orientation-unlock-request"](event) {
    const key = event.type;
    try {
      this.#request.queue.enqueue(key, event);
      await this.#orientation.unlock();
    } catch (error) {
      this.#request.queue.delete(key);
      {
        this.#logError("failed to unlock screen orientation", error, event);
      }
    }
  }
  async ["media-enter-pip-request"](event) {
    try {
      await this.enterPictureInPicture(event);
    } catch (error) {
      this.#onPictureInPictureError(error, event);
    }
  }
  async ["media-exit-pip-request"](event) {
    try {
      await this.exitPictureInPicture(event);
    } catch (error) {
      this.#onPictureInPictureError(error, event);
    }
  }
  #onPictureInPictureError(error, request) {
    {
      this.#logError("pip request failed", error, request);
    }
    this.#stateMgr.handle(
      this.createEvent("picture-in-picture-error", {
        detail: coerceToError(error)
      })
    );
  }
  ["media-live-edge-request"](event) {
    const { live, liveEdge, canSeek } = this.$state;
    if (!live() || liveEdge() || !canSeek()) return;
    this.#request.queue.enqueue("media-seek-request", event);
    try {
      this.seekToLiveEdge();
    } catch (error) {
      this.#request.queue.delete("media-seek-request");
      {
        this.#logError("seek to live edge fail", error, event);
      }
    }
  }
  async ["media-loop-request"](event) {
    try {
      this.#request.looping = true;
      this.#request.replaying = true;
      await this.play(event);
    } catch (error) {
      this.#request.looping = false;
    }
  }
  ["media-user-loop-change-request"](event) {
    this.$state.userPrefersLoop.set(event.detail);
  }
  async ["media-pause-request"](event) {
    if (this.$state.paused()) return;
    try {
      await this.pause(event);
    } catch (error) {
    }
  }
  async ["media-play-request"](event) {
    if (!this.$state.paused()) return;
    try {
      await this.play(event);
    } catch (e) {
    }
  }
  ["media-rate-change-request"](event) {
    const { playbackRate, canSetPlaybackRate } = this.$state;
    if (playbackRate() === event.detail || !canSetPlaybackRate()) return;
    const provider = this.#$provider();
    if (!provider?.setPlaybackRate) return;
    this.#request.queue.enqueue("media-rate-change-request", event);
    provider.setPlaybackRate(event.detail);
  }
  ["media-audio-gain-change-request"](event) {
    try {
      this.setAudioGain(event.detail, event);
    } catch (e) {
    }
  }
  ["media-quality-change-request"](event) {
    const { qualities, storage, logger } = this.#media;
    if (qualities.readonly) {
      {
        logger?.warnGroup(`[vidstack] attempted to change video quality but it is currently read-only`).labelledLog("Request Event", event).dispatch();
      }
      return;
    }
    this.#request.queue.enqueue("media-quality-change-request", event);
    const index = event.detail;
    if (index < 0) {
      qualities.autoSelect(event);
      if (event.isOriginTrusted) storage?.setVideoQuality?.(null);
    } else {
      const quality = qualities[index];
      if (quality) {
        quality.selected = true;
        if (event.isOriginTrusted) {
          storage?.setVideoQuality?.({
            id: quality.id,
            width: quality.width,
            height: quality.height,
            bitrate: quality.bitrate
          });
        }
      } else {
        logger?.warnGroup("[vidstack] failed quality change request (invalid index)").labelledLog("Qualities", qualities.toArray()).labelledLog("Index", index).labelledLog("Request Event", event).dispatch();
      }
    }
  }
  ["media-pause-controls-request"](event) {
    const key = event.type;
    this.#request.queue.enqueue(key, event);
    this.controls.pause(event);
  }
  ["media-resume-controls-request"](event) {
    const key = event.type;
    this.#request.queue.enqueue(key, event);
    this.controls.resume(event);
  }
  ["media-seek-request"](event) {
    const { canSeek, ended, live, seekableEnd, userBehindLiveEdge } = this.$state, seekTime = event.detail;
    if (ended()) this.#request.replaying = true;
    const key = event.type;
    this.#request.seeking = false;
    this.#request.queue.delete(key);
    const boundedTime = boundTime(seekTime, this.$state);
    if (!Number.isFinite(boundedTime) || !canSeek()) return;
    this.#request.queue.enqueue(key, event);
    this.#$provider().setCurrentTime(boundedTime);
    if (live() && event.isOriginTrusted && Math.abs(seekableEnd() - boundedTime) >= 2) {
      userBehindLiveEdge.set(true);
    }
  }
  ["media-seeking-request"](event) {
    const key = event.type;
    this.#request.queue.enqueue(key, event);
    this.$state.seeking.set(true);
    this.#request.seeking = true;
  }
  ["media-start-loading"](event) {
    if (this.$state.canLoad()) return;
    const key = event.type;
    this.#request.queue.enqueue(key, event);
    this.#stateMgr.handle(this.createEvent("can-load"));
  }
  ["media-poster-start-loading"](event) {
    if (this.$state.canLoadPoster()) return;
    const key = event.type;
    this.#request.queue.enqueue(key, event);
    this.#stateMgr.handle(this.createEvent("can-load-poster"));
  }
  ["media-text-track-change-request"](event) {
    const { index, mode } = event.detail, track = this.#media.textTracks[index];
    if (track) {
      const key = event.type;
      this.#request.queue.enqueue(key, event);
      track.setMode(mode, event);
    } else {
      this.#media.logger?.warnGroup("[vidstack] failed text track change request (invalid index)").labelledLog("Text Tracks", this.#media.textTracks.toArray()).labelledLog("Index", index).labelledLog("Request Event", event).dispatch();
    }
  }
  ["media-mute-request"](event) {
    if (this.$state.muted()) return;
    const key = event.type;
    this.#request.queue.enqueue(key, event);
    this.#$provider().setMuted(true);
  }
  ["media-unmute-request"](event) {
    const { muted, volume } = this.$state;
    if (!muted()) return;
    const key = event.type;
    this.#request.queue.enqueue(key, event);
    this.#media.$provider().setMuted(false);
    if (volume() === 0) {
      this.#request.queue.enqueue(key, event);
      this.#$provider().setVolume(0.25);
    }
  }
  ["media-volume-change-request"](event) {
    const { muted, volume } = this.$state;
    const newVolume = event.detail;
    if (volume() === newVolume) return;
    const key = event.type;
    this.#request.queue.enqueue(key, event);
    this.#$provider().setVolume(newVolume);
    if (newVolume > 0 && muted()) {
      this.#request.queue.enqueue(key, event);
      this.#$provider().setMuted(false);
    }
  }
  #logError(title, error, request) {
    this.#media.logger?.errorGroup(`[vidstack] ${title}`).labelledLog("Error", error).labelledLog("Media Context", { ...this.#media }).labelledLog("Trigger Event", request).dispatch();
  }
}
function throwIfNotReadyForPlayback(provider, canPlay) {
  if (provider && canPlay) return;
  throw Error(
    `[vidstack] media is not ready - wait for \`can-play\` event.` 
  );
}
function throwIfFullscreenNotSupported(target, fullscreen) {
  if (fullscreen?.supported) return;
  throw Error(
    `[vidstack] fullscreen is not currently available on target \`${target}\`` 
  );
}
function throwIfAutoplayingWithReducedMotion(autoplaying) {
  if (!prefersReducedMotion() || !autoplaying) return;
  throw Error(
    "[vidstack] autoplay is blocked due to user preference for reduced motion" 
  );
}
class MediaRequestContext {
  seeking = false;
  looping = false;
  replaying = false;
  queue = new Queue();
}

const TRACKED_EVENT = /* @__PURE__ */ new Set([
  "auto-play",
  "auto-play-fail",
  "can-load",
  "sources-change",
  "source-change",
  "load-start",
  "abort",
  "error",
  "loaded-metadata",
  "loaded-data",
  "can-play",
  "play",
  "play-fail",
  "pause",
  "playing",
  "seeking",
  "seeked",
  "waiting"
]);

class MediaStateManager extends MediaPlayerController {
  #request;
  #media;
  #trackedEvents = /* @__PURE__ */ new Map();
  #clipEnded = false;
  #playedIntervals = [];
  #playedInterval = [-1, -1];
  #firingWaiting = false;
  #waitingTrigger;
  constructor(request, media) {
    super();
    this.#request = request;
    this.#media = media;
  }
  onAttach(el) {
    el.setAttribute("aria-busy", "true");
    new _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.EventsController(this).add("fullscreen-change", this["fullscreen-change"].bind(this)).add("fullscreen-error", this["fullscreen-error"].bind(this)).add("orientation-change", this["orientation-change"].bind(this));
  }
  onConnect(el) {
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#watchCanSetVolume.bind(this));
    this.#addTextTrackListeners();
    this.#addQualityListeners();
    this.#addAudioTrackListeners();
    this.#resumePlaybackOnConnect();
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.onDispose)(this.#pausePlaybackOnDisconnect.bind(this));
  }
  onDestroy() {
    const { audioTracks, qualities, textTracks } = this.#media;
    audioTracks[ListSymbol.reset]();
    qualities[ListSymbol.reset]();
    textTracks[ListSymbol.reset]();
    this.#stopWatchingQualityResize();
  }
  handle(event) {
    if (!this.scope) return;
    const type = event.type;
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.untrack)(() => this[event.type]?.(event));
    if (!IS_SERVER) {
      if (TRACKED_EVENT.has(type)) this.#trackedEvents.set(type, event);
      this.dispatch(event);
    }
  }
  #isPlayingOnDisconnect = false;
  #resumePlaybackOnConnect() {
    if (!this.#isPlayingOnDisconnect) return;
    requestAnimationFrame(() => {
      if (!this.scope) return;
      this.#media.remote.play(new _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.DOMEvent("dom-connect"));
    });
    this.#isPlayingOnDisconnect = false;
  }
  #pausePlaybackOnDisconnect() {
    if (this.#isPlayingOnDisconnect) return;
    this.#isPlayingOnDisconnect = !this.$state.paused();
    this.#media.$provider()?.pause();
  }
  #resetTracking() {
    this.#stopWaiting();
    this.#clipEnded = false;
    this.#request.replaying = false;
    this.#request.looping = false;
    this.#firingWaiting = false;
    this.#waitingTrigger = void 0;
    this.#trackedEvents.clear();
  }
  #satisfyRequest(request, event) {
    const requestEvent = this.#request.queue.serve(request);
    if (!requestEvent) return;
    event.request = requestEvent;
    event.triggers.add(requestEvent);
  }
  #addTextTrackListeners() {
    this.#onTextTracksChange();
    this.#onTextTrackModeChange();
    const textTracks = this.#media.textTracks;
    new _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.EventsController(textTracks).add("add", this.#onTextTracksChange.bind(this)).add("remove", this.#onTextTracksChange.bind(this)).add("mode-change", this.#onTextTrackModeChange.bind(this));
  }
  #addQualityListeners() {
    const qualities = this.#media.qualities;
    new _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.EventsController(qualities).add("add", this.#onQualitiesChange.bind(this)).add("remove", this.#onQualitiesChange.bind(this)).add("change", this.#onQualityChange.bind(this)).add("auto-change", this.#onAutoQualityChange.bind(this)).add("readonly-change", this.#onCanSetQualityChange.bind(this));
  }
  #addAudioTrackListeners() {
    const audioTracks = this.#media.audioTracks;
    new _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.EventsController(audioTracks).add("add", this.#onAudioTracksChange.bind(this)).add("remove", this.#onAudioTracksChange.bind(this)).add("change", this.#onAudioTrackChange.bind(this));
  }
  #onTextTracksChange(event) {
    const { textTracks } = this.$state;
    textTracks.set(this.#media.textTracks.toArray());
    this.dispatch("text-tracks-change", {
      detail: textTracks(),
      trigger: event
    });
  }
  #onTextTrackModeChange(event) {
    if (event) this.#satisfyRequest("media-text-track-change-request", event);
    const current = this.#media.textTracks.selected, { textTrack } = this.$state;
    if (textTrack() !== current) {
      textTrack.set(current);
      this.dispatch("text-track-change", {
        detail: current,
        trigger: event
      });
    }
  }
  #onAudioTracksChange(event) {
    const { audioTracks } = this.$state;
    audioTracks.set(this.#media.audioTracks.toArray());
    this.dispatch("audio-tracks-change", {
      detail: audioTracks(),
      trigger: event
    });
  }
  #onAudioTrackChange(event) {
    const { audioTrack } = this.$state;
    audioTrack.set(this.#media.audioTracks.selected);
    if (event) this.#satisfyRequest("media-audio-track-change-request", event);
    this.dispatch("audio-track-change", {
      detail: audioTrack(),
      trigger: event
    });
  }
  #onQualitiesChange(event) {
    const { qualities } = this.$state;
    qualities.set(this.#media.qualities.toArray());
    this.dispatch("qualities-change", {
      detail: qualities(),
      trigger: event
    });
  }
  #onQualityChange(event) {
    const { quality } = this.$state;
    quality.set(this.#media.qualities.selected);
    if (event) this.#satisfyRequest("media-quality-change-request", event);
    this.dispatch("quality-change", {
      detail: quality(),
      trigger: event
    });
  }
  #onAutoQualityChange() {
    const { qualities } = this.#media, isAuto = qualities.auto;
    this.$state.autoQuality.set(isAuto);
    if (!isAuto) this.#stopWatchingQualityResize();
  }
  #stopQualityResizeEffect = null;
  #watchQualityResize() {
    this.#stopWatchingQualityResize();
    this.#stopQualityResizeEffect = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(() => {
      const { qualities } = this.#media, { mediaWidth, mediaHeight } = this.$state, w = mediaWidth(), h = mediaHeight();
      if (w === 0 || h === 0) return;
      let selectedQuality = null, minScore = Infinity;
      for (const quality of qualities) {
        const score = Math.abs(quality.width - w) + Math.abs(quality.height - h);
        if (score < minScore) {
          minScore = score;
          selectedQuality = quality;
        }
      }
      if (selectedQuality) {
        qualities[ListSymbol.select](
          selectedQuality,
          true,
          new _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.DOMEvent("resize", { detail: { width: w, height: h } })
        );
      }
    });
  }
  #stopWatchingQualityResize() {
    this.#stopQualityResizeEffect?.();
    this.#stopQualityResizeEffect = null;
  }
  #onCanSetQualityChange() {
    this.$state.canSetQuality.set(!this.#media.qualities.readonly);
  }
  #watchCanSetVolume() {
    const { canSetVolume, isGoogleCastConnected } = this.$state;
    if (isGoogleCastConnected()) {
      canSetVolume.set(false);
      return;
    }
    canChangeVolume().then(canSetVolume.set);
  }
  ["provider-change"](event) {
    const prevProvider = this.#media.$provider(), newProvider = event.detail;
    if (prevProvider?.type === newProvider?.type) return;
    prevProvider?.destroy?.();
    prevProvider?.scope?.dispose();
    this.#media.$provider.set(event.detail);
    if (prevProvider && event.detail === null) {
      this.#resetMediaState(event);
    }
  }
  ["provider-loader-change"](event) {
    {
      this.#media.logger?.infoGroup(`Loader change \`${event.detail?.constructor.name}\``).labelledLog("Event", event).dispatch();
    }
  }
  ["auto-play"](event) {
    this.$state.autoPlayError.set(null);
  }
  ["auto-play-fail"](event) {
    this.$state.autoPlayError.set(event.detail);
    this.#resetTracking();
  }
  ["can-load"](event) {
    this.$state.canLoad.set(true);
    this.#trackedEvents.set("can-load", event);
    this.#media.textTracks[TextTrackSymbol.canLoad]();
    this.#satisfyRequest("media-start-loading", event);
  }
  ["can-load-poster"](event) {
    this.$state.canLoadPoster.set(true);
    this.#trackedEvents.set("can-load-poster", event);
    this.#satisfyRequest("media-poster-start-loading", event);
  }
  ["media-type-change"](event) {
    const sourceChangeEvent = this.#trackedEvents.get("source-change");
    if (sourceChangeEvent) event.triggers.add(sourceChangeEvent);
    const viewType = this.$state.viewType();
    this.$state.mediaType.set(event.detail);
    const providedViewType = this.$state.providedViewType(), currentViewType = providedViewType === "unknown" ? event.detail : providedViewType;
    if (viewType !== currentViewType) {
      if (IS_SERVER) {
        this.$state.inferredViewType.set(currentViewType);
      } else {
        setTimeout(() => {
          requestAnimationFrame(() => {
            if (!this.scope) return;
            this.$state.inferredViewType.set(event.detail);
            this.dispatch("view-type-change", {
              detail: currentViewType,
              trigger: event
            });
          });
        }, 0);
      }
    }
  }
  ["stream-type-change"](event) {
    const sourceChangeEvent = this.#trackedEvents.get("source-change");
    if (sourceChangeEvent) event.triggers.add(sourceChangeEvent);
    const { streamType, inferredStreamType } = this.$state;
    inferredStreamType.set(event.detail);
    event.detail = streamType();
  }
  ["rate-change"](event) {
    const { storage } = this.#media, { canPlay } = this.$state;
    this.$state.playbackRate.set(event.detail);
    this.#satisfyRequest("media-rate-change-request", event);
    if (canPlay()) {
      storage?.setPlaybackRate?.(event.detail);
    }
  }
  ["remote-playback-change"](event) {
    const { remotePlaybackState, remotePlaybackType } = this.$state, { type, state } = event.detail, isConnected = state === "connected";
    remotePlaybackType.set(type);
    remotePlaybackState.set(state);
    const key = type === "airplay" ? "media-airplay-request" : "media-google-cast-request";
    if (isConnected) {
      this.#satisfyRequest(key, event);
    } else {
      const requestEvent = this.#request.queue.peek(key);
      if (requestEvent) {
        event.request = requestEvent;
        event.triggers.add(requestEvent);
      }
    }
  }
  ["sources-change"](event) {
    const prevSources = this.$state.sources(), newSources = event.detail;
    this.$state.sources.set(newSources);
    this.#onSourceQualitiesChange(prevSources, newSources, event);
  }
  #onSourceQualitiesChange(prevSources, newSources, trigger) {
    let { qualities } = this.#media, added = false, removed = false;
    for (const prevSrc of prevSources) {
      if (!isVideoQualitySrc(prevSrc)) continue;
      const exists = newSources.some((s) => s.src === prevSrc.src);
      if (!exists) {
        const quality = qualities.getBySrc(prevSrc.src);
        if (quality) {
          qualities[ListSymbol.remove](quality, trigger);
          removed = true;
        }
      }
    }
    if (removed && !qualities.length) {
      this.$state.savedState.set(null);
      qualities[ListSymbol.reset](trigger);
    }
    for (const src of newSources) {
      if (!isVideoQualitySrc(src) || qualities.getBySrc(src.src)) continue;
      const quality = {
        id: src.id ?? src.height + "p",
        bitrate: null,
        codec: null,
        ...src,
        selected: false
      };
      qualities[ListSymbol.add](quality, trigger);
      added = true;
    }
    if (added && !qualities[QualitySymbol.enableAuto]) {
      this.#watchQualityResize();
      qualities[QualitySymbol.enableAuto] = this.#watchQualityResize.bind(this);
      qualities[QualitySymbol.setAuto](true, trigger);
    }
  }
  ["source-change"](event) {
    event.isQualityChange = event.originEvent?.type === "quality-change";
    const source = event.detail;
    this.#resetMediaState(event, event.isQualityChange);
    this.#trackedEvents.set(event.type, event);
    this.$state.source.set(source);
    this.el?.setAttribute("aria-busy", "true");
    {
      this.#media.logger?.infoGroup("\u{1F4FC} Media source change").labelledLog("Source", source).dispatch();
    }
  }
  #resetMediaState(event, isSourceQualityChange = false) {
    const { audioTracks, qualities } = this.#media;
    if (!isSourceQualityChange) {
      this.#playedIntervals = [];
      this.#playedInterval = [-1, -1];
      audioTracks[ListSymbol.reset](event);
      qualities[ListSymbol.reset](event);
      softResetMediaState(this.$state, isSourceQualityChange);
      this.#resetTracking();
      return;
    }
    softResetMediaState(this.$state, isSourceQualityChange);
    this.#resetTracking();
  }
  ["abort"](event) {
    const sourceChangeEvent = this.#trackedEvents.get("source-change");
    if (sourceChangeEvent) event.triggers.add(sourceChangeEvent);
    const canLoadEvent = this.#trackedEvents.get("can-load");
    if (canLoadEvent && !event.triggers.hasType("can-load")) {
      event.triggers.add(canLoadEvent);
    }
  }
  ["load-start"](event) {
    const sourceChangeEvent = this.#trackedEvents.get("source-change");
    if (sourceChangeEvent) event.triggers.add(sourceChangeEvent);
  }
  ["error"](event) {
    this.$state.error.set(event.detail);
    const abortEvent = this.#trackedEvents.get("abort");
    if (abortEvent) event.triggers.add(abortEvent);
    {
      this.#media.logger?.errorGroup("Media Error").labelledLog("Error", event.detail).labelledLog("Event", event).labelledLog("Context", this.#media).dispatch();
    }
  }
  ["loaded-metadata"](event) {
    const loadStartEvent = this.#trackedEvents.get("load-start");
    if (loadStartEvent) event.triggers.add(loadStartEvent);
  }
  ["loaded-data"](event) {
    const loadStartEvent = this.#trackedEvents.get("load-start");
    if (loadStartEvent) event.triggers.add(loadStartEvent);
  }
  ["can-play"](event) {
    const loadedMetadata = this.#trackedEvents.get("loaded-metadata");
    if (loadedMetadata) event.triggers.add(loadedMetadata);
    this.#onCanPlayDetail(event.detail);
    this.el?.setAttribute("aria-busy", "false");
  }
  ["can-play-through"](event) {
    this.#onCanPlayDetail(event.detail);
    const canPlay = this.#trackedEvents.get("can-play");
    if (canPlay) event.triggers.add(canPlay);
  }
  #onCanPlayDetail(detail) {
    const { seekable, buffered, intrinsicDuration, canPlay } = this.$state;
    canPlay.set(true);
    buffered.set(detail.buffered);
    seekable.set(detail.seekable);
    const seekableEnd = getTimeRangesEnd(detail.seekable) ?? Infinity;
    intrinsicDuration.set(seekableEnd);
  }
  ["duration-change"](event) {
    const { live, intrinsicDuration, providedDuration, clipEndTime, ended } = this.$state, time = event.detail;
    if (!live()) {
      const duration = !Number.isNaN(time) ? time : 0;
      intrinsicDuration.set(duration);
      if (ended()) this.#onEndPrecisionChange(event);
    }
    if (providedDuration() > 0 || clipEndTime() > 0) {
      event.stopImmediatePropagation();
    }
  }
  ["progress"](event) {
    const { buffered, seekable } = this.$state, { buffered: newBuffered, seekable: newSeekable } = event.detail, newBufferedEnd = getTimeRangesEnd(newBuffered), hasBufferedLengthChanged = newBuffered.length !== buffered().length, hasBufferedEndChanged = newBufferedEnd !== getTimeRangesEnd(buffered()), newSeekableEnd = getTimeRangesEnd(newSeekable), hasSeekableLengthChanged = newSeekable.length !== seekable().length, hasSeekableEndChanged = newSeekableEnd !== getTimeRangesEnd(seekable());
    if (hasBufferedLengthChanged || hasBufferedEndChanged) {
      buffered.set(newBuffered);
    }
    if (hasSeekableLengthChanged || hasSeekableEndChanged) {
      seekable.set(newSeekable);
    }
  }
  ["play"](event) {
    const {
      paused,
      autoPlayError,
      ended,
      autoPlaying,
      playsInline,
      pointer,
      muted,
      viewType,
      live,
      userBehindLiveEdge
    } = this.$state;
    this.#resetPlaybackIfNeeded();
    if (!paused()) {
      event.stopImmediatePropagation();
      return;
    }
    event.autoPlay = autoPlaying();
    const waitingEvent = this.#trackedEvents.get("waiting");
    if (waitingEvent) event.triggers.add(waitingEvent);
    this.#satisfyRequest("media-play-request", event);
    this.#trackedEvents.set("play", event);
    paused.set(false);
    autoPlayError.set(null);
    if (event.autoPlay) {
      this.handle(
        this.createEvent("auto-play", {
          detail: { muted: muted() },
          trigger: event
        })
      );
      autoPlaying.set(false);
    }
    if (ended() || this.#request.replaying) {
      this.#request.replaying = false;
      ended.set(false);
      this.handle(this.createEvent("replay", { trigger: event }));
    }
    if (!playsInline() && viewType() === "video" && pointer() === "coarse") {
      this.#media.remote.enterFullscreen("prefer-media", event);
    }
    if (live() && !userBehindLiveEdge()) {
      this.#media.remote.seekToLiveEdge(event);
    }
  }
  #resetPlaybackIfNeeded(trigger) {
    const provider = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.peek)(this.#media.$provider);
    if (!provider) return;
    const { ended, seekableStart, clipEndTime, currentTime, realCurrentTime, duration } = this.$state;
    const shouldReset = ended() || realCurrentTime() < seekableStart() || clipEndTime() > 0 && realCurrentTime() >= clipEndTime() || Math.abs(currentTime() - duration()) < 0.1;
    if (shouldReset) {
      this.dispatch("media-seek-request", {
        detail: seekableStart(),
        trigger
      });
    }
    return shouldReset;
  }
  ["play-fail"](event) {
    const { muted, autoPlaying } = this.$state;
    const playEvent = this.#trackedEvents.get("play");
    if (playEvent) event.triggers.add(playEvent);
    this.#satisfyRequest("media-play-request", event);
    const { paused, playing } = this.$state;
    paused.set(true);
    playing.set(false);
    this.#resetTracking();
    this.#trackedEvents.set("play-fail", event);
    if (event.autoPlay) {
      this.handle(
        this.createEvent("auto-play-fail", {
          detail: {
            muted: muted(),
            error: event.detail
          },
          trigger: event
        })
      );
      autoPlaying.set(false);
    }
  }
  ["playing"](event) {
    const playEvent = this.#trackedEvents.get("play"), seekedEvent = this.#trackedEvents.get("seeked");
    if (playEvent) event.triggers.add(playEvent);
    else if (seekedEvent) event.triggers.add(seekedEvent);
    setTimeout(() => this.#resetTracking(), 0);
    const {
      paused,
      playing,
      live,
      liveSyncPosition,
      seekableEnd,
      started,
      currentTime,
      seeking,
      ended
    } = this.$state;
    paused.set(false);
    playing.set(true);
    seeking.set(false);
    ended.set(false);
    if (this.#request.looping) {
      this.#request.looping = false;
      return;
    }
    if (live() && !started() && currentTime() === 0) {
      const end = liveSyncPosition() ?? seekableEnd() - 2;
      if (Number.isFinite(end)) this.#media.$provider().setCurrentTime(end);
    }
    this["started"](event);
  }
  ["started"](event) {
    const { started } = this.$state;
    if (!started()) {
      started.set(true);
      this.handle(this.createEvent("started", { trigger: event }));
    }
  }
  ["pause"](event) {
    if (!this.el?.isConnected) {
      this.#isPlayingOnDisconnect = true;
    }
    this.#satisfyRequest("media-pause-request", event);
    const seekedEvent = this.#trackedEvents.get("seeked");
    if (seekedEvent) event.triggers.add(seekedEvent);
    const { paused, playing } = this.$state;
    paused.set(true);
    playing.set(false);
    if (this.#clipEnded) {
      setTimeout(() => {
        this.handle(this.createEvent("end", { trigger: event }));
        this.#clipEnded = false;
      }, 0);
    }
    this.#resetTracking();
  }
  ["time-change"](event) {
    if (this.#request.looping) {
      event.stopImmediatePropagation();
      return;
    }
    let { waiting, played, clipEndTime, realCurrentTime, currentTime } = this.$state, newTime = event.detail, endTime = clipEndTime();
    realCurrentTime.set(newTime);
    this.#updatePlayed();
    waiting.set(false);
    for (const track of this.#media.textTracks) {
      track[TextTrackSymbol.updateActiveCues](newTime, event);
    }
    if (endTime > 0 && newTime >= endTime) {
      this.#clipEnded = true;
      this.dispatch("media-pause-request", { trigger: event });
    }
    this.#saveTime();
    this.dispatch("time-update", {
      detail: { currentTime: currentTime(), played: played() },
      trigger: event
    });
  }
  #updatePlayed() {
    const { currentTime, played, paused } = this.$state;
    if (paused()) return;
    this.#playedInterval = updateTimeIntervals(
      this.#playedIntervals,
      this.#playedInterval,
      currentTime()
    );
    played.set(new TimeRange(this.#playedIntervals));
  }
  // Called to update time again incase duration precision has changed.
  #onEndPrecisionChange(trigger) {
    const { clipStartTime, clipEndTime, duration } = this.$state, isClipped = clipStartTime() > 0 || clipEndTime() > 0;
    if (isClipped) return;
    this.handle(
      this.createEvent("time-change", {
        detail: duration(),
        trigger
      })
    );
  }
  #saveTime() {
    const { storage } = this.#media, { canPlay, realCurrentTime } = this.$state;
    if (canPlay()) {
      storage?.setTime?.(realCurrentTime());
    }
  }
  ["audio-gain-change"](event) {
    const { storage } = this.#media, { canPlay, audioGain } = this.$state;
    audioGain.set(event.detail);
    this.#satisfyRequest("media-audio-gain-change-request", event);
    if (canPlay()) storage?.setAudioGain?.(audioGain());
  }
  ["volume-change"](event) {
    const { storage } = this.#media, { volume, muted, canPlay } = this.$state, detail = event.detail;
    volume.set(detail.volume);
    muted.set(detail.muted || detail.volume === 0);
    this.#satisfyRequest("media-volume-change-request", event);
    this.#satisfyRequest(detail.muted ? "media-mute-request" : "media-unmute-request", event);
    if (canPlay()) {
      storage?.setVolume?.(volume());
      storage?.setMuted?.(muted());
    }
  }
  ["seeking"] = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.functionThrottle)(
    (event) => {
      const { seeking, realCurrentTime, paused } = this.$state;
      seeking.set(true);
      realCurrentTime.set(event.detail);
      this.#satisfyRequest("media-seeking-request", event);
      if (paused()) {
        this.#waitingTrigger = event;
        this.#fireWaiting();
      }
      this.#playedInterval = [-1, -1];
    },
    150,
    { leading: true }
  );
  ["seeked"](event) {
    const { seeking, currentTime, realCurrentTime, paused, seekableEnd, ended, live } = this.$state;
    if (this.#request.seeking) {
      seeking.set(true);
      event.stopImmediatePropagation();
    } else if (seeking()) {
      const waitingEvent = this.#trackedEvents.get("waiting");
      if (waitingEvent) event.triggers.add(waitingEvent);
      const seekingEvent = this.#trackedEvents.get("seeking");
      if (seekingEvent && !event.triggers.has(seekingEvent)) {
        event.triggers.add(seekingEvent);
      }
      if (paused()) this.#stopWaiting();
      seeking.set(false);
      realCurrentTime.set(event.detail);
      this.#satisfyRequest("media-seek-request", event);
      const origin = event?.originEvent;
      if (origin?.isTrusted && !(origin instanceof MessageEvent) && !/seek/.test(origin.type)) {
        this["started"](event);
      }
    }
    if (!live()) {
      if (Math.floor(currentTime()) !== Math.floor(seekableEnd())) {
        ended.set(false);
      } else {
        this.end(event);
      }
    }
  }
  ["waiting"](event) {
    if (this.#firingWaiting || this.#request.seeking) return;
    event.stopImmediatePropagation();
    this.#waitingTrigger = event;
    this.#fireWaiting();
  }
  #fireWaiting = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.functionDebounce)(() => {
    if (!this.#waitingTrigger) return;
    this.#firingWaiting = true;
    const { waiting, playing } = this.$state;
    waiting.set(true);
    playing.set(false);
    const event = this.createEvent("waiting", { trigger: this.#waitingTrigger });
    this.#trackedEvents.set("waiting", event);
    this.dispatch(event);
    this.#waitingTrigger = void 0;
    this.#firingWaiting = false;
  }, 300);
  ["end"](event) {
    const { loop, ended } = this.$state;
    if (!loop() && ended()) return;
    if (loop()) {
      setTimeout(() => {
        requestAnimationFrame(() => {
          this.#resetPlaybackIfNeeded(event);
          this.dispatch("media-loop-request", { trigger: event });
        });
      }, 10);
      return;
    }
    setTimeout(() => this.#onEnded(event), 0);
  }
  #onEnded(event) {
    const { storage } = this.#media, { paused, seeking, ended, duration } = this.$state;
    this.#onEndPrecisionChange(event);
    if (!paused()) {
      this.dispatch("pause", { trigger: event });
    }
    if (seeking()) {
      this.dispatch("seeked", {
        detail: duration(),
        trigger: event
      });
    }
    ended.set(true);
    this.#resetTracking();
    storage?.setTime?.(duration(), true);
    this.dispatch("ended", {
      trigger: event
    });
  }
  #stopWaiting() {
    this.#fireWaiting.cancel();
    this.$state.waiting.set(false);
  }
  ["fullscreen-change"](event) {
    const isFullscreen = event.detail;
    this.$state.fullscreen.set(isFullscreen);
    this.#satisfyRequest(
      isFullscreen ? "media-enter-fullscreen-request" : "media-exit-fullscreen-request",
      event
    );
  }
  ["fullscreen-error"](event) {
    this.#satisfyRequest("media-enter-fullscreen-request", event);
    this.#satisfyRequest("media-exit-fullscreen-request", event);
  }
  ["orientation-change"](event) {
    const isLocked = event.detail.lock;
    this.#satisfyRequest(
      isLocked ? "media-orientation-lock-request" : "media-orientation-unlock-request",
      event
    );
  }
  ["picture-in-picture-change"](event) {
    const isPiP = event.detail;
    this.$state.pictureInPicture.set(isPiP);
    this.#satisfyRequest(isPiP ? "media-enter-pip-request" : "media-exit-pip-request", event);
  }
  ["picture-in-picture-error"](event) {
    this.#satisfyRequest("media-enter-pip-request", event);
    this.#satisfyRequest("media-exit-pip-request", event);
  }
  ["title-change"](event) {
    if (!event.trigger) return;
    event.stopImmediatePropagation();
    this.$state.inferredTitle.set(event.detail);
  }
  ["poster-change"](event) {
    if (!event.trigger) return;
    event.stopImmediatePropagation();
    this.$state.inferredPoster.set(event.detail);
  }
}

class MediaStateSync extends MediaPlayerController {
  onSetup() {
    this.#init();
    if (IS_SERVER) return;
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#watchLogLevel.bind(this));
    const effects = [
      this.#watchMetadata,
      this.#watchAutoplay,
      this.#watchClipStartTime,
      this.#watchClipEndTime,
      this.#watchControls,
      this.#watchCrossOrigin,
      this.#watchDuration,
      this.#watchLive,
      this.#watchLiveEdge,
      this.#watchLiveTolerance,
      this.#watchLoop,
      this.#watchPlaysInline,
      this.#watchPoster,
      this.#watchProvidedTypes,
      this.#watchTitle
    ];
    for (const callback of effects) {
      (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(callback.bind(this));
    }
  }
  #init() {
    const providedProps = {
      duration: "providedDuration",
      loop: "providedLoop",
      poster: "providedPoster",
      streamType: "providedStreamType",
      title: "providedTitle",
      viewType: "providedViewType"
    };
    const skip = /* @__PURE__ */ new Set([
      "currentTime",
      "paused",
      "playbackRate",
      "volume"
    ]);
    for (const prop of Object.keys(this.$props)) {
      if (skip.has(prop)) continue;
      this.$state[providedProps[prop] ?? prop]?.set(this.$props[prop]());
    }
    this.$state.muted.set(this.$props.muted() || this.$props.volume() === 0);
  }
  // Sync "provided" props with internal state. Provided props are used to differentiate from
  // provider inferred values.
  #watchProvidedTypes() {
    const { viewType, streamType, title, poster, loop } = this.$props, $state = this.$state;
    $state.providedPoster.set(poster());
    $state.providedStreamType.set(streamType());
    $state.providedViewType.set(viewType());
    $state.providedTitle.set(title());
    $state.providedLoop.set(loop());
  }
  #watchLogLevel() {
    this.$state.logLevel.set(this.$props.logLevel());
  }
  #watchMetadata() {
    const { artist, artwork } = this.$props;
    this.$state.artist.set(artist());
    this.$state.artwork.set(artwork());
  }
  #watchTitle() {
    const { title } = this.$state;
    this.dispatch("title-change", { detail: title() });
  }
  #watchAutoplay() {
    const autoPlay = this.$props.autoPlay() || this.$props.autoplay();
    this.$state.autoPlay.set(autoPlay);
    this.dispatch("auto-play-change", { detail: autoPlay });
  }
  #watchLoop() {
    const loop = this.$state.loop();
    this.dispatch("loop-change", { detail: loop });
  }
  #watchControls() {
    const controls = this.$props.controls();
    this.$state.controls.set(controls);
  }
  #watchPoster() {
    const { poster } = this.$state;
    this.dispatch("poster-change", { detail: poster() });
  }
  #watchCrossOrigin() {
    const crossOrigin = this.$props.crossOrigin() ?? this.$props.crossorigin(), value = crossOrigin === true ? "" : crossOrigin;
    this.$state.crossOrigin.set(value);
  }
  #watchDuration() {
    const { duration } = this.$props;
    this.dispatch("media-duration-change-request", {
      detail: duration()
    });
  }
  #watchPlaysInline() {
    const inline = this.$props.playsInline() || this.$props.playsinline();
    this.$state.playsInline.set(inline);
    this.dispatch("plays-inline-change", { detail: inline });
  }
  #watchClipStartTime() {
    const { clipStartTime } = this.$props;
    this.dispatch("media-clip-start-change-request", {
      detail: clipStartTime()
    });
  }
  #watchClipEndTime() {
    const { clipEndTime } = this.$props;
    this.dispatch("media-clip-end-change-request", {
      detail: clipEndTime()
    });
  }
  #watchLive() {
    this.dispatch("live-change", { detail: this.$state.live() });
  }
  #watchLiveTolerance() {
    this.$state.liveEdgeTolerance.set(this.$props.liveEdgeTolerance());
    this.$state.minLiveDVRWindow.set(this.$props.minLiveDVRWindow());
  }
  #watchLiveEdge() {
    this.dispatch("live-edge-change", { detail: this.$state.liveEdge() });
  }
}

const actions = ["play", "pause", "seekforward", "seekbackward", "seekto"];
class NavigatorMediaSession extends MediaPlayerController {
  onConnect() {
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#onMetadataChange.bind(this));
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#onPlaybackStateChange.bind(this));
    const handleAction = this.#handleAction.bind(this);
    for (const action of actions) {
      navigator.mediaSession.setActionHandler(action, handleAction);
    }
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.onDispose)(this.#onDisconnect.bind(this));
  }
  #onDisconnect() {
    for (const action of actions) {
      navigator.mediaSession.setActionHandler(action, null);
    }
  }
  #onMetadataChange() {
    const { title, artist, artwork, poster } = this.$state;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: title(),
      artist: artist(),
      artwork: artwork() ?? [{ src: poster() }]
    });
  }
  #onPlaybackStateChange() {
    const { canPlay, paused } = this.$state;
    navigator.mediaSession.playbackState = !canPlay() ? "none" : paused() ? "paused" : "playing";
  }
  #handleAction(details) {
    const trigger = new _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.DOMEvent(`media-session-action`, { detail: details });
    switch (details.action) {
      case "play":
        this.dispatch("media-play-request", { trigger });
        break;
      case "pause":
        this.dispatch("media-pause-request", { trigger });
        break;
      case "seekto":
      case "seekforward":
      case "seekbackward":
        this.dispatch("media-seek-request", {
          detail: (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isNumber)(details.seekTime) ? details.seekTime : this.$state.currentTime() + (details.seekOffset ?? (details.action === "seekforward" ? 10 : -10)),
          trigger
        });
        break;
    }
  }
}

const LOCAL_STORAGE_KEY = "@vidstack/log-colors";
const savedColors = init();
function getLogColor(key) {
  return savedColors.get(key);
}
function saveLogColor(key, { color = generateColor(), overwrite = false } = {}) {
  if (!savedColors.has(key) || overwrite) {
    savedColors.set(key, color);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(Object.entries(savedColors)));
  }
}
function generateColor() {
  return `hsl(${Math.random() * 360}, 55%, 70%)`;
}
function init() {
  let colors;
  try {
    colors = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
  } catch {
  }
  return new Map(Object.entries(colors ?? {}));
}

const LogLevelValue = Object.freeze({
  silent: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4
});
const LogLevelColor = Object.freeze({
  silent: "white",
  error: "hsl(6, 58%, 50%)",
  warn: "hsl(51, 58%, 50%)",
  info: "hsl(219, 58%, 50%)",
  debug: "hsl(280, 58%, 50%)"
});

const s = 1e3;
const m = s * 60;
const h = m * 60;
const d = h * 24;
function ms(val) {
  const msAbs = Math.abs(val);
  if (msAbs >= d) {
    return Math.round(val / d) + "d";
  }
  if (msAbs >= h) {
    return Math.round(val / h) + "h";
  }
  if (msAbs >= m) {
    return Math.round(val / m) + "m";
  }
  if (msAbs >= s) {
    return Math.round(val / s) + "s";
  }
  return round(val, 2) + "ms";
}

class LogPrinter extends _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.ViewController {
  #level = "warn" ;
  #lastLogged;
  /**
   * The current log level.
   */
  get logLevel() {
    return this.#level ;
  }
  set logLevel(level) {
    this.#level = level;
  }
  onConnect() {
    this.listen("vds-log", (event) => {
      event.stopPropagation();
      const element = event.path?.[0] ?? (event.target instanceof _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.ViewController ? event.target.el : event.target), eventTargetName = element?.$$COMPONENT_NAME?.replace(/^_/, "").replace(/Instance$/, "") ?? element?.tagName.toLowerCase() ?? "unknown";
      const { level = "warn", data } = event.detail ?? {};
      if (LogLevelValue[this.#level] < LogLevelValue[level]) {
        return;
      }
      saveLogColor(eventTargetName);
      const hint = data?.length === 1 && isGroupedLog(data[0]) ? data[0].title : (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isString)(data?.[0]) ? data[0] : "";
      console.groupCollapsed(
        `%c${level.toUpperCase()}%c ${eventTargetName}%c ${hint.slice(0, 50)}${hint.length > 50 ? "..." : ""}`,
        `background: ${LogLevelColor[level]}; color: white; padding: 1.5px 2.2px; border-radius: 2px; font-size: 11px;`,
        `color: ${getLogColor(eventTargetName)}; padding: 4px 0px; font-size: 11px;`,
        "color: gray; font-size: 11px; padding-left: 4px;"
      );
      if (data?.length === 1 && isGroupedLog(data[0])) {
        if (element) data[0].logs.unshift({ label: "Element", data: [element] });
        printGroup(level, data[0]);
      } else if (data) {
        print(level, ...data);
      }
      this.#printTimeDiff();
      printStackTrace();
      console.groupEnd();
    });
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.onDispose)(() => {
      this.#lastLogged = void 0;
    });
  }
  #printTimeDiff() {
    labelledPrint("Time since last log", this.#calcLastLogTimeDiff());
  }
  #calcLastLogTimeDiff() {
    const time = performance.now();
    const diff = time - (this.#lastLogged ?? (this.#lastLogged = performance.now()));
    this.#lastLogged = time;
    return ms(diff);
  }
}
function print(level, ...data) {
  console[level](...data);
}
function labelledPrint(label, ...data) {
  console.log(`%c${label}:`, "color: gray", ...data);
}
function printStackTrace() {
  console.groupCollapsed("%cStack Trace", "color: gray");
  console.trace();
  console.groupEnd();
}
function printGroup(level, groupedLog) {
  for (const log of groupedLog.logs) {
    if (isGroupedLog(log)) {
      console.groupCollapsed(groupedLog.title);
      printGroup(level, log);
      console.groupEnd();
    } else if ("label" in log && !(0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isUndefined)(log.label)) {
      labelledPrint(log.label, ...log.data);
    } else {
      print(level, ...log.data);
    }
  }
}

let $keyboard = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.signal)(false);
if (!IS_SERVER) {
  (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.listenEvent)(document, "pointerdown", () => {
    $keyboard.set(false);
  });
  (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.listenEvent)(document, "keydown", (e) => {
    if (e.metaKey || e.altKey || e.ctrlKey) return;
    $keyboard.set(true);
  });
}
class FocusVisibleController extends _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.ViewController {
  #focused = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.signal)(false);
  onConnect(el) {
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(() => {
      const events = new _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.EventsController(el);
      if (!$keyboard()) {
        this.#focused.set(false);
        updateFocusAttr(el, false);
        events.add("pointerenter", this.#onPointerEnter.bind(this)).add("pointerleave", this.#onPointerLeave.bind(this));
        return;
      }
      const active = document.activeElement === el;
      this.#focused.set(active);
      updateFocusAttr(el, active);
      events.add("focus", this.#onFocus.bind(this)).add("blur", this.#onBlur.bind(this));
    });
  }
  focused() {
    return this.#focused();
  }
  #onFocus() {
    this.#focused.set(true);
    updateFocusAttr(this.el, true);
  }
  #onBlur() {
    this.#focused.set(false);
    updateFocusAttr(this.el, false);
  }
  #onPointerEnter() {
    updateHoverAttr(this.el, true);
  }
  #onPointerLeave() {
    updateHoverAttr(this.el, false);
  }
}
function updateFocusAttr(el, isFocused) {
  (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.setAttribute)(el, "data-focus", isFocused);
  (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.setAttribute)(el, "data-hocus", isFocused);
}
function updateHoverAttr(el, isHovering) {
  (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.setAttribute)(el, "data-hocus", isHovering);
  (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.setAttribute)(el, "data-hover", isHovering);
}

class MediaPlayer extends _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.Component {
  static props = mediaPlayerProps;
  static state = mediaState;
  #media;
  #stateMgr;
  #requestMgr;
  canPlayQueue = new RequestQueue();
  remoteControl;
  get #provider() {
    return this.#media.$provider();
  }
  get #props() {
    return this.$props;
  }
  constructor() {
    super();
    new MediaStateSync();
    const context = {
      player: this,
      qualities: new VideoQualityList(),
      audioTracks: new AudioTrackList(),
      storage: null,
      $provider: (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.signal)(null),
      $providerSetup: (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.signal)(false),
      $props: this.$props,
      $state: this.$state
    };
    {
      const logPrinter = new LogPrinter();
      (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(() => {
        logPrinter.logLevel = this.$props.logLevel();
      });
    }
    context.logger = new Logger();
    context.remote = this.remoteControl = new MediaRemoteControl(
      context.logger 
    );
    context.remote.setPlayer(this);
    context.textTracks = new TextTrackList();
    context.textTracks[TextTrackSymbol.crossOrigin] = this.$state.crossOrigin;
    context.textRenderers = new TextRenderers(context);
    context.ariaKeys = {};
    this.#media = context;
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.provideContext)(mediaContext, context);
    this.orientation = new ScreenOrientationController();
    new FocusVisibleController();
    new MediaKeyboardController(context);
    new MediaEventsLogger(context);
    const request = new MediaRequestContext();
    this.#stateMgr = new MediaStateManager(request, context);
    this.#requestMgr = new MediaRequestManager(this.#stateMgr, request, context);
    context.delegate = new MediaPlayerDelegate(this.#stateMgr.handle.bind(this.#stateMgr), context);
    context.notify = context.delegate.notify.bind(context.delegate);
    if (typeof navigator !== "undefined" && "mediaSession" in navigator) {
      new NavigatorMediaSession();
    }
    new MediaLoadController("load", this.startLoading.bind(this));
    new MediaLoadController("posterLoad", this.startLoadingPoster.bind(this));
  }
  onSetup() {
    this.#setupMediaAttributes();
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#watchCanPlay.bind(this));
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#watchMuted.bind(this));
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#watchPaused.bind(this));
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#watchVolume.bind(this));
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#watchCurrentTime.bind(this));
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#watchPlaysInline.bind(this));
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#watchPlaybackRate.bind(this));
  }
  onAttach(el) {
    el.setAttribute("data-media-player", "");
    setAttributeIfEmpty(el, "tabindex", "0");
    setAttributeIfEmpty(el, "role", "region");
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#watchStorage.bind(this));
    if (IS_SERVER) this.#watchTitle();
    else (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#watchTitle.bind(this));
    if (IS_SERVER) this.#watchOrientation();
    else (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#watchOrientation.bind(this));
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.listenEvent)(el, "find-media-player", this.#onFindPlayer.bind(this));
  }
  onConnect(el) {
    if (IS_IPHONE) (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.setAttribute)(el, "data-iphone", "");
    const pointerQuery = window.matchMedia("(pointer: coarse)");
    this.#onPointerChange(pointerQuery);
    pointerQuery.onchange = this.#onPointerChange.bind(this);
    const resize = new ResizeObserver((0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.animationFrameThrottle)(this.#onResize.bind(this)));
    resize.observe(el);
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#onResize.bind(this));
    this.dispatch("media-player-connect", {
      detail: this,
      bubbles: true,
      composed: true
    });
    this.#media.logger.setTarget(el);
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.onDispose)(() => {
      resize.disconnect();
      pointerQuery.onchange = null;
      this.#media.logger.setTarget(null);
    });
  }
  onDestroy() {
    this.#media.player = null;
    this.canPlayQueue.reset();
  }
  #skipTitleUpdate = false;
  #watchTitle() {
    const el = this.$el, { title, live, viewType, providedTitle } = this.$state, isLive = live(), type = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.uppercaseFirstChar)(viewType()), typeText = type !== "Unknown" ? `${isLive ? "Live " : ""}${type}` : isLive ? "Live" : "Media", currentTitle = title();
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.setAttribute)(
      this.el,
      "aria-label",
      `${typeText} Player` + (currentTitle ? ` - ${currentTitle}` : "")
    );
    if (!IS_SERVER && el?.hasAttribute("title")) {
      this.#skipTitleUpdate = true;
      el?.removeAttribute("title");
    }
  }
  #watchOrientation() {
    const orientation = this.orientation.landscape ? "landscape" : "portrait";
    this.$state.orientation.set(orientation);
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.setAttribute)(this.el, "data-orientation", orientation);
    this.#onResize();
  }
  #watchCanPlay() {
    if (this.$state.canPlay() && this.#provider) this.canPlayQueue.start();
    else this.canPlayQueue.stop();
  }
  #setupMediaAttributes() {
    if (MediaPlayer[MEDIA_ATTRIBUTES]) {
      this.setAttributes(MediaPlayer[MEDIA_ATTRIBUTES]);
      return;
    }
    const $attrs = {
      "data-load": function() {
        return this.$props.load();
      },
      "data-captions": function() {
        const track = this.$state.textTrack();
        return !!track && isTrackCaptionKind(track);
      },
      "data-ios-controls": function() {
        return this.$state.iOSControls();
      },
      "data-controls": function() {
        return this.controls.showing;
      },
      "data-buffering": function() {
        const { canLoad, canPlay, waiting } = this.$state;
        return canLoad() && (!canPlay() || waiting());
      },
      "data-error": function() {
        const { error } = this.$state;
        return !!error();
      },
      "data-autoplay-error": function() {
        const { autoPlayError } = this.$state;
        return !!autoPlayError();
      }
    };
    const alias = {
      autoPlay: "autoplay",
      canAirPlay: "can-airplay",
      canPictureInPicture: "can-pip",
      pictureInPicture: "pip",
      playsInline: "playsinline",
      remotePlaybackState: "remote-state",
      remotePlaybackType: "remote-type",
      isAirPlayConnected: "airplay",
      isGoogleCastConnected: "google-cast"
    };
    for (const prop2 of mediaAttributes) {
      const attrName = "data-" + (alias[prop2] ?? (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.camelToKebabCase)(prop2));
      $attrs[attrName] = function() {
        return this.$state[prop2]();
      };
    }
    delete $attrs.title;
    MediaPlayer[MEDIA_ATTRIBUTES] = $attrs;
    this.setAttributes($attrs);
  }
  #onFindPlayer(event) {
    event.detail(this);
  }
  #onResize() {
    if (IS_SERVER || !this.el) return;
    const width = this.el.clientWidth, height = this.el.clientHeight;
    this.$state.width.set(width);
    this.$state.height.set(height);
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.setStyle)(this.el, "--player-width", width + "px");
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.setStyle)(this.el, "--player-height", height + "px");
  }
  #onPointerChange(queryList) {
    if (IS_SERVER) return;
    const pointer = queryList.matches ? "coarse" : "fine";
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.setAttribute)(this.el, "data-pointer", pointer);
    this.$state.pointer.set(pointer);
    this.#onResize();
  }
  /**
   * The current media provider.
   */
  get provider() {
    return this.#provider;
  }
  /**
   * Media controls settings.
   */
  get controls() {
    return this.#requestMgr.controls;
  }
  set controls(controls) {
    this.#props.controls.set(controls);
  }
  /**
   * Controls the screen orientation of the current browser window and dispatches orientation
   * change events on the player.
   */
  orientation;
  /**
   * The title of the current media.
   */
  get title() {
    return (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.peek)(this.$state.title);
  }
  set title(newTitle) {
    if (this.#skipTitleUpdate) {
      this.#skipTitleUpdate = false;
      return;
    }
    this.#props.title.set(newTitle);
  }
  /**
   * A list of all `VideoQuality` objects representing the set of available video renditions.
   *
   * @see {@link https://vidstack.io/docs/player/api/video-quality}
   */
  get qualities() {
    return this.#media.qualities;
  }
  /**
   * A list of all `AudioTrack` objects representing the set of available audio tracks.
   *
   * @see {@link https://vidstack.io/docs/player/api/audio-tracks}
   */
  get audioTracks() {
    return this.#media.audioTracks;
  }
  /**
   * A list of all `TextTrack` objects representing the set of available text tracks.
   *
   * @see {@link https://vidstack.io/docs/player/api/text-tracks}
   */
  get textTracks() {
    return this.#media.textTracks;
  }
  /**
   * Contains text renderers which are responsible for loading, parsing, and rendering text
   * tracks.
   */
  get textRenderers() {
    return this.#media.textRenderers;
  }
  get duration() {
    return this.$state.duration();
  }
  set duration(duration) {
    this.#props.duration.set(duration);
  }
  get paused() {
    return (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.peek)(this.$state.paused);
  }
  set paused(paused) {
    this.#queuePausedUpdate(paused);
  }
  #watchPaused() {
    this.#queuePausedUpdate(this.$props.paused());
  }
  #queuePausedUpdate(paused) {
    if (paused) {
      this.canPlayQueue.enqueue("paused", () => this.#requestMgr.pause());
    } else this.canPlayQueue.enqueue("paused", () => this.#requestMgr.play());
  }
  get muted() {
    return (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.peek)(this.$state.muted);
  }
  set muted(muted) {
    this.#queueMutedUpdate(muted);
  }
  #watchMuted() {
    this.#queueMutedUpdate(this.$props.muted());
  }
  #queueMutedUpdate(muted) {
    this.canPlayQueue.enqueue("muted", () => {
      if (this.#provider) this.#provider.setMuted(muted);
    });
  }
  get currentTime() {
    return (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.peek)(this.$state.currentTime);
  }
  set currentTime(time) {
    this.#queueCurrentTimeUpdate(time);
  }
  #watchCurrentTime() {
    this.#queueCurrentTimeUpdate(this.$props.currentTime());
  }
  #queueCurrentTimeUpdate(time) {
    this.canPlayQueue.enqueue("currentTime", () => {
      const { currentTime } = this.$state;
      if (time === (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.peek)(currentTime)) return;
      (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.peek)(() => {
        if (!this.#provider) return;
        const boundedTime = boundTime(time, this.$state);
        if (Number.isFinite(boundedTime)) {
          this.#provider.setCurrentTime(boundedTime);
        }
      });
    });
  }
  get volume() {
    return (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.peek)(this.$state.volume);
  }
  set volume(volume) {
    this.#queueVolumeUpdate(volume);
  }
  #watchVolume() {
    this.#queueVolumeUpdate(this.$props.volume());
  }
  #queueVolumeUpdate(volume) {
    const clampedVolume = clampNumber(0, volume, 1);
    this.canPlayQueue.enqueue("volume", () => {
      if (this.#provider) this.#provider.setVolume(clampedVolume);
    });
  }
  get playbackRate() {
    return (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.peek)(this.$state.playbackRate);
  }
  set playbackRate(rate) {
    this.#queuePlaybackRateUpdate(rate);
  }
  #watchPlaybackRate() {
    this.#queuePlaybackRateUpdate(this.$props.playbackRate());
  }
  #queuePlaybackRateUpdate(rate) {
    this.canPlayQueue.enqueue("rate", () => {
      if (this.#provider) this.#provider.setPlaybackRate?.(rate);
    });
  }
  #watchPlaysInline() {
    this.#queuePlaysInlineUpdate(this.$props.playsInline());
  }
  #queuePlaysInlineUpdate(inline) {
    this.canPlayQueue.enqueue("playsinline", () => {
      if (this.#provider) this.#provider.setPlaysInline?.(inline);
    });
  }
  #watchStorage() {
    let storageValue = this.$props.storage(), storage = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isString)(storageValue) ? new LocalMediaStorage() : storageValue;
    if (storage?.onChange) {
      const { source } = this.$state, playerId = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isString)(storageValue) ? storageValue : this.el?.id, mediaId = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.computed)(this.#computeMediaId.bind(this));
      (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(() => storage.onChange(source(), mediaId(), playerId || void 0));
    }
    this.#media.storage = storage;
    this.#media.textTracks.setStorage(storage);
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.onDispose)(() => {
      storage?.onDestroy?.();
      this.#media.storage = null;
      this.#media.textTracks.setStorage(null);
    });
  }
  #computeMediaId() {
    const { clipStartTime, clipEndTime } = this.$props, { source } = this.$state, src = source();
    return src.src ? `${src.src}:${clipStartTime()}:${clipEndTime()}` : null;
  }
  /**
   * Begins/resumes playback of the media. If this method is called programmatically before the
   * user has interacted with the player, the promise may be rejected subject to the browser's
   * autoplay policies. This method will throw if called before media is ready for playback.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play}
   */
  async play(trigger) {
    return this.#requestMgr.play(trigger);
  }
  /**
   * Pauses playback of the media. This method will throw if called before media is ready for
   * playback.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause}
   */
  async pause(trigger) {
    return this.#requestMgr.pause(trigger);
  }
  /**
   * Attempts to display the player in fullscreen. The promise will resolve if successful, and
   * reject if not. This method will throw if any fullscreen API is _not_ currently available.
   *
   * @see {@link https://vidstack.io/docs/player/api/fullscreen}
   */
  async enterFullscreen(target, trigger) {
    return this.#requestMgr.enterFullscreen(target, trigger);
  }
  /**
   * Attempts to display the player inline by exiting fullscreen. This method will throw if any
   * fullscreen API is _not_ currently available.
   *
   * @see {@link https://vidstack.io/docs/player/api/fullscreen}
   */
  async exitFullscreen(target, trigger) {
    return this.#requestMgr.exitFullscreen(target, trigger);
  }
  /**
   * Attempts to display the player in picture-in-picture mode. This method will throw if PIP is
   * not supported. This method will also return a `PictureInPictureWindow` if the current
   * provider supports it.
   *
   * @see {@link https://vidstack.io/docs/player/api/picture-in-picture}
   */
  enterPictureInPicture(trigger) {
    return this.#requestMgr.enterPictureInPicture(trigger);
  }
  /**
   * Attempts to display the player in inline by exiting picture-in-picture mode. This method
   * will throw if not supported.
   *
   * @see {@link https://vidstack.io/docs/player/api/picture-in-picture}
   */
  exitPictureInPicture(trigger) {
    return this.#requestMgr.exitPictureInPicture(trigger);
  }
  /**
   * Sets the current time to the live edge (i.e., `duration`). This is a no-op for non-live
   * streams and will throw if called before media is ready for playback.
   *
   * @see {@link https://vidstack.io/docs/player/api/live}
   */
  seekToLiveEdge(trigger) {
    this.#requestMgr.seekToLiveEdge(trigger);
  }
  /**
   * Called when media can begin loading. Calling this method will trigger the initial provider
   * loading process. Calling it more than once has no effect.
   *
   * @see {@link https://vidstack.io/docs/player/core-concepts/loading#load-strategies}
   */
  startLoading(trigger) {
    this.#media.notify("can-load", void 0, trigger);
  }
  /**
   * Called when the poster image can begin loading. Calling it more than once has no effect.
   *
   * @see {@link https://vidstack.io/docs/player/core-concepts/loading#load-strategies}
   */
  startLoadingPoster(trigger) {
    this.#media.notify("can-load-poster", void 0, trigger);
  }
  /**
   * Request Apple AirPlay picker to open.
   */
  requestAirPlay(trigger) {
    return this.#requestMgr.requestAirPlay(trigger);
  }
  /**
   * Request Google Cast device picker to open. The Google Cast framework will be loaded if it
   * hasn't yet.
   */
  requestGoogleCast(trigger) {
    return this.#requestMgr.requestGoogleCast(trigger);
  }
  /**
   * Set the audio gain, amplifying volume and enabling a maximum volume above 100%.
   *
   * @see {@link https://vidstack.io/docs/player/api/audio-gain}
   */
  setAudioGain(gain, trigger) {
    return this.#requestMgr.setAudioGain(gain, trigger);
  }
  destroy() {
    super.destroy();
    this.#media.remote.setPlayer(null);
    this.dispatch("destroy");
  }
}
const mediaplayer__proto = MediaPlayer.prototype;
(0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.prop)(mediaplayer__proto, "canPlayQueue");
(0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.prop)(mediaplayer__proto, "remoteControl");
(0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.prop)(mediaplayer__proto, "provider");
(0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.prop)(mediaplayer__proto, "controls");
(0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.prop)(mediaplayer__proto, "orientation");
(0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.prop)(mediaplayer__proto, "title");
(0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.prop)(mediaplayer__proto, "qualities");
(0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.prop)(mediaplayer__proto, "audioTracks");
(0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.prop)(mediaplayer__proto, "textTracks");
(0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.prop)(mediaplayer__proto, "textRenderers");
(0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.prop)(mediaplayer__proto, "duration");
(0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.prop)(mediaplayer__proto, "paused");
(0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.prop)(mediaplayer__proto, "muted");
(0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.prop)(mediaplayer__proto, "currentTime");
(0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.prop)(mediaplayer__proto, "volume");
(0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.prop)(mediaplayer__proto, "playbackRate");
(0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.method)(mediaplayer__proto, "play");
(0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.method)(mediaplayer__proto, "pause");
(0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.method)(mediaplayer__proto, "enterFullscreen");
(0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.method)(mediaplayer__proto, "exitFullscreen");
(0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.method)(mediaplayer__proto, "enterPictureInPicture");
(0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.method)(mediaplayer__proto, "exitPictureInPicture");
(0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.method)(mediaplayer__proto, "seekToLiveEdge");
(0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.method)(mediaplayer__proto, "startLoading");
(0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.method)(mediaplayer__proto, "startLoadingPoster");
(0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.method)(mediaplayer__proto, "requestAirPlay");
(0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.method)(mediaplayer__proto, "requestGoogleCast");
(0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.method)(mediaplayer__proto, "setAudioGain");

function resolveStreamTypeFromDASHManifest(manifestSrc, requestInit) {
  return fetch(manifestSrc, requestInit).then((res) => res.text()).then((manifest) => {
    return /type="static"/.test(manifest) ? "on-demand" : "live";
  });
}
function resolveStreamTypeFromHLSManifest(manifestSrc, requestInit) {
  return fetch(manifestSrc, requestInit).then((res) => res.text()).then((manifest) => {
    const renditionURI = resolveHLSRenditionURI(manifest);
    if (renditionURI) {
      return resolveStreamTypeFromHLSManifest(
        /^https?:/.test(renditionURI) ? renditionURI : new URL(renditionURI, manifestSrc).href,
        requestInit
      );
    }
    const streamType = /EXT-X-PLAYLIST-TYPE:\s*VOD/.test(manifest) ? "on-demand" : "live";
    if (streamType === "live" && resolveTargetDuration(manifest) >= 10 && (/#EXT-X-DVR-ENABLED:\s*true/.test(manifest) || manifest.includes("#EXT-X-DISCONTINUITY"))) {
      return "live:dvr";
    }
    return streamType;
  });
}
function resolveHLSRenditionURI(manifest) {
  const matches = manifest.match(/#EXT-X-STREAM-INF:[^\n]+(\n[^\n]+)*/g);
  return matches ? matches[0].split("\n")[1].trim() : null;
}
function resolveTargetDuration(manifest) {
  const lines = manifest.split("\n");
  for (const line of lines) {
    if (line.startsWith("#EXT-X-TARGETDURATION")) {
      const duration = parseFloat(line.split(":")[1]);
      if (!isNaN(duration)) {
        return duration;
      }
    }
  }
  return -1;
}

let warned$1 = /* @__PURE__ */ new Set() ;
const sourceTypes = /* @__PURE__ */ new Map();
class SourceSelection {
  #initialize = false;
  #loaders;
  #domSources;
  #media;
  #loader;
  constructor(domSources, media, loader, customLoaders = []) {
    this.#domSources = domSources;
    this.#media = media;
    this.#loader = loader;
    const DASH_LOADER = new DASHProviderLoader(), HLS_LOADER = new HLSProviderLoader(), VIDEO_LOADER = new VideoProviderLoader(), AUDIO_LOADER = new AudioProviderLoader(), YOUTUBE_LOADER = new YouTubeProviderLoader(), VIMEO_LOADER = new VimeoProviderLoader(), EMBED_LOADERS = [YOUTUBE_LOADER, VIMEO_LOADER];
    this.#loaders = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.computed)(() => {
      const remoteLoader = media.$state.remotePlaybackLoader();
      const loaders = media.$props.preferNativeHLS() ? [VIDEO_LOADER, AUDIO_LOADER, DASH_LOADER, HLS_LOADER, ...EMBED_LOADERS, ...customLoaders] : [HLS_LOADER, VIDEO_LOADER, AUDIO_LOADER, DASH_LOADER, ...EMBED_LOADERS, ...customLoaders];
      return remoteLoader ? [remoteLoader, ...loaders] : loaders;
    });
    const { $state } = media;
    $state.sources.set(normalizeSrc(media.$props.src()));
    for (const src of $state.sources()) {
      const loader2 = this.#loaders().find((loader3) => loader3.canPlay(src));
      if (!loader2) continue;
      const mediaType = loader2.mediaType(src);
      media.$state.source.set(src);
      media.$state.mediaType.set(mediaType);
      media.$state.inferredViewType.set(mediaType);
      this.#loader.set(loader2);
      this.#initialize = true;
      break;
    }
  }
  connect() {
    const loader = this.#loader();
    if (this.#initialize) {
      this.#notifySourceChange(this.#media.$state.source(), loader);
      this.#notifyLoaderChange(loader);
      this.#initialize = false;
    }
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#onSourcesChange.bind(this));
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#onSourceChange.bind(this));
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#onSetup.bind(this));
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#onLoadSource.bind(this));
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#onLoadPoster.bind(this));
  }
  #onSourcesChange() {
    this.#media.notify("sources-change", [
      ...normalizeSrc(this.#media.$props.src()),
      ...this.#domSources()
    ]);
  }
  #onSourceChange() {
    const { $state } = this.#media;
    const sources = $state.sources(), currentSource = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.peek)($state.source), newSource = this.#findNewSource(currentSource, sources), noMatch = sources[0]?.src && !newSource.src && !newSource.type;
    if (noMatch && !warned$1.has(newSource.src) && !(0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.peek)(this.#loader)) {
      const source = sources[0];
      console.warn(
        `[vidstack] could not find a loader for any of the given media sources, consider providing \`type\`:

--- HTML ---

<media-provider>
  <source src="${source.src}" type="video/mp4" />
</media-provider>"

--- React ---

<MediaPlayer src={{ src: "${source.src}", type: "video/mp4" }}>

---

Falling back to fetching source headers...`
      );
      warned$1.add(newSource.src);
    }
    if (noMatch) {
      const { crossOrigin } = $state, credentials = getRequestCredentials(crossOrigin()), abort = new AbortController();
      Promise.all(
        sources.map(
          (source) => (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isString)(source.src) && source.type === "?" ? fetch(source.src, {
            method: "HEAD",
            credentials,
            signal: abort.signal
          }).then((res) => {
            source.type = res.headers.get("content-type") || "??";
            sourceTypes.set(source.src, source.type);
            return source;
          }).catch(() => source) : source
        )
      ).then((sources2) => {
        if (abort.signal.aborted) return;
        const newSource2 = this.#findNewSource((0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.peek)($state.source), sources2);
        (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.tick)();
        if (!newSource2.src) {
          this.#media.notify("error", {
            message: "Failed to load resource.",
            code: 4
          });
        }
      });
      return () => abort.abort();
    }
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.tick)();
  }
  #findNewSource(currentSource, sources) {
    let newSource = { src: "", type: "" }, newLoader = null, triggerEvent = new _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.DOMEvent("sources-change", { detail: { sources } }), loaders = this.#loaders(), { started, paused, currentTime, quality, savedState } = this.#media.$state;
    for (const src of sources) {
      const loader = loaders.find((loader2) => loader2.canPlay(src));
      if (loader) {
        newSource = src;
        newLoader = loader;
        break;
      }
    }
    if (isVideoQualitySrc(newSource)) {
      const currentQuality = quality(), sourceQuality = sources.find((s) => s.src === currentQuality?.src);
      if ((0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.peek)(started)) {
        savedState.set({
          paused: (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.peek)(paused),
          currentTime: (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.peek)(currentTime)
        });
      } else {
        savedState.set(null);
      }
      if (sourceQuality) {
        newSource = sourceQuality;
        triggerEvent = new _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.DOMEvent("quality-change", {
          detail: { quality: currentQuality }
        });
      }
    }
    if (!isSameSrc(currentSource, newSource)) {
      this.#notifySourceChange(newSource, newLoader, triggerEvent);
    }
    if (newLoader !== (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.peek)(this.#loader)) {
      this.#notifyLoaderChange(newLoader, triggerEvent);
    }
    return newSource;
  }
  #notifySourceChange(src, loader, trigger) {
    this.#media.notify("source-change", src, trigger);
    this.#media.notify("media-type-change", loader?.mediaType(src) || "unknown", trigger);
  }
  #notifyLoaderChange(loader, trigger) {
    this.#media.$providerSetup.set(false);
    this.#media.notify("provider-change", null, trigger);
    loader && (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.peek)(() => loader.preconnect?.(this.#media));
    this.#loader.set(loader);
    this.#media.notify("provider-loader-change", loader, trigger);
  }
  #onSetup() {
    const provider = this.#media.$provider();
    if (!provider || (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.peek)(this.#media.$providerSetup)) return;
    if (this.#media.$state.canLoad()) {
      (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.scoped)(() => provider.setup(), provider.scope);
      this.#media.$providerSetup.set(true);
      return;
    }
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.peek)(() => provider.preconnect?.());
  }
  #onLoadSource() {
    if (!this.#media.$providerSetup()) return;
    const provider = this.#media.$provider(), source = this.#media.$state.source(), crossOrigin = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.peek)(this.#media.$state.crossOrigin), preferNativeHLS = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.peek)(this.#media.$props.preferNativeHLS);
    if (isSameSrc(provider?.currentSrc, source)) {
      return;
    }
    if (this.#media.$state.canLoad()) {
      const abort = new AbortController();
      if (isHLSSrc(source)) {
        if (preferNativeHLS || !isHLSSupported()) {
          resolveStreamTypeFromHLSManifest(source.src, {
            credentials: getRequestCredentials(crossOrigin),
            signal: abort.signal
          }).then((streamType) => {
            this.#media.notify("stream-type-change", streamType);
          }).catch(_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.noop);
        }
      } else if (isDASHSrc(source)) {
        resolveStreamTypeFromDASHManifest(source.src, {
          credentials: getRequestCredentials(crossOrigin),
          signal: abort.signal
        }).then((streamType) => {
          this.#media.notify("stream-type-change", streamType);
        }).catch(_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.noop);
      } else {
        this.#media.notify("stream-type-change", "on-demand");
      }
      (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.peek)(() => {
        const preload = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.peek)(this.#media.$state.preload);
        return provider?.loadSource(source, preload).catch((error) => {
          {
            this.#media.logger?.errorGroup("[vidstack] failed to load source").labelledLog("Error", error).labelledLog("Source", source).labelledLog("Provider", provider).labelledLog("Media Context", { ...this.#media }).dispatch();
          }
        });
      });
      return () => abort.abort();
    }
    try {
      (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isString)(source.src) && preconnect(new URL(source.src).origin);
    } catch (error) {
      {
        this.#media.logger?.infoGroup(`Failed to preconnect to source: ${source.src}`).labelledLog("Error", error).dispatch();
      }
    }
  }
  #onLoadPoster() {
    const loader = this.#loader(), { providedPoster, source, canLoadPoster } = this.#media.$state;
    if (!loader || !loader.loadPoster || !source() || !canLoadPoster() || providedPoster()) return;
    const abort = new AbortController(), trigger = new _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.DOMEvent("source-change", { detail: source });
    loader.loadPoster(source(), this.#media, abort).then((url) => {
      this.#media.notify("poster-change", url || "", trigger);
    }).catch(() => {
      this.#media.notify("poster-change", "", trigger);
    });
    return () => {
      abort.abort();
    };
  }
}
function normalizeSrc(src) {
  return ((0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isArray)(src) ? src : [src]).map((src2) => {
    if ((0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isString)(src2)) {
      return { src: src2, type: inferType(src2) };
    } else {
      return { ...src2, type: inferType(src2.src, src2.type) };
    }
  });
}
function inferType(src, type) {
  if ((0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isString)(type) && type.length) {
    return type;
  } else if ((0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isString)(src) && sourceTypes.has(src)) {
    return sourceTypes.get(src);
  } else if (!type && isHLSSrc({ src, type: "" })) {
    return "application/x-mpegurl";
  } else if (!type && isDASHSrc({ src, type: "" })) {
    return "application/dash+xml";
  } else if (!(0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isString)(src) || src.startsWith("blob:")) {
    return "video/object";
  } else if (src.includes("youtube") || src.includes("youtu.be")) {
    return "video/youtube";
  } else if (src.includes("vimeo") && !src.includes("progressive_redirect") && !src.includes(".m3u8")) {
    return "video/vimeo";
  }
  return "?";
}
function isSameSrc(a, b) {
  return a?.src === b?.src && a?.type === b?.type;
}

class Tracks {
  #domTracks;
  #media;
  #prevTracks = [];
  constructor(domTracks, media) {
    this.#domTracks = domTracks;
    this.#media = media;
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#onTracksChange.bind(this));
  }
  #onTracksChange() {
    const newTracks = this.#domTracks();
    for (const oldTrack of this.#prevTracks) {
      if (!newTracks.some((t) => t.id === oldTrack.id)) {
        const track = oldTrack.id && this.#media.textTracks.getById(oldTrack.id);
        if (track) this.#media.textTracks.remove(track);
      }
    }
    for (const newTrack of newTracks) {
      const id = newTrack.id || TextTrack.createId(newTrack);
      if (!this.#media.textTracks.getById(id)) {
        newTrack.id = id;
        this.#media.textTracks.add(newTrack);
      }
    }
    this.#prevTracks = newTracks;
  }
}

class MediaProvider extends _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.Component {
  static props = {
    loaders: []
  };
  static state = new _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.State({
    loader: null
  });
  #media;
  #sources;
  #domSources = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.signal)([]);
  #domTracks = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.signal)([]);
  #loader = null;
  onSetup() {
    this.#media = useMediaContext();
    this.#sources = new SourceSelection(
      this.#domSources,
      this.#media,
      this.$state.loader,
      this.$props.loaders()
    );
  }
  onAttach(el) {
    el.setAttribute("data-media-provider", "");
  }
  onConnect(el) {
    this.#sources.connect();
    new Tracks(this.#domTracks, this.#media);
    const resize = new ResizeObserver((0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.animationFrameThrottle)(this.#onResize.bind(this)));
    resize.observe(el);
    const mutations = new MutationObserver(this.#onMutation.bind(this));
    mutations.observe(el, { attributes: true, childList: true });
    this.#onResize();
    this.#onMutation();
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.onDispose)(() => {
      resize.disconnect();
      mutations.disconnect();
    });
  }
  #loadRafId = -1;
  load(target) {
    target?.setAttribute("aria-hidden", "true");
    window.cancelAnimationFrame(this.#loadRafId);
    this.#loadRafId = requestAnimationFrame(() => this.#runLoader(target));
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.onDispose)(() => {
      window.cancelAnimationFrame(this.#loadRafId);
    });
  }
  #runLoader(target) {
    if (!this.scope) return;
    const loader = this.$state.loader(), { $provider } = this.#media;
    if (this.#loader === loader && loader?.target === target && (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.peek)($provider)) return;
    this.#destroyProvider();
    this.#loader = loader;
    if (loader) loader.target = target || null;
    if (!loader || !target) return;
    loader.load(this.#media).then((provider) => {
      if (!this.scope) return;
      if ((0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.peek)(this.$state.loader) !== loader) return;
      this.#media.notify("provider-change", provider);
    });
  }
  onDestroy() {
    this.#loader = null;
    this.#destroyProvider();
  }
  #destroyProvider() {
    this.#media?.notify("provider-change", null);
  }
  #onResize() {
    if (!this.el) return;
    const { player, $state } = this.#media, width = this.el.offsetWidth, height = this.el.offsetHeight;
    if (!player) return;
    $state.mediaWidth.set(width);
    $state.mediaHeight.set(height);
    if (player.el) {
      (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.setStyle)(player.el, "--media-width", width + "px");
      (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.setStyle)(player.el, "--media-height", height + "px");
    }
  }
  #onMutation() {
    const sources = [], tracks = [], children = this.el.children;
    for (const el of children) {
      if (el.hasAttribute("data-vds")) continue;
      if (el instanceof HTMLSourceElement) {
        const src = {
          id: el.id,
          src: el.src,
          type: el.type
        };
        for (const prop of ["id", "src", "width", "height", "bitrate", "codec"]) {
          const value = el.getAttribute(`data-${prop}`);
          if ((0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isString)(value)) src[prop] = /id|src|codec/.test(prop) ? value : Number(value);
        }
        sources.push(src);
      } else if (el instanceof HTMLTrackElement) {
        const track = {
          src: el.src,
          kind: el.track.kind,
          language: el.srclang,
          label: el.label,
          default: el.default,
          type: el.getAttribute("data-type")
        };
        tracks.push({
          id: el.id || TextTrack.createId(track),
          ...track
        });
      }
    }
    this.#domSources.set(sources);
    this.#domTracks.set(tracks);
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.tick)();
  }
}
const mediaprovider__proto = MediaProvider.prototype;
(0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.method)(mediaprovider__proto, "load");

class MediaAnnouncer extends _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.Component {
  static props = {
    translations: null
  };
  static state = new _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.State({
    label: null,
    busy: false
  });
  #media;
  #initializing = false;
  onSetup() {
    this.#media = useMediaContext();
  }
  onAttach(el) {
    el.style.display = "contents";
  }
  onConnect(el) {
    el.setAttribute("data-media-announcer", "");
    setAttributeIfEmpty(el, "role", "status");
    setAttributeIfEmpty(el, "aria-live", "polite");
    const { busy } = this.$state;
    this.setAttributes({
      "aria-busy": () => busy() ? "true" : null
    });
    this.#initializing = true;
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#watchPaused.bind(this));
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#watchVolume.bind(this));
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#watchCaptions.bind(this));
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#watchFullscreen.bind(this));
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#watchPiP.bind(this));
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#watchSeeking.bind(this));
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#watchLabel.bind(this));
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.tick)();
    this.#initializing = false;
  }
  #watchPaused() {
    const { paused } = this.#media.$state;
    this.#setLabel(!paused() ? "Play" : "Pause");
  }
  #watchFullscreen() {
    const { fullscreen } = this.#media.$state;
    this.#setLabel(fullscreen() ? "Enter Fullscreen" : "Exit Fullscreen");
  }
  #watchPiP() {
    const { pictureInPicture } = this.#media.$state;
    this.#setLabel(pictureInPicture() ? "Enter PiP" : "Exit PiP");
  }
  #watchCaptions() {
    const { textTrack } = this.#media.$state;
    this.#setLabel(textTrack() ? "Closed-Captions On" : "Closed-Captions Off");
  }
  #watchVolume() {
    const { muted, volume, audioGain } = this.#media.$state;
    this.#setLabel(
      muted() || volume() === 0 ? "Mute" : `${Math.round(volume() * (audioGain() ?? 1) * 100)}% ${this.#translate("Volume")}`
    );
  }
  #startedSeekingAt = -1;
  #seekTimer = -1;
  #watchSeeking() {
    const { seeking, currentTime } = this.#media.$state, isSeeking = seeking();
    if (this.#startedSeekingAt > 0) {
      window.clearTimeout(this.#seekTimer);
      this.#seekTimer = window.setTimeout(() => {
        if (!this.scope) return;
        const newTime = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.peek)(currentTime), seconds = Math.abs(newTime - this.#startedSeekingAt);
        if (seconds >= 1) {
          const isForward = newTime >= this.#startedSeekingAt, spokenTime = formatSpokenTime(seconds);
          this.#setLabel(
            `${this.#translate(isForward ? "Seek Forward" : "Seek Backward")} ${spokenTime}`
          );
        }
        this.#startedSeekingAt = -1;
        this.#seekTimer = -1;
      }, 300);
    } else if (isSeeking) {
      this.#startedSeekingAt = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.peek)(currentTime);
    }
  }
  #translate(word) {
    const { translations } = this.$props;
    return translations?.()?.[word || ""] ?? word;
  }
  #watchLabel() {
    const { label, busy } = this.$state, $label = this.#translate(label());
    if (this.#initializing) return;
    busy.set(true);
    const id = window.setTimeout(() => void busy.set(false), 150);
    this.el && (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.setAttribute)(this.el, "aria-label", $label);
    if ((0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isString)($label)) {
      this.dispatch("change", { detail: $label });
    }
    return () => window.clearTimeout(id);
  }
  #setLabel(word) {
    const { label } = this.$state;
    label.set(word);
  }
}

class Controls extends _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.Component {
  static props = {
    hideDelay: 2e3,
    hideOnMouseLeave: false
  };
  #media;
  onSetup() {
    this.#media = useMediaContext();
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#watchProps.bind(this));
  }
  onAttach(el) {
    const { pictureInPicture, fullscreen } = this.#media.$state;
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.setStyle)(el, "pointer-events", "none");
    setAttributeIfEmpty(el, "role", "group");
    this.setAttributes({
      "data-visible": this.#isShowing.bind(this),
      "data-fullscreen": fullscreen,
      "data-pip": pictureInPicture
    });
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(() => {
      this.dispatch("change", { detail: this.#isShowing() });
    });
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#hideControls.bind(this));
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(() => {
      const isFullscreen = fullscreen();
      for (const side of ["top", "right", "bottom", "left"]) {
        (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.setStyle)(el, `padding-${side}`, isFullscreen && `env(safe-area-inset-${side})`);
      }
    });
  }
  #hideControls() {
    if (!this.el) return;
    const { nativeControls } = this.#media.$state, isHidden = nativeControls();
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.setAttribute)(this.el, "aria-hidden", isHidden ? "true" : null);
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.setStyle)(this.el, "display", isHidden ? "none" : null);
  }
  #watchProps() {
    const { controls } = this.#media.player, { hideDelay, hideOnMouseLeave } = this.$props;
    controls.defaultDelay = hideDelay() === 2e3 ? this.#media.$props.controlsDelay() : hideDelay();
    controls.hideOnMouseLeave = hideOnMouseLeave();
  }
  #isShowing() {
    const { controlsVisible } = this.#media.$state;
    return controlsVisible();
  }
}

class ControlsGroup extends _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.Component {
  onAttach(el) {
    if (!el.style.pointerEvents) (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.setStyle)(el, "pointer-events", "auto");
  }
}

class Popper extends _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.ViewController {
  #delegate;
  constructor(delegate) {
    super();
    this.#delegate = delegate;
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#watchTrigger.bind(this));
  }
  onDestroy() {
    this.#stopAnimationEndListener?.();
    this.#stopAnimationEndListener = null;
  }
  #watchTrigger() {
    const trigger = this.#delegate.trigger();
    if (!trigger) {
      this.hide();
      return;
    }
    const show = this.show.bind(this), hide = this.hide.bind(this);
    this.#delegate.listen(trigger, show, hide);
  }
  #showTimerId = -1;
  #hideRafId = -1;
  #stopAnimationEndListener = null;
  show(trigger) {
    this.#cancelShowing();
    window.cancelAnimationFrame(this.#hideRafId);
    this.#hideRafId = -1;
    this.#stopAnimationEndListener?.();
    this.#stopAnimationEndListener = null;
    this.#showTimerId = window.setTimeout(() => {
      this.#showTimerId = -1;
      const content = this.#delegate.content();
      if (content) content.style.removeProperty("display");
      (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.peek)(() => this.#delegate.onChange(true, trigger));
    }, this.#delegate.showDelay?.() ?? 0);
  }
  hide(trigger) {
    this.#cancelShowing();
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.peek)(() => this.#delegate.onChange(false, trigger));
    this.#hideRafId = requestAnimationFrame(() => {
      this.#cancelShowing();
      this.#hideRafId = -1;
      const content = this.#delegate.content();
      if (content) {
        const onHide = () => {
          content.style.display = "none";
          this.#stopAnimationEndListener = null;
        };
        const isAnimated = hasAnimation(content);
        if (isAnimated) {
          this.#stopAnimationEndListener?.();
          const stop = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.listenEvent)(content, "animationend", onHide, { once: true });
          this.#stopAnimationEndListener = stop;
        } else {
          onHide();
        }
      }
    });
  }
  #cancelShowing() {
    window.clearTimeout(this.#showTimerId);
    this.#showTimerId = -1;
  }
}

const tooltipContext = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.createContext)();

let id = 0;
class Tooltip extends _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.Component {
  static props = {
    showDelay: 700
  };
  #id = `media-tooltip-${++id}`;
  #trigger = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.signal)(null);
  #content = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.signal)(null);
  #showing = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.signal)(false);
  constructor() {
    super();
    new FocusVisibleController();
    const { showDelay } = this.$props;
    new Popper({
      trigger: this.#trigger,
      content: this.#content,
      showDelay,
      listen(trigger, show, hide) {
        (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(() => {
          if ($keyboard()) (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.listenEvent)(trigger, "focus", show);
          (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.listenEvent)(trigger, "blur", hide);
        });
        new _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.EventsController(trigger).add("touchstart", (e) => e.preventDefault(), { passive: false }).add("mouseenter", show).add("mouseleave", hide);
      },
      onChange: this.#onShowingChange.bind(this)
    });
  }
  onAttach(el) {
    el.style.setProperty("display", "contents");
  }
  onSetup() {
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.provideContext)(tooltipContext, {
      trigger: this.#trigger,
      content: this.#content,
      showing: this.#showing,
      attachTrigger: this.#attachTrigger.bind(this),
      detachTrigger: this.#detachTrigger.bind(this),
      attachContent: this.#attachContent.bind(this),
      detachContent: this.#detachContent.bind(this)
    });
  }
  #attachTrigger(el) {
    this.#trigger.set(el);
    let tooltipName = el.getAttribute("data-media-tooltip");
    if (tooltipName) {
      this.el?.setAttribute(`data-media-${tooltipName}-tooltip`, "");
    }
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.setAttribute)(el, "data-describedby", this.#id);
  }
  #detachTrigger(el) {
    el.removeAttribute("data-describedby");
    el.removeAttribute("aria-describedby");
    this.#trigger.set(null);
  }
  #attachContent(el) {
    el.setAttribute("id", this.#id);
    el.style.display = "none";
    setAttributeIfEmpty(el, "role", "tooltip");
    this.#content.set(el);
  }
  #detachContent(el) {
    el.removeAttribute("id");
    el.removeAttribute("role");
    this.#content.set(null);
  }
  #onShowingChange(isShowing) {
    const trigger = this.#trigger(), content = this.#content();
    if (trigger) {
      (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.setAttribute)(trigger, "aria-describedby", isShowing ? this.#id : null);
    }
    for (const el of [this.el, trigger, content]) {
      el && (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.setAttribute)(el, "data-visible", isShowing);
    }
    this.#showing.set(isShowing);
  }
}

class TooltipTrigger extends _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.Component {
  constructor() {
    super();
    new FocusVisibleController();
  }
  onConnect(el) {
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.onDispose)(
      requestScopedAnimationFrame(() => {
        if (!this.connectScope) return;
        this.#attach();
        const tooltip = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.useContext)(tooltipContext);
        (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.onDispose)(() => {
          const button = this.#getButton();
          button && tooltip.detachTrigger(button);
        });
      })
    );
  }
  #attach() {
    const button = this.#getButton(), tooltip = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.useContext)(tooltipContext);
    button && tooltip.attachTrigger(button);
  }
  #getButton() {
    const candidate = this.el.firstElementChild;
    return candidate?.localName === "button" || candidate?.getAttribute("role") === "button" ? candidate : this.el;
  }
}

class TooltipContent extends _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.Component {
  static props = {
    placement: "top center",
    offset: 0,
    alignOffset: 0
  };
  constructor() {
    super();
    new FocusVisibleController();
    const { placement } = this.$props;
    this.setAttributes({
      "data-placement": placement
    });
  }
  onAttach(el) {
    this.#attach(el);
    Object.assign(el.style, {
      position: "absolute",
      top: 0,
      left: 0,
      width: "max-content"
    });
  }
  onConnect(el) {
    this.#attach(el);
    const tooltip = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.useContext)(tooltipContext);
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.onDispose)(() => tooltip.detachContent(el));
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.onDispose)(
      requestScopedAnimationFrame(() => {
        if (!this.connectScope) return;
        (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#watchPlacement.bind(this));
      })
    );
  }
  #attach(el) {
    const tooltip = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.useContext)(tooltipContext);
    tooltip.attachContent(el);
  }
  #watchPlacement() {
    const { showing } = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.useContext)(tooltipContext);
    if (!showing()) return;
    const { placement, offset: mainOffset, alignOffset } = this.$props;
    return autoPlacement(this.el, this.#getTrigger(), placement(), {
      offsetVarName: "media-tooltip",
      xOffset: alignOffset(),
      yOffset: mainOffset()
    });
  }
  #getTrigger() {
    return (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.useContext)(tooltipContext).trigger();
  }
}

class ToggleButtonController extends _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.ViewController {
  static props = {
    disabled: false
  };
  #delegate;
  constructor(delegate) {
    super();
    this.#delegate = delegate;
    new FocusVisibleController();
    if (delegate.keyShortcut) {
      new ARIAKeyShortcuts(delegate.keyShortcut);
    }
  }
  onSetup() {
    const { disabled } = this.$props;
    this.setAttributes({
      "data-pressed": this.#delegate.isPresssed,
      "aria-pressed": this.#isARIAPressed.bind(this),
      "aria-disabled": () => disabled() ? "true" : null
    });
  }
  onAttach(el) {
    setAttributeIfEmpty(el, "tabindex", "0");
    setAttributeIfEmpty(el, "role", "button");
    setAttributeIfEmpty(el, "type", "button");
  }
  onConnect(el) {
    const events = onPress(el, this.#onMaybePress.bind(this));
    for (const type of ["click", "touchstart"]) {
      events.add(type, this.#onInteraction.bind(this), {
        passive: true
      });
    }
  }
  #isARIAPressed() {
    return (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.ariaBool)(this.#delegate.isPresssed());
  }
  #onPressed(event) {
    if ((0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isWriteSignal)(this.#delegate.isPresssed)) {
      this.#delegate.isPresssed.set((p) => !p);
    }
  }
  #onMaybePress(event) {
    const disabled = this.$props.disabled() || this.el.hasAttribute("data-disabled");
    if (disabled) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }
    event.preventDefault();
    (this.#delegate.onPress ?? this.#onPressed).call(this, event);
  }
  #onInteraction(event) {
    if (this.$props.disabled()) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }
}

class ToggleButton extends _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.Component {
  static props = {
    disabled: false,
    defaultPressed: false
  };
  #pressed = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.signal)(false);
  /**
   * Whether the toggle is currently in a `pressed` state.
   */
  get pressed() {
    return this.#pressed();
  }
  constructor() {
    super();
    new ToggleButtonController({
      isPresssed: this.#pressed
    });
  }
}
const togglebutton__proto = ToggleButton.prototype;
(0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.prop)(togglebutton__proto, "pressed");

class AirPlayButton extends _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.Component {
  static props = ToggleButtonController.props;
  #media;
  constructor() {
    super();
    new ToggleButtonController({
      isPresssed: this.#isPressed.bind(this),
      onPress: this.#onPress.bind(this)
    });
  }
  onSetup() {
    this.#media = useMediaContext();
    const { canAirPlay, isAirPlayConnected } = this.#media.$state;
    this.setAttributes({
      "data-active": isAirPlayConnected,
      "data-supported": canAirPlay,
      "data-state": this.#getState.bind(this),
      "aria-hidden": $ariaBool(() => !canAirPlay())
    });
  }
  onAttach(el) {
    el.setAttribute("data-media-tooltip", "airplay");
    setARIALabel(el, this.#getDefaultLabel.bind(this));
  }
  #onPress(event) {
    const remote = this.#media.remote;
    remote.requestAirPlay(event);
  }
  #isPressed() {
    const { remotePlaybackType, remotePlaybackState } = this.#media.$state;
    return remotePlaybackType() === "airplay" && remotePlaybackState() !== "disconnected";
  }
  #getState() {
    const { remotePlaybackType, remotePlaybackState } = this.#media.$state;
    return remotePlaybackType() === "airplay" && remotePlaybackState();
  }
  #getDefaultLabel() {
    const { remotePlaybackState } = this.#media.$state;
    return `AirPlay ${remotePlaybackState()}`;
  }
}

class GoogleCastButton extends _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.Component {
  static props = ToggleButtonController.props;
  #media;
  constructor() {
    super();
    new ToggleButtonController({
      isPresssed: this.#isPressed.bind(this),
      onPress: this.#onPress.bind(this)
    });
  }
  onSetup() {
    this.#media = useMediaContext();
    const { canGoogleCast, isGoogleCastConnected } = this.#media.$state;
    this.setAttributes({
      "data-active": isGoogleCastConnected,
      "data-supported": canGoogleCast,
      "data-state": this.#getState.bind(this),
      "aria-hidden": $ariaBool(() => !canGoogleCast())
    });
  }
  onAttach(el) {
    el.setAttribute("data-media-tooltip", "google-cast");
    setARIALabel(el, this.#getDefaultLabel.bind(this));
  }
  #onPress(event) {
    const remote = this.#media.remote;
    remote.requestGoogleCast(event);
  }
  #isPressed() {
    const { remotePlaybackType, remotePlaybackState } = this.#media.$state;
    return remotePlaybackType() === "google-cast" && remotePlaybackState() !== "disconnected";
  }
  #getState() {
    const { remotePlaybackType, remotePlaybackState } = this.#media.$state;
    return remotePlaybackType() === "google-cast" && remotePlaybackState();
  }
  #getDefaultLabel() {
    const { remotePlaybackState } = this.#media.$state;
    return `Google Cast ${remotePlaybackState()}`;
  }
}

class PlayButton extends _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.Component {
  static props = ToggleButtonController.props;
  #media;
  constructor() {
    super();
    new ToggleButtonController({
      isPresssed: this.#isPressed.bind(this),
      keyShortcut: "togglePaused",
      onPress: this.#onPress.bind(this)
    });
  }
  onSetup() {
    this.#media = useMediaContext();
    const { paused, ended } = this.#media.$state;
    this.setAttributes({
      "data-paused": paused,
      "data-ended": ended
    });
  }
  onAttach(el) {
    el.setAttribute("data-media-tooltip", "play");
    setARIALabel(el, "Play");
  }
  #onPress(event) {
    const remote = this.#media.remote;
    this.#isPressed() ? remote.pause(event) : remote.play(event);
  }
  #isPressed() {
    const { paused } = this.#media.$state;
    return !paused();
  }
}

class CaptionButton extends _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.Component {
  static props = ToggleButtonController.props;
  #media;
  constructor() {
    super();
    new ToggleButtonController({
      isPresssed: this.#isPressed.bind(this),
      keyShortcut: "toggleCaptions",
      onPress: this.#onPress.bind(this)
    });
  }
  onSetup() {
    this.#media = useMediaContext();
    this.setAttributes({
      "data-active": this.#isPressed.bind(this),
      "data-supported": () => !this.#isHidden(),
      "aria-hidden": $ariaBool(this.#isHidden.bind(this))
    });
  }
  onAttach(el) {
    el.setAttribute("data-media-tooltip", "caption");
    setARIALabel(el, "Captions");
  }
  #onPress(event) {
    this.#media.remote.toggleCaptions(event);
  }
  #isPressed() {
    const { textTrack } = this.#media.$state, track = textTrack();
    return !!track && isTrackCaptionKind(track);
  }
  #isHidden() {
    const { hasCaptions } = this.#media.$state;
    return !hasCaptions();
  }
}

class FullscreenButton extends _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.Component {
  static props = {
    ...ToggleButtonController.props,
    target: "prefer-media"
  };
  #media;
  constructor() {
    super();
    new ToggleButtonController({
      isPresssed: this.#isPressed.bind(this),
      keyShortcut: "toggleFullscreen",
      onPress: this.#onPress.bind(this)
    });
  }
  onSetup() {
    this.#media = useMediaContext();
    const { fullscreen } = this.#media.$state, isSupported = this.#isSupported.bind(this);
    this.setAttributes({
      "data-active": fullscreen,
      "data-supported": isSupported,
      "aria-hidden": $ariaBool(() => !isSupported())
    });
  }
  onAttach(el) {
    el.setAttribute("data-media-tooltip", "fullscreen");
    setARIALabel(el, "Fullscreen");
  }
  #onPress(event) {
    const remote = this.#media.remote, target = this.$props.target();
    this.#isPressed() ? remote.exitFullscreen(target, event) : remote.enterFullscreen(target, event);
  }
  #isPressed() {
    const { fullscreen } = this.#media.$state;
    return fullscreen();
  }
  #isSupported() {
    const { canFullscreen } = this.#media.$state;
    return canFullscreen();
  }
}

class MuteButton extends _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.Component {
  static props = ToggleButtonController.props;
  #media;
  constructor() {
    super();
    new ToggleButtonController({
      isPresssed: this.#isPressed.bind(this),
      keyShortcut: "toggleMuted",
      onPress: this.#onPress.bind(this)
    });
  }
  onSetup() {
    this.#media = useMediaContext();
    this.setAttributes({
      "data-muted": this.#isPressed.bind(this),
      "data-state": this.#getState.bind(this)
    });
  }
  onAttach(el) {
    el.setAttribute("data-media-mute-button", "");
    el.setAttribute("data-media-tooltip", "mute");
    setARIALabel(el, "Mute");
  }
  #onPress(event) {
    const remote = this.#media.remote;
    this.#isPressed() ? remote.unmute(event) : remote.mute(event);
  }
  #isPressed() {
    const { muted, volume } = this.#media.$state;
    return muted() || volume() === 0;
  }
  #getState() {
    const { muted, volume } = this.#media.$state, $volume = volume();
    if (muted() || $volume === 0) return "muted";
    else if ($volume >= 0.5) return "high";
    else if ($volume < 0.5) return "low";
  }
}

class PIPButton extends _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.Component {
  static props = ToggleButtonController.props;
  #media;
  constructor() {
    super();
    new ToggleButtonController({
      isPresssed: this.#isPressed.bind(this),
      keyShortcut: "togglePictureInPicture",
      onPress: this.#onPress.bind(this)
    });
  }
  onSetup() {
    this.#media = useMediaContext();
    const { pictureInPicture } = this.#media.$state, isSupported = this.#isSupported.bind(this);
    this.setAttributes({
      "data-active": pictureInPicture,
      "data-supported": isSupported,
      "aria-hidden": $ariaBool(() => !isSupported())
    });
  }
  onAttach(el) {
    el.setAttribute("data-media-tooltip", "pip");
    setARIALabel(el, "PiP");
  }
  #onPress(event) {
    const remote = this.#media.remote;
    this.#isPressed() ? remote.exitPictureInPicture(event) : remote.enterPictureInPicture(event);
  }
  #isPressed() {
    const { pictureInPicture } = this.#media.$state;
    return pictureInPicture();
  }
  #isSupported() {
    const { canPictureInPicture } = this.#media.$state;
    return canPictureInPicture();
  }
}

class SeekButton extends _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.Component {
  static props = {
    disabled: false,
    seconds: 30
  };
  #media;
  constructor() {
    super();
    new FocusVisibleController();
  }
  onSetup() {
    this.#media = useMediaContext();
    const { seeking } = this.#media.$state, { seconds } = this.$props, isSupported = this.#isSupported.bind(this);
    this.setAttributes({
      seconds,
      "data-seeking": seeking,
      "data-supported": isSupported,
      "aria-hidden": $ariaBool(() => !isSupported())
    });
  }
  onAttach(el) {
    setAttributeIfEmpty(el, "tabindex", "0");
    setAttributeIfEmpty(el, "role", "button");
    setAttributeIfEmpty(el, "type", "button");
    el.setAttribute("data-media-tooltip", "seek");
    setARIALabel(el, this.#getDefaultLabel.bind(this));
  }
  onConnect(el) {
    onPress(el, this.#onPress.bind(this));
  }
  #isSupported() {
    const { canSeek } = this.#media.$state;
    return canSeek();
  }
  #getDefaultLabel() {
    const { seconds } = this.$props;
    return `Seek ${seconds() > 0 ? "forward" : "backward"} ${seconds()} seconds`;
  }
  #onPress(event) {
    const { seconds, disabled } = this.$props;
    if (disabled()) return;
    const { currentTime } = this.#media.$state, seekTo = currentTime() + seconds();
    this.#media.remote.seek(seekTo, event);
  }
}

class LiveButton extends _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.Component {
  static props = {
    disabled: false
  };
  #media;
  constructor() {
    super();
    new FocusVisibleController();
  }
  onSetup() {
    this.#media = useMediaContext();
    const { disabled } = this.$props, { live, liveEdge } = this.#media.$state, isHidden = () => !live();
    this.setAttributes({
      "data-edge": liveEdge,
      "data-hidden": isHidden,
      "aria-disabled": $ariaBool(() => disabled() || liveEdge()),
      "aria-hidden": $ariaBool(isHidden)
    });
  }
  onAttach(el) {
    setAttributeIfEmpty(el, "tabindex", "0");
    setAttributeIfEmpty(el, "role", "button");
    setAttributeIfEmpty(el, "type", "button");
    el.setAttribute("data-media-tooltip", "live");
  }
  onConnect(el) {
    onPress(el, this.#onPress.bind(this));
  }
  #onPress(event) {
    const { disabled } = this.$props, { liveEdge } = this.#media.$state;
    if (disabled() || liveEdge()) return;
    this.#media.remote.seekToLiveEdge(event);
  }
}

const sliderState = new _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.State({
  min: 0,
  max: 100,
  value: 0,
  step: 1,
  pointerValue: 0,
  focused: false,
  dragging: false,
  pointing: false,
  hidden: false,
  get active() {
    return this.dragging || this.focused || this.pointing;
  },
  get fillRate() {
    return calcRate(this.min, this.max, this.value);
  },
  get fillPercent() {
    return this.fillRate * 100;
  },
  get pointerRate() {
    return calcRate(this.min, this.max, this.pointerValue);
  },
  get pointerPercent() {
    return this.pointerRate * 100;
  }
});
function calcRate(min, max, value) {
  const range = max - min, offset = value - min;
  return range > 0 ? offset / range : 0;
}

class IntersectionObserverController extends _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.ViewController {
  #init;
  #observer;
  constructor(init) {
    super();
    this.#init = init;
  }
  onConnect(el) {
    this.#observer = new IntersectionObserver((entries) => {
      this.#init.callback?.(entries, this.#observer);
    }, this.#init);
    this.#observer.observe(el);
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.onDispose)(this.#onDisconnect.bind(this));
  }
  /**
   * Disconnect any active intersection observers.
   */
  #onDisconnect() {
    this.#observer?.disconnect();
    this.#observer = void 0;
  }
}

const sliderContext = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.createContext)();
const sliderObserverContext = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.createContext)();

function getClampedValue(min, max, value, step) {
  return clampNumber(min, round(value, getNumberOfDecimalPlaces(step)), max);
}
function getValueFromRate(min, max, rate, step) {
  const boundRate = clampNumber(0, rate, 1), range = max - min, fill = range * boundRate, stepRatio = fill / step, steps = step * Math.round(stepRatio);
  return min + steps;
}

const SliderKeyDirection = {
  Left: -1,
  ArrowLeft: -1,
  Up: 1,
  ArrowUp: 1,
  Right: 1,
  ArrowRight: 1,
  Down: -1,
  ArrowDown: -1
};
class SliderEventsController extends _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.ViewController {
  #delegate;
  #media;
  #observer;
  constructor(delegate, media) {
    super();
    this.#delegate = delegate;
    this.#media = media;
  }
  onSetup() {
    if ((0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.hasProvidedContext)(sliderObserverContext)) {
      this.#observer = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.useContext)(sliderObserverContext);
    }
  }
  onConnect(el) {
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#attachEventListeners.bind(this, el));
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#attachPointerListeners.bind(this, el));
    if (this.#delegate.swipeGesture) (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#watchSwipeGesture.bind(this));
  }
  #watchSwipeGesture() {
    const { pointer } = this.#media.$state;
    if (pointer() !== "coarse" || !this.#delegate.swipeGesture()) {
      this.#provider = null;
      return;
    }
    this.#provider = this.#media.player.el?.querySelector(
      "media-provider,[data-media-provider]"
    );
    if (!this.#provider) return;
    new _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.EventsController(this.#provider).add("touchstart", this.#onTouchStart.bind(this), {
      passive: true
    }).add("touchmove", this.#onTouchMove.bind(this), { passive: false });
  }
  #provider = null;
  #touch = null;
  #touchStartValue = null;
  #onTouchStart(event) {
    this.#touch = event.touches[0];
  }
  #onTouchMove(event) {
    if ((0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isNull)(this.#touch) || isTouchPinchEvent(event)) return;
    const touch = event.touches[0], xDiff = touch.clientX - this.#touch.clientX, yDiff = touch.clientY - this.#touch.clientY, isDragging = this.$state.dragging();
    if (!isDragging && Math.abs(yDiff) > 5) {
      return;
    }
    if (isDragging) return;
    event.preventDefault();
    if (Math.abs(xDiff) > 20) {
      this.#touch = touch;
      this.#touchStartValue = this.$state.value();
      this.#onStartDragging(this.#touchStartValue, event);
    }
  }
  #attachEventListeners(el) {
    const { hidden } = this.$props;
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.listenEvent)(el, "focus", this.#onFocus.bind(this));
    if (hidden() || this.#delegate.isDisabled()) return;
    new _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.EventsController(el).add("keyup", this.#onKeyUp.bind(this)).add("keydown", this.#onKeyDown.bind(this)).add("pointerenter", this.#onPointerEnter.bind(this)).add("pointermove", this.#onPointerMove.bind(this)).add("pointerleave", this.#onPointerLeave.bind(this)).add("pointerdown", this.#onPointerDown.bind(this));
  }
  #attachPointerListeners(el) {
    if (this.#delegate.isDisabled() || !this.$state.dragging()) return;
    new _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.EventsController(document).add("pointerup", this.#onDocumentPointerUp.bind(this), { capture: true }).add("pointermove", this.#onDocumentPointerMove.bind(this)).add("touchmove", this.#onDocumentTouchMove.bind(this), {
      passive: false
    });
  }
  #onFocus() {
    this.#updatePointerValue(this.$state.value());
  }
  #updateValue(newValue, trigger) {
    const { value, min, max, dragging } = this.$state;
    const clampedValue = Math.max(min(), Math.min(newValue, max()));
    value.set(clampedValue);
    const event = this.createEvent("value-change", { detail: clampedValue, trigger });
    this.dispatch(event);
    this.#delegate.onValueChange?.(event);
    if (dragging()) {
      const event2 = this.createEvent("drag-value-change", { detail: clampedValue, trigger });
      this.dispatch(event2);
      this.#delegate.onDragValueChange?.(event2);
    }
  }
  #updatePointerValue(value, trigger) {
    const { pointerValue, dragging } = this.$state;
    pointerValue.set(value);
    this.dispatch("pointer-value-change", { detail: value, trigger });
    if (dragging()) {
      this.#updateValue(value, trigger);
    }
  }
  #getPointerValue(event) {
    let thumbPositionRate, rect = this.el.getBoundingClientRect(), { min, max } = this.$state;
    if (this.$props.orientation() === "vertical") {
      const { bottom: trackBottom, height: trackHeight } = rect;
      thumbPositionRate = (trackBottom - event.clientY) / trackHeight;
    } else {
      if (this.#touch && (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isNumber)(this.#touchStartValue)) {
        const { width } = this.#provider.getBoundingClientRect(), rate = (event.clientX - this.#touch.clientX) / width, range = max() - min(), diff = range * Math.abs(rate);
        thumbPositionRate = (rate < 0 ? this.#touchStartValue - diff : this.#touchStartValue + diff) / range;
      } else {
        const { left: trackLeft, width: trackWidth } = rect;
        thumbPositionRate = (event.clientX - trackLeft) / trackWidth;
      }
    }
    return Math.max(
      min(),
      Math.min(
        max(),
        this.#delegate.roundValue(
          getValueFromRate(min(), max(), thumbPositionRate, this.#delegate.getStep())
        )
      )
    );
  }
  #onPointerEnter(event) {
    this.$state.pointing.set(true);
  }
  #onPointerMove(event) {
    const { dragging } = this.$state;
    if (dragging()) return;
    this.#updatePointerValue(this.#getPointerValue(event), event);
  }
  #onPointerLeave(event) {
    this.$state.pointing.set(false);
  }
  #onPointerDown(event) {
    if (event.button !== 0) return;
    const value = this.#getPointerValue(event);
    this.#onStartDragging(value, event);
    this.#updatePointerValue(value, event);
  }
  #onStartDragging(value, trigger) {
    const { dragging } = this.$state;
    if (dragging()) return;
    dragging.set(true);
    this.#media.remote.pauseControls(trigger);
    const event = this.createEvent("drag-start", { detail: value, trigger });
    this.dispatch(event);
    this.#delegate.onDragStart?.(event);
    this.#observer?.onDragStart?.();
  }
  #onStopDragging(value, trigger) {
    const { dragging } = this.$state;
    if (!dragging()) return;
    dragging.set(false);
    this.#media.remote.resumeControls(trigger);
    const event = this.createEvent("drag-end", { detail: value, trigger });
    this.dispatch(event);
    this.#delegate.onDragEnd?.(event);
    this.#touch = null;
    this.#touchStartValue = null;
    this.#observer?.onDragEnd?.();
  }
  // -------------------------------------------------------------------------------------------
  // Keyboard Events
  // -------------------------------------------------------------------------------------------
  #lastDownKey;
  #repeatedKeys = false;
  #onKeyDown(event) {
    const isValidKey = Object.keys(SliderKeyDirection).includes(event.key);
    if (!isValidKey) return;
    const { key } = event, jumpValue = this.#calcJumpValue(event);
    if (!(0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isNull)(jumpValue)) {
      this.#updatePointerValue(jumpValue, event);
      this.#updateValue(jumpValue, event);
      return;
    }
    const newValue = this.#calcNewKeyValue(event);
    if (!this.#repeatedKeys) {
      this.#repeatedKeys = key === this.#lastDownKey;
      if (!this.$state.dragging() && this.#repeatedKeys) {
        this.#onStartDragging(newValue, event);
      }
    }
    this.#updatePointerValue(newValue, event);
    this.#lastDownKey = key;
  }
  #onKeyUp(event) {
    const isValidKey = Object.keys(SliderKeyDirection).includes(event.key);
    if (!isValidKey || !(0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isNull)(this.#calcJumpValue(event))) return;
    const newValue = this.#repeatedKeys ? this.$state.pointerValue() : this.#calcNewKeyValue(event);
    this.#updateValue(newValue, event);
    this.#onStopDragging(newValue, event);
    this.#lastDownKey = "";
    this.#repeatedKeys = false;
  }
  #calcJumpValue(event) {
    let key = event.key, { min, max } = this.$state;
    if (key === "Home" || key === "PageUp") {
      return min();
    } else if (key === "End" || key === "PageDown") {
      return max();
    } else if (!event.metaKey && /^[0-9]$/.test(key)) {
      return (max() - min()) / 10 * Number(key);
    }
    return null;
  }
  #calcNewKeyValue(event) {
    const { key, shiftKey } = event;
    event.preventDefault();
    event.stopPropagation();
    const { shiftKeyMultiplier } = this.$props;
    const { min, max, value, pointerValue } = this.$state, step = this.#delegate.getStep(), keyStep = this.#delegate.getKeyStep();
    const modifiedStep = !shiftKey ? keyStep : keyStep * shiftKeyMultiplier(), direction = Number(SliderKeyDirection[key]), diff = modifiedStep * direction, currentValue = this.#repeatedKeys ? pointerValue() : this.#delegate.getValue?.() ?? value(), steps = (currentValue + diff) / step;
    return Math.max(min(), Math.min(max(), Number((step * steps).toFixed(3))));
  }
  // -------------------------------------------------------------------------------------------
  // Document (Pointer Events)
  // -------------------------------------------------------------------------------------------
  #onDocumentPointerUp(event) {
    if (event.button !== 0) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const value = this.#getPointerValue(event);
    this.#updatePointerValue(value, event);
    this.#onStopDragging(value, event);
  }
  #onDocumentTouchMove(event) {
    event.preventDefault();
  }
  #onDocumentPointerMove = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.functionThrottle)(
    (event) => {
      this.#updatePointerValue(this.#getPointerValue(event), event);
    },
    20,
    { leading: true }
  );
}

const sliderValueFormatContext = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.createContext)(() => ({}));

class SliderController extends _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.ViewController {
  static props = {
    hidden: false,
    disabled: false,
    step: 1,
    keyStep: 1,
    orientation: "horizontal",
    shiftKeyMultiplier: 5
  };
  #media;
  #delegate;
  #isVisible = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.signal)(true);
  #isIntersecting = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.signal)(true);
  constructor(delegate) {
    super();
    this.#delegate = delegate;
  }
  onSetup() {
    this.#media = useMediaContext();
    const focus = new FocusVisibleController();
    focus.attach(this);
    this.$state.focused = focus.focused.bind(focus);
    if (!(0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.hasProvidedContext)(sliderValueFormatContext)) {
      (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.provideContext)(sliderValueFormatContext, {
        default: "value"
      });
    }
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.provideContext)(sliderContext, {
      orientation: this.$props.orientation,
      disabled: this.#delegate.isDisabled,
      preview: (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.signal)(null)
    });
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#watchValue.bind(this));
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#watchStep.bind(this));
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#watchDisabled.bind(this));
    this.#setupAttrs();
    new SliderEventsController(this.#delegate, this.#media).attach(this);
    new IntersectionObserverController({
      callback: this.#onIntersectionChange.bind(this)
    }).attach(this);
  }
  onAttach(el) {
    setAttributeIfEmpty(el, "role", "slider");
    setAttributeIfEmpty(el, "tabindex", "0");
    setAttributeIfEmpty(el, "autocomplete", "off");
    if (IS_SERVER) this.#watchCSSVars();
    else (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#watchCSSVars.bind(this));
  }
  onConnect(el) {
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.onDispose)(observeVisibility(el, this.#isVisible.set));
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#watchHidden.bind(this));
  }
  #onIntersectionChange(entries) {
    this.#isIntersecting.set(entries[0].isIntersecting);
  }
  // -------------------------------------------------------------------------------------------
  // Watch
  // -------------------------------------------------------------------------------------------
  #watchHidden() {
    const { hidden } = this.$props;
    this.$state.hidden.set(hidden() || !this.#isVisible() || !this.#isIntersecting.bind(this));
  }
  #watchValue() {
    const { dragging, value, min, max } = this.$state;
    if ((0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.peek)(dragging)) return;
    value.set(getClampedValue(min(), max(), value(), this.#delegate.getStep()));
  }
  #watchStep() {
    this.$state.step.set(this.#delegate.getStep());
  }
  #watchDisabled() {
    if (!this.#delegate.isDisabled()) return;
    const { dragging, pointing } = this.$state;
    dragging.set(false);
    pointing.set(false);
  }
  // -------------------------------------------------------------------------------------------
  // ARIA
  // -------------------------------------------------------------------------------------------
  #getARIADisabled() {
    return (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.ariaBool)(this.#delegate.isDisabled());
  }
  // -------------------------------------------------------------------------------------------
  // Attributes
  // -------------------------------------------------------------------------------------------
  #setupAttrs() {
    const { orientation } = this.$props, { dragging, active, pointing } = this.$state;
    this.setAttributes({
      "data-dragging": dragging,
      "data-pointing": pointing,
      "data-active": active,
      "aria-disabled": this.#getARIADisabled.bind(this),
      "aria-valuemin": this.#delegate.aria.valueMin ?? this.$state.min,
      "aria-valuemax": this.#delegate.aria.valueMax ?? this.$state.max,
      "aria-valuenow": this.#delegate.aria.valueNow,
      "aria-valuetext": this.#delegate.aria.valueText,
      "aria-orientation": orientation
    });
  }
  #watchCSSVars() {
    const { fillPercent, pointerPercent } = this.$state;
    this.#updateSliderVars(round(fillPercent(), 3), round(pointerPercent(), 3));
  }
  #updateSliderVars = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.animationFrameThrottle)((fillPercent, pointerPercent) => {
    this.el?.style.setProperty("--slider-fill", fillPercent + "%");
    this.el?.style.setProperty("--slider-pointer", pointerPercent + "%");
  });
}

class Slider extends _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.Component {
  static props = {
    ...SliderController.props,
    min: 0,
    max: 100,
    value: 0
  };
  static state = sliderState;
  constructor() {
    super();
    new SliderController({
      getStep: this.$props.step,
      getKeyStep: this.$props.keyStep,
      roundValue: Math.round,
      isDisabled: this.$props.disabled,
      aria: {
        valueNow: this.#getARIAValueNow.bind(this),
        valueText: this.#getARIAValueText.bind(this)
      }
    });
  }
  onSetup() {
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#watchValue.bind(this));
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#watchMinMax.bind(this));
  }
  // -------------------------------------------------------------------------------------------
  // Props
  // -------------------------------------------------------------------------------------------
  #getARIAValueNow() {
    const { value } = this.$state;
    return Math.round(value());
  }
  #getARIAValueText() {
    const { value, max } = this.$state;
    return round(value() / max() * 100, 2) + "%";
  }
  // -------------------------------------------------------------------------------------------
  // Watch
  // -------------------------------------------------------------------------------------------
  #watchValue() {
    const { value } = this.$props;
    this.$state.value.set(value());
  }
  #watchMinMax() {
    const { min, max } = this.$props;
    this.$state.min.set(min());
    this.$state.max.set(max());
  }
}

const cache = /* @__PURE__ */ new Map(), pending = /* @__PURE__ */ new Map(), warned = /* @__PURE__ */ new Set() ;
class ThumbnailsLoader {
  #media;
  #src;
  #crossOrigin;
  $images = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.signal)([]);
  static create(src, crossOrigin) {
    const media = useMediaContext();
    return new ThumbnailsLoader(src, crossOrigin, media);
  }
  constructor(src, crossOrigin, media) {
    this.#src = src;
    this.#crossOrigin = crossOrigin;
    this.#media = media;
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#onLoadCues.bind(this));
  }
  #onLoadCues() {
    const { canLoad } = this.#media.$state;
    if (!canLoad()) return;
    const src = this.#src();
    if (!src) return;
    if ((0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isString)(src) && cache.has(src)) {
      const cues = cache.get(src);
      cache.delete(src);
      cache.set(src, cues);
      if (cache.size > 99) {
        const firstKey = cache.keys().next().value;
        cache.delete(firstKey);
      }
      this.$images.set(cache.get(src));
    } else if ((0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isString)(src)) {
      const crossOrigin = this.#crossOrigin(), currentKey = src + "::" + crossOrigin;
      if (!pending.has(currentKey)) {
        const promise = new Promise(async (resolve, reject) => {
          try {
            const response = await fetch(src, {
              credentials: getRequestCredentials(crossOrigin)
            }), isJSON = response.headers.get("content-type") === "application/json";
            if (isJSON) {
              const json = await response.json();
              if ((0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isArray)(json)) {
                if (json[0] && "text" in json[0]) {
                  resolve(this.#processVTTCues(json));
                } else {
                  for (let i = 0; i < json.length; i++) {
                    const image = json[i];
                    assert((0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isObject)(image), `Item not an object at index ${i}`);
                    assert(
                      "url" in image && (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isString)(image.url),
                      `Invalid or missing \`url\` property at index ${i}`
                    );
                    assert(
                      "startTime" in image && (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isNumber)(image.startTime),
                      `Invalid or missing \`startTime\` property at index ${i}`
                    );
                  }
                  resolve(json);
                }
              } else {
                resolve(this.#processStoryboard(json));
              }
              return;
            }
            __webpack_require__.e(/*! import() */ "vendors-node_modules_media-captions_dist_dev_js").then(__webpack_require__.bind(__webpack_require__, /*! media-captions */ "./node_modules/media-captions/dist/dev.js")).then(async ({ parseResponse }) => {
              try {
                const { cues } = await parseResponse(response);
                resolve(this.#processVTTCues(cues));
              } catch (e) {
                reject(e);
              }
            });
          } catch (e) {
            reject(e);
          }
        }).then((images) => {
          cache.set(currentKey, images);
          return images;
        }).catch((error) => {
          this.#onError(src, error);
        }).finally(() => {
          if ((0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isString)(currentKey)) pending.delete(currentKey);
        });
        pending.set(currentKey, promise);
      }
      pending.get(currentKey)?.then((images) => {
        this.$images.set(images || []);
      });
    } else if ((0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isArray)(src)) {
      try {
        this.$images.set(this.#processImages(src));
      } catch (error) {
        this.#onError(src, error);
      }
    } else {
      try {
        this.$images.set(this.#processStoryboard(src));
      } catch (error) {
        this.#onError(src, error);
      }
    }
    return () => {
      this.$images.set([]);
    };
  }
  #processImages(images) {
    const baseURL = this.#resolveBaseUrl();
    return images.map((img, i) => {
      assert(
        img.url && (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isString)(img.url),
        `Invalid or missing \`url\` property at index ${i}`
      );
      assert(
        "startTime" in img && (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isNumber)(img.startTime),
        `Invalid or missing \`startTime\` property at index ${i}`
      );
      return {
        ...img,
        url: (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isString)(img.url) ? this.#resolveURL(img.url, baseURL) : img.url
      };
    });
  }
  #processStoryboard(board) {
    assert((0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isString)(board.url), "Missing `url` in storyboard object");
    assert((0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isArray)(board.tiles) && board.tiles?.length, `Empty tiles in storyboard`);
    const url = new URL(board.url), images = [];
    const tileWidth = "tile_width" in board ? board.tile_width : board.tileWidth, tileHeight = "tile_height" in board ? board.tile_height : board.tileHeight;
    for (const tile of board.tiles) {
      images.push({
        url,
        startTime: "start" in tile ? tile.start : tile.startTime,
        width: tileWidth,
        height: tileHeight,
        coords: { x: tile.x, y: tile.y }
      });
    }
    return images;
  }
  #processVTTCues(cues) {
    for (let i = 0; i < cues.length; i++) {
      const cue = cues[i];
      assert(
        "startTime" in cue && (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isNumber)(cue.startTime),
        `Invalid or missing \`startTime\` property at index ${i}`
      );
      assert(
        "text" in cue && (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isString)(cue.text),
        `Invalid or missing \`text\` property at index ${i}`
      );
    }
    const images = [], baseURL = this.#resolveBaseUrl();
    for (const cue of cues) {
      const [url, hash] = cue.text.split("#"), data = this.#resolveData(hash);
      images.push({
        url: this.#resolveURL(url, baseURL),
        startTime: cue.startTime,
        endTime: cue.endTime,
        width: data?.w,
        height: data?.h,
        coords: data && (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isNumber)(data.x) && (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isNumber)(data.y) ? { x: data.x, y: data.y } : void 0
      });
    }
    return images;
  }
  #resolveBaseUrl() {
    let baseURL = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.peek)(this.#src);
    if (!(0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isString)(baseURL) || !/^https?:/.test(baseURL)) {
      return location.href;
    }
    return baseURL;
  }
  #resolveURL(src, baseURL) {
    return /^https?:/.test(src) ? new URL(src) : new URL(src, baseURL);
  }
  #resolveData(hash) {
    if (!hash) return {};
    const [hashProps, values] = hash.split("="), hashValues = values?.split(","), data = {};
    if (!hashProps || !hashValues) {
      return null;
    }
    for (let i = 0; i < hashProps.length; i++) {
      const value = +hashValues[i];
      if (!isNaN(value)) data[hashProps[i]] = value;
    }
    return data;
  }
  #onError(src, error) {
    if (warned?.has(src)) return;
    this.#media.logger?.errorGroup("[vidstack] failed to load thumbnails").labelledLog("Src", src).labelledLog("Error", error).dispatch();
    warned?.add(src);
  }
}

class Thumbnail extends _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.Component {
  static props = {
    src: null,
    time: 0,
    crossOrigin: null
  };
  static state = new _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.State({
    src: "",
    img: null,
    thumbnails: [],
    activeThumbnail: null,
    crossOrigin: null,
    loading: false,
    error: null,
    hidden: false
  });
  media;
  #loader;
  #styleResets = [];
  onSetup() {
    this.media = useMediaContext();
    this.#loader = ThumbnailsLoader.create(this.$props.src, this.$state.crossOrigin);
    this.#watchCrossOrigin();
    this.setAttributes({
      "data-loading": this.#isLoading.bind(this),
      "data-error": this.#hasError.bind(this),
      "data-hidden": this.$state.hidden,
      "aria-hidden": $ariaBool(this.$state.hidden)
    });
  }
  onConnect(el) {
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#watchImg.bind(this));
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#watchHidden.bind(this));
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#watchCrossOrigin.bind(this));
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#onLoadStart.bind(this));
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#onFindActiveThumbnail.bind(this));
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#resize.bind(this));
  }
  #watchImg() {
    const img = this.$state.img();
    if (!img) return;
    new _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.EventsController(img).add("load", this.#onLoaded.bind(this)).add("error", this.#onError.bind(this));
  }
  #watchCrossOrigin() {
    const { crossOrigin: crossOriginProp } = this.$props, { crossOrigin: crossOriginState } = this.$state, { crossOrigin: mediaCrossOrigin } = this.media.$state, crossOrigin = crossOriginProp() !== null ? crossOriginProp() : mediaCrossOrigin();
    crossOriginState.set(crossOrigin === true ? "anonymous" : crossOrigin);
  }
  #onLoadStart() {
    const { src, loading, error } = this.$state;
    if (src()) {
      loading.set(true);
      error.set(null);
    }
    return () => {
      this.#resetStyles();
      loading.set(false);
      error.set(null);
    };
  }
  #onLoaded() {
    const { loading, error } = this.$state;
    this.#resize();
    loading.set(false);
    error.set(null);
  }
  #onError(event) {
    const { loading, error } = this.$state;
    loading.set(false);
    error.set(event);
  }
  #isLoading() {
    const { loading, hidden } = this.$state;
    return !hidden() && loading();
  }
  #hasError() {
    const { error } = this.$state;
    return !(0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isNull)(error());
  }
  #watchHidden() {
    const { hidden } = this.$state, { duration } = this.media.$state, images = this.#loader.$images();
    hidden.set(this.#hasError() || !Number.isFinite(duration()) || images.length === 0);
  }
  getTime() {
    return this.$props.time();
  }
  #onFindActiveThumbnail() {
    let images = this.#loader.$images();
    if (!images.length) return;
    let time = this.getTime(), { src, activeThumbnail } = this.$state, activeIndex = -1, activeImage = null;
    for (let i = images.length - 1; i >= 0; i--) {
      const image = images[i];
      if (time >= image.startTime && (!image.endTime || time < image.endTime)) {
        activeIndex = i;
        break;
      }
    }
    if (images[activeIndex]) {
      activeImage = images[activeIndex];
    }
    activeThumbnail.set(activeImage);
    src.set(activeImage?.url.href || "");
  }
  #resize() {
    if (!this.scope || this.$state.hidden()) return;
    const rootEl = this.el, imgEl = this.$state.img(), thumbnail = this.$state.activeThumbnail();
    if (!imgEl || !thumbnail || !rootEl) return;
    let width = thumbnail.width ?? imgEl.naturalWidth, height = thumbnail?.height ?? imgEl.naturalHeight, {
      maxWidth,
      maxHeight,
      minWidth,
      minHeight,
      width: elWidth,
      height: elHeight
    } = getComputedStyle(this.el);
    if (minWidth === "100%") minWidth = parseFloat(elWidth) + "";
    if (minHeight === "100%") minHeight = parseFloat(elHeight) + "";
    let minRatio = Math.max(parseInt(minWidth) / width, parseInt(minHeight) / height), maxRatio = Math.min(
      Math.max(parseInt(minWidth), parseInt(maxWidth)) / width,
      Math.max(parseInt(minHeight), parseInt(maxHeight)) / height
    ), scale = !isNaN(maxRatio) && maxRatio < 1 ? maxRatio : minRatio > 1 ? minRatio : 1;
    this.#style(rootEl, "--thumbnail-width", `${width * scale}px`);
    this.#style(rootEl, "--thumbnail-height", `${height * scale}px`);
    this.#style(rootEl, "--thumbnail-aspect-ratio", String(round(width / height, 5)));
    this.#style(imgEl, "width", `${imgEl.naturalWidth * scale}px`);
    this.#style(imgEl, "height", `${imgEl.naturalHeight * scale}px`);
    this.#style(
      imgEl,
      "transform",
      thumbnail.coords ? `translate(-${thumbnail.coords.x * scale}px, -${thumbnail.coords.y * scale}px)` : ""
    );
    this.#style(imgEl, "max-width", "none");
  }
  #style(el, name, value) {
    el.style.setProperty(name, value);
    this.#styleResets.push(() => el.style.removeProperty(name));
  }
  #resetStyles() {
    for (const reset of this.#styleResets) reset();
    this.#styleResets = [];
  }
}

class SliderThumbnail extends Thumbnail {
  #slider;
  onAttach(el) {
    this.#slider = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.useState)(Slider.state);
  }
  getTime() {
    const { duration, clipStartTime } = this.media.$state;
    return clipStartTime() + this.#slider.pointerRate() * duration();
  }
}

class SliderVideo extends _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.Component {
  static props = {
    src: null,
    crossOrigin: null
  };
  static state = new _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.State({
    video: null,
    src: null,
    crossOrigin: null,
    canPlay: false,
    error: null,
    hidden: false
  });
  #media;
  #slider;
  get video() {
    return this.$state.video();
  }
  onSetup() {
    this.#media = useMediaContext();
    this.#slider = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.useState)(Slider.state);
    this.#watchCrossOrigin();
    this.setAttributes({
      "data-loading": this.#isLoading.bind(this),
      "data-hidden": this.$state.hidden,
      "data-error": this.#hasError.bind(this),
      "aria-hidden": $ariaBool(this.$state.hidden)
    });
  }
  onAttach(el) {
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#watchVideo.bind(this));
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#watchSrc.bind(this));
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#watchCrossOrigin.bind(this));
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#watchHidden.bind(this));
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#onSrcChange.bind(this));
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#onUpdateTime.bind(this));
  }
  #watchVideo() {
    const video = this.$state.video();
    if (!video) return;
    if (video.readyState >= 2) this.#onCanPlay();
    new _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.EventsController(video).add("canplay", this.#onCanPlay.bind(this)).add("error", this.#onError.bind(this));
  }
  #watchSrc() {
    const { src } = this.$state, { canLoad } = this.#media.$state;
    src.set(canLoad() ? this.$props.src() : null);
  }
  #watchCrossOrigin() {
    const { crossOrigin: crossOriginProp } = this.$props, { crossOrigin: crossOriginState } = this.$state, { crossOrigin: mediaCrossOrigin } = this.#media.$state, crossOrigin = crossOriginProp() !== null ? crossOriginProp() : mediaCrossOrigin();
    crossOriginState.set(crossOrigin === true ? "anonymous" : crossOrigin);
  }
  #isLoading() {
    const { canPlay, hidden } = this.$state;
    return !canPlay() && !hidden();
  }
  #hasError() {
    const { error } = this.$state;
    return !(0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isNull)(error);
  }
  #watchHidden() {
    const { src, hidden } = this.$state, { canLoad, duration } = this.#media.$state;
    hidden.set(canLoad() && (!src() || this.#hasError() || !Number.isFinite(duration())));
  }
  #onSrcChange() {
    const { src, canPlay, error } = this.$state;
    src();
    canPlay.set(false);
    error.set(null);
  }
  #onCanPlay(event) {
    const { canPlay, error } = this.$state;
    canPlay.set(true);
    error.set(null);
    this.dispatch("can-play", { trigger: event });
  }
  #onError(event) {
    const { canPlay, error } = this.$state;
    canPlay.set(false);
    error.set(event);
    this.dispatch("error", { trigger: event });
  }
  #onUpdateTime() {
    const { video, canPlay } = this.$state, { duration } = this.#media.$state, { pointerRate } = this.#slider, media = video(), canUpdate = canPlay() && media && Number.isFinite(duration()) && Number.isFinite(pointerRate());
    if (canUpdate) {
      media.currentTime = pointerRate() * duration();
    }
  }
}
const slidervideo__proto = SliderVideo.prototype;
(0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.prop)(slidervideo__proto, "video");

class SliderValue extends _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.Component {
  static props = {
    type: "pointer",
    format: null,
    showHours: false,
    showMs: false,
    padHours: null,
    padMinutes: null,
    decimalPlaces: 2
  };
  #format;
  #text;
  #slider;
  onSetup() {
    this.#slider = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.useState)(Slider.state);
    this.#format = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.useContext)(sliderValueFormatContext);
    this.#text = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.computed)(this.getValueText.bind(this));
  }
  /**
   * Returns the current value formatted as text based on prop settings.
   */
  getValueText() {
    const {
      type,
      format: $format,
      decimalPlaces,
      padHours,
      padMinutes,
      showHours,
      showMs
    } = this.$props, { value: sliderValue, pointerValue, min, max } = this.#slider, format = $format?.() ?? this.#format.default;
    const value = type() === "current" ? sliderValue() : pointerValue();
    if (format === "percent") {
      const range = max() - min();
      const percent = value / range * 100;
      return (this.#format.percent ?? round)(percent, decimalPlaces()) + "%";
    } else if (format === "time") {
      return (this.#format.time ?? formatTime)(value, {
        padHrs: padHours(),
        padMins: padMinutes(),
        showHrs: showHours(),
        showMs: showMs()
      });
    } else {
      return (this.#format.value?.(value) ?? value.toFixed(2)) + "";
    }
  }
}
const slidervalue__proto = SliderValue.prototype;
(0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.method)(slidervalue__proto, "getValueText");

class SliderPreview extends _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.Component {
  static props = {
    offset: 0,
    noClamp: false
  };
  #slider;
  onSetup() {
    this.#slider = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.useContext)(sliderContext);
    const { active } = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.useState)(Slider.state);
    this.setAttributes({
      "data-visible": active
    });
  }
  onAttach(el) {
    Object.assign(el.style, {
      position: "absolute",
      top: 0,
      left: 0,
      width: "max-content"
    });
  }
  onConnect(el) {
    const { preview } = this.#slider;
    preview.set(el);
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.onDispose)(() => preview.set(null));
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#updatePlacement.bind(this));
    const resize = new ResizeObserver(this.#updatePlacement.bind(this));
    resize.observe(el);
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.onDispose)(() => resize.disconnect());
  }
  #updatePlacement = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.animationFrameThrottle)(() => {
    const { disabled, orientation } = this.#slider;
    if (disabled()) return;
    const el = this.el, { offset, noClamp } = this.$props;
    if (!el) return;
    updateSliderPreviewPlacement(el, {
      clamp: !noClamp(),
      offset: offset(),
      orientation: orientation()
    });
  });
}
function updateSliderPreviewPlacement(el, {
  clamp,
  offset,
  orientation
}) {
  const computedStyle = getComputedStyle(el), width = parseFloat(computedStyle.width), height = parseFloat(computedStyle.height), styles = {
    top: null,
    right: null,
    bottom: null,
    left: null
  };
  styles[orientation === "horizontal" ? "bottom" : "left"] = `calc(100% + var(--media-slider-preview-offset, ${offset}px))`;
  if (orientation === "horizontal") {
    const widthHalf = width / 2;
    if (!clamp) {
      styles.left = `calc(var(--slider-pointer) - ${widthHalf}px)`;
    } else {
      const leftClamp = `max(0px, calc(var(--slider-pointer) - ${widthHalf}px))`, rightClamp = `calc(100% - ${width}px)`;
      styles.left = `min(${leftClamp}, ${rightClamp})`;
    }
  } else {
    const heightHalf = height / 2;
    if (!clamp) {
      styles.bottom = `calc(var(--slider-pointer) - ${heightHalf}px)`;
    } else {
      const topClamp = `max(${heightHalf}px, calc(var(--slider-pointer) - ${heightHalf}px))`, bottomClamp = `calc(100% - ${height}px)`;
      styles.bottom = `min(${topClamp}, ${bottomClamp})`;
    }
  }
  Object.assign(el.style, styles);
}

class VolumeSlider extends _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.Component {
  static props = {
    ...SliderController.props,
    keyStep: 5,
    shiftKeyMultiplier: 2
  };
  static state = sliderState;
  #media;
  onSetup() {
    this.#media = useMediaContext();
    const { audioGain } = this.#media.$state;
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.provideContext)(sliderValueFormatContext, {
      default: "percent",
      value(value) {
        return (value * (audioGain() ?? 1)).toFixed(2);
      },
      percent(value) {
        return Math.round(value * (audioGain() ?? 1));
      }
    });
    new SliderController({
      getStep: this.$props.step,
      getKeyStep: this.$props.keyStep,
      roundValue: Math.round,
      isDisabled: this.#isDisabled.bind(this),
      aria: {
        valueMax: this.#getARIAValueMax.bind(this),
        valueNow: this.#getARIAValueNow.bind(this),
        valueText: this.#getARIAValueText.bind(this)
      },
      onDragValueChange: this.#onDragValueChange.bind(this),
      onValueChange: this.#onValueChange.bind(this)
    }).attach(this);
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#watchVolume.bind(this));
  }
  onAttach(el) {
    el.setAttribute("data-media-volume-slider", "");
    setAttributeIfEmpty(el, "aria-label", "Volume");
    const { canSetVolume } = this.#media.$state;
    this.setAttributes({
      "data-supported": canSetVolume,
      "aria-hidden": $ariaBool(() => !canSetVolume())
    });
  }
  #getARIAValueNow() {
    const { value } = this.$state, { audioGain } = this.#media.$state;
    return Math.round(value() * (audioGain() ?? 1));
  }
  #getARIAValueText() {
    const { value, max } = this.$state, { audioGain } = this.#media.$state;
    return round(value() / max() * (audioGain() ?? 1) * 100, 2) + "%";
  }
  #getARIAValueMax() {
    const { audioGain } = this.#media.$state;
    return this.$state.max() * (audioGain() ?? 1);
  }
  #isDisabled() {
    const { disabled } = this.$props, { canSetVolume } = this.#media.$state;
    return disabled() || !canSetVolume();
  }
  #watchVolume() {
    const { muted, volume } = this.#media.$state;
    const newValue = muted() ? 0 : volume() * 100;
    this.$state.value.set(newValue);
    this.dispatch("value-change", { detail: newValue });
  }
  #throttleVolumeChange = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.functionThrottle)(this.#onVolumeChange.bind(this), 25);
  #onVolumeChange(event) {
    if (!event.trigger) return;
    const mediaVolume = round(event.detail / 100, 3);
    this.#media.remote.changeVolume(mediaVolume, event);
  }
  #onValueChange(event) {
    this.#throttleVolumeChange(event);
  }
  #onDragValueChange(event) {
    this.#throttleVolumeChange(event);
  }
}

class AudioGainSlider extends _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.Component {
  static props = {
    ...SliderController.props,
    step: 25,
    keyStep: 25,
    shiftKeyMultiplier: 2,
    min: 0,
    max: 300
  };
  static state = sliderState;
  #media;
  onSetup() {
    this.#media = useMediaContext();
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.provideContext)(sliderValueFormatContext, {
      default: "percent",
      percent: (_, decimalPlaces) => {
        return round(this.$state.value(), decimalPlaces) + "%";
      }
    });
    new SliderController({
      getStep: this.$props.step,
      getKeyStep: this.$props.keyStep,
      roundValue: Math.round,
      isDisabled: this.#isDisabled.bind(this),
      aria: {
        valueNow: this.#getARIAValueNow.bind(this),
        valueText: this.#getARIAValueText.bind(this)
      },
      onDragValueChange: this.#onDragValueChange.bind(this),
      onValueChange: this.#onValueChange.bind(this)
    }).attach(this);
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#watchMinMax.bind(this));
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#watchAudioGain.bind(this));
  }
  onAttach(el) {
    el.setAttribute("data-media-audio-gain-slider", "");
    setAttributeIfEmpty(el, "aria-label", "Audio Boost");
    const { canSetAudioGain } = this.#media.$state;
    this.setAttributes({
      "data-supported": canSetAudioGain,
      "aria-hidden": $ariaBool(() => !canSetAudioGain())
    });
  }
  #getARIAValueNow() {
    const { value } = this.$state;
    return Math.round(value());
  }
  #getARIAValueText() {
    const { value } = this.$state;
    return value() + "%";
  }
  #watchMinMax() {
    const { min, max } = this.$props;
    this.$state.min.set(min());
    this.$state.max.set(max());
  }
  #watchAudioGain() {
    const { audioGain } = this.#media.$state, value = ((audioGain() ?? 1) - 1) * 100;
    this.$state.value.set(value);
    this.dispatch("value-change", { detail: value });
  }
  #isDisabled() {
    const { disabled } = this.$props, { canSetAudioGain } = this.#media.$state;
    return disabled() || !canSetAudioGain();
  }
  #onAudioGainChange(event) {
    if (!event.trigger) return;
    const gain = round(1 + event.detail / 100, 2);
    this.#media.remote.changeAudioGain(gain, event);
  }
  #onValueChange(event) {
    this.#onAudioGainChange(event);
  }
  #onDragValueChange(event) {
    this.#onAudioGainChange(event);
  }
}

class SpeedSlider extends _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.Component {
  static props = {
    ...SliderController.props,
    step: 0.25,
    keyStep: 0.25,
    shiftKeyMultiplier: 2,
    min: 0,
    max: 2
  };
  static state = sliderState;
  #media;
  onSetup() {
    this.#media = useMediaContext();
    new SliderController({
      getStep: this.$props.step,
      getKeyStep: this.$props.keyStep,
      roundValue: this.#roundValue,
      isDisabled: this.#isDisabled.bind(this),
      aria: {
        valueNow: this.#getARIAValueNow.bind(this),
        valueText: this.#getARIAValueText.bind(this)
      },
      onDragValueChange: this.#onDragValueChange.bind(this),
      onValueChange: this.#onValueChange.bind(this)
    }).attach(this);
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#watchMinMax.bind(this));
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#watchPlaybackRate.bind(this));
  }
  onAttach(el) {
    el.setAttribute("data-media-speed-slider", "");
    setAttributeIfEmpty(el, "aria-label", "Speed");
    const { canSetPlaybackRate } = this.#media.$state;
    this.setAttributes({
      "data-supported": canSetPlaybackRate,
      "aria-hidden": $ariaBool(() => !canSetPlaybackRate())
    });
  }
  #getARIAValueNow() {
    const { value } = this.$state;
    return value();
  }
  #getARIAValueText() {
    const { value } = this.$state;
    return value() + "x";
  }
  #watchMinMax() {
    const { min, max } = this.$props;
    this.$state.min.set(min());
    this.$state.max.set(max());
  }
  #watchPlaybackRate() {
    const { playbackRate } = this.#media.$state;
    const newValue = playbackRate();
    this.$state.value.set(newValue);
    this.dispatch("value-change", { detail: newValue });
  }
  #roundValue(value) {
    return round(value, 2);
  }
  #isDisabled() {
    const { disabled } = this.$props, { canSetPlaybackRate } = this.#media.$state;
    return disabled() || !canSetPlaybackRate();
  }
  #throttledSpeedChange = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.functionThrottle)(this.#onPlaybackRateChange.bind(this), 25);
  #onPlaybackRateChange(event) {
    if (!event.trigger) return;
    const rate = event.detail;
    this.#media.remote.changePlaybackRate(rate, event);
  }
  #onValueChange(event) {
    this.#throttledSpeedChange(event);
  }
  #onDragValueChange(event) {
    this.#throttledSpeedChange(event);
  }
}

class QualitySlider extends _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.Component {
  static props = {
    ...SliderController.props,
    step: 1,
    keyStep: 1,
    shiftKeyMultiplier: 1
  };
  static state = sliderState;
  #media;
  #sortedQualities = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.computed)(() => {
    const { qualities } = this.#media.$state;
    return sortVideoQualities(qualities());
  });
  onSetup() {
    this.#media = useMediaContext();
    new SliderController({
      getStep: this.$props.step,
      getKeyStep: this.$props.keyStep,
      roundValue: Math.round,
      isDisabled: this.#isDisabled.bind(this),
      aria: {
        valueNow: this.#getARIAValueNow.bind(this),
        valueText: this.#getARIAValueText.bind(this)
      },
      onDragValueChange: this.#onDragValueChange.bind(this),
      onValueChange: this.#onValueChange.bind(this)
    }).attach(this);
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#watchMax.bind(this));
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#watchQuality.bind(this));
  }
  onAttach(el) {
    el.setAttribute("data-media-quality-slider", "");
    setAttributeIfEmpty(el, "aria-label", "Video Quality");
    const { qualities, canSetQuality } = this.#media.$state, $supported = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.computed)(() => canSetQuality() && qualities().length > 0);
    this.setAttributes({
      "data-supported": $supported,
      "aria-hidden": $ariaBool(() => !$supported())
    });
  }
  #getARIAValueNow() {
    const { value } = this.$state;
    return value();
  }
  #getARIAValueText() {
    const { quality } = this.#media.$state;
    if (!quality()) return "";
    const { height, bitrate } = quality(), bitrateText = bitrate && bitrate > 0 ? `${(bitrate / 1e6).toFixed(2)} Mbps` : null;
    return height ? `${height}p${bitrateText ? ` (${bitrateText})` : ""}` : "Auto";
  }
  #watchMax() {
    const $qualities = this.#sortedQualities();
    this.$state.max.set(Math.max(0, $qualities.length - 1));
  }
  #watchQuality() {
    let { quality } = this.#media.$state, $qualities = this.#sortedQualities(), value = Math.max(0, $qualities.indexOf(quality()));
    this.$state.value.set(value);
    this.dispatch("value-change", { detail: value });
  }
  #isDisabled() {
    const { disabled } = this.$props, { canSetQuality, qualities } = this.#media.$state;
    return disabled() || qualities().length <= 1 || !canSetQuality();
  }
  #throttledQualityChange = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.functionThrottle)(this.#onQualityChange.bind(this), 25);
  #onQualityChange(event) {
    if (!event.trigger) return;
    const { qualities } = this.#media, quality = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.peek)(this.#sortedQualities)[event.detail];
    this.#media.remote.changeQuality(qualities.indexOf(quality), event);
  }
  #onValueChange(event) {
    this.#throttledQualityChange(event);
  }
  #onDragValueChange(event) {
    this.#throttledQualityChange(event);
  }
}

class TimeSlider extends _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.Component {
  static props = {
    ...SliderController.props,
    step: 0.1,
    keyStep: 5,
    shiftKeyMultiplier: 2,
    pauseWhileDragging: false,
    noSwipeGesture: false,
    seekingRequestThrottle: 100
  };
  static state = sliderState;
  #media;
  #dispatchSeeking;
  #chapter = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.signal)(null);
  constructor() {
    super();
    const { noSwipeGesture } = this.$props;
    new SliderController({
      swipeGesture: () => !noSwipeGesture(),
      getValue: this.#getValue.bind(this),
      getStep: this.#getStep.bind(this),
      getKeyStep: this.#getKeyStep.bind(this),
      roundValue: this.#roundValue,
      isDisabled: this.#isDisabled.bind(this),
      aria: {
        valueNow: this.#getARIAValueNow.bind(this),
        valueText: this.#getARIAValueText.bind(this)
      },
      onDragStart: this.#onDragStart.bind(this),
      onDragValueChange: this.#onDragValueChange.bind(this),
      onDragEnd: this.#onDragEnd.bind(this),
      onValueChange: this.#onValueChange.bind(this)
    });
  }
  onSetup() {
    this.#media = useMediaContext();
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.provideContext)(sliderValueFormatContext, {
      default: "time",
      value: this.#formatValue.bind(this),
      time: this.#formatTime.bind(this)
    });
    this.setAttributes({
      "data-chapters": this.#hasChapters.bind(this)
    });
    this.setStyles({
      "--slider-progress": this.#calcBufferedPercent.bind(this)
    });
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#watchCurrentTime.bind(this));
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#watchSeekingThrottle.bind(this));
  }
  onAttach(el) {
    el.setAttribute("data-media-time-slider", "");
    setAttributeIfEmpty(el, "aria-label", "Seek");
  }
  onConnect(el) {
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#watchPreviewing.bind(this));
    watchActiveTextTrack(this.#media.textTracks, "chapters", this.#chapter.set);
  }
  #calcBufferedPercent() {
    const { bufferedEnd, duration } = this.#media.$state;
    return round(Math.min(bufferedEnd() / Math.max(duration(), 1), 1) * 100, 3) + "%";
  }
  #hasChapters() {
    const { duration } = this.#media.$state;
    return this.#chapter()?.cues.length && Number.isFinite(duration()) && duration() > 0;
  }
  #watchSeekingThrottle() {
    this.#dispatchSeeking = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.functionThrottle)(
      this.#seeking.bind(this),
      this.$props.seekingRequestThrottle()
    );
  }
  #watchCurrentTime() {
    if (this.$state.hidden()) return;
    const { value, dragging } = this.$state, newValue = this.#getValue();
    if (!(0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.peek)(dragging)) {
      value.set(newValue);
      this.dispatch("value-change", { detail: newValue });
    }
  }
  #watchPreviewing() {
    const player = this.#media.player.el, { preview } = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.useContext)(sliderContext);
    player && preview() && (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.setAttribute)(player, "data-preview", this.$state.active());
  }
  #seeking(time, event) {
    this.#media.remote.seeking(time, event);
  }
  #seek(time, percent, event) {
    this.#dispatchSeeking.cancel();
    const { live } = this.#media.$state;
    if (live() && percent >= 99) {
      this.#media.remote.seekToLiveEdge(event);
      return;
    }
    this.#media.remote.seek(time, event);
  }
  #playingBeforeDragStart = false;
  #onDragStart(event) {
    const { pauseWhileDragging } = this.$props;
    if (pauseWhileDragging()) {
      const { paused } = this.#media.$state;
      this.#playingBeforeDragStart = !paused();
      this.#media.remote.pause(event);
    }
  }
  #onDragValueChange(event) {
    this.#dispatchSeeking(this.#percentToTime(event.detail), event);
  }
  #onDragEnd(event) {
    const { seeking } = this.#media.$state;
    if (!(0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.peek)(seeking)) this.#seeking(this.#percentToTime(event.detail), event);
    const percent = event.detail;
    this.#seek(this.#percentToTime(percent), percent, event);
    const { pauseWhileDragging } = this.$props;
    if (pauseWhileDragging() && this.#playingBeforeDragStart) {
      this.#media.remote.play(event);
      this.#playingBeforeDragStart = false;
    }
  }
  #onValueChange(event) {
    const { dragging } = this.$state;
    if (dragging() || !event.trigger) return;
    this.#onDragEnd(event);
  }
  // -------------------------------------------------------------------------------------------
  // Props
  // -------------------------------------------------------------------------------------------
  #getValue() {
    const { currentTime } = this.#media.$state;
    return this.#timeToPercent(currentTime());
  }
  #getStep() {
    const value = this.$props.step() / this.#media.$state.duration() * 100;
    return Number.isFinite(value) ? value : 1;
  }
  #getKeyStep() {
    const value = this.$props.keyStep() / this.#media.$state.duration() * 100;
    return Number.isFinite(value) ? value : 1;
  }
  #roundValue(value) {
    return round(value, 3);
  }
  #isDisabled() {
    const { disabled } = this.$props, { canSeek } = this.#media.$state;
    return disabled() || !canSeek();
  }
  // -------------------------------------------------------------------------------------------
  // ARIA
  // -------------------------------------------------------------------------------------------
  #getARIAValueNow() {
    const { value } = this.$state;
    return Math.round(value());
  }
  #getARIAValueText() {
    const time = this.#percentToTime(this.$state.value()), { duration } = this.#media.$state;
    return Number.isFinite(time) ? `${formatSpokenTime(time)} out of ${formatSpokenTime(duration())}` : "live";
  }
  // -------------------------------------------------------------------------------------------
  // Format
  // -------------------------------------------------------------------------------------------
  #percentToTime(percent) {
    const { duration } = this.#media.$state;
    return round(percent / 100 * duration(), 5);
  }
  #timeToPercent(time) {
    const { liveEdge, duration } = this.#media.$state, rate = Math.max(0, Math.min(1, liveEdge() ? 1 : Math.min(time, duration()) / duration()));
    return Number.isNaN(rate) ? 0 : Number.isFinite(rate) ? rate * 100 : 100;
  }
  #formatValue(percent) {
    const time = this.#percentToTime(percent), { live, duration } = this.#media.$state;
    return Number.isFinite(time) ? (live() ? time - duration() : time).toFixed(0) : "LIVE";
  }
  #formatTime(percent, options) {
    const time = this.#percentToTime(percent), { live, duration } = this.#media.$state, value = live() ? time - duration() : time;
    return Number.isFinite(time) ? `${value < 0 ? "-" : ""}${formatTime(Math.abs(value), options)}` : "LIVE";
  }
}

class SliderChapters extends _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.Component {
  static props = {
    disabled: false
  };
  #media;
  #sliderState;
  #updateScope;
  #titleRef = null;
  #refs = [];
  #$track = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.signal)(null);
  #$cues = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.signal)([]);
  #activeIndex = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.signal)(-1);
  #activePointerIndex = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.signal)(-1);
  #bufferedIndex = 0;
  get cues() {
    return this.#$cues();
  }
  get activeCue() {
    return this.#$cues()[this.#activeIndex()] || null;
  }
  get activePointerCue() {
    return this.#$cues()[this.#activePointerIndex()] || null;
  }
  onSetup() {
    this.#media = useMediaContext();
    this.#sliderState = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.useState)(TimeSlider.state);
  }
  onAttach(el) {
    watchActiveTextTrack(this.#media.textTracks, "chapters", this.#setTrack.bind(this));
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#watchSource.bind(this));
  }
  onConnect() {
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.onDispose)(() => this.#reset.bind(this));
  }
  onDestroy() {
    this.#setTrack(null);
  }
  setRefs(refs) {
    this.#refs = refs;
    this.#updateScope?.dispose();
    if (this.#refs.length === 1) {
      const el = this.#refs[0];
      el.style.width = "100%";
      el.style.setProperty("--chapter-fill", "var(--slider-fill)");
      el.style.setProperty("--chapter-progress", "var(--slider-progress)");
    } else if (this.#refs.length > 0) {
      (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.scoped)(() => this.#watch(), this.#updateScope = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.createScope)());
    }
  }
  #setTrack(track) {
    if ((0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.peek)(this.#$track) === track) return;
    this.#reset();
    this.#$track.set(track);
  }
  #reset() {
    this.#refs = [];
    this.#$cues.set([]);
    this.#activeIndex.set(-1);
    this.#activePointerIndex.set(-1);
    this.#bufferedIndex = 0;
    this.#updateScope?.dispose();
  }
  #watch() {
    if (!this.#refs.length) return;
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#watchUpdates.bind(this));
  }
  #watchUpdates() {
    const { hidden } = this.#sliderState;
    if (hidden()) return;
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#watchContainerWidths.bind(this));
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#watchFillPercent.bind(this));
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#watchPointerPercent.bind(this));
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#watchBufferedPercent.bind(this));
  }
  #watchContainerWidths() {
    const cues = this.#$cues();
    if (!cues.length) return;
    let cue, { seekableStart, seekableEnd } = this.#media.$state, startTime = seekableStart(), endTime = seekableEnd() || cues[cues.length - 1].endTime, duration = endTime - startTime, remainingWidth = 100;
    for (let i = 0; i < cues.length; i++) {
      cue = cues[i];
      if (this.#refs[i]) {
        const width = i === cues.length - 1 ? remainingWidth : round((cue.endTime - Math.max(startTime, cue.startTime)) / duration * 100, 3);
        this.#refs[i].style.width = width + "%";
        remainingWidth -= width;
      }
    }
  }
  #watchFillPercent() {
    let { liveEdge, seekableStart, seekableEnd } = this.#media.$state, { fillPercent, value } = this.#sliderState, cues = this.#$cues(), isLiveEdge = liveEdge(), prevActiveIndex = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.peek)(this.#activeIndex), currentChapter = cues[prevActiveIndex];
    let currentActiveIndex = isLiveEdge ? this.#$cues.length - 1 : this.#findActiveChapterIndex(
      currentChapter ? currentChapter.startTime / seekableEnd() * 100 <= (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.peek)(value) ? prevActiveIndex : 0 : 0,
      fillPercent()
    );
    if (isLiveEdge || !currentChapter) {
      this.#updateFillPercents(0, cues.length, 100);
    } else if (currentActiveIndex > prevActiveIndex) {
      this.#updateFillPercents(prevActiveIndex, currentActiveIndex, 100);
    } else if (currentActiveIndex < prevActiveIndex) {
      this.#updateFillPercents(currentActiveIndex + 1, prevActiveIndex + 1, 0);
    }
    const percent = isLiveEdge ? 100 : this.#calcPercent(
      cues[currentActiveIndex],
      fillPercent(),
      seekableStart(),
      this.#getEndTime(cues)
    );
    this.#updateFillPercent(this.#refs[currentActiveIndex], percent);
    this.#activeIndex.set(currentActiveIndex);
  }
  #watchPointerPercent() {
    let { hidden, pointerPercent } = this.#sliderState;
    if (hidden()) {
      this.#activePointerIndex.set(-1);
      return;
    }
    const activeIndex = this.#findActiveChapterIndex(0, pointerPercent());
    this.#activePointerIndex.set(activeIndex);
  }
  #updateFillPercents(start, end, percent) {
    for (let i = start; i < end; i++) this.#updateFillPercent(this.#refs[i], percent);
  }
  #updateFillPercent(ref, percent) {
    if (!ref) return;
    ref.style.setProperty("--chapter-fill", percent + "%");
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.setAttribute)(ref, "data-active", percent > 0 && percent < 100);
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.setAttribute)(ref, "data-ended", percent === 100);
  }
  #findActiveChapterIndex(startIndex, percent) {
    let chapterPercent = 0, cues = this.#$cues();
    if (percent === 0) return 0;
    else if (percent === 100) return cues.length - 1;
    let { seekableStart } = this.#media.$state, startTime = seekableStart(), endTime = this.#getEndTime(cues);
    for (let i = startIndex; i < cues.length; i++) {
      chapterPercent = this.#calcPercent(cues[i], percent, startTime, endTime);
      if (chapterPercent >= 0 && chapterPercent < 100) return i;
    }
    return 0;
  }
  #watchBufferedPercent() {
    this.#updateBufferedPercent(this.#bufferedPercent());
  }
  #updateBufferedPercent = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.animationFrameThrottle)((bufferedPercent) => {
    let percent, cues = this.#$cues(), { seekableStart } = this.#media.$state, startTime = seekableStart(), endTime = this.#getEndTime(cues);
    for (let i = this.#bufferedIndex; i < this.#refs.length; i++) {
      percent = this.#calcPercent(cues[i], bufferedPercent, startTime, endTime);
      this.#refs[i]?.style.setProperty("--chapter-progress", percent + "%");
      if (percent < 100) {
        this.#bufferedIndex = i;
        break;
      }
    }
  });
  #bufferedPercent = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.computed)(this.#calcMediaBufferedPercent.bind(this));
  #calcMediaBufferedPercent() {
    const { bufferedEnd, duration } = this.#media.$state;
    return round(Math.min(bufferedEnd() / Math.max(duration(), 1), 1), 3) * 100;
  }
  #getEndTime(cues) {
    const { seekableEnd } = this.#media.$state, endTime = seekableEnd();
    return Number.isFinite(endTime) ? endTime : cues[cues.length - 1]?.endTime || 0;
  }
  #calcPercent(cue, percent, startTime, endTime) {
    if (!cue) return 0;
    const cues = this.#$cues();
    if (cues.length === 0) return 0;
    const duration = endTime - startTime, cueStartTime = Math.max(0, cue.startTime - startTime), cueEndTime = Math.min(endTime, cue.endTime) - startTime;
    const startRatio = cueStartTime / duration, startPercent = startRatio * 100, endPercent = Math.min(1, startRatio + (cueEndTime - cueStartTime) / duration) * 100;
    return Math.max(
      0,
      round(
        percent >= endPercent ? 100 : (percent - startPercent) / (endPercent - startPercent) * 100,
        3
      )
    );
  }
  #fillGaps(cues) {
    let chapters = [], { seekableStart, seekableEnd, duration } = this.#media.$state, startTime = seekableStart(), endTime = seekableEnd();
    cues = cues.filter((cue) => cue.startTime <= endTime && cue.endTime >= startTime);
    const firstCue = cues[0];
    if (firstCue && firstCue.startTime > startTime) {
      chapters.push(new window.VTTCue(startTime, firstCue.startTime, ""));
    }
    for (let i = 0; i < cues.length - 1; i++) {
      const currentCue = cues[i], nextCue = cues[i + 1];
      chapters.push(currentCue);
      if (nextCue) {
        const timeDiff = nextCue.startTime - currentCue.endTime;
        if (timeDiff > 0) {
          chapters.push(new window.VTTCue(currentCue.endTime, currentCue.endTime + timeDiff, ""));
        }
      }
    }
    const lastCue = cues[cues.length - 1];
    if (lastCue) {
      chapters.push(lastCue);
      const endTime2 = duration();
      if (endTime2 >= 0 && endTime2 - lastCue.endTime > 1) {
        chapters.push(new window.VTTCue(lastCue.endTime, duration(), ""));
      }
    }
    return chapters;
  }
  #watchSource() {
    const { source } = this.#media.$state;
    source();
    this.#onTrackChange();
  }
  #onTrackChange() {
    if (!this.scope) return;
    const { disabled } = this.$props;
    if (disabled()) {
      this.#$cues.set([]);
      this.#activeIndex.set(0);
      this.#bufferedIndex = 0;
      return;
    }
    const track = this.#$track();
    if (track) {
      const onCuesChange = this.#onCuesChange.bind(this);
      onCuesChange();
      new _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.EventsController(track).add("add-cue", onCuesChange).add("remove-cue", onCuesChange);
      (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#watchMediaDuration.bind(this));
    }
    this.#titleRef = this.#findChapterTitleRef();
    if (this.#titleRef) (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#onChapterTitleChange.bind(this));
    return () => {
      if (this.#titleRef) {
        this.#titleRef.textContent = "";
        this.#titleRef = null;
      }
    };
  }
  #watchMediaDuration() {
    this.#media.$state.duration();
    this.#onCuesChange();
  }
  #onCuesChange = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.functionDebounce)(
    () => {
      const track = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.peek)(this.#$track);
      if (!this.scope || !track || !track.cues.length) return;
      this.#$cues.set(this.#fillGaps(track.cues));
      this.#activeIndex.set(0);
      this.#bufferedIndex = 0;
    },
    150,
    true
  );
  #onChapterTitleChange() {
    const cue = this.activePointerCue || this.activeCue;
    if (this.#titleRef) this.#titleRef.textContent = cue?.text || "";
  }
  #findParentSlider() {
    let node = this.el;
    while (node && node.getAttribute("role") !== "slider") {
      node = node.parentElement;
    }
    return node;
  }
  #findChapterTitleRef() {
    const slider = this.#findParentSlider();
    return slider ? slider.querySelector('[data-part="chapter-title"]') : null;
  }
}
const sliderchapters__proto = SliderChapters.prototype;
(0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.prop)(sliderchapters__proto, "cues");
(0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.prop)(sliderchapters__proto, "activeCue");
(0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.prop)(sliderchapters__proto, "activePointerCue");
(0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.method)(sliderchapters__proto, "setRefs");

const menuContext = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.createContext)();

function scrollIntoView(el, options) {
  const scrolls = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.r)(el, options);
  for (const { el: el2, top, left } of scrolls) {
    el2.scroll({ top, left, behavior: options.behavior });
  }
}
function scrollIntoCenter(el, options = {}) {
  scrollIntoView(el, {
    scrollMode: "if-needed",
    block: "center",
    inline: "center",
    ...options
  });
}

const FOCUSABLE_ELEMENTS_SELECTOR = /* @__PURE__ */ [
  "a[href]",
  "[tabindex]",
  "input",
  "select",
  "button"
].map((selector) => `${selector}:not([aria-hidden='true'])`).join(",");
const VALID_KEYS = /* @__PURE__ */ new Set([
  "Escape",
  "Tab",
  "ArrowUp",
  "ArrowDown",
  "Home",
  "PageUp",
  "End",
  "PageDown",
  "Enter",
  " "
]);
class MenuFocusController {
  #index = -1;
  #el = null;
  #elements = [];
  #delegate;
  get items() {
    return this.#elements;
  }
  constructor(delegate) {
    this.#delegate = delegate;
  }
  attachMenu(el) {
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.listenEvent)(el, "focus", this.#onFocus.bind(this));
    this.#el = el;
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.onDispose)(() => {
      this.#el = null;
    });
  }
  listen() {
    if (!this.#el) return;
    this.update();
    new _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.EventsController(this.#el).add("keyup", this.#onKeyUp.bind(this)).add("keydown", this.#onKeyDown.bind(this));
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.onDispose)(() => {
      this.#index = -1;
      this.#elements = [];
    });
  }
  update() {
    this.#index = 0;
    this.#elements = this.#getFocusableElements();
  }
  scroll(index = this.#findActiveIndex()) {
    const element = this.#elements[index];
    if (element) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          scrollIntoCenter(element, {
            behavior: "smooth",
            boundary: (el) => {
              return !el.hasAttribute("data-root");
            }
          });
        });
      });
    }
  }
  focusActive(scroll = true) {
    const index = this.#findActiveIndex();
    this.#focusAt(index >= 0 ? index : 0, scroll);
  }
  #focusAt(index, scroll = true) {
    this.#index = index;
    if (this.#elements[index]) {
      this.#elements[index].focus({ preventScroll: true });
      if (scroll) this.scroll(index);
    } else {
      this.#el?.focus({ preventScroll: true });
    }
  }
  #findActiveIndex() {
    return this.#elements.findIndex(
      (el) => document.activeElement === el || el.getAttribute("role") === "menuitemradio" && el.getAttribute("aria-checked") === "true"
    );
  }
  #onFocus() {
    if (this.#index >= 0) return;
    this.update();
    this.focusActive();
  }
  #validateKeyEvent(event) {
    const el = event.target;
    if ((0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.wasEnterKeyPressed)(event) && el instanceof Element) {
      const role = el.getAttribute("role");
      return !/a|input|select|button/.test(el.localName) && !role;
    }
    return VALID_KEYS.has(event.key);
  }
  #onKeyUp(event) {
    if (!this.#validateKeyEvent(event)) return;
    event.stopPropagation();
    event.preventDefault();
  }
  #onKeyDown(event) {
    if (!this.#validateKeyEvent(event)) return;
    event.stopPropagation();
    event.preventDefault();
    switch (event.key) {
      case "Escape":
        this.#delegate.closeMenu(event);
        break;
      case "Tab":
        this.#focusAt(this.#nextIndex(event.shiftKey ? -1 : 1));
        break;
      case "ArrowUp":
        this.#focusAt(this.#nextIndex(-1));
        break;
      case "ArrowDown":
        this.#focusAt(this.#nextIndex(1));
        break;
      case "Home":
      case "PageUp":
        this.#focusAt(0);
        break;
      case "End":
      case "PageDown":
        this.#focusAt(this.#elements.length - 1);
        break;
    }
  }
  #nextIndex(delta) {
    let index = this.#index;
    do {
      index = (index + delta + this.#elements.length) % this.#elements.length;
    } while (this.#elements[index]?.offsetParent === null);
    return index;
  }
  #getFocusableElements() {
    if (!this.#el) return [];
    const focusableElements = this.#el.querySelectorAll(FOCUSABLE_ELEMENTS_SELECTOR), elements = [];
    const is = (node) => {
      return node.getAttribute("role") === "menu";
    };
    for (const el of focusableElements) {
      if (isHTMLElement(el) && el.offsetParent !== null && // does not have display: none
      isElementParent(this.#el, el, is)) {
        elements.push(el);
      }
    }
    return elements;
  }
}

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = __getOwnPropDesc(target, key) ;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(target, key, result) ) || result;
  if (result) __defProp(target, key, result);
  return result;
};
let idCount = 0;
class Menu extends _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.Component {
  static props = {
    showDelay: 0
  };
  #media;
  #menuId;
  #menuButtonId;
  #expanded = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.signal)(false);
  #disabled = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.signal)(false);
  #trigger = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.signal)(null);
  #content = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.signal)(null);
  #parentMenu;
  #submenus = /* @__PURE__ */ new Set();
  #menuObserver = null;
  #popper;
  #focus;
  #isSliderActive = false;
  #isTriggerDisabled = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.signal)(false);
  #transitionCallbacks = /* @__PURE__ */ new Set();
  get triggerElement() {
    return this.#trigger();
  }
  get contentElement() {
    return this.#content();
  }
  get isSubmenu() {
    return !!this.#parentMenu;
  }
  constructor() {
    super();
    const { showDelay } = this.$props;
    this.#popper = new Popper({
      trigger: this.#trigger,
      content: this.#content,
      showDelay,
      listen: (trigger, show, hide) => {
        onPress(trigger, (event) => {
          if (this.#expanded()) hide(event);
          else show(event);
        });
        const closeTarget = this.#getCloseTarget();
        if (closeTarget) {
          onPress(closeTarget, (event) => {
            event.stopPropagation();
            hide(event);
          });
        }
      },
      onChange: this.#onExpandedChange.bind(this)
    });
  }
  onSetup() {
    this.#media = useMediaContext();
    const currentIdCount = ++idCount;
    this.#menuId = `media-menu-${currentIdCount}`;
    this.#menuButtonId = `media-menu-button-${currentIdCount}`;
    this.#focus = new MenuFocusController({
      closeMenu: this.close.bind(this)
    });
    if ((0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.hasProvidedContext)(menuContext)) {
      this.#parentMenu = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.useContext)(menuContext);
    }
    this.#observeSliders();
    this.setAttributes({
      "data-open": this.#expanded,
      "data-root": !this.isSubmenu,
      "data-submenu": this.isSubmenu,
      "data-disabled": this.#isDisabled.bind(this)
    });
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.provideContext)(menuContext, {
      button: this.#trigger,
      content: this.#content,
      expanded: this.#expanded,
      hint: (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.signal)(""),
      submenu: !!this.#parentMenu,
      disable: this.#disable.bind(this),
      attachMenuButton: this.#attachMenuButton.bind(this),
      attachMenuItems: this.#attachMenuItems.bind(this),
      attachObserver: this.#attachObserver.bind(this),
      disableMenuButton: this.#disableMenuButton.bind(this),
      addSubmenu: this.#addSubmenu.bind(this),
      onTransitionEvent: (callback) => {
        this.#transitionCallbacks.add(callback);
        (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.onDispose)(() => {
          this.#transitionCallbacks.delete(callback);
        });
      }
    });
  }
  onAttach(el) {
    el.style.setProperty("display", "contents");
  }
  onConnect(el) {
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#watchExpanded.bind(this));
    if (this.isSubmenu) {
      this.#parentMenu?.addSubmenu(this);
    }
  }
  onDestroy() {
    this.#trigger.set(null);
    this.#content.set(null);
    this.#menuObserver = null;
    this.#transitionCallbacks.clear();
  }
  #observeSliders() {
    let sliderActiveTimer = -1, parentSliderObserver = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.hasProvidedContext)(sliderObserverContext) ? (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.useContext)(sliderObserverContext) : null;
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.provideContext)(sliderObserverContext, {
      onDragStart: () => {
        parentSliderObserver?.onDragStart?.();
        window.clearTimeout(sliderActiveTimer);
        sliderActiveTimer = -1;
        this.#isSliderActive = true;
      },
      onDragEnd: () => {
        parentSliderObserver?.onDragEnd?.();
        sliderActiveTimer = window.setTimeout(() => {
          this.#isSliderActive = false;
          sliderActiveTimer = -1;
        }, 300);
      }
    });
  }
  #watchExpanded() {
    const expanded = this.#isExpanded();
    if (!this.isSubmenu) this.#onResize();
    this.#updateMenuItemsHidden(expanded);
    if (!expanded) return;
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(() => {
      const { height } = this.#media.$state, content = this.#content();
      content && (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.setStyle)(content, "--player-height", height() + "px");
    });
    this.#focus.listen();
    this.listen("pointerup", this.#onPointerUp.bind(this));
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.listenEvent)(window, "pointerup", this.#onWindowPointerUp.bind(this));
  }
  #attachMenuButton(button) {
    const el = button.el, isMenuItem = this.isSubmenu, isARIADisabled = $ariaBool(this.#isDisabled.bind(this));
    setAttributeIfEmpty(el, "tabindex", isMenuItem ? "-1" : "0");
    setAttributeIfEmpty(el, "role", isMenuItem ? "menuitem" : "button");
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.setAttribute)(el, "id", this.#menuButtonId);
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.setAttribute)(el, "aria-haspopup", "menu");
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.setAttribute)(el, "aria-expanded", "false");
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.setAttribute)(el, "data-root", !this.isSubmenu);
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.setAttribute)(el, "data-submenu", this.isSubmenu);
    const watchAttrs = () => {
      (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.setAttribute)(el, "data-open", this.#expanded());
      (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.setAttribute)(el, "aria-disabled", isARIADisabled());
    };
    if (IS_SERVER) watchAttrs();
    else (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(watchAttrs);
    this.#trigger.set(el);
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.onDispose)(() => {
      this.#trigger.set(null);
    });
  }
  #attachMenuItems(items) {
    const el = items.el;
    el.style.setProperty("display", "none");
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.setAttribute)(el, "id", this.#menuId);
    setAttributeIfEmpty(el, "role", "menu");
    setAttributeIfEmpty(el, "tabindex", "-1");
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.setAttribute)(el, "data-root", !this.isSubmenu);
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.setAttribute)(el, "data-submenu", this.isSubmenu);
    this.#content.set(el);
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.onDispose)(() => this.#content.set(null));
    const watchAttrs = () => (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.setAttribute)(el, "data-open", this.#expanded());
    if (IS_SERVER) watchAttrs();
    else (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(watchAttrs);
    this.#focus.attachMenu(el);
    this.#updateMenuItemsHidden(false);
    const onTransition = this.#onResizeTransition.bind(this);
    if (!this.isSubmenu) {
      items.listen("transitionstart", onTransition);
      items.listen("transitionend", onTransition);
      items.listen("animationend", this.#onResize);
      items.listen("vds-menu-resize", this.#onResize);
    } else {
      this.#parentMenu?.onTransitionEvent(onTransition);
    }
  }
  #attachObserver(observer) {
    this.#menuObserver = observer;
  }
  #updateMenuItemsHidden(expanded) {
    const content = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.peek)(this.#content);
    if (content) (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.setAttribute)(content, "aria-hidden", (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.ariaBool)(!expanded));
  }
  #disableMenuButton(disabled) {
    this.#isTriggerDisabled.set(disabled);
  }
  #wasKeyboardExpand = false;
  #onExpandedChange(isExpanded, event) {
    this.#wasKeyboardExpand = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isKeyboardEvent)(event);
    event?.stopPropagation();
    if (this.#expanded() === isExpanded) return;
    if (this.#isDisabled()) {
      if (isExpanded) this.#popper.hide(event);
      return;
    }
    this.el?.dispatchEvent(
      new Event("vds-menu-resize", {
        bubbles: true,
        composed: true
      })
    );
    const trigger = this.#trigger(), content = this.#content();
    if (trigger) {
      (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.setAttribute)(trigger, "aria-controls", isExpanded && this.#menuId);
      (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.setAttribute)(trigger, "aria-expanded", (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.ariaBool)(isExpanded));
    }
    if (content) (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.setAttribute)(content, "aria-labelledby", isExpanded && this.#menuButtonId);
    this.#expanded.set(isExpanded);
    this.#toggleMediaControls(event);
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.tick)();
    if (this.#wasKeyboardExpand) {
      if (isExpanded) content?.focus();
      else trigger?.focus();
      for (const el of [this.el, content]) {
        el && el.setAttribute("data-keyboard", "");
      }
    } else {
      for (const el of [this.el, content]) {
        el && el.removeAttribute("data-keyboard");
      }
    }
    this.dispatch(isExpanded ? "open" : "close", { trigger: event });
    if (isExpanded) {
      if (!this.isSubmenu && this.#media.activeMenu !== this) {
        this.#media.activeMenu?.close(event);
        this.#media.activeMenu = this;
      }
      this.#menuObserver?.onOpen?.(event);
    } else {
      if (this.isSubmenu) {
        for (const el of this.#submenus) el.close(event);
      } else {
        this.#media.activeMenu = null;
      }
      this.#menuObserver?.onClose?.(event);
    }
    if (isExpanded) {
      requestAnimationFrame(this.#updateFocus.bind(this));
    }
  }
  #updateFocus() {
    if (this.#isTransitionActive || this.#isSubmenuOpen) return;
    this.#focus.update();
    requestAnimationFrame(() => {
      if (this.#wasKeyboardExpand) {
        this.#focus.focusActive();
      } else {
        this.#focus.scroll();
      }
    });
  }
  #isExpanded() {
    return !this.#isDisabled() && this.#expanded();
  }
  #isDisabled() {
    return this.#disabled() || this.#isTriggerDisabled();
  }
  #disable(disabled) {
    this.#disabled.set(disabled);
  }
  #onPointerUp(event) {
    const content = this.#content();
    if (this.#isSliderActive || content && isEventInside(content, event)) {
      return;
    }
    event.stopPropagation();
  }
  #onWindowPointerUp(event) {
    const content = this.#content();
    if (this.#isSliderActive || content && isEventInside(content, event)) {
      return;
    }
    this.close(event);
  }
  #getCloseTarget() {
    const target = this.el?.querySelector('[data-part="close-target"]');
    return this.el && target && isElementParent(this.el, target, (node) => node.getAttribute("role") === "menu") ? target : null;
  }
  #toggleMediaControls(trigger) {
    if (this.isSubmenu) return;
    if (this.#expanded()) this.#media.remote.pauseControls(trigger);
    else this.#media.remote.resumeControls(trigger);
  }
  #addSubmenu(menu) {
    this.#submenus.add(menu);
    new _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.EventsController(menu).add("open", this.#onSubmenuOpenBind).add("close", this.#onSubmenuCloseBind);
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.onDispose)(this.#removeSubmenuBind);
  }
  #removeSubmenuBind = this.#removeSubmenu.bind(this);
  #removeSubmenu(menu) {
    this.#submenus.delete(menu);
  }
  #isSubmenuOpen = false;
  #onSubmenuOpenBind = this.#onSubmenuOpen.bind(this);
  #onSubmenuOpen(event) {
    this.#isSubmenuOpen = true;
    const content = this.#content();
    if (this.isSubmenu) {
      this.triggerElement?.setAttribute("aria-hidden", "true");
    }
    for (const target of this.#submenus) {
      if (target !== event.target) {
        for (const el of [target.el, target.triggerElement]) {
          el?.setAttribute("aria-hidden", "true");
        }
      }
    }
    if (content) {
      const el = event.target.el;
      for (const child of content.children) {
        if (child.contains(el)) {
          child.setAttribute("data-open", "");
        } else if (child !== el) {
          child.setAttribute("data-hidden", "");
        }
      }
    }
  }
  #onSubmenuCloseBind = this.#onSubmenuClose.bind(this);
  #onSubmenuClose(event) {
    this.#isSubmenuOpen = false;
    const content = this.#content();
    if (this.isSubmenu) {
      this.triggerElement?.setAttribute("aria-hidden", "false");
    }
    for (const target of this.#submenus) {
      for (const el of [target.el, target.triggerElement]) {
        el?.setAttribute("aria-hidden", "false");
      }
    }
    if (content) {
      for (const child of content.children) {
        child.removeAttribute("data-open");
        child.removeAttribute("data-hidden");
      }
    }
  }
  #onResize = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.animationFrameThrottle)(() => {
    const content = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.peek)(this.#content);
    if (!content || IS_SERVER) return;
    let height = 0, styles = getComputedStyle(content), children = [...content.children];
    for (const prop2 of ["paddingTop", "paddingBottom", "borderTopWidth", "borderBottomWidth"]) {
      height += parseFloat(styles[prop2]) || 0;
    }
    for (const child of children) {
      if (isHTMLElement(child) && child.style.display === "contents") {
        children.push(...child.children);
      } else if (child.nodeType === 3) {
        height += parseFloat(getComputedStyle(child).fontSize);
      } else if (isHTMLElement(child)) {
        if (!isElementVisible(child)) continue;
        const style = getComputedStyle(child);
        height += child.offsetHeight + (parseFloat(style.marginTop) || 0) + (parseFloat(style.marginBottom) || 0);
      }
    }
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.setStyle)(content, "--menu-height", height + "px");
  });
  #isTransitionActive = false;
  #onResizeTransition(event) {
    const content = this.#content();
    if (content && event.propertyName === "height") {
      this.#isTransitionActive = event.type === "transitionstart";
      (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.setAttribute)(content, "data-transition", this.#isTransitionActive ? "height" : null);
      if (this.#expanded()) this.#updateFocus();
    }
    for (const callback of this.#transitionCallbacks) callback(event);
  }
  open(trigger) {
    if ((0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.peek)(this.#expanded)) return;
    this.#popper.show(trigger);
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.tick)();
  }
  close(trigger) {
    if (!(0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.peek)(this.#expanded)) return;
    this.#popper.hide(trigger);
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.tick)();
  }
}
__decorateClass([
  _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.prop
], Menu.prototype, "triggerElement");
__decorateClass([
  _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.prop
], Menu.prototype, "contentElement");
__decorateClass([
  _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.prop
], Menu.prototype, "isSubmenu");
__decorateClass([
  _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.method
], Menu.prototype, "open");
__decorateClass([
  _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.method
], Menu.prototype, "close");

class MenuButton extends _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.Component {
  static props = {
    disabled: false
  };
  #menu;
  #hintEl = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.signal)(null);
  get expanded() {
    return this.#menu?.expanded() ?? false;
  }
  constructor() {
    super();
    new FocusVisibleController();
  }
  onSetup() {
    this.#menu = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.useContext)(menuContext);
  }
  onAttach(el) {
    this.#menu.attachMenuButton(this);
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#watchDisabled.bind(this));
    setAttributeIfEmpty(el, "type", "button");
  }
  onConnect(el) {
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#watchHintEl.bind(this));
    this.#onMutation();
    const mutations = new MutationObserver(this.#onMutation.bind(this));
    mutations.observe(el, { attributeFilter: ["data-part"], childList: true, subtree: true });
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.onDispose)(() => mutations.disconnect());
    onPress(el, (trigger) => {
      this.dispatch("select", { trigger });
    });
  }
  #watchDisabled() {
    this.#menu.disableMenuButton(this.$props.disabled());
  }
  #watchHintEl() {
    const el = this.#hintEl();
    if (!el) return;
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(() => {
      const text = this.#menu.hint();
      if (text) el.textContent = text;
    });
  }
  #onMutation() {
    const hintEl = this.el?.querySelector('[data-part="hint"]');
    this.#hintEl.set(hintEl ?? null);
  }
}
const menubutton__proto = MenuButton.prototype;
(0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.prop)(menubutton__proto, "expanded");

class MenuItem extends MenuButton {
}

class MenuPortal extends _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.Component {
  static props = {
    container: null,
    disabled: false
  };
  #target = null;
  #media;
  onSetup() {
    this.#media = useMediaContext();
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.provideContext)(menuPortalContext, {
      attach: this.#attachElement.bind(this)
    });
  }
  onAttach(el) {
    el.style.setProperty("display", "contents");
  }
  // Need this so connect scope is defined.
  onConnect(el) {
  }
  onDestroy() {
    this.#target?.remove();
    this.#target = null;
  }
  #attachElement(el) {
    this.#portal(false);
    this.#target = el;
    requestScopedAnimationFrame(() => {
      requestScopedAnimationFrame(() => {
        if (!this.connectScope) return;
        (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#watchDisabled.bind(this));
      });
    });
  }
  #watchDisabled() {
    const { fullscreen } = this.#media.$state, { disabled } = this.$props;
    this.#portal(disabled() === "fullscreen" ? !fullscreen() : !disabled());
  }
  #portal(shouldPortal) {
    if (!this.#target) return;
    let container = this.#getContainer(this.$props.container());
    if (!container) return;
    const isPortalled = this.#target.parentElement === container;
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.setAttribute)(this.#target, "data-portal", shouldPortal);
    if (shouldPortal) {
      if (!isPortalled) {
        this.#target.remove();
        container.append(this.#target);
      }
    } else if (isPortalled && this.#target.parentElement === container) {
      this.#target.remove();
      this.el?.append(this.#target);
    }
  }
  #getContainer(selector) {
    if (isHTMLElement(selector)) return selector;
    return selector ? document.querySelector(selector) : document.body;
  }
}
const menuPortalContext = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.createContext)();

class MenuItems extends _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.Component {
  static props = {
    placement: null,
    offset: 0,
    alignOffset: 0
  };
  #menu;
  constructor() {
    super();
    new FocusVisibleController();
    const { placement } = this.$props;
    this.setAttributes({
      "data-placement": placement
    });
  }
  onAttach(el) {
    this.#menu = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.useContext)(menuContext);
    this.#menu.attachMenuItems(this);
    if ((0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.hasProvidedContext)(menuPortalContext)) {
      const portal = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.useContext)(menuPortalContext);
      if (portal) {
        (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.provideContext)(menuPortalContext, null);
        portal.attach(el);
        (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.onDispose)(() => portal.attach(null));
      }
    }
  }
  onConnect(el) {
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#watchPlacement.bind(this));
  }
  #watchPlacement() {
    const { expanded } = this.#menu;
    if (!this.el || !expanded()) return;
    const placement = this.$props.placement();
    if (!placement) return;
    Object.assign(this.el.style, {
      position: "absolute",
      top: 0,
      left: 0,
      width: "max-content"
    });
    const { offset: mainOffset, alignOffset } = this.$props;
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.onDispose)(
      autoPlacement(this.el, this.#getButton(), placement, {
        offsetVarName: "media-menu",
        xOffset: alignOffset(),
        yOffset: mainOffset()
      })
    );
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.onDispose)(this.#hide.bind(this));
  }
  #hide() {
    if (!this.el) return;
    this.el.removeAttribute("style");
    this.el.style.display = "none";
  }
  #getButton() {
    return this.#menu.button();
  }
}

const radioControllerContext = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.createContext)();

class RadioGroupController extends _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.ViewController {
  #group = /* @__PURE__ */ new Set();
  #value = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.signal)("");
  #controller = null;
  onValueChange;
  get values() {
    return Array.from(this.#group).map((radio) => radio.value());
  }
  get value() {
    return this.#value();
  }
  set value(value) {
    this.#onChange(value);
  }
  onSetup() {
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.provideContext)(radioControllerContext, {
      add: this.#addRadio.bind(this),
      remove: this.#removeRadio.bind(this)
    });
  }
  onAttach(el) {
    const isMenuItem = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.hasProvidedContext)(menuContext);
    if (!isMenuItem) setAttributeIfEmpty(el, "role", "radiogroup");
    this.setAttributes({ value: this.#value });
  }
  onDestroy() {
    this.#group.clear();
  }
  #addRadio(radio) {
    if (this.#group.has(radio)) return;
    this.#group.add(radio);
    radio.onCheck = this.#onChangeBind;
    radio.check(radio.value() === this.#value());
  }
  #removeRadio(radio) {
    radio.onCheck = null;
    this.#group.delete(radio);
  }
  #onChangeBind = this.#onChange.bind(this);
  #onChange(newValue, trigger) {
    const currentValue = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.peek)(this.#value);
    if (!newValue || newValue === currentValue) return;
    const currentRadio = this.#findRadio(currentValue), newRadio = this.#findRadio(newValue);
    currentRadio?.check(false, trigger);
    newRadio?.check(true, trigger);
    this.#value.set(newValue);
    this.onValueChange?.(newValue, trigger);
  }
  #findRadio(newValue) {
    for (const radio of this.#group) {
      if (newValue === (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.peek)(radio.value)) return radio;
    }
    return null;
  }
}

class RadioGroup extends _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.Component {
  static props = {
    value: ""
  };
  #controller;
  /**
   * A list of radio values that belong this group.
   */
  get values() {
    return this.#controller.values;
  }
  /**
   * The radio value that is checked in this group.
   */
  get value() {
    return this.#controller.value;
  }
  set value(newValue) {
    this.#controller.value = newValue;
  }
  constructor() {
    super();
    this.#controller = new RadioGroupController();
    this.#controller.onValueChange = this.#onValueChange.bind(this);
  }
  onSetup() {
    if (IS_SERVER) this.#watchValue();
    else (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#watchValue.bind(this));
  }
  #watchValue() {
    this.#controller.value = this.$props.value();
  }
  #onValueChange(value, trigger) {
    const event = this.createEvent("change", { detail: value, trigger });
    this.dispatch(event);
  }
}
const radiogroup__proto = RadioGroup.prototype;
(0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.prop)(radiogroup__proto, "values");
(0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.prop)(radiogroup__proto, "value");

class Radio extends _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.Component {
  static props = {
    value: ""
  };
  #checked = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.signal)(false);
  #controller = {
    value: this.$props.value,
    check: this.#check.bind(this),
    onCheck: null
  };
  /**
   * Whether this radio is currently checked.
   */
  get checked() {
    return this.#checked();
  }
  constructor() {
    super();
    new FocusVisibleController();
  }
  onSetup() {
    this.setAttributes({
      value: this.$props.value,
      "data-checked": this.#checked,
      "aria-checked": $ariaBool(this.#checked)
    });
  }
  onAttach(el) {
    const isMenuItem = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.hasProvidedContext)(menuContext);
    setAttributeIfEmpty(el, "tabindex", isMenuItem ? "-1" : "0");
    setAttributeIfEmpty(el, "role", isMenuItem ? "menuitemradio" : "radio");
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#watchValue.bind(this));
  }
  onConnect(el) {
    this.#addToGroup();
    onPress(el, this.#onPress.bind(this));
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.onDispose)(this.#onDisconnect.bind(this));
  }
  #onDisconnect() {
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.scoped)(() => {
      const group = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.useContext)(radioControllerContext);
      group.remove(this.#controller);
    }, this.connectScope);
  }
  #addToGroup() {
    const group = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.useContext)(radioControllerContext);
    group.add(this.#controller);
  }
  #watchValue() {
    const { value } = this.$props, newValue = value();
    if ((0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.peek)(this.#checked)) {
      this.#controller.onCheck?.(newValue);
    }
  }
  #onPress(event) {
    if ((0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.peek)(this.#checked)) return;
    this.#onChange(true, event);
    this.#onSelect(event);
    this.#controller.onCheck?.((0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.peek)(this.$props.value), event);
  }
  #check(value, trigger) {
    if ((0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.peek)(this.#checked) === value) return;
    this.#onChange(value, trigger);
  }
  #onChange(value, trigger) {
    this.#checked.set(value);
    this.dispatch("change", { detail: value, trigger });
  }
  #onSelect(trigger) {
    this.dispatch("select", { trigger });
  }
}
const radio__proto = Radio.prototype;
(0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.prop)(radio__proto, "checked");

class Gesture extends _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.Component {
  static props = {
    disabled: false,
    event: void 0,
    action: void 0
  };
  #media;
  #provider = null;
  onSetup() {
    this.#media = useMediaContext();
    const { event, action } = this.$props;
    this.setAttributes({
      event,
      action
    });
  }
  onAttach(el) {
    el.setAttribute("data-media-gesture", "");
    el.style.setProperty("pointer-events", "none");
  }
  onConnect(el) {
    this.#provider = this.#media.player.el?.querySelector(
      "[data-media-provider]"
    );
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#attachListener.bind(this));
  }
  #attachListener() {
    let eventType = this.$props.event(), disabled = this.$props.disabled();
    if (!this.#provider || !eventType || disabled) return;
    if (/^dbl/.test(eventType)) {
      eventType = eventType.split(/^dbl/)[1];
    }
    if (eventType === "pointerup" || eventType === "pointerdown") {
      const pointer = this.#media.$state.pointer();
      if (pointer === "coarse") {
        eventType = eventType === "pointerup" ? "touchend" : "touchstart";
      }
    }
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.listenEvent)(
      this.#provider,
      eventType,
      this.#acceptEvent.bind(this),
      { passive: false }
    );
  }
  #presses = 0;
  #pressTimerId = -1;
  #acceptEvent(event) {
    if (this.$props.disabled() || (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isPointerEvent)(event) && (event.button !== 0 || this.#media.activeMenu) || (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isTouchEvent)(event) && this.#media.activeMenu || isTouchPinchEvent(event) || !this.#inBounds(event)) {
      return;
    }
    event.MEDIA_GESTURE = true;
    event.preventDefault();
    const eventType = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.peek)(this.$props.event), isDblEvent = eventType?.startsWith("dbl");
    if (!isDblEvent) {
      if (this.#presses === 0) {
        setTimeout(() => {
          if (this.#presses === 1) this.#handleEvent(event);
        }, 250);
      }
    } else if (this.#presses === 1) {
      queueMicrotask(() => this.#handleEvent(event));
      clearTimeout(this.#pressTimerId);
      this.#presses = 0;
      return;
    }
    if (this.#presses === 0) {
      this.#pressTimerId = window.setTimeout(() => {
        this.#presses = 0;
      }, 275);
    }
    this.#presses++;
  }
  #handleEvent(event) {
    this.el.setAttribute("data-triggered", "");
    requestAnimationFrame(() => {
      if (this.#isTopLayer()) {
        this.#performAction((0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.peek)(this.$props.action), event);
      }
      requestAnimationFrame(() => {
        this.el.removeAttribute("data-triggered");
      });
    });
  }
  /** Validate event occurred in gesture bounds. */
  #inBounds(event) {
    if (!this.el) return false;
    if ((0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isPointerEvent)(event) || (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isMouseEvent)(event) || (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isTouchEvent)(event)) {
      const touch = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isTouchEvent)(event) ? event.changedTouches[0] ?? event.touches[0] : void 0;
      const clientX = touch?.clientX ?? event.clientX;
      const clientY = touch?.clientY ?? event.clientY;
      const rect = this.el.getBoundingClientRect();
      const inBounds = clientY >= rect.top && clientY <= rect.bottom && clientX >= rect.left && clientX <= rect.right;
      return event.type.includes("leave") ? !inBounds : inBounds;
    }
    return true;
  }
  /** Validate gesture has the highest z-index in this triggered group. */
  #isTopLayer() {
    const gestures = this.#media.player.el.querySelectorAll(
      "[data-media-gesture][data-triggered]"
    );
    return Array.from(gestures).sort(
      (a, b) => +getComputedStyle(b).zIndex - +getComputedStyle(a).zIndex
    )[0] === this.el;
  }
  #performAction(action, trigger) {
    if (!action) return;
    const willTriggerEvent = new _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.DOMEvent("will-trigger", {
      detail: action,
      cancelable: true,
      trigger
    });
    this.dispatchEvent(willTriggerEvent);
    if (willTriggerEvent.defaultPrevented) return;
    const [method, value] = action.replace(/:([a-z])/, "-$1").split(":");
    if (action.includes(":fullscreen")) {
      this.#media.remote.toggleFullscreen("prefer-media", trigger);
    } else if (action.includes("seek:")) {
      this.#media.remote.seek((0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.peek)(this.#media.$state.currentTime) + (+value || 0), trigger);
    } else {
      this.#media.remote[(0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.kebabToCamelCase)(method)](trigger);
    }
    this.dispatch("trigger", {
      detail: action,
      trigger
    });
  }
}

class CaptionsTextRenderer {
  priority = 10;
  #track = null;
  #renderer;
  #events;
  constructor(renderer) {
    this.#renderer = renderer;
  }
  attach() {
  }
  canRender() {
    return true;
  }
  detach() {
    this.#events?.abort();
    this.#events = void 0;
    this.#renderer.reset();
    this.#track = null;
  }
  changeTrack(track) {
    if (!track || this.#track === track) return;
    this.#events?.abort();
    this.#events = new _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.EventsController(track);
    if (track.readyState < 2) {
      this.#renderer.reset();
      this.#events.add("load", () => this.#changeTrack(track), { once: true });
    } else {
      this.#changeTrack(track);
    }
    this.#events.add("add-cue", (event) => {
      this.#renderer.addCue(event.detail);
    }).add("remove-cue", (event) => {
      this.#renderer.removeCue(event.detail);
    });
    this.#track = track;
  }
  #changeTrack(track) {
    this.#renderer.changeTrack({
      cues: [...track.cues],
      regions: [...track.regions]
    });
  }
}

class Captions extends _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.Component {
  static props = {
    textDir: "ltr",
    exampleText: "Captions look like this."
  };
  #media;
  static lib = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.signal)(null);
  onSetup() {
    this.#media = useMediaContext();
    this.setAttributes({
      "aria-hidden": $ariaBool(this.#isHidden.bind(this))
    });
  }
  onAttach(el) {
    el.style.setProperty("pointer-events", "none");
  }
  onConnect(el) {
    if (!Captions.lib()) {
      __webpack_require__.e(/*! import() */ "vendors-node_modules_media-captions_dist_dev_js").then(__webpack_require__.bind(__webpack_require__, /*! media-captions */ "./node_modules/media-captions/dist/dev.js")).then((lib) => Captions.lib.set(lib));
    }
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#watchViewType.bind(this));
  }
  #isHidden() {
    const { textTrack, remotePlaybackState, iOSControls } = this.#media.$state, track = textTrack();
    return iOSControls() || remotePlaybackState() === "connected" || !track || !isTrackCaptionKind(track);
  }
  #watchViewType() {
    if (!Captions.lib()) return;
    const { viewType } = this.#media.$state;
    if (viewType() === "audio") {
      return this.#setupAudioView();
    } else {
      return this.#setupVideoView();
    }
  }
  #setupAudioView() {
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#onTrackChange.bind(this));
    this.#listenToFontStyleChanges(null);
    return () => {
      this.el.textContent = "";
    };
  }
  #onTrackChange() {
    if (this.#isHidden()) return;
    this.#onCueChange();
    const { textTrack } = this.#media.$state;
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.listenEvent)(textTrack(), "cue-change", this.#onCueChange.bind(this));
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#onUpdateTimedNodes.bind(this));
  }
  #onCueChange() {
    this.el.textContent = "";
    if (this.#hideExampleTimer >= 0) {
      this.#removeExample();
    }
    const { realCurrentTime, textTrack } = this.#media.$state, { renderVTTCueString } = Captions.lib(), time = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.peek)(realCurrentTime), activeCues = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.peek)(textTrack).activeCues;
    for (const cue of activeCues) {
      const displayEl = this.#createCueDisplayElement(), cueEl = this.#createCueElement();
      cueEl.innerHTML = renderVTTCueString(cue, time);
      displayEl.append(cueEl);
      this.el.append(cueEl);
    }
  }
  #onUpdateTimedNodes() {
    const { realCurrentTime } = this.#media.$state, { updateTimedVTTCueNodes } = Captions.lib();
    updateTimedVTTCueNodes(this.el, realCurrentTime());
  }
  #setupVideoView() {
    const { CaptionsRenderer } = Captions.lib(), renderer = new CaptionsRenderer(this.el), textRenderer = new CaptionsTextRenderer(renderer);
    this.#media.textRenderers.add(textRenderer);
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#watchTextDirection.bind(this, renderer));
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#watchMediaTime.bind(this, renderer));
    this.#listenToFontStyleChanges(renderer);
    return () => {
      this.el.textContent = "";
      this.#media.textRenderers.remove(textRenderer);
      renderer.destroy();
    };
  }
  #watchTextDirection(renderer) {
    renderer.dir = this.$props.textDir();
  }
  #watchMediaTime(renderer) {
    if (this.#isHidden()) return;
    const { realCurrentTime, textTrack } = this.#media.$state;
    renderer.currentTime = realCurrentTime();
    if (this.#hideExampleTimer >= 0 && textTrack()?.activeCues[0]) {
      this.#removeExample();
    }
  }
  #listenToFontStyleChanges(renderer) {
    const player = this.#media.player;
    if (!player) return;
    const onChange = this.#onFontStyleChange.bind(this, renderer);
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.listenEvent)(player, "vds-font-change", onChange);
  }
  #onFontStyleChange(renderer) {
    if (this.#hideExampleTimer >= 0) {
      this.#hideExample();
      return;
    }
    const { textTrack } = this.#media.$state;
    if (!textTrack()?.activeCues[0]) {
      this.#showExample();
    } else {
      renderer?.update(true);
    }
  }
  #showExample() {
    const display = this.#createCueDisplayElement();
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.setAttribute)(display, "data-example", "");
    const cue = this.#createCueElement();
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.setAttribute)(cue, "data-example", "");
    cue.textContent = this.$props.exampleText();
    display?.append(cue);
    this.el?.append(display);
    this.el?.setAttribute("data-example", "");
    this.#hideExample();
  }
  #hideExampleTimer = -1;
  #hideExample() {
    window.clearTimeout(this.#hideExampleTimer);
    this.#hideExampleTimer = window.setTimeout(this.#removeExample.bind(this), 2500);
  }
  #removeExample() {
    this.el?.removeAttribute("data-example");
    if (this.el?.querySelector("[data-example]")) this.el.textContent = "";
    this.#hideExampleTimer = -1;
  }
  #createCueDisplayElement() {
    const el = document.createElement("div");
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.setAttribute)(el, "data-part", "cue-display");
    return el;
  }
  #createCueElement() {
    const el = document.createElement("div");
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.setAttribute)(el, "data-part", "cue");
    return el;
  }
}

class Poster extends _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.Component {
  static props = {
    src: null,
    alt: null,
    crossOrigin: null
  };
  static state = new _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.State({
    img: null,
    src: null,
    alt: null,
    crossOrigin: null,
    loading: true,
    error: null,
    hidden: false
  });
  #media;
  onSetup() {
    this.#media = useMediaContext();
    this.#watchSrc();
    this.#watchAlt();
    this.#watchCrossOrigin();
    this.#watchHidden();
  }
  onAttach(el) {
    el.style.setProperty("pointer-events", "none");
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#watchImg.bind(this));
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#watchSrc.bind(this));
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#watchAlt.bind(this));
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#watchCrossOrigin.bind(this));
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#watchHidden.bind(this));
    const { started } = this.#media.$state;
    this.setAttributes({
      "data-visible": () => !started() && !this.$state.hidden(),
      "data-loading": this.#isLoading.bind(this),
      "data-error": this.#hasError.bind(this),
      "data-hidden": this.$state.hidden
    });
  }
  onConnect(el) {
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#onPreconnect.bind(this));
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#onLoadStart.bind(this));
  }
  #hasError() {
    const { error } = this.$state;
    return !(0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.isNull)(error());
  }
  #onPreconnect() {
    const { canLoadPoster, poster } = this.#media.$state;
    if (!canLoadPoster() && poster()) preconnect(poster(), "preconnect");
  }
  #watchHidden() {
    const { src } = this.$props, { poster, nativeControls } = this.#media.$state;
    this.el && (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.setAttribute)(this.el, "display", nativeControls() ? "none" : null);
    this.$state.hidden.set(this.#hasError() || !(src() || poster()) || nativeControls());
  }
  #isLoading() {
    const { loading, hidden } = this.$state;
    return !hidden() && loading();
  }
  #watchImg() {
    const img = this.$state.img();
    if (!img) return;
    new _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.EventsController(img).add("load", this.#onLoad.bind(this)).add("error", this.#onError.bind(this));
    if (img.complete) this.#onLoad();
  }
  #prevSrc = "";
  #watchSrc() {
    const { poster: defaultPoster } = this.#media.$props, { canLoadPoster, providedPoster, inferredPoster } = this.#media.$state;
    const src = this.$props.src() || "", poster = src || defaultPoster() || inferredPoster();
    if (this.#prevSrc === providedPoster()) {
      providedPoster.set(src);
    }
    this.$state.src.set(canLoadPoster() && poster.length ? poster : null);
    this.#prevSrc = src;
  }
  #watchAlt() {
    const { src } = this.$props, { alt } = this.$state, { poster } = this.#media.$state;
    alt.set(src() || poster() ? this.$props.alt() : null);
  }
  #watchCrossOrigin() {
    const { crossOrigin: crossOriginProp } = this.$props, { crossOrigin: crossOriginState } = this.$state, { crossOrigin: mediaCrossOrigin, poster: src } = this.#media.$state, crossOrigin = crossOriginProp() !== null ? crossOriginProp() : mediaCrossOrigin();
    crossOriginState.set(
      /ytimg\.com|vimeo/.test(src() || "") ? null : crossOrigin === true ? "anonymous" : crossOrigin
    );
  }
  #onLoadStart() {
    const { loading, error } = this.$state, { canLoadPoster, poster } = this.#media.$state;
    loading.set(canLoadPoster() && !!poster());
    error.set(null);
  }
  #onLoad() {
    const { loading, error } = this.$state;
    loading.set(false);
    error.set(null);
  }
  #onError(event) {
    const { loading, error } = this.$state;
    loading.set(false);
    error.set(event);
  }
}

class Time extends _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.Component {
  static props = {
    type: "current",
    showHours: false,
    padHours: null,
    padMinutes: null,
    remainder: false,
    toggle: false,
    hidden: false
  };
  static state = new _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.State({
    timeText: "",
    hidden: false
  });
  #media;
  #invert = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.signal)(null);
  #isVisible = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.signal)(true);
  #isIntersecting = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.signal)(true);
  onSetup() {
    this.#media = useMediaContext();
    this.#watchTime();
    const { type } = this.$props;
    this.setAttributes({
      "data-type": type,
      "data-remainder": this.#shouldInvert.bind(this)
    });
    new IntersectionObserverController({
      callback: this.#onIntersectionChange.bind(this)
    }).attach(this);
  }
  onAttach(el) {
    if (!el.hasAttribute("role")) (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#watchRole.bind(this));
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#watchTime.bind(this));
  }
  onConnect(el) {
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.onDispose)(observeVisibility(el, this.#isVisible.set));
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#watchHidden.bind(this));
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(this.#watchToggle.bind(this));
  }
  #onIntersectionChange(entries) {
    this.#isIntersecting.set(entries[0].isIntersecting);
  }
  #watchHidden() {
    const { hidden } = this.$props;
    this.$state.hidden.set(hidden() || !this.#isVisible() || !this.#isIntersecting());
  }
  #watchToggle() {
    if (!this.$props.toggle()) {
      this.#invert.set(null);
      return;
    }
    if (this.el) {
      onPress(this.el, this.#onToggle.bind(this));
    }
  }
  #watchTime() {
    const { hidden, timeText } = this.$state, { duration } = this.#media.$state;
    if (hidden()) return;
    const { type, padHours, padMinutes, showHours } = this.$props, seconds = this.#getSeconds(type()), $duration = duration(), shouldInvert = this.#shouldInvert();
    if (!Number.isFinite(seconds + $duration)) {
      timeText.set("LIVE");
      return;
    }
    const time = shouldInvert ? Math.max(0, $duration - seconds) : seconds, formattedTime = formatTime(time, {
      padHrs: padHours(),
      padMins: padMinutes(),
      showHrs: showHours()
    });
    timeText.set((shouldInvert ? "-" : "") + formattedTime);
  }
  #watchRole() {
    if (!this.el) return;
    const { toggle } = this.$props;
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.setAttribute)(this.el, "role", toggle() ? "timer" : null);
    (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.setAttribute)(this.el, "tabindex", toggle() ? 0 : null);
  }
  #getSeconds(type) {
    const { bufferedEnd, duration, currentTime } = this.#media.$state;
    switch (type) {
      case "buffered":
        return bufferedEnd();
      case "duration":
        return duration();
      default:
        return currentTime();
    }
  }
  #shouldInvert() {
    return this.$props.remainder() && this.#invert() !== false;
  }
  #onToggle(event) {
    event.preventDefault();
    if (this.#invert() === null) {
      this.#invert.set(!this.$props.remainder());
      return;
    }
    this.#invert.set((v) => !v);
  }
}

class MediaPlayerInstance extends MediaPlayer {
}
class MediaProviderInstance extends MediaProvider {
}
class MediaAnnouncerInstance extends MediaAnnouncer {
}
class ControlsInstance extends Controls {
}
class ControlsGroupInstance extends ControlsGroup {
}
class ToggleButtonInstance extends ToggleButton {
}
class CaptionButtonInstance extends CaptionButton {
}
class FullscreenButtonInstance extends FullscreenButton {
}
class LiveButtonInstance extends LiveButton {
}
class MuteButtonInstance extends MuteButton {
}
class PIPButtonInstance extends PIPButton {
}
class PlayButtonInstance extends PlayButton {
}
class AirPlayButtonInstance extends AirPlayButton {
}
class GoogleCastButtonInstance extends GoogleCastButton {
}
class SeekButtonInstance extends SeekButton {
}
class TooltipInstance extends Tooltip {
}
class TooltipTriggerInstance extends TooltipTrigger {
}
class TooltipContentInstance extends TooltipContent {
}
class SliderInstance extends Slider {
}
class TimeSliderInstance extends TimeSlider {
}
class VolumeSliderInstance extends VolumeSlider {
}
class AudioGainSliderInstance extends AudioGainSlider {
}
class SpeedSliderInstance extends SpeedSlider {
}
class QualitySliderInstance extends QualitySlider {
}
class SliderThumbnailInstance extends SliderThumbnail {
}
class SliderValueInstance extends SliderValue {
}
class SliderVideoInstance extends SliderVideo {
}
class SliderPreviewInstance extends SliderPreview {
}
class SliderChaptersInstance extends SliderChapters {
}
class MenuInstance extends Menu {
}
class MenuButtonInstance extends MenuButton {
}
class MenuItemsInstance extends MenuItems {
}
class MenuItemInstance extends MenuItem {
}
class MenuPortalInstance extends MenuPortal {
}
class RadioGroupInstance extends RadioGroup {
}
class RadioInstance extends Radio {
}
class CaptionsInstance extends Captions {
}
class GestureInstance extends Gesture {
}
class PosterInstance extends Poster {
}
class ThumbnailInstance extends Thumbnail {
}
class TimeInstance extends Time {
}

const Slot = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef((props, forwardedRef) => {
  const { children, ...slotProps } = props;
  const childrenArray = react__WEBPACK_IMPORTED_MODULE_0__.Children.toArray(children);
  const slottable = childrenArray.find(isSlottable);
  if (slottable) {
    const newElement = slottable.props.children;
    const newChildren = childrenArray.map((child) => {
      if (child === slottable) {
        if (react__WEBPACK_IMPORTED_MODULE_0__.Children.count(newElement) > 1) return react__WEBPACK_IMPORTED_MODULE_0__.Children.only(null);
        return react__WEBPACK_IMPORTED_MODULE_0__.isValidElement(newElement) ? newElement.props.children : null;
      } else {
        return child;
      }
    });
    return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(SlotClone, { ...slotProps, ref: forwardedRef }, react__WEBPACK_IMPORTED_MODULE_0__.isValidElement(newElement) ? react__WEBPACK_IMPORTED_MODULE_0__.cloneElement(newElement, void 0, newChildren) : null);
  }
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(SlotClone, { ...slotProps, ref: forwardedRef }, children);
});
Slot.displayName = "Slot";
const SlotClone = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef((props, forwardedRef) => {
  const { children, ...slotProps } = props;
  if (react__WEBPACK_IMPORTED_MODULE_0__.isValidElement(children)) {
    return react__WEBPACK_IMPORTED_MODULE_0__.cloneElement(children, {
      ...mergeProps(slotProps, children.props),
      ref: forwardedRef ? (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.composeRefs)(forwardedRef, children.ref) : children.ref
    });
  }
  return react__WEBPACK_IMPORTED_MODULE_0__.Children.count(children) > 1 ? react__WEBPACK_IMPORTED_MODULE_0__.Children.only(null) : null;
});
SlotClone.displayName = "SlotClone";
const Slottable = ({ children }) => {
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, children);
};
function isSlottable(child) {
  return react__WEBPACK_IMPORTED_MODULE_0__.isValidElement(child) && child.type === Slottable;
}
function mergeProps(slotProps, childProps) {
  const overrideProps = { ...childProps };
  for (const propName in childProps) {
    const slotPropValue = slotProps[propName];
    const childPropValue = childProps[propName];
    const isHandler = /^on[A-Z]/.test(propName);
    if (isHandler) {
      if (slotPropValue && childPropValue) {
        overrideProps[propName] = (...args) => {
          childPropValue(...args);
          slotPropValue(...args);
        };
      } else if (slotPropValue) {
        overrideProps[propName] = slotPropValue;
      }
    } else if (propName === "style") {
      overrideProps[propName] = { ...slotPropValue, ...childPropValue };
    } else if (propName === "className") {
      overrideProps[propName] = [slotPropValue, childPropValue].filter(Boolean).join(" ");
    }
  }
  return { ...slotProps, ...overrideProps };
}

const NODES = ["button", "div", "span", "img", "video", "audio"];
const Primitive = NODES.reduce((primitives, node) => {
  const Node = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef((props, forwardedRef) => {
    const { asChild, ...primitiveProps } = props;
    const Comp = asChild ? Slot : node;
    return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(Comp, { ...primitiveProps, ref: forwardedRef });
  });
  Node.displayName = `Primitive.${node}`;
  return { ...primitives, [node]: Node };
}, {});

function isRemotionProvider(provider) {
  return provider?.$$PROVIDER_TYPE === "REMOTION";
}
function isRemotionSrc(src) {
  return src?.type === "video/remotion";
}

const sliderStateRecord = SliderInstance.state.record, initialSliderStore = Object.keys(sliderStateRecord).reduce(
  (store, prop) => ({
    ...store,
    [prop]() {
      return sliderStateRecord[prop];
    }
  }),
  {}
);
function useSliderState(prop, ref) {
  const $state = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.useStateContext)(sliderState);
  if (!$state && !ref) {
    console.warn(
      `[vidstack] \`useSliderState\` requires \`RefObject<SliderInstance>\` argument if called outside of a slider component`
    );
  }
  return (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.useSignal)((ref?.current?.$state || $state || initialSliderStore)[prop]);
}
function useSliderStore(ref) {
  const $state = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.useStateContext)(sliderState);
  if (!$state && !ref) {
    console.warn(
      `[vidstack] \`useSliderStore\` requires \`RefObject<SliderInstance>\` argument if called outside of a slider component`
    );
  }
  return (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.useSignalRecord)(ref?.current ? ref.current.$state : $state || initialSliderStore);
}

const mediaStateRecord = MediaPlayerInstance.state.record, initialMediaStore = Object.keys(mediaStateRecord).reduce(
  (store, prop) => ({
    ...store,
    [prop]() {
      return mediaStateRecord[prop];
    }
  }),
  {}
);
function useMediaState(prop, ref) {
  const $state = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.useStateContext)(mediaState);
  if (!$state && !ref) {
    console.warn(
      `[vidstack] \`useMediaState\` requires \`RefObject<MediaPlayerInstance>\` argument if called outside the \`<MediaPlayer>\` component`
    );
  }
  return (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.useSignal)((ref?.current?.$state || $state || initialMediaStore)[prop]);
}
function useMediaStore(ref) {
  const $state = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.useStateContext)(mediaState);
  if (!$state && !ref) {
    console.warn(
      `[vidstack] \`useMediaStore\` requires \`RefObject<MediaPlayerInstance>\` argument if called outside the \`<MediaPlayer>\` component`
    );
  }
  return (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.useSignalRecord)(ref?.current ? ref.current.$state : $state || initialMediaStore);
}




/***/ }),

/***/ "./node_modules/@vidstack/react/dev/chunks/vidstack-D_bWd66h.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@vidstack/react/dev/chunks/vidstack-D_bWd66h.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Component: () => (/* binding */ Component),
/* harmony export */   DOMEvent: () => (/* binding */ DOMEvent),
/* harmony export */   EventsController: () => (/* binding */ EventsController),
/* harmony export */   EventsTarget: () => (/* binding */ EventsTarget),
/* harmony export */   Icon$0: () => (/* binding */ Icon$0),
/* harmony export */   Icon$104: () => (/* binding */ Icon$104),
/* harmony export */   Icon$105: () => (/* binding */ Icon$105),
/* harmony export */   Icon$11: () => (/* binding */ Icon$11),
/* harmony export */   Icon$13: () => (/* binding */ Icon$13),
/* harmony export */   Icon$16: () => (/* binding */ Icon$16),
/* harmony export */   Icon$19: () => (/* binding */ Icon$19),
/* harmony export */   Icon$22: () => (/* binding */ Icon$22),
/* harmony export */   Icon$24: () => (/* binding */ Icon$24),
/* harmony export */   Icon$26: () => (/* binding */ Icon$26),
/* harmony export */   Icon$27: () => (/* binding */ Icon$27),
/* harmony export */   Icon$31: () => (/* binding */ Icon$31),
/* harmony export */   Icon$33: () => (/* binding */ Icon$33),
/* harmony export */   Icon$34: () => (/* binding */ Icon$34),
/* harmony export */   Icon$35: () => (/* binding */ Icon$35),
/* harmony export */   Icon$39: () => (/* binding */ Icon$39),
/* harmony export */   Icon$40: () => (/* binding */ Icon$40),
/* harmony export */   Icon$5: () => (/* binding */ Icon$5),
/* harmony export */   Icon$53: () => (/* binding */ Icon$53),
/* harmony export */   Icon$54: () => (/* binding */ Icon$54),
/* harmony export */   Icon$56: () => (/* binding */ Icon$56),
/* harmony export */   Icon$59: () => (/* binding */ Icon$59),
/* harmony export */   Icon$60: () => (/* binding */ Icon$60),
/* harmony export */   Icon$61: () => (/* binding */ Icon$61),
/* harmony export */   Icon$62: () => (/* binding */ Icon$62),
/* harmony export */   Icon$63: () => (/* binding */ Icon$63),
/* harmony export */   Icon$74: () => (/* binding */ Icon$74),
/* harmony export */   Icon$77: () => (/* binding */ Icon$77),
/* harmony export */   Icon$8: () => (/* binding */ Icon$8),
/* harmony export */   Icon$81: () => (/* binding */ Icon$81),
/* harmony export */   Icon$88: () => (/* binding */ Icon$88),
/* harmony export */   State: () => (/* binding */ State),
/* harmony export */   ViewController: () => (/* binding */ ViewController),
/* harmony export */   animationFrameThrottle: () => (/* binding */ animationFrameThrottle),
/* harmony export */   appendTriggerEvent: () => (/* binding */ appendTriggerEvent),
/* harmony export */   ariaBool: () => (/* binding */ ariaBool),
/* harmony export */   camelToKebabCase: () => (/* binding */ camelToKebabCase),
/* harmony export */   chromecast: () => (/* binding */ chromecast),
/* harmony export */   composeRefs: () => (/* binding */ composeRefs),
/* harmony export */   computed: () => (/* binding */ computed),
/* harmony export */   createContext: () => (/* binding */ createContext),
/* harmony export */   createDisposalBin: () => (/* binding */ createDisposalBin),
/* harmony export */   createReactComponent: () => (/* binding */ createReactComponent),
/* harmony export */   createScope: () => (/* binding */ createScope),
/* harmony export */   deferredPromise: () => (/* binding */ deferredPromise),
/* harmony export */   effect: () => (/* binding */ effect),
/* harmony export */   findTriggerEvent: () => (/* binding */ findTriggerEvent),
/* harmony export */   fscreen: () => (/* binding */ fscreen),
/* harmony export */   functionDebounce: () => (/* binding */ functionDebounce),
/* harmony export */   functionThrottle: () => (/* binding */ functionThrottle),
/* harmony export */   getScope: () => (/* binding */ getScope),
/* harmony export */   hasProvidedContext: () => (/* binding */ hasProvidedContext),
/* harmony export */   hasTriggerEvent: () => (/* binding */ hasTriggerEvent),
/* harmony export */   isArray: () => (/* binding */ isArray),
/* harmony export */   isBoolean: () => (/* binding */ isBoolean),
/* harmony export */   isDOMNode: () => (/* binding */ isDOMNode),
/* harmony export */   isFunction: () => (/* binding */ isFunction),
/* harmony export */   isKeyboardClick: () => (/* binding */ isKeyboardClick),
/* harmony export */   isKeyboardEvent: () => (/* binding */ isKeyboardEvent),
/* harmony export */   isMouseEvent: () => (/* binding */ isMouseEvent),
/* harmony export */   isNil: () => (/* binding */ isNil),
/* harmony export */   isNull: () => (/* binding */ isNull),
/* harmony export */   isNumber: () => (/* binding */ isNumber),
/* harmony export */   isObject: () => (/* binding */ isObject),
/* harmony export */   isPointerEvent: () => (/* binding */ isPointerEvent),
/* harmony export */   isString: () => (/* binding */ isString),
/* harmony export */   isTouchEvent: () => (/* binding */ isTouchEvent),
/* harmony export */   isUndefined: () => (/* binding */ isUndefined),
/* harmony export */   isWriteSignal: () => (/* binding */ isWriteSignal),
/* harmony export */   kebabToCamelCase: () => (/* binding */ kebabToCamelCase),
/* harmony export */   keysOf: () => (/* binding */ keysOf),
/* harmony export */   listenEvent: () => (/* binding */ listenEvent),
/* harmony export */   method: () => (/* binding */ method),
/* harmony export */   noop: () => (/* binding */ noop),
/* harmony export */   onDispose: () => (/* binding */ onDispose),
/* harmony export */   peek: () => (/* binding */ peek),
/* harmony export */   prop: () => (/* binding */ prop),
/* harmony export */   provideContext: () => (/* binding */ provideContext),
/* harmony export */   r: () => (/* binding */ r),
/* harmony export */   scoped: () => (/* binding */ scoped),
/* harmony export */   setAttribute: () => (/* binding */ setAttribute),
/* harmony export */   setStyle: () => (/* binding */ setStyle),
/* harmony export */   signal: () => (/* binding */ signal),
/* harmony export */   tick: () => (/* binding */ tick),
/* harmony export */   toggleClass: () => (/* binding */ toggleClass),
/* harmony export */   untrack: () => (/* binding */ untrack),
/* harmony export */   uppercaseFirstChar: () => (/* binding */ uppercaseFirstChar),
/* harmony export */   useContext: () => (/* binding */ useContext),
/* harmony export */   useReactContext: () => (/* binding */ useReactContext),
/* harmony export */   useReactScope: () => (/* binding */ useReactScope),
/* harmony export */   useSignal: () => (/* binding */ useSignal),
/* harmony export */   useSignalRecord: () => (/* binding */ useSignalRecord),
/* harmony export */   useState: () => (/* binding */ useState),
/* harmony export */   useStateContext: () => (/* binding */ useStateContext),
/* harmony export */   waitIdlePeriod: () => (/* binding */ waitIdlePeriod),
/* harmony export */   waitTimeout: () => (/* binding */ waitTimeout),
/* harmony export */   walkTriggerEventChain: () => (/* binding */ walkTriggerEventChain),
/* harmony export */   wasEnterKeyPressed: () => (/* binding */ wasEnterKeyPressed)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
"use client"

;

const IS_SERVER = typeof document === "undefined";
const SCOPE = Symbol("SCOPE");
let scheduledEffects = false, runningEffects = false, currentScope = null, currentObserver = null, currentObservers = null, currentObserversIndex = 0, effects = [], defaultContext = {};
const NOOP = () => {
}, STATE_CLEAN = 0, STATE_CHECK = 1, STATE_DIRTY = 2, STATE_DISPOSED = 3;
function flushEffects() {
  scheduledEffects = true;
  queueMicrotask(runEffects);
}
function runEffects() {
  if (!effects.length) {
    scheduledEffects = false;
    return;
  }
  runningEffects = true;
  for (let i = 0; i < effects.length; i++) {
    if (effects[i]._state !== STATE_CLEAN)
      runTop(effects[i]);
  }
  effects = [];
  scheduledEffects = false;
  runningEffects = false;
}
function runTop(node) {
  let ancestors = [node];
  while (node = node[SCOPE]) {
    if (node._effect && node._state !== STATE_CLEAN)
      ancestors.push(node);
  }
  for (let i = ancestors.length - 1; i >= 0; i--) {
    updateCheck(ancestors[i]);
  }
}
function root(init) {
  const scope = createScope();
  return compute(scope, !init.length ? init : init.bind(null, dispose.bind(scope)), null);
}
function peek(fn) {
  return compute(currentScope, fn, null);
}
function untrack(fn) {
  return compute(null, fn, null);
}
function tick() {
  if (!runningEffects)
    runEffects();
}
function getScope() {
  return currentScope;
}
function scoped(run2, scope) {
  try {
    return compute(scope, run2, null);
  } catch (error) {
    handleError(scope, error);
    return;
  }
}
function getContext(key, scope = currentScope) {
  return scope?._context[key];
}
function setContext(key, value, scope = currentScope) {
  if (scope)
    scope._context = { ...scope._context, [key]: value };
}
function onDispose(disposable) {
  if (!disposable || !currentScope)
    return disposable || NOOP;
  const node = currentScope;
  if (!node._disposal) {
    node._disposal = disposable;
  } else if (Array.isArray(node._disposal)) {
    node._disposal.push(disposable);
  } else {
    node._disposal = [node._disposal, disposable];
  }
  return function removeDispose() {
    if (node._state === STATE_DISPOSED)
      return;
    disposable.call(null);
    if (isFunction$1(node._disposal)) {
      node._disposal = null;
    } else if (Array.isArray(node._disposal)) {
      node._disposal.splice(node._disposal.indexOf(disposable), 1);
    }
  };
}
function dispose(self = true) {
  if (this._state === STATE_DISPOSED)
    return;
  if (this._children) {
    if (Array.isArray(this._children)) {
      for (let i = this._children.length - 1; i >= 0; i--) {
        dispose.call(this._children[i]);
      }
    } else {
      dispose.call(this._children);
    }
  }
  if (self) {
    const parent = this[SCOPE];
    if (parent) {
      if (Array.isArray(parent._children)) {
        parent._children.splice(parent._children.indexOf(this), 1);
      } else {
        parent._children = null;
      }
    }
    disposeNode(this);
  }
}
function disposeNode(node) {
  node._state = STATE_DISPOSED;
  if (node._disposal)
    emptyDisposal(node);
  if (node._sources)
    removeSourceObservers(node, 0);
  node[SCOPE] = null;
  node._sources = null;
  node._observers = null;
  node._children = null;
  node._context = defaultContext;
  node._handlers = null;
}
function emptyDisposal(scope) {
  try {
    if (Array.isArray(scope._disposal)) {
      for (let i = scope._disposal.length - 1; i >= 0; i--) {
        const callable = scope._disposal[i];
        callable.call(callable);
      }
    } else {
      scope._disposal.call(scope._disposal);
    }
    scope._disposal = null;
  } catch (error) {
    handleError(scope, error);
  }
}
function compute(scope, compute2, observer) {
  const prevScope = currentScope, prevObserver = currentObserver;
  currentScope = scope;
  currentObserver = observer;
  try {
    return compute2.call(scope);
  } finally {
    currentScope = prevScope;
    currentObserver = prevObserver;
  }
}
function handleError(scope, error) {
  if (!scope || !scope._handlers)
    throw error;
  let i = 0, len = scope._handlers.length, currentError = error;
  for (i = 0; i < len; i++) {
    try {
      scope._handlers[i](currentError);
      break;
    } catch (error2) {
      currentError = error2;
    }
  }
  if (i === len)
    throw currentError;
}
function read() {
  if (this._state === STATE_DISPOSED)
    return this._value;
  if (currentObserver && !this._effect) {
    if (!currentObservers && currentObserver._sources && currentObserver._sources[currentObserversIndex] == this) {
      currentObserversIndex++;
    } else if (!currentObservers)
      currentObservers = [this];
    else
      currentObservers.push(this);
  }
  if (this._compute)
    updateCheck(this);
  return this._value;
}
function write(newValue) {
  const value = isFunction$1(newValue) ? newValue(this._value) : newValue;
  if (this._changed(this._value, value)) {
    this._value = value;
    if (this._observers) {
      for (let i = 0; i < this._observers.length; i++) {
        notify(this._observers[i], STATE_DIRTY);
      }
    }
  }
  return this._value;
}
const ScopeNode = function Scope() {
  this[SCOPE] = null;
  this._children = null;
  if (currentScope)
    currentScope.append(this);
};
const ScopeProto = ScopeNode.prototype;
ScopeProto._context = defaultContext;
ScopeProto._handlers = null;
ScopeProto._compute = null;
ScopeProto._disposal = null;
ScopeProto.append = function(child) {
  child[SCOPE] = this;
  if (!this._children) {
    this._children = child;
  } else if (Array.isArray(this._children)) {
    this._children.push(child);
  } else {
    this._children = [this._children, child];
  }
  child._context = child._context === defaultContext ? this._context : { ...this._context, ...child._context };
  if (this._handlers) {
    child._handlers = !child._handlers ? this._handlers : [...child._handlers, ...this._handlers];
  }
};
ScopeProto.dispose = function() {
  dispose.call(this);
};
function createScope() {
  return new ScopeNode();
}
const ComputeNode = function Computation(initialValue, compute2, options) {
  ScopeNode.call(this);
  this._state = compute2 ? STATE_DIRTY : STATE_CLEAN;
  this._init = false;
  this._effect = false;
  this._sources = null;
  this._observers = null;
  this._value = initialValue;
  this.id = options?.id ?? (this._compute ? "computed" : "signal");
  if (compute2)
    this._compute = compute2;
  if (options && options.dirty)
    this._changed = options.dirty;
};
const ComputeProto = ComputeNode.prototype;
Object.setPrototypeOf(ComputeProto, ScopeProto);
ComputeProto._changed = isNotEqual;
ComputeProto.call = read;
function createComputation(initialValue, compute2, options) {
  return new ComputeNode(initialValue, compute2, options);
}
function isNotEqual(a, b) {
  return a !== b;
}
function isFunction$1(value) {
  return typeof value === "function";
}
function updateCheck(node) {
  if (node._state === STATE_CHECK) {
    for (let i = 0; i < node._sources.length; i++) {
      updateCheck(node._sources[i]);
      if (node._state === STATE_DIRTY) {
        break;
      }
    }
  }
  if (node._state === STATE_DIRTY)
    update(node);
  else
    node._state = STATE_CLEAN;
}
function cleanup(node) {
  if (node._children)
    dispose.call(node, false);
  if (node._disposal)
    emptyDisposal(node);
  node._handlers = node[SCOPE] ? node[SCOPE]._handlers : null;
}
function update(node) {
  let prevObservers = currentObservers, prevObserversIndex = currentObserversIndex;
  currentObservers = null;
  currentObserversIndex = 0;
  try {
    cleanup(node);
    const result = compute(node, node._compute, node);
    updateObservers(node);
    if (!node._effect && node._init) {
      write.call(node, result);
    } else {
      node._value = result;
      node._init = true;
    }
  } catch (error) {
    if (!node._init && typeof node._value === "undefined") {
      console.error(
        `computed \`${node.id}\` threw error during first run, this can be fatal.

Solutions:

1. Set the \`initial\` option to silence this error`,
        "\n2. Or, use an `effect` if the return value is not being used",
        "\n\n",
        error
      );
    }
    updateObservers(node);
    handleError(node, error);
  } finally {
    currentObservers = prevObservers;
    currentObserversIndex = prevObserversIndex;
    node._state = STATE_CLEAN;
  }
}
function updateObservers(node) {
  if (currentObservers) {
    if (node._sources)
      removeSourceObservers(node, currentObserversIndex);
    if (node._sources && currentObserversIndex > 0) {
      node._sources.length = currentObserversIndex + currentObservers.length;
      for (let i = 0; i < currentObservers.length; i++) {
        node._sources[currentObserversIndex + i] = currentObservers[i];
      }
    } else {
      node._sources = currentObservers;
    }
    let source;
    for (let i = currentObserversIndex; i < node._sources.length; i++) {
      source = node._sources[i];
      if (!source._observers)
        source._observers = [node];
      else
        source._observers.push(node);
    }
  } else if (node._sources && currentObserversIndex < node._sources.length) {
    removeSourceObservers(node, currentObserversIndex);
    node._sources.length = currentObserversIndex;
  }
}
function notify(node, state) {
  if (node._state >= state)
    return;
  if (node._effect && node._state === STATE_CLEAN) {
    effects.push(node);
    if (!scheduledEffects)
      flushEffects();
  }
  node._state = state;
  if (node._observers) {
    for (let i = 0; i < node._observers.length; i++) {
      notify(node._observers[i], STATE_CHECK);
    }
  }
}
function removeSourceObservers(node, index) {
  let source, swap;
  for (let i = index; i < node._sources.length; i++) {
    source = node._sources[i];
    if (source._observers) {
      swap = source._observers.indexOf(node);
      source._observers[swap] = source._observers[source._observers.length - 1];
      source._observers.pop();
    }
  }
}
function signal(initialValue, options) {
  const node = createComputation(initialValue, null, options), signal2 = read.bind(node);
  signal2.node = node;
  signal2[SCOPE] = true;
  signal2.set = write.bind(node);
  return signal2;
}
function isReadSignal(fn) {
  return isFunction$1(fn) && SCOPE in fn;
}
function computed(compute2, options) {
  const node = createComputation(
    options?.initial,
    compute2,
    options
  ), signal2 = read.bind(node);
  signal2[SCOPE] = true;
  signal2.node = node;
  return signal2;
}
function effect$1(effect2, options) {
  const signal2 = createComputation(
    null,
    function runEffect() {
      let effectResult = effect2();
      isFunction$1(effectResult) && onDispose(effectResult);
      return null;
    },
    { id: options?.id ?? "effect" }
  );
  signal2._effect = true;
  update(signal2);
  {
    return function stopEffect() {
      dispose.call(signal2, true);
    };
  }
}
function isWriteSignal(fn) {
  return isReadSignal(fn) && "set" in fn;
}
function noop(...args) {
}
function isNull(value) {
  return value === null;
}
function isUndefined(value) {
  return typeof value === "undefined";
}
function isNil(value) {
  return isNull(value) || isUndefined(value);
}
function isObject(value) {
  return value?.constructor === Object;
}
function isNumber(value) {
  return typeof value === "number" && !Number.isNaN(value);
}
function isString(value) {
  return typeof value === "string";
}
function isBoolean(value) {
  return typeof value === "boolean";
}
function isFunction(value) {
  return typeof value === "function";
}
function isArray(value) {
  return Array.isArray(value);
}
const effect = IS_SERVER ? serverEffect : effect$1;
function serverEffect(effect2, options) {
  if (typeof process !== "undefined" && "development" === "test") {}
  return noop;
}
const EVENT = IS_SERVER ? class Event2 {
} : Event, DOM_EVENT = Symbol("DOM_EVENT");
class DOMEvent extends EVENT {
  [DOM_EVENT] = true;
  /**
   * The event detail.
   */
  detail;
  /**
   * The event trigger chain.
   */
  triggers = new EventTriggers();
  /**
   * The preceding event that was responsible for this event being fired.
   */
  get trigger() {
    return this.triggers.source;
  }
  /**
   * The origin event that lead to this event being fired.
   */
  get originEvent() {
    return this.triggers.origin;
  }
  /**
   * Whether the origin event was triggered by the user.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Event/isTrusted}
   */
  get isOriginTrusted() {
    return this.triggers.origin?.isTrusted ?? false;
  }
  constructor(type, ...init) {
    super(type, init[0]);
    this.detail = init[0]?.detail;
    const trigger = init[0]?.trigger;
    if (trigger) this.triggers.add(trigger);
  }
}
class EventTriggers {
  chain = [];
  get source() {
    return this.chain[0];
  }
  get origin() {
    return this.chain[this.chain.length - 1];
  }
  /**
   * Appends the event to the end of the chain.
   */
  add(event) {
    this.chain.push(event);
    if (isDOMEvent(event)) {
      this.chain.push(...event.triggers);
    }
  }
  /**
   * Removes the event from the chain and returns it (if found).
   */
  remove(event) {
    return this.chain.splice(this.chain.indexOf(event), 1)[0];
  }
  /**
   * Returns whether the chain contains the given `event`.
   */
  has(event) {
    return this.chain.some((e) => e === event);
  }
  /**
   * Returns whether the chain contains the given event type.
   */
  hasType(type) {
    return !!this.findType(type);
  }
  /**
   * Returns the first event with the given `type` found in the chain.
   */
  findType(type) {
    return this.chain.find((e) => e.type === type);
  }
  /**
   * Walks an event chain on a given `event`, and invokes the given `callback` for each trigger event.
   */
  walk(callback) {
    for (const event of this.chain) {
      const returnValue = callback(event);
      if (returnValue) return [event, returnValue];
    }
  }
  [Symbol.iterator]() {
    return this.chain.values();
  }
}
function isDOMEvent(event) {
  return !!event?.[DOM_EVENT];
}
function walkTriggerEventChain(event, callback) {
  if (!isDOMEvent(event)) return;
  return event.triggers.walk(callback);
}
function findTriggerEvent(event, type) {
  return isDOMEvent(event) ? event.triggers.findType(type) : void 0;
}
function hasTriggerEvent(event, type) {
  return !!findTriggerEvent(event, type);
}
function appendTriggerEvent(event, trigger) {
  if (trigger) event.triggers.add(trigger);
}
class EventsTarget extends EventTarget {
  /** @internal type only */
  $ts__events;
  addEventListener(type, callback, options) {
    return super.addEventListener(type, callback, options);
  }
  removeEventListener(type, callback, options) {
    return super.removeEventListener(type, callback, options);
  }
}
function listenEvent(target, type, handler, options) {
  if (IS_SERVER) return noop;
  target.addEventListener(type, handler, options);
  return onDispose(() => target.removeEventListener(type, handler, options));
}
class EventsController {
  #target;
  #controller;
  get signal() {
    return this.#controller.signal;
  }
  constructor(target) {
    this.#target = target;
    this.#controller = new AbortController();
    onDispose(this.abort.bind(this));
  }
  add(type, handler, options) {
    if (this.signal.aborted) throw Error("aborted");
    this.#target.addEventListener(type, handler, {
      ...options,
      signal: options?.signal ? anySignal(this.signal, options.signal) : this.signal
    });
    return this;
  }
  remove(type, handler) {
    this.#target.removeEventListener(type, handler);
    return this;
  }
  abort(reason) {
    this.#controller.abort(reason);
  }
}
function anySignal(...signals) {
  const controller = new AbortController(), options = { signal: controller.signal };
  function onAbort(event) {
    controller.abort(event.target.reason);
  }
  for (const signal2 of signals) {
    if (signal2.aborted) {
      controller.abort(signal2.reason);
      break;
    }
    signal2.addEventListener("abort", onAbort, options);
  }
  return controller.signal;
}
function isPointerEvent(event) {
  return !!event?.type.startsWith("pointer");
}
function isTouchEvent(event) {
  return !!event?.type.startsWith("touch");
}
function isMouseEvent(event) {
  return /^(click|mouse)/.test(event?.type ?? "");
}
function isKeyboardEvent(event) {
  return !!event?.type.startsWith("key");
}
function wasEnterKeyPressed(event) {
  return isKeyboardEvent(event) && event.key === "Enter";
}
function isKeyboardClick(event) {
  return isKeyboardEvent(event) && (event.key === "Enter" || event.key === " ");
}
function isDOMNode(node) {
  return node instanceof Node;
}
function setAttribute(host, name, value) {
  if (!host) return;
  else if (!value && value !== "" && value !== 0) {
    host.removeAttribute(name);
  } else {
    const attrValue = value === true ? "" : value + "";
    if (host.getAttribute(name) !== attrValue) {
      host.setAttribute(name, attrValue);
    }
  }
}
function setStyle(host, property, value) {
  if (!host) return;
  else if (!value && value !== 0) {
    host.style.removeProperty(property);
  } else {
    host.style.setProperty(property, value + "");
  }
}
function toggleClass(host, name, value) {
  host.classList[value ? "add" : "remove"](name);
}
function unwrapDeep(fn) {
  let value = fn;
  while (typeof value === "function") value = value.call(this);
  return value;
}
function createContext(provide) {
  return { id: Symbol(), provide };
}
function provideContext(context, value, scope = getScope()) {
  if (!scope) {
    throw Error("[maverick] attempting to provide context outside root");
  }
  const hasProvidedValue = !isUndefined(value);
  if (!hasProvidedValue && !context.provide) {
    throw Error("[maverick] context can not be provided without a value or `provide` function");
  }
  setContext(context.id, hasProvidedValue ? value : context.provide?.(), scope);
}
function useContext(context) {
  const value = getContext(context.id);
  if (isUndefined(value)) {
    throw Error("[maverick] attempting to use context without providing first");
  }
  return value;
}
function hasProvidedContext(context) {
  return !isUndefined(getContext(context.id));
}
const PROPS = /* @__PURE__ */ Symbol("PROPS");
const METHODS = /* @__PURE__ */ Symbol("METHODS");
const ON_DISPATCH = /* @__PURE__ */ Symbol("ON_DISPATCH");
const EMPTY_PROPS = {};
class Instance {
  /** @internal type only */
  $ts__events;
  /** @internal type only */
  $ts__vars;
  /* @internal */
  [ON_DISPATCH] = null;
  $el = signal(null);
  el = null;
  scope = null;
  attachScope = null;
  connectScope = null;
  component = null;
  destroyed = false;
  props = EMPTY_PROPS;
  attrs = null;
  styles = null;
  state;
  $state;
  #setupCallbacks = [];
  #attachCallbacks = [];
  #connectCallbacks = [];
  #destroyCallbacks = [];
  constructor(Component2, scope, init) {
    this.scope = scope;
    if (init?.scope) init.scope.append(scope);
    let stateFactory = Component2.state, props = Component2.props;
    if (stateFactory) {
      this.$state = stateFactory.create();
      this.state = new Proxy(this.$state, {
        get: (_, prop2) => this.$state[prop2]()
      });
      provideContext(stateFactory, this.$state);
    }
    if (props) {
      this.props = createInstanceProps(props);
      if (init?.props) {
        for (const prop2 of Object.keys(init.props)) {
          this.props[prop2]?.set(init.props[prop2]);
        }
      }
    }
    onDispose(this.destroy.bind(this));
  }
  setup() {
    scoped(() => {
      for (const callback of this.#setupCallbacks) callback();
    }, this.scope);
  }
  attach(el) {
    if (this.el) return;
    this.el = el;
    this.$el.set(el);
    {
      el.$$COMPONENT_NAME = this.component?.constructor.name;
    }
    scoped(() => {
      this.attachScope = createScope();
      scoped(() => {
        for (const callback of this.#attachCallbacks) callback(this.el);
        this.#attachAttrs();
        this.#attachStyles();
      }, this.attachScope);
    }, this.scope);
    el.dispatchEvent(new Event("attached"));
  }
  detach() {
    this.attachScope?.dispose();
    this.attachScope = null;
    this.connectScope = null;
    if (this.el) {
      this.el.$$COMPONENT_NAME = null;
    }
    this.el = null;
    this.$el.set(null);
  }
  connect() {
    if (!this.el || !this.attachScope || !this.#connectCallbacks.length) return;
    scoped(() => {
      this.connectScope = createScope();
      scoped(() => {
        for (const callback of this.#connectCallbacks) callback(this.el);
      }, this.connectScope);
    }, this.attachScope);
  }
  disconnect() {
    this.connectScope?.dispose();
    this.connectScope = null;
  }
  destroy() {
    if (this.destroyed) return;
    this.destroyed = true;
    scoped(() => {
      for (const callback of this.#destroyCallbacks) callback(this.el);
    }, this.scope);
    const el = this.el;
    this.detach();
    this.scope.dispose();
    this.#setupCallbacks.length = 0;
    this.#attachCallbacks.length = 0;
    this.#connectCallbacks.length = 0;
    this.#destroyCallbacks.length = 0;
    this.component = null;
    this.attrs = null;
    this.styles = null;
    this.props = EMPTY_PROPS;
    this.scope = null;
    this.state = EMPTY_PROPS;
    this.$state = null;
    if (el) delete el.$;
  }
  addHooks(target) {
    if (target.onSetup) this.#setupCallbacks.push(target.onSetup.bind(target));
    if (target.onAttach) this.#attachCallbacks.push(target.onAttach.bind(target));
    if (target.onConnect) this.#connectCallbacks.push(target.onConnect.bind(target));
    if (target.onDestroy) this.#destroyCallbacks.push(target.onDestroy.bind(target));
  }
  #attachAttrs() {
    if (!this.attrs) return;
    for (const name of Object.keys(this.attrs)) {
      if (IS_SERVER) {
        setAttribute(this.el, name, unwrapDeep.call(this.component, this.attrs[name]));
      } else if (isFunction(this.attrs[name])) {
        effect(this.#setAttr.bind(this, name));
      } else {
        setAttribute(this.el, name, this.attrs[name]);
      }
    }
  }
  #attachStyles() {
    if (!this.styles) return;
    for (const name of Object.keys(this.styles)) {
      if (IS_SERVER) {
        setStyle(this.el, name, unwrapDeep.call(this.component, this.styles[name]));
      } else if (isFunction(this.styles[name])) {
        effect(this.#setStyle.bind(this, name));
      } else {
        setStyle(this.el, name, this.styles[name]);
      }
    }
  }
  #setAttr(name) {
    setAttribute(this.el, name, this.attrs[name].call(this.component));
  }
  #setStyle(name) {
    setStyle(this.el, name, this.styles[name].call(this.component));
  }
}
function createInstanceProps(props) {
  const $props = {};
  for (const name of Object.keys(props)) {
    const def = props[name];
    $props[name] = signal(def, def);
  }
  return $props;
}
let currentInstance = { $$: null };
function createComponent(Component2, init) {
  return root(() => {
    currentInstance.$$ = new Instance(Component2, getScope(), init);
    const component = new Component2();
    currentInstance.$$.component = component;
    currentInstance.$$ = null;
    return component;
  });
}
class ViewController extends EventTarget {
  /** @internal */
  $$;
  get el() {
    return this.$$.el;
  }
  get $el() {
    return this.$$.$el();
  }
  get scope() {
    return this.$$.scope;
  }
  get attachScope() {
    return this.$$.attachScope;
  }
  get connectScope() {
    return this.$$.connectScope;
  }
  /** @internal */
  get $props() {
    return this.$$.props;
  }
  /** @internal */
  get $state() {
    return this.$$.$state;
  }
  get state() {
    return this.$$.state;
  }
  constructor() {
    super();
    if (currentInstance.$$) this.attach(currentInstance);
  }
  attach({ $$ }) {
    this.$$ = $$;
    $$.addHooks(this);
    return this;
  }
  addEventListener(type, callback, options) {
    if (!this.el) {
      const name = this.constructor.name;
      console.warn(`[maverick] adding event listener to \`${name}\` before element is attached`);
    }
    this.listen(type, callback, options);
  }
  removeEventListener(type, callback, options) {
    this.el?.removeEventListener(type, callback, options);
  }
  /**
   * The given callback is invoked when the component is ready to be set up.
   *
   * - This hook will run once.
   * - This hook is called both client-side and server-side.
   * - It's safe to use context inside this hook.
   * - The host element has not attached yet - wait for `onAttach`.
   */
  /**
   * This method can be used to specify attributes that should be set on the host element. Any
   * attributes that are assigned to a function will be considered a signal and updated accordingly.
   */
  setAttributes(attributes) {
    if (!this.$$.attrs) this.$$.attrs = {};
    Object.assign(this.$$.attrs, attributes);
  }
  /**
   * This method can be used to specify styles that should set be set on the host element. Any
   * styles that are assigned to a function will be considered a signal and updated accordingly.
   */
  setStyles(styles) {
    if (!this.$$.styles) this.$$.styles = {};
    Object.assign(this.$$.styles, styles);
  }
  /**
   * This method is used to satisfy the CSS variables contract specified on the current
   * component. Other CSS variables can be set via the `setStyles` method.
   */
  setCSSVars(vars) {
    this.setStyles(vars);
  }
  /**
   * Type-safe utility for creating component DOM events.
   */
  createEvent(type, ...init) {
    return new DOMEvent(type, init[0]);
  }
  /**
   * Creates a `DOMEvent` and dispatches it from the host element. This method is typed to
   * match all component events.
   */
  dispatch(type, ...init) {
    if (IS_SERVER || !this.el) return false;
    const event = type instanceof Event ? type : new DOMEvent(type, init[0]);
    Object.defineProperty(event, "target", {
      get: () => this.$$.component
    });
    return untrack(() => {
      this.$$[ON_DISPATCH]?.(event);
      return this.el.dispatchEvent(event);
    });
  }
  dispatchEvent(event) {
    return this.dispatch(event);
  }
  /**
   * Adds an event listener for the given `type` and returns a function which can be invoked to
   * remove the event listener.
   *
   * - The listener is removed if the current scope is disposed.
   * - This method is safe to use on the server (noop).
   */
  listen(type, handler, options) {
    if (IS_SERVER || !this.el) return noop;
    return listenEvent(this.el, type, handler, options);
  }
}
class Component extends ViewController {
  subscribe(callback) {
    if (!this.state) {
      const name = this.constructor.name;
      throw Error(
        `[maverick] component \`${name}\` can not be subscribed to because it has no internal state`
      );
    }
    return scoped(() => effect(() => callback(this.state)), this.$$.scope);
  }
  destroy() {
    this.$$.destroy();
  }
}
function prop(target, propertyKey, descriptor) {
  if (!target[PROPS]) target[PROPS] = /* @__PURE__ */ new Set();
  target[PROPS].add(propertyKey);
}
function method(target, propertyKey, descriptor) {
  if (!target[METHODS]) target[METHODS] = /* @__PURE__ */ new Set();
  target[METHODS].add(propertyKey);
}
class State {
  id = Symbol("STATE");
  record;
  #descriptors;
  constructor(record) {
    this.record = record;
    this.#descriptors = Object.getOwnPropertyDescriptors(record);
  }
  create() {
    const store = {}, state = new Proxy(store, { get: (_, prop2) => store[prop2]() });
    for (const name of Object.keys(this.record)) {
      const getter = this.#descriptors[name].get;
      store[name] = getter ? computed(getter.bind(state)) : signal(this.record[name]);
    }
    return store;
  }
  reset(record, filter) {
    for (const name of Object.keys(record)) {
      if (!this.#descriptors[name].get && (!filter || filter(name))) {
        record[name].set(this.record[name]);
      }
    }
  }
}
function useState(state) {
  return useContext(state);
}
function camelToKebabCase(str) {
  return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}
function kebabToCamelCase(str) {
  return str.replace(/-./g, (x) => x[1].toUpperCase());
}
function kebabToPascalCase(str) {
  return kebabToTitleCase(str).replace(/\s/g, "");
}
function kebabToTitleCase(str) {
  return uppercaseFirstChar(str.replace(/-./g, (x) => " " + x[1].toUpperCase()));
}
function uppercaseFirstChar(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
const ReactScopeContext = react__WEBPACK_IMPORTED_MODULE_0__.createContext({ current: null });
ReactScopeContext.displayName = "Scope";
function WithScope(scope, ...children) {
  return react__WEBPACK_IMPORTED_MODULE_0__.createElement(ReactScopeContext.Provider, { value: scope }, ...children);
}
function useReactScope() {
  return react__WEBPACK_IMPORTED_MODULE_0__.useContext(ReactScopeContext).current;
}
function useReactContext(context) {
  const scope = useReactScope();
  return react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => getContext(context.id, scope), [scope]);
}
function setRef(ref, value) {
  if (typeof ref === "function") {
    ref(value);
  } else if (ref) {
    ref.current = value;
  }
}
function composeRefs(...refs) {
  return (node) => refs.forEach((ref) => setRef(ref, node));
}
function createClientComponent(Component2, options) {
  const forwardComponent = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef((props, forwardRef) => {
    let parentScopeRef = react__WEBPACK_IMPORTED_MODULE_0__.useContext(ReactScopeContext), scopeRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(null), stateRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef();
    if (!stateRef.current) {
      const state2 = createInternalState(), component = initComponent(Component2, state2, props, parentScopeRef.current);
      state2.component = component;
      stateRef.current = state2;
      scopeRef.current = component.scope;
    }
    function onAttach() {
      let state2 = stateRef.current, scope = parentScopeRef.current;
      window.cancelAnimationFrame(state2.destroyId);
      state2.destroyId = -1;
      if (state2.component.$$.destroyed) {
        const component = initComponent(Component2, state2, props, scope);
        state2.component = component;
        state2.attached = false;
        state2.forwardRef = false;
        scopeRef.current = component.scope;
      }
      if (state2.el) {
        attachToHost(state2, state2.el);
      }
      if (!state2.forwardRef) {
        setRef(forwardRef, state2.component);
        state2.forwardRef = true;
      }
      return () => detachFromHost(state2);
    }
    function onRefChange(el) {
      const state2 = stateRef.current;
      if (!state2.forwardRef) {
        state2.el = el;
        return;
      }
      window.cancelAnimationFrame(state2.refChangeId);
      state2.refChangeId = window.requestAnimationFrame(() => {
        const state3 = stateRef.current;
        state3.refChangeId = -1;
        if (state3.el === el) return;
        detachFromHost(state3);
        if (el) attachToHost(state3, el);
        state3.el = el;
      });
    }
    react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
      const state2 = stateRef.current;
      window.cancelAnimationFrame(state2.destroyId);
      state2.destroyId = -1;
      return function onDestroy() {
        if (!isFunction(props.children)) return;
        window.cancelAnimationFrame(state2.refChangeId);
        state2.refChangeId = -1;
        window.cancelAnimationFrame(state2.connectId);
        state2.connectId = -1;
        window.cancelAnimationFrame(state2.destroyId);
        state2.destroyId = window.requestAnimationFrame(() => {
          state2.destroyId = -1;
          detachFromHost(state2);
          state2.component.$$.destroy();
          state2.component.$$[ON_DISPATCH] = null;
          state2.callbacks = {};
          state2.domCallbacks = {};
          scopeRef.current = null;
        });
      };
    }, []);
    react__WEBPACK_IMPORTED_MODULE_0__.useEffect(tick);
    let state = stateRef.current, { children, ...renderProps } = props, attrs = {}, prevPropNames = state.prevProps, newPropNames = Object.keys(renderProps);
    state.callbacks = {};
    for (const name of [...prevPropNames, ...newPropNames]) {
      if (options.props.has(name)) {
        state.component.$props[name].set(
          // If the prop was removed we'll use the default value provided on Component creation.
          isUndefined(renderProps[name]) ? Component2.props?.[name] : renderProps[name]
        );
      } else if (options.events?.has(name) || options.eventsRE?.test(name)) {
        state.callbacks[name] = renderProps[name];
      } else if (options.domEvents?.has(name) || options.domEventsRE?.test(name)) {
        let type = camelToKebabCase(name.slice(2));
        state.domCallbacks[type] = renderProps[name];
        if (!newPropNames.includes(name)) {
          state.el?.removeEventListener(type, state.onDOMEvent);
          state.listening?.delete(type);
        } else if (state.el && !state.listening?.has(type)) {
          if (!state.listening) state.listening = /* @__PURE__ */ new Set();
          state.listening.add(type);
          state.el.addEventListener(type, state.onDOMEvent);
        }
      } else {
        attrs[name] = renderProps[name];
      }
    }
    state.prevProps = newPropNames;
    return WithScope(
      scopeRef,
      react__WEBPACK_IMPORTED_MODULE_0__.createElement(AttachEffect, {
        effect: onAttach
      }),
      isFunction(children) ? children?.(
        {
          ...attrs,
          suppressHydrationWarning: true,
          ref: onRefChange
        },
        state.component
      ) : children
    );
  });
  forwardComponent.displayName = Component2.name + "Bridge";
  return forwardComponent;
}
function AttachEffect({ effect: effect2 }) {
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(effect2, []);
  return null;
}
const eventTypeToCallbackName = /* @__PURE__ */ new Map();
function createInternalState() {
  const state = {
    el: null,
    prevProps: [],
    callbacks: {},
    domCallbacks: {},
    refChangeId: -1,
    connectId: -1,
    destroyId: -1,
    attached: false,
    forwardRef: false,
    listening: null,
    onDOMEvent(event) {
      const args = !isUndefined(event.detail) ? [event.detail, event] : [event];
      state.domCallbacks[event.type]?.(...args);
    }
  };
  return state;
}
function attachToHost(state, el) {
  if (state.el === el && state.attached) return;
  else if (state.attached) detachFromHost(state);
  if (state.domCallbacks) {
    if (!state.listening) state.listening = /* @__PURE__ */ new Set();
    for (const type of Object.keys(state.domCallbacks)) {
      if (state.listening.has(type)) continue;
      el.addEventListener(type, state.onDOMEvent);
      state.listening.add(type);
    }
  }
  state.component.$$.attach(el);
  state.connectId = window.requestAnimationFrame(() => {
    state.component.$$.connect();
    state.connectId = -1;
  });
  state.attached = true;
}
function detachFromHost(state) {
  if (!state.attached) return;
  window.cancelAnimationFrame(state.connectId);
  state.connectId = -1;
  state.component.$$.detach();
  state.attached = false;
  if (state.el && state.listening) {
    for (const type of state.listening) {
      state.el.removeEventListener(type, state.onDOMEvent);
    }
    state.listening.clear();
  }
}
function onDispatch(event) {
  let callbackProp = eventTypeToCallbackName.get(event.type), args = !isUndefined(event.detail) ? [event.detail, event] : [event];
  if (!callbackProp) {
    eventTypeToCallbackName.set(event.type, callbackProp = `on${kebabToPascalCase(event.type)}`);
  }
  this.callbacks[callbackProp]?.(...args);
}
function initComponent(Component2, state, props, scope) {
  const component = createComponent(Component2, { props, scope });
  component.$$[ON_DISPATCH] = onDispatch.bind(state);
  component.$$.setup();
  return component;
}
function escape(value, isAttr = false) {
  const type = typeof value;
  if (type !== "string") {
    if (!isAttr && type === "function") return escape(value());
    if (isAttr && type === "boolean") return value + "";
    return value;
  }
  const delimeter = isAttr ? '"' : "<", escapeDelimeter = isAttr ? "&quot;" : "&lt;";
  let iDelimeter = value.indexOf(delimeter), isAmpersand = value.indexOf("&");
  if (iDelimeter < 0 && isAmpersand < 0) return value;
  let left = 0, out = "";
  while (iDelimeter >= 0 && isAmpersand >= 0) {
    if (iDelimeter < isAmpersand) {
      if (left < iDelimeter) out += value.substring(left, iDelimeter);
      out += escapeDelimeter;
      left = iDelimeter + 1;
      iDelimeter = value.indexOf(delimeter, left);
    } else {
      if (left < isAmpersand) out += value.substring(left, isAmpersand);
      out += "&amp;";
      left = isAmpersand + 1;
      isAmpersand = value.indexOf("&", left);
    }
  }
  if (iDelimeter >= 0) {
    do {
      if (left < iDelimeter) out += value.substring(left, iDelimeter);
      out += escapeDelimeter;
      left = iDelimeter + 1;
      iDelimeter = value.indexOf(delimeter, left);
    } while (iDelimeter >= 0);
  } else
    while (isAmpersand >= 0) {
      if (left < isAmpersand) out += value.substring(left, isAmpersand);
      out += "&amp;";
      left = isAmpersand + 1;
      isAmpersand = value.indexOf("&", left);
    }
  return left < value.length ? out + value.substring(left) : out;
}
const SETUP = /* @__PURE__ */ Symbol("SETUP");
const classSplitRE = /\s+/;
function parseClassAttr(tokens, attrValue) {
  const classes = attrValue.trim().split(classSplitRE);
  for (const token of classes) tokens.add(token);
}
const styleSplitRE = /\s*:\s*/;
const stylesDelimeterRE = /\s*;\s*/;
function parseStyleAttr(tokens, attrValue) {
  const styles = attrValue.trim().split(stylesDelimeterRE);
  for (let i = 0; i < styles.length; i++) {
    if (styles[i] === "") continue;
    const [name, value] = styles[i].split(styleSplitRE);
    tokens.set(name, value);
  }
}
class MaverickServerElement {
  keepAlive = false;
  forwardKeepAlive = true;
  $;
  attributes = new ServerAttributes();
  style = new ServerStyle();
  classList = new ServerClassList();
  get $props() {
    return this.$.$$.props;
  }
  get $state() {
    return this.$.$$.$state;
  }
  get state() {
    return this.$.state;
  }
  constructor(component) {
    this.$ = component;
  }
  setup() {
    const instance = this.$.$$;
    scoped(() => {
      if (this.hasAttribute("class")) {
        parseClassAttr(this.classList.tokens, this.getAttribute("class"));
      }
      if (this.hasAttribute("style")) {
        parseStyleAttr(this.style.tokens, this.getAttribute("style"));
      }
      instance.setup();
      instance.attach(this);
      if (this.classList.length > 0) {
        this.setAttribute("class", this.classList.toString());
      }
      if (this.style.length > 0) {
        this.setAttribute("style", this.style.toString());
      }
      if (this.keepAlive) {
        this.setAttribute("keep-alive", "");
      }
    }, instance.scope);
  }
  getAttribute(name) {
    return this.attributes.getAttribute(name);
  }
  setAttribute(name, value) {
    this.attributes.setAttribute(name, value);
  }
  hasAttribute(name) {
    return this.attributes.hasAttribute(name);
  }
  removeAttribute(name) {
    return this.attributes.removeAttribute(name);
  }
  [SETUP]() {
  }
  addEventListener() {
  }
  removeEventListener() {
  }
  dispatchEvent() {
    return false;
  }
  subscribe() {
    return noop;
  }
  destroy() {
    this.$.destroy();
  }
}
class ServerAttributes {
  #tokens = /* @__PURE__ */ new Map();
  get length() {
    return this.#tokens.size;
  }
  get tokens() {
    return this.#tokens;
  }
  getAttribute(name) {
    return this.#tokens.get(name) ?? null;
  }
  hasAttribute(name) {
    return this.#tokens.has(name);
  }
  setAttribute(name, value) {
    this.#tokens.set(name, value + "");
  }
  removeAttribute(name) {
    this.#tokens.delete(name);
  }
  toString() {
    if (this.#tokens.size === 0) return "";
    let result = "";
    for (const [name, value] of this.#tokens) {
      result += ` ${name}="${escape(value, true)}"`;
    }
    return result;
  }
}
class ServerStyle {
  #tokens = /* @__PURE__ */ new Map();
  get length() {
    return this.#tokens.size;
  }
  get tokens() {
    return this.#tokens;
  }
  getPropertyValue(prop2) {
    return this.#tokens.get(prop2) ?? "";
  }
  setProperty(prop2, value) {
    this.#tokens.set(prop2, value ?? "");
  }
  removeProperty(prop2) {
    const value = this.#tokens.get(prop2);
    this.#tokens.delete(prop2);
    return value ?? "";
  }
  toString() {
    if (this.#tokens.size === 0) return "";
    let result = "";
    for (const [name, value] of this.#tokens) {
      result += `${name}: ${value};`;
    }
    return result;
  }
}
class ServerClassList {
  #tokens = /* @__PURE__ */ new Set();
  get length() {
    return this.#tokens.size;
  }
  get tokens() {
    return this.#tokens;
  }
  add(...tokens) {
    for (const token of tokens) {
      this.#tokens.add(token);
    }
  }
  contains(token) {
    return this.#tokens.has(token);
  }
  remove(token) {
    this.#tokens.delete(token);
  }
  replace(token, newToken) {
    if (!this.#tokens.has(token)) return false;
    this.#tokens.delete(token);
    this.#tokens.add(newToken);
    return true;
  }
  toggle(token, force) {
    if (force !== true && (this.#tokens.has(token) || force === false)) {
      this.#tokens.delete(token);
      return false;
    } else {
      this.#tokens.add(token);
      return true;
    }
  }
  toString() {
    return Array.from(this.#tokens).join(" ");
  }
}
const attrsToProps = {
  acceptcharset: "acceptCharset",
  "accept-charset": "acceptCharset",
  accesskey: "accessKey",
  allowfullscreen: "allowFullScreen",
  autocapitalize: "autoCapitalize",
  autocomplete: "autoComplete",
  autocorrect: "autoCorrect",
  autofocus: "autoFocus",
  autoplay: "autoPlay",
  autosave: "autoSave",
  cellpadding: "cellPadding",
  cellspacing: "cellSpacing",
  charset: "charSet",
  class: "className",
  classid: "classID",
  classname: "className",
  colspan: "colSpan",
  contenteditable: "contentEditable",
  contextmenu: "contextMenu",
  controlslist: "controlsList",
  crossorigin: "crossOrigin",
  dangerouslysetinnerhtml: "dangerouslySetInnerHTML",
  datetime: "dateTime",
  defaultchecked: "defaultChecked",
  defaultvalue: "defaultValue",
  disablepictureinpicture: "disablePictureInPicture",
  disableremoteplayback: "disableRemotePlayback",
  enctype: "encType",
  enterkeyhint: "enterKeyHint",
  fetchpriority: "fetchPriority",
  for: "htmlFor",
  formmethod: "formMethod",
  formaction: "formAction",
  formenctype: "formEncType",
  formnovalidate: "formNoValidate",
  formtarget: "formTarget",
  frameborder: "frameBorder",
  hreflang: "hrefLang",
  htmlfor: "htmlFor",
  httpequiv: "httpEquiv",
  "http-equiv": "httpEquiv",
  imagesizes: "imageSizes",
  imagesrcset: "imageSrcSet",
  innerhtml: "innerHTML",
  inputmode: "inputMode",
  itemid: "itemID",
  itemprop: "itemProp",
  itemref: "itemRef",
  itemscope: "itemScope",
  itemtype: "itemType",
  keyparams: "keyParams",
  keytype: "keyType",
  marginwidth: "marginWidth",
  marginheight: "marginHeight",
  maxlength: "maxLength",
  mediagroup: "mediaGroup",
  minlength: "minLength",
  nomodule: "noModule",
  novalidate: "noValidate",
  playsinline: "playsInline",
  radiogroup: "radioGroup",
  readonly: "readOnly",
  referrerpolicy: "referrerPolicy",
  rowspan: "rowSpan",
  spellcheck: "spellCheck",
  srcdoc: "srcDoc",
  srclang: "srcLang",
  srcset: "srcSet",
  tabindex: "tabIndex",
  usemap: "useMap"
};
function createServerComponent(Component2, options) {
  function ServerComponent(props) {
    let scope = react__WEBPACK_IMPORTED_MODULE_0__.useContext(ReactScopeContext), component = createComponent(Component2, {
      props,
      scope: scope.current
    }), host = new MaverickServerElement(component), attrs = {}, { style = {}, children, forwardRef, ...renderProps } = props;
    if (options.props.size) {
      for (const prop2 of Object.keys(renderProps)) {
        if (!options.props.has(prop2)) attrs[prop2] = renderProps[prop2];
      }
    } else {
      attrs = renderProps;
    }
    host.setup();
    if (host.hasAttribute("style")) {
      for (const [name, value] of host.style.tokens) {
        style[name.startsWith("--") ? name : kebabToCamelCase(name)] = value;
      }
      host.removeAttribute("style");
    }
    for (const [attrName, attrValue] of host.attributes.tokens) {
      const propName = attrsToProps[attrName];
      if (propName) {
        if (!(propName in attrs)) {
          attrs[propName] = attrValue;
        }
        host.removeAttribute(attrName);
      }
    }
    return WithScope(
      { current: component.$$.scope },
      isFunction(children) ? children?.(
        {
          ...Object.fromEntries(host.attributes.tokens),
          ...attrs,
          style
        },
        component
      ) : children,
      react__WEBPACK_IMPORTED_MODULE_0__.createElement(() => {
        host.destroy();
        return null;
      })
    );
  }
  ServerComponent.displayName = Component2.name + "Bridge";
  return ServerComponent;
}
function useStateContext(state) {
  return useReactContext(state);
}
function useSignal(signal2, key) {
  const [, scheduleReactUpdate] = react__WEBPACK_IMPORTED_MODULE_0__.useState();
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    return effect$1(() => {
      signal2();
      scheduleReactUpdate({});
    });
  }, [key ?? signal2]);
  return signal2();
}
function ariaBool(value) {
  return value ? "true" : "false";
}
function createDisposalBin() {
  const disposal = /* @__PURE__ */ new Set();
  return {
    add(...callbacks) {
      for (const callback of callbacks) disposal.add(callback);
    },
    empty() {
      for (const callback of disposal) callback();
      disposal.clear();
    }
  };
}
function keysOf(obj) {
  return Object.keys(obj);
}
function deferredPromise() {
  let resolve, reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}
function waitTimeout(delay) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}
function animationFrameThrottle(func) {
  if (IS_SERVER) return noop;
  let id = -1, lastArgs;
  function throttle(...args) {
    lastArgs = args;
    if (id >= 0) return;
    id = window.requestAnimationFrame(() => {
      func.apply(this, lastArgs);
      id = -1;
      lastArgs = void 0;
    });
  }
  return throttle;
}
const requestIdleCallback = IS_SERVER ? noop : typeof window !== "undefined" ? "requestIdleCallback" in window ? window.requestIdleCallback : (cb) => window.setTimeout(cb, 1) : noop;
function waitIdlePeriod(callback, options) {
  if (IS_SERVER) return Promise.resolve();
  return new Promise((resolve) => {
    requestIdleCallback((deadline) => {
      callback?.(deadline);
      resolve();
    }, options);
  });
}
function useSignalRecord($state) {
  const [, scheduleReactUpdate] = react__WEBPACK_IMPORTED_MODULE_0__.useState(), tracking = react__WEBPACK_IMPORTED_MODULE_0__.useRef(null);
  if (tracking.current == null) {
    tracking.current = {
      state: {},
      $update: signal({}),
      props: /* @__PURE__ */ new Set()
    };
  }
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    let { state, $update, props } = tracking.current;
    return effect(() => {
      for (const prop2 of props) {
        const value = $state[prop2]();
        state[prop2] = isArray(value) ? [...value] : value;
      }
      $update();
      scheduleReactUpdate({});
    });
  }, [$state]);
  return react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => {
    let { state, $update, props } = tracking.current, scheduledUpdate = false;
    props.clear();
    return new Proxy(state, {
      get(_, prop2) {
        if (!props.has(prop2) && prop2 in $state) {
          props.add(prop2);
          const value = $state[prop2]();
          state[prop2] = isArray(value) ? [...value] : value;
          if (!scheduledUpdate) {
            $update.set({});
            scheduledUpdate = true;
            queueMicrotask(() => scheduledUpdate = false);
          }
        }
        return state[prop2];
      },
      set(_, prop2, newValue) {
        if (!(prop2 in $state)) state[prop2] = newValue;
        return true;
      }
    });
  }, [$state]);
}
function createReactComponent(Component2, options) {
  if (IS_SERVER) {
    return createServerComponent(Component2, {
      props: new Set(Object.keys(Component2.props || {}))
    });
  } else {
    return createClientComponent(Component2, {
      props: new Set(Object.keys(Component2.props || {})),
      events: new Set(options?.events),
      eventsRE: options?.eventsRegex,
      domEvents: options?.domEvents,
      domEventsRE: options?.domEventsRegex
    });
  }
}

var key = {
  fullscreenEnabled: 0,
  fullscreenElement: 1,
  requestFullscreen: 2,
  exitFullscreen: 3,
  fullscreenchange: 4,
  fullscreenerror: 5,
  fullscreen: 6
};
var webkit = [
  "webkitFullscreenEnabled",
  "webkitFullscreenElement",
  "webkitRequestFullscreen",
  "webkitExitFullscreen",
  "webkitfullscreenchange",
  "webkitfullscreenerror",
  "-webkit-full-screen"
];
var moz = [
  "mozFullScreenEnabled",
  "mozFullScreenElement",
  "mozRequestFullScreen",
  "mozCancelFullScreen",
  "mozfullscreenchange",
  "mozfullscreenerror",
  "-moz-full-screen"
];
var ms = [
  "msFullscreenEnabled",
  "msFullscreenElement",
  "msRequestFullscreen",
  "msExitFullscreen",
  "MSFullscreenChange",
  "MSFullscreenError",
  "-ms-fullscreen"
];
var document$1 = typeof window !== "undefined" && typeof window.document !== "undefined" ? window.document : {};
var vendor = "fullscreenEnabled" in document$1 && Object.keys(key) || webkit[0] in document$1 && webkit || moz[0] in document$1 && moz || ms[0] in document$1 && ms || [];
var fscreen = {
  requestFullscreen: function(element) {
    return element[vendor[key.requestFullscreen]]();
  },
  requestFullscreenFunction: function(element) {
    return element[vendor[key.requestFullscreen]];
  },
  get exitFullscreen() {
    return document$1[vendor[key.exitFullscreen]].bind(document$1);
  },
  get fullscreenPseudoClass() {
    return ":" + vendor[key.fullscreen];
  },
  addEventListener: function(type, handler, options) {
    return document$1.addEventListener(vendor[key[type]], handler, options);
  },
  removeEventListener: function(type, handler, options) {
    return document$1.removeEventListener(vendor[key[type]], handler, options);
  },
  get fullscreenEnabled() {
    return Boolean(document$1[vendor[key.fullscreenEnabled]]);
  },
  set fullscreenEnabled(val) {
  },
  get fullscreenElement() {
    return document$1[vendor[key.fullscreenElement]];
  },
  set fullscreenElement(val) {
  },
  get onfullscreenchange() {
    return document$1[("on" + vendor[key.fullscreenchange]).toLowerCase()];
  },
  set onfullscreenchange(handler) {
    return document$1[("on" + vendor[key.fullscreenchange]).toLowerCase()] = handler;
  },
  get onfullscreenerror() {
    return document$1[("on" + vendor[key.fullscreenerror]).toLowerCase()];
  },
  set onfullscreenerror(handler) {
    return document$1[("on" + vendor[key.fullscreenerror]).toLowerCase()] = handler;
  }
};

var functionThrottle = throttle;

function throttle(fn, interval, options) {
  var timeoutId = null;
  var throttledFn = null;
  var leading = (options && options.leading);
  var trailing = (options && options.trailing);

  if (leading == null) {
    leading = true; // default
  }

  if (trailing == null) {
    trailing = !leading; //default
  }

  if (leading == true) {
    trailing = false; // forced because there should be invocation per call
  }

  var cancel = function() {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  var flush = function() {
    var call = throttledFn;
    cancel();

    if (call) {
      call();
    }
  };

  var throttleWrapper = function() {
    var callNow = leading && !timeoutId;
    var context = this;
    var args = arguments;

    throttledFn = function() {
      return fn.apply(context, args);
    };

    if (!timeoutId) {
      timeoutId = setTimeout(function() {
        timeoutId = null;

        if (trailing) {
          return throttledFn();
        }
      }, interval);
    }

    if (callNow) {
      callNow = false;
      return throttledFn();
    }
  };

  throttleWrapper.cancel = cancel;
  throttleWrapper.flush = flush;

  return throttleWrapper;
}

var functionDebounce = debounce;

function debounce(fn, wait, callFirst) {
  var timeout = null;
  var debouncedFn = null;

  var clear = function() {
    if (timeout) {
      clearTimeout(timeout);

      debouncedFn = null;
      timeout = null;
    }
  };

  var flush = function() {
    var call = debouncedFn;
    clear();

    if (call) {
      call();
    }
  };

  var debounceWrapper = function() {
    if (!wait) {
      return fn.apply(this, arguments);
    }

    var context = this;
    var args = arguments;
    var callNow = callFirst && !timeout;
    clear();

    debouncedFn = function() {
      fn.apply(context, args);
    };

    timeout = setTimeout(function() {
      timeout = null;

      if (!callNow) {
        var call = debouncedFn;
        debouncedFn = null;

        return call();
      }
    }, wait);

    if (callNow) {
      return debouncedFn();
    }
  };

  debounceWrapper.cancel = clear;
  debounceWrapper.flush = flush;

  return debounceWrapper;
}

const t = (t2) => "object" == typeof t2 && null != t2 && 1 === t2.nodeType, e = (t2, e2) => (!e2 || "hidden" !== t2) && ("visible" !== t2 && "clip" !== t2), n = (t2, n2) => {
  if (t2.clientHeight < t2.scrollHeight || t2.clientWidth < t2.scrollWidth) {
    const o2 = getComputedStyle(t2, null);
    return e(o2.overflowY, n2) || e(o2.overflowX, n2) || ((t3) => {
      const e2 = ((t4) => {
        if (!t4.ownerDocument || !t4.ownerDocument.defaultView) return null;
        try {
          return t4.ownerDocument.defaultView.frameElement;
        } catch (t5) {
          return null;
        }
      })(t3);
      return !!e2 && (e2.clientHeight < t3.scrollHeight || e2.clientWidth < t3.scrollWidth);
    })(t2);
  }
  return false;
}, o = (t2, e2, n2, o2, l2, r2, i, s) => r2 < t2 && i > e2 || r2 > t2 && i < e2 ? 0 : r2 <= t2 && s <= n2 || i >= e2 && s >= n2 ? r2 - t2 - o2 : i > e2 && s < n2 || r2 < t2 && s > n2 ? i - e2 + l2 : 0, l = (t2) => {
  const e2 = t2.parentElement;
  return null == e2 ? t2.getRootNode().host || null : e2;
}, r = (e2, r2) => {
  var i, s, d, h;
  if ("undefined" == typeof document) return [];
  const { scrollMode: c, block: f, inline: u, boundary: a, skipOverflowHiddenElements: g } = r2, p = "function" == typeof a ? a : (t2) => t2 !== a;
  if (!t(e2)) throw new TypeError("Invalid target");
  const m = document.scrollingElement || document.documentElement, w = [];
  let W = e2;
  for (; t(W) && p(W); ) {
    if (W = l(W), W === m) {
      w.push(W);
      break;
    }
    null != W && W === document.body && n(W) && !n(document.documentElement) || null != W && n(W, g) && w.push(W);
  }
  const b = null != (s = null == (i = window.visualViewport) ? void 0 : i.width) ? s : innerWidth, H = null != (h = null == (d = window.visualViewport) ? void 0 : d.height) ? h : innerHeight, { scrollX: y, scrollY: M } = window, { height: v, width: E, top: x, right: C, bottom: I, left: R } = e2.getBoundingClientRect(), { top: T, right: B, bottom: F, left: V } = ((t2) => {
    const e3 = window.getComputedStyle(t2);
    return { top: parseFloat(e3.scrollMarginTop) || 0, right: parseFloat(e3.scrollMarginRight) || 0, bottom: parseFloat(e3.scrollMarginBottom) || 0, left: parseFloat(e3.scrollMarginLeft) || 0 };
  })(e2);
  let k = "start" === f || "nearest" === f ? x - T : "end" === f ? I + F : x + v / 2 - T + F, D = "center" === u ? R + E / 2 - V + B : "end" === u ? C + B : R - V;
  const L = [];
  for (let t2 = 0; t2 < w.length; t2++) {
    const e3 = w[t2], { height: l2, width: r3, top: i2, right: s2, bottom: d2, left: h2 } = e3.getBoundingClientRect();
    if ("if-needed" === c && x >= 0 && R >= 0 && I <= H && C <= b && (e3 === m && !n(e3) || x >= i2 && I <= d2 && R >= h2 && C <= s2)) return L;
    const a2 = getComputedStyle(e3), g2 = parseInt(a2.borderLeftWidth, 10), p2 = parseInt(a2.borderTopWidth, 10), W2 = parseInt(a2.borderRightWidth, 10), T2 = parseInt(a2.borderBottomWidth, 10);
    let B2 = 0, F2 = 0;
    const V2 = "offsetWidth" in e3 ? e3.offsetWidth - e3.clientWidth - g2 - W2 : 0, S = "offsetHeight" in e3 ? e3.offsetHeight - e3.clientHeight - p2 - T2 : 0, X = "offsetWidth" in e3 ? 0 === e3.offsetWidth ? 0 : r3 / e3.offsetWidth : 0, Y = "offsetHeight" in e3 ? 0 === e3.offsetHeight ? 0 : l2 / e3.offsetHeight : 0;
    if (m === e3) B2 = "start" === f ? k : "end" === f ? k - H : "nearest" === f ? o(M, M + H, H, p2, T2, M + k, M + k + v, v) : k - H / 2, F2 = "start" === u ? D : "center" === u ? D - b / 2 : "end" === u ? D - b : o(y, y + b, b, g2, W2, y + D, y + D + E, E), B2 = Math.max(0, B2 + M), F2 = Math.max(0, F2 + y);
    else {
      B2 = "start" === f ? k - i2 - p2 : "end" === f ? k - d2 + T2 + S : "nearest" === f ? o(i2, d2, l2, p2, T2 + S, k, k + v, v) : k - (i2 + l2 / 2) + S / 2, F2 = "start" === u ? D - h2 - g2 : "center" === u ? D - (h2 + r3 / 2) + V2 / 2 : "end" === u ? D - s2 + W2 + V2 : o(h2, s2, r3, g2, W2 + V2, D, D + E, E);
      const { scrollLeft: t3, scrollTop: n2 } = e3;
      B2 = 0 === Y ? 0 : Math.max(0, Math.min(n2 + B2 / Y, e3.scrollHeight - l2 / Y + S)), F2 = 0 === X ? 0 : Math.max(0, Math.min(t3 + F2 / X, e3.scrollWidth - r3 / X + V2)), k += n2 - B2, D += t3 - F2;
    }
    L.push({ el: e3, top: B2, left: F2 });
  }
  return L;
};

var Icon$0 = `<path fill-rule="evenodd" clip-rule="evenodd" d="M15.0007 28.7923C15.0007 29.0152 14.9774 29.096 14.9339 29.1775C14.8903 29.259 14.8263 29.323 14.7449 29.3665C14.6634 29.4101 14.5826 29.4333 14.3597 29.4333H12.575C12.3521 29.4333 12.2713 29.4101 12.1898 29.3665C12.1083 29.323 12.0443 29.259 12.0008 29.1775C11.9572 29.096 11.934 29.0152 11.934 28.7923V12.2993L5.97496 12.3C5.75208 12.3 5.67125 12.2768 5.58977 12.2332C5.50829 12.1896 5.44434 12.1257 5.40077 12.0442C5.35719 11.9627 5.33398 11.8819 5.33398 11.659V9.87429C5.33398 9.65141 5.35719 9.57059 5.40077 9.48911C5.44434 9.40762 5.50829 9.34368 5.58977 9.3001C5.67125 9.25652 5.75208 9.23332 5.97496 9.23332H26.0263C26.2492 9.23332 26.33 9.25652 26.4115 9.3001C26.493 9.34368 26.557 9.40762 26.6005 9.48911C26.6441 9.57059 26.6673 9.65141 26.6673 9.87429V11.659C26.6673 11.8819 26.6441 11.9627 26.6005 12.0442C26.557 12.1257 26.493 12.1896 26.4115 12.2332C26.33 12.2768 26.2492 12.3 26.0263 12.3L20.067 12.2993L20.0673 28.7923C20.0673 29.0152 20.0441 29.096 20.0005 29.1775C19.957 29.259 19.893 29.323 19.8115 29.3665C19.73 29.4101 19.6492 29.4333 19.4263 29.4333H17.6416C17.4187 29.4333 17.3379 29.4101 17.2564 29.3665C17.175 29.323 17.111 29.259 17.0674 29.1775C17.0239 29.096 17.0007 29.0152 17.0007 28.7923L17 22.7663H15L15.0007 28.7923Z" fill="currentColor"/> <path d="M16.0007 7.89998C17.4734 7.89998 18.6673 6.70608 18.6673 5.23332C18.6673 3.76056 17.4734 2.56665 16.0007 2.56665C14.5279 2.56665 13.334 3.76056 13.334 5.23332C13.334 6.70608 14.5279 7.89998 16.0007 7.89998Z" fill="currentColor"/>`;

var Icon$5 = `<path d="M5.33334 6.00001C5.33334 5.63182 5.63181 5.33334 6 5.33334H26C26.3682 5.33334 26.6667 5.63182 26.6667 6.00001V20.6667C26.6667 21.0349 26.3682 21.3333 26 21.3333H23.7072C23.4956 21.3333 23.2966 21.233 23.171 21.0628L22.1859 19.7295C21.8607 19.2894 22.1749 18.6667 22.7221 18.6667H23.3333C23.7015 18.6667 24 18.3682 24 18V8.66668C24 8.29849 23.7015 8.00001 23.3333 8.00001H8.66667C8.29848 8.00001 8 8.29849 8 8.66668V18C8 18.3682 8.29848 18.6667 8.66667 18.6667H9.29357C9.84072 18.6667 10.1549 19.2894 9.82976 19.7295L8.84467 21.0628C8.71898 21.233 8.52 21.3333 8.30848 21.3333H6C5.63181 21.3333 5.33334 21.0349 5.33334 20.6667V6.00001Z" fill="currentColor"/> <path d="M8.78528 25.6038C8.46013 26.0439 8.77431 26.6667 9.32147 26.6667L22.6785 26.6667C23.2256 26.6667 23.5398 26.0439 23.2146 25.6038L16.5358 16.5653C16.2693 16.2046 15.73 16.2047 15.4635 16.5653L8.78528 25.6038Z" fill="currentColor"/>`;

var Icon$8 = `<path d="M17.4853 18.9093C17.4853 19.0281 17.6289 19.0875 17.7129 19.0035L22.4185 14.2979C22.6788 14.0376 23.1009 14.0376 23.3613 14.2979L24.7755 15.7122C25.0359 15.9725 25.0359 16.3946 24.7755 16.655L16.2902 25.1403C16.0299 25.4006 15.6078 25.4006 15.3474 25.1403L13.9332 23.726L13.9319 23.7247L6.86189 16.6547C6.60154 16.3944 6.60154 15.9723 6.86189 15.7119L8.2761 14.2977C8.53645 14.0373 8.95856 14.0373 9.21891 14.2977L13.9243 19.0031C14.0083 19.0871 14.1519 19.0276 14.1519 18.9088L14.1519 6.00004C14.1519 5.63185 14.4504 5.33337 14.8186 5.33337L16.8186 5.33337C17.1868 5.33337 17.4853 5.63185 17.4853 6.00004L17.4853 18.9093Z" fill="currentColor"/>`;

var Icon$11 = `<path d="M13.0908 14.3334C12.972 14.3334 12.9125 14.1898 12.9965 14.1058L17.7021 9.40022C17.9625 9.13987 17.9625 8.71776 17.7021 8.45741L16.2879 7.04319C16.0275 6.78284 15.6054 6.78284 15.3451 7.04319L6.8598 15.5285C6.59945 15.7888 6.59945 16.2109 6.8598 16.4713L8.27401 17.8855L8.27536 17.8868L15.3453 24.9568C15.6057 25.2172 16.0278 25.2172 16.2881 24.9568L17.7024 23.5426C17.9627 23.2822 17.9627 22.8601 17.7024 22.5998L12.9969 17.8944C12.9129 17.8104 12.9724 17.6668 13.0912 17.6668L26 17.6668C26.3682 17.6668 26.6667 17.3683 26.6667 17.0001V15.0001C26.6667 14.6319 26.3682 14.3334 26 14.3334L13.0908 14.3334Z" fill="currentColor"/>`;

var Icon$13 = `<path d="M14.1521 13.0929C14.1521 12.9741 14.0085 12.9147 13.9245 12.9987L9.21891 17.7043C8.95856 17.9646 8.53645 17.9646 8.2761 17.7043L6.86189 16.29C6.60154 16.0297 6.60154 15.6076 6.86189 15.3472L15.3472 6.86195C15.6075 6.6016 16.0296 6.6016 16.29 6.86195L17.7042 8.27616L17.7055 8.27751L24.7755 15.3475C25.0359 15.6078 25.0359 16.0299 24.7755 16.2903L23.3613 17.7045C23.1009 17.9649 22.6788 17.9649 22.4185 17.7045L17.7131 12.9991C17.6291 12.9151 17.4855 12.9746 17.4855 13.0934V26.0022C17.4855 26.3704 17.187 26.6688 16.8188 26.6688H14.8188C14.4506 26.6688 14.1521 26.3704 14.1521 26.0022L14.1521 13.0929Z" fill="currentColor"/>`;

var Icon$16 = `<path d="M16.6927 25.3346C16.3245 25.3346 16.026 25.0361 16.026 24.6679L16.026 7.3346C16.026 6.96641 16.3245 6.66794 16.6927 6.66794L18.6927 6.66794C19.0609 6.66794 19.3594 6.96642 19.3594 7.3346L19.3594 24.6679C19.3594 25.0361 19.0609 25.3346 18.6927 25.3346H16.6927Z" fill="currentColor"/> <path d="M24.026 25.3346C23.6578 25.3346 23.3594 25.0361 23.3594 24.6679L23.3594 7.3346C23.3594 6.96641 23.6578 6.66794 24.026 6.66794L26.026 6.66794C26.3942 6.66794 26.6927 6.96642 26.6927 7.3346V24.6679C26.6927 25.0361 26.3942 25.3346 26.026 25.3346H24.026Z" fill="currentColor"/> <path d="M5.48113 23.9407C5.38584 24.2963 5.59689 24.6619 5.95254 24.7572L7.88439 25.2748C8.24003 25.3701 8.60559 25.159 8.70089 24.8034L13.1871 8.06067C13.2824 7.70503 13.0713 7.33947 12.7157 7.24417L10.7838 6.72654C10.4282 6.63124 10.0626 6.8423 9.96733 7.19794L5.48113 23.9407Z" fill="currentColor"/>`;

var Icon$19 = `<path fill-rule="evenodd" clip-rule="evenodd" d="M24.9266 7.57992C25.015 7.60672 25.0886 7.64746 25.2462 7.80506L26.956 9.51488C27.1136 9.67248 27.1543 9.74604 27.1811 9.83447C27.2079 9.9229 27.2079 10.0133 27.1811 10.1018C27.1543 10.1902 27.1136 10.2638 26.956 10.4214L13.1822 24.1951C13.0246 24.3527 12.951 24.3935 12.8626 24.4203C12.797 24.4402 12.7304 24.4453 12.6642 24.4357L12.7319 24.4203C12.6435 24.4471 12.553 24.4471 12.4646 24.4203C12.3762 24.3935 12.3026 24.3527 12.145 24.1951L5.04407 17.0942C4.88647 16.9366 4.84573 16.863 4.81893 16.7746C4.79213 16.6862 4.79213 16.5957 4.81893 16.5073C4.84573 16.4189 4.88647 16.3453 5.04407 16.1877L6.7539 14.4779C6.9115 14.3203 6.98506 14.2796 7.07349 14.2528C7.16191 14.226 7.25235 14.226 7.34078 14.2528C7.42921 14.2796 7.50277 14.3203 7.66037 14.4779L12.6628 19.4808L24.3397 7.80506C24.4973 7.64746 24.5709 7.60672 24.6593 7.57992C24.7477 7.55311 24.8382 7.55311 24.9266 7.57992Z" fill="currentColor"/>`;

var Icon$22 = `<path d="M17.947 16.095C17.999 16.043 17.999 15.9585 17.947 15.9065L11.6295 9.58899C11.3691 9.32864 11.3691 8.90653 11.6295 8.64618L13.2323 7.04341C13.4926 6.78306 13.9147 6.78306 14.1751 7.04341L21.0289 13.8973C21.0392 13.9064 21.0493 13.9158 21.0591 13.9257L22.6619 15.5285C22.9223 15.7888 22.9223 16.2109 22.6619 16.4713L14.1766 24.9565C13.9163 25.2169 13.4942 25.2169 13.2338 24.9565L11.631 23.3538C11.3707 23.0934 11.3707 22.6713 11.631 22.411L17.947 16.095Z" fill="currentColor"/>`;

var Icon$24 = `<path fill-rule="evenodd" clip-rule="evenodd" d="M6 7C5.63181 7 5.33333 7.29848 5.33333 7.66667V14.8667C5.33333 14.9403 5.39361 14.9999 5.46724 15.0009C10.8844 15.0719 15.2614 19.449 15.3325 24.8661C15.3334 24.9397 15.393 25 15.4667 25H26C26.3682 25 26.6667 24.7015 26.6667 24.3333V7.66667C26.6667 7.29848 26.3682 7 26 7H6ZM17.0119 22.2294C17.0263 22.29 17.0802 22.3333 17.1425 22.3333H23.3333C23.7015 22.3333 24 22.0349 24 21.6667V10.3333C24 9.96514 23.7015 9.66667 23.3333 9.66667H8.66667C8.29848 9.66667 8 9.96514 8 10.3333V13.1909C8 13.2531 8.04332 13.3071 8.10392 13.3214C12.5063 14.3618 15.9715 17.827 17.0119 22.2294Z" fill="currentColor"/> <path d="M13.2 25C13.2736 25 13.3334 24.9398 13.3322 24.8661C13.2615 20.5544 9.77889 17.0718 5.46718 17.0011C5.39356 16.9999 5.33333 17.0597 5.33333 17.1333V18.8667C5.33333 18.9403 5.39348 18.9999 5.4671 19.0015C8.67465 19.0716 11.2617 21.6587 11.3319 24.8662C11.3335 24.9399 11.393 25 11.4667 25H13.2Z" fill="currentColor"/> <path d="M5.33333 21.1333C5.33333 21.0597 5.39332 20.9998 5.46692 21.0022C7.57033 21.0712 9.26217 22.763 9.33114 24.8664C9.33356 24.94 9.27364 25 9.2 25H6C5.63181 25 5.33333 24.7015 5.33333 24.3333V21.1333Z" fill="currentColor"/>`;

var chromecast = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: Icon$24
});

var Icon$26 = `<path d="M8 28.0003C8 27.6321 8.29848 27.3336 8.66667 27.3336H23.3333C23.7015 27.3336 24 27.6321 24 28.0003V29.3336C24 29.7018 23.7015 30.0003 23.3333 30.0003H8.66667C8.29848 30.0003 8 29.7018 8 29.3336V28.0003Z" fill="currentColor"/> <path fill-rule="evenodd" clip-rule="evenodd" d="M4.66602 6.66699C4.29783 6.66699 3.99935 6.96547 3.99935 7.33366V24.667C3.99935 25.0352 4.29783 25.3337 4.66602 25.3337H27.3327C27.7009 25.3337 27.9994 25.0352 27.9994 24.667V7.33366C27.9994 6.96547 27.7009 6.66699 27.3327 6.66699H4.66602ZM8.66659 21.3333C8.2984 21.3333 7.99992 21.0349 7.99992 20.6667V11.3333C7.99992 10.9651 8.2984 10.6667 8.66659 10.6667H13.9999C14.3681 10.6667 14.6666 10.9651 14.6666 11.3333V12.6667C14.6666 13.0349 14.3681 13.3333 13.9999 13.3333H10.7999C10.7263 13.3333 10.6666 13.393 10.6666 13.4667V18.5333C10.6666 18.607 10.7263 18.6667 10.7999 18.6667H13.9999C14.3681 18.6667 14.6666 18.9651 14.6666 19.3333V20.6667C14.6666 21.0349 14.3681 21.3333 13.9999 21.3333H8.66659ZM17.9999 21.3333C17.6317 21.3333 17.3333 21.0349 17.3333 20.6667V11.3333C17.3333 10.9651 17.6317 10.6667 17.9999 10.6667H23.3333C23.7014 10.6667 23.9999 10.9651 23.9999 11.3333V12.6667C23.9999 13.0349 23.7014 13.3333 23.3333 13.3333H20.1333C20.0596 13.3333 19.9999 13.393 19.9999 13.4667V18.5333C19.9999 18.607 20.0596 18.6667 20.1333 18.6667H23.3333C23.7014 18.6667 23.9999 18.9651 23.9999 19.3333V20.6667C23.9999 21.0349 23.7014 21.3333 23.3333 21.3333H17.9999Z" fill="currentColor"/>`;

var Icon$27 = `<path fill-rule="evenodd" clip-rule="evenodd" d="M4.6661 6.66699C4.29791 6.66699 3.99943 6.96547 3.99943 7.33366V24.667C3.99943 25.0352 4.29791 25.3337 4.6661 25.3337H27.3328C27.701 25.3337 27.9994 25.0352 27.9994 24.667V7.33366C27.9994 6.96547 27.701 6.66699 27.3328 6.66699H4.6661ZM8.66667 21.3333C8.29848 21.3333 8 21.0349 8 20.6667V11.3333C8 10.9651 8.29848 10.6667 8.66667 10.6667H14C14.3682 10.6667 14.6667 10.9651 14.6667 11.3333V12.6667C14.6667 13.0349 14.3682 13.3333 14 13.3333H10.8C10.7264 13.3333 10.6667 13.393 10.6667 13.4667V18.5333C10.6667 18.607 10.7264 18.6667 10.8 18.6667H14C14.3682 18.6667 14.6667 18.9651 14.6667 19.3333V20.6667C14.6667 21.0349 14.3682 21.3333 14 21.3333H8.66667ZM18 21.3333C17.6318 21.3333 17.3333 21.0349 17.3333 20.6667V11.3333C17.3333 10.9651 17.6318 10.6667 18 10.6667H23.3333C23.7015 10.6667 24 10.9651 24 11.3333V12.6667C24 13.0349 23.7015 13.3333 23.3333 13.3333H20.1333C20.0597 13.3333 20 13.393 20 13.4667V18.5333C20 18.607 20.0597 18.6667 20.1333 18.6667H23.3333C23.7015 18.6667 24 18.9651 24 19.3333V20.6667C24 21.0349 23.7015 21.3333 23.3333 21.3333H18Z" fill="currentColor"/>`;

var Icon$31 = `<path d="M14.2225 13.7867C14.3065 13.8706 14.4501 13.8112 14.4501 13.6924V5.99955C14.4501 5.63136 14.7486 5.33289 15.1167 5.33289H16.8501C17.2183 5.33289 17.5167 5.63136 17.5167 5.99955V13.6916C17.5167 13.8104 17.6604 13.8699 17.7444 13.7859L19.9433 11.5869C20.2037 11.3266 20.6258 11.3266 20.8861 11.5869L22.1118 12.8126C22.3722 13.0729 22.3722 13.4951 22.1118 13.7554L16.4549 19.4123C16.1946 19.6726 15.772 19.6731 15.5116 19.4128L9.85479 13.7559C9.59444 13.4956 9.59444 13.0734 9.85479 12.8131L11.0804 11.5874C11.3408 11.3271 11.7629 11.3271 12.0233 11.5874L14.2225 13.7867Z" fill="currentColor"/> <path d="M5.99998 20.267C5.63179 20.267 5.33331 20.5654 5.33331 20.9336V25.9997C5.33331 26.3678 5.63179 26.6663 5.99998 26.6663H26C26.3682 26.6663 26.6666 26.3678 26.6666 25.9997V20.9336C26.6666 20.5654 26.3682 20.267 26 20.267H24.2666C23.8985 20.267 23.6 20.5654 23.6 20.9336V22.9333C23.6 23.3014 23.3015 23.5999 22.9333 23.5999H9.06638C8.69819 23.5999 8.39972 23.3014 8.39972 22.9333V20.9336C8.39972 20.5654 8.10124 20.267 7.73305 20.267H5.99998Z" fill="currentColor"/>`;

var Icon$33 = `<path d="M16 20C18.2091 20 20 18.2092 20 16C20 13.7909 18.2091 12 16 12C13.7909 12 12 13.7909 12 16C12 18.2092 13.7909 20 16 20Z" fill="currentColor"/> <path fill-rule="evenodd" clip-rule="evenodd" d="M28 16.0058C28 18.671 23.5 25.3334 16 25.3334C8.5 25.3334 4 18.6762 4 16.0058C4 13.3354 8.50447 6.66669 16 6.66669C23.4955 6.66669 28 13.3406 28 16.0058ZM25.3318 15.9934C25.3328 16.0017 25.3328 16.0099 25.3318 16.0182C25.3274 16.0571 25.3108 16.1728 25.2485 16.3708C25.1691 16.6229 25.0352 16.9462 24.8327 17.3216C24.4264 18.0749 23.7969 18.9398 22.9567 19.754C21.2791 21.3798 18.9148 22.6667 16 22.6667C13.0845 22.6667 10.7202 21.3805 9.04298 19.7557C8.20295 18.9419 7.57362 18.0773 7.16745 17.3241C6.96499 16.9486 6.83114 16.6252 6.75172 16.3729C6.67942 16.1431 6.66856 16.0243 6.66695 16.0066L6.66695 16.005C6.66859 15.9871 6.67951 15.8682 6.75188 15.6383C6.83145 15.3854 6.96554 15.0614 7.16831 14.6853C7.57507 13.9306 8.20514 13.0644 9.04577 12.249C10.7245 10.6208 13.0886 9.33335 16 9.33335C18.9108 9.33335 21.2748 10.6215 22.9539 12.2507C23.7947 13.0664 24.4249 13.933 24.8318 14.6877C25.0346 15.0639 25.1688 15.3878 25.2483 15.6404C25.3107 15.8386 25.3274 15.9545 25.3318 15.9934Z" fill="currentColor"/>`;

var Icon$34 = `<path d="M15.8747 8.11857C16.3148 7.79342 16.9375 8.10759 16.9375 8.65476V14.2575C16.9375 14.3669 17.0621 14.4297 17.1501 14.3647L25.6038 8.11857C26.0439 7.79342 26.6667 8.10759 26.6667 8.65476V23.3451C26.6667 23.8923 26.0439 24.2064 25.6038 23.8813L17.1501 17.6346C17.0621 17.5695 16.9375 17.6324 16.9375 17.7418L16.9375 23.3451C16.9375 23.8923 16.3147 24.2064 15.8747 23.8813L5.93387 16.5358C5.57322 16.2693 5.57323 15.7299 5.93389 15.4634L15.8747 8.11857Z" fill="currentColor"/>`;

var Icon$35 = `<path d="M16.1253 8.11866C15.6852 7.7935 15.0625 8.10768 15.0625 8.65484V14.2576C15.0625 14.367 14.9379 14.4298 14.8499 14.3648L6.39615 8.11866C5.95607 7.7935 5.33331 8.10768 5.33331 8.65484V23.3452C5.33331 23.8923 5.9561 24.2065 6.39617 23.8813L14.8499 17.6347C14.9379 17.5696 15.0625 17.6325 15.0625 17.7419L15.0625 23.3452C15.0625 23.8923 15.6853 24.2065 16.1253 23.8813L26.0661 16.5358C26.4268 16.2694 26.4268 15.73 26.0661 15.4635L16.1253 8.11866Z" fill="currentColor"/>`;

var Icon$39 = `<path d="M19.3334 13.3333C18.9652 13.3333 18.6667 13.0349 18.6667 12.6667L18.6667 7.33333C18.6667 6.96514 18.9652 6.66666 19.3334 6.66666H21.3334C21.7015 6.66666 22 6.96514 22 7.33333V9.86666C22 9.9403 22.0597 10 22.1334 10L24.6667 10C25.0349 10 25.3334 10.2985 25.3334 10.6667V12.6667C25.3334 13.0349 25.0349 13.3333 24.6667 13.3333L19.3334 13.3333Z" fill="currentColor"/> <path d="M13.3334 19.3333C13.3334 18.9651 13.0349 18.6667 12.6667 18.6667H7.33335C6.96516 18.6667 6.66669 18.9651 6.66669 19.3333V21.3333C6.66669 21.7015 6.96516 22 7.33335 22H9.86669C9.94032 22 10 22.0597 10 22.1333L10 24.6667C10 25.0349 10.2985 25.3333 10.6667 25.3333H12.6667C13.0349 25.3333 13.3334 25.0349 13.3334 24.6667L13.3334 19.3333Z" fill="currentColor"/> <path d="M18.6667 24.6667C18.6667 25.0349 18.9652 25.3333 19.3334 25.3333H21.3334C21.7015 25.3333 22 25.0349 22 24.6667V22.1333C22 22.0597 22.0597 22 22.1334 22H24.6667C25.0349 22 25.3334 21.7015 25.3334 21.3333V19.3333C25.3334 18.9651 25.0349 18.6667 24.6667 18.6667L19.3334 18.6667C18.9652 18.6667 18.6667 18.9651 18.6667 19.3333L18.6667 24.6667Z" fill="currentColor"/> <path d="M10.6667 13.3333H12.6667C13.0349 13.3333 13.3334 13.0349 13.3334 12.6667L13.3334 10.6667V7.33333C13.3334 6.96514 13.0349 6.66666 12.6667 6.66666H10.6667C10.2985 6.66666 10 6.96514 10 7.33333L10 9.86666C10 9.9403 9.94033 10 9.86669 10L7.33335 10C6.96516 10 6.66669 10.2985 6.66669 10.6667V12.6667C6.66669 13.0349 6.96516 13.3333 7.33335 13.3333L10.6667 13.3333Z" fill="currentColor"/>`;

var Icon$40 = `<path d="M25.3299 7.26517C25.2958 6.929 25.0119 6.66666 24.6667 6.66666H19.3334C18.9652 6.66666 18.6667 6.96514 18.6667 7.33333V9.33333C18.6667 9.70152 18.9652 10 19.3334 10L21.8667 10C21.9403 10 22 10.0597 22 10.1333V12.6667C22 13.0349 22.2985 13.3333 22.6667 13.3333H24.6667C25.0349 13.3333 25.3334 13.0349 25.3334 12.6667V7.33333C25.3334 7.31032 25.3322 7.28758 25.3299 7.26517Z" fill="currentColor"/> <path d="M22 21.8667C22 21.9403 21.9403 22 21.8667 22L19.3334 22C18.9652 22 18.6667 22.2985 18.6667 22.6667V24.6667C18.6667 25.0349 18.9652 25.3333 19.3334 25.3333L24.6667 25.3333C25.0349 25.3333 25.3334 25.0349 25.3334 24.6667V19.3333C25.3334 18.9651 25.0349 18.6667 24.6667 18.6667H22.6667C22.2985 18.6667 22 18.9651 22 19.3333V21.8667Z" fill="currentColor"/> <path d="M12.6667 22H10.1334C10.0597 22 10 21.9403 10 21.8667V19.3333C10 18.9651 9.70154 18.6667 9.33335 18.6667H7.33335C6.96516 18.6667 6.66669 18.9651 6.66669 19.3333V24.6667C6.66669 25.0349 6.96516 25.3333 7.33335 25.3333H12.6667C13.0349 25.3333 13.3334 25.0349 13.3334 24.6667V22.6667C13.3334 22.2985 13.0349 22 12.6667 22Z" fill="currentColor"/> <path d="M10 12.6667V10.1333C10 10.0597 10.0597 10 10.1334 10L12.6667 10C13.0349 10 13.3334 9.70152 13.3334 9.33333V7.33333C13.3334 6.96514 13.0349 6.66666 12.6667 6.66666H7.33335C6.96516 6.66666 6.66669 6.96514 6.66669 7.33333V12.6667C6.66669 13.0349 6.96516 13.3333 7.33335 13.3333H9.33335C9.70154 13.3333 10 13.0349 10 12.6667Z" fill="currentColor"/>`;

var Icon$53 = `<path fill-rule="evenodd" clip-rule="evenodd" d="M26.6667 5.99998C26.6667 5.63179 26.3682 5.33331 26 5.33331H11.3333C10.9651 5.33331 10.6667 5.63179 10.6667 5.99998V17.5714C10.6667 17.6694 10.5644 17.7342 10.4741 17.6962C9.91823 17.4625 9.30754 17.3333 8.66667 17.3333C6.08934 17.3333 4 19.4226 4 22C4 24.5773 6.08934 26.6666 8.66667 26.6666C11.244 26.6666 13.3333 24.5773 13.3333 22V8.66665C13.3333 8.29846 13.6318 7.99998 14 7.99998L23.3333 7.99998C23.7015 7.99998 24 8.29846 24 8.66665V14.9048C24 15.0027 23.8978 15.0675 23.8075 15.0296C23.2516 14.7958 22.6409 14.6666 22 14.6666C19.4227 14.6666 17.3333 16.756 17.3333 19.3333C17.3333 21.9106 19.4227 24 22 24C24.5773 24 26.6667 21.9106 26.6667 19.3333V5.99998ZM22 21.3333C23.1046 21.3333 24 20.4379 24 19.3333C24 18.2287 23.1046 17.3333 22 17.3333C20.8954 17.3333 20 18.2287 20 19.3333C20 20.4379 20.8954 21.3333 22 21.3333ZM8.66667 24C9.77124 24 10.6667 23.1045 10.6667 22C10.6667 20.8954 9.77124 20 8.66667 20C7.5621 20 6.66667 20.8954 6.66667 22C6.66667 23.1045 7.5621 24 8.66667 24Z" fill="currentColor"/>`;

var Icon$54 = `<path d="M17.5091 24.6594C17.5091 25.2066 16.8864 25.5208 16.4463 25.1956L9.44847 20.0252C9.42553 20.0083 9.39776 19.9991 9.36923 19.9991H4.66667C4.29848 19.9991 4 19.7006 4 19.3325V12.6658C4 12.2976 4.29848 11.9991 4.66667 11.9991H9.37115C9.39967 11.9991 9.42745 11.99 9.45039 11.973L16.4463 6.8036C16.8863 6.47842 17.5091 6.79259 17.5091 7.33977L17.5091 24.6594Z" fill="currentColor"/> <path d="M28.8621 13.6422C29.1225 13.3818 29.1225 12.9597 28.8621 12.6994L27.9193 11.7566C27.659 11.4962 27.2368 11.4962 26.9765 11.7566L24.7134 14.0197C24.6613 14.0717 24.5769 14.0717 24.5248 14.0197L22.262 11.7568C22.0016 11.4964 21.5795 11.4964 21.3191 11.7568L20.3763 12.6996C20.116 12.9599 20.116 13.382 20.3763 13.6424L22.6392 15.9053C22.6913 15.9573 22.6913 16.0418 22.6392 16.0938L20.3768 18.3562C20.1165 18.6166 20.1165 19.0387 20.3768 19.299L21.3196 20.2419C21.58 20.5022 22.0021 20.5022 22.2624 20.2418L24.5248 17.9795C24.5769 17.9274 24.6613 17.9274 24.7134 17.9795L26.976 20.2421C27.2363 20.5024 27.6585 20.5024 27.9188 20.2421L28.8616 19.2992C29.122 19.0389 29.122 18.6168 28.8616 18.3564L26.599 16.0938C26.547 16.0418 26.547 15.9573 26.599 15.9053L28.8621 13.6422Z" fill="currentColor"/>`;

var Icon$56 = `<path d="M26.6009 16.0725C26.6009 16.424 26.4302 17.1125 25.9409 18.0213C25.4676 18.8976 24.7542 19.8715 23.8182 20.7783C21.9489 22.5905 19.2662 24.0667 15.9342 24.0667C12.6009 24.0667 9.91958 22.5915 8.04891 20.78C7.11424 19.8736 6.40091 18.9 5.92758 18.0236C5.43824 17.1149 5.26758 16.4257 5.26758 16.0725C5.26758 15.7193 5.43824 15.0293 5.92891 14.1193C6.40224 13.2416 7.11558 12.2665 8.05158 11.3587C9.92224 9.54398 12.6049 8.06665 15.9342 8.06665C19.2636 8.06665 21.9449 9.54505 23.8169 11.3604C24.7529 12.2687 25.4662 13.2441 25.9396 14.1216C26.4302 15.0317 26.6009 15.7209 26.6009 16.0725Z" stroke="currentColor" stroke-width="3"/> <path d="M15.9336 20.0667C18.1427 20.0667 19.9336 18.2758 19.9336 16.0667C19.9336 13.8575 18.1427 12.0667 15.9336 12.0667C13.7245 12.0667 11.9336 13.8575 11.9336 16.0667C11.9336 18.2758 13.7245 20.0667 15.9336 20.0667Z" fill="currentColor"/> <path fill-rule="evenodd" clip-rule="evenodd" d="M27.2323 25.0624L6.93878 4.76886C6.78118 4.61126 6.70762 4.57052 6.61919 4.54372C6.53077 4.51692 6.44033 4.51691 6.3519 4.54372C6.26347 4.57052 6.18991 4.61126 6.03231 4.76886L4.77032 6.03085C4.61272 6.18845 4.57198 6.26201 4.54518 6.35044C4.51838 6.43887 4.51838 6.5293 4.54518 6.61773C4.57198 6.70616 4.61272 6.77972 4.77032 6.93732L25.0639 27.2308C25.2215 27.3884 25.295 27.4292 25.3834 27.456C25.4719 27.4828 25.5623 27.4828 25.6507 27.456C25.7392 27.4292 25.8127 27.3885 25.9703 27.2309L27.2323 25.9689C27.3899 25.8113 27.4307 25.7377 27.4575 25.6493C27.4843 25.5608 27.4843 25.4704 27.4575 25.382C27.4307 25.2935 27.3899 25.22 27.2323 25.0624Z" fill="currentColor"/>`;

var Icon$59 = `<path d="M8.66667 6.66667C8.29848 6.66667 8 6.96514 8 7.33333V24.6667C8 25.0349 8.29848 25.3333 8.66667 25.3333H12.6667C13.0349 25.3333 13.3333 25.0349 13.3333 24.6667V7.33333C13.3333 6.96514 13.0349 6.66667 12.6667 6.66667H8.66667Z" fill="currentColor"/> <path d="M19.3333 6.66667C18.9651 6.66667 18.6667 6.96514 18.6667 7.33333V24.6667C18.6667 25.0349 18.9651 25.3333 19.3333 25.3333H23.3333C23.7015 25.3333 24 25.0349 24 24.6667V7.33333C24 6.96514 23.7015 6.66667 23.3333 6.66667H19.3333Z" fill="currentColor"/>`;

var Icon$60 = `<path d="M5.33334 26V19.4667C5.33334 19.393 5.39304 19.3333 5.46668 19.3333H7.86668C7.94031 19.3333 8.00001 19.393 8.00001 19.4667V23.3333C8.00001 23.7015 8.29849 24 8.66668 24H23.3333C23.7015 24 24 23.7015 24 23.3333V8.66666C24 8.29847 23.7015 7.99999 23.3333 7.99999H19.4667C19.393 7.99999 19.3333 7.9403 19.3333 7.86666V5.46666C19.3333 5.39302 19.393 5.33333 19.4667 5.33333H26C26.3682 5.33333 26.6667 5.63181 26.6667 5.99999V26C26.6667 26.3682 26.3682 26.6667 26 26.6667H6.00001C5.63182 26.6667 5.33334 26.3682 5.33334 26Z" fill="currentColor"/> <path d="M14.0098 8.42359H10.806C10.6872 8.42359 10.6277 8.56721 10.7117 8.6512L16.5491 14.4886C16.8094 14.7489 16.8094 15.171 16.5491 15.4314L15.3234 16.657C15.0631 16.9174 14.641 16.9174 14.3806 16.657L8.63739 10.9138C8.55339 10.8298 8.40978 10.8893 8.40978 11.0081V14.0236C8.40978 14.3918 8.1113 14.6903 7.74311 14.6903H6.00978C5.64159 14.6903 5.34311 14.3918 5.34311 14.0236L5.34311 6.02359C5.34311 5.6554 5.64159 5.35692 6.00978 5.35692L14.0098 5.35692C14.378 5.35692 14.6764 5.6554 14.6764 6.02359V7.75692C14.6764 8.12511 14.378 8.42359 14.0098 8.42359Z" fill="currentColor"/>`;

var Icon$61 = `<path d="M16 15.3333C15.6318 15.3333 15.3333 15.6318 15.3333 16V20C15.3333 20.3682 15.6318 20.6667 16 20.6667H21.3333C21.7015 20.6667 22 20.3682 22 20V16C22 15.6318 21.7015 15.3333 21.3333 15.3333H16Z" fill="currentColor"/> <path fill-rule="evenodd" clip-rule="evenodd" d="M5.33333 7.33334C5.33333 6.96515 5.63181 6.66667 5.99999 6.66667H26C26.3682 6.66667 26.6667 6.96515 26.6667 7.33334V24.6667C26.6667 25.0349 26.3682 25.3333 26 25.3333H5.99999C5.63181 25.3333 5.33333 25.0349 5.33333 24.6667V7.33334ZM7.99999 10C7.99999 9.63182 8.29847 9.33334 8.66666 9.33334H23.3333C23.7015 9.33334 24 9.63182 24 10V22C24 22.3682 23.7015 22.6667 23.3333 22.6667H8.66666C8.29847 22.6667 7.99999 22.3682 7.99999 22V10Z" fill="currentColor"/>`;

var Icon$62 = `<path d="M10.6667 6.6548C10.6667 6.10764 11.2894 5.79346 11.7295 6.11862L24.377 15.4634C24.7377 15.7298 24.7377 16.2692 24.3771 16.5357L11.7295 25.8813C11.2895 26.2065 10.6667 25.8923 10.6667 25.3451L10.6667 6.6548Z" fill="currentColor"/>`;

var Icon$63 = `<path d="M13.9213 5.53573C14.3146 5.45804 14.6666 5.76987 14.6666 6.17079V7.57215C14.6666 7.89777 14.4305 8.17277 14.114 8.24925C12.5981 8.61559 11.2506 9.41368 10.2091 10.506C9.98474 10.7414 9.62903 10.8079 9.34742 10.6453L8.14112 9.94885C7.79394 9.7484 7.69985 9.28777 7.96359 8.98585C9.48505 7.24409 11.5636 6.00143 13.9213 5.53573Z" fill="currentColor"/> <path d="M5.88974 12.5908C6.01805 12.2101 6.46491 12.0603 6.81279 12.2611L8.01201 12.9535C8.29379 13.1162 8.41396 13.4577 8.32238 13.7699C8.11252 14.4854 7.99998 15.2424 7.99998 16.0257C7.99998 16.809 8.11252 17.566 8.32238 18.2814C8.41396 18.5936 8.29378 18.9352 8.01201 19.0979L6.82742 19.7818C6.48051 19.9821 6.03488 19.8337 5.90521 19.4547C5.5345 18.3712 5.33331 17.2091 5.33331 16C5.33331 14.8078 5.5289 13.6613 5.88974 12.5908Z" fill="currentColor"/> <path d="M8.17106 22.0852C7.82291 22.2862 7.72949 22.7486 7.99532 23.0502C9.51387 24.773 11.5799 26.0017 13.9213 26.4642C14.3146 26.5419 14.6666 26.2301 14.6666 25.8291V24.4792C14.6666 24.1536 14.4305 23.8786 14.114 23.8021C12.5981 23.4358 11.2506 22.6377 10.2091 21.5453C9.98474 21.31 9.62903 21.2435 9.34742 21.4061L8.17106 22.0852Z" fill="currentColor"/> <path d="M17.3333 25.8291C17.3333 26.2301 17.6857 26.5418 18.079 26.4641C22.9748 25.4969 26.6666 21.1796 26.6666 16C26.6666 10.8204 22.9748 6.50302 18.079 5.5358C17.6857 5.4581 17.3333 5.76987 17.3333 6.17079V7.57215C17.3333 7.89777 17.5697 8.17282 17.8862 8.24932C21.3942 9.09721 24 12.2572 24 16.0257C24 19.7942 21.3942 22.9542 17.8862 23.802C17.5697 23.8785 17.3333 24.1536 17.3333 24.4792V25.8291Z" fill="currentColor"/> <path d="M14.3961 10.4163C13.9561 10.0911 13.3333 10.4053 13.3333 10.9525L13.3333 21.0474C13.3333 21.5946 13.9561 21.9087 14.3962 21.5836L21.2273 16.5359C21.5879 16.2694 21.5879 15.73 21.2273 15.4635L14.3961 10.4163Z" fill="currentColor"/>`;

var Icon$74 = `<path d="M15.6038 12.2147C16.0439 12.5399 16.6667 12.2257 16.6667 11.6786V10.1789C16.6667 10.1001 16.7351 10.0384 16.8134 10.0479C20.1116 10.4494 22.6667 13.2593 22.6667 16.6659C22.6667 20.3481 19.6817 23.3332 15.9995 23.3332C12.542 23.3332 9.69927 20.7014 9.36509 17.332C9.32875 16.9655 9.03371 16.6662 8.66548 16.6662L6.66655 16.6666C6.29841 16.6666 5.99769 16.966 6.02187 17.3334C6.36494 22.5454 10.7012 26.6667 16 26.6667C21.5228 26.6667 26 22.1895 26 16.6667C26 11.4103 21.9444 7.10112 16.7916 6.69757C16.7216 6.69209 16.6667 6.63396 16.6667 6.56372V4.98824C16.6667 4.44106 16.0439 4.12689 15.6038 4.45206L11.0765 7.79738C10.7159 8.06387 10.7159 8.60326 11.0766 8.86973L15.6038 12.2147Z" fill="currentColor"/>`;

var Icon$77 = `<path d="M16.6667 10.3452C16.6667 10.8924 16.0439 11.2066 15.6038 10.8814L11.0766 7.5364C10.7159 7.26993 10.7159 6.73054 11.0766 6.46405L15.6038 3.11873C16.0439 2.79356 16.6667 3.10773 16.6667 3.6549V5.22682C16.6667 5.29746 16.7223 5.35579 16.7927 5.36066C22.6821 5.76757 27.3333 10.674 27.3333 16.6667C27.3333 22.9259 22.2592 28 16 28C9.96483 28 5.03145 23.2827 4.68601 17.3341C4.66466 16.9665 4.96518 16.6673 5.33339 16.6673H7.3334C7.70157 16.6673 7.99714 16.9668 8.02743 17.3337C8.36638 21.4399 11.8064 24.6667 16 24.6667C20.4183 24.6667 24 21.085 24 16.6667C24 12.5225 20.8483 9.11428 16.8113 8.70739C16.7337 8.69957 16.6667 8.76096 16.6667 8.83893V10.3452Z" fill="currentColor"/> <path fill-rule="evenodd" clip-rule="evenodd" d="M17.0879 19.679C17.4553 19.9195 17.8928 20.0398 18.4004 20.0398C18.9099 20.0398 19.3474 19.9205 19.7129 19.6818C20.0803 19.4413 20.3635 19.0938 20.5623 18.6392C20.7612 18.1847 20.8606 17.6373 20.8606 16.9972C20.8625 16.3608 20.764 15.8192 20.5652 15.3722C20.3663 14.9252 20.0822 14.5853 19.7129 14.3523C19.3455 14.1175 18.908 14 18.4004 14C17.8928 14 17.4553 14.1175 17.0879 14.3523C16.7224 14.5853 16.4402 14.9252 16.2413 15.3722C16.0443 15.8173 15.9449 16.3589 15.943 16.9972C15.9411 17.6354 16.0396 18.1818 16.2385 18.6364C16.4373 19.089 16.7205 19.4366 17.0879 19.679ZM19.1362 18.4262C18.9487 18.7349 18.7034 18.8892 18.4004 18.8892C18.1996 18.8892 18.0226 18.8211 17.8691 18.6847C17.7157 18.5464 17.5964 18.3372 17.5112 18.0568C17.4279 17.7765 17.3871 17.4233 17.389 16.9972C17.3909 16.3684 17.4847 15.9025 17.6703 15.5995C17.8559 15.2945 18.0993 15.1421 18.4004 15.1421C18.603 15.1421 18.7801 15.2093 18.9316 15.3438C19.0832 15.4782 19.2015 15.6828 19.2868 15.9574C19.372 16.2301 19.4146 16.5767 19.4146 16.9972C19.4165 17.6392 19.3237 18.1156 19.1362 18.4262Z" fill="currentColor"/> <path d="M13.7746 19.8978C13.8482 19.8978 13.9079 19.8381 13.9079 19.7644V14.2129C13.9079 14.1393 13.8482 14.0796 13.7746 14.0796H12.642C12.6171 14.0796 12.5927 14.0865 12.5716 14.0997L11.2322 14.9325C11.1931 14.9568 11.1693 14.9996 11.1693 15.0457V15.9497C11.1693 16.0539 11.2833 16.1178 11.3722 16.0635L12.464 15.396C12.4682 15.3934 12.473 15.3921 12.4779 15.3921C12.4926 15.3921 12.5045 15.404 12.5045 15.4187V19.7644C12.5045 19.8381 12.5642 19.8978 12.6378 19.8978H13.7746Z" fill="currentColor"/>`;

var Icon$81 = `<path d="M15.3333 10.3452C15.3333 10.8924 15.9561 11.2066 16.3962 10.8814L20.9234 7.5364C21.2841 7.26993 21.2841 6.73054 20.9235 6.46405L16.3962 3.11873C15.9561 2.79356 15.3333 3.10773 15.3333 3.6549V5.22682C15.3333 5.29746 15.2778 5.35579 15.2073 5.36066C9.31791 5.76757 4.66667 10.674 4.66667 16.6667C4.66667 22.9259 9.74078 28 16 28C22.0352 28 26.9686 23.2827 27.314 17.3341C27.3354 16.9665 27.0348 16.6673 26.6666 16.6673H24.6666C24.2984 16.6673 24.0029 16.9668 23.9726 17.3337C23.6336 21.4399 20.1937 24.6667 16 24.6667C11.5817 24.6667 8 21.085 8 16.6667C8 12.5225 11.1517 9.11428 15.1887 8.70739C15.2663 8.69957 15.3333 8.76096 15.3333 8.83893V10.3452Z" fill="currentColor"/> <path fill-rule="evenodd" clip-rule="evenodd" d="M17.0879 19.679C17.4553 19.9195 17.8928 20.0398 18.4004 20.0398C18.9099 20.0398 19.3474 19.9205 19.7129 19.6818C20.0803 19.4413 20.3635 19.0938 20.5623 18.6392C20.7612 18.1847 20.8606 17.6373 20.8606 16.9972C20.8625 16.3608 20.764 15.8192 20.5652 15.3722C20.3663 14.9252 20.0822 14.5853 19.7129 14.3523C19.3455 14.1175 18.908 14 18.4004 14C17.8928 14 17.4553 14.1175 17.0879 14.3523C16.7224 14.5853 16.4402 14.9252 16.2413 15.3722C16.0443 15.8173 15.9449 16.3589 15.943 16.9972C15.9411 17.6354 16.0396 18.1818 16.2385 18.6364C16.4373 19.089 16.7205 19.4366 17.0879 19.679ZM19.1362 18.4262C18.9487 18.7349 18.7034 18.8892 18.4004 18.8892C18.1996 18.8892 18.0225 18.8211 17.8691 18.6847C17.7157 18.5464 17.5964 18.3372 17.5112 18.0568C17.4278 17.7765 17.3871 17.4233 17.389 16.9972C17.3909 16.3684 17.4847 15.9025 17.6703 15.5995C17.8559 15.2945 18.0992 15.1421 18.4004 15.1421C18.603 15.1421 18.7801 15.2093 18.9316 15.3438C19.0831 15.4782 19.2015 15.6828 19.2867 15.9574C19.372 16.2301 19.4146 16.5767 19.4146 16.9972C19.4165 17.6392 19.3237 18.1156 19.1362 18.4262Z" fill="currentColor"/> <path d="M13.7746 19.8978C13.8482 19.8978 13.9079 19.8381 13.9079 19.7644V14.2129C13.9079 14.1393 13.8482 14.0796 13.7746 14.0796H12.642C12.6171 14.0796 12.5927 14.0865 12.5716 14.0997L11.2322 14.9325C11.1931 14.9568 11.1693 14.9996 11.1693 15.0457V15.9497C11.1693 16.0539 11.2833 16.1178 11.3722 16.0635L12.464 15.396C12.4682 15.3934 12.473 15.3921 12.4779 15.3921C12.4926 15.3921 12.5045 15.404 12.5045 15.4187V19.7644C12.5045 19.8381 12.5642 19.8978 12.6378 19.8978H13.7746Z" fill="currentColor"/>`;

var Icon$88 = `<path fill-rule="evenodd" clip-rule="evenodd" d="M13.5722 5.33333C13.2429 5.33333 12.9629 5.57382 12.9132 5.89938L12.4063 9.21916C12.4 9.26058 12.3746 9.29655 12.3378 9.31672C12.2387 9.37118 12.1409 9.42779 12.0444 9.48648C12.0086 9.5083 11.9646 9.51242 11.9255 9.49718L8.79572 8.27692C8.48896 8.15732 8.14083 8.27958 7.9762 8.56472L5.5491 12.7686C5.38444 13.0538 5.45271 13.4165 5.70981 13.6223L8.33308 15.7225C8.3658 15.7487 8.38422 15.7887 8.38331 15.8306C8.38209 15.8867 8.38148 15.9429 8.38148 15.9993C8.38148 16.0558 8.3821 16.1121 8.38332 16.1684C8.38423 16.2102 8.36582 16.2503 8.33313 16.2765L5.7103 18.3778C5.45334 18.5836 5.38515 18.9462 5.54978 19.2314L7.97688 23.4352C8.14155 23.7205 8.48981 23.8427 8.79661 23.723L11.926 22.5016C11.9651 22.4864 12.009 22.4905 12.0449 22.5123C12.1412 22.5709 12.2388 22.6274 12.3378 22.6818C12.3745 22.7019 12.4 22.7379 12.4063 22.7793L12.9132 26.0993C12.9629 26.4249 13.2429 26.6654 13.5722 26.6654H18.4264C18.7556 26.6654 19.0356 26.425 19.0854 26.0995L19.5933 22.7801C19.5997 22.7386 19.6252 22.7027 19.6619 22.6825C19.7614 22.6279 19.8596 22.5711 19.9564 22.5121C19.9923 22.4903 20.0362 22.4862 20.0754 22.5015L23.2035 23.7223C23.5103 23.842 23.8585 23.7198 24.0232 23.4346L26.4503 19.2307C26.6149 18.9456 26.5467 18.583 26.2898 18.3771L23.6679 16.2766C23.6352 16.2504 23.6168 16.2104 23.6177 16.1685C23.619 16.1122 23.6196 16.0558 23.6196 15.9993C23.6196 15.9429 23.619 15.8866 23.6177 15.8305C23.6168 15.7886 23.6353 15.7486 23.668 15.7224L26.2903 13.623C26.5474 13.4172 26.6156 13.0544 26.451 12.7692L24.0239 8.56537C23.8592 8.28023 23.5111 8.15797 23.2043 8.27757L20.0758 9.49734C20.0367 9.51258 19.9927 9.50846 19.9569 9.48664C19.8599 9.42762 19.7616 9.37071 19.6618 9.31596C19.6251 9.2958 19.5997 9.25984 19.5933 9.21843L19.0854 5.89915C19.0356 5.57369 18.7556 5.33333 18.4264 5.33333H13.5722ZM16.0001 20.2854C18.3672 20.2854 20.2862 18.3664 20.2862 15.9993C20.2862 13.6322 18.3672 11.7132 16.0001 11.7132C13.6329 11.7132 11.714 13.6322 11.714 15.9993C11.714 18.3664 13.6329 20.2854 16.0001 20.2854Z" fill="currentColor"/>`;

var Icon$104 = `<path d="M17.5091 24.6595C17.5091 25.2066 16.8864 25.5208 16.4463 25.1956L9.44847 20.0252C9.42553 20.0083 9.39776 19.9992 9.36923 19.9992H4.66667C4.29848 19.9992 4 19.7007 4 19.3325V12.6658C4 12.2976 4.29848 11.9992 4.66667 11.9992H9.37115C9.39967 11.9992 9.42745 11.99 9.45039 11.9731L16.4463 6.80363C16.8863 6.47845 17.5091 6.79262 17.5091 7.3398L17.5091 24.6595Z" fill="currentColor"/> <path d="M27.5091 9.33336C27.8773 9.33336 28.1758 9.63184 28.1758 10V22C28.1758 22.3682 27.8773 22.6667 27.5091 22.6667H26.1758C25.8076 22.6667 25.5091 22.3682 25.5091 22V10C25.5091 9.63184 25.8076 9.33336 26.1758 9.33336L27.5091 9.33336Z" fill="currentColor"/> <path d="M22.1758 12C22.544 12 22.8424 12.2985 22.8424 12.6667V19.3334C22.8424 19.7016 22.544 20 22.1758 20H20.8424C20.4743 20 20.1758 19.7016 20.1758 19.3334V12.6667C20.1758 12.2985 20.4743 12 20.8424 12H22.1758Z" fill="currentColor"/>`;

var Icon$105 = `<path d="M17.5091 24.6594C17.5091 25.2066 16.8864 25.5207 16.4463 25.1956L9.44847 20.0252C9.42553 20.0083 9.39776 19.9991 9.36923 19.9991H4.66667C4.29848 19.9991 4 19.7006 4 19.3324V12.6658C4 12.2976 4.29848 11.9991 4.66667 11.9991H9.37115C9.39967 11.9991 9.42745 11.99 9.45039 11.973L16.4463 6.80358C16.8863 6.4784 17.5091 6.79258 17.5091 7.33975L17.5091 24.6594Z" fill="currentColor"/> <path d="M22.8424 12.6667C22.8424 12.2985 22.544 12 22.1758 12H20.8424C20.4743 12 20.1758 12.2985 20.1758 12.6667V19.3333C20.1758 19.7015 20.4743 20 20.8424 20H22.1758C22.544 20 22.8424 19.7015 22.8424 19.3333V12.6667Z" fill="currentColor"/>`;




/***/ }),

/***/ "./node_modules/@vidstack/react/dev/chunks/vidstack-GeL5yun1.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@vidstack/react/dev/chunks/vidstack-GeL5yun1.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Captions: () => (/* binding */ Captions),
/* harmony export */   ChapterTitle: () => (/* binding */ ChapterTitle),
/* harmony export */   Content: () => (/* binding */ Content),
/* harmony export */   GoogleCastButton: () => (/* binding */ GoogleCastButton),
/* harmony export */   Group: () => (/* binding */ Group),
/* harmony export */   MediaAnnouncer: () => (/* binding */ MediaAnnouncer),
/* harmony export */   Root: () => (/* binding */ Root$4),
/* harmony export */   Root$1: () => (/* binding */ Root$2),
/* harmony export */   Root$2: () => (/* binding */ Root$1),
/* harmony export */   Root$3: () => (/* binding */ Root$3),
/* harmony export */   Root$4: () => (/* binding */ Root$5),
/* harmony export */   Root$5: () => (/* binding */ Root),
/* harmony export */   Title: () => (/* binding */ Title),
/* harmony export */   Track: () => (/* binding */ Track),
/* harmony export */   TrackFill: () => (/* binding */ TrackFill),
/* harmony export */   Trigger: () => (/* binding */ Trigger),
/* harmony export */   audioGainSlider: () => (/* binding */ audioGainSlider),
/* harmony export */   controls: () => (/* binding */ controls),
/* harmony export */   createComputed: () => (/* binding */ createComputed),
/* harmony export */   createEffect: () => (/* binding */ createEffect),
/* harmony export */   createSignal: () => (/* binding */ createSignal),
/* harmony export */   qualitySlider: () => (/* binding */ qualitySlider),
/* harmony export */   speedSlider: () => (/* binding */ speedSlider),
/* harmony export */   spinner: () => (/* binding */ spinner),
/* harmony export */   tooltip: () => (/* binding */ tooltip),
/* harmony export */   useActiveTextCues: () => (/* binding */ useActiveTextCues),
/* harmony export */   useActiveTextTrack: () => (/* binding */ useActiveTextTrack),
/* harmony export */   useChapterOptions: () => (/* binding */ useChapterOptions),
/* harmony export */   useChapterTitle: () => (/* binding */ useChapterTitle),
/* harmony export */   useScoped: () => (/* binding */ useScoped),
/* harmony export */   useTextCues: () => (/* binding */ useTextCues)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./vidstack-D_bWd66h.js */ "./node_modules/@vidstack/react/dev/chunks/vidstack-D_bWd66h.js");
/* harmony import */ var _vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./vidstack-DUlCophs.js */ "./node_modules/@vidstack/react/dev/chunks/vidstack-DUlCophs.js");
/* harmony import */ var _vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./vidstack--AIGOV5A.js */ "./node_modules/@vidstack/react/dev/chunks/vidstack--AIGOV5A.js");
"use client"

;




const MediaAnnouncerBridge = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.createReactComponent)(_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_2__.MediaAnnouncerInstance, {
  events: ["onChange"]
});
const MediaAnnouncer = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(
  ({ style, children, ...props }, forwardRef) => {
    return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(MediaAnnouncerBridge, { ...props }, (props2) => /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
      _vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_2__.Primitive.div,
      {
        ...props2,
        style: { display: "contents", ...style },
        ref: (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.composeRefs)(props2.ref, forwardRef)
      },
      children
    ));
  }
);
MediaAnnouncer.displayName = "MediaAnnouncer";

const ControlsBridge = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.createReactComponent)(_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_2__.ControlsInstance);
const Root$5 = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(({ children, ...props }, forwardRef) => {
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(ControlsBridge, { ...props }, (props2) => /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
    _vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_2__.Primitive.div,
    {
      ...props2,
      ref: (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.composeRefs)(props2.ref, forwardRef)
    },
    children
  ));
});
Root$5.displayName = "Controls";
const ControlsGroupBridge = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.createReactComponent)(_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_2__.ControlsGroupInstance);
const Group = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(({ children, ...props }, forwardRef) => {
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(ControlsGroupBridge, { ...props }, (props2) => /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
    _vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_2__.Primitive.div,
    {
      ...props2,
      ref: (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.composeRefs)(props2.ref, forwardRef)
    },
    children
  ));
});
Group.displayName = "ControlsGroup";

var controls = /*#__PURE__*/Object.freeze({
  __proto__: null,
  Group: Group,
  Root: Root$5
});

const TooltipBridge = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.createReactComponent)(_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_2__.TooltipInstance);
function Root$4({ children, ...props }) {
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(TooltipBridge, { ...props }, children);
}
Root$4.displayName = "Tooltip";
const TriggerBridge = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.createReactComponent)(_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_2__.TooltipTriggerInstance);
const Trigger = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(
  ({ children, ...props }, forwardRef) => {
    return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(TriggerBridge, { ...props }, (props2) => /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
      _vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_2__.Primitive.button,
      {
        ...props2,
        ref: (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.composeRefs)(props2.ref, forwardRef)
      },
      children
    ));
  }
);
Trigger.displayName = "TooltipTrigger";
const ContentBridge = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.createReactComponent)(_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_2__.TooltipContentInstance);
const Content = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(
  ({ children, ...props }, forwardRef) => {
    return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(ContentBridge, { ...props }, (props2) => /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
      _vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_2__.Primitive.div,
      {
        ...props2,
        ref: (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.composeRefs)(props2.ref, forwardRef)
      },
      children
    ));
  }
);
Content.displayName = "TooltipContent";

var tooltip = /*#__PURE__*/Object.freeze({
  __proto__: null,
  Content: Content,
  Root: Root$4,
  Trigger: Trigger
});

const GoogleCastButtonBridge = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.createReactComponent)(_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_2__.GoogleCastButtonInstance, {
  domEventsRegex: /^onMedia/
});
const GoogleCastButton = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(
  ({ children, ...props }, forwardRef) => {
    return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(GoogleCastButtonBridge, { ...props }, (props2) => /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
      _vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_2__.Primitive.button,
      {
        ...props2,
        ref: (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.composeRefs)(props2.ref, forwardRef)
      },
      children
    ));
  }
);
GoogleCastButton.displayName = "GoogleCastButton";

const QualitySliderBridge = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.createReactComponent)(_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_2__.QualitySliderInstance, {
  events: _vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.sliderCallbacks,
  domEventsRegex: /^onMedia/
});
const Root$3 = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(
  ({ children, ...props }, forwardRef) => {
    return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(QualitySliderBridge, { ...props, ref: forwardRef }, (props2) => /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_2__.Primitive.div, { ...props2 }, children));
  }
);
Root$3.displayName = "QualitySlider";

var qualitySlider = /*#__PURE__*/Object.freeze({
  __proto__: null,
  Preview: _vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.Preview,
  Root: Root$3,
  Steps: _vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.Steps,
  Thumb: _vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.Thumb,
  Track: _vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.Track,
  TrackFill: _vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.TrackFill,
  Value: _vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.Value
});

const AudioGainSliderBridge = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.createReactComponent)(_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_2__.AudioGainSliderInstance, {
  events: _vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.sliderCallbacks,
  domEventsRegex: /^onMedia/
});
const Root$2 = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(
  ({ children, ...props }, forwardRef) => {
    return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(AudioGainSliderBridge, { ...props, ref: forwardRef }, (props2) => /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_2__.Primitive.div, { ...props2 }, children));
  }
);
Root$2.displayName = "AudioGainSlider";

var audioGainSlider = /*#__PURE__*/Object.freeze({
  __proto__: null,
  Preview: _vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.Preview,
  Root: Root$2,
  Steps: _vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.Steps,
  Thumb: _vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.Thumb,
  Track: _vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.Track,
  TrackFill: _vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.TrackFill,
  Value: _vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.Value
});

const SpeedSliderBridge = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.createReactComponent)(_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_2__.SpeedSliderInstance, {
  events: _vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.sliderCallbacks,
  domEventsRegex: /^onMedia/
});
const Root$1 = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(
  ({ children, ...props }, forwardRef) => {
    return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(SpeedSliderBridge, { ...props, ref: forwardRef }, (props2) => /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_2__.Primitive.div, { ...props2 }, children));
  }
);
Root$1.displayName = "SpeedSlider";

var speedSlider = /*#__PURE__*/Object.freeze({
  __proto__: null,
  Preview: _vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.Preview,
  Root: Root$1,
  Steps: _vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.Steps,
  Thumb: _vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.Thumb,
  Track: _vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.Track,
  TrackFill: _vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.TrackFill,
  Value: _vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.Value
});

const Title = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(({ children, ...props }, forwardRef) => {
  const $title = (0,_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_2__.useMediaState)("title");
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_2__.Primitive.span, { ...props, ref: forwardRef }, $title, children);
});
Title.displayName = "Title";

function useActiveTextCues(track) {
  const [activeCues, setActiveCues] = react__WEBPACK_IMPORTED_MODULE_0__.useState([]);
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    if (!track) {
      setActiveCues([]);
      return;
    }
    function onCuesChange() {
      if (track) setActiveCues(track.activeCues);
    }
    onCuesChange();
    return (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.listenEvent)(track, "cue-change", onCuesChange);
  }, [track]);
  return activeCues;
}

function useActiveTextTrack(kind) {
  const media = (0,_vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.useMediaContext)(), [track, setTrack] = react__WEBPACK_IMPORTED_MODULE_0__.useState(null);
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    return (0,_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_2__.watchActiveTextTrack)(media.textTracks, kind, setTrack);
  }, [kind]);
  return track;
}

function useChapterTitle() {
  const $track = useActiveTextTrack("chapters"), $cues = useActiveTextCues($track);
  return $cues[0]?.text || "";
}

const ChapterTitle = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(
  ({ defaultText = "", children, ...props }, forwardRef) => {
    const $chapterTitle = useChapterTitle();
    return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_2__.Primitive.span, { ...props, ref: forwardRef }, $chapterTitle || defaultText, children);
  }
);
ChapterTitle.displayName = "ChapterTitle";

const CaptionsBridge = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.createReactComponent)(_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_2__.CaptionsInstance);
const Captions = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(
  ({ children, ...props }, forwardRef) => {
    return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(CaptionsBridge, { ...props, ref: forwardRef }, (props2) => /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_2__.Primitive.div, { ...props2 }, children));
  }
);
Captions.displayName = "Captions";

const Root = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(
  ({ size = 96, children, ...props }, forwardRef) => {
    return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
      "svg",
      {
        width: size,
        height: size,
        fill: "none",
        viewBox: "0 0 120 120",
        "aria-hidden": "true",
        "data-part": "root",
        ...props,
        ref: forwardRef
      },
      children
    );
  }
);
const Track = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(
  ({ width = 8, children, ...props }, ref) => /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
    "circle",
    {
      cx: "60",
      cy: "60",
      r: "54",
      stroke: "currentColor",
      strokeWidth: width,
      "data-part": "track",
      ...props,
      ref
    },
    children
  )
);
const TrackFill = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(
  ({ width = 8, fillPercent = 50, children, ...props }, ref) => /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(
    "circle",
    {
      cx: "60",
      cy: "60",
      r: "54",
      stroke: "currentColor",
      pathLength: "100",
      strokeWidth: width,
      strokeDasharray: 100,
      strokeDashoffset: 100 - fillPercent,
      "data-part": "track-fill",
      ...props,
      ref
    },
    children
  )
);

var spinner = /*#__PURE__*/Object.freeze({
  __proto__: null,
  Root: Root,
  Track: Track,
  TrackFill: TrackFill
});

function createSignal(initialValue, deps = []) {
  const scope = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.useReactScope)();
  return react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.scoped)(() => (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.signal)(initialValue), scope), [scope, ...deps]);
}
function createComputed(compute, deps = []) {
  const scope = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.useReactScope)();
  return react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.scoped)(() => (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.computed)(compute), scope), [scope, ...deps]);
}
function createEffect(compute, deps = []) {
  const scope = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.useReactScope)();
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.scoped)(() => (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(compute), scope), [scope, ...deps]);
}
function useScoped(compute) {
  const scope = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.useReactScope)();
  return react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.scoped)(compute, scope), [scope]);
}

function useTextCues(track) {
  const [cues, setCues] = react__WEBPACK_IMPORTED_MODULE_0__.useState([]);
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    if (!track) return;
    function onCuesChange() {
      if (track) setCues([...track.cues]);
    }
    const events = new _vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.EventsController(track).add("add-cue", onCuesChange).add("remove-cue", onCuesChange);
    onCuesChange();
    return () => {
      setCues([]);
      events.abort();
    };
  }, [track]);
  return cues;
}

function useChapterOptions() {
  const media = (0,_vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_3__.useMediaContext)(), track = useActiveTextTrack("chapters"), cues = useTextCues(track), $startTime = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.useSignal)(media.$state.seekableStart), $endTime = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.useSignal)(media.$state.seekableEnd);
  useActiveTextCues(track);
  return react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => {
    const options = track ? cues.filter((cue) => cue.startTime <= $endTime && cue.endTime >= $startTime).map((cue, i) => {
      let currentRef = null, stopProgressEffect;
      return {
        cue,
        label: cue.text,
        value: i.toString(),
        startTimeText: (0,_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_2__.formatTime)(Math.max(0, cue.startTime - $startTime)),
        durationText: (0,_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_2__.formatSpokenTime)(
          Math.min($endTime, cue.endTime) - Math.max($startTime, cue.startTime)
        ),
        get selected() {
          return cue === track.activeCues[0];
        },
        setProgressVar(ref) {
          if (!ref || cue !== track.activeCues[0]) {
            stopProgressEffect?.();
            stopProgressEffect = void 0;
            ref?.style.setProperty("--progress", "0%");
            currentRef = null;
            return;
          }
          if (currentRef === ref) return;
          currentRef = ref;
          stopProgressEffect?.();
          stopProgressEffect = (0,_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_1__.effect)(() => {
            const { realCurrentTime } = media.$state, time = realCurrentTime(), cueStartTime = Math.max($startTime, cue.startTime), duration = Math.min($endTime, cue.endTime) - cueStartTime, progress = Math.max(0, time - cueStartTime) / duration * 100;
            ref.style.setProperty("--progress", progress.toFixed(3) + "%");
          });
        },
        select(trigger) {
          media.remote.seek(cue.startTime - $startTime, trigger);
        }
      };
    }) : [];
    Object.defineProperty(options, "selectedValue", {
      get() {
        const index = options.findIndex((option) => option.selected);
        return (index >= 0 ? index : 0).toString();
      }
    });
    return options;
  }, [cues, $startTime, $endTime]);
}




/***/ }),

/***/ "./node_modules/@vidstack/react/dev/player/vidstack-default-icons.js":
/*!***************************************************************************!*\
  !*** ./node_modules/@vidstack/react/dev/player/vidstack-default-icons.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   defaultLayoutIcons: () => (/* binding */ defaultLayoutIcons)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var _chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../chunks/vidstack-D_bWd66h.js */ "./node_modules/@vidstack/react/dev/chunks/vidstack-D_bWd66h.js");
/* harmony import */ var _chunks_vidstack_CBF7iUqu_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../chunks/vidstack-CBF7iUqu.js */ "./node_modules/@vidstack/react/dev/chunks/vidstack-CBF7iUqu.js");
"use client"

;



function createIcon(paths) {
  function DefaultLayoutIcon(props) {
    return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_chunks_vidstack_CBF7iUqu_js__WEBPACK_IMPORTED_MODULE_1__.Icon, { paths, ...props });
  }
  DefaultLayoutIcon.displayName = "DefaultLayoutIcon";
  return DefaultLayoutIcon;
}
const defaultLayoutIcons = {
  AirPlayButton: {
    Default: createIcon(_chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.Icon$5)
  },
  GoogleCastButton: {
    Default: createIcon(_chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.Icon$24)
  },
  PlayButton: {
    Play: createIcon(_chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.Icon$62),
    Pause: createIcon(_chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.Icon$59),
    Replay: createIcon(_chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.Icon$74)
  },
  MuteButton: {
    Mute: createIcon(_chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.Icon$54),
    VolumeLow: createIcon(_chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.Icon$105),
    VolumeHigh: createIcon(_chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.Icon$104)
  },
  CaptionButton: {
    On: createIcon(_chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.Icon$26),
    Off: createIcon(_chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.Icon$27)
  },
  PIPButton: {
    Enter: createIcon(_chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.Icon$61),
    Exit: createIcon(_chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.Icon$60)
  },
  FullscreenButton: {
    Enter: createIcon(_chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.Icon$40),
    Exit: createIcon(_chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.Icon$39)
  },
  SeekButton: {
    Backward: createIcon(_chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.Icon$77),
    Forward: createIcon(_chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.Icon$81)
  },
  DownloadButton: {
    Default: createIcon(_chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.Icon$31)
  },
  Menu: {
    Accessibility: createIcon(_chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.Icon$0),
    ArrowLeft: createIcon(_chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.Icon$11),
    ArrowRight: createIcon(_chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.Icon$22),
    Audio: createIcon(_chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.Icon$53),
    Chapters: createIcon(_chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.Icon$16),
    Captions: createIcon(_chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.Icon$27),
    Playback: createIcon(_chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.Icon$63),
    Settings: createIcon(_chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.Icon$88),
    AudioBoostUp: createIcon(_chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.Icon$104),
    AudioBoostDown: createIcon(_chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.Icon$105),
    SpeedUp: createIcon(_chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.Icon$35),
    SpeedDown: createIcon(_chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.Icon$34),
    QualityUp: createIcon(_chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.Icon$13),
    QualityDown: createIcon(_chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.Icon$8),
    FontSizeUp: createIcon(_chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.Icon$13),
    FontSizeDown: createIcon(_chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.Icon$8),
    OpacityUp: createIcon(_chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.Icon$33),
    OpacityDown: createIcon(_chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.Icon$56),
    RadioCheck: createIcon(_chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.Icon$19)
  },
  KeyboardDisplay: {
    Play: createIcon(_chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.Icon$62),
    Pause: createIcon(_chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.Icon$59),
    Mute: createIcon(_chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.Icon$54),
    VolumeUp: createIcon(_chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.Icon$104),
    VolumeDown: createIcon(_chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.Icon$105),
    EnterFullscreen: createIcon(_chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.Icon$40),
    ExitFullscreen: createIcon(_chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.Icon$39),
    EnterPiP: createIcon(_chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.Icon$61),
    ExitPiP: createIcon(_chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.Icon$60),
    CaptionsOn: createIcon(_chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.Icon$26),
    CaptionsOff: createIcon(_chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.Icon$27),
    SeekForward: createIcon(_chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.Icon$35),
    SeekBackward: createIcon(_chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.Icon$34)
  }
};




/***/ }),

/***/ "./node_modules/@vidstack/react/dev/vidstack.js":
/*!******************************************************!*\
  !*** ./node_modules/@vidstack/react/dev/vidstack.js ***!
  \******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ARIAKeyShortcuts: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.ARIAKeyShortcuts),
/* harmony export */   AUDIO_EXTENSIONS: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.AUDIO_EXTENSIONS),
/* harmony export */   AUDIO_TYPES: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.AUDIO_TYPES),
/* harmony export */   AirPlayButton: () => (/* reexport safe */ _chunks_vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_4__.AirPlayButton),
/* harmony export */   AirPlayButtonInstance: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.AirPlayButtonInstance),
/* harmony export */   AudioGainSlider: () => (/* reexport safe */ _chunks_vidstack_GeL5yun1_js__WEBPACK_IMPORTED_MODULE_3__.audioGainSlider),
/* harmony export */   AudioGainSliderInstance: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.AudioGainSliderInstance),
/* harmony export */   AudioProviderLoader: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.AudioProviderLoader),
/* harmony export */   AudioTrackList: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.AudioTrackList),
/* harmony export */   Caption: () => (/* binding */ caption),
/* harmony export */   CaptionButton: () => (/* reexport safe */ _chunks_vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_4__.CaptionButton),
/* harmony export */   CaptionButtonInstance: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.CaptionButtonInstance),
/* harmony export */   Captions: () => (/* reexport safe */ _chunks_vidstack_GeL5yun1_js__WEBPACK_IMPORTED_MODULE_3__.Captions),
/* harmony export */   CaptionsInstance: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.CaptionsInstance),
/* harmony export */   ChapterTitle: () => (/* reexport safe */ _chunks_vidstack_GeL5yun1_js__WEBPACK_IMPORTED_MODULE_3__.ChapterTitle),
/* harmony export */   Controls: () => (/* reexport safe */ _chunks_vidstack_GeL5yun1_js__WEBPACK_IMPORTED_MODULE_3__.controls),
/* harmony export */   ControlsGroupInstance: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.ControlsGroupInstance),
/* harmony export */   ControlsInstance: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.ControlsInstance),
/* harmony export */   DASHProviderLoader: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.DASHProviderLoader),
/* harmony export */   DASH_VIDEO_EXTENSIONS: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.DASH_VIDEO_EXTENSIONS),
/* harmony export */   DASH_VIDEO_TYPES: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.DASH_VIDEO_TYPES),
/* harmony export */   DEFAULT_AUDIO_GAINS: () => (/* binding */ DEFAULT_AUDIO_GAINS),
/* harmony export */   DEFAULT_PLAYBACK_RATES: () => (/* reexport safe */ _chunks_vidstack_CIHGgWPC_js__WEBPACK_IMPORTED_MODULE_5__.DEFAULT_PLAYBACK_RATES),
/* harmony export */   FullscreenButton: () => (/* reexport safe */ _chunks_vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_4__.FullscreenButton),
/* harmony export */   FullscreenButtonInstance: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.FullscreenButtonInstance),
/* harmony export */   FullscreenController: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.FullscreenController),
/* harmony export */   Gesture: () => (/* reexport safe */ _chunks_vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_4__.Gesture),
/* harmony export */   GestureInstance: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.GestureInstance),
/* harmony export */   GoogleCastButton: () => (/* reexport safe */ _chunks_vidstack_GeL5yun1_js__WEBPACK_IMPORTED_MODULE_3__.GoogleCastButton),
/* harmony export */   GoogleCastButtonInstance: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.GoogleCastButtonInstance),
/* harmony export */   HLSProviderLoader: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.HLSProviderLoader),
/* harmony export */   HLS_VIDEO_EXTENSIONS: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.HLS_VIDEO_EXTENSIONS),
/* harmony export */   HLS_VIDEO_TYPES: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.HLS_VIDEO_TYPES),
/* harmony export */   Icon: () => (/* reexport safe */ _chunks_vidstack_CBF7iUqu_js__WEBPACK_IMPORTED_MODULE_7__.Icon),
/* harmony export */   LibASSTextRenderer: () => (/* binding */ LibASSTextRenderer),
/* harmony export */   List: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.List),
/* harmony export */   LiveButton: () => (/* reexport safe */ _chunks_vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_4__.LiveButton),
/* harmony export */   LiveButtonInstance: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.LiveButtonInstance),
/* harmony export */   LocalMediaStorage: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.LocalMediaStorage),
/* harmony export */   Logger: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.Logger),
/* harmony export */   MEDIA_KEY_SHORTCUTS: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.MEDIA_KEY_SHORTCUTS),
/* harmony export */   MediaAnnouncer: () => (/* reexport safe */ _chunks_vidstack_GeL5yun1_js__WEBPACK_IMPORTED_MODULE_3__.MediaAnnouncer),
/* harmony export */   MediaAnnouncerInstance: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.MediaAnnouncerInstance),
/* harmony export */   MediaControls: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.MediaControls),
/* harmony export */   MediaPlayer: () => (/* binding */ MediaPlayer),
/* harmony export */   MediaPlayerInstance: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.MediaPlayerInstance),
/* harmony export */   MediaProvider: () => (/* binding */ MediaProvider),
/* harmony export */   MediaProviderInstance: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.MediaProviderInstance),
/* harmony export */   MediaRemoteControl: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.MediaRemoteControl),
/* harmony export */   Menu: () => (/* reexport safe */ _chunks_vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_4__.menu),
/* harmony export */   MenuButtonInstance: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.MenuButtonInstance),
/* harmony export */   MenuInstance: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.MenuInstance),
/* harmony export */   MenuItemInstance: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.MenuItemInstance),
/* harmony export */   MenuItemsInstance: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.MenuItemsInstance),
/* harmony export */   MenuPortalInstance: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.MenuPortalInstance),
/* harmony export */   MuteButton: () => (/* reexport safe */ _chunks_vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_4__.MuteButton),
/* harmony export */   MuteButtonInstance: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.MuteButtonInstance),
/* harmony export */   PIPButton: () => (/* reexport safe */ _chunks_vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_4__.PIPButton),
/* harmony export */   PIPButtonInstance: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.PIPButtonInstance),
/* harmony export */   PlayButton: () => (/* reexport safe */ _chunks_vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_4__.PlayButton),
/* harmony export */   PlayButtonInstance: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.PlayButtonInstance),
/* harmony export */   Poster: () => (/* binding */ Poster),
/* harmony export */   PosterInstance: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.PosterInstance),
/* harmony export */   QualitySlider: () => (/* reexport safe */ _chunks_vidstack_GeL5yun1_js__WEBPACK_IMPORTED_MODULE_3__.qualitySlider),
/* harmony export */   QualitySliderInstance: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.QualitySliderInstance),
/* harmony export */   RadioGroup: () => (/* reexport safe */ _chunks_vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_4__.radioGroup),
/* harmony export */   RadioGroupInstance: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.RadioGroupInstance),
/* harmony export */   RadioInstance: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.RadioInstance),
/* harmony export */   ScreenOrientationController: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.ScreenOrientationController),
/* harmony export */   SeekButton: () => (/* reexport safe */ _chunks_vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_4__.SeekButton),
/* harmony export */   SeekButtonInstance: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.SeekButtonInstance),
/* harmony export */   Slider: () => (/* reexport safe */ _chunks_vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_4__.slider),
/* harmony export */   SliderChaptersInstance: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.SliderChaptersInstance),
/* harmony export */   SliderInstance: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.SliderInstance),
/* harmony export */   SliderPreviewInstance: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.SliderPreviewInstance),
/* harmony export */   SliderThumbnailInstance: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.SliderThumbnailInstance),
/* harmony export */   SliderValueInstance: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.SliderValueInstance),
/* harmony export */   SliderVideoInstance: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.SliderVideoInstance),
/* harmony export */   SpeedSlider: () => (/* reexport safe */ _chunks_vidstack_GeL5yun1_js__WEBPACK_IMPORTED_MODULE_3__.speedSlider),
/* harmony export */   SpeedSliderInstance: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.SpeedSliderInstance),
/* harmony export */   Spinner: () => (/* reexport safe */ _chunks_vidstack_GeL5yun1_js__WEBPACK_IMPORTED_MODULE_3__.spinner),
/* harmony export */   TextRenderers: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.TextRenderers),
/* harmony export */   TextTrack: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.TextTrack),
/* harmony export */   TextTrackList: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.TextTrackList),
/* harmony export */   Thumbnail: () => (/* reexport safe */ _chunks_vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_4__.thumbnail),
/* harmony export */   ThumbnailInstance: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.ThumbnailInstance),
/* harmony export */   Time: () => (/* reexport safe */ _chunks_vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_4__.Time),
/* harmony export */   TimeInstance: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.TimeInstance),
/* harmony export */   TimeRange: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.TimeRange),
/* harmony export */   TimeSlider: () => (/* reexport safe */ _chunks_vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_4__.timeSlider),
/* harmony export */   TimeSliderInstance: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.TimeSliderInstance),
/* harmony export */   Title: () => (/* reexport safe */ _chunks_vidstack_GeL5yun1_js__WEBPACK_IMPORTED_MODULE_3__.Title),
/* harmony export */   ToggleButton: () => (/* binding */ ToggleButton),
/* harmony export */   ToggleButtonInstance: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.ToggleButtonInstance),
/* harmony export */   Tooltip: () => (/* reexport safe */ _chunks_vidstack_GeL5yun1_js__WEBPACK_IMPORTED_MODULE_3__.tooltip),
/* harmony export */   TooltipContentInstance: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.TooltipContentInstance),
/* harmony export */   TooltipInstance: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.TooltipInstance),
/* harmony export */   TooltipTriggerInstance: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.TooltipTriggerInstance),
/* harmony export */   Track: () => (/* binding */ Track),
/* harmony export */   VIDEO_EXTENSIONS: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.VIDEO_EXTENSIONS),
/* harmony export */   VIDEO_TYPES: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.VIDEO_TYPES),
/* harmony export */   VideoProviderLoader: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.VideoProviderLoader),
/* harmony export */   VideoQualityList: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.VideoQualityList),
/* harmony export */   VimeoProviderLoader: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.VimeoProviderLoader),
/* harmony export */   VolumeSlider: () => (/* reexport safe */ _chunks_vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_4__.volumeSlider),
/* harmony export */   VolumeSliderInstance: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.VolumeSliderInstance),
/* harmony export */   YouTubeProviderLoader: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.YouTubeProviderLoader),
/* harmony export */   appendTriggerEvent: () => (/* reexport safe */ _chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.appendTriggerEvent),
/* harmony export */   boundTime: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.boundTime),
/* harmony export */   canChangeVolume: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.canChangeVolume),
/* harmony export */   canFullscreen: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.canFullscreen),
/* harmony export */   canGoogleCastSrc: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.canGoogleCastSrc),
/* harmony export */   canOrientScreen: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.canOrientScreen),
/* harmony export */   canPlayHLSNatively: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.canPlayHLSNatively),
/* harmony export */   canRotateScreen: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.canRotateScreen),
/* harmony export */   canUsePictureInPicture: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.canUsePictureInPicture),
/* harmony export */   canUseVideoPresentation: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.canUseVideoPresentation),
/* harmony export */   createTextTrack: () => (/* binding */ createTextTrack),
/* harmony export */   findActiveCue: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.findActiveCue),
/* harmony export */   findTriggerEvent: () => (/* reexport safe */ _chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.findTriggerEvent),
/* harmony export */   formatSpokenTime: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.formatSpokenTime),
/* harmony export */   formatTime: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.formatTime),
/* harmony export */   getDownloadFile: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.getDownloadFile),
/* harmony export */   getTimeRangesEnd: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.getTimeRangesEnd),
/* harmony export */   getTimeRangesStart: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.getTimeRangesStart),
/* harmony export */   hasTriggerEvent: () => (/* reexport safe */ _chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.hasTriggerEvent),
/* harmony export */   isAudioProvider: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.isAudioProvider),
/* harmony export */   isAudioSrc: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.isAudioSrc),
/* harmony export */   isCueActive: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.isCueActive),
/* harmony export */   isDASHProvider: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.isDASHProvider),
/* harmony export */   isDASHSrc: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.isDASHSrc),
/* harmony export */   isGoogleCastProvider: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.isGoogleCastProvider),
/* harmony export */   isHLSProvider: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.isHLSProvider),
/* harmony export */   isHLSSrc: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.isHLSSrc),
/* harmony export */   isHTMLAudioElement: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.isHTMLAudioElement),
/* harmony export */   isHTMLIFrameElement: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.isHTMLIFrameElement),
/* harmony export */   isHTMLMediaElement: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.isHTMLMediaElement),
/* harmony export */   isHTMLVideoElement: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.isHTMLVideoElement),
/* harmony export */   isKeyboardClick: () => (/* reexport safe */ _chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.isKeyboardClick),
/* harmony export */   isKeyboardEvent: () => (/* reexport safe */ _chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.isKeyboardEvent),
/* harmony export */   isMediaStream: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.isMediaStream),
/* harmony export */   isPointerEvent: () => (/* reexport safe */ _chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.isPointerEvent),
/* harmony export */   isTrackCaptionKind: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.isTrackCaptionKind),
/* harmony export */   isVideoProvider: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.isVideoProvider),
/* harmony export */   isVideoQualitySrc: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.isVideoQualitySrc),
/* harmony export */   isVideoSrc: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.isVideoSrc),
/* harmony export */   isVimeoProvider: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.isVimeoProvider),
/* harmony export */   isYouTubeProvider: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.isYouTubeProvider),
/* harmony export */   mediaContext: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.mediaContext),
/* harmony export */   mediaState: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.mediaState),
/* harmony export */   normalizeTimeIntervals: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.normalizeTimeIntervals),
/* harmony export */   parseJSONCaptionsFile: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.parseJSONCaptionsFile),
/* harmony export */   sliderState: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.sliderState),
/* harmony export */   softResetMediaState: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.softResetMediaState),
/* harmony export */   sortVideoQualities: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.sortVideoQualities),
/* harmony export */   updateTimeIntervals: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.updateTimeIntervals),
/* harmony export */   useActiveTextCues: () => (/* reexport safe */ _chunks_vidstack_GeL5yun1_js__WEBPACK_IMPORTED_MODULE_3__.useActiveTextCues),
/* harmony export */   useActiveTextTrack: () => (/* reexport safe */ _chunks_vidstack_GeL5yun1_js__WEBPACK_IMPORTED_MODULE_3__.useActiveTextTrack),
/* harmony export */   useActiveThumbnail: () => (/* binding */ useActiveThumbnail),
/* harmony export */   useAudioGainOptions: () => (/* binding */ useAudioGainOptions),
/* harmony export */   useAudioOptions: () => (/* reexport safe */ _chunks_vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_4__.useAudioOptions),
/* harmony export */   useCaptionOptions: () => (/* reexport safe */ _chunks_vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_4__.useCaptionOptions),
/* harmony export */   useChapterOptions: () => (/* reexport safe */ _chunks_vidstack_GeL5yun1_js__WEBPACK_IMPORTED_MODULE_3__.useChapterOptions),
/* harmony export */   useChapterTitle: () => (/* reexport safe */ _chunks_vidstack_GeL5yun1_js__WEBPACK_IMPORTED_MODULE_3__.useChapterTitle),
/* harmony export */   useMediaContext: () => (/* reexport safe */ _chunks_vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_4__.useMediaContext),
/* harmony export */   useMediaPlayer: () => (/* reexport safe */ _chunks_vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_4__.useMediaPlayer),
/* harmony export */   useMediaProvider: () => (/* binding */ useMediaProvider),
/* harmony export */   useMediaRemote: () => (/* reexport safe */ _chunks_vidstack_CIHGgWPC_js__WEBPACK_IMPORTED_MODULE_5__.useMediaRemote),
/* harmony export */   useMediaState: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.useMediaState),
/* harmony export */   useMediaStore: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.useMediaStore),
/* harmony export */   usePlaybackRateOptions: () => (/* reexport safe */ _chunks_vidstack_CIHGgWPC_js__WEBPACK_IMPORTED_MODULE_5__.usePlaybackRateOptions),
/* harmony export */   useSliderPreview: () => (/* binding */ useSliderPreview),
/* harmony export */   useSliderState: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.useSliderState),
/* harmony export */   useSliderStore: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.useSliderStore),
/* harmony export */   useState: () => (/* binding */ useState),
/* harmony export */   useStore: () => (/* binding */ useStore),
/* harmony export */   useTextCues: () => (/* reexport safe */ _chunks_vidstack_GeL5yun1_js__WEBPACK_IMPORTED_MODULE_3__.useTextCues),
/* harmony export */   useThumbnails: () => (/* binding */ useThumbnails),
/* harmony export */   useVideoQualityOptions: () => (/* reexport safe */ _chunks_vidstack_CIHGgWPC_js__WEBPACK_IMPORTED_MODULE_5__.useVideoQualityOptions),
/* harmony export */   walkTriggerEventChain: () => (/* reexport safe */ _chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.walkTriggerEventChain),
/* harmony export */   watchActiveTextTrack: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.watchActiveTextTrack),
/* harmony export */   watchCueTextChange: () => (/* reexport safe */ _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.watchCueTextChange)
/* harmony export */ });
/* harmony import */ var _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./chunks/vidstack-DUlCophs.js */ "./node_modules/@vidstack/react/dev/chunks/vidstack-DUlCophs.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var _chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./chunks/vidstack-D_bWd66h.js */ "./node_modules/@vidstack/react/dev/chunks/vidstack-D_bWd66h.js");
/* harmony import */ var _chunks_vidstack_GeL5yun1_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./chunks/vidstack-GeL5yun1.js */ "./node_modules/@vidstack/react/dev/chunks/vidstack-GeL5yun1.js");
/* harmony import */ var _chunks_vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./chunks/vidstack--AIGOV5A.js */ "./node_modules/@vidstack/react/dev/chunks/vidstack--AIGOV5A.js");
/* harmony import */ var _chunks_vidstack_CBF7iUqu_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./chunks/vidstack-CBF7iUqu.js */ "./node_modules/@vidstack/react/dev/chunks/vidstack-CBF7iUqu.js");
/* harmony import */ var _chunks_vidstack_CIHGgWPC_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./chunks/vidstack-CIHGgWPC.js */ "./node_modules/@vidstack/react/dev/chunks/vidstack-CIHGgWPC.js");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-dom */ "react-dom");
"use client"

;













class LibASSTextRenderer {
  constructor(loader, config) {
    this.loader = loader;
    this.config = config;
  }
  priority = 1;
  #instance = null;
  #track = null;
  #typeRE = /(ssa|ass)$/;
  canRender(track, video) {
    return !!video && !!track.src && ((0,_chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.isString)(track.type) && this.#typeRE.test(track.type) || this.#typeRE.test(track.src));
  }
  attach(video) {
    if (!video) return;
    this.loader().then(async (mod) => {
      this.#instance = new mod.default({
        ...this.config,
        video,
        subUrl: this.#track?.src || ""
      });
      new _chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.EventsController(this.#instance).add("ready", () => {
        const canvas = this.#instance?._canvas;
        if (canvas) canvas.style.pointerEvents = "none";
      }).add("error", (event) => {
        if (!this.#track) return;
        this.#track[_chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.TextTrackSymbol.readyState] = 3;
        this.#track.dispatchEvent(
          new _chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.DOMEvent("error", {
            trigger: event,
            detail: event.error
          })
        );
      });
    });
  }
  changeTrack(track) {
    if (!track || track.readyState === 3) {
      this.#freeTrack();
    } else if (this.#track !== track) {
      this.#instance?.setTrackByUrl(track.src);
      this.#track = track;
    }
  }
  detach() {
    this.#freeTrack();
  }
  #freeTrack() {
    this.#instance?.freeTrack();
    this.#track = null;
  }
}

const DEFAULT_AUDIO_GAINS = [1, 1.25, 1.5, 1.75, 2, 2.5, 3, 4];
class AudioGainRadioGroup extends _chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.Component {
  static props = {
    normalLabel: "Disabled",
    gains: DEFAULT_AUDIO_GAINS
  };
  #media;
  #menu;
  #controller;
  get value() {
    return this.#controller.value;
  }
  get disabled() {
    const { gains } = this.$props, { canSetAudioGain } = this.#media.$state;
    return !canSetAudioGain() || gains().length === 0;
  }
  constructor() {
    super();
    this.#controller = new _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.RadioGroupController();
    this.#controller.onValueChange = this.#onValueChange.bind(this);
  }
  onSetup() {
    this.#media = (0,_chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.useMediaContext)();
    if ((0,_chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.hasProvidedContext)(_chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.menuContext)) {
      this.#menu = (0,_chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.useContext)(_chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.menuContext);
    }
  }
  onConnect(el) {
    (0,_chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.effect)(this.#watchValue.bind(this));
    (0,_chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.effect)(this.#watchHintText.bind(this));
    (0,_chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.effect)(this.#watchControllerDisabled.bind(this));
  }
  getOptions() {
    const { gains, normalLabel } = this.$props;
    return gains().map((gain) => ({
      label: gain === 1 || gain === null ? normalLabel : String(gain * 100) + "%",
      value: gain.toString()
    }));
  }
  #watchValue() {
    this.#controller.value = this.#getValue();
  }
  #watchHintText() {
    const { normalLabel } = this.$props, { audioGain } = this.#media.$state, gain = audioGain();
    this.#menu?.hint.set(gain === 1 || gain == null ? normalLabel() : String(gain * 100) + "%");
  }
  #watchControllerDisabled() {
    this.#menu?.disable(this.disabled);
  }
  #getValue() {
    const { audioGain } = this.#media.$state;
    return audioGain()?.toString() ?? "1";
  }
  #onValueChange(value, trigger) {
    if (this.disabled) return;
    const gain = +value;
    this.#media.remote.changeAudioGain(gain, trigger);
    this.dispatch("change", { detail: gain, trigger });
  }
}
const audiogainradiogroup__proto = AudioGainRadioGroup.prototype;
(0,_chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.prop)(audiogainradiogroup__proto, "value");
(0,_chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.prop)(audiogainradiogroup__proto, "disabled");
(0,_chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.method)(audiogainradiogroup__proto, "getOptions");

const playerCallbacks = [
  "onAbort",
  "onAudioTrackChange",
  "onAudioTracksChange",
  "onAutoPlay",
  "onAutoPlayChange",
  "onAutoPlayFail",
  "onCanLoad",
  "onCanPlay",
  "onCanPlayThrough",
  "onControlsChange",
  "onDestroy",
  "onDurationChange",
  "onEmptied",
  "onEnd",
  "onEnded",
  "onError",
  "onFindMediaPlayer",
  "onFullscreenChange",
  "onFullscreenError",
  "onLiveChange",
  "onLiveEdgeChange",
  "onLoadedData",
  "onLoadedMetadata",
  "onLoadStart",
  "onLoopChange",
  "onOrientationChange",
  "onPause",
  "onPictureInPictureChange",
  "onPictureInPictureError",
  "onPlay",
  "onPlayFail",
  "onPlaying",
  "onPlaysInlineChange",
  "onPosterChange",
  "onProgress",
  "onProviderChange",
  "onProviderLoaderChange",
  "onProviderSetup",
  "onQualitiesChange",
  "onQualityChange",
  "onRateChange",
  "onReplay",
  "onSeeked",
  "onSeeking",
  "onSourceChange",
  "onSourceChange",
  "onStalled",
  "onStarted",
  "onStreamTypeChange",
  "onSuspend",
  "onTextTrackChange",
  "onTextTracksChange",
  "onTimeUpdate",
  "onTitleChange",
  "onVdsLog",
  "onVideoPresentationChange",
  "onVolumeChange",
  "onWaiting"
];

const MediaPlayerBridge = (0,_chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.createReactComponent)(_chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.MediaPlayerInstance, {
  events: playerCallbacks,
  eventsRegex: /^onHls/,
  domEventsRegex: /^onMedia/
});
const MediaPlayer = react__WEBPACK_IMPORTED_MODULE_1__.forwardRef(
  ({ aspectRatio, children, ...props }, forwardRef) => {
    return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_1__.createElement(
      MediaPlayerBridge,
      {
        ...props,
        src: props.src,
        ref: forwardRef,
        style: {
          aspectRatio,
          ...props.style
        }
      },
      (props2) => /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_1__.createElement(_chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.Primitive.div, { ...props2 }, children)
    );
  }
);
MediaPlayer.displayName = "MediaPlayer";

const MediaProviderBridge = (0,_chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.createReactComponent)(_chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.MediaProviderInstance);
const MediaProvider = react__WEBPACK_IMPORTED_MODULE_1__.forwardRef(
  ({ loaders = [], children, iframeProps, mediaProps, ...props }, forwardRef) => {
    const reactLoaders = react__WEBPACK_IMPORTED_MODULE_1__.useMemo(() => loaders.map((Loader) => new Loader()), loaders);
    return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_1__.createElement(MediaProviderBridge, { ...props, loaders: reactLoaders, ref: forwardRef }, (props2, instance) => /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", { ...props2 }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_1__.createElement(MediaOutlet, { provider: instance, mediaProps, iframeProps }), children));
  }
);
MediaProvider.displayName = "MediaProvider";
function MediaOutlet({ provider, mediaProps, iframeProps }) {
  const { sources, crossOrigin, poster, remotePlaybackInfo, nativeControls, viewType } = (0,_chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.useStateContext)(_chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.mediaState), { loader } = provider.$state, { $provider: $$provider, $providerSetup: $$providerSetup } = (0,_chunks_vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_4__.useMediaContext)(), $sources = (0,_chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.useSignal)(sources), $nativeControls = (0,_chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.useSignal)(nativeControls), $crossOrigin = (0,_chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.useSignal)(crossOrigin), $poster = (0,_chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.useSignal)(poster), $loader = (0,_chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.useSignal)(loader), $provider = (0,_chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.useSignal)($$provider), $providerSetup = (0,_chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.useSignal)($$providerSetup), $remoteInfo = (0,_chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.useSignal)(remotePlaybackInfo), $mediaType = $loader?.mediaType(), $viewType = (0,_chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.useSignal)(viewType), isAudioView = $viewType === "audio", isYouTubeEmbed = $loader?.name === "youtube", isVimeoEmbed = $loader?.name === "vimeo", isEmbed = isYouTubeEmbed || isVimeoEmbed, isRemotion = $loader?.name === "remotion", isGoogleCast = $loader?.name === "google-cast", [googleCastIconPaths, setGoogleCastIconPaths] = react__WEBPACK_IMPORTED_MODULE_1__.useState(""), [hasMounted, setHasMounted] = react__WEBPACK_IMPORTED_MODULE_1__.useState(false);
  react__WEBPACK_IMPORTED_MODULE_1__.useEffect(() => {
    if (!isGoogleCast || googleCastIconPaths) return;
    Promise.resolve(/*! import() */).then(__webpack_require__.bind(__webpack_require__, /*! ./chunks/vidstack-D_bWd66h.js */ "./node_modules/@vidstack/react/dev/chunks/vidstack-D_bWd66h.js")).then(function (n) { return n.chromecast; }).then((mod) => {
      setGoogleCastIconPaths(mod.default);
    });
  }, [isGoogleCast]);
  react__WEBPACK_IMPORTED_MODULE_1__.useEffect(() => {
    setHasMounted(true);
  }, []);
  if (isGoogleCast) {
    return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_1__.createElement(
      "div",
      {
        className: "vds-google-cast",
        ref: (el) => {
          provider.load(el);
        }
      },
      /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_1__.createElement(_chunks_vidstack_CBF7iUqu_js__WEBPACK_IMPORTED_MODULE_7__.Icon, { paths: googleCastIconPaths }),
      $remoteInfo?.deviceName ? /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_1__.createElement("span", { className: "vds-google-cast-info" }, "Google Cast on", " ", /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_1__.createElement("span", { className: "vds-google-cast-device-name" }, $remoteInfo.deviceName)) : null
    );
  }
  if (isRemotion) {
    return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", { "data-remotion-canvas": true }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_1__.createElement(
      "div",
      {
        "data-remotion-container": true,
        ref: (el) => {
          provider.load(el);
        }
      },
      (0,_chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.isRemotionProvider)($provider) && $providerSetup ? react__WEBPACK_IMPORTED_MODULE_1__.createElement($provider.render) : null
    ));
  }
  return isEmbed ? react__WEBPACK_IMPORTED_MODULE_1__.createElement(
    react__WEBPACK_IMPORTED_MODULE_1__.Fragment,
    null,
    react__WEBPACK_IMPORTED_MODULE_1__.createElement("iframe", {
      ...iframeProps,
      className: (iframeProps?.className ? `${iframeProps.className} ` : "") + isYouTubeEmbed ? "vds-youtube" : "vds-vimeo",
      suppressHydrationWarning: true,
      tabIndex: !$nativeControls ? -1 : void 0,
      "aria-hidden": "true",
      "data-no-controls": !$nativeControls ? "" : void 0,
      ref(el) {
        provider.load(el);
      }
    }),
    !$nativeControls && !isAudioView ? react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", { className: "vds-blocker" }) : null
  ) : $mediaType ? react__WEBPACK_IMPORTED_MODULE_1__.createElement($mediaType === "audio" ? "audio" : "video", {
    ...mediaProps,
    controls: $nativeControls ? true : null,
    crossOrigin: typeof $crossOrigin === "boolean" ? "" : $crossOrigin,
    poster: $mediaType === "video" && $nativeControls && $poster ? $poster : null,
    suppressHydrationWarning: true,
    children: !hasMounted ? $sources.map(
      ({ src, type }) => (0,_chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.isString)(src) ? /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_1__.createElement("source", { src, type: type !== "?" ? type : void 0, key: src }) : null
    ) : null,
    ref(el) {
      provider.load(el);
    }
  }) : null;
}
MediaOutlet.displayName = "MediaOutlet";

function createTextTrack(init) {
  const media = (0,_chunks_vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_4__.useMediaContext)(), track = react__WEBPACK_IMPORTED_MODULE_1__.useMemo(() => new _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.TextTrack(init), Object.values(init));
  react__WEBPACK_IMPORTED_MODULE_1__.useEffect(() => {
    media.textTracks.add(track);
    return () => void media.textTracks.remove(track);
  }, [track]);
  return track;
}

function Track({ lang, ...props }) {
  createTextTrack({ language: lang, ...props });
  return null;
}
Track.displayName = "Track";

const ToggleButtonBridge = (0,_chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.createReactComponent)(_chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.ToggleButtonInstance);
const ToggleButton = react__WEBPACK_IMPORTED_MODULE_1__.forwardRef(
  ({ children, ...props }, forwardRef) => {
    return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_1__.createElement(ToggleButtonBridge, { ...props }, (props2) => /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_1__.createElement(
      _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.Primitive.button,
      {
        ...props2,
        ref: (0,_chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.composeRefs)(props2.ref, forwardRef)
      },
      children
    ));
  }
);
ToggleButton.displayName = "ToggleButton";

const PosterBridge = (0,_chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.createReactComponent)(_chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.PosterInstance);
const Poster = react__WEBPACK_IMPORTED_MODULE_1__.forwardRef(
  ({ children, ...props }, forwardRef) => {
    return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_1__.createElement(
      PosterBridge,
      {
        src: props.asChild && react__WEBPACK_IMPORTED_MODULE_1__.isValidElement(children) ? children.props.src : void 0,
        ...props
      },
      (props2, instance) => /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_1__.createElement(
        PosterImg,
        {
          ...props2,
          instance,
          ref: (0,_chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.composeRefs)(props2.ref, forwardRef)
        },
        children
      )
    );
  }
);
Poster.displayName = "Poster";
const PosterImg = react__WEBPACK_IMPORTED_MODULE_1__.forwardRef(
  ({ instance, children, ...props }, forwardRef) => {
    const { src, img, alt, crossOrigin, hidden } = instance.$state, $src = (0,_chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.useSignal)(src), $alt = (0,_chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.useSignal)(alt), $crossOrigin = (0,_chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.useSignal)(crossOrigin), $hidden = (0,_chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.useSignal)(hidden);
    return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_1__.createElement(
      _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.Primitive.img,
      {
        ...props,
        src: $src || void 0,
        alt: $alt || void 0,
        crossOrigin: $crossOrigin || void 0,
        ref: (0,_chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.composeRefs)(img.set, forwardRef),
        style: { display: $hidden ? "none" : void 0 }
      },
      children
    );
  }
);
PosterImg.displayName = "PosterImg";

const Root = react__WEBPACK_IMPORTED_MODULE_1__.forwardRef(({ children, ...props }, forwardRef) => {
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_1__.createElement(
    _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.Primitive.div,
    {
      translate: "yes",
      "aria-live": "off",
      "aria-atomic": "true",
      ...props,
      ref: forwardRef
    },
    children
  );
});
Root.displayName = "Caption";
const Text = react__WEBPACK_IMPORTED_MODULE_1__.forwardRef((props, forwardRef) => {
  const textTrack = (0,_chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.useMediaState)("textTrack"), [activeCue, setActiveCue] = react__WEBPACK_IMPORTED_MODULE_1__.useState();
  react__WEBPACK_IMPORTED_MODULE_1__.useEffect(() => {
    if (!textTrack) return;
    function onCueChange() {
      setActiveCue(textTrack?.activeCues[0]);
    }
    textTrack.addEventListener("cue-change", onCueChange);
    return () => {
      textTrack.removeEventListener("cue-change", onCueChange);
      setActiveCue(void 0);
    };
  }, [textTrack]);
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_1__.createElement(
    _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.Primitive.span,
    {
      ...props,
      "data-part": "cue",
      dangerouslySetInnerHTML: {
        __html: activeCue?.text || ""
      },
      ref: forwardRef
    }
  );
});
Text.displayName = "CaptionText";

var caption = /*#__PURE__*/Object.freeze({
  __proto__: null,
  Root: Root,
  Text: Text
});

function useState(ctor, prop, ref) {
  const initialValue = react__WEBPACK_IMPORTED_MODULE_1__.useMemo(() => ctor.state.record[prop], [ctor, prop]);
  return (0,_chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.useSignal)(ref.current ? ref.current.$state[prop] : initialValue);
}
const storesCache = /* @__PURE__ */ new Map();
function useStore(ctor, ref) {
  const initialStore = react__WEBPACK_IMPORTED_MODULE_1__.useMemo(() => {
    let store = storesCache.get(ctor);
    if (!store) {
      store = new Proxy(ctor.state.record, {
        get: (_, prop) => () => ctor.state.record[prop]
      });
      storesCache.set(ctor, store);
    }
    return store;
  }, [ctor]);
  return (0,_chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.useSignalRecord)(ref.current ? ref.current.$state : initialStore);
}

function useMediaProvider() {
  const [provider, setProvider] = react__WEBPACK_IMPORTED_MODULE_1__.useState(null), context = (0,_chunks_vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_4__.useMediaContext)();
  if (!context) {
    throw Error(
      "[vidstack] no media context was found - was this called outside of `<MediaPlayer>`?"
    );
  }
  react__WEBPACK_IMPORTED_MODULE_1__.useEffect(() => {
    if (!context) return;
    return (0,_chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.effect)(() => {
      setProvider(context.$provider());
    });
  }, []);
  return provider;
}

function useThumbnails(src, crossOrigin = null) {
  const scope = (0,_chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.useReactScope)(), $src = (0,_chunks_vidstack_GeL5yun1_js__WEBPACK_IMPORTED_MODULE_3__.createSignal)(src), $crossOrigin = (0,_chunks_vidstack_GeL5yun1_js__WEBPACK_IMPORTED_MODULE_3__.createSignal)(crossOrigin), loader = (0,_chunks_vidstack_GeL5yun1_js__WEBPACK_IMPORTED_MODULE_3__.useScoped)(() => _chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.ThumbnailsLoader.create($src, $crossOrigin));
  if (!scope) {
    console.warn(
      `[vidstack] \`useThumbnails\` must be called inside a child component of \`<MediaPlayer>\``
    );
  }
  react__WEBPACK_IMPORTED_MODULE_1__.useEffect(() => {
    $src.set(src);
  }, [src]);
  react__WEBPACK_IMPORTED_MODULE_1__.useEffect(() => {
    $crossOrigin.set(crossOrigin);
  }, [crossOrigin]);
  return (0,_chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.useSignal)(loader.$images);
}
function useActiveThumbnail(thumbnails, time) {
  return react__WEBPACK_IMPORTED_MODULE_1__.useMemo(() => {
    let activeIndex = -1;
    for (let i = thumbnails.length - 1; i >= 0; i--) {
      const image = thumbnails[i];
      if (time >= image.startTime && (!image.endTime || time < image.endTime)) {
        activeIndex = i;
        break;
      }
    }
    return thumbnails[activeIndex] || null;
  }, [thumbnails, time]);
}

function useSliderPreview({
  clamp = false,
  offset = 0,
  orientation = "horizontal"
} = {}) {
  const [rootRef, setRootRef] = react__WEBPACK_IMPORTED_MODULE_1__.useState(null), [previewRef, setPreviewRef] = react__WEBPACK_IMPORTED_MODULE_1__.useState(null), [pointerValue, setPointerValue] = react__WEBPACK_IMPORTED_MODULE_1__.useState(0), [isVisible, setIsVisible] = react__WEBPACK_IMPORTED_MODULE_1__.useState(false);
  react__WEBPACK_IMPORTED_MODULE_1__.useEffect(() => {
    if (!rootRef) return;
    const dragging = (0,_chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.signal)(false);
    function updatePointerValue(event) {
      if (!rootRef) return;
      setPointerValue(getPointerValue(rootRef, event, orientation));
    }
    return (0,_chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.effect)(() => {
      if (!dragging()) {
        new _chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.EventsController(rootRef).add("pointerenter", () => {
          setIsVisible(true);
          previewRef?.setAttribute("data-visible", "");
        }).add("pointerdown", (event) => {
          dragging.set(true);
          updatePointerValue(event);
        }).add("pointerleave", () => {
          setIsVisible(false);
          previewRef?.removeAttribute("data-visible");
        }).add("pointermove", updatePointerValue);
      }
      previewRef?.setAttribute("data-dragging", "");
      new _chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.EventsController(document).add("pointerup", (event) => {
        dragging.set(false);
        previewRef?.removeAttribute("data-dragging");
        updatePointerValue(event);
      }).add("pointermove", updatePointerValue).add("touchmove", (e) => e.preventDefault(), { passive: false });
    });
  }, [rootRef]);
  react__WEBPACK_IMPORTED_MODULE_1__.useEffect(() => {
    if (previewRef) {
      previewRef.style.setProperty("--slider-pointer", pointerValue + "%");
    }
  }, [previewRef, pointerValue]);
  react__WEBPACK_IMPORTED_MODULE_1__.useEffect(() => {
    if (!previewRef) return;
    const update = () => {
      (0,_chunks_vidstack_DUlCophs_js__WEBPACK_IMPORTED_MODULE_0__.updateSliderPreviewPlacement)(previewRef, {
        offset,
        clamp,
        orientation
      });
    };
    update();
    const resize = new ResizeObserver(update);
    resize.observe(previewRef);
    return () => resize.disconnect();
  }, [previewRef, clamp, offset, orientation]);
  return {
    previewRootRef: setRootRef,
    previewRef: setPreviewRef,
    previewValue: pointerValue,
    isPreviewVisible: isVisible
  };
}
function getPointerValue(root, event, orientation) {
  let thumbPositionRate, rect = root.getBoundingClientRect();
  if (orientation === "vertical") {
    const { bottom: trackBottom, height: trackHeight } = rect;
    thumbPositionRate = (trackBottom - event.clientY) / trackHeight;
  } else {
    const { left: trackLeft, width: trackWidth } = rect;
    thumbPositionRate = (event.clientX - trackLeft) / trackWidth;
  }
  return round(Math.max(0, Math.min(100, 100 * thumbPositionRate)));
}
function round(num) {
  return Number(num.toFixed(3));
}

function useAudioGainOptions({
  gains = DEFAULT_AUDIO_GAINS,
  disabledLabel = "disabled"
} = {}) {
  const media = (0,_chunks_vidstack_AIGOV5A_js__WEBPACK_IMPORTED_MODULE_4__.useMediaContext)(), { audioGain, canSetAudioGain } = media.$state;
  (0,_chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.useSignal)(audioGain);
  (0,_chunks_vidstack_D_bWd66h_js__WEBPACK_IMPORTED_MODULE_2__.useSignal)(canSetAudioGain);
  return react__WEBPACK_IMPORTED_MODULE_1__.useMemo(() => {
    const options = gains.map((opt) => {
      const label = typeof opt === "number" ? opt === 1 && disabledLabel ? disabledLabel : opt * 100 + "%" : opt.label, gain = typeof opt === "number" ? opt : opt.gain;
      return {
        label,
        value: gain.toString(),
        gain,
        get selected() {
          return audioGain() === gain;
        },
        select(trigger) {
          media.remote.changeAudioGain(gain, trigger);
        }
      };
    });
    Object.defineProperty(options, "disabled", {
      get() {
        return !canSetAudioGain() || !options.length;
      }
    });
    Object.defineProperty(options, "selectedValue", {
      get() {
        return audioGain()?.toString();
      }
    });
    return options;
  }, [gains]);
}




/***/ }),

/***/ "./src/video/block.json":
/*!******************************!*\
  !*** ./src/video/block.json ***!
  \******************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"fb-blocks/video","version":"0.1.0","title":"FB Video","category":"fb","icon":"video-alt3","description":"FB custom video block with Bunny.net player integration.","textdomain":"blocks/video","editorScript":"file:./index.js","editorStyle":"file:./index.css","style":"file:./style-index.css","viewScript":"file:./view.js","render":"file:./render.php","attributes":{"libraryId":{"type":"string","default":"265348"},"videoId":{"type":"string","default":""},"videoSrc":{"type":"string","default":""},"thumbnailUrl":{"type":"string","default":""},"align":{"type":"string","default":"none"},"autoplay":{"type":"boolean","default":false},"loop":{"type":"boolean","default":false},"muted":{"type":"boolean","default":false},"controls":{"type":"boolean","default":true},"playsInline":{"type":"boolean","default":true}},"supports":{"align":["wide","full"],"spacing":{"margin":false,"padding":false},"__experimentalBorder":{"color":true,"radius":true,"style":true,"width":true,"__experimentalDefaultControls":{"color":true,"radius":true,"style":true,"width":true}},"html":false}}');

/***/ }),

/***/ "./src/video/edit.js":
/*!***************************!*\
  !*** ./src/video/edit.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Edit)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _vidstack_react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @vidstack/react */ "./node_modules/@vidstack/react/dev/vidstack.js");
/* harmony import */ var _vidstack_react_player_layouts_default__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @vidstack/react/player/layouts/default */ "./node_modules/@vidstack/react/dev/chunks/vidstack-BIA_pmri.js");
/* harmony import */ var _vidstack_react_player_layouts_default__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @vidstack/react/player/layouts/default */ "./node_modules/@vidstack/react/dev/player/vidstack-default-icons.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__);









function Edit({
  attributes,
  setAttributes
}) {
  const {
    libraryId,
    videoId,
    videoSrc,
    thumbnailUrl,
    autoplay,
    loop,
    muted,
    controls,
    playsInline
  } = attributes;
  const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps)();
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!videoId || !libraryId) return;
    const controller = new AbortController();
    async function fetchVideoData() {
      try {
        const response = await fetch(`/wp-json/fb/v1/video-resolutions?library_id=${libraryId}&video_id=${videoId}`, {
          signal: controller.signal
        });
        const data = await response.json();
        if (data?.hlsUrl) {
          var _data$thumbnailUrl;
          setAttributes({
            videoSrc: data.hlsUrl,
            thumbnailUrl: (_data$thumbnailUrl = data.thumbnailUrl) !== null && _data$thumbnailUrl !== void 0 ? _data$thumbnailUrl : thumbnailUrl
          });
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Error fetching video data:", err);
        }
      }
    }
    fetchVideoData();
    return () => controller.abort();
  }, [libraryId, videoId]);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
    ...blockProps,
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InspectorControls, {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Video Settings", "blocks/video"),
        initialOpen: true,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Library ID", "blocks/video"),
          value: libraryId,
          onChange: value => setAttributes({
            libraryId: value
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Video ID", "blocks/video"),
          value: videoId,
          onChange: value => setAttributes({
            videoId: value
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Autoplay", "blocks/video"),
          checked: autoplay,
          onChange: value => setAttributes({
            autoplay: value
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Loop", "blocks/video"),
          checked: loop,
          onChange: value => setAttributes({
            loop: value
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Muted", "blocks/video"),
          checked: muted,
          onChange: value => setAttributes({
            muted: value
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Controls", "blocks/video"),
          checked: controls,
          onChange: value => setAttributes({
            controls: value
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Plays Inline", "blocks/video"),
          checked: playsInline,
          onChange: value => setAttributes({
            playsInline: value
          })
        })]
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_vidstack_react__WEBPACK_IMPORTED_MODULE_5__.MediaPlayer, {
      title: "FB Video Preview",
      src: videoSrc,
      autoplay: autoplay,
      loop: loop,
      muted: muted,
      controls: controls,
      playsInline: playsInline,
      poster: thumbnailUrl || undefined,
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_vidstack_react__WEBPACK_IMPORTED_MODULE_5__.MediaProvider, {}), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_vidstack_react_player_layouts_default__WEBPACK_IMPORTED_MODULE_6__.DefaultVideoLayout, {
        icons: _vidstack_react_player_layouts_default__WEBPACK_IMPORTED_MODULE_7__.defaultLayoutIcons
      })]
    })]
  });
}

/***/ }),

/***/ "./src/video/editor.scss":
/*!*******************************!*\
  !*** ./src/video/editor.scss ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/video/index.js":
/*!****************************!*\
  !*** ./src/video/index.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./style.scss */ "./src/video/style.scss");
/* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./editor.scss */ "./src/video/editor.scss");
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./edit */ "./src/video/edit.js");
/* harmony import */ var _save__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./save */ "./src/video/save.js");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./block.json */ "./src/video/block.json");
/**
 * Registers a new block provided a unique name and an object defining its behavior.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */


/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * All files containing `style` keyword are bundled together. The code used
 * gets applied both to the front of your site and to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */



/**
 * Internal dependencies
 */




/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_5__.name, {
  /**
   * @see ./edit.js
   */
  edit: _edit__WEBPACK_IMPORTED_MODULE_3__["default"],
  /**
   * @see ./save.js
   */
  save: _save__WEBPACK_IMPORTED_MODULE_4__["default"]
});

/***/ }),

/***/ "./src/video/save.js":
/*!***************************!*\
  !*** ./src/video/save.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ save)
/* harmony export */ });
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__);
/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */


/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 *
 * @return {Element} Element to render.
 */
function save() {
  return null;
  // return (
  // 	<p { ...useBlockProps.save() }>
  // 		{ 'Blocks Video – hello from the saved content!' }
  // 	</p>
  // );
}

/***/ }),

/***/ "./src/video/style.scss":
/*!******************************!*\
  !*** ./src/video/style.scss ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "@wordpress/block-editor":
/*!*************************************!*\
  !*** external ["wp","blockEditor"] ***!
  \*************************************/
/***/ ((module) => {

module.exports = window["wp"]["blockEditor"];

/***/ }),

/***/ "@wordpress/blocks":
/*!********************************!*\
  !*** external ["wp","blocks"] ***!
  \********************************/
/***/ ((module) => {

module.exports = window["wp"]["blocks"];

/***/ }),

/***/ "@wordpress/components":
/*!************************************!*\
  !*** external ["wp","components"] ***!
  \************************************/
/***/ ((module) => {

module.exports = window["wp"]["components"];

/***/ }),

/***/ "@wordpress/i18n":
/*!******************************!*\
  !*** external ["wp","i18n"] ***!
  \******************************/
/***/ ((module) => {

module.exports = window["wp"]["i18n"];

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/***/ ((module) => {

module.exports = window["React"];

/***/ }),

/***/ "react-dom":
/*!***************************!*\
  !*** external "ReactDOM" ***!
  \***************************/
/***/ ((module) => {

module.exports = window["ReactDOM"];

/***/ }),

/***/ "react/jsx-runtime":
/*!**********************************!*\
  !*** external "ReactJSXRuntime" ***!
  \**********************************/
/***/ ((module) => {

module.exports = window["ReactJSXRuntime"];

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/ensure chunk */
/******/ 	(() => {
/******/ 		__webpack_require__.f = {};
/******/ 		// This file contains only the entry chunk.
/******/ 		// The chunk loading function for additional chunks
/******/ 		__webpack_require__.e = (chunkId) => {
/******/ 			return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key) => {
/******/ 				__webpack_require__.f[key](chunkId, promises);
/******/ 				return promises;
/******/ 			}, []));
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks
/******/ 		__webpack_require__.u = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + ".js?ver=" + {"vendors-node_modules_media-captions_dist_dev_js":"0e0c78ed198a5e2becec","node_modules_vidstack_react_dev_chunks_vidstack-CnCZVzrO_js":"8b9f55d2b59e25438043","vendors-node_modules_vidstack_react_dev_chunks_vidstack-3ZPG_odG_js":"5814cb6a6f28c0c44dc3","vendors-node_modules_vidstack_react_dev_chunks_vidstack-Bt-dOpts_js":"de8a9528b96e7372e5a2","node_modules_vidstack_react_dev_chunks_vidstack-krOAtKMi_js":"4ff380b56e89cbc12a30","vendors-node_modules_vidstack_react_dev_chunks_vidstack-CoE5RD0i_js":"c9658737830bc284f5bd","node_modules_vidstack_react_dev_chunks_vidstack-Dm1xEU9Q_js":"dccd95f776414203e66d","node_modules_vidstack_react_dev_chunks_vidstack-BM-FgV9W_js":"94fda16ecbe87090e626","node_modules_media-captions_dist_dev_srt-parser_js":"50ffa31d45042aed29cb","vendors-node_modules_media-captions_dist_dev_ssa-parser_js":"41beea3080756010972d","node_modules_media-captions_dist_dev_errors_js":"2e371149d263ab016555","vendors-node_modules_vidstack_react_dev_chunks_vidstack-CBaoV8XT_js":"9a1ccb2c0a4fc6ba7d30"}[chunkId] + "";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get mini-css chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks
/******/ 		__webpack_require__.miniCssF = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return undefined;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/load script */
/******/ 	(() => {
/******/ 		var inProgress = {};
/******/ 		var dataWebpackPrefix = "fb-blocks:";
/******/ 		// loadScript function to load a script via script tag
/******/ 		__webpack_require__.l = (url, done, key, chunkId) => {
/******/ 			if(inProgress[url]) { inProgress[url].push(done); return; }
/******/ 			var script, needAttach;
/******/ 			if(key !== undefined) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				for(var i = 0; i < scripts.length; i++) {
/******/ 					var s = scripts[i];
/******/ 					if(s.getAttribute("src") == url || s.getAttribute("data-webpack") == dataWebpackPrefix + key) { script = s; break; }
/******/ 				}
/******/ 			}
/******/ 			if(!script) {
/******/ 				needAttach = true;
/******/ 				script = document.createElement('script');
/******/ 		
/******/ 				script.charset = 'utf-8';
/******/ 				script.timeout = 120;
/******/ 				if (__webpack_require__.nc) {
/******/ 					script.setAttribute("nonce", __webpack_require__.nc);
/******/ 				}
/******/ 				script.setAttribute("data-webpack", dataWebpackPrefix + key);
/******/ 		
/******/ 				script.src = url;
/******/ 			}
/******/ 			inProgress[url] = [done];
/******/ 			var onScriptComplete = (prev, event) => {
/******/ 				// avoid mem leaks in IE.
/******/ 				script.onerror = script.onload = null;
/******/ 				clearTimeout(timeout);
/******/ 				var doneFns = inProgress[url];
/******/ 				delete inProgress[url];
/******/ 				script.parentNode && script.parentNode.removeChild(script);
/******/ 				doneFns && doneFns.forEach((fn) => (fn(event)));
/******/ 				if(prev) return prev(event);
/******/ 			}
/******/ 			var timeout = setTimeout(onScriptComplete.bind(null, undefined, { type: 'timeout', target: script }), 120000);
/******/ 			script.onerror = onScriptComplete.bind(null, script.onerror);
/******/ 			script.onload = onScriptComplete.bind(null, script.onload);
/******/ 			needAttach && document.head.appendChild(script);
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript && document.currentScript.tagName.toUpperCase() === 'SCRIPT')
/******/ 				scriptUrl = document.currentScript.src;
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) {
/******/ 					var i = scripts.length - 1;
/******/ 					while (i > -1 && (!scriptUrl || !/^http(s?):/.test(scriptUrl))) scriptUrl = scripts[i--].src;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/^blob:/, "").replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl + "../";
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"video/index": 0,
/******/ 			"video/style-index": 0
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.f.j = (chunkId, promises) => {
/******/ 				// JSONP chunk loading for javascript
/******/ 				var installedChunkData = __webpack_require__.o(installedChunks, chunkId) ? installedChunks[chunkId] : undefined;
/******/ 				if(installedChunkData !== 0) { // 0 means "already installed".
/******/ 		
/******/ 					// a Promise means "currently loading".
/******/ 					if(installedChunkData) {
/******/ 						promises.push(installedChunkData[2]);
/******/ 					} else {
/******/ 						if("video/style-index" != chunkId) {
/******/ 							// setup Promise in chunk cache
/******/ 							var promise = new Promise((resolve, reject) => (installedChunkData = installedChunks[chunkId] = [resolve, reject]));
/******/ 							promises.push(installedChunkData[2] = promise);
/******/ 		
/******/ 							// start chunk loading
/******/ 							var url = __webpack_require__.p + __webpack_require__.u(chunkId);
/******/ 							// create error before stack unwound to get useful stacktrace later
/******/ 							var error = new Error();
/******/ 							var loadingEnded = (event) => {
/******/ 								if(__webpack_require__.o(installedChunks, chunkId)) {
/******/ 									installedChunkData = installedChunks[chunkId];
/******/ 									if(installedChunkData !== 0) installedChunks[chunkId] = undefined;
/******/ 									if(installedChunkData) {
/******/ 										var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 										var realSrc = event && event.target && event.target.src;
/******/ 										error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
/******/ 										error.name = 'ChunkLoadError';
/******/ 										error.type = errorType;
/******/ 										error.request = realSrc;
/******/ 										installedChunkData[1](error);
/******/ 									}
/******/ 								}
/******/ 							};
/******/ 							__webpack_require__.l(url, loadingEnded, "chunk-" + chunkId, chunkId);
/******/ 						} else installedChunks[chunkId] = 0;
/******/ 					}
/******/ 				}
/******/ 		};
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = globalThis["webpackChunkfb_blocks"] = globalThis["webpackChunkfb_blocks"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["video/style-index"], () => (__webpack_require__("./src/video/index.js")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=index.js.map