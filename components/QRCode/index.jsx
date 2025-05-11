import { useMemo } from 'react'
import {
  Svg,
  Defs,
  G,
  Path,
  Rect,
  Image,
  ClipPath,
  LinearGradient,
  Stop,
} from '../Svg'
import genMatrix from './genMatrix'
import transformMatrixIntoPath from './transformMatrixIntoPath'

const renderLogo = ({
  size,
  backgroundColor,
  logo,
  logoSize,
  logoBackgroundColor,
  logoMargin,
  logoBorderRadius,
}) => {
  const logoPosition = (size - logoSize - logoMargin * 2) / 2
  const logoBackgroundSize = logoSize + logoMargin * 2
  const logoBackgroundBorderRadius =
    logoBorderRadius + (logoMargin / logoSize) * logoBorderRadius

  return (
    <G x={logoPosition} y={logoPosition}>
      <Defs>
        <ClipPath id='clip-logo-background'>
          <Rect
            width={logoBackgroundSize}
            height={logoBackgroundSize}
            rx={logoBackgroundBorderRadius}
            ry={logoBackgroundBorderRadius}
          />
        </ClipPath>
        <ClipPath id='clip-logo'>
          <Rect
            width={logoSize}
            height={logoSize}
            rx={logoBorderRadius}
            ry={logoBorderRadius}
          />
        </ClipPath>
      </Defs>

      <Rect
        width={logoBackgroundSize}
        height={logoBackgroundSize}
        fill={backgroundColor}
        clipPath='url(#clip-logo-background)'
      />
      <G
        x={logoMargin} y={logoMargin}
        clipPath='url(#clip-logo)'
      >
        <Rect
          width={logoSize}
          height={logoSize}
          fill={logoBackgroundColor}
        />
        <Image
          width={logoSize}
          height={logoSize}
          preserveAspectRatio='xMidYMid slice'
          href={logo}
        />
      </G>
    </G>
  )
}

const QRCode = ({
  value = 'duxui',
  size = 100,
  color = 'black',
  backgroundColor = 'white',
  logo,
  logoSize = size * 0.2,
  logoBackgroundColor = 'transparent',
  logoMargin = 2,
  logoBorderRadius = 0,
  quietZone = 0,
  enableLinearGradient = false,
  gradientDirection = ['0%', '0%', '100%', '100%'],
  linearGradient = ['rgb(255,0,0)', 'rgb(0,255,255)'],
  ecl = 'M',
  onError
}) => {
  const result = useMemo(() => {
    try {
      return transformMatrixIntoPath(genMatrix(value, ecl), size)
    } catch (error) {
      if (onError && typeof onError === 'function') {
        onError(error)
      } else {
        // Pass the error when no handler presented
        throw error;
      }
    }
  }, [value, size, ecl])

  if (!result) {
    return null
  }

  const { path, cellSize } = result

  return (
    <Svg
      viewBox={[
        -quietZone,
        -quietZone,
        size + quietZone * 2,
        size + quietZone * 2,
      ].join(' ')}
      width={size}
      height={size}
    >
      <Defs>
        <LinearGradient
          id='grad'
          x1={gradientDirection[0]}
          y1={gradientDirection[1]}
          x2={gradientDirection[2]}
          y2={gradientDirection[3]}
        >
          <Stop offset='0' stopColor={linearGradient[0]} stopOpacity='1' />
          <Stop offset='1' stopColor={linearGradient[1]} stopOpacity='1' />
        </LinearGradient>
      </Defs>
      <Rect
        x={-quietZone}
        y={-quietZone}
        width={size + quietZone * 2}
        height={size + quietZone * 2}
        fill={backgroundColor}
      />
      <Path
        d={path}
        strokeLinecap='butt'
        stroke={enableLinearGradient ? 'url(#grad)' : color}
        strokeWidth={cellSize}
      />
      {logo &&
        renderLogo({
          size,
          backgroundColor,
          logo,
          logoSize,
          logoBackgroundColor,
          logoMargin,
          logoBorderRadius,
        })}
    </Svg>
  )
}

export {
  QRCode
}
