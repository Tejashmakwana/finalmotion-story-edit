'use strict';

const canvas=document.getElementById('fx');
const c=canvas.getContext('2d');
const plate=document.getElementById('plate');
let timeline={frames:2697,cues:[],moments:[]};
const media={};
const assetNames=['childhood','termux','vibe-coding','pfp','n8n','make'];
const assetFiles={childhood:'childhood.jpg',termux:'termux.png','vibe-coding':'vibe-coding.png',pfp:'pfp.png',n8n:'n8n.svg',make:'make.svg'};
for(const name of assetNames){const image=new Image();image.src=`assets/${assetFiles[name]}`;media[name]=image;}
for(const id of ['phone-video','example-0','example-1','example-2','example-3'])media[id]=document.getElementById(id);

const clamp=x=>Math.max(0,Math.min(1,x));
const out=x=>1-Math.pow(1-clamp(x),3);
const smooth=x=>{x=clamp(x);return x*x*(3-2*x)};
const mix=(a,b,p)=>a+(b-a)*p;
const GREEN='#087647',PAPER='#fffef9',RED='#ff453e';

function setFont(size,family='Caption',weight=700){c.font=`${weight} ${size}px ${family}`;c.textBaseline='middle';}
function text(value,x,y,size,color='#fff',align='center',family='Caption',weight=700){setFont(size,family,weight);c.textAlign=align;c.fillStyle=color;c.fillText(value,x,y);}
function rounded(x,y,w,h,r,fill,stroke=null,line=1){c.beginPath();c.roundRect(x,y,w,h,r);if(fill){c.fillStyle=fill;c.fill()}if(stroke){c.strokeStyle=stroke;c.lineWidth=line;c.stroke()}}
function coverImage(image,x,y,w,h){if(!image||!image.naturalWidth)return;const s=Math.max(w/image.naturalWidth,h/image.naturalHeight),sw=w/s,sh=h/s,sx=(image.naturalWidth-sw)/2,sy=(image.naturalHeight-sh)/2;c.drawImage(image,sx,sy,sw,sh,x,y,w,h)}
function coverVideo(video,x,y,w,h){if(!video||video.readyState<2)return;const vw=video.videoWidth||w,vh=video.videoHeight||h,s=Math.max(w/vw,h/vh),sw=w/s,sh=h/s,sx=(vw-sw)/2,sy=(vh-sh)/2;c.drawImage(video,sx,sy,sw,sh,x,y,w,h)}
function wordsLine(words,y,size,{family='Caption',color='#fff',gap=19,shadow=true,gradient=false,shake=null}={}){
 setFont(size,family);const widths=words.map(w=>c.measureText(w).width);const total=widths.reduce((a,b)=>a+b,0)+gap*Math.max(0,words.length-1);let x=(1920-total)/2;
 c.save();if(shadow){c.shadowColor='#0009';c.shadowBlur=12;c.shadowOffsetY=3}if(shake){c.translate(960+shake.x,540+shake.y);c.scale(shake.scale,shake.scale);c.translate(-960,-540)}
 for(let i=0;i<words.length;i++){const cx=x+widths[i]/2;if(gradient){const g=c.createLinearGradient(0,y-size/2,0,y+size/2);g.addColorStop(0,'#ff9a76');g.addColorStop(.42,'#ff453e');g.addColorStop(1,'#f3162e');c.fillStyle=g;c.shadowColor='#ff343d77';c.shadowBlur=22}else c.fillStyle=color;c.textAlign='center';c.fillText(words[i],cx,y);x+=widths[i]+gap}c.restore();
}
function visibleWords(cue,t){return cue.words.filter(w=>t>=w.s).map(w=>w.w)}
function camera(t){
 if(t<3.9)return 1.15-.13*out(t/.7);
 const edits=[[3.9,1],[8.3,1.10],[12.66,1.025],[14.94,1.025],[15.88,1.1],[19.43,1.14],[20.9,1.02],[23.5,1.10],[27.15,1],[32.55,1.12],[37.54,1.035],[42.43,1],[48.4,1.12],[53.3,1.025],[56.5,1.10],[65.48,1.025],[71.23,1.13],[75.528,1],[78.137,1.105],[84.797,1.025]];
 const base=[...edits].reverse().find(k=>t>=k[0])?.[1]||1;
 const push=[[4.1,7.8,.065],[27.3,31.9,.06],[48.6,52.8,.05],[75.6,77.95,.045]].find(([a,b])=>t>=a&&t<b);
 return base+(push?push[2]*smooth((t-push[0])/(push[1]-push[0])):0);
}
function drawVignette(){const g=c.createLinearGradient(0,590,0,1080);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(.48,'rgba(0,0,0,.10)');g.addColorStop(.75,'rgba(0,0,0,.38)');g.addColorStop(1,'rgba(0,0,0,.75)');c.fillStyle=g;c.fillRect(0,0,1920,1080)}
function drawIntro(t){
 const white=[['this',.06],['entire',.55],['video',1.24]],green=[['is',1.87],['edited',2.08],['by',2.7],['AI',3.1]];
 const draw=(items,y,size,family,color,glow)=>{setFont(size,family);const active=items.filter(x=>t>=x[1]);const widths=active.map(x=>c.measureText(x[0]).width),total=widths.reduce((a,b)=>a+b,0)+22*Math.max(0,active.length-1);let x=(1920-total)/2;c.textAlign='left';for(let i=0;i<active.length;i++){const [word,start]=active[i],q=out((t-start)*10);c.save();c.globalAlpha=q;c.translate(0,(1-q)*50);if(glow){c.shadowColor='#9cf56e88';c.shadowBlur=24;const g=c.createLinearGradient(0,y-size/2,0,y+size/2);g.addColorStop(0,'#b8ff4b');g.addColorStop(.42,'#9cf51a');g.addColorStop(1,'#91ed0b');c.fillStyle=g}else c.fillStyle=color;c.fillText(word,x,y);c.restore();x+=widths[i]+22}};
 draw(white,810,112,'Regular','#fafafa',false);draw(green,900,112,'Caption','#9cf51a',true);
}
function drawPhoto(t){
 c.fillStyle='#030303';c.fillRect(0,0,1920,1080);const q=out((t-10.35)/.45),s=.86+.14*q+.015*(t-10.35);c.save();c.translate(960,537);c.scale(s,s);coverImage(media.childhood,-365,-302,730,605);c.restore();
 c.save();c.globalAlpha=q;text('his old',340,540,145,'#fff','center','Editorial',400);text('computer',1610,550,128,'#fff','center','Editorial',400);c.restore();
}
function phoneShell(x,y,w,h,age,content){
 const q=out(age/.3);c.save();c.globalAlpha=q;c.translate(x,y+(1-q)*12);c.shadowColor='#0008';c.shadowBlur=28;c.shadowOffsetX=12;c.shadowOffsetY=22;rounded(0,0,w,h,51,'#667078');c.shadowColor='transparent';rounded(5,5,w-10,h-10,47,'#090b0d','#d7dade',2);c.save();c.beginPath();c.roundRect(13,25,w-26,h-44,34);c.clip();c.fillStyle='#000';c.fillRect(13,25,w-26,h-44);content(13,25,w-26,h-44);c.restore();rounded(w*.42,10,w*.16,5,3,'#353a40');c.beginPath();c.arc(w*.675,13,5,0,Math.PI*2);c.fillStyle='#172633';c.fill();c.restore();
}
function drawScreenshot(t,kind,start){
 c.fillStyle='rgba(0,0,0,.53)';c.fillRect(0,0,1920,1080);phoneShell(745,30,430,952,t-start,(x,y,w,h)=>coverImage(kind==='termux'?media.termux:media['vibe-coding'],x,y,w,h));
 const cue=timeline.cues.find(q=>t>=q.s&&t<q.e);if(cue)wordsLine(visibleWords(cue,t),990,91,{gap:18});
}
function drawCream(t){
 c.fillStyle=PAPER;c.fillRect(0,0,1920,1080);c.strokeStyle=GREEN;c.lineWidth=108;c.strokeRect(54,54,1812,972);const age=t-59.3,tr=smooth((t-61.2666667)/.1666667);
 c.save();c.globalAlpha=1-tr;text('vibe',255,440,76,GREEN,'left');text('coding.',255,565,174,GREEN,'left');c.restore();
 c.save();c.globalAlpha=tr;text('Python',255,510,186,GREEN,'left');text('scripts',780,625,48,GREEN,'left');c.restore();
 phoneShell(1375,95,400,890,age,(x,y,w,h)=>{coverImage(media['vibe-coding'],x,y,w,h);c.save();c.globalAlpha=tr;coverVideo(media['phone-video'],x,y,w,h);c.restore()});
}
function drawSpaced(t){const values=t<35.9?[['trying',34.897],['to',35.238],['recreate',35.438]]:[['some',35.919],['famous',36.56],['effect',37.061]];setFont(88,'Regular',400);const active=values.filter(x=>t>=x[1]);if(!active.length)return;const widths=active.map(x=>c.measureText(x[0]).width),available=1460-widths.reduce((a,b)=>a+b,0),gap=active.length>1?available/(active.length-1):0;let x=230;c.textAlign='left';c.fillStyle='#fff';c.shadowColor='#0008';c.shadowBlur=10;for(let i=0;i<active.length;i++){c.fillText(active[i][0],x,570);x+=widths[i]+gap}c.shadowColor='transparent'}
function drawCollage(t){
 c.fillStyle=GREEN;c.fillRect(0,0,1920,1080);rounded(32,32,1856,1016,12,PAPER);text('Bymaximise',960,148,136,GREEN);const subtitle=[['style',40.41],['of',40.772],['videos',40.913]].filter(x=>t>=x[1]).map(x=>x[0]);wordsLine(subtitle,270,58,{color:GREEN,shadow:false,gap:14});
 for(let i=0;i<4;i++){const q=out((t-39.55-i*.045)/.18),x=190+i*405,y=350+(1-q)*28;c.save();c.globalAlpha=q;rounded(x,y,330,570,14,'#102419',GREEN,5);c.save();c.beginPath();c.roundRect(x+5,y+5,320,560,9);c.clip();coverVideo(media[`example-${i}`],x+5,y+5,320,560);c.restore();c.restore()}
 const last=[['were',41.415],['going',41.596],['viral.',41.918]].filter(x=>t>=x[1]).map(x=>x[0]);wordsLine(last,980,65,{color:GREEN,shadow:false,gap:17});
}
function drawLogos(t){
 if(t>=68.13){const q=out((t-68.13)/.32);c.save();c.translate(340,382);c.rotate(-4*Math.PI/180);c.scale(.55+.45*q,.55+.45*q);rounded(-200,-82,400,165,20,'#fff');if(media.n8n.naturalWidth)c.drawImage(media.n8n,-135,-42,270,84);c.restore()}
 if(t>=68.61){const q=out((t-68.61)/.32);c.save();c.translate(1595,422);c.rotate(4*Math.PI/180);c.scale(.55+.45*q,.55+.45*q);rounded(-215,-82,430,165,20,'#fff');if(media.make.naturalWidth)c.drawImage(media.make,-160,-41,82,82);text('make',35,2,83,'#16111c');c.restore()}
}
function drawBox(t){const times=[69.15,69.32,69.6,70,70.3],values=[110,260,640,730,880];let w=values.at(-1);for(let i=1;i<times.length;i++)if(t<times[i]){w=mix(values[i-1],values[i],clamp((t-times[i-1])/(times[i]-times[i-1])));break}rounded(960-w/2,700,w,112,0,'#fff');const label=t<69.48?'AI':t<70.19?'AI automation':'AI automation agency';text(label,960-w/2+25,756,78,'#111','left')}
function drawFinal(t){const q=out((t-81.5)/.22);c.fillStyle='#ff5425';c.fillRect(0,0,1920,1080);c.fillStyle='#fff';c.fillRect(54,54,1812,972);c.save();c.globalAlpha=q;c.translate(0,(1-q)*12);text('the final boss of',960,440,72,'#111');text('AI editing.',960,600,190,'#111');c.restore()}
function badge(x,y){c.save();c.translate(x,y);c.fillStyle='#1d9bf0';c.beginPath();for(let i=0;i<16;i++){const a=-Math.PI/2+i*Math.PI/8,r=i%2?18:23,cx=Math.cos(a)*r,cy=Math.sin(a)*r;i?c.lineTo(cx,cy):c.moveTo(cx,cy)}c.closePath();c.fill();c.strokeStyle='#fff';c.lineWidth=4;c.lineCap='round';c.beginPath();c.moveTo(-10,0);c.lineTo(-2,8);c.lineTo(12,-9);c.stroke();c.restore()}
function drawFollow(t){const q=out((t-86.5)/.5),clicked=t>=89.1,cp=smooth((t-87.65)/1.2),press=clicked?1-.045*Math.sin(clamp((t-89.1)/.23)*Math.PI):1;c.save();c.globalAlpha=q;c.translate(960,915+(1-q)*100);c.scale((.65+.35*q)*press,(.65+.35*q)*press);rounded(-410,-89,820,178,89,'#111114');c.save();c.beginPath();c.arc(-313,0,71,0,Math.PI*2);c.clip();coverImage(media.pfp,-384,-71,142,142);c.restore();text('Tejas',-180,0,60,'#fff','center');badge(-65,0);rounded(185,-38,225,76,40,clicked?'#2a2a30':'#fff',clicked?'#777':'#fff',2);text(clicked?'Following':'Follow',297,1,38,clicked?'#fff':'#111','center','Regular',400);c.restore();c.save();c.translate(1480-245*cp,1050-140*cp);c.rotate(-13*Math.PI/180);c.beginPath();c.moveTo(8,5);c.lineTo(57,48);c.lineTo(35,51);c.lineTo(49,73);c.lineTo(35,80);c.lineTo(23,57);c.lineTo(8,75);c.closePath();c.fillStyle='#111';c.fill();c.strokeStyle='#fff';c.lineWidth=4;c.stroke();c.restore()}
function drawCaption(t){
 const cue=timeline.cues.find(q=>t>=q.s&&t<q.e);if(!cue)return;const txt=cue.words.map(w=>w.w).join(' ');const red=/^(AI|money|viral|crashed)$/.test(txt),cursive=txt==='all in',difference=t>=74.58&&t<75.3;const words=visibleWords(cue,t);if(!words.length)return;const f=(t-cue.s)*30,i=Math.max(0,Math.min(7,Math.floor(f))),shake={x:[0,3,-3,2,-1,1,0,0][i],y:[0,-32,25,-20,11,-4,1,0][i],scale:[1,1.055,1.025,1.04,1.01,1,1,1][i]};if(difference)c.globalCompositeOperation='difference';wordsLine(words,difference?545:775,difference?168:cursive?120:red?126:104,{family:cursive?'Accent':'Caption',gap:19,shadow:!difference&&!red,gradient:red,shake:red?shake:null});c.globalCompositeOperation='source-over';
}
function drawBlack(t){plate.style.filter='grayscale(1) brightness(.68) contrast(1.1)';const words=[['still',14.94],['I',15.18],['am.',15.39]].filter(x=>t>=x[1]).map(x=>x[0]);wordsLine(words,790,126,{gap:23})}

