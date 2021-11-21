import { Model, Displacement, Node, Element, Boundary, Load } from './Model';
import View from "./View";
import { config } from "./Config/config";
import { Main as Calculator } from "./Fem/Main";
import { Mode } from './Config/modeEnum'
import { isInteger } from 'mathjs';


export default class Controller {
  private maxDisplacementSizeInPx: number = 20;

  constructor(
    private model: Model = model,
    private view: View = view
  ) {}

  private getMaxAbsDisplacementValue(displacements: Map<Node, Displacement>) {
    let absMax = 0;

    displacements.forEach(d => {
      if (absMax < Math.abs(d.dx)) {
        absMax = d.dx;
      }

      if (absMax < Math.abs(d.dy)) {
        absMax = d.dy;
      }
    });

    return Math.abs(absMax);
  }

  private addEventListeners() {
    const {plusBtn, minusBtn, nodesCheckbox, 
      elementsCheckbox, supportsCheckbox, modes, 
      allCheckbox, container, two, calcBtn} = config.elements;

    plusBtn.addEventListener('click', this.handleZoomIn.bind(this));
    minusBtn.addEventListener('click', this.handleZoomOut.bind(this));
    window.addEventListener('resize', this.handleResizeSceneToContainersSize.bind(this));
    nodesCheckbox.addEventListener('click', this.handleNodesVisibility.bind(this));
    elementsCheckbox.addEventListener('click', this.handleElementsVisibility.bind(this));
    supportsCheckbox.addEventListener('click', this.handleSupportsVisibility.bind(this));
    allCheckbox.addEventListener('click', event => {
      if ((<HTMLInputElement>event.target).checked) {
        config.isVisible.nodes = true;
        config.isVisible.elements = true;
        config.isVisible.supports = true;

        nodesCheckbox.checked = true;
        elementsCheckbox.checked = true;
        supportsCheckbox.checked = true;
      } else {
        config.isVisible.nodes = false;
        config.isVisible.elements = false;
        config.isVisible.supports = false;

        nodesCheckbox.checked = false;
        elementsCheckbox.checked = false;
        supportsCheckbox.checked = false;
      }
    })
    modes.forEach(mode => {
      mode.addEventListener('click', () => {
        this.handleCurrentActiveMode(mode);
      });
    });
    container.addEventListener('mousemove', this.handleCursorMove.bind(this))
    container.addEventListener('click', this.handleMouseClickOnContainer.bind(this))
    two.nodes.addEventListener('mouseover', this.handleMouseOverNode.bind(this))
    two.nodes.addEventListener('mouseout', this.handleMouseLeaveNode.bind(this))
    calcBtn.addEventListener('click', this.handleCalculate.bind(this))
  }

  private handleCalculate() {
    this.view.getRenderer().clearResults();
    this.view.getRenderer().update()
    const calculator = new Calculator(this.model)
    calculator.calculate();
    this.model.results.displacements = calculator.getDisplacements();
    this.view.makeDisplacements(this.model.elements, this.model.results.displacements, this.getDisplacementsScaleFactor());
    this.view.makeDisplacementLabels(this.model.results.displacements, this.getDisplacementsScaleFactor());
  }

  private handleCursorMove(event: any) {
    let currentPosition: Node = this.view.getNodePositionFromCursorPosition(event.pageX, event.pageY);
      const {x, y} = config.cursor.position
      if (x !== currentPosition.x || y !== currentPosition.y) {
        this.view.getRenderer().remove(config.cursor.two);
        config.cursor.position.x = currentPosition.x;
        config.cursor.position.y = currentPosition.y;
        config.cursor.two = this.view.makeCursor(currentPosition.x, currentPosition.y);
      }
  }

