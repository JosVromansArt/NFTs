SEED=Math.random()*99999999999|0;
SEED = -1338485593;
//SEED = 1327686124;
console.log(SEED, 'seed');
S=Uint32Array.of(9,7,5,3);
R=(a=1)=>a*(a=S[3],S[3]=S[2],S[2]=S[1],a^=a<<11,S[0]^=a^a>>>8^(S[1]=S[0])>>>19,S[0]/2**32);
[...SEED+'ThxPiter'].map(c=>R(S[0]^=c.charCodeAt()*S[3]));
A=window.requestAnimationFrame;
FILE_NAME = `FLAKES_`;

C.width=W=1200;
C.height=H=1800;
WW=window.innerWidth;
WH=window.innerHeight;
SCALE = (WW/WH>2/3)?WH/H:WW/W;  // the scale will depend on the longest or shortest side, depending how it fits the current window
C.style.width=`${W*SCALE}px`;
C.style.height=`${H*SCALE}px`;

X=C.getContext('2d');
X.fillStyle='#fff';
X.fillRect(0,0,W,H);


hslToStr=(h,s,l,a=1)=>'hsl(' + h + ',' + s + '%,' + l + '%,' + a + ')';
getMidpoint=(a,b)=>[(a[0] + b[0])/2,(a[1] + b[1])/2];
getTriangleArea=(x1,y1,x2,y2,x3,y3)=>Math.abs((x1*(y2-y3)+x2*(y3-y1)+x3*(y1-y2))/2);
getPointOnLine=(a,b,perc)=>{  // relative to a !!
    let diffX = perc * (b[0] - a[0]);
    let diffY = perc * (b[1] - a[1]);
    return [diffX,diffY];
}


PAUSED=false;
DEPTH=7;
TEXTURE = true;  // if false, fill a rectangle with the single color, for faster test rendering
PALETTE = [[200, 99, 39],[43, 81, 48],[155, 96, 11],[148, 100, 23],[32, 15, 80],[357, 94, 30],[183, 100, 26],[183, 100, 16],[192, 64, 47],[243, 78, 17],[217, 92, 44],[225, 89, 35],[173, 16, 70]]
//PALETTE = PALETTE.map(c=>hslToStr(...c))

determineCompositionType=(rv=R())=>rv<.1?'Z':(rv<.3?'A':(rv<.66?'B':'C'));
COMPOSITION_TYPE = determineCompositionType();
console.log(COMPOSITION_TYPE, '   composition')


getStartTriangles=_=>{
    let verts = [[0,0],[W,0],[W,H],[0,H]];
    [
        [1,2],  // BC  index 4
        [3,0],  // DA  index 5
        [2,4],  // BBC  index 6
        [5,3],  // BAD  index 7
        [5,1],  // BAB  index 8
    ].map(co=>{
        verts.push(getMidpoint(verts[co[0]],verts[co[1]]))
    })
    return {
        'Z':[[0, 1, 6],[6, 0, 7],[6, 2, 7],[7,3,2]],
        'A':[[0,1,2],[2,0,3]],
        'B':[[0, 1, 4],[4, 0, 5],[5, 4, 3],[4, 3,2]],
        'C':[[0, 1, 5],[1, 8, 2],[8, 2, 5],[5, 2, 3]],
    }[COMPOSITION_TYPE].map(t=>[verts[t[0]], verts[t[1]], verts[t[2]]])
}


function random_in_triangle(a,b,c){
    let perc1 = 0.2+R()*.6;

    let maxrange = 1-perc1;
    let perc2 = R() * maxrange * .8 + maxrange*.1;
    let P1 = getPointOnLine(a,b,perc1);
    let P2 = getPointOnLine(a,c,perc2);

    return [
        a[0]+P1[0]+P2[0],
        a[1]+P1[1]+P2[1]
    ]
}


// recursively draw division lines
draw_y=(a,b,c, iter=0,color='#000')=>{
    let inside = random_in_triangle(a,b,c);

    draw_line(a, inside, color, 1)
    draw_line(b, inside, color, 1)
    draw_line(c, inside, color, 1)

    X.lineWidth=.6;

    if (iter<2){
        draw_y(a,b,inside,iter+1);
        draw_y(b,c,inside,iter+1);
        draw_y(c,a,inside,iter+1);
    }
}

