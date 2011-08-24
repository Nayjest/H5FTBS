function Node(parent, children) {	
	this.children = [];	
	if (parent) {
		this.setParent(parent);
	} else {
		this.parent = null;
	}	
	if (children) {
		for (var i in children) {
			children.addTo(this);
		}
	} 
	
}
Node.prototype = {
	isNode:true,
	addChild:function(node) {
		node.setParent(this);
		return this;
	},
	haveChild:function(node) {
		for (var i in this.children) {
			if (this.children[i] == node) {
				return true;
			}
		}
		return false;
	},
	setParent:function(parent){
		this.detach();
		if (parent) {
			parent.children.push(this);
		}
		this.parent = parent;
		return this;
	},	
	detach:function() {
		if (this.parent) {
			var children = this.parent.children; 
			for (var i in children) {
				if (children[i] === this) {
					delete children[i];
					return this;
				}
			}
		}
		return this;

	},
	destroy:function() {
		return this.destroyChildren().detach();
	},
	destroyChildren:function() {
		for (var i in this.children) {
			this.children[i].destroy();
		}
	   return this;
	}
};