  private handleMouseClickOnContainer(event: any) {

    // CREATE NODE
    if (config.mode === Mode.Node) {
      const node: Node = this.view.getNodePositionFromCursorPosition(event.pageX, event.pageY);
      const nodeId = this.model.setNode(node)
      this.view.makeNode(node, nodeId)
      this.view.makeNodeLabel(node, nodeId);
    }

    // CREATE ELEMENT
    if (config.mode === Mode.Element) {

      if (!config.modeState.createElement.selectedNode) {
        const sceneId: string = event.target.id
        const nodeId = this.view.getNodeIdBySceneId(sceneId);

        if (nodeId) {
          const node: Node = this.model.getNode(nodeId);
          config.modeState.createElement.selectedNode = node
        } else {
          const node: Node = this.view.getNodePositionFromCursorPosition(event.pageX, event.pageY);
          const nodeId: number = this.model.setNode(node)
  
          this.view.makeNode(node, nodeId)
          this.view.makeNodeLabel(node, nodeId);
  
          config.modeState.createElement.selectedNode = node
        }

      } else {
        const sceneId: string = event.target.id
        const nodeId = this.view.getNodeIdBySceneId(sceneId);

        if (nodeId) {
          const node: Node = this.model.getNode(nodeId);
          this._createElement(config.modeState.createElement.selectedNode, node)
        } else {
          const node: Node = this.view.getNodePositionFromCursorPosition(event.pageX, event.pageY);
          const nodeId: number = this.model.setNode(node)
  
          this.view.makeNode(node, nodeId)
          this.view.makeNodeLabel(node, nodeId);
  
          this._createElement(config.modeState.createElement.selectedNode, node)
        }
      }
    }

    // CREATE SUPPORT
    if (config.mode === Mode.Support) {
      const sceneId: string = event.target.id 
      const nodeId = this.view.getNodeIdBySceneId(sceneId);

      if (nodeId) {
        const node = this.model.getNode(nodeId);

        const xFixed: boolean = config.elements.support.xFixed.checked;
        const yFixed: boolean = config.elements.support.yFixed.checked;
        const boundary = new Boundary(xFixed, yFixed)

        this.model.setBoundary(node, boundary)

        this.view.makeSupport(boundary, node)
      }
    }

    // CREATE LOAD
    if (config.mode === Mode.Load) {
      const sceneId: string = event.target.id 
      const nodeId = this.view.getNodeIdBySceneId(sceneId);

      if (nodeId) {
        const node = this.model.getNode(nodeId);

        const fx: number = parseInt(config.elements.forceInput.fx.value);
        const fy: number = parseInt(config.elements.forceInput.fy.value);
        
        if (isInteger(fx) && isInteger(fy) && !(fy === 0 && fx === 0)) {
          const load = new Load(fx * 1000, fy * 1000)
          this.model.setLoad(node, load)
  
          this.view.makeLoad(load, node)
        }
      }
    }
  }

  private _createElement(node1: Node, node2: Node) {
    const element = new Element(node1, node2, config.modeState.createElement.currentSection, 
      config.modeState.createElement.currentMaterial);

    const elementId = this.model.setElement(element);
    this.view.makeElement(element);
    this.view.makeElementLabel(element, elementId)

    config.modeState.createElement.selectedNode = undefined;
    config.modeState.createElement.secondNode = undefined;
  }

  private handleMouseOverNode(event: any) {
    const twoNodeId = event.target.id
    this.view.getRenderer().enlargeNode(twoNodeId);
  }

  private handleMouseLeaveNode(event: any) {
    const twoNodeId = event.target.id
    this.view.getRenderer().restoreDefaultNodeSize(twoNodeId);
  }

  private handleResizeSceneToContainersSize() {
    config.two.width = config.elements.container.clientWidth;
    config.two.height = config.elements.container.clientHeight-4;
  
    this.view.getRenderer().setSceneSize();
  }

  private handleZoomIn() {
    config.scaleFactor.model /= config.screenScalingFactor;
    this.update()
  }

  private handleZoomOut() {
    config.scaleFactor.model *= config.screenScalingFactor;
    this.update()
  }

  private handleNodesVisibility() {
    config.isVisible.nodes = !config.isVisible.nodes;
  }

  private handleElementsVisibility() {
    config.isVisible.elements = !config.isVisible.elements;
  }

  private handleSupportsVisibility() {
    config.isVisible.supports = !config.isVisible.supports
  }

  private handleCurrentActiveMode(mode: HTMLInputElement) {
    switch (mode.value) {
      case 'node':
        config.mode = Mode.Node;
        break;
      case 'element':
        config.mode = Mode.Element;
        break;
      case 'support':
        config.mode = Mode.Support;
        break;
      case 'load':
        config.mode = Mode.Load;
        break;
    }
  }

  private getDisplacementsScaleFactor() {
    const maxAbsDisplacementValue: number = this.getMaxAbsDisplacementValue(this.model.results.displacements);
    return this.maxDisplacementSizeInPx / maxAbsDisplacementValue;
  }

  init() {
    this.makeAll();
    this.addEventListeners();
  }

  update() {
    this.view.getRenderer().clear()
    this.init()
  }

  private makeAll() {

    if (config.isVisible.elements && this.model.elements) {
      this.view.makeElements(this.model.elements);
    }

    if (config.isVisible.supports && this.model.boundaries) {
      this.view.makeSupports(this.model.boundaries);
    }

    if (config.isVisible.nodes && this.model.nodes) {
      this.view.makeNodes(this.model.nodes);
    }

    if (this.model.loads) {
      this.view.makeLoads(this.model.loads);
    }

    if (this.model.nodes) {
      this.view.makeNodesLabels(this.model.nodes);
    }

    if (this.model.elements) {
      this.view.makeElementsLabels(this.model.elements);
    }

    if (this.model.results.displacements) {
      this.view.makeDisplacements(this.model.elements, this.model.results.displacements, this.getDisplacementsScaleFactor());
      this.view.makeDisplacementLabels(this.model.results.displacements, this.getDisplacementsScaleFactor());
    }

    this.view.makeDimensions();
    this.view.makeCoordinateSystemIcon();
    // this.view.makeCurrentlySelected(typeof config.selected, config.selected);
    this.view.makeBorder();
  }
}
