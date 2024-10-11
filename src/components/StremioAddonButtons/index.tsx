import styles from './styles.module.css';

interface StremioAddonButtonsProps {
  source: string;
  manifest: string;
  configurable: boolean;
  configurationRequired: boolean;
  id: string;
}

const ConfigureButton = ({ manifest }: { manifest: string }) => (
  <button className={`${styles.button} ${styles.configureButton}`}>
    <a href={manifest.replace(/manifest\.json$/, 'configure')} target="_blank" rel="noopener noreferrer">
      ⚙️ Configure
    </a>
  </button>
);

const InstallButtons = ({ manifest }: { manifest: string }) => (
  <>
    <button className={`${styles.button} ${styles.installButton}`}>
      <a href={manifest.replace(/^https:\/\//, 'stremio://')}>
        ➕ Install
      </a>
    </button>
    <button className={`${styles.button} ${styles.installWebButton}`}>
      <a href={`https://web.stremio.com/#/addons?addon=${encodeURIComponent(manifest)}`} target="_blank" rel="noopener noreferrer">
        🌐 Install (Web)
      </a>
    </button>
  </>
);

const SourceCodeButton = ({ source }: { source: string }) => (
  <button className={`${styles.button} ${styles.sourceCodeButton}`}>
    <a href={source} target="_blank" rel="noopener noreferrer">
      📝 Source Code
    </a>
  </button>
);

const GuideLinkButton = ({ id }: { id: string }) => (
  <button className={`${styles.button} ${styles.guideLinkButton}`}>
    <a href={`/stremio/addons/${id}`} target="_blank">
      🔗 Addon Guide
    </a>
  </button>
);

export default function StremioAddonButtons(props: StremioAddonButtonsProps): JSX.Element {
  const { source, manifest, configurable, configurationRequired, id } = props;

  const showInstallButtons = manifest && !configurationRequired; // only show install buttons if manifest is present and configuration is not required
  const showConfigureButton = manifest && configurable;  // only show configure button if manifest is present and addon is configurable
  const showSourceCodeButton = source; // only show source code button if source is present
  const showGuideLinkButton = id; // only show guide link button if id is present


  return (
    <div>
          <div className={styles.buttonsContainer}>
            <div className={styles.buttonRow}>
              {showInstallButtons && <InstallButtons manifest={manifest} />}
              {showConfigureButton && <ConfigureButton manifest={manifest} />}
            </div>
            <div className={styles.buttonRow}>
              {showSourceCodeButton && <SourceCodeButton source={source} />}
              {showGuideLinkButton && <GuideLinkButton id={id} />}
            </div>
          </div>
    </div>
  );
}