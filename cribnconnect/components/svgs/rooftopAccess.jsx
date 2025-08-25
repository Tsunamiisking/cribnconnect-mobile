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
      <Path fill="url(#pattern0_430_2427)" d="M0 0H45V45H0z" />
      <Defs>
        <Pattern
          id="pattern0_430_2427"
          patternContentUnits="objectBoundingBox"
          width={1}
          height={1}
        >
          <Use xlinkHref="#image0_430_2427" transform="scale(.00781)" />
        </Pattern>
        <Image
          id="image0_430_2427"
          width={128}
          height={128}
          preserveAspectRatio="none"
          xlinkHref="data:image/png;base64,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"
        />
      </Defs>
    </Svg>
  )
}

export default SvgComponent
