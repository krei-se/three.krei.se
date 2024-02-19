import KreiseEpisode from './KreiseEpisode'

import {
  Scene,
  Camera,
  MeshPhongMaterial,
  PointLight,
  PointLightHelper,
  MeshStandardMaterial
} from 'three'

import { KreiseTorus } from '../KreiseTorus'

import type Kreise from '../Kreise.ts'
import { domElementType } from '../Kreise.ts'

export default class ChemnitzEpisode extends KreiseEpisode {

  // remember the kreise scene is the main scene and this one is local to the episode :)
  constructor (kreise: Kreise, scene: Scene, camera: Camera, domElement: domElementType) {
    super(kreise, scene, camera, domElement)

    // Controls
    this.keydown = function (event) {
      switch (event.code) {
        case 'KeyO':
          if (this.kreise.client.developerMode) {
            this.kreise.autoplay.camera = !this.kreise.autoplay.camera
            if (this.kreise.autoplay.camera) {
              this.camera.position.set(0, 0, -20)
              this.camera.lookAt(0, 0, 0)
            }
          }
          break
      }
    }

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
    const _keyup = this.keyup.bind(this)
    window.removeEventListener('keydown', _keydown)
    window.removeEventListener('keyup', _keyup)
  }

  makeScene (): void { // its stored in this.scene, get it from there
  // Tori

    this.objects.Lulatsch = new KreiseTorus({
      identity: 'Lulatsch',
      radius: 16,
      tube: 8,
      lod: 3,
      facing: 'inverse',
      geogrouping: 'vertical'
    })

    const aquamarin = 0x77CCCC
    const erdbeerrot = 0xD14152
    const gelbgruen = 0x55AA33
    const himmelblau = 0x3077BB
    const melonengelb = 0xFFAA00
    const signalviolett = 0xCC00FF
    const verkehrsgelb = 0xF0C900
    const topgold = 0xEEE8AA
    const black = 0x000000

    const Lulatsch = this.objects.Lulatsch as KreiseTorus

    let transparency: boolean
    let opacity: number
    if (this.kreise.brightness === 0) {
      transparency = true
      opacity = 0.66
    }
    else {
      transparency = false
      opacity = 1
    }

    const nullMaterial = new MeshStandardMaterial({ color: 0x000000, transparent: true, opacity: 0})

    const intensity: number = 1.5

    Lulatsch.materials[0] = new MeshPhongMaterial({ transparent: transparency, opacity: opacity, color: black, shininess: 300, emissive: aquamarin, emissiveIntensity: intensity })
    Lulatsch.materials.push(nullMaterial)
    Lulatsch.materials.push(new MeshPhongMaterial({ transparent: transparency, opacity: opacity, color: black, shininess: 300, emissive: erdbeerrot, emissiveIntensity: intensity }))
    Lulatsch.materials.push(nullMaterial)
    Lulatsch.materials.push(new MeshPhongMaterial({ transparent: transparency, opacity: opacity, color: black, shininess: 300, emissive: gelbgruen, emissiveIntensity: intensity }))
    Lulatsch.materials.push(nullMaterial)
    Lulatsch.materials.push(new MeshPhongMaterial({ transparent: transparency, opacity: opacity, color: black, shininess: 300, emissive: himmelblau, emissiveIntensity: intensity }))
    Lulatsch.materials.push(nullMaterial)
    Lulatsch.materials.push(new MeshPhongMaterial({ transparent: transparency, opacity: opacity, color: black, shininess: 300, emissive: melonengelb, emissiveIntensity: intensity }))
    Lulatsch.materials.push(nullMaterial)
    Lulatsch.materials.push(new MeshPhongMaterial({ transparent: transparency, opacity: opacity, color: black, shininess: 300, emissive: signalviolett, emissiveIntensity: intensity }))
    Lulatsch.materials.push(nullMaterial)
    Lulatsch.materials.push(new MeshPhongMaterial({ transparent: transparency, opacity: opacity, color: black, shininess: 300, emissive: verkehrsgelb, emissiveIntensity: intensity }))
    Lulatsch.materials.push(nullMaterial)
    Lulatsch.materials.push(new MeshPhongMaterial({ transparent: transparency, opacity: opacity, color: black, shininess: 300, emissive: topgold, emissiveIntensity: intensity }))
    Lulatsch.materials.push(nullMaterial)

    for (let k: number = 0; k < Lulatsch.geometry.groups.length; k++) {
      Lulatsch.geometry.groups[k].materialIndex = k % Lulatsch.materials.length
    }

    Lulatsch.rotateX(Math.PI / 2)
    Lulatsch.rotateY(-Math.PI / 2)

    this.scene.add(this.objects.Lulatsch)

    let pointlightshorthand = this.kreise.objects.pointLight as PointLight
    pointlightshorthand.position.set(0, 0, 30)
    pointlightshorthand.intensity = 600

    this.objects.pointLight = new PointLight('red', 800, 50, 1.5)
    this.objects.pointLight.position.set(0, 0, 10)
    this.scene.add(this.objects.pointLight)

    this.objects.pointLightTwo = new PointLight('red', 800, 50, 1.5)
    this.objects.pointLightTwo.position.set(0, 0, 10)
    this.scene.add(this.objects.pointLightTwo)

    this.objects.pointLightHelper = new PointLightHelper(this.objects.pointLight, undefined, 'orange')
    //this.scene.add(this.objects.pointLightHelper)

    this.camera.position.set(0, 0, -20)
    this.camera.lookAt(0, 0, 0)
    //this.camera.rotateZ(-Math.PI / 2)
  }

  update (ticks: number): void {

    if (this.kreise.autoplay.animation) {

      this.objects.Lulatsch.rotation.z = 2 * Math.sin(ticks / 10000)

      this.objects.pointLight.position.x = 10 * Math.sin((ticks / 1000))
      this.objects.pointLightTwo.position.x = -10 * Math.sin((ticks / 1000))

    }

  }
}