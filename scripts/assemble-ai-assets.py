"""Assemble pinned, downloaded inference dependencies into the static build."""
from pathlib import Path
import hashlib
import shutil

root = Path(__file__).resolve().parents[1]
target = root / 'public' / 'vendor'
target.mkdir(exist_ok=True)
model = Path('/private/tmp/tea-u2netp.onnx')
assert hashlib.sha256(model.read_bytes()).hexdigest() == '309c8469258dda742793dce0ebea8e6dd393174f89934733ecc8b14c76f4ddd8'
assert Path('/private/tmp/tea-ort-complete.wasm').stat().st_size == 11246032
for source, name in [
    ('tea-u2netp.onnx', 'u2netp.onnx'),
    ('tea-ort.js', 'ort.wasm.min.js'),
    ('tea-ort.mjs', 'ort-wasm-simd-threaded.mjs'),
    ('tea-ort-complete.wasm', 'ort-wasm-simd-threaded.wasm'),
    ('tea-ort-license', 'ONNX-RUNTIME-LICENSE.txt'),
    ('tea-u2net-license', 'U2NET-LICENSE.txt'),
]:
    shutil.copyfile(Path('/private/tmp') / source, target / name)
print('Pinned AI assets assembled; model SHA256 verified.')
