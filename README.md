# Krei.se

This is the base krei.se n' Gin written in TS with (mainly) use of threejs

## Graph structure

The base idea is the structure of a directed cyclic graph that runs with a repeat-counter to "tire" a graph any time it accesses a connected graph.
This solution allows infinite (brain and CNS neuron) or finite (motor and sensoric neurons) loops through subgraphs that point back to already visited graphs.

Why would i need that? Well if you have a neuron or function that outputs different on changed conditions (as your brain does) you may visit a neuron more often than once.
Usually a loop-detection is in place to make sure you derive a tree from a cyclic graph without recursion - but we want a network like the brain that has different outputs each time
it's accessed.

Neural networks that get trained always act the same when accessed and have a fixed structure and weights. KreiseGraph allows for a dynamic addition of neurons anywhere (the Graph can
program and change itself) and is forced to find new solutions without blindly increasing its size.

Any tree-structured property (body maps f.e. or whatever directory you add) can be queried infinite times without raising the counter, so you don't have to worry to tire a
graph by accident just because you query a property multiple times. ONLY accessing connected graphs raise the counter.

To stay human readable you should consider limiting the number of connected graphs to 7 +- 2 (Millersche Zahl) and train the network with this limitation. This way any decision the graph makes can be explained to a human in a ~7 word sentence.

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