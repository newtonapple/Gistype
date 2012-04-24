var Gistype = (function($) {
        var gt = {};
        gt.typed = function(selector, callback) {
            var input = $(selector);
            input.keydown(function(e) {
                if (e.metaKey || e.ctrlKey) return;
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
            this.$el        = $(selector);
            this.el         = this.$el[0];
            this.reset();
        };
        
        gt.Display.prototype = {
            setText: function(text) {
                if (text) {
                    this.text = $.map(text.replace("\t", "  ").split("\n"), function(line, i) {  // replace tabs with 2 spaces
                        return line.replace(/\s+$/, ''); // strip trailing spaces.
                    }).join('\n').replace(/\s+$/, '');  // strip trailing spaces
                }
                this.reset();
            },

            match: function(key) {
                if ( !this.done ) {
                    if ( !this.firstMatchAt )
                        this.firstMatchAt = new Date();
                    if ( this.cursor && key !== this.cursor.text() ) {
                        this.errorsCount++;
                        this.cursor.addClass('error');
                    }
                    this.moveCursor();
                    this.charsCount++;
                }
            },

            reset: function() {
                this.charsCount  = 0;
                this.errorsCount = 0;
                this.firstMatchAt   = null;
                this.cursor      = null;
                this.done        = true;
                if ( this.text ) {
                    this.$el.text(this.text);
                    this.done = false;
                    this.unmatched = this.el.firstChild;
                    this.moveCursor();
                }
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
                } else {
                    this.done = true;
                }
            },

            errorRate: function() {
                if ( this.charsCount === 0) return 0;
                return this.errorsCount / this.charsCount;
            },

            wpm: function() {
                return this.cpm() / 5;
            },

            cpm: function() {
                if ( !this.firstMatchAt ) return 0;
                var delta = (new Date() - this.firstMatchAt) / 60000;
                return this.charsCount / delta;     
            }

        };

        return gt;
}(jQuery));