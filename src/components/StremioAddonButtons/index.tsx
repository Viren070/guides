import styles from './styles.module.css';

interface StremioAddonButtonsProps {
  source: string;
  manifest: string;
  configurable: boolean;
  configurationRequired: boolean;
  id: string;
  configureAtBase: boolean;
}

export default function StremioAddonButtons(props: StremioAddonButtonsProps): JSX.Element {
  const { source, manifest, configurable, configurationRequired, id, configureAtBase } = props;
  const hasContent = source || manifest;

  // Helper functions to modify URLs
  const getConfigureUrl = (url: string) => configureAtBase ? url.replace(/manifest\.json$/, '') : url.replace(/manifest\.json$/, '') + 'configure';
  const getInstallUrl = (url: string) => url.replace(/^https:\/\//, 'stremio://');
  const getInstallWebUrl = (url: string) => `https://web.stremio.com/#/addons?addon=${url}`;

  return (
    <div>
      {hasContent && (
        <>
          <div className={styles.buttonsContainer}>
            {manifest && (
              <div className={styles.buttonRow}>
                {!configurationRequired && (  
                  <>
                    <button className={`${styles.button} ${styles.installButton}`}>
                      <a href={getInstallUrl(manifest)}>➕ Install</a>
                    </button>
                    <button className={`${styles.button} ${styles.installWebButton}`}>
                      <a href={getInstallWebUrl(manifest)} target="_blank" rel="noopener noreferrer">🌐 Install (Web)</a>
                    </button>
                  </>
                )}
                {configurable && (
                  <button className={`${styles.button} ${styles.configureButton}`}>
                    <a href={getConfigureUrl(manifest)} target="_blank" rel="noopener noreferrer">⚙️ Configure</a>
                  </button>
                )}
              </div>
            )}
            {(source || id) && (
              <div className={styles.buttonRow}>
                {source && (
                  <button className={`${styles.button} ${styles.sourceCodeButton}`}>
                    <a href={source} target="_blank" rel="noopener noreferrer">📝 Source Code</a>
                  </button>
                )}
                {id && (
                  <button className={`${styles.button} ${styles.guideLinkButton}`}>
                    <a href={`/stremio/addons/${id}`} target="_blank">🔗 Addon Guide</a>
                  </button>
                )}
              </div>
            )}
          </div>
          <br />
          <h3>Description</h3>
        </>
      )}
    </div>
  );
}