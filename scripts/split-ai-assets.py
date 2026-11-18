"""Build immutable, checksum-verified chunks for resumable browser downloads."""
import hashlib
import json
from pathlib import Path

vendor = Path(__file__).resolve().parents[1] / 'public' / 'vendor'
folder = vendor / 'chunks'
folder.mkdir(exist_ok=True)
manifest = {}
for key, filename in [('wasm', 'ort-wasm-simd-threaded.wasm'), ('model', 'u2netp.onnx')]:
    data = (vendor / filename).read_bytes()
    chunks = []
    for start in range(0, len(data), 512 * 1024):
        part = data[start:start + 512 * 1024]
        digest = hashlib.sha256(part).hexdigest()
        name = digest + '.bin'
        (folder / name).write_bytes(part)
        chunks.append({'file': name, 'sha256': digest, 'size': len(part)})
    manifest[key] = {'size': len(data), 'sha256': hashlib.sha256(data).hexdigest(), 'chunks': chunks}
(folder / 'manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')
print('Built', sum(len(x['chunks']) for x in manifest.values()), 'verified download chunks')
