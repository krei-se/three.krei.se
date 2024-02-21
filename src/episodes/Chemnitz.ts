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
            if (this.kreise.autoplay.camera) {
              this.camera.position.set(0, 0, -20)
              this.camera.lookAt(0, 0, 0)
            }
            else {
              this.kreise.objects.cameraEyeHelper.position.set(0, 0, -20)
            }
          }
          console.log(this.camera.position)
          break
      }
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
    // const black = 0x000000

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

    opacity = 0.6

    const nullMaterial = new MeshStandardMaterial({ color: 0x000000, transparent: true, opacity: 0})

    const intensity: number = 1
    const shininess: number = 200

    Lulatsch.materials[0] = new MeshPhongMaterial({ transparent: transparency, opacity: opacity, color: aquamarin, shininess: shininess, emissive: aquamarin, emissiveIntensity: intensity })
    Lulatsch.materials.push(nullMaterial)
    Lulatsch.materials.push(new MeshPhongMaterial({ transparent: transparency, opacity: opacity, color: erdbeerrot, shininess: shininess, emissive: erdbeerrot, emissiveIntensity: intensity }))
    Lulatsch.materials.push(nullMaterial)
    Lulatsch.materials.push(new MeshPhongMaterial({ transparent: transparency, opacity: opacity, color: gelbgruen, shininess: shininess, emissive: gelbgruen, emissiveIntensity: intensity }))
    Lulatsch.materials.push(nullMaterial)
    Lulatsch.materials.push(new MeshPhongMaterial({ transparent: transparency, opacity: opacity, color: himmelblau, shininess: shininess, emissive: himmelblau, emissiveIntensity: intensity }))
    Lulatsch.materials.push(nullMaterial)
    Lulatsch.materials.push(new MeshPhongMaterial({ transparent: transparency, opacity: opacity, color: melonengelb, shininess: shininess, emissive: melonengelb, emissiveIntensity: intensity }))
    Lulatsch.materials.push(nullMaterial)
    Lulatsch.materials.push(new MeshPhongMaterial({ transparent: transparency, opacity: opacity, color: signalviolett, shininess: shininess, emissive: signalviolett, emissiveIntensity: intensity }))
    Lulatsch.materials.push(nullMaterial)
    Lulatsch.materials.push(new MeshPhongMaterial({ transparent: transparency, opacity: opacity, color: verkehrsgelb, shininess: shininess, emissive: verkehrsgelb, emissiveIntensity: intensity }))
    Lulatsch.materials.push(nullMaterial)
    Lulatsch.materials.push(new MeshPhongMaterial({ transparent: transparency, opacity: opacity, color: topgold, shininess: shininess, emissive: topgold, emissiveIntensity: intensity }))
    Lulatsch.materials.push(nullMaterial)

    for (let k: number = 0; k < Lulatsch.geometry.groups.length; k++) {
      Lulatsch.geometry.groups[k].materialIndex = k % Lulatsch.materials.length
    }

    Lulatsch.rotateX(Math.PI / 2)
    Lulatsch.rotateY(-Math.PI / 2)

    this.scene.add(this.objects.Lulatsch)

    this.objects.pointLight = new PointLight('red', 800, 100, 1)
    this.objects.pointLight.position.set(0, 0, 10)
    this.scene.add(this.objects.pointLight)

    this.objects.pointLightTwo = new PointLight('red', 800, 100, 1)
    this.objects.pointLightTwo.position.set(0, 0, 10)
    this.scene.add(this.objects.pointLightTwo)

    this.objects.pointLightHelper = new PointLightHelper(this.objects.pointLight, undefined, 'orange')
    this.objects.pointLightHelperTwo = new PointLightHelper(this.objects.pointLightTwo, undefined, 'red')
    
    // this.scene.add(this.objects.pointLightHelper)
    // this.scene.add(this.objects.pointLightHelperTwo)

    this.camera.position.set(0, 0, -20)
    this.camera.lookAt(0, 0, 0)
    //this.camera.rotateZ(-Math.PI / 2)

    this.kreise.objects.cameraEyeHelper.position.set(0, 0, -20)

  }

  update (ticks: number): void {

    // 240 000 ticks (4 Minutes)
    if (this.kreise.autoplay.animation) {

      this.objects.Lulatsch.rotation.z = Math.sin(Math.PI*2 * (ticks / 20000)) * 2 
      //this.objects.Lulatsch.rotation.y = 3 * Math.sin(ticks / 40000)
            
      if (ticks > 0 && ticks < 20000) {
          // 0 to 1               PI is half a rotation, so quarter rotation is PI/2, subtract PI/2 from initial rotation
      this.objects.Lulatsch.rotation.y = (((ticks - 0) / 20000) * (Math.PI/2)) - (Math.PI/2)
      }

      if (ticks > 60000 && ticks < 80000) {
              // 0 to 1                PI is half rotation in rad, so quarter rotation is PI/2, current rotation is 0 rad
      this.objects.Lulatsch.rotation.y = (((ticks - 60000) / 20000) * (Math.PI/2))
      }

      if (ticks > 120000 && ticks < 140000) {
                // 0 to 1               PI is half a rotation, so quarter rotation is PI/2, add PI/2 from previous rotation
      this.objects.Lulatsch.rotation.y = (((ticks - 120000) / 20000) * (Math.PI/2)) + (Math.PI/2)
      }

      if (ticks > 180000 && ticks < 200000) {
        // 0 to 1                PI is half rotation in rad, so quarter rotation is PI/2, , ends in + half PI ?
      this.objects.Lulatsch.rotation.y = (((ticks - 180000) / 20000) * (Math.PI/2)) + (Math.PI)
      }

      this.objects.pointLight.position.x = 10 * Math.sin((ticks / 2000))
      this.objects.pointLightTwo.position.x = -10 * Math.sin((ticks / 3000))

    }

    else {

      console.log(this.objects.Lulatsch.rotation)

    }

  }

}