/*
CHANGELOG V3
- Refactor, use Triangle class now
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


class Triangle {
    constructor(p1,p2,p3, hue, s=50, l=50){
        if (hue === undefined){hue=R()*300|0;}
        this.p1=p1;
        this.p2=p2;
        this.p3=p3;
        this.hue=hue;
        this.s=s;
        this.l=l;
    }

    draw(){
        X.fillStyle = hsl_to_str(this.hue, this.s, this.l, 1);
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
        let [a,b,c] = [this.p1, this.p2, this.p3];
        let random_value = R();

        let ab = get_midpoint(a,b);

        if (random_value < .3){
            return [
                new Triangle(a, ab, c),
                new Triangle(b, ab, c),
            ]
        } else if (random_value < .6){
            let cab = get_midpoint(ab,c);
            return [
                new Triangle(a, ab, cab),
                new Triangle(b,  ab, cab),
                new Triangle(a, c, cab),
                new Triangle(b,  c, cab),
            ]
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





function draw_triangles(triangle_list, depth=0){
    let next_tri_list = []
    for (let i=0;i<triangle_list.length;i++){
        let triangle = triangle_list[i];
        triangle.draw()
        next_tri_list = next_tri_list.concat(triangle.subdivide());
    }

    if (depth < DEPTH){
        draw_triangles(next_tri_list, depth+choice([1,1,2,3,5]));
        draw_triangles(next_tri_list, depth+choice([1,1,2,3,5]));
    }
}



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
    X.fillStyle='black';
    X.fillRect(0,0,w,h);

    //
    // SET FEATURES
    //
    OUTLINE = choice(['black']);  //, 'white', 'none', 'none', 'none'])
    LINE_WIDTH = choice([1000, 2000, 3000, 4000, 6000, 8000]);
    DEPTH = choice([3,5,7,8,9]);  //,11,12]);

//    DEPTH = 11;
//    LINE_WIDTH = 6000;


    X.lineWidth=h/LINE_WIDTH;
    FEATURES_DICT = {
        'Outline': OUTLINE,
        'Line Width': LINE_WIDTH,
        'Depth': DEPTH,
    }
    file_name = '_depth' + DEPTH.toString();
    if (OUTLINE !== 'none'){file_name += '_' + OUTLINE + ' outline'}

    X.strokeStyle=OUTLINE;

    console.table(FEATURES_DICT)
//    Object.keys(FEATURES_DICT).map(k=>console.log(k, ' : ', FEATURES_DICT[k]))


    START_TRIANGLES = get_start_triangles();

    START_TRIANGLES.forEach(t=>{t.color=[
        choice([80, 120, 200, 300]),
        80,
        40,
    ]});

    draw_triangles(START_TRIANGLES);
    do_blur();
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