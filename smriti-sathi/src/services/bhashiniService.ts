/**
 * Bhashini AI Speech & Translation Service
 * Government of India National Language Translation Mission (NLTM)
 * Dhruva Pipeline API for Assamese (as), Bodo (brx), Manipuri (mni), and Indian English (en).
 */

export const BHASHINI_CONFIG = {
  UDYAT_API_KEY: '18d72059e6-821b-4f4d-9498-76232c6c2e24',
  INFERENCE_KEY: '287McPfaybEXK-HLX6gEiji4fG-NK0tShAh1E7wh56DmrvqPgjIfiZVAMy9qgaXZ',
  PIPELINE_URL: 'https://dhruva-api.bhashini.gov.in/services/inference/pipeline',
};

const ttsAudioCache = new Map<string, string>();

export async function synthesizeBhashiniTTS(
  text: string,
  sourceLanguage: 'as' | 'brx' | 'mni' | 'en'
): Promise<string | null> {
  const cacheKey = `${sourceLanguage}:${text.trim()}`;
  if (ttsAudioCache.has(cacheKey)) {
    return ttsAudioCache.get(cacheKey)!;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2200);

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
            samplingRate: 8000,
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
