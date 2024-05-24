import {
  BufferGeometry,
  Color,
  Vector3,
  Group,
  Float32BufferAttribute,
  Material,
  MeshPhongMaterial,
  Mesh,
  Line,
  LineBasicMaterial,
  MeshLambertMaterial
} from 'three'

import type {
  DoubleSide,
  FrontSide,
  BackSide
} from 'three'

export type KreiseKugelSideType = typeof FrontSide | typeof BackSide | typeof DoubleSide

export interface KreiseKugelParameters {
  name?: string
  radius?: number

  side?: KreiseRingSideType  // 0, 1 or 2

  // radialSegments
  thetaSegments?: number
  // tubularSegments
  phiSegments?: number

  thetaStart?: number    // whether the construction of the Ring starts at 3 o Clock or somewhere else
  thetaLength?: number

  lod?: number           // defines how many subsegments for the bounding box and raycaster detection
  lodDisplay?: number  // defines how many segments we render in the end. 2 means 4 squares per segment, 3 means 9, etc.

  geometryOrder?: 'theta' | 'phi'
  geogroupsCount?: number

  material?: Material
  color?: Color

}

export const defaultKreiseRingParameters: KreiseRingParameters = {
  name: 'KreiseRing',

  radius: 1,

  thickness: 0, // use Line when using thickness 0
  extend: 0,

  skew: 0,
  side: 0,

  // radial
  thetaSegments: 16,
  // tubular
  phiSegments: 1,

  thetaStart: Math.PI / 2,  // start Ring Construction at 12 o Clock
  thetaLength: Math.PI * 2, // full circle

  lod: 1,
  lodDisplay: 2,

  geometryOrder: 'phi',
  geogroupsCount: 0,

  material: new MeshPhongMaterial(),
  color: new Color('green')
}

export default class KreiseRing extends Group {
  readonly parameters: KreiseRingParameters

  name: string
  material: Material

  geometryBB: BufferGeometry
  geometryDP: BufferGeometry

  constructor (parameters: KreiseRingParameters = {}) {
    super()

    this.parameters = { ...defaultKreiseRingParameters, ...parameters }

    const { thetaSegments = 16, phiSegments = 1, name = 'KreiseRing', material = new Material(), color = new Color('green') } = this.parameters

    // Error handling
    if (thetaSegments < 3) throw new Error('Theta Segments need to be at least 3')
    if (phiSegments < 1) throw new Error('Phi Segments need to be at least 1')

    this.name = name

    // use the default LOD for the bounding box
    this.geometryBB = new KreiseRingGeometry({ ...this.parameters, lod: this.parameters.lod })

    // use the display LOD for the display geometry
    this.geometryDP = new KreiseRingGeometry({ ...this.parameters, lod: this.parameters.lodDisplay })

    this.material = material

    // this.material = new MeshLambertMaterial({color: 'black', emissive: 'orange', wireframe: false, side: 2})

    if (this.parameters.thickness === 0) {
      this.material = new LineBasicMaterial({ color: color })
      this.add(new Line(this.geometryBB, this.material))
      this.add(new Line(this.geometryDP, this.material))
    } else {
      this.material = new MeshLambertMaterial({ color: color, wireframe: false })
      const debugMaterial = new MeshLambertMaterial({ color: color, wireframe: true })

      let BBMesh = new Mesh(this.geometryBB, debugMaterial)
      BBMesh.name = this.name + "_BB"
      let DPMesh = new Mesh(this.geometryDP, this.material)
      DPMesh.name = this.name + "_DP"

      this.add(BBMesh, DPMesh)

    }
  }
}

export class KreiseRingGeometry extends BufferGeometry {7
  type: string
  parameters: KreiseRingParameters
  // buffers

  indices: number[] = []
  vertices: number[] = []
  normals: number[] = []
  uvs: number[] = []

