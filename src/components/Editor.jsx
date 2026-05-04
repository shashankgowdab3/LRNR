import { useState, useEffect } from "react"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"

const toolbar = [
  ["bold", "italic", "underline"],
  [{ "header": [1, 2, 3, false] }],
  [{ "list": "ordered" }, { "list": "bullet" }],
  ["link", "blockquote"],
  ["clean"]
]

export default function Editor({ selected, onChange }) {
  const [value, setValue] = useState("")

  useEffect(function() {
    setValue(selected ? selected.content || "" : "")
  }, [selected && selected.id])

  function handleChange(val) {
    setValue(val)
    onChange(val)
  }

  if (!selected) return (
    <div className="empty-state">
      <span className="empty-icon">📄</span>
      <p className="empty-title">Select a page to start editing</p>
      <p className="empty-sub">Click any page from the left panel</p>
    </div>
  )

  if (selected.type === "container") return (
    <div className="empty-state">
      <span className="empty-icon">📁</span>
      <p className="empty-title">This is a collection</p>
      <p className="empty-sub">Select a page inside it to edit</p>
    </div>
  )

  return (
    <div className="editor-area">
      <h2 className="page-title">{selected.name}</h2>
      <div className="title-line"></div>
      <ReactQuill theme="snow" value={value} onChange={handleChange} modules={{ toolbar: toolbar }} placeholder="Start writing..." />
    </div>
  )
}