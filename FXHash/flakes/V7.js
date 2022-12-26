/*
CHANGELOG V7

Sierpinsky patterns as texture

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
    [
        'red', 'yellow', 'orange',
        'red', 'yellow', 'orange',
        '#def', '#eef',
        'black',
    ],
    [
      hsl_to_str(202,46,73),
      hsl_to_str(228,59,43),
      hsl_to_str(56,63,86),
      hsl_to_str(40,86,78),
      hsl_to_str(36,75,63),
    ],
]
function get_new_color(hue, s, l){return choice(PALETTE)}

function start_chaos_game(points, n=100){
//    points.push(points[0]);
//    points.push(points[1]);
//    points.push(points[1]);

    let mp = get_midpoint(points[2], points[1]);


    points = points.concat([
        points[0],
        points[0],points[0],points[0],points[0],points[0],
        mp, mp,mp,mp,mp,mp,mp,mp,mp,mp
    ])




    let current_point = [w,h]; //points[0];
    let original_color  = X.fillStyle;

    for (let i=0; i<n; i++){
        let next_point = choice(points);
        let midpoint = get_midpoint(current_point, next_point);
        X.fillRect(...midpoint, 2,2);
        current_point = midpoint;

        if (i%27===0){
            X.fillStyle = 'black'
        } else if (i%10===0){
            X.fillStyle = original_color;
        }
    }
}


class Triangle {
    constructor(p1,p2,p3, hue, s=50, l=50){
//        if (hue === undefined){hue=R()*300|0;}
        this.p1=p1;
        this.p2=p2;
        this.p3=p3;

        this.hue=hue;
        this.s=s;
        this.l=l;
    }

    bbox(){
        let x_values = [this.p1[0], this.p2[0], this.p3[0]];
        let y_values = [this.p1[1], this.p2[1], this.p3[1]];

        return [
            Math.min(...x_values),
            Math.min(...y_values),
            Math.max(...x_values),
            Math.max(...y_values),
        ]
    }

    area(){
        let length_p1p2 = (this.p1[0] - this.p2[0]) ** 2 + (this.p1[1] - this.p2[1]) ** 2;
        let midpoint_p1p2 = get_midpoint(this.p1, this.p2);

        let length_mid_p3 = (this.p3[0] - midpoint_p1p2[0]) ** 2 + (this.p3[1] - midpoint_p1p2[1]) ** 2

        return Math.sqrt(length_p1p2) * Math.sqrt(length_mid_p3) * .5;
    }



    is_large(){


//        let bbox = this.bbox();
//        let base = bbox[2] - bbox[0];
//        let height = bbox[3] - bbox[1];
//
//        let wrong_area = base * height * .5;

        return this.area() > (w/3 * h/3);
//        let bbox = this.bbox();
//        return (bbox[2] - bbox[0]) > w/1.5;
    }


    draw(){
        X.globalAlpha = .5;
        if (true){
            X.fillStyle = choice(PALETTE);

            start_chaos_game([this.p1, this.p2, this.p3], 15000);
            X.fill();

        } else {
//            X.fillStyle = choice(PALETTE)
//            X.beginPath();
//            X.moveTo(...this.p1);
//            X.lineTo(...this.p2);
//            X.lineTo(...this.p3);
//            X.closePath();
//            X.fill();
//
//            if (OUTLINE !== 'none'){
//        //if (R()<.1){
//                X.stroke();
//            }
        }
        //            X.fillStyle = choice(PALETTE)
//        X.beginPath();
////        X.fillStyle = 'undefined'
//        X.moveTo(...this.p1);
//        X.lineTo(...this.p2);
//        X.lineTo(...this.p3);
//        X.closePath();
//        X.stroke();


         X.globalAlpha = 1;
         X.lineWidth  =w/100;
         X.strokeStyle='black';
         X.beginPath();
         X.moveTo(...this.p1)
         X.lineTo(...this.p2)
         X.stroke()
//        draw




    }


    // one triangle A,B,C is converted into a list of one or more triangles
    subdivide(){
        SUBDIV_COUNTER += 1;
        let [a,b,c, hue, s, l] = [this.p1, this.p2, this.p3, this.hue, this.s, this.l];
        let random_value = R();

        let ab = get_midpoint(a,b);

        if (random_value < .4){
            let t1 = new Triangle(a, ab, c, ...get_new_color(hue, s, l));
            let t2 = new Triangle(b, ab, c, ...get_new_color(hue, s, l));
            return [t1,t2]
        }
        else if (random_value < .75){
            let cab = get_midpoint(ab,c);

            let tr1 = new Triangle(a, ab, cab, ...get_new_color(hue, s, l))
            let tr2 = new Triangle(b,  ab, cab, ...get_new_color(hue, s, l))
            let tr3 = new Triangle(a, c, cab, ...get_new_color(hue, s, l))
            let tr4 = new Triangle(b,  c, cab, ...get_new_color(hue, s, l))
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
    X.fillStyle = "black";
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


    let random_hue1 = R()*360|0
//    let random_hue2 = random_hue1 + (R()*100 - 50)|0
//    let random_hue3 = random_hue2 + (R()*100 - 50)|0
//    let random_hue4 = random_hue3 + (R()*100 - 50)|0

    let random_hue2= random_hue1; // + 180;
    let random_hue3= random_hue1;
    let random_hue4= random_hue1 + 180;



    if (random_value < .3){
        return [
            new Triangle(A, B, C, random_hue1),
            new Triangle(C, A, D, random_hue2),
        ]
    } else if (random_value < .66){
        let BC = get_midpoint(B,C);
        let DA = get_midpoint(D,A);

        return [
            new Triangle(A, B, BC, random_hue1),
            new Triangle(BC, A, DA, random_hue2),
            new Triangle(DA, BC, D, random_hue3),
            new Triangle(BC, D,C, random_hue4),
        ]
    }
    let DA = get_midpoint(D,A);
    let DAB = get_midpoint(DA, B);

    return [
        new Triangle(A, B, DA, random_hue1),
        new Triangle(B, DAB, C, random_hue2),
        new Triangle(DAB, C, DA, random_hue3),
        new Triangle(DA, C, D, random_hue4),
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
    X.globalAlpha = 1;
    X.fillStyle='black';
    X.fillRect(0,0,w,h);

    //
    // SET FEATURES
    //
    OUTLINE = choice(['black']);  //, 'white', 'none', 'none', 'none'])
    LINE_WIDTH = choice([1000, 2000, 3000, 4000, 6000, 8000]);
//    DEPTH = choice([5,8,10,12, 14,14, 16, 18]);

    DEPTH = 5;
    //LINE_WIDTH = 1000;


    PALETTE_INDEX = choice([0,1])  // 0 = soft, 1 = fire
    PALETTE = PALETTES[PALETTE_INDEX];

    X.lineWidth=h/LINE_WIDTH;
    FEATURES_DICT = {
        'Outline': OUTLINE,
        'Line Width': LINE_WIDTH,
        'Depth': DEPTH,
        'Palette': ['Fire', 'Soft'][PALETTE_INDEX],
    }
    file_name = '_depth' + DEPTH.toString();
    if (OUTLINE !== 'none'){file_name += '_' + OUTLINE + ' outline'}

    X.strokeStyle=OUTLINE;

    console.table(FEATURES_DICT)
//    Object.keys(FEATURES_DICT).map(k=>console.log(k, ' : ', FEATURES_DICT[k]))

    subdivide(get_start_triangles());
    //alert(TO_DRAW.length);
    TO_DRAW.forEach(t=>t.draw());

    do_blur();

    //alert(SUBDIV_COUNTER);
    console.log('DONE')
//
//    points = [
//        [0,0],
//        [w,0],
//        [w/2, h],
//
//    ]
//    X.fillStyle='white';
//    start_chaos_game(points, n=100);
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
