const moment = require('moment/moment')

class CalendarServiceUtils {
  /**
   * Converts a time in ISO format to a timestamp value.
   *
   * @param {string} dateISO - The date in ISO format.
   * @param {string} time - The time in 'HH:mm' format.
   * @returns {number} - A timestamp value representing the combined date and time.
   */
  getTimestamp (dateISO, time) {
    return moment(dateISO + ' ' + time).valueOf()
  }

  /**
   * Converts a time in ISO format to a Moment object.
   *
   * @param {string} dateISO - The date in ISO format.
   * @param {string} hour - The time in 'HH:mm' format.
   * @returns {Object} - A Moment object representing the combined date and time.
   */
  getMomentHour (dateISO, hour) {
    return moment(dateISO + ' ' + hour)
  }

  /**
   * Adds a specified number of minutes to a time and returns it in 'HH:mm' format.
   *
   * @param {string} hour - The time in 'HH:mm' format.
   * @param {number} min - The number of minutes to add.
   * @returns {string} - The updated time in 'HH:mm' format.
   */
  addMinutes (hour, min) {
    return moment(hour).add(min, 'minutes').format('HH:mm')
  }

  /**
   * Converts a time in ISO format to a JavaScript Date object in UTC.
   *
   * @param {string} dateISO - The date in ISO format.
   * @param {string} hour - The time in 'HH:mm' format.
   * @returns {Object} - A JavaScript Date object representing the combined date and time in UTC.
   */
  convertISOToMoment (dateISO, hour) {
    return moment.utc(dateISO + ' ' + hour).toDate()
  }

  /**
   * Converts a time in UTC format to 'HH:mm'.
   *
   * @param {string} hour - The time in UTC format.
   * @returns {string} - The time in 'HH:mm' format.
   */
  convertUtcHHMM (hour) {
    return moment.utc(hour).format('HH:mm')
  }
}

module.exports = CalendarServiceUtils
