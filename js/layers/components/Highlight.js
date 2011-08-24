(function(){
var eventHandlers = {
	show: function() {this.highlight.show()},
	hide:function(){this.highlight.hide()}
};
/**
* Behavior attached only to instances of DOMLayer
*/
Highlight = function (owner,config) {
	if (config) merge(this,config);
	this.owner = owner;
	mergeUndefined(this,{
		cssClass:'highlighted',
		showOn:'mouseover',
		hideOn:'mouseleave'
	});
	var bindings = {} 
	bindings[this.showOn] = eventHandlers.show;
	bindings[this.hideOn] = eventHandlers.hide;
	owner.$el.bind(bindings).get(0).highlight = this;

	
}

Highlight.prototype = {
	show:function() {		
		this.owner.$el.addClass(this.cssClass);
	},
	hide:function() {
		this.owner.$el.removeClass(this.cssClass);
	}

};

})();