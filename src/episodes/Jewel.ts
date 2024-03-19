import KreiseEpisode from '../Kreise/KreiseEpisode.ts'

import {
  Scene,
  Camera,
  Object3D,
  MeshPhongMaterial,
  Raycaster,
  Vector2,
  InstancedMesh,
  DynamicDrawUsage,
  CylinderGeometry,
  MeshBasicMaterial,
  Mesh,
  BackSide
} from 'three'

import {
  Vector3,
  Color,
} from 'three'

import { KreiseTorus } from '../Kreise/KreiseTorus'

import type Kreise from '../Kreise/Kreise.ts'
import KreiseGraph from '../Kreise/KreiseGraph.ts'

export default class JewelEpisode extends KreiseEpisode {

  jewel: KreiseGraph = new KreiseGraph()

  keydown (e: KeyboardEvent): void { e; return }    // stub this to console.log(event)
  keyup (e: KeyboardEvent): void { e; return }      // stub this to console.log(event)
  onPointerMove (e: MouseEvent): void { e; return } // stub this to console.log(event)

  // remember the kreise scene is the main scene and this one is local to the episode :)
  constructor (kreise: Kreise, scene: Scene, camera: Camera) {
    super(kreise, scene, camera)

    const _keydown = this.keydown.bind(this)
    const _keyup = this.keyup.bind(this)
    const _onPointerMove = this.onPointerMove.bind(this)
    window.addEventListener('keydown', _keydown)
    window.addEventListener('keyup', _keyup)
    window.addEventListener('pointermove', _onPointerMove)
  }

  dispose (): void {

    const _keydown = this.keydown.bind(this)
    const _keyup = this.keyup.bind(this)
    const _onPointerMove = this.onPointerMove.bind(this)

    window.removeEventListener('keydown', _keydown)
    window.removeEventListener('keyup', _keyup)
    window.removeEventListener('pointermove', _onPointerMove)

  }

  load (): void { // its stored in this.scene, get it from there
  
    this.jewel.repeat = 16 * 9
    
  }



  update (ticks: number): void {

    

  }
}