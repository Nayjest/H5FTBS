/**
* Node module
* 
* === Usage ===
* 
* A. As mixin
* 
*    1) Call in YouClassConstructor
*       Node.call(this, myArgs.parent, myArgs.children);
* 
*    2) Make YouClassConstructor.extendProto(Node.prototype);
* 
* B. You may use YouClassConstructor.inheritsFrom(Node)
* 
*/
define(['Class'], function() {
    
    function Node(parent, children) {	
        this.children = [];
        this.setParent(parent);
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
                        this.parent = null;
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
    
    return Node;
});
