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

  public input: any
  public targetOutput: any
  
  // public edges: edgeRecordType = {}        // parent Node or void for Graph without neighbors (gotta start somewhere!)
  
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

      let output: any = input
      Object.entries(this.graphs).forEach(([graphName, graph]) => {
        
        output += graph.eva(null)

      })
      return output

    }


}
    
```

That's it. This design allows a graph structure similiar to the human brain (circular reference) and motor or sensoric neurons (no circular reference). For this reason there is no difference between "nodes" (or neurons) and graphs (or networks)

Any neural network without limitations has no reason to save on energy and has no way to alter its connections between neurons other than weighing them differently which i thought is really odd and a key improvement to classic AI networks that have fixed numbers of neurons and structure - your brain alters its connections all the time and neurons die of or get created all throughout your life. 

Instead here any graph in Krei.se can connect to any other graph without crashing the system and hold an arbitrary amount of defined TS classes which allow for computation like in any category theory category. This seems inefficient at first glance, but remember any function can be a lot more complex than something like 20 relu-functions chained. To add sugar to this - the starting neuron with the input defined and the neuron holding the targetOutput are the same neuron!

You can use this design to randomly add genetically evolved solutions to match the desired return value of the whole graph by applying different eva() methods in each neuron.

To make further use of this fractal-like design you can also use the KreiseZeit-class that allows for different time flows within, f.e. make the day run clockwise, but hours run counterclockwise. The time-counter derived from that allow for a new class of music that has parts both running back and forward.

Enjoy!
