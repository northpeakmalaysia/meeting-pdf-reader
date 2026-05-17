/**
 * Built-in plugin — pdf-reader.
 *
 * Extracts text from PDF artefacts using `pdf-parse`. Per-page text
 * preserved via pageBreaks. Encrypted PDFs are surfaced as warnings;
 * password-prompting is out of scope for v1.
 *
 * Dependency: `pdf-parse` (~50KB, pure JS).
 */
import type { MeetingHubPlugin } from '@swarmai/meeting-hub-sdk';
export declare const pdfReader: MeetingHubPlugin;
//# sourceMappingURL=index.d.ts.map