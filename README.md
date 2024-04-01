# Krei.se

This is the base krei.se n' Gin written in TS with (mainly) use of threejs

## KreiseChoord / Konventionen

Doing 3D graphics while studying medicine / neuroscience / anatomy will make your head spin if you don't use some coordinate system that actually represents your body and brain. Left hand / right hand coordinate systems are all over the place in 3D engines / hardware and i simply export to those formats while preserving my sanity.

Take a look at the brain structure of a german language speaker vs. arabic:

![Language Brain Networks](https://krei.se/img/gitReadme/Grafik_Muttersprachen_Hirn_MPI_dt.webp)

The normal coordinate system used in schools will have you use the right hemisphere for spatial processing / to construct shapes in the plus range of X and Y.

![Wrong directed Coordinates](https://krei.se/img/gitReadme/WrongDirected.png)

Krei.se uses a different representation internally that takes into account your (german / anglistic) brain structure and enforces use of both hemispheres for ambidextruity and better inner-ear balance:

![X directed Coordinates](https://krei.se/img/gitReadme/XDirected.png)

X is in front of the viewer, -X behind. This is especially useful to have functions that map X on time be "in front" of you. If you think hard about it, you already think of time in a way that has before on the left and future on the right - but this is not really useful. The past is "behind" you and the future is "ahead".

Y is up, -Y is down. (this is actually the only axis every convention agrees on)

Z is plus on the left side and minus on the right side. (this is due to most people being right-handed which will be fixed by this)

![Klimadiagramm Chemnitz](https://krei.se/img/gitReadme/Klimadiagramm.png)

Any time you come across a shape that maps time from left to right you should rotate the information 90 degrees to back and front.

This way any X and Y graph you visualize internally will use both hemispheres and stop you from going skewed, insane and f*ck up your eyes until you need glasses.

As a plus you have 8 different 3D quadrants to construct shapes in your head while with a normal orientation there is only 1 spatial construction possible (usually you construct a bit over and right of your right eye).

(WIP)

## KreiseGraph structure

Necessity is the mother of invention.

The base idea is the structure of a directed cyclic graph that runs with a repeat-counter to "tire" a graph any time it accesses a connected graph. I got the number 15 repeats from the doublefloat pi precision and 5-8 layers to account for the amount of entities a human can keep in his short term working memory (and both are great for time modulus :D).

This solution allows infinite (brain and CNS neuron) or finite (motor and sensoric neurons) loops through subgraphs that point back to already visited graphs.

Why would i need that? Well if you have a neuron or function that outputs different on changed conditions (as your brain does f.e. when you remember something it's actually a modified memory) you may visit a neuron more often than once. Usually a loop-detection is in place to make sure you derive a tree from a cyclic graph without recursion - but we want a network like the brain that has different outputs each time it's accessed, even though your method may not even use random input or other changing conditions.

Neural networks also loop (attention), but loop through the whole graph until output considers the answer fine. They get trained to always act the same when accessed and have a fixed structure and weights. KreiseGraph allows for a dynamic addition of neurons anywhere (the Graph can program and change itself just like you can) and is forced to find new solutions without blindly increasing its size (just by being constrained to a kinda slow programming language and running in your browser.)

Any tree-structured property (body maps f.e. or whatever directory you add) can be queried infinite times without raising the counter, so you don't have to worry to tire a graph by accident just because you query a property multiple times. ONLY accessing connected graphs raise the counter.

eva()-method is a placeholder and you can add any function() in .methods. I'm still building virtual bodies with sensors to train the network on capsulated methods embedding category theory categories. Define any methods you like!

```

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
    
```

This is a work in progress.