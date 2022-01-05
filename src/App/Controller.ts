import { Model, Node, Element, Boundary, Load } from './Model';
import View from "./View";
import { config } from "./Config/config";
import { Main as Calculator } from "./Fem/Main";
import { Mode } from './Config/modeEnum'
import { isInteger } from 'mathjs';
import ResultsUtils from './UI/ResultsUtils';
import ResultsTableElement from './UI/ResultsTable/Main';
import { JsonModel, jsonModelToModel } from '../utils';
import JSONEditor from 'jsoneditor';
import ResultsTable from './UI/ResultsTable/Main';


export default class Controller {
  private editor: JSONEditor;

  constructor(
    private model: Model, 
    private view: View
  ) {}

  init() {
    this.setScene();
    this.view.render();
    this.addEventListeners();

    this.launchJsonEditor()
  }

  launchJsonEditor() {
    const options = {}
    this.editor = new JSONEditor(config.elements.jsoneditor.container, options)

    this.editor.set(this.getJsonModel());
  }

  getJsonModel(): JsonModel {
    return this.model.getJsonModel();
  }

  private setScene() {
    this.view.setNodes(this.model.nodes);
    this.view.setElements(this.model.elements, this.model.nodes);
    this.view.setSupports(this.model.boundaries, this.model.nodes);
    this.view.setLoads(this.model.loads, this.model.nodes);

    this.view.setDimensions()
    this.view.setCoordinateSystemIcon()
    // this.view.setBorder()
    this.view.setCursor()
  }

  private addEventListeners() {
    const {modes, sceneVisibility, scene, two, calcBtn, jsoneditor} = config.elements;

    window.addEventListener('resize', this.handleResizeSceneToContainersSize.bind(this))

    calcBtn.addEventListener('click', this.handleCalculate.bind(this))

    sceneVisibility.addEventListener('click', this.handleSceneVisibility.bind(this))
    scene.addEventListener('mousemove', this.handleCursorMove.bind(this))
    scene.addEventListener('mousewheel', this.handleMousewheel.bind(this))
    scene.addEventListener('click', this.handleMouseClickOnContainer.bind(this))
    
    modes.addEventListener('change', this.handleCurrentActiveMode.bind(this))

    two.nodes.addEventListener('mouseover', this.handleMouseOverNode.bind(this))
    two.nodes.addEventListener('mouseout', this.handleMouseLeaveNode.bind(this))

    jsoneditor.updateBtn.addEventListener('click', this.handleEditorUpdate.bind(this))
  }

  private handleEditorUpdate() {
    const newJsonModel = this.editor.get();

    const newModel: Model = jsonModelToModel(newJsonModel);

    this.view.clearResults();
    this.view.clearSceneObjects();

    this.model = newModel;

    this.setScene();
  }

  private handleMousewheel(event: any) {
    var dy = (event.wheelDeltaY || -event.deltaY) / 1000;

    if (dy > 0) {
      config.scaleFactor.model *= 1 / config.screenScalingFactor
    } else {
      config.scaleFactor.model *= config.screenScalingFactor
    }

    // Ideally objects shouldn't be rerendered but their position should be updated
    this.view.clearSceneObjects();
    this.setScene();
    this.view.render();
  }

  private handleCurrentActiveMode(event: any) {
    if (event.target.type === 'radio') {
      this.hideToolbox(this.getToolboxHTMLElement(config.mode.name));
      config.mode.name = event.target.value
      this.showToolbox(config.mode.name);
    }
  }
  
  private showToolbox(mode: Mode) {
    const toolbox = this.getToolboxHTMLElement(mode)
    if (toolbox) {
      toolbox.hidden = false
    }

    return toolbox;
  }

  private hideToolbox(toolbox: HTMLElement) {
    if (toolbox) {
      toolbox.hidden = true;
    }

    return toolbox;
  }

  private getToolboxHTMLElement(mode: Mode) {
    switch(mode) {
      case Mode.Element:
        return config.elements.toolbox.element;
      case Mode.Support:
        return config.elements.toolbox.support;
      case Mode.Load:
        return config.elements.toolbox.load;
      default:
        return undefined;
    }
  }
  
  private handleResizeSceneToContainersSize() {
    config.two.width = config.elements.scene.clientWidth;

    this.view.setInnerForcesLegendPosition();
    this.view.resizeScene();
  }

  private handleMouseOverNode(event: any) {
    const sceneNodeId = event.target.id
    this.view.highlightNode(sceneNodeId);
  }

  private handleMouseLeaveNode(event: any) {
    const sceneNodeId = event.target.id
    this.view.unHighlightNode(sceneNodeId);
  }

  private handleSceneVisibility(event: any) {
    if (event.target.type === 'checkbox') {
      if (event.target.value === 'nodes') {
        config.isVisible.nodes = !config.isVisible.nodes;
      }

      if (event.target.value === 'elements') {
        config.isVisible.elements = !config.isVisible.elements;
      }

      if (event.target.value === 'supports') {
        config.isVisible.supports = !config.isVisible.supports;
      }

      if (event.target.value === 'loads') {
        config.isVisible.loads = !config.isVisible.loads;
      }

      if (event.target.value === 'labels') {
        config.isVisible.labels.all  = !config.isVisible.labels.all;
      }

      if (event.target.value === 'displacements') {
        config.isVisible.results.displacements  = !config.isVisible.results.displacements;
      }

      if (event.target.value === 'forces') {
        config.isVisible.results.innerForces  = !config.isVisible.results.innerForces;
      }

      if (event.target.value === 'reactions') {
        config.isVisible.results.reactions  = !config.isVisible.results.reactions;
      }

      this.view.render();
    }
  }

