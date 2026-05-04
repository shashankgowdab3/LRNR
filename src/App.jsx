import { useState, useEffect } from "react"
import Tree from "./components/Tree"
import Editor from "./components/Editor"
import "./styles.css"

const DEFAULT_TREE = [
  {
    id: "1", name: "collection.1", type: "container", content: "", children: [
      {
        id: "2", name: "collection.1.1", type: "container", content: "", children: [
          {
            id: "3", name: "collection.1.1.1", type: "container", content: "", children: [
              { id: "4", name: "Content Page", type: "leaf", content: "<p>Start writing!</p>", children: [] },
              { id: "5", name: "Quiz", type: "leaf", content: "", children: [] },
              { id: "6", name: "Videos", type: "leaf", content: "", children: [] },
              { id: "7", name: "WYSIWYG Editor", type: "leaf", content: "<h2>Welcome</h2><p>Select any page to edit.</p>", children: [] },
            ]
          }
        ]
      }
    ]
  },
  { id: "8", name: "collection.2", type: "container", content: "", children: [] },
  { id: "9", name: "collection.3", type: "container", content: "", children: [] },
]

function updateContent(nodes, id, value) {
  return nodes.map(function(node) {
    if (node.id === id) return { ...node, content: value }
    return { ...node, children: updateContent(node.children, id, value) }
  })
}

export default function App() {
  const [tree, setTree] = useState([])
  const [selected, setSelected] = useState(null)
  const [darkMode, setDarkMode] = useState(false)
  const [activeTab, setActiveTab] = useState("All")
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(function() {
    const saved = localStorage.getItem("tree")   // changed var to const
    setTree(saved ? JSON.parse(saved) : DEFAULT_TREE)
  }, [])

  useEffect(function() {
    if (tree.length > 0) localStorage.setItem("tree", JSON.stringify(tree))
  }, [tree])

  function handleEditorChange(value) {
    if (!selected) return
    setTree(function(prev) { return updateContent(prev, selected.id, value) })
    setSelected(function(prev) { return { ...prev, content: value } })
  }

  return (
    <div className={darkMode ? "app dark" : "app"}>

      <div className="topbar">
        <div className="topbar-left">
          <button className="hamburger" onClick={function() { setSidebarOpen(!sidebarOpen) }}>☰</button>
          <div>
            {["All", "Board", "Graph", "Recent"].map(function(tab) {
              return (
                <button
                  key={tab}
                  className={activeTab === tab ? "tab active" : "tab"}
                  onClick={function() { setActiveTab(tab) }}
                >{tab}</button>
              )
            })}
          </div>
        </div>

        <span className="breadcrumb">
          {selected ? selected.name : ""}
        </span>

        <div className="topbar-right">
          <button className="invite-btn">👥 Invite Member</button>
          <button className="darkmode-btn" onClick={function() { setDarkMode(!darkMode) }}>
            {darkMode ? "☀️" : "🌙"}
          </button>
          <div className="avatar">
            FL
            <span className="avatar-badge">NEW</span>
          </div>
        </div>
      </div>

      <div className="body">
        {sidebarOpen && (
          <div className="sidebar">
            <Tree tree={tree} setTree={setTree} selected={selected} setSelected={setSelected} />
          </div>
        )}
        <div className="main">
          {activeTab === "Graph" ? (
            <div className="graph-view">
              <span style={{ fontSize: 52 }}>🕸️</span>
              <p style={{ fontWeight: 600, color: "#777" }}>Graph View</p>
            </div>
          ) : (
            <Editor selected={selected} onChange={handleEditorChange} />
          )}
        </div>
      </div>

    </div>
  )
}