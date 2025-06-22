import type { EasingFunction } from 'svelte/transition'

interface PropertyConfig {
  from?: number
  to?: number
  duration?: number
  easing?: EasingFunction
}

interface VersatileTransitionParams {
  duration?: number
  delay?: number
  easing?: EasingFunction

  // Transform properties
  scale?: number | PropertyConfig
  x?: number | PropertyConfig
  y?: number | PropertyConfig
  rotate?: number | PropertyConfig

  // Filter properties
  blur?: number | PropertyConfig

  // Style properties
  opacity?: number | PropertyConfig

  // Advanced
  origin?: string
  css?: (t: number, u: number) => string
}

// Default values for each property
const DEFAULTS = {
  scale: 1,
  x: 0,
  y: 0,
  rotate: 0,
  blur: 0,
  opacity: 1,
  duration: 300
} as const

interface NormalizedProperty {
  from: number
  to: number
  duration: number
  easing?: EasingFunction
  // Pre-calculated optimization values
  range: number
  durationRatio: number
  hasAnimation: boolean
}

function normalizeProperty(
  value: number | PropertyConfig | undefined,
  defaultValue: number,
  globalDuration: number,
  globalEasing?: EasingFunction
): NormalizedProperty {
  let from: number, to: number, duration: number, easing: EasingFunction | undefined

  if (value === undefined) {
    from = to = defaultValue
    duration = globalDuration
    easing = globalEasing
  } else if (typeof value === 'number') {
    from = value
    to = defaultValue
    duration = globalDuration
    easing = globalEasing
  } else {
    from = value.from ?? defaultValue
    to = value.to ?? defaultValue
    duration = value.duration ?? globalDuration
    easing = value.easing ?? globalEasing
  }

  return {
    from,
    to,
    duration,
    easing,
    // Pre-calculate optimization values
    range: to - from,
    durationRatio: 0, // Will be set after totalDuration is calculated
    hasAnimation: from !== to
  }
}

