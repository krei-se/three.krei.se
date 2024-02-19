import SunCalc from 'suncalc'
import type { GetSunPositionResult, GetTimesResult } from 'suncalc'

import { 
  AmbientLight, 
  AxesHelper, 
  Color, 
  EventDispatcher, 
  GridHelper, 
  Mesh, 
  MeshBasicMaterial, 
  MeshLambertMaterial, 
  PCFSoftShadowMap, 
  PerspectiveCamera, 
  PlaneGeometry, 
  PointLight, 
  PointLightHelper, 
  Scene, 
  SphereGeometry, 
  Vector2, 
  WebGLRenderTarget, 
  WebGLRenderer
} from 'three'

import { toggleFullScreen } from './helpers/fullscreen'
import { EffectComposer, OutputPass, RenderPass, UnrealBloomPass } from 'three/examples/jsm/Addons.js'
import KreiseZeit from './KreiseZeit'
import { KreiseTorus } from './KreiseTorus'
import { KlavierTorus, KreiseShaderedTorus } from './KreiseTorus'

export interface AutoplayOptionsInterface { camera: boolean, animation: boolean }
export interface DebugOptionsInterface { helperObjects: boolean, helperInterface: boolean }

export type ObjectType = AmbientLight | PointLight | PointLightHelper | Mesh | AxesHelper | GridHelper | KreiseTorus | KreiseShaderedTorus | KlavierTorus
export type ObjectRecordType = Record<string, ObjectType>

export type domElementType = HTMLElement | HTMLDivElement | Window

export type CameraType = PerspectiveCamera // | StereoCamera | Camera

export default class Kreise extends EventDispatcher {
  zeit: KreiseZeit
  suncalc: GetTimesResult
  sunPosition: GetSunPositionResult
  brightness: number

  canvas: HTMLCanvasElement
  renderer: WebGLRenderer
  renderTarget: WebGLRenderTarget
  composer: EffectComposer

  objects: ObjectRecordType
  scene: Scene
  camera: CameraType

  autoplay: AutoplayOptionsInterface
  debug: DebugOptionsInterface

  rhythms: any[]
  ColorScheme: string

  client: KreiseClient

  keydown (event: KeyboardEvent): void { event; return }    // stub this to console.log(event)
  keyup (event: KeyboardEvent): void { event; return }      // stub this to console.log(event)
  onPointerMove (event: MouseEvent): void { event; return } // stub this to console.log(event)

