import {
  Mesh,
  BufferGeometry,
  Color,
  Material,
  MeshPhongMaterial,
  MeshDepthMaterial,
  Vector3,
  Float32BufferAttribute,
  TextureLoader,
  DynamicDrawUsage
} from 'three'

import turboTextureImage from './textures/turbo.png'
import { positionGeometry } from 'three/examples/jsm/nodes/Nodes.js'

class KreiseTorus {
  identity: string
  radius: number
  tube: number
  radialSegments: number
  tubularSegments: number
  facing: string
  color: Color
  arc: number

  geometry: KreiseTorusGeometry
  material: any
  material2: any
  mesh: Mesh

  constructor (parameters: any) {
    this.identity = parameters.identity
    this.radius = parameters.radius
    this.tube = parameters.tube
    this.tubularSegments = parameters.tubularSegments ?? Math.floor(this.radius * 48)
    this.radialSegments = parameters.radialSegments ?? Math.floor(this.tube * 96)
    this.facing = parameters.facing ?? 'normal'
    this.arc = parameters.arc ?? Math.PI * 2

    // this.radialSegments = 12
    // this.tubularSegments= 100

    // this.geometry = new BufferGeometry()
    this.geometry = new KreiseTorusGeometry(this.radius, this.tube, this.radialSegments, this.tubularSegments, this.facing, this.arc)

    let i: number
    for (i = 0; i < this.tubularSegments; i++) {
      // in an indexed geometry, use index for triangles. each radial segment is 2 triangles, so 6 vertices.
      this.geometry.addGroup(i * 6 * this.radialSegments, 6 * this.radialSegments, 0)
    }

    this.color = new Color(parameters.color ?? new Color(0xffffff))
    this.material = new Material()
    this.material = new MeshPhongMaterial({ color: this.color, shininess: 150 })
    const turboTexture = new TextureLoader().load(turboTextureImage)
    this.material2 = new MeshDepthMaterial({ alphaMap: turboTexture, map: turboTexture })

    this.mesh = new Mesh()
    // this.mesh = new Mesh(this.geometry, this.material)
    this.mesh = new Mesh(this.geometry, [this.material, this.material2])
  }

  updateMesh (): void {
    this.mesh = new Mesh(this.geometry, this.material)
  }

  getMesh (): Mesh {
    return this.mesh
  }

  updatePositions (positions: Float32BufferAttribute): void {
    positions.needsUpdate = true
    this.geometry.setAttribute('positions', positions)
  }

  pulseTubularLine (tubularLine: number, height: number): void {

    let positionAttribute: Float32BufferAttribute = this.geometry.getAttribute('position')
    let normalAttribute: Float32BufferAttribute = this.geometry.getAttribute('normal')

    console.log(positionAttribute)

    const offset: number = tubularLine * (this.radialSegments + 1)

    let radialSegment: number = 0
    for (radialSegment = 0; radialSegment <= this.radialSegments; radialSegment++) {
      let normal: Vector3 = new Vector3().fromBufferAttribute(normalAttribute, offset + radialSegment)
      let point: Vector3 = new Vector3().fromBufferAttribute(positionAttribute, offset + radialSegment)

      let newPoint: Vector3 = point.add(normal.multiplyScalar(height))

      positionAttribute.setXYZ(offset + radialSegment, newPoint.x, newPoint.y, newPoint.z)
    }
    positionAttribute.needsUpdate = true
  }

}

class KreiseTorusGeometry extends BufferGeometry {
  type: string
  parameters: any
  indices: any
  vertices: any
  normals: any
  uvs: any

  constructor (radius = 1, tube = 0.4, radialSegments = 12, tubularSegments = 48, facing = 'normal', arc = Math.PI * 2) {
    super()

    this.type = 'KreiseTorusGeometry'

    // buffers
    this.indices = []
    this.vertices = []
    this.normals = []
    this.uvs = []

    this.parameters = {
      radius,
      tube,
      radialSegments,
      tubularSegments,
      arc,
      facing
    }

    radialSegments = Math.floor(radialSegments)
    tubularSegments = Math.floor(tubularSegments)

    // helper variables

    const centerForRadial = new Vector3()
    const vertex = new Vector3()
    const normal = new Vector3()

    // generate vertices, normals and uvs

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
      }
    }

    // build geometry

    this.setIndex(this.indices)

    const positionAttribute: Float32BufferAttribute = new Float32BufferAttribute(this.vertices, 3)
    positionAttribute.setUsage(DynamicDrawUsage)

    this.setAttribute('position', positionAttribute)
    this.setAttribute('normal', new Float32BufferAttribute(this.normals, 3))
    this.setAttribute('uv', new Float32BufferAttribute(this.uvs, 2))
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

export { KreiseTorus, KreiseTorusGeometry }
