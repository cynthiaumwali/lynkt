import { Suspense } from "react"
import EditorClient from "../../../components/editor/EditorClient"

export default function EditorPage() {
  return (
    <Suspense fallback={<div>Loading editor…</div>}>
      <EditorClient />
    </Suspense>
  )
}
