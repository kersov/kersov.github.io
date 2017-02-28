(function(){
  var canvas = document.getElementById('stars');

  if (canvas.getContext) {
    var	ctx = canvas.getContext('2d'),
    	mouse = { x: 0, y: 0 },
    	m = {},
    	r = 0,
    	particles = [];

    canvas.width = window.innerWidth * (window.devicePixelRatio || 1);
    canvas.height = window.innerHeight * (window.devicePixelRatio || 1);

    mouse.x = canvas.width / 2;
    mouse.y = canvas.height / 2;

    function random(min, max, float){
    	return float
    		? Math.random() * (max - min) + min
    		: Math.floor(Math.random() * (max - min + 1)) + min
    }

    for(var i=0; i<random(1000, 5000); i++){
    	particles.push({
    		x: random(-300, canvas.width + 300),
    		y: random(-300, canvas.height + 300),
    		s: random(1, 3)
    	})
    }

    document.addEventListener('mousemove', function(e){
    	mouse.x = e.clientX;
    	mouse.y = e.clientY;
    })

    function render(){
    	ctx.clearRect(0, 0, canvas.width, canvas.height);

    	for(var i=0; i<particles.length; i++){
    		var p = particles[i];

    		var x = p.x + ((((canvas.width / 2) - mouse.x) * p.s) * 0.1);
    		var y = p.y + ((((canvas.height / 2) - mouse.y) * p.s) * 0.1);

    		ctx.fillStyle = '#fff';
    		ctx.beginPath();
    		ctx.fillRect(x, y, p.s, p.s);
    		ctx.closePath();
    	}
    }

    // requestAnimFrame polyfill
    window.requestAnimFrame = (function(){
    	return	window.requestAnimationFrame ||
    			window.webkitRequestAnimationFrame ||
    			window.mozRequestAnimationFrame ||
    			function( callback ){
    				window.setTimeout(callback, 1000 / 60);
    			};
    })();

    // create the animation loop
    (function animloop(){
    	requestAnimFrame(animloop);
    	render();
    })();
  }

})();
