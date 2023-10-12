W=window;
w=W.innerWidth;
h=W.innerHeight;

s=950;
s2 = s/2;

pR=W.devicePixelRatio;
C.width=~~(w*pR);
C.height=~~(h*pR);
C.style.width=`${w}px`;
C.style.height=`${h}px`;
X=C.getContext('2d');
X.scale(pR,pR);

X.fillStyle='#ccc';
X.fillRect(0,0,s,s);

//X.fillStyle='black';
//X.fillRect(s*.4,s*.4,s*.2,s*.2);

R = Math.random;

class Polygon {
    constructor(vertices){
        this.vertices = vertices;
        this.edges
        this.length = vertices.length;
    }

    draw_outline(color='#888', line_width=s/10){
        X.beginPath();
        X.moveTo(...this.vertices[0]);
        for (let i=1; i<this.length; i++){
            X.lineTo(...this.vertices[i])
        }
        X.closePath();
        X.strokeStyle = color;
        X.lineWidth = line_width;
        X.stroke();
    }
    fill(color='#888'){
        X.beginPath();
        X.moveTo(...this.vertices[0]);
        for (let i=1; i<this.length; i++){
            X.lineTo(...this.vertices[i])
        }
        X.closePath();
        X.fillStyle = color;
        X.fill();
    }
}




randomize=(v, off_per=.07)=>{
    let delta = off_per * s;  // define it based on the defined size s
    let half_delta = delta/2;

    return [
        v[0] + R()*delta - half_delta,
        v[1] + R()*delta - half_delta,
    ]
}


let start_polygon = new Polygon(vertices=[
    randomize([s*.4, s*.4]),
    randomize([s*.6, s*.4]),
    randomize([s*.6, s*.6]),
    randomize([s*.4, s*.6]),
])

start_polygon.draw_outline(color='#000', line_width=s/100);
start_polygon.fill(color='#090');

