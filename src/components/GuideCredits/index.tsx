import styles from './styles.module.css';

export default function GuideCredits() {
  return (
    <div className={styles.creditsContainer}>
      <div>
        <p className={styles.creditsText}>
          This guide is a modified version of <a href="https://guides.viren070.me/stremio" target="_blank" rel="noopener noreferrer">Viren070's stremio guide</a>
          <br />
        </p>

        <div className={styles.linksContainer }>
            <a href="https://ko-fi.com/viren070" target="_blank" rel="noopener noreferrer" className='header-kofi-link'></a>
            <a href="https://github.com/Viren070/guides" target="_blank" rel="noopener noreferrer" className='header-github-link'></a>
        </div>
      </div>
    </div>
  );
}