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
  LineBasicMaterial
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


    
    this.name = this.parameters.name!
    
    // use the default LOD for the bounding box
    this.geometryBB = new KreiseRingGeometry({...this.parameters, lod: this.parameters.lod})

    // use the display LOD for the display geometry
    this.geometryDP = new KreiseRingGeometry({...this.parameters, lod: this.parameters.lodDisplay})
  
    this.material = this.parameters.material!

    this.material = new LineBasicMaterial({color: 'black'})

    this.add(new Line(this.geometryBB, this.material))

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

    const {radius = 1, thickness = 0, extend = 0, thetaSegments = 16, thetaLength = Math.PI*2, thetaStart = Math.PI/2} = this.parameters

    // :)

    // draw a circle
    if (thickness === 0) {
      
      for (let s = 0; s < thetaSegments!; s++) {

          const segment: number = thetaStart! + s / thetaSegments * thetaLength

          vertex.x = radius * Math.cos(segment)
          vertex.y = radius * Math.sin(segment)
          vertex.z = 0

          console.log(s, vertex)

          this.vertices.push(vertex.x, vertex.y, vertex.z)
          this.normals.push(0, 0, 1)

          uv.x = ( this.vertices[ (s+1) * 3 ] / radius + 1 ) / 2;
          uv.y = ( this.vertices[ (s + 2) * 3 ] / radius + 1 ) / 2;
    
          this.uvs.push( uv.x, uv.y );

          this.indices.push(s, (s+1) % thetaSegments)

      }

      this.indices.push(thetaSegments-1, 0)

      this.setIndex(this.indices)

      console.log(this.vertices)

      this.setAttribute('position', new Float32BufferAttribute(this.vertices, 3))
      //this.setAttribute('normal', new Float32BufferAttribute(this.normals, 3))
      //this.setAttribute('uv', new Float32BufferAttribute(this.uvs, 2))



    }

    else {



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
