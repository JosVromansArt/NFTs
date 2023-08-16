const urlParams = new URLSearchParams(window.location.search);
DEPTH = urlParams.get('depth')||3;
TEXTURE = urlParams.get('texture')==='off'?false:true;
SEED = urlParams.get('seed')||Math.random()*99999999999|0;
COMPOSITION_TYPE = urlParams.get('composition');
DIVLINES = urlParams.get('divlines');
if (!(DIVLINES==='black' || DIVLINES==='white')){
    DIVLINES='none'
}

S=Uint32Array.of(9,7,5,3);
R=(a=1)=>a*(a=S[3],S[3]=S[2],S[2]=S[1],a^=a<<11,S[0]^=a^a>>>8^(S[1]=S[0])>>>19,S[0]/2**32);
[...SEED+'ThxPiter'].map(c=>R(S[0]^=c.charCodeAt()*S[3]));
A=window.requestAnimationFrame;
FILE_NAME = `FLAKES_V19_${SEED}_D${DEPTH}_`;

C.width=W=1200;
C.height=H=1800;
WW=window.innerWidth;
WH=window.innerHeight;
SCALE = (WW/WH>2/3)?WH/H:WW/W;  // the scale will depend on the longest or shortest side, depending how it fits the current window
C.style.width=`${W*SCALE}px`;
C.style.height=`${H*SCALE}px`;


PALETTES = [
	[[228, 13, 8],[160, 6, 81],[228, 4, 24],[208, 8, 52],[217, 15, 37],[58, 81, 88],[217, 23, 65],[40, 51, 16],[62, 16, 63],[51, 23, 45],[50, 57, 73],[48, 82, 36],[213, 82, 64],[240, 74, 73]],
	[[0, 0, 9],[150, 1, 38],[185, 96, 71],[255, 2, 64],[6, 12, 84],[164, 38, 45],[137, 11, 24],[184, 42, 50],[197, 86, 66],[122, 73, 80],[47, 90, 68],[167, 37, 34],[332, 42, 45],[75, 33, 98]],
	[[0, 100, 7],[44, 100, 87],[40, 68, 74],[256, 57, 18],[26, 45, 64],[270, 60, 28],[340, 23, 77],[15, 35, 54],[210, 66, 45],[326, 30, 36],[359, 39, 22],[310, 18, 55],[25, 42, 34],[29, 70, 60]],
	[[0, 0, 0],[218, 26, 18],[27, 28, 56],[36, 100, 47],[35, 33, 90],[210, 26, 31],[340, 44, 47],[100, 23, 70],[206, 100, 41],[211, 34, 51],[191, 100, 41],[278, 43, 44],[27, 45, 13],[216, 33, 81]],
	[[33, 14, 84],[7, 100, 2],[3, 70, 48],[289, 20, 22],[42, 61, 34],[41, 78, 14],[3, 55, 39],[30, 40, 58],[19, 72, 46],[261, 42, 30],[261, 64, 10],[165, 2, 34],[41, 48, 70],[9, 63, 60]],
	[[0, 0, 0],[215, 53, 46],[61, 100, 86],[2, 85, 13],[61, 100, 78],[38, 87, 60],[32, 57, 25],[55, 95, 66],[27, 84, 57],[24, 67, 45],[37, 85, 69],[16, 71, 34],[212, 38, 64],[338, 78, 64]],
	[[293, 82, 98],[255, 5, 17],[173, 12, 29],[177, 16, 45],[180, 93, 89],[162, 23, 59],[27, 21, 37],[225, 29, 39],[164, 50, 74],[34, 45, 24],[68, 31, 41],[64, 51, 62],[83, 20, 67],[54, 34, 51]],
	[[0, 0, 2],[200, 99, 39],[43, 81, 48],[155, 96, 11],[148, 100, 23],[32, 15, 80],[357, 94, 30],[183, 100, 26],[183, 100, 16],[192, 64, 47],[243, 78, 17],[217, 92, 44],[225, 89, 35],[173, 16, 70]],
    [[312, 3, 78],[228, 9, 23],[33, 56, 77],[4, 55, 68],[181, 46, 60],[1, 48, 49],[355, 18, 73],[183, 38, 39],[0, 0, 0],[0, 0, 100],[0, 100, 100]],
]
PALETTE = PALETTES[R()*PALETTES.length|0];
//PALETTE = [[200, 99, 39],[43, 81, 48],[155, 96, 11],[148, 100, 23],[32, 15, 80],[357, 94, 30],[183, 100, 26],[183, 100, 16],[192, 64, 47],[243, 78, 17],[217, 92, 44],[225, 89, 35],[173, 16, 70]]

