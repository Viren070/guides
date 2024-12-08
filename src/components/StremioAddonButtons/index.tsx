import 'react-toastify/dist/ReactToastify.css';
import styles from './styles.module.css';
import { showToast } from '@site/src/components/Toasts';
import Translate, { translate } from '@docusaurus/Translate';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { useEffect, useState } from 'react';

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
    <button className={`${styles.button} ${styles.configureButton}`} onClick={handleConfigure} 
    title={translate({
      message: "Configure Addon", 
      id: "stremio.configureButton.title",
      description: "Title for the button that opens the configuration page for the addon"
    })}>
      ⚙️ <Translate id="stremio.configureButton.label" description="Label for the configure button">Configure</Translate>
    </button>
  );
};

const InstallButtons = ({ manifest }: { manifest: string }) => {
  const handleInstall = () => {
    showToast(translate({
      message: 'Attempting to install the addon. If nothing happens, make sure you have the app installed or try using the web install instead.',
      id: 'stremio.installButton.toast',
      description: 'Toast message for install button'
    }), 'info');
    window.location.href = manifest.replace(/^https:\/\//, 'stremio://');
  };

  const handleInstallWeb = () => {
    window.open(`https://web.stremio.com/#/addons?addon=${encodeURIComponent(manifest)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <button className={`${styles.button} ${styles.installButton}`} onClick={handleInstall} title={translate({
        message: "Install the addon to the Stremio app",
        id: "stremio.installButton.title",
        description: "Title for the install button"
      })}>
        ➕ <Translate id="stremio.installButton.label" description="Label for the install button">Install</Translate>
      </button>
      <button className={`${styles.button} ${styles.installWebButton}`} onClick={handleInstallWeb} title={translate({
        message: "Install the addon to Stremio Web",
        id: "stremio.installWebButton.title",
        description: "Title for the install web button"
      })}>
        🌐 <Translate id="stremio.installWebButton.label" description="Label for the install web button">Install (Web)</Translate>
      </button>
    </>
  );
};

const SourceCodeButton = ({ source }: { source: string }) => {
  const handleSourceCode = () => {
    window.open(source, '_blank', 'noopener,noreferrer');
  };

  return (
    <button className={`${styles.button} ${styles.sourceCodeButton}`} onClick={handleSourceCode} title={translate({
      message: "View the source code of the addon",
      id: "stremio.sourceCodeButton.title",
      description: "Title for the source code button"
    })}>
      📝 <Translate id="stremio.sourceCodeButton.label" description="Label for the source code button">Source Code</Translate>
    </button>
  );
};

function ShareGuideButton({ id }: { id: string }): JSX.Element {
  const addonName = id.replace('-', ' ').replace(/\b\w/g, char => char.toUpperCase());
  const [addonUrl, setAddonUrl] = useState<string>('');

  const guidePath = useBaseUrl(`/stremio/addons/${id}`);

  useEffect(() => {
    setAddonUrl(window.location.origin + guidePath);
  });

  const handleShare = () => { 
    const guideLink = addonUrl;
    const shareData = { title: `${addonName} Guide for Stremio`, text: `Check out this guide to the Stremio addon, ${addonName}`, url: guideLink };
    navigator.share(shareData).then(() => {
      showToast(translate({
        message: 'The addon guide was shared successfully!',
        id: 'stremio.shareGuideButton.toast.success',
        description: 'Toast message for successful share'
      }), 'success');
    }).catch(() => {
      navigator.clipboard.writeText(guideLink).then(() => {
        showToast(translate({
          message: 'The addon guide link was copied to your clipboard!',
          id: 'stremio.shareGuideButton.toast.copied',
          description: 'Toast message for copied link'
        }), 'success');
      }).catch(() => {
        showToast(translate(
          {
            message: 'Failed to share or copy the addon guide link! {guideLink}',
            id: 'stremio.shareGuideButton.toast.error',
            description: 'Toast message for failed share or copy'
          },
          {
            guideLink: guideLink
          }
        ), 'error');
      });
    });
  };

  return (
    <button className={`${styles.button} ${styles.shareGuideButton}`} onClick={handleShare} title={translate({
      message: "Copy the link to the guide for this addon",
      id: "stremio.shareGuideButton.title",
      description: "Title for the share guide button"
    })}>
      🔗 <Translate id="stremio.shareGuideButton.label" description="Label for the share guide button">Share Addon Guide</Translate>
    </button>
  );
};

const CopyManifestUrlButton = ({ manifest }: { manifest: string }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(manifest).then(() => {
      showToast(translate({
        message: 'The manifest URL was copied to your clipboard!',
        id: 'stremio.copyManifestUrlButton.toast.success',
        description: 'Toast message for successful copy'
      }), 'success');
    }).catch(() => {
      showToast(translate(
        {
          message: 'Failed to copy the manifest URL to your clipboard! {manifest}',
          id: 'stremio.copyManifestUrlButton.toast.error',
          description: 'Toast message for failed copy'
        },
        {
          manifest: manifest
        }
      ), 'error'); 
    });
  };

  return (
    <button className={`${styles.button} ${styles.copyManifestUrlButton}`} onClick={handleCopy} title={translate({
      message: "Copy the addon manifest URL",
      id: "stremio.copyManifestUrlButton.title",
      description: "Title for the copy manifest URL button"
    })}>
      📋 <Translate id="stremio.copyManifestUrlButton.label" description="Label for the copy manifest URL button">Copy Manifest URL</Translate>
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