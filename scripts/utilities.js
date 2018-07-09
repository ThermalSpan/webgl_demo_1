// This is an async sleep
// https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

var addEventCallback = function(event_provider, type, callback) {
	// If we try this on a null event_provider, we should know about it	
	if (event_provider == null || typeof(event_provider) == 'undefined') {
		console.error("Attempted to attach event to null event_provider");
		console.trace();
		return
	}

	// For Browser compatability
	if (event_provider.addEventListener) {
		event_provider.addEventListener(type, callback, false);
	} else if (event_provider.attachEvent) {
		event_provider.attachEvent("on" + type, callback);
	} else {
		event_provider["on"+type] = callback;
	}
};

var mouseHandler = {
	from_canvas: function(canvas) {
		// Setup variables
		this.clientX = 0;
		this.clientY = 0;
		this.canvas = canvas;

		// Setup callbacks
		addEventCallback(canvas, "mousemove", this.makeMouseMoveCallback());

		return this;
	},

	// This gets fired whenever the mouse moves
	makeMouseMoveCallback: function() { 
		// We need to capture the mouse handler in the closure
		// There's probably a better way to do this
		var mouse_handler = this;

		return function() {
			mouse_handler.clientX = event.clientX;
			mouse_handler.clientY = event.clientY;	
		};
	},

	// Use this to access the mouse position
	getPos: function() {
		var bounding_rect = this.canvas.getBoundingClientRect();
		var r_x = this.clientX - bounding_rect.left;
		var r_y = this.clientY - bounding_rect.top;

		return {
			x: r_x,
			y: r_y
		}
	},
}


