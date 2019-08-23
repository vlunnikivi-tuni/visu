/*
* Copyright 2018-2019 Tampere University
* 
* Main authors: Anna-Liisa Mattila, Henri Terho, Antti Luoto, Hugo Fooy
* 
* Permission is hereby granted, free of charge, to any person obtaining a copy of
* this software and associated documentation files (the "Software"), to deal in 
* the Software without restriction, including without limitation the rights to 
* use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
* the Software, and to permit persons to whom the Software is furnished to do so, 
* subject to the following conditions:
* 
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
* 
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS 
* FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR 
* COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
* IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN 
* CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

//Timeline visualization component for visualizing the usage-data from Kactus2 logs, through a timeline of all user-session. 
/*PARAMETERS:
    className : name of the class of the component's div
    id : id of the component's div
    parent : parent component of the component's div
    hidden : whether the component should be hidden at first 
*/
var SESSION_TEMPLATE = function (mpar) {

    //The main container parameters
    var _mainParameters = mpar || {};

    var _mclassName = _mainParameters.className !== undefined ? _mainParameters.className : "container";
    var _containerId = _mainParameters.id !== undefined ? _mainParameters.id : "container";
    var _containerParent = _mainParameters.parent !== undefined ? _mainParameters.parent : document.body;
    var _hidden = _mainParameters.hidden !== undefined ? _mainParameters.hidden : true;

    var _container = document.createElement("div");
    _container.className = _mclassName;
    _container.id = _containerId;
    if (_hidden) {
        _container.style.display = "none";
    } else {
        _container.style.display = "block";
    }

    //Canvas for text width calculus
    var _canvas = document.createElement('canvas');
    _canvas.style.display = "none";
    var _context = _canvas.getContext('2d');

    //Private variables for HTML & SVG elements
    var _legend = false;
    var _text = false;
    var _search = false;
    var _input = false;
    var _input2 = false;
    var _button = false;
    var _brushDIV = false;
    var _brushSVG = false;
    var _chartDIV = false;
    var _chartSVG = false;


    //----------------------------------
    //    CREATE HTML & SVG ELEMENTS
    //----------------------------------
    //creates div elemet for ledgend
    var createLegendContainer = function (par) {
        if (!_legend) {
            var p = par || {};

            var className = p.className !== undefined ? p.className : "legend";
            var id = p.id !== undefined ? p.id : "legendContainer";
            var parent = p.parent !== undefined ? p.parent : _container;

            _legend = document.createElement("div");
            _legend.className = className;
            _legend.id = id;
            parent.appendChild(_legend);
        } else {
            console.log("Container for legend already exists!");
        }
        return _legend;
    };

    //creates contrainer div and svg element for brush component
    //returns SVG element with d3 binding
    var createBrushSVG = function (par) {
        if (!_brushSVG) {
            var p = par || {};

            var className = p.className !== undefined ? p.className : "brush";
            var id = p.id !== undefined ? p.id : "brushContainer";
            var id = p.id !== undefined ? p.id : "brushContainer";
            var svgId = p.svgId !== undefined ? p.svgId : "brush";
            var parent = p.parent !== undefined ? p.parent : _container;

            //time selector container
            _brushDIV = document.createElement("div");
            _brushDIV.className = className;
            _brushDIV.id = id;
            parent.appendChild(_brushDIV);

            //time selector svg element
            var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.className = className;
            svg.id = svgId;
            _brushDIV.appendChild(svg);
            _brushSVG = d3.select(svg);
        } else {
            console.log("Time selector's SVG element already exists");
        }

        return _brushSVG;
    };

    //creates contrainer div and svg element for chart component
    //returns SVG element with d3 binding
    var createChartSVG = function (par) {
        if (!_chartSVG) {
            var p = par || {};

            var className = p.className !== undefined ? p.className : "chart";
            var id = p.id !== undefined ? p.id : "chartContainer";
            var svgId = p.svgId !== undefined ? p.svgId : "chart";
            var parent = p.parent !== undefined ? p.parent : _container;

            //timeline containers
            _chartDIV = document.createElement("div");
            _chartDIV.className = className;
            _chartDIV.id = id;
            parent.appendChild(_chartDIV);

            //timeline svg element
            var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.className = className;
            svg.id = svgId;
            _chartDIV.appendChild(svg);
            _chartSVG = d3.select(svg);
        } else {
            console.log("Chart's SVG element already exists");
        }

        return _chartSVG;
    };


    //creates the userID and event type search form element
    //returns the div element
    var createTextSearchForm = function (par) {
        if (!_search) {
            var p = par || {};

            var className = p.className !== undefined ? p.className : "search";
            var id = p.id !== undefined ? p.id : "searchContainer";
            var buttonId = p.buttonId !== undefined ? p.buttonId : "searchButton";
            var textFieldId = p.textFieldId !== undefined ? p.textFieldId : "searchBox";
            var textFieldId2 = p.textFieldId2 !== undefined ? p.textFieldId2 : "searchBox2";
            var parent = p.parent !== undefined ? p.parent : _container;
            var labelFieldId = p.labelFieldId !== undefined ? p.labelFieldId : "text";

            _search = document.createElement("div");
            _search.className = className;
            _search.id = id;

            _text = document.createTextNode("Filter data: ");
            _text.id = labelFieldId;
            _search.appendChild(_text);

            _input = document.createElement("input");
            _input.type = "text";
            _input.placeholder = "userID";
            _input.id = textFieldId;
            _search.appendChild(_input);

            _input2 = document.createElement("input");
            _input2.type = "text";
            _input2.placeholder = "event type";
            _input2.id = textFieldId2;
            _search.appendChild(_input2);

            _button = document.createElement("button");
            _button.id = buttonId;
            var text = document.createTextNode("search");
            _button.appendChild(text);
            _search.appendChild(_button);

            parent.appendChild(_search);
        } else {
            console.log("Text search form already exists");
        }
        return _search;
    };

    //---------------------------------------
    //    PUBLIC METHODS
    //---------------------------------------
    var pub = {}; //Public methods are used in InitChart by custom_timeline_main.js

    //---------------------------------------
    //    GETTERS FOR SVG & HTML ELEMENTS
    //---------------------------------------
    pub.getSearchContainer = function () {
        return _search;
    };
    pub.getSearchTextField = function () {
        return {
            userid: _input,
            type: _input2
        };
    };
    pub.getSearchButton = function () {
        return _button;
    };
    pub.getLegendContainer = function () {
        return _legend;
    };
    pub.getBrushContainer = function () {
        return _brushDIV;
    };
    pub.getBrushSVG = function () {
        return _brushSVG;
    };
    pub.getChartContainer = function () {
        return _chartDIV;
    };
    pub.getChartSVG = function () {
        return _chartSVG;
    };
    pub.getContainer = function () {
        return _container;
    };

    //-------------------------------
    //    VISIBILITY MANIPULATORS
    //-------------------------------
    pub.hide = function () {
        if (!_hidden) {
            _container.style.display = "none";
            _hidden = true;
        }
    };
    pub.show = function () {
        if (_hidden) {
            _container.style.display = "block";
            _hidden = false;
        }
    };

    //--------------------------
    //    CREATION OF LAYOUT
    //-------------------------- 

    //creates the HTML and SVG elements for the layout and appends those into the document
    //if hierarchy parameter is not defined the layout will be created using default parameters
    //and the order of the elements in the document is the default (from top: legend, brush, chart)
    //Parameters : 
    //  hierarchy (optional), Array of Objects containing: {parameters : {}, type: STRING}
    //      "parameters" contains the parameters for the created chart elements (id, svgid, className, parent).
    //      "type" is the type of the element to be created (note that one element type can be created only once).
    //          type options are "legend", "brush" and "chart" if the type does not match any
    //          of these the dafault type is "chart".
    //      The order of the array defines the order where the elements are added to their parents
    //          (will affect the layout if the elements have the same parent).
    pub.createLayout = function (hierarchy) {
        if (hierarchy === undefined) {
            createTextSearchForm();
            createLegendContainer();
            createBrushSVG();
            createChartSVG();
        } else {

            for (var i = 0; i < hierarchy.length; ++i) {
                var el = hierarchy[i];
                if (el.type == "search") {
                    createTextSearchForm(el.parameters);
                } else if (el.type === "legend") {
                    createLegendContainer(el.parameters);
                } else if (el.type === "brush") {
                    createBrushSVG(el.parameters);
                } else {
                    createChartSVG(el.parameters);
                }
            }
        }

        _containerParent.appendChild(_container);
        return {
            container: _container,
            search: _search,
            legendContainer: _legend,
            brushContainer: _brushDIV,
            chartContainer: _chartDIV,
            brushSVG: _brushSVG,
            chartSVG: _chartSVG
        };
    };

    //Appends a label to legend element
    //parameters:
    //bgcolor : background color for the label text, the default is legend background color.
    //color : color for the label text, the default is legend color.
    //text : the label text
    pub.appendLabel = function (par) {
        var p = par || {};
        var bgcolor = p.bgcolor !== undefined ? p.bgcolor : _legend.style.backgroundColor;
        var color = p.color !== undefined ? p.color : _legend.style.color;
        var text = p.text !== undefined ? p.text : false;

        if (!_legend) {
            console.log("Layout has to be created first!");
            return false;
        }
        var span = document.createElement("span");
        span.style.backgroundColor = bgcolor;
        span.style.color = color;
        if (text !== false) {
            span.innerHTML = text;
            span.id = text.replace(/\s+/g, '');
        }
        _legend.appendChild(span);
    };

    pub.getSVGTextWidth = function (text) {
        var style = window.getComputedStyle(_chartDIV);
        _context.font = style.font;
        var len = _context.measureText(text).width;
        return len;
    };

    pub.getSVGTextHeight = function (text) {
        var style = window.getComputedStyle(_chartDIV);
        _context.font = style.font;
        return _context.measureText(text).height;
    };

    return pub;
};