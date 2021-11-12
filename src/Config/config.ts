import { ConfigInterface } from "./ConfigInterface";

export const config = ((): ConfigInterface => {
  return {
    elements: {
      plusBtn: document.getElementById('plus-btn'),
      minusBtn: document.getElementById('minus-btn'),
      container: document.getElementById('container'),
      test: document.getElementById('refresh'), // for testing events
      nodesCheckbox: document.getElementById('nodes') as HTMLInputElement,
      elementsCheckbox: document.getElementById('elements') as HTMLInputElement,
      supportsCheckbox: document.getElementById('supports') as HTMLInputElement,
      allCheckbox: document.getElementById('all') as HTMLInputElement,
      modes: document.querySelectorAll('input[name="activeMode"]') as NodeListOf<HTMLInputElement>
    },
    two: { 
      width: undefined, 
      height: 350 
    },
    scaleFactor: {
      model: 30,
      support: 20,
      load: 40,
      node: 5,
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
    mode: 'node',
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
