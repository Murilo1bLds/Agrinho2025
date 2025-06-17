// Código restaurado com base na versão funcional anterior com melhorias visuais

let tela = "inicio";
let botaoIniciar;
let fonteTitulo;

let nuvens = [];
let baloes = [];
let chaoTexture;
let vacas = [];
let predios = [];

let trilhoImg;
let trilhoX1 = 0;
let trilhoX2;
let trilhoVelocidade = 2;

let arvores = [];
let flores = [];
let arbustos = [];

let tremImg;

let falaIndex = 0;
let tempoUltimaFala = 0;
let falas = [
  "Graças ao campo, a cidade recebe alimentos frescos todos os dias.",
  "A tecnologia urbana tem modernizado as práticas agrícolas no campo.",
  "Cooperativas fortalecem a economia local e conectam produtores aos mercados urbanos.",
  "Produtos do campo abastecem supermercados, feiras e restaurantes nas cidades.",
  "A educação no campo tem se expandido com apoio de universidades urbanas.",
  "Campo e cidade juntos garantem sustentabilidade e qualidade de vida para todos."
];

function preload() {
  fonteTitulo = loadFont('CherryBombOne-Regular.ttf');
  trilhoImg = loadImage("costume1.svg");
  tremImg = loadImage("trem1.svg");
}

function setup() {
  createCanvas(600, 400);
  trilhoX2 = width;
  chaoTexture = createGraphics(width, 40);
  gerarTexturaChao(chaoTexture);
  
  let tamArb = 2;
  let rArb = (200, 255)
  let gArb = (100, 200)
  let bArb = (200, 255)

  botaoIniciar = createButton("Iniciar Jogo");
  botaoIniciar.position(width / 2 - 60, height / 2 + 40);
  botaoIniciar.size(120, 45);
  botaoIniciar.style("font-size", "16px");
  botaoIniciar.style("background-color", "#A75D00");
  botaoIniciar.style("color", "#FFF3D4");
  botaoIniciar.style("border", "none");
  botaoIniciar.style("border-radius", "12px");
  botaoIniciar.style("box-shadow", "2px 2px 5px rgba(0,0,0,0.3)");
  botaoIniciar.mousePressed(() => {
    tela = "jogo";
    botaoIniciar.hide();
    iniciarJogoCampo();
  });
  botaoIniciar.mouseOver(() => {
    botaoIniciar.style("transform", "scale(1.1)");
    botaoIniciar.style("background-color", "#8B4A00");
    botaoIniciar.style("cursor", "pointer");
  });
  botaoIniciar.mouseOut(() => {
    botaoIniciar.style("transform", "scale(1)");
    botaoIniciar.style("background-color", "#A75D00");
  });

  for (let i = 0; i < 5; i++) {
    nuvens.push({ x: random(width), y: random(50, 150), velocidade: random(0.3, 0.6) });
  }

  const coresVivas = [
    color(255, 60, 60, 200), color(60, 120, 255, 200),
    color(255, 220, 50, 200), color(255, 80, 200, 200),
    color(50, 220, 100, 200), color(255, 140, 0, 200)
  ];

  for (let i = 0; i < 15; i++) {
    baloes.push({
      x: random(width), y: random(height, height + 100),
      cor: random(coresVivas), velocidade: random(1.5, 2.5),
      tamanho: random(6, 12), ativo: true
    });
  }

  gerarVacas();
  gerarPredios();
}

function draw() {
  if (tela === "inicio") {
    telaInicio();
  } else if (tela === "jogo") {
    telaCampoComTrem();
  }
}

function telaInicio() {
  desenharCeuPordosol();
  desenharNuvens();
  desenharBaloes();
  image(chaoTexture, 0, height - 40);
  desenharVacasNaGrama();
  desenharPrediosNaCidade();

  textAlign(CENTER, CENTER);
  textFont(fonteTitulo);
  textSize(36);
  fill('#6B3E00');
  text("Trem da Conexão", width / 2, height / 2 - 50);

  textFont("sans-serif");
  textSize(14);
  fill('#6B3E00');
  text("Comece sua jornada!", width / 2, height / 2 + 25);
}

