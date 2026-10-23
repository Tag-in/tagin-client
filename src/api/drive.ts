import { authFetch } from './client'

export type DriveItemKind = 'FILE' | 'LINK'

export interface DriveItem {
    id: string
    folderId: string
    kind: DriveItemKind
    name: string
    mimeType: string | null
    sizeBytes: number | null
    url: string | null
    summary: string | null
    createdAt: string
}

export interface DriveSearchItem extends DriveItem {
    folderName: string
    similarity: number
}

export interface DriveFolder {
    id: string
    name: string
    parentId: string | null
    itemCount: number
    createdAt: string
    updatedAt: string
}

export interface DriveFolderContents {
    folder: DriveFolder
    // 최상위 폴더부터 현재 폴더까지
    path: { id: string; name: string }[]
    folders: DriveFolder[]
    items: DriveItem[]
}

export interface UploadResult {
    item: DriveItem
    folder: { id: string; name: string }
    folderCreated: boolean
    similarity: number | null
}

export type DriveEntryType = 'ITEM' | 'FOLDER'

export interface DriveSelection {
    itemIds?: string[]
    folderIds?: string[]
}

export interface TrashEntry {
    type: DriveEntryType
    id: string
    name: string
    kind: DriveItemKind | null
    sizeBytes: number | null
    deletedAt: string
    purgeAt: string
}

export interface TrashList {
    retentionDays: number
    entries: TrashEntry[]
}

export interface RestoreResult {
    type: DriveEntryType
    id: string
    name: string
    renamedTo: string | null
}

export class DriveApiError extends Error {
    readonly status: number
    readonly body: Record<string, unknown>

    constructor(status: number, message: string, body: Record<string, unknown>) {
        super(message)
        this.status = status
        this.body = body
    }
}

// 응답 본문을 읽고, 실패면 서버 메시지로 DriveApiError를 던진다.
const readJson = async <T>(response: Response, fallback: string): Promise<T> => {
    const text = await response.text()
    const data = text ? JSON.parse(text) : {}

    if (!response.ok) {
        const message = Array.isArray(data.message) ? data.message.join(', ') : data.message
        throw new DriveApiError(response.status, message ?? `${fallback} (${response.status})`, data)
    }

    return data
}

const postJson = (path: string, body: unknown) =>
    authFetch(path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    })

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
    const data = await readJson<{ items: DriveSearchItem[] }>(response, '검색에 실패했습니다.')
    return data.items
}

// 휴지통을 뺀 내 폴더 전체. parentId로 트리를 만든다.
export const getFolders = async (): Promise<DriveFolder[]> => {
    const response = await authFetch('/api/drive/folders')
    const data = await readJson<{ folders: DriveFolder[] }>(response, '폴더를 불러오지 못했습니다.')
    return data.folders
}

export const getFolderContents = async (folderId: string): Promise<DriveFolderContents> => {
    const response = await authFetch(`/api/drive/folders/${folderId}/contents`)
    return readJson(response, '폴더 내용을 불러오지 못했습니다.')
}

// folderId가 없으면 서버가 내용이 가장 비슷한 폴더에 넣거나 새 폴더를 만든다.
export const uploadFile = async (file: File, folderId?: string): Promise<UploadResult> => {
    const body = new FormData()
    body.append('file', file)
    if (folderId) body.append('folderId', folderId)

    const response = await authFetch('/api/drive/files', { method: 'POST', body })
    return readJson(response, '업로드에 실패했습니다.')
}

export const uploadLink = async (url: string, folderId?: string): Promise<UploadResult> => {
    const response = await postJson('/api/drive/links', { url, folderId })
    return readJson(response, '링크를 저장하지 못했습니다.')
}

// 휴지통으로 보낸다. 폴더는 하위 폴더·항목까지 함께 간다.
export const deleteEntries = async (selection: DriveSelection): Promise<void> => {
    const response = await postJson('/api/drive/delete', selection)
    await readJson(response, '삭제하지 못했습니다.')
}

// 상위 폴더가 휴지통에 있으면 409와 함께 body.parentFolderIds를 돌려준다.
export const restoreEntries = async (selection: DriveSelection): Promise<RestoreResult[]> => {
    const response = await postJson('/api/drive/restore', selection)
    const data = await readJson<{ results: RestoreResult[] }>(response, '복원하지 못했습니다.')
    return data.results
}

export const getTrash = async (): Promise<TrashList> => {
    const response = await authFetch('/api/drive/trash')
    return readJson(response, '휴지통을 불러오지 못했습니다.')
}

// 스토리지에서 바로 내려받는 5분짜리 임시 URL
export const getDownloadUrl = async (itemId: string): Promise<{ url: string; filename: string }> => {
    const response = await authFetch(`/api/drive/items/${itemId}/download`)
    return readJson(response, '다운로드 URL을 받지 못했습니다.')
}

// 여러 파일·폴더를 폴더 구조를 유지한 ZIP으로 받는다.
export const downloadZip = async (selection: DriveSelection): Promise<{ blob: Blob; filename: string }> => {
    const response = await postJson('/api/drive/download', selection)
    if (!response.ok) await readJson(response, 'ZIP을 만들지 못했습니다.')

    const disposition = response.headers.get('Content-Disposition') ?? ''
    const encoded = /filename\*=UTF-8''([^;]+)/i.exec(disposition)?.[1]
    const filename = encoded ? decodeURIComponent(encoded) : 'download.zip'
    return { blob: await response.blob(), filename }
}
