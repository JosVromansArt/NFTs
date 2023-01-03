/*
CHANGELOG V11

- Use hsl colors now

*/

//C=document.getElementById('C');
W=window;
w=W.innerWidth;
h=W.innerHeight;
ratio = [2,3];
if (w >= h*ratio[0]/ratio[1]){w = h*ratio[0]/ratio[1];} else {h = w/ratio[0]*ratio[1];}
pR=W.devicePixelRatio;
C.width=~~(w*pR);
C.height=~~(h*pR);
C.style.width=`${w}px`;
C.style.height=`${h}px`;
X=C.getContext('2d');
X.scale(pR,pR);

R=fxrand;
randomInt=(a, b)=>Math.floor(a + (b - a) * R());
choice=(x)=>x[randomInt(0, x.length * 0.99)];
var file_name;  //  = fxhash;

function hsl_to_str(h,s,l,a=1){return 'hsl(' + h + ',' + s + '%,' + l + '%,' + a + ')';}
get_midpoint=(a,b)=>[(a[0] + b[0])/2,(a[1] + b[1])/2];

PALETTES = [
    [[228, 13, 8],[160, 6, 81],[228, 4, 24],[208, 8, 52],[217, 15, 37],[58, 81, 88],[217, 23, 65],[40, 51, 16],[54, 20, 69],[51, 23, 45],[41, 64, 47],[216, 76, 66],[52, 77, 78],[47, 71, 61]],
	[[0, 0, 9],[150, 1, 38],[185, 96, 71],[15, 3, 74],[164, 38, 45],[31, 51, 90],[240, 1, 53],[137, 11, 24],[198, 88, 66],[182, 42, 51],[122, 73, 80],[47, 90, 68],[81, 19, 64],[332, 42, 45]],
	[[0, 100, 7],[44, 100, 87],[40, 68, 74],[256, 57, 18],[340, 23, 77],[26, 45, 64],[270, 60, 28],[29, 70, 60],[4, 49, 60],[23, 53, 49],[325, 31, 55],[354, 30, 44],[18, 53, 36],[17, 36, 29]],
	[[0, 0, 0],[218, 26, 18],[27, 28, 56],[36, 100, 47],[35, 35, 90],[210, 26, 31],[340, 44, 47],[100, 23, 70],[211, 34, 51],[206, 100, 41],[278, 43, 44],[27, 45, 13],[191, 100, 41],[216, 33, 81]],
	[[33, 14, 84],[7, 100, 2],[3, 70, 48],[289, 20, 22],[42, 61, 34],[41, 78, 14],[30, 40, 58],[3, 55, 39],[19, 72, 46],[165, 2, 34],[261, 42, 30],[261, 64, 10],[41, 49, 71],[9, 63, 60]],
	[[0, 0, 0],[215, 53, 46],[61, 100, 86],[2, 85, 13],[61, 100, 78],[41, 88, 61],[32, 57, 25],[55, 95, 66],[27, 84, 57],[24, 67, 45],[37, 85, 69],[16, 71, 34],[212, 38, 64],[339, 78, 64]],
	[[293, 82, 98],[255, 5, 17],[173, 12, 29],[177, 16, 45],[180, 93, 89],[162, 23, 59],[27, 21, 37],[161, 59, 77],[225, 29, 39],[54, 27, 45],[34, 45, 24],[85, 70, 79],[64, 51, 62],[83, 20, 67]],
	[[0, 0, 2],[200, 99, 39],[43, 81, 48],[155, 96, 11],[148, 100, 23],[32, 15, 80],[357, 94, 30],[183, 100, 26],[183, 100, 16],[192, 64, 47],[243, 78, 17],[217, 92, 44],[225, 89, 35],[173, 16, 70]],
    [[312, 3, 78],[228, 9, 23],[33, 56, 77],[4, 55, 68],[181, 46, 60],[1, 48, 49],[355, 18, 73],[183, 38, 39],[0, 0, 0],[0, 0, 100],[0, 100, 100]],
]


randomize=(xy, factor=10)=>{
    if (!xy[1]){return xy}
    if (factor===0){return xy}

    factor = factor * h/xy[1];
    return [xy[0] + R()*2*factor-factor, xy[1] + R()*2*factor-factor]
}

class Triangle {
    constructor(p1,p2,p3){
        this.p1=p1;
        this.p2=p2;
        this.p3=p3;
    }
    draw(){
        X.fillStyle = hsl_to_str(...choice(PALETTE));
        X.beginPath();
        X.moveTo(...this.p1);
        X.lineTo(...this.p2);
        X.lineTo(...this.p3);
        X.closePath();
        X.fill();
	    if (OUTLINE !== 'none'){
            X.stroke();
        }
    }

    // one triangle A,B,C is converted into a list of one or more triangles
    subdivide(){
        SUBDIV_COUNTER += 1;
        let [a,b,c] = [this.p1, this.p2, this.p3];
        let random_value = R();

        a = randomize(a, RANDOM_OFFSET);
        b = randomize(b, RANDOM_OFFSET);
        c = randomize(c, RANDOM_OFFSET);

        let ab = get_midpoint(a,b);

        if (random_value < .4){
            let t1 = new Triangle(a, ab, c);
            let t2 = new Triangle(b, ab, c);
            return [t1,t2]
        }
        else if (random_value < .75){
            let cab = get_midpoint(ab,c);

            let tr1 = new Triangle(a, ab, cab)
            let tr2 = new Triangle(b,  ab, cab)
            let tr3 = new Triangle(a, c, cab)
            let tr4 = new Triangle(b,  c, cab)
            return [tr1, tr2, tr3, tr4];
        }

        return [this]; // return the original triangle
    }
}


