import { authFetch, readJson } from './client'

export interface Me {
    id: string
    email: string
    nickname: string
    profileImageUrl: string | null
    status: 'ACTIVE' | 'SUSPENDED' | 'WITHDRAWN'
    role: 'USER' | 'ADMIN'
    storageLimitBytes: number
    createdAt: string
}

export const getMe = async (): Promise<Me> => {
    const response = await authFetch('/api/users/me')
    return readJson(response, '내 정보를 불러오지 못했습니다.')
}
