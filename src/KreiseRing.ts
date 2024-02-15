import {
  Mesh,
  type BufferAttribute,
  type InterleavedBufferAttribute,
  BufferGeometry,
  Color,
  Material,
  type MeshBasicMaterial,
  type MeshLambertMaterial,
  MeshPhongMaterial,
  Vector3,
  Float32BufferAttribute,
  // TextureLoader,
  DynamicDrawUsage,
  ShaderMaterial,
  Int32BufferAttribute,
  TorusGeometry,
  RingGeometry,
  Group
} from 'three'

// import turboTextureImage from './textures/turbo.png'

class KreiseRing extends Group {
  
  // this is always the radius without any thickness. We need the radius be like that so a skewed ring has expected radia
  radius: number

  // this is always the band width, tubular width in torus
  thickness: number

  // this is always the count of segments for the most basic mesh used for bounding box and display mesh
  // the first segment is always at 12 o Clock, NOT at 3 o Clock
  segments: number = 16

  skew: number = 0 // flat ring, takes radians to rotate, so half pi makes a cylinder
  lod: number = 1           // Level of detail for the bounding box, 1 means 1 face / 4 vertices per segment. 2 means 2 faces / 9 vertices, 3 means 16, etc. pp.
  lodDisplay: number = 3    // Level of detail for the display mesh. 3 means 16 vertices per segment, so a normal ring has 16x16 = 128 vertices
  // default x and y axis, facing normals z (towards camera)

  geogrouping: string = 'vertical'
  color: Color
  // arc: number

  constructor (parameters: any) {
    super()

    this.name = parameters.name

    this.radius = parameters.radius
    this.thickness = parameters.thickness
    this.segments = parameters.segments ?? 16
    this.skew = parameters.skew ?? 0
    this.lod = parameters.lod ?? 1
    this.lodDisplay = parameters.lodDisplay ?? 3


    this.color = parameters.color ?? new Color(0xffffff)
  
  }

}

class KreiseRingGeometry extends BufferGeometry {
  type: string
  parameters: any
  tubularSegmentIndices: any
  indices: any
  vertices: any
  normals: any
  uvs: any
  verticesIndex: any

  constructor (radius: number = 6, thickness: number = 1, segments: number = 12, skew: number = 0, lod: number = 1, facing: string = 'normal', arc: number = Math.PI * 2) {
    super()

    this.type = 'KreiseRingGeometry'

    this.vertices = []
    this.normals = []
    this.uvs = []

    this.indices = []
    this.verticesIndex = []

    this.parameters = {
      radius,
      thickness,
      segments,
      skew,
      lod,
      facing,
      arc
    }

    segments = Math.floor(segments)
    // thickness can be float

    // helper variables

    const centerForRadial = new Vector3()
    const vertex = new Vector3()
    const normal = new Vector3() // always the vertex rotated by skew

    // generate vertices, normals and uvs

    // band segments are always integer and plus 1 to LOD, so at least 2. LOD 3 means 4 faces / band segments (and 4 radial segments per segment)
    const bandSegments = Math.ceil(this.parameters.lod) + 1

    let radia: number[] = []
    for (let i: number = 1; i <= bandSegments; i++) {
      let offset = (this.parameters.radius - this.parameters.thickness / 2) + (this.parameters.thickness / i)
      radia.push(this.parameters.radius + offset)
    }

    // start from the innermost radius
    radia.forEach((radius) => {

      // segments * lod
      vertex.x 

    })

    let tubularSegment: number
    let radialSegment: number
    for (tubularSegment = 0; tubularSegment <= tubularSegments; tubularSegment++) {
      for (radialSegment = 0; radialSegment <= radialSegments; radialSegment++) {
        const tubularRad = tubularSegment / tubularSegments * arc // nach PEMDAS ist das gleichwertig, also wird erst dividiert, dann multipliziert
        const radialRad = radialSegment / radialSegments * Math.PI * 2 // radial is always a full circle

        // vertex

        vertex.x = (radius + tube * Math.cos(radialRad)) * Math.cos(tubularRad)
        vertex.y = (radius + tube * Math.cos(radialRad)) * Math.sin(tubularRad)
        vertex.z = tube * Math.sin(radialRad) // bei z fehlt der radius des torus weil das halt nur bissel nach vorn oder hinten geht

        this.vertices.push(vertex.x, vertex.y, vertex.z)

        // normal

        centerForRadial.x = radius * Math.cos(tubularRad)
        centerForRadial.y = radius * Math.sin(tubularRad)
        normal.subVectors(vertex, centerForRadial).normalize() // from center of Tube to vertex

        this.normals.push(normal.x, normal.y, normal.z)

        // uv

        this.uvs.push(tubularSegment / tubularSegments) // from 0 to 1
        this.uvs.push(radialSegment / radialSegments)
      }
    }

    // generate indices

    for (tubularSegment = 1; tubularSegment <= tubularSegments; tubularSegment++) {
      for (radialSegment = 1; radialSegment <= radialSegments; radialSegment++) {
        // indices

        // es ist radialsegmente plus 1, damit wir immer beim nächsten radialkreis/tubularabschnitt landen.
        // haben wir 24 segmente, so wird immer mal 25 gerechnet
        const a = (radialSegments + 1) * (tubularSegment - 1) + radialSegment - 1
        const b = (radialSegments + 1) * tubularSegment + radialSegment - 1
        const c = (radialSegments + 1) * (tubularSegment - 1) + radialSegment
        const d = (radialSegments + 1) * tubularSegment + radialSegment

        // A C
        // B D

        // faces
        if (facing === 'normal') {
          this.indices.push(a, b, d) // counter clockwise to face to camera!!!
          this.indices.push(a, d, c)
        }
        if (facing === 'inverse') {
          this.indices.push(a, c, d) // counter clockwise to face to camera!!!
          this.indices.push(a, d, b)
        }
        this.tubularSegmentIndices.push(tubularSegment, tubularSegment, tubularSegment)
        this.tubularSegmentIndices.push(tubularSegment, tubularSegment, tubularSegment)
      }
    }

    // generate verticesIndex
    for (let i = 0; i < this.vertices.length / 3; i++) {
      this.verticesIndex[i] = i
    }

    // build geometry

    this.setIndex(this.indices)

    const positionAttribute: Float32BufferAttribute = new Float32BufferAttribute(this.vertices, 3)
    positionAttribute.setUsage(DynamicDrawUsage)

    this.setAttribute('position', positionAttribute)
    this.setAttribute('normal', new Float32BufferAttribute(this.normals, 3))
    this.setAttribute('uv', new Float32BufferAttribute(this.uvs, 2))
    this.setAttribute('vertexIndex', new Int32BufferAttribute(this.verticesIndex, 1))
  }

  copy (source: any): any {
    super.copy(source)

    this.parameters = Object.assign({}, source.parameters)

    return this
  }

  static fromJSON (data: any): KreiseTorusGeometry {
    return new KreiseTorusGeometry(data.radius, data.tube, data.radialSegments, data.tubularSegments, data.arc)
  }
}

export { KreiseTorus, KreiseShaderedTorus, KlavierTorus, KreiseTorusGeometry }
