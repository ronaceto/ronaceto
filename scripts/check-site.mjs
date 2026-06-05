import { readFileSync } from "node:fs";

const routes = [
  "index.html",
  "teaching-philosophy.html",
  "ai-technology-education.html",
  "portfolio.html",
  "feedback.html",
  "professional-development.html",
  "experience.html",
  "contact.html",
];

const requiredFragments = [
  ["index.html", "Ron Aceto"],
  ["ai-technology-education.html", "AI &amp; Technology Education Portfolio"],
  ["ai-technology-education.html", "Preview resource"],
  ["ai-technology-education.html", "These resources include Tennessee Computer Science Foundations standards connections where applicable."],
  ["contact.html", "ronaceto@outlook.com"],
  ["site.css", ":root"],
];

const resourceFiles = [
  "01_student_ai_agreement.docx",
  "02_responsible_ai_use_checklist.docx",
  "03_better_prompts_vs_shortcuts_activity.docx",
  "04_lesson_plan_ai_as_learning_partner.docx",
  "05_teacher_implementation_guide.docx",
  "06_video_walkthrough_script.docx",
];

for (const route of routes) {
  const html = readFileSync(route, "utf8");
  if (!html.includes("<!doctype html>")) {
    throw new Error(`${route} is missing an HTML doctype.`);
  }
  if (!html.includes("site.css")) {
    throw new Error(`${route} does not link to site.css.`);
  }
}

for (const [file, fragment] of requiredFragments) {
  const contents = readFileSync(file, "utf8");
  if (!contents.includes(fragment)) {
    throw new Error(`${file} is missing expected text: ${fragment}`);
  }
}

for (const file of resourceFiles) {
  const path = `public/resources/ai-literacy-starter-kit/${file}`;
  const bytes = readFileSync(path);
  if (bytes.length < 1000) {
    throw new Error(`${path} appears to be missing or empty.`);
  }
}

console.log(`Checked ${routes.length} routes, shared assets, and ${resourceFiles.length} downloads.`);
