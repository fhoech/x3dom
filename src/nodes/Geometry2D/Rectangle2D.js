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

/* ### Rectangle2D ### */
x3dom.registerNodeType(
    "Rectangle2D",
    "Geometry2D",
    defineClass(x3dom.nodeTypes.X3DPlanarGeometryNode,
        function (ctx) {
            x3dom.nodeTypes.Rectangle2D.superClass.call(this, ctx);

            this.addField_SFVec2f(ctx, 'size', 2, 2);
            this.addField_SFVec2f(ctx, 'subdivision', 1, 1);

            var sx = this._vf.size.x, sy = this._vf.size.y;
            var partx = this._vf.subdivision.x, party = this._vf.subdivision.y;

            var geoCacheID = 'Rectangle2D_' + sx + '-' + sy;

            if (this._vf.useGeoCache && x3dom.geoCache[geoCacheID] !== undefined) {
                //x3dom.debug.logInfo("Using Rectangle2D from Cache");
                this._mesh = x3dom.geoCache[geoCacheID];
            }
            else {
                var xstep = sx / partx;
                var ystep = sy / party;

                sx /= 2;
                sy /= 2;

                for (var i = 0; i <= partx; i++) {
                    for (var j = 0; j <= party; j++) {
                        this._mesh._positions[0].push(i * xstep - sx, j * ystep - sy, 0);
                        this._mesh._normals[0].push(0, 0, 1);
                        this._mesh._texCoords[0].push(i / partx, j / party);
                    }
                }

                for (var i = 1; i <= party; i++) {
                    for (var j = 0; j < partx; j++) {
                        this._mesh._indices[0].push((i - 1) * (partx + 1) + j + 1);
                        this._mesh._indices[0].push((i - 1) * (partx + 1) + j);
                        this._mesh._indices[0].push(i * (partx + 1) + j);

                        this._mesh._indices[0].push((i - 1) * (partx + 1) + j + 1);
                        this._mesh._indices[0].push(i * (partx + 1) + j);
                        this._mesh._indices[0].push(i * (partx + 1) + j + 1);
                    }
                }

                this._mesh._invalidate = true;
                this._mesh._numFaces = this._mesh._indices[0].length / 3;
                this._mesh._numCoords = this._mesh._positions[0].length / 3;

                x3dom.geoCache[geoCacheID] = this._mesh;
            }
        },
        {
            fieldChanged: function (fieldName) {
                if (fieldName == "size") {
                    this._mesh._positions[0] = [];
                    var size = this._vf.size;
                    var sx = size.x / 2;
                    var sy = size.y / 2;

                    var partx = this._vf.subdivision.x, party = this._vf.subdivision.y;

                    var xstep = sx / partx;
                    var ystep = sy / party;

                    sx /= 2;
                    sy /= 2;

                    for (var i = 0; i <= partx; i++) {
                        for (var j = 0; j <= party; j++) {
                            this._mesh._positions[0].push(i * xstep - sx, j * ystep - sy, 0);
                        }
                    }

                    this.invalidateVolume();
                    this._mesh._numCoords = this._mesh._positions[0].length / 3;

                    Array.forEach(this._parentNodes, function (node) {
                        node.setAllDirty();
                    });

                } else if (fieldName == "subdivision") {
                    this._mesh._positions[0] = [];
                    this._mesh._indices[0] = [];
                    this._mesh._normals[0] = [];
                    this._mesh._texCoords[0] = [];

                    var sx = this._vf.size.x / 2;
                    var sy = this._vf.size.y / 2;

                    var partx = this._vf.subdivision.x, party = this._vf.subdivision.y;
                    var xstep = sx / partx;
                    var ystep = sy / party;

                    sx /= 2;
                    sy /= 2;

                    for (var i = 0; i <= partx; i++) {
                        for (var j = 0; j <= party; j++) {
                            this._mesh._positions[0].push(i * xstep - sx, j * ystep - sy, 0);
                            this._mesh._normals[0].push(0, 0, 1);
                            this._mesh._texCoords[0].push(i / partx, j / party);
                        }
                    }

                    for (var i = 1; i <= party; i++) {
                        for (var j = 0; j < partx; j++) {
                            this._mesh._indices[0].push((i - 1) * (partx + 1) + j + 1);
                            this._mesh._indices[0].push((i - 1) * (partx + 1) + j);
                            this._mesh._indices[0].push(i * (partx + 1) + j);

                            this._mesh._indices[0].push((i - 1) * (partx + 1) + j + 1);
                            this._mesh._indices[0].push(i * (partx + 1) + j);
                            this._mesh._indices[0].push(i * (partx + 1) + j + 1);
                        }
                    }

                    this.invalidateVolume();
                    this._mesh._numFaces = this._mesh._indices[0].length / 3;
                    this._mesh._numCoords = this._mesh._positions[0].length / 3;

                    Array.forEach(this._parentNodes, function (node) {
                        node.setAllDirty();
                    });
                }
            }
        }
    )
);