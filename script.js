// script.js
var canvas;
var stage;
var container;
var captureContainers;
var captureIndex;
var text;  // Variable global para el texto

function init() {
  canvas = document.getElementById("testCanvas");
  stage = new createjs.Stage(canvas);

  // Configuración inicial del canvas con soporte para alta densidad de píxeles
  var ratio = window.devicePixelRatio || 1;
  var w = window.innerWidth;
  var h = window.innerHeight;
  canvas.width = w * ratio;
  canvas.height = h * ratio;
  canvas.style.width = w + "px";
  canvas.style.height = h + "px";
  stage.scaleX = ratio;
  stage.scaleY = ratio;

  container = new createjs.Container();
  stage.addChild(container);

  captureContainers = [];
  captureIndex = 0;

  // Crear 100 corazones
  for (var i = 0; i < 100; i++) {
    var heart = new createjs.Shape();
    heart.graphics.beginFill(
      createjs.Graphics.getHSL(Math.random() * 30 - 45, 100, 50 + Math.random() * 30)
    );
    heart.graphics
      .moveTo(0, -12)
      .curveTo(1, -20, 8, -20)
      .curveTo(16, -20, 16, -10)
      .curveTo(16, 0, 0, 12)
      .curveTo(-16, 0, -16, -10)
      .curveTo(-16, -20, -8, -20)
      .curveTo(-1, -20, 0, -12);
    heart.y = -100;
    container.addChild(heart);
  }

  // Crear texto centrado
  text = new createjs.Text("the longer I'm with you\nthe more I love you", "bold 24px Arial", "#fff");
  text.textAlign = "center";
  text.x = w / 2;
  text.y = h / 2 - text.getMeasuredLineHeight();
  stage.addChild(text);

  // Crear contenedores de caché
  for (var i = 0; i < 100; i++) {
    var captureContainer = new createjs.Container();
    captureContainer.cache(0, 0, w, h);
    captureContainers.push(captureContainer);
  }

  createjs.Ticker.timingMode = createjs.Ticker.RAF;
  createjs.Ticker.on("tick", tick);

  // Agregar listener para redimensionar la ventana
  window.addEventListener("resize", handleResize);
}

function repositionElements() {
  // Reposicionar elementos dependientes del tamaño (como el texto centrado)
  var w = window.innerWidth;
  var h = window.innerHeight;
  text.x = w / 2;
  text.y = h / 2 - text.getMeasuredLineHeight();
}

function handleResize() {
  var ratio = window.devicePixelRatio || 1;
  var w = window.innerWidth;
  var h = window.innerHeight;
  
  // Actualizar el tamaño del canvas
  canvas.width = w * ratio;
  canvas.height = h * ratio;
  canvas.style.width = w + "px";
  canvas.style.height = h + "px";
  stage.scaleX = ratio;
  stage.scaleY = ratio;
  
  repositionElements();

  // Actualizar el caché de los contenedores
  captureContainers.forEach(function(capContainer) {
    capContainer.cache(0, 0, w * ratio, h * ratio);
  });

  stage.update();
}

function tick(event) {
  var ratio = window.devicePixelRatio || 1;
  // Convertir dimensiones a píxeles CSS
  var w = canvas.width / ratio;
  var h = canvas.height / ratio;
  var l = container.numChildren;

  captureIndex = (captureIndex + 1) % captureContainers.length;
  stage.removeChildAt(0);
  var captureContainer = captureContainers[captureIndex];
  stage.addChildAt(captureContainer, 0);
  captureContainer.addChild(container);

  for (var i = 0; i < l; i++) {
    var heart = container.getChildAt(i);
    if (heart.y < -50) {
      heart._x = Math.random() * w;
      heart.y = h * (1 + Math.random()) + 50;
      heart.perX = (1 + Math.random() * 2) * h;
      heart.offX = Math.random() * h;
      heart.ampX = heart.perX * 0.1 * (0.15 + Math.random());
      heart.velY = -Math.random() * 2 - 1;
      heart.scale = Math.random() * 2 + 1;
      heart._rotation = Math.random() * 40 - 20;
      heart.alpha = Math.random() * 0.75 + 0.05;
      heart.compositeOperation = Math.random() < 0.33 ? "lighter" : "source-over";
    }
    var int = (heart.offX + heart.y) / heart.perX * Math.PI * 2;
    heart.y += heart.velY * heart.scaleX / 2;
    heart.x = heart._x + Math.cos(int) * heart.ampX;
    heart.rotation = heart._rotation + Math.sin(int) * 30;
  }

  captureContainer.updateCache("source-over");
  stage.update(event);
}

init();
