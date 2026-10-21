"""Rebuild the short character responses: python scripts/prepare-voices.py --ffmpeg PATH.

Downloads public samples into a temporary directory. Requires FFmpeg; no Python
packages. See docs/ASSETS.md for source attribution and the limits of restoration.
"""
import argparse
import json
from pathlib import Path
import subprocess
import tempfile
import urllib.request

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--ffmpeg', default='ffmpeg')
args = parser.parse_args()
root = Path(__file__).resolve().parents[1]
source = 'https://charactervoice.jp/files/2/xea10_kato/20191111/audio/'
clips = [
    ('greeting', 'voice_sapmle.mp3', None),
    ('like', 'voice_sapmle01.mp3', None),
    ('unlike', 'voice_sapmle02.mp3', (4.02, 7.85)),
]

with tempfile.TemporaryDirectory(prefix='selfpage-voice-') as folder:
    for name, filename, excerpt in clips:
        original = Path(folder) / filename
        urllib.request.urlretrieve(source + filename, original)
        filters = []
        if excerpt:
            filters += [f'atrim=start={excerpt[0]}:end={excerpt[1]}', 'asetpts=PTS-STARTPTS']
        # Keep the natural breaths and vocal colour; avoid aggressive denoising.
        filters += ['highpass=f=60', 'afade=t=in:d=0.01']
        prefix = ','.join(filters)
        target = 'loudnorm=I=-20:TP=-2:LRA=11'
        command = [args.ffmpeg, '-hide_banner', '-nostdin', '-i', str(original)]
        measured = subprocess.run(command + ['-af', prefix + ',' + target + ':print_format=json',
                                  '-f', 'null', '-'], check=True, capture_output=True, text=True)
        report = measured.stderr[measured.stderr.rfind('{'):]
        stats, _ = json.JSONDecoder().raw_decode(report)
        normalizer = target + ':linear=true:' + ':'.join([
            f'measured_I={stats["input_i"]}', f'measured_TP={stats["input_tp"]}',
            f'measured_LRA={stats["input_lra"]}', f'measured_thresh={stats["input_thresh"]}',
            f'offset={stats["target_offset"]}',
        ])
        output = root / 'public' / 'audio' / f'megumi-{name}.flac'
        subprocess.run(command + ['-y', '-af', prefix + ',' + normalizer,
                       '-ar', '44100', '-sample_fmt', 's16', '-c:a', 'flac',
                       '-map_metadata', '-1', str(output)], check=True, capture_output=True)
        print(f'{output.name}: source {stats["input_i"]} LUFS; target -20 LUFS / -2 dBTP')
