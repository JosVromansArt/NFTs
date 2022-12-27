/*
CHANGELOG V9

- Black and white lines

*/

// override hashes from the fxhash snippet with a fixed value
hashes = [ -346091956, -236598525, 429364864, 839853118 ];
fxrand = sfc32(...hashes)

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


randomize=(xy, factor=10)=>{
    if (!xy[1]){return xy}

    factor = 10 * h/xy[1];
    return [xy[0] + R()*2*factor-factor, xy[1] + R()*2*factor-factor]
}

function get_intersection(line1, line2) {
  // Extract the coordinates of the start and end points of each line
  let x1 = line1[0][0];
  let y1 = line1[0][1];
  let x2 = line1[1][0];
  let y2 = line1[1][1];

  let x3 = line2[0][0];
  let y3 = line2[0][1];
  let x4 = line2[1][0];
  let y4 = line2[1][1];

  // Calculate the slope and y-intercept of each line
  let m1 = (y2 - y1) / (x2 - x1);
  let b1 = y1 - m1 * x1;
  let m2 = (y4 - y3) / (x4 - x3);
  let b2 = y3 - m2 * x3;

  // Calculate the x-coordinate of the intersection point
  let x = (b2 - b1) / (m1 - m2);

  // Calculate the y-coordinate of the intersection point
  let y = m1 * x + b1;

  // Return the intersection point as an object with x and y properties
  return [x,y];
}
function  get_length(line){
    xdiff = line[1][0] - line[0][0];
    ydiff = line[1][1] - line[0][1];

    return Math.sqrt(xdiff ** 2 + ydiff ** 2);
}


class Line {
    constructor(p1, p2){
        this.p1 = p1;
        this.p2 = p2;
    }

    draw(color='#fff'){
        X.strokeStyle=color;
        X.beginPath();
        X.moveTo(...this.p1);
        X.lineTo(...this.p2);
        X.stroke();
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

    draw_circle(){
        let midAB = get_midpoint(this.p1, this.p2);
        let midBC = get_midpoint(this.p2, this.p3);
        let midCA = get_midpoint(this.p3, this.p1);

        let line1 = [midAB, this.p3];
        let line2 = [midCA, this.p2];
        let line3 = [midBC, this.p1];


        let l1 = new Line(midAB, this.p3);
        let l2 = new Line(midCA, this.p2);
        let l3 = new Line(midBC, this.p1);

        X.globalAlpha=.1;
        l1.draw();
        l2.draw();
        l3.draw();
        X.globalAlpha=1;


        let length1 = get_length(line1);
        let length2 = get_length(line2);

        let radius = Math.min(length1, length2) / 4;

        // get intersection
        let intersection = get_intersection(line1, line2);

        // draw arc with radius of half the length of the smalles line
//        X.fillStyle='#000'
//        X.lineWidth=3;
//        X.beginPath();
//        X.arc(...intersection, radius, 0,6.3);
////        X.strokeStyle='#fff';
//        X.stroke();


//        let x1 = this.p1[0];
//        let x2 = this.p2[0];
//        let x3 = this.p3[0];
//        let y1 = this.p1[1];
//        let y2 = this.p2[1];
//        let y3 = this.p3[1];
//
//        let sideA = Math.sqrt((x1-x2)^2 + (y1-y2)^2)
//        let sideB = Math.sqrt((x2-x3)^2 + (y2-y3)^2)
//        let sideC = Math.sqrt((x1-x3)^2 + (y1-y3)^2)
//        let ss = (sideA + sideB + sideC) / 2;
//        let area = Math.sqrt(ss * (ss - sideA) * (ss - sideB) * (ss - sideC));
//        let r = (sideA * sideB * sideC) / (4 * area)
//        let x = (x1*x1 + y1*y1 - x2*x2 - y2*y2) / (2 * (y1 - y2))
//        let y = (x1*x1 + y1*y1 - x3*x3 - y3*y3) / (2 * (y1 - y3))
//        X.strokeStyle='red';
////        X.lineWidth=3;
//        X.beginPath();
//        X.arc(x, y, r, 0, 2 * Math.PI);
//        X.stroke();



    }


    draw(){
//        X.fillStyle = choice(PALETTE);
//        X.beginPath();
//        X.moveTo(...this.p1);
//        X.lineTo(...this.p2);
//        X.lineTo(...this.p3);
//        X.closePath();
//        X.fill();
//        if (OUTLINE !== 'none'){
//        //if (R()<.1){
//            X.stroke();
//        }

        this.draw_circle()

    }

    // one triangle A,B,C is converted into a list of one or more triangles
    subdivide(){
        SUBDIV_COUNTER += 1;
        let [a,b,c, hue, s, l] = [this.p1, this.p2, this.p3, this.hue, this.s, this.l];
        let random_value = R();

//        a = randomize(a, 50);
//        b = randomize(b, 50);
//        c = randomize(c, 50);

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
    X.fillStyle='black';
    X.fillRect(0,0,w,h);

    //
    // SET FEATURES
    //
    OUTLINE = choice(['black']);  //, 'white', 'none', 'none', 'none'])
    LINE_WIDTH = choice([1000, 2000, 3000, 4000, 6000, 8000]);
    DEPTH = choice([5,8,10,12, 14,14, 16, 18]);
    DEPTH = 20;

    //DEPTH = 12;
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
