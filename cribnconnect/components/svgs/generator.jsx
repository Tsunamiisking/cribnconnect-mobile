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
      <Path fill="url(#pattern0_430_2439)" d="M0 0H45V45H0z" />
      <Defs>
        <Pattern
          id="pattern0_430_2439"
          patternContentUnits="objectBoundingBox"
          width={1}
          height={1}
        >
          <Use xlinkHref="#image0_430_2439" transform="scale(.00781)" />
        </Pattern>
        <Image
          id="image0_430_2439"
          width={128}
          height={128}
          preserveAspectRatio="none"
          xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAACXBIWXMAAB2HAAAdhwGP5fFlAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAC5dJREFUeJztnXuwVVUZwH/3QqCACMjDTB7XkoeaWqRIpkKaqQ2VljFTSYOUWVHTw5xyCiurMY1MTbIZDa2cRjCzsFREJSLUxhdYICKmeAFBCOR9gXtPf3z3dvf+9jn77L3P3mvtfc76zayBc85ea317r+/u9fq+b4HD4XA4HA6Hw+FwOBqIJot19wOmAOcCw4EBFmUxyR5gA/B34F5go11x7DADeB0oNXjaC1wL9K7tcRaHJuBW7D/4vKWlNMgb8HvYf9h5TQ8CzYmfbEJMjgHGAs8DPT3f7QBuAR4BthuUxSZ9gHcDXwVGqd8+A/zGtECmuB2/xm8AjrUqkV36A0vwP5NVViXKkCZgM/6b/YhVifLB0chA0PtcxliVKCOG4L/JbUAPqxLlhwfwP5sLTVZuatAxVH1eD7QbqjvvvKo+62eVKaYUQNfTYajeIqD/EIy+GZPMAg4HzgPGA0cCw6iuSP2A0zyfdwFPJKi7HhmLjAW6eAFojZi3A9iELKo9jXQnO1KVzsMpwP1AG/bnzC6VT23AAuA9FdowEYOBuxFts32DLkVLHcDvgSPKtGcsTgBezsENuZQsre1sw4qEjQFOBv6GLFhongf+jPRXm3GDOls0I7OGsci6SrnG3gGcCSyPU/AwZHqiNerJzsIc+eQs4J8E2+0VYk4v/1qmkBvxr+M78klP4CaC7Xd/1ALOLpP5p6mL6cia2QTbcXKUjI+rTI/hlm2LSA9gMf62XFYt00iVoR3ZunQUk5OQNvS2aUtYhq+oixdlLKAjex7F36Zf9v6ol3Anqs9/yk4uhyF0G/raWCvAUerzc6mLU53+yOqjIx30/N/XxloB3qo+v566OOFc3FnnJuD7huuuVzaoz/qP3Mc6/P3F8IyEKscxyKpVV90HkV1ER20Mx9+mr3l/NG6FWoFm4NfAYZ7veiBbz44MyYsCfAtZxnQYJg8K8C7gattCNCq2FaA3cCfQy7IcDYvtzZ1rgXcarG8MZge2abAFmcqVTFRmchZwBsFlSp3elmJ9s6rUlef02xruO3QWoDGlAAPK1PUyou1ZKcB20m8Yk2lYwvvO5TTwF/iVqwOYDuzLsM41GZadNW8gzjSpY2MMcBHwKfXdTxDzsyz5BOKdHLoSlkO2Ic9nv4nKsu4CjiL4mn+W7llAq/otzS6gUclNF9AE3IbfVLkNmIYh7XYEMakAM4Hz1XffRiyMHTkhqy5gLLBblb2EoAK6LiB9rHcBPYE7kMgYXbwJXILzJ7COCQX4LjBBfTeToFu0wwJZTwMnAFep7+YDv4uY/0TEA7kSOyj2/D53pDkG6AusVuWtJ9xhUY8BoqTlwMAa5Kx3rI0BrgdGez6XkACRW0PylBLUcyKyyONIQFZdwPnA5eq7XyKx8MJYiT9YQlQ2R7xuYsLybfJfxMHDSEidNLqAIxBDRG85q/HPAirRAvwReKpCeoVgF/Ao0d5kN5TJW5S0IML9VcL4buDdqowDBGcBSeiJeCd7y94OjIiY/03SbxiTKWwwHEaoAqTdBUwj2B+vBCZ1Js02ZK97b4SyZwGnqu9mIkobheWIDUIRaUX2UFJHB4hYh/+vfgRVXhkehiBTsriWvA8AF1S55jQkvLpXYecTb/B3JHAlxRsDbAV+jnSjSRiO/4+klZA3ey1dwIdI9mprJzxcel/gRZWn2nTS0Y2xaeCTBL1QotBMeFc0G39M4RJwKeHTSUdE0hwDbAHeC3yS6t3A14G3RCjzAuAy9d0c4KHY0jkiYcomcJeqp2+ZawYjx6l4r1uDcxeLi/XdwKTMwT/1OQh8GlEeR0rkVQGmI57CXq5BxhmODMlDFzCK4KLNU0QbMziCFKoLaAbm4g9OuQcZWB6wIlGdkzcFuILgiuE3kHUARwbY9g30cjzBqCALgV+lVH4zMq0sol/AArJ1mvk/tsYAg+h2gOxKbxAMWVML+tCqIqUlJD/hLZe+gVoB5hC86bSNPLzhZ4qYkv4xFEIB9FkEd2ZQ50Ok3yim0hqSR2s1uh2cFO/rrRU5VDFtpgJfIrr9QF7YglhTFcYiKAr6DdCV2okY0NgRmUKtA8xGglM7DJEnBViJWP04DJIXBWhDVvuMzHUd3dhSAL2sO4uYZ9o40sGWAngjWC/EnUhiDVvTwMuARzr/Pw/nJWwNWwqwn9pCnzlSIi+DQIclnAI0OE4BGpy87AXUMwOA0xG3ttGIPUKXCdw+5ISUlxCzt6WYP6XFh80TQ+qJXkgwzAeRNY+ou34dwD+AL5Ke+Xsut4PrlZ5I4yWJdKLTNiS+UjmfiTg4BTDEeCTmYdq2AK8B59UgVyHsAYrO15B4vpVM1/+NBLJYAfwHiWsA8pofiZyZMAk5pVUPzI9GDvO+AfFuztQuwL0B4tGMGGuU+8vdhbh1HxejvJGIYayOp9yV/gIcGlNG1wVkRBNy0lm5gdxcYGgNZR8GXIesmOryFxHuTq9xCpARPyDYOFuBKSnWcQYSAEvXcxfRrYSdAmTAFIKGrOuAcRnUNYqgyXwJdQh0CLEUQI9iT0gicZ0zGDna1vuctpNN43cxCPiXqnMvEoS7GsepfCvDLn5YXXxuYpHrF+3DcJDapmlRGYXEDPTWHSVQxgdUnsVhF2vvmWuSSlunvJ3gyt53DNZ/saq7RHUr6qvV9beHXTyV4OsiqUtSPXIL/uezCvOHXmoHl7C3QBPSht7r9XlNPg4nOPWYWrPI9cGhBN3LQh9mRpyqZGhH1g/K8VF17X4iHD93h8r0KhIDsNH5GP7nshF7K6lLlSzfLHPNQKTtvNdFssJqQcy0vRmXUPumRNG5Ff8z+ZlFWb6gZHlY/d4HGex5rzlAjGN6yy1yPIuMRBsVPUU2MfKvRIuSZRfdewjHILYFuv1+FKeCZiSEqy5kD3Lgc9EcLGulB8G3YtyQuGmjQ+i9H2mbPQTbbRkVlo/DRvgDkcgUp1f4/Tlkl2sT9R+/py8SmLqLjdiPNLIYOCvCdc8AZ9O9AxmLQxC7fa1RjZ7y4MUUpV3uocqbqppR6D4kUsdUoodlbwSihLfPmj0hv7UCnwU+joTcS4U+SADHRcjyp+2/QptpRY3PMg3m45fpAOJt9XnkzR2JpKt8A4AxyAbIXM/3JeQ42GpMwj+Kfhy/v2De6Id/yXcTyU/wSIsl+A/A+CDiZ2mUZvxaGNVcSc+pr8hEuvTogXSHXpkHWZUouCM5MkkhthxD9NbpKitSRKed4IkdE20I0sk78FscbSf6yS4+bCmAtpPLuwKAHFnjxeZCkD6F/QkseVgn6QKGqDy7KYaL2ofxy70Z8zuBXejT06JaB6VOEgU4U+V5JjPp0qU34qzhlf1SC3K8T8lwEIuLUkkU4HKV567MpEsfffjkWmJMuVKgieAmz70G6w+QRAFuVHlMWtTUygiCewI/Nlj/NFV3icpL9UZIogALVZ6LMpMuG2YTvOcLDdQ7muBBGvcZqDeUJAqgHSeztKbNggHIlMt7DzuBkzKscygSL1jX2ZJhnZGIqwD98dvT76eYR8Gcg9yr9943IQO0tBmO7LrqV//nMqgrNnEVYIK6PtRGPedcSbBR2oAZKdYxmeBJ7CXSO0SjZuIqwHR1/T2ZSpc9N1F+s+gPJFya7WQw3RHCddn3kaO3ZlwFuE5dX3S/gybgesorQRtwG3LwdVSORwaZOyuUOY+UF5+ysGodH/LbKepzEZaAwyghFrkvADfjd93uhXQHMxBbiscQQ5IXkQbuQLyAWxBjzcnIDms52oEfIq7jpbRvohb0GyBuOtm8yJkxDlmTr+V5lEuryWZwmQrNBL1ko6Z24gc7yDtNyPG2+rj7JGk9cnJKbvr7Sqwg2Q0usyGsIZqRzaN5lLfSrZQOIJHFLiFeEIjEpOH3Nw7pn+KMetcCV3X+W+8cgox9JgDHIvP6voiRyW5kmvcS8DQSIm6nHTEdDofD4XA4HA6Hw9EA/A9Uf6bHor4yEQAAAABJRU5ErkJggg=="
        />
      </Defs>
    </Svg>
  )
}

export default SvgComponent
