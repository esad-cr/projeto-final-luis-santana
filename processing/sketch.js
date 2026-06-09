// --- Variáveis de estado ---
let breathingActive = false, breathePhase = 0;
let arcA = 0, arcB = 0, arcAnimating = false, arcActive = false;
const ARC_SPEED = 1;
let lightBlue, darkBlue, grayColor, mainArcColor;
let spaceMono, jetBrainsMono; // fonts (loaded in preload)
// --- Etiquetas estáticas ---
const DIAS = ["Domingo","Segunda","Terça","Quarta","Quinta","Sexta","Sábado"];
const MONTHS = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];

function setup() {
    var myCanvas = createCanvas(450, 450);
  myCanvas.parent("p5Canvas");
  angleMode(RADIANS);
  textAlign(CENTER, CENTER);
  // --- Cores ---
  lightBlue = color('#007AFF');
  darkBlue = color(0, 50, 150);
  grayColor = color('#CFCFCF');
  mainArcColor = color('#FFD60A');

  // --- Diagnóstico de carregamento de fontes (console) ---
  if(spaceMono) console.log('Space Mono carregada.'); else console.warn('Space Mono não carregada — fallback monospace.');
  if(jetBrainsMono) console.log('JetBrains Mono carregada.'); else console.warn('JetBrains Mono não carregada — fallback monospace.');
}

// --- Main draw loop ---
function draw(){
  // Canvas transparente fora da watch face
  clear();
  const c=width/2, cy=height/2;
  // filled watch background (inside radial zone)
  push(); noStroke(); fill(25); ellipse(c, cy, 430); pop();
  // contorno exterior (outline)
  push(); strokeWeight(8); stroke(40); noFill(); ellipse(c, cy, 430); pop();
  // arcos
  if(!arcActive){ push(); strokeWeight(16); stroke(grayColor); noFill(); arc(c, cy, 360, 360, 0, PI); pop(); arcA=arcB=0; arcAnimating=false; }
  else { push(); strokeWeight(14); stroke(255,60,60); noFill(); arc(c, cy, 360, 360, 0, PI); pop(); push(); strokeWeight(16); stroke(mainArcColor); noFill(); arc(c, cy, 360, 360, 0, radians(arcA)); pop(); if(arcAnimating){ arcA=min(arcA+ARC_SPEED,180); arcB=min(arcB+ARC_SPEED,180); if(arcA===180&&arcB===180)arcAnimating=false; } else arcA=arcB=180; }
  // respiração
  let r=(sin(frameCount*0.03)+1)/2; breathePhase=lerp(breathePhase,breathingActive?r:0.3,0.08); fill(breathingActive?lerpColor(darkBlue,lightBlue,breathePhase):grayColor); noStroke(); ellipse(c, height/2.3-95, map(breathePhase,0,1,60,80));
  // hora/data
  textSize(45); fill('#CECECE'); textFont(spaceMono?spaceMono:'monospace'); text(nf(hour(),2)+":"+nf(minute(),2)+":"+nf(second(),2), c, cy+2);
  textSize(28); textFont(jetBrainsMono?jetBrainsMono:'monospace'); text(DIAS[new Date().getDay()]+' '+new Date().getDate(), c, cy-34); text(MONTHS[month()-1]+' '+year(), c, cy+46);
}

// --- Mouse controls ---
function mouseClicked(){
  // Alternar sensor
  if(dist(mouseX,mouseY,width/2,height/2.3-95)<80){ breathingActive=!breathingActive; return; }
  // Alternar arco
  let d2=dist(mouseX,mouseY,width/2,height/2), arcRadius=180;
  if(mouseY>height/2-10 && d2>arcRadius-40 && d2<arcRadius+40) arcActive=!arcActive, arcAnimating=arcActive, arcA=arcB=0;
}

// --- Key controls ---
function keyPressed(){ if(key==='a'||key==='A') breathingActive=!breathingActive; if(key==='b'||key==='B') arcActive=!arcActive,arcAnimating=arcActive,arcA=arcB=0; }