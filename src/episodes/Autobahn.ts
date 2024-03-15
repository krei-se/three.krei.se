import KreiseEpisode from '../Kreise/KreiseEpisode.ts'

import {
  Scene,
  Camera,
  Object3D,
  MeshPhongMaterial,
  Raycaster,
  Vector2,
  InstancedMesh,
  DynamicDrawUsage
} from 'three'

import {
  Vector3,
  Color,
} from 'three'

import { KreiseTorus } from '../Kreise/KreiseTorus'

import type Kreise from '../Kreise/Kreise.ts'

interface autoInstancesInterface { identity: string, count: number, material1: any, material2: any, offsetX: number, offsetProgress: number, speed: number }

export default class AutobahnEpisode extends KreiseEpisode {
  flyCurveTicks: number
  flyCurveDirection: Vector3
  flyCurveNormal: Vector3
  colorScheme: string
  autoInstances: Array<autoInstancesInterface>

  keydown (e: KeyboardEvent): void { e; return }    // stub this to console.log(event)
  keyup (e: KeyboardEvent): void { e; return }      // stub this to console.log(event)
  onPointerMove (e: MouseEvent): void { e; return } // stub this to console.log(event)

  raycaster: Raycaster = new Raycaster()
  pointer: Vector2 = new Vector2()

