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
    var _id = 0;

    function Node(parent, childrenArray) {
        this.children = {};
        this.setParent(parent);
        if (childrenArray) {
            for (var i = this.children.length; i--;) {
                childrenArray[i].addTo(this);
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
            var res = appendTo ? appendTo.concat(children) : Array.prototype.slice.call(children);
            for (var i in children) {
                if (children.hasOwnProperty(i)) {
                    res = res.concat(this.children[i].getAllChildrenRecursive());
                }
            }
            return res;
        },
        /**
         *
         * @param Node node
         * @return Boolean
         */
        haveChild:function (node) {
            /* @todo work on performance */
            return Array.prototype.slice.call(this.children).indexOf(node) !== -1;
        },

        /**
         *
         * @param Node parent
         * @return Node this
         */
        setParent:function (parent) {
            this.detach();
            if (parent) {
                parent.children[_id] = this;
                _id++;
            }
            this.parent = parent;
            return this;
        },
        /**
         * Remove item from parents children list and set parent to null.
         * If have no parent, do nothing.
         * @return Node this
         */
        detach:function () {
            if (this.parent) {
                var index = null;
                for (var i in this.parent.children) {
                    if (this.parent.children[i] === this) {
                        delete this.parent.children[i];
                        return this;
                    }
                }
                //throw new Error('Can\'t detach element, it\'s absent in children list.');
            }
            return this;
        },
        destroy:function () {
            return this.destroyChildren().detach();
        },
        destroyChildren:function () {
            for (var i in this.children) {
                if (this.children.hasOwnProperty(i)) {
                    this.children[i].destroy();
                }
            }
            return this;
        }
    };

    return Node;
});
