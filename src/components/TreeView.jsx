import { useState } from "react"

function TreeNode({ node, depth, selected, setSelected, tree, setTree, onAddPage, onAddFolder, onRename, onDelete }) {
  const [isOpen, setIsOpen] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  const isFolder = node.type === "container"
  const isSelected = selected && selected.id === node.id

  function handleClick() {
    if (isFolder) setIsOpen(!isOpen)
    else setSelected(node)
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
        <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {node.name}
        </span>

        <button
          className="dots-btn"
          onClick={function(e) { e.stopPropagation(); setShowMenu(!showMenu) }}
        >⋯</button>

        {showMenu && (
          <div className="popup" onClick={function(e) { e.stopPropagation() }}>
            {isFolder && (
              <>
                <button className="popup-btn" onClick={function(e) { e.stopPropagation(); onAddPage(node.id); setShowMenu(false) }}>➕ Add Page</button>
                <button className="popup-btn" onClick={function(e) { e.stopPropagation(); onAddFolder(node.id); setShowMenu(false) }}>➕ Add Collection</button>
                <div className="popup-divider"></div>
              </>
            )}
            <button className="popup-btn" onClick={function(e) { e.stopPropagation(); onRename(node.id, node.name); setShowMenu(false) }}>✏️ Rename</button>
            <button className="popup-btn danger" onClick={function(e) { e.stopPropagation(); onDelete(node.id); setShowMenu(false) }}>🗑️ Delete</button>
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
            onAddPage={onAddPage}
            onAddFolder={onAddFolder}
            onRename={onRename}
            onDelete={onDelete}
          />
        )
      })}
    </div>
  )
}

export default function TreeView({ visibleNodes, search, setSearch, selected, setSelected, tree, setTree, onAddPage, onAddFolder, onRename, onDelete, onAddRoot }) {
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
        <button className="add-btn" onClick={onAddRoot} title="Add collection">+</button>
      </div>
      <div className="tree-list">
        {visibleNodes.map(function(node) {
          return (
            <TreeNode
              key={node.id}
              node={node}
              depth={0}
              selected={selected}
              setSelected={setSelected}
              tree={tree}
              setTree={setTree}
              onAddPage={onAddPage}
              onAddFolder={onAddFolder}
              onRename={onRename}
              onDelete={onDelete}
            />
          )
        })}
      </div>
    </div>
  )
}