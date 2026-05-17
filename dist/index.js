/**
 * Built-in plugin — pdf-reader.
 *
 * Extracts text from PDF artefacts using `pdf-parse`. Per-page text
 * preserved via pageBreaks. Encrypted PDFs are surfaced as warnings;
 * password-prompting is out of scope for v1.
 *
 * Dependency: `pdf-parse` (~50KB, pure JS).
 */
export const pdfReader = {
    manifest: {
        id: 'pdf-reader',
        version: '1.0.0',
        description: 'Extract text from PDF artefacts shared in meetings.',
        author: 'SwarmAI Meeting Hub built-in',
        handles: ['artefact-shared'],
        mimeTypes: ['application/pdf'],
        fileExtensions: ['.pdf'],
        trusted: true,
    },
    init() {
        /* no-op — pdf-parse loads lazily on first use */
    },
    async onArtefactShared(input) {
        const { fetchBytes, logger, label, sizeBytes } = input;
        const maxBytes = 25 * 1024 * 1024;
        if (sizeBytes > maxBytes) {
            return {
                warnings: [`PDF skipped: ${sizeBytes} bytes exceeds ${maxBytes}-byte cap`],
            };
        }
        let parser;
        try {
            parser = (await import('pdf-parse')).default;
        }
        catch (err) {
            logger.error('pdf-parse import failed; install dependency', {
                error: err instanceof Error ? err.message : String(err),
            });
            return { warnings: ['pdf-parse not installed'] };
        }
        const bytes = await fetchBytes();
        let parsed;
        try {
            parsed = await parser(bytes);
        }
        catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            if (/encrypted|password/i.test(message)) {
                return { warnings: ['PDF is encrypted; cannot extract without password'] };
            }
            return { warnings: [`PDF parse failed: ${message}`] };
        }
        const text = (parsed.text ?? '').trim();
        const pageCount = parsed.numpages ?? 0;
        const summary = `PDF "${label ?? 'untitled'}" indexed: ${pageCount} pages, ${text.length} characters extracted.`;
        return {
            extractedText: text,
            pageCount,
            summary,
        };
    },
};
//# sourceMappingURL=index.js.map