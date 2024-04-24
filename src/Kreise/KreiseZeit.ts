export interface KreiseZeitInterface { parent: number, ms: number, interval: number, direction: string }

type KreiseZeitInterval = Record<number, KreiseZeitInterface>

export enum Direction { 'cw', 'ccw' }
export interface DirectionInterface { direction: keyof typeof Direction }

export interface EpisodeTimeInterface { timeS: number, timeMs: number, startMs: number }

// KreiseZeit richtet sich nach der genauen Uhrzeit, ist also nicht verschiebbar
export default class KreiseZeit {
  interval: KreiseZeitInterval = []
  oldTime: number
  constructor () {
    this.interval[0] = { parent: -1, ms: Date.now(), interval: 0, direction: 'cw' }
    this.oldTime = this.interval[0].ms

    this.addInterval(86400, 0)      // day - relates to global time (which is -1)
    this.addInterval(3600, 86400)   // hour, relates to day cycle
    this.addInterval(900, 3600)     // 15 minutes, relates to hour cycle
    this.addInterval(300, 900)      // 5 minutes, relates to 15 minutes cycle
    this.addInterval(60, 300)       // 1 minute, relates to 5 minute cycle

  }

  addInterval (interval: number, parent = 0, direction = 'cw'): void {
    this.interval[interval] = { parent, ms: this.interval[0].ms % (interval * 1000), interval, direction }
  }

  flipInterval(intervalIndex: number) {
    console.log(intervalIndex)
  }

  update (): void {
    const nowMs: number = Date.now()
    const deltaMs: number = nowMs - this.oldTime

    this.oldTime = nowMs
    this.interval[0].ms = nowMs

    const intervals = Object.entries(this.interval)

    intervals.forEach(([_, interval]) => {
      // console.log(intervalIndex, interval.ms)
      if (interval.interval !== 0) {              // before you go crazy, this is the same number as intervalIndex
        if (interval.direction === 'cw') {
          interval.ms = (interval.ms + deltaMs) % (interval.interval * 1000)
        }
        if (interval.direction === 'ccw') {
          interval.ms = (interval.ms - deltaMs) % (interval.interval * 1000)
          if (interval.ms < 0) {
            interval.ms = (interval.interval * 1000) + interval.ms
          }
        }
      }
    })
  }
}

// Takte haben auch eine Richtung und Länge (wie Intervalle), sind aber verschiebbar
export class KreiseTakt {

  bpm: number = 120 // normaler 4/4 Takt. Das sind 30 Takte pro Minute (0,5)
  offset: number = 0
  

}