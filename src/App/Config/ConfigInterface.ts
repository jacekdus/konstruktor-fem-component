import { Node, Material, Section } from '../Model';
import { Mode } from './modeEnum'

export interface ConfigInterface {
  elements: null | {
    scene: HTMLElement;
    calcBtn: HTMLElement;
    sceneVisibility: HTMLElement;
    modes: HTMLElement,      
    two: {
      nodes: undefined | HTMLElement
    }
    toolbox: {
      element: HTMLElement,
      support: HTMLElement,
      load: HTMLElement,
      fx: HTMLInputElement,
      fy: HTMLInputElement,
      xFixed: HTMLInputElement,
      yFixed: HTMLInputElement
    },
    jsoneditor: {
      container: HTMLElement,
      updateBtn: HTMLElement
    },
    resultsTable: HTMLElement
  },
  two: { 
    width: number,
    height: number,
    autostart: boolean,
    fitted: boolean,
  },
  scaleFactor: {
    model: number,
    support: number,
    load: number,
    node: number,
    nodeTextOffset: number,
    csIcon: { icon: number, textOffset: number },
    cursor: number,
    displacements: number
  },
  color: {
    node: string,
    element: string,
    load: string,
    displacement: string,
    support: string,
    reaction: string
  },
  translationValue: number,
  screenScalingFactor: number,
  mode: {
    name: Mode,
    toolbox: HTMLElement | undefined,
    state: {
      createElement: {
        selectedNodeId: number | undefined,
        secondNode: number | undefined,
        currentSection: Section,
        currentMaterial: Material
      }
    }
  },
  selected?: Node | Element
  isVisible: {
    nodes: boolean,
    elements: boolean,
    supports: boolean,
    loads: boolean
    labels: {
      all: boolean,
      // nodes: boolean,
      // elements: boolean,
      // supports: boolean,
      // loads: boolean
    },
    results: {
      displacements: boolean,
      innerForces: boolean,
      reactions: boolean
    }
  },
  cursor: {
    snap: {
      active: boolean,
      spacing: number,
    },
    position: { 
      x: number, 
      y: number,
    },
    message: string;
  },
  results: {
    axialForce: {
      max: number | undefined,
      min: number | undefined
    }
  }
}
