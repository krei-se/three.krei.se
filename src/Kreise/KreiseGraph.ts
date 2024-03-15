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

export type GraphsType = KreiseGraph
export type GraphsRecordType = Record<string, GraphsType>

export type MeshesType = Mesh | InstancedMesh | Group
export type MeshesRecordType = Record<string, MeshesType>

export type LightsType = AmbientLight | PointLight | DirectionalLight | HemisphereLight
export type LightsRecordType = Record<string, LightsType>

export type HelpersType = AxesHelper | GridHelper | CameraHelper | MeshesType | DirectionalLightHelper | PointLightHelper | Box3Helper
export type HelpersRecordType = Record<string, HelpersType>

export type CollisionHelpersType = Box3
export type CollisionHelpersRecordType = Record<string, CollisionHelpersType>

export type KreiseMeshesType = KreiseTorus | KreiseShaderedTorus | KlavierTorus
export type KreiseMeshesRecordType = Record<string, KreiseMeshesType>


//  Basic three type
export type ObjectType = Array<any> | string | GraphsType | LightsType | MeshesType | LightsType | HelpersType | CollisionHelpersType | KreiseMeshesType | Object3D | Fog
export type ObjectsRecordType = Record<string, ObjectType>

export interface ObjectsInterface {
  [key: string]: ObjectType
  [key: symbol]: ObjectType
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
  public kreiseMeshes: KreiseMeshesRecordType = {}
  public helpers: HelpersRecordType = {}
  public objects: ObjectsInterface = {}
  public graphs: GraphsRecordType = {}
  public repeat: number = 1000                    // how often do  we visit this node in a circular reference?
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
          return undefined
        },
        set(target: KreiseGraph, property, value) { // (, receiver)
          if (property in target) {
            target[property] = value
          }
          else {
            // add everything else into _objects
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