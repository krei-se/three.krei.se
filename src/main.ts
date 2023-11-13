import './style.css'

import {
  AmbientLight,
  Clock,
  GridHelper,
  // LoadingManager,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  PCFSoftShadowMap,
  PerspectiveCamera,
  PlaneGeometry,
  PointLight,
  Scene,
  WebGLRenderer,
  Vector3,
  CatmullRomCurve3,
  SphereGeometry,
  Color,
  TextureLoader,
  PointLightHelper,
  AxesHelper,
  MirroredRepeatWrapping,
  TubeGeometry
} from 'three'

import SunCalc from 'suncalc'

import turboTextureImage from './textures/turbo.png'

// unused imports: CameraHelper, MeshStandardMaterial, BoxGeometry

// import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
// import { DragControls } from 'three/examples/jsm/controls/DragControls'
import { FlyControls } from 'three/addons/controls/FlyControls.js'

// import { StereoEffect } from 'three/addons/effects/StereoEffect.js' fcks with autoresize

// @ts-expect-errors module without declarations
import Stats from 'three/examples/jsm/libs/stats.module'
// import * as animations from './helpers/animations'
import { toggleFullScreen } from './helpers/fullscreen'
import { resizeRendererToDisplaySize } from './helpers/responsiveness'
// import { CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js'
// import { VRButton } from 'three/addons/webxr/VRButton.js';

//  import { buttonSwitchSBS } from './buttons.ts'

import { debugDiv } from './buttons.ts' // controlPanelDiv
import { getPageOverlayDiv, fadeoutDatenschutzAndInfoParagraphs } from './htmlincludes.ts'
import { KreiseTorus, KlavierTorus, KreiseShaderedTorus } from './kreiseTorus.ts'

//
// End of imports
//

document.title = 'Krei.se'
const appDiv = document.querySelector<HTMLDivElement>('#app') as HTMLDivElement

appDiv.innerHTML = ''

appDiv.append(getPageOverlayDiv())

const canvas: HTMLCanvasElement = document.createElement('canvas')
canvas.setAttribute('id', 'scene')

appDiv.append(canvas)

setTimeout(fadeoutDatenschutzAndInfoParagraphs, 5000)

//
// End of HTML
//

/*

*/

/*

*/

/*

*/

//  setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
//  import GUI from 'lil-gui'

let stats: Stats

const animation = { enabled: false, play: true }

// ===== CONTROL PANEL =====

// ===== 🖼️ CANVAS, RENDERER, & SCENE =====

const renderer: WebGLRenderer = new WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
  logarithmicDepthBuffer: true
})

// console.log(window.devicePixelRatio)

renderer.setPixelRatio(window.devicePixelRatio)

renderer.shadowMap.enabled = true
renderer.shadowMap.type = PCFSoftShadowMap

const scene: Scene = new Scene()

// ===== 💡 LIGHTS =====

const ambientLight: AmbientLight = new AmbientLight('white', 3)
const pointLight: PointLight = new PointLight('white', 150, 10)
pointLight.position.set(0, 0, 0)

pointLight.castShadow = true
pointLight.shadow.radius = 20
pointLight.shadow.camera.near = 0.5
pointLight.shadow.camera.far = 30
pointLight.shadow.mapSize.width = 2048
pointLight.shadow.mapSize.height = 2048
scene.add(ambientLight)
scene.add(pointLight)

// Change background according to day and light
const now = new Date()
// console.log(now.getUTCHours())

const suncalc = SunCalc.getTimes(new Date(), 50.84852106503032, 12.923759828615541)
console.log(suncalc)

const sunPosition = SunCalc.getPosition(new Date(), 50.84852106503032, 12.923759828615541)
console.log(sunPosition)
let brightness: number = 255

if (sunPosition.altitude < -0.1) {
  brightness = 0
}

if (sunPosition.altitude > 0.1) {
  brightness = 255
}

let altitude: number = sunPosition.altitude // in radians, so µ/2 at highest point

altitude = +0.1

