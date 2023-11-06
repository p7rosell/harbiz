class InvalidDataError extends Error {
  constructor (error) {
    super(error)
    this.name = 'GlobalInvalidDataError'
    this.code = 400
    this.error = error
  }
}

module.exports = InvalidDataError