  private handleCalculate() {
    const calculator = new Calculator(this.model)
    calculator.calculate();
    this.model.results = calculator.getResults();
    ResultsUtils.setDisplacementsScaleFactor(this.model.results.displacements, config);

    // Set results in the view
    this.view.clearResults();
    this.view.setDisplacements(this.model.elements, this.model.results.displacements, this.model.nodes);
    this.view.setInnerForces(this.model.elements, this.model.results.innerForces, this.model.nodes);
    this.view.setInnerForceLegend();
    this.view.setReactions(this.model.results.reactions, this.model.nodes);

    // Enable results checkboxes
    const displacements: HTMLInputElement = config.elements.sceneVisibility.querySelector('input[value=displacements]');
    const innerForces: HTMLInputElement = config.elements.sceneVisibility.querySelector('input[value=forces]');
    const reactions: HTMLInputElement = config.elements.sceneVisibility.querySelector('input[value=reactions]');
    [displacements, innerForces, reactions].forEach(el => el.disabled = false);
    
    // Results table
    const resultsTable = ResultsTable.createResultsTableAsInnerText(this.model);
    config.elements.resultsTable.innerHTML = resultsTable;

    // Update editor
    this.editor.set(this.model.getJsonModel());
  }

  private handleCursorMove(event: any) {
    const currentPosition: Node = this.view.getNodePositionFromCursorPosition(event.pageX, event.pageY);
    const {x, y} = config.cursor.position

    if (x !== currentPosition.x || y !== currentPosition.y) {
      config.cursor.position.x = currentPosition.x;
      config.cursor.position.y = currentPosition.y;
      config.cursor.message = `${currentPosition.x.toFixed(1)}, ${currentPosition.y.toFixed(1)}`;

      this.view.moveCursor(currentPosition.x, currentPosition.y);
      this.view.updateCursorPositionLabel();
    }
  }

  private handleMouseClickOnContainer(event: any) {

    // CREATE NODE
    if (config.mode.name === Mode.Node) {
      const node: Node = this.view.getNodePositionFromCursorPosition(event.pageX, event.pageY);
      const nodeId = this.model.setNode(node)
      this.view.setNode(node, nodeId)
    }

    // CREATE ELEMENT
    if (config.mode.name === Mode.Element) {

      if (!config.mode.state.createElement.selectedNodeId) {
        const sceneId: string = event.target.id
        const nodeId = this.view.sceneNodeIdToNodeId.get(sceneId);

        if (nodeId) {
          // const node: Node = this.model.getNode(nodeId);
          config.mode.state.createElement.selectedNodeId = nodeId
        } else {
          const node: Node = this.view.getNodePositionFromCursorPosition(event.pageX, event.pageY);
          const nodeId: number = this.model.setNode(node)
  
          this.view.setNode(node, nodeId)
  
          config.mode.state.createElement.selectedNodeId = nodeId
        }
      } else {
        const sceneId: string = event.target.id
        const nodeId = this.view.sceneNodeIdToNodeId.get(sceneId);

        if (nodeId) {
          // const node: Node = this.model.getNode(nodeId);
          this.createElement(config.mode.state.createElement.selectedNodeId, nodeId)
        } else {
          const node: Node = this.view.getNodePositionFromCursorPosition(event.pageX, event.pageY);
          const nodeId: number = this.model.setNode(node)
  
          this.view.setNode(node, nodeId)
  
          this.createElement(config.mode.state.createElement.selectedNodeId, nodeId)
        }
      }
    }

    // CREATE SUPPORT
    if (config.mode.name === Mode.Support) {
      const sceneId: string = event.target.id 
      const nodeId = this.view.sceneNodeIdToNodeId.get(sceneId);

      if (nodeId) {
        const node = this.model.getNode(nodeId);

        const xFixed: boolean = config.elements.toolbox.xFixed.checked;
        const yFixed: boolean = config.elements.toolbox.yFixed.checked;
        const boundary = new Boundary(xFixed, yFixed)

        this.model.setBoundary(nodeId, boundary)

        this.view.setSupport(boundary, node)
      }
    }

    // CREATE LOAD
    if (config.mode.name === Mode.Load) {
      const sceneId: string = event.target.id 
      const nodeId = this.view.sceneNodeIdToNodeId.get(sceneId);

      if (nodeId) {
        const node = this.model.getNode(nodeId);

        const fx: number = parseInt(config.elements.toolbox.fx.value);
        const fy: number = parseInt(config.elements.toolbox.fy.value);
        
        if (isInteger(fx) && isInteger(fy) && !(fy === 0 && fx === 0)) {
          const load = new Load(fx * 1000, fy * 1000)
          this.model.setLoad(nodeId, load)
  
          this.view.setLoad(load, node)
        }
      }
    }
  }
  
  private createElement(node1Id: number, node2Id: number) {
    const element = new Element(node1Id, node2Id, config.mode.state.createElement.currentSection, 
      config.mode.state.createElement.currentMaterial);

    const node1 = this.model.nodes.get(node1Id);
    const node2 = this.model.nodes.get(node2Id);

    const elementId = this.model.setElement(element);
    this.view.setElement(elementId, node1, node2);

    config.mode.state.createElement.selectedNodeId = undefined;
    config.mode.state.createElement.secondNode = undefined;
  }
} 
