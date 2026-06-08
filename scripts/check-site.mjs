import { readdirSync, readFileSync, existsSync } from "node:fs";
import path from "node:path";

const routes = [
  "index.html",
  "teaching-philosophy.html",
  "ai-technology-education.html",
  "ai-literacy-starter-kit.html",
  "ai-coding-starter-kit.html",
  "cybersecurity-digital-ethics-starter-kit.html",
  "portfolio.html",
  "feedback.html",
  "professional-development.html",
  "experience.html",
  "contact.html",
  "thank-you.html",
  "standards.html",
];

const requiredFragments = [
  ["index.html", "Ron Aceto"],
  ["index.html", "Business &amp; Technology Educator Bringing Real-World Software Leadership into CTE Classrooms"],
  ["index.html", "Career-Connected Technology Education"],
  ["index.html", "I'm Ron Aceto"],
  ["index.html", "In spring 2026, I completed an interim Computer Science Foundations assignment"],
  ["index.html", "After years helping organizations adopt complex technology"],
  ["index.html", "View Teaching Portfolio"],
  ["index.html", "Contact Ron About Teaching, Consulting, or Speaking"],
  ["index.html", "Recent Classroom Experience"],
  ["index.html", "Praxis Business &amp; PLT Passed"],
  ["index.html", "CTE / AI / Cybersecurity Focus"],
  ["index.html", "Deliver career-connected instruction in Computer Science Foundations"],
  ["index.html", "For Hiring Committees"],
  ["index.html", "proof-strip"],
  ["index.html", "/ron-aceto-resume.pdf"],
  ["index.html", "mission-callout"],
  ["teaching-philosophy.html", "How Industry Experience Shapes My Teaching"],
  ["teaching-philosophy.html", "Evidence: AI + Coding lesson artifacts"],
  ["teaching-philosophy.html", "<svg viewBox=\"0 0 24 24\">"],
  ["portfolio.html", "Teaching Portfolio"],
  ["portfolio.html", "Explore Classroom Artifacts"],
  ["portfolio.html", "/ai-literacy-starter-kit"],
  ["portfolio.html", "/ai-coding-starter-kit"],
  ["portfolio.html", "/cybersecurity-digital-ethics-starter-kit"],
  ["portfolio.html", "Evidence of classroom planning, instructional design"],
  ["portfolio.html", "Resource cards identify the title, audience, purpose, standards note, last-updated date, and download action."],
  ["portfolio.html", "<strong>Last updated:</strong> June 2026"],
  ["ai-technology-education.html", "url=/portfolio"],
  ["ai-literacy-starter-kit.html", "Module A: AI Literacy Starter Kit"],
  ["ai-literacy-starter-kit.html", "Student_AI_Agreement.pdf"],
  ["ai-coding-starter-kit.html", "Module B: AI + Coding Starter Kit"],
  ["ai-coding-starter-kit.html", "AI should help students code better, not avoid learning code."],
  ["ai-coding-starter-kit.html", "Lesson_Plan_AI_as_Coding_Coach.pdf"],
  ["cybersecurity-digital-ethics-starter-kit.html", "Cybersecurity &amp; Digital Ethics Starter Kit"],
  ["cybersecurity-digital-ethics-starter-kit.html", "Security skills should help students protect people, systems, and information."],
  ["cybersecurity-digital-ethics-starter-kit.html", "Lesson_Plan_Spot_the_Phish.pdf"],
  ["cybersecurity-digital-ethics-starter-kit.html", "module_c_thumbnail_final.png"],
  ["ai-literacy-starter-kit.html", "Standards aligned"],
  ["ai-coding-starter-kit.html", "Standards aligned"],
  ["cybersecurity-digital-ethics-starter-kit.html", "Standards aligned"],
  ["ai-literacy-starter-kit.html", "<strong>Purpose:</strong>"],
  ["ai-coding-starter-kit.html", "<strong>Purpose:</strong>"],
  ["cybersecurity-digital-ethics-starter-kit.html", "<strong>Purpose:</strong>"],
  ["ai-literacy-starter-kit.html", "<strong>Last updated:</strong> June 2026"],
  ["ai-coding-starter-kit.html", "<strong>Last updated:</strong> June 2026"],
  ["cybersecurity-digital-ethics-starter-kit.html", "<strong>Last updated:</strong> June 2026"],
  ["cybersecurity-digital-ethics-starter-kit.html", "Standards Connection: These resources may support Tennessee Computer Science Foundations"],
  ["professional-development.html", "Teaching Licensure Progress"],
  ["professional-development.html", "Currently preparing for Praxis: Computer Science"],
  ["experience.html", "Interim Computer Science Teacher, Collierville High School (February-April 2026)"],
  ["experience.html", "Netsmart, Senior Director of Engineering (2017-2024)"],
  ["experience.html", "Replaced a costly third-party reporting tool, saving approximately $750K annually"],
  ["experience.html", "Defran Systems, VP of Client Services &amp; Product Manager (2010-2012)"],
  ["experience.html", "Defran Systems, Client Services Lead &amp; Product Manager (2004-2010)"],
  ["experience.html", "Defran Systems, Training/Support Specialist &amp; Software Architect (1999-2004)"],
  ["experience.html", "Defran Systems, Training and Support Specialist (1996-1999)"],
  ["experience.html", "Catholic Charities CMS, Accountant / Network Administrator (1991-1995)"],
  ["contact.html", "data-netlify=\"true\""],
  ["contact.html", "action=\"/thank-you\""],
  ["contact.html", "form-success"],
  ["contact.html", "form-error"],
  ["contact.html", "does not require a local email client"],
  ["feedback.html", "References &amp; Feedback"],
  ["feedback.html", "Public testimonials are not posted here"],
  ["thank-you.html", "Your message has been received"],
  ["standards.html", "Standards Alignment Notes"],
  ["standards.html", "CSF 3.1"],
  ["robots.txt", "Sitemap: https://ronaceto.com/sitemap.xml"],
  ["sitemap.xml", "https://ronaceto.com/portfolio"],
  ["favicon.svg", "#214D94"],
  ["site.css", ":root"],
  ["site.css", "--brand:#214D94"],
  ["site.css", "--accent:#C68439"],
  ["site.css", "linear-gradient(135deg,#eff6ff 0%,#e0ecff 100%)"],
  ["site.css", ".standards-tag"],
  ["site.css", ".mission-callout"],
  ["index.html", "&copy; 2026 Ron Aceto. All rights reserved."],
];

