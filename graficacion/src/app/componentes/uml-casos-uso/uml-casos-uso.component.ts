import { Component } from '@angular/core';
import * as go from 'gojs';
import jsPDF from "jspdf";
@Component({
  selector: 'app-uml-casos-uso',
  standalone: true,
  imports: [],
  templateUrl: './uml-casos-uso.component.html',
  styleUrl: './uml-casos-uso.component.css'
})
export class UmlCasosUsoComponent {
  private diagram!: go.Diagram;
  private palette!: go.Palette;
  tipoRelacion: string = "";

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
      'relinkingTool.isEnabled': true,
    });

    // Define la plantilla de nodo con puerto
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
          width: 8, height: 8, fill: 'black', strokeWidth: 0,
          alignment: go.Spot.Right, alignmentFocus: go.Spot.Left,
          portId: '', fromLinkable: true, toLinkable: true, cursor: 'pointer'
        })
      )
    );

    //Adicion de la relacion extend
    this.diagram.linkTemplateMap.add('extend',
      $(go.Link, { routing: go.Link.Orthogonal, corner: 5, relinkableFrom: true, relinkableTo: true},
        $(go.Shape, {stroke: 'blue', strokeDashArray: [4,2]}),
        $(go.Shape, {toArrow: 'OpenTriangle', stroke: 'blue'}),
        $(go.TextBlock, '<<entend>>', {segmentFraction: 0.5, segmentOffset: new go.Point(-20, -10), font: "bold 12px sans-serif", stroke: "blue", editable: true})
      )
    );

    console.log("Se añade modo extension")
    //Adicion de la relacion extend
    this.diagram.linkTemplateMap.add('include',
      $(go.Link, { routing: go.Link.Orthogonal, corner: 5, relinkableFrom: true, relinkableTo: true},
        $(go.Shape, {stroke: 'green', strokeDashArray: [4,2]}),
        $(go.Shape, {toArrow: 'OpenTriangle', stroke: 'green'}),
        $(go.TextBlock, '<<include>>', {segmentFraction: 0.5, segmentOffset: new go.Point(-20, -10), font: "bold 12px sans-serif", stroke: "green", editable: true})
      )
    );
    console.log("se añade modo inclusion")

    // Define la plantilla de enlace
    /*this.diagram.linkTemplate = $(
      go.Link,
      { routing: go.Link.Orthogonal, corner: 5, relinkableFrom: true, relinkableTo: true },
      $(go.Shape, { stroke: 'black' }),
      $(go.Shape, { toArrow: 'Standard', stroke: 'black' })
    );*/

    // Define el modelo de datos inicial
    this.diagram.model = $(go.GraphLinksModel, {
      nodeDataArray: [
        { key: 1, text: 'Usuario', color: '#0395b7' },
        { key: 2, text: 'Iniciar Sesión', color: '#f9a200' },
        { key: 3, text: 'Registro', color: '#f9a200' },
      ],
      linkDataArray: [{ from: 1, to: 2 }, { from: 1, to: 3 }],
    });
  }

  initPalette() {
    const $ = go.GraphObject.make;

    this.palette = $(go.Palette, 'myPaletteDiv', {
      nodeTemplate: this.diagram.nodeTemplate,
    });

    this.palette.model = $(go.GraphLinksModel, {
      nodeDataArray: [
        { key: 3, text: 'Actor', color: '#0395b7' },
        { key: 4, text: 'C de U', color: '#f9a200' },
      ],
    });
  }

  // Agregar flechas dinámicamente entre nodos
  agregarFlecha() {
    const model = this.diagram.model as go.GraphLinksModel;
    
    let linkData: any = {from:2, to:3};
    if(this.tipoRelacion == 'extend'){
      linkData.category = 'extend';
    }
    if(this.tipoRelacion == 'include'){
      linkData.category = 'include';
    }
    console.log("Añadiendo link: ", linkData);
    model.addLinkData(linkData);
    //console.log('Flecha agregada entre nodos 1 y 2');
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

  eliminarElemento(){
    const selectedParts = this.diagram.selection;
    this.diagram.startTransaction('delete');
    selectedParts.each((part) => {
      this.diagram.remove(part);
    });

    this.diagram.commitTransaction('delete');
  }

  guardarComoImagen() {
    const imageData = this.diagram.makeImageData({ scale:1, background: "white", returnType: "image/png"});

    if(typeof imageData !== "string"){
      console.error("Error: No se pudo generar la imagen del diagrama");
      return;
    }
    const pdf = new jsPDF("landscape", "mm", "a4");
    pdf.addImage(imageData, "PNG", 10, 10, 280, 150); // Adjust position & size
    pdf.save("diagrama.pdf");
  }

  extensionAsociacion(){
      this.tipoRelacion = 'extend';
      //this.diagram.toolManager.linkingTool = { category: 'extend' };
      //this.agregarFlecha();
      this.diagram.toolManager.linkingTool.archetypeLinkData = { category: 'extend' };
      //this.diagram.model.setDataProperty((this.diagram.model as go.GraphLinksModel), "archetypeLinkData", { category: 'extend' });
      console.log("Modo de Extensión")
  }
  inclusionAsociacion(){
    this.tipoRelacion = 'include';
    //this.agregarFlecha();
    this.diagram.toolManager.linkingTool.archetypeLinkData = { category: 'include' };
    this.diagram.model.setDataProperty((this.diagram.model as go.GraphLinksModel), "archetypeLinkData", { category: 'extend' });
    console.log("Modo de Inclusión")
  }
}
