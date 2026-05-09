import { Suspense } from "react"
import EditorClient from "../../components/editor/EditorClient"

export default function EditorPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center">Loading editor…</div>}>
      <EditorClient />
    </Suspense>
  )
}
