import { useState, useEffect } from 'react';
import { Download, Sparkles, X } from 'lucide-react';
import { Capacitor, registerPlugin } from '@capacitor/core';
import { useLanguage } from '../contexts/LanguageContext';

interface NativeAppUpdatePlugin {
  downloadAndInstall(options: { url: string }): Promise<{ success: boolean; message?: string }>;
  addListener(
    eventName: 'downloadProgress',
    listenerFunc: (info: { progress: number }) => void
  ): Promise<{ remove: () => void }>;
}

const NativeAppUpdate = registerPlugin<NativeAppUpdatePlugin>('AppUpdate');

export const CURRENT_APP_VERSION = 'v2.9.0';
const GITHUB_REPO = 'yoursexybhavya/smriti-sathi';
const RENDER_VERSION_URL = 'https://smriti-sathi.onrender.com/api/version';

export interface UpdateInfo {
  hasUpdate: boolean;
  latestVersion: string;
  downloadUrl: string;
  releaseNotes?: string;
  source?: 'render' | 'github';
}

export async function checkAppUpdates(): Promise<UpdateInfo> {
  const normalize = (v: string) => v.replace(/^v/, '').split('.').map(Number);
  const currentParts = normalize(CURRENT_APP_VERSION);

  const isVersionNewer = (tag: string) => {
    const latestParts = normalize(tag);
    for (let i = 0; i < Math.max(currentParts.length, latestParts.length); i++) {
      const c = currentParts[i] || 0;
      const l = latestParts[i] || 0;
      if (l > c) return true;
      if (l < c) return false;
    }
    return false;
  };

  // 1. Check Render cloud backend first
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    const renderRes = await fetch(RENDER_VERSION_URL, {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (renderRes.ok) {
      const renderData = await renderRes.json();
      if (renderData.latestVersion && isVersionNewer(renderData.latestVersion)) {
        return {
          hasUpdate: true,
          latestVersion: renderData.latestVersion,
          downloadUrl: renderData.downloadUrl || `https://github.com/${GITHUB_REPO}/releases/download/${renderData.latestVersion}/SmritiSathi-${renderData.latestVersion}.apk`,
          releaseNotes: renderData.releaseNotes,
          source: 'render',
        };
      }
    }
  } catch {
    // Render offline or unreachable, fall through to GitHub API
  }

  // 2. Fallback to GitHub Releases API
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

    let apkUrl = `https://github.com/${GITHUB_REPO}/releases/download/${latestTag}/SmritiSathi-${latestTag}.apk`;
    
    if (data.assets && Array.isArray(data.assets)) {
      const apkAsset = data.assets.find((a: { name: string; browser_download_url: string }) =>
        a.name.endsWith('.apk')
      );
      if (apkAsset) {
        apkUrl = apkAsset.browser_download_url;
      }
    }

    return {
      hasUpdate: isVersionNewer(latestTag),
      latestVersion: latestTag,
      downloadUrl: apkUrl,
      releaseNotes: data.body,
      source: 'github',
    };
  } catch {
    return { hasUpdate: false, latestVersion: CURRENT_APP_VERSION, downloadUrl: '' };
  }
}

/**
 * In-App Update Modal with progress bar and direct installer trigger.
 */
export function UpdateNotifier() {
  const { t } = useLanguage();
  const [update, setUpdate] = useState<UpdateInfo | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadDone, setDownloadDone] = useState(false);

  useEffect(() => {
    // Check quietly upon app launch
    checkAppUpdates().then((info) => {
      if (info.hasUpdate) {
        setUpdate(info);
        setShowModal(true);
      }
    });
  }, []);

  const handleInstall = async () => {
    if (!update?.downloadUrl) return;

    setDownloading(true);
    setDownloadProgress(8);

    // Native in-app download and installation on Android
    if (Capacitor.isNativePlatform()) {
      try {
        let listener: any = null;
        try {
          listener = await NativeAppUpdate.addListener('downloadProgress', (data: { progress: number }) => {
            if (data && typeof data.progress === 'number') {
              setDownloadProgress(Math.min(99, Math.max(8, Math.round(data.progress))));
            }
          });
        } catch (e) {
          console.warn('Could not attach native progress listener', e);
        }

        await NativeAppUpdate.downloadAndInstall({ url: update.downloadUrl });
        setDownloadProgress(100);
        setDownloading(false);
        setDownloadDone(true);

        if (listener && listener.remove) {
          listener.remove();
        }
        return;
      } catch (nativeErr) {
        console.error('Native in-app install failed, attempting fallback', nativeErr);
      }
    }

    // Web fallback for browser testing
    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          setDownloading(false);
          setDownloadDone(true);
          try {
            const link = document.createElement('a');
            link.href = update.downloadUrl;
            link.download = `SmritiSathi-${update.latestVersion}.apk`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          } catch {
            window.location.href = update.downloadUrl;
          }
          return 100;
        }
        return prev + 15;
      });
    }, 250);
  };

  const updateModalTitle = t?.updateModalTitle || 'New Update Available';
  const updateModalDesc = t?.updateModalDesc || 'A fresh update is ready to install with improvements.';
  const installUpdateNow = t?.installUpdateNow || 'Install Update Now';
  const updateDismiss = t?.updateDismiss || 'Remind Me Later';
  const updateAvailableBanner = t?.updateAvailableBanner || 'New update available';
  const downloadUpdate = t?.downloadUpdate || 'Install';

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
            {!downloading && (
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
            )}

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
              {updateModalTitle}
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
              {updateModalDesc}
            </p>

            {downloading || downloadDone ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '10px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#D1FAE5', fontWeight: 600 }}>
                  <span>{downloadDone ? 'Ready to Install!' : 'Downloading APK Update...'}</span>
                  <span>{downloadProgress}%</span>
                </div>
                <div
                  style={{
                    width: '100%',
                    height: '10px',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '5px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${downloadProgress}%`,
                      height: '100%',
                      backgroundColor: '#10B981',
                      borderRadius: '5px',
                      transition: 'width 0.25s ease-in-out',
                      boxShadow: '0 0 10px #10B981',
                    }}
                  />
                </div>
                <p style={{ fontSize: '12px', color: '#94A9C4', margin: '4px 0 0 0' }}>
                  {downloadDone ? 'Opening package installer on your device...' : 'Direct secure transfer in progress...'}
                </p>
              </div>
            ) : (
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
                  <span>{installUpdateNow}</span>
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
                  {updateDismiss}
                </button>
              </div>
            )}
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
              {updateAvailableBanner} ({update.latestVersion})
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => {
                setShowModal(true);
                handleInstall();
              }}
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
              <span>{downloadUpdate}</span>
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
