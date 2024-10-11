import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useToast from './showToast';
import styles from './styles.module.css';

interface StremioAddonButtonsProps {
  source: string;
  manifest: string;
  configurable: boolean;
  configurationRequired: boolean;
  configureOverride: string;
  id: string;
}

const ConfigureButton = ({ manifest, configureOverride }: { manifest: string, configureOverride: string }) => {
  const configureUrl = configureOverride || manifest.replace(/manifest\.json$/, 'configure');
  return (
    <button className={`${styles.button} ${styles.configureButton}`}>
      <a href={configureUrl} target="_blank" rel="noopener noreferrer">
        ⚙️ Configure
      </a>
    </button>
  );
};

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

const ShareGuideButton = ({ id }: { id: string }) => {
  const showToast = useToast();
  const handleCopy = () => { 
    const guideLink = `${window.location.origin}/stremio/addons/${id}`;
    navigator.clipboard.writeText(guideLink).then(() => {
      showToast('The addon guide link was copied to your clipboard!', 'info', 'guide-link-toast');
    });
  };
  return (
  <button className={`${styles.button} ${styles.shareGuideButton}`} onClick={handleCopy}>
      🔗 Share Addon Guide
  </button>);
};

const CopyManifestUrlButton = ({ manifest }: { manifest: string }) => {
  const showToast = useToast();
  const handleCopy = () => {
    navigator.clipboard.writeText(manifest).then(() => {
      showToast('The manifest URL was copied to your clipboard!', 'info', 'manifest-url-toast');
    });
  };

  return (
    <button className={`${styles.button} ${styles.copyManifestUrlButton}`} onClick={handleCopy}>
      📋 Copy Manifest URL
    </button>
  );
};


export default function StremioAddonButtons(props: StremioAddonButtonsProps): JSX.Element {
  const { source, manifest, configurable, configurationRequired, configureOverride, id } = props;

  const showInstallButtons = manifest && !configurationRequired; // only show install buttons if manifest is present and configuration is not required
  const showConfigureButton = (manifest && configurable) || configureOverride;  // only show configure button if manifest is present and addon is configurable or configureOverride is present
  const showSourceCodeButton = source; // only show source code button if source is present
  const showShareGuideButton = id; // only show guide link button if id is present
  const showCopyManifestUrlButton = manifest // only show copy manifest URL button if manifest is present

  return (
    <div>
          <div className={styles.buttonsContainer}>
            <div className={styles.buttonRow}>
              {showInstallButtons && <InstallButtons manifest={manifest} />}
              {showConfigureButton && <ConfigureButton manifest={manifest} configureOverride={configureOverride} />}
            </div>
            <div className={styles.buttonRow}>
              {showCopyManifestUrlButton && <CopyManifestUrlButton manifest={manifest} />}
              {showShareGuideButton && <ShareGuideButton id={id} />}
            </div>
            <div className={styles.buttonRow}>
              {showSourceCodeButton && <SourceCodeButton source={source} />}
            </div>
          </div>
          <ToastContainer/>
    </div>
  );
}