  // remember the kreise scene is the main scene and this one is local to the episode :)
  constructor (kreise: Kreise, scene: Scene, camera: Camera) {
    super(kreise, scene, camera)

    this.colorScheme = kreise.ColorScheme // set this up in main.ts

    this.flyCurveTicks = 0 // set up in makeScene
    this.flyCurveDirection = new Vector3()
    this.flyCurveNormal = new Vector3()
    this.autoInstances = []

    // Controls
    this.keydown = function (e: KeyboardEvent) {
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

    this.onPointerMove = function (event) {
      // calculate pointer position in normalized device coordinates
      // (-1 to +1) for both components
      this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1
      this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1
    }

    const _keydown = this.keydown.bind(this)
    const _keyup = this.keyup.bind(this)
    const _onPointerMove = this.onPointerMove.bind(this)
    window.addEventListener('keydown', _keydown)
    window.addEventListener('keyup', _keyup)
    window.addEventListener('pointermove', _onPointerMove)
  }

  dispose (): void {

    const _keydown = this.keydown.bind(this)
    const _keyup = this.keyup.bind(this)
    const _onPointerMove = this.onPointerMove.bind(this)

    window.removeEventListener('keydown', _keydown)
    window.removeEventListener('keyup', _keyup)
    window.removeEventListener('pointermove', _onPointerMove)

  }

  makeScene (): void { // its stored in this.scene, get it from there
  // Tori

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

    // Standstreifen
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

    let intensity: number = 1.2
    /*
    if (this.kreise.brightness === 0) {
      intensity = 1
    }
    */
    const rotesRuecklicht = { toneMapped: false, color: 0x000000, shininess: 200, emissive: 0xa50132, emissiveIntensity: intensity }
    const rotesRuecklicht2 = { toneMapped: false, color: 0x000000, shininess: 150, emissive: 0xff2200, emissiveIntensity: intensity }

    const xenonFrontlicht = { toneMapped: false, color: 0x000000, shininess: 400, emissive: 0xbdecfc, emissiveIntensity: intensity }
    const normalFrontlicht = { toneMapped: false, color: 0x000000, shininess: 350, emissive: 0xffba24, emissiveIntensity: intensity }



    this.autoInstances = [
        { identity: 'AutoBaseLKW', count: 40, material1: rotesRuecklicht, material2: xenonFrontlicht, offsetX: 9, offsetProgress: 0, speed: 0.00005 },
        { identity: 'AutoBaseLKW2', count: 40, material1: rotesRuecklicht2, material2: normalFrontlicht, offsetX: 9, offsetProgress: 1/80, speed: 0.00005 },
        
        { identity: 'AutoBaseMS', count: 20, material1: rotesRuecklicht, material2: xenonFrontlicht, offsetX: 6, offsetProgress: 0, speed: 0.00009 },
        { identity: 'AutoBaseMS2', count: 20, material1: rotesRuecklicht2, material2: normalFrontlicht, offsetX: 6, offsetProgress: 1/40,  speed: 0.00009 },
        
        { identity: 'AutoBaseUS', count: 8, material1: rotesRuecklicht, material2: xenonFrontlicht, offsetX: 3, offsetProgress: 0, speed: 0.0003},
        { identity: 'AutoBaseUS2', count: 8, material1: rotesRuecklicht2, material2: normalFrontlicht, offsetX: 3, offsetProgress: 1/16, speed: 0.0003 }
    ]

    this.autoInstances.forEach((autoInstance) => {

      this.graph.kreiseMeshes[autoInstance.identity] = new KreiseTorus({
        identity: autoInstance.identity,
        radius: 1,
        tube: 0.25,
        lod: 1,
        tubularSegments: 32,
        radialSegments: 8,
        facing: 'normal',
        geogrouping: 'horizontal'
      })

      // shorthand to shutup linter
      let autoInstanceObject = this.graph.kreiseMeshes[autoInstance.identity] as KreiseTorus

      autoInstanceObject.materials[1] = new MeshPhongMaterial(autoInstance.material1)
      autoInstanceObject.materials[0] = new MeshPhongMaterial(autoInstance.material2)
      

      for (let k: number = 0; k < autoInstanceObject.geometry.groups.length; k++) {
        autoInstanceObject.geometry.groups[k].materialIndex = Math.floor(k / 4) % 2
      }
      
      // --- Instanced Meshes ---

      let instancedMeshName: string = autoInstance.identity + 'InstancedMesh'
      this.graph.meshes[instancedMeshName] = new InstancedMesh(autoInstanceObject.geometry, autoInstanceObject.materials, autoInstance.count)
      // shorthand to shutup linter
      let instancedMeshObject = this.graph.meshes[instancedMeshName] as InstancedMesh
      instancedMeshObject.instanceMatrix.setUsage(DynamicDrawUsage)
      this.scene.add(instancedMeshObject)

      let instancedMeshNameCCW: string = autoInstance.identity + 'InstancedMeshCCW'
      this.graph.meshes[instancedMeshNameCCW] = new InstancedMesh(autoInstanceObject.geometry, autoInstanceObject.materials, autoInstance.count)
      // shorthand to shutup linter
      let instancedMeshObjectCCW = this.graph.meshes[instancedMeshNameCCW] as InstancedMesh
      instancedMeshObjectCCW.instanceMatrix.setUsage(DynamicDrawUsage)

      this.scene.add(instancedMeshObjectCCW)

    })

    this.camera.position.set(0, -16.5, 0)
    this.camera.lookAt(0, -16.5, 0)

    this.kreise.graph.helpers.cameraEyeHelper.position.set(0, -16.5, 0)
    this.kreise.graph.helpers.cameraEyeHelper.lookAt(0, -16.5, 0)

    
    //this.camera.rotateZ(-Math.PI / 10)
  }



  update (ticks: number): void {
    if (this.kreise.autoplay.animation) {
      this.graph.kreiseMeshes.Bahn2.rotation.z = ticks * -0.00005
      this.graph.kreiseMeshes.Bahn3.rotation.z = ticks * -0.00005

      this.graph.kreiseMeshes.Bahn6.rotation.z = ticks * -0.00005
      this.graph.kreiseMeshes.Bahn7.rotation.z = ticks * -0.00005
    }

    const matrixDummy = new Object3D();

    this.autoInstances.forEach((autoInstance) => {

      let instancedMeshName: string = autoInstance.identity + 'InstancedMesh'

      // shorthand to shutup linter
      let instancedMeshObject = this.graph.meshes[instancedMeshName] as InstancedMesh 

      for (let i: number = 0 ; i < instancedMeshObject.count; i++ ) {
        //for (let i: number = 1 ; i <= 10; i++ ) {
    
          let radius: number = 20
          let progress: number = (i / instancedMeshObject.count) + autoInstance.offsetProgress
          matrixDummy.position.set (autoInstance.offsetX, Math.cos(progress * (Math.PI * 2)) * radius, Math.sin(progress * (Math.PI * 2)) * radius)
          matrixDummy.rotation.x = 0
          matrixDummy.rotateX((Math.PI * 2) * progress)
          matrixDummy.updateMatrix();
    
          instancedMeshObject.setMatrixAt(i, matrixDummy.matrix)
    
        }
    
        instancedMeshObject.rotation.x = ticks * autoInstance.speed
    
        // only needed if we change the color
        instancedMeshObject.instanceMatrix.needsUpdate = true;

    })

    // CCW

    this.autoInstances.forEach((autoInstance) => {

      let instancedMeshNameCCW: string = autoInstance.identity + 'InstancedMeshCCW'

      // shorthand to shutup linter
      // @TODO find a faster way for update loops (filter objects before)
      let instancedMeshObjectCCW = this.graph.meshes[instancedMeshNameCCW] as InstancedMesh 


      for (let i: number = 0 ; i < instancedMeshObjectCCW.count; i++ ) {
        //for (let i: number = 1 ; i <= 10; i++ ) {
    
          let radius: number = 20
          let progress: number = (i / instancedMeshObjectCCW.count) + autoInstance.offsetProgress
          matrixDummy.position.set (-autoInstance.offsetX, Math.cos(progress * (Math.PI * 2)) * radius, Math.sin(progress * (Math.PI * 2)) * radius)
          matrixDummy.rotation.x = 0
          matrixDummy.rotation.y = 0
          matrixDummy.rotation.z = 0
          
          matrixDummy.rotateX((Math.PI * 2) * progress)
          matrixDummy.rotateY(Math.PI)
          matrixDummy.updateMatrix();
    
          instancedMeshObjectCCW.setMatrixAt(i, matrixDummy.matrix)
    
        }
    
        instancedMeshObjectCCW.rotation.x = ticks * -autoInstance.speed
    
    
        instancedMeshObjectCCW.instanceMatrix.needsUpdate = true;

    })


    if (this.kreise.autoplay.camera) {
      this.camera.rotation.x = ticks * 0.00004
      this.camera.rotation.z = Math.sin(ticks / 5000) * .3
    }

    // Raycaster

    this.raycaster.setFromCamera(this.pointer, this.camera)

    /*
    // calculate objects intersecting the picking ray
    const intersects = this.raycaster.intersectObjects(this.kreise.scene.children)

    for (let i = 0; i < intersects.length; i++) {
      if (!isUndef(intersects[i].object.materials)) {
        if (intersects[i].object.materials.length >= 1) {
          intersects[i].object.materials.forEach(item => {
            item.color.set(0xffff00)
          })
        }
      }
    }
    */

    // debug
    if (this.kreise.client.developerMode) {

      if (ticks % 1000 === 0)

        console.log(this.graph)



    }

  }
}