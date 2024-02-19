import { EventDispatcher, type Scene, type Camera, Clock } from 'three'
import type Kreise from '../Kreise.ts'

import { ObjectRecordType, domElementType } from '../Kreise.ts'
import { KreiseTorus } from '../KreiseTorus.ts'

export default class KreiseEpisode extends EventDispatcher {
  kreise: Kreise
  scene: Scene
  camera: Camera
  domElement: domElementType
  objects: ObjectRecordType
  clock: Clock
  // functions

  update (ticks: number): void { console.log(ticks) } // stub to shutup linter
  makeScene(): void {}
  addControls(): void {}

  keydown (event: KeyboardEvent): void { event; return }    // stub this to console.log(event)
  keyup (event: KeyboardEvent): void { event; return }      // stub this to console.log(event)
  onPointerMove (event: MouseEvent): void { event; return } // stub this to console.log(event)

  constructor (kreise: Kreise, scene: Scene, camera: Camera, domElement: domElementType) {
    super()
    this.kreise = kreise
    this.scene = scene
    this.camera = camera
    this.domElement = domElement
    this.objects = {}
    this.clock = new Clock(true) // @TODO start clock with episode.start()

    // Controls
    this.keydown = function (event) {
      switch (event.code) {
        case 'KeyO':
          if (this.kreise.client.developerMode) {
            this.kreise.autoplay.camera = !this.kreise.autoplay.camera
            if (this.kreise.autoplay.camera) {
              this.camera.position.set(0, -16.5, 0)
              this.camera.lookAt(0, -16.5, 0)
            }
          }
          break
        case 'KeyU':
          Object.entries(this.objects).forEach(([object]) => {
            console.log(object)
            if (this.objects[object] instanceof KreiseTorus) {
              let objectshorthand = this.objects[object] as KreiseTorus
              objectshorthand.materials.forEach((material) => {
                if (material !== null) {
                  material.wireframe = !material.wireframe
                }
              })
            }
          })
          break
      }
    }

    const _keydown = this.keydown.bind(this)
    // const _keyup = this.keyup.bind(this)
    // const _onPointerMove = this.onPointerMove.bind(this)
    window.addEventListener('keydown', _keydown)
    // window.addEventListener('keyup', _keyup)
    // window.addEventListener('pointermove', _onPointerMove)

  }

  dispose (): void {
    /*
    this.domElement.removeEventListener( 'contextmenu', _contextmenu );
    this.domElement.removeEventListener( 'pointerdown', _pointerdown );
    this.domElement.removeEventListener( 'pointermove', _pointermove );
    this.domElement.removeEventListener( 'pointerup', _pointerup );
    this.domElement.removeEventListener( 'pointercancel', _pointercancel );
    */

    const _keydown = this.keydown.bind(this)
    // const _keyup = this.keyup.bind(this)
    window.removeEventListener('keydown', _keydown)
    // window.removeEventListener('keyup', _keyup)
  }

}
