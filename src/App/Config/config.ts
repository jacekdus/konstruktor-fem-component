import { string } from "mathjs";
import { Material, Section } from "../Model";
import { ConfigInterface } from "./ConfigInterface";
import { Mode } from './modeEnum'

export const config = ((): ConfigInterface => {
  return {
    elements: null,
    two: { 
      width: undefined, 
      height: 600,
      autostart: false,
      fitted: false,
    },
    scaleFactor: {
      model: 25,
      support: 20,
      load: 40,
      node: 7.5,
      nodeTextOffset: 10,
      csIcon: { icon: 40, textOffset: 10 },
      cursor: 20,
      displacements: 1
    },
    color: {
      node: '',
      element: 'blue',
      load: 'brown',
      displacement: 'red',
      support: 'green',
      reaction: 'green'
    },
    translationValue: 150,
    screenScalingFactor: 0.9,
    mode: {
      name: Mode.Node,
      toolbox: undefined,
      state: {
        createElement: {
          selectedNodeId: undefined,
          secondNode: undefined,
          currentSection: new Section('HEA 100', 0.00212),
          currentMaterial: new Material('Steel', 210000000000.0, 235000000.0)
        }
      }
    },
    selected: undefined,
    isVisible: {
      nodes: true,
      elements: true,
      supports: true,
      loads: true,
      labels: {
        all: true,
        // nodes: true,
        // elements: true,
        // supports: true,
        // loads: true
      },
      results: {
        displacements: false,
        innerForces: false,
        reactions: false
      }
    },
    cursor: {
      snap: {
        active: true,
        spacing: 1,
      },
      position: { 
        x: 0, 
        y: 0 
      },
      message: '0.00, 0.00'
    },
    results: {
      axialForce: {
        max: undefined,
        min: undefined
      }
    }
  };
})();
