const fs = require('fs')
const moment = require('moment/moment')

class ConfigService {
  getCalendarData (calendar) {
    return JSON.parse(fs.readFileSync(`./calendars/calendar.${calendar}.json`))
  }

  getDateISO (date) {
    return moment(date, 'DD-MM-YYYY').format('YYYY-MM-DD')
  }
}

module.exports = ConfigService
