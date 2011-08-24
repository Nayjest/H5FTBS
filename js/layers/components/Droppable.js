//HTML5 Droppable
(function(){
	var defaults =  {
		onDrop:function($srcEl,e) {
			console.log('object dropped:');
			console.log(e.originalEvent.dataTransfer.getData(e.originalEvent.dataTransfer.types[0]));
			return false;
		},
		hoverClass: "ui-state-active"
	};

	var eventHandlers = {
		dragenter: function() {
			$(this).addClass(this.droppable.hoverClass);
			return false;
		},
		dragover: function() {
			return false;
		},
		/* //dont works (tested in chrome)
		dragend: function() {
		$(this).removeClass('highlighted');
		return false;
		},
		*/
		dragleave: function() {
			$(this).removeClass(this.droppable.hoverClass);
			return false;
		},
		drop: function(e) {
			e.preventDefault();
			$(this).removeClass(this.droppable.hoverClass);
			return this.droppable
						   .onDrop( $(e.originalEvent.dataTransfer
										.getData('text/html')), e);
		}
	}
	/**
	* @param DOMLayer owner
	* @param Object config
	*/
	Droppable = function(owner, config) {
		var self = this;

		if (config) merge(this,config);
		this.owner = owner;
		mergeUndefined(this, defaults);
		owner.$el.bind(eventHandlers).get(0).droppable = this;
	}
   

})();