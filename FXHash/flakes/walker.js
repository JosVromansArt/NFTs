seed=Math.random()*99999999999|0;
console.log(seed, 'seed');
S=Uint32Array.of(9,7,5,3);
R=(a=1)=>a*(a=S[3],S[3]=S[2],S[2]=S[1],a^=a<<11,S[0]^=a^a>>>8^(S[1]=S[0])>>>19,S[0]/2**32);
[...seed+'ThxPiter'].map(c=>R(S[0]^=c.charCodeAt()*S[3]));


W=window;
//w=W.innerWidth;
//h=W.innerHeight;
w=1000;
h=1500;

W=1000;
H=1500;
RATIO = W/H;
WW=window.innerWidth;
WH=window.innerHeight;
WINDOW_RATIO = WW/WH;
// the scale will depend on the longest or shortest side, depending how it fits the current window
if (WINDOW_RATIO>RATIO){
    SCALE = WH/H
} else {
    SCALE = WW/W
}

C.width  = W;
C.height = H;
C.style.width=`${W*SCALE}px`;
C.style.height=`${H*SCALE}px`;

//C.style.width=`${w}px`;
//C.style.height=`${h}px`;
X=C.getContext('2d');
//X.scale(pR,pR);

X.fillStyle='#fff';
X.fillRect(0,0,w,h);
X.globalAlpha=.02;
X.globalCompositeOperation='multiply';

A=window.requestAnimationFrame;

PAUSED=false;
M=w*.9;
DEPTH=1;


PALETTE = [[200, 99, 39],[43, 81, 48],[155, 96, 11],[148, 100, 23],[32, 15, 80],[357, 94, 30],[183, 100, 26],[183, 100, 16],[192, 64, 47],[243, 78, 17],[217, 92, 44],[225, 89, 35],[173, 16, 70]]
function hsl_to_str(h,s,l,a=1){return 'hsl(' + h + ',' + s + '%,' + l + '%,' + a + ')';}
//PALETTE = PALETTE.map(c=>hsl_to_str(...c))


VERTEX_COUNT = 4+ R()*20|0;
get_midpoint=(a,b)=>[(a[0] + b[0])/2,(a[1] + b[1])/2];
COMPOSITION_TYPE = 'unknown'

randomInt=(a, b)=>Math.floor(a + (b - a) * R());
FILE_NAME = `SUBDIVIDED_FLAKES_`;

function draw_line(a, b, color, width){
    X.lineWidth = width;
    X.strokeStyle = color;
    X.beginPath();
    X.moveTo(...a);
    X.lineTo(...b);
    X.stroke();
}

function get_distance(pointA, pointB){
    diffX = pointA[0] - pointB[0];
    diffY = pointA[1] - pointB[1];

    // dont take the square root, because we only compare distance, so rooting is not necessary, the order stays the same
    return diffX ** 2 + diffY ** 2
}



//
//
function get_point_on_line(a,b,perc){  // relative to a !!
    let diffX = perc * (b[0] - a[0]);
    let diffY = perc * (b[1] - a[1]);
    return [diffX,diffY]
}
function draw_triangle(a,b,c,color='black'){
    draw_line(a,b,color,.2)
    draw_line(b,c,color,.2)
    draw_line(c,a,color,.2)
}

function random_in_triangle(a,b,c){
    let perc1 = 0.2+R()*.6;

    let maxrange = 1-perc1;
    let perc2 = R() * maxrange * .8 + maxrange*.1;

//    console.log('total less than 1 :')
//    console.log(perc1, perc2, perc1+perc2)

    let P1 = get_point_on_line(a,b,perc1)
    let P2 = get_point_on_line(a,c,perc2)

    return [
        a[0]+P1[0]+P2[0],
        a[1]+P1[1]+P2[1]
    ]
}


//draw_triangle(pA,pB,pC)
//inside = random_in_triangle(pA,pB,pC)


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

START_HUE = R()*360|0;
FINAL_TRIGS = [];


function subdivide(a,b,c,depth=0, previous_hue=180){
    let inside = random_in_triangle(a,b,c)

    if (depth>DEPTH || (depth>1&&R()<.2)){
        FINAL_TRIGS.push([...a,...b,...c,inside,previous_hue])
        return
    }

    subdivide(inside, a,b, depth+1, PALETTE[R()*PALETTE.length|0][0] )
    subdivide(inside, b,c, depth+1, PALETTE[R()*PALETTE.length|0][0] )
    subdivide(inside, c,a, depth+1, PALETTE[R()*PALETTE.length|0][0] )
}


