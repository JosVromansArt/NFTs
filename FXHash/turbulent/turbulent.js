// License: CC BY-NC 4.0 www.josvromans.com
const layoutCanvas = async (windowObj = window) => {
  //  Get the window size, and devicePixelRatio
  const { innerWidth: wWidth, innerHeight: wHeight, devicePixelRatio = 1 } = windowObj
  let dpr = devicePixelRatio
  let cWidth = wWidth
  let cHeight = cWidth

  if (cHeight > wHeight) {
    cHeight = wHeight
    cWidth = wHeight
  }

  // Now set the target width and height
  let targetHeight = cHeight
  let targetWidth = targetHeight

  //  If the alba params are forcing the width, then use that (only relevant for Alba)
//  if (windowObj.alba?.params?.width) {
  targetWidth = 2000
  targetHeight = 2000
//  }

  // Update based on the dpr
  targetWidth *= dpr
  targetHeight *= dpr

  //  Set the canvas width and height
  C.width = targetWidth
  C.height = targetHeight

  C.style.position = 'absolute'
  C.style.width = `${cWidth}px`
  C.style.height = `${cHeight}px`
  C.style.left = `${(wWidth - cWidth) / 2}px`
  C.style.top = `${(wHeight - cHeight) / 2}px`

  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  //
  // Custom code (for defining textures and buffer canvas goes here) if needed
  //

  //  Re-Create the paper pattern
  art()
}




A=requestAnimationFrame;P=x=y=i=V=0;s=Math.sin;X=C.getContext('2d');R=(a=999)=>$fx.rand()*a;D=2000;
// set Features and such
B='ffe';N='000';W='fff';
d0=[W,N,'Black on White'];
d1=[B,'e33','Default'];
Z=[d0,d0,[N,W,'White on Black'],d1,d1,[B,'2d2','Green on Beige'],[B,'12d','Blue on Beige'],[N,'2d2','Green on Black']][R(7.5)|0]
M=80;MO=3+R(50)|0;

$fx.features({'Style':Z[2],'Mod':MO});
console.table({'Style':Z[2],'Mod':MO});

mD=~~Math.min(innerWidth, innerHeight);
Cs=C.style;C.width=C.height=D;
C.style.position = 'absolute';
Cs.width=Cs.height=`${mD}px`;
Cs.left = `${(innerWidth-mD)/2}px`;
Cs.top = `${(innerHeight-mD)/2}px`;


prepare=_=>{

}

art=_=>{

Q=c=>X.fillStyle='#'+c;
Q(Z[0]);
X.fillRect(0,0,D,D);Q(Z[1]);X.globalAlpha=Z[0]===N?.08:.1;O=Z[0]===W?1.5:1;
cN=(x,y,i)=>{if(i%MO<1){V=R(1)<.1?R(2)|0:(V+1)%2}let v=L[V];x+=(v[0]-x)/X1;y+=(v[1]-y)/X2;x+=s(y/DX)*MX;y+=MY*s(x/DY);return [x,y,V]}
sX=sY=1;Xa=Ya=0;b=_=>{x=y=i=V=0;m=n=99*D;o=p=-99*D;for(let i=0;i<30*D;i++){[x,y]=cN(x,y,i);i>D*3&&(x<m?(m=x):x>o&&(o=x),y<n?(n=y):y>p&&(p=y))}sX=(D-M*2)/(o-m);sY=(D-M*2)/(p-n);Xa=m*sX;Ya=n*sY}
T=(a)=>{for(let j=0;j<5e3;j++){[x,y,V]=cN(x,y,i);V===0&&X.fillRect(M+(x*sX)-Xa,M+(y*sY)-Ya,O,O);i++}i===1400*D&&(Q(Z[0]===N?W:N),O=1);i===2650*D&&(P=true);if(!P){A(T)}}
G=0;q=_=>{R()<600?(MY=16,MX=15,DY=31,DX=22,X1=38,X2=27):(DY=9+R(24),DX=9+R(24),X1=10+R(99),X2=5+R(80),MY=5+R(30),MX=5+R(35));L=[[R(),R()],[R(),R()]];b();G++;(sX>1.5&&sY>1.5&&sX<8&&sY<8)?A(T):G>20?A(T):q()};

}

layoutCanvas();

art();


document.addEventListener('keydown',function(e){if (e.code === 'Space'){e.preventDefault();P=!P;!P&&A(T)}});q();


//let preloadImagesTmr = null
//document.addEventListener('DOMContentLoaded', (event) => {
//  preloadImagesTmr = setInterval(() => {
//    preloadImages()
//  }, 333)
//  preloadImages()
//})
//
