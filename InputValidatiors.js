const moment = require('moment');

class InputValidator {
  static validateDate(date) {
    if (!moment(date, 'DD-MM-YYYY').isValid()) {
      throw new Error('Fecha no válida'); // TODO: Translate message
    }
  }

  static validateDuration(duration) {
    if (typeof duration !== 'number' || duration <= 0) {
      throw new Error('Duración no válida'); // TODO: Translate message
    }
  }
}
