import { Material, Section } from '../../Model';
import * as materialsJson from './json/materials.json';
import * as sectionsJson from './json/sections.json'

export default class Select {

  static getSections(): Section[] {
    const secs: Section[] = [];

    sectionsJson.sections.forEach((section: any) => {
      secs.push(new Section(section.name, section.area));
    })

    return secs;
  }

  static getMaterials(): Material[] {
    const mats: Material[] = [];

    materialsJson.materials.forEach((material: any) => {
      mats.push(new Material(material.name, material.youngsModulus, material.resistance));
    })

    return mats;
  }

  static createMaterialSelectAsInnerHTML(): string {
    let innerHTML = ''

    materialsJson.materials.forEach((material: any) => {
      innerHTML += this.createOption(material.name);
    })

    return innerHTML;
  }

  static createSectionSelectAsInnerHTML(): string {
    let innerHTML = ''

    sectionsJson.sections.forEach((section: any) => {
      innerHTML += this.createOption(section.name);
    })

    return innerHTML;
  }

  private static createOption(value: string) {
    return `<option>${value}</option>`
  }
}
