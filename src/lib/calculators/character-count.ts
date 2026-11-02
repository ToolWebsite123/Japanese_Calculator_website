/**
 * Character counting for the 文字数計算機 (Character Counter).
 *
 * Counting rules (also stated on the page itself):
 * - "Characters" are Unicode code points, not UTF-16 code units: an emoji or
 * a rare kanji outside the BMP counts as 1 character.
 * - charactersWithoutSpaces excludes every kind of whitespace: half-width
 * and full-width spaces, tabs and line breaks.
 * - Words are segmented with the Japanese word segmenter
 * (Intl.Segmenter, granularity "word") when the runtime provides one,
 * falling back to splitting on whitespace and punctuation. As the page
 * copy says, the word count is a practical estimate based on Japanese
 * word boundaries, not a linguistic guarantee.
 * - Reading time assumes 500 non-whitespace characters per minute, a common
 * estimate for Japanese prose.
 */

export type ScriptBreakdown = {
  hiragana: number;
  katakana: number;
  kanji: number;
  latin: number;
  digits: number;
  symbols: number;
  other: number;
};

export type CharacterStats = {
  characters: number;
  charactersWithoutSpaces: number;
  bytesUtf8: number;
  manuscriptSheets: number;
  lines: number;
  wordCount: number;
  uniqueWordCount: number;
  sentenceCount: number;
  paragraphCount: number;
  readingTimeMinutes: number;
  breakdown: ScriptBreakdown;
};

export const READING_CHARS_PER_MINUTE = 500;
/** Characters per sheet of 400-character manuscript paper （原稿用紙）. */
export const MANUSCRIPT_CHARS_PER_SHEET = 400;

const WHITESPACE = /\s/u;

function classify(char: string): keyof ScriptBreakdown {
  if (/[\u3040-\u309F]/u.test(char)) return "hiragana";
  if (/[\u30A0-\u30FF\u31F0-\u31FF\uFF66-\uFF9D]/u.test(char)) return "katakana";
  if (/[\u4E00-\u9FFF\u3400-\u4DBF\u3005]/u.test(char)) return "kanji";
  if (/[A-Za-z\uFF21-\uFF3A\uFF41-\uFF5A]/u.test(char)) return "latin";
  if (/[0-9\uFF10-\uFF19]/u.test(char)) return "digits";
  if (/[\p{P}\p{S}]/u.test(char)) return "symbols";
  return "other";
}

type SegmenterLike = {
  segment: (text: string) => Iterable<{ segment: string; isWordLike?: boolean }>;
};

function getWordSegmenter(): SegmenterLike | null {
  const intl = Intl as unknown as {
    Segmenter?: new (locale: string, options: { granularity: string }) => SegmenterLike;
  };
  if (typeof intl.Segmenter !== "function") return null;
  try {
    return new intl.Segmenter("ja", { granularity: "word" });
  } catch {
    return null;
  }
}

/** Split text into words using Japanese word boundaries where available. */
export function segmentWords(text: string): string[] {
  const segmenter = getWordSegmenter();
  if (segmenter) {
    const words: string[] = [];
    for (const part of segmenter.segment(text)) {
      if (part.isWordLike) words.push(part.segment);
    }
    return words;
  }
  return text
    .split(/[\s、。,.!?！？:：;；「」『』（）()[\]{}<>・…/\\|]+/u)
    .filter((w) => w.length > 0);
}

export type CountOptions = {
  /** Remove Markdown syntax (headings, emphasis, links, …) before counting. */
  excludeMarkdown?: boolean;
  /** Remove HTML tags and comments before counting (inner text is kept). */
  excludeHtml?: boolean;
};

/** Remove HTML comments and tags, keeping the text between tags. */
export function stripHtmlTags(text: string): string {
  return text.replace(/<!--[\s\S]*?-->/g, "").replace(/<[^>]*>/g, "");
}

/**
 * Remove Markdown syntax while keeping the readable text: link and image
 * syntax collapses to its text/alt text, emphasis markers, heading and
 * list markers, blockquote markers, code fences and table pipes are
 * dropped. Underscore emphasis is only unwrapped at word boundaries, so
 * snake_case words are left intact.
 */
export function stripMarkdown(text: string): string {
  let out = text;
  out = out.replace(/^\s*```.*$/gm, "");
  out = out.replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1");
  out = out.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1");
  out = out.replace(/\[([^\]]*)\]\[[^\]]*\]/g, "$1");
  out = out.replace(/`([^`]*)`/g, "$1");
  for (let i = 0; i < 3; i++) {
    out = out
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/\*([^*]+)\*/g, "$1")
      .replace(/~~([^~]+)~~/g, "$1")
      .replace(/(?<![A-Za-z0-9])__([^_]+)__(?![A-Za-z0-9])/g, "$1")
      .replace(/(?<![A-Za-z0-9])_([^_]+)_(?![A-Za-z0-9])/g, "$1");
  }
  out = out.replace(/^\s*\|?[\s:|-]+\|[\s:|-]*$/gm, "");
  out = out.replace(/^#{1,6}\s+/gm, "");
  out = out.replace(/^\s*>\s?/gm, "");
  out = out.replace(/^\s*(?:[-*+]|\d+\.)\s+/gm, "");
  out = out.replace(/^\s*(?:-{3,}|\*{3,}|_{3,})\s*$/gm, "");
  out = out.replace(/\|/g, " ");
  return out;
}

export function countCharacters(text: string, options: CountOptions = {}): CharacterStats {
  let effective = text;
  if (options.excludeHtml) effective = stripHtmlTags(effective);
  if (options.excludeMarkdown) effective = stripMarkdown(effective);
  const chars = [...effective];
  const breakdown: ScriptBreakdown = {
    hiragana: 0,
    katakana: 0,
    kanji: 0,
    latin: 0,
    digits: 0,
    symbols: 0,
    other: 0,
  };

  let charactersWithoutSpaces = 0;
  for (const char of chars) {
    if (WHITESPACE.test(char)) continue;
    charactersWithoutSpaces += 1;
    breakdown[classify(char)] += 1;
  }

  const lines =
    effective.length === 0
      ? 0
      : effective
          .split(/\r\n|\r|\n/)
          .filter((_, i, arr) => !(i === arr.length - 1 && arr[i] === "")).length;

  const words = segmentWords(effective);

  const sentences = effective
    .split(/(?<=[。．.!！?？])/u)
    .filter((s) => /[^\s。．.!！?？]/u.test(s)).length;

  const paragraphs =
    effective.trim().length === 0
      ? 0
      : effective.split(/\n\s*\n/u).filter((p) => p.trim().length > 0).length;

  return {
    characters: chars.length,
    charactersWithoutSpaces,
    bytesUtf8: new TextEncoder().encode(effective).length,
    manuscriptSheets: charactersWithoutSpaces / MANUSCRIPT_CHARS_PER_SHEET,
    lines,
    wordCount: words.length,
    uniqueWordCount: new Set(words).size,
    sentenceCount: effective.trim().length === 0 ? 0 : sentences,
    paragraphCount: paragraphs,
    readingTimeMinutes: charactersWithoutSpaces / READING_CHARS_PER_MINUTE,
    breakdown,
  };
}
