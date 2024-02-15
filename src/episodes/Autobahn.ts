import KreiseEpisode, { ObjectInterface } from './KreiseEpisode'

import {
  Scene,
  Camera,
  Group,
  Object3D,
  MeshPhongMaterial,
  MeshDepthMaterial,
  MeshPhongMaterial,
  Raycaster,
  Ray,
  Vector2,
  MeshStandardMaterial,
  InstancedMesh,
  DynamicDrawUsage
} from 'three'

import {
  Vector3,
  Mesh,
  MeshLambertMaterial,
  TextureLoader,
  MirroredRepeatWrapping,
  Color,
  TubeGeometry
} from 'three'

import { KlavierTorus, KreiseShaderedTorus, KreiseTorus } from '../KreiseTorus'

import turboTextureImage from '../textures/turbo.png'

import { ColorSchemes, flyCurveVectors } from '../KreiseConsts'
import type Kreise from '../Kreise.ts'
import { materialOpacity } from 'three/examples/jsm/nodes/Nodes.js'
import { isUndef } from 'tone'

export default class AutobahnEpisode extends KreiseEpisode {
  flyCurveTicks: number
  flyCurveDirection: Vector3
  flyCurveNormal: Vector3
  colorScheme: string
  autoInstances: any

  keydown (event: KeyboardEvent): void { console.log(event) } // stub to shutup linter about event
  keyup (event: KeyboardEvent): void { console.log(event) }
  onPointerMove (event: MouseEvent): void { console.log(event) } // stub

  raycaster: Raycaster = new Raycaster()
  pointer: Vector2 = new Vector2()

  // remember the kreise scene is the main scene and this one is local to the episode :)
  constructor (kreise: Kreise, scene: Scene, camera: Camera, domElement: HTMLElement) {
    super(kreise, scene, camera, domElement)

    this.colorScheme = kreise.ColorScheme // set this up in main.ts

    this.flyCurveTicks = 0 // set up in makeScene
    this.flyCurveDirection = new Vector3()
    this.flyCurveNormal = new Vector3()

    // Controls
    this.keydown = function (event) {
      switch (event.code) {
        case 'KeyI':
          if (this.kreise.client.developerMode) {
            this.kreise.switchHelpers()
            console.log('keydown')
          }
          break
        case 'KeyO':
          if (this.kreise.client.developerMode) {
            this.kreise.autoplay.camera = !this.kreise.autoplay.camera
            if (this.kreise.autoplay.camera) {
              this.camera.position.set(0, -16.5, 0)
              this.camera.lookAt(0, -16.5, 0)
            }
          }
          break
        case 'KeyP':
          if (this.kreise.client.developerMode) {
            this.kreise.autoplay.animation = !this.kreise.autoplay.animation
          }
          break
        case 'KeyU':
          Object.entries(this.objects).forEach(([object]) => {
            console.log(object)
            if (this.objects[object] instanceof KreiseTorus) {
              this.objects[object].materials.forEach((material, index) => {
                if (material !== null) {
                  material.wireframe = !material.wireframe
                }
              })
            }
          })
      }
    }

    this.onPointerMove = function (event) {
      // calculate pointer position in normalized device coordinates
      // (-1 to +1) for both components
      this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1
      this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1
    }

    const _keydown = this.keydown.bind(this)
    const _keyup = this.keyup.bind(this)
    const _onPointerMove = this.onPointerMove.bind(this)
    window.addEventListener('keydown', _keydown)
    window.addEventListener('keyup', _keyup)
    window.addEventListener('pointermove', _onPointerMove)
  }

  dispose (): void {
    /*
    this.domElement.removeEventListener( 'contextmenu', _contextmenu );
    this.domElement.removeEventListener( 'pointerdown', _pointerdown );
    this.domElement.removeEventListener( 'pointermove', _pointermove );
    this.domElement.removeEventListener( 'pointerup', _pointerup );
    this.domElement.removeEventListener( 'pointercancel', _pointercancel );
    */

    window.removeEventListener('keydown', _keydown)
    window.removeEventListener('keyup', _keyup)
    window.removeEventListener('pointermove', _onPointerMove)
  }

