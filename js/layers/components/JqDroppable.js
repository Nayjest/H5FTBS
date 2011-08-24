(function() {
	//JQuery droppable
	// for Opera

	var defaults = {
		activeClass: 'ui-state-hover',
		hoverClass: 'ui-state-active',
		//must be configured
		onDrop:function($srcElement, event, ui) {
		},
		draggableItemsSelector:'.draggable',
		initDraggableWhen:null
	};


	JqDroppable = function (owner, config) {
		if (config) merge(this, config);
		this.owner = owner;
		mergeUndefined(this, defaults);

		var self = this;
		this.makeDecorator();
		this.drop = function (event, ui) {
					$(this).addClass("ui-state-highlight");
					var $srcElement = $(event.srcElement);
					//$srcElement.draggable('disable');
					return self.onDrop($srcElement, event, ui);

				}
		this.owner.$el.droppable(this);
		this.initDraggable();
	}
	JqDroppable.prototype = {


		initDraggable: function() {
			var $items = (arguments.length > 0) ? arguments[0] : $(this.draggableItemsSelector);
			$items.draggable({
				revert:true,
				start:function(event, ui) {
				}
			});
		},

		makeDecorator:function() {
			var self = this;
			if (!this.initDraggableWhen == null) return;
			var obj = this.initDraggableWhen[0];
			var methodName = this.initDraggableWhen[1];
			var srcMethod = obj[methodName];
			obj[methodName] = function () {
				var res = srcMethod.apply(obj, arguments);
				self.initDraggable();
				return res;
			}
		},

	};

})();