/*
 *  Copyright (c) 2015, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 *  WSO2 Inc. licenses this file to you under the Apache License,
 *  Version 2.0 (the "License"); you may not use this file except
 *  in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing,
 *  software distributed under the License is distributed on an
 *  "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 *  KIND, either express or implied.w   See the License for the
 *  specific language governing permissions and limitations
 *  under the License.
 *
 */
jsPlumb.ready(function() {
    var elementCount = 0;
    var basicType = {
        connector: "StateMachine",
        paintStyle: { strokeStyle: "#216477", lineWidth: 4 },
        hoverPaintStyle: { strokeStyle: "blue" }
    };
    jsPlumb.registerConnectionType("basic", basicType);

    var connectorPaintStyle = {
        lineWidth: 4,
        strokeStyle: "#61B7CF",
        joinstyle: "round",
        outlineColor: "white",
        outlineWidth: 2
    },
// .. and this is the hover style.
    connectorHoverStyle = {
        lineWidth: 4,
        strokeStyle: "#216477",
        outlineWidth: 2,
        outlineColor: "white"
    },
    endpointHoverStyle = {
        fillStyle: "#216477",
        strokeStyle: "#216477"
    },
// the definition of source endpoints (the small blue ones)
    sourceEndpoint = {
        endpoint: "Dot",
        paintStyle: {
            strokeStyle: "#7AB02C",
            fillStyle: "transparent",
            radius: 7,
            lineWidth: 3
        },
        isSource: true,
        connector: [ "Flowchart", { stub: [40, 60], gap: 10, cornerRadius: 5, alwaysRespectStubs: true } ],
        connectorStyle: connectorPaintStyle,
        connectorHoverStyle: connectorHoverStyle,
        EndpointOverlays : [ ],
        maxConnections: -1,
        dragOptions: {},
        connectorOverlays: [
            [ "Arrow", {
                location: 1,
                visible:true,
                id:"ARROW",
                events:{
                    click:function() { alert("you clicked on the arrow overlay")}
                }
            } ],
            [ "Label", {
                location: 0.1,
                id: "label",
                cssClass: "aLabel"
            }]
        ]
    },
// the definition of target endpoints (will appear when the user drags a connection)
    targetEndpoint = {
        endpoint: "Dot",
        paintStyle: { fillStyle: "#7AB02C", radius: 11 },
        maxConnections: -1,
        dropOptions: { hoverClass: "hover", activeClass: "active" },
        isTarget: true
    };
	
    var init = function (connection, myLabel) {
    	connection.getOverlay("label").setLabel(myLabel);
    };

    jsPlumb.bind("connection", function (connInfo, originalEvent) {
    	var myLabel = prompt("Enter label text: ", "");
    	if(myLabel != null)
            init(connInfo.connection, myLabel);
    });

    jsPlumb.bind("dblclick", function (conn, originalEvent) {
        // if (confirm("Delete connection from " + conn.sourceId + " to " + conn.targetId + "?"))
    	jsPlumb.detach(conn);
    	//conn.toggleType("basic");
    });

    var ep;
    var endpointList = [];
    var sourcepointList = [];
    var _addEndpoints = function (toId, sourceAnchors, targetAnchors) {
        for (var i = 0; i < sourceAnchors.length; i++) {
            var sourceUUID = toId + sourceAnchors[i];
            ep = jsPlumb.addEndpoint("flowchart" + toId, sourceEndpoint, {
                anchor: sourceAnchors[i], uuid: sourceUUID
            });
            sourcepointList.push(["flowchart" + toId, ep]);
            ep = null;
        }
        for (var j = 0; j < targetAnchors.length; j++) {
            var targetUUID = toId + targetAnchors[j];
            ep = jsPlumb.addEndpoint("flowchart" + toId, targetEndpoint, {
                anchor: targetAnchors[j], uuid: targetUUID });
            endpointList.push(["flowchart" + toId, ep]);
            ep = null;
        }
    };

    var element = "";
    var clicked = false;
    var endpoints = [];
    var startpoints = [];
    var to_delete = "";
    $('#startEv').click(function(){
        elementCount++;
        var id = "flowchartWindow" + elementCount;
        element = "<div class=\"window start custom jtk-node jsplumb-connected\" id=\"" + id + "\">";
        element += "<strong><p>start<\/p><\/strong><\/div>";

        clicked = true;
        startpoints[0] = "BottomCenter";
        endpoints = [];
    });

    $('#myDiagram').click(function () {
        if(clicked){
            clicked = false;
            $('#canvas').append(element);
            element = "";
            var name = "Window" + elementCount;
            _addEndpoints(name, startpoints, endpoints);
            startpoints = []; endpoints = [];
            var elements = document.getElementById("flowchartWindow1");
            makeResizable('.custom.step');
            jsPlumb.draggable(jsPlumb.getSelector(".jtk-node"), { grid: [20, 20] });
            //$("#flowchartWindow1").css({'-webkit-transform' : 'rotate('+ 45 +'deg)',
            //    '-moz-transform' : 'rotate('+ 45 +'deg)',
            //    '-ms-transform' : 'rotate('+ 45 +'deg)',
            //    'transform' : 'rotate('+ 45 +'deg)'});
        }
    });

    function makeResizable(classname){
        $(classname).resizable({
            resize : function(event, ui) {
                jsPlumb.repaint(ui.helper);
            }
        });
    }

    $('#stepEv').click(function(){
        elementCount++;
        var id = "flowchartWindow" + elementCount;
        element = "<div class=\"window step custom jtk-node jsplumb-connected-step\" id=\""+ id +"\" style=\"top: 13em; left: 5em;\"><strong>" +
        "<p contenteditable='true' ondblclick='$(this).focus();'>step</p><\/strong><br\/><br\/><\/div>";
        clicked = true;
        startpoints = ["BottomCenter", "RightMiddle"];
        endpoints = ["TopCenter", "LeftMiddle"];
    });

    $('#descEv').click(function(){
        elementCount++;
        var id = "flowchartWindow" + elementCount;
        element = "<div class=\"window decision custom jtk-node jsplumb-connected-step\" id=\""+ id +"\" style=\"top: 23em; left: 5em;\">" +
        "<strong><p class=\"desc-text\" contenteditable=\"true\" ondblclick='$(this).focus();'>decision<\/p><\/strong><br\/><br\/><\/div>";
        clicked = true;
        startpoints = ["LeftMiddle", "RightMiddle", "BottomCenter"];
        endpoints = ["TopCenter"];
    });

    $('#endEv').click(function(){
        elementCount++;
        var id = "flowchartWindow" + elementCount;
        element = "<div class=\"window start jtk-node jsplumb-connected-end\" id=\""+ id +"\" style=\"top: 23em; left: 15em;\">" +
        "<strong><p>end<\/p><\/strong><br\/><br\/><\/div>";
        clicked = true;
        startpoints = [];
        endpoints = ["TopCenter"];
    });

    $(document).keypress(function(e){
        if(e.which == 127){
            if(to_delete != ""){
                jsPlumb.remove(to_delete);
                for(var i = 0; i< endpointList.length; i++){
                    if(endpointList[i][0] == to_delete){
                        for(var j = 0; j < endpointList[i].length; j++){
                            jsPlumb.deleteEndpoint(endpointList[i][j]);
                            endpointList[i][j] = null;
                        }
                    }
                }

                for(var i = 0; i < sourcepointList.length; i++){
                    if(sourcepointList[i][0] == to_delete){
                        for(var j = 0; j < sourcepointList[i].length; j++){
                            jsPlumb.deleteEndpoint(sourcepointList[i][j]);
                            sourcepointList[i][j] = null;
                        }
                    }
                }
                to_delete = "";
            }
        }
    });
    //
    //$('#canvas').on('keyup', '[id^="flowchartWindow"]', function(e){
    //    //alert($(this).width());
    //    //$('#mydiv').css({'width':$(this).text().length + 80});
    //    $(this).css({'width':$(this).width() + 30 + 'px'});
    //    jsPlumb.repaintEverything();
    //});

    $('#canvas').on('click', '[id^="flowchartWindow"]', function(){
        to_delete = $(this).attr("id");
        $('.step').not(this).css({'border-color':'#29e'});
        $('.diamond').not(this).css({'border-color':'#29e'});
        $('.start').not(this).css({'border-color':'green'});
        $('.window.jsplumb-connected-end').not(this).css({'border-color':'orangered'});
        $(this).css({'border-color':'red'});
    });

    jsPlumb.fire("jsPlumbDemoLoaded", jsPlumb);
});
