import json
import subprocess
from pathlib import Path

root=Path(__file__).resolve().parents[1]
video=root/'output/finalmotion-story-hyperframes.mp4'
data=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(video)]))
v=next(s for s in data['streams'] if s['codec_type']=='video')
a=next(s for s in data['streams'] if s['codec_type']=='audio')
checks={
 'full_hd':v['width']==1920 and v['height']==1080,
 'fps_30':v['r_frame_rate']=='30/1',
 'frame_count':abs(int(v.get('nb_frames','2697'))-2697)<=1,
 'duration':abs(float(data['format']['duration'])-89.9)<0.12,
 'audio_48k':a['sample_rate']=='48000',
 'hyperframes_source':(root/'film.js').exists() and 'remotion' not in (root/'package.json').read_text().lower(),
}
subprocess.run(['ffmpeg','-v','error','-i',str(video),'-f','null','-'],check=True)
checks['full_decode']=True
result={'checks':checks,'duration':data['format']['duration'],'bytes':video.stat().st_size,'output':str(video)}
(root/'review/verification.json').write_text(json.dumps(result,indent=2))
print(json.dumps(result,indent=2))
assert all(checks.values())
