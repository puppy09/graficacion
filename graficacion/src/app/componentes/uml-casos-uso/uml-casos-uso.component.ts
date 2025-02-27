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
      'grid.visible': true,
    });

    

    // Define la plantilla de nodo con puerto
    this.diagram.nodeTemplateMap.add('stickman', 
      $(go.Node, 'Vertical', new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
        $(go.Picture, { source: 'images/stickman.png', width: 50, height: 50 }),
        $(go.TextBlock, { margin: 5, editable: true, font: '14px sans-serif', stroke: 'black'}, new go.Binding('text', 'text').makeTwoWay()),
          $(go.Shape, "Circle", { width: 8, height: 8, fill: "black", strokeWidth: 0, portId: "", fromLinkable: true, toLinkable: true, cursor: "pointer"})));
        
    this.diagram.nodeTemplateMap.add('cu', 
      $(go.Node, 'Auto',{ groupable: true },
        $(go.Shape, 'RoundedRectangle', {fill: '#f9a200',stroke: 'black',strokeWidth: 1}, new go.Binding('fill', 'color')), new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
        $(go.TextBlock, {margin: 5, editable: true, font: '14px sans-serif', stroke: 'black'},new go.Binding('text', 'text').makeTwoWay()),
          $(go.Shape, "Circle", {width: 8, height: 8, fill: "transparent", strokeWidth: 0, portId: "left", fromLinkable: true, toLinkable: true, cursor: "pointer"})));

    this.diagram.nodeTemplateMap.add('delimitacion', 
      $(go.Node, 'Auto',{ resizable: true, resizeObjectName: "SHAPE", reshapable: true, rotatable: true, layerName: "Background"}, new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
        $(go.Shape, "Rectangle",{name: "SHAPE",fill: "transparent", stroke: "black", strokeWidth: 2, minSize: new go.Size(50, 50)},new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify)),
        $(go.TextBlock,{ margin: 5, editable: true, font: "bold 14px sans-serif" },new go.Binding("text", "text").makeTwoWay())));
    
        //Adicion de la relacion extend
    this.diagram.linkTemplateMap.add('extend',
      $(go.Link, { routing: go.Link.AvoidsNodes, adjusting: go.Link.Stretch,corner: 5, relinkableFrom: true, relinkableTo: true, reshapable: true},
        $(go.Shape, {stroke: 'blue', strokeDashArray: [4,2]}),
        $(go.Shape, {toArrow: 'OpenTriangle', stroke: 'blue'}),
        $(go.TextBlock, '<<entend>>', {segmentFraction: 0.5, segmentOffset: new go.Point(-20, -10), font: "bold 20px sans-serif", stroke: "blue", editable: true})
      )
    );
    console.log("Se añade modo extension")
    //Adicion de la relacion extend
    this.diagram.linkTemplateMap.add('include',
      $(go.Link, { routing: go.Link.AvoidsNodes, corner: 5, relinkableFrom: true, relinkableTo: true, reshapable:true, adjusting: go.Link.Stretch},
        $(go.Shape, {stroke: 'green', strokeDashArray: [4,2]}),
        $(go.Shape, {toArrow: 'OpenTriangle', stroke: 'green'}),
        $(go.TextBlock, '<<include>>', {segmentFraction: 0.5, segmentOffset: new go.Point(-20, -10), font: "bold 20px sans-serif", stroke: "green", editable: true})
      )
    );
    console.log("se añade modo inclusion")

    this.diagram.linkTemplate.selectionAdornmentTemplate =
  $(go.Adornment, 'Link',
    $(go.Shape, // Reshape handle
      {
        isPanelMain: true, 
        stroke: "dodgerblue", 
        strokeWidth: 3
      }),
    $(go.Shape, "Diamond", 
      {
        segmentIndex: 1, 
        segmentFraction: 0.5, 
        fill: "white", 
        stroke: "dodgerblue", 
        width: 10, 
        height: 10
      })
  );


    // Define el modelo de datos inicial
    this.diagram.model = $(go.GraphLinksModel, {
      nodeDataArray: [
        { key: 1, text: 'Usuario', category: 'stickman', loc: '100 100' },
        { key: 2, text: 'Iniciar Sesión', category: 'cu', loc: "200 200" },
        { key: 3, text: 'Registro', category: 'cu', loc: "300 300" },
      ],
      linkDataArray: [{ from: 1, to: 2 }, { from: 1, to: 3 }]
    });
  }

  initPalette() {
    const $ = go.GraphObject.make;

    this.palette = $(go.Palette, 'myPaletteDiv', {
      nodeTemplateMap: this.diagram.nodeTemplateMap,
    });

    this.palette.model = $(go.GraphLinksModel, {
      nodeDataArray: [
        { text: "Actor", category: 'stickman' },
        { text: "Caso de Uso", category: 'cu' },
        { text: "", category: 'delimitacion', size: "100 100" }
      ]
    });
  }

  // Guardar el diagrama en formato JSON
  guardarDiagrama() {
    const nodos = this.diagram.model.nodeDataArray;
    
    const modelo = this.diagram.model.toJson();
    console.log('Diagrama guardado:', modelo);
    localStorage.setItem('diagrama', modelo);
  }

  // Cargar el diagrama desde JSON
  cargarDiagrama() {
    const modelo = localStorage.getItem('diagrama');
    if (modelo) {
      this.diagram.model = go.Model.fromJson(modelo);

      const model = this.diagram.model as go.GraphLinksModel;
      model.nodeDataArray.forEach((node: any) => {
        //if (node.loc){
          //node.loc = go.Point.parse(node.loc);  
        //const point = go.Point.parse(node.loc);
          //let pointData = point

            //console.log("Posicion" ,point);
            this.diagram.model.setDataProperty(node, 'loc', go.Point.parse(node.loc));

            console.log("Nodo: ", node);
            //console.log("Node Location ",node.loc);
            //this.diagram.model.setDataProperty(node, 'loc', node.loc);
        //}
      });
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
      this.diagram.toolManager.linkingTool.archetypeLinkData = { category: 'extend' };
      console.log("Modo de Extensión")
  }
  inclusionAsociacion(){
    this.tipoRelacion = 'include';
    this.diagram.toolManager.linkingTool.archetypeLinkData = { category: 'include' };
    //this.diagram.model.setDataProperty((this.diagram.model as go.GraphLinksModel), "archetypeLinkData", { category: 'extend' });
    console.log("Modo de Inclusión")
  }

  asociacion(){
    this.tipoRelacion = 'normal';
    this.diagram.toolManager.linkingTool.archetypeLinkData = {};
  }
}
