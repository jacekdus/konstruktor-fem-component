import { Node, Material, Section } from '../Model';
import { Mode } from './modeEnum'

export interface ConfigInterface {
  elements: {
    plusBtn: HTMLElement;
    minusBtn: HTMLElement;
    container: HTMLElement;
    calcBtn: HTMLElement;
    nodesCheckbox: HTMLInputElement,
    elementsCheckbox: HTMLInputElement,
    supportsCheckbox: HTMLInputElement,
    allCheckbox: HTMLInputElement,
    modes: NodeListOf<HTMLInputElement>,      
    two: {
      nodes: undefined | HTMLElement
    }
    forceInput: {
      fx: HTMLInputElement,
      fy: HTMLInputElement
    },
    support: {
      xFixed: HTMLInputElement,
      yFixed: HTMLInputElement
    },
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
  },
  color: {
    node: string,
    element: string,
    load: string,
    displacement: string,
    support: string,
  },
  translationValue: number,
  screenScalingFactor: number,
  mode: Mode,
  modeState: {
    createElement: {
      selectedNode: Node | undefined,
      secondNode: Node | undefined,
      currentSection: Section,
      currentMaterial: Material
    }
  },
  selected?: Node | Element
  isVisible: {
    nodes: boolean,
    elements: boolean,
    supports: boolean,
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
    two: any,
  }
}
