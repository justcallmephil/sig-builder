/**
 * ==========================================================
 * Grace Signature Builder
 * main.js
 * Version 0.5
 * ==========================================================
 */

import {
    generateSignature,
    generatePreview
} from "./signature-template.js";

/* ==========================================================
   Elements
========================================================== */

const form = document.getElementById("signature-form");
const preview = document.getElementById("signature-preview");
const previewCanvas = document.getElementById("preview-canvas");

const resetButton = document.getElementById("reset-button");
const copyButton = document.getElementById("copy-button");
const downloadButton = document.getElementById("download-button");

const darkPreview = document.getElementById("darkPreview");
const toast = document.getElementById("toast");

/* ==========================================================
   Default values
========================================================== */

const defaults = {
    name: "Firstname Lastname",
    title: "Job Title",
    phone1: "000-000-0000",
    phone2: "",
    includeApp: true
};

/* ==========================================================
   Initialize
========================================================== */

initialize();

/* ==========================================================
   Functions
========================================================== */

function initialize() {
    populateDefaults();
    render();

    copyButton.disabled = false;
    downloadButton.disabled = false;

    form.addEventListener("input", render);
    darkPreview.addEventListener("change", render);

    resetButton.addEventListener("click", resetForm);
    copyButton.addEventListener("click", copySignature);
    downloadButton.addEventListener("click", downloadSignature);
}

function populateDefaults() {
    document.getElementById("name").value = defaults.name;
    document.getElementById("title").value = defaults.title;
    document.getElementById("phone1").value = defaults.phone1;
    document.getElementById("phone2").value = defaults.phone2;
    document.getElementById("includeApp").checked = defaults.includeApp;

    darkPreview.checked = false;
}

function getFormData() {
    return {
        name: document.getElementById("name").value.trim(),
        title: document.getElementById("title").value.trim(),
        phone1: document.getElementById("phone1").value.trim(),
        phone2: document.getElementById("phone2").value.trim(),
        includeApp: document.getElementById("includeApp").checked
    };
}

function render() {
    const data = getFormData();
    const isDarkMode = darkPreview.checked;

    preview.innerHTML = generatePreview(
        data,
        isDarkMode
    );

    previewCanvas.classList.toggle(
        "dark",
        isDarkMode
    );
}

function resetForm() {
    populateDefaults();
    render();
}

/* ==========================================================
   Copy for Outlook
========================================================== */

async function copySignature() {
    /*
     * generateSignature() always returns the standard
     * production signature, regardless of preview mode.
     */
    const productionHtml = generateSignature(
        getFormData()
    );

    const temporaryContainer = document.createElement("div");

    temporaryContainer.style.position = "fixed";
    temporaryContainer.style.left = "-9999px";
    temporaryContainer.style.top = "0";
    temporaryContainer.innerHTML = productionHtml;

    document.body.appendChild(temporaryContainer);

    try {
        if (navigator.clipboard && window.ClipboardItem) {
            const htmlBlob = new Blob(
                [productionHtml],
                { type: "text/html" }
            );

            const plainTextBlob = new Blob(
                [temporaryContainer.innerText],
                { type: "text/plain" }
            );

            const clipboardItem = new ClipboardItem({
                "text/html": htmlBlob,
                "text/plain": plainTextBlob
            });

            await navigator.clipboard.write([
                clipboardItem
            ]);
        } else {
            legacyCopy(temporaryContainer);
        }

        showToast(
            "✓ Signature copied!<br>" +
            "Open Outlook → Settings → Signatures and paste."
        );
    } catch (error) {
        console.error(
            "Unable to copy signature:",
            error
        );

        legacyCopy(temporaryContainer);

        showToast(
            "✓ Signature copied!<br>" +
            "Open Outlook → Settings → Signatures and paste."
        );
    } finally {
        temporaryContainer.remove();
    }
}

function legacyCopy(element) {
    const range = document.createRange();
    range.selectNodeContents(element);

    const selection = window.getSelection();

    selection.removeAllRanges();
    selection.addRange(range);

    document.execCommand("copy");

    selection.removeAllRanges();
}

/* ==========================================================
   Download HTML
========================================================== */

function downloadSignature() {
    const data = getFormData();

    /*
     * The downloaded file always uses the standard production
     * signature, regardless of the current preview mode.
     */
    const productionHtml = generateSignature(data);
    const completeDocument = createHtmlDocument(productionHtml);

    const fileBlob = new Blob(
        [completeDocument],
        {
            type: "text/html;charset=utf-8"
        }
    );

    const downloadUrl = URL.createObjectURL(fileBlob);
    const downloadLink = document.createElement("a");

    downloadLink.href = downloadUrl;
    downloadLink.download = createFilename(data.name);

    document.body.appendChild(downloadLink);
    downloadLink.click();
    downloadLink.remove();

    URL.revokeObjectURL(downloadUrl);

    showToast(
        "✓ HTML file downloaded!<br>" +
        "Open the file in a browser to review the signature."
    );
}

function createHtmlDocument(signatureHtml) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0">

    <title>Grace Chapel Email Signature</title>
</head>

<body style="margin:24px;background-color:#FFFFFF;">
${signatureHtml}
</body>
</html>
`;
}

function createFilename(name) {
    const cleanedName = String(name || "")
        .trim()
        .replace(/[^a-zA-Z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");

    if (!cleanedName) {
        return "Grace-Signature.html";
    }

    return `${cleanedName}-Grace-Signature.html`;
}

/* ==========================================================
   Toast
========================================================== */

function showToast(message) {
    toast.innerHTML = message;
    toast.classList.add("show");

    clearTimeout(showToast.timer);

    showToast.timer = setTimeout(() => {
        toast.classList.remove("show");
    }, 4000);
}