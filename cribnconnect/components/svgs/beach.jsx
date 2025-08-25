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
      <Path fill="url(#pattern0_310_1315)" d="M0 0H45V45H0z" />
      <Defs>
        <Pattern
          id="pattern0_310_1315"
          patternContentUnits="objectBoundingBox"
          width={1}
          height={1}
        >
          <Use xlinkHref="#image0_310_1315" transform="scale(.01563)" />
        </Pattern>
        <Image
          id="image0_310_1315"
          width={64}
          height={64}
          preserveAspectRatio="none"
          xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAB2AAAAdgB+lymcgAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAUYSURBVHic7dlXjFVVFAbgb4ZRLCBNwVGwIEI0WMaGJhZsoCZ2BTGSGKMPxsRg9EUjETXG+GB/0BhL9MUau6BiVDSIBQsI6ohiRVEEsREB4fqw9niGyZR7z70DxDl/snMyc8/+z9prr73apkCBAgUKFChQoMBGQ69NLcDGxG64Gi/iR5TS+A0f4U6MR/0mkq/bMBrTsU626M7GIkzcJJLWGFviFqwVC1uP1zAFh2M4hggFTcDdWClTxLPov9GlrhEG4w3ZYh7DiDLm9cH1WJ3mzcf23SRjt6ERX4oFLMPxOTj2wXeJ40001Ey6bkY/4dBKWIDdq+DaAz8kriuqF6370QszhcBfYacacJ6V+H7B1jXg61bcIIRdjlE15P0g8Z5WQ852Uc05OwZXCk9/Hppz8gzFOIxMXJ+II9WEQ/B0FTJ2ibwK2Ab3oA43YkYOjjpMFUrcqoN3hlQgzwnYX4TR5ZiVRimHbF3i5kS8EL1zckyT5QrPCac3BfeJTLGEW7vgGIQ78Jf2E6z5ODCnfB3iEPwjsrzDcnI04m8h5Lnt/N5XZIad5QOT8WviWCd2+xbchKdkecVqccRqgi2EVku4rQqeCxLHeznmNgjLaLGehzCsnfculVnC7zo+ZhVhaiL8AttWwXNN4nm4wnmNeD3NXaHjnZ0mW/wfeFD4nKowDmuE1sdWyXWxEG5OBXPGyirKZhE12sMpssVPE/VJ1ZiIVYn0xhrwjZGd3a7yhz3xqFB8CS9hYCfvz07vPVCtkHU4Ci/INHqv2tXuCxLnXGHarVGPI3C/rLL8E5fp3JTrZc71uEoF6o9DcaHQ3tc2bGBcWilhFxgjE/ZvUTY/lp6tS+Q1SZ6dy+DsJRRVwiWVCHOHzMRajyWiVN2xErIKMEYWVdqOZlyHXSrkfFLm+SeLJImwnJG4HPOEZY1pMafbcRE+Sx+ei1fTi+srX1fFaMJewmEtF7XAkpxcw4UfaNm01cKietuw2bIEx+b8xmaP4aKGWGNDq1qFR3Ci1JytOjZu5hggokwfUV4vFKZfE/QRjmbfKjjGiXOat1U+VDjnchxkp2hQfmXYG+eLM1QSdcHtKmuGNImucYtpzhWJTrkW2R9XyTz+76KY6lvm/DqpiKsTLa23hRZnJsEWiP7cz+n3wThAdHYnyBKRT4WJ1QtFTMcreAffC4fWIKq2USLMniqr0Jal5w7p2YwnkjyfCLNdlb7XiINwNM4Q3aJ/sFiWFf4posAsodSlImXuJ0rrXUVuc46w4BFETv+h8vr3LeMtnJQ+2iTa2WsrmL8U14od206Eu58qmL9a1BGjxCZO0nE47Wg0Y7vWJrefuKU5UsTewaIcXZl2Yj7exTPiIqMthuB0sctN6e+BSdgVYqdawutMsXut0SC6ycfgYNFcHShMdUVS0PtJ+U+m/7XFvjg5zd9bWF4/Yck/4VthHS8LKy9QzUXlUOEMvxclZ55vnycsZXFOGfbDmcIXrcnJgWh0lIsB4sIzrweuF/27ebLz+LQw2XIxDHeJY1QSpj1J+ev4L+q1RIGPRRo6XZSbzaL2Xi7OUaNohR0tWtUt3ZXWUaAjD7yN8CejRQvtbNnlSdsoMFtUn3PETdOKtMhBadGHitxhvLCgtlFgKR4XfuJD4btWJv4dkqzHiUi2SNQiPTYKPM+GiUdPiALfiDxluvx+5/+FIgokFFFAz4sCnye+HhsFZlBEgQIFChQoUKBAgQIFChQoUKAn4l8NGkyS4nqqOgAAAABJRU5ErkJggg=="
        />
      </Defs>
    </Svg>
  )
}

export default SvgComponent
