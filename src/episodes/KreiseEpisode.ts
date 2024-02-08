import { EventDispatcher, type Camera, type Object3D, type Scene, Mesh, AxesHelper, GridHelper, Clock } from 'three'
import type Kreise from '../Kreise.ts'
import { KlavierTorus, KreiseShaderedTorus, KreiseTorus } from '../KreiseTorus.ts'

export type ObjectInterface = Record<string, Mesh | AxesHelper | GridHelper | KreiseTorus | KreiseShaderedTorus | KlavierTorus>

export default class KreiseEpisode extends EventDispatcher {
  kreise: Kreise
  scene: Scene
  camera: Camera
  domElement: HTMLElement
  objects: ObjectInterface
  clock: Clock
  // functions
  dispose (): void {}
  update (ticks: number): void { console.log(ticks) } // stub to shutup linter

  constructor (kreise: Kreise, scene: Scene, camera: Camera, domElement: HTMLElement) {
    super()
    this.kreise = kreise
    this.scene = scene
    this.camera = camera
    this.domElement = domElement
    this.objects = {}
    this.clock = new Clock(true) // @TODO start clock with episode.start()
  }

  // ===== Keyboard Events =====
  /*
  document.onkeydown = function (e) {
    switch (e.keyCode) {
      case 80: // P                               Switch Time on off
        kreise.autoplay.animation = !kreise.autoplay.animation
        break
      case 79: // O                               Switch Automatic Camera on off
        kreise.autoplay.camera = !kreise.autoplay.camera
        break
      case 73: // I                               Set Camera to outside view
        if (import.meta.env.DEV) {
          kreise.autoplay.camera = false
          camera.position.set(0, 2, 7)
          camera.lookAt(0, 5, 0)
          cameraEyeHelper.visible = true
        }
        break

      case 74: // J                               Switch Helpers On Off
        if (import.meta.env.DEV) {
          if (kreise.debug.helperObjects) {
            kreise.scene.remove(planeHelper)
            kreise.scene.remove(gridHelperInstance)
            kreise.scene.remove(axesHelper)
            kreise.scene.remove(pointLightHelper)
          } else {
            kreise.scene.add(planeHelper)
            kreise.scene.add(gridHelperInstance)
            kreise.scene.add(axesHelper)
            kreise.scene.add(pointLightHelper)
          }
          kreise.debug.helperObjects = !kreise.debug.helperObjects
        }
        break
    }
  }
  */
}
