from __future__ import annotations

import re
from pathlib import Path

from pypdf import PdfReader
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    KeepTogether,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
RESOURCE_ROOT = ROOT / "public" / "resources"

PRIMARY = colors.HexColor("#214D94")
SECONDARY = colors.HexColor("#C68439")
INK = colors.HexColor("#0F172A")
MUTED = colors.HexColor("#475569")
PALE_BLUE = colors.HexColor("#EFF6FF")
PALE_ORANGE = colors.HexColor("#FFF7ED")
BORDER = colors.HexColor("#DBEAFE")

MODULES = {
    "ai-literacy-starter-kit": {
        "name": "AI Literacy Starter Kit",
        "subtitle": "Responsible classroom routines for AI use, learning support, and student ownership.",
        "accent": PRIMARY,
        "icon": "AI",
    },
    "ai-coding-starter-kit": {
        "name": "AI + Coding Starter Kit",
        "subtitle": "Student-safe routines for debugging, coding questions, and responsible AI-supported programming.",
        "accent": SECONDARY,
        "icon": "</>",
    },
    "cybersecurity-digital-ethics-starter-kit": {
        "name": "Cybersecurity & Digital Ethics Starter Kit",
        "subtitle": "Defensive, ethical, career-connected cybersecurity habits for high school learners.",
        "accent": PRIMARY,
        "icon": "CS",
    },
}

STANDARDS_NOTE = (
    "Standards review note (June 2026): Tennessee Computer Science Foundations course standards "
    "(C10H11) remain published by the Tennessee Department of Education as May 2023 standards. "
    "Standards references in this resource are intended as cautious instructional alignment notes; "
    "final alignment should be confirmed against local district pacing, course placement, and current district guidance."
)

STRIP_PATTERNS = [
    re.compile(r"^Ron Aceto \| Teaching Portfolio Resource \| Page \d+$"),
    re.compile(r"^(AI Literacy Starter Kit|AI \+ Coding Starter Kit|Cybersecurity & Digital Ethics Starter Kit) \| .* \| Page \d+$"),
    re.compile(r"^Page \d+$"),
    re.compile(r"^RON ACETO TEACHING PORTFOLIO RESOURCE$"),
    re.compile(r"^Ron Aceto \| Teaching Portfolio$"),
    re.compile(r"^Resource$"),
    re.compile(r"^(AI|CS|</>)$"),
    re.compile(r"^Designed for practical classroom use"),
    re.compile(r"^standards-aware planning notes\.?$"),
    re.compile(r"^Responsible classroom routines for AI use"),
    re.compile(r"^Student-safe routines for debugging"),
    re.compile(r"^Defensive, ethical, career-connected cybersecurity habits"),
    re.compile(r"^(AI Literacy Starter Kit|AI \+ Coding Starter Kit|Cybersecurity & Digital Ethics Starter Kit) \| Updated June 2026$"),
    re.compile(r"^Updated June 2026 for mobile readability and standards-review clarity\.?$"),
    re.compile(r"^Updated June 2026 for improved readability, mobile-friendly layout, and standards-review clarity\.?$"),
    re.compile(r"^Standards review note \(June 2026\):"),
]

TITLE_OVERRIDES = {
    "AI_Cybersecurity_Discussion_Prompt": "AI + Cybersecurity Discussion Prompt",
    "Ask_AI_Better_Coding_Questions_Handout": "Ask AI Better Coding Questions Handout",
    "Better_Prompts_vs_Shortcut_Prompts_Activity": "Better Prompts vs. Shortcut Prompts Activity",
    "Cybersecurity_Careers_One_Pager": "Cybersecurity Careers One-Pager",
    "Digital_Footprint_Reflection": "Digital Footprint Reflection",
    "Lesson_Plan_AI_as_Coding_Coach": "Lesson Plan: AI as Coding Coach",
    "Lesson_Plan_AI_as_Learning_Partner": "Lesson Plan: AI as Learning Partner",
    "Lesson_Plan_Spot_the_Phish": "Lesson Plan: Spot the Phish",
    "Module_C_Overview": "Module C Overview",
    "Password_Strength_Activity": "Password Strength Activity",
    "Python_Debugging_Activity": "Python Debugging Activity",
    "Responsible_AI_Use_Checklist": "Responsible AI Use Checklist",
    "Responsible_AI_Use_in_Coding_Rubric": "Responsible AI Use in Coding Rubric",
    "Student_AI_Agreement": "Student AI Agreement",
    "Student_Safe_AI_Coding_Conversation_Sample": "Student-Safe AI Coding Conversation Sample",
    "Teacher_Implementation_Guide_AI_Coding": "Teacher Implementation Guide: AI Coding",
    "Teacher_Implementation_Guide_AI_Literacy": "Teacher Implementation Guide: AI Literacy",
    "Teacher_Implementation_Guide_Cybersecurity": "Teacher Implementation Guide: Cybersecurity",
    "Video_Walkthrough_Script_AI_Debugging_Without_Cheating": "Video Walkthrough Script: AI Debugging Without Cheating",
    "Video_Walkthrough_Script_AI_Literacy": "Video Walkthrough Script: AI Literacy",
    "Video_Walkthrough_Script_Why_Cybersecurity_Belongs": "Video Walkthrough Script: Why Cybersecurity Belongs",
}


