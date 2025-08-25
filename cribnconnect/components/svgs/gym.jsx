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
      <Path fill="url(#pattern0_308_1312)" d="M0 0H45V45H0z" />
      <Defs>
        <Pattern
          id="pattern0_308_1312"
          patternContentUnits="objectBoundingBox"
          width={1}
          height={1}
        >
          <Use xlinkHref="#image0_308_1312" transform="scale(.01563)" />
        </Pattern>
        <Image
          id="image0_308_1312"
          width={64}
          height={64}
          preserveAspectRatio="none"
          xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAABuwAAAbsBOuzj4gAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAQNSURBVHic7ZpBaB1VGIW/8xioYIiRRrsRKqQixLaLKq0ggZqFdCMkC13oqrUrFbTQhRbBTSnuGkGhYFN3LpSSglDQQlxko4sUSa2bpBAVlNhYW2ygLW1/F/d/9iVv5mneu/NuzZsDwzD3zj3/+c/M3Llz78jM6GXUUgtIjcqA1AJSozIgtYDUqAxILSA1KgNSC0iNyoDUAlKjMqCTxpIySU9K2hJL0Dpib/HYWUdEZrbuDdgMfATcAMy3n4GD7fCtM/ZBj1WPe8O1bG6Lrw0BA8CcB78KnAO+BW552WSJyU96jFse85xrMNc00A0DTnrAqcaAwHZg3uvGS0h+3Lnnge1rLsiU152MbgCwCXgG2A+8CdwEfgf6c87d60LOlmDAWefem1PX75puusb9rnlT2wYAAl4Hrjc8b/XtdEGbGvAXsFSCAUvOXSuoP52j87rnoCLeVj3oJ8Br3sl8AfwAPO7uXs5rYGZ3Jf0BbG3B2y4eBX4ys7sF9XVNnwKLhEfyReBjYBeh82xGgZtjBAcXgeGG8n1efqLFlVoMtNHvAAMWW9Sf8HP2NZQN1/UAY3ntisYBh3x/wMx+LLok9ztc+wE/PJR3TpMBkmqEW2bZzKbXVM8BF4CvIuosFZ7DMrDLc1uFvD7gEaAPuJhD9iuwM7bILuASsIeQ21JjRd4joG4oSoSm3FYZIOlhYFtha2lA0ueSnitBXDewzXP8BzUASSOS5oArwEwLgt3AS8CrpUksFzPAFUlzkkYAMklPA9OE/uAXYAF4voCgtmZfCEkTneuNjm8Id/gOYFrSsxlwjJD8e8AHhI7itwjB3orAERuvEAZM7wBHgWMZoXdcASbM7I4UrQ8cj0XkmIpB4jlOAO8CezLgIcIQcyVGgIZAZ2LyRbwwmNmKpGVgazUlllpAavS8ARlwDRiU1Gdm12MRSxqLQDNvZk1D8k4hqQ8YBK5lwHfAC8BhSUcjxonRa69I6m8xB7Bu+CzyYeBB4OsMOAKMAu8TJkDmI8X6MALH9zGTBz4DngAeA24DRzIzm5U0Spg52eGVHcPM3o7BExn1Ee4F4A0zm80AzGwG2OkfCk/R+nvg/4wR4KKZ/VkvWPUW8IqFbqvqIhYak4f81+BG/nGwKbc8Ay4TppOHSpfTPQwRcmqazW4ywHvd84SxwWj52sqF5zAInM97oxSNBI/7/pSk4bLElQ3XfsoPj+edk7swYmZnJE0SxgWzkr7k3sLI/Y6XJe3m3sLIA4QF2/yv015fGvsvgXtzcbSFkN5aHs8R0ts/SLiQDfOLjJy0Lfin5RBw1cyW/u38mPAfswaAS2Z2u22eTgzYCOj5KbHKgNQCUqMyILWA1KgMSC0gNSoDUgtIjcqA1AJSo+cN+Bu40zkLaiP5HQAAAABJRU5ErkJggg=="
        />
      </Defs>
    </Svg>
  )
}

export default SvgComponent
