const dict = {}




module.exports.storeInstance = function (key, instance) {

    if (dict.hasOwnProperty(key)) throw new Error(`Instance of ${dict} already exists`)

    dict[key] = instance

    return instance

}




module.exports.retrieveInstance = function (key) {

    if (dict.hasOwnProperty(key)) return dict[key]

    throw new Error(`Instance of ${key} does not exists`)

}