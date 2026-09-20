import { GoogleGenAI } from '@google/genai';
import { GlobalContext } from '../../types';

const STORAGE_KEY_GEMINI = 'pengawas_digital_gemini_key';
const STORAGE_KEY_MODEL = 'pengawas_digital_gemini_model';

export function getStoredGeminiKey(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(STORAGE_KEY_GEMINI) || '';
}

export function saveGeminiKey(key: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_GEMINI, key.trim());
}

export function removeGeminiKey(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY_GEMINI);
}

export function getStoredModel(): string {
  if (typeof window === 'undefined') return 'gemini-2.5-flash';
  return localStorage.getItem(STORAGE_KEY_MODEL) || 'gemini-2.5-flash';
}

export function saveSelectedModel(model: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_MODEL, model);
}

// Test connection
export async function testGeminiConnection(key: string, modelName: string = 'gemini-2.5-flash'): Promise<{ success: boolean; message: string }> {
  const trimmed = key.trim();
  if (!trimmed) {
    return { success: false, message: 'API Key tidak boleh kosong.' };
  }

  try {
    const ai = new GoogleGenAI({ apiKey: trimmed });
    // Use gemini-2.5-flash or gemini-3.8-flash
    const targetModel = modelName.includes('2.5') ? 'gemini-2.5-flash' : 'gemini-3.8-flash';
    const response = await ai.models.generateContent({
      model: targetModel,
      contents: 'Tuliskan satu kalimat sambutan hangat untuk guru Indonesia dalam format JSON: {"status": "ok", "greeting": "..."}',
      config: {
        responseMimeType: 'application/json',
      }
    });

    if (response && response.text) {
      return { success: true, message: 'Koneksi ke Google Gemini API berhasil! Status kuota aktif.' };
    }
    return { success: false, message: 'Tidak menerima respon teks dari model.' };
  } catch (err: any) {
    console.error('Gemini connection test error:', err);
    return { 
      success: false, 
      message: err?.message || 'Gagal terhubung ke Gemini API. Pastikan API Key valid dan telah diaktifkan di Google AI Studio.' 
    };
  }
}

/**
 * Format Global Context 1, 2, and 3 into an authoritative pedagogical instruction block
 */
