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
      <Path fill="url(#pattern0_616_2464)" d="M0 0H45V45H0z" />
      <Defs>
        <Pattern
          id="pattern0_616_2464"
          patternContentUnits="objectBoundingBox"
          width={1}
          height={1}
        >
          <Use xlinkHref="#image0_616_2464" transform="scale(.00781)" />
        </Pattern>
        <Image
          id="image0_616_2464"
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
