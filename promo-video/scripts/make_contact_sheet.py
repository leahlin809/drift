from pathlib import Path

from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[1]
QA = ROOT / "qa"
FRAME_FILES = sorted(QA.glob("frame-*.png"))


def main() -> None:
    if len(FRAME_FILES) != 6:
        raise RuntimeError(f"expected 6 QA frames, found {len(FRAME_FILES)}")

    sheet = Image.new("RGB", (1920, 760), "#e8eae7")
    draw = ImageDraw.Draw(sheet)
    labels = ["02s", "06s", "10s", "14s", "18s", "22s"]
    for index, (path, label) in enumerate(zip(FRAME_FILES, labels, strict=True)):
        image = Image.open(path).convert("RGB").resize((640, 360), Image.Resampling.LANCZOS)
        x = (index % 3) * 640
        y = (index // 3) * 380
        sheet.paste(image, (x, y))
        draw.rectangle((x, y + 360, x + 640, y + 380), fill="#18221d")
        draw.text((x + 14, y + 362), label, fill="#f7f8f6")

    sheet.save(QA / "contact-sheet.png", optimize=True)


if __name__ == "__main__":
    main()
