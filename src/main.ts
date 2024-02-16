import './style.css'

import {
  Clock,
  Scene,
  Vector2,
} from 'three'

// GLOBALS
import Kreise from './Kreise.ts'

import { FlyControls } from 'three/addons/controls/FlyControls.js'

// @ts-expect-errors module without declarations
import Stats from 'three/examples/jsm/libs/stats.module'

import { resizeRendererToDisplaySize } from './helpers/responsiveness'

import { getPageOverlayDiv, fadeoutDatenschutzAndInfoParagraphs } from './htmlincludes.ts'
// import * as Tone from 'tone'

// Episodes

import KreiseEpisode from './episodes/KreiseEpisode.ts'
import IntroEpisode from './episodes/Intro.ts'
import AutobahnEpisode from './episodes/Autobahn.ts'
import { EffectComposer, OutputPass, RenderPass, UnrealBloomPass } from 'three/examples/jsm/Addons.js'
import ChemnitzEpisode from './episodes/Chemnitz.ts'

//
// End of imports
//

// @TODO this is not needed
document.title = 'Krei·se'


const kreise = new Kreise() // sets up main scene, camera, globals like brightness and client device

const removeMeDiv: HTMLDivElement = document.querySelector('#removeMe') ?? document.createElement('div')
document.body.removeChild(removeMeDiv)
document.body.append(getPageOverlayDiv())

setTimeout(fadeoutDatenschutzAndInfoParagraphs, 20000)

// end of HTML Base

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


// ===== 🕹️ CONTROLS =====

const cameraControls: FlyControls = new FlyControls(kreise.camera, kreise.canvas)
cameraControls.dragToLook = true
cameraControls.movementSpeed = 5
cameraControls.autoForward = false
cameraControls.rollSpeed = Math.PI / 6
cameraControls.update(clock.getDelta())

// Main Loop and Episode Chooser

let ticks: number = 0

let episodes: any[] = ['Intro', 'Autobahn', 'Chemnitz']
// episodes = ['Intro']
const EpisodeRand = episodes[Math.floor(Math.random() * episodes.length)] // Math.random is inclusively 0 but never 1

console.log(EpisodeRand)

let episode: KreiseEpisode = new KreiseEpisode(kreise, new Scene(), kreise.camera, window)

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
// episode.addControls()

kreise.scene.add(episode.scene)

kreise.zeit.interval[900].direction = 'ccw'
kreise.zeit.interval[300].direction = 'ccw'
kreise.zeit.interval[60].direction = 'ccw'

kreise.composer = new EffectComposer(kreise.renderer, kreise.renderTarget)
kreise.composer.setSize(kreise.canvas.clientWidth, kreise.canvas.clientHeight)
kreise.composer.addPass(new RenderPass(kreise.scene, kreise.camera))
kreise.composer.addPass(new UnrealBloomPass(new Vector2(kreise.canvas.clientWidth / 2, kreise.canvas.clientHeight / 2), 0.3, 0.05, 0))

kreise.composer.passes[1].enabled = false

const outputPass = new OutputPass()
kreise.composer.addPass(outputPass)

kreise.updateBrightness()


kreise.renderer.setAnimationLoop(function () {
  const timeDelta = clock.getDelta()

  ticks += (timeDelta * 1000)

  // Crons

  if (Math.floor(ticks / 1000) % 60 === 0) {  // every 60 seconds, update brightness
  
    // kreise.updateBrightness()
    // console.log(ticks)
  
  } // every 60 seconds

  // kreise.zeit.update()

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

  kreise.composer.render()
  //kreise.renderer.render(kreise.scene, kreise.camera)

  if (import.meta.env.DEV) {
    stats.update()
    // add debug interfaces
  }

  if (resizeRendererToDisplaySize(kreise.renderer)) {

    kreise.updateCamera()

    kreise.composer.setSize(kreise.canvas.clientWidth, kreise.canvas.clientHeight)

    if (kreise.brightness === 0) {
      //kreise.composer.passes[1] = new UnrealBloomPass(new Vector2(kreise.canvas.clientWidth / 2, kreise.canvas.clientHeight / 2), 0.3, 0.05, 0)
    }
  }
  

})
