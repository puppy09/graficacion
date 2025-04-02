import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import * as go from 'gojs';

@Component({
  selector: 'app-diagram-package',
  standalone: true,
  imports: [],
  templateUrl: './uml-paquetes.component.html',
  styleUrl: './uml-paquetes.component.css'
})
export class UmlPaquetesComponent implements AfterViewInit {
  @ViewChild('myDiagramDiv', { static: false }) diagramDiv!: ElementRef;
  @ViewChild('myPaletteDiv', { static: false }) paletteDiv!: ElementRef;
  @ViewChild('levelSlider', { static: false }) levelSlider!: ElementRef;
  myDiagram!: go.Diagram;
  myPalette!: go.Palette;
  public relationshipMode: boolean = false;
  tipoRelacion: string = "";
  packageCounter: number = 0;

  ngAfterViewInit(): void {
    this.initDiagram();
  }

 // ...existing code...
initDiagram(): void {
  const $ = go.GraphObject.make;

  this.myDiagram = $(go.Diagram, this.diagramDiv.nativeElement, {
    'grid.visible': true,
    'undoManager.isEnabled': true,
    'InitialLayoutCompleted': () => this.updateTotalGroupDepth(),
    mouseDrop: (e: go.InputEvent) => this.finishDrop(e, null),
    layout: $(go.GridLayout, { wrappingWidth: Infinity })
  });

  this.myDiagram.layout = $(go.GridLayout, {
    wrappingColumn: 3, // Máximo de 3 elementos por fila antes de pasar a la siguiente
    cellSize: new go.Size(100, 100), // Tamaño de cada celda
    spacing: new go.Size(10, 10) // Espaciado entre elementos
  });
  

  // this.myDiagram = $(go.Diagram, this.diagramDiv.nativeElement, {
  //   'undoManager.isEnabled': true,
  //   'InitialLayoutCompleted': () => this.updateTotalGroupDepth(),
  //   mouseDrop: (e: go.InputEvent) => this.finishDrop(e, null),
  //   allowMove: true,  // Permite mover elementos libremente
  //   allowDrop: true,  // Permite soltar elementos desde la paleta
  //   draggingTool: new go.DraggingTool(), // Habilita arrastre sin restricciones
  //   layout: $(go.GridLayout, {
  //     wrappingColumn: 4,  // Número máximo de elementos en una fila antes de saltar
  //     cellSize: new go.Size(150, 100),  // Tamaño de cada celda (ajústalo a tu necesidad)
  //     spacing: new go.Size(20, 20),  // Espaciado entre elementos
  //     alignment: go.GridAlignment.Position
  //   })
  // });
  
  /** PALETA **/
  this.myPalette = $(go.Palette, this.paletteDiv.nativeElement, {
    nodeTemplateMap: this.myDiagram.nodeTemplateMap,
    groupTemplateMap: this.myDiagram.groupTemplateMap,
    layout: $(go.GridLayout, {
      wrappingColumn: 2,  // Define cuántos elementos habrá en cada fila antes de hacer un salto
      cellSize: new go.Size(100, 100),  // Tamaño uniforme para los elementos en la paleta
      spacing: new go.Size(10, 10),  // Espaciado entre los elementos
      alignment: go.GridAlignment.Position
    })
  });

  this.myPalette.layout = $(go.GridLayout, {
    wrappingColumn: 2,
    cellSize: new go.Size(100, 50),  // Ajuste de tamaño para los elementos
    spacing: new go.Size(10, 10),
    alignment: go.GridAlignment.Position
  });

  this.myPalette.nodeTemplateMap.add('ArrowNode',
    $(go.Node, 'Horizontal',
      { background: 'transparent', movable: false }, // Evita moverlo dentro de la paleta
      $(go.Shape,  // Representación de la flecha
        {
          geometryString: 'M0 0 L30 15 L0 30 Z',  // Flecha simple
          fill: 'black', stroke: null, width: 30, height: 30
        }
      ),
      $(go.TextBlock, 'Flecha', { margin: 5, font: 'bold 12px sans-serif' })
    )
  );

  /** TEMPLATE PARA NODOS **/
  this.myDiagram.nodeTemplate = $(go.Node, 'Auto',
    {
      mouseDrop: (e: go.InputEvent, node: go.GraphObject) => this.finishDrop(e, (node as go.Node).containingGroup),
          fromLinkable: true,
          toLinkable: true
    },
    $(go.Shape, 'RoundedRectangle', 
      { stroke: null, strokeWidth: 0 }
    ).bind('fill', 'color'),
    $(go.TextBlock, { margin: 8, editable: true, font: '13px Lora, serif' })
      .bind('text')
  );

    this.myDiagram.linkTemplate =
      $(go.Link,
        {
          routing: go.Link.AvoidsNodes,
          curve: go.Link.JumpOver,
          corner: 5,
          relinkableFrom: true,
          relinkableTo: true,
          selectable: true
        },
        $(go.Shape, { stroke: 'gray', strokeWidth: 2 }),
        $(go.Shape, { toArrow: 'Standard', stroke: null, fill: 'gray' })
      );

      this.myDiagram.linkTemplateMap.add('dashed',
        $(go.Link, {
            routing: go.Link.AvoidsNodes, 
            corner: 5, 
            relinkableFrom: true, 
            relinkableTo: true, 
            reshapable: true, 
            adjusting: go.Link.Stretch
          },
          $(go.Shape, { stroke: 'gray', strokeDashArray: [4,2] }) // Línea punteada sin texto
        )
      );
      

     this.myDiagram.linkTemplateMap.add('access',
        $(go.Link, { routing: go.Link.AvoidsNodes, corner: 5, relinkableFrom: true, relinkableTo: true, reshapable:true, adjusting: go.Link.Stretch},
          $(go.Shape, {stroke: 'green', strokeDashArray: [4,2]}),
          $(go.Shape, {toArrow: 'OpenTriangle', stroke: 'green'}),
          $(go.TextBlock, '<<access>>', {segmentFraction: 0.5, segmentOffset: new go.Point(-20, -10), font: "bold 20px sans-serif", stroke: "green", editable: true})
        )
      );
    
      this.myDiagram.linkTemplateMap.add('import',
        $(go.Link, { routing: go.Link.AvoidsNodes, corner: 5, relinkableFrom: true, relinkableTo: true, reshapable:true, adjusting: go.Link.Stretch},
          $(go.Shape, {stroke: 'green', strokeDashArray: [4,2]}),
          $(go.Shape, {toArrow: 'OpenTriangle', stroke: 'green'}),
          $(go.TextBlock, '<<import>>', {segmentFraction: 0.5, segmentOffset: new go.Point(-20, -10), font: "bold 20px sans-serif", stroke: "green", editable: true})
        )
      );


  this.myDiagram.addDiagramListener('ExternalObjectsDropped', (e) => {
    e.subject.each((part: go.Part) => {
      if (part.category === 'ArrowNode') {
        // Convertir nodo en Link
        const model = this.myDiagram.model as go.GraphLinksModel;
        model.removeNodeData(part.data); // Eliminar el nodo de la flecha
  
        // Crear un enlace con una posición inicial
        model.addLinkData({ from: '', to: '' });
      } else if (part instanceof go.Group) { 
          const model = this.myDiagram.model as go.GraphLinksModel;
          model.setDataProperty(part.data, "text", "Paquete " + this.packageCounter++);
        }
      }
    );
  }); 
  
  
  /** TEMPLATE PARA GRUPOS **/
  this.myDiagram.groupTemplate = $(go.Group, 'Auto',
    {
      background: 'skyblue',
      ungroupable: true,
      layout: $(go.GridLayout, { wrappingColumn: Infinity, cellSize: new go.Size(1, 1), spacing: new go.Size(5, 5) }),
      mouseDragEnter: (e: go.InputEvent, grp: go.GraphObject, prev: go.GraphObject) => this.highlightGroup(e, grp as go.Group, true),
      mouseDragLeave: (e: go.InputEvent, grp: go.GraphObject, next: go.GraphObject) => this.highlightGroup(e, grp as go.Group, false),
      mouseDrop: (e: go.InputEvent, grp: go.GraphObject) => this.finishDrop(e, grp as go.Group),
      isSubGraphExpanded: true // Permite expansión por defecto
    },
    $(go.Panel, "Auto",
      $(go.Shape, // Simulación de carpeta
        {
          figure: "RoundedRectangle",
          fill: "#F5F5DC", // Color beige claro (similar a una carpeta)
          stroke: "#D4AF37", // Borde dorado
          strokeWidth: 2,
          spot1: go.Spot.TopLeft,
          spot2: go.Spot.BottomRight
        }
      ),
      $(go.Panel, "Vertical",
        $(go.Panel, "Horizontal", { stretch: go.Stretch.Horizontal },
          $(go.TextBlock, {
            editable: true,
            font: "bold 14px Lora, serif",
            stroke: "#5C4033", // Color marrón oscuro
            margin: new go.Margin(5, 0, 5, 10)
          }).bind("text"),
          $("SubGraphExpanderButton", { alignment: go.Spot.Right })
        ),
        $(go.Placeholder, { padding: 10 }) // Contenedor para los elementos dentro del grupo
      )
    )
    //   $(go.Shape, 'Rectangle', { stroke: '#59524c', strokeWidth: 1 })
    //  .bind('fill', 'color'), // Ahora usará la propiedad `color` del modelo  
    // $(go.Panel, 'Vertical',
    //   $(go.Panel, 'Horizontal', { stretch: go.Stretch.Horizontal },
    //     $(go.TextBlock, { editable: true, font: 'bold 16px Lora, serif' })
    //       .bind('text'),
    //     $('SubGraphExpanderButton', { alignment: go.Spot.Right })
    //   ),
    //   $(go.Placeholder, { padding: 10 })
    // )
  );
// ...existing code...
    /** CONFIGURAR MODELO DE LA PALETA **/
    this.myPalette.model = new go.GraphLinksModel([
      { text: 'Nodo', color: '#ACE600', clave: 'nodo' },  
      { text: 'Clase', color: '#FF0000', clave: 'clase' },
      { text: 'Componente', color: '#0000FF', key: 'component' },                                                 
      { isGroup: true, text: 'Paquete ' + this.packageCounter++, horiz: 'true', color: '#FFDD33',clave: 'paquete' } ,    
    ]);

    /** EVENTOS PARA SLIDER **/
    this.levelSlider.nativeElement.addEventListener('change', () => this.reexpand());
    this.levelSlider.nativeElement.addEventListener('input', () => this.reexpand());
    this.levelSlider.nativeElement.addEventListener('input', () => this.reexpand());

    this.load();
  }

