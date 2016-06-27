
(function(window, $) {

    var pages = ['app/view/channel.html'];
    var control = uPREP.createControl(uPREP.SERVICE.CHANNEL, pages);

    control.buttonToggle = true;

    control.channelData = null;
    //control.selectedChannelMethod = null;
    //control.selectedJSONFormat = null;
    control.selectedChannelData = null;
    control.channelTable = null;

    control.WEBSOCKET_PORT = 9010;
    control.JSON_SPACE = 3;
    control.webSocket = null;

    control.requestMethod = null;
    control.isCreate = null;

    control.TYPE = {
        "CREATE" : 0,
        "MODIFY" : 1
    };

    /*control.ACTION = {
        "CREATE_CHANNEL": "CreateChannel",
        "MODIFY_CHANNEL":"ModifyChannel",
        "REMOVE_CHANNEL":"RemoveChannel",
        "CUSTOM_CHANNEL":"customChannel",
        "SELECTED_MODIFY_CHANNEL" :"SelectedModifyChannel"
    };*/

    /*control.ACTION_URL = {
        "CREATE_CHANNEL": "/ixs",
        "MODIFY_CHANNEL":"/ixs/ChannelID",
        "SELECT_MODIFY_CHANNEL" : "/ixs/"
    };*/

    control.bind = function() {
        $( window ).resize(function() {
            control.closePopupWindow();
        });
        //control.selectedChannelMethod = uPREP.METHOD.GET;

        /*control.getChannelMethodRadioGroup().change(function(event){
            //control.selectedChannelMethod = event.target.value;
        });*/

        control.getChannelActionApplyButton().click(function(){
            control.sendRestfulMessage();
        });
        /*control.getChannelJsonFormatSelect().change(function(event){
            control.selectedJSONFormat = event.target.value;

            if(control.selectedJSONFormat == "NONE"){
                return;
            }else if(control.selectedJSONFormat == control.ACTION.CUSTOM_CHANNEL){
                control.getChannelMethodContainer().show();
                control.getChannelRequestTextArea().val("");
                control.getChannelUrlTextBox().val("");
            }else if(control.selectedJSONFormat == control.ACTION.SELECTED_MODIFY_CHANNEL && control.selectedChannelData != null){
                control.getChannelMethodContainer().hide();
                control.getChannelUrlTextBox().val(control.ACTION_URL.SELECT_MODIFY_CHANNEL + control.selectedChannelData.CHANNEL_ID);
                control.requestChannelActionJsonFormatter(control.selectedJSONFormat, control.selectedChannelData.CHANNEL_ID);
            }else{
                if(control.selectedJSONFormat ==  control.ACTION.CREATE_CHANNEL){
                    control.getChannelUrlTextBox().val(control.ACTION_URL.CREATE_CHANNEL);
                }else if(control.selectedJSONFormat ==  control.ACTION.MODIFY_CHANNEL){
                    control.getChannelUrlTextBox().val(control.ACTION_URL.MODIFY_CHANNEL);
                }
                control.getChannelMethodContainer().hide();
                control.requestChannelActionJsonFormatter(control.selectedJSONFormat);
            }
            control.getChannelActionApplyButton().prop("disabled",false);
        });*/
        /*control.getCreateChannelButton().click(function(){

        });
        control.getModifyChannelButton().click(function(){

        });*/

        control.getCreateChannelButton().popover({
            trigger: 'manual',
            template: '<div class="popover" style="max-width: 445px;width:445px;z-index:10" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
            ,content : function(){
                return control.getChannelInfoContentForm().html();
            }
        }).click(function(e){
            e.stopPropagation();
            control.getModifyChannelButton().popover('hide');

            $(this).popover('toggle');
            $('.content-type-h').hide();
            $('.content-type-s').show();

            control.setPopUpWindowChannelInfo(control.TYPE.CREATE);
        });

        control.getModifyChannelButton().popover({
            trigger: 'manual'
            ,template: '<div class="popover" style="max-width: 445px;width:445px;z-index:10" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
            ,content : function(){
                return control.getChannelInfoContentForm().html();
            }
        }).click(function(e){
            e.stopPropagation();
            control.getCreateChannelButton().popover('hide');

            $(this).popover('toggle');
            $('.content-type-h').show();
            $('.content-type-s').hide();

            control.setPopUpWindowChannelInfo(control.TYPE.MODIFY);
        });

        control.getChannelRemoveAllButton().click(function(){
            swal({
                title : "Are you sure?",
                text : "Are you sure you want to delete All Channels?",
                type : "warning",
                showCancelButton : true,
                confirmButtonColor : "#DD6B55",
                confirmButtonText : "Yes, delete it!",
                closeOnConfirm : true
            },
            function () {
                control.removeAllChannel();
            });
        });

        control.getRefreshButton().click(function(){
            control.requestChannelList();
            control.clearChannelInformationPanel();
        });

        control.initializedChannel();
    };

    control.event = function(event) {
        if(event.action=='beforeShow'){
            if(control.channelTable != null) {
                control.requestChannelList();
                control.clearChannelInformationPanel();
            }
        }
        if(event.action=='afterShow'){
            if(control.channelTable == null){
                //control.requestChannelList();
            }
        }
    };

    control.initializedChannel = function(){
        control.getWebSocketPort();
        control.requestChannelList();
    };

    /* control define */
    /*control.getChannelMethodRadioGroup = function(){
        return $('[name="channelMethod"]');
    };*/
    control.getChannelListGrid = function() {
        return $( "#channelGrid" );
    };
    control.getChannelActionApplyButton = function() {
        return $( "#channelActionApplyButton" );
    };
    control.getCreateChannelButton = function() {
        return $( "#createChannelButton" );
    };
    control.getModifyChannelButton = function() {
        return $( "#modifyChannelButton" );
    };
    control.getChannelRequestTextArea = function() {
        return $( "#channelRequestTextArea" );
    };
    control.getChannelInfoContentForm = function() {
        return $('#channelInfoContentFormHtml');
    };
    /*control.getChannelJsonFormatSelect = function() {
        return $( "#channelJsonFormatSelect" );
    };*/
    /*control.getChannelMethodContainer = function() {
        return $( "#channelMethodContainer" );
    };*/
    control.getChannelUrlTextBox = function() {
        return $( "#channelUrlText" );
    };
    control.getChannelRemoveAllButton = function() {
        return $( "#channelRemoveAllButton" );
    };
    control.getChannelResponseTextArea = function() {
        return $( "#channelResponseTextArea" );
    };
    /*control.getChannelJsonFormatSelectedOption = function() {
        return $( "#channelJsonFormatSelectedOption" );
    };*/
    control.getLastUpdateTime = function() {
        return $( "#lastUpdateTime" );
    };
    control.getRefreshMessage = function() {
        return $( "#refreshMessage" );
    };
    control.getRefreshButton = function() {
        return $( "#refreshButton" );
    };

    /* WebSocket */
    control.createWebSocket = function(port, path){
        control.webSocket = uPREP.createWebSocket(port, path, function(result) {
            control.setRefreshMessageVisible(true);
        },function(result){
            control.requestChannelList();
        });
    };

    /* Ajax Request */
    control.getWebSocketPort = function(){
        var jsonData = {};
        jsonData.UPREP = "uPREP";

        uPREP.sendAjax('/WebSocketPort', 'POST', jsonData, function(result){
            var port = control.WEBSOCKET_PORT;

            if(result.WEBSOCKET != null) {
                port = result.WEBSOCKET;
            }

            control.createWebSocket(port, "IXS");
        },function(err){
            console.log(err);
        });
    };
    control.getChannelInfo = function(){
        var jsonData = {};
        jsonData.UPREP = "uPREP";
        jsonData.CHANNEL_ID = control.selectedChannelData.CHANNEL_ID;

        uPREP.sendAjax('/GetChannel', 'POST', jsonData, function(result){
            var json = result;

            if(json != null){
                if(json["version"] != null){
                    $("#chInfoVersion").val(json["version"]);
                }
                if(json["title"] != null){
                    $("#chInfoTitle").val(json["title"]);
                }
                if(json["closed"] != null){
                    $("#chInfoClosed").val(json["closed"]);
                }
                if(json["content-size"] != null){
                    $("#chInfoContentSize").val(json["content-size"]);
                }
                if(json["piece-num"] != null){
                    $("#chInfoPieceNumber").val(json["piece-num"]);
                }
            }
        },function(err){
            console.log(err);
        });
    };
    /*control.getChannelInformation = function(channelId){
        var jsonData = {};
        jsonData.UPREP = "uPREP";
        jsonData.CHANNEL_ID = channelId;

        uPREP.sendAjax('/GetChannel', 'POST', jsonData, function(result){
            var msg = result;

            try{
                msg = JSON.stringify(result, null, control.JSON_SPACE);
            }catch(err){
            }
            control.getChannelRequestTextArea().val(msg);
        },function(err){
            console.log(err);
        });
    };*/
    control.requestChannelList = function(typeFlag){
        var jsonData = {};
        jsonData.UPREP = "uPREP";

        uPREP.sendAjax('/GetChannelList', 'POST', jsonData, function(result){
            control.createChannelListDataTable(result, typeFlag, function(){

            });
        },function(err){
            console.log(err);
        });
    };
    control.requestRemoveChannel = function(channelId){
        var jsonData = {};
        jsonData.UPREP = "uPREP";

        uPREP.sendAjax('/ixs/'+channelId, 'DELETE', jsonData, function(result){
            control.requestChannelList();
        },function(err){
            if(err.status == 200){
                control.requestChannelList();
            }else{
                console.log(err);
            }
        });
    };
    control.removeAllChannel = function(){
        var jsonData = {};
        jsonData.UPREP = "uPREP";

        uPREP.sendAjax('/RemoveAllChannel', 'POST', jsonData, function(result){
            control.requestChannelList();
        },function(err){
            if(err.status == 200){
                control.requestChannelList();
            }else{
                console.log(err);
            }
        });
    };
    control.requestChannelActionJsonFormatter = function(type, channelId){
        var jsonData = {
            "type" : type
        };
        if(channelId != null){
            jsonData.CHANNEL_ID = channelId;
        }

        uPREP.sendAjax('/JsonFormatter', 'POST', jsonData, function(result){
            var msg = result;

            try{
                msg = JSON.stringify(result, null, control.JSON_SPACE);
            }catch(err){
                control.getChannelResponseTextArea().val("Failed to create JSON Object");
                return;
            }

            control.getChannelRequestTextArea().val(msg);
        },function(err){
            control.getChannelRequestTextArea().val("Request Error");
            console.log(err);
        });
    };
    control.sendRestfulMessage = function(){
        var json = {};
        var jsonStr = control.getChannelRequestTextArea().val().trim();
        var url = control.getChannelUrlTextBox().val().trim();
        var method = control.requestMethod;
        /*var method = null;
        if(control.selectedJSONFormat ==  control.ACTION.CUSTOM_CHANNEL){
            method = control.getChannelMethodRadioGroup().val();
        }else if(control.selectedJSONFormat ==  control.ACTION.CREATE_CHANNEL){
            method = uPREP.METHOD.POST;
        }else if(control.selectedJSONFormat ==  control.ACTION.MODIFY_CHANNEL || control.selectedJSONFormat ==  control.ACTION.SELECTED_MODIFY_CHANNEL){
            method = uPREP.METHOD.PUT;
        }*/

        try{
            if(jsonStr.length > 0){
                json = $.parseJSON(jsonStr);
            }
        }catch(err){
            control.getChannelResponseTextArea().val("Failed to create JSON Object");
            return;
        }

        uPREP.sendAjax(url, method, json, function(result){
            var msg = result;

            try{
                msg = JSON.stringify(result, null, control.JSON_SPACE);
            }catch(err){
            }
            control.getChannelResponseTextArea().val(msg);
        },function(err){
            if(err.status == 200){
                control.getChannelResponseTextArea().val("Response 200 OK");
            }else{
                control.getChannelResponseTextArea().val("Request Error :" + err.status);
            }
        });
    };

    /* Control Action */
    control.setPopUpWindowChannelInfo =  function(type){
        control.isCreate = (type == control.TYPE.CREATE);

        if(type == control.TYPE.CREATE){
           $("#chInfoVersion").val("");
           $("#chInfoTitle").val("");
           $("#chInfoOwnerId").val("");
           $("#chInfoOverlayNetworkId").val("");
           $("#chInfoOmsAddress").val("");
           $("#chInfoAuthKey").val("");
           $("#chInfoPieceSize").val("");
           $("#chInfoContentSize").val("");
           $("#chInfoPieceNumber").val("");

           $("#chInfoClosed").val("no");
           $("#chInfoContentType").val("stream");

       }else if(type == control.TYPE.MODIFY){
           control.getChannelInfo();
       }

    };

    control.closePopupWindow = function(){
        control.getCreateChannelButton().popover('hide');
        control.getModifyChannelButton().popover('hide');
    };

    control.setRefreshMessageVisible = function(type){
        if(type != null && type == true){
            control.getRefreshMessage().show();
        }
        else{
            control.getRefreshMessage().hide();
        }
    };

    control.setCurrentTime = function(){
        var data = new Date();
        var current_time = data.toTimeString().split(" ")[0];
        control.getLastUpdateTime().text(current_time);
    };

    control.clearChannelInformationPanel = function(){
        control.requestMethod = null;
        //control.selectedJSONFormat = null;
        //control.getChannelMethodContainer().hide();
        control.getChannelRequestTextArea().val("");
        control.getChannelResponseTextArea().val("");
        control.getChannelUrlTextBox().val("");
        //control.getChannelJsonFormatSelect().val("NONE");
        control.getChannelActionApplyButton().prop("disabled",true);
    };

    control.loadDataTable = function(callback){

        control.channelTable = $('#channelDataTable').on('search.dt', control.OnChange).on('page.dt', control.OnChange).DataTable(
            {
                "lengthMenu": [[5, 10, 20, -1], [5, 10, 20, "All"]],
                "order": [[ 4, "desc" ]],
                "columnDefs": [ { "targets": 5, "orderable": false ,"searchable": false} ]
            }
        );

        if(callback != null){
            callback();
        }
    };
    control.createChannelListDataTable = function(data, typeFlag, callback){
        control.channelData = data;
        control.selectedChannelData = null;
        control.getModifyChannelButton().prop("disabled", true);
        //control.getChannelJsonFormatSelectedOption().prop("disabled", true);
        var html ="";

        control.setCurrentTime();
        control.setRefreshMessageVisible(false);

        if(control.channelTable != null){
            $('#channelDataTable').DataTable().destroy();
            control.channelTable = null;
        }

        for(var index = 0; index < control.channelData.length; index++){
            var trTag = "";

            var title = control.channelData[index].TITLE != null ? control.channelData[index].TITLE: "";
            var channel_id = control.channelData[index].CHANNEL_ID !=null ? control.channelData[index].CHANNEL_ID : "";
            var overlay_network_id = control.channelData[index].OVERLAY_NETWORK_ID != null ? control.channelData[index].OVERLAY_NETWORK_ID: "";
            var owner_id = control.channelData[index].OWNER_ID != null ? control.channelData[index].OWNER_ID: "";
            var created_at =  control.channelData[index].CREATED_AT != null ? control.channelData[index].CREATED_AT: "";

            trTag += "<tr>";
            trTag += "<td class='dataTableCell' style='none'>"+ title +"</td>";
            trTag += "<td class='dataTableCell' style='none' name='CHANNEL_ID'>"+ channel_id +"</td>";
            trTag += "<td class='dataTableCell' style='none'>"+ overlay_network_id +"</td>";
            trTag += "<td class='dataTableCell' style='none'>"+ owner_id +"</td>";
            trTag += "<td class='dataTableCell' style='none'>"+ created_at +"</td>";
            trTag += "<td class='dataTableCell' style='none'><button type='button'class='btn btn-danger' value='"+ channel_id +"'>Delete</button></td>";
            trTag += "</tr>";

            html += trTag;
            //html += trTag.replace(/none/gi, isSelectedRow ? "background-color:#BDF3F3" : "");
        }

        control.getChannelListGrid().html(html);
        control.loadDataTable();

        control.bindingDataTableSelectEvent();
        control.bindDataTableDeleteButtonEvent();

        if(callback != null){
            callback();
        }
    };

    /* Event */
    control.OnChange = function(a,b,c){
        //control.setAutoRefreshStatus(control.channelTable==null || control.channelTable.page() == 0 && control.channelTable.search() == "");
    };

    control.convertJsonString = function(){
        var jsonResult = {};

        var version = $("#chInfoVersion").val().trim();
        var title = $("#chInfoTitle").val().trim();
        var ownerId = $("#chInfoOwnerId").val().trim();
        var overlayNetworkId = $("#chInfoOverlayNetworkId").val().trim();
        var omsAddress = $("#chInfoOmsAddress").val().trim();
        var closed = $("#chInfoClosed").val().trim();
        var authKey = $("#chInfoAuthKey").val().trim();
        var pieceSize = $("#chInfoPieceSize").val().trim();
        var contentType = $("#chInfoContentType").val().trim();
        var contentSize = $("#chInfoContentSize").val().trim();
        var pieceNumberStr = $("#chInfoPieceNumber").val().trim();
        var pieceNumber;

        try{
            pieceNumber = Number(pieceNumberStr);
            version = Number(version);
        }catch(err){
            swal("","Failed to create JSON Object","info");
            return;
        }

        if(control.isCreate){
            control.requestMethod = "POST";

            var auth = {
                "closed" : closed
                ,"auth-key" : authKey
            };
            if(closed != "auth"){
                delete auth["auth-key"];
            }

            jsonResult = {
                "title" : title
                ,"owner-id" : ownerId
                ,"overlay-network-id" : overlayNetworkId
                ,"oms-address" : omsAddress
                ,"auth" : auth
                ,"piece-size" : pieceSize
                ,"content-type" : contentType
                ,"content-size" : contentSize
                ,"piece-num" : pieceNumber
            };

            if(contentSize.length < 1){
                delete jsonResult["content-size"];
            }
            if(pieceNumberStr.length < 1){
                delete jsonResult["piece-num"];
            }

        }else{
            control.requestMethod = "PUT";

            jsonResult = {
                "version" : version
                ,"title" : title
                ,"closed" : closed
                ,"content-size" : contentSize
                ,"piece-num" : pieceNumber
            };

            if(contentSize.length < 1){
                delete jsonResult["content-size"];
            }
            if(pieceNumberStr.length < 1){
                delete jsonResult["piece-num"];
            }
        }

        try{
            msg = JSON.stringify(jsonResult, null, control.JSON_SPACE);
        }catch(err){
            swal("","Failed to create JSON Object","info");
            control.getChannelActionApplyButton().prop("disabled", true);
            return;
        }

        control.getChannelRequestTextArea().val(msg);
        control.closePopupWindow();

        if(control.isCreate){
            control.getChannelUrlTextBox().val("/ixs");
        } else{
            control.getChannelUrlTextBox().val("/ixs/" + control.selectedChannelData.CHANNEL_ID);
        }

        control.getChannelActionApplyButton().prop("disabled",false);
    };

    control.bindDataTableDeleteButtonEvent = function(){
        $("#channelGrid").find(".btn-danger").click(function(event){
            var channelId  = event.target.value;
            control.requestRemoveChannel(channelId);
        });
    };

    control.bindingDataTableSelectEvent = function(){
        control.getChannelListGrid().undelegate("td","click");
        control.getChannelListGrid().delegate("td","click",function(){
            var col = $(this)[0];
            var currentRow = $(this).closest('tr');

            if(col != null) {
                var row = col.parentNode;

                if(row != null) {
                    var rowData = $.grep(control.channelData,function(e){return e.CHANNEL_ID == row.cells["CHANNEL_ID"].textContent});
                    var data = null;

                    if(rowData.length > 0 && rowData[0] != null){
                        data = rowData[0];
                    }

                    if(data != null) {
                        control.selectedChannelData = data;
                        //control.getChannelJsonFormatSelectedOption().prop("disabled", false);
                        control.getModifyChannelButton().prop("disabled", false);
                        control.getChannelListGrid().find("td").css({"background-color":""});
                        currentRow.find("td").css({"background-color":"#BDF3F3"});

                        if(col.cellIndex == 1) {
                            /*if(col.textContent != null){
                                control.clearChannelInformationPanel();
                                control.getChannelInformation(col.textContent);
                            }*/
                        } else if(col.cellIndex == 2){
                            if(data.OMS_ADDRESS != null && data.OMS_ADDRESS.length > 0){
                                var url = data.OMS_ADDRESS;
                                if(url.indexOf("http://") < 0){
                                    url = "http://" + url;
                                }
                                url = url.replace("/oms","");

                                window.open(url,"_blank");
                            }
                        } /*else if(control.selectedJSONFormat == control.ACTION.SELECTED_MODIFY_CHANNEL){
                            control.getChannelUrlTextBox().val(control.ACTION_URL.SELECT_MODIFY_CHANNEL + control.selectedChannelData.CHANNEL_ID);
                            control.requestChannelActionJsonFormatter(control.ACTION.SELECTED_MODIFY_CHANNEL, control.selectedChannelData.CHANNEL_ID);
                        }*/
                    }
                }
            }
        });
    };

})(window, jQuery);