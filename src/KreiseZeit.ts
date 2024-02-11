export interface KreiseZeitInterface { ms: number, interval: number, direction: string }

export enum Direction { 'cw', 'ccw' }
export interface DirectionInterface { direction: keyof typeof Direction }

export interface EpisodeTimeInterface { timeS: number, timeMs: number, startMs: number }

export default class KreiseZeit {
  interval: KreiseZeitInterface[] = []
  oldTime: number
  constructor () {
    this.interval[0] = { ms: Date.now(), interval: 0, direction: 'cw' }
    this.oldTime = this.interval[0].ms

    this.addInterval(86400) // day
    this.addInterval(3600)
    this.addInterval(900)
    this.addInterval(300)
    this.addInterval(60)

    console.log(this)
  }

  addInterval (interval: number, direction = 'cw'): void {
    this.interval.push({ ms: this.interval[0].ms % (interval * 1000), interval, direction })
  }

  update (): void {
    const nowMs: number = Date.now()
    const deltaMs: number = nowMs - this.oldTime

    this.oldTime = nowMs
    this.interval[0].ms = nowMs

    this.interval.forEach((interval, index) => {
      if (index !== 0) {
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
