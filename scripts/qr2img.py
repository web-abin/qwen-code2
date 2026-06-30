#!/usr/bin/env python3
"""
Convert terminal ANSI QR code (from acmp preview) to a PNG image.

Usage:
    python3 qr2img.py <typescript_file> [-o output.png]

The typescript_file is the raw terminal recording produced by:
    script -q /tmp/output.txt your_command

Parses ESC[47m (white) / ESC[40m (black) background color sequences
and renders them as a QR code image.
"""

import re
import sys
import os

def parse_qr_from_typescript(typescript_path: str):
    """Extract QR code bitmap from a script(1) typescript recording."""
    with open(typescript_path, 'rb') as f:
        raw = f.read()

    lines = raw.split(b'\n')
    qr_rows = []

    for line in lines:
        if b'[47m' not in line and b'[40m' not in line:
            continue
        cells = re.findall(rb'\x1b\[(47|40)m(?:  )?', line)
        row = []
        for code_str in cells:
            code = int(code_str)
            # 47 = white background, 40 = black background
            row.append(0 if code == 40 else 1)
        if row:
            qr_rows.append(row)

    if not qr_rows:
        raise ValueError("No QR code ANSI data found in the typescript file")

    return qr_rows


def render_qr(qr_rows, scale=10):
    """Render QR code bitmap to PNG using built-in modules only."""
    try:
        from PIL import Image
        has_pil = True
    except ImportError:
        has_pil = False

    h, w = len(qr_rows), len(qr_rows[0])

    if has_pil:
        img = Image.new('RGB', (w * scale, h * scale), 'white')
        pixels = img.load()
        for y in range(h):
            for x in range(w):
                color = (0, 0, 0) if qr_rows[y][x] == 0 else (255, 255, 255)
                for dy in range(scale):
                    for dx in range(scale):
                        pixels[x * scale + dx, y * scale + dy] = color
        return img
    else:
        # Fallback: write PPM (P6 format) - no libraries needed
        import struct
        img_width = w * scale
        img_height = h * scale
        # PPM P6: binary RGB
        ppm_header = f'P6\n{img_width} {img_height}\n255\n'.encode()
        pixels_data = bytearray()
        for y in range(img_height):
            for x in range(img_width):
                qx, qy = x // scale, y // scale
                val = 0 if qr_rows[qy][qx] == 0 else 255
                pixels_data.extend([val, val, val])
        return ppm_header + bytes(pixels_data)


def main():
    if len(sys.argv) < 2:
        print(f"Usage: {sys.argv[0]} <typescript_file> [-o output.png]")
        print(f"Hint: capture with: script -q /tmp/output.txt npm run preview")
        sys.exit(1)

    typescript_path = sys.argv[1]
    output_path = 'qr_code.png'
    if '-o' in sys.argv:
        idx = sys.argv.index('-o')
        if idx + 1 < len(sys.argv):
            output_path = sys.argv[idx + 1]

    qr_rows = parse_qr_from_typescript(typescript_path)
    print(f"QR code: {len(qr_rows)} rows x {len(qr_rows[0])} cols", file=sys.stderr)

    result = render_qr(qr_rows, scale=10)

    if hasattr(result, 'save'):
        result.save(output_path)
    else:
        with open(output_path, 'wb') as f:
            f.write(result)

    print(f"Saved to {os.path.abspath(output_path)}", file=sys.stderr)
    print(os.path.abspath(output_path))


if __name__ == '__main__':
    main()
