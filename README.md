# Krei.se

This is the base krei.se n' Gin written in TS with (mainly) use of threejs

## Graph structure

The base idea is the structure of a directed cyclic graph that runs with a repeat-counter to allow infinite or finite loops through subgraphs that point back to higher levels of the graph.

´´´

- main class KreiseGraph
    + definetelyTypedObjects = {}
    + graphs = {}
    + parents = {}

    + repeat = 1000
    + visited = 0

    + public targetOutput // used for training
    + public input // only used in the starting neuron

    constructor() --> Proxy { 
        if target === graphs) {
          target.visited++; 
          if target.visited > target.repeat return; // close loop after n repeat cycles
        }
        return target.property  // else return target property / graph
      }

    // hmmm.. apples ...    
    + eva() {
      
      // computational method here, use this.input at starting neuron

    }

    + output(

      let output: any = null
      // sum all compututationalMethods of parent graphs
      parents.foreach(parent => {
        output += parent.eva()
      })
      return output

    )

    + fitness(

      this.output() - this.targetoutput

    )

´´´

That's basically it. This design allows a graph structure similiar to the human brain (circular refernece) and motor neurons (no circular reference). For this reason there is no difference between "nodes" (or neurons) and graphs (or networks)

Any neural network without limitations has no reason to save on energy and has no way to alter its connections between neurons other than weighing them differently. Any graph in Krei.se can connect to any other graph without crashing the system and hold an arbitrary amount of defined TS classes which allow for computation like in any category theory category. This seems inefficient at first glance, but remember any function can be a lot more complex than something like 20 relu-functions chained.

You can use this design to randomly add genetically evolved solutions to match the desired return value of the whole graph.

To make further use of this fractal-like design you can also use the KreiseZeit-class that allows for different time flows within, f.e. make the day run clockwise, but hours run counterclockwise. The time-counter derived from that allow for a new class of music that has parts both running back and forward.

Enjoy!
