import {
  BufferGeometry,
  Color,
  Vector3,
  Group,
  DoubleSide,
  FrontSide,
  BackSide
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

  color?: Color

}

export const defaultKreiseRingParameters: KreiseRingParameters = {

  name: "KreiseRing",

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

  color: new Color('white'),

}

export default class KreiseRing extends Group {

  private parameters: KreiseRingParameters
  
  name: string

  geometryBB: BufferGeometry
  geometryDP: BufferGeometry

  constructor (parameters: KreiseRingParameters = {}) {
    super()

    this.parameters = { ...defaultKreiseRingParameters, ...parameters }
    
    this.name = this.parameters.name!
    
    // use the default LOD for the bounding box
    this.geometryBB = new KreiseRingGeometry({...this.parameters, lod: this.parameters.lod})

    // use the display LOD for the display geometry
    this.geometryDP = new KreiseRingGeometry({...this.parameters, lod: this.parameters.lodDisplay})
  
  }

}

export class KreiseRingGeometry extends BufferGeometry {
  
  type: string
  parameters: KreiseRingParameters
  tubularSegmentIndices: any

  indices: any
  vertices: any
  normals: any
  uvs: any
  verticesIndex: any

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

    // :)


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
