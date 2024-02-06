import KreiseEpisode, { ObjectInterface } from './KreiseEpisode'

import {
  Scene,
  Camera,
  Group,
  Object3D,
  MeshPhongMaterial,
  MeshDepthMaterial
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

export default class AutobahnEpisode extends KreiseEpisode {
  flyCurveTicks: number
  flyCurveDirection: Vector3
  flyCurveNormal: Vector3
  colorScheme: string

  keydown (event: KeyboardEvent): void { console.log(event) } // stub to shutup linter about event
  keyup (event: KeyboardEvent): void { console.log(event) }

  // remember the kreise scene is the main scene and this one is local to the episode :)
  constructor (kreise: Kreise, scene: Scene, camera: Camera, domElement = HTMLElement) {
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
            this.kreise.autoplay.animation = !this.kreise.autoplay.animation
          }
          break
        case 'KeyU':
          Object.entries(this.objects).forEach(([object, index]) => {
            console.log(object)
            if (this.objects[object] instanceof KreiseTorus) {
              this.objects[object].materials.forEach((material, index) => {
                console.log(material)
                material.wireframe = !material.wireframe
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

    // Jetzt die Autos!
    let autos: KreiseTorus[] = [this.objects.Autos1, this.objects.Autos6]
    autos.forEach((Auto, index) => {
      Auto.materials[0] = new MeshPhongMaterial({ color: 0xeb4c34, shininess: 400 }) // rote Rücklichter
      Auto.materials[1] = new MeshPhongMaterial({ color: 0xd1e2f6, shininess: 400 }) // xenon Frontscheinwerfer
      Auto.materials[2] = new MeshDepthMaterial() // try
      Auto.materials[3] = new MeshDepthMaterial() // try
      Auto.materials[4] = new MeshDepthMaterial() // try
      Auto.materials[5] = new MeshDepthMaterial() // try

      Auto.materials[6] = new MeshPhongMaterial({ color: 0xcc321b, shininess: 350 }) // rote Rücklichter 2
      Auto.materials[7] = new MeshPhongMaterial({ color: 0xd3c71b, shininess: 300 }) // normale Frontscheinwerfer
      Auto.materials[8] = new MeshDepthMaterial() // try
      Auto.materials[9] = new MeshDepthMaterial() // try
      Auto.materials[10] = new MeshDepthMaterial() // try
      Auto.materials[11] = new MeshDepthMaterial() // try

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
      Auto.materials[0] = new MeshPhongMaterial({ color: 0xeb4c34, shininess: 400 }) // rote Rücklichter
      Auto.materials[1] = new MeshPhongMaterial({ color: 0xd1e2f6, shininess: 400 }) // xenon Frontscheinwerfer
      Auto.materials[2] = new MeshDepthMaterial() // try
      Auto.materials[3] = new MeshDepthMaterial() // try
      Auto.materials[4] = new MeshDepthMaterial() // try
      Auto.materials[5] = new MeshDepthMaterial() // try
      Auto.materials[6] = new MeshDepthMaterial() // try
      Auto.materials[7] = new MeshDepthMaterial() // try
      Auto.materials[8] = new MeshDepthMaterial() // try
      Auto.materials[9] = new MeshDepthMaterial() // try

      Auto.materials[10] = new MeshPhongMaterial({ color: 0xcc321b, shininess: 350 }) // rote Rücklichter 2
      Auto.materials[11] = new MeshPhongMaterial({ color: 0xd3c71b, shininess: 300 }) // normale Frontscheinwerfer
      Auto.materials[12] = new MeshDepthMaterial() // try
      Auto.materials[13] = new MeshDepthMaterial() // try
      Auto.materials[14] = new MeshDepthMaterial() // try
      Auto.materials[15] = new MeshDepthMaterial() // try
      Auto.materials[16] = new MeshDepthMaterial() // try
      Auto.materials[17] = new MeshDepthMaterial() // try
      Auto.materials[18] = new MeshDepthMaterial() // try
      Auto.materials[19] = new MeshDepthMaterial() // try

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
      Auto.materials[0] = new MeshPhongMaterial({ color: 0xeb4c34, shininess: 400 }) // rote Rücklichter
      Auto.materials[1] = new MeshPhongMaterial({ color: 0xd1e2f6, shininess: 400 }) // xenon Frontscheinwerfer
      Auto.materials[2] = new MeshDepthMaterial() // try
      Auto.materials[3] = new MeshDepthMaterial() // try
      Auto.materials[4] = new MeshDepthMaterial() // try
      Auto.materials[5] = new MeshDepthMaterial() // try
      Auto.materials[6] = new MeshDepthMaterial() // try
      Auto.materials[7] = new MeshDepthMaterial() // try
      Auto.materials[8] = new MeshDepthMaterial() // try
      Auto.materials[9] = new MeshDepthMaterial() // try
      Auto.materials[10] = new MeshDepthMaterial() // try
      Auto.materials[11] = new MeshDepthMaterial() // try
      Auto.materials[12] = new MeshDepthMaterial() // try
      Auto.materials[13] = new MeshDepthMaterial() // try
      Auto.materials[14] = new MeshDepthMaterial() // try

      Auto.materials[15] = new MeshPhongMaterial({ color: 0xcc321b, shininess: 350 }) // rote Rücklichter 2
      Auto.materials[16] = new MeshPhongMaterial({ color: 0xd3c71b, shininess: 300 }) // normale Frontscheinwerfer
      Auto.materials[17] = new MeshDepthMaterial() // try
      Auto.materials[18] = new MeshDepthMaterial() // try
      Auto.materials[19] = new MeshDepthMaterial() // try
      Auto.materials[20] = new MeshDepthMaterial() // try
      Auto.materials[21] = new MeshDepthMaterial() // try
      Auto.materials[22] = new MeshDepthMaterial() // try
      Auto.materials[23] = new MeshDepthMaterial() // try
      Auto.materials[24] = new MeshDepthMaterial() // try
      Auto.materials[25] = new MeshDepthMaterial() // try
      Auto.materials[26] = new MeshDepthMaterial() // try
      Auto.materials[27] = new MeshDepthMaterial() // try
      Auto.materials[28] = new MeshDepthMaterial() // try
      Auto.materials[29] = new MeshDepthMaterial() // try

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
    this.objects.Bahn2.rotation.z = ticks * -0.00005
    this.objects.Bahn3.rotation.z = ticks * -0.00005

    this.objects.Bahn6.rotation.z = ticks * -0.00005
    this.objects.Bahn7.rotation.z = ticks * -0.00005

    this.objects.Autos1.rotation.z = ticks * +0.00002
    this.objects.Autos2.rotation.z = ticks * +0.00008
    this.objects.Autos3.rotation.z = ticks * +0.00015

    this.objects.Autos4.rotation.z = ticks * +0.00015
    this.objects.Autos5.rotation.z = ticks * +0.00008
    this.objects.Autos6.rotation.z = ticks * +0.00002

    this.camera.rotateX(ticks * 0.0000001)
    this.camera.rotateZ(ticks * 0.00000005)


    /*
    if (this.kreise.autoplay.camera) {
      const flyCurveProgress: number = (ticks % this.flyCurveTicks) / this.flyCurveTicks
      const flyCurveProgressAhead: number = ((ticks + 500) % this.flyCurveTicks) / this.flyCurveTicks

      const flyCurvePosition: Vector3 =
        flyCurveVectors.getPointAt(flyCurveProgress)

      const flyCurvePositionLookAt: Vector3 = flyCurveVectors.getPointAt(
        flyCurveProgressAhead
      )

      this.flyCurveDirection
        .subVectors(flyCurvePositionLookAt, flyCurvePosition)
        .normalize()
      this.flyCurveNormal
        .subVectors(new Vector3(0, 0, 100), flyCurvePosition)
        .normalize()

      this.camera.position.copy(flyCurvePosition)
      this.camera.lookAt(flyCurvePositionLookAt)
      this.camera.up.copy(this.flyCurveNormal)
    } else {
      if (import.meta.env.DEV) {
        const flyCurveProgress: number = (ticks % this.flyCurveTicks) / this.flyCurveTicks

        const flyCurvePosition: Vector3 =
          flyCurveVectors.getPointAt(flyCurveProgress)

        /* const flyCurveProgressAhead: number =
          ((ticks + 50) % flyCurveTicks) / flyCurveTicks

        const flyCurvePositionLookAt: Vector3 = flyCurveVectors.getPointAt(
          flyCurveProgressAhead
        ) 

//        cameraEyeHelper.position.copy(flyCurvePosition)
      }
    }
    */
  }
}

      /*

    if (animation.enabled && animation.play) {
      TorusSeven.getMesh().rotation.x = ticks * 0.00001
      TorusSeven.getMesh().rotation.z = ticks * -0.00001

      TorusZero.getMesh().rotation.x = ticks * 0.00001

      TorusOne.getMesh().rotation.x = ticks * 0.00001
      TorusOne.getMesh().rotation.z = ticks * 0.0001

      TorusTwo.getMesh().rotation.x = ticks * 0.00001
      TorusTwo.getMesh().rotation.z = ticks * -0.0001

      TorusThree.getMesh().rotation.x = ticks * 0.00002
      TorusThree.getMesh().rotation.y = ticks * -0.00002
      TorusThree.getMesh().rotation.z = ticks * 0.0001

      TorusFour.getMesh().rotation.x = ticks * -0.00002
      TorusFour.getMesh().rotation.y = ticks * 0.00002

      TorusFive.getMesh().rotation.y = ticks * -0.00003
      // Rainbow Flow
      TorusFive.getMesh().rotation.z = ticks * -0.00015

      TorusSix.getMesh().rotation.y = ticks * 0.00003
      // Piano Flow
      TorusSix.getMesh().rotation.z = ticks * 0.00015

    }

      const torusChangeRate: number = ((ticks % 100) / 100)

      let tubularSegment: number
      let radialSegment: number
      let vertexTemp: Vector3 = new Vector3
      let normalTemp: Vector3 = new Vector3

      let verticesTemp: any = []

      // console.log(TorusOne.geometry.vertices)

      let vertex: Vector3
      let i: number
      for (i = 0; i < oldVertices; i += 3) {

          vertex = new Vector3(oldVertices[i], oldVertices[i+1], oldVertices[i+2])
          const newVertex: Vector3 = vertex.multiplyScalar(torusChangeRate)

          verticesTemp.push(newVertex)

      }
      const positionAttributeTemp = new Float32BufferAttribute(verticesTemp, 3)
      TorusOne.geometry.setAttribute('position', positionAttributeTemp)
      */
      /*
      vertexTemp.x = (TorusOne.radius + (TorusOne.tube * Math.cos(radialRad) + (Math.sin(torusRateRad) * rippleDepth * Math.cos(radialRad)))) * Math.cos(tubularRad)
      vertexTemp.y = (TorusOne.radius + (TorusOne.tube * Math.cos(radialRad)) + (Math.sin(torusRateRad) * rippleDepth * Math.cos(radialRad))) * Math.sin(tubularRad)
      // (TorusOne.radius + TorusOne.tube * Math.cos(radialRad)) * (Math.cos(tubularRad) + Math.sin(torusRateRad) + Math.sin(tubularRad * 3))
      // vertexTemp.y = (TorusOne.radius + Math.sin(torusRateRad) + TorusOne.tube * Math.cos(radialRad)) * Math.sin(tubularRad)
      vertexTemp.z = (TorusOne.tube + (Math.sin(torusRateRad) * rippleDepth * Math.cos(radialRad))) * Math.sin(radialRad)

      verticesTemp.push(vertexTemp.x, vertexTemp.y, vertexTemp.z)
      const positionAttributeTemp = new Float32BufferAttribute(verticesTemp, 3)
      //positionAttributeTemp.needsUpdate = true
      TorusOne.geometry.setAttribute('position', positionAttributeTemp)

      if (ticks % 90 == 0) {
        console.log(oldNormals)
        console.log(verticesTemp)
        console.log (TorusOne.geometry.getAttribute('position'))
      }
      */

      // TorusOne.updateMesh()

      // if (ticks % 30 == 0) {
      /*
      oscillator.frequency.value = (Math.floor(camera.position.distanceTo(TorusSix.getMesh().position)) * (110.5 / 12)) + 110.5
      oscillator2.frequency.value = (Math.floor(camera.position.distanceTo(TorusSix.getMesh().position)) * (221 / 12)) + 221
      oscillator4.frequency.value = (Math.floor(camera.position.distanceTo(TorusSix.getMesh().position)) * (55.25 / 12)) + 55.25

      oscillator.frequency.value = (Math.floor(camera.position.y) * (110.5 / 12)) + 110.5
      oscillator2.frequency.value = (Math.floor(camera.position.y) * (221 / 12)) + 221
      oscillator3.frequency.value = (Math.floor(camera.position.y) * (442 / 12)) + 442
      oscillator4.frequency.value = (Math.floor(camera.rotation.y) * (55.25 / 12)) + 55.25
      // console.log(oscillator.frequency.value)
      // console.log(Math.floor(camera.position.x))
      }
      */


    // End Episode
    /*
      if (ticks == Math.floor((flyCurveTicks * 1)) || (import.meta.env.DEV && (ticks == Math.floor((flyCurveTicks / 20))))) {
        autofly = false;
        episode = 2;
        episodeStartTicks[2] = ticks

        camera.lookAt(0,0,0);
        document.body.appendChild(controlPanelDiv());
      } */
 
      /*
  if (episode === 2) {
    TorusOne.getMesh().rotation.x = TorusOne.getMesh().rotation.x * 0.997

    TorusTwo.getMesh().rotation.x = TorusTwo.getMesh().rotation.x * 0.997

    TorusThree.getMesh().rotation.x = TorusThree.getMesh().rotation.x * 0.997
    TorusThree.getMesh().rotation.y = TorusThree.getMesh().rotation.y * 0.997

    TorusFour.getMesh().rotation.x = TorusFour.getMesh().rotation.x * 0.997
    TorusFour.getMesh().rotation.y = TorusFour.getMesh().rotation.y * 0.997

    if (camera.position.x > 0) camera.position.x = camera.position.x - 0.03
    if (camera.position.y > 0) camera.position.y = camera.position.y - 0.03
    if (camera.position.z < 15) camera.position.z = camera.position.z + 0.05

    if (camera.position.x < 0) camera.position.x = camera.position.x + 0.03
    if (camera.position.y < 0) camera.position.y = camera.position.y + 0.03
    if (camera.position.z > 15) camera.position.z = camera.position.z - 0.05

    const controlPanelDiv = document.querySelector(
      'div#controlPanelDiv'
    ) as HTMLDivElement
    controlPanelDiv.style.opacity = (
      parseInt(controlPanelDiv.style.opacity) + 0.01
    ).toString()

    if (!episodeOneShots[2]) {
      // fly to 0,0,10
      // camera.position.set(0,0,15)

      // hide header
      introDiv.style.transition = 'opacity 10s linear 0s'
      introDiv.style.opacity = '0'

       document.querySelector('button#openCloseControlPanelButton')!.onClick =
        function () {
          document.querySelector(
            'button#openCloseControlPanelButton'
          )!.innerHTML = 'Alpha Version'
        }
      episodeOneShots[2] = true
    }

    if (episodeStartTicks[2] + 2000 < ticks) {
      // document.body.removeChild(document.querySelector('div#controlPanelDiv'))

      ticks = 0
      autofly = true
      episode = 1
    }
  }

  */

  // cameraControls.update();
  // cameraControls.update(clock.getDelta());
  // if (clock.getDelta() < 0.016) {