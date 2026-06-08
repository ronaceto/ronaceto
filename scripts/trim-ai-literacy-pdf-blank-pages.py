from pathlib import Path

from pypdf import PdfReader, PdfWriter


ROOT = Path(__file__).resolve().parents[1]
FOLDER = ROOT / "public" / "resources" / "ai-literacy-starter-kit"
FOOTER_PHRASE = "AI should help students think better, not think less"


def is_footer_only_page(text: str) -> bool:
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    meaningful = [
        line
        for line in lines
        if line not in {"A"}
        and not line.isdigit()
        and line != FOOTER_PHRASE
    ]
    return not meaningful and FOOTER_PHRASE in text


def trim_pdf(path: Path) -> tuple[int, int]:
    reader = PdfReader(str(path))
    writer = PdfWriter()
    page_count = len(reader.pages)
    keep_count = page_count

    while keep_count > 1:
        text = reader.pages[keep_count - 1].extract_text() or ""
        if not is_footer_only_page(text):
            break
        keep_count -= 1

    for index in range(keep_count):
        writer.add_page(reader.pages[index])

    writer.add_metadata(
        {
            "/Title": path.stem.replace("_", " "),
            "/Author": "Ron Aceto",
            "/Subject": "AI Literacy Starter Kit",
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
    for path in sorted(FOLDER.glob("*.pdf")):
        before, after = trim_pdf(path)
        print(f"{path.name}: {before} -> {after} pages")


if __name__ == "__main__":
    main()