// @TODO check this in anmation every minute
if (altitude < 0.1 && altitude > -0.1) {
  brightness = Math.floor(255 * ((altitude + 0.1) * 5))
}
/*
if (now > suncalc.night || now < suncalc.nightEnd) {
  brightness = 0
}

// Sunrise
if (now > suncalc.sunrise && now < suncalc.sunriseEnd) {
  brightness = (now.getTime() - suncalc.sunrise.getTime()) / (suncalc.sunriseEnd.getTime() - suncalc.sunrise.getTime())
  brightness = Math.floor(brightness * 255)
}

// Sunset
if (now > suncalc.sunsetStart && now < suncalc.night) {
  brightness = (now.getTime() - suncalc.sunrise.getTime()) / (suncalc.sunriseEnd.getTime() - suncalc.sunrise.getTime())
  brightness = Math.floor(brightness * 255)
}
*/

console.log(brightness)

console.log(suncalc.sunriseEnd.getTime() - suncalc.sunrise.getTime()) // milliseconds
console.log(suncalc.sunset.getTime() - suncalc.sunsetStart.getTime()) // milliseconds

document.body.style.setProperty('--page-background', 'rgba(' + brightness + ',' + brightness + ',' + brightness + ',0)')
scene.background = new Color('rgb(' + brightness + ', ' + brightness + ', ' + brightness + ')')
ambientLight.intensity = brightness / 50

if (brightness <= 128) {
  const introDiv: HTMLDivElement = document.querySelector('#introDiv') ?? document.createElement('div')
  introDiv.style.cssText = 'filter: invert(1);'
}

// ===== 📈 STATS & CLOCK =====

const clock: Clock = new Clock()
if (import.meta.env.DEV) {
  stats = new Stats()
  document.body.appendChild(stats.dom)
}

// ===== 📦 OBJECTS =====

// Plane

const planeGeometry = new PlaneGeometry(100, 100)
const planeMaterial = new MeshLambertMaterial({
  color: 'bisque',
  emissive: 'skyblue',
  emissiveIntensity: 0.2,
  side: 2,
  transparent: true,
  opacity: 0.4
})
const plane = new Mesh(planeGeometry, planeMaterial)
plane.rotateX(Math.PI / 2)
plane.receiveShadow = true

const ColorSchemes: any = {}
ColorSchemes.FourColours = ['FFE4C4', '87CEEB', '66CDAA', 'F08080', 'd56bd7', 'FFFFFF']
ColorSchemes.Autumn = ['9c5708', 'f47b20', 'f05133', 'ffd200', 'FFFFFF', 'FFFFFF']
ColorSchemes.PurplePath = ['a050a1', 'd56bd7', 'bc5e95', '502851', 'bc5e95', 'FFFFFF']
ColorSchemes.Cyber = ['c9f2f8', '60daea', '13ecd5', '2d84d2', 'FFFFFF', 'FFFFFF']
ColorSchemes.Phoenix = ['D1793b', 'dadbdd', 'd4af37', 'b2beb5', 'b2beb5', 'FFFFFF']
ColorSchemes.Toxic = ['f19f22', 'F3D05F', '7b4122', 'BCB455', 'FFFFFF', 'FFFFFF']
ColorSchemes.BaseColors = ['ff0000', '00ff00', '0000ff', 'ffff00', '00ffff', 'ff00ff']

let ColorScheme: string = 'FourColours'
const randomScheme: number = Math.random()
// if (randomScheme >= 0.20) ColorScheme = 'Autumn'
if (randomScheme >= 0.25) ColorScheme = 'Cyber'
if (randomScheme >= 0.50) ColorScheme = 'Phoenix'
if (randomScheme >= 0.75) ColorScheme = 'PurplePath'
// if (randomScheme >= 0.75) ColorScheme = 'Toxic'
// if (randomScheme >= 0.90) ColorScheme = 'BaseColors'

// console.log(ColorSchemes)
// console.log(ColorScheme)

// Google referrer

// console.log(document.referrer)

if (document.referrer.includes('google')) {
  ColorScheme = 'FourColours'
}

// Torus

const TorusZero = new KreiseTorus({
  identity: 'TorusZero',
  radius: 6,
  tube: 1.5,
  color: new Color(parseInt('0xffffff')),
  facing: 'inverse'
})

