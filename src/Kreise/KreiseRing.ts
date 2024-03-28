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
  MeshBasicMaterial
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
  color: new Color('white')

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
    // this.geometryBB = new KreiseRingGeometry({...this.parameters, lod: this.parameters.lod})

    // use the display LOD for the display geometry
    this.geometryDP = new KreiseRingGeometry({...this.parameters, lod: this.parameters.lodDisplay})
  
    this.material = this.parameters.material!

    // this.material = new LineBasicMaterial({color: 'black'})
    this.material = new MeshBasicMaterial({color: 'black', wireframe: true})

    //this.add(new Line(this.geometryBB, this.material))
    this.add(new Mesh(this.geometryDP, this.material))
    

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

    const {radius = 1, thickness = 0, extend = 0, skew = 0, side = 0, thetaLength = Math.PI*2, thetaStart = Math.PI/2} = this.parameters
    let {thetaSegments = 16, phiSegments = 1} = this.parameters

    // round segments to int
    thetaSegments = Math.floor(thetaSegments)
    phiSegments = Math.floor(phiSegments)

    // :)

    // draw a circle
    if (thickness === 0) {

      for (let t = 0; t < thetaSegments; t++) {
        // start at 12    + (current segment / all segments) * Math.PI*2 
        const segmentWidth: number = thetaStart + t / thetaSegments * thetaLength

        vertex.x = radius * Math.cos(segmentWidth)
        vertex.y = radius * Math.sin(segmentWidth)
        vertex.z = 0

        this.vertices.push(vertex.x, vertex.y, vertex.z)

        this.indices.push(t, (t+1) % thetaSegments)

      }

      // close loop on full circle
      if (thetaLength == Math.PI*2) this.indices.push(thetaSegments-1, 0);

      this.setIndex(this.indices)

      console.log(this.vertices)

      this.setAttribute('position', new Float32BufferAttribute(this.vertices, 3))
      //this.setAttribute('normal', new Float32BufferAttribute(this.normals, 3))
      //this.setAttribute('uv', new Float32BufferAttribute(this.uvs, 2))



    }

    // draw mesh
    else {

      let innerRadius = radius - thickness/2
      let outerRadius = radius + thickness/2

      for (let t = 0; t < thetaSegments; t++) {
        // start at 12    + (current segment / all segments) * Math.PI*2 
        const segmentWidth: number = thetaStart + t / thetaSegments * thetaLength
        
        let segmentLength: number = 0
        segmentLength = (outerRadius - innerRadius) / phiSegments

        for (let p = 0; p <= phiSegments; p++) {

          // inner vertex
          vertex.x = (innerRadius + (p * segmentLength)) * Math.cos(segmentWidth)
          vertex.y = (innerRadius + (p * segmentLength)) * Math.sin(segmentWidth)
          vertex.z = 0

          this.vertices.push(vertex.x, vertex.y, vertex.z)
          this.normals.push (0,0,1)

          const prevInnerIndex  = ((t-1) * (phiSegments+1)) + p
          const prevOuterIndex  = ((t-1) * (phiSegments+1)) + (p+1)

          const innerIndex      = (t * (phiSegments+1)) + p
          const outerIndex      = (t * (phiSegments+1)) + (p+1)

          const nextInnerIndex  = ((t+1) * (phiSegments+1)) + p
          const nextOuterIndex  = ((t+1) * (phiSegments+1)) + (p+1)


          
          // connect to next segment if there will be one
          if (t < (thetaSegments-1)) {
            // from inner segment to outer
            this.indices.push(innerIndex, outerIndex)
            // from outer segment to next inner
            // this.indices.push(outerIndex, nextInnerIndex)
            // from next inner segment to inner
            // this.indices.push(nextInnerIndex, innerIndex)
          }

          /*
          // connect to previous segment if there was one
          if (s > 0) {

            // from inner to previous outer
            this.indices.push(innerIndex, prevOuterIndex)
            // from prev outer segment to outer
            this.indices.push(prevOuterIndex, outerIndex)
            // from outer to inner
            this.indices.push(outerIndex, innerIndex)
 
          }
          */

        }



      }

      console.log (this.vertices)
      console.log (this.indices)
      this.setIndex (this.indices)
      this.setAttribute('position', new Float32BufferAttribute(this.vertices, 3))
      this.setAttribute('normal', new Float32BufferAttribute(this.normals, 3))

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
