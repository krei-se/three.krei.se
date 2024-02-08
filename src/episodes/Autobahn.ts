import KreiseEpisode, { ObjectInterface } from './KreiseEpisode'

import {
  Scene,
  Camera,
  Group,
  Object3D,
  MeshPhongMaterial,
  MeshDepthMaterial,
  MeshPhongMaterial
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

export default class AutobahnEpisode extends KreiseEpisode {
  flyCurveTicks: number
  flyCurveDirection: Vector3
  flyCurveNormal: Vector3
  colorScheme: string

  keydown (event: KeyboardEvent): void { console.log(event) } // stub to shutup linter about event
  keyup (event: KeyboardEvent): void { console.log(event) }

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
            //this.objects.flyCurveMesh.visible = true
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

    const _keydown = this.keydown.bind(this)
    const _keyup = this.keyup.bind(this)
    window.addEventListener('keydown', _keydown)
    window.addEventListener('keyup', _keyup)
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

    this.objects.Autos1 = new KreiseTorus({
      identity: 'Autos1',
      radius: 20,
      tube: 0.8,
      lod: 24,
      color: new Color(parseInt('0x' + ColorSchemes[this.kreise.ColorScheme][4])),
      facing: 'normal'
    })

    this.objects.Autos2 = new KreiseTorus({
      identity: 'Autos2',
      radius: 20,
      tube: 0.8,
      lod: 24,
      color: new Color(parseInt('0x' + ColorSchemes[this.kreise.ColorScheme][4])),
      facing: 'normal'
    })

    this.objects.Autos3 = new KreiseTorus({
      identity: 'Autos3',
      radius: 20,
      tube: 0.8,
      lod: 24,
      color: new Color(parseInt('0x' + ColorSchemes[this.kreise.ColorScheme][4])),
      facing: 'normal'
    })

    this.objects.Autos4 = new KreiseTorus({
      identity: 'Autos4',
      radius: 20,
      tube: 0.8,
      lod: 24,
      color: new Color(parseInt('0x' + ColorSchemes[this.kreise.ColorScheme][4])),
      facing: 'normal'
    })

    this.objects.Autos5 = new KreiseTorus({
      identity: 'Autos5',
      radius: 20,
      tube: 0.8,
      lod: 24,
      color: new Color(parseInt('0x' + ColorSchemes[this.kreise.ColorScheme][4])),
      facing: 'normal'
    })

    this.objects.Autos6 = new KreiseTorus({
      identity: 'Autos6',
      radius: 20,
      tube: 0.8,
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
      Bahn.materials[0] = null // new MeshDepthMaterial({})
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

    // Jetzt die Autos!
    let intensity: number = 0
    if (this.kreise.brightness === 0) {
      intensity = 3
    }
    const rotesRuecklicht = { toneMapped: false, color: 0xcc4cee, shininess: 400, emissive: 0xcc4cee, emissiveIntensity: intensity }
    const rotesRuecklicht2 = { toneMapped: false, color: 0xff2200, shininess: 350, emissive: 0xff2200, emissiveIntensity: intensity }

    const xenonFrontlicht = { toneMapped: false, color: 0x5555ff, shininess: 400, emissive: 0x5555ff, emissiveIntensity: intensity }
    const normalFrontlicht = { toneMapped: false, color: 0xffba24, shininess: 350, emissive: 0xffba24, emissiveIntensity: intensity }

    let autos: KreiseTorus[] = [this.objects.Autos1, this.objects.Autos6]
    autos.forEach((Auto, index) => {
      Auto.materials[0] = new MeshPhongMaterial(rotesRuecklicht)
      Auto.materials[1] = new MeshPhongMaterial(xenonFrontlicht)
      Auto.materials[2] = null
      Auto.materials[3] = null
      Auto.materials[4] = null
      Auto.materials[5] = null

      Auto.materials[6] = new MeshPhongMaterial(rotesRuecklicht2)
      Auto.materials[7] = new MeshPhongMaterial(normalFrontlicht)
      Auto.materials[8] = null
      Auto.materials[9] = null
      Auto.materials[10] = null
      Auto.materials[11] = null

      for (let j: number = 1; j < Auto.tubularSegments; j += 6) {
        Auto.pulseTubularLine(j, 0.2)
      }

      for (let k: number = 0; k < Auto.geometry.groups.length; k++) {
        Auto.geometry.groups[k].materialIndex = k % 12
      }

      //Auto.rotateY(Math.PI / 2)
      this.scene.add(Auto)
    })

    autos = [this.objects.Autos2, this.objects.Autos5]
    autos.forEach((Auto, index) => {
      Auto.materials[0] = new MeshPhongMaterial(rotesRuecklicht)
      Auto.materials[1] = new MeshPhongMaterial(xenonFrontlicht)
      Auto.materials[2] = null
      Auto.materials[3] = null
      Auto.materials[4] = null
      Auto.materials[5] = null
      Auto.materials[6] = null
      Auto.materials[7] = null
      Auto.materials[8] = null
      Auto.materials[9] = null

      Auto.materials[10] = new MeshPhongMaterial(rotesRuecklicht2)
      Auto.materials[11] = new MeshPhongMaterial(normalFrontlicht)
      Auto.materials[12] = null
      Auto.materials[13] = null
      Auto.materials[14] = null
      Auto.materials[15] = null
      Auto.materials[16] = null
      Auto.materials[17] = null
      Auto.materials[18] = null
      Auto.materials[19] = null

      for (let j: number = 1; j < Auto.tubularSegments; j += 10) {
        Auto.pulseTubularLine(j, 0.2)
      }

      for (let k: number = 0; k < Auto.geometry.groups.length; k++) {
        Auto.geometry.groups[k].materialIndex = k % 20
      }

      //Auto.rotateY(Math.PI / 2)
      this.scene.add(Auto)
    })

    autos = [this.objects.Autos3, this.objects.Autos4]
    autos.forEach((Auto, index) => {
      Auto.materials[0] = new MeshPhongMaterial(rotesRuecklicht)
      Auto.materials[1] = new MeshPhongMaterial(xenonFrontlicht)
      Auto.materials[2] = null
      Auto.materials[3] = null
      Auto.materials[4] = null
      Auto.materials[5] = null
      Auto.materials[6] = null
      Auto.materials[7] = null
      Auto.materials[8] = null
      Auto.materials[9] = null
      Auto.materials[10] = null
      Auto.materials[11] = null
      Auto.materials[12] = null
      Auto.materials[13] = null
      Auto.materials[14] = null

      Auto.materials[15] = new MeshPhongMaterial(rotesRuecklicht2)
      Auto.materials[16] = new MeshPhongMaterial(normalFrontlicht)
      Auto.materials[17] = null
      Auto.materials[18] = null
      Auto.materials[19] = null
      Auto.materials[20] = null
      Auto.materials[21] = null
      Auto.materials[22] = null
      Auto.materials[23] = null
      Auto.materials[24] = null
      Auto.materials[25] = null
      Auto.materials[26] = null
      Auto.materials[27] = null
      Auto.materials[28] = null
      Auto.materials[29] = null

      for (let j: number = 1; j < Auto.tubularSegments; j += 15) {
        Auto.pulseTubularLine(j, 0.2)
      }

      for (let k: number = 0; k < Auto.geometry.groups.length; k++) {
        Auto.geometry.groups[k].materialIndex = k % 30
      }

      //Auto.rotateY(Math.PI / 2)
      this.scene.add(Auto)
    })


    /*
    for (let i: number = 1; i <= 4; i++) {
      const AutosName = 'Autos' + i
      const Autos: KreiseTorus = this.objects[AutosName] as KreiseTorus
    } */

    this.objects.Autos1.position.x = -9
    this.objects.Autos1.rotateY(-Math.PI / 2)
    this.objects.Autos2.position.x = -6
    this.objects.Autos2.rotateY(-Math.PI / 2)
    this.objects.Autos3.position.x = -3
    this.objects.Autos3.rotateY(-Math.PI / 2)
    this.objects.Autos4.position.x = 3
    this.objects.Autos4.rotateY(Math.PI / 2)
    this.objects.Autos5.position.x = 6
    this.objects.Autos5.rotateY(Math.PI / 2)
    this.objects.Autos6.position.x = 9
    this.objects.Autos6.rotateY(Math.PI / 2)

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

      this.objects.Autos1.rotation.z = ticks * +0.00004
      this.objects.Autos2.rotation.z = ticks * +0.00008
      this.objects.Autos3.rotation.z = ticks * +0.00012

      this.objects.Autos4.rotation.z = ticks * +0.00012
      this.objects.Autos5.rotation.z = ticks * +0.00008
      this.objects.Autos6.rotation.z = ticks * +0.00004
    }

    if (this.kreise.autoplay.camera) {
      this.camera.rotation.x = ticks * 0.00004
      this.camera.rotation.z = ticks * 0.00001
    }
  }
}