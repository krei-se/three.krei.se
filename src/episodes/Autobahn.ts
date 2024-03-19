import KreiseEpisode from '../Kreise/KreiseEpisode.ts'

import {
  Scene,
  Camera,
  Object3D,
  MeshPhongMaterial,
  Raycaster,
  Vector2,
  InstancedMesh,
  DynamicDrawUsage,
  CylinderGeometry,
  MeshBasicMaterial,
  Mesh,
  BackSide,
  Group,
  ArcCurve,
  EllipseCurve,
  BufferGeometry
} from 'three'

import {
  Vector3,
  Color,
} from 'three'

import { KreiseTorus } from '../Kreise/KreiseTorus'

import type Kreise from '../Kreise/Kreise.ts'
import { Synth } from 'tone'
import { Tone } from 'tone/build/esm/core/Tone'

interface autoInstancesInterface { identity: string, count: number, material1: any, material2: any, offsetX: number, offsetProgress: number, speed: number }

export default class AutobahnEpisode extends KreiseEpisode {
  flyCurveTicks: number
  flyCurveDirection: Vector3
  flyCurveNormal: Vector3
  colorScheme: string
  autoInstances: Array<autoInstancesInterface>
  ticks: number // used for onClick
  lastSound: number = 0
  lastTone: number = 0
  synth: Synth = new Synth().toDestination();

  keydown (e: KeyboardEvent): void { e; return }    // stub this to console.log(event)
  keyup (e: KeyboardEvent): void { e; return }      // stub this to console.log(event)
  onPointerMove (e: MouseEvent): void { e; return } // stub this to console.log(event)
  onClick (e: MouseEvent): void { e; return } // stub this to console.log(event)

