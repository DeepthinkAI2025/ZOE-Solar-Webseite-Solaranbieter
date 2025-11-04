import React from 'react'
import { NotionImage } from './NotionImage'
import type { NotionBlock } from '../../lib/types/notion'

interface NotionBlockProps {
  block: NotionBlock
  className?: string
}

export function NotionBlock({ block, className = '' }: NotionBlockProps) {
  const renderBlock = () => {
    switch (block.type) {
      case 'paragraph':
        return (
          <p className="notion-paragraph text-gray-700 leading-relaxed mb-4">
            {block.paragraph.rich_text.map((text: any, index: number) => (
              <span
                key={index}
                className={`
                  ${text.annotations?.bold ? 'font-bold' : ''}
                  ${text.annotations?.italic ? 'italic' : ''}
                  ${text.annotations?.strikethrough ? 'line-through' : ''}
                  ${text.annotations?.underline ? 'underline' : ''}
                  ${text.annotations?.code ? 'bg-gray-100 px-1 py-0.5 rounded text-sm font-mono' : ''}
                  ${text.annotations?.color !== 'default' ? `text-${text.annotations.color}` : ''}
                `}
              >
                {text.href ? (
                  <a
                    href={text.href}
                    className="text-green-600 hover:text-green-800 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {text.text.content}
                  </a>
                ) : (
                  text.text.content
                )}
              </span>
            ))}
          </p>
        )

      case 'heading_1':
        return (
          <h1 className="notion-h1 text-3xl font-bold text-gray-900 mb-4 mt-8">
            {block.heading_1.rich_text.map((text: any, index: number) => (
              <span
                key={index}
                className={`
                  ${text.annotations?.bold ? 'font-bold' : ''}
                  ${text.annotations?.italic ? 'italic' : ''}
                  ${text.annotations?.color !== 'default' ? `text-${text.annotations.color}` : ''}
                `}
              >
                {text.text.content}
              </span>
            ))}
          </h1>
        )

      case 'heading_2':
        return (
          <h2 className="notion-h2 text-2xl font-bold text-gray-900 mb-3 mt-6">
            {block.heading_2.rich_text.map((text: any, index: number) => (
              <span
                key={index}
                className={`
                  ${text.annotations?.bold ? 'font-bold' : ''}
                  ${text.annotations?.italic ? 'italic' : ''}
                  ${text.annotations?.color !== 'default' ? `text-${text.annotations.color}` : ''}
                `}
              >
                {text.text.content}
              </span>
            ))}
          </h2>
        )

      case 'heading_3':
        return (
          <h3 className="notion-h3 text-xl font-bold text-gray-900 mb-2 mt-4">
            {block.heading_3.rich_text.map((text: any, index: number) => (
              <span
                key={index}
                className={`
                  ${text.annotations?.bold ? 'font-bold' : ''}
                  ${text.annotations?.italic ? 'italic' : ''}
                  ${text.annotations?.color !== 'default' ? `text-${text.annotations.color}` : ''}
                `}
              >
                {text.text.content}
              </span>
            ))}
          </h3>
        )

      case 'bulleted_list_item':
        return (
          <li className="notion-bulleted-list-item ml-4 mb-2 list-disc text-gray-700">
            {block.bulleted_list_item.rich_text.map((text: any, index: number) => (
              <span
                key={index}
                className={`
                  ${text.annotations?.bold ? 'font-bold' : ''}
                  ${text.annotations?.italic ? 'italic' : ''}
                  ${text.annotations?.color !== 'default' ? `text-${text.annotations.color}` : ''}
                `}
              >
                {text.href ? (
                  <a
                    href={text.href}
                    className="text-green-600 hover:text-green-800 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {text.text.content}
                  </a>
                ) : (
                  text.text.content
                )}
              </span>
            ))}
          </li>
        )

      case 'numbered_list_item':
        return (
          <li className="notion-numbered-list-item ml-4 mb-2 list-decimal text-gray-700">
            {block.numbered_list_item.rich_text.map((text: any, index: number) => (
              <span
                key={index}
                className={`
                  ${text.annotations?.bold ? 'font-bold' : ''}
                  ${text.annotations?.italic ? 'italic' : ''}
                  ${text.annotations?.color !== 'default' ? `text-${text.annotations.color}` : ''}
                `}
              >
                {text.href ? (
                  <a
                    href={text.href}
                    className="text-green-600 hover:text-green-800 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {text.text.content}
                  </a>
                ) : (
                  text.text.content
                )}
              </span>
            ))}
          </li>
        )

      case 'image':
        return (
          <div className="notion-image-container my-6">
            <NotionImage
              src={block.image.type === 'external' ? block.image.external.url : block.image.file.url}
              alt={block.image.caption?.[0]?.text?.content || 'Notion Bild'}
              width={block.image.width}
              height={block.image.height}
              className="rounded-lg shadow-lg"
            />
            {block.image.caption && (
              <p className="text-sm text-gray-500 mt-2 text-center italic">
                {block.image.caption[0].text.content}
              </p>
            )}
          </div>
        )

      case 'quote':
        return (
          <blockquote className="notion-quote border-l-4 border-green-500 pl-4 py-2 my-4 bg-green-50 italic text-gray-700">
            {block.quote.rich_text.map((text: any, index: number) => (
              <span
                key={index}
                className={`
                  ${text.annotations?.bold ? 'font-bold' : ''}
                  ${text.annotations?.italic ? 'italic' : ''}
                  ${text.annotations?.color !== 'default' ? `text-${text.annotations.color}` : ''}
                `}
              >
                {text.text.content}
              </span>
            ))}
          </blockquote>
        )

      case 'divider':
        return <hr className="notion-divider my-8 border-gray-300" />

      case 'code':
        return (
          <div className="notion-code my-4">
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
              <code className="text-sm font-mono">
                {block.code.rich_text[0]?.text?.content || ''}
              </code>
            </pre>
          </div>
        )

      case 'callout':
        return (
          <div className={`
            notion-callout p-4 rounded-lg my-4 border-l-4
            ${block.callout.icon?.emoji === '💡' ? 'bg-yellow-50 border-yellow-400' : ''}
            ${block.callout.icon?.emoji === '✅' ? 'bg-green-50 border-green-400' : ''}
            ${block.callout.icon?.emoji === '❌' ? 'bg-red-50 border-red-400' : ''}
            ${block.callout.icon?.emoji === 'ℹ️' ? 'bg-blue-50 border-blue-400' : ''}
            ${!block.callout.icon?.emoji ? 'bg-gray-50 border-gray-400' : ''}
          `}>
            <div className="flex items-start">
              <span className="text-2xl mr-3">{block.callout.icon?.emoji || '💡'}</span>
              <div className="flex-1">
                {block.callout.rich_text.map((text: any, index: number) => (
                  <span
                    key={index}
                    className="text-gray-700"
                  >
                    {text.text.content}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )

      case 'toggle':
        return (
          <details className="notion-toggle border border-gray-300 rounded-lg p-4 my-4">
            <summary className="font-semibold cursor-pointer hover:text-green-600">
              {block.toggle.rich_text.map((text: any, index: number) => (
                <span key={index}>{text.text.content}</span>
              ))}
            </summary>
            {block.has_children && (
              <div className="mt-2 pl-4">
                <p className="text-gray-500 italic">Kinder-Blöcke werden hier gerendert...</p>
              </div>
            )}
          </details>
        )

      default:
        return (
          <div className="notion-unsupported-block p-4 bg-yellow-50 border border-yellow-200 rounded-lg my-4">
            <p className="text-sm text-yellow-800">
              ⚠️ Nicht unterstützter Block-Typ: <code>{block.type}</code>
            </p>
            <details className="mt-2">
              <summary className="text-xs text-yellow-600 cursor-pointer">Raw Daten anzeigen</summary>
              <pre className="text-xs text-gray-600 mt-2 overflow-x-auto">
                {JSON.stringify(block, null, 2)}
              </pre>
            </details>
          </div>
        )
    }
  }

  return (
    <div className={`notion-block notion-${block.type} ${className}`}>
      {renderBlock()}
      {block.has_children && (
        <div className="notion-children ml-4 mt-2 pl-4 border-l-2 border-gray-200">
          <p className="text-sm text-gray-500 italic">
            Kind-Blöcke werden hier rekursiv gerendert...
          </p>
        </div>
      )}
    </div>
  )
}