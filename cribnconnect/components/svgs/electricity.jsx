import * as React from "react"
import Svg, { Path, Defs, Pattern, Use, Image } from "react-native-svg"

function SvgComponent(props) {
  return (
    <Svg
      width={45}
      height={45}
      viewBox="0 0 45 45"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      {...props}
    >
      <Path fill="url(#pattern0_430_2459)" d="M0 0H45V45H0z" />
      <Defs>
        <Pattern
          id="pattern0_430_2459"
          patternContentUnits="objectBoundingBox"
          width={1}
          height={1}
        >
          <Use xlinkHref="#image0_430_2459" transform="scale(.01563)" />
        </Pattern>
        <Image
          id="image0_430_2459"
          width={64}
          height={64}
          preserveAspectRatio="none"
          xlinkHref="data:image/png;base64,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"
        />
      </Defs>
    </Svg>
  )
}

export default SvgComponent
