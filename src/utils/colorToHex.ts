const d = document.createElement("div")
document.body.appendChild(d)
export default (color: string) => {
    d.style.color = color
    const rgb = getComputedStyle(d).color
    const hex = "#" + rgb.slice(4,-1).split(",").map(x => (+x).toString(16).padStart(2, "0")).join("")
    return hex
}