import { 
  AmbientLight, 
  AxesHelper, 
  Box3, 
  Box3Helper, 
  CameraHelper, 
  DirectionalLight, 
  DirectionalLightHelper, 
  Fog, 
  GridHelper, 
  Group, 
  HemisphereLight, 
  InstancedMesh, 
  Mesh, 
  Object3D, 
  PointLight, 
  PointLightHelper
} from 'three'
import { KlavierTorus, KreiseShaderedTorus, KreiseTorus } from './KreiseTorus'


export type MeshesType = Mesh | InstancedMesh | Group
export type MeshesRecordType = Record<string, MeshesType>

export type GroupRecordType = Record<string, Group>

export type LightsType = AmbientLight | PointLight | DirectionalLight | HemisphereLight
export type LightsRecordType = Record<string, LightsType>

export type HelpersType = AxesHelper | GridHelper | CameraHelper | MeshesType | DirectionalLightHelper | PointLightHelper | Box3Helper
export type HelpersRecordType = Record<string, HelpersType>

export type CollisionHelpersType = Box3
export type CollisionHelpersRecordType = Record<string, CollisionHelpersType>

export type KreiseMeshesType = KreiseTorus | KreiseShaderedTorus | KlavierTorus
export type KreiseMeshesRecordType = Record<string, KreiseMeshesType>

export type ObjectType = Array<any> | string | GraphsType | LightsType | MeshesType | LightsType | HelpersType | CollisionHelpersType | KreiseMeshesType | Object3D | Fog
export type ObjectsRecordType = Record<string, ObjectType>



export type GraphsType = KreiseGraph
export type GraphsRecordType = Record<string, GraphsType>

export interface GraphsInterface {
  [key: string]: GraphsType
  [key: symbol]: GraphsType
}

export interface ObjectsInterface {
  [key: string]: ObjectType
  [key: symbol]: ObjectType
}

export interface MethodsInterface {
  [key: string]: Function
  [key: symbol]: Function
}


/*
export type edgeType = KreiseGraph | void
export interface WeightedEdge { weight: number; edge: edgeType }
export type edgeRecordType = Record<string, edgeType | WeightedEdge>
*/

export default class KreiseGraph {

  // add any typed objects you would like to use,
  // i use threejs objects to sculpture a "body"-tree from a graph
  // and allow for sensoric inputs (add a map as an object anywhere in the graph
  // and sensors on any branch of the nerves)
  public lights: LightsRecordType = {}
  public meshes: MeshesRecordType = {}
  public groups: GroupRecordType = {}
  public kreiseMeshes: KreiseMeshesRecordType = {}
  public helpers: HelpersRecordType = {}

  public objects: ObjectsInterface = {}
  public methods: MethodsInterface = {}
  // please limit connected graphs to 5 - 9 (best value 8) to keep any layer
  // human explainable (Millersche Zahl)
  public graphs: GraphsInterface = {}

  // 15 digits are enough for interplanetary travel
  public repeat: number = 15                      // how often do  we visit this node in a circular reference?
  public visited: number = 0                      // how often did we visit this node in a circular reference?

  // mostly unused, useful for eva(input) and moving the goalpost in the base (start and ending) graph
  public input: any
  public targetOutput: any

  [key: string]: any
  [key: symbol]: any
  
  constructor() {

      return new Proxy(this, {
        get(target: KreiseGraph, property) { // (, receiver)
          if (property in target) {
            // catch tired nodes
            if (property === 'graphs') {
              target.visited++
              if (target.visited > target.repeat) return
            }
            
            return target[property]
          }
          else if (property in target.objects) {
            return target.objects[property]
          }
          else if (property in target.methods) {
            return target.methods[property]
          }
          return undefined
        },
        set(target: KreiseGraph, property, value) { // (, receiver)
          if (property in target) {
            console.log(typeof property)
            target[property] = value
          }
          else {
            // add properties into objects
            if (typeof value === 'function')
              target.methods[property] = value
            // add functions into methods
            else
              target.objects[property] = value
          }
          return true
        },
        getPrototypeOf(target: KreiseGraph) {
          return Object.getPrototypeOf(target)
        },
        has(target: KreiseGraph, property) {
          return property in target || property in target.objects
        }
      })

    }

    eva(input: any): any {

      /*

      // example method to sum graph outputs
      let output: any = input
      Object.entries(this.graphs).forEach(([graphName, graph]) => {
        
        output += graph.eva(null)

      })
      return output

      // example to add up to 100 new neurons
      for (i = this.graphs.count(); i <= Math.random() * 100 + this.graphs.count(); i++) {

        this.graphs[i] = new KreiseGraph
        this.graphs[i].eva = this.eva() // copy eva method

      }

      */

      return input

    }


}