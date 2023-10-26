// TODO:  change pixel size for texture, and linewidth  for overlaying subdivision, they are not the same whe scaling up
// TODO: test pixelratio,  dev controls, try iphone etc
// TODO: fill tiny triangles with background color?
// TODO: shading strategy:   random,  smallest darkest (so larger triangles get brightest?), use direction (mimic sunlight)
// TODO: use sidelengths/elongation to draw triangles, for example, using the smalles side as the starting point,
// do something with gradients, the sharpest angle is opposite of the smallest sidelength
// define different colors palettes from the start triagnles, so the sharp division can transpose into the coloring/appearance

// use triangle subdivision pattern, also with drawing x% of the lines for a wild variation, and use those lines as a texture engraved in the triangles
// when choosing a random point inside triangle to create 3 faces: use that point symmetrically for those 3 triangles, this point is for example the top point,
// and could have color gradation brighter towards this vertex, so the opposite side might be darker.
// In case of using those triangle subdivision patterns, they can point all three to that vertex, to achieve nice symmetry

// todo: stop subdivision when elongation becomes too large. Experiment if that is a good stop condition. Add it to the code as a style variation in case it is good
// enlarge triangles (possibly tilt).  But only when the elongation is larger than some value. This will make the super long and tiny triangles being overriden, so could get rid of the very prominent cutting line


const urlParams = new URLSearchParams(window.location.search);
DEPTH = urlParams.get('depth')||3;
TEXTURE = urlParams.get('texture')==='off'?false:true;
SEED = urlParams.get('seed')||Math.random()*99999999999|0;
COMPOSITION_TYPE = urlParams.get('composition');
TEXTURE_TYPE = urlParams.get('texture_type')|1+Math.random()*2|0;
DIVLINES = urlParams.get('divlines');
WIDTH = urlParams.get('width')||1200;

if (!(DIVLINES==='black' || DIVLINES==='white')){
    DIVLINES='none'
}

S=Uint32Array.of(9,7,5,3);
R=(a=1)=>a*(a=S[3],S[3]=S[2],S[2]=S[1],a^=a<<11,S[0]^=a^a>>>8^(S[1]=S[0])>>>19,S[0]/2**32);
[...SEED+'ThxPiter'].map(c=>R(S[0]^=c.charCodeAt()*S[3]));
A=window.requestAnimationFrame;
FILE_NAME = `FLAKES_V19_${SEED}_D${DEPTH}_`;

C.width=W=parseInt(WIDTH);
C.height=H=(W/2*3)|0;
WW=window.innerWidth;
WH=window.innerHeight;
SCALE = (WW/WH>2/3)?WH/H:WW/W;  // the scale will depend on the longest or shortest side, depending how it fits the current window
C.style.width=`${W*SCALE}px`;
C.style.height=`${H*SCALE}px`;


PALETTES = [
    [[200, 99, 39],[43, 81, 48],[155, 96, 11],[148, 100, 23],[32, 15, 80],[357, 94, 30],[183, 100, 26],[183, 100, 16],[192, 64, 47],[243, 78, 17],[217, 92, 44],[225, 89, 35],[173, 16, 70]],
	[[228, 13, 8],[160, 6, 81],[228, 4, 24],[208, 8, 52],[217, 15, 37],[58, 81, 88],[217, 23, 65],[40, 51, 16],[62, 16, 63],[51, 23, 45],[50, 57, 73],[48, 82, 36],[213, 82, 64],[240, 74, 73]],
	[[0, 0, 9],[150, 1, 38],[185, 96, 71],[255, 2, 64],[6, 12, 84],[164, 38, 45],[137, 11, 24],[184, 42, 50],[197, 86, 66],[122, 73, 80],[47, 90, 68],[167, 37, 34],[332, 42, 45],[75, 33, 98]],
	[[0, 100, 7],[44, 100, 87],[40, 68, 74],[256, 57, 18],[26, 45, 64],[270, 60, 28],[340, 23, 77],[15, 35, 54],[210, 66, 45],[326, 30, 36],[359, 39, 22],[310, 18, 55],[25, 42, 34],[29, 70, 60]],
	[[0, 0, 0],[218, 26, 18],[27, 28, 56],[36, 100, 47],[35, 33, 90],[210, 26, 31],[340, 44, 47],[100, 23, 70],[206, 100, 41],[211, 34, 51],[191, 100, 41],[278, 43, 44],[27, 45, 13],[216, 33, 81]],
	[[33, 14, 84],[7, 100, 2],[3, 70, 48],[289, 20, 22],[42, 61, 34],[41, 78, 14],[3, 55, 39],[30, 40, 58],[19, 72, 46],[261, 42, 30],[261, 64, 10],[165, 2, 34],[41, 48, 70],[9, 63, 60]],
	[[0, 0, 0],[215, 53, 46],[61, 100, 86],[2, 85, 13],[61, 100, 78],[38, 87, 60],[32, 57, 25],[55, 95, 66],[27, 84, 57],[24, 67, 45],[37, 85, 69],[16, 71, 34],[212, 38, 64],[338, 78, 64]],
	[[293, 82, 98],[255, 5, 17],[173, 12, 29],[177, 16, 45],[180, 93, 89],[162, 23, 59],[27, 21, 37],[225, 29, 39],[164, 50, 74],[34, 45, 24],[68, 31, 41],[64, 51, 62],[83, 20, 67],[54, 34, 51]],
    [[312, 3, 78],[228, 9, 23],[33, 56, 77],[4, 55, 68],[181, 46, 60],[1, 48, 49],[355, 18, 73],[183, 38, 39],[0, 0, 0],[0, 0, 100],[0, 100, 100]],
]
PALETTE_INDEX = urlParams.get('palette')||R()*PALETTES.length|0;
//PALETTE_INDEX = R()*PALETTES.length|0;
PALETTE = PALETTES[PALETTE_INDEX];