function iniciarJogoCampo() {
  arvores = [];
  flores = [];
  arbustos = [];
  for (let i = 0; i < 15; i++) {
    arvores.push({ x: random(width, width * 3), y: random(160, 220) });
  }
  for (let i = 0; i < 30; i++) {
    flores.push({ x: random(width, width * 2), y: random(height / 2 + 40, height - 40) });
    arbustos.push({ x: random(width, width * 2), y: random(height / 2 + 20, height - 60) });
  }
}

function telaCampoComTrem() {
  background(135, 206, 235);

    fill(34, 139, 34);
  rect(0, height / 2, width, height / 2);
  
  
  for (let a of arvores) {
    drawDetailedTree(a.x, a.y);
    a.x -= trilhoVelocidade;
    if (a.x < -50) {
      a.x = random(width, width * 2);
      a.y = random(160, 220);
    }
  }


  for (let f of flores) {
    drawFlower(f.x, f.y);
    f.x -= trilhoVelocidade;
    if (f.x < -10) f.x = random(width, width * 2);
  }
  for (let b of arbustos) {
    drawBush(b.x, b.y);
    b.x -= trilhoVelocidade;
    if (b.x < -20) b.x = random(width, width * 2);
  }

  trilhoX1 -= trilhoVelocidade;
  trilhoX2 -= trilhoVelocidade;
  if (trilhoX1 < -width) trilhoX1 = trilhoX2 + width;
  if (trilhoX2 < -width) trilhoX2 = trilhoX1 + width;
  image(trilhoImg, trilhoX1, height - 90, width, 50);
  image(trilhoImg, trilhoX2, height - 90, width, 50);

  push();
  translate(width / 2 + 80, height / 2 - 65);
  scale(0, 1);
  image(tremImg, 0, 115, 160, 100);
  pop();

  fill(0);
  textSize(16);
  textAlign(CENTER);
  text(falas[falaIndex], width / 2, 40);
  if (millis() - tempoUltimaFala > 10000) {
    falaIndex = (falaIndex + 1) % falas.length;
    tempoUltimaFala = millis();
  }
}

function drawDetailedTree(x, y) {
  stroke(80, 50, 20);
  strokeWeight(6);
  line(x, y, x, y + 40);
  noStroke();
  fill(30, 150, 50);
  ellipse(x, y, 40, 40);
  ellipse(x - 15, y + 5, 30, 30);
  ellipse(x + 15, y + 5, 30, 30);
}

function drawFlower(x, y) {
  textSize(18);
  textAlign(CENTER, CENTER);
  let emojisFlores = ["🌹", "🌻", "🌷", "🌼"];
  let emoji = random(emojisFlores);
  text(emoji, x, y);
}


function drawBush(x, y) {
  // Arbusto base
  noStroke();
  fill(34, 100, 34); // Verde escuro
  ellipse(x, y, 30, 20);

  // Luz simulada
  stroke(60, 180, 60, 120); // Verde claro translúcido
  strokeWeight(1);
  for (let i = -10; i <= 10; i += 5) {
    line(x + i, y - 5, x + i + 2, y - 10);
  }
  noStroke();
}


function desenharCeuPordosol() {
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let c1 = color('#FFD6C1'), c2 = color('#FF9671'), c3 = color('#845EC2');
    let c = inter < 0.5 ? lerpColor(c1, c2, inter * 2) : lerpColor(c2, c3, (inter - 0.5) * 2);
    stroke(c);
    line(0, y, width, y);
  }
}

function desenharNuvens() {
  noStroke();
  for (let nuvem of nuvens) {
    fill(255, 180);
    push();
    translate(nuvem.x, nuvem.y);
    ellipse(0, 0, 40, 30);
    ellipse(-15, 5, 30, 25);
    ellipse(15, 5, 30, 25);
    ellipse(-25, 0, 25, 20);
    ellipse(25, 0, 25, 20);
    ellipse(0, -10, 35, 25);
    pop();
    nuvem.x += nuvem.velocidade * 0.3;
    if (nuvem.x > width + 60) {
      nuvem.x = -60;
      nuvem.y = random(50, 150);
    }
  }
}

