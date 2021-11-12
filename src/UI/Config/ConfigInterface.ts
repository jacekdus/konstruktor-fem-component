export interface ConfigInterface {
  elements: {
    plusBtn: HTMLElement;
    minusBtn: HTMLElement;
    container: HTMLElement;
    test: HTMLElement;
    nodesCheckbox: HTMLInputElement,
    elementsCheckbox: HTMLInputElement,
    supportsCheckbox: HTMLInputElement,
    allCheckbox: HTMLInputElement,
    modes: NodeListOf<HTMLInputElement>
  }
  two: { 
    width: number, 
    height: number 
  },
  scaleFactor: {
    model: number;
    support: number,
    load: number,
    node: number,
    nodeTextOffset: number,
    csIcon: { icon: number, textOffset: number },
    cursor: number
  };
  color: {
    node: string;
    element: string;
    load: string;
    displacement: string;
    support: string;
  };
  translationValue: number;
  screenScalingFactor: number;
  mode: 'node' | 'element' | 'support' | 'load';
  isVisible: {
    nodes: boolean;
    elements: boolean;
    supports: boolean;
  }
  cursor: {
    snap: {
      active: boolean,
      spacing: number,
    },
    position: { 
      x: number, 
      y: number 
    }
    two: any
  }
}
