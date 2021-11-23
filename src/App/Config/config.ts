import { Material, Section } from "../Model";
import { ConfigInterface } from "./ConfigInterface";
import { Mode } from './modeEnum'

export const config = ((): ConfigInterface => {
  return {
    elements: {
      plusBtn: document.getElementById('plus-btn'),
      minusBtn: document.getElementById('minus-btn'),
      container: document.getElementById('container'),
      calcBtn: document.getElementById('calc-btn'),
      nodesCheckbox: document.getElementById('nodes') as HTMLInputElement,
      elementsCheckbox: document.getElementById('elements') as HTMLInputElement,
      supportsCheckbox: document.getElementById('supports') as HTMLInputElement,
      allCheckbox: document.getElementById('all') as HTMLInputElement,
      modes: document.querySelectorAll('input[name="activeMode"]') as NodeListOf<HTMLInputElement>,
      two: {
        nodes: undefined
      },
      forceInput: {
        fx: document.getElementById('fx-input') as HTMLInputElement,
        fy: document.getElementById('fy-input') as HTMLInputElement
      },
      support: {
        xFixed: document.getElementById('support-xFixed-cb') as HTMLInputElement,
        yFixed: document.getElementById('support-yFixed-cb') as HTMLInputElement
      },
    },
    two: { 
      width: undefined, 
      height: 600,
      autostart: true,
      fitted: false,
    },
    scaleFactor: {
      model: 25,
      support: 20,
      load: 40,
      node: 7.5,
      nodeTextOffset: 10,
      csIcon: { icon: 40, textOffset: 10 },
      cursor: 20
    },
    color: {
      node: '',
      element: 'blue',
      load: 'purple',
      displacement: 'gray',
      support: 'green'
    },
    translationValue: 75,
    screenScalingFactor: 0.9,
    mode: Mode.Node,
    modeState: {
      createElement: {
        selectedNode: undefined,
        secondNode: undefined,
        currentSection: new Section('HEA 100', 0.00212),
        currentMaterial: new Material('Steel', 210000000000.0)
      }
    },
    selected: undefined,
    isVisible: {
      nodes: true,
      elements: true,
      supports: true
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
      two: undefined
    }
  };
})();
