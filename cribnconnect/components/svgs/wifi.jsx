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
      <Path fill="url(#pattern0_307_1597)" d="M0 0H45V45H0z" />
      <Defs>
        <Pattern
          id="pattern0_307_1597"
          patternContentUnits="objectBoundingBox"
          width={1}
          height={1}
        >
          <Use xlinkHref="#image0_307_1597" transform="scale(.01563)" />
        </Pattern>
        <Image
          id="image0_307_1597"
          width={64}
          height={64}
          preserveAspectRatio="none"
          xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAE69AABOvQFzamgUAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAABDFJREFUeJzt2VuIVVUcx/GPZ3LooulYRiWNlVakQlBGKkpGaZEFJUS9FVS+lF0eKnooqCCirB67mCZG0EtRFD1kN83AqJegyCKztLKLmsdLkY1TD2sPjmfWOXPO7LXPMdxfWMyZvff6/39r7b3W+q//oqSkpKSkpORIZVSb/Z2IHhyPcRiTXd+LKnZjJ3a0S1CRHTANl2AGzs3+n9hk3d/xJTbiC7yPrwrQmJRjcQNW4kf8m7hsxQpcj2Pa1KammIbHsF36RtcrVTyH8/OKH+kQGIWr8QBmtlDvL/wkNKAqjH3CXDAuK5O09oY/xSN4s4U6uViITwz/lvbiLdyDRTgTlSbsV7JnF+HezMbeJvxtwIIE7avLVLw3jIhteBzz0Z3Qd7cwoT6BX4bR8C6mJPStgruxr47DA3gb12J0Ssd1GI3Fmc8DdTTtw52a++IaMhUf13HSj1cxPa+THMzAa5mWmMb1wnAaEQuEoCRm+B1ckEN4amZijbjWHbi0VYNLsD9i7I/s3uHKdeLLcR/ua8ZAlxDIxHrydZySXHJ6TsUb4m1YLrQxShdWRyo13XuHGUvwj6HteQVH1T5cr/FVIeD5v3K5MGyH7YRY4zfjrAQiKsIktRTPYh02CWP176xsz66tzZ5ZKkyyuZcxnIPvDW3f6oEH5kRufofJOZxWcCVexm8R+82WX/ESrpCvM04XXmit/VkM7YA8jR+L+8V7PG/ZnNkeO0Jtkw3thNkDN5cJyYgP0TsC493CpDNcmJqibBcm5aNHoLNXGGZVoc1JEiKzsQpnN3hmpxCjfyYkODZl1/Zk98dighB5TseFuEzIHtVjI24SNmYdYbSQB+gTf1P7hATGXA3W3gZ0YZ4Ql9Tbh/ThUZFlrWgmCG80JqqKBzE+ob/xmc3ddXyu0fhrScpUfB0R0Y9nhMRnUUwUMkGxzc9GibfBMaYIubla5z8IY7ZdLMSWiI6tcuz+hqNXWCJrna7HSUU5bcAJ+CCiZwvOKMLh+oizVdJmflqlWzyKXVeEs9oJaKU0oWpeKnjRodp2FeHoSYc2fiRLW1HUbuOXNVux1UDooqzOhhbrDaYH5wmT1cBSuUsIjj6X7+3Nyv7m0VcIPbhLEFYvcBoIbDYICc22retFMgYPCyFvqzH/HjyE49quOhFzhM867+bnW4N2bakp6nT4RjwvvkT2C5uib/Bzdm2SsJmaWUfTftxqUBLjcOYW8VB1m3BMdlqDur3CcVhsW92PmwtTnYj5hk5yB4Q9Qiubox4h5q89+enDxenkpqc2pf4nrslhb3FmY7DNFTk1FsrtDgrdL5zw5uUqhx7S3JbAZmFUcIdwADEvod25mc0kB54lJSUlJSWd52Q8jaey30ccHzkY3KztsJaOUFVwDq8ZOhlVvTDo9/KOqegwsxzM45WUlJSUlJSUtJX/AAJEGuHFv8wfAAAAAElFTkSuQmCC"
        />
      </Defs>
    </Svg>
  )
}

export default SvgComponent