export function versatile(
  node: Element,
  params: VersatileTransitionParams = {}
): {
  duration: number
  delay?: number
  easing?: EasingFunction
  css: (t: number, u: number) => string
} {
  const {
    duration: globalDuration = DEFAULTS.duration,
    delay = 0,
    easing,
    origin = 'center',
    css: customCss
  } = params

  // Normalize all properties
  const scale = normalizeProperty(params.scale, DEFAULTS.scale, globalDuration, easing)
  const x = normalizeProperty(params.x, DEFAULTS.x, globalDuration, easing)
  const y = normalizeProperty(params.y, DEFAULTS.y, globalDuration, easing)
  const rotate = normalizeProperty(params.rotate, DEFAULTS.rotate, globalDuration, easing)
  const blur = normalizeProperty(params.blur, DEFAULTS.blur, globalDuration, easing)
  const opacity = normalizeProperty(params.opacity, DEFAULTS.opacity, globalDuration, easing)

  // If no specific animations are defined, use subtle defaults
  const hasAnimations =
    params.scale !== undefined ||
    params.x !== undefined ||
    params.y !== undefined ||
    params.rotate !== undefined ||
    params.blur !== undefined ||
    params.opacity !== undefined

  if (!hasAnimations) {
    // Apply subtle defaults
    scale.from = 0.95
    scale.range = scale.to - scale.from
    scale.hasAnimation = true
    opacity.from = 0
    opacity.range = opacity.to - opacity.from
    opacity.hasAnimation = true
  }

  // Calculate total duration (longest individual duration)
  const totalDuration = Math.max(
    scale.duration,
    x.duration,
    y.duration,
    rotate.duration,
    blur.duration,
    opacity.duration
  )

  // Pre-calculate duration ratios for performance
  scale.durationRatio = totalDuration / scale.duration
  x.durationRatio = totalDuration / x.duration
  y.durationRatio = totalDuration / y.duration
  rotate.durationRatio = totalDuration / rotate.duration
  blur.durationRatio = totalDuration / blur.duration
  opacity.durationRatio = totalDuration / opacity.duration

  // Pre-calculate static CSS parts
  const transformOriginCss = `transform-origin: ${origin};`

  // Create optimized animation functions for each property
  const scaleAnimator = scale.hasAnimation
    ? (t: number) => {
        const progress = Math.min(1, t * scale.durationRatio)
        const easedProgress = scale.easing ? scale.easing(progress) : progress
        return scale.from + scale.range * easedProgress
      }
    : null

  const xAnimator = x.hasAnimation
    ? (t: number) => {
        const progress = Math.min(1, t * x.durationRatio)
        const easedProgress = x.easing ? x.easing(progress) : progress
        return x.from + x.range * easedProgress
      }
    : null

  const yAnimator = y.hasAnimation
    ? (t: number) => {
        const progress = Math.min(1, t * y.durationRatio)
        const easedProgress = y.easing ? y.easing(progress) : progress
        return y.from + y.range * easedProgress
      }
    : null

  const rotateAnimator = rotate.hasAnimation
    ? (t: number) => {
        const progress = Math.min(1, t * rotate.durationRatio)
        const easedProgress = rotate.easing ? rotate.easing(progress) : progress
        return rotate.from + rotate.range * easedProgress
      }
    : null

  const blurAnimator = blur.hasAnimation
    ? (t: number) => {
        const progress = Math.min(1, t * blur.durationRatio)
        const easedProgress = blur.easing ? blur.easing(progress) : progress
        return blur.from + blur.range * easedProgress
      }
    : null

  const opacityAnimator = opacity.hasAnimation
    ? (t: number) => {
        const progress = Math.min(1, t * opacity.durationRatio)
        const easedProgress = opacity.easing ? opacity.easing(progress) : progress
        return opacity.from + opacity.range * easedProgress
      }
    : null

  // Pre-determine which properties need processing
  const needsTransform = !!(scaleAnimator || xAnimator || yAnimator || rotateAnimator)
  const needsFilter = !!blurAnimator
  const needsOpacity = !!opacityAnimator

  return {
    duration: totalDuration,
    delay,
    easing,
    css: (t: number, u: number) => {
      let css = ''

      // Handle transforms - build directly without arrays
      if (needsTransform) {
        let transformCss = 'transform: '
        let hasTransforms = false

        if (scaleAnimator) {
          const currentScale = scaleAnimator(t)
          if (currentScale !== 1) {
            transformCss += `scale(${currentScale})`
            hasTransforms = true
          }
        }

        if (xAnimator) {
          const currentX = xAnimator(t)
          if (currentX !== 0) {
            if (hasTransforms) transformCss += ' '
            transformCss += `translateX(${currentX}px)`
            hasTransforms = true
          }
        }

        if (yAnimator) {
          const currentY = yAnimator(t)
          if (currentY !== 0) {
            if (hasTransforms) transformCss += ' '
            transformCss += `translateY(${currentY}px)`
            hasTransforms = true
          }
        }

        if (rotateAnimator) {
          const currentRotate = rotateAnimator(t)
          if (currentRotate !== 0) {
            if (hasTransforms) transformCss += ' '
            transformCss += `rotate(${currentRotate}deg)`
            hasTransforms = true
          }
        }

        if (hasTransforms) {
          css += transformCss + ';' + transformOriginCss
        }
      }

      // Handle filter
      if (needsFilter && blurAnimator) {
        const currentBlur = blurAnimator(t)
        if (currentBlur !== 0) {
          css += `filter: blur(${currentBlur}px);`
        }
      }

      // Handle opacity
      if (needsOpacity && opacityAnimator) {
        const currentOpacity = opacityAnimator(t)
        if (currentOpacity !== 1) {
          css += `opacity: ${currentOpacity};`
        }
      }

      // Add custom CSS if provided
      if (customCss) {
        const customCssResult = customCss(t, u)
        if (customCssResult) {
          css += customCssResult
        }
      }

      return css
    }
  }
}
