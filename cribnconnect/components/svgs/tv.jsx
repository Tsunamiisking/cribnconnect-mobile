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
      <Path fill="url(#pattern0_360_1324)" d="M0 0H45V45H0z" />
      <Defs>
        <Pattern
          id="pattern0_360_1324"
          patternContentUnits="objectBoundingBox"
          width={1}
          height={1}
        >
          <Use xlinkHref="#image0_360_1324" transform="scale(.00781)" />
        </Pattern>
        <Image
          id="image0_360_1324"
          width={128}
          height={128}
          preserveAspectRatio="none"
          xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAADsQAAA7EB9YPtSQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANFSURBVHic7dnBaxxVAMfx7xqp0rRSa5OIHhKKUE2vhWA9SitEzx6lf0LvPVW8CN7Fq5iLf0ApbcVeRAt6axtoS6kHkdYmFUtaLGni4b3gJmhJSDNvs7/vBx4zu8mGtzNf5g0TkCRJkiRJkiRJkiRJkiRJw2QKmAMWgFXHUI8F4BtgEqBHOflXgHGU5C4wMwJ8Ccw0noy6tw8Y6wEPgAP1zUXgu2ZTUhfeBw7W/UVYvz7MNZqUujNH3zl/YcMPV7ufjzq27hxvDEBhDCCcAYQzgHAGEM4AwhlAOAMIZwDhDCCcAYQzgHAGEM4AwhlAOAMIZwDhDCCcAYQzgHAGEM4AwhlAOAMIZwDhDCCcAYQzgHAGEM4AwhlAOAMIZwDhDCCcAYQzgHAGEM4AwhlAOAMIZwDhDCCcAYQzgHAGEM4AwhlAOAMIZwDhDCCcAYQzgHAGEM4AwhlAOAMIZwDhDCCcAYQzgHAGEM4AwhlAOAMIZwDhXgSW6xZgAjgKPN7k5/8GHgH7+/6GBtubffvLPeAaMN1oMmrr6giwAnzUeiZq4swI8AuwD3gX6LWdjzqyAnwBfN5/wo8CHwDjTaakrtwDzgPXW09EktTUMNz0vU65b5mo20PAGPAqMArs7dvfUz/zUn2/3xLwpO6vPd94UN9fqvv3gT8o6+g94G4du9ZuCKAHTALvUG5U36qvp+p4udXEqsfAHeDXOm4BV4H5+nqgDWIAU8BxYKaOacqTxt3oIeVu+wrwE/AjJZaBMQgBHAROArPACcol/XlappyIv4Cnfa//y9oj7RHgFXbmEffvwEXgXN0uPue/vyWtAtgPfAx8ArxHOeBb8ZByeb1Tt79R1uL7G8YSZT3fjj2U+4e1e4tDdUxQnquvLUeTbP1K9RT4Afga+Jb/D3PHdB3AG8BnlJM/uonf/xP4mfL/innK5fQ6sLBTE9ym1yhL1jT/3rMcAw5s4rNLlAjOUK4SQ+kSsPqMcRv4CjgFvM1gLFHb1aPEcIry3W7z7GNwocksOzLP+i+7AnwPnAaONJxX145QvvNlyjHoPyZD/Yj2Q8p6fRP4FDjcdjoD4TBwFrhBOTazbacjSZIkSZIkSZIkSZIkSZJ2o38AnMMC9Ct3I38AAAAASUVORK5CYII="
        />
      </Defs>
    </Svg>
  )
}

export default SvgComponent
