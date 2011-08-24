TextTool = (function() {


	var defaults = {
		//Toolbar html
		content:'<div>' +
			'<button class="btnClearText">clear text</button>' +
			'</div>'
	   // toggleOn:null,
		//showOn:'focus',
	   // hideOn:'blur'
	}

	/**
	 * @param PhotoLayer owner
	 *
	 **/
	var Me = function (owner, config) {
		var self = this;
		mergeUndefined(this, defaults);
		Me.superClass.call(this, owner, config);
		var $tool = this.$tool;
		$tool.find('.btnClearText').click(function() {
			owner.setText('');
		});
	}.inheritsFrom(Tool);

	return Me;

})();