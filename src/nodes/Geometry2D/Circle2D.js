/*
 * X3DOM JavaScript Library
 * http://www.x3dom.org
 *
 * (C)2009 Fraunhofer IGD, Darmstadt, Germany
 * Dual licensed under the MIT and GPL
 *
 * Based on code originally provided by
 * Philip Taylor: http://philip.html5.org
 */

/* ### Circle2D ### */
x3dom.registerNodeType(
    "Circle2D",
    "Geometry2D",
    defineClass(x3dom.nodeTypes.X3DPlanarGeometryNode,
        function (ctx) {
            x3dom.nodeTypes.Circle2D.superClass.call(this, ctx);

            this.addField_SFFloat(ctx, 'radius', 1);
            this.addField_SFFloat(ctx, 'subdivision', 32);

            this._mesh._primType = 'LINES';

            var r = this._vf.radius;

            var geoCacheID = 'Circle2D_' + r;

            if (this._vf.useGeoCache && x3dom.geoCache[geoCacheID] !== undefined) {
                //x3dom.debug.logInfo("Using Circle2D from Cache");
                this._mesh = x3dom.geoCache[geoCacheID];
            } else {

                var anzahl = this._vf.subdivision;

                for (var i = 0; i <= anzahl; i++) {
                    var theta = i * ((2 * Math.PI) / anzahl);

                    var x = Math.cos(theta) * r;
                    var y = Math.sin(theta) * r;

                    this._mesh._positions[0].push(x);
                    this._mesh._positions[0].push(y);
                    this._mesh._positions[0].push(0.0);
                }


                for (i = 0; i < anzahl; i++) {
                    this._mesh._indices[0].push(i);
                    if ((i + 1) == anzahl) {
                        this._mesh._indices[0].push(0);
                    } else {
                        this._mesh._indices[0].push(i + 1);
                    }
                }

                this._mesh._invalidate = true;
                this._mesh._numFaces = this._mesh._indices[0].length / 2;
                this._mesh._numCoords = this._mesh._positions[0].length / 3;

                x3dom.geoCache[geoCacheID] = this._mesh;
            }
        },
        {
            fieldChanged: function (fieldName) {
                if (fieldName == "radius" || fieldName == "subdivision") {
                    var r = this._vf.radius;
                    var anzahl = this._vf.subdivision;

                    this._mesh._positions[0] = [];
                    this._mesh._indices[0] = [];

                    for (var i = 0; i <= anzahl; i++) {
                        var theta = i * ((2 * Math.PI) / anzahl);

                        var x = Math.cos(theta) * r;
                        var y = Math.sin(theta) * r;

                        this._mesh._positions[0].push(x);
                        this._mesh._positions[0].push(y);
                        this._mesh._positions[0].push(0.0);
                    }

                    for (i = 0; i < anzahl; i++) {
                        this._mesh._indices[0].push(i);
                        if ((i + 1) == anzahl) {
                            this._mesh._indices[0].push(0);
                        } else {
                            this._mesh._indices[0].push(i + 1);
                        }
                    }

                    this.invalidateVolume();
                    this._mesh._numFaces = this._mesh._indices[0].length / 2;
                    this._mesh._numCoords = this._mesh._positions[0].length / 3;

                    Array.forEach(this._parentNodes, function (node) {
                        node._dirty.positions = true;
                        node._dirty.indexes = true;
                        node.invalidateVolume();
                    });
                }
            }
        }
    )
);