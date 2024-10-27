import 'react-toastify/dist/ReactToastify.css';
import styles from './styles.module.css';
import { showToast } from '@site/src/components/Toasts';
import BrowserOnly from '@docusaurus/BrowserOnly';

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
  const handleConfigure = () => {
    window.open(configureUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <button className={`${styles.button} ${styles.configureButton}`} onClick={handleConfigure} title="Configure the addon">
      ⚙️ Configure
    </button>
  );
};

const InstallButtons = ({ manifest }: { manifest: string }) => {
  const handleInstall = () => {
    showToast('Attempting to install the addon. If nothing happens, make sure you have the app installed or try using the web install instead.', 'info');
    window.location.href = manifest.replace(/^https:\/\//, 'stremio://');
  };

  const handleInstallWeb = () => {
    window.open(`https://web.stremio.com/#/addons?addon=${encodeURIComponent(manifest)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <button className={`${styles.button} ${styles.installButton}`} onClick={handleInstall} title="Install the addon to the Stremio app">
        ➕ Install
      </button>
      <button className={`${styles.button} ${styles.installWebButton}`} onClick={handleInstallWeb} title="Install the addon to Stremio Web">
        🌐 Install (Web)
      </button>
    </>
  );
};

const SourceCodeButton = ({ source }: { source: string }) => {
  const handleSourceCode = () => {
    window.open(source, '_blank', 'noopener,noreferrer');
  };

  return (
    <button className={`${styles.button} ${styles.sourceCodeButton}`} onClick={handleSourceCode} title="View the source code of the addon">
      📝 Source Code
    </button>
  );
};

const ShareGuideButton = ({ id }: { id: string }) => {
  const addonName = id.replace('-', ' ').replace(/\b\w/g, char => char.toUpperCase());
  
  const handleShare = () => { 
    const guideLink = `${window.location.origin}/stremio/addons/${id}`;
    const shareData = { title: `${addonName} Guide for Stremio`, text: `Check out this guide to the Stremio addon, ${addonName}`, url: guideLink };
    navigator.share(shareData).then(() => {
      showToast('The addon guide was shared successfully!', 'success');
    }).catch(() => {
      navigator.clipboard.writeText(guideLink).then(() => {
        showToast('The addon guide link was copied to your clipboard!', 'success');
      }).catch(() => {
        showToast('Failed to share or copy the addon guide link! ' + guideLink, 'error');
      });
    });
  };

  return (
    <button className={`${styles.button} ${styles.shareGuideButton}`} onClick={handleShare} title="Copy the link to the guide for this addon">
      🔗 Share Addon Guide
    </button>
  );
};

const CopyManifestUrlButton = ({ manifest }: { manifest: string }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(manifest).then(() => {
      showToast('The manifest URL was copied to your clipboard!', 'success');
    }).catch(() => {
      showToast('Failed to copy the manifest URL to your clipboard! ' + manifest, 'error'); 
    });
  };

  return (
    <button className={`${styles.button} ${styles.copyManifestUrlButton}`} onClick={handleCopy} title="Copy the addon manifest URL">
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
    </div>
  );
}