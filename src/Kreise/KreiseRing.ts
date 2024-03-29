import {
  BufferGeometry,
  Color,
  Vector3,
  Group,
  DoubleSide,
  FrontSide,
  BackSide,
  Float32BufferAttribute,
  Material,
  MeshPhongMaterial,
  Mesh,
  Line,
  Vector2,
  LineBasicMaterial,
  MeshBasicMaterial,
  MeshLambertMaterial
} from 'three'

// import turboTextureImage from './textures/turbo.png'

export type KreiseRingSideType = typeof FrontSide | typeof BackSide | typeof DoubleSide
export type KreiseRingExtendType = -1 | 0 | 1

export interface KreiseRingParameters {
  name?: string,
  
  // this is always the radius without any thickness. We need the radius be like that so a skewed ring has expected radia
  radius?: number,

  thickness?: number,
  extend?: -1 | 0 | 1,       // in, center or out extension by thickness to radius

  skew?: number,             // flat ring, takes radians to rotate, so half pi makes a cylinder
  side?: KreiseRingSideType  // 0, 1 or 2

  // radialSegments
  thetaSegments?: number
  // tubularSegments
  phiSegments?: number

  thetaStart?: number    // whether the construction of the Ring starts at 3 o Clock or somewhere else
  thetaLength?: number

  lod?: number           // defines how many subsegments for the bounding box and raycaster detection 
  lodDisplay?: number,  // defines how many segments we render in the end. 2 means 4 squares per segment, 3 means 9, etc.
  
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

  thetaStart: Math.PI/2,  // start Ring Construction at 12 o Clock
  thetaLength: Math.PI * 2, // full circle

  lod: 1,
  lodDisplay: 2,

  geometryOrder: 'phi',
  geogroupsCount: 0,

  material: new MeshPhongMaterial(),
  color: new Color('green')

}

export default class KreiseRing extends Group {

  private parameters: KreiseRingParameters
  
  name: string
  material: Material

  geometryBB: BufferGeometry
  geometryDP: BufferGeometry

  constructor (parameters: KreiseRingParameters = {}) {
    super()

    this.parameters = { ...defaultKreiseRingParameters, ...parameters }

    // Error handling
    if (this.parameters.thetaSegments! < 3) new Error("Theta Segments need to be at least 3")
    if (this.parameters.phiSegments! < 1) new Error("Phi Segments need to be at least 1")


    
    this.name = this.parameters.name!
    
    // use the default LOD for the bounding box
    this.geometryBB = new KreiseRingGeometry({...this.parameters, lod: this.parameters.lod})

    // use the display LOD for the display geometry
    this.geometryDP = new KreiseRingGeometry({...this.parameters, lod: this.parameters.lodDisplay})
  
    this.material = this.parameters.material!

    //this.material = new MeshLambertMaterial({color: 'black', emissive: 'orange', wireframe: false, side: 2})

    if (this.parameters.thickness === 0) {

      this.material = new LineBasicMaterial({color: this.parameters.color!})

      this.add(new Line(this.geometryBB, this.material))
      this.add(new Line(this.geometryDP, this.material))
 
    } else {

      this.material = new MeshLambertMaterial({color: this.parameters.color!, wireframe: false})
      let debugMaterial = new MeshLambertMaterial({color: this.parameters.color!, wireframe: true})

      this.add(new Mesh(this.geometryBB, debugMaterial))
      this.add(new Mesh(this.geometryDP, this.material))

    }

    

  }

}

export class KreiseRingGeometry extends BufferGeometry {
  
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
    const centerForRadial = new Vector3()
    const vertex = new Vector3()
    const normal = new Vector3() // always the vertex rotated by skew
    const uv = new Vector2()

    const {radius = 1, thickness = 0, extend = 0, skew = 0, side = 0, thetaStart = Math.PI/2, thetaLength = Math.PI*2, lod = 1} = this.parameters
    let {thetaSegments = 16, phiSegments = 1} = this.parameters

    console.log('thetaLenght', thetaLength)

    // round segments to int
    thetaSegments = Math.floor(thetaSegments) * Math.floor(lod)
    // console.log('thetaSegmentsRounded', thetaSegments) 
    phiSegments = Math.floor(phiSegments) * Math.floor(lod)

