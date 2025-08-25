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
      <Path fill="url(#pattern0_310_1314)" d="M0 0H45V45H0z" />
      <Defs>
        <Pattern
          id="pattern0_310_1314"
          patternContentUnits="objectBoundingBox"
          width={1}
          height={1}
        >
          <Use xlinkHref="#image0_310_1314" transform="scale(.01563)" />
        </Pattern>
        <Image
          id="image0_310_1314"
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
