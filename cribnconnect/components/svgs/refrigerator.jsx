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
          xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAACXBIWXMAAB2HAAAdhwGP5fFlAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAABTNJREFUeJzt3VtoHFUcx/Fvk2owarUoXsC2aCmCFS9okYCggmiLadUHQWgfxIei4gWUqgiKLz54edEW9alPxap4oSgoWlFEqvSG9VLRB6GlLZakiRGtSawbH2YWZo4z2c12Zs6c+f8+MNAznLK/nfllZnazmQUREREREREREX+WAJuAX4FpYCbwZTp+LhuBxQVup0a6E/gL/zutrOVP4I7CtlbDDAFT+N9JZS+TwHUFbbNG+Qb/O6eqZUdB26wxlpHeQC3gQWDQZ6iCDAIP8/8SXOIzVN2sIb1xvvCaphxfkn6Oq/3GifT5DhA70xkf8pKiXAed8QIvKRx1KYB4EloBbgI+A0aAsZxlD3CFr4Chme87wBzcBWwF+jvMWwg8D6wqPVEDhHIEOJXo3cFOOz85X7oQSgGuBs7rcu4h4OkSszRKKKeAs53xV0QvHV0tYKL8OM0RSgFc08C47xBNEMopwDXjO0BTqADGqQDGqQDGhVKAY8541EuKBgqlAHuAt+J/HwVe9JilUUIpwAxwN3ABsAj41m+c5gjtfYCjvgM0TShHACmJCmCcCmCcCmCcCmCcCmCcCmCcCmCcCmCcCmCcCmCcCmCcCmCcCmCcCmBcXT8PsBx4wneIgi33HSBLXQtwVbxIyXQKME4FMK6up4D9wAcZ64dJn0vz5lVpNXBZYvwj8GEX8yRhLekbKG3JmbfOmfcbcEoVAXPMB444mdbmzN3S5bxKhXYKeJf0XwWfD9zmKQvASuDCxHgCeN9Tlp6EVoC/gTeddet9BAHmAY8567YCxz1k6VldrwFmsxm4PzFeBbwGfE51fzPYB9wC3Ois31zR4xcmxALsBrYDNyfW3RcvPm0HdnnOMGehnQLaHgF+9x0iYZzodrDBCbUA+4kOv794zgHwM3AD8JPvIL0I8RTQto/odfXtRLdfX0J1hW4BB4jucL4tHgcp5AIA/Au8Fy/Sg1BPAVIQFcA4FcA4FcA4FcA4FcA4FcA4FcA4FcA4FcA4FcA4FcA4FcA4FcA4FcA4FcA4FcA4FcA4FcA4FcA4FcA4FcA4FcA4FcA4FcA4FcA4FcA4FcA4FcA4FcA4FcA4FcC4kAqwHtgJvAGc6zlLY4Ryh5ClwOtE9+ZbAYwQ3ShKTlIoR4ClRDu/7VJfQZomlALM6zxFehFKAaQkKoBxKoBxKoBxobwMnHTGQ0Q3jXa1iO4g+hTRS0XpIJQCfAdMAQPxeAFwTc7cFUA/cG8FuYIXyilgHHhpDvMXlxWkaUI5AgA8A5wANgCDs8ybAl6pJFEDhFSAFvAs8AKwjPzsB4DRijIFL6QCtB0nutCTAtTlGuCEMz7NS4pyuaetf7ykqKnrSX+n3jHgIq+JirWI6EI2+RyHvCaK1eWXLAPAYeCcxLpR4GMC+xq2DKcDt5L+DMMIUcGnvSSqqQ2kf0KavDxa0DZrlH7gHfzvnLKXt+PnKhn6gMeBMfzvqKKXMaKjXF0uvIH6XAO4BoC9pL9t+zngYMbch4DLE+NNwPcl5boSeCAx3ge8mjHvYuDJxPgH4FqiN6mkS7tJ/wTlvff/kTNvuMRMa5zH2pYzb8iZt7PETCelVoejHtXxKFbHTJlUgHLUMVMmFaAcdcyUqc6/C/jDGWd9ACRLmV8qPeGM29cEndTpi65T6nwE+LSH/zNG90XpxS5625mfFB3EgjOIPgnU7evsFrCuglz3xI/Vba69zP75BZnFQmAjcIT8DTwJ7ABWVphrGPg6fuy8XIeBl4GzKswlIiIiIiIiIpLrPxjwbYZxv+QNAAAAAElFTkSuQmCC"
        />
      </Defs>
    </Svg>
  )
}

export default SvgComponent