  // remember the kreise scene is the main scene and this one is local to the episode :)
  constructor (kreise: Kreise, scene: Scene, camera: Camera) {
    super(kreise, scene, camera)

    this.colorScheme = kreise.ColorScheme // set this up in main.ts

    this.flyCurveTicks = 0 // set up in makeScene
    this.flyCurveDirection = new Vector3()
    this.flyCurveNormal = new Vector3()
    this.autoInstances = []

    // Controls
    this.keydown = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyO':
          if (this.kreise.client.developerMode) {
            if (this.kreise.autoplay.camera) {
              this.camera.position.set(0, -16.5, 0)
              this.camera.lookAt(0, -16.5, 0)
            }
          }
          console.log(this.camera.position)
          break
      }
    }

    this.onClick = function(e: MouseEvent) {
      console.log(e)



    }

    window.addEventListener('keydown', this.keydown)
    // window.addEventListener('keyup', _keyup)
    // window.addEventListener('pointermove', _onPointerMove)
    window.addEventListener('click', this.onClick)
    
  }

  dispose (): void {

    window.removeEventListener('keydown', this.keydown)
    // window.removeEventListener('keyup', _keyup)
    // window.removeEventListener('pointermove', _onPointerMove)
    window.removeEventListener('click', this.onClick)
    
  }

  load (): void { // its stored in this.scene, get it from there
  

    const rotesRuecklicht = { toneMapped: false, color: 0x000000, shininess: 200, emissive: 0xa50132, emissiveIntensity: 1.2 }
    const rotesRuecklicht2 = { toneMapped: false, color: 0x000000, shininess: 150, emissive: 0xff2200, emissiveIntensity: 1.2 }

    const xenonFrontlicht = { toneMapped: false, color: 0x000000, shininess: 400, emissive: 0xbdecfc, emissiveIntensity: 1.2 }
    const normalFrontlicht = { toneMapped: false, color: 0x000000, shininess: 350, emissive: 0xffba24, emissiveIntensity: 1.2 }


    this.graph.kreiseMeshes.redXenon = new KreiseTorus({
      identity: 'redXenon',
      radius: 1,
      tube: 0.25,
      lod: 1,
      tubularSegments: 32,
      radialSegments: 8,
      facing: 'normal',
      geogrouping: 'horizontal'
    })

    let redXenonKreiseTorus = this.graph.kreiseMeshes.redXenon as KreiseTorus

    redXenonKreiseTorus.materials[1] = new MeshPhongMaterial(rotesRuecklicht)
    redXenonKreiseTorus.materials[0] = new MeshPhongMaterial(xenonFrontlicht)
    
    for (let k: number = 0; k < redXenonKreiseTorus.geometry.groups.length; k++) {
      redXenonKreiseTorus.geometry.groups[k].materialIndex = Math.floor(k / 4) % 2 // alternate material every four geometry groups (its 8 radial segments)
    }

    this.graph.kreiseMeshes.red2Normal = new KreiseTorus({
      identity: 'red2Normal',
      radius: 1,
      tube: 0.25,
      lod: 1,
      tubularSegments: 32,
      radialSegments: 8,
      facing: 'normal',
      geogrouping: 'horizontal'
    })

    let red2NormalKreiseTorus = this.graph.kreiseMeshes.red2Normal as KreiseTorus

    red2NormalKreiseTorus.materials[1] = new MeshPhongMaterial(rotesRuecklicht2)
    red2NormalKreiseTorus.materials[0] = new MeshPhongMaterial(normalFrontlicht)
    
    for (let k: number = 0; k < red2NormalKreiseTorus.geometry.groups.length; k++) {
      red2NormalKreiseTorus.geometry.groups[k].materialIndex = Math.floor(k / 4) % 2 // alternate material every four geometry groups (its 8 radial segments)
    }



    
    let autoCurveCCW: EllipseCurve = new EllipseCurve(0, 0, 20, 20, 0, 2 * Math.PI, false, 0)
    let autoCurveCW: EllipseCurve = new EllipseCurve(0, 0, 20, 20, 0, 2 * Math.PI, true, 0)

    /*
    let autoCurveCCWPoints: Vector2[] = autoCurveCCW.getPoints(360) 
    let autoCurveCWPoints: Vector2[] = autoCurveCW.getPoints(360) 
    
    let autoCurveCCWGeometry: BufferGeometry = new BufferGeometry().setFromPoints(autoCurveCCWPoints)
    let autoCurveCWGeometry: BufferGeometry = new BufferGeometry().setFromPoints(autoCurveCWPoints)
    */

    this.graph.autos = [-3 ,-2 ,-1 , 1 , 2 , 3]
      
 
      
    this.graph.createAutosGroups = function() {
      // remember this is now this.graph
      this.autos.forEach((auto: number) => {
        
        this.groups[auto] = new Group()
        this.groups[auto].name = auto.toString()

      });
    }

    this.graph.createAutosGroups()

    this.graph.createAutosRaycastHitBoxes = function() {
      
      this.autos.forEach((auto: number) => {
        const autoRaycastGeometry: CylinderGeometry = new CylinderGeometry(20, 20, 2, 64, 2, true)
        const autoRaycastMaterial: MeshBasicMaterial = new MeshBasicMaterial({color: 'orange', side: BackSide})
    
        let autoRaycastHitBoxMesh: Mesh = new Mesh(autoRaycastGeometry, autoRaycastMaterial)
        autoRaycastHitBoxMesh.name = 'Autos' + auto + 'RaycastHitBoxMesh'
        autoRaycastHitBoxMesh.visible = true
        autoRaycastHitBoxMesh.layers.set(18)
        autoRaycastHitBoxMesh.position.x = auto * 3
        autoRaycastHitBoxMesh.rotateZ(Math.PI/2)

        this.groups[auto].add(autoRaycastHitBoxMesh)

      })

    }

    this.graph.createAutosRaycastHitBoxes()

    this.graph.createAutosInstancedMeshes = function() {
      
      this.autos.forEach((auto: number) => {

        let count = Math.abs(auto) * 12

        let instancedMesh1 = new InstancedMesh(redXenonKreiseTorus.geometry, redXenonKreiseTorus.materials, count)
        instancedMesh1.name = auto + 'InstancedMesh1'
        instancedMesh1.instanceMatrix.setUsage(DynamicDrawUsage)
        let instancedMesh2 = new InstancedMesh(red2NormalKreiseTorus.geometry, red2NormalKreiseTorus.materials, count)
        instancedMesh1.name = auto + 'InstancedMesh2'
        instancedMesh2.instanceMatrix.setUsage(DynamicDrawUsage)

        console.log(instancedMesh1)

        this.groups[auto].add(instancedMesh1)
        this.groups[auto].add(instancedMesh2)

      })

    }

    this.graph.createAutosInstancedMeshes()

    console.log(this.graph)

    Object.entries(this.graph.groups).forEach(([_, group]) => {
      this.scene.add(group)
    })

    console.log(this.scene)

    this.camera.position.set(0, -16.5, 0)
    this.camera.lookAt(0, -16.5, 0)

    this.kreise.graph.helpers.cameraEyeHelper.position.set(0, -16.5, 0)
    this.kreise.graph.helpers.cameraEyeHelper.lookAt(0, -16.5, 0)

    
    //this.camera.rotateZ(-Math.PI / 10)
  }

  update (ticks: number): void {

    this.ticks = ticks

    if (this.kreise.autoplay.animation) {
      /*

      this.graph.kreiseMeshes.Bahn2.rotation.z = ticks * -0.00005
      this.graph.kreiseMeshes.Bahn3.rotation.z = ticks * -0.00005

      this.graph.kreiseMeshes.Bahn6.rotation.z = ticks * -0.00005
      this.graph.kreiseMeshes.Bahn7.rotation.z = ticks * -0.00005
    
      */
    }

    // catch car lane ray cast intersects

    const matrixDummy = new Object3D();


    let radius: number = 20

    let selectedAutos: number[] = []
    let toneMap: { [index: number]: any } = {
      [-3]: 'E2',
      [-2]: 'A2',
      [-1]: 'D3',
      [1]: 'G3',
      [2]: 'B3',
      [3]: 'E4'
    }

    if (Object.keys(this.kreise.intersects).length !== 0) {

        this.kreise.intersects.forEach((intersect, _) => {

          console.log(intersect)
          selectedAutos.push(parseInt(intersect.object.parent!.name))

        })

        console.log(selectedAutos)

    }

    else {

    }

    this.graph.autos.forEach((auto: number) => {

      let instancedMesh1 = this.graph.groups[auto].children[1] as InstancedMesh
      let instancedMesh2 = this.graph.groups[auto].children[2] as InstancedMesh
      
      for (let i: number = 0 ; i < instancedMesh1.count; i++ ) {
        //for (let i: number = 1 ; i <= 10; i++ ) {

          if (selectedAutos.includes(auto)) {
            radius = 20.5
            if (ticks > this.lastSound + 100 && auto != this.lastTone) {
              let synth: Synth = new Synth().toDestination();
              synth.triggerAttackRelease(toneMap[auto], '8n')
              this.lastTone = auto
            }
            this.lastSound = ticks

          }
          else { 
            radius = 20 
          }


    
          let progress: number = (i / instancedMesh1.count) // + autoInstance.offsetProgress
          matrixDummy.position.set (auto * 3, Math.cos(progress * (Math.PI * 2)) * radius, Math.sin(progress * (Math.PI * 2)) * radius)
          matrixDummy.rotation.x = 0
          matrixDummy.rotateX((Math.PI * 2) * progress)

          if (auto < 0) { 
            matrixDummy.rotateX(Math.PI)
          }

          matrixDummy.updateMatrix();
    
          instancedMesh1.setMatrixAt(i, matrixDummy.matrix)
          instancedMesh2.setMatrixAt(i, matrixDummy.matrix)
    
        }
    
        instancedMesh1.rotation.x = ticks * (3 / auto) * 0.00008
        instancedMesh2.rotation.x = ticks * (3 / auto) * 0.00008 + (Math.PI / (12 * auto))
    
        // only needed if we change the color
        instancedMesh1.instanceMatrix.needsUpdate = true;
        instancedMesh2.instanceMatrix.needsUpdate = true;

    })

    if (this.kreise.autoplay.camera) {
      this.camera.rotation.x = ticks * 0.00004
      this.camera.rotation.z = Math.sin(ticks / 5000) * .3
    }


    // debug
    if (this.kreise.client.developerMode) {

      if (Math.floor(ticks / 100) % 50 === 0)

        console.log(this.graph)



    }

  }
}








