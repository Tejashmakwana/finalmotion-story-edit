# FinalMotion Hyperframes Renderer

A compact Hyperframes project for rendering the FinalMotion.video story edit.

## Render

Requires Node.js 22+, Python 3, and FFmpeg.

```bash
npm install
npm run check
npm run render
```

The finished 1920×1080, 30 fps video is written to:

```text
output/finalmotion-story-hyperframes.mp4
```

The project contains only the composition, render scripts, timeline, and media needed to reproduce the video.
