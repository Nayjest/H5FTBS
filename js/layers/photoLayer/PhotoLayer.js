function PhotoLayer(config) {
	var self = this;
	if (!config.css) {
		config.css = {};
	}
	mergeUndefined(config.css, {
		overflow:'hidden',
		border:'1px dashed yellow'
	});

	PhotoLayer.superClass.call(this, config);

	mergeUndefined(this, {
		//Если true, то при перетаскивании новой фотки в PhotoLayer, к ней будут прменены результаты кадрирования предыдущей
		preserveCropping:true
	});

	this.hasOwnProperty('highlight') || (this.highlight = new Highlight(this));
	this.hasOwnProperty('tool') || (this.tool = new CroppingTool(this, {}));

	var droppableClass = Modernizr.draganddrop ? Droppable : JqDroppable;
	this.droppable = new droppableClass(this,
		{
			initDraggableWhen:[PhotoManagerWidget.getInstance(),'displayFile'],
			onDrop:function($img) {
				
				$img = $img.filter('img');
				
				//to control max zoom in future
				self.naturalImageSize = [$img.get(0).naturalWidth,$img.get(0).naturalHeight];

				var imgLayer = new DOMLayer({
					parent: self,
					css: {
						backgroundImage:'url(' + $img.attr('src') + ')',
						backgroundSize:'cover',
						'-webkit-background-size':'cover',
						backgroundPosition:'center'
					},
					size: self.size
				});
				//imgLayer.$el.get(0).getContext('2d').drawImage($img.get(0));
				if (self.imgLayer instanceof DOMLayer) {
					if (this.preserveCropping) {
						imgLayer.update({
							offset:self.imgLayer.offset,
							size:self.imgLayer.size,
							angle:self.imgLayer.angle
						});
					}
					self.imgLayer.destroy();
				}
				self.addChild(self.imgLayer = imgLayer);
				var dragEnd = function(event, ui) {
					imgLayer.offset = [
						imgLayer.offset[0] + (ui.position.left - ui.originalPosition.left) / imgLayer.getZoom(),
						imgLayer.offset[1] + (ui.position.top - ui.originalPosition.top) / imgLayer.getZoom()
					];
					imgLayer.align();
					imgLayer.update();
				}
				imgLayer.$el.draggable(
					{
						//containment:'parent',
						cursor: 'crosshair',
						stop:dragEnd
					}
				);
				return false;

			}
		});
}
PhotoLayer.inheritsFrom(DOMLayer).extendProto({

	removePhoto:function() {
		this.imgLayer.destroy();
		this.imgLayer = null;
	},
	havePhoto:function() {
		return this.imgLayer instanceof DOMLayer;
	},
	_calcPhotoLayerSize:function() {
		var imgProp = this.naturalWidth / this.naturalHeight;
		var layerProp = this.size[0] / this.size[1];
		if (imgProp > layerProp) {
			return [
				this.size[0],//layerProp*imgProp,
				this.size[1]
			];
		} else {
			return [
				this.size[0],
				this.size[1]//layerProp*imgProp
			];
		}
	},

	/**
	 * @return true if we have to much scale according to image natural size
	 */
	toMuchScale:function() {
		return (this.naturalImageSize[0] < this.imgLayer.size[0]) || (this.naturalImageSize[1] < this.imgLayer.size[1]);
	}
});

