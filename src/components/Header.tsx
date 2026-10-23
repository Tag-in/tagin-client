import { useState } from 'react'
import type { KeyboardEvent } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router'
import styles from '../styles/components/Header.module.css'

const DEFAULT_PLACEHOLDER = '파일, 폴더 검색'
const PLACEHOLDERS: Record<string, string> = {
    '/files': '이 폴더에서 검색',
    '/trash': '휴지통에서 검색',
}

export const Header = () => {
    const { pathname } = useLocation()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const [query, setQuery] = useState(pathname === '/search' ? (searchParams.get('q') ?? '') : '')

    // 요청마다 유료 임베딩 API를 호출하므로 Enter를 눌렀을 때만 검색한다.
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key !== 'Enter' || e.nativeEvent.isComposing) return
        const q = query.trim()
        if (!q) return
        navigate(`/search?q=${encodeURIComponent(q)}`)
    }

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
                <div className={styles.profile}>나</div>
            </div>
        </div>
    )
}
