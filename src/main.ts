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
  SphereGeometry,
  Color,
  PointLightHelper,
  AxesHelper,
  TubeGeometry
} from 'three'


// GLOBALS
import Kreise from './Kreise.ts'

import { FlyControls } from 'three/addons/controls/FlyControls.js'

// @ts-expect-errors module without declarations
import Stats from 'three/examples/jsm/libs/stats.module'

import { toggleFullScreen } from './helpers/fullscreen'
import { resizeRendererToDisplaySize } from './helpers/responsiveness'

import { debugDiv } from './buttons.ts' // controlPanelDiv
import { getPageOverlayDiv, fadeoutDatenschutzAndInfoParagraphs } from './htmlincludes.ts'
import * as Tone from 'tone'

// Constants

import { ColorSchemes } from './KreiseConsts.ts'
import { flyCurveVectors } from './KreiseConsts.ts'

// Time

import KreiseZeit from './kreiseZeit.ts'

// Episodes

import IntroEpisode from './episodes/Intro.ts'

//
// End of imports
//

// GLOBALS
const kreise = new Kreise()



document.title = 'Krei.se'
const appDiv = document.querySelector<HTMLDivElement>('#app') as HTMLDivElement

appDiv.innerHTML = ''

appDiv.append(getPageOverlayDiv())

const canvas: HTMLCanvasElement = document.createElement('canvas')
canvas.setAttribute('id', 'scene')

appDiv.append(canvas)

setTimeout(fadeoutDatenschutzAndInfoParagraphs, 5000)

// ===== ☀️ ===== Sunrise and Sunset ===== 🌒 =====


if (kreise.sunPosition.altitude < -0.1) {
  kreise.brightness = 0
}

if (kreise.sunPosition.altitude > 0.1) {
  kreise.brightness = 255
}

const altitude: number = kreise.sunPosition.altitude // in radians, so µ/2 at highest point

// BACKGROUND COLOR

// @TODO check this in anmation every minute
if (altitude < 0.1 && altitude > -0.1) {
  kreise.brightness = Math.floor(255 * ((altitude + 0.1) * 5))
}

document.body.style.setProperty('--page-background', 'rgba(' + kreise.brightness + ',' + kreise.brightness + ',' + kreise.brightness + ',0)')

if (kreise.brightness <= 128) {
  const introDiv: HTMLDivElement = document.querySelector('#introDiv') ?? document.createElement('div')
  introDiv.style.cssText = 'filter: invert(1);'
}

//
// End of HTML
//

// ===== 🖼️ CANVAS, RENDERER, & SCENE =====

kreise.renderer = new WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
  logarithmicDepthBuffer: true
})

kreise.renderer.setPixelRatio(window.devicePixelRatio)

kreise.renderer.shadowMap.enabled = true
kreise.renderer.shadowMap.type = PCFSoftShadowMap

// == RHYTHM ==

//  Zeit wiederholt sich jeden Tag, jede Stunde, jede halbe Stunde, alle 10 Minuten (10 Minuten --> ein Level)
kreise.rhythms = [86400, 3600, 1800, 600]

console.log(kreise.rhythms[0])

// Javascript Date Objekt gibt immer die Unix-Zeit ohne Rücksicht auf die Zeitzone aus
let nowMs: number = new Date().getTime()

let nowS: number = Math.floor(nowMs / 1000)

console.log(nowS)

console.log(nowS % 86400)

// ===== 📈 STATS & CLOCK =====

let stats: Stats

const clock: Clock = new Clock()
if (import.meta.env.DEV) {
  stats = new Stats()
  document.body.appendChild(stats.dom)
}

// ===== 📦 OBJECTS =====

// Plane

kreise.ColorScheme = 'FourColours'
const randomScheme: number = Math.random()
// if (randomScheme >= 0.20) ColorScheme = 'Autumn'
if (randomScheme >= 0.25) kreise.ColorScheme = 'Cyber'
if (randomScheme >= 0.50) kreise.ColorScheme = 'Phoenix'
if (randomScheme >= 0.75) kreise.ColorScheme = 'PurplePath'
// if (randomScheme >= 0.75) ColorScheme = 'Toxic'
// if (randomScheme >= 0.90) ColorScheme = 'BaseColors'

