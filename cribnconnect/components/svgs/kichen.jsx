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
      <Path fill="url(#pattern0_360_1328)" d="M0 0H45V45H0z" />
      <Defs>
        <Pattern
          id="pattern0_360_1328"
          patternContentUnits="objectBoundingBox"
          width={1}
          height={1}
        >
          <Use xlinkHref="#image0_360_1328" transform="scale(.00781)" />
        </Pattern>
        <Image
          id="image0_360_1328"
          width={128}
          height={128}
          preserveAspectRatio="none"
          xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAACXBIWXMAAAOwAAADsAEnxA+tAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAABUVJREFUeJzt3U1oHGUcx/Hv1jSmL6atrRYrEmi1aEVQbIMgeqgKinhQfIEK1ooHxUN7KVJsBV8u6kW9iODJt4OHglD0UlEsCqIHX2q1BUsSRJRYrWKTtskmHp5ddmazm52ZfWae2f3/PrD0yTIz+0/nl31mZp99BkRERERERERK5UKgEroIKc464CngU+B3YB44B4wB7wL3ABeEKk7yMwDsBk7jdvpij2+Bm8OUKXlYDhyi846PPmaBJ0MU20/K0LcOAoeBW5qe/w74EDgJrACuBe4HLm1abg/wWs41So5eJf6X/Suun29lCHge99dfX34GdQc96yZgjsbO/AUYSbDeg8RDcBwdGPakj2jsxPPAaIp1nyP+zrHDe3WSqxHiO/D1lOsPAhOR9Y94rU5y9wTxAGzMsI2niR8LrPZWneTuPRo77+eM27iOeIju8lOaHUsCvvaGSPv7jNs4BlTbbFMSCBmASyLtUxm3UQUmIz+vzV6OTSEDsDTSnuliO4dr/84BX3axHZMGQhfgwS7gfWAc1yVICv0QgFng49BF9KqQXYCUQFEBuAG4F3ctv5PLgQfQEX3fuBF3tD6PG9BRd5yFVwGHgN9qz03QH11UqRXxDnBr5HVu67DsNcBltfYVwJV5FSVOEQG4qE2707JJlpcuFRGAuTbtTssmWV5KbivuMm90GNc3tcd05Pk/as/9RPza/kFgTeFVizdHSDfOr9XjmcKrNiTvLuAvD9vI+jmBJJD3oND1uKHerT6keQhYVWv/CHzRYpmjwBu4rkP6TKvrAFIwHxda1gB7Sf9R7PpIezvwpoda6qrAB8BnHrcpbbxF9wd6eTzOoDOIjnwcBG72sI08LCfZEHPTfF9rP4X7EmcoK4CrA76+SZ/TeNt9O3Ato8S7gevDllN+Gg9gnAJg3ABuBo7twMqM21gXaY/gBnOE0vzx8R3AVSEK6QH/AZ9UcN/LvztwMRLGoQruMqu+WWtTtYI7Whajmq8D7CH8qZzk6xHcpBzAwgBMAX8XWo4UbSr6g04DjVMAjFMAjFMAjFMAjGs+C7gTuDhEIVKY2ExsuhBk3BLgn9BFSDCnK8CjwIu4IVStVIhPv3YGN6ljKEPAslp7Hje7eEiraQyvnwbOBqxlEDcqqq4+83orUyT80s0w8VE2O7so0Id9kVomOyxbhEka9ewLXMtO4vtquNMKOgswTgEwTgEwTgEwTgEwTgEwTgEwTgEwTgEwTgEwTgEwTgEwTgEwTgEwTgEwrowB2ICbNvZP3GCV0B7HTX3zFQtvXJ3EY7jf5WsaM6GXRhkDsAN3j4G1wLOBawHYjxsoO4q7Z3FaB3C/y1bgYY91eVHGAEQnqijDdPHd1rOyTbsUyhgAKZACYJwCYJwCYJwCYJwCYJwCYJwCYJwCYJwCYJwCYJwCYJwCYFwZAzARaY+FKiJiPNIe63L98bZLBeL7nkE+vANsxM39/0LgWsANStkPHMPdii7L+geAE7jfrVTKGIAZ3H94WfyAu8tpVke7XD9XZewCpEAKgHEKgHEKgHEKgHEKgHEKgHEKgHEKgHEKgHEKgHEKgHEKgHEKgHFZPg7eAtzuu5AUNkXaSwlbS72Guk2ErWdL2hUqnRdhGN1XqFetAv5dbAF1AcYpAMZlOQbYCxz0XYh4cR/wSpoVsgRgEjiZYT3JX+q7qKkLME4BME4BME4BME4BMC7LWcA23I2HpXy2pV1Bl4L7m5dLweeAqpdypEizuH23qKQBeBmFoJdUgZdIEIAkXUDdELAsa0VSqGngbOgiREREREREpHT+B6cRJQAcpF8ZAAAAAElFTkSuQmCC"
        />
      </Defs>
    </Svg>
  )
}

export default SvgComponent
