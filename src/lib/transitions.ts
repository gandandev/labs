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
}

function normalizeProperty(
  value: number | PropertyConfig | undefined,
  defaultValue: number,
  globalDuration: number,
  globalEasing?: EasingFunction
): { from: number; to: number; duration: number; easing?: EasingFunction } {
  if (value === undefined) {
    return { from: defaultValue, to: defaultValue, duration: globalDuration, easing: globalEasing }
  }

  if (typeof value === 'number') {
    return { from: value, to: defaultValue, duration: globalDuration, easing: globalEasing }
  }

  return {
    from: value.from ?? defaultValue,
    to: value.to ?? defaultValue,
    duration: value.duration ?? globalDuration,
    easing: value.easing ?? globalEasing
  }
}

function getPropertyProgress(t: number, totalDuration: number, propertyDuration: number): number {
  // Calculate how far we are in the property's individual timeline
  const propertyProgress = Math.min(1, (t * totalDuration) / propertyDuration)
  return propertyProgress
}

function interpolate(from: number, to: number, progress: number): number {
  return from + (to - from) * progress
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
    opacity.from = 0
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

  return {
    duration: totalDuration,
    delay,
    easing,
    css: (t: number, u: number) => {
      // Calculate progress for each property based on its individual duration
      const scaleProgress = getPropertyProgress(t, totalDuration, scale.duration)
      const xProgress = getPropertyProgress(t, totalDuration, x.duration)
      const yProgress = getPropertyProgress(t, totalDuration, y.duration)
      const rotateProgress = getPropertyProgress(t, totalDuration, rotate.duration)
      const blurProgress = getPropertyProgress(t, totalDuration, blur.duration)
      const opacityProgress = getPropertyProgress(t, totalDuration, opacity.duration)

      // Apply individual easing to each progress
      const easedScaleProgress = scale.easing ? scale.easing(scaleProgress) : scaleProgress
      const easedXProgress = x.easing ? x.easing(xProgress) : xProgress
      const easedYProgress = y.easing ? y.easing(yProgress) : yProgress
      const easedRotateProgress = rotate.easing ? rotate.easing(rotateProgress) : rotateProgress
      const easedBlurProgress = blur.easing ? blur.easing(blurProgress) : blurProgress
      const easedOpacityProgress = opacity.easing
        ? opacity.easing(opacityProgress)
        : opacityProgress

      // Interpolate values
      const currentScale = interpolate(scale.from, scale.to, easedScaleProgress)
      const currentX = interpolate(x.from, x.to, easedXProgress)
      const currentY = interpolate(y.from, y.to, easedYProgress)
      const currentRotate = interpolate(rotate.from, rotate.to, easedRotateProgress)
      const currentBlur = interpolate(blur.from, blur.to, easedBlurProgress)
      const currentOpacity = interpolate(opacity.from, opacity.to, easedOpacityProgress)

      // Build CSS
      let css = ''

      // Transform
      const transforms = []
      if (currentScale !== 1) transforms.push(`scale(${currentScale})`)
      if (currentX !== 0) transforms.push(`translateX(${currentX}px)`)
      if (currentY !== 0) transforms.push(`translateY(${currentY}px)`)
      if (currentRotate !== 0) transforms.push(`rotate(${currentRotate}deg)`)

      if (transforms.length > 0) {
        css += `transform: ${transforms.join(' ')};`
        css += `transform-origin: ${origin};`
      }

      // Filter
      if (currentBlur !== 0) {
        css += `filter: blur(${currentBlur}px);`
      }

      // Opacity
      if (currentOpacity !== 1) {
        css += `opacity: ${currentOpacity};`
      }

      // Custom CSS injection
      if (customCss) {
        css += customCss(t, u)
      }

      return css
    }
  }
}
