// Variant 4 — selectors over the real data files. No facts are retyped here.
import { projects, contactInfo, getImageWithFallback } from "../../data/projects";
import experiences from "../../data/experience";
import { publications } from "../../data/publications";
import { picks, lines, tags } from "./copy";

const BANNED = [/execution decision layer/i, /five.verdict/i, /deterministic risk scoring/i];
const clean = (s) => !BANNED.some((re) => re.test(s || ""));

// Experience with the banned Alfred_ bullet and project entry filtered out at render time.
export const roles = experiences.map((e) => ({
  ...e,
  description: (e.description || []).filter(clean),
  projects: (e.projects || []).filter((p) => clean(p.name) && (p.bullets || []).every(clean)),
}));

export const currentRole = roles.find((r) => r.isCurrent) || roles[0];
export const earlierRoles = roles.filter((r) => r !== currentRole);

const CAT = { aiMl: "ai-ml", gameDesign: "game-design", misc: "misc" };

// Every project, deduped by id (snakeai-mlops appears twice in the source).
export const allProjects = (() => {
  const seen = new Set();
  const out = [];
  ["aiMl", "gameDesign", "misc"].forEach((bucket) => {
    (projects[bucket] || []).forEach((p) => {
      if (seen.has(p.id)) return;
      seen.add(p.id);
      out.push({
        ...p,
        bucket: CAT[bucket],
        image: getImageWithFallback(p.mainImage, CAT[bucket]),
        fallback: getImageWithFallback("", CAT[bucket]),
        line: lines[p.id] || p.description,
        tags: tags[p.id] || [],
        square: p.id === "virtual-van-gogh",
      });
    });
  });
  const rank = (p) => (picks.indexOf(p.id) === -1 ? picks.length : picks.indexOf(p.id));
  return out.sort((a, b) => rank(a) - rank(b));
})();

export const pickedProjects = picks.map((id) => allProjects.find((p) => p.id === id)).filter(Boolean);

export const papers = publications;

export const contact = contactInfo;

export const links = {
  github: "https://github.com/PranavMishra17",
  linkedin: contactInfo.linkedin,
  huggingface: contactInfo.huggingFace,
  scholar: contactInfo.googleScholar,
  alfred: currentRole.links && currentRole.links.website,
  email: contactInfo.email.personal,
  academicEmail: contactInfo.email.academic,
};

// Short project title: strip the subtitle after the colon or dash.
export const shortTitle = (t) => (t || "").split(":")[0].split(" - ")[0].trim();

export const primaryLink = (p) => {
  if (p.websiteLink) return { href: p.websiteLink, label: "Open" };
  if (p.demoLink) return { href: p.demoLink, label: p.demoLink.includes("youtu") ? "Watch" : "Try it" };
  if (p.githubLink) return { href: p.githubLink, label: "Code" };
  return null;
};