function desenharBaloes() {
  noStroke();
  for (let b of baloes) {
    if (!b.ativo) continue;
    fill(b.cor);
    ellipse(b.x, b.y, b.tamanho, b.tamanho * 1.3);
    stroke(100, 100);
    line(b.x, b.y + b.tamanho * 0.65, b.x, b.y + b.tamanho);
    noStroke();
    b.y -= b.velocidade;
    if (b.y < -20) b.ativo = false;
  }
}

function desenharVegetacao() {
  for (let v of vegetacao) {
    if (tela === "jogo") v.x -= trilhoVelocidade;
    if (v.x < -20) v.x = width + 125;

    if (v.tipo === "flor") {
      fill(v.cor);
      ellipse(v.x, v.y, v.tamanho, v.tamanho);
      stroke(30, 100, 30);
      line(v.x, v.y, v.x, v.y + 5);
      noStroke();
    } else if (v.tipo === "arbusto") {
      fill(34, 139, 34, 180);
      beginShape();
      for (let i = 0; i < 5; i++) {
        let angle = map(i, 0, 4, 0, TWO_PI);
        let r = v.tamanho + tamArb;
        let px = v.x + cos(angle) * r;
        let py = v.y + sin(angle) * r;
        vertex(px, py);
      }
      endShape(CLOSE);
    }
  }
}

function gerarVegetacao() {
  vegetacao = [];
  for (let i = 0; i < 50; i++) {
    vegetacao.push({
      x: (width * 2),
      y: (height / 2 + 30, height - 10),
      tipo: random(["flor", "arbusto"]),
      cor: color(240, 150, 230,),
      tamanho: (7)
    });
  }
}

function gerarArvores() {
  arvores = [];
  for (let i = 0; i < 5; i++) {
    arvores.push({ x: (width), y: 100 });
  }
}

function drawDetailedTree(x, y) {
  textSize(24);
  textAlign(CENTER, CENTER);
  text("🌳", x, y);
}

function gerarTexturaChao(pg) {
  pg.clear();
  pg.noStroke();
  pg.fill(60, 180, 60);
  pg.rect(0, 0, pg.width / 2, pg.height);

  for (let i = 0; i < 100; i++) {
    let x = random(pg.width / 2), y = random(pg.height);
    let cor = color(random(40, 80), random(120, 200), random(40, 80), 130);
    pg.fill(cor);
    if (random(1) < 0.5) pg.ellipse(x, y, random(2, 4), random(3, 6));
    else pg.rect(x, y, random(1, 2), random(3, 5));
  }

  let faixaInicio = pg.width * 0.48;
  let faixaFim = pg.width * 0.52;
  for (let i = 0; i < 1000; i++) {
    let x = random(faixaInicio, faixaFim), y = random(pg.height);
    let terra = color(random(100, 130), 60, 0, random(100, 200));
    pg.fill(terra);
    pg.rect(x, y, random(2, 5), random(2, 6));
  }

  pg.fill(100);
  pg.rect(pg.width / 2, 0, pg.width / 2, pg.height);
}

function gerarVacas() {
  vacas = [];
  let numVacas = floor(random(5, 10));
  for (let i = 0; i < numVacas; i++) {
    let x = random(20, width / 2 - 20), y = random(height - 40 + 5, height - 10);
    let direcao = random([1, -1]);
    vacas.push({ x, y, direcao });
  }
}

function desenharVacasNaGrama() {
  textAlign(CENTER, CENTER);
  textSize(20);
  noStroke();
  fill(255);
  for (let v of vacas) {
    push();
    translate(v.x, v.y);
    scale(v.direcao, 1);
    text("🐄", 0, 0);
    pop();
  }
}

function gerarPredios() {
  predios = [];
  let startX = width / 2 + 20;
  let espacamento = 35;
  let emojisPredios = ["🏢", "🏬", "🏣", "🏤", "🏥", "🏦", "🏨", "🏪", "🏫", "🏭"];
  for (let i = 0; i < emojisPredios.length; i++) {
    predios.push({ x: startX + i * espacamento, emoji: emojisPredios[i] });
  }
}

function desenharPrediosNaCidade() {
  textAlign(CENTER, BOTTOM);
  textSize(28);
  noStroke();
  fill(255);
  for (let p of predios) {
    text(p.emoji, p.x, height - 40);
  }
}