function draw_line(a, b, color, width){
    X.lineWidth = width;
    X.strokeStyle = color;
    X.beginPath();
    X.moveTo(...a);
    X.lineTo(...b);
    X.stroke();
}
function draw_triangle(a,b,c,color='black'){
    draw_line(a,b,color,.2)
    draw_line(b,c,color,.2)
    draw_line(c,a,color,.2)
}


class Flake {
    // A Flake is one 3th of a parent triangle. So it has 2 siblings with a similar hue but different lighting
    constructor(a,b,c, hue,s,l){
        this.a=a;
        this.b=b;
        this.c=c;
        let triBound = [...a,...b,...c];

        this.hue=hue;
        this.s=s;
        this.l=l;
        this.palette = [
            hslToStr(hue, 60, l),
            hslToStr(hue, 90, l),
            hslToStr(hue, 10, l),
        ]

        this.area = getTriangleArea(...triBound);

        this.minX = Math.min(triBound[0],triBound[2], triBound[4]);
        this.maxX = Math.max(triBound[0],triBound[2], triBound[4]);
        this.minY = Math.min(triBound[1],triBound[3], triBound[5]);
        this.maxY = Math.max(triBound[1],triBound[3], triBound[5]);

        this.center = [(this.minX+this.maxX)/2, (this.minY+this.maxY)/2];  // choose center of bbox
//        this.center = [triBound[0], triBound[1]];

        // todo: allow more starting points for one triangle. SO the colors from the palette can be mixed
        // take as many walks as there are colors in the palette?
        this.previous = []; // random point on triangle BBox to start? Will be updated as we walk
        for (let i=0; i<this.palette.length; i++){
            let sp = this.getPointOnBbox();
            this.previous.push(sp)
        }
        this.counter=0;  // keep track of frame in the case of texturing
    }

    getPointOnBbox(){
            // the start point of the random walk lies on the bbox around the triangle, so it will actually start outside the triangle
            let width = this.maxX - this.minX;
            let height = this.maxY - this.minY;

            if (R()*(width+height)<height){  // todo: test if this is correctly based on the width/height ratio
                // choose a point on one of the left or right border, so the x is fixed and the y is random
                return [R()<.5?this.minX:this.maxX, this.minY + height*R()];
            } else {
                // choose a point on the top or left border, so the y is fixed and the x is random
                return [this.minX + width * R(), R()<.5?this.minY:this.maxY];
            }
    }

    pointInside(px, py) {
        let [ax, ay, bx, by, cx, cy] = [...this.a,...this.b,...this.c];

        let A1 = getTriangleArea(px,py,ax,ay,bx,by);
        let A2 = getTriangleArea(px,py,ax,ay,cx,cy);
        let A3 = getTriangleArea(px,py,bx,by,cx,cy);

        return Math.abs(this.area-(A1+A2+A3)) < 3;
//        return (cx - px) * (ay - py) - (ax - px) * (cy - py) >= 0 && (ax - px) * (by - py) - (bx - px) * (ay - py) >= 0 && (bx - px) * (cy - py) - (cx - px) * (by - py) >= 0;
    }

    determineNext(cPercentage, maxStep){
        let newPrevious = [];
        for (let i=0; i<this.previous.length; i++){
            let previous = this.previous[i];

            let x_add = previous[0] < this.center[0];
            let y_add = previous[1] < this.center[1];

            let addY=0;
            let addX=0;

            if (R() < cPercentage){
                if (x_add){
                    addX = R()*maxStep;
                } else {
                    addX = -R()*maxStep;
                }

                if (y_add){
                    addY = R()*maxStep;
                } else {
                    addY = -R()*maxStep;
                }
            } else {
                addX = R() * 2 * maxStep - maxStep;
                addY = R() * 2 * maxStep - maxStep;
            }

            newPrevious.push([previous[0] + addX, previous[1] + addY]);
        }
        this.previous = newPrevious
    }

