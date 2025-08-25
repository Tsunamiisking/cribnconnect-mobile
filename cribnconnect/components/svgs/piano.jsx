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
      <Path fill="url(#pattern0_311_1320)" d="M0 0H45V45H0z" />
      <Defs>
        <Pattern
          id="pattern0_311_1320"
          patternContentUnits="objectBoundingBox"
          width={1}
          height={1}
        >
          <Use xlinkHref="#image0_311_1320" transform="scale(.01563)" />
        </Pattern>
        <Image
          id="image0_311_1320"
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
