import { Camera, Object3D, Scene } from 'three'
import type Kreise from '../Kreise.ts'

export default class KreiseEpisode {
  kreise: Kreise
  scene: Scene
  camera: Camera
  objects: Object3D[] // Array<Object3D>

  constructor (kreise: Kreise, scene: Scene, camera: Camera) {
    this.kreise = kreise
    this.scene = scene
    this.camera = camera
    this.objects = []
  }
}
