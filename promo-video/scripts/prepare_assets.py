from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets" / "source"
OUTPUT = ROOT / "public" / "assets"
PHONE_CROP = (410, 16, 870, 720)


def main() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    for source_path in SOURCE.glob("*.png"):
        image = Image.open(source_path).convert("RGB")
        cropped = image.crop(PHONE_CROP)
        cropped.save(OUTPUT / source_path.name, optimize=True)
        print(f"prepared {source_path.name}: {cropped.size[0]}x{cropped.size[1]}")


if __name__ == "__main__":
    main()
