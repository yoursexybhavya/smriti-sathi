/**
 * Bhashini AI Speech & Translation Service
 * Government of India National Language Translation Mission (NLTM)
 * Dhruva Pipeline API for Hindi (hi), Assamese (as), Bodo (brx), Manipuri (mni), and Indian English (en).
 */

export const BHASHINI_CONFIG = {
  UDYAT_API_KEY: '18d72059e6-821b-4f4d-9498-76232c6c2e24',
  INFERENCE_KEY: '287McPfaybEXK-HLX6gEiji4fG-NK0tShAh1E7wh56DmrvqPgjIfiZVAMy9qgaXZ',
  PIPELINE_URL: 'https://dhruva-api.bhashini.gov.in/services/inference/pipeline',
  APP_ID: 'e82727816f224e5484a44a6b1e4f2cb1',
  APP_NAME: 'smriti_sathi',
  IS_PENDING_APPROVAL: false, // Approved by CEO (MeitY Bhashini Udyat)
  IS_APPROVED: true,
  SUPPORTED_LANGUAGES: ['en', 'hi', 'as', 'brx', 'mni'] as const,
  SERVICES: ['tts', 'translation', 'asr'] as const,
};

const ttsAudioCache = new Map<string, string>();

export async function synthesizeBhashiniTTS(
  text: string,
  sourceLanguage: 'as' | 'brx' | 'mni' | 'en' | 'hi'
): Promise<string | null> {
  // If government API approval is pending, immediately yield to zero-latency local speech engine
  if (BHASHINI_CONFIG.IS_PENDING_APPROVAL) {
    return null;
  }
  const cacheKey = `${sourceLanguage}:${text.trim()}`;
  if (ttsAudioCache.has(cacheKey)) {
    return ttsAudioCache.get(cacheKey)!;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3500);

  try {
    const payload = {
      pipelineTasks: [
        {
          taskType: 'tts',
          config: {
            language: {
              sourceLanguage: sourceLanguage === 'en' ? 'en' : sourceLanguage,
            },
            gender: 'female',
          },
        },
      ],
      inputData: {
        input: [
          {
            source: text,
          },
        ],
      },
    };

    const res = await fetch(BHASHINI_CONFIG.PIPELINE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: BHASHINI_CONFIG.INFERENCE_KEY,
        'ulca-api-key': BHASHINI_CONFIG.UDYAT_API_KEY,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      console.warn('Bhashini TTS responded with status:', res.status);
      return null;
    }

    const data = await res.json();
    const audioContent = data?.pipelineResponse?.[0]?.audio?.[0]?.audioContent;
    if (audioContent) {
      const audioUri = `data:audio/wav;base64,${audioContent}`;
      ttsAudioCache.set(cacheKey, audioUri);
      return audioUri;
    }
    return null;
  } catch (err) {
    clearTimeout(timeoutId);
    console.warn('Bhashini TTS network/offline fallback triggered:', err);
    return null;
  }
}

/**
 * Translate text across Indian languages using Bhashini Neural Machine Translation (NMT)
 */
export async function translateBhashini(
  text: string,
  sourceLanguage: string,
  targetLanguage: string
): Promise<string | null> {
  if (BHASHINI_CONFIG.IS_PENDING_APPROVAL || !text.trim()) {
    return null;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3500);

  try {
    const payload = {
      pipelineTasks: [
        {
          taskType: 'translation',
          config: {
            language: {
              sourceLanguage,
              targetLanguage,
            },
          },
        },
      ],
      inputData: {
        input: [
          {
            source: text,
          },
        ],
      },
    };

    const res = await fetch(BHASHINI_CONFIG.PIPELINE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: BHASHINI_CONFIG.INFERENCE_KEY,
        'ulca-api-key': BHASHINI_CONFIG.UDYAT_API_KEY,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    const translatedText = data?.pipelineResponse?.[0]?.output?.[0]?.target;
    return translatedText || null;
  } catch {
    clearTimeout(timeoutId);
    return null;
  }
}

/**
 * Get verified Bhashini integration and approval status
 */
export function getBhashiniStatus() {
  return {
    isApproved: BHASHINI_CONFIG.IS_APPROVED,
    appName: BHASHINI_CONFIG.APP_NAME,
    appId: BHASHINI_CONFIG.APP_ID,
    services: BHASHINI_CONFIG.SERVICES,
    supportedLanguages: BHASHINI_CONFIG.SUPPORTED_LANGUAGES,
    approvalDate: '17-09-2026',
    approvedBy: 'CEO (MeitY)',
  };
}
