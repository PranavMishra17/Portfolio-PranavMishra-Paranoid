// Variant 3 — selectors over the real data files. Nothing is retyped here;
// this file only chooses, dedupes, filters and attaches the rewritten copy.
import { projects, contactInfo, getImageWithFallback } from '../../data/projects';
import experiences from '../../data/experience';
import { publications, publicationStats } from '../../data/publications';
import { projectCopy, featuredIds, experienceCopy, paperCopy, statusLabel } from './copy';

// Phrases that must never be surfaced (see PORTFOLIO-BRIEF.md §7 "Never write").
const BANNED = [/execution decision layer/i, /five[- ]verdict/i, /deterministic risk scoring/i, /SILENT\s*\/\s*NOTIFY/i];
const banned = (s) => typeof s === 'string' && BANNED.some((re) => re.test(s));

export function cleanExperience(exp) {
  return {
    ...exp,
    copy: experienceCopy[exp.id] || {},
    description: (exp.description || []).filter((b) => !banned(b)),
    projects: (exp.projects || []).filter((p) => !banned(p.name) && !(p.bullets || []).some(banned)),
  };
}

export const roles = experiences.map(cleanExperience);
export const currentRole = roles.find((r) => r.isCurrent) || roles[0];
export const pastRoles = roles.filter((r) => r !== currentRole);

const bucketCategory = { gameDesign: 'game-design', aiMl: 'ai-ml', misc: 'misc' };

function primaryLink(p) {
  if (p.demoLink) return p.demoLink;
  if (p.websiteLink) return p.websiteLink;
  return p.githubLink || '';
}

export const allProjects = (() => {
  const seen = new Set();
  const out = [];
  Object.entries(projects).forEach(([bucket, list]) => {
    list.forEach((p) => {
      if (seen.has(p.id)) return; // `snakeai-mlops` is listed twice in the source
      seen.add(p.id);
      const c = projectCopy[p.id] || {};
      out.push({
        ...p,
        kind: 'project',
        bucket,
        name: c.name || p.title,
        line: c.line || p.description,
        tags: c.tags || [],
        cta: c.cta || 'Open',
        image: getImageWithFallback(p.mainImage, bucketCategory[bucket]),
        square: /van gogh/i.test(p.mainImage || ''), // the one 400×400 screenshot
        href: primaryLink(p),
      });
    });
  });
  return out;
})();

export const featured = featuredIds.map((id) => allProjects.find((p) => p.id === id)).filter(Boolean);

export const papers = publications.map((pub) => ({
  ...pub,
  kind: 'paper',
  name: pub.title,
  line: (paperCopy[pub.id] || {}).line || '',
  statusLabel: statusLabel[pub.status] || pub.status,
  accepted: pub.status === 'ACCEPTED',
  tags: ['research'],
  href: pub.pdfLink || pub.codeLink || pub.doi || '',
}));

export const stats = publicationStats;
export const contact = contactInfo;