const forbiddenFragments = [
  ["portfolio.html", "Placeholder"],
  ["portfolio.html", "Phase 1"],
  ["professional-development.html", "Pending"],
  ["professional-development.html", "Passed.</dd>"],
  ["index.html", "Currently an interim"],
  ["index.html", "currently interim"],
  ["index.html", "interim computer-science teacher"],
  ["index.html", "CTE teaching candidate"],
  ["index.html", "now focuses on CTE, business technology, computer science, cybersecurity, digital ethics, and AI literacy instruction"],
  ["index.html", "Interim Computer Science Teacher</strong>"],
  ["contact.html", "mailto:"],
  ["index.html", "Curriculum Developer | Team Builder"],
  ["ai-literacy-starter-kit.html", "<strong>Standards:</strong>"],
  ["ai-coding-starter-kit.html", "<strong>Standards:</strong>"],
  ["cybersecurity-digital-ethics-starter-kit.html", "<strong>Standards:</strong>"],
];

const htmlFiles = readdirSync(".").filter((file) => file.endsWith(".html"));
const redirects = readFileSync("_redirects", "utf8")
  .split(/\r?\n/)
  .filter(Boolean)
  .map((line) => line.trim().split(/\s+/));

function hasInternalTarget(target) {
  if (target === "/") return existsSync("index.html");
  const clean = target.replace(/\/$/, "");
  if (existsSync(clean.slice(1))) return true;
  if (existsSync(`${clean.slice(1)}.html`)) return true;
  if (redirects.some(([from]) => from === clean || from === `${clean}/`)) return true;
  if (clean.startsWith("/resources/")) return existsSync(path.join("public", clean));
  return false;
}

function walkFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walkFiles(full);
    return full;
  });
}

const aiLiteracyResourceFiles = [
  "Student_AI_Agreement.pdf",
  "Responsible_AI_Use_Checklist.pdf",
  "Better_Prompts_vs_Shortcut_Prompts_Activity.pdf",
  "Lesson_Plan_AI_as_Learning_Partner.pdf",
  "Teacher_Implementation_Guide_AI_Literacy.pdf",
  "Video_Walkthrough_Script_AI_Literacy.pdf",
  "module_a_badge_final_v2.png",
  "module_a_thumbnail_final_v2.png",
  "module_a_resource_card_student_ai_agreement_final_v2.png",
];

