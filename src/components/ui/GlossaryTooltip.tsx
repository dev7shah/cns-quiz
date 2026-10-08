"use client"
import * as React from "react"

export function GlossaryTooltip({
  term,
  definition,
  children
}: {
  term: string
  definition: string
  children?: React.ReactNode
}) {
  const [open, setOpen] = React.useState(false)

  return (
    <span
      className="relative inline-block"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      <span className="border-b border-dashed border-ink/60 cursor-help">
        {children || term}
      </span>
      {open && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 text-sm bg-ink text-paper rounded-[4px] shadow-lg shadow-rule font-sans">
          <strong className="block font-semibold mb-1">{term}</strong>
          <span className="opacity-90 leading-tight">{definition}</span>
        </div>
      )}
    </span>
  )
}
