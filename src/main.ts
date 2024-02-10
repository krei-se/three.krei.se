import './style.css'

import {
  AmbientLight,
  Clock,
  GridHelper,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  PCFSoftShadowMap,
  PerspectiveCamera,
  PlaneGeometry,
  PointLight,
  Scene,
  WebGLRenderer,
  SphereGeometry,
  Color,
  PointLightHelper,
  AxesHelper,
  WebGLRenderTarget,
  Vector2,
  SRGBColorSpace,
  ACESFilmicToneMapping
} from 'three'

// GLOBALS
import Kreise from './Kreise.ts'

import { FlyControls } from 'three/addons/controls/FlyControls.js'

// @ts-expect-errors module without declarations
import Stats from 'three/examples/jsm/libs/stats.module'

import { resizeRendererToDisplaySize } from './helpers/responsiveness'

import { getPageOverlayDiv, fadeoutDatenschutzAndInfoParagraphs } from './htmlincludes.ts'
import * as Tone from 'tone'

// Constants (mostly used in Episodes)

// import { ColorSchemes } from './KreiseConsts.ts'
// import { flyCurveVectors } from './KreiseConsts.ts'

// Time

import KreiseZeit from './kreiseZeit.ts'

// Episodes

import IntroEpisode from './episodes/Intro.ts'
import AutobahnEpisode from './episodes/Autobahn.ts'
import { EffectComposer, OutputPass, RenderPass, UnrealBloomPass } from 'three/examples/jsm/Addons.js'
import ChemnitzEpisode from './episodes/Chemnitz.ts'
import KreiseEpisode from './episodes/KreiseEpisode.ts'

//
// End of imports
//

// GLOBALS
const kreise = new Kreise()

// @TODO this is not needed
document.title = 'Krei·se'

document.body.append(getPageOverlayDiv())

const canvas: HTMLCanvasElement = document.createElement('canvas')
canvas.setAttribute('id', 'scene')

document.body.append(canvas)

setTimeout(fadeoutDatenschutzAndInfoParagraphs, 20000)

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

// kreise.brightness = 0

document.body.style.setProperty('--page-background', 'rgba(' + kreise.brightness + ',' + kreise.brightness + ',' + kreise.brightness + ',0)')

if (kreise.brightness <= 128) {
  const introDiv: HTMLDivElement = document.querySelector('#introDiv') ?? document.createElement('div')
  introDiv.style.cssText = 'filter: invert(1);'
}

kreise.scene.background = new Color('rgb(' + kreise.brightness + ', ' + kreise.brightness + ', ' + kreise.brightness + ')')

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

// == RHYTHM AND TIME ==

//  Zeit wiederholt sich jeden Tag, jede Stunde, jede halbe Stunde, alle 10 Minuten (10 Minuten --> ein Level)
kreise.rhythms = [86400, 3600, 1800, 600]

console.log(kreise.rhythms[0])

// Javascript Date Objekt gibt immer die Unix-Zeit ohne Rücksicht auf die Zeitzone aus

const clock: Clock = new Clock()

// ===== 📈 STATS =====

