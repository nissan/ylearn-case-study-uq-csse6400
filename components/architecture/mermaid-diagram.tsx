"use client"

import { useEffect, useRef, useState } from "react"
import mermaid from "mermaid"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Check, ExternalLink } from "lucide-react"

interface MermaidDiagramProps {
  definition: string
  caption?: string
  type?: "flowchart" | "sequence" | "class" | "state" | "er" | "gantt" | "pie" | "c4"
  theme?: "default" | "forest" | "dark" | "neutral"
}

export function MermaidDiagram({ definition, caption, type = "flowchart", theme = "default" }: MermaidDiagramProps) {
  const [svg, setSvg] = useState<string>("")
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: theme,
      securityLevel: "loose",
      logLevel: "error",
    })

    const renderDiagram = async () => {
      try {
        setError(null)
        const { svg } = await mermaid.render("mermaid-diagram", definition)
        setSvg(svg)
      } catch (err) {
        console.error("Mermaid rendering error:", err)
        setError("Failed to render diagram. Please check your syntax.")
      }
    }

    renderDiagram()
  }, [definition, theme])

  const copyDiagramCode = () => {
    navigator.clipboard.writeText(definition)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Create a URL for mermaid.live with our diagram code
  const mermaidLiveUrl = `https://mermaid.live/edit#${encodeURIComponent(definition)}`

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex items-center justify-between p-4 bg-muted/50">
          <div className="text-sm font-medium">
            {caption || `${type.charAt(0).toUpperCase() + type.slice(1)} Diagram`}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <a href={mermaidLiveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                <span>Edit Live</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
            <Button variant="outline" size="sm" onClick={copyDiagramCode}>
              {copied ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  <span>Copy</span>
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-gray-900 overflow-auto">
          {error ? (
            <div className="text-red-500 p-4 text-sm">{error}</div>
          ) : (
            <div
              ref={containerRef}
              className="mermaid-container flex justify-center"
              dangerouslySetInnerHTML={{ __html: svg }}
            />
          )}
        </div>

        {/* Show the raw code in a collapsible section */}
        <details className="text-xs border-t">
          <summary className="p-2 cursor-pointer hover:bg-muted/50">View Source Code</summary>
          <pre className="p-4 bg-muted/20 overflow-auto whitespace-pre">{definition}</pre>
        </details>
      </CardContent>
    </Card>
  )
}
