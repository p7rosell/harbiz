const Joi = require('joi').extend(require('@joi/date'))
const InvalidDataError = require('../errors/InvalidDataError')

class CalendarValidator {
  getAvailableSpots (params) {
    const schema = Joi.object({
      calendar: Joi.number().required(),
      date: Joi.date().format('DD-MM-YYYY').utc(),
      duration: Joi.number().required()
    })
    const { error } = schema.validate(params)

    if (error) {
      throw new InvalidDataError(error)
    }
  }
}

module.exports = CalendarValidator