  /** RESALTAR GRUPOS AL ARRASTRAR **/
  highlightGroup(e: go.InputEvent, grp: go.Group, show: boolean): void {
    if (!grp) return;
    e.handled = true;
    grp.isHighlighted = show;
  }

  /** AGRUPAR ELEMENTOS AL SOLTAR **/
  finishDrop(e: go.InputEvent, grp: go.Group | null): void {
    const ok = grp ? grp.addMembers(grp.diagram!.selection, true) : e.diagram.commandHandler.addTopLevelParts(e.diagram.selection, true);
    if (!ok) e.diagram.currentTool.doCancel();
    this.updateTotalGroupDepth();
  }

  /** EXPANDIR GRUPOS SEGÚN SLIDER **/
  reexpand(): void {
    const level = parseInt(this.levelSlider.nativeElement.value);
    this.myDiagram.commit(diag => {
      diag.findTopLevelGroups().each(g => this.expandGroups(g, 0, level));
    }, 'reexpand');
  }

  expandGroups(g: go.Part, i: number, level: number): void {
    if (!(g instanceof go.Group)) return;
    g.isSubGraphExpanded = i < level;
    g.memberParts.each(m => this.expandGroups(m, i + 1, level));
  }

  /** ACTUALIZAR PROFUNDIDAD DE LOS GRUPOS **/
  updateTotalGroupDepth(): void {
    let d = 0;
    this.myDiagram.findTopLevelGroups().each(g => d = Math.max(d, this.groupDepth(g)));
    this.levelSlider.nativeElement.max = Math.max(0, d);
  }