  makeScene (): void { // its stored in this.scene, get it from there
  // Tori

    this.objects.Bahn1 = new KreiseTorus({
      identity: 'Bahn1',
      radius: 20,
      tube: 0.3,
      lod: 24,
      color: new Color(parseInt('0xffffff')),
      facing: 'normal'
    })

    this.objects.Bahn2 = new KreiseTorus({
      identity: 'Bahn2',
      radius: 20,
      tube: .2,
      lod: 24,
      color: new Color(parseInt('0x' + ColorSchemes[this.kreise.ColorScheme][0])),
      facing: 'normal'
    })

    this.objects.Bahn3 = new KreiseTorus({
      identity: 'Bahn3',
      radius: 20,
      tube: .2,
      lod: 24,
      color: new Color(parseInt('0x' + ColorSchemes[this.kreise.ColorScheme][1])),
      facing: 'normal'
    })

    this.objects.Bahn4 = new KreiseTorus({
      identity: 'Bahn4',
      radius: 20,
      tube: .2,
      lod: 24,
      color: new Color(parseInt('0x' + ColorSchemes[this.kreise.ColorScheme][2])),
      facing: 'normal'
    })

    this.objects.Bahn5 = new KreiseTorus({
      identity: 'Bahn5',
      radius: 20,
      tube: .2,
      lod: 24,
      color: new Color(parseInt('0x' + ColorSchemes[this.kreise.ColorScheme][3])),
      facing: 'normal'
    })

    this.objects.Bahn6 = new KreiseTorus({
      identity: 'Bahn6',
      radius: 20,
      tube: .2,
      lod: 24,
      color: new Color(parseInt('0x' + ColorSchemes[this.kreise.ColorScheme][4])),
      facing: 'normal'
    })

    this.objects.Bahn7 = new KreiseTorus({
      identity: 'Bahn7',
      radius: 20,
      tube: .2,
      lod: 24,
      color: new Color(parseInt('0x' + ColorSchemes[this.kreise.ColorScheme][4])),
      facing: 'normal'
    })

    this.objects.Bahn8 = new KreiseTorus({
      identity: 'Bahn8',
      radius: 20,
      tube: .2,
      lod: 24,
      color: new Color(parseInt('0x' + ColorSchemes[this.kreise.ColorScheme][4])),
      facing: 'normal'
    })

    // Standstreifen
    const standstreifen: KreiseTorus[] = [this.objects.Bahn1, this.objects.Bahn4, this.objects.Bahn5, this.objects.Bahn8]

    standstreifen.forEach((Bahn, index) => {
      Bahn.materials[0] = new MeshPhongMaterial({ color: 0xeeeeee, shininess: 300 })
    })
    // Leitlinien links
    const leitlinien: KreiseTorus[] = [this.objects.Bahn2, this.objects.Bahn3, this.objects.Bahn6, this.objects.Bahn7]

    leitlinien.forEach((Bahn, index) => {
      // Bahn.materials[0] = new MeshPhongMaterial({ color: 0x333333, shininess: 100 })
      Bahn.materials[0] = new MeshDepthMaterial({})
      Bahn.materials[1] = new MeshPhongMaterial({ color: 0xdddddd, shininess: 150 })

      // console.log(Bahn.geometry.groups)

      for (let j: number = 0; j < Bahn.geometry.groups.length; j++) {
        Bahn.geometry.groups[j].materialIndex = Math.floor(j / 10) % 2
      }
    })

    // Und jetzt alle Linien!
    for (let i: number = 1; i <= 8; i++) {
      const BahnName = 'Bahn' + i
      const Bahn: KreiseTorus = this.objects[BahnName] as KreiseTorus
      // rotate around Y so its in front and behind the camera
      Bahn.rotateY(Math.PI / 2)

      // Position
      Bahn.position.x = -13.5 + (3 * i)

      this.scene.add(this.objects[BahnName])
    }

    let intensity: number = 0
    if (this.kreise.brightness === 0) {
      intensity = 1
    }
    const rotesRuecklicht = { toneMapped: false, color: 0xcc4cee, shininess: 400, emissive: 0xcc4cee, emissiveIntensity: intensity }
    const rotesRuecklicht2 = { toneMapped: false, color: 0xff2200, shininess: 350, emissive: 0xff2200, emissiveIntensity: intensity }

    const xenonFrontlicht = { toneMapped: false, color: 0x5555ff, shininess: 400, emissive: 0x5555ff, emissiveIntensity: intensity }
    const normalFrontlicht = { toneMapped: false, color: 0xffba24, shininess: 350, emissive: 0xffba24, emissiveIntensity: intensity }

    this.autoInstances = [
        { identity: 'AutoBaseLKW', count: 50, material1: rotesRuecklicht, material2: xenonFrontlicht, offsetX: 9, offsetProgress: 0, speed: 0.00005 },
        { identity: 'AutoBaseLKW2', count: 50, material1: rotesRuecklicht2, material2: normalFrontlicht, offsetX: 9, offsetProgress: 1/100, speed: 0.00005 },
        
        { identity: 'AutoBaseMS', count: 25, material1: rotesRuecklicht, material2: xenonFrontlicht, offsetX: 6, offsetProgress: 0, speed: 0.00008 },
        { identity: 'AutoBaseMS2', count: 25, material1: rotesRuecklicht2, material2: normalFrontlicht, offsetX: 6, offsetProgress: 1/50,  speed: 0.00008 },
        
        { identity: 'AutoBaseUS', count: 10, material1: rotesRuecklicht, material2: xenonFrontlicht, offsetX: 3, offsetProgress: 0, speed: 0.00015},
        { identity: 'AutoBaseUS2', count: 10, material1: rotesRuecklicht2, material2: normalFrontlicht, offsetX: 3, offsetProgress: 1/20, speed: 0.00015 }
    ]

    this.autoInstances.forEach((autoInstance) => {

      this.objects[autoInstance.identity] = new KreiseTorus({
        identity: autoInstance.identity,
        radius: 1,
        tube: 0.25,
        lod: 1,
        tubularSegments: 32,
        radialSegments: 8,
        facing: 'normal',
        geogrouping: 'horizontal'
      })

      this.objects[autoInstance.identity].materials[1] = new MeshPhongMaterial(autoInstance.material1)
      this.objects[autoInstance.identity].materials[0] = new MeshPhongMaterial(autoInstance.material2)
      

      for (let k: number = 0; k < this.objects[autoInstance.identity].geometry.groups.length; k++) {
        this.objects[autoInstance.identity].geometry.groups[k].materialIndex = Math.floor(k / 4) % 2
      }
      
      let instancedMeshName: string = autoInstance.identity + 'InstancedMesh'
      let instancedMeshNameCCW: string = autoInstance.identity + 'InstancedMeshCCW'

      this.objects[instancedMeshName] = new InstancedMesh(this.objects[autoInstance.identity].geometry, this.objects[autoInstance.identity].materials, autoInstance.count)
      this.objects[instancedMeshName].instanceMatrix.setUsage(DynamicDrawUsage)


      this.objects[instancedMeshNameCCW] = new InstancedMesh(this.objects[autoInstance.identity].geometry, this.objects[autoInstance.identity].materials, autoInstance.count)
      this.objects[instancedMeshNameCCW].instanceMatrix.setUsage(DynamicDrawUsage)

      this.scene.add(this.objects[instancedMeshName])
      this.scene.add(this.objects[instancedMeshNameCCW])

      

    })



    this.camera.position.set(0, -16.5, 0)
    this.camera.lookAt(0, -16.5, 0)
    //this.camera.rotateZ(-Math.PI / 10)
  }

