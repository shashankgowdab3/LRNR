import { useState, useEffect } from "react"
import Tree from "./components/Tree"
import Editor from "./components/Editor"

const DEFAULT_TREE = [
  {
    id: "1", name: "Collection 1", type: "container", content: "", children: [
      { id: "2", name: "Page 1", type: "leaf", content: "", children: [] },
      { id: "3", name: "Page 2", type: "leaf", content: "", children: [] },
    ]
  },
  { id: "4", name: "Collection 2", type: "container", content: "", children: [] },
]

function updateContent(nodes, id, value) {
  return nodes.map(n => {
    if (n.id === id) return { ...n, content: value }
    return { ...n, children: updateContent(n.children, id, value) }
  })
}

export default function App() {
  const [tree, setTree] = useState([])
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem("tree")
    setTree(saved ? JSON.parse(saved) : DEFAULT_TREE)
  }, [])

  useEffect(() => {
    if (tree.length > 0) localStorage.setItem("tree", JSON.stringify(tree))
  }, [tree])

  function handleChange(value) {
    if (!selected) return
    setTree(prev => updateContent(prev, selected.id, value))
    setSelected(prev => ({ ...prev, content: value }))
  }

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "Arial" }}>

      <div style={{ width: "30%", borderRight: "1px solid #ccc", overflow: "auto" }}>
        <Tree tree={tree} setTree={setTree} selected={selected} setSelected={setSelected} />
      </div>

      <div style={{ width: "70%", overflow: "auto" }}>
        <Editor selected={selected} onChange={handleChange} />
      </div>

    </div>
  )
}