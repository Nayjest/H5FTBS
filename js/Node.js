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
define(['Class'], function () {
    "use strict";
    function Node(parent, children) {
        this.children = [];
        this.setParent(parent);
        if (children) {
            for (var i = this.children.length; i--;) {
                children[i].addTo(this);
            }
        }
    }

    Node.prototype = {
        /**
         * If you use Node as behavior (it's not parent class of your class,
         * you just called Node() inside constructor & merge yor prototype with Node.prototype),
         * you may check that object implements node Interface using obj.isNode
         */
        isNode:true,
        addChild:function (node) {
            node.setParent(this);
            return this;
        },
        /**
         * Get plain array of all levels node children
         * @param Array[Node] appendTo
         * @return Array[Node]
         */
        getAllChildrenRecursive:function (appendTo) {
            var children = this.children;
            var res = appendTo ? children.concat(appendTo) : children.slice(0);
            for (var i = this.children.length; i--;) {
                res = res.concat(this.children[i].getAllChildrenRecursive());
            }
            return res;
        },
        /**
         *
         * @param Node node
         * @return Boolean
         */
        haveChild:function (node) {
            return this.children.indexOf(node) !== -1;
        },

        /**
         *
         * @param Node parent
         * @return Node this
         */
        setParent:function (parent) {
            this.detach();
            if (parent) {
                parent.children.push(this);
            }
            this.parent = parent;
            return this;
        },
        /**
         * Remove item from parents children list and set parent to null
         * @return Node this
         */
        detach:function () {
            //@todo WTF??? All failed when it start work correctly :(
            return this;
            if (this.parent) {
                var i = this.parent.children.indexOf(this);
                if (i === -1) {
                    throw new Error('Can\'t detach element, it\'s absent in children list.');
                } else {
                    delete this.parent.children[i];
                }
            }
            return this;

        },
        destroy:function () {
            return this.destroyChildren().detach();
        },
        destroyChildren:function () {
            for (var i = this.children.length; i--;) {
                this.children[i].destroy();
            }
            return this;
        }
    };

    return Node;
});
