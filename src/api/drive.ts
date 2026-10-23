import { ApiError, authFetch, postJson, readJson } from './client'

export { ApiError as DriveApiError }

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
    // 중요 표시한 시각. 표시하지 않았으면 null
    starredAt: string | null
    createdAt: string
}

// 최근·중요 목록처럼 여러 폴더의 항목을 한 번에 보여줄 때 폴더 이름이 함께 온다.
export interface DriveItemWithFolder extends DriveItem {
    folderName: string
}

export interface DriveSearchItem extends Omit<DriveItem, 'starredAt'> {
    folderName: string
    similarity: number
}

export interface DriveFolder {
    id: string
    name: string
    parentId: string | null
    itemCount: number
    starredAt: string | null
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

export interface PurgeResult {
    purgedItemCount: number
    purgedFolderCount: number
    // 스토리지 객체를 지우지 못해 휴지통에 남은 파일 수 (보관 기간 후 자동 삭제가 재시도)
    failedItemCount: number
}

export interface StarredList {
    folders: DriveFolder[]
    items: DriveItemWithFolder[]
}

export interface StarResult {
    itemCount: number
    folderCount: number
}

export interface StorageUsage {
    // 휴지통 파일 포함
    usedBytes: number
    trashBytes: number
    limitBytes: number
    itemCount: number
}

export type MoveConflictPolicy = 'FAIL' | 'SKIP' | 'RENAME'
export type MoveStatus = 'MOVED' | 'UNCHANGED' | 'SKIPPED' | 'CONFLICT'

export interface MoveResult {
    type: DriveEntryType
    id: string
    name: string
    status: MoveStatus
    renamedTo: string | null
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

// 최근에 추가한 파일·링크 (휴지통 제외)
export const getRecent = async (limit = 20): Promise<DriveItemWithFolder[]> => {
    const response = await authFetch(`/api/drive/recent?limit=${limit}`)
    const data = await readJson<{ items: DriveItemWithFolder[] }>(response, '최근 파일을 불러오지 못했습니다.')
    return data.items
}

export const getStarred = async (): Promise<StarredList> => {
    const response = await authFetch('/api/drive/starred')
    return readJson(response, '중요 항목을 불러오지 못했습니다.')
}

export const starEntries = async (selection: DriveSelection): Promise<StarResult> => {
    const response = await postJson('/api/drive/star', selection)
    return readJson(response, '중요 표시하지 못했습니다.')
}

export const unstarEntries = async (selection: DriveSelection): Promise<StarResult> => {
    const response = await postJson('/api/drive/unstar', selection)
    return readJson(response, '중요 표시를 해제하지 못했습니다.')
}

export const getStorage = async (): Promise<StorageUsage> => {
    const response = await authFetch('/api/drive/storage')
    return readJson(response, '저장공간 정보를 불러오지 못했습니다.')
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

// 대상 폴더로 이동한다. targetFolderId가 null이면 최상위 (폴더만 가능). 이름이 겹치면 onConflict대로 처리한다.
export const moveEntries = async (
    selection: DriveSelection,
    targetFolderId: string | null,
    onConflict: MoveConflictPolicy = 'RENAME',
): Promise<MoveResult[]> => {
    const response = await postJson('/api/drive/move', { ...selection, targetFolderId, onConflict })
    const data = await readJson<{ results: MoveResult[] }>(response, '이동하지 못했습니다.')
    return data.results
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

// 휴지통의 항목을 되돌릴 수 없게 바로 지운다.
export const purgeTrash = async (selection: DriveSelection): Promise<PurgeResult> => {
    const response = await postJson('/api/drive/trash/purge', selection)
    return readJson(response, '영구 삭제하지 못했습니다.')
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
