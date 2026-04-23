import { useState, useEffect } from "react"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"

export default function Editor({ selected, onChange }) {
  const [value, setValue] = useState("")

  useEffect(() => {
    setValue(selected?.content || "")
  }, [selected?.id])

  function handleChange(val) {
    setValue(val)
    onChange(val)
  }

  if (!selected) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#aaa", flexDirection: "column", gap: 10 }}>
      <span style={{ fontSize: 48 }}>📄</span>
      <p>Select a page from the left</p>
    </div>
  )

  if (selected.type === "container") return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#aaa", flexDirection: "column", gap: 10 }}>
      <span style={{ fontSize: 48 }}>📁</span>
      <p>This is a folder — click a page inside it</p>
    </div>
  )

  return (
    <div style={{ padding: "30px 40px" }}>
      <h2 style={{ marginBottom: 20 }}>{selected.name}</h2>
      <ReactQuill theme="snow" value={value} onChange={handleChange} />
    </div>
  )
}