    // cut theta segments down to thetaLength
    let thetaSegmentsDisplay = thetaSegments * (thetaLength / (Math.PI*2))
    // console.log('thetaSegmentsDisplay', thetaSegmentsDisplay)

    // :)
    let segmentRad: number = 0

    // draw a circle
    if (thickness === 0) {

      for (let t = 0; t <= Math.ceil(thetaSegmentsDisplay); t++) {
        // start at 12    + (current segment / all segments) * Math.PI*2
        // full segments:
        if (thetaSegmentsDisplay - t >= 1) {
          segmentRad = thetaStart + t / thetaSegments * Math.PI*2
        }
        // part segment
        else {                      // use the last segment as base and add partial
          segmentRad = thetaStart + (t - 1 + (thetaSegmentsDisplay-t)) / thetaSegments * Math.PI*2
        }
        
        vertex.x = radius * Math.cos(segmentRad)
        vertex.y = radius * Math.sin(segmentRad)
        vertex.z = 0


        this.vertices.push(vertex.x, vertex.y, vertex.z)
        if (t < Math.ceil(thetaSegmentsDisplay)) this.indices.push(t, (t+1))

      }

      // close loop on full circle
      if (thetaLength == Math.PI*2) this.indices.push(thetaSegments-1, 0);

      this.setIndex(this.indices)

      //console.log(this.vertices)

      this.setAttribute('position', new Float32BufferAttribute(this.vertices, 3))
      //this.setAttribute('normal', new Float32BufferAttribute(this.normals, 3))
      //this.setAttribute('uv', new Float32BufferAttribute(this.uvs, 2))



    }

    // draw mesh
    else {

      let innerRadius = radius - thickness/2
      let outerRadius = radius + thickness/2

      let prevInnerIndex: number
      let prevOuterIndex: number
      let innerIndex: number
      let outerIndex: number
      let nextInnerIndex: number
      let nextOuterIndex: number

      // we want <= loops and skip vertex creation when full circle, so the last segment end is the first segment start
      for (let t = 0; t <= Math.ceil(thetaSegmentsDisplay); t++) {
                // start at 12    + (current segment / all segments) * Math.PI*2
        // full segments:
        if (thetaSegmentsDisplay - t >= 1) {
          segmentRad = thetaStart + t / thetaSegments * Math.PI*2
        }
        // part segment
        else {                      // use the last segment as base and add partial
          segmentRad = thetaStart + (t - 1 + (thetaSegmentsDisplay-t)) / thetaSegments * Math.PI*2
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
          if (t < thetaSegments || thetaLength != Math.PI*2) {
            this.vertices.push(vertex.x, vertex.y, vertex.z)
            this.normals.push (0,0,1)
          }

          prevInnerIndex  = ((t-1)  * (phiSegments+1)) + p
          prevOuterIndex  = ((t-1)  * (phiSegments+1)) + (p+1)

          innerIndex      = ((t)    * (phiSegments+1)) + p
          outerIndex      = ((t)    * (phiSegments+1)) + (p+1)

          nextInnerIndex  = ((t+1)  * (phiSegments+1)) + p
          nextOuterIndex  = ((t+1)  * (phiSegments+1)) + (p+1)

          console.log(t + "/" + thetaSegmentsDisplay, p + "/" + phiSegments, this.vertices.length / 3, vertex)
          //console.log(prevInnerIndex, prevOuterIndex, innerIndex, outerIndex, nextInnerIndex, nextOuterIndex)

          if (p < phiSegments) {

            if (t < thetaSegmentsDisplay) {

              // connect to next segment if there will be one
              if (t < thetaSegmentsDisplay-1) {
              this.indices.push(innerIndex, outerIndex, nextInnerIndex)
              }
              // connect previous segment if there is one
              if (t > 0) this.indices.push(innerIndex, prevOuterIndex, outerIndex)
            }
            
            // close loop on full circle
            if ((t === thetaSegmentsDisplay) && thetaLength === Math.PI*2) {
              this.indices.push(prevInnerIndex, prevOuterIndex, p, p, prevOuterIndex, p+1)
              // this.indices.push(p, p+1, outerIndex)
            }

          }

          
        }

        



      }

      this.setIndex (this.indices)
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
