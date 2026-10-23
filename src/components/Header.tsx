import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router'
import { logout } from '../api/auth'
import { getMe, type Me } from '../api/users'
import { clearTokens, getRefreshToken } from '../lib/tokenStorage'
import styles from '../styles/components/Header.module.css'

const DEFAULT_PLACEHOLDER = '파일, 폴더 검색'
const PLACEHOLDERS: Record<string, string> = {
    '/files': '이 폴더에서 검색',
    '/trash': '휴지통에서 검색',
}

// 화면을 오갈 때마다 다시 묻지 않도록 한 번 받은 내 정보를 들고 있는다.
let cachedMe: Me | null = null

export const Header = () => {
    const { pathname } = useLocation()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const [query, setQuery] = useState(
        pathname === '/search' || pathname === '/trash' ? (searchParams.get('q') ?? '') : '',
    )
    const [me, setMe] = useState<Me | null>(cachedMe)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (cachedMe) return
        let ignore = false
        getMe()
            .then((data) => {
                cachedMe = data
                if (!ignore) setMe(data)
            })
            .catch(() => {})
        return () => {
            ignore = true
        }
    }, [])

    useEffect(() => {
        if (!isMenuOpen) return
        const handleClick = (e: MouseEvent) => {
            if (!menuRef.current?.contains(e.target as Node)) setIsMenuOpen(false)
        }
        document.addEventListener('mousedown', handleClick)
        return () => document.removeEventListener('mousedown', handleClick)
    }, [isMenuOpen])

    // 요청마다 유료 임베딩 API를 호출하므로 Enter를 눌렀을 때만 검색한다.
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key !== 'Enter' || e.nativeEvent.isComposing) return
        const q = query.trim()

        // 휴지통 항목은 의미 검색 대상이 아니라서 휴지통 화면에서 이름으로 거른다.
        if (pathname === '/trash') {
            navigate(q ? `/trash?q=${encodeURIComponent(q)}` : '/trash')
            return
        }
        if (!q) return

        const params = new URLSearchParams({ q })
        // 내 파일에서는 지금 보고 있는 폴더(와 하위 폴더) 안에서만 찾는다.
        const folderId = pathname === '/files' ? searchParams.get('folder') : null
        if (folderId) params.set('folderId', folderId)
        navigate(`/search?${params}`)
    }

    // 서버의 Refresh Token을 폐기하고 로그인 화면으로 간다. 서버 요청이 실패해도 로컬 토큰은 지운다.
    const handleLogout = async () => {
        const refreshToken = getRefreshToken()
        try {
            if (refreshToken) await logout(refreshToken)
        } catch {
            // 이미 만료·폐기된 토큰이면 서버가 거절할 수 있다. 로그아웃은 계속 진행한다.
        }
        cachedMe = null
        clearTokens()
        navigate('/login', { replace: true })
    }

    const initial = me?.nickname.trim().charAt(0) || '나'

    return (
        <div className={styles.container}>
            <input
                type='search'
                className={styles.searchWrap}
                placeholder={PLACEHOLDERS[pathname] ?? DEFAULT_PLACEHOLDER}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
            ></input>
            <div className={styles.actionWrap}>
                <div className={styles.settingWrap}>
                    <img src='/assets/icon/settings.svg' alt='설정' className={styles.settingIcon} />
                </div>
                <div className={styles.profileWrap} ref={menuRef}>
                    <button
                        type='button'
                        className={styles.profile}
                        title={me ? `${me.nickname} (${me.email})` : undefined}
                        aria-haspopup='menu'
                        aria-expanded={isMenuOpen}
                        onClick={() => setIsMenuOpen((prev) => !prev)}
                    >
                        {me?.profileImageUrl ? (
                            <img src={me.profileImageUrl} alt='' className={styles.profileImage} referrerPolicy='no-referrer' />
                        ) : (
                            initial
                        )}
                    </button>
                    {isMenuOpen && (
                        <div className={styles.menu} role='menu'>
                            {me && (
                                <div className={styles.menuInfo}>
                                    <p className={styles.menuName}>{me.nickname}</p>
                                    <p className={styles.menuEmail}>{me.email}</p>
                                </div>
                            )}
                            <button type='button' role='menuitem' className={styles.menuItem} onClick={handleLogout}>
                                로그아웃
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