X=C.getContext('2d');
X.fillStyle='#000';
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

determineCompositionType=(rv=R())=>rv<.2?'Z':(rv<.4?'A':(rv<.6?'B':(rv<.8?'C':'G')));
if (COMPOSITION_TYPE===null){COMPOSITION_TYPE = determineCompositionType()}


getDistortedGrid=()=>{
    let rows = 2+R()*4|0;
    let cols = 2+R()*4|0;

    let stepx = W/cols;
    let stepy = H/rows;

    let xoff=0
    let yoff=0;
    if (R()<.5){xoff = stepx/3}
    if (R()<.5){yoff = stepx/3}

    let coords=[]
    for (let i=0;i<=cols;i++){
        let coords_row = []
        for (let j=0;j<=rows;j++){
            coords_row.push([
                (i===0||i===cols)?i*stepx:i*stepx+R()*xoff*2-xoff,
                (j===0||j===rows)?j*stepy:j*stepy+R()*yoff*2-yoff,
            ])
        }
        coords.push(coords_row);
    }

    let trigs = []
    for (let i=0;i<cols;i++){
        for (let j=0;j<rows;j++){
            let aa = coords[i][j];
            let bb = coords[i+1][j];
            let cc = coords[i+1][j+1];
            let dd = coords[i][j+1];

            if (R()<.5){
                trigs.push([aa,bb,dd])
                trigs.push([bb,dd,cc])
            } else {
                trigs.push([aa,cc,bb])
                trigs.push([aa,cc,dd])
            }
        }
    }
    return trigs
}


