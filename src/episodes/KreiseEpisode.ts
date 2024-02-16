import { EventDispatcher, type Scene, type Camera, Clock } from 'three'
import type Kreise from '../Kreise.ts'

import { ObjectRecordType, domElementType } from '../Kreise.ts'

export default class KreiseEpisode extends EventDispatcher {
  kreise: Kreise
  scene: Scene
  camera: Camera
  domElement: domElementType
  objects: ObjectRecordType
  clock: Clock
  // functions
  dispose (): void {}
  update (ticks: number): void { console.log(ticks) } // stub to shutup linter
  makeScene(): void {}
  addControls(): void {}

  constructor (kreise: Kreise, scene: Scene, camera: Camera, domElement: domElementType) {
    super()
    this.kreise = kreise
    this.scene = scene
    this.camera = camera
    this.domElement = domElement
    this.objects = {}
    this.clock = new Clock(true) // @TODO start clock with episode.start()
  }

}
