import { useState, useMemo } from "react"
import { v4 as uuid } from "uuid"
import TreeView from "./TreeView"

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

function filterTree(nodes, text) {
  if (!text) return nodes
  return nodes.reduce(function(acc, node) {
    if (node.name.toLowerCase().includes(text.toLowerCase())) return [...acc, node]
    const kids = filterTree(node.children, text)
    if (kids.length) return [...acc, { ...node, children: kids }]
    return acc
  }, [])
}

export default function TreeContainer({ tree, setTree, selected, setSelected }) {
  const [search, setSearch] = useState("")

  function handleAddPage(parentId) {
    const newPage = { id: uuid(), name: "New Page", type: "leaf", content: "", children: [] }
    setTree(addNode(tree, parentId, newPage))
    setSelected(newPage) // auto select
  }

  function handleAddFolder(parentId) {
    const newFolder = { id: uuid(), name: "New Collection", type: "container", content: "", children: [] }
    setTree(addNode(tree, parentId, newFolder))
  }

  function handleRename(id, currentName) {
    const name = prompt("New name:", currentName)
    if (name && name.trim()) setTree(renameNode(tree, id, name.trim()))
  }

  function handleDelete(id) {
    const confirmed = confirm("Delete this item?")
    if (confirmed) {
      setTree(deleteNode(tree, id))
      if (selected && selected.id === id) setSelected(null)
    }
  }

  function handleAddRoot() {
    const newFolder = { id: uuid(), name: "New Collection", type: "container", content: "", children: [] }
    setTree([...tree, newFolder])
  }

  const visibleNodes = useMemo(function() {
    return filterTree(tree, search)
  }, [tree, search])

  return (
    <TreeView
      visibleNodes={visibleNodes}
      search={search}
      setSearch={setSearch}
      selected={selected}
      setSelected={setSelected}
      tree={tree}
      setTree={setTree}
      onAddPage={handleAddPage}
      onAddFolder={handleAddFolder}
      onRename={handleRename}
      onDelete={handleDelete}
      onAddRoot={handleAddRoot}
    />
  )
}