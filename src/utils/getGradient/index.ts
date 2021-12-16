//@ts-ignore
import css from "./style.module.css"
//@ts-ignore
import hitchCSS from "./style.hitch.module.css"

import { wrapRange } from "@lincode/math"

//@ts-ignore
const cssObj = VERSION === "hitch" ? hitchCSS : css

export default (i: number) => cssObj["bg" + wrapRange(i, 0, 5)]