import { authFetch } from './client'

export interface DriveSearchItem {
    id: string
    folderId: string
    folderName: string
    kind: 'FILE' | 'LINK'
    name: string
    mimeType: string | null
    sizeBytes: number | null
    url: string | null
    summary: string | null
    similarity: number
    createdAt: string
}

export interface DriveSearchParams {
    q: string
    folderId?: string
    limit?: number
}

// 키워드가 아니라 의미(벡터 유사도)로 찾고, 유사도 높은 순으로 돌려준다.
export const searchDrive = async ({ q, folderId, limit }: DriveSearchParams): Promise<DriveSearchItem[]> => {
    const params = new URLSearchParams({ q })
    if (folderId) params.set('folderId', folderId)
    if (limit) params.set('limit', String(limit))

    const response = await authFetch(`/api/drive/search?${params}`)

    const text = await response.text()
    const data = text ? JSON.parse(text) : {}

    if (!response.ok) {
        const message = Array.isArray(data.message) ? data.message.join(', ') : data.message
        throw new Error(message ?? `검색에 실패했습니다. (${response.status})`)
    }

    return data.items
}
