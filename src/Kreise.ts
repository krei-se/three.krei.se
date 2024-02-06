import SunCalc from 'suncalc'
import type { GetSunPositionResult, GetTimesResult } from 'suncalc'

import { AxesHelper, GridHelper, Mesh, MeshBasicMaterial, MeshLambertMaterial, PlaneGeometry, PlaneHelper, Scene, SphereGeometry, WebGLRenderer } from 'three'
import { toggleFullScreen } from './helpers/fullscreen'
import { ObjectInterface } from './episodes/KreiseEpisode'

export interface AutoplayOptionsInterface { camera: boolean, animation: boolean }
export interface DebugOptionsInterface { helperObjects: boolean, helperInterface: boolean }

export default class Kreise {
  suncalc: GetTimesResult
  sunPosition: GetSunPositionResult
  brightness: number

  renderer: WebGLRenderer
  scene: Scene
  objects: ObjectInterface

  autoplay: AutoplayOptionsInterface
  debug: DebugOptionsInterface

  rhythms: any[]
  ColorScheme: string

  client: KreiseClient

  constructor () {
    this.suncalc = SunCalc.getTimes(new Date(), 50.84852106503032, 12.923759828615541)
    this.sunPosition = SunCalc.getPosition(new Date(), 50.84852106503032, 12.923759828615541)
    this.brightness = 255

    this.renderer = new WebGLRenderer() // will be overwritten later
    this.scene = new Scene()
    this.objects = {}

    this.addHelpers()

    this.autoplay = { camera: true, animation: true }
    this.debug = { helperObjects: false, helperInterface: false }

    this.rhythms = [] // will be overwritten in main.ts
    this.ColorScheme = '' // will be overwritten in main.ts

    this.client = new KreiseClient()
    this.client.detectAndSetClientDeviceType()
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
        if (event.target === canvas) {
          toggleFullScreen(document.body)
        }
      })
    }
  }

  detectAndSetClientDeviceType() {

  }
}