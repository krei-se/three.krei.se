import SunCalc from 'suncalc'
import type { GetSunPositionResult, GetTimesResult } from 'suncalc'

import { Scene, WebGLRenderer } from 'three'

export interface AutoplayOptionsInterface { camera: boolean, animation: boolean }
export interface DebugOptionsInterface { helperObjects: boolean, helperInterface: boolean }

export default class Kreise {
  suncalc: GetTimesResult
  sunPosition: GetSunPositionResult
  brightness: number

  renderer: WebGLRenderer
  scene: Scene

  autoplay: AutoplayOptionsInterface
  rhythms: any[]

  ColorScheme: string

  debug: DebugOptionsInterface

  constructor() {
    this.suncalc = SunCalc.getTimes(new Date(), 50.84852106503032, 12.923759828615541)
    this.sunPosition = SunCalc.getPosition(new Date(), 50.84852106503032, 12.923759828615541)
    this.brightness = 255

    this.renderer = new WebGLRenderer() // will be overwritten later
    this.scene = new Scene()

    this.autoplay = { camera: true, animation: true }
    this.debug = { helperObjects: false, helperInterface: false }

    this.rhythms = [] // will be overwritten in main.ts
    this.ColorScheme = '' // will be overwritten in main.ts
  }
}
