import os, shutil

src = "/Users/aaryankarthik/.gemini/antigravity/scratch/crop-disease-predictor"
dst = "/Users/aaryankarthik/Desktop/crop-disease-predictor"

if not os.path.exists(dst):
    os.makedirs(dst, exist_ok=True)

copied_count = 0
for filename in os.listdir(src):
    if filename.startswith('.'):
        continue
    src_file = os.path.join(src, filename)
    dst_file = os.path.join(dst, filename)
    if os.path.isfile(src_file):
        try:
            shutil.copy2(src_file, dst_file)
            copied_count += 1
            print(f"✅ Copied {filename} -> Desktop")
        except Exception as e:
            print(f"⚠️ Could not copy {filename}: {e}")

print(f"\n🏆 Total Files Synced to Desktop: {copied_count}")