const stats: Stats = new Stats()
if (kreise.client.developerMode) {
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

// ===== 💡 LIGHTS =====

const ambientLight: AmbientLight = new AmbientLight('white', 3)
const pointLight: PointLight = new PointLight('white', 150, 150)
pointLight.position.set(0, 0, 0)

pointLight.castShadow = true
pointLight.shadow.radius = 20
pointLight.shadow.camera.near = 0.5
pointLight.shadow.camera.far = 30
pointLight.shadow.mapSize.width = 2048
pointLight.shadow.mapSize.height = 2048
kreise.scene.add(ambientLight)
kreise.scene.add(pointLight)

// ambientLight.intensity = ((255 - kreise.brightness) / 50) + 0.2
ambientLight.intensity = 0.5
// pointLight.intensity = (255 - kreise.brightness) + 50

// ===== 🎥 CAMERA =====

kreise.camera = new PerspectiveCamera(
  90,
  canvas.clientWidth / canvas.clientHeight,
  0.1,
  100
)
kreise.camera.fov = 120
kreise.camera.position.set(0, 0, 0)
kreise.camera.lookAt(0, 0, 0)
kreise.camera.near = 0.05
kreise.camera.far = 50

// ===== 🕹️ CONTROLS =====

const cameraControls: FlyControls = new FlyControls(kreise.camera, canvas)
cameraControls.dragToLook = true
cameraControls.movementSpeed = 5
cameraControls.autoForward = false
cameraControls.rollSpeed = Math.PI / 6
cameraControls.update(clock.getDelta())

// cameraControls = new OrbitControls(camera, canvas);

// console.log(camera)
// console.log(cameraControls)

// ===== 🪄 HELPERS AND DEBUG =====

// most are in Kreise Class for the main scene
const pointLightHelper: PointLightHelper = new PointLightHelper(pointLight, undefined, 'orange')


// ===== Mouse Events =====

let ticks: number = 0

let episodes: any[] = ['Intro', 'Autobahn', 'Chemnitz']
// episodes = ['Chemnitz']
const EpisodeRand = episodes[Math.floor(Math.random() * episodes.length)] // Math.random is inclusively 0 but never 1

console.log(EpisodeRand)

let episode: KreiseEpisode = null

if (EpisodeRand === 'Intro') {
  episode = new IntroEpisode(kreise, new Scene(), kreise.camera, window)
}
if (EpisodeRand === 'Autobahn') {
  episode = new AutobahnEpisode(kreise, new Scene(), kreise.camera, window)
}
if (EpisodeRand === 'Chemnitz') {
  episode = new ChemnitzEpisode(kreise, new Scene(), kreise.camera, window)
}



episode.makeScene()
episode.addControls()

kreise.scene.add(episode.scene)

kreise.renderer.outputColorSpace = SRGBColorSpace
kreise.renderer.toneMapping = ACESFilmicToneMapping

kreise.renderTarget = new WebGLRenderTarget(canvas.clientWidth, canvas.clientHeight)
kreise.renderTarget.samples = 1
kreise.composer = new EffectComposer(kreise.renderer, kreise.renderTarget)
kreise.composer.addPass(new RenderPass(kreise.scene, kreise.camera))
if (kreise.brightness === 0) {
  kreise.composer.addPass(new UnrealBloomPass(new Vector2(canvas.clientWidth / 2, canvas.clientHeight / 2), 0.3, 0.05, 0))
}
const outputPass = new OutputPass()
kreise.composer.addPass(outputPass)

kreise.renderer.setAnimationLoop(function () {
  const timeDelta = clock.getDelta()

  ticks += (timeDelta * 1000)

  // INTRO
  if (episode instanceof IntroEpisode) {
    episode.update(ticks)
  }

  // EPISODE 1: AUTOBAHN
  if (episode instanceof AutobahnEpisode) {
    episode.update(ticks)
  }

  // EPISODE 2: CHEMNITZ
  if (episode instanceof ChemnitzEpisode) {
    episode.update(ticks)
  }

  if (kreise.autoplay.camera) {
    kreise.objects.cameraEyeHelper.visible = false
  } else {
    cameraControls.update(timeDelta)
    kreise.objects.cameraEyeHelper.visible = true
  }

  //kreise.renderer.render(kreise.scene, kreise.camera)
  kreise.composer.render()

  if (import.meta.env.DEV) {
    stats.update()
    // add debug interfaces
  }

  if (resizeRendererToDisplaySize(kreise.renderer)) {
    // console.log('Resized')
    const canvas = kreise.renderer.domElement
    kreise.camera.aspect = canvas.clientWidth / canvas.clientHeight
    kreise.camera.updateProjectionMatrix()
/*
    kreise.renderer.dispose()

    kreise.renderer = new WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      logarithmicDepthBuffer: true
    })

    kreise.renderer.setPixelRatio(window.devicePixelRatio)

    kreise.renderer.shadowMap.enabled = true
    kreise.renderer.shadowMap.type = PCFSoftShadowMap

    kreise.renderTarget.dispose()

    kreise.renderTarget = new WebGLRenderTarget(canvas.clientWidth, canvas.clientHeight)
    kreise.renderTarget.samples = 0
*/
    
/*
kreise.composer.dispose()
    kreise.composer = new EffectComposer(kreise.renderer, kreise.renderTarget)
    kreise.composer.addPass(new RenderPass(kreise.scene, kreise.camera))
*/
    
    if (kreise.brightness === 0) {
      kreise.composer.passes[1] = new UnrealBloomPass(new Vector2(canvas.clientWidth / 2, canvas.clientHeight / 2), 0.3, 0.05, 0)
    }
    
   /*
    const outputPass = new OutputPass()
    kreise.composer.addPass(outputPass)

*/

    console.log(kreise.composer.passes)
  }
})
