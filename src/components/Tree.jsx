import { useState } from "react"
import { v4 as uuid } from "uuid"

function addNode(tree, parentId, newNode) {
  return tree.map(n => {
    if (n.id === parentId) return { ...n, children: [...n.children, newNode] }
    return { ...n, children: addNode(n.children, parentId, newNode) }
  })
}

function deleteNode(tree, id) {
  return tree
    .filter(n => n.id !== id)
    .map(n => ({ ...n, children: deleteNode(n.children, id) }))
}

function renameNode(tree, id, name) {
  return tree.map(n => {
    if (n.id === id) return { ...n, name }
    return { ...n, children: renameNode(n.children, id, name) }
  })
}

function Node({ node, depth, selected, setSelected, tree, setTree }) {
  const [open, setOpen] = useState(false)
  const [menu, setMenu] = useState(false)
  const isFolder = node.type === "container"
  const isActive = selected?.id === node.id

  function handleClick() {
    if (isFolder) setOpen(!open)
    else setSelected(node)
  }

  function addPage(e) {
    e.stopPropagation()
    setTree(addNode(tree, node.id, { id: uuid(), name: "New Page", type: "leaf", content: "", children: [] }))
    setOpen(true)
    setMenu(false)
  }

  function addFolder(e) {
    e.stopPropagation()
    setTree(addNode(tree, node.id, { id: uuid(), name: "New Collection", type: "container", content: "", children: [] }))
    setOpen(true)
    setMenu(false)
  }

  function rename(e) {
    e.stopPropagation()
    const name = prompt("New name:", node.name)
    if (name) setTree(renameNode(tree, node.id, name))
    setMenu(false)
  }

  function remove(e) {
    e.stopPropagation()
    if (confirm("Delete " + node.name + "?")) {
      setTree(deleteNode(tree, node.id))
      setSelected(null)
    }
    setMenu(false)
  }

  return (
    <div>
      <div
        onClick={handleClick}
        style={{
          display: "flex", alignItems: "center", gap: 6,
          paddingLeft: 10 + depth * 16, paddingRight: 8, height: 34,
          cursor: "pointer", fontSize: 13, position: "relative",
          background: isActive ? "#dbeafe" : "transparent",
          color: isActive ? "#1d4ed8" : "#333",
          borderRight: isActive ? "3px solid #1d4ed8" : "3px solid transparent",
        }}
        onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "#f3f4f6" }}
        onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent" }}
      >
        <span style={{ fontSize: 9, width: 10, color: "#aaa" }}>{isFolder ? (open ? "▼" : "▶") : ""}</span>
        <span>{isFolder ? (open ? "📂" : "📁") : "📄"}</span>
        <span style={{ flex: 1 }}>{node.name}</span>
        <button onClick={e => { e.stopPropagation(); setMenu(!menu) }}
          style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "#aaa" }}>⋯</button>

        {menu && (
          <div onClick={e => e.stopPropagation()} style={{
            position: "absolute", right: 8, top: 34, zIndex: 99,
            background: "#fff", border: "1px solid #ddd",
            borderRadius: 6, boxShadow: "0 4px 10px rgba(0,0,0,0.1)", padding: 4, minWidth: 150
          }}>
            {isFolder && <>
              <Btn onClick={addPage}>➕ Add Page</Btn>
              <Btn onClick={addFolder}>➕ Add Collection</Btn>
              <hr style={{ margin: "3px 0", border: "none", borderTop: "1px solid #eee" }} />
            </>}
            <Btn onClick={rename}>✏️ Rename</Btn>
            <Btn onClick={remove} color="red">🗑️ Delete</Btn>
          </div>
        )}
      </div>

      {isFolder && open && node.children.map(child => (
        <Node key={child.id} node={child} depth={depth + 1}
          selected={selected} setSelected={setSelected} tree={tree} setTree={setTree} />
      ))}
    </div>
  )
}

function Btn({ onClick, children, color }) {
  return (
    <button onClick={onClick} style={{
      display: "block", width: "100%", textAlign: "left",
      padding: "6px 10px", fontSize: 13, background: "none",
      border: "none", cursor: "pointer", borderRadius: 4, color: color || "#333"
    }}
      onMouseEnter={e => e.target.style.background = "#f3f4f6"}
      onMouseLeave={e => e.target.style.background = "none"}
    >{children}</button>
  )
}

export default function Tree({ tree, setTree, selected, setSelected }) {
  const [search, setSearch] = useState("")

  function addRoot() {
    setTree([...tree, { id: uuid(), name: "New Collection", type: "container", content: "", children: [] }])
  }

  function filter(nodes, text) {
    if (!text) return nodes
    return nodes.reduce((acc, n) => {
      if (n.name.toLowerCase().includes(text.toLowerCase())) return [...acc, n]
      const kids = filter(n.children, text)
      if (kids.length) return [...acc, { ...n, children: kids }]
      return acc
    }, [])
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ padding: 10, borderBottom: "1px solid #eee" }}>
        <input placeholder="🔍 Search..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ width: "100%", padding: "6px 10px", border: "1px solid #ddd", borderRadius: 6, fontSize: 13, outline: "none" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px" }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: "#aaa" }}>WORKSPACE</span>
        <button onClick={addRoot} style={{ fontSize: 20, background: "none", border: "none", cursor: "pointer", color: "#aaa" }}>+</button>
      </div>
      <div style={{ flex: 1, overflowY: "auto" }}>
        {filter(tree, search).map(n => (
          <Node key={n.id} node={n} depth={0} selected={selected} setSelected={setSelected} tree={tree} setTree={setTree} />
        ))}
      </div>
    </div>
  )
}