 var canvas; // el canvas
 var canvas2; // el canvas
 var ctx2; // el contexto
 var ctx; // el contexto
 var canvasLimites; // los margenes del canvas
 var flagPaint = false; // nos dice si pintar o no
 var mbegin; // la posición actual donde hice click
 var action; //accion a realizar
 var imatge = new Image();

 // Este metodo captura toda accion de paint
 function prepareCanvas(act) {
     //guardamos la accion a realizar pasada por parametro: ejem: circulo, cuadrado pintar
     action = act;
     canvas = document.getElementById("canvas");
     ctx = canvas.getContext("2d"); // obtenemos el contexto ( dibujar en 2d)
     canvasLimites = canvas.getBoundingClientRect(); // obtenemos los limites del canvas
     canvas.addEventListener('mousedown', down, false);
     canvas.addEventListener('mouseup', up, false);
     //cuando movemos el raton llamamos al actionEvnt
     canvas.addEventListener('mousemove', actionEvnt, false);
     canvas.style.cursor = "hand";
 }

 // Este metodo es para cambiar el estado del semafro a la hora de hacer click en el raton
 function down(e) {
     mbegin = obtenerCoordenadas(e);
     flagPaint = true;
 }

 // Este metodo es para cambiar el estado del semafro a la hora de hacer dejar de hacer click en el raton
 function up() {
     flagPaint = false;
 }

 // este metodo se encarga de realizar la llamada al método que se ha de realizar el dispacher
 //se ha intentado aplicar un switch pero no funcionamba correctamente
 function actionEvnt(e) {
     if (action == 'linea') {
         pintarLinea(e);
     } else if (action == 'circulo') {
         pintarFigura(e);
     } else if (action == 'rectangulo') {
         pintarFigura(e);
     } else {

     }
 }

 function convierteCanvas(act) {
     action = act;
     dibuixar();
 }

 //metodo que descarga la imagen del paint
 function downloadCanvas(link, canvasId, filename) {
     link.href = document.getElementById(canvasId).toDataURL();
     link.download = filename;
 }

 function netejacanvas2() {
     canvas2 = document.getElementById("canvas2");
     ctx2 = canvas2.getContext('2d');
     ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
     document.getElementById('can2').hidden = "hidden";
 }

 //borrado de la pantalla del canvas
 function neteja() {
     netejacanvas2();
     canvas = document.getElementById('canvas');
     ctx = canvas.getContext('2d');
     if (canvas.getContext) {
         ctx.clearRect(0, 0, canvas.width, canvas.height);
     }
 }

 function gruix() {
     canvas = document.getElementById('canvas');
     ctx = canvas.getContext('2d');
     ctx.lineWidth = document.getElementById('gruix').value;
 }

 function colorline() {
     canvas = document.getElementById('canvas');
     ctx = canvas.getContext('2d');
     ctx.strokeStyle = document.getElementById('colorline').value;
 }

 function cargarimagen() {
     imatge.src = document.getElementById("imagen").files[0].name;
     imatge.onload = function () {
         ponImagen();
     };
     muestra('');
 }

 function ponImagen() {
     canvas = document.getElementById('canvas');
     if (canvas.getContext) {
         ctx = canvas.getContext('2d');
         ctx.drawImage(imatge, 0, 0);
     }
 }

 //metodo previo al negativo y el blanco y negro recupera la imagen actual de canvas
 function dibuixar() {
     netejacanvas2();
     canvas2 = document.getElementById('canvas2');
     if (canvas2.getContext) {
         ctx = canvas2.getContext('2d');
         if (action == 'BN' || action == 'NEG') {
             ctx.drawImage(document.getElementById('canvas'), 0, 0);
         } else {
             ctx.drawImage(imatge, 0, 0);
         }
         if (action == 'BN' || action == 'NEG') {
             conversion(document.getElementById('canvas'), ctx, canvas);
         }
     }
 }

 //Metodo que hace la conversion del negativo o del blanco y negro
 function conversion(imageObj, context, canvas) {
     var destX = 0;
     var destY = 0;
     context.drawImage(imageObj, destX, destY);
     var imageData = context.getImageData(0, 0, canvas.width,
         canvas.height);
     var pixels = imageData.data;
     netejacanvas2

     if (action == 'BN') {
         //Blanco y negro
         for (var i = 0; i < pixels.length * 4; i += 4) {
             //calcula la luminosidad percibida para este pixel
             var luminosidad = parseInt((pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3);
             pixels[i] = luminosidad; // rojo
             pixels[i + 1] = luminosidad; // verde
             pixels[i + 2] = luminosidad; // azul
         }
     } else if (action == 'NEG') {
         //Negativo
         for (var i = 0; i < pixels.length; i += 4) {
             pixels[i] = 255 - pixels[i];
             // red
             pixels[i + 1] = 255 - pixels[i + 1]; // green
             pixels[i + 2] = 255 - pixels[i + 2]; // blue
             // i+3 es alpha
         }
     } else {

     }
     action == '';
     document.getElementById('can2').hidden = "";
     // modifiquem original
     context.putImageData(imageData, 0, 0);
     muestra('oculta');
 }

 function escribeTexto() {
     if (document.getElementById('tamanyo').value != "" || document.getElementById('texto').value != "") {
         canvas = document.getElementById('canvas');
         ctx = canvas.getContext('2d');
         ctx.fillStyle = document.getElementById('colorline').value;
         // Definimos una fuente y un tamaño de letra.
         ctx.font = document.getElementById('tamanyo').value + 'px ' + document.getElementById('fuente').value;
         // Y solo queda utilizar fillText para definir el texto a mostrar y la posición de origen.
         ctx.fillText(document.getElementById('texto').value, 20, 140);
         document.getElementById('escribir').hidden = "hidden";
         document.getElementById('tamanyo').value = "";
         document.getElementById('texto').value = "";
     } else {
         alert('Has de informar el tamaño y el texto ha escribir');
     }
 }

 //Lapiz pinta a medida que obriene el movimiento del raton con la funcion obtenercoordenadas
 function pintarLinea(event) {
     if (flagPaint) {
         document.getElementById('gruix').disabled = false;
         var coordenadas = obtenerCoordenadas(event);
         ctx.beginPath(); // comenzamos a dibujar
         ctx.moveTo(mbegin.x, mbegin.y); // ubicamos el cursor en la posicion (10,10)
         ctx.lineTo(coordenadas.x, coordenadas.y);
         mbegin = {
             x: coordenadas.x,
             y: coordenadas.y
         };
         ctx.strokeStyle = document.getElementById('colorline').value; // color de la linea
         ctx.stroke(); // dibujamos la linea
     }
 }

 //controlamos si se esta haciendo click en el raton si es asi llamamos al metodo
 function pintarFigura(e) {
     if (flagPaint) {
         mend = obtenerLimites(e);
         dibujarFigura();
     }
 }

 //obtiene las cordenadas mientras se mueve el raton
 function obtenerCoordenadas(event) {
     var posX;
     var posY;

     if (event.pageX || event.pageY) {
         posX = event.pageX - canvasLimites.left;
         posY = event.pageY - canvasLimites.top;
     } else {
         posX = event.clientX - canvasLimferNegatiuites.left;
         posY = event.clientY - canvasLimites.top;
     }

     return {
         x: posX,
         y: posY
     };
 }

 //obtiene los limites mientras movemos el raton a partir del tamaño del canvas
 function obtenerLimites(event) {

     var width;
     var height;

     if (event.pageX || event.pageY) {
         width = (event.pageX - canvasLimites.left) - mbegin.x;
         height = (event.pageY - canvasLimites.top) - mbegin.y;
     } else {
         width = (event.clientX - canvasLimites.left) - mbegin.x;
         height = (event.clientY - canvasLimites.top) - mbegin.y;
     }

     return {
         w: width,
         h: height
     };
 }

 // Metodo que dibuja las figuras rectangulo y circulo
 function dibujarFigura() {
     ctx.fillStyle = document.getElementById('colorline').value;
     if (action == 'circulo') {
         ctx.arc(mbegin.x, mbegin.y, mend.w, 0, 2 * Math.PI, true);
         ctx.closePath();
         ctx.fill();
     } else {
         ctx.fillRect(mbegin.x, mbegin.y, mend.w, mend.h);
     }

 }

 //Metodo que controla las visibilidades de los elementos
 function muestra(op) {
     if (op == 'opciones') {
         document.getElementById('img').hidden = "";
     } else if (op == 'carga') {
         document.getElementById('carga').hidden = "";
     } else if (op == 'texto') {
         document.getElementById('escribir').hidden = "";
     } else if (op == 'close') {
         document.getElementById('can2').hidden = "hidden";
     } else {
         document.getElementById('img').hidden = "hidden";
         document.getElementById('carga').hidden = "hidden";
         if (document.getElementById('imagen').value != '') {
             document.getElementById('imagen').value = "";
         }

     }
 }