  constructor () {
    super()
    this.zeit = new KreiseZeit()
    this.suncalc = SunCalc.getTimes(new Date(), 50.84852106503032, 12.923759828615541)
    this.sunPosition = SunCalc.getPosition(new Date(), 50.84852106503032, 12.923759828615541)
    this.brightness = 255

    this.objects = {}

    this.autoplay = { camera: true, animation: true }
    this.debug = { helperObjects: false, helperInterface: false }

    this.rhythms = [] // will be overwritten in main.ts
    
    this.ColorScheme = '' // will be overwritten in main.ts
    this.ColorScheme = 'FourColours'
    const randomScheme: number = Math.random()
    // if (randomScheme >= 0.20) ColorScheme = 'Autumn'
    if (randomScheme >= 0.25) this.ColorScheme = 'Cyber'
    if (randomScheme >= 0.50) this.ColorScheme = 'Phoenix'
    if (randomScheme >= 0.75) this.ColorScheme = 'PurplePath'
    // if (randomScheme >= 0.75) ColorScheme = 'Toxic'
    // if (randomScheme >= 0.90) ColorScheme = 'BaseColors'

    // Google referrer
    if (document.referrer.includes('google')) {
      this.ColorScheme = 'FourColours'
    }

    this.scene = new Scene()
    this.canvas = document.querySelector('#scene') ?? document.createElement('canvas')
    this.canvas.setAttribute('id', 'scene')

    document.body.appendChild(this.canvas)

    this.renderer = new WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: false, // we don't need this true, its just for the background
      logarithmicDepthBuffer: true
    })
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = PCFSoftShadowMap

    this.renderTarget = new WebGLRenderTarget(this.canvas.clientWidth, this.canvas.clientHeight)
    this.renderTarget.samples = 2
    //this.renderer.outputColorSpace = SRGBColorSpace
    //this.renderer.toneMapping = ACESFilmicToneMapping

    // this needs to be set up before the composer

    this.camera = new PerspectiveCamera(
        120,                                                        // FOV
        this.canvas.clientWidth / this.canvas.clientHeight,         // Aspect, updated on resize
        0.1,                                                        // Near
        120                                                         // Far) // will be overwritten in main
    )
    this.camera.position.set(0, 0, 0)
    this.camera.lookAt(0, 0, 0)

    // create the main Scene and Menu
    this.makeMainScene()
    // add helper objects for dev debug
    this.addHelpers()

    this.composer = new EffectComposer(this.renderer, this.renderTarget)
    this.composer.setSize(this.canvas.clientWidth, this.canvas.clientHeight)
    this.composer.addPass(new RenderPass(this.scene, this.camera))
    this.composer.addPass(new UnrealBloomPass(new Vector2(this.canvas.clientWidth / 2, this.canvas.clientHeight / 2), .5, .2, .2))

    this.composer.passes[1].enabled = false

    this.composer.addPass(new OutputPass())

    

    // Client (Desktop / Mobile, Input Devices)

    this.client = new KreiseClient()
    this.client.detectAndSetClientDeviceType()

    

    // Main Controls
    this.keydown = function (event) {
      switch (event.code) {
          case 'KeyI':
            if (this.client.developerMode) {
              this.switchHelpers()
            }
            break
            case 'KeyO': // usually for autoplay camera, defined in KreiseEpisode
              if (this.client.developerMode) {
                this.autoplay.camera = !this.autoplay.camera  
              }
              break
            case 'KeyP':
              if (this.client.developerMode) {
                this.autoplay.animation = !this.autoplay.animation
              }
              break    
          case 'KeyM':
            this.updateBrightness(this.brightness + 10)
            break
          case 'KeyN':
            this.updateBrightness(this.brightness - 10)
            break    
      }
    }

    const _keydown = this.keydown.bind(this)
    const _keyup = this.keyup.bind(this)
    window.addEventListener('keydown', _keydown)
    window.addEventListener('keyup', _keyup)

  }

  updateCamera(): void {

    this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight
    this.camera.updateProjectionMatrix()

  }

  makeMainScene(): void {

    this.objects.ambientLight = new AmbientLight('white', 3)
    this.objects.pointLight = new PointLight('white', 150, 150, 1.5)
    this.objects.pointLight.position.set(0, 0, 0)
    /*
    kreise.objects.pointLight.castShadow = true
    kreise.objects.pointLight.shadow.radius = 20
    kreise.objects.pointLight.shadow.camera.near = 0.5
    kreise.objects.pointLight.shadow.camera.far = 30
    kreise.objects.pointLight.shadow.mapSize.width = 2048
    kreise.objects.pointLight.shadow.mapSize.height = 2048
    */
    this.scene.add(this.objects.ambientLight)
    this.scene.add(this.objects.pointLight)
    
    // ambientLight.intensity = ((255 - kreise.brightness) / 50) + 0.2
    this.objects.ambientLight.intensity = 0.5
    // pointLight.intensity = (255 - kreise.brightness) + 50
  }

  addHelpers (): void {
    this.objects.axesHelper = new AxesHelper(4)
    this.objects.axesHelper.visible = false

    const planeHelperGeometry = new PlaneGeometry(100, 100)
    const planeHelperMaterial = new MeshLambertMaterial({
      color: 'bisque',
      emissive: 'skyblue',
      emissiveIntensity: 0.2,
      side: 2,
      transparent: true,
      opacity: 0.4
    })
    this.objects.planeHelper = new Mesh(planeHelperGeometry, planeHelperMaterial)
    this.objects.planeHelper.rotateX(Math.PI / 2)
    this.objects.planeHelper.receiveShadow = true
    this.objects.planeHelper.visible = false

    this.objects.gridHelperInstance = new GridHelper(100, 100, 'skyblue', 'bisque')
    this.objects.gridHelperInstance.position.y = -0.01
    this.objects.gridHelperInstance.visible = false

    this.objects.cameraEyeHelper = new Mesh(
      new SphereGeometry(1),
      new MeshBasicMaterial({ color: 0xdddddd })
    )
    this.objects.cameraEyeHelper.visible = false

    this.scene.add(this.objects.cameraEyeHelper)
    this.scene.add(this.objects.planeHelper)
    this.scene.add(this.objects.gridHelperInstance)
    this.scene.add(this.objects.axesHelper)
  }

  switchHelpers (): void {
    this.objects.gridHelperInstance.visible = !this.objects.gridHelperInstance.visible
    this.objects.axesHelper.visible = !this.objects.axesHelper.visible
    this.objects.planeHelper.visible = !this.objects.planeHelper.visible
    this.objects.cameraEyeHelper.visible = !this.objects.cameraEyeHelper.visible
  }

  updateBrightness (brightness: number = NaN): void {

    this.suncalc = SunCalc.getTimes(new Date(), 50.84852106503032, 12.923759828615541)
    this.sunPosition = SunCalc.getPosition(new Date(), 50.84852106503032, 12.923759828615541)
    
    if (isNaN(brightness)) {
      this.brightness = 255

      if (this.sunPosition.altitude < -0.1) {
        this.brightness = 0
      }
      
      if (this.sunPosition.altitude > 0.1) {
        this.brightness = 255
      }
      
      const altitude: number = this.sunPosition.altitude // in radians, so µ/2 at highest point
      
      // BACKGROUND COLOR
      
      // @TODO check this in anmation every minute
      if (altitude < 0.1 && altitude > -0.1) {
        this.brightness = Math.floor(255 * ((altitude + 0.1) * 5))
      }

    }

    else {
      this.brightness = brightness
    }

    if (this.brightness > 255) { this.brightness = 255 }
    if (this.brightness < 0) { this.brightness = 0 }
    

    document.body.style.setProperty('--page-background', 'rgba(' + this.brightness + ',' + this.brightness + ',' + this.brightness + ',0)')
    
    const introDiv: HTMLDivElement = document.querySelector('#introDiv') ?? document.createElement('div')
    if (this.brightness <= 128) {
      introDiv.style.cssText = 'filter: invert(1);'
    }
    else {
      introDiv.style.cssText = 'filter: invert(0);'
    }

    if (this.brightness <= 20) {

      this.composer.passes[1].enabled = true

    }

    else {

      this.composer.passes[1].enabled = false

    }

    this.scene.background = new Color('rgb(' + this.brightness + ', ' + this.brightness + ', ' + this.brightness + ')')
    
  }

}

export class KreiseClient {
  clientDeviceType: string
  hasGyro: boolean
  hasGamepad: boolean
  orientation: string
  developerMode: boolean

  constructor () {
    this.clientDeviceType = 'desktop'
    this.orientation = 'landscape'
    this.hasGyro = false
    this.hasGamepad = false
    this.developerMode = import.meta.env.DEV

    if (this.clientDeviceType === 'desktop') {
      window.addEventListener('dblclick', (event) => {
        if (event.target === document.getElementById('scene')) {
          toggleFullScreen(document.body)
        }
      })
    }
  }

  detectAndSetClientDeviceType() {

  }

}

export class KreiseMenu {
  state: string = 'closed'


}