const aiCodingResourceFiles = [
  "Lesson_Plan_AI_as_Coding_Coach.pdf",
  "Python_Debugging_Activity.pdf",
  "Ask_AI_Better_Coding_Questions_Handout.pdf",
  "Responsible_AI_Use_in_Coding_Rubric.pdf",
  "Student_Safe_AI_Coding_Conversation_Sample.pdf",
  "Teacher_Implementation_Guide_AI_Coding.pdf",
  "Video_Walkthrough_Script_AI_Debugging_Without_Cheating.pdf",
  "module_b_badge_final_v2.png",
  "module_b_thumbnail_final_v2.png",
  "module_b_resource_card_ai_as_coding_coach_final_v2.png",
];

const cybersecurityResourceFiles = [
  "Module_C_Overview.pdf",
  "Lesson_Plan_Spot_the_Phish.pdf",
  "Password_Strength_Activity.pdf",
  "Digital_Footprint_Reflection.pdf",
  "Cybersecurity_Careers_One_Pager.pdf",
  "AI_Cybersecurity_Discussion_Prompt.pdf",
  "Teacher_Implementation_Guide_Cybersecurity.pdf",
  "Video_Walkthrough_Script_Why_Cybersecurity_Belongs.pdf",
  "module_c_badge_final.png",
  "module_c_thumbnail_final.png",
  "module_c_resource_card_spot_the_phish_final.png",
];

for (const route of routes) {
  const html = readFileSync(route, "utf8");
  if (!html.includes("<!doctype html>")) {
    throw new Error(`${route} is missing an HTML doctype.`);
  }
  if (!html.includes("site.css")) {
    throw new Error(`${route} does not link to site.css.`);
  }
  if (!html.includes("/favicon.svg")) {
    throw new Error(`${route} does not link to favicon.svg.`);
  }
}

for (const file of htmlFiles) {
  const html = readFileSync(file, "utf8");
  if (/netlify\.app/i.test(html)) {
    throw new Error(`${file} references an out-of-scope Netlify project.`);
  }
  for (const match of html.matchAll(/(?:href|src)=["']([^"']+)["']/g)) {
    const url = match[1];
    if (url.startsWith("mailto:") || url.startsWith("#")) continue;
    if (/^https?:\/\//.test(url)) continue;
    if (!url.startsWith("/")) continue;
    const target = url.split(/[?#]/)[0];
    if (!hasInternalTarget(target)) {
      throw new Error(`${file} links to missing internal target: ${url}`);
    }
  }
}

for (const [file, fragment] of requiredFragments) {
  const contents = readFileSync(file, "utf8");
  if (!contents.includes(fragment)) {
    throw new Error(`${file} is missing expected text: ${fragment}`);
  }
}

for (const [file, fragment] of forbiddenFragments) {
  const contents = readFileSync(file, "utf8");
  if (contents.includes(fragment)) {
    throw new Error(`${file} still contains deprecated text: ${fragment}`);
  }
}

for (const file of aiLiteracyResourceFiles) {
  const path = `public/resources/ai-literacy-starter-kit/${file}`;
  const bytes = readFileSync(path);
  if (bytes.length < 1000) {
    throw new Error(`${path} appears to be missing or empty.`);
  }
}

for (const file of aiCodingResourceFiles) {
  const path = `public/resources/ai-coding-starter-kit/${file}`;
  const bytes = readFileSync(path);
  if (bytes.length < 1000) {
    throw new Error(`${path} appears to be missing or empty.`);
  }
}

for (const file of cybersecurityResourceFiles) {
  const path = `public/resources/cybersecurity-digital-ethics-starter-kit/${file}`;
  const bytes = readFileSync(path);
  if (bytes.length < 1000) {
    throw new Error(`${path} appears to be missing or empty.`);
  }
}

for (const file of walkFiles(".").filter((candidate) => candidate.toLowerCase().endsWith(".pdf"))) {
  const bytes = readFileSync(file);
  const text = bytes.toString("latin1");
  const pageCount = (text.match(/\/Type\s*\/Page\b/g) || []).length;
  if (bytes.length < 1000 || !text.startsWith("%PDF") || !text.includes("%%EOF") || pageCount < 1) {
    throw new Error(`${file} is not a valid non-empty PDF.`);
  }
}

console.log(`Checked ${routes.length} routes, internal links, shared assets, and ${aiLiteracyResourceFiles.length + aiCodingResourceFiles.length + cybersecurityResourceFiles.length} portfolio downloads.`);
