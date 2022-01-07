import { Model } from "../../Model";

class ResultsTableRow {
  constructor(
    public id: number,
    public area: number,
    public resistance: number,
    // public dx: number,
    // public dy: number,
    public axialForce: number
  ) {}
}

export default class ResultsTable {

  static createResultsTableAsInnerText(model: Model): string {
    const rows = this.createResultsTableRows(model) 

    return `<table id="results-table">
    <tr>
      <th rowspan=2>Element</th>
      <th>Area</th>
      <th>Resistance</th>
      <th>Axial force</th>
      <th>Normal stress</th>
      <th>Load capacity</th>
    </tr>
    <tr>
      <th>[m2]</th>
      <th>[MPa]</th>
      <th>[kN]</th>
      <th>[MPa]</th>
      <th>[-]</th>
    </tr>
    ${this.createRows(rows)}
    </table>`
  }

  private static createResultsTableRows(model: Model) {
    const resultsTableRows = [];

    for (const [id, element] of model.elements) {
      resultsTableRows.push(
        new ResultsTableRow(
          id, 
          element.section.area, 
          element.material.resistance, 
          model.results.innerForces.get(id)
        )
      )
    }

    return resultsTableRows;
  }

  private static createRows(rows: ResultsTableRow[]): string {
    let HTML = '';

    for (const rtr of rows) {
      const row = this.createRow(rtr)
      HTML = HTML.concat(row);
    }

    return HTML;
  }

  private static createRow(elem: ResultsTableRow): string {
    const normalStress = elem.axialForce / elem.area;
    const loadCapacity = normalStress / elem.resistance;

    return `<tr ${Math.abs(loadCapacity) > 1.0 ? 'style="color: red; font-weight: bold;"' : ''}>
      <td>${this.round(elem.id)}</td>
      <td>${elem.area}</td>
      <td>${(elem.resistance / 1000000).toFixed(2)}</td>
      <td>${(elem.axialForce / 1000).toFixed(2)}</td>
      <td>${(normalStress / 1000000).toFixed(2)}</td>
      <td>${loadCapacity.toFixed(2)}</td>
    </tr>`
  }

  private static round(value: number) {
    return Math.round(value * 100) / 100;
  }
}