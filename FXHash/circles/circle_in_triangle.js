/*
CHANGELOG V8

- randomize option

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

function drawLargestCircle(triangle) {
  // Get the coordinates of the three vertices of the triangle
  const vertex1 = triangle[0];
  const vertex2 = triangle[1];
  const vertex3 = triangle[2];

  // Calculate the length of the sides of the triangle
  const a = distance(vertex2, vertex3);
  const b = distance(vertex1, vertex3);
  const c = distance(vertex1, vertex2);

  // Calculate the circumradius of the triangle
  const circumradius = a * b * c / Math.sqrt((a+b+c) * (b+c-a) * (c+a-b) * (a+b-c));

  // Calculate the circumcenter of the triangle
  const circumcenter = circumcenter(vertex1, vertex2, vertex3);

  // Draw the circumcircle using the circumradius and circumcenter
  drawCircle(circumcenter[0], circumcenter[1], circumradius);
}

// Calculate the distance between two points
function distance(point1, point2) {
  const dx = point2[0] - point1[0];
  const dy = point2[1] - point1[1];
  return Math.sqrt(dx*dx + dy*dy);
}

// Calculate the circumcenter of a triangle
function circumcenter(vertex1, vertex2, vertex3) {
  const x1 = vertex1[0];
  const y1 = vertex1[1];
  const x2 = vertex2[0];
  const y2 = vertex2[1];
  const x3 = vertex3[0];
  const y3 = vertex3[1];

  const circumcenterX = (x1*x1 + y1*y1) * (y2-y3) + (x2*x2 + y2*y2) * (y3-y1) + (x3*x3 + y3*y3) * (y1-y2);
  const circumcenterY = (x1*x1 + y1*y1) * (x3-x2) + (x2*x2 + y2*y2) * (x1-x3) + (x3*x3 + y3*y3) * (x2-x1);
  const circumcenterZ = 2 * (x1*(y2-y3) + x2*(y3-y1) + x3*(y1-y2));

  return [circumcenterX / circumcenterZ, circumcenterY / circumcenterZ];
}

function drawCircle(centerX, centerY, radius) {
    X.fillStyle=choice(['red', 'yellow', 'green', 'blue', 'black', 'white', 'white', 'white']);
    X.beginPath();
    X.arc(centerX, centerY, radius, 0,7);
//    X.closePath();
    X.fill()
}


SUBDIV_COUNTER=0;
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

    get_center(){
        drawLargestCircle([this.p1, this.p2, this.p3])

    }

    draw(){
//        X.fillStyle = choice(['red', 'yellow', 'green', 'blue', 'black', 'white']);
//        X.beginPath();
//        X.moveTo(...this.p1);
//        X.lineTo(...this.p2);
//        X.lineTo(...this.p3);
//        X.closePath();
//        X.fill();
//        if (OUTLINE !== 'none'){
//            X.stroke();
//        }
        X.globalAlpha=.1;
        this.get_center();
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


// Calculate the distance between two points
function distance(point1, point2) {
  const dx = point2[0] - point1[0];
  const dy = point2[1] - point1[1];
  return Math.sqrt(dx*dx + dy*dy);
}


// Calculate the circumcenter of a triangle
function circumcenter(vertex1, vertex2, vertex3) {
  const x1 = vertex1[0];
  const y1 = vertex1[1];
  const x2 = vertex2[0];
  const y2 = vertex2[1];
  const x3 = vertex3[0];
  const y3 = vertex3[1];

  const circumcenterX = (x1*x1 + y1*y1) * (y2-y3) + (x2*x2 + y2*y2) * (y3-y1) + (x3*x3 + y3*y3) * (y1-y2);
  const circumcenterY = (x1*x1 + y1*y1) * (x3-x2) + (x2*x2 + y2*y2) * (x1-x3) + (x3*x3 + y3*y3) * (x2-x1);
  const circumcenterZ = 2 * (x1*(y2-y3) + x2*(y3-y1) + x3*(y1-y2));

  return [circumcenterX / circumcenterZ, circumcenterY / circumcenterZ];
}


function drawLargestCircle(triangle) {
  // Get the coordinates of the three vertices of the triangle
  const vertex1 = triangle[0];
  const vertex2 = triangle[1];
  const vertex3 = triangle[2];

  // Calculate the length of the sides of the triangle
  const a = distance(vertex2, vertex3);
  const b = distance(vertex1, vertex3);
  const c = distance(vertex1, vertex2);

  // Calculate the circumradius of the triangle
  const circumradius = a * b * c / Math.sqrt((a+b+c) * (b+c-a) * (c+a-b) * (a+b-c));

  // Calculate the circumcenter of the triangle
  let circumc = circumcenter(vertex1, vertex2, vertex3);

  // Draw the circumcircle using the circumradius and circumcenter
  drawCircle(circumc[0], circumc[1], circumradius);
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

TO_DRAW = [];
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




function make_artwork(){
    X.fillStyle='black';
    X.fillRect(0,0,w,h);

    //
    // SET FEATURES
    //
    OUTLINE = choice(['black']);  //, 'white', 'none', 'none', 'none'])
    LINE_WIDTH = choice([1000, 2000, 3000, 4000, 6000, 8000]);
    DEPTH = choice([5,8,10,12, 14,14, 16, 18]);
    DEPTH = 5;

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

    let triangles = get_start_triangles();

//    triangles.forEach(t=>{
//        new_trigs = t.subdivide();
//        new_trigs.forEach(nt=>nt.draw())
//    });

    subdivide(triangles, depth=0)
    TO_DRAW.forEach(nt=>nt.draw())
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
