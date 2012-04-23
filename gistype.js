var Gistype = (function($) {
		var gt = {};
		gt.typed = function(selector, callback) {
			var input = $(selector);
			input.keydown(function(e) {
				if (e.metaKey || e.altKey || e.ctrlKey) return;
				var keycode = KeyCode.translate_event(e);
				if ( keycode.char ) {
					input.trigger('typed.gistype', [keycode.char]);
					callback && callback(keycode.char);
				}
				e.preventDefault();
			});
		};
		
		
		gt.gist = function(id, callback) {
			var url = 'https://api.github.com/gists/' + parseInt(id) + "?callback=?";
			$.getJSON(url, callback);
		};

		gt.Display = function(selector) {
			this.$el = $(selector);
			this.el  = this.$el[0];
			this.cursor = null;
		};
		
		gt.Display.prototype = {
			setText: function(text) {
				this.$el.text(text);
				this.unmatched = this.el.firstChild;
				this.moveCursor();
			},

			match: function(key) {
				// console.log('key: ' + key + ' cursor: ' + this.cursor.text())
				if ( this.cursor && key !== this.cursor.text() ) {
					this.cursor.addClass('error');
				}
				this.moveCursor();
			},
			
			moveCursor: function() {
				this.cursor && this.cursor.removeClass('cursor');				
				if ( this.unmatched && this.unmatched.data && this.unmatched.data.length > 0 ) {
						var parent = this.el,
							rest = this.unmatched.splitText(1),
                            head = rest.previousSibling,
							headClone = head.cloneNode(true),
							cursor = document.createElement('span');
						cursor.className = 'cursor';
						cursor.appendChild(headClone);
						parent.replaceChild(cursor, head);
						this.unmatched = rest;
						this.cursor = $(cursor);
					return true;
				} else {
					return false;
				}
			}
		};	

		return gt;
}(jQuery));