  constructor (parameters: KreiseRingParameters = {}) {
    super()

    this.type = 'KreiseRingGeometry'

    this.parameters = parameters

    this.vertices = []
    this.normals = []
    this.uvs = []

    this.indices = []

    // helper variables
    const vertex = new Vector3()
    // const normal = new Vector3() // always the vertex rotated by skew
    // const uv = new Vector2()

    let { radius = 1, thickness = 0, extend = 0, skew = 0, side = 0, thetaStart = Math.PI / 2, thetaLength = Math.PI * 2, lod = 1 } = this.parameters
    let { thetaSegments = 16, phiSegments = 1 } = this.parameters

    console.log('thetaLenght', thetaLength, thetaLength / (Math.PI * 2))

    // round lod up or down
    lod = Math.round(lod)

    // round segments to int
    thetaSegments = Math.floor(thetaSegments)
    phiSegments = Math.floor(phiSegments)
    
    // use lod on segments
    thetaSegments = thetaSegments * lod
    phiSegments = phiSegments * lod

    console.log('thetaSegments after rounding and LOD', thetaSegments)
    console.log('phiSegments after rounding and LOD', phiSegments)

    // cut theta segments down to thetaLength - can be fraction
    const thetaSegmentsDraw = thetaSegments * (thetaLength / (Math.PI*2))
    console.log('thetaSegmentsDraw', thetaSegmentsDraw)

    // :)
    let segmentRad: number = 0

    // draw a circle
    if (thickness === 0) {

      for (let t = 0; t <= Math.ceil(thetaSegmentsDraw); t++) {
        // start at 12    + (current segment / all segments) * Math.PI*2

        if ((thetaSegmentsDraw - t) >= 1) {
          // full segments:
          segmentRad = thetaStart + t / thetaSegments * Math.PI * 2
        } else {                      // use the last segment as base and add partial
          // part segment
          segmentRad = thetaStart + (t - 1 + (thetaSegmentsDraw - t)) / thetaSegments * Math.PI * 2
        }
        vertex.x = radius * Math.cos(segmentRad)
        vertex.y = radius * Math.sin(segmentRad)
        vertex.z = 0

        this.vertices.push(vertex.x, vertex.y, vertex.z)
        if (t < Math.ceil(thetaSegmentsDraw)) this.indices.push(t, (t + 1))
      }

      // close loop on full circle
      if (thetaLength === Math.PI * 2) this.indices.push(thetaSegments - 1, 0);

      this.setIndex(this.indices)

      // console.log(this.vertices)

      this.setAttribute('position', new Float32BufferAttribute(this.vertices, 3))
      // this.setAttribute('normal', new Float32BufferAttribute(this.normals, 3))
      // this.setAttribute('uv', new Float32BufferAttribute(this.uvs, 2))

    }

    // draw mesh
    else {

      let innerRadius = radius - thickness / 2
      let outerRadius = radius + thickness / 2

      let prevInnerIndex: number
      let prevOuterIndex: number
      let innerIndex: number
      let outerIndex: number
      let nextInnerIndex: number
      let nextOuterIndex: number

      // we want <= loops and skip vertex creation when full circle, so the last segment end is the first segment start
      for (let t = 0; t <= Math.ceil(thetaSegmentsDraw); t++) {

        // start at 12    + (current segment / all segments) * Math.PI*2
        // full segments:
        if (thetaSegmentsDraw - t >= 1) {
          console.log('full segment')
          segmentRad = thetaStart + t / thetaSegments * Math.PI * 2
        }

        // part or last segment
        else {                      // use the last segment as base and add partial
          if (Math.ceil(thetaSegmentsDraw) === thetaSegmentsDraw) {
          segmentRad = thetaStart + t / thetaSegments * Math.PI * 2
        }
          else {
          segmentRad = thetaStart + (t - 1 + (thetaSegmentsDraw-t)) / thetaSegments * Math.PI*2
        }
        }

        let segmentThickness: number = 0
        segmentThickness = (outerRadius - innerRadius) / phiSegments

        // we want <= loops because f.e. 5 segments are 6 points from inner to outer
        for (let p = 0; p <= phiSegments; p++) {
          // inner vertex
          vertex.x = (innerRadius + (p * segmentThickness)) * Math.cos(segmentRad)
          vertex.y = (innerRadius + (p * segmentThickness)) * Math.sin(segmentRad)
          vertex.z = 0

          // skip vertex creation on last segment for full circles
          if (t < Math.ceil(thetaSegmentsDraw) || thetaLength !== Math.PI * 2) {
            this.vertices.push(vertex.x, vertex.y, vertex.z)
            this.normals.push(0, 0, 1)
            console.log('vertex pushed')
          }

          prevInnerIndex  = ((t - 1)  * (phiSegments + 1)) + p
          prevOuterIndex  = ((t - 1)  * (phiSegments + 1)) + (p + 1)

          innerIndex      = ((t)      * (phiSegments + 1)) + p
          outerIndex      = ((t)      * (phiSegments + 1)) + (p + 1)

          nextInnerIndex  = ((t + 1)  * (phiSegments + 1)) + p
          nextOuterIndex  = ((t + 1)  * (phiSegments + 1)) + (p + 1)

          console.log(t + '/' + thetaSegmentsDraw, p + '/' + phiSegments, this.vertices.length / 3, vertex)
          console.log(prevInnerIndex, prevOuterIndex, innerIndex, outerIndex, nextInnerIndex, nextOuterIndex)

          if (p < phiSegments) {

            if (t < (Math.ceil(thetaSegmentsDraw) - 1)) {

              // connect next segment

              this.indices.push(innerIndex, outerIndex, nextInnerIndex)
              this.indices.push(nextOuterIndex, nextInnerIndex, outerIndex)
                
            }

            // edge case: Part Segment but no full circle?
            if (t === (Math.ceil(thetaSegmentsDraw) - 1) && thetaLength !== Math.PI * 2) {

              // connect next segment

              this.indices.push(innerIndex, outerIndex, nextInnerIndex)
              this.indices.push(nextOuterIndex, nextInnerIndex, outerIndex)
                
            }

            

            // close loop on full circle
            if ((t === thetaSegmentsDraw) && thetaLength === Math.PI * 2) {

              // remove last unneeded segment
              this.indices.push(prevInnerIndex, prevOuterIndex, p, p, prevOuterIndex, p+1)
              // this.indices.push(p, p+1, outerIndex)
            }

          }

        }

        this.addGroup(t * 6 * phiSegments, 6 * phiSegments)

      }

      this.setIndex(this.indices)
      this.setAttribute('position', new Float32BufferAttribute(this.vertices, 3))
      this.setAttribute('normal', new Float32BufferAttribute(this.normals, 3))
      this.setAttribute('uv', new Float32BufferAttribute(this.uvs, 2))

    }

  }

  copy (source: any): any {
    super.copy(source)

    this.parameters = Object.assign({}, source.parameters)

    return this
  }

  static fromJSON (data: any): KreiseRingGeometry {
    return new KreiseRingGeometry(data)
  }
}