function draw(time){
 const t=Math.max(0,time)+(window.TIME_OFFSET||0);c.setTransform(1,0,0,1,0,0);c.clearRect(0,0,1920,1080);plate.style.transform=`scale(${camera(t)})`;plate.style.filter='none';drawVignette();
 const photo=t>=10.35&&t<12.66,black=t>=14.94&&t<15.88,termux=t>=25.7&&t<27.15,spaced=t>=34.897&&t<37.5,collage=t>=39.55&&t<42.4,cream=t>=59.3&&t<63.85,grok=t>=64&&t<65.48,box=t>=69.15&&t<70.85,difference=t>=74.58&&t<75.3,final=t>=81.5&&t<84.65,follow=t>=86.5;
 const special=t<3.9||photo||black||termux||spaced||collage||cream||grok||box||final||follow;
 if(t<3.9)drawIntro(t);else if(photo)drawPhoto(t);else if(black)drawBlack(t);else if(termux)drawScreenshot(t,'termux',25.7);else if(spaced)drawSpaced(t);else if(collage)drawCollage(t);else if(cream)drawCream(t);else if(grok)drawScreenshot(t,'grok',64);else if(final)drawFinal(t);else if(follow)drawFollow(t);else if(!special)drawCaption(t);
 if(t>=68.13&&t<71.05)drawLogos(t);if(box)drawBox(t);
}

window.drawFrame=draw;
window.addEventListener('hf-seek',event=>draw(event.detail.time));
const imageReady=assetNames.map(name=>new Promise(resolve=>{const img=media[name];if(img.complete)resolve();else{img.onload=resolve;img.onerror=resolve}}));
window.__filmReady=Promise.all([fetch('timeline.json').then(r=>r.json()).then(data=>{timeline=data}),document.fonts.ready,...imageReady]).then(()=>{window.__filmLoaded=true;draw(0)});
