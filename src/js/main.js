const DAYMS = 24 * 3600 * 1000
const DEFAULT_DATE = new Date(1960, 6, 26)
const DEFAULT_DATE_JSON = dateToJson(DEFAULT_DATE)
const JS_TEXT_ANIMATE_INTERVAL_MS = 30
const JS_FIX_DURATION_TEXT_ANIMATE_DEFAULT_MS = 200
const DEBOUNCE_DEFAULT_TIMEOUT_MS = 1000

function isBst(year) {
  return new Date(year, 1, 30).getMonth() === 1
}

function isBst2(year) {
  return year % 100 === 0 ? year % 400 : year % 4
}

/* const a = new Date(2025, 0, 30)
const b = new Date(2024, 8, 21)
console.log(daysBetweenDates(b, a)) */
function daysBetweenDates(origin, final) {
  return Math.floor((final.getTime() - origin.getTime()) / DAYMS)
}

function dateToJson(date) {
  return {
    year: date.getFullYear(),
    month: date.getMonth(),
    day: date.getDate(),
    hour: date.getHours(),
    minute: date.getMinutes(),
    second: date.getSeconds(),
  }
}

function jsonToDate(json) {
  for (let key in json) {
    if (json[key] === undefined || typeof json[key] !== 'number') {
      json[key] = DEFAULT_DATE_JSON[key]
    }
  }
  const { year, month, day, hour, minute, second } = json

  return new Date(year, month, day, hour, minute, second)
}

function addMonth(date, n) {
  const json = dateToJson(date)
  json['month'] += n
  return jsonToDate(json)
}

function addYear(date, n) {
  const json = dateToJson(date)
  json['year'] += n
  return jsonToDate(json)
}

/*
const a = new Date(2025, 0, 30)
const b = new Date(2024, 8, 21)
console.log(monthsBetweenDates(b, a))
*/
function monthsBetweenDates(origin, final) {
  const { year: oYear, month: oMonth, day: oDay } = dateToJson(origin)
  const { year: fYear, month: fMonth, day: fDay } = dateToJson(final)

  return 12 * (fYear - oYear) + (fMonth - oMonth) + (fDay < oDay ? -1 : 0)
}

/* const a = new Date(2025, 8, 21)
const b = new Date(2024, 8, 21)
console.log(yearsBetweenDates(b, a)) // 1 */
function yearsBetweenDates(origin, final) {
  const { year: oYear, month: oMonth, day: oDay } = dateToJson(origin)
  const { year: fYear, month: fMonth, day: fDay } = dateToJson(final)

  return fYear - oYear - (fMonth >= oMonth && fDay >= oDay ? 0 : 1)
}

/* 
const a = new Date()
const b = new Date(1998, 8, 25)
const output = diff(b, a)
console.log(JSON.stringify(output))
*/
function diff(origin, final) {
  let y = yearsBetweenDates(origin, final)
  origin = addYear(origin, y)
  let m = monthsBetweenDates(origin, final)
  origin = addMonth(origin, m)
  let d = daysBetweenDates(origin, final)
  return { years: y, months: m, days: d }
}

function jsTextAnimateFixedInterval(
  placeholder,
  start,
  end,
  mutator = (val) => {},
  intervalDurationMs = JS_TEXT_ANIMATE_INTERVAL_MS
) {
  // debugger
  if (placeholder) {
    placeholder.innerText = String.raw`${start}`
    const interval = setInterval(() => {
      if (start === end) {
        clearInterval(interval)
      }
      start = mutator(start)
      placeholder.innerText = String.raw`${start}`
    }, intervalDurationMs)
    return interval
  }
}

function jsTextAnimateFixedDuration(
  placeholder,
  start,
  end,
  mutator = (val) => {},
  durationMs = JS_FIX_DURATION_TEXT_ANIMATE_DEFAULT_MS
) {
  // debugger
  if (placeholder) {
    let possibleValues = []
    for (let _start = start; _start !== end; _start = mutator(_start)) {
      possibleValues.push(_start)
    }
    const intervalCount = possibleValues.length
    const intervalDurationMs = Math.floor(durationMs / intervalCount)
    // debugger
    return jsTextAnimateFixedInterval(
      placeholder,
      start,
      end,
      mutator,
      intervalDurationMs
    )
  }
  return
}

function jsArrayBasedFixedIntervalTextAnimate(
  placeholder,
  array = [],
  intervalDurationMs = JS_TEXT_ANIMATE_INTERVAL_MS
) {
  if (placeholder) {
    const _array = array.slice()
    const interval = setInterval(() => {
      let next
      if ((next = _array.shift()) !== undefined) {
        placeholder.innerText = String.raw`${next}`
      }
    }, intervalDurationMs)
    return interval
  }
}

function jsArrayBasedFixedDurationTextAnimate(
  placeholder,
  array = [],
  durationMs = JS_FIX_DURATION_TEXT_ANIMATE_DEFAULT_MS
) {
  if (placeholder) {
    const intervalCount = array.length
    const intervalDurationMs = Math.floor(durationMs / intervalCount)
    // debugger
    return jsArrayBasedFixedIntervalTextAnimate(
      placeholder,
      array,
      intervalDurationMs
    )
  }
}

function arrayPick(array, pickLimit) {
  if (array && array.length > 2 * pickLimit) {
    // for very long range
    let step = Math.floor(array.length / pickLimit)
    const _array = array.slice(0, -1).filter((v, i) => i % step === 0)
    _array.push(array.slice(-1)[0])
    // debugger
    return _array
  }
  return array.slice(-pickLimit)
}

function arrayFromRange(start, end, step = 1) {
  const array = []
  for (let i = start; i < end; i += step) {
    array.push(i)
  }
  array.push(end)
  return array
}

export default diff
export {
  DEFAULT_DATE_JSON,
  jsonToDate,
  dateToJson,
  jsArrayBasedFixedDurationTextAnimate as jsTextAnimate,
  arrayPick,
  arrayFromRange,
  JS_FIX_DURATION_TEXT_ANIMATE_DEFAULT_MS,
}
