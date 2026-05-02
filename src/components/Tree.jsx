import { useState } from "react"
import { v4 as uuid } from "uuid"

function addNode(tree, parentId, newNode) {
  return tree.map(function(node) {
    if (node.id === parentId) return { ...node, children: [...node.children, newNode] }
    return { ...node, children: addNode(node.children, parentId, newNode) }
  })
}

function deleteNode(tree, id) {
  return tree
    .filter(function(node) { return node.id !== id })
    .map(function(node) { return { ...node, children: deleteNode(node.children, id) } })
}

function renameNode(tree, id, name) {
  return tree.map(function(node) {
    if (node.id === id) return { ...node, name: name }
    return { ...node, children: renameNode(node.children, id, name) }
  })
}

function TreeNode({ node, depth, selected, setSelected, tree, setTree }) {
  const [isOpen, setIsOpen] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  var isFolder = node.type === "container"
  var isSelected = selected && selected.id === node.id

  function handleClick() {
    if (isFolder) setIsOpen(!isOpen)
    else setSelected(node)
  }

  function handleAddPage(e) {
    e.stopPropagation()
    setTree(addNode(tree, node.id, { id: uuid(), name: "New Page", type: "leaf", content: "", children: [] }))
    setIsOpen(true)
    setShowMenu(false)
  }

  function handleAddFolder(e) {
    e.stopPropagation()
    setTree(addNode(tree, node.id, { id: uuid(), name: "New Collection", type: "container", content: "", children: [] }))
    setIsOpen(true)
    setShowMenu(false)
  }

  function handleRename(e) {
    e.stopPropagation()
    var name = prompt("New name:", node.name)
    if (name && name.trim()) setTree(renameNode(tree, node.id, name.trim()))
    setShowMenu(false)
  }

  function handleDelete(e) {
    e.stopPropagation()
    if (confirm("Delete " + node.name + "?")) {
      setTree(deleteNode(tree, node.id))
      if (selected && selected.id === node.id) setSelected(null)
    }
    setShowMenu(false)
  }

  return (
    <div>
      <div
        className={isSelected ? "tree-row selected" : "tree-row"}
        style={{ paddingLeft: 10 + depth * 16 }}
        onClick={handleClick}
      >
        <span className="arrow">{isFolder ? (isOpen ? "▼" : "▶") : ""}</span>
        <span>{isFolder ? (isOpen ? "📂" : "📁") : "📄"}</span>
        <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{node.name}</span>

        <button
          className="dots-btn"
          onClick={function(e) { e.stopPropagation(); setShowMenu(!showMenu) }}
        >⋯</button>

        {showMenu && (
          <div className="popup" onClick={function(e) { e.stopPropagation() }}>
            {isFolder && (
              <>
                <button className="popup-btn" onClick={handleAddPage}>➕ Add Page</button>
                <button className="popup-btn" onClick={handleAddFolder}>➕ Add Collection</button>
                <div className="popup-divider"></div>
              </>
            )}
            <button className="popup-btn" onClick={handleRename}>✏️ Rename</button>
            <button className="popup-btn danger" onClick={handleDelete}>🗑️ Delete</button>
          </div>
        )}
      </div>

      {isFolder && isOpen && node.children.map(function(child) {
        return (
          <TreeNode
            key={child.id}
            node={child}
            depth={depth + 1}
            selected={selected}
            setSelected={setSelected}
            tree={tree}
            setTree={setTree}
          />
        )
      })}
    </div>
  )
}

export default function Tree({ tree, setTree, selected, setSelected }) {
  const [search, setSearch] = useState("")

  function addRootCollection() {
    setTree([...tree, { id: uuid(), name: "New Collection", type: "container", content: "", children: [] }])
  }

  function filterTree(nodes, text) {
    if (!text) return nodes
    return nodes.reduce(function(acc, node) {
      if (node.name.toLowerCase().includes(text.toLowerCase())) return [...acc, node]
      var kids = filterTree(node.children, text)
      if (kids.length) return [...acc, { ...node, children: kids }]
      return acc
    }, [])
  }

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div className="search-area">
        <input
          className="search-input"
          placeholder="🔍 Search..."
          value={search}
          onChange={function(e) { setSearch(e.target.value) }}
        />
      </div>
      <div className="workspace-header">
        <span className="workspace-label">WORKSPACE</span>
        <button className="add-btn" onClick={addRootCollection} title="Add collection">+</button>
      </div>
      <div className="tree-list">
        {filterTree(tree, search).map(function(node) {
          return (
            <TreeNode
              key={node.id}
              node={node}
              depth={0}
              selected={selected}
              setSelected={setSelected}
              tree={tree}
              setTree={setTree}
            />
          )
        })}
      </div>
    </div>
  )
}