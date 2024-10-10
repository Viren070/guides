import styles from './styles.module.css';

interface StremioAddonButtonsProps {
  source: string;
  manifest: string;
  configurable: boolean;
  configurationRequired: boolean;
  id: string;
}

export default function StremioAddonButtons(props: StremioAddonButtonsProps): JSX.Element {
  const { source, manifest, configurable, configurationRequired, id } = props;
  const hasContent = source || manifest;

  // Helper functions to modify URLs
  const getConfigureUrl = (manifestUrl: string) => manifestUrl.replace(/manifest\.json$/, '') + 'configure';
  const getInstallUrl = (manifestUrl: string) => manifestUrl.replace(/^https:\/\//, 'stremio://');
  const getInstallWebUrl = (manifestUrl: string) => `https://web.stremio.com/#/addons?addon=${manifestUrl}`;

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