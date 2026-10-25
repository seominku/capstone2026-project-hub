'use strict';
const canvas=document.querySelector('#game'),cover=document.querySelector('#cover'),statusText=document.querySelector('#status'),progress=document.querySelector('#progress'),start=document.querySelector('#start'),retry=document.querySelector('#retry'),fullscreen=document.querySelector('#fullscreen');
let manifest,starting=false;
const objectUrls=[];
const say=message=>{statusText.textContent=message;};
const sha=async data=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',data)),b=>b.toString(16).padStart(2,'0')).join('');
async function fetchFile(file,onBytes){
 const buffers=[];
 for(const chunk of file.chunks){
  const response=await fetch(chunk.url);if(!response.ok)throw Error('다운로드 실패 ('+response.status+'). 잠시 뒤 다시 시도해 주세요.');
  let buffer;
  if(response.body){
   const reader=response.body.getReader(),bytes=new Uint8Array(chunk.bytes);let offset=0;
   while(true){const {done,value}=await reader.read();if(done)break;if(offset+value.byteLength>bytes.length)throw Error('파일 크기를 확인하지 못했습니다.');bytes.set(value,offset);offset+=value.byteLength;onBytes(value.byteLength);}
   buffer=bytes.buffer;if(offset!==chunk.bytes)throw Error('다운로드가 중단됐습니다. 다시 불러와 주세요.');
  }else{buffer=await response.arrayBuffer();onBytes(buffer.byteLength);}
  if(buffer.byteLength!==chunk.bytes||await sha(buffer)!==chunk.sha256)throw Error('파일 무결성 확인에 실패했습니다. 다시 불러와 주세요.');
  buffers.push(buffer);
 }
 const url=URL.createObjectURL(new Blob(buffers,{type:file.type||'application/octet-stream'}));objectUrls.push(url);return url;
}
function failed(error){console.error(error);cover.hidden=false;progress.hidden=true;start.hidden=true;retry.hidden=false;say('게임을 시작하지 못했습니다. '+(error?.message||String(error)));}
retry.addEventListener('click',()=>location.reload());
fullscreen.addEventListener('click',()=>{if(window.capstoneGame)window.capstoneGame.SetFullscreen(1);});
window.capstoneReturnToSite=()=>{location.href='../index.html';};
async function boot(){
 if(starting)return;starting=true;start.hidden=true;progress.hidden=false;say('게임 파일을 불러오는 중…');
 try{
  let loaded=0;const total=manifest.files.data.bytes+manifest.files.code.bytes+manifest.files.framework.bytes;
  const received=count=>{loaded+=count;progress.value=.75*loaded/total;say(`게임 파일 다운로드 ${Math.round(loaded/total*100)}% · ${(loaded/1048576).toFixed(1)} / ${(total/1048576).toFixed(1)} MB`);};
  // Single connection per file keeps transient download memory bounded. Unity's
  // official fallback recognizes its gzip marker even when served as a Blob URL.
  const dataUrl=await fetchFile(manifest.files.data,received),codeUrl=await fetchFile(manifest.files.code,received),frameworkUrl=await fetchFile(manifest.files.framework,received);
  say('압축 해제·게임 준비 중… 처음 실행은 시간이 걸릴 수 있습니다.');
  await new Promise((resolve,reject)=>{const script=document.createElement('script');script.src=manifest.loader;script.onload=resolve;script.onerror=()=>reject(Error('실행 로더를 불러오지 못했습니다.'));document.head.appendChild(script);});
  const config={dataUrl,frameworkUrl,codeUrl,streamingAssetsUrl:manifest.streamingAssetsUrl,companyName:manifest.companyName,productName:manifest.productName,productVersion:manifest.version,autoSyncPersistentDataPath:true,devicePixelRatio:1,matchWebGLToCanvasSize:false,showBanner:(message,type)=>{if(type==='error')failed(Error(message));else console.warn(message);}};
  window.capstoneGame=await createUnityInstance(canvas,config,value=>{progress.value=.75+.25*value;});
  objectUrls.splice(0).forEach(url=>URL.revokeObjectURL(url));cover.hidden=true;fullscreen.disabled=false;canvas.focus();
 }catch(error){failed(error);}
}
start.addEventListener('click',boot);
(async()=>{try{const test=document.createElement('canvas');if(!test.getContext('webgl2'))throw Error('이 브라우저에서 WebGL 2를 사용할 수 없습니다. Windows 설치판을 이용해 주세요.');const response=await fetch('build-manifest.json',{cache:'no-cache'});if(!response.ok)throw Error('실행 정보를 불러오지 못했습니다.');manifest=await response.json();say(`첫 실행 약 ${(manifest.downloadBytes/1048576).toFixed(0)} MB 다운로드 · ${manifest.version} · 브라우저 저장`);start.disabled=false;}catch(error){failed(error);}})();
