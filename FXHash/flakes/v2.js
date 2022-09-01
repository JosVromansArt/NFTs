/*
CHANGELOG V2

- removed the blur (at least for now)
- Add LINE_WIDTH (for now),  higher value is smaller width
- Add a DEPTH parameter, it is the recursion depth. High depth, means a lot of smaller and smaller triangles. Small depth results in pretty large triangles.
- Remove alpha transparency: always use the default globalAlpha=1
- Recursion depth is the maximum amount of depth, it can also be less. So some regions get less detailed smaller triangles.
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

function fill_triangle(a,b,c){
    X.beginPath();
    X.moveTo(...a);
    X.lineTo(...b);
    X.lineTo(...c);
    X.closePath();
    X.fill();
    if (OUTLINE !== 'none'){
        X.stroke();
    }
}

function random_width(){return R() * w / 3;}
function hsl_to_str(h,s,l,a=1){return 'hsl(' + h + ',' + s + '%,' + l + '%,' + a + ')';}
function draw_triangle(top_point,c1,c2, top_bottom){
    let center_bottom_x = top_point[0];
    let center_bottom = [top_point[0], top_bottom];

    r_width = random_width();

    X.fillStyle = c1;
    fill_triangle(top_point, center_bottom, [center_bottom_x - r_width, top_bottom]);

    X.fillStyle = c2;
    fill_triangle(top_point, center_bottom, [center_bottom_x + r_width, top_bottom]);
}

get_midpoint=(a,b)=>[(a[0] + b[0])/2,(a[1] + b[1])/2];



// one triangle A,B,C is converted into a list of one or more triangles
function next_triangles(a,b,c){
    random_value = R();

    let ab = get_midpoint(a,b);
//    return [[a, ab, c], [b, ab, c]];

    if (random_value < .3){
        return [[a, ab, c], [b, ab, c]];
    } else if (random_value < .6){
        let cab = get_midpoint(ab,c);
        return [
            [a, ab, cab],
            [b,  ab, cab],
            [a, c, cab],
            [b,  c, cab],
        ]
    }

    return [[a,b,c]]; // return the original triangle
}

function draw_triangle_new(a,b,c){
    let hue = R()*300|0;
    let c1 = hsl_to_str(hue, 80, 40, 1);
//    let c2 = hsl_to_str(hue, 70, 70, 1);
    X.fillStyle = c1
    fill_triangle(a,b,c);
}


function draw_triangles(triangle_list, depth=0){
    let next_tri_list = []
    for (let i=0;i<triangle_list.length;i++){
        let triangle = triangle_list[i];
        draw_triangle_new(...triangle);
        next_tri_list = next_tri_list.concat(next_triangles(...triangle));
    }

    if (depth < DEPTH){
        draw_triangles(next_tri_list, depth+choice([1,1,2,3,5]));
        draw_triangles(next_tri_list, depth+choice([1,1,2,3,5]));
    }
}


//function line_length(p1,p2){
//    let xdiff = p2[0] - p1[0];
//    let ydiff = p2[1] - p1[1];
//    return  Math.sqrt(xdiff ** 2 + ydiff ** 2);
//}


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
            [A, B, C],
            [C, A, D],
        ]
    } else if (random_value < .66){
        let BC = get_midpoint(B,C);
        let DA = get_midpoint(D,A);

        return [
            [A, B, BC],
            [BC, A, DA],
            [DA, BC, D],
            [BC, D,C],
        ]
    }


    let DA = get_midpoint(D,A);
    let DAB = get_midpoint(DA, B);

    return [
        [A, B, DA],
        [B, DAB, C],
        [DAB, C, DA],
        [DA, C, D],
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
    DEPTH = choice([3,5,7,8,9,11]);  //,11,12]);

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

    draw_triangles(get_start_triangles());
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