class InvalidError extends Error {
  constructor(options = {}) {
    super()
    this.name = this?.constructor?.name || 'InvalidError'
    this._options = options
  }

  get form() {
    if ('form' in this._options) {
      return this._options['form']
    }
  }

  get json() {
    if ('json' in this._options) {
      return this._options['json']
    }
  }

  get inputValue() {
    if ('inputValue' in this._options) {
      return this._options['inputValue']
    }
  }

  get inputField() {
    if ('inputField' in this._options) {
      return this._options['inputField']
    }
  }
}

// to group InvalidError errors
class GroupedError extends Error {
  constructor(errors = []) {
    super()
    this.name = this?.constructor.name
    this.errors = []
  }

  push(err) {
    this.errors = [...this.errors, err]
  }

  empty() {
    return this.errors.length === 0
  }
}

class InvalidDateError extends InvalidError {}

class NonCoherentDateError extends InvalidError {}

class InvalidDateMonthError extends InvalidError {}

class InvalidDateDayError extends InvalidError {}

class InvalidDateYearError extends InvalidError {}

class RequiredFieldError extends InvalidError {}

export {
  InvalidDateError,
  NonCoherentDateError,
  InvalidDateDayError,
  InvalidDateMonthError,
  InvalidDateYearError,
  GroupedError,
  RequiredFieldError,
}