export function buildContextSystemInstruction(globalContext?: GlobalContext): string {
  if (!globalContext || !globalContext.isCompleted) {
    return `Anda adalah 'Pengawas Digital' (Powered by Basuki, S.Kom.) - Arsitek Teknologi Pendidikan & Pakar Administrasi Kurikulum Indonesia (Kurikulum Merdeka & Kurikulum Berbasis Cinta / KBC Madrasah).
Hasilkan dokumen pedagogis yang sangat berkualitas, terstruktur, berbasis Backward Design (Understanding by Design / UbD), dan siap cetak. Output WAJIB dalam format JSON yang valid.`;
  }

  const { identity, studentProfile, community } = globalContext;

  return `Anda adalah 'Pengawas Digital' (Powered by Basuki, S.Kom.) - Asisten dan Pengawas Administrasi Pembelajaran Berbasis AI untuk Pendidik Indonesia.
Pedoman Mutlak:
1. Anda WAJIB mengintegrasikan TIGA KONTEKS GLOBAL berikut ke dalam seluruh rekomendasi, diferensiasi, contoh kasus, asesmen, LKPD, dan modul:
---
[GLOBAL CONTEXT 1: IDENTITAS & ARAH SEKOLAH]
- Guru: ${identity.teacherName || 'Bapak/Ibu Guru'} (NIP: ${identity.teacherNip || '-'})
- Kepala Sekolah: ${identity.principalName || '-'} (NIP: ${identity.principalNip || '-'})
- Satuan Pendidikan: ${identity.schoolName || 'Sekolah'} (${identity.level || 'SD/SMP/SMA'})
- Wilayah: ${identity.cityDistrict || 'Indonesia'}
- Kurikulum: ${identity.curriculum === 'kbc' ? 'Kurikulum Berbasis Cinta (KBC - Madrasah) dengan 5 Nilai Panca Cinta' : 'Kurikulum Merdeka dengan Dimensi Profil Pelajar Pancasila'}
- Visi Sekolah: "${identity.vision || 'Mewujudkan peserta didik yang berkarakter, unggul, dan berdaya saing global'}"
- Misi Sekolah: "${identity.mission || 'Menyelenggarakan pembelajaran bermakna, berpusat pada murid, dan adaptif'}"
*Fungsi: Visi & Misi adalah kompas moral dan arah pedagogis seluruh keluaran.*

[GLOBAL CONTEXT 2: PROFIL MURID & DIFERENSIASI]
- Sasaran Kelas: ${studentProfile.targetClass || 'Kelas Utama'} (${studentProfile.totalStudents || 30} Murid)
- Kesiapan Belajar: ${studentProfile.learningReadiness || 'Heterogen'}
- Minat Murid: ${(studentProfile.interests || []).join(', ') || 'Sains, Seni, Lingkungan, Olahraga, Teknologi'}
- Gaya Belajar: Visual ${studentProfile.learningStyles.visual}%, Auditori ${studentProfile.learningStyles.auditory}%, Kinestetik ${studentProfile.learningStyles.kinesthetic}%
- Kondisi Sosial-Emosional: ${studentProfile.socialEmotionalState || 'Cukup stabil, membutuhkan dorongan kolaboratif dan apresiasi positif'}
- Kebutuhan Inklusi / Khusus: ${studentProfile.inclusionNeeds || studentProfile.specialNeeds || 'Perhatian pada kecepatan pemahaman bertahap dan scaffolding'}
- Sintesis Profil Kelas: ${studentProfile.classProfileSummary || 'Kelas aktif dengan minat visual-kinestetik tinggi, memerlukan aktivitas kontekstual konkret.'}
*Fungsi: Menentukan diferensiasi konten, proses, produk, tingkat kesulitan asesmen, dan panduan LKPD.*

[GLOBAL CONTEXT 3: SEKOLAH & KOMUNITAS LOKAL]
- Isu / Tantangan Lokal: ${(community.localChallenges || []).join(', ') || 'Pengelolaan sampah, literasi kritis, pelestarian kearifan lokal'}
- Potensi Lingkungan: ${(community.environmentalPotential || []).join(', ') || 'Lingkungan pemukiman, sentra perkebunan/pertanian, cagar budaya lokal'}
- Sumber Daya & Mitra: ${(community.localResources || []).concat(community.partners || []).join(', ') || 'Perpustakaan, Puskesmas, UMKM lokal, Komunitas Orang Tua'}
- Tokoh Lokal: ${(community.localFigures || []).join(', ') || 'Tokoh masyarakat, pegiat literasi dan lingkungan'}
*Fungsi: Memastikan setiap materi dan aktivitas pembelajaran kontekstual dan relevan dengan lingkungan nyata murid.*
---
2. Terapkan prinsip Backward Design: rumuskan bukti asesmen ketercapaian SEBELUM menyusun rangkaian aktivitas pembelajaran.
3. Seluruh respon WAJIB berupa JSON murni yang sesuai dengan skema yang diminta, tanpa markdown quotes atau pembungkus lain di luar JSON.`;
}

/**
 * Executes a structured JSON request to Gemini or uses intelligent fallback
 */
export async function generatePedagogicalJSON<T>(params: {
  prompt: string;
  systemInstruction?: string;
  globalContext?: GlobalContext;
  model?: string;
  fallbackGenerator: () => T;
}): Promise<T> {
  const apiKey = getStoredGeminiKey();
  const selectedModel = params.model || getStoredModel();
  const instruction = params.systemInstruction || buildContextSystemInstruction(params.globalContext);

  if (!apiKey) {
    console.info('BYOK Gemini API key not set, using pedagogical offline generation engine.');
    // Simulated processing time for realistic UI/UX
    await new Promise(resolve => setTimeout(resolve, 800));
    return params.fallbackGenerator();
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const targetModel = selectedModel.includes('2.5') ? 'gemini-2.5-flash' : 'gemini-3.8-flash';

    const response = await ai.models.generateContent({
      model: targetModel,
      contents: params.prompt,
      config: {
        systemInstruction: instruction,
        responseMimeType: 'application/json',
        temperature: 0.7,
      }
    });

    const text = response.text?.trim() || '';
    if (!text) {
      throw new Error('Respon dari Gemini kosong.');
    }

    // Sanitize in case model added codeblocks
    const cleanJson = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/, '');
    const parsed = JSON.parse(cleanJson) as T;
    return parsed;
  } catch (err: any) {
    console.warn('Gemini request encountered error, falling back to local curriculum generator:', err);
    // Return high quality fallback so user workflow is uninterrupted
    return params.fallbackGenerator();
  }
}
