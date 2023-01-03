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
	[[228, 23, 9],[160, 3, 82],[228, 8, 25],[208, 13, 55],[217, 26, 43],[58, 20, 98],[217, 22, 73],[40, 67, 24],[54, 17, 75],[51, 38, 56],[41, 78, 78],[216, 56, 92],[52, 36, 95],[47, 63, 89]],
	[[0, 0, 9],[150, 2, 38],[185, 56, 99],[15, 2, 75],[164, 55, 62],[31, 11, 95],[240, 1, 54],[137, 21, 27],[198, 62, 96],[182, 58, 71],[122, 31, 95],[47, 59, 97],[81, 19, 71],[332, 59, 64]],
	[[0, 100, 14],[44, 27, 100],[40, 38, 92],[256, 73, 29],[340, 13, 82],[26, 40, 80],[270, 75, 45],[29, 63, 88],[4, 50, 79],[23, 70, 75],[325, 40, 69],[354, 46, 57],[18, 69, 56],[17, 53, 40]],
	[[0, 0, 0],[218, 41, 23],[27, 36, 68],[36, 100, 95],[35, 7, 94],[210, 42, 40],[340, 61, 68],[100, 18, 77],[211, 49, 68],[206, 100, 82],[278, 60, 62],[27, 62, 18],[191, 100, 81],[216, 14, 87]],
	[[33, 5, 86],[7, 100, 4],[3, 82, 82],[289, 33, 26],[42, 76, 55],[41, 88, 25],[30, 44, 75],[3, 71, 60],[19, 84, 80],[165, 5, 35],[261, 59, 42],[261, 78, 16],[41, 34, 85],[9, 60, 85]],
	[[0, 0, 0],[215, 69, 71],[61, 27, 100],[2, 92, 24],[61, 43, 100],[41, 73, 95],[32, 72, 38],[55, 66, 98],[27, 78, 93],[24, 80, 76],[37, 55, 95],[16, 83, 58],[212, 36, 78],[339, 61, 92]],
	[[293, 4, 100],[255, 9, 18],[173, 21, 32],[177, 27, 52],[180, 20, 99],[162, 28, 69],[27, 35, 45],[161, 30, 91],[225, 45, 50],[54, 43, 58],[34, 62, 35],[85, 31, 94],[64, 47, 81],[83, 18, 74]],
	[[0, 0, 2],[200, 99, 77],[43, 89, 87],[155, 98, 22],[148, 100, 47],[32, 7, 83],[357, 97, 59],[183, 100, 53],[183, 100, 32],[192, 78, 76],[243, 87, 31],[217, 96, 84],[225, 94, 67],[173, 13, 75]],
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