//PALETTE_Screenshot_from_2023_05_16_21_42_03=['#ffffff','#9e9e9e','#67b7ee','#77c1f4','#67ceee','#cbcbcb','#6767ee','#7e67ee','#8ac3f9','#9e8af9','#6046de','#55abe6','#7777f4','#778cf4','#77cdf4','#679fee','#8d77f4','#6e54e6','#3b85ba','#6788ee','#77acf4','#47b9de','#8b8af9','#5339d5','#489fde','#ba8af9','#4786de','#67abee','#3a94d5','#54c3e6','#5593e6','#cd8af9','#c267ee','#397ad5','#a067ee','#4c3ba0','#503aba','#8ad6f9','#8a9ef9','#7a47de']

//PALETTE=[
////    [206, 100, 1],
//    [40, 67, 89],
////    [217, 69, 12],
//    [289, 15, 57],
////    [210, 56, 6],
//    [251, 23, 51],[34, 53, 83],[254, 22, 56],[6, 21, 35],[250, 6, 20],[240, 18, 12],[225, 19, 45],[224, 25, 21],[226, 35, 14],[345, 19, 25],[228, 20, 34],[224, 11, 26],[215, 48, 16],[224, 17, 29],[252, 12, 8],[348, 23, 30],[10, 14, 17],[2, 14, 63],[293, 14, 53],[236, 13, 40],[246, 12, 49],[220, 18, 53],[286, 18, 38],[346, 12, 21],[350, 15, 39],[357, 17, 50],[4, 10, 28],[238, 18, 67],[209, 72, 8],[347, 16, 45],[221, 28, 43],[206, 4, 38],[234, 23, 64],[280, 12, 28],[40, 49, 67]]


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





getDistance=(a,b)=>{
    diffX = b[0]-a[0];
    diffY = b[1]-a[1];
    return Math.sqrt(diffX **2 + diffY ** 2)  // todo: remove sqrt and handle that when comparing these values
}

getElongation=(a,b,c, drawLine=false)=>{
    /*
      for a triangle a,b,c, take the midpoint of ab, and measure the distance to c.
      compare that length ( = the height of triangle using base ab), to the length of ab.
      return elongation as highest_value / smallest_value,  so the elongation become a value of > 1
    */
    let lengthAB_to_C = getDistance(getMidpoint(a,b), c);
    let lengthA_to_B = getDistance(a,b);


    drawLine&&drawCenterLine(a,b,c);

    let smallest = Math.min(lengthA_to_B, lengthAB_to_C);
    let largest = Math.max(lengthA_to_B, lengthAB_to_C);

    return largest / smallest
}


drawCenterLine=(a,b,c)=>{
    let mp = getMidpoint(a,b)
    X.lineWidth = 2;
    X.strokeStyle = 'red';
    X.beginPath();
    X.moveTo(...mp);
    X.lineTo(...c);
    X.stroke();
}

class Flake {
    // A Flake is one 3th of a parent triangle. So it has 2 siblings with a similar hue but different lighting
    constructor(a,b,c, hue,s,l){
        this.a=a;
        this.b=b;
        this.c=c;
        let triBound = [...a,...b,...c];

        // lengths of all triangle edges
        this.lab = getDistance(a,b);
        this.lbc = getDistance(b,c);
        this.lca = getDistance(c,a);
        this.lengths = [this.lab, this.lbc, this.lca];

        this.shortestIndex = 0; // refers to the edge index in this.length,  0: AB, 1: BC, 2: CA
        for (let i=1; i<3; i++){
            if (this.lengths[i] < this.lengths[this.shortestIndex]) {
                this.shortestIndex = i
            }
        }

        this.area = getTriangleArea(...triBound);
    }
    getElongation() {
        // todo: could be improved by directly chosing the shortest edge, and use that as a & b in below method (?)
        let elo1 = getElongation(this.a, this.b, this.c);
        let elo2 = getElongation(this.b, this.c, this.a);
        let elo3 = getElongation(this.a, this.c, this.b);

        return Math.max(elo1,elo2,elo3);
    }
    getElongation2() {  // based on the shortest edge
        if (this.shortestIndex === 0 ){
            return getElongation(this.a, this.b, this.c, true)
        } else if (this.shortestIndex === 1 ) {
            return getElongation(this.b, this.c, this.a, true)
        }
        return getElongation(this.c, this.a, this.b, true)
    }

    draw(){  // fill the triangle
        X.globalAlpha=1;
        X.globalCompositeOperation='source-over';

        if (this.getElongation()>9){  // draw super long triangles in white
            X.fillStyle = 'white';
            X.globalAlpha = 1;
        } else {
            X.globalAlpha = 1;
            X.fillStyle = 'white';
            X.fillStyle = hslToStr(this.hue,this.s,this.l);
        }

        X.beginPath();
        X.moveTo(...this.a);

        X.lineTo(...this.b);
        X.lineTo(...this.c);

        X.closePath();
        X.fill();
    }
}

let pA = [R()*W, R()*H/2];
let pB = [R()*W, R()*H/2];
let pC = [R()*W, R()*H/2];

let pAi = [pA[0], pA[1] + H/2]
let pBi = [pB[0], pB[1] + H/2]
let pCi = [pC[0], pC[1] + H/2]

randomTriangle = new Flake(pA,pB,pC, 0, 60, 60);
randomTriangleId = new Flake(pAi,pBi,pCi, 0, 60, 60);
randomTriangle.draw();
randomTriangleId.draw();

console.log(randomTriangle.getElongation())
console.log(randomTriangleId.getElongation2())
