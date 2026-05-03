// Tracker script injetado em toda página proxificada.
// Importado por api/proxy.ts e vite.config.ts para evitar duplicação.
export function buildTracker(): string {
  return `<script>(function(){
var origin=location.origin;
function loading(){try{parent.postMessage({type:'omni-loading'},'*')}catch(e){}}
function nav(u){try{parent.postMessage({type:'omni-nav',url:u},'*')}catch(e){}}
// SPA navigation tracking
var pp=history.pushState,pr=history.replaceState;
history.pushState=function(){pp.apply(this,arguments);nav(location.href)};
history.replaceState=function(){pr.apply(this,arguments);nav(location.href)};
addEventListener('popstate',function(){nav(location.href)});
// GET form fix — form.submit() não dispara evento submit
function fixForm(f){
  if(!f||f.nodeName!=='FORM')return false;
  if((f.getAttribute('method')||'get').toLowerCase()!=='get')return false;
  try{
    var pa=new URL(f.action),orig=pa.searchParams.get('url');
    if(!orig)return false;
    var fd=new URLSearchParams(new FormData(f));
    loading();
    window.location.href=origin+'/api/proxy?url='+encodeURIComponent(orig.split('?')[0]+'?'+fd.toString());
    return true;
  }catch(ex){return false;}
}
document.addEventListener('submit',function(e){if(fixForm(e.target))e.preventDefault();},true);
var os=HTMLFormElement.prototype.submit;
HTMLFormElement.prototype.submit=function(){if(!fixForm(this))os.call(this);};
var ors=HTMLFormElement.prototype.requestSubmit;
if(ors)HTMLFormElement.prototype.requestSubmit=function(s){if(!fixForm(this))ors.call(this,s);};
// Cliques em links — redireciona links não-proxificados pelo proxy
document.addEventListener('click',function(e){
  var el=e.target;
  while(el&&el.nodeName!=='A')el=el.parentElement;
  if(!el)return;
  var href=el.getAttribute('href');
  if(!href||href.startsWith('javascript:')||href.startsWith('#')||href.startsWith('mailto:'))return;
  try{
    var abs=new URL(href,location.href).href;
    loading();
    if(href.indexOf('/api/proxy')===-1){
      e.preventDefault();
      window.location.href=origin+'/api/proxy?url='+encodeURIComponent(abs);
    }
  }catch(ex){}
},true);
})();</script>`;
}
