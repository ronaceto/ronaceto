import { readFileSync } from "node:fs";

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
];

const requiredFragments = [
  ["index.html", "Ron Aceto"],
  ["index.html", "Experienced Technology Leader and Educator Pivoting to CTE Teaching"],
  ["index.html", "/1masterronacetoresume.pdf"],
  ["teaching-philosophy.html", "How Industry Experience Shapes My Teaching"],
  ["teaching-philosophy.html", "Evidence: AI + Coding lesson artifacts"],
  ["portfolio.html", "Teaching Portfolio"],
  ["portfolio.html", "Explore Classroom Artifacts"],
  ["portfolio.html", "/ai-literacy-starter-kit"],
  ["portfolio.html", "/ai-coding-starter-kit"],
  ["portfolio.html", "/cybersecurity-digital-ethics-starter-kit"],
  ["ai-technology-education.html", "url=/portfolio"],
  ["ai-literacy-starter-kit.html", "Module A: AI Literacy Starter Kit"],
  ["ai-literacy-starter-kit.html", "student_ai_agreement_final_v2.pdf"],
  ["ai-coding-starter-kit.html", "Module B: AI + Coding Starter Kit"],
  ["ai-coding-starter-kit.html", "AI should help students code better, not avoid learning code."],
  ["ai-coding-starter-kit.html", "lesson_plan_ai_as_coding_coach_final_v2.pdf"],
  ["cybersecurity-digital-ethics-starter-kit.html", "Cybersecurity &amp; Digital Ethics Starter Kit"],
  ["cybersecurity-digital-ethics-starter-kit.html", "Security skills should help students protect people, systems, and information."],
  ["cybersecurity-digital-ethics-starter-kit.html", "lesson_plan_spot_the_phish_final.pdf"],
  ["cybersecurity-digital-ethics-starter-kit.html", "module_c_thumbnail_final.png"],
  ["cybersecurity-digital-ethics-starter-kit.html", "Standards Connection: These resources may support Tennessee Computer Science Foundations"],
  ["professional-development.html", "Teaching Licensure Progress"],
  ["professional-development.html", "Currently preparing for Praxis: Computer Science"],
  ["experience.html", "Interim Computer Science Teacher, Collierville High School (February-May 2026)"],
  ["experience.html", "saving approximately $750K annually"],
  ["contact.html", "ronaceto@outlook.com"],
  ["site.css", ":root"],
];

const forbiddenFragments = [
  ["portfolio.html", "Placeholder"],
  ["portfolio.html", "Phase 1"],
  ["portfolio.html", "Portfolio Samples"],
  ["professional-development.html", "Pending"],
  ["professional-development.html", "Passed.</dd>"],
  ["index.html", "Currently an interim"],
  ["index.html", "Curriculum Developer | Team Builder"],
];

const aiLiteracyResourceFiles = [
  "student_ai_agreement_final_v2.pdf",
  "responsible_ai_use_checklist_final_v2.pdf",
  "better_prompts_vs_shortcuts_activity_final_v2.pdf",
  "lesson_plan_ai_as_learning_partner_final_v2.pdf",
  "teacher_implementation_guide_final_v2.pdf",
  "video_walkthrough_script_final_v2.pdf",
  "module_a_badge_final_v2.png",
  "module_a_thumbnail_final_v2.png",
  "module_a_resource_card_student_ai_agreement_final_v2.png",
];

const aiCodingResourceFiles = [
  "lesson_plan_ai_as_coding_coach_final_v2.pdf",
  "python_debugging_activity_final_v2.pdf",
  "ask_ai_better_coding_questions_handout_final_v2.pdf",
  "responsible_ai_use_in_coding_rubric_final_v2.pdf",
  "student_safe_ai_coding_conversation_sample_final_v2.pdf",
  "teacher_implementation_guide_ai_coding_final_v2.pdf",
  "video_walkthrough_script_ai_debugging_without_cheating_final_v2.pdf",
  "module_b_badge_final_v2.png",
  "module_b_thumbnail_final_v2.png",
  "module_b_resource_card_ai_as_coding_coach_final_v2.png",
];

const cybersecurityResourceFiles = [
  "module_c_overview_final.pdf",
  "lesson_plan_spot_the_phish_final.pdf",
  "password_strength_activity_final.pdf",
  "digital_footprint_reflection_final.pdf",
  "cybersecurity_careers_one_pager_final.pdf",
  "ai_cybersecurity_discussion_prompt_final.pdf",
  "teacher_implementation_guide_cybersecurity_final.pdf",
  "video_walkthrough_script_why_cybersecurity_belongs_final.pdf",
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

console.log(`Checked ${routes.length} routes, shared assets, and ${aiLiteracyResourceFiles.length + aiCodingResourceFiles.length + cybersecurityResourceFiles.length} downloads.`);
