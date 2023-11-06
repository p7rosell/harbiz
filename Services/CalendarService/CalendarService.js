const CalendarServiceUtils = require('./CalendarServiceUtils')

class CalendarService {
  constructor () {
    this.utils = new CalendarServiceUtils()
  }

  /**
   * Updates or creates real spots based on the presence of conflicts.
   *
   * @param {Object[]} realSpots - The real availability spots.
   * @param {boolean} noConflicts - An indicator of whether there are no conflicts.
   * @param {string} start - Start time of the spot.
   * @param {string} end - End time of the spot.
   */
  updateOrCreateRealSpots (realSpots, noConflicts, start, end) {
    if (noConflicts) {
      realSpots.push({ start, end })
    } else {
      realSpots[realSpots.length - 1] = { start, end }
    }
  }

  /**
   * Retrieves available slots based on provided data.
   *
   * @param {Object} options - The input options for slot calculation.
   * @param {Object[]} options.daySlots - The slots available for the day.
   * @param {Object} options.sessions - Sessions data for the day.
   * @param {string} options.date - The date for which slots are calculated.
   * @param {string} options.dateISO - The date in ISO format.
   * @returns {Object[]} - An array of objects representing available slots after considering session conflicts.
   */
  getFreeSlots ({ daySlots, sessions, date, dateISO }) {
    if (!sessions?.[date]) return daySlots

    const realSpots = []

    daySlots.forEach(daySlot => {
      let noConflicts = true
      let start = this.utils.getTimestamp(dateISO, daySlot.start)
      let startHour = daySlot.start
      const end = this.utils.getTimestamp(dateISO, daySlot.end)

      sessions[date].forEach(sessionSlot => {
        const sessionStart = this.utils.getTimestamp(dateISO, sessionSlot.start)
        const sessionEnd = this.utils.getTimestamp(dateISO, sessionSlot.end)

        if (sessionStart > start && sessionEnd < end) {
          this.updateOrCreateRealSpots(realSpots, noConflicts, startHour, sessionSlot.start)
          realSpots.push({ start: sessionSlot.end, end: daySlot.end })
          start = this.utils.getTimestamp(dateISO, sessionSlot.end)
          startHour = sessionSlot.end
          noConflicts = false
        } else if (sessionStart === start && sessionEnd < end) {
          this.updateOrCreateRealSpots(realSpots, noConflicts, sessionSlot.end, daySlot.end)
          start = this.utils.getTimestamp(dateISO, sessionSlot.end)
          startHour = sessionSlot.end
          noConflicts = false
        } else if (sessionStart > start && sessionEnd === end) {
          if (noConflicts) {
            realSpots.push({ start: daySlot.start, end: sessionSlot.start })
          } else {
            const index = realSpots.length - 1
            realSpots[index] = { ...realSpots[index], end: sessionSlot.start }
          }

          noConflicts = false
        } else if (sessionStart === start && sessionEnd === end) {
          if (!noConflicts) {
            realSpots.pop()
          }

          noConflicts = false
        }
      })

      if (noConflicts) {
        realSpots.push(daySlot)
      }
    })

    return realSpots
  }

  /**
   * Generates a mini slot from a time range.
   *
   * @param {string} startSlot - Start time of the range.
   * @param {string} endSlot - End time of the range.
   * @param {Object} options - Options for generating the mini slot.
   * @param {string} options.dateISO - The date in ISO format.
   * @param {number} options.duration - Duration of the mini slot in minutes.
   * @param {number} options.durationBefore - Duration before the mini slot in minutes.
   * @param {number} options.durationAfter - Duration after the mini slot in minutes.
   * @returns {Object} - An object representing the generated mini slot.
   */
  getOneMiniSlot (startSlot, endSlot, { dateISO, duration, durationBefore, durationAfter }) {
    const startHourFirst = this.utils.getMomentHour(dateISO, startSlot)
    const endHour = this.utils.addMinutes(startHourFirst, durationBefore + duration + durationAfter)

    if (endHour > endSlot) return null

    const startHour = startHourFirst.format('HH:mm')
    const clientStartHour = this.utils.addMinutes(startHourFirst, durationBefore)
    const clientEndHour = this.utils.addMinutes(startHourFirst, duration + durationBefore)

    return {
      startHour: this.utils.convertISOToMoment(dateISO, startHour),
      endHour: this.utils.convertISOToMoment(dateISO, endHour),
      clientStartHour: this.utils.convertISOToMoment(dateISO, clientStartHour),
      clientEndHour: this.utils.convertISOToMoment(dateISO, clientEndHour)
    }
  }

  /**
   * Obtiene los mini slots a partir de los datos proporcionados.
   *
   * @param {Object} params - Los parámetros necesarios para la generación de mini slots.
   * @param {Object[]} params.realSpots - Los spots reales de disponibilidad.
   * @param {string} params.dateISO - La fecha en formato ISO.
   * @param {number} params.duration - Duración de los mini slots en minutos.
   * @param {number} params.durationBefore - Duración antes de los mini slots en minutos.
   * @param {number} params.durationAfter - Duración después de los mini slots en minutos.
   * @returns {Object[]} - Un array de objetos que representan los mini slots generados.
   */
  getMiniSlots (params) {
    const { realSpots } = params
    const arrSlot = []

    realSpots.forEach(slot => {
      let start = slot.start
      let resultSlot
      do {
        resultSlot = this.getOneMiniSlot(start, slot.end, params)

        if (!resultSlot) return

        arrSlot.push(resultSlot)
        start = this.utils.convertUtcHHMM(resultSlot.endHour)
      } while (resultSlot)

      return arrSlot
    })

    return arrSlot
  }
}

module.exports = CalendarService
