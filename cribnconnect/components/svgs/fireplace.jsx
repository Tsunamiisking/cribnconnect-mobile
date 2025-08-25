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
      <Path fill="url(#pattern0_311_1324)" d="M0 0H45V45H0z" />
      <Defs>
        <Pattern
          id="pattern0_311_1324"
          patternContentUnits="objectBoundingBox"
          width={1}
          height={1}
        >
          <Use xlinkHref="#image0_311_1324" transform="scale(.01563)" />
        </Pattern>
        <Image
          id="image0_311_1324"
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
