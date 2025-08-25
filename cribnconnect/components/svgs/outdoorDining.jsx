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
      <Path fill="url(#pattern0_311_1316)" d="M0 0H45V45H0z" />
      <Defs>
        <Pattern
          id="pattern0_311_1316"
          patternContentUnits="objectBoundingBox"
          width={1}
          height={1}
        >
          <Use xlinkHref="#image0_311_1316" transform="scale(.01563)" />
        </Pattern>
        <Image
          id="image0_311_1316"
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