// console.log(ColorSchemes)
// console.log(ColorScheme)

// Google referrer

// console.log(document.referrer)

if (document.referrer.includes('google')) {
  kreise.ColorScheme = 'FourColours'
}

kreise.scene.background = new Color('rgb(' + kreise.brightness + ', ' + kreise.brightness + ', ' + kreise.brightness + ')')


console.log (kreise)


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
kreise.scene.add(ambientLight)
kreise.scene.add(pointLight)

ambientLight.intensity = ((255 - kreise.brightness) / 50) + 2
pointLight.intensity = (255 - kreise.brightness) + 50

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

// ===== 🪄 HELPERS AND DEBUG =====

const axesHelper: AxesHelper = new AxesHelper(4)
const pointLightHelper: PointLightHelper = new PointLightHelper(pointLight, undefined, 'orange')

const planeHelperGeometry = new PlaneGeometry(100, 100)
const planeHelperMaterial = new MeshLambertMaterial({
  color: 'bisque',
  emissive: 'skyblue',
  emissiveIntensity: 0.2,
  side: 2,
  transparent: true,
  opacity: 0.4
})
const planeHelper = new Mesh(planeHelperGeometry, planeHelperMaterial)
planeHelper.rotateX(Math.PI / 2)
planeHelper.receiveShadow = true

const gridHelperInstance: GridHelper = new GridHelper(100, 100, 'skyblue', 'bisque')
gridHelperInstance.position.y = -0.01

const cameraEyeHelper: Mesh = new Mesh(
  new SphereGeometry(1),
  new MeshBasicMaterial({ color: 0xdddddd })
)
cameraEyeHelper.visible = false

kreise.scene.add(cameraEyeHelper)

// ===== Mouse Events =====

window.addEventListener('dblclick', (event) => {
  if (event.target === canvas) {
    toggleFullScreen(document.body)
  }
})

// ===== Keyboard Events =====

document.onkeydown = function (e) {
  switch (e.keyCode) {
    case 80: // P                               Switch Time on off
      kreise.autoplay.animation = !kreise.autoplay.animation
      break
    case 79: // O                               Switch Automatic Camera on off
      kreise.autoplay.camera = !kreise.autoplay.camera
      break
    case 73: // I                               Set Camera to outside view
      if (import.meta.env.DEV) {
        kreise.autoplay.camera = false
        camera.position.set(0, 2, 7)
        camera.lookAt(0, 5, 0)
        cameraEyeHelper.visible = true
      }
      break

    case 74: // J                               Switch Helpers On Off
      if (import.meta.env.DEV) {
        if (kreise.debug.helperObjects) {
          kreise.scene.remove(planeHelper)
          kreise.scene.remove(gridHelperInstance)
          kreise.scene.remove(axesHelper)
          kreise.scene.remove(pointLightHelper)
        } else {
          kreise.scene.add(planeHelper)
          kreise.scene.add(gridHelperInstance)
          kreise.scene.add(axesHelper)
          kreise.scene.add(pointLightHelper)
        }
        kreise.debug.helperObjects = !kreise.debug.helperObjects
      }
      break
  }
}

let ticks: number = 0
let episode = new IntroEpisode(kreise, new Scene(), camera)

episode.makeScene()
episode.addControls()


kreise.scene.add(episode.scene)

kreise.renderer.setAnimationLoop(function () {

  const timeDelta = clock.getDelta()

  ticks += (timeDelta * 1000)

  if (episode instanceof IntroEpisode) {
    episode.update(ticks)
  }

  if (kreise.autoplay.camera) {
    cameraEyeHelper.visible = false
  } else {
    cameraControls.update(timeDelta)
    cameraEyeHelper.visible = true
  }


  kreise.renderer.render(kreise.scene, camera)

  if (import.meta.env.DEV) {
    stats.update()
    // add debug interfaces
  }

  if (resizeRendererToDisplaySize(kreise.renderer)) {
    // console.log('Resized')
    const canvas = kreise.renderer.domElement
    camera.aspect = canvas.clientWidth / canvas.clientHeight
    camera.updateProjectionMatrix()
  }
})
