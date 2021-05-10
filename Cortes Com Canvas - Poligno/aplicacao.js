if(window.addEventListener) {
  // Variaveis Globais para as coordenadas
  var coordinates_X = Array();
  var coordinates_Y = Array();
  
window.addEventListener('load', function () {
  var canvas, contexto, canvas_objeto, contexto_objeto;

  // Instancia de uma ferramenta. Inicia com a padrão
  var ferramenta;
  var ferramenta_padrao = 'line';

  function init () {
    // Buscando o elemento canvas
    canvas_objeto = document.getElementById('canvas');
    if (!canvas_objeto) {
      alert('Erro: Impossivel encontrar o elemento canvas!');
      return;
    }

    if (!canvas_objeto.getContext) {
      alert('Erro: Canvas.getContext ausente!');
      return;
    }

    // Pegando o contexto canvas 2D.
    contexto_objeto = canvas_objeto.getContext('2d');
    if (!contexto_objeto) {
      alert('Erro: Falha ao pegar o contexto canvas!');
      return;
    }

    // Criando um container canvas temporario.
    var container = canvas_objeto.parentNode;
    canvas = document.createElement('canvas');
    if (!canvas) {
      alert('Erro: Não foi possivel criar um Novo elemento canvas!');
      return;
    }

    canvas.id     = 'imageTemp';
    canvas.width  = canvas_objeto.width;
    canvas.height = canvas_objeto.height;
    container.appendChild(canvas);

    contexto = canvas.getContext('2d');

    // Recuperando a ferramenta escolhida no input de selecao
    var tool_select = document.getElementById('dtool');
    if (!tool_select) {
      alert('Error: Falha ao recuperar ferramenta selecionada!');
      return;
    }
    tool_select.addEventListener('change', ev_tool_change, false);

    // Ativando a ferramenta padrao.
    if (tools[ferramenta_padrao]) {
      ferramenta = new tools[ferramenta_padrao]();
      tool_select.value = ferramenta_padrao;
    }

    // Adicionando ao canvas os ouvintes de eventos: mousedown, mousemove e mouseup.
    canvas.addEventListener('mousedown', ev_canvas, false);
    canvas.addEventListener('mousemove', ev_canvas, false);
    canvas.addEventListener('mouseup',   ev_canvas, false);
  }

  // Manipulador de evntos gerais. Determina somente os eventos do mouse
  // Posicao relativa ao elemento canvas.
  function ev_canvas (ev) {
    if (ev.layerX || ev.layerY == 0) {
      ev._x = ev.layerX;
      ev._y = ev.layerY;
    } 

    // Chama o manipulador de eventos da ferramenta.
    var func = ferramenta[ev.type];
    if (func) {
      func(ev);
    }
  }

  // Manipulador de eventos para quaisquer alterações feitas no seletor de ferramenta
  function ev_tool_change (ev) {
    if (tools[this.value]) {
      ferramenta = new tools[this.value]();
    }
  }

  // Esta função desenha a tela #imageTemp sobre o #canvas, após isso o #imageTemp é limpo. 
  // Essa função é chamada sempre que o usuário completa uma operação de desenho
  function img_update () {
    contexto_objeto.drawImage(canvas, 0, 0);
    contexto.clearRect(0, 0, canvas.width, canvas.height);
  }

  // Esta variavel contem a implementacao de cada uma das ferramentas de desenho
  var tools = {};

// A ferramenta Poligono
  tools.line = function () {
    var ferramenta = this;
    this.started = false;

    var count = 0;

    this.mousedown = function (ev) {
      ferramenta.started = true;
      ferramenta.x0 = ev._x;
      ferramenta.y0 = ev._y;

      var start_angle = 0,
          end_angle = 2 * Math.PI;

      contexto.beginPath();
      contexto.arc(ev._x, ev._y, 3, start_angle, end_angle);
      contexto.fillStyle = "red";
      contexto.fill();
      contexto.stroke();

      coordinates_X.push(ev._x);
      coordinates_Y.push(ev._y);
    };

    this.mousemove = function (ev) {
      if (!ferramenta.started) {
        return;
      }

      if(ev.x0 == ev._x && ev.y0 == ev._y){
        document.getElementById("imageTemp").style.cursor = "crosshair";
      }
    };

    this.mouseup = function (ev) {
      if (ferramenta.started && count == 0) {
        contexto.beginPath();
        contexto.moveTo(ferramenta.x0, ferramenta.y0);
        contexto.lineTo(ev._x,   ev._y);
        contexto.strokeStyle = "#00FF00";
        contexto.lineJoin = 'round';
        contexto.stroke();
        contexto.closePath();
        var start_angle = 0,
            end_angle = 2 * Math.PI;

        contexto.beginPath();
        contexto.arc(ev._x, ev._y, 3, start_angle, end_angle);
        contexto.fillStyle = "red";
        contexto.closePath();
        contexto.fill();
        contexto.stroke();

        coordinates_X[count] = ev._x;
        coordinates_Y[count] = ev._y;

        count = count+1;
      } else {
        contexto.beginPath();
        contexto.moveTo(coordinates_X[count - 1], coordinates_Y[count - 1]);
        contexto.lineTo(ev._x,   ev._y);
        contexto.strokeStyle = "#00FF00";
        contexto.lineJoin = 'round';
        contexto.stroke();
        contexto.closePath();
        var start_angle = 0,
            end_angle = 2 * Math.PI;

        contexto.beginPath();
        contexto.arc(ev._x, ev._y, 3, start_angle, end_angle);
        contexto.fillStyle = "red";
        contexto.closePath();
        contexto.fill();
        contexto.stroke();

        count = count+1;
      }
    };
  };

  // Carrega imgem a partir de um input file, e a desenha no Canvas.
  document.getElementById('input_image').onchange = function(e) {
    var img = new Image();
    img.onload = draw;
    img.onerror = failed;
    img.src = URL.createObjectURL(this.files[0]);
  };

  function draw() {
    canvas.width = this.width;
    canvas.height = this.height;
    contexto.drawImage(this, 0,0);

    document.getElementById("imageTemp").style.cursor = "crosshair";
    canvas_objeto.width = this.width;
    canvas_objeto.height = this.height;
  };

  function failed() {
    console.error("O arquivo fornecido não pode ser carregado com uma mídia de imagem.");
  };

init();

}, false); 

function download() {
  var str_text = "";
  
  for (var i = 0; i < coordinates_X.length; i++) {
    if(i != coordinates_X.length -1){
        str_text += coordinates_X[i] + "," + coordinates_Y[i]+",";
    } else{
      str_text += coordinates_X[i] + "," + coordinates_Y[i];
    }
  }

  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(str_text));
  element.setAttribute('download', "coordenadas.txt");

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
  location.replace("mask.html")
};

}