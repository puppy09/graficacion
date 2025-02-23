import { Component, OnInit } from '@angular/core';
import * as go from 'gojs';

@Component({
  selector: 'app-uml-secuencias',
  standalone: true,
  imports: [],
  templateUrl: './uml-secuencias.component.html',
  styleUrl: './uml-secuencias.component.css'
})
export class UmlSecuenciasComponent implements OnInit {
  private diagram!: go.Diagram;
  private palette!: go.Palette;

  ngOnInit() {
    this.initDiagram();
    this.initPalette();
  }

  title = 'pruebago';

  initDiagram() {
    const $ = go.GraphObject.make;

    this.diagram = $(go.Diagram, 'myDiagramDiv', {
      'undoManager.isEnabled': true,
      'linkingTool.isEnabled': true,
      'linkingTool.direction': go.LinkingTool.ForwardsOnly,
      'linkReshapingTool.isEnabled': true,
      'relinkingTool.isEnabled': true
    });

    // 📌 Definir la plantilla de nodo para los actores/nodos normales
    this.diagram.nodeTemplate = $(
      go.Node,
      'Auto',
      $(go.Shape, 'RoundedRectangle', {
        fill: 'lightblue',
        stroke: 'black',
        strokeWidth: 1,
      }, new go.Binding('fill', 'color')),
      $(go.TextBlock, {
        margin: 10,
        font: '14px sans-serif',
        stroke: 'black',
        editable: true,
      }, new go.Binding('text', 'text').makeTwoWay()),
      $(go.Panel, 'Spot',
        $(go.Shape, 'Circle', {
          width: 8, height: 8, fill: 'red', strokeWidth: 0,
          alignment: go.Spot.Right, alignmentFocus: go.Spot.Left,
          portId: '', fromLinkable: true, toLinkable: true, cursor: 'pointer'
        })
      )
    );

    // 📌 Definir la plantilla de nodo para las lifelines
    this.diagram.nodeTemplateMap.add(
      'lifeline',
      $(
        go.Node,
        'Vertical',
        { locationSpot: go.Spot.Top },
        new go.Binding('location', 'loc', go.Point.parse),
        $(
          go.TextBlock,
          { margin: 5, font: 'bold 14px sans-serif' },
          new go.Binding('text', 'name')
        ),
        $(
          go.Shape,
          'LineV',
          { stroke: 'black', strokeWidth: 2, height: 1000 } // Simula la línea infinita
        )
      )
    );

    // 📌 Definir la plantilla de enlace
    this.diagram.linkTemplate = $(
      go.Link,
      { routing: go.Link.Orthogonal, corner: 5, relinkableFrom: true, relinkableTo: true },
      $(go.Shape, { stroke: 'black' }),
      $(go.Shape, { toArrow: 'Standard', stroke: 'black' })
    );

    // 📌 Definir el modelo con actores y lifelines
    this.diagram.model = $(go.GraphLinksModel, {
      nodeDataArray: [
        { key: 1, name: 'Actor', loc: '0 0', category: 'lifeline' },
        { key: 2, name: 'Sistema', loc: '150 0', category: 'lifeline' },
      ],
      linkDataArray: []
    });
  }

  initPalette() {
    const $ = go.GraphObject.make;

    this.palette = $(go.Palette, 'myPaletteDiv', {
      nodeTemplate: this.diagram.nodeTemplate,
    });

    this.palette.model = $(go.GraphLinksModel, {
      nodeDataArray: [
        { key: 3, text: 'Clase', color: 'lightblue' },
        { key: 4, text: 'Interfaz', color: 'orange' },
      ],
    });
  }

  // Agregar flechas dinámicamente entre nodos
  agregarFlecha() {
    const model = this.diagram.model as go.GraphLinksModel;
    model.addLinkData({ from: 1, to: 2 });
    console.log('Flecha agregada entre nodos 1 y 2');
  }

  // Guardar el diagrama en formato JSON
  guardarDiagrama() {
    const modelo = this.diagram.model.toJson();
    console.log('Diagrama guardado:', modelo);
    localStorage.setItem('diagrama', modelo);
  }

  // Cargar el diagrama desde JSON
  cargarDiagrama() {
    const modelo = localStorage.getItem('diagrama');
    if (modelo) {
      this.diagram.model = go.Model.fromJson(modelo);
      console.log('Diagrama cargado:', modelo);
    } else {
      console.log('No hay diagrama guardado.');
    }
  }
}
