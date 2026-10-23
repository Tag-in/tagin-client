import { useLocation } from 'react-router'
import styles from '../styles/components/Header.module.css'

const DEFAULT_PLACEHOLDER = '파일, 폴더 검색'
const PLACEHOLDERS: Record<string, string> = {
    '/files': '이 폴더에서 검색',
    '/trash': '휴지통에서 검색',
}

export const Header = () => {
    const { pathname } = useLocation()

    return (
        <div className={styles.container}>
            <input type='search' className={styles.searchWrap} placeholder={PLACEHOLDERS[pathname] ?? DEFAULT_PLACEHOLDER}></input>
            <div className={styles.actionWrap}>
                <div className={styles.settingWrap}>
                    <img src='/assets/icon/settings.svg' alt='설정' className={styles.settingIcon} />
                </div>
                <div className={styles.profile}>나</div>
            </div>
        </div>
    )
}