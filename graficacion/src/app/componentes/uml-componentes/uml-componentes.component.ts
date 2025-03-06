import { Component } from '@angular/core';
import * as go from 'gojs';
import jsPDF from "jspdf";
import html2canvas from 'html2canvas';
import { catchError, groupBy } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-uml-componentes',
  standalone: true,
  imports: [],
  templateUrl: './uml-componentes.component.html',
  styleUrl: './uml-componentes.component.css'
})
export class UmlComponentesComponent {
  diagram!: go.Diagram;
  private palette!: go.Palette;
  tipoRelacion: string = "";

  constructor(private toastr: ToastrService){}

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

    this.diagram.toolManager.linkingTool.archetypeLinkData = { category: 'normal' };

    this.diagram.nodeTemplateMap.add("main",
      $(go.Node, "Vertical",
          {
              locationSpot: go.Spot.Center,
              selectionAdorned: true
          },
          $(go.Panel, "Auto",
              $(go.Shape, "Rectangle", {
                  fill: "#fff3cd",
                  stroke: "#ffc107",
                  strokeWidth: 3,
                  height: 60,
                  width: 100,
                  
              }),
              $(go.TextBlock, {
                  margin: 10,
                  font: "bold 16px sans-serif",
                  textAlign: "center",
                  editable: true
              }, new go.Binding("text", "name"))
          ),
          $(go.Panel, "Vertical",
              { margin: 10 },
              new go.Binding("itemArray", "interfaces"),
              {
                  itemTemplate: $(go.Panel, "Horizontal",
                      { margin: 5 },
                      $("Shape",
                          {
                              portId: "",
                              figure: "Circle",
                              fill: "#0dcaf0",
                              stroke: null,
                              width: 14,
                              height: 14,
                              fromLinkable: true,
                              toLinkable: true
                          }
                      ),
                      $(go.TextBlock,
                          { margin: 2, font: "12px sans-serif", editable: true },
                          new go.Binding("text", "name").makeTwoWay())
                  )
              }
          )
      )
  );

  this.diagram.nodeTemplateMap.add("subsistema",
    $(go.Node, "Vertical",
        {
            locationSpot: go.Spot.Center,
            selectionAdorned: true
        },
        $(go.Panel, "Auto",
            $(go.Shape, "Rectangle", {
                fill: "#e2f0fb",
                stroke: "#0d6efd",
                strokeWidth: 3,
                height: 60,
                width: 100
            }),
            $(go.TextBlock, {
                margin: 10,
                font: "bold 16px sans-serif",
                textAlign: "center",
                editable: true
            }, new go.Binding("text", "name").makeTwoWay())
        ),
        $(go.Panel, "Vertical",
            { margin: 10 },
            new go.Binding("itemArray", "interfaces"),
            {
                itemTemplate: $(go.Panel, "Horizontal",
                    { margin: 5 },
                    $("Shape",
                        {
                            portId: "",
                            figure: "Circle",
                            fill: "#0dcaf0",
                            stroke: null,
                            width: 14,
                            height: 14,
                            fromLinkable: true,
                            toLinkable: true
                        }
                    ),
                    $(go.TextBlock,
                        { margin: 2, font: "12px sans-serif", editable: true },
                        new go.Binding("text", "name").makeTwoWay())
                )
            }
        )
    )
);



