#!/usr/bin/env node

/**
 * scan-hn-hiring.mjs — HackerNews "Who is hiring?" monthly thread scanner
 *
 * Free zero-token job sourcing. Catches early-stage AI startups that post
 * on HN before appearing on Greenhouse / LinkedIn / Indeed.
 *
 * Strategy:
 *   1. Find latest "Ask HN: Who is hiring?" thread via hn.algolia.com search
 *   2. Fetch all top-level comments (each is a job posting)
 *   3. Filter by title_filter keywords from portals.yml
 *   4. Write results to data/hn-hiring-{YYYY-MM}.md for human review
 *
 * Usage:
 *   node scan-hn-hiring.mjs              # scan latest thread, write to data/
 *   node scan-hn-hiring.mjs --dry-run    # preview without writing
 *
 * The output file format matches review-by-eye expectation: one section
 * per matched posting with HN permalink + raw posting text. User picks
 * which to evaluate via /career-ops oferta.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import yaml from 'js-yaml';
const parseYaml = yaml.load;

// ── Config ──────────────────────────────────────────────────────────

const PORTALS_PATH = 'portals.yml';
const HN_SEARCH = 'https://hn.algolia.com/api/v1/search_by_date?query=Ask+HN+Who+is+hiring&tags=story&hitsPerPage=10';
const HN_ITEM = (id) => `https://hacker-news.firebaseio.com/v0/item/${id}.json`;

const CONCURRENCY = 20;
const FETCH_TIMEOUT_MS = 10_000;

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');

// ── Helpers ─────────────────────────────────────────────────────────

async function fetchJson(url) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    return await res.json();
  } finally {
    clearTimeout(t);
  }
}

function stripHtml(html) {
  return (html || '')
    .replace(/<p>/g, '\n\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();
}

function matchesFilter(text, positive, negative) {
  const lower = text.toLowerCase();
  if (negative.some(n => lower.includes(n.toLowerCase()))) return false;
  return positive.some(p => lower.includes(p.toLowerCase()));
}

async function chunked(items, n, fn) {
  const results = [];
  for (let i = 0; i < items.length; i += n) {
    const chunk = items.slice(i, i + n);
    results.push(...await Promise.all(chunk.map(fn)));
  }
  return results;
}

// ── Main ────────────────────────────────────────────────────────────

async function findLatestHiringThread() {
  const json = await fetchJson(HN_SEARCH);
  const hits = json.hits || [];

  const hit = hits.find(h => {
    const t = (h.title || '').toLowerCase();
    return /who is hiring/.test(t)
      && !/freelancer/.test(t)
      && !/want to be hired/.test(t)
      && !/who wants to be hired/.test(t);
  });

  if (!hit) throw new Error('No "Who is hiring?" thread found in latest 10 results');
  return hit;
}

async function fetchComment(id) {
  try {
    return await fetchJson(HN_ITEM(id));
  } catch {
    return null;
  }
}

async function main() {
  console.log('🔍 Searching for latest HN "Who is hiring?" thread...');
  const thread = await findLatestHiringThread();
  console.log(`✓ Found: "${thread.title}" (story_id=${thread.objectID})`);

  console.log(`📥 Fetching thread root (${thread.objectID})...`);
  const root = await fetchJson(HN_ITEM(thread.objectID));
  const commentIds = root.kids || [];
  console.log(`✓ ${commentIds.length} top-level postings to scan`);

  console.log(`📋 Loading filter keywords from ${PORTALS_PATH}...`);
  const portals = parseYaml(readFileSync(PORTALS_PATH, 'utf-8'));
  const positive = portals.title_filter?.positive || [];
  const negative = portals.title_filter?.negative || [];
  console.log(`✓ ${positive.length} positive keywords, ${negative.length} negative keywords`);

  console.log(`⏳ Fetching comments (concurrency=${CONCURRENCY})...`);
  const comments = await chunked(commentIds, CONCURRENCY, fetchComment);

  const matches = [];
  for (const c of comments) {
    if (!c || c.deleted || c.dead || !c.text) continue;
    const text = stripHtml(c.text);
    if (matchesFilter(text, positive, negative)) {
      matches.push({
        id: c.id,
        author: c.by || 'unknown',
        time: c.time,
        text: text.slice(0, 2000),
        url: `https://news.ycombinator.com/item?id=${c.id}`,
      });
    }
  }

  console.log(`\n✅ Matched ${matches.length} / ${commentIds.length} postings`);

  if (DRY_RUN) {
    console.log('\n--- DRY RUN — not writing file ---');
    matches.slice(0, 3).forEach(m => {
      console.log(`\n[${m.author}] ${m.url}`);
      console.log(m.text.slice(0, 200) + '...');
    });
    return;
  }

  const now = new Date();
  const slug = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const outFile = `data/hn-hiring-${slug}.md`;
  mkdirSync('data', { recursive: true });

  let md = `# HackerNews "Who is hiring?" — ${slug}\n\n`;
  md += `**Source thread:** ${thread.title}\n`;
  md += `**URL:** https://news.ycombinator.com/item?id=${thread.objectID}\n`;
  md += `**Scanned:** ${now.toISOString()}\n`;
  md += `**Total postings:** ${commentIds.length}\n`;
  md += `**Matched filter:** ${matches.length}\n\n`;
  md += `---\n\n`;
  md += `## How to use this file\n\n`;
  md += `Each section below is a job posting that matched your title_filter.\n`;
  md += `1. Skim the listings; star the ones that fit\n`;
  md += `2. For each interesting posting, paste the company URL into \`/career-ops oferta\`\n`;
  md += `3. The pipeline will evaluate (Block A-G), score, and add to applications.md if score >= 4.0\n\n`;
  md += `---\n\n`;

  for (const m of matches) {
    md += `## ${m.author}\n\n`;
    md += `**HN permalink:** ${m.url}\n\n`;
    md += `\`\`\`\n${m.text}\n\`\`\`\n\n---\n\n`;
  }

  writeFileSync(outFile, md);
  console.log(`📝 Wrote ${outFile}`);
}

main().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
