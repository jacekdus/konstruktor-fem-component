export const elements = {
  scene: document.getElementById('scene'),
  calcBtn: document.getElementById('calc-btn'),
  sceneVisibility: document.getElementById('scene-visibility'),
  modes: document.getElementById('mode'),
  two: {
    nodes: undefined as undefined | HTMLElement
  },
  toolbox: {
    element: document.getElementById('element-toolbox'),
    support: document.getElementById('support-toolbox'),
    load: document.getElementById('load-toolbox'),
    fx: document.getElementById('fx-input') as HTMLInputElement,
    fy: document.getElementById('fy-input') as HTMLInputElement,
    xFixed: document.getElementById('support-xFixed-cb') as HTMLInputElement,
    yFixed: document.getElementById('support-yFixed-cb') as HTMLInputElement,
    select: {
      material: document.getElementById('material-select') as HTMLSelectElement,
      section: document.getElementById('section-select') as HTMLSelectElement
    }
  },
  jsoneditor: {
    container: document.getElementById('jsoneditor'),
    updateBtn: document.getElementById('jsoneditorUpdateBtn')
  },
  resultsTable: document.getElementById('results-container')
}
