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
  @ViewChild('paletteDiv') paletteDiv!: ElementRef;
  private myDiagram!: go.Diagram;
  private myPalette!: go.Palette;

  ngAfterViewInit() {
    this.initDiagram();
    this.initPalette();
  }

  initDiagram() {
    const $ = go.GraphObject.make;

    this.myDiagram = $(go.Diagram, this.diagramDiv.nativeElement, {
      allowCopy: false,
      "undoManager.isEnabled": true,
      "draggingTool.dragsLink": true,
      "linkingTool.isUnconnectedLinkValid": true,
      "linkingTool.portGravity": 20,
      "commandHandler.archetypeGroupData": { isGroup: true, text: "New Group" }
    });

    // Plantilla de los actores principales (grupos)
    this.myDiagram.groupTemplate = $(
      go.Group, "Vertical",
      {
        locationSpot: go.Spot.Top,
        selectionObjectName: "HEADER",
        computesBoundsAfterDrag: true,
        handlesDragDropForMembers: true,
        groupable: true,
        mouseDrop: function (e, grp) {
          const ok = grp instanceof go.Group && grp.diagram && grp.canAddMembers(grp.diagram.selection);
          if (!ok) return;
          e.diagram.selection.each(part => {
            if (part instanceof go.Node) part.containingGroup = grp;
          });
        },
        fromLinkable: false,
        toLinkable: false
      },
      new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
      $(
        go.Panel, "Auto", { name: "HEADER" },
        $(go.Shape, "Rectangle", { fill: "#bbdefb", stroke: null }),
        $(go.TextBlock, { margin: 5, font: "10pt sans-serif" }, new go.Binding("text"))
      ),
      $(
        go.Shape,
        { figure: "LineV", stroke: "gray", strokeDashArray: [3, 3], width: 1 },
        new go.Binding("height", "duration")
      )
    );

    // Plantilla para los nodos de acción
    this.myDiagram.nodeTemplate = $(
      go.Node, "Auto",
      {
        locationSpot: go.Spot.Top,
        movable: true,
        groupable: true,
        dragComputation: (node: go.Part, pt: go.Point) => {
          return node.containingGroup ? new go.Point(node.containingGroup.location.x, pt.y) : pt;
        }
      },
      new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
      new go.Binding("group", "group"),
      $(
        go.Panel, "Vertical",
        $(go.Shape, "Rectangle", { fill: "white", stroke: "black", width: 12, height: 30 }),
        $(go.Shape, "Rectangle", { fill: "black", width: 12, height: 3 }),
        $(go.Shape, "Circle",
          {
            width: 6, height: 6, fill: "red", strokeWidth: 0, cursor: "pointer",
            portId: "",
            fromLinkable: true, toLinkable: true,
            fromSpot: go.Spot.Bottom, toSpot: go.Spot.Top
          }
        )
      )
    );

    // Plantilla para las conexiones (flechas) con texto editable
    this.myDiagram.linkTemplate = $(
      go.Link,
      { curve: go.Link.JumpOver, toShortLength: 2, relinkableFrom: true, relinkableTo: true },
      $(go.Shape, { stroke: "black" }),
      $(go.Shape, { toArrow: "Standard", stroke: "black" }),
      $(go.Panel, "Auto",
        $(go.Shape, "Rectangle", { fill: "white", stroke: "black" }),
        $(go.TextBlock,
          {
            font: "9pt sans-serif",
            margin: 2,
            editable: true
          },
          new go.Binding("text").makeTwoWay()
        )
      )
    );

    this.loadModel();
  }

  initPalette() {
    const $ = go.GraphObject.make;

    this.myPalette = $(go.Palette, this.paletteDiv.nativeElement, {
      nodeTemplateMap: this.myDiagram.nodeTemplateMap,
      model: new go.GraphLinksModel([
        { key: "Lifeline", text: "Lifeline", isGroup: true, duration: 300 },
        { key: "Action", text: "Action", isGroup: false, groupable: true }
      ])
    });
  }

  loadModel() {
    const modelData = {
      class: "go.GraphLinksModel",
      nodeDataArray: [
        { key: "Fred", text: "Fred: Patron", isGroup: true, loc: "0 0", duration: 300 },
        { key: "Bob", text: "Bob: Waiter", isGroup: true, loc: "120 0", duration: 300 },
        { key: "Hank", text: "Hank: Cook", isGroup: true, loc: "240 0", duration: 300 },
        { key: "Renee", text: "Renee: Cashier", isGroup: true, loc: "360 0", duration: 300 },
        { key: -5, group: "Bob", loc: "120 30" },
        { key: -6, group: "Hank", loc: "240 60" },
        { key: -7, group: "Fred", loc: "0 90" },
        { key: -8, group: "Bob", loc: "120 120" },
        { key: -9, group: "Fred", loc: "0 150" },
        { key: -10, group: "Renee", loc: "360 180" }
      ],
      linkDataArray: [
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
