var UI = UI || {};

UI.devices = (() => {

    let init = () => {
        fetch("/devices/data", {
            method: "GET",
        })
            .then((r) => r.json())
            .then((d) => {
                initJSONView(d, "#onServer");
            });
    };

    let uploadFile = (file) => {
        let formData = new FormData();
        formData.append("file", file);
        fetch("/devices", {
            method: "POST",
            body: formData,
        }).then(r => r.json()).then((j) => {
            initJSONView(j, "#onServer");
            initJSONView({}, "#toUpload");
            alert("The file has been uploaded successfully.");
        });
    };

    let displayJSON = (file) => {
        file.text().then((text) => {
            initJSONView(JSON.parse(text), "#toUpload");
        });
    };

    let initJSONView = (data, element) => {
        let e = document.querySelector(element)
        let jsonViewer = e.jsonViewer ? e.jsonViewer : new JSONViewer();
        e.appendChild(jsonViewer.getContainer());
        e.jsonViewer = jsonViewer;
        jsonViewer.showJSON(data, null, 2);

    };
    return {
        init: init,
        uploadFile: uploadFile,
        displayJSON: displayJSON

    };
})();
