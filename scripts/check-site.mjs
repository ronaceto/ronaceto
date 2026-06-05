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
  ["ai-technology-education.html", "Module A: AI Literacy Starter Kit"],
  ["ai-technology-education.html", "AI should help students think better, not think less."],
  ["ai-technology-education.html", "student_ai_agreement_final.pdf"],
  ["ai-technology-education.html", "Module B: AI + Coding Starter Kit"],
  ["ai-technology-education.html", "AI should help students code better, not avoid learning code."],
  ["ai-technology-education.html", "lesson_plan_ai_as_coding_coach_final.pdf"],
  ["ai-technology-education.html", "Cybersecurity &amp; Digital Ethics Starter Kit"],
  ["ai-technology-education.html", "Preview resource"],
  ["ai-technology-education.html", "These resources include Tennessee Computer Science Foundations standards connections where applicable."],
  ["ai-technology-education.html", "These resources may support Tennessee Department of Education Computer Science Foundations"],
  ["ai-technology-education.html", "Standards Connection: These resources may support Tennessee Computer Science Foundations"],
  ["contact.html", "ronaceto@outlook.com"],
  ["site.css", ":root"],
];

const aiLiteracyResourceFiles = [
  "student_ai_agreement_cover_final.pdf",
  "student_ai_agreement_final.pdf",
  "responsible_ai_use_checklist_final.pdf",
  "better_prompts_vs_shortcuts_activity_final.pdf",
  "lesson_plan_ai_as_learning_partner_final.pdf",
  "teacher_implementation_guide_final.pdf",
  "video_walkthrough_script_final.pdf",
  "module_a_badge_final.png",
  "module_a_thumbnail_final.png",
  "student_ai_agreement_resource_card_final.png",
];

const aiCodingResourceFiles = [
  "lesson_plan_ai_as_coding_coach_final.pdf",
  "python_debugging_activity_final.pdf",
  "ask_ai_better_coding_questions_handout_final.pdf",
  "responsible_ai_use_in_coding_rubric_final.pdf",
  "student_safe_ai_coding_conversation_sample_final.pdf",
  "teacher_implementation_guide_ai_coding_final.pdf",
  "video_walkthrough_script_ai_debugging_without_cheating_final.pdf",
  "module_b_badge_final.png",
  "module_b_badge_header.png",
  "module_b_thumbnail_final.png",
  "module_b_resource_card_lesson_plan_final.png",
];

const cybersecurityResourceFiles = [
  "00_module_c_overview.docx",
  "01_lesson_plan_spot_the_phish.docx",
  "02_password_strength_activity.docx",
  "03_digital_footprint_reflection.docx",
  "04_cybersecurity_careers_one_pager.docx",
  "05_ai_cybersecurity_discussion_prompt.docx",
  "06_teacher_implementation_guide_cybersecurity.docx",
  "07_video_walkthrough_script_why_cybersecurity_belongs.docx",
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

console.log(`Checked ${routes.length} routes, shared assets, and ${aiLiteracyResourceFiles.length + aiCodingResourceFiles.length + cybersecurityResourceFiles.length} downloads.`);
