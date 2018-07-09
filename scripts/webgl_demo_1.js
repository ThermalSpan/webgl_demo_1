function makeWindowResizeCallback(canvas) {
	return function() {
		console.log("Window Resized");
		canvas.setAttribute("width", window.innerWidth);
		canvas.setAttribute("height", window.innerHeight);
	};
}

function loadAperature() {
	fetch("aperature_wasm.wasm").then(response =>
		response.arrayBuffer()
	).then(bytes =>
		WebAssembly.instantiate(bytes)
	).then(results => {
		let module = {};
		let mod = results.instance;
		module.update = mod.exports.update;
		module.get_clipspace_transform = mod.exports.get_clipspace_transform;
		module.handle_scroll = mod.exports.handle_scroll;
	
}


function main() {
	const canvas = document.querySelector("#gl_canvas");

	// Initialize the GL context
	const gl = canvas.getContext("webgl");

    // Only continue if WebGL is available and working
	if (gl === null) {
    	alert("Unable to initialize WebGL. Your browser or machine may not support it.");
    	return;
    }

	// We want the canvas to be resized whenever the window is resized
	var windowResizeCallback = makeWindowResizeCallback(canvas);
	windowResizeCallback();
	addEventCallback(window, "resize", windowResizeCallback);

	// Setup up our mouse handler
	var mouse = mouseHandler.from_canvas(canvas);

	// We need to keep track of time
	// So that we know how long each frame lasts
	var last_frame_time = new Date();
	var fps = 20.0;
	// All times are in millis, hence 1000
	var frame_duration_cap = (1.0 / fps) * 1000.0;

	frame_duration_cap = 2000;

	// We also are gonna use these variables when computing time related things
	// But I don't want to keep accumulating them for the GC
	var current_time;
	var frame_duration;
	var wait_duration

	var draw_and_update = function() {

		//Set clear color to black, fully opaque
		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		// Clear the color buffer with specified clear color
		gl.clear(gl.COLOR_BUFFER_BIT);

		current_time = new Date()
		frame_duration = current_time - last_frame_time;
		last_frame_time = current_time;

		requestAnimationFrame(draw_and_update);
	}

	draw_and_update();
}