getStartTriangles=_=>{
    if (COMPOSITION_TYPE==='G'){return getDistortedGrid()}
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
draw_y=(a,b,c, iter=0,color='#000', max_iter=2)=>{
    let inside = random_in_triangle(a,b,c);

    draw_line(a, inside, color, 1)
    draw_line(b, inside, color, 1)
    draw_line(c, inside, color, 1)

    if (iter<max_iter){
        draw_y(a,b,inside,iter+1, color, max_iter);
        draw_y(b,c,inside,iter+1, color, max_iter);
        draw_y(c,a,inside,iter+1, color, max_iter);
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

    pointInside(px, py) {  // TODO: make second point inside, with percentage on 2 edges being between 0 and 1 (sum)
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


    fillTriangle(){  // always call this one. And decide with a setting which way of filling the triangle
        X.globalAlpha=1;
        X.globalCompositeOperation='source-over';
        this.draw();
//        X.globalCompositeOperation='lighter';
        X.globalCompositeOperation='multiply';
//        X.globalCompositeOperation='source-over';
//        this.draw();
        X.globalAlpha=1;
        this.fillFrameSLOW();

        // add subdivision lines on individual flakes, only when black or white has been specified
        if (DIVLINES==='black'){
            X.globalAlpha=.5;
            X.globalCompositeOperation='multiply';
            X.lineWidth=1;
            draw_y(this.a,this.b,this.c, 0,'#222', 3)
        } else if (DIVLINES==='white'){
            X.globalAlpha=.2;
            X.globalCompositeOperation='source-over';
            X.lineWidth=3;
            draw_y(this.a,this.b,this.c, 0,'#fff', 3)
        }
    }

    fillFrameSLOW(){  // original texture, really slow rendering
//        if (this.area<79999){  //} && this.counter>60){
//            return
//        }  // don't fill small triangles for now
//        this.counter++;
//        console.log(this.counter);


        // start a random walk to fill the triangle

//        X.globalAlpha=0.04;
        for (let i=0; i<9999; i++){
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
TINY_FLAKES = [];
subdivide=(a,b,c,depth=0)=>{
    let inside = random_in_triangle(a,b,c)

    if (depth>DEPTH || (depth>1&&R()<.2)){
        let trig = [a,b,c,inside];
        trig.color=PALETTE[R()*PALETTE.length|0];
        [[0,1,42],[2,1,60],[0,2,85]].map(v=>{
            let flake = new Flake(trig[v[0]],trig[v[1]],trig[3],trig.color[0],trig.color[1],v[2]);
            if (flake.area<300){
                TINY_FLAKES.push(flake);
            } else {
                FLAKES.push(flake);
            }
        })
        return
    }
    subdivide(inside, a,b, depth+1)
    subdivide(inside, b,c, depth+1)
    subdivide(inside, c,a, depth+1)
}
START_TRIANGLES.forEach(t=>subdivide(t[0], t[1], t[2]))
FLAKE_COUNT = FLAKES.length;
TINY_FLAKE_COUNT = TINY_FLAKES.length;

FRAME_COUNTER = 0;
MAX_FRAMES = 340;

console.table({
    'Seed': SEED,
    'Composition': COMPOSITION_TYPE,
    'Depth': DEPTH,
    'Detail Division Lines': DIVLINES,
    'Flake Count': FLAKE_COUNT,
    'Tiny Flake Count': TINY_FLAKE_COUNT,
})

if (TEXTURE){
    let triangleIndex = 0;
    let totalTriangles = FLAKE_COUNT + TINY_FLAKE_COUNT;
    let batchSize = 50;

    T=_=>{

        if (triangleIndex<TINY_FLAKE_COUNT){
            // handle a batch of tiny flakes
            for (let ii=0;ii<batchSize;ii++){
                if (ii+triangleIndex>TINY_FLAKE_COUNT-1){break}

                let f = TINY_FLAKES[triangleIndex+ii];

                X.globalCompositeOperation='source-over';
//                X.globalAlpha=.9;
//                f.l=50;
//                f.s=99;
//
//
//                let index = ((f.a[1]/H)*PALETTE.length)|0
//
//                if (index>=PALETTE.length){
//                    index = PALETTE.length*R()|0
//                }
//
//                f.hue = PALETTE[index][0];
////                f.h=90;
//                f.draw();

                X.globalAlpha=.01;
                X.globalCompositeOperation='lighter';
                X.lineWidth=1;

                draw_y(f.a,f.b,f.c, 0,'#fff', 2)

            }

            triangleIndex += batchSize;
            triangleIndex = Math.min(TINY_FLAKE_COUNT,triangleIndex);

        } else {
            X.globalAlpha=.02;
            X.globalCompositeOperation='multiply';
            // handle a normal flake
        //        FLAKES.forEach(walk=>walk.fillFrame())
            FLAKES[triangleIndex-TINY_FLAKE_COUNT].fillTriangle();
            triangleIndex ++;
        }

        document.title = `${PAUSED?'[Paused]':'Flakes'} ${(triangleIndex/totalTriangles*100|0)}%`
        if (!PAUSED&&triangleIndex<totalTriangles){A(T)}
    }
    A(T);
} else {
    X.globalAlpha=1;
    FLAKES.forEach(walk=>walk.draw())
}


testRandomWalkInRandomTriangle=()=>{
    addOrSubtract=(v,d)=>{
        let add = v+d;

        if (add>1){
            return v-d;
        } else if (add<0){
            return v-d;
        } else {
            return add;
        }
    }

    let pA = [R()*W,R()*H];
    let pB = [R()*W,R()*H];
    let pC = [R()*W,R()*H];

    X.globalAlpha=.06;
    walkInsideTriangle=(a,b,c,w1,w2, hue)=>{
        // Start a random walk within a triangle with vertices a,b,c
        // This walk will work with percentages on edge ab and ac. The percentages are w1 and w2
        // The walk will never go outside the triangle
        // a hue value can be used to change the color gradually

        for (let i=0; i<9999; i++){

            w1 = addOrSubtract(w1,(R()-0.5)/99)
            w2 = addOrSubtract(w2,(R()-0.5)/99)

            if (w1 + w2 > 1){
                w1 = 1 - w2
    //            w2 = 1 - w1
            }

            if (i%100<1){
                hue += 1;
            }

            X.fillStyle = hslToStr(hue,50,50)
            X.fillRect(
                a[0] + w1 * (b[0]-a[0]) + w2 * (c[0]-a[0]),
                a[1] + w1 * (b[1]-a[1]) + w2 * (c[1]-a[1]),
                4,4);
        }
    }

    walkInsideTriangle(pA,pB,pC, 0,0, 120);
    walkInsideTriangle(pB, pA, pC, 1,0, 0);
    walkInsideTriangle(pB, pA, pC, 0.5,0.5, 240);
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
var link = document.createElement('a');
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