import './style.css'

import { Clock, Scene } from 'three'

// GLOBALS
import Kreise from './Kreise/Kreise.ts'

import { FlyControls } from 'three/addons/controls/FlyControls.js'

// @ts-expect-errors module without declarations
import Stats from 'three/examples/jsm/libs/stats.module'

import { resizeRendererToDisplaySize } from './helpers/responsiveness'

import {
  getPageOverlayDiv,
  fadeoutDatenschutzAndInfoParagraphs,
  getVersionDiv,
  getSocialDiv,
  getSBSDiv,
  getServicesDiv,
  getPayPalDiv,
  getServicesOverlayDiv
} from './htmlincludes.ts'
// import * as Tone from 'tone'

// Episodes

import KreiseEpisode from './Kreise/KreiseEpisode.ts'
import IntroEpisode from './episodes/Intro.ts'
import AutobahnEpisode from './episodes/Autobahn.ts'
import ChemnitzEpisode from './episodes/Chemnitz.ts'
import KreiseGraph from './Kreise/KreiseGraph.ts'
import JewelEpisode from './episodes/Jewel.ts'

//
// End of imports
//

// @TODO this is not needed
document.title = 'Krei·se'

const kreise = new Kreise() // sets up main scene, camera, globals like brightness and client device

const removeMeDiv: HTMLDivElement =
  document.querySelector('#removeMe') ?? document.createElement('div')
document.body.removeChild(removeMeDiv)
document.body.append(getPageOverlayDiv())
document.body.append(getPayPalDiv())
document.body.append(getVersionDiv())
document.body.append(getServicesDiv())
document.body.append(getSocialDiv())

document.body.append(getServicesOverlayDiv())



/*
if (kreise.client.developerMode) {
  document.body.append(getSBSDiv())
}
*/

setTimeout(fadeoutDatenschutzAndInfoParagraphs, 5000)

const testGraph = new KreiseGraph()

testGraph.graphs.subGraph = new KreiseGraph()

testGraph.graphs.subGraph.graphs.cycleGraph = testGraph

console.log(testGraph)

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

// Main Scene

kreise.makeMainScene()

// ===== 🕹️ CONTROLS =====

const cameraControls: FlyControls = new FlyControls(
  kreise.camera,
  kreise.canvas
)

cameraControls.dragToLook = true
cameraControls.movementSpeed = 5
cameraControls.autoForward = false
cameraControls.rollSpeed = Math.PI / 6
cameraControls.update(clock.getDelta())

// Main Loop and Episode Chooser

let ticks: number = 0

let episodes: any[] = ['Intro', 'Autobahn', 'Chemnitz']

//if (kreise.client.developerMode) episodes = ['Chemnitz']

const EpisodeRand = episodes[Math.floor(Math.random() * episodes.length)] // Math.random is inclusively 0 but never 1

console.log(EpisodeRand)

let episode: KreiseEpisode = new KreiseEpisode(
  kreise,
  new Scene(),
  kreise.camera
)
kreise.brightness = 0
if (EpisodeRand === 'Intro') {
  episode = new IntroEpisode(kreise, new Scene(), kreise.camera)
}
if (EpisodeRand === 'Autobahn') {
  episode = new AutobahnEpisode(kreise, new Scene(), kreise.camera)
}
if (EpisodeRand === 'Chemnitz') {
  episode = new ChemnitzEpisode(kreise, new Scene(), kreise.camera)
}
if (EpisodeRand === 'Jewel') {
  episode = new JewelEpisode(kreise, new Scene(), kreise.camera)
}

episode.load()
// episode.addControls()

kreise.scene.add(episode.scene)

// Global Time dependent Scene setup

kreise.zeit.interval[900].direction = 'ccw'
kreise.zeit.interval[300].direction = 'ccw'
kreise.zeit.interval[60].direction = 'ccw'

kreise.updateBrightness()

if (episode instanceof AutobahnEpisode) {
}

let lastcron: number = 0
let cronInterval: number = 60

// Delta Time dependent animation loop

kreise.renderer.setAnimationLoop(function () {
  const timeDelta = clock.getDelta()

  // remember that ticks is a float
  ticks += timeDelta * 1000
  if (kreise.client.developerMode) ticks += timeDelta * kreise.client.timeScale

  // Crons

  if (ticks > lastcron + cronInterval * 1000) {
    // every 60 seconds, update brightness

    kreise.updateBrightness()
    /*
    console.log(ticks)
    console.log(lastcron)

    console.log(kreise.brightness)
    */
    lastcron = ticks
  }

  // 10 fps raycaster updates
  kreise.client.raycaster.setFromCamera(kreise.client.pointer, kreise.camera)
  kreise.client.updateRaycasterIntersects(episode.scene)

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
    if (ticks > 60000 * 4)
      // 4 minutes = 360 Episoden / Songs
      ticks = ticks - 60000 * 4
    episode.update(ticks)
  }

  // EPISODE 3: JEWEL
  if (episode instanceof JewelEpisode) {
    episode.update(ticks)
  }

  if (!kreise.autoplay.camera) {
    cameraControls.update(timeDelta)
  }

  kreise.composer.render()
  // kreise.renderer.render(kreise.scene, kreise.camera)

  if (kreise.client.developerMode) {
    stats.update()
    // add debug interfaces
  }

  if (resizeRendererToDisplaySize(kreise.renderer)) {


    
    kreise.updateCamera()

    kreise.composer.setSize(
      kreise.canvas.clientWidth,
      kreise.canvas.clientHeight
    )

    if (kreise.brightness === 0) {
      //kreise.composer.passes[1] = new UnrealBloomPass(new Vector2(kreise.canvas.clientWidth / 2, kreise.canvas.clientHeight / 2), 0.3, 0.05, 0)
    }
  }
})
