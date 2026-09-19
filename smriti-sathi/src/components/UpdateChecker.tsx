import { useState, useEffect } from 'react';
import { Download, Sparkles, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const CURRENT_APP_VERSION = 'v2.1.0';
const GITHUB_REPO = 'yoursexybhavya/smriti-sathi';

export interface UpdateInfo {
  hasUpdate: boolean;
  latestVersion: string;
  downloadUrl: string;
  releaseNotes?: string;
}

export async function checkAppUpdates(): Promise<UpdateInfo> {
  try {
    const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/releases/latest`, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (!res.ok) {
      return { hasUpdate: false, latestVersion: CURRENT_APP_VERSION, downloadUrl: '' };
    }

    const data = await res.json();
    const latestTag = data.tag_name || '';

    // Compare versions (e.g., v1.0.3 vs v1.0.2)
    const normalize = (v: string) => v.replace(/^v/, '').split('.').map(Number);
    const currentParts = normalize(CURRENT_APP_VERSION);
    const latestParts = normalize(latestTag);

    let isNewer = false;
    for (let i = 0; i < Math.max(currentParts.length, latestParts.length); i++) {
      const c = currentParts[i] || 0;
      const l = latestParts[i] || 0;
      if (l > c) {
        isNewer = true;
        break;
      } else if (l < c) {
        break;
      }
    }

    // Find APK asset download URL
    // Default to a direct download link constructed from the tag to avoid redirecting to the GitHub webpage
    let apkUrl = `https://github.com/yoursexybhavya/smriti-sathi/releases/download/${latestTag}/SmritiSathi-latest.apk`;
    
    if (data.assets && Array.isArray(data.assets)) {
      const apkAsset = data.assets.find((a: { name: string; browser_download_url: string }) =>
        a.name.endsWith('.apk')
      );
      if (apkAsset) {
        apkUrl = apkAsset.browser_download_url;
      }
    }

    return {
      hasUpdate: isNewer,
      latestVersion: latestTag,
      downloadUrl: apkUrl,
      releaseNotes: data.body,
    };
  } catch {
    // Offline or network error: return no update without throwing
    return { hasUpdate: false, latestVersion: CURRENT_APP_VERSION, downloadUrl: '' };
  }
}

/**
 * In-App Update Modal that automatically notifies users whenever a new update is found.
 */
export function UpdateNotifier() {
  const { t } = useLanguage();
  const [update, setUpdate] = useState<UpdateInfo | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  useEffect(() => {
    // Check quietly upon app launch
    checkAppUpdates().then((info) => {
      if (info.hasUpdate) {
        setUpdate(info);
        setShowModal(true);
      }
    });
  }, []);

  const handleInstall = () => {
    if (update?.downloadUrl) {
      window.open(update.downloadUrl, '_system');
      // Fallback direct location trigger for Android WebView
      window.location.href = update.downloadUrl;
    }
    setShowModal(false);
  };

  return (
    <>
      {/* Full In-App Modal Dialog */}
      {showModal && update && update.hasUpdate && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(5, 12, 22, 0.85)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
          }}
        >
          <div
            className="lumos-card"
            style={{
              padding: '28px 24px',
              maxWidth: '440px',
              width: '100%',
              textAlign: 'center',
              border: '2px solid #10B981',
              boxShadow: '0 0 50px rgba(16, 185, 129, 0.35)',
              background: 'linear-gradient(180deg, #162D27 0%, #0F1E1B 100%)',
              position: 'relative',
            }}
          >
            <button
              onClick={() => setShowModal(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'transparent',
                border: 'none',
                color: '#6EE7B7',
                cursor: 'pointer',
                padding: '4px',
              }}
            >
              <X size={20} />
            </button>

            <div
              style={{
                width: '68px',
                height: '68px',
                borderRadius: '50%',
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                border: '2px solid #10B981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
              }}
            >
              <Sparkles size={34} color="#34D399" />
            </div>

            <h2
              style={{
                fontSize: '22px',
                fontWeight: 800,
                color: '#FFFFFF',
                marginBottom: '8px',
              }}
            >
              {t.updateModalTitle}
            </h2>

            <div
              style={{
                display: 'inline-block',
                backgroundColor: 'rgba(52, 211, 153, 0.15)',
                color: '#34D399',
                padding: '4px 12px',
                borderRadius: 'var(--radius-pill)',
                fontSize: '13px',
                fontWeight: 700,
                marginBottom: '14px',
              }}
            >
              {CURRENT_APP_VERSION} → {update.latestVersion}
            </div>

            <p
              style={{
                fontSize: '14px',
                color: '#D1FAE5',
                lineHeight: 1.5,
                marginBottom: '20px',
              }}
            >
              {t.updateModalDesc}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                onClick={handleInstall}
                className="btn-primary-lumos"
                style={{
                  backgroundColor: '#10B981',
                  color: '#0A1420',
                  padding: '14px',
                  fontSize: '16px',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  borderRadius: 'var(--radius-pill)',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)',
                }}
              >
                <Download size={20} />
                <span>{t.installUpdateNow}</span>
              </button>

              <button
                onClick={() => setShowModal(false)}
                style={{
                  background: 'transparent',
                  border: '1px solid #1C3E34',
                  color: '#94A9C4',
                  padding: '10px',
                  fontSize: '14px',
                  borderRadius: 'var(--radius-pill)',
                  cursor: 'pointer',
                }}
              >
                {t.updateDismiss}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Banner if dismissed */}
      {update && update.hasUpdate && !bannerDismissed && !showModal && (
        <div
          style={{
            backgroundColor: '#0F2D25',
            borderBottom: '1px solid #10B981',
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            zIndex: 500,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
            <Sparkles size={18} color="#34D399" />
            <span style={{ fontSize: '13px', color: '#D1FAE5', fontWeight: 600 }}>
              {t.updateAvailableBanner} ({update.latestVersion})
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={handleInstall}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: '#10B981',
                color: '#0A1420',
                padding: '6px 14px',
                borderRadius: 'var(--radius-pill)',
                fontSize: '12px',
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <Download size={14} />
              <span>{t.downloadUpdate}</span>
            </button>

            <button
              onClick={() => setBannerDismissed(true)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#6EE7B7',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export const UpdateBanner = UpdateNotifier;
