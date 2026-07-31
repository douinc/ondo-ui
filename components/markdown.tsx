import React from "react"

interface MarkdownProps {
  children: string
}

export function Markdown({ children }: MarkdownProps) {
  // Simple markdown renderer that handles basic formatting
  const renderMarkdown = (text: string) => {
    const parts: React.ReactNode[] = []
    let lastIndex = 0

    // Pattern to match markdown: **bold**, `code`
    const regex = /\*\*([^*]+)\*\*|`([^`]+)`/g
    let match

    while ((match = regex.exec(text)) !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index))
      }

      // Add the matched element
      if (match[1]) {
        // **bold**
        parts.push(<strong key={match.index}>{match[1]}</strong>)
      } else if (match[2]) {
        // `code`
        parts.push(
          <code key={match.index} className="bg-muted px-1 rounded text-sm font-mono">
            {match[2]}
          </code>
        )
      }

      lastIndex = regex.lastIndex
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex))
    }

    return parts
  }

  return (
    <div className="prose dark:prose-invert text-sm">
      {children.split("\n\n").map((paragraph, i) => (
        <p key={i} className="mb-2 last:mb-0 leading-relaxed">
          {renderMarkdown(paragraph)}
        </p>
      ))}
    </div>
  )
}