subdivide(
    [w*.8, h*.1],
    [w*.1, h*.3],
    [w*.9, h*.8],
    0, START_HUE+=64)


WALK_COUNT = 20;

fill_polygon=(vertices, fill_color)=>{
    // Use the vertex indices, and get the according vertices from SCALED_VERTICES
    X.fillStyle = fill_color;
    X.beginPath();
    X.moveTo(...vertices[0]);

    for (let k=1;k<vertices.length;k++){
        X.lineTo(...vertices[k]);
    }
    X.closePath();
    X.fill();
}
triangleArea=(x1,y1,x2,y2,x3,y3)=>Math.abs((x1*(y2-y3)+x2*(y3-y1)+x3*(y1-y2))/2);

class Walk {
    constructor(triBound, hue,s,l){
        this.triBound = triBound;  // coordinates that define the triangle ax, ay, bx, by, cx, cy
//        this.hue=hue;
//        this.palette=palette;


        this.palette = [
            hsl_to_str(hue, 60, l),
            hsl_to_str(hue, 90, l),
            hsl_to_str(hue, 10, l),
        ]

        this.area = triangleArea(...triBound);

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
//            X.globalAlpha=1;
//            X.fillStyle='red';
//            X.fillRect(sp[0]-10, sp[1]-10, 25,25)

            this.previous.push(sp)
        }
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
        let [ax, ay, bx, by, cx, cy] = this.triBound;

        let A1 = triangleArea(px,py,ax,ay,bx,by);
        let A2 = triangleArea(px,py,ax,ay,cx,cy);
        let A3 = triangleArea(px,py,bx,by,cx,cy);

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
        // start a random walk to fill the triangle
        X.globalAlpha=0.04;
        for (let i=0; i<999; i++){
            this.determineNext(0.07, 9);  // sets this.previous

            if (R()<.1){
                this.center = [
                    [this.triBound[0],this.triBound[1]],
                    [this.triBound[2],this.triBound[3]],
                    [this.triBound[4],this.triBound[5]],
                ][R()*3|0]
            }

            for (let pIndex=0; pIndex<this.previous.length; pIndex++){
                if (this.pointInside(...this.previous[pIndex])){
                    X.fillStyle = this.palette[pIndex];  //PALETTE[j%PALETTE.length];
                    X.fillRect(...this.previous[pIndex],2,2);
                }
            }
        }
    }

    draw(fill_color){
        // Use the vertex indices, and get the according vertices from SCALED_VERTICES
        X.fillStyle = fill_color;
        X.beginPath();
        X.moveTo(this.triBound[0], this.triBound[1]);
        X.lineTo(this.triBound[2], this.triBound[3]);
        X.lineTo(this.triBound[4], this.triBound[5]);
        X.closePath();
        X.fill();
    }
}

FRAME_COUNTER = 0;
MAX_FRAMES = 340;

// Original 1 walk per triangle
WALKS = FINAL_TRIGS.map(trig=>new Walk([trig[0], trig[1], trig[2], trig[3], trig[4], trig[5]], PALETTE));

// 3 walks per triangle, and later give them seperate colors
WALKS = [];
FINAL_TRIGS.forEach(trig=>{

//    fill_polygon([a,inside, b], hsl_to_str(hue,60,40), hue)
    //    fill_polygon([a,inside,c], hsl_to_str(hue,60,60), hue)
    //    fill_polygon([inside,b,c], hsl_to_str(hue,60,80), hue)

    let randomColor = PALETTE[R()*PALETTE.length|0];
    let hue = randomColor[0];
    let s = randomColor[1];

    WALKS.push(new Walk([trig[0], trig[1], trig[2], trig[3], ...trig[6]], hue,s,40));
    WALKS.push(new Walk([trig[4], trig[5], trig[2], trig[3], ...trig[6]], hue,s,60));
    WALKS.push(new Walk([trig[0], trig[1], trig[4], trig[5], ...trig[6]], hue,s,80));
})


T=_=>{
    WALKS.forEach(walk=>walk.fillFrame())
    FRAME_COUNTER ++;
    document.title = `Flakes ${(FRAME_COUNTER/MAX_FRAMES*100|0)}%`
    if (!PAUSED&&FRAME_COUNTER<MAX_FRAMES){A(T)}
}


A(T);


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