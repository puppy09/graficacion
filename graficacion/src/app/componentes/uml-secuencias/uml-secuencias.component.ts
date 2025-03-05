import { Component, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import * as go from 'gojs';

@Component({
  selector: 'app-uml-secuencias',
  standalone: true,
  templateUrl: './uml-secuencias.component.html',
  styleUrls: ['./uml-secuencias.component.css']
})
export class UmlSecuenciasComponent implements AfterViewInit {
  @ViewChild('diagramDiv') diagramDiv!: ElementRef;
  private myDiagram!: go.Diagram;

  ngAfterViewInit() {
    this.initDiagram();
  }

  initDiagram() {
    const $ = go.GraphObject.make;

    this.myDiagram = $(go.Diagram, this.diagramDiv.nativeElement, {
      allowCopy: false,
      'undoManager.isEnabled': true
    });

    // Plantilla de los actores principales (grupos)
    this.myDiagram.groupTemplate = $(
      go.Group, "Vertical",
      { locationSpot: go.Spot.Top, selectionObjectName: "HEADER" },
      new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
      $(
        go.Panel, "Auto", { name: "HEADER" },
        $(go.Shape, "Rectangle", { fill: "#bbdefb", stroke: null }),
        $(go.TextBlock, { margin: 5, font: "10pt sans-serif" }, new go.Binding("text"))
      ),
      $(
        go.Shape, // Línea de vida
        { figure: "LineV", stroke: "gray", strokeDashArray: [3, 3], width: 1 },
        new go.Binding("height", "duration")
      )
    );

    // Plantilla para los nodos de acción (más largos)
    this.myDiagram.nodeTemplate = $(
      go.Node, "Auto",
      {
        locationSpot: go.Spot.Top,
        movable: true,
        dragComputation: function (node: go.Part, pt: go.Point): go.Point {
          return new go.Point(node.location.x, pt.y); // Mantiene la posición x fija
        }
      },
      new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
      $(
        go.Panel, "Vertical",
        $(go.Shape, "Rectangle", 
          { fill: "white", stroke: "black", width: 12, height: 30 } // Tamaño fijo
        ),
        $(go.Shape, "Rectangle", { fill: "black", width: 12, height: 3 }) // Línea superior fija
      )
    );
    

    // Plantilla para las conexiones (flechas)
    this.myDiagram.linkTemplate = $(
      go.Link,
      { curve: go.Link.JumpOver, toShortLength: 2 },
      $(go.Shape, { stroke: "black" }),
      $(go.Shape, { toArrow: "Standard", stroke: "black" }),
      $(go.TextBlock, { font: "9pt sans-serif", segmentOffset: new go.Point(0, -10) },
      
        new go.Binding("text"))
    );

    this.loadModel();
  }

  loadModel() {
    const modelData = {
      class: "go.GraphLinksModel",
      nodeDataArray: [
        { key: "Fred", text: "Fred: Patron", isGroup: true, loc: "0 0", duration: 300 },
        { key: "Bob", text: "Bob: Waiter", isGroup: true, loc: "120 0", duration: 300 },
        { key: "Hank", text: "Hank: Cook", isGroup: true, loc: "240 0", duration: 300 },
        { key: "Renee", text: "Renee: Cashier", isGroup: true, loc: "360 0", duration: 300 },

        // Nodos pequeños (ahora más largos)
        { key: -5, group: "Bob", loc: "120 30" },
        { key: -6, group: "Hank", loc: "240 60" },
        { key: -7, group: "Fred", loc: "0 90" },
        { key: -8, group: "Bob", loc: "120 120" },
        { key: -9, group: "Fred", loc: "0 150" },
        { key: -10, group: "Renee", loc: "360 180" }
      ],
      linkDataArray: [
        { from: "Fred", to: -5, text: "order" },
        { from: -5, to: -6, text: "order food" },
        { from: -5, to: -7, text: "serve drinks" },
        { from: -6, to: -8, text: "finish cooking" },
        { from: -8, to: -9, text: "serve food" },
        { from: -9, to: -10, text: "pay" }
      ]
    };

    this.myDiagram.model = go.Model.fromJson(modelData);
  }

  saveModel() {
    console.log(this.myDiagram.model.toJson());
  }
}