  // this.diagram.linkTemplate = $(go.Link,
  //   { routing: go.Link.AvoidsNodes, adjusting: go.Link.Stretch, corner: 5, relinkableFrom: true, relinkableTo: true, reshapable: true },
  //   $(go.Shape, { stroke: "#6c757d", strokeWidth: 1.5 }),
  //   $(go.Shape, { toArrow: "Standard", stroke: "#6c757d" })
  // );
  this.diagram.linkTemplateMap.add('asociar',
    $(go.Link, 
      {
        routing: go.Link.AvoidsNodes, 
        corner: 5, 
        relinkableFrom: true, 
        relinkableTo: true, 
        reshapable: true, 
        adjusting: go.Link.Stretch
      },
      $(go.Shape, { stroke: "#6c757d", strokeWidth: 1.5 }),
      $(go.Shape, { fromArrow: "Standard", stroke: "#6c757d" }), // Flecha en el extremo 'from'
      $(go.Shape, { toArrow: "Standard", stroke: "#6c757d" }), // Flecha en el extremo 'to'
      $(go.TextBlock, 'Interfaz', { segmentFraction: 0.5, segmentOffset: new go.Point(-20, -10), font: "bold 20px sans-serif", stroke: "green", editable: true })
    )
  );
  
  

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
  this.diagram.model = new go.GraphLinksModel([
    { key: "Main", name: "Main", category: "main"},
    { key: "Subsistema1", name: "Subsistema 1", category: "subsistema"},
    { key: "Subsistema2", name: "Subsistema 2", category: "subsistema"},
    { key: "Subsistema3", name: "Subsistema 3", category: "subsistema"},
    { key: "Subsistema4", name: "Subsistema 4", category: "subsistema"}
  ], [
    { from: "Main", to: "Subsistema1",category: 'asociar' },
    { from: "Main", to: "Subsistema2", category: 'asociar' },
    { from: "Subsistema3", to: "Main", category: 'asociar' },
    { from: "Subsistema1", to: "Subsistema4", category: 'asociar' }
  ]);

  this.diagram.addDiagramListener("ExternalObjectsDropped", (e) => {
    e.subject.each((part: go.Node) => {
      if (part instanceof go.Node && part.category === "cu" && part.containingGroup === null) {
        this.error();
        this.diagram.remove(part);
      }
    });
  });
}

initPalette() {
  const $ = go.GraphObject.make;

  this.palette = $(go.Palette, 'myPaletteDiv', {
    nodeTemplateMap: this.diagram.nodeTemplateMap,
  });

  this.palette.model = $(go.GraphLinksModel, {
    nodeDataArray: [
      { text: "Main", category: 'main', name: "Main" },
      { text: "Subsistema", category: 'subsistema', name: "Subsistema" }
    ]
  });
}

// Guardar el diagrama en formato JSON
guardarDiagrama() {
  if (!this.diagram) return;
  const jsonData = this.diagram.model.toJson();
  localStorage.setItem("diagramaGuardado", jsonData);

  this.guardadoConExito();
}

// Cargar el diagrama desde JSON
cargarDiagrama() {
  const jsonData = localStorage.getItem("diagramaGuardado");
  if (jsonData) {
    this.diagram.model = go.Model.fromJson(jsonData);

  } else {
    this.errorCargar();
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

guardarComoImagen(diagram: go.Diagram) {
  const imageData = this.diagram.makeImageData({ scale: 1, background: "white", returnType: "image/png" });

  if (typeof imageData !== "string") {
    console.error("Error: No se pudo generar la imagen del diagrama");
    return;
  }
  const pdf = new jsPDF("landscape", "mm", "a4");
  pdf.addImage(imageData, "PNG", 10, 10, 280, 150); // Adjust position & size
  pdf.save("diagrama.pdf");
}



conectar() {
  if (!this.diagram) return;
  const model = this.diagram.model as go.GraphLinksModel;
  const selectedNodes = this.diagram.selection.toArray().filter(node => node instanceof go.Node) as go.Node[];
  if (selectedNodes.length !== 2) {
    console.error("Error: Debe seleccionar exactamente dos nodos para conectar");
    return;
  }
  const fromNode = selectedNodes[0].data.key;
  const toNode = selectedNodes[1].data.key;
  model.addLinkData({ from: fromNode, to: toNode, category: 'asociar' });
}

guardadoConExito() {
  this.toastr.success('Diagrama Guardado con Éxito', 'Nice!');
}

cargadoConExito() {
  this.toastr.success('Diagrama Guardado con Éxito', 'Nice');
}

error() {
  this.toastr.error('Los nodos no pueden estar fuera del grupo', 'Error');
}

errorCargar() {
  this.toastr.error('No hay un diagrama guardado', 'Error');
}
}