const TorusOne = new KreiseTorus({
  identity: 'TorusOne',
  radius: 6,
  tube: 0.8,
  color: new Color(parseInt('0x' + ColorSchemes[ColorScheme][0])),
  facing: 'inverse'
})

const TorusTwo = new KreiseTorus({
  identity: 'TorusTwo',
  radius: 6,
  tube: 0.6,
  color: new Color(parseInt('0x' + ColorSchemes[ColorScheme][1])),
  facing: 'normal'
})

const TorusThree = new KreiseTorus({
  identity: 'TorusThree',
  radius: 8,
  tube: 0.5,
  color: new Color(parseInt('0x' + ColorSchemes[ColorScheme][2])),
  facing: 'inverse'
})

const TorusFour = new KreiseTorus({
  identity: 'TorusFour',
  radius: 9,
  tube: 0.5,
  color: new Color(parseInt('0x' + ColorSchemes[ColorScheme][3])),
  facing: 'inverse'
})

const TorusFive = new KreiseTorus({
  identity: 'TorusFive',
  radius: 11,
  tube: 0.8,
  color: new Color(parseInt('0x' + ColorSchemes[ColorScheme][4])),
  facing: 'inverse'
})

const TorusSix = new KlavierTorus()

const TorusSeven = new KreiseShaderedTorus({
  identity: 'TorusSeven',
  radius: 16,
  tube: 1,
  tubularSegments: 32,
  radialSegments: 4
})

// TorusZero.materials[0].transparent = true
// TorusZero.materials[0].opacity = 0.2

const turboTexture = new TextureLoader().load(turboTextureImage)
turboTexture.wrapS = MirroredRepeatWrapping
turboTexture.repeat.set(4, 1)

TorusFive.materials[0].transparent = true
TorusFive.materials[0].opacity = 0.85
TorusFive.materials[0].map = turboTexture
TorusFive.updateMesh()

// scene.add(TorusZero.getMesh())

scene.add(TorusOne.getMesh())
scene.add(TorusTwo.getMesh())
scene.add(TorusThree.getMesh())
scene.add(TorusFour.getMesh())
scene.add(TorusFive.getMesh())
scene.add(TorusSix.getMesh())


// scene.add(TorusSeven.getMesh())

const gridHelperInstance: GridHelper = new GridHelper(100, 100, 'skyblue', 'bisque')
gridHelperInstance.position.y = -0.01


// ===== 🎥 CAMERA =====

const camera: PerspectiveCamera = new PerspectiveCamera(
  90,
  canvas.clientWidth / canvas.clientHeight,
  0.1,
  100
)
camera.fov = 120
camera.position.set(0, 0, 0)
camera.lookAt(0, 0, 0)
camera.near = 0.05
camera.far = 40

// SBS support

// ===== 🕹️ CONTROLS =====

const cameraControls: FlyControls = new FlyControls(camera, canvas)
cameraControls.dragToLook = true
cameraControls.movementSpeed = 5
cameraControls.autoForward = false
cameraControls.rollSpeed = Math.PI / 6
cameraControls.update(clock.getDelta())

// cameraControls = new OrbitControls(camera, canvas);

// console.log(camera)
// console.log(cameraControls)

// ===== 🪄 HELPERS =====
const axesHelper: AxesHelper = new AxesHelper(4)
const pointLightHelper: PointLightHelper = new PointLightHelper(pointLight, undefined, 'orange')

// ===== Mouse Events =====

window.addEventListener('dblclick', (event) => {
  if (event.target === canvas) {
    // autofly = !autofly
    toggleFullScreen(document.body)
  }
})

// ===== Keyboard Events =====

let helpersDisplay: boolean = false