    fillFrame(){
        if (this.area<999){  //} && this.counter>60){
            return
        }  // don't fill small triangles for now
//        this.counter++;
//        console.log(this.counter);


        // start a random walk to fill the triangle

        X.globalAlpha=0.04;
        for (let i=0; i<999; i++){
//            this.determineNext(0.002, 6);  // sets this.previous
//            this.determineNext(0.008, 6);  // sets this.previous
            this.determineNext(0.07, 9);  // sets this.previous

            if (R()<.1){
                this.center = [this.a,this.b,this.c][R()*3|0];
            }

            for (let pIndex=0; pIndex<this.previous.length; pIndex++){


                if (this.pointInside(...this.previous[pIndex])){

                    X.fillStyle = this.palette[pIndex];  //PALETTE[j%PALETTE.length];
                    X.fillRect(...this.previous[pIndex],2,2);

                }


            }
        }
    }

    draw(){  // fill the triangle
        X.fillStyle = hslToStr(this.hue,this.s,this.l);
        X.beginPath();
        X.moveTo(...this.a);

        X.lineTo(...this.b);
        X.lineTo(...this.c);

        X.closePath();
        X.fill();
    }
}



START_TRIANGLES = getStartTriangles();

FLAKES = [];
subdivide=(a,b,c,depth=0)=>{
    let inside = random_in_triangle(a,b,c)

    if (depth>DEPTH || (depth>1&&R()<.2)){
        let trig = [a,b,c,inside];
        trig.color=PALETTE[R()*PALETTE.length|0];
        [[0,1,45],[2,1,60],[0,2,75]].map(v=>{FLAKES.push(new Flake(trig[v[0]],trig[v[1]],trig[3],trig.color[0],trig.color[1],v[2]))})
        return
    }
    subdivide(inside, a,b, depth+1)
    subdivide(inside, b,c, depth+1)
    subdivide(inside, c,a, depth+1)
}
START_TRIANGLES.forEach(t=>subdivide(t[0], t[1], t[2]))


FRAME_COUNTER = 0;
MAX_FRAMES = 340;


if (TEXTURE){
    X.globalAlpha=.02;
    X.globalCompositeOperation='multiply';

    T=_=>{
        FLAKES.forEach(walk=>walk.fillFrame())
        FRAME_COUNTER ++;
        document.title = `${PAUSED?'[Paused]':'Flakes'} ${(FRAME_COUNTER/MAX_FRAMES*100|0)}%`
        if (!PAUSED&&FRAME_COUNTER<MAX_FRAMES){A(T)}
    }
    A(T);
} else {
    X.globalAlpha=1;
    FLAKES.forEach(walk=>walk.draw())
}


document.addEventListener('keydown',function(e){if (e.code === 'Space'){e.preventDefault();PAUSED = !PAUSED;!PAUSED&&A(T)}});


//
// Save image functionality
//
function prefix_zeros(s, total_length){
    let prefix = '';
    for (let i=0; i<total_length - s.length; i++){
        prefix += '0';
    }
    return prefix + s;
}

function pad0(nr){
    str = nr.toString();
    if (str.length<2){
        return '0' + str;
    }
    return str;
}
function get_timestamp(){
    const date = new Date();
    year=date.getFullYear();
    month=pad0(date.getMonth()+1);
    day=pad0(date.getDate());
    hour=pad0(date.getHours());
    mins=pad0(date.getMinutes());
    sec=pad0(date.getSeconds());
    return `${year}${month}${day}_${hour}${mins}${sec}`
}
function save_image(prefix){
    let file_name = prefix + get_timestamp() + '_' + FILE_NAME;
    link.setAttribute('download', file_name);   // add fxhash and datetime stamp?
    link.setAttribute('href', C.toDataURL("image/jpeg"));
    link.click();
    console.log('Saved ' + file_name + '.jpeg');
}
window.addEventListener('DOMContentLoaded', (event) => {
  document.onkeydown = (e) => {
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      save_image('');
    }
  }
});