import React from 'react'
import { NotionBlock } from './NotionBlock'
import type { NotionBlock as NotionBlockType } from '../../lib/types/notion'

interface NotionRendererProps {
  blocks: NotionBlockType[]
  className?: string
  maxBlocks?: number
}

export function NotionRenderer({
  blocks,
  className = '',
  maxBlocks
}: NotionRendererProps) {
  if (!blocks || blocks.length === 0) {
    return (
      <div className={`notion-empty ${className}`}>
        <p className="text-gray-500 italic">Kein Inhalt verfügbar</p>
      </div>
    )
  }

  const blocksToRender = maxBlocks ? blocks.slice(0, maxBlocks) : blocks

  return (
    <div className={`notion-content space-y-4 ${className}`}>
      {blocksToRender.map((block) => (
        <NotionBlock key={block.id} block={block} />
      ))}
      {maxBlocks && blocks.length > maxBlocks && (
        <div className="text-center mt-8">
          <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            Mehr lesen
          </button>
        </div>
      )}
    </div>
  )
}