/**
*  module
*/
define(['jquery', 'Class'], function($) {

	var defaults = {
		content:'<div>this is tool contents</div>',
		hideOther:true,
		toggleOn:'click',
		showOn:null,
		hideOn:null,
        css:{
            width:100,
            height:100,
            border:'4px solid yellow',
            position:'absolute',
            zIndex:9999
        }
        

	};

	/**
	* Behavior attached only to instances of DOMLayer
	*
	*/
	Tool = function (owner, config) {
		this.owner = owner;
		if (config) merge(this,config);		
		mergeUndefined(this,defaults);

		var self = this;
		this.$tool = $(this.content).css(this.css).appendTo('body');
        
		this.toggleOn && owner.$el.bind(this.toggleOn, function(e) {self.toggle();});
		this.showOn && owner.$el.bind(this.showOn, function(e) {self.show();});
		this.hideOn && owner.$el.bind(this.hideOn, function(e) {self.hide();});
		//global list of tools
		Tool.instances.push(this);

	}

	Tool.prototype = {
		show:function() {
			if (this.hideOther) {
				Tool.hideAll();
			}
			this.$tool.show('slow');
		},
		hide:function() {
			this.$tool.hide('slow');
		},
		toggle:function() {
		    this.$tool.toggle();
		}

	};
    
	merge(Tool, {
		/**
        * Hides all tools
        */
        hideAll:function() {
			for (var i in Tool.instances) {
				Tool.instances[i].hide();
			}
		},
		/**
        * array of tool instances
        */
        instances:[]
	});	
    
    return Tool;
});