def clean_text(text: str) -> list[str]:
    text = text.replace("\x7f", "-")
    text = text.replace("\u2022", "-")
    text = text.replace("\u2013", "-")
    text = text.replace("\u2014", "-")
    text = text.replace("\u2018", "'").replace("\u2019", "'")
    text = text.replace("\u201c", '"').replace("\u201d", '"')
    text = text.replace("Ron Aceto | Teaching Portfolio Resource | Page", "\nRon Aceto | Teaching Portfolio Resource | Page")

    lines: list[str] = []
    skip_standards_continuation = False
    for raw in text.splitlines():
        line = re.sub(r"\s+", " ", raw).strip()
        if not line:
            continue
        if any(pattern.search(line) for pattern in STRIP_PATTERNS):
            skip_standards_continuation = line.startswith("Standards review note")
            continue
        if skip_standards_continuation:
            if line.endswith(".") and "district guidance" in line:
                skip_standards_continuation = False
            continue
        if line.startswith("Detailed standards connection appears"):
            continue
        if line.startswith("Standards summary:"):
            continue
        if line.startswith("used as part of AI literacy"):
            continue
        if line in {"Teaching Portfolio Resource", "Ron Aceto"}:
            continue
        lines.append(line)
    return collapse_repeated_cover_lines(lines)


def collapse_repeated_cover_lines(lines: list[str]) -> list[str]:
    seen_intro = set()
    output: list[str] = []
    for line in lines:
        key = line.lower()
        if key in seen_intro and (
            "starter kit" in key
            or key.startswith("purpose:")
            or key in {"teacher resource", "student activity", "students", "teachers"}
        ):
            continue
        if len(seen_intro) < 12:
            seen_intro.add(key)
        output.append(line)
    return output


def extract_pdf_lines(path: Path) -> list[str]:
    reader = PdfReader(str(path))
    text = "\n".join(page.extract_text() or "" for page in reader.pages)
    return clean_text(text)


def infer_title(path: Path, lines: list[str]) -> str:
    return TITLE_OVERRIDES.get(path.stem, path.stem.replace("_", " "))


def classify_line(line: str, index: int) -> str:
    lower = line.lower()
    if index == 0:
        return "title"
    if lower.startswith(("purpose:", "essential question", "student-safe note", "standards connection")):
        return "callout"
    if lower.startswith(("teacher note", "student directions", "before i submit", "recommended use", "implementation note")):
        return "h2"
    if line.endswith(":") and len(line) <= 90:
        return "h2"
    if len(line) <= 72 and not line.endswith((".", ",", ";")) and not re.search(r"\d{2,}", line):
        return "h2"
    if re.match(r"^[-*]\s+", line):
        return "bullet"
    return "body"


def paragraph_text(line: str) -> str:
    escaped = (
        line.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
    )
    return escaped


def make_styles(accent):
    styles = getSampleStyleSheet()
    return {
        "cover_kicker": ParagraphStyle(
            "cover_kicker",
            parent=styles["Normal"],
            fontName="Helvetica-Bold",
            fontSize=10,
            leading=13,
            textColor=SECONDARY,
            alignment=TA_CENTER,
            spaceAfter=12,
        ),
        "cover_title": ParagraphStyle(
            "cover_title",
            parent=styles["Title"],
            fontName="Helvetica-Bold",
            fontSize=28,
            leading=32,
            textColor=INK,
            alignment=TA_CENTER,
            spaceAfter=14,
        ),
        "cover_subtitle": ParagraphStyle(
            "cover_subtitle",
            parent=styles["Normal"],
            fontName="Helvetica",
            fontSize=12,
            leading=17,
            textColor=MUTED,
            alignment=TA_CENTER,
            spaceAfter=18,
        ),
        "cover_meta": ParagraphStyle(
            "cover_meta",
            parent=styles["Normal"],
            fontName="Helvetica-Bold",
            fontSize=10,
            leading=13,
            textColor=INK,
            alignment=TA_CENTER,
        ),
        "h1": ParagraphStyle(
            "h1",
            parent=styles["Heading1"],
            fontName="Helvetica-Bold",
            fontSize=20,
            leading=24,
            textColor=INK,
            spaceBefore=6,
            spaceAfter=10,
        ),
        "h2": ParagraphStyle(
            "h2",
            parent=styles["Heading2"],
            fontName="Helvetica-Bold",
            fontSize=13,
            leading=16,
            textColor=accent,
            spaceBefore=12,
            spaceAfter=5,
        ),
        "body": ParagraphStyle(
            "body",
            parent=styles["BodyText"],
            fontName="Helvetica",
            fontSize=10.5,
            leading=15,
            textColor=INK,
            spaceAfter=7,
        ),
        "bullet": ParagraphStyle(
            "bullet",
            parent=styles["BodyText"],
            fontName="Helvetica",
            fontSize=10.5,
            leading=15,
            leftIndent=14,
            firstLineIndent=-8,
            textColor=INK,
            spaceAfter=5,
        ),
        "callout": ParagraphStyle(
            "callout",
            parent=styles["BodyText"],
            fontName="Helvetica",
            fontSize=10.5,
            leading=15,
            textColor=INK,
            spaceAfter=0,
        ),
        "small": ParagraphStyle(
            "small",
            parent=styles["Normal"],
            fontName="Helvetica",
            fontSize=8.5,
            leading=11,
            textColor=MUTED,
        ),
    }


def icon_table(icon: str, accent):
    return Table(
        [[Paragraph(icon, ParagraphStyle("icon_text", fontName="Helvetica-Bold", fontSize=16, textColor=colors.white, alignment=TA_CENTER))]],
        colWidths=[0.62 * inch],
        rowHeights=[0.62 * inch],
        style=TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), accent),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                ("BOX", (0, 0), (-1, -1), 0, accent),
            ]
        ),
    )


def callout_table(text: str, style, accent, background=PALE_BLUE):
    return Table(
        [[Paragraph(paragraph_text(text), style)]],
        colWidths=[6.55 * inch],
        style=TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), background),
                ("BOX", (0, 0), (-1, -1), 0.7, BORDER),
                ("LEFTPADDING", (0, 0), (-1, -1), 12),
                ("RIGHTPADDING", (0, 0), (-1, -1), 12),
                ("TOPPADDING", (0, 0), (-1, -1), 9),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 9),
                ("LINEBEFORE", (0, 0), (0, -1), 4, accent),
            ]
        ),
    )


class TeachingPdfTemplate(BaseDocTemplate):
    def __init__(self, filename: str, resource_title: str, module_name: str, accent, **kwargs):
        self.resource_title = resource_title
        self.module_name = module_name
        self.accent = accent
        super().__init__(filename, pagesize=letter, **kwargs)
        frame = Frame(
            self.leftMargin,
            self.bottomMargin,
            self.width,
            self.height,
            leftPadding=0,
            rightPadding=0,
            topPadding=0,
            bottomPadding=0,
        )
        self.addPageTemplates([PageTemplate(id="main", frames=[frame], onPage=self.draw_page_chrome)])

    def draw_page_chrome(self, canvas, doc):
        canvas.saveState()
        width, height = letter
        canvas.setFillColor(PALE_BLUE)
        canvas.rect(0, height - 0.34 * inch, width, 0.34 * inch, stroke=0, fill=1)
        canvas.setFillColor(self.accent)
        canvas.rect(0, height - 0.08 * inch, width, 0.08 * inch, stroke=0, fill=1)
        canvas.setFont("Helvetica-Bold", 8.5)
        canvas.setFillColor(MUTED)
        header = f"{self.module_name} | {self.resource_title}"
        max_width = width - 1.4 * inch
        while stringWidth(header, "Helvetica-Bold", 8.5) > max_width and len(header) > 16:
            header = header[:-2]
        canvas.drawString(0.7 * inch, height - 0.24 * inch, header)
        canvas.setFont("Helvetica", 8.5)
        canvas.drawRightString(width - 0.7 * inch, 0.45 * inch, f"Ron Aceto | Page {doc.page}")
        canvas.restoreState()


def build_story(path: Path, module_key: str, lines: list[str]):
    module = MODULES[module_key]
    title = infer_title(path, lines)
    styles = make_styles(module["accent"])
    story = []

    story.append(Spacer(1, 0.55 * inch))
    story.append(icon_table(module["icon"], module["accent"]))
    story.append(Spacer(1, 0.25 * inch))
    story.append(Paragraph("RON ACETO TEACHING PORTFOLIO RESOURCE", styles["cover_kicker"]))
    story.append(Paragraph(paragraph_text(title), styles["cover_title"]))
    story.append(Paragraph(paragraph_text(module["subtitle"]), styles["cover_subtitle"]))
    story.append(
        callout_table(
            "Designed for practical classroom use with student-safe language, clear routines, and standards-aware planning notes.",
            styles["callout"],
            module["accent"],
            PALE_ORANGE if module["accent"] == SECONDARY else PALE_BLUE,
        )
    )
    story.append(Spacer(1, 0.25 * inch))
    story.append(Paragraph(f"{module['name']} | Updated June 2026", styles["cover_meta"]))
    story.append(PageBreak())

    content_lines = lines[1:] if lines and lines[0] == title else lines
    story.append(Paragraph(paragraph_text(title), styles["h1"]))
    story.append(
        callout_table(
            STANDARDS_NOTE,
            styles["callout"],
            module["accent"],
            PALE_BLUE,
        )
    )
    story.append(Spacer(1, 0.08 * inch))

    for index, line in enumerate(content_lines):
        kind = classify_line(line, index + 1)
        if line == STANDARDS_NOTE:
            continue
        if kind == "h2":
            story.append(Paragraph(paragraph_text(line.rstrip(":")), styles["h2"]))
        elif kind == "callout":
            story.append(Spacer(1, 0.04 * inch))
            story.append(callout_table(line, styles["callout"], module["accent"], PALE_ORANGE))
            story.append(Spacer(1, 0.06 * inch))
        elif kind == "bullet":
            story.append(Paragraph(paragraph_text("- " + line.lstrip("-* ")), styles["bullet"]))
        else:
            story.append(Paragraph(paragraph_text(line), styles["body"]))

    story.append(Spacer(1, 0.16 * inch))
    story.append(
        KeepTogether(
            [
                Paragraph("Accessibility and Use", styles["h2"]),
                Paragraph(
                    "This PDF uses selectable text, a single-column reading order, high-contrast colors, consistent headings, and generous spacing to support desktop, tablet, and mobile viewing.",
                    styles["body"],
                ),
            ]
        )
    )
    return title, story


def regenerate_pdf(path: Path, module_key: str) -> tuple[str, int]:
    lines = extract_pdf_lines(path)
    title, story = build_story(path, module_key, lines)
    temp = path.with_suffix(".tmp.pdf")
    module = MODULES[module_key]
    doc = TeachingPdfTemplate(
        str(temp),
        title,
        module["name"],
        module["accent"],
        rightMargin=0.72 * inch,
        leftMargin=0.72 * inch,
        topMargin=0.62 * inch,
        bottomMargin=0.72 * inch,
        title=title,
        author="Ron Aceto",
        subject=module["name"],
    )
    doc.build(story)
    temp.replace(path)
    return title, len(PdfReader(str(path)).pages)


def main():
    regenerated = []
    for module_key in MODULES:
        folder = RESOURCE_ROOT / module_key
        for path in sorted(folder.glob("*.pdf")):
            title, pages = regenerate_pdf(path, module_key)
            regenerated.append((path.relative_to(ROOT), title, pages))
    for rel, title, pages in regenerated:
        print(f"{rel} | {pages} pages | {title}")


if __name__ == "__main__":
    main()
