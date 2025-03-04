import { Component } from '@angular/core';
import * as go from 'gojs';
import jsPDF from "jspdf";
import { ToastrService } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';

@Component({
  selector: 'app-uml-clases',
  standalone: true,
  imports: [],
  templateUrl: './uml-clases.component.html',
  styleUrl: './uml-clases.component.css',
  
})
export class UmlClasesComponent {
  diagram!: go.Diagram;
  private palette!: go.Palette;
  tipoRelacion: string = "";

  constructor(private toastr: ToastrService) {}

  ngOnInit() {
    this.initDiagram();
    this.initPalette();
  }

  initDiagram() {
    const $ = go.GraphObject.make;

    this.diagram = $(go.Diagram, 'myDiagramDiv', {
      'undoManager.isEnabled': true,
      'linkingTool.isEnabled': true,
      'linkReshapingTool.isEnabled': true,
      'relinkingTool.isEnabled': true,
      'grid.visible': true,
    });

    // Plantilla para una clase
    this.diagram.nodeTemplate = $(
      go.Node,
      'Vertical',
      {
        locationSpot: go.Spot.Center,
        movable: true,
        resizable: true,
        minSize: new go.Size(100, 50),
      },
      $(go.Shape, 'Rectangle', { fill: '#f9a200', stroke: 'black', strokeWidth: 1 }),
      $(go.Panel, 'Vertical',
        { margin: 5 },
        // Nombre de la clase
        $(go.TextBlock, { font: 'Bold 12pt Sans-Serif', alignment: go.Spot.Center, editable: true }, new go.Binding('text', 'nombre')),
        // Atributos
        $(go.Panel, 'Vertical',
          { margin: 2 },
          new go.Binding('itemArray', 'atributos'),
          {
            itemTemplate: $(
              go.Panel, 'Horizontal',
              $(go.TextBlock, { font: '10pt Sans-Serif', editable: true }, new go.Binding('text', '', (attr) => `+ ${attr.nombre}: ${attr.tipo}`))
            )
          }
        ),
        // Métodos
        $(go.Panel, 'Vertical',
          { margin: 2 },
          new go.Binding('itemArray', 'metodos'),
          {
            itemTemplate: $(
              go.Panel, 'Horizontal',
              $(go.TextBlock, { font: '10pt Sans-Serif', editable: true }, new go.Binding('text', '', (metodo) => `+ ${metodo.nombre}(): ${metodo.tipoRetorno}`))
            )
          }
        )
      )
    );

    // Plantilla para relaciones de herencia
    this.diagram.linkTemplateMap.add('herencia',
      $(go.Link,
        { routing: go.Link.AvoidsNodes, corner: 5, relinkableFrom: true, relinkableTo: true, reshapable: true },
        $(go.Shape, { stroke: 'black', strokeWidth: 2 }),
        $(go.Shape, { toArrow: 'Triangle', stroke: 'black', fill: 'black' })
      )
    );

    // Plantilla para relaciones de asociación
    this.diagram.linkTemplateMap.add('asociacion',
      $(go.Link,
        { routing: go.Link.AvoidsNodes, corner: 5, relinkableFrom: true, relinkableTo: true, reshapable: true },
        $(go.Shape, { stroke: 'black', strokeWidth: 2 }),
        $(go.Shape, { toArrow: 'Standard', stroke: 'black', fill: 'black' })
      )
    );

    // Modelo inicial
    this.diagram.model = $(go.GraphLinksModel, {
      nodeDataArray: [
        { key: 1, nombre: 'ClaseA', atributos: [{ nombre: 'atributo1', tipo: 'string' }], metodos: [{ nombre: 'metodo1', tipoRetorno: 'void' }] },
        { key: 2, nombre: 'ClaseB', atributos: [], metodos: [] },
      ],
      linkDataArray: [
        { from: 1, to: 2, category: 'asociacion' }
      ]
    });
  }

  initPalette() {
    const $ = go.GraphObject.make;

    this.palette = $(go.Palette, 'myPaletteDiv', {
      nodeTemplateMap: this.diagram.nodeTemplateMap,
    });

    this.palette.model = $(go.GraphLinksModel, {
      nodeDataArray: [
        { key: 1, nombre: 'Clase', atributos: [], metodos: [] }
      ]
    });
  }

  guardarDiagrama() {
    if (!this.diagram) return;
    const jsonData = this.diagram.model.toJson();
    localStorage.setItem("diagramaGuardado", jsonData);
    this.toastr.success('Diagrama Guardado con Éxito', 'Éxito');
  }

  cargarDiagrama() {
    const jsonData = localStorage.getItem("diagramaGuardado");
    if (jsonData) {
      this.diagram.model = go.Model.fromJson(jsonData);
      this.toastr.success('Diagrama Cargado con Éxito', 'Éxito');
    } else {
      this.toastr.error('No hay un diagrama guardado', 'Error');
    }
  }

  eliminarElemento() {
    const selectedParts = this.diagram.selection;
    this.diagram.startTransaction('delete');
    selectedParts.each((part) => {
      this.diagram.remove(part);
    });
    this.diagram.commitTransaction('delete');
  }

  guardarComoImagen() {
    const imageData = this.diagram.makeImageData({ scale: 1, background: "white", returnType: "image/png" });
    if (typeof imageData !== "string") {
      console.error("Error: No se pudo generar la imagen del diagrama");
      return;
    }
    const pdf = new jsPDF("landscape", "mm", "a4");
    pdf.addImage(imageData, "PNG", 10, 10, 280, 150);
    pdf.save("diagrama.pdf");
  }
}