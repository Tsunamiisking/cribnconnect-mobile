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
      <Path fill="url(#pattern0_308_1309)" d="M0 0H45V45H0z" />
      <Defs>
        <Pattern
          id="pattern0_308_1309"
          patternContentUnits="objectBoundingBox"
          width={1}
          height={1}
        >
          <Use xlinkHref="#image0_308_1309" transform="scale(.01563)" />
        </Pattern>
        <Image
          id="image0_308_1309"
          width={64}
          height={64}
          preserveAspectRatio="none"
          xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAB2HAAAdhwGP5fFlAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAABQFJREFUeJztm1loXkUUx39p2qSt1foVqdq6VIVSLShaQbEmDcQFlYY+qKgPbqAI4kNBbCNUIkJpwTdBivqoYkSoVkXqgkv6Epcnt1Rxa9qaptbPGG2Nxnw+nDPM7Xzb3O2799r8YZgvs5x7Zu6Zs80NzGIWsziR0ZY1AxFQAjYAfcAq4Cxt3w+MAK9pKWfCXYpYAPQDvwGVJqUMbAbmZ8JpClgGfIJd4NvAfYgELNJyoba9Exj3sc4tNJYB+5AFjQBdHnO6gb06Zx8F3oQF2Df/PnBqiLkl4EOdO0xBj0M/9s2HWbxBCfhGaWxKkK+WoIRVeK7YD1Ct+P4ChoDLnbE9WMVYSo3bFHAPVuG5GKC+BTgCnOGMf1f77nIJzUmM3eTRp/XLDcY8jvgybcgZfwNYAqx3xhkafU57rjfgIq2HPMdPAZ/p7+VO30dar3Yn5XkDjOk64Dm+E1hTZ85+rd2NyTUmkXO7qEbfAOF0wCnaN+ESyrMEHNTa9639DewBrgfGnD4jTT+7k/K8AV9p3cjzCyrBTh37aY1x3Vp/6XbkeQN2aX1rArQMjV1uR5434FXkzF6Ln/9fDz1AL+JUFWoDysB2/f0s0VzhJToXYBsFzBHMxwZDHxDOlf1fBEMgVmAUWcherEJrhB5sEDRKgcNhg+VIcqNWQuQkLauoTogME3Hx9yJ+9ShiX5uloBqVacQz2w08CCyOwhAiwpvxT4ltIobY7/R4SNTyC/AQ0ROyJSRS3InkCQzdEW27mwTC3jVK6FxgXkxacxERvh14C8vwIOK8xIWhVxhcAxxCmH6e+Kn5wm0AwHmIX15BFFccFHIDQLy7GWAcidaiItYGZH0zNIj46a9zfKQ2BryJmL5mMIvPei2RcB2ygD+othb/4pfJLbQEdABHkaCnP9B+PrARaAcuBT5vQKPQEgDiJM0AtzjtTyGL29hkfiwJmBthzmLCR5EnO89qQ251u4CF+vcgcAmwBevDQ3V6qyV4hPQ8wVrlKOIyV5AMbj82l/9oE15TkYBGBCcQkQ2DSWSBQfqHkfTVbiS46UZc2S5sAmQSkYwTBr3I5k4DTyIOUzPEkoC8ZYTeA55DtH8H8EO27GSDi5E3Oo7fC0rFFU5CCU5TO6N7NaLoyshV1h01xhxQGj53Ai03g75oB8522tYiub12/fsy4AXk9ueZwLifkEzOOfhfjeUKw8hbWee0G9O2HfEnzBX4OMd7cmZcr8ezchcNzgOOIdrcTX+NIcwuDbQd1LYzA20t24A0rMBqJBf3LdWXkd9pfbPWXcDpiL0/lAIvkZGEEnyxBt0Ngf4xJOKrAI8544a0/UYPXnNpBX4HbqpD+05sNmgCWbyrjM3V+AMevOZOB/hiKbWP4ApEf7REAtI0g80wXqOtA9iBtQhTrWMnW5SAG7Dmc0prn1vhXOqAOOV74Ff9vcKD18IegSDKiNl8BVGgO4CvgR8z5CkTrMdagNs856QiAeuQM9kqdAJXagF4Gniphc+vQlY64AhygxwGsSSgXir5CuQjg6TxBBIrbAH+0baHgdOA+5G7wmMhaZrFFyIt/ifC8MJAm/nHhpUh6HQg3/yYvEEF+Rp0q/blFkltwDbqH6OtiXCaEpLaAPPmrwq0rcVKQm5hTJz5gmMOkvisABeEoFNP8eU+MDKfrbnlMOGcsmbWJLdYicT65sOrGeALwlucwm7ALPKG/wCFxDYOGggK0QAAAABJRU5ErkJggg=="
        />
      </Defs>
    </Svg>
  )
}

export default SvgComponent
