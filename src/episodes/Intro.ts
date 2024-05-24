import KreiseEpisode from '../Kreise/KreiseEpisode.ts'

import {
  Scene,
  Camera,
  MeshPhongMaterial,
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

import { KlavierTorus, KreiseShaderedTorus, KreiseTorus } from '../Kreise/KreiseTorus'

import turboTextureImage from '../textures/turbo.png'

import { ColorSchemes, flyCurveVectors } from '../Kreise/KreiseConsts'
import type Kreise from '../Kreise/Kreise.ts'

export default class IntroEpisode extends KreiseEpisode {
  flyCurveTicks: number
  flyCurveDirection: Vector3
  flyCurveNormal: Vector3
  colorScheme: string

  keydown (e: KeyboardEvent): void { console.log(e) } // stub to shutup linter about event
  keyup (e: KeyboardEvent): void { console.log(e) }

  // remember the kreise scene is the main scene and this one is local to the episode :)
  constructor (kreise: Kreise, scene: Scene, camera: Camera) {
    super(kreise, scene, camera)

    this.colorScheme = kreise.ColorScheme // set this up in main.ts

    this.flyCurveTicks = 0 // set up in makeScene
    this.flyCurveDirection = new Vector3()
    this.flyCurveNormal = new Vector3()

    // Controls
    this.keydown = function (e: KeyboardEvent) {
      switch (e.code) {
        case 'KeyI':
          if (this.kreise.client.developerMode) {
            this.graph.meshes.flyCurveMesh.visible = !this.graph.meshes.flyCurveMesh.visible
          }
          break
      }
    }

    const _keydown = this.keydown.bind(this)
    const _keyup = this.keyup.bind(this)
    window.addEventListener('keydown', _keydown)
    window.addEventListener('keyup', _keyup)

  }

  dispose (): void {

    const _keydown = this.keydown.bind(this)
    const _keyup = this.keyup.bind(this)
    window.removeEventListener('keydown', _keydown)
    window.removeEventListener('keyup', _keyup)

  }

  load (): void { // its stored in this.scene, get it from there
  // Tori

    

    this.graph.kreiseMeshes.TorusZero = new KreiseTorus({ identity: 'TorusZero', radius: 6, tube: 1.5, lod: 32,
      color: new Color(parseInt('0xffffff')), facing: 'inverse'
    })
    
    this.graph.kreiseMeshes.TorusOne = new KreiseTorus({ identity: 'TorusOne', radius: 6, tube: 0.8, lod: 24,
      color: new Color(parseInt('0x' + ColorSchemes[this.kreise.ColorScheme][0])), facing: 'inverse'
    })
    
    this.graph.kreiseMeshes.TorusTwo = new KreiseTorus({ identity: 'TorusTwo', radius: 6, tube: 0.6, lod: 16,
      color: new Color(parseInt('0x' + ColorSchemes[this.kreise.ColorScheme][1])), facing: 'normal'
    })

    this.graph.kreiseMeshes.TorusThree = new KreiseTorus({ identity: 'TorusThree', radius: 8, tube: 0.5, lod: 16,
      color: new Color(parseInt('0x' + ColorSchemes[this.kreise.ColorScheme][2])), facing: 'inverse'
    })

    this.graph.kreiseMeshes.TorusFour = new KreiseTorus({ identity: 'TorusFour', radius: 9, tube: 0.5, lod: 16,
      color: new Color(parseInt('0x' + ColorSchemes[this.kreise.ColorScheme][3])), facing: 'inverse'
    })

    this.graph.kreiseMeshes.TorusFive = new KreiseTorus({ identity: 'TorusFive', radius: 11, tube: 0.8, lod: 24,
      color: new Color(parseInt('0x' + ColorSchemes[this.kreise.ColorScheme][4])), facing: 'inverse'
    })

    this.graph.kreiseMeshes.KlavierTorus = new KlavierTorus() // identity is always KlavierTorus

    this.graph.kreiseMeshes.ShaderedTorus = new KreiseShaderedTorus({ identity: 'TorusSeven', radius: 6, tube: 1,
      tubularSegments: 256, radialSegments: 32
    })

    const turboTexture = new TextureLoader().load(turboTextureImage)
    turboTexture.wrapS = MirroredRepeatWrapping
    turboTexture.repeat.set(4, 1)

    // shorthand
    const TorusFive = this.graph.kreiseMeshes.TorusFive as KreiseTorus

    // shorthand
    const materialshorthand = TorusFive.materials[0] as MeshPhongMaterial

    materialshorthand.transparent = true
    materialshorthand.opacity = 0.85
    materialshorthand.map = turboTexture
    TorusFive.updateMesh()

    const TorusOne = this.graph.kreiseMeshes.TorusOne as KreiseTorus

    let i: number = 0
    let rate: number = 0
    for (i = 0; i <= TorusOne.tubularSegments; i++) {
      // from 0 to 1
      rate = (i / 48) // anything 48
      rate = Math.sin(rate * Math.PI * 2) + Math.cos(rate * Math.PI * 2)
      TorusOne.pulseTubularLine(i, rate * 0.1)
    }

    TorusOne.materials[0].transparent = true
    TorusOne.materials[0].opacity = 0.3

    const TorusTwo = this.graph.kreiseMeshes.TorusTwo as KreiseTorus

    for (i = 0; i <= TorusTwo.tubularSegments; i++) {
      // from 0 to 1
      rate = (i / 96) // anything 48
      rate = Math.sin(rate * Math.PI * 2)
      TorusTwo.pulseTubularLine(i, rate * 0.2)
    }

    TorusTwo.materials[0].transparent = true
    TorusTwo.materials[0].opacity = 0.8

    this.scene.add(this.graph.kreiseMeshes.TorusZero, this.graph.kreiseMeshes.TorusOne, this.graph.kreiseMeshes.TorusTwo, this.graph.kreiseMeshes.TorusThree, this.graph.kreiseMeshes.TorusFour, this.graph.kreiseMeshes.TorusFive)
    this.scene.add(this.graph.kreiseMeshes.KlavierTorus, this.graph.kreiseMeshes.ShaderedTorus )

    // FlyCurve-Stuff

    const flyCurveMaterial: MeshLambertMaterial = new MeshLambertMaterial({
      emissive: 0x888800, map: turboTexture, transparent: true, opacity: 0.3
    })

    const flyCurveGeometry: TubeGeometry = new TubeGeometry(flyCurveVectors, 500, 0.2, 16)

    this.graph.meshes.flyCurveMesh = new Mesh(flyCurveGeometry, flyCurveMaterial)
    this.graph.meshes.flyCurveMesh.name = 'flyCurveMesh'
    this.graph.meshes.flyCurveMesh.visible = false

    this.scene.add(this.graph.meshes.flyCurveMesh)

    // const flyCurveSegments: number = flyCurvePoints.length
    this.flyCurveTicks = Math.floor(Math.random() * 60000) + 900000 // how many ticks for one flythrough

    this.flyCurveDirection = new Vector3()
    // const flyCurveBinormal = new Vector3()
    this.flyCurveNormal = new Vector3()

  }

  update (ticks: number): void {

    this.graph.kreiseMeshes.ShaderedTorus.rotation.x = ticks * 0.00001
    this.graph.kreiseMeshes.ShaderedTorus.rotation.z = ticks * 0.00001

    this.graph.kreiseMeshes.TorusZero.rotation.x = ticks * 0.00001

    this.graph.kreiseMeshes.TorusOne.rotation.x = ticks * 0.00001
    this.graph.kreiseMeshes.TorusOne.rotation.z = ticks * 0.0001

    this.graph.kreiseMeshes.TorusTwo.rotation.x = ticks * 0.00001
    this.graph.kreiseMeshes.TorusTwo.rotation.z = ticks * -0.0001

    this.graph.kreiseMeshes.TorusThree.rotation.x = ticks * 0.00002
    this.graph.kreiseMeshes.TorusThree.rotation.y = ticks * -0.00002
    this.graph.kreiseMeshes.TorusThree.rotation.z = ticks * 0.0001

    this.graph.kreiseMeshes.TorusFour.rotation.x = ticks * -0.00002
    this.graph.kreiseMeshes.TorusFour.rotation.y = ticks * 0.00002

    this.graph.kreiseMeshes.TorusFive.rotation.y = ticks * -0.00003
    this.graph.kreiseMeshes.TorusFive.rotation.z = ticks * -0.00015

    this.graph.kreiseMeshes.KlavierTorus.rotation.y = ticks * 0.00003
    this.graph.kreiseMeshes.KlavierTorus.rotation.z = ticks * 0.00015

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

    if (this.kreise.autoplay.camera) {

      this.camera.position.copy(flyCurvePosition)
      this.camera.lookAt(flyCurvePositionLookAt)
      this.camera.up.copy(this.flyCurveNormal)

    } else {

      if (this.kreise.client.developerMode) {
       
        this.kreise.graph.helpers.cameraEyeHelper.position.copy(flyCurvePosition)
      }

    }
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