// Tori

    /*
    this.graph.kreiseMeshes.Bahn1 = new KreiseTorus({
      identity: 'Bahn1',
      radius: 20,
      tube: 0.3,
      lod: 24,
      color: new Color(parseInt('0xffffff')),
      facing: 'normal'
    })

    this.graph.kreiseMeshes.Bahn2 = new KreiseTorus({
      identity: 'Bahn2',
      radius: 20,
      tube: .2,
      lod: 24,
      color: new Color(0x000000),
      facing: 'normal'
    })

    this.graph.kreiseMeshes.Bahn3 = new KreiseTorus({
      identity: 'Bahn3',
      radius: 20,
      tube: .2,
      lod: 24,
      color: new Color(0x000000),
      facing: 'normal'
    })

    this.graph.kreiseMeshes.Bahn4 = new KreiseTorus({
      identity: 'Bahn4',
      radius: 20,
      tube: .2,
      lod: 24,
      color: new Color(0x000000),
      facing: 'normal'
    })

    this.graph.kreiseMeshes.Bahn5 = new KreiseTorus({
      identity: 'Bahn5',
      radius: 20,
      tube: .2,
      lod: 24,
      color: new Color(0x000000),
      facing: 'normal'
    })

    this.graph.kreiseMeshes.Bahn6 = new KreiseTorus({
      identity: 'Bahn6',
      radius: 20,
      tube: .2,
      lod: 24,
      color: new Color(0x000000),
      facing: 'normal'
    })

    this.graph.kreiseMeshes.Bahn7 = new KreiseTorus({
      identity: 'Bahn7',
      radius: 20,
      tube: .2,
      lod: 24,
      color: new Color(0x000000),
      facing: 'normal'
    })

    this.graph.kreiseMeshes.Bahn8 = new KreiseTorus({
      identity: 'Bahn8',
      radius: 20,
      tube: .2,
      lod: 24,
      color: new Color(0x000000),
      facing: 'normal'
    })

    */
    
    
    // Standstreifen
    /*
    this.graph.objects.standstreifen = [this.graph.kreiseMeshes.Bahn1, this.graph.kreiseMeshes.Bahn4, this.graph.kreiseMeshes.Bahn5, this.graph.kreiseMeshes.Bahn8]

    this.graph.objects.standstreifen.forEach((Bahn) => {
      if (Bahn instanceof KreiseTorus) {
        Bahn.materials[0] = new MeshPhongMaterial({ color: 0xeeeeee, shininess: 300 })
      }
    })
    // Leitlinien links
    this.graph.objects.leitlinien = [this.graph.kreiseMeshes.Bahn2, this.graph.kreiseMeshes.Bahn3, this.graph.kreiseMeshes.Bahn6, this.graph.kreiseMeshes.Bahn7]

    this.graph.objects.leitlinien.forEach((Bahn) => {
      if (Bahn instanceof KreiseTorus) {
        Bahn.materials[0] = new MeshPhongMaterial({ color: 0x000000, transparent: true, opacity: 0 });
        Bahn.materials[1] = new MeshPhongMaterial({ color: 0xdddddd, shininess: 150 })

        // console.log(Bahn.geometry.groups)

        for (let j: number = 0; j < Bahn.geometry.groups.length; j++) {
          Bahn.geometry.groups[j].materialIndex = Math.floor(j / 10) % 2
        }
      }
    })

    // Und jetzt alle Linien!
    for (let i: number = 1; i <= 8; i++) {
      const BahnName = 'Bahn' + i
      const Bahn: KreiseTorus = this.graph.kreiseMeshes[BahnName] as KreiseTorus
      // rotate around Y so its in front and behind the camera
      Bahn.rotateY(Math.PI / 2)

      // Position
      Bahn.position.x = -13.5 + (3 * i)

      this.scene.add(this.graph.kreiseMeshes[BahnName])
    }
    */