function transform_color(triangle, d1=0, d2=0, d3=0){
    if (triangle.color === undefined){
        return [0,80,40];
    }

    return [triangle.color[0] + d1, triangle.color[1] + d2,  triangle.color[2] + d3]
}

SUBDIV_COUNTER = 0;


function subdivide(triangle_list, depth=0){
    let next_tri_list = []
    for (let i=0;i<triangle_list.length;i++){
        next_tri_list = next_tri_list.concat(triangle_list[i].subdivide());
    }
    if (depth < DEPTH){
        subdivide(next_tri_list, depth+choice([1,2,3,5,5,5,5,6,8,8]));
        subdivide(next_tri_list, depth+choice([1,2,3,5,5,5,5,6,8,8]));
//        subdivide(next_tri_list, depth+1);
//        subdivide(next_tri_list, depth+2);
    } else {
        TO_DRAW = TO_DRAW.concat(next_tri_list);
    }
}

TO_DRAW = [];

function draw_frame_rounded_corners(r, margin){
    X.fillStyle = "#000";
    X.beginPath();

    x=margin;
    y=margin;
    ww=w-2*margin;
    hh=h-2*margin;

    X.beginPath();
    X.moveTo(x+r, y);
    X.arcTo(x+ww, y,   x+ww, y+hh, r);
    X.arcTo(x+ww, y+hh, x,   y+hh, r);
    X.arcTo(x,   y+hh, x,   y,   r);
    X.arcTo(x,   y,   x+ww, y,   r);
    X.closePath();

    X.rect(w, 0, -w, h);
    X.fill();
}


function get_start_triangles(){
    let random_value = R();

    let A = [0,0];
    let B = [w,0];
    let C = [w,h];
    let D = [0,h];

    if (random_value < .3){
        return [
            new Triangle(A, B, C),
            new Triangle(C, A, D),
        ]
    } else if (random_value < .66){
        let BC = get_midpoint(B,C);
        let DA = get_midpoint(D,A);

        return [
            new Triangle(A, B, BC),
            new Triangle(BC, A, DA),
            new Triangle(DA, BC, D),
            new Triangle(BC, D,C),
        ]
    }
    let DA = get_midpoint(D,A);
    let DAB = get_midpoint(DA, B);

    return [
        new Triangle(A, B, DA),
        new Triangle(B, DAB, C),
        new Triangle(DAB, C, DA),
        new Triangle(DA, C, D),
    ];
}

function do_blur(){
    // original blur was /18 instead of 28
    r = w/28;  // corner radius
//    X.filter='blur('+parseInt(w/150)+'px)'
    draw_frame_rounded_corners(r, margin=r/1.1);

    X.filter='none'
    draw_frame_rounded_corners(r, margin=r/3.9);
}

function make_artwork(){
    X.fillStyle='#000';
    X.fillRect(0,0,w,h);

    //
    // SET FEATURES
    //
    OUTLINE = choice(['black', 'white', 'none', 'none', 'none'])
    LINE_WIDTH = choice([1000, 2000, 3000, 4000, 6000, 8000]);
    DEPTH = choice([5,8,10,12, 14,14, 16, 18]);


    PALETTE_INDEX = choice([0,1,2,3,4,5,6,7,8])
    PALETTE = PALETTES[PALETTE_INDEX];
    RANDOM_OFFSET = choice([0,0,0,0,1,2,2,3,4,5,10,30])

    X.lineWidth=h/LINE_WIDTH;
    FEATURES_DICT = {
        'Outline': OUTLINE,
        'Line Width': LINE_WIDTH,
        'Depth': DEPTH,
        'Palette': [0,1,2,3,4,5,6,7,8][PALETTE_INDEX],
        'Random Offset': RANDOM_OFFSET,
    }
    file_name = '_depth' + DEPTH.toString();
    if (OUTLINE !== 'none'){
        file_name += '_' + OUTLINE + ' outline';
        X.strokeStyle=OUTLINE;
    }

    console.table(FEATURES_DICT)
//    Object.keys(FEATURES_DICT).map(k=>console.log(k, ' : ', FEATURES_DICT[k]))

    subdivide(get_start_triangles());
    //alert(TO_DRAW.length);
    TO_DRAW.forEach(t=>t.draw());

    do_blur();

    //alert(SUBDIV_COUNTER);
    console.log('DONE')
}




// image save stuff
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
function save_image(){
    file_name = get_timestamp() + '_' + file_name;
    link.setAttribute('download', file_name);   // add fxhash and datetime stamp?
    link.setAttribute('href', C.toDataURL("image/jpeg"));
    link.click();
    console.log('Saved ' + file_name + '.jpeg');
}

window.addEventListener('DOMContentLoaded', (event) => {
  make_artwork();
//  window.addEventListener('resize', E);  dont implement resize
  C.addEventListener('click',e=>{
    console.clear();
    make_artwork();
  });

  document.onkeydown = (e) => {
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      save_image();
    }
  }
});
