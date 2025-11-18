import type { Client } from '@notionhq/client'
import type { DatabasePageResponse } from '../types/notion'

export interface NotionDatabaseQueryOptions extends Record<string, unknown> {
  filter?: Record<string, unknown>
  sorts?: Array<Record<string, unknown>>
  start_cursor?: string | null
  page_size?: number
}

export interface NotionQueryResponse<T = DatabasePageResponse> {
  results: T[]
  has_more: boolean
  next_cursor: string | null
  type?: string
  page?: {
    size?: number
  }
}

export async function queryDatabase<T = DatabasePageResponse>(
  client: Client,
  databaseId: string,
  body: NotionDatabaseQueryOptions = {}
): Promise<NotionQueryResponse<T>> {
  return client.request<NotionQueryResponse<T>>({
    path: `databases/${databaseId}/query`,
    method: 'post',
    body
  })
}
