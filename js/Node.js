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
    "use strict";
    function Node(parent, children) {	
        this.children = [];
        this.setParent(parent);
        if (children) {
            for (var i = this.children.length;i--;) {
                children[i].addTo(this);
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
            for (var i = this.children.length;i--;) {
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
                for (var i = this.children.length;i--;) {
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
            for (var i = this.children.length;i--;) {
                this.children[i].destroy();
            }
            return this;
        }
    };
    
    return Node;
});
