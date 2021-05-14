export const Every = (test, ...values) => values.length && values.every(test)

export const Type = (type, ...values) => Every(value => typeof value === type, ...values)

export const Class = (clazz, ...values) => Every(value => value instanceof clazz, ...values)

export const Prototype = (proto, ...values) => Every(value => Object.prototype.toString.call(value) === proto, ...values)

export const True = (...values) => Every(value => value === true, ...values)

export const False = (...values) => Every(value => value === false, ...values)

export const Undefined = (...values) => Every(value => value === undefined, ...values)

export const Null = (...values) => Every(value => value === null, ...values)

export const NaN = (...values) => Every(Number.isNaN, ...values)

export const Num = (...values) => Every(Number.isFinite, ...values)

export const Int = (...values) => Every(Number.isSafeInteger, ...values)

export const Str = (...values) => Type('string', ...values)

export const Arr = (...values) => Every(Array.isArray, ...values)

export const Obj = (...values) => Prototype('[object Object]', ...values)

export const Fun = (...values) => Class(Function, ...values)

export const Err = (...values) => Class(Error, ...values)

export const Match = (regex, ...values) => Every(value => regex.test(value), ...values)
