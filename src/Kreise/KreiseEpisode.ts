import { EventDispatcher, type Scene, type Camera, Clock } from 'three'
import type Kreise from './Kreise.ts'

import { KreiseTorus } from './KreiseTorus.ts'
import KreiseGraph from './KreiseGraph.ts'

export default class KreiseEpisode extends EventDispatcher {
  kreise: Kreise
  scene: Scene
  camera: Camera
  graph: KreiseGraph
  clock: Clock
  // functions

  update (ticks: number): void { console.log(ticks) } // stub to shutup linter
  makeScene(): void {}
  addControls(): void {}

  keydown (e: KeyboardEvent): void { e; return }    // stub this to console.log(event)
  keyup (e: KeyboardEvent): void { e; return }      // stub this to console.log(event)
  onPointerMove (e: MouseEvent): void { e; return } // stub this to console.log(event)

  constructor (kreise: Kreise, scene: Scene, camera: Camera) {
    super()
    this.kreise = kreise
    this.scene = scene
    this.camera = camera
    this.graph = new KreiseGraph
    this.clock = new Clock(true) // @TODO start clock with episode.start()

    // Controls
    this.keydown = function (e: KeyboardEvent) {
      switch (e.code) {
        case 'KeyU':
          Object.entries(this.graph.kreiseMeshes).forEach(([_, object]) => {
            if (object instanceof KreiseTorus) {
              object.materials.forEach((material) => {
                if (material !== null) {
                  material.wireframe = !material.wireframe
                  material.needsUpdate = true
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
