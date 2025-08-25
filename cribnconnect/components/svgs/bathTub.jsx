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
      <Path fill="url(#pattern0_369_1356)" d="M0 0H45V45H0z" />
      <Defs>
        <Pattern
          id="pattern0_369_1356"
          patternContentUnits="objectBoundingBox"
          width={1}
          height={1}
        >
          <Use xlinkHref="#image0_369_1356" transform="scale(.01563)" />
        </Pattern>
        <Image
          id="image0_369_1356"
          width={64}
          height={64}
          preserveAspectRatio="none"
          xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAHYAAAB2AH6XKZyAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAABWRJREFUeJztm2uIFlUYgJ9v3V3WcmnDbuaum5kb1Y/S6EZSURtlISoEpj9kJTB/FBFRFkn3HyLRmlZ2oagoiNSCUkqKrrBRpGRi1600slVoS61tdd39th/vGc7s7HwzZ85cv9wHDnO+b87lfd85c857LgPmTABuAz4EeoABYA+wCegA6iKUVXXMA/YCwwHhB+CivARMk2XAEFrRbuAZYCXwIvC7614/MDsXKVPiCuAIotx+YCFQ8qSpA24HDqt0B4AzshMxPWqA7YhS/wAzQ9LPRbeUjemKlg2Xo5v2csM8z6v0ZWBySnJlxkpEmQHgeMM8M9FGuykluRKlJuDeVHXtBv4yLO8rxGAAp1nKlClBBjhOXfdHLPNvdT0hujjZE2SAKBwLPII4SBPVf8uArcANCdWROe8i73JXSLpTgW8IdpKeYvTwWXhMDFALfIFWdBuwFPEc70NeH+feXWkKmwYmBuhAK/gSo+cDLcAutC8xkSrCxABOmj3IZMmP2WgjLUlSwCSI2wmeo67vIU/Yjy1Anyd9YYhrAOepBw2VZWR+ANAYs77EqU2onOuQ0aASpp5k5sQ1wBF1na6CafrCENcADwOLMRvj/0UmS1WDqSNU1STlClctYwbIW4C8GTNA3gLkzVFvgKQ8waQ4HVgAtCGLLEEcAn4E1gPfpSFM1n7ACmCQ4IUVv1AGVmHZmr0tYDxwCuLZHaP+a0CeTJrMR7xKhx5klymIeqAZkfVOZDH2hZA8w8gW36iyW4E30btAeYXdwHkhSrg5E/g2Yh0DyMZNi1PIZGRBI0/FnbAggvIO7ZZ1/QZMqgUeQk9lXwU+VQmy4mL0StE2i/xbXfENyOJMJUrIjtdC5ME/CLAPUXizReVJsBj9VGz6mkZX/jsM87yj0vfUIJ0cyP7+0cL36tpUA3ytfixCxt//O23IKwCwowTMAd5SfwwhncNQhgJNAE5S8WnAzxHzNwIHVbwXvf7oxzik93d8hjnOjeWMPAWSV4jbB5iGQaXziKWss4FbkT09gE+QDjJtWoELVTxuC9iOf192MnCZij8NrEW280YxC22l9oiC2OIeBWYgK8hRQosrf6VRwO0rzHLfKNpkyMYPiMXYdDhvATzcC/wRMU8D8LhthUUwQNkVX4/M8aPQhDZAOSihH0V4BdwjzbkW+We44nujZi6CAbrQ54pWAWdFyDsVWKPiA8AHUSv3vgKHXPEGsqEPmZU9iii0EzmZdjAoE7JkNh3x7gAeo7LfMt4VD1xoaUaPl0tDBEiSEnIu0cYbLQPr0Ibw42ZX+hEHOL0tYB/SlOrJ9jDDMHA3sh5xI+ISBykEovhupOP8MiSto8thDLzb95VAu8ISVhG/IDpt8d7w6wQ3qWsrcG2KQmXF9ehTq0aLPk3I0dhh5OhrEXwFW+qAHYguvejTr6GsQHcaa0LSFpkn0HrcEyVjPfC5K/P9VNdJzxLwAFr+z7D4pqkV2aBwCtlAdXwD0Ay8gZa7B9HFimnAT67C+oBO4FKK4UU6jEPm+asRGR15uwlZZTJp1ieqghd5/u9HNlSC1uCyoAlpmV7P9RXkW6aos8uKXIUMkTYbmFmFQeBt4EpTpWw6tmZkfe18ZA2xDviVkWtxtcgXZyDv4E6LekA8uEkq/hGioEMbMAXZz1yL7BB9jLTKzHD8hU7P//PRT6UjRvlLXOXM89zrVP+bfs7jS1odmTOROgC8HqOc19AKpjI5S8MAU4CrVfxl5ISoLf3IBAngGlL4ECspN/cC9LeFl6Bncs8lUPazwC3Iw1qNODVOnbnzJ5V75CSP1nQF1NObYD2RWYf/sNiLDJtJ0a7K9Bv2noxT8H/qvhoV8czr+wAAAABJRU5ErkJggg=="
        />
      </Defs>
    </Svg>
  )
}

export default SvgComponent