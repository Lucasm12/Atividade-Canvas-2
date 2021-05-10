    // Carrega imgem a partir de um input file, e a desenha no Canvas.
    function makeMask(){
      var input = document.getElementById("input_text");
      var fReader = new FileReader();
      fReader.readAsText(input.files[0]);

      fReader.onload = function(){
        coordinates = fReader.result;
        //var p = document.createElement("p");
        //p.innerHTML = coordinates;
        //document.body.appendChild(p);
        drawPolygon(coordinates);
      }
    }

    function drawPolygon(coordinates){
      // coordenadas que serao desenhadas
      var data = coordinates.split(",").map(Number);
      var x = [];
      var y = [];
      var j = 0;

      // definindo nova altura e largura do canvas
      for (i=0; i < data.length-1; i+=2){
        x[j] = data[i];
        y[j] = data[i+1];
        j+=1;
      }

      minx = Math.min.apply(Math, x);
      miny = Math.min.apply(Math, y);
      maxx = Math.max.apply(Math, x);
      maxy = Math.max.apply(Math, y);

      width = maxx - minx;
      height = maxy - miny;

      var canvas = document.getElementById("canvas");
      canvas.height = height;
      canvas.width = width;
      canvas.fillStyle = "#000000";


      // Desenhando o poligono
      var ctx = canvas.getContext('2d');
      ctx.beginPath();
      ctx.lineJoin = "round";
      ctx.moveTo(x[0] - minx, y[0] - miny);

      for (index = 0; index < x.length-1; index++){
        ctx.lineTo(x[index] - minx, y[index] - miny);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.fill();
    }

    function back(){
      location.replace("draw_canvas.html");
    }