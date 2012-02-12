define(['jquery', 'Class'], function($){
    
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
        owner.on(this.showOn, eventHandlers.show);
        owner.on(this.hideOn, eventHandlers.hide);
        if (owner.$el) owner.$el.get(0).highlight = this;
    }

    Highlight.prototype = {
        show:function() {		
            if (this.owner.$el) this.owner.$el.addClass(this.cssClass);
        },
        hide:function() {
            if (this.owner.$el) this.owner.$el.removeClass(this.cssClass);
        }

    };
    
    return Highlight;

});