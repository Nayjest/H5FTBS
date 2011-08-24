EditableTextLayer = (function() {

	var defaults = {
		tag: 'div',
		size: [150,30],
		css: {
			border:'1px solid green'
		},
		attr: {
			contentEditable: true
		}
	}

	var Me = function(config) {
		var self = this;
		mergeUndefined(config, defaults);
		Me.superClass.call(this, config);
		this.hasOwnProperty('tool') || (this.tool = new TextTool(this));
		this.setText('Common! Enter text here');
		this.$el.bind('blur', function() {
			self.setText($(this).html());
		});

	}.inheritsFrom(DOMLayer).extendProto({
			/**
			 *
			 * @param String text
			 */
			setText: function(text) {
				this.text = text;
				this.$el.html(text);
			}


		});
	return Me;

})();
