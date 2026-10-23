import { clearTokens, getAccessToken, getRefreshToken, saveTokens } from '../lib/tokenStorage'
import { refreshTokens } from './auth'

// Refresh Token은 1회용이라 동시에 여러 번 재발급하면 뒤의 요청이 실패한다. 진행 중인 요청을 공유한다.
let refreshing: Promise<boolean> | null = null

const refresh = (): Promise<boolean> => {
    refreshing ??= (async () => {
        const refreshToken = getRefreshToken()
        if (!refreshToken) return false
        try {
            const { accessToken, refreshToken: nextRefreshToken } = await refreshTokens(refreshToken)
            if (!accessToken || !nextRefreshToken) return false
            saveTokens(accessToken, nextRefreshToken)
            return true
        } catch {
            return false
        }
    })().finally(() => {
        refreshing = null
    })
    return refreshing
}

// Access Token을 붙여 요청하고, 401이면 재발급 후 한 번 다시 보낸다. 재발급도 실패하면 로그인 화면으로 보낸다.
export const authFetch = async (path: string, init: RequestInit = {}): Promise<Response> => {
    const send = () => {
        const headers = new Headers(init.headers)
        headers.set('Authorization', `Bearer ${getAccessToken()}`)
        return fetch(path, { ...init, headers })
    }

    const response = await send()
    if (response.status !== 401) return response

    if (await refresh()) return send()

    clearTokens()
    window.location.assign('/login')
    return response
}
