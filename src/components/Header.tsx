import styles from '../styles/components/Header.module.css'

export const Header = () => {
    return (
        <div className={styles.container}>
            <input type='search' className={styles.searchWrap} placeholder='파일, 폴더 검색'></input>
            <div className={styles.actionWrap}>
                <div className={styles.settingWrap}>
                    <img src='/assets/icon/settings.svg' alt='설정' className={styles.settingIcon} />
                </div>
                <div className={styles.profile}>나</div>
            </div>
        </div>
    )
}