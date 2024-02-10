import KreiseEpisode, { ObjectInterface } from './KreiseEpisode'

import {
  Scene,
  Camera,
  Group,
  Object3D,
  MeshPhongMaterial,
  MeshDepthMaterial,
  MeshPhongMaterial,
  PointLight,
  PointLightHelper
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

export default class ChemnitzEpisode extends KreiseEpisode {

  keydown (event: KeyboardEvent): void { console.log(event) } // stub to shutup linter about event
  keyup (event: KeyboardEvent): void { console.log(event) }

  // remember the kreise scene is the main scene and this one is local to the episode :)
  constructor (kreise: Kreise, scene: Scene, camera: Camera, domElement: HTMLElement) {
    super(kreise, scene, camera, domElement)

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
              this.camera.position.set(0, 0, -20)
              this.camera.lookAt(0, 0, 0)
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

    this.objects.Lulatsch = new KreiseTorus({
      identity: 'Lulatsch',
      radius: 18,
      tube: 12,
      lod: 2,
      facing: 'inverse',
      geogrouping: 'vertical'
    })

    const aquamarin = 0x77CCCC
    const erdbeerrot = 0xD14152
    const gelbgruen = 0x55AA33
    const himmelblau = 0x3077BB
    const melonengelb = 0xFFAA00
    const signalviolett = 0xF2F900
    const verkehrsgelb = 0xF0C900
    const topgold = 0xEEE8AA

    const Lulatsch = this.objects.Lulatsch as KreiseTorus

    Lulatsch.materials.push(null)
    Lulatsch.materials.push(new MeshPhongMaterial({ color: aquamarin, shininess: 300, emissive: aquamarin, emissiveIntensity: .05 }))
    Lulatsch.materials.push(null)
    Lulatsch.materials.push(new MeshPhongMaterial({ color: erdbeerrot, shininess: 300, emissive: aquamarin, emissiveIntensity: .05 }))
    Lulatsch.materials.push(null)
    Lulatsch.materials.push(new MeshPhongMaterial({ color: gelbgruen, shininess: 300, emissive: aquamarin, emissiveIntensity: .05 }))
    Lulatsch.materials.push(null)
    Lulatsch.materials.push(new MeshPhongMaterial({ color: himmelblau, shininess: 300, emissive: aquamarin, emissiveIntensity: .05 }))
    Lulatsch.materials.push(null)
    Lulatsch.materials.push(new MeshPhongMaterial({ color: melonengelb, shininess: 300, emissive: melonengelb, emissiveIntensity: .05 }))
    Lulatsch.materials.push(null)
    Lulatsch.materials.push(new MeshPhongMaterial({ color: signalviolett, shininess: 300, emissive: signalviolett, emissiveIntensity: .05 }))
    Lulatsch.materials.push(null)
    Lulatsch.materials.push(new MeshPhongMaterial({ color: verkehrsgelb, shininess: 300, emissive: verkehrsgelb, emissiveIntensity: .05 }))
    Lulatsch.materials.push(null)
    Lulatsch.materials.push(new MeshPhongMaterial({ color: topgold, shininess: 300, emissive: topgold, emissiveIntensity: .1 }))
    Lulatsch.materials.push(null)


    for (let k: number = 0; k < Lulatsch.geometry.groups.length; k++) {
      Lulatsch.geometry.groups[k].materialIndex = k % Lulatsch.materials.length
    }

    Lulatsch.rotateX(Math.PI / 2)
    Lulatsch.rotateY(-Math.PI / 2)

    this.scene.add(this.objects.Lulatsch)

    this.objects.pointLight = new PointLight('red', 800, 150)
    this.objects.pointLight.position.set(0, 0, 10)
    this.objects.pointLight.castShadow = true
    this.objects.pointLight.shadow.radius = 20
    this.objects.pointLight.shadow.camera.near = 0.5
    this.objects.pointLight.shadow.camera.far = 40
    this.objects.pointLight.shadow.mapSize.width = 2048
    this.objects.pointLight.shadow.mapSize.height = 2048
    this.scene.add(this.objects.pointLight)

    this.objects.pointLightHelper = new PointLightHelper(this.objects.pointLight, undefined, 'orange')
    //this.scene.add(this.objects.pointLightHelper)

    this.camera.position.set(0, 0, -20)
    this.camera.lookAt(0, 0, 0)
    //this.camera.rotateZ(-Math.PI / 2)
  }

  addControls (): void {
    console.log('stub')
  }

  update (ticks: number): void {

    if (this.kreise.autoplay.animation) {

      this.objects.Lulatsch.rotation.z = Math.sin(ticks / 8000)
      this.objects.pointLight.position.x = 10 * Math.sin((ticks / 1000))
      //this.objects.pointLight.position.z = -10 * Math.cos((ticks / 1000))
    }

    if (this.kreise.autoplay.camera) {

      //this.kreise.camera.rotation.z = .3 * Math.sin(ticks / 1000)

    }

  }
}