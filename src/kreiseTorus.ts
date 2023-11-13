import {
  Mesh,
  BufferGeometry,
  Color,
  Material,
  MeshPhongMaterial,
  Vector3,
  Float32BufferAttribute,
  // TextureLoader,
  DynamicDrawUsage,
  MeshBasicMaterial,
  ShaderMaterial,
  Int32BufferAttribute
} from 'three'

import type {
  BufferAttribute,
  InterleavedBufferAttribute
} from 'three'

// import turboTextureImage from './textures/turbo.png'

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
  materials: any = []
  mesh: Mesh

  constructor (parameters: any) {
    this.identity = parameters.identity
    this.radius = parameters.radius
    this.tube = parameters.tube
    this.tubularSegments = parameters.tubularSegments ?? Math.floor(this.radius * 48)
    this.radialSegments = parameters.radialSegments ?? Math.floor(this.tube * 96)
    this.facing = parameters.facing ?? 'normal'
    this.arc = parameters.arc ?? Math.PI * 2
    this.mesh = parameters.mesh ?? new Mesh()

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
    this.materials.push(new Material())
    this.materials[0] = new MeshBasicMaterial({ color: this.color })
    this.materials[0].receiveShadow = true

    this.updateMesh()
  }

  updateMesh (): void {
    this.mesh = new Mesh(this.geometry, this.materials)
  }

  getMesh (): Mesh {
    return this.mesh
  }

  updatePositions (positions: Float32BufferAttribute): void {
    positions.needsUpdate = true
    this.geometry.setAttribute('positions', positions)
  }

  pulseTubularLine (tubularLine: number, height: number): void {
    const positionAttribute: BufferAttribute | InterleavedBufferAttribute = this.geometry.getAttribute('position')
    const normalAttribute: BufferAttribute | InterleavedBufferAttribute = this.geometry.getAttribute('normal')

    // console.log(positionAttribute)

    const offset: number = tubularLine * (this.radialSegments + 1)

    let radialSegment: number = 0
    for (radialSegment = 0; radialSegment <= this.radialSegments; radialSegment++) {
      const normal: Vector3 = new Vector3().fromBufferAttribute(normalAttribute, offset + radialSegment)
      const point: Vector3 = new Vector3().fromBufferAttribute(positionAttribute, offset + radialSegment)

      const newPoint: Vector3 = point.add(normal.multiplyScalar(height))

      positionAttribute.setXYZ(offset + radialSegment, newPoint.x, newPoint.y, newPoint.z)
    }
    positionAttribute.needsUpdate = true
  }
}

class KlavierTorus extends KreiseTorus {
  constructor (parameters: any = {}) {
    super({
      identity: 'KlavierTorus',
      radius: 14,
      tube: 0.7,
      tubularSegments: 88,
      radialSegments: 32,
      color: new Color(0xffffff),
      ...parameters
    })

    this.materials.push(new MeshPhongMaterial({ color: 0x000000 }))

    const blackWhite: any = [0, 1, 0,
      0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0,
      0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0,
      0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0,
      0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, // <- startet mit C1
      0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0,
      0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0,
      0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0,
      0]

    // console.log(blackWhite.length)

    let i: number = 0
    for (i = 0; i < this.geometry.groups.length; i++) {
      this.geometry.groups[i].materialIndex = blackWhite[i]
    }

    // old and disabled: raise every octave
    for (i = 0; i <= this.tubularSegments; i++) {
      // if ((i - 3) % 12 === 0) this.pulseTubularLine(i, 0.1)
    }

    this.updateMesh()
  }
}

class KreiseShaderedTorus extends KreiseTorus {
  constructor (parameters: any = []) {
    super({
      ...parameters
    })

    this.materials[0] = new ShaderMaterial({

      uniforms: {
        center: { value: this.mesh.position },
        radius: { value: this.radius },
        tube: { value: this.tube },
        tubularSegments: { value: this.tubularSegments },
        radialSegments: { value: this.radialSegments }
      },

      /*

      Uniforms are variables that have the same value for all vertices - lighting, fog, and shadow maps
      are examples of data that would be stored in uniforms. Uniforms can be accessed by both the vertex
      shader and the fragment shader.

      // = object.matrixWorld
      uniform mat4 modelMatrix;

      // = camera.matrixWorldInverse * object.matrixWorld
      uniform mat4 modelViewMatrix;

      // = camera.projectionMatrix
      uniform mat4 projectionMatrix;

      // = camera.matrixWorldInverse
      uniform mat4 viewMatrix;

      // = inverse transpose of modelViewMatrix
      uniform mat3 normalMatrix;

      // = camera position in world space
      uniform vec3 cameraPosition;

      Attributes are variables associated with each vertex---for instance, the vertex position,
      face normal, and vertex color are all examples of data that would be stored in attributes.
      Attributes can only be accessed within the vertex shader.

      // default vertex attributes provided by BufferGeometry
      attribute vec3 position;
      attribute vec3 normal;
      attribute vec2 uv;

      */
      vertexShader: `

        attribute float vertexIndex;

        // float tubularSegment = 

        varying vec3 v_Normal;

        void main() {
          vec3 scale = vec3(4.0, 1.0, 1.0);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          v_Normal = normal;
        }
      `,

      /*

      uniform mat4 viewMatrix;
      uniform vec3 cameraPosition;

      */

      fragmentShader: /* glsl */
      `

        varying vec3 v_Normal;

        void main() {
          gl_FragColor = vec4(v_Normal, 1.0);
        }
      
      `

    })
  }
}

class KreiseTorusGeometry extends BufferGeometry {
  type: string
  parameters: any
  tubularSegmentIndices: any
  indices: any
  vertices: any
  normals: any
  uvs: any
  verticesIndex: any

  constructor (radius = 1, tube = 0.4, radialSegments = 12, tubularSegments = 48, facing = 'normal', arc = Math.PI * 2) {
    super()

    this.type = 'KreiseTorusGeometry'

    // buffers
    this.tubularSegmentIndices = []

    this.indices = []
    this.vertices = []
    this.normals = []
    this.uvs = []
    this.verticesIndex = []

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