  groupDepth(g: go.Part): number {
    if (!(g instanceof go.Group)) return 0;
    let d = 1;
    g.memberParts.each(m => d = Math.max(d, this.groupDepth(m) + 1));
    return d;
  }

  /** GUARDAR Y CARGAR MODELO **/
  save(): void {
    (document.getElementById('mySavedModel') as HTMLTextAreaElement).value = this.myDiagram.model.toJson();
    this.myDiagram.isModified = false;
  }

  load(): void {
    this.myDiagram.model = go.Model.fromJson((document.getElementById('mySavedModel') as HTMLTextAreaElement).value);
  }

  toggleRelationshipMode(): void {
    this.relationshipMode = !this.relationshipMode;
    this.myDiagram.toolManager.linkingTool.isEnabled = this.relationshipMode;
  }

  inclusionAccess() {
    this.tipoRelacion = 'access';
    this.myDiagram.toolManager.linkingTool.isEnabled = false; // Habilita la herramienta de enlace
  
    // Configura el prototipo del enlace
    this.myDiagram.toolManager.linkingTool.archetypeLinkData = { 
      category: 'access', 
      text: 'Access'  // Opcional: puedes definir un texto por defecto
    };
  
    console.log("Modo de acceso activado");
  }
  
  inclusionImport() {
    this.tipoRelacion = 'import';
    this.myDiagram.toolManager.linkingTool.isEnabled = false; // Habilita la herramienta de enlace
  
    // Configura el prototipo del enlace
    this.myDiagram.toolManager.linkingTool.archetypeLinkData = { 
      category: 'import', 
      text: 'Import'  // Opcional: puedes definir un texto por defecto
    };
  
    console.log("Modo de importe activado");

  }

  setLinkType(type: string) {
    this.tipoRelacion = type;
    this.myDiagram.toolManager.linkingTool.isEnabled = true; // Habilita la herramienta de enlace
  
    let linkData: any = { category: type }; // Define la categoría según el tipo
    
    // Si es una línea normal sin texto, no se agrega el texto
    if (type === "dashed") {
      linkData = { category: "dashed" };
    }
  
    this.myDiagram.toolManager.linkingTool.archetypeLinkData = linkData;
    
    console.log(`Modo de relación activado: ${type}`);
  }
  
  deleteSelection() {
    const selected = this.myDiagram.selection;
    
    if (selected.count > 0) {
      this.myDiagram.startTransaction("delete");
      selected.each(part => this.myDiagram.remove(part));
      this.myDiagram.commitTransaction("delete");
      
      console.log("Elemento eliminado");
    } else {
      console.log("No hay nada seleccionado para eliminar");
    }
  }

}



