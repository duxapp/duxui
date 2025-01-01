let ease

export const Easing = {
  step0(n) {
    return n > 0 ? 1 : 0
  },

  step1(n) {
    return n >= 1 ? 1 : 0
  },

  linear(t) {
    return t
  },

  ease(t) {
    if (!ease) {
      ease = Easing.bezier(0.42, 0, 1, 1)
    }
    return ease(t)
  },

  quad(t) {
    return t * t
  },

  cubic(t) {
    return t * t * t
  },

  poly(n) {
    return (t) => Math.pow(t, n)
  },

  sin(t) {
    return 1 - Math.cos((t * Math.PI) / 2)
  },

  circle(t) {
    return 1 - Math.sqrt(1 - t * t)
  },

  exp(t) {
    return Math.pow(2, 10 * (t - 1))
  },

  elastic(bounciness = 1) {
    const p = bounciness * Math.PI
    return t => 1 - Math.pow(Math.cos((t * Math.PI) / 2), 3) * Math.cos(t * p)
  },

  back(s = 1.70158) {
    return t => t * t * ((s + 1) * t - s)
  },

  bounce(t) {
    if (t < 1 / 2.75) {
      return 7.5625 * t * t
    }

    if (t < 2 / 2.75) {
      const t2 = t - 1.5 / 2.75
      return 7.5625 * t2 * t2 + 0.75
    }

    if (t < 2.5 / 2.75) {
      const t2 = t - 2.25 / 2.75
      return 7.5625 * t2 * t2 + 0.9375
    }

    const t2 = t - 2.625 / 2.75
    return 7.5625 * t2 * t2 + 0.984375
  },

  bezier(
    x1,
    y1,
    x2,
    y2,
  ) {
    const _bezier = require('./bezier').default
    return _bezier(x1, y1, x2, y2)
  },

  in(easing) {
    return easing
  },

  out(easing) {
    return t => 1 - easing(1 - t)
  },

  inOut(easing) {
    return t => {
      if (t < 0.5) {
        return easing(t * 2) / 2
      }
      return 1 - easing((1 - t) * 2) / 2
    }
  },
}