document.onkeydown = function (e) {
  switch (e.keyCode) {
    case 80: // P
      animation.enabled = !animation.enabled
      break
    case 79: // O
      autofly = !autofly
      break
    case 73: // I
      if (import.meta.env.DEV) {
        autofly = false
        camera.position.set(0, 2, 7)
        camera.lookAt(0, 5, 0)
      }
      break

    case 74: // J
      if (import.meta.env.DEV) {
        if (helpersDisplay) {
          scene.remove(plane)
          scene.remove(gridHelperInstance)
          scene.remove(flyCurveMesh)
          scene.remove(axesHelper)
          scene.remove(pointLightHelper)
        } else {
          scene.add(plane)
          scene.add(gridHelperInstance)
          scene.add(flyCurveMesh)
          scene.add(axesHelper)
          scene.add(pointLightHelper)
        }
        helpersDisplay = !helpersDisplay
        break
      }
  }
}

let autofly: boolean = true
let episode: number = 1
const episodeStartTicks = [0, 0, 0, 0]
const episodeOneShots = [false, false, false, false]

if (import.meta.env.DEV) {
  document.body.append(debugDiv())
}

animation.enabled = true

let ticks: number = 0
// let sticks: number = 0

// FLYCURVE

const longCurve: number = 10.0
const shortCurve: number = 3.5

const flyCurveVectors: CatmullRomCurve3 = new CatmullRomCurve3([

  // Start from last entry:
  new Vector3(shortCurve, shortCurve, -longCurve),
  new Vector3(-shortCurve, -shortCurve, -longCurve),

  new Vector3(0, 0, 0),
  new Vector3(longCurve, shortCurve, -shortCurve),
  new Vector3(longCurve, -shortCurve, shortCurve),
  new Vector3(0, 0, 0),
  new Vector3(-longCurve, shortCurve, shortCurve),
  new Vector3(-longCurve, -shortCurve, -shortCurve),
  new Vector3(0, 0, 0),
  new Vector3(-shortCurve, longCurve, shortCurve),
  new Vector3(shortCurve, longCurve, -shortCurve),
  new Vector3(0, 0, 0),
  new Vector3(shortCurve, -longCurve, shortCurve),
  new Vector3(-shortCurve, -longCurve, -shortCurve),
  new Vector3(0, 0, 0),
  new Vector3(-shortCurve, -shortCurve, longCurve),
  new Vector3(shortCurve, shortCurve, longCurve),
  new Vector3(0, 0, 0),
  new Vector3(shortCurve, -shortCurve, -longCurve),
  new Vector3(-shortCurve, shortCurve, -longCurve),
  new Vector3(0, 0, 0),
  new Vector3(longCurve, shortCurve, shortCurve),
  new Vector3(longCurve, -shortCurve, -shortCurve),
  new Vector3(0, 0, 0),
  new Vector3(-longCurve, shortCurve, -shortCurve),
  new Vector3(-longCurve, -shortCurve, shortCurve),
  new Vector3(0, 0, 0),
  new Vector3(shortCurve, longCurve, shortCurve),
  new Vector3(-shortCurve, longCurve, -shortCurve),
  new Vector3(0, 0, 0),
  new Vector3(-shortCurve, -longCurve, shortCurve),
  new Vector3(shortCurve, -longCurve, -shortCurve),
  new Vector3(0, 0, 0),
  new Vector3(-shortCurve, shortCurve, longCurve),
  new Vector3(shortCurve, -shortCurve, longCurve),
  new Vector3(0, 0, 0)
  // new Vector3(shortCurve, shortCurve, -longCurve)
  // new Vector3(-shortCurve, -shortCurve, -longCurve) <-- ignored, as we start from this
  //,
  // new Vector3(0, 0, 0)

])

flyCurveVectors.closed = true

// const flyCurvePoints = flyCurveVectors.getPoints(3000)
/* const flyCurveGeometry: BufferGeometry = new BufferGeometry().setFromPoints(
  flyCurvePoints
) */
const flyCurveMaterial: MeshLambertMaterial = new MeshLambertMaterial({
  emissive: 0x888800, map: turboTexture
})

const flyCurveGeometry: TubeGeometry = new TubeGeometry(flyCurveVectors, 500, 0.2, 16)

const flyCurveMesh: Mesh = new Mesh(flyCurveGeometry, flyCurveMaterial)

// const flyCurveSegments: number = flyCurvePoints.length
const flyCurveTicks: number = Math.floor(Math.random() * 60000) + 900000 // how many ticks for one flythrough

