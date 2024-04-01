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
import KreiseRing from '../Kreise/KreiseRing.ts'

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
  
    this.kreise.camera.fov = 90
    this.kreise.camera.position.set(7,0,0)
    this.kreise.camera.lookAt(0,0,0)

    this.jewel.repeat = 16 * 9


    this.graph.CircleTest0 = new KreiseRing({radius: 1, thickness: 2, thetaSegments: 12, phiSegments: 3, lodDisplay: 3})
//    this.graph.CircleTest0.position.z = -3
//    this.graph.CircleTest0.position.y = 3
    this.graph.CircleTest0.rotateY(-Math.PI/2)

    this.scene.add(this.graph.CircleTest0)


    this.graph.CircleTest1 = new KreiseRing({ thickness: 0.4, thetaSegments: 36, lodDisplay: 4, thetaLength: Math.PI * 1.5 })
    this.graph.CircleTest1.position.z = -3
    this.graph.CircleTest1.rotateY(-Math.PI/2)

    this.scene.add(this.graph.CircleTest1)
    /*
    this.graph.CircleTest2 = new KreiseRing({ radius: 1, thickness: 0, phiSegments: 2, thetaSegments: 12, lodDisplay: 1, thetaLength: Math.PI * 1.87 })
    this.graph.CircleTest2.position.z = 0
    this.graph.CircleTest2.rotateY(-Math.PI/2)

    this.scene.add(this.graph.CircleTest2)

    this.graph.CircleTest3 = new KreiseRing({ radius: 1, thickness: 0, phiSegments: 2, thetaSegments: 12, lodDisplay: 1, thetaLength: Math.PI * 2 })
    this.graph.CircleTest3.position.z = 3
    this.graph.CircleTest3.rotateY(-Math.PI/2)

    this.scene.add(this.graph.CircleTest3)

    this.graph.CircleTest4 = new KreiseRing({ radius: .5, thickness: 2, phiSegments: 2, thetaSegments: 12, lodDisplay: 3, thetaLength: Math.PI * 2 })
    this.graph.CircleTest4.position.z = 3
    this.graph.CircleTest4.position.y = 3

    this.graph.CircleTest4.rotateY(-Math.PI/2)

    this.scene.add(this.graph.CircleTest4)

    this.graph.CircleTest5 = new KreiseRing({ radius: 1, thickness: .7, skew: Math.PI/3, phiSegments: 2, thetaSegments: 12, lodDisplay: 3, thetaLength: Math.PI * 2 })
    this.graph.CircleTest5.position.z = 0
    this.graph.CircleTest5.position.y = 3

    this.graph.CircleTest5.rotateY(-Math.PI/2)

    this.scene.add(this.graph.CircleTest5)
    */

    
  }



  update (ticks: number): void {

    

  }
}