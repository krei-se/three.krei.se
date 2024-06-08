import SunCalc from 'suncalc'
import type { GetSunPositionResult, GetTimesResult } from 'suncalc'

import { 
  AmbientLight, 
  AxesHelper, 
  Camera, 
  Color, 
  EventDispatcher, 
  GridHelper, 
  Intersection, 
  Mesh, 
  MeshBasicMaterial, 
  MeshLambertMaterial, 
  Object3D, 
  Object3DEventMap, 
  PCFSoftShadowMap, 
  PerspectiveCamera, 
  PlaneGeometry, 
  PointLight, 
  Raycaster, 
  Scene, 
  SphereGeometry, 
  StereoCamera, 
  Vector2, 
  WebGLRenderTarget, 
  WebGLRenderer
} from 'three'

import { toggleFullScreen } from '../helpers/fullscreen'
import { EffectComposer, OutputPass, RenderPass, UnrealBloomPass } from 'three/examples/jsm/Addons.js'
import KreiseZeit from './KreiseZeit'
import KreiseGraph from './KreiseGraph'
import KreiseRing from './KreiseRing'

export interface AutoplayOptionsInterface { camera: boolean, animation: boolean }
export interface DebugOptionsInterface { helperObjects: boolean, helperInterface: boolean }

export type CameraType = PerspectiveCamera | StereoCamera | KreiseCamera


export default class Kreise extends EventDispatcher {
  zeit: KreiseZeit
  location: number[] = [50.84852106503032, 12.923759828615541]
  suncalc: GetTimesResult
  sunPosition: GetSunPositionResult
  brightness: number

  canvas: HTMLCanvasElement
  renderer: WebGLRenderer
  renderTarget: WebGLRenderTarget
  composer: EffectComposer

  graph: KreiseGraph = new KreiseGraph()
  scene: Scene
  intersects: Intersection<Object3D<Object3DEventMap>>[] = []
  camera: CameraType

  autoplay: AutoplayOptionsInterface
  debug: DebugOptionsInterface

  rhythms: any[]
  ColorScheme: string

  client: KreiseClient

  keydown (e: KeyboardEvent): void { e; return }    // stub this to console.log(event)
  keyup (e: KeyboardEvent): void { e; return }      // stub this to console.log(event)
  onPointerMove (e: MouseEvent): void { e; return } // stub this to console.log(event)

  constructor () {
    super()
    this.zeit = new KreiseZeit()
    this.suncalc = SunCalc.getTimes(new Date(), this.location[0], this.location[1])
    this.sunPosition = SunCalc.getPosition(new Date(), this.location[0], this.location[1])
    this.brightness = 255

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
        5000                                                         // Far) // will be overwritten in main
    )
    this.camera.position.set(0, 0, 0)
    this.camera.lookAt(0, 0, 0)

    // create the main Scene and Menu
    // this.makeMainScene()
    // add helper objects for dev debug
    this.addHelpers()
    this.switchHelpers()

    this.composer = new EffectComposer(this.renderer, this.renderTarget)
    this.composer.setSize(this.canvas.clientWidth, this.canvas.clientHeight)
    this.composer.addPass(new RenderPass(this.scene, this.camera))
    this.composer.addPass(new UnrealBloomPass(new Vector2(this.canvas.clientWidth / 2, this.canvas.clientHeight / 2), .3, .2, .2))

    this.composer.passes[1].enabled = false

    this.composer.addPass(new OutputPass())

    

    // Client (Desktop / Mobile, Input Devices)

    this.client = new KreiseClient(this)

    this.updateBrightness()

    // Main Controls
    this.keydown = function (e: KeyboardEvent) {
      
      if (this.client.developerMode) {
        console.log(e.key)
      }

      switch (e.key) {
        case 'i':
          if (this.client.developerMode) {
            this.switchHelpers()
          }
        break
        case 'o': // usually for autoplay camera, defined in KreiseEpisode
        if (this.client.developerMode) {
          this.autoplay.camera = !this.autoplay.camera
          this.graph.helpers.cameraEyeHelper.visible = !this.graph.helpers.cameraEyeHelper.visible;
        }
        break
        case 'p':
        if (this.client.developerMode) {
          this.autoplay.animation = !this.autoplay.animation
        }
        break    
        case 'm':
          this.updateBrightness(this.brightness + 10)
        break
        case 'n':
          this.updateBrightness(this.brightness - 10)
        break    
        case '+':
          if (this.client.developerMode) {
            this.client.timeScale += 1000
          console.log(this.client.timeScale)
          }
        break
        case '-':
          if (this.client.developerMode) {
            this.client.timeScale -= 1000
            console.log(this.client.timeScale)
          }
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

    this.graph.lights.ambientLight = new AmbientLight('white', 1)
    this.graph.lights.pointLight = new PointLight('white', 150, 150, 1.5)
    this.graph.lights.pointLight.position.set(0, 0, 0)
    /*
    kreise.objects.pointLight.castShadow = true
    kreise.objects.pointLight.shadow.radius = 20
    kreise.objects.pointLight.shadow.camera.near = 0.5
    kreise.objects.pointLight.shadow.camera.far = 30
    kreise.objects.pointLight.shadow.mapSize.width = 2048
    kreise.objects.pointLight.shadow.mapSize.height = 2048
    */
    this.scene.add(this.graph.lights.ambientLight)
    this.scene.add(this.graph.lights.pointLight)
    
    // ambientLight.intensity = ((255 - kreise.brightness) / 50) + 0.2
    this.graph.lights.ambientLight.intensity = 0.5

    // pointLight.intensity = (255 - kreise.brightness) + 50

  }

  addHelpers (): void { // all helpers are visible by default and get switched by calling switchHelpers() in the constructor
    this.graph.helpers.axesHelper = new AxesHelper(4)

    const planeHelperGeometry = new PlaneGeometry(100, 100)
    const planeHelperMaterial = new MeshLambertMaterial({
      color: 'bisque',
      emissive: 'skyblue',
      emissiveIntensity: 0.2,
      side: 2,
      transparent: true,
      opacity: 0.4
    })
    this.graph.helpers.planeHelper = new Mesh(planeHelperGeometry, planeHelperMaterial)
    this.graph.helpers.planeHelper.rotateX(Math.PI / 2)
    this.graph.helpers.planeHelper.receiveShadow = true
    
    this.graph.helpers.planeHelper.userData.isDebugHelper = true

    this.graph.helpers.gridHelperInstance = new GridHelper(100, 100, 'skyblue', 'bisque')
    this.graph.helpers.gridHelperInstance.position.y = -0.01

    this.graph.helpers.gridHelperInstance.userData.isDebugHelper = true

    this.graph.helpers.cameraEyeHelper = new Mesh(
      new SphereGeometry(1),
      new MeshBasicMaterial({ color: 0xdddddd })
    )

    this.scene.add(this.graph.helpers.cameraEyeHelper)
    this.scene.add(this.graph.helpers.planeHelper)
    this.scene.add(this.graph.helpers.gridHelperInstance)
    this.scene.add(this.graph.helpers.axesHelper)
  }

  switchHelpers (): void {

    Object.values(this.graph.helpers).forEach((helperObject) => {
      helperObject.visible = !helperObject.visible
    })

    console.log("Camera Position: ", this.camera.position)
    console.log("Camera Rotation: ", this.camera.rotation)

  }

  updateBrightness (brightness: number = NaN): void {

    this.suncalc = SunCalc.getTimes(new Date(), this.location[0], this.location[1])
    this.sunPosition = SunCalc.getPosition(new Date(), this.location[0], this.location[1])
    
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
    
    let applyInvertFilterElements = document.querySelectorAll('.applyInvertFilter') as NodeListOf<HTMLElement>

    applyInvertFilterElements.forEach(element => {
      if (this.brightness <= 128) {
        element.style.filter = 'invert(1)'
      }
      else {
        element.style.filter = ''
      }  
    });

    if (this.brightness <= 20) {

      this.composer.passes[1].enabled = true

    }

    else {

      this.composer.passes[1].enabled = false

    }

    this.scene.background = new Color('rgb(' + this.brightness + ', ' + this.brightness + ', ' + this.brightness + ')')
    
  }

}

export class KreiseCamera extends Camera {



}

export class KreiseClient {
  clientDeviceType: string
  hasGyro: boolean
  hasGamepad: boolean
  orientation: string
  developerMode: boolean
  timeScale: number
  kreise: Kreise
  raycaster: Raycaster = new Raycaster()
  pointer: Vector2 = new Vector2()      // normalized position from -1 to 1
  pointerPx: Vector2 = new Vector2()    // absolute position in Pixels
  pointerSource: string = 'documentMouseEvent' // todo add gamepad

  constructor (kreise: Kreise) {

    this.kreise = kreise

    this.clientDeviceType = 'desktop'
    this.orientation = 'landscape'
    this.hasGyro = false
    this.hasGamepad = false
    this.developerMode = import.meta.env.DEV
    this.timeScale = 0

    if (this.clientDeviceType === 'desktop') {
      window.addEventListener('dblclick', (e: MouseEvent) => {
        if (e.target === document.getElementById('scene')) {
          toggleFullScreen(document.body)
        }
      })
    }

    this.detectAndSetClientDeviceType()
    this.setupPointer()
    this.setupRaycaster()

  }

  getDeviceAbilitiesArray() {



  }

  detectAndSetClientDeviceType() {

  }


  onMousePointerMove = (e: MouseEvent) => { // needs to be arrow function for this. to work

    this.pointer.x = ( e.offsetX / window.innerWidth ) * 2 - 1; // from -1 to 1
    this.pointer.y = - ( e.offsetY / window.innerHeight ) * 2 + 1; // from -1 to 1
  
    this.pointerPx.x = e.offsetX
    this.pointerPx.y = e.offsetY

  }

  updateRaycasterIntersects(scene: Scene ) {

    // console.log(scene.children)
    let intersects = this.raycaster.intersectObjects(scene.children)
    
    this.kreise.intersects = intersects
      
  }


  setupPointer() {

    if (this.clientDeviceType === 'desktop') {

      this.pointerSource = 'documentMouseEvent'
      document.addEventListener('pointermove', this.onMousePointerMove)

    }

    if (this.hasGamepad) {

      

    }

  }

  setupRaycaster() {

    this.raycaster.layers.set(18) // R is 18
    
  }

}

export class KreiseMenu {
  state: string = 'closed'


}