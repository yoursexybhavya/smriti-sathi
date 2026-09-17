import { useState, useEffect } from 'react';
import { Download, Sparkles, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const CURRENT_APP_VERSION = 'v1.0.2';
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

    // Compare versions (e.g., v1.0.2 > v1.0.1)
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
    let apkUrl = data.html_url;
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

export function UpdateBanner() {
  const { t } = useLanguage();
  const [update, setUpdate] = useState<UpdateInfo | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check quietly on mount
    checkAppUpdates().then((info) => {
      if (info.hasUpdate) {
        setUpdate(info);
      }
    });
  }, []);

  if (!update || !update.hasUpdate || dismissed) return null;

  return (
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
        <a
          href={update.downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
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
            textDecoration: 'none',
          }}
        >
          <Download size={14} />
          <span>{t.downloadUpdate}</span>
        </a>

        <button
          onClick={() => setDismissed(true)}
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
  );
}
