const CalendarService = require('./Services/CalendarService/CalendarService')
const ConfigService = require('./Services/CalendarService/ConfigService')
const CalendarValidator = require('./Validators/CalendarValidator')

class Calendar {
  constructor () {
    this.calendarService = new CalendarService()
    this.configService = new ConfigService()
    this.validate = new CalendarValidator()
  }

  getAvailableSpots (calendar, date, duration) {
    // Si fuera una API que llama a este metodo, la validación la llamaría cono middleware y no
    // dentro de la clase
    this.validate.getAvailableSpots({ calendar, date, duration })

    try {
      const {
        durationBefore, durationAfter, slots, sessions
      } = this.configService.getCalendarData(calendar)
      const dateISO = this.configService.getDateISO(date)
      const daySlots = slots[date] || []
      const realSpots = this.calendarService.getFreeSlots({ daySlots, sessions, date, dateISO })

      return this.calendarService.getMiniSlots(
        { realSpots, dateISO, duration, durationBefore, durationAfter }
      )
    } catch (e) {
      throw new Error(e)
    }
  }
}

module.exports = Calendar
