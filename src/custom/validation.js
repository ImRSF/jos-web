import { getServerDefaults } from "../custom/misc.js";

export class Validate {
    constructor(
        value = null,
        uploadedFiles = null
    ) {
        this.value = value;
        this.uploadedFiles = uploadedFiles;
        this.serverDefaults = getServerDefaults();
        this.result = {
            error: {
                errorMessage: null
            },
            success: {
                successMessage: null
            }
        };
    }

    get validationResult() {
        return this.result.error.errorMessage;
    }

    isRequired() {
        let errorMessage = this.result.error.errorMessage;
        if (errorMessage) {
            return this;
        } else {
            if (!this.value) {
                this.result.error.errorMessage = "This field is required";
            }
            return this;
        }
    }

    isContactNo() {
        let errorMessage = this.result.error.errorMessage;
        let contactNo = /^\d{11}$/;
        const value = this.value.trim()
        if (errorMessage) {
            return this;
        } else {
            if (!value) {
                return this;
            }
            if (!value.match(contactNo)) {
                this.result.error.errorMessage = `Please enter a valid phone number.`;
                return this;
            }
            return this;
        }

    }

    isMaxLengthOf(maxLength, fileUploader = null) {
        let errorMessage = this.result.error.errorMessage;
        let charLength;
        if (errorMessage) {
            return this;
        } else {
            if (this.value) {
                charLength = this.value.length;
                if (charLength > maxLength) {
                    this.result.error.errorMessage = `This field only accepts a maximum of ${maxLength} characters`;
                }
            }
            if (this.uploadedFiles) {
                charLength = this.uploadedFiles.length;
                if (charLength > maxLength) {
                    this.result.error.errorMessage = `This field only accepts a maximum of ${maxLength} files`;
                    fileUploader.val("");
                }
            }
            return this;
        }
    }

    isFileExtAccepted(fileUploader) {
        let errorMessage = this.result.error.errorMessage;
        const allowedExt = ["jpeg", "jpg", "png", "pptx", "xlsx", "pdf", "docx", "doc", "rpt"];
        if (errorMessage || !this.uploadedFiles.length) {
            return this;
        } else {
            if ($.inArray(
                fileUploader
                    .val()
                    .split(".")
                    .pop()
                    .toLowerCase(),
                allowedExt
            ) == -1) {
                this.result.error.errorMessage = "Only formats are allowed : " + allowedExt.join(", ");
                fileUploader.val("");
            }
            return this;
        }

    }

    isFileSizeAccepted(fileUploader) {
        const fileSizeLimit = this.serverDefaults[0].FileSizeLimit;
        let errorMessage = this.result.error.errorMessage;
        if (errorMessage) {
            return this;
        } else {
            if (this.uploadedFiles.find((e) => e.size > fileSizeLimit)) {
                this.result.error.errorMessage = `Only files less than ${fileSizeLimit / Math.pow(1024, 2)} MB is allowed`;
                fileUploader.val("");
            }

            return this;
        }
    }

};

export const validateFormElements = (validationRules) => {
    const errors = [];
    validationRules.forEach((e) => {
        const elementId = $("#" + e.id);
        const errorContainer = $("#" + e.id + "-error");
        const errorMessage = e.rules;
        if (errorMessage) {
            errorContainer.empty();
            elementId.addClass("is-invalid");
            errorContainer.text(errorMessage);
            if (!errorContainer.text()) {
                elementId.removeClass("is-invalid");
            } else {
                errors.push(errorMessage);
            }
        }
    });
    return errors;
};

export const isFormValid = (validationErrors, cb) => {
    if (validationErrors.length > 0) {
        cb();
        return false;
    } else {
        return true;
    }
};