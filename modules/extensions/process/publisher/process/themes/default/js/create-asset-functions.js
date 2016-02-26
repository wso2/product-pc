var processNames = [];
var processListObj;

window.onload = getProcessList;

function showTextEditor(element) {
    if ($("#pName").val() == "" || $("#pVersion").val() == "" || $("#pOwner").val() == "") {
        alertify.error('please fill the required fields.');
    } else {
        saveProcess(element);
        completeTextDetails();
        $("#processTextDiv").show();
        $("#overviewDiv").hide();
        $("#bpmnView").hide();
        $("#docView").hide();
        $("#pdfUploader").hide();

        tinymce.init({
            selector: "#processContent"
        });
    }
}

function associateBPMN(element) {
    if ($("#pName").val() == "" || $("#pVersion").val() == "" || $("#pOwner").val() == "") {
        alertify.error('please fill the required fields.');
    } else {
        $('#create-view-header').text($('#pName').val());
        saveProcess(element);
        completeBPMNDetails();
        $("#overviewDiv").hide();
        $("#processTextView").hide();
        $("#docView").hide();
        $("#bpmnView").show();
        $("#pdfUploader").hide();

    }
}

function associateFlowChart(element) {
    if ($("#pName").val() == "" || $("#pVersion").val() == "" || $("#pOwner").val() == "") {
        alertify.error('please fill the required fields.');
    } else {
        $('#flow-chart-view-header').text($('#pName').val());
        $("#overviewDiv").hide();
        $("#flowChartView").show();
        $("#pdfUploader").hide();
        $("#docView").hide();
        $("#bpmnView").hide();
        $("#processTextView").hide();
    }
}

function associateDocument(element) {
    if ($("#pName").val() == "" || $("#pVersion").val() == "" || $("#pOwner").val() == "") {
        alertify.error('please fill the required fields.');
    } else {
        //$('#create-view-header').text($('#pName').val());
        saveProcess(element);
        //completeBPMNDetails();
        $("#overviewDiv").hide();
        $("#processTextView").hide();
        $("#bpmnView").hide();
        $("#docView").show();
    }
}

function newDocFormToggle() {
    $("#addNewDoc").toggle("slow");
}

function showMain() {
    $("#mainView").show();
    $("#bpmnView").hide();
    $("#processTextView").hide();
    $("#pdfUploader").hide();

}

function saveProcess(currentElement) {
    if ($("#pName").val() == "" || $("#pVersion").val() == "" || $("#pOwner").val() == "") {
        alertify.error('please fill the required fields.');
    } else {
        // save the process

        $.ajax({
            url: 'apis/create_process',
            type: 'POST',
            data: {'processInfo': getProcessInfo()},
            success: function (response) {
                $("#processTextOverviewLink").attr("href", "../../assets/process/details/" + response);
                $("#bpmnOverviewLink").attr("href", "../../assets/process/details/" + response);
                $("#pdfOverviewLink").attr("href", "../../assets/process/details/" + response);


                if ($(currentElement).attr('id') == 'saveProcessBtn') {
                    window.location = "../../assets/process/details/" + response;
                }
            },
            error: function () {
                alertify.error('Process saving error');
            }
        });

    }
}

function getProcessInfo() {
    var processDetails = {
        'processName': $("#pName").val(),
        'processVersion': $("#pVersion").val(),
        'processOwner': $("#pOwner").val(),
        'processTags': $("#pTags").val(),
        'subprocess': readSubprocessTable(),
        'successor': readSuccessorTable(),
        'predecessor': readPredecessorTable()
    };
    return (JSON.stringify(processDetails));
}

function saveProcessText(currentElement) {
    var textContent = tinyMCE.get('processContent').getContent();
    if (textContent == "") {
        if ($(currentElement).attr('id') == 'processTxtSaveBtn') {
            alertify.error('Process content is empty.');
        }
    } else {
        // save the process

        $.ajax({
            url: 'apis/save_process_text',
            type: 'POST',
            data: {
                'processName': $("#pName").val(),
                'processVersion': $("#pVersion").val(),
                'processText': textContent
            },
            success: function (response) {
                if ($(currentElement).attr('id') == 'processTxtSaveBtn') {
                    alertify.success("Successfully saved the process content.");
                }
            },
            error: function () {
                alertify.error('Process text saving error');
            }
        });
    }
}

function completeBPMNDetails() {
    $("#bpmnProcessName").val($("#pName").val());
    $("#bpmnProcessVersion").val($("#pVersion").val());
    return true;
}

function completeTextDetails() {
    $("#textProcessName").val($("#pName").val());
    $("#textProcessVersion").val($("#pVersion").val());
    return true;
}

function subProcessNamesAutoComplete() {
    $(".subprocess_Name").autocomplete({
        source: processNames
    });
}

function successorNameAutoComplete() {
    $(".successor_Name").autocomplete({
        source: processNames
    });
}

function predecessorNameAutoComplete() {
    $(".predecessor_Name").autocomplete({
        source: processNames
    });
}

function readSubprocessTable() {
    var subprocessInfo = [];
    $('#table_subprocess tbody tr').each(function () {
        if ($(this).find('td:eq(0) input').val() == '') {
            //continue
        } else {
            var subprocessPath, subprocessId;
            for (var i = 0; i < processListObj.length; i++) {
                if (processListObj[i].processname == $(this).find('td:eq(0) input').val().split("-")[0] &&
                    processListObj[i].processversion == $(this).find('td:eq(0) input').val().split("-")[1]) {
                    subprocessPath = processListObj[i].path;
                    subprocessId = processListObj[i].processid;
                    break;
                }
            }

            subprocessInfo.push({
                name: $(this).find('td:eq(0) input').val().split("-")[0],
                path: subprocessPath,
                id: subprocessId
            });
        }
    });
    return subprocessInfo;
}

function readSuccessorTable() {
    var successorInfo = [];
    $('#table_successor tbody tr').each(function () {
        if ($(this).find('td:eq(0) input').val() == '') {
            //continue
        } else {
            var successorPath, successorId;
            for (var i = 0; i < processListObj.length; i++) {
                if (processListObj[i].processname == $(this).find('td:eq(0) input').val().split("-")[0] &&
                    processListObj[i].processversion == $(this).find('td:eq(0) input').val().split("-")[1]) {
                    successorPath = processListObj[i].path;
                    successorId = processListObj[i].processid;
                    break;
                }
            }

            successorInfo.push({
                name: $(this).find('td:eq(0) input').val().split("-")[0],
                path: successorPath,
                id: successorId
            });
        }
    });
    return successorInfo;
}

function readPredecessorTable() {
    var predecessorInfo = [];
    $('#table_predecessor tbody tr').each(function () {
        if ($(this).find('td:eq(0) input').val() == '') {
            //continue
        } else {
            var predecessorPath, predecessorId;
            for (var i = 0; i < processListObj.length; i++) {
                if (processListObj[i].processname == $(this).find('td:eq(0) input').val().split("-")[0] &&
                    processListObj[i].processversion == $(this).find('td:eq(0) input').val().split("-")[1]) {
                    predecessorPath = processListObj[i].path;
                    predecessorId = processListObj[i].processid;
                    break;
                }
            }

            predecessorInfo.push({
                name: $(this).find('td:eq(0) input').val().split("-")[0],
                path: predecessorPath,
                id: predecessorId
            });
        }
    });
    return predecessorInfo;
}

function getProcessList() {
    $.ajax({
        url: '/publisher/assets/process/apis/get_process_list',
        type: 'GET',
        success: function (response) {
            processListObj = JSON.parse(response);
            for (var i = 0; i < processListObj.length; i++) {
                processNames.push(processListObj[i].processname + "-" + processListObj[i].processversion);
            }
        },
        error: function () {
            alertify.error('Process List error');
        }
    });
}

function isInputFieldEmpty(tableName) {
    var isFieldEmpty = false;
    $('#table_' + tableName + ' tbody tr').each(function () {
        if ($(this).find('td:eq(0) input').val() == '') {
            isFieldEmpty = true;
        }
    });
    return isFieldEmpty;
}

function addUnboundedRow(element) {
    var tableName = $(element).attr('data-name');
    var table = $('#table_' + tableName);

    if (!isInputFieldEmpty(tableName)) {
        var referenceRow = $('#table_reference_' + tableName);
        var newRow = referenceRow.clone().removeAttr('id');
        $('input[type="text"]', newRow).val('');
        table.show().append(newRow);
    } else {
        alertify.error('Please fill the empty ' + tableName + ' field.');
    }
}

function validateDocs() {
    $("#docProcessName").val($("#pName").val());
    $("#docProcessVersion").val($("#pVersion").val());
    if (document.getElementById('docName').value.length == 0) {
        alert('Please enter doc name.');
        return false;
    } else if ((!document.getElementById('optionsRadios7').checked) && (!document.getElementById('optionsRadios8').checked)) {
        alert('Please select a source.');
        return false;
    } else if (document.getElementById('optionsRadios7').checked) {
        if (document.getElementById('docUrl').value.length == 0) {
            alert('Please give the doc url.');
            return false;
        }
    } else if (document.getElementById('optionsRadios8').checked) {
        var ext = $('#docLocation').val().split('.').pop().toLowerCase();
        if ($.inArray(ext, ['docx', 'doc']) == -1) {
            alert('invalid extension!');
            return false;
        }
        $("#docExtension").val(ext);
    }
    return true;
}

function associatePdf(element) {
    if ($("#pName").val() == "" || $("#pVersion").val() == "" || $("#pOwner").val() == "") {
        alertify.error('please fill the required fields.');
    } else {
        $('#pdf-create-view-header').text($('#pName').val());
        $("#ProcessName").attr("value", $("#pName").val());
        $("#ProcessVersion").attr("value", $("#pVersion").val());
        saveProcess(element);
        $("#overviewDiv").hide();
        $("#processTextView").hide();
        $("#bpmnView").hide();
        $("#docView").hide();
        $("#pdfUploader").show();
    }
}