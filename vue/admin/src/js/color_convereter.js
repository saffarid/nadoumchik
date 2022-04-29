
/**
 * @param {String} hex
 * @param {Number} opacity
 * */
export const hexToRgba = (hex, opacity = 1) => {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    let color = {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
    }

    return `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity})`
}
