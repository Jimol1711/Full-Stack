import React, { useState } from "react";

type FolderColor = "yellow" | "blue" | "pink";

type ModuleNode = {
  id: string;
  label: string;
  color: FolderColor;
  children?: ModuleNode[];
};

const MODULE_TREE: ModuleNode[] = [
  {
    id: "registro",
    label: "Registro de Operaciones",
    color: "yellow",
    children: [
      {
        id: "registro-compras",
        label: "Compras",
        color: "yellow",
        children: [
          {
            id: "registro-compras-orden",
            label: "Orden de Compra",
            color: "yellow",
          },
        ],
      },
      {
        id: "registro-bodega",
        label: "Bodega",
        color: "yellow",
        children: [
          {
            id: "registro-bodega-mezclas",
            label: "Mezclas y Componentes",
            color: "yellow",
          },
        ],
      },
    ],
  },
  {
    id: "inf-op",
    label: "Informes Operacionales",
    color: "blue",
    children: [
      {
        id: "inf-op-fact",
        label: "Facturación",
        color: "blue",
        children: [
          {
            id: "inf-op-fact-cotizaciones",
            label: "Cotizaciones",
            color: "blue",
          },
        ],
      },
      {
        id: "inf-op-compras",
        label: "Compras",
        color: "blue",
        children: [
          {
            id: "inf-op-compras-dtes",
            label: "DTEs",
            color: "blue",
          },
          {
            id: "inf-op-compras-import",
            label: "Importaciones",
            color: "blue",
          },
        ],
      },
      {
        id: "inf-op-banco",
        label: "Banco",
        color: "blue",
        children: [
          {
            id: "inf-op-banco-finanzas",
            label: "Finanzas",
            color: "blue",
            children: [
              {
                id: "inf-op-banco-finanzas-saldos",
                label: "Saldos",
                color: "blue",
              },
              {
                id: "inf-op-banco-finanzas-venc",
                label: "Vencimientos",
                color: "blue",
              },
            ],
          },
        ],
      },
      {
        id: "inf-op-bodega",
        label: "Bodega",
        color: "blue",
        children: [
          { id: "inf-op-bodega-compras", label: "Compras", color: "blue" },
          {
            id: "inf-op-bodega-consumos",
            label: "Consumos y Producción",
            color: "blue",
          },
          { id: "inf-op-bodega-siembras", label: "Siembras", color: "blue" },
          { id: "inf-op-bodega-stocks", label: "Stocks", color: "blue" },
          {
            id: "inf-op-bodega-estructurales",
            label: "Estructurales",
            color: "blue",
          },
        ],
      },
      { id: "inf-op-lecheria", label: "Lechería", color: "blue" },
      {
        id: "inf-op-rem",
        label: "Remuneraciones",
        color: "blue",
        children: [
          {
            id: "inf-op-rem-inf-anuales",
            label: "Informes anuales",
            color: "blue",
          },
        ],
      },
    ],
  },
  {
    id: "inf-contables",
    label: "Informes Contables",
    color: "blue",
    children: [
      { id: "inf-contables-balances", label: "Balances", color: "blue" },
      { id: "inf-contables-kardex", label: "Kardex", color: "blue" },
      { id: "inf-contables-tributarios", label: "Tributarios", color: "blue" },
    ],
  },
  {
    id: "experimentales",
    label: "Experimentales y viejos",
    color: "pink",
    children: [
      {
        id: "experimentales-rem-2021",
        label: "Remuneraciones 2021",
        color: "pink",
        children: [
          {
            id: "experimentales-rem-2021-inf-anuales",
            label: "Inf. Anuales",
            color: "pink",
          },
        ],
      },
    ],
  },
  {
    id: "extra-root",
    label: "Nuevo módulo (ejemplo)",
    color: "yellow",
    children: [
      {
        id: "extra-child",
        label: "Submódulo de prueba",
        color: "blue",
      },
    ],
  }, // ← Ejemplo: así agregas un nuevo módulo con un submódulo.
];

function findNodeById(nodes: ModuleNode[], id: string | null): ModuleNode | null {
  if (!id) return null;
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findNodeById(node.children, id);
      if (found) return found;
    }
  }
  return null;
}

function App() {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    () => new Set<string>(MODULE_TREE.map((n) => n.id)) // top-level expanded
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSelect = (id: string) => {
    setSelectedId(id);
  };

  const renderNode = (node: ModuleNode, level: number): React.ReactNode => {
    const hasChildren = !!(node.children && node.children.length > 0);
    const isExpanded = expandedIds.has(node.id);
    const isSelected = selectedId === node.id;

    return (
      <div key={node.id}>
        <div
          className={
            "aml-tree-row" + (isSelected ? " aml-tree-row-selected" : "")
          }
          style={{ paddingLeft: 8 + level * 16 }}
          onClick={() => handleSelect(node.id)}
        >
          <span
            className="aml-tree-toggle"
            onClick={(e) => {
              e.stopPropagation();
              if (hasChildren) handleToggle(node.id);
            }}
          >
            {hasChildren ? (isExpanded ? "−" : "+") : ""}
          </span>
          <span className={`aml-tree-icon aml-tree-icon-${node.color}`} />
          <span className="aml-tree-label">{node.label}</span>
        </div>
        {hasChildren && isExpanded && (
          <div>{node.children!.map((child) => renderNode(child, level + 1))}</div>
        )}
      </div>
    );
  };

  const selectedNode = findNodeById(MODULE_TREE, selectedId);

  return (
    <div className="aml-root">
      {/* 1) Top menu bar */}
      <div className="aml-menubar">
        <button className="aml-menubar-item" type="button">
          Archivo
        </button>
        <button className="aml-menubar-item" type="button">
          Ver
        </button>
        <button className="aml-menubar-item" type="button">
          Utilidades
        </button>
        <button className="aml-menubar-item" type="button">
          Ayuda
        </button>
      </div>

      {/* 2) Toolbar */}
      <div className="aml-toolbar">
        <button className="aml-toolbar-button" type="button">
          Memos
        </button>
        <button className="aml-toolbar-button" type="button">
          DirAtras
        </button>
        <button className="aml-toolbar-button" type="button">
          Ayuda
        </button>
      </div>

      {/* 3) Title bar */}
      <div className="aml-titlebar">Agrícola Molina Larraín Ltda.</div>

      {/* 4) Main area: left tree + right panel */}
      <div className="aml-main">
        <div className="aml-main-inner">
          <div className="aml-sidebar">
            <div className="aml-sidebar-header">Menú</div>
            <div className="aml-tree-root">
              {MODULE_TREE.map((node) => renderNode(node, 0))}
            </div>
          </div>

          <div className="aml-panel">
            {selectedNode ? (
              <>
                <h2 className="aml-panel-title">{selectedNode.label}</h2>
                <p className="aml-panel-placeholder">
                  Aquí irá el contenido del módulo seleccionado.
                </p>
              </>
            ) : (
              <p className="aml-panel-placeholder">
                Selecciona un módulo en el panel izquierdo.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
