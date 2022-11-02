/**
 * Функция проверяет является аргумент объектом
 * */
const isObject = (arg) => {
    return arg === Object(arg)
}

/**
 * Функция копирует один объект в другой
 * */
const objectCopy = (copied, target) => {

    for(const key of Object.keys(copied)) {
        if (isObject(copied[key])){
            target[key] = {}
            objectCopy(copied[key], target[key])
        } else {
            target[key] = copied[key]
        }
    }
}

module.exports = {
    isObject,
    objectCopy
}