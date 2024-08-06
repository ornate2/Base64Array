sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
    "use strict";

    return Controller.extend("base64.controller.base64", {
        onInit: function () {
            // Initialize the JSON model for image data
            this.getView().setModel(new JSONModel({ images: [] }));
        },

        onFileChange: function (oEvent) {
            // Handle file selection
            const aFiles = oEvent.getParameter("files");
            if (aFiles.length > 0) {
                const oFile = aFiles[0];
                const reader = new FileReader();
                reader.onload = function (e) {
                    const sDataUrl = e.target.result;
                    const oModel = this.getView().getModel();
                    const aImages = oModel.getProperty("/images");
                    aImages.push({
                        name: oFile.name,
                        data: sDataUrl
                    });
                    oModel.setProperty("/images", aImages);
                }.bind(this);
                reader.readAsDataURL(oFile);
            }
        },

        onUpload: function () {
            const oModel = this.getView().getModel();
            const aImages = oModel.getProperty("/images");
            
            // Convert images to binary form and send to server
            const aBinaryImages = aImages.map(image => {
                return {
                    name: image.name,
                    binaryData: this._dataURLToBinary(image.data)
                };
            });

            // You can perform the actual upload logic here, e.g., send to server.
            console.log(aBinaryImages);
        },

        _dataURLToBinary: function (dataURL) {
            const base64String = dataURL.split(',')[1];
            return atob(base64String);
        }
    });
});