const flyCurveDirection = new Vector3()
// const flyCurveBinormal = new Vector3()
const flyCurveNormal = new Vector3()
// const flyCurvePosition = new Vector3()
// const flyCurveLookAt = new Vector3()

// console.log(flyCurveSegments)
// console.log(flyCurveTicks)

const cameraEye: Mesh = new Mesh(
  new SphereGeometry(1),
  new MeshBasicMaterial({ color: 0xdddddd })
)
cameraEye.visible = false

scene.add(cameraEye)

// AUDIO

/*
if (import.meta.env.DEV) {
  const audioContext = new AudioContext()
  const oscillator = audioContext.createOscillator()
  oscillator.frequency.value = 110.5
  oscillator.connect(audioContext.destination)
  oscillator.start()

  const oscillator2 = audioContext.createOscillator()
  oscillator2.frequency.value = 221

  oscillator2.connect(audioContext.destination)
  oscillator2.start()

  const oscillator3 = audioContext.createOscillator()
  oscillator3.frequency.value = 442
  oscillator3.connect(audioContext.destination)
  oscillator3.start()

  const oscillator4 = audioContext.createOscillator()
  oscillator4.frequency.value = 55.25
  oscillator4.connect(audioContext.destination)
  oscillator4.start()

  const oscillator5 = audioContext.createOscillator()
  oscillator5.frequency.value = 884
  oscillator5.connect(audioContext.destination)
//  oscillator5.start()

  const oscillator6 = audioContext.createOscillator()
  oscillator6.frequency.value = 1768
  oscillator6.connect(audioContext.destination)
//  oscillator6.start()

  const muteButton: HTMLButtonElement = document.createElement('button')
  muteButton.id = 'muteButton'
  muteButton.innerHTML = 'Sound (Alpha, LAUT)'
  document.querySelector('div#intro')?.append(muteButton)

  let muteStatus: boolean = true
  muteButton.addEventListener('click', () => {
    muteStatus = !muteStatus
    if (!muteStatus) {
      audioContext.resume()
    }
    else {
      audioContext.suspend()
    }
  })
}

*/

// TIME and Chords

// let maximumTicks: number = 100 * 60 * 60 // 1 hour

/*
const rhythms: any = [11, 37, 67, 101] // 2754169 ticks, 101 = 0,1 sekunden Real-Zeit --> ~10ms takt/100fps --> 2726,9 Sekunden ==> ~45,49 Minuten

// 4 Minuten => 11 Stücke / Tonarten
// 6,5 Sekunden pro Takt => 37 Takte
// 0,1 Sekunden pro Ton => bis zu(!!!) 67 Töne pro Takt
// 0,001 Sekunden pro Tick =>

const maximumTicks: number = rhythms[0] * rhythms[1] * rhythms[2] * rhythms[3]

console.log('Maximum Ticks: ' + maximumTicks)

// find current time level
const unixNowMs: number = Date.now()

console.log('Unix-Now:' + unixNowMs)

const lastUnixNowMsStart = maximumTicks * (Math.floor((unixNowMs) / maximumTicks))

console.log('Global Repetition Count: ' + Math.floor((unixNowMs) / maximumTicks))
console.log('Last Fresh Rhythm Cycle Unix Now Ms Start ' + lastUnixNowMsStart)
console.log('Current Position in Rhythm Cycle: ' + (unixNowMs - lastUnixNowMsStart))

const startTick: number = unixNowMs - lastUnixNowMsStart

console.log('Progress 0 to 1: ' + (startTick / maximumTicks))

console.log('Rhythm 0 Position: ' + Math.floor(rhythms[0] / (maximumTicks / startTick))) // up to 11

console.log('Rhythm 1 Position: ' + Math.floor((rhythms[1]) / ((maximumTicks / (startTick / rhythms[0]))))) // up to 37
console.log('Rhythm 2 Position: ' + Math.floor((rhythms[2]) / (maximumTicks / startTick / (rhythms[0] * rhythms[1]))))
console.log('Rhythm 3 Position: ' + Math.floor((rhythms[3] * rhythms[2] * rhythms[1] * rhythms[0]) / (maximumTicks / startTick)))
*/