  addControls (): void {
    console.log('stub')
  }

  update (ticks: number): void {
    if (this.kreise.autoplay.animation) {
      this.objects.Bahn2.rotation.z = ticks * -0.00005
      this.objects.Bahn3.rotation.z = ticks * -0.00005

      this.objects.Bahn6.rotation.z = ticks * -0.00005
      this.objects.Bahn7.rotation.z = ticks * -0.00005
    }

    const matrixDummy = new Object3D();

    this.autoInstances.forEach((autoInstance) => {

      let instancedMeshName: string = autoInstance.identity + 'InstancedMesh'

      for (let i: number = 0 ; i < this.objects[instancedMeshName].count; i++ ) {
        //for (let i: number = 1 ; i <= 10; i++ ) {
    
          let radius: number = 20
          let progress: number = (i / this.objects[instancedMeshName].count) + autoInstance.offsetProgress
          matrixDummy.position.set (autoInstance.offsetX, Math.cos(progress * (Math.PI * 2)) * radius, Math.sin(progress * (Math.PI * 2)) * radius)
          matrixDummy.rotation.x = 0
          matrixDummy.rotateX((Math.PI * 2) * progress)
          matrixDummy.updateMatrix();
    
          this.objects[instancedMeshName].setMatrixAt(i, matrixDummy.matrix)
    
        }
    
        this.objects[instancedMeshName].rotation.x = ticks * autoInstance.speed
    
    
        this.objects[instancedMeshName].needsUpdate = true;

    })

    // CCW

    this.autoInstances.forEach((autoInstance) => {

      let instancedMeshNameCCW: string = autoInstance.identity + 'InstancedMeshCCW'

      for (let i: number = 0 ; i < this.objects[instancedMeshNameCCW].count; i++ ) {
        //for (let i: number = 1 ; i <= 10; i++ ) {
    
          let radius: number = 20
          let progress: number = (i / this.objects[instancedMeshNameCCW].count) + autoInstance.offsetProgress
          matrixDummy.position.set (-autoInstance.offsetX, Math.cos(progress * (Math.PI * 2)) * radius, Math.sin(progress * (Math.PI * 2)) * radius)
          matrixDummy.rotation.x = 0
          matrixDummy.rotation.y = 0
          matrixDummy.rotation.z = 0
          
          matrixDummy.rotateX((Math.PI * 2) * progress)
          matrixDummy.rotateY(Math.PI)
          matrixDummy.updateMatrix();
    
          this.objects[instancedMeshNameCCW].setMatrixAt(i, matrixDummy.matrix)
    
        }
    
        this.objects[instancedMeshNameCCW].rotation.x = ticks * -autoInstance.speed
    
    
        this.objects[instancedMeshNameCCW].needsUpdate = true;

    })


    if (this.kreise.autoplay.camera) {
      this.camera.rotation.x = ticks * 0.00004
      this.camera.rotation.z = Math.sin(ticks / 5000) * .3
    }

    // Raycaster

    this.raycaster.setFromCamera(this.pointer, this.camera)

    /*
    // calculate objects intersecting the picking ray
    const intersects = this.raycaster.intersectObjects(this.kreise.scene.children)

    for (let i = 0; i < intersects.length; i++) {
      if (!isUndef(intersects[i].object.materials)) {
        if (intersects[i].object.materials.length >= 1) {
          intersects[i].object.materials.forEach(item => {
            item.color.set(0xffff00)
          })
        }
      }
    }
    */

    // debug
    if (this.kreise.client.developerMode) {

      if (ticks % 1000 === 0)

        console.log(this.objects)



    }

  }
}