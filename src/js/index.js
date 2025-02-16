import diff, { jsonToDate } from './main.js'
var dayInput, monthInput, yearInput, ageYears, ageDays, ageMonths
var userInput, output, triggerButton

function init() {
  dayInput = document.getElementById('dayInput')
  monthInput = document.getElementById('monthInput')
  yearInput = document.getElementById('yearInput')
  ageYears = document.getElementById('ageYears')
  ageDays = document.getElementById('ageDays')
  ageMonths = document.getElementById('ageMonths')
  triggerButton = document.getElementById('triggerButton')

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
  return {
    day: parseInt(day),
    month: parseInt(month) - 1,
    year: parseInt(year),
  }
}

function validate() {
  userInput = getInputs()
}

function getOutput() {
  const birth = jsonToDate({ ...userInput, hour: 0, minute: 0, second: 0 })
  output = diff(birth, new Date())
}

//need some validation
function renderOutput() {
  const { years, months, days } = output
  ageYears.querySelector('output').innerText = years
  ageMonths.querySelector('output').innerText = months
  ageDays.querySelector('output').innerText = days

  ageYears.querySelector('span').innerText = years > 1 ? 'years' : 'year'
  ageMonths.querySelector('span').innerText = months > 1 ? 'months' : 'month'
  ageDays.querySelector('span').innerText = days > 1 ? 'days' : 'day'
}

document.addEventListener('DOMContentLoaded', () => {
  init()
  const form = document.getElementById('myForm')
  form.onsubmit = (e) => {
    e.preventDefault()
    triggerButton.focus()
  }

  triggerButton.addEventListener('click', () => {
    validate()
    getOutput()
    renderOutput()
  })
})