// console.log (TorusOne.geometry.getAttribute('position'))
// const oldPositions: Float32BufferAttribute = TorusOne.geometry.getAttribute('position')
// const oldNormals: Float32BufferAttribute = TorusOne.geometry.getAttribute('normal')

// const oldVertices: any = TorusOne.geometry.vertices

let i: number = 0
let rate: number = 0
for (i = 0; i <= TorusOne.tubularSegments; i++) {
  // from 0 to 1
  rate = (i / 24) // anything 48
  rate = Math.sin(rate * Math.PI * 2) + Math.cos(rate * Math.PI * 2)
  TorusOne.pulseTubularLine(i, rate * 0.1)
}

TorusOne.materials[0].transparent = true
TorusOne.materials[0].opacity = 0.3

for (i = 0; i <= TorusTwo.tubularSegments; i++) {
  // from 0 to 1
  rate = (i / 48) // anything 48
  rate = Math.sin(rate * Math.PI * 2)
  TorusTwo.pulseTubularLine(i, rate * 0.2)
}

TorusTwo.materials[0].transparent = true
TorusTwo.materials[0].opacity = 0.8

renderer.setAnimationLoop(function () {
  const timeDelta = clock.getDelta()

  ticks += (timeDelta * 1000)

  if (episode === 1) {
    if (animation.enabled && animation.play) {
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

      /*

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
    }

    if (autofly) {
      cameraEye.visible = false

      const flyCurveProgress: number = (ticks % flyCurveTicks) / flyCurveTicks
      const flyCurveProgressAhead: number =
        ((ticks + 500) % flyCurveTicks) / flyCurveTicks

      const flyCurvePosition: Vector3 =
        flyCurveVectors.getPointAt(flyCurveProgress)

      const flyCurvePositionLookAt: Vector3 = flyCurveVectors.getPointAt(
        flyCurveProgressAhead
      )

      flyCurveDirection
        .subVectors(flyCurvePositionLookAt, flyCurvePosition)
        .normalize()
      flyCurveNormal
        .subVectors(new Vector3(0, 0, 100), flyCurvePosition)
        .normalize()

      camera.position.copy(flyCurvePosition)
      camera.lookAt(flyCurvePositionLookAt)
      camera.up.copy(flyCurveNormal)
    } else {
      cameraControls.update(timeDelta)

      if (import.meta.env.DEV) {
        const flyCurveProgress: number = (ticks % flyCurveTicks) / flyCurveTicks

        const flyCurvePosition: Vector3 =
          flyCurveVectors.getPointAt(flyCurveProgress)

        /* const flyCurveProgressAhead: number =
          ((ticks + 50) % flyCurveTicks) / flyCurveTicks

        const flyCurvePositionLookAt: Vector3 = flyCurveVectors.getPointAt(
          flyCurveProgressAhead
        ) */

        cameraEye.visible = true
        cameraEye.position.copy(flyCurvePosition)
      }
    }

    // End Episode
    /*
      if (ticks == Math.floor((flyCurveTicks * 1)) || (import.meta.env.DEV && (ticks == Math.floor((flyCurveTicks / 20))))) {
        autofly = false;
        episode = 2;
        episodeStartTicks[2] = ticks

        camera.lookAt(0,0,0);
        document.body.appendChild(controlPanelDiv());
      } */
  }

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
  renderer.render(scene, camera)
  // }

  if (import.meta.env.DEV) {
    stats.update()
    /*
    const debugDiv = document.getElementById('debugDiv') as HTMLDivElement
    debugDiv.innerHTML =
      'Tick ' +
      ticks.toString() +
      '<br>' +
      'X ' +
      camera.position.x +
      '<br>' +
      'Y ' +
      camera.position.y +
      '<br>' +
      'Z ' +
      camera.position.z
      */
  }

  if (resizeRendererToDisplaySize(renderer)) {
    // console.log('Resized')
    const canvas = renderer.domElement
    camera.aspect = canvas.clientWidth / canvas.clientHeight
    camera.updateProjectionMatrix()
  }
})
