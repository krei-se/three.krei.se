# Krei.se

This is the base krei.se n' Gin written in TS with (mainly) use of threejs

## Graph structure

The base idea is the structure of a directed cyclic graph that runs with a repeat-counter to allow infinite (brain and CNS neuron) or finite (motor and sensoric neurons) loops through subgraphs that point back to higher levels of the graph.

This solution took me 8 years to come up with. The neurons get tired after n repeat access to connected neurons. This way you can solve the recursive graph problem without relying on external supervision, thus not crashing the system with recursion while still holding all advantages of fractal design.

Any tree-structured property can be queried infinite times without raising the counter - ONLY accessing connected graphs raise the counter.

To stay human readable you should consider limiting the number of connected graphs to 7 +- 2 (Millersche Zahl) and train the network with this limitation. This way any decision the graph makes can be explained to a human.

eva()-method is a placeholder, im still building virtual bodies with sensors to train the network on capsulated methods embedding category theory categories.

```


export default class KreiseGraph {

  // add any typed objects you would like to use,
  // i use threejs objects to sculpture a "body"-tree from a graph
  // and allow for sensoric inputs (add a map as an object anywhere in the graph
  // and sensors on any branch of the nerves)
  public lights: LightsRecordType = {}
  public meshes: MeshesRecordType = {}
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
    
```

This is a work in progress.