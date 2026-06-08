from pathlib import Path

from pypdf import PdfReader, PdfWriter


ROOT = Path(__file__).resolve().parents[1]
RESOURCE_ROOT = ROOT / "public" / "resources"
MODULE_FOOTERS = {
    "ai-literacy-starter-kit": {
        "letter": "A",
        "phrase": "AI should help students think better, not think less",
    },
    "ai-coding-starter-kit": {
        "letter": "B",
        "phrase": "AI should help students code better, not avoid learning code",
    },
    "cybersecurity-digital-ethics-starter-kit": {
        "letter": "C",
        "phrase": "Security skills should help students protect people, systems, and information.",
    },
}


def is_footer_only_page(text: str, module: dict[str, str]) -> bool:
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    footer_phrase = module["phrase"]
    module_letter = module["letter"]
    meaningful = [
        line
        for line in lines
        if line not in {module_letter}
        and not line.isdigit()
        and line != footer_phrase
    ]
    return not meaningful and footer_phrase in text


def trim_pdf(path: Path, module: dict[str, str], subject: str) -> tuple[int, int]:
    reader = PdfReader(str(path))
    writer = PdfWriter()
    page_count = len(reader.pages)
    keep_count = page_count

    while keep_count > 1:
        text = reader.pages[keep_count - 1].extract_text() or ""
        if not is_footer_only_page(text, module):
            break
        keep_count -= 1

    for index in range(keep_count):
        writer.add_page(reader.pages[index])

    writer.add_metadata(
        {
            "/Title": path.stem.replace("_", " "),
            "/Author": "Ron Aceto",
            "/Subject": subject,
            "/Producer": "RonAceto.com portfolio PDF maintenance",
        }
    )

    if keep_count != page_count:
        temp = path.with_suffix(".trimmed.pdf")
        with temp.open("wb") as handle:
            writer.write(handle)
        temp.replace(path)

    return page_count, keep_count


def main():
    for folder, module in MODULE_FOOTERS.items():
        subject = folder.replace("-", " ").title()
        for path in sorted((RESOURCE_ROOT / folder).glob("*.pdf")):
            before, after = trim_pdf(path, module, subject)
            print(f"{folder}/{path.name}: {before} -> {after} pages")


if __name__ == "__main__":
    main()
