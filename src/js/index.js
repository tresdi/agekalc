import diff, { jsonToDate } from './main.js'
import {
  isInvalidRequiredInput,
  isPastOrPresent,
  isValidDate,
  isValidDateDay,
  isValidDateMonth,
  isValidDateYear,
} from './validator.js'
import {
  NonCoherentDateError,
  InvalidDateDayError,
  InvalidDateMonthError,
  GroupedError,
  RequiredFieldError,
  InvalidDateYearError,
  InvalidDateError,
} from './exceptions.js'

var form, dayInput, monthInput, yearInput, ageYears, ageDays, ageMonths
var triggerButton

function init() {
  dayInput = document.getElementById('dayInput')
  monthInput = document.getElementById('monthInput')
  yearInput = document.getElementById('yearInput')
  ageYears = document.getElementById('ageYears')
  ageDays = document.getElementById('ageDays')
  ageMonths = document.getElementById('ageMonths')
  triggerButton = document.getElementById('triggerButton')
  form = document.getElementById('myForm')

  Array(dayInput, monthInput, yearInput).forEach((input) => {
    input.value = ''
  })
  Array(ageYears, ageMonths, ageDays).forEach((div) => {
    div.querySelector('output').innerText = '--'
  })
  yearInput.max = new Date().getFullYear()
}

function getInputs() {
  const day = dayInput.value
  const month = monthInput.value
  const year = yearInput.value
  // debugger
  return {
    year: parseInt(eval(year)),
    month: parseInt(eval(month)) - 1,
    day: parseInt(eval(day)),
  }
}

function requiredValidate(inputField) {
  if (isInvalidRequiredInput(inputField))
    throw new RequiredFieldError({ inputField })
}

function validateField(inputId, ...validators) {
  const inputElement = document.getElementById(inputId)
  if (inputElement) {
    try {
      for (let validator of validators) {
        validator(inputElement)
      }
    } catch (err) {
      throw err
    }
  }
}

function validate() {
  // per field validation
  const groupError = new GroupedError()
  try {
    validateField('dayInput', requiredValidate, (inputField) => {
      if (!isValidDateDay(inputField.value))
        throw new InvalidDateDayError({ inputField })
    })
  } catch (err) {
    groupError.push(err)
  }

  try {
    validateField('monthInput', requiredValidate, (inputField) => {
      if (!isValidDateMonth(inputField.value))
        throw new InvalidDateMonthError({ inputField })
      return true
    })
  } catch (err) {
    groupError.push(err)
  }
  try {
    validateField('yearInput', requiredValidate, (inputField) => {
      let isAnywayInvalid = false
      try {
        if (
          !isValidDateYear(inputField.value) ||
          parseInt(inputField.value) > new Date().getFullYear()
        )
          throw new InvalidDateYearError()
      } catch (e) {
        throw new InvalidDateYearError({ inputField })
      }
    })
  } catch (err) {
    groupError.push(err)
  }
  if (!groupError.empty()) throw groupError
  /* Per field validation end */
  /* ************************************************************************* */
  const userInputs = getInputs()
  // check wrong date (incorrect) like 30/02/2000
  if (!isValidDate(userInputs)) {
    throw new NonCoherentDateError({ json: userInputs, form })
  }
  if (!isPastOrPresent(userInputs)) {
    throw new InvalidDateError({ json: userInputs, form })
  }

  return userInputs
}

function getOutput() {
  const birth = jsonToDate({ ...validate(), hour: 0, minute: 0, second: 0 })
  return diff(birth, new Date())
}

//need some validation
function renderOutput() {
  const { years, months, days } = getOutput()
  ageYears.querySelector('output').innerText = isNaN(years) ? '--' : years
  ageMonths.querySelector('output').innerText = isNaN(months) ? '--' : months
  ageDays.querySelector('output').innerText = isNaN(days) ? '--' : days

  ageYears.querySelector('span').innerText =
    years > 1 ? 'years' : isNaN(years) ? 'year(s)' : 'year'
  ageMonths.querySelector('span').innerText =
    months > 1 ? 'months' : isNaN(months) ? 'month(s)' : 'month'
  ageDays.querySelector('span').innerText =
    days > 1 ? 'days' : isNaN(days) ? 'day(s)' : 'day'
}

function addValidationAttribute(inputField, attrName, attrValue = '') {
  inputField && inputField.parentNode.setAttribute(attrName, attrValue)
}

function removeValidationAttribute(inputField, attrName) {
  inputField && inputField.parentNode.removeAttribute(attrName)
}

document.addEventListener('DOMContentLoaded', () => {
  init()
  form.onsubmit = (e) => {
    e.preventDefault()
    triggerButton.focus()
  }

  triggerButton.addEventListener('click', () => {
    try {
      // clear previous errors
      Array(dayInput, monthInput, yearInput).forEach((input) => {
        removeValidationAttribute(input, 'data-invalid')
        removeValidationAttribute(input, 'data-required')
      })
      validate()
      console.log('hello')
      form.removeAttribute('data-invalid')
      form.removeAttribute('data-nonvalid')
      Array(dayInput, monthInput, yearInput).forEach((input) => {
        removeValidationAttribute(input, 'data-invalid')
        removeValidationAttribute(input, 'data-required')
      })
      getOutput()
      renderOutput()
    } catch (err) {
      switch (err.name) {
        case GroupedError.name:
          const errorList = err?.errors
          if (errorList) {
            let erroneousFields = { invalid: [], required: [] }
            for (const e of errorList) {
              switch (e.name) {
                case InvalidDateDayError.name:
                case InvalidDateMonthError.name:
                case InvalidDateYearError.name:
                  if (e?.inputField) {
                    addValidationAttribute(e.inputField, 'data-invalid')
                    erroneousFields.invalid.push(e.inputField)
                  }
                  break
                case RequiredFieldError.name:
                  if (e?.inputField) {
                    addValidationAttribute(e?.inputField, 'data-required')
                    erroneousFields.required.push(e.inputField)
                  }
                  break
                default:
                // do nothing
              }
            }
          }
          break
        case NonCoherentDateError.name:
          err?.form.setAttribute('data-invalid', '')
          break
        case InvalidDateError.name:
          err?.form.setAttribute('data-nonvalid', '')
          break
        default:
          alert('Unknown error')
      }
    }
  })
})
