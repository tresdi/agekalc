import { dateToJson } from './main.js'

function isInteger(value, acceptNegative = true) {
  if (typeof value === 'string') {
    const parsed = parseFloat(value)
    if (isNaN(parsed)) return false
    else
      return (
        Number.isInteger(parsed) &&
        (acceptNegative || (parsed >= 0 && !acceptNegative))
      )
  }
  //   if (!isActualNumber(value)) return false
  else
    return (
      Number.isInteger(value) &&
      (acceptNegative || (value >= 0 && !acceptNegative))
    )
}

function isInteger2(value, acceptNegative = true) {
  if (isActualNumber2(value)) {
    value = eval(value)
    return Number.isInteger(value) && (acceptNegative || value >= 0)
  }
  return false
}

function isActualNumber(value) {
  return (
    value !== null &&
    value !== '' &&
    ['object', 'boolean'].indexOf(typeof value) === -1 &&
    !isNaN(value)
  )
}

function isActualNumber2(value) {
  if (typeof value === 'string') {
    try {
      return typeof eval(value.trim()) === 'number'
    } catch (err) {
      // value with leading zero is treated as octal, which cause a SyntaxError
      // console.error(err)
      return false
    }
  } else return typeof value === 'number' || typeof value === 'bigint'
}

function isInRange(value, start, end, endIncluded = true) {
  /*   if (Array(start, end).some((v) => !isActualNumber(v)))
    throw new Error('Either start or end or both is an invalid number')
 */
  if (start > end) throw new Error('start must be lesser than end')
  if (endIncluded) return value >= start && value <= end
  else return value >= start && value < end
}

function isValidDateMonth(value) {
  return isInteger(value) && isInRange(value, 1, 12)
}

function isValidDateMonth2(value) {
  return isInteger2(value) && isInRange(value, 1, 12)
}

function isValidDateDay(value) {
  return isInteger(value) && isInRange(value, 1, 31)
}

function isValidDateDay2(value) {
  return isInteger2(value) && isInRange(value, 1, 31)
}

function isValidDateYear(value) {
  return isInteger2(value)
}

function isValidDate(date) {
  const { year, month, day } = dateToJson(date)

  return (
    isValidDateDay(day) &&
    isValidDateMonth(month + 1) &&
    year <= new Date().getFullYear()
  )
}

// {year, month, day}
// month must be 0 based to be coherent
function isValidDate2(json) {
  const { year, month, day } = json
  const {
    year: _year,
    month: _month,
    day: _day,
  } = dateToJson(new Date(year, month, day))
  return year === _year && month === _month && day === _day
}

function isInvalidRequiredInput(inputElement) {
  //   debugger
  if (inputElement?.required) {
    return inputElement?.value.trim() == false
  }
  return false
}

function isPastOrPresent(json) {
  const { year, month, day } = json
  const {
    year: thisYear,
    month: thisMonth,
    day: thisDay,
  } = dateToJson(new Date())
  if (year > thisYear) {
    return false
  }
  if (year === thisYear && month > thisMonth) {
    return false
  }
  if (year === thisYear && month === thisMonth && day > thisDay) {
    return false
  }
  return true
}

export {
  isValidDateDay2 as isValidDateDay,
  isValidDateMonth2 as isValidDateMonth,
  isValidDate2 as isValidDate,
  isValidDateYear,
  isInvalidRequiredInput,
  isPastOrPresent,
}
