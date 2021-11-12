import { Model, Displacement, Node } from './Model';
import View from "./UI/View";
import { model } from './exampleModel';
import { config } from "./UI/Config/config"
import { start as UIstart } from './Fem/Test/ModelTest'

// function mouseEvents(drawNodeCallback: Function, updateSceneCallback: Function) {
//   elements.container.addEventListener('click', event => {
//     const x = event.clientX;
//     const y = event.clientY;

//     drawNodeCallback(x, y);
//     updateSceneCallback();
//   })
// }

// function testEvent() {
//   elements.test.addEventListener('click', () => {
//     console.log(two.renderer.domElement.getBoundingClientRect());
//   });
// }

// function getMousePositionOnScene() {
//   elements.container.addEventListener('click', event => {
//     const mousePositionOnWindow = two.renderer.domElement.getBoundingClientRect();
//     const mousePositionOnScene = {
//       x: mousePositionOnWindow.x - event.clientX,
//       y: mousePositionOnWindow.y - event.clientY
//     }
//     console.log(mousePositionOnScene);
//   });
// }

// Controller
class Controller {
  private maxDisplacementSizeInPx: number = 20;

  constructor(
    private model: Model = model,
    private view: View = view
  ) {}

  private getMaxAbsDisplacementValue(displacements: Map<Node, Displacement>) {
    let absMax = 0;

    displacements.forEach(d => {
      if (d.dx < Math.abs(d.dx)) {
        absMax = d.dx;
      }

      if (d.dy < Math.abs(d.dy)) {
        absMax = d.dy;
      }
    });

    return Math.abs(absMax);
  }

  private addEventListeners() {
    const {plusBtn, minusBtn, nodesCheckbox, 
      elementsCheckbox, supportsCheckbox, modes, 
      allCheckbox, container} = config.elements;

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
      this.clearAndUpdateScene();
    })
    modes.forEach(mode => {
      mode.addEventListener('click', () => {
        this.handleCurrentActiveMode(mode);
      });
    });
    container.addEventListener('mousemove', event => {
      let currentPosition: Node = this.view.getNodePositionFromCursorPosition(event.pageX, event.pageY);
      const {x, y} = config.cursor.position
      if (x !== currentPosition.x || y !== currentPosition.y) {
        this.view.getRenderer().remove(config.cursor.two);
        config.cursor.position.x = currentPosition.x;
        config.cursor.position.y = currentPosition.y;
        // console.log(currentPosition.x, currentPosition.y);
        config.cursor.two = this.view.makeCursor(currentPosition.x, currentPosition.y);
        this.updateScene();
      }
    })
  }

  private handleResizeSceneToContainersSize() {
    config.two.width = config.elements.container.clientWidth;
    config.two.height = config.elements.container.clientHeight-4;
  
    this.view.getRenderer().setSceneSize();
    this.clearAndUpdateScene();
  }

  private handleZoomIn() {
    config.scaleFactor.model /= config.screenScalingFactor;
    this.clearAndUpdateScene();
  }

  private handleZoomOut() {
    config.scaleFactor.model *= config.screenScalingFactor;
    this.clearAndUpdateScene();
  }

  private handleNodesVisibility() {
    config.isVisible.nodes = !config.isVisible.nodes;
    this.clearAndUpdateScene();
  }

  private handleElementsVisibility() {
    config.isVisible.elements = !config.isVisible.elements;
    this.clearAndUpdateScene();
  }

  private handleSupportsVisibility() {
    config.isVisible.supports = !config.isVisible.supports
    this.clearAndUpdateScene();
  }

  private handleCurrentActiveMode(mode: HTMLInputElement) {
    switch (mode.value) {
      case 'node':
        config.mode = 'node';
        break;
      case 'element':
        config.mode = 'element';
        break;
      case 'support':
        config.mode = 'support';
        break;
      case 'load':
        config.mode = 'load';
        break;
    }
  }

  private getDisplacementsScaleFactor() {
    const maxAbsDisplacementValue: number = this.getMaxAbsDisplacementValue(this.model.results.displacements);
    return this.maxDisplacementSizeInPx / maxAbsDisplacementValue;
  }

  // refactor
  init() {
    this.makeAll();
    this.updateScene();
    this.addEventListeners();
    // zoomEvents(this.clearAndUpdateScene.bind(this));
    // mouseEvents(this.view.makeSth.bind(this.view), this.updateScene.bind(this));
    // testEvent();
  }

  // refactor
  private clearAndUpdateScene() {
    this.view.clear();
    this.makeAll();
    
    this.view.updateView();
  }

  // refactor
  private makeAll() {
    this.view.makeDimensions();

    if (config.isVisible.elements) {
      this.view.makeElements(this.model.elements);
    }

    if (config.isVisible.supports) {
      this.view.makeSupports(this.model.boundaries);
    }

    if (config.isVisible.nodes) {
      this.view.makeNodes(this.model.nodes);
    }

    this.view.makeCoordinateSystemIcon();
    this.view.makeLoads(this.model.loads);
    this.view.makeBorder();
    this.view.makeNodesLabels(this.model.nodes);
    this.view.makeElementsLabels(this.model.elements);
    this.view.makeDisplacements(this.model.elements, this.model.results.displacements, this.getDisplacementsScaleFactor());
    this.view.makeDisplacementLabels(this.model.results.displacements, this.getDisplacementsScaleFactor())
  }

  // refactor
  private updateScene() {
    this.view.updateView();
  }
}

const view = new View(config);

const controller = new Controller(model, view);
controller.init();
UIstart();

// // Make an instance of two and place it on the page.
// var elem = document.getElementById('draw-shapes');
// var params = { width: 285, height: 200 };
// var two = new Two(params).appendTo(elem);

// // two has convenience methods to create shapes.
// var circle = two.makeCircle(72, 100, 50);
// var rect = two.makeRectangle(213, 100, 100, 100);

// // The object returned has many stylable properties:
// circle.fill = '#FF8000';
// circle.stroke = 'orangered'; // Accepts all valid css color
// circle.linewidth = 5;

// rect.fill = 'rgb(0, 200, 255)';
// rect.opacity = 0.75;
// rect.noStroke();

// // Don't forget to tell two to render everything
// // to the screen
// two.update();