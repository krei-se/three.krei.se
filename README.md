# Krei.se

This is the base krei.se n' Gin written in TS with (mainly) use of threejs

## Graph structure

The base idea is the structure of a directed cyclic graph that runs with a repeat-counter to allow infinite or finite loops through subgraphs that point back to higher levels of the graph.

```

export default class KreiseGraph {
  // add any typed objects you would like to use,
  // i use threejs objects to sculpture a "body" from a graph
  // and allow for sensoric inputs (just add a map as an object anywhere in the graph)
  public lights: LightsRecordType = {}
  public meshes: MeshesRecordType = {}
  public helpers: HelpersRecordType = {}
  public objects: ObjectsInterface = {}
  public graphs: GraphsRecordType = {}
  public repeat: number = 1000                    // how often do  we visit this node in a cyclical reference?
  public visited: number = 0                      // how often did we visit this node in a cyclical reference?

  // mostly unused, useful for eva(input) and moving the goalpost in the base (start and ending) graph
  public input: any
  public targetOutput: any
  
  constructor() {

      return new Proxy(this, {
        get(target, property, receiver) {
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
        set(target, property, value, receiver) {
          if (property in target) {
            target[property] = value
          }
          else {
            // add everything else into _objects
            target.objects[property] = value
          }
          return true
        },
        getPrototypeOf(target) {
          return Object.getPrototypeOf(target)
        },
        has(target, property) {
          return property in target || property in target.objects
        }
      })

    }

    eva(input: any): any {

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

    }


}
    
```

This is a work in progress.