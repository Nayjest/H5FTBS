CroppingTool = (function() {


	var defaults = {
		//Toolbar html
		content:'' +
			' <div class="tabs">' +
			' <ul>' +
			'	 <li><a href="#tabs-1">Scale</a></li>' +
			'	 <li><a href="#tabs-2">Rotate</a></li>' +
			'	 <li><a href="#tabs-3">?</a></li>' +
			' </ul>' +
			'<div id="tabs-1">' +
			'   <div class="scaleValue">Scale: 100%</div>' +
			'   <div class="scale"></div>' +
			'</div>' +
			'<div id="tabs-2">' +
			'   <div class="rotateValue">Rotation: 0 deg</div>' +
			'   <div class="rotate"></div>' +
			'</div>' +
			'<div id="tabs-3">' +
			'   <button class="btnRemovePhoto">Remove photo</button>' +
			'</div>' +
			'</div>',
		//This function executes when scaled image in pixels larger than image natural size
		onScaleToMuch: function(owner) {
			console.log('To much scale! Upload bigger photo or scale out this photo.');
		}
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
		$tool.tabs({selected:0});

		$tool.find('.btnRemovePhoto').click(function() {
			owner.removePhoto();
		});
		$tool.find('.scale').slider({value:100,
			min: 100,
			max: 1000,
			value:100,
			slide: function(event, ui) {
				$(this).parent().find('.scaleValue').html('Scale: ' + ui.value + '%');
				var scale = ui.value / 100;
				owner.imgLayer.size = [owner.size[0] * scale, owner.size[1] * scale];
				owner.align.call(owner.imgLayer);
				owner.imgLayer.update();
				owner.toMuchScale() && self.onScaleToMuch(owner);
			}});

		$tool.find('.rotate').slider({value:0,
			min: -180,
			max: 180,
			value:0,
			slide: function(event, ui) {
				$(this).parent().find('.rotateValue').html('Rotation: ' + ui.value + ' deg');
				var angle = (ui.value + 360);
				owner.imgLayer.angle = angle;
				owner.align.call(owner.imgLayer);
				owner.imgLayer.update();
			}});


	}.inheritsFrom(Tool);

	return Me;

})();