/**
 * ==========================================================
 * Grace Signature Builder
 * main.js
 * Version 1.0
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

const nameInput = document.getElementById("name");
const titleInput = document.getElementById("title");
const phone1Input = document.getElementById("phone1");
const phone2Input = document.getElementById("phone2");
const includeAppInput = document.getElementById("includeApp");

const logoFamilyInputs = Array.from(
    document.querySelectorAll('input[name="logoFamily"]')
);

const preview = document.getElementById("signature-preview");
const previewCanvas = document.getElementById("preview-canvas");

const resetButton = document.getElementById("reset-button");
const copyButton = document.getElementById("copy-button");
const downloadButton = document.getElementById("download-button");
const restoreSavedButton = document.getElementById("restore-saved-button");

const rememberInfo = document.getElementById("rememberInfo");

const darkPreview = document.getElementById("darkPreview");
const toast = document.getElementById("toast");

const aboutButton = document.getElementById("about-button");
const aboutDialog = document.getElementById("about-dialog");
const aboutClose = document.getElementById("about-close");

const signatureStatus = document.getElementById("signature-status");
const statusTitle = document.getElementById("status-title");
const statusMessage = document.getElementById("status-message");

const statusToggle = document.getElementById("status-toggle");

const statusToggleLabel = statusToggle.querySelector(
    ".status-toggle-label"
);

const statusDetails = document.getElementById("status-details");

const statusChecks = {
    name: document.querySelector('[data-check="name"]'),
    title: document.querySelector('[data-check="title"]'),
    phone1: document.querySelector('[data-check="phone1"]'),
    signature: document.querySelector('[data-check="signature"]'),
    structure: document.querySelector('[data-check="structure"]'),
    assets: document.querySelector('[data-check="assets"]')
};


/* ==========================================================
   Default Values
========================================================== */

const defaults = {
    name: "Firstname Lastname",
    title: "Job Title",
    phone1: "000-000-0000",
    phone2: "",
    includeApp: true,
    logoFamily: "standard"
};


/* ==========================================================
   Local Storage
========================================================== */

const STORAGE_KEY = "grace-signature-builder-profile";


/* ==========================================================
   Initialize
========================================================== */

initialize();


/* ==========================================================
   Core Application
========================================================== */

function initialize() {
    populateInitialValues();
    render();

    form.addEventListener(
        "input",
        handleFormInput
    );

    rememberInfo.addEventListener(
        "change",
        handleRememberChange
    );

    darkPreview.addEventListener(
        "change",
        render
    );

    resetButton.addEventListener(
        "click",
        resetForm
    );

    restoreSavedButton.addEventListener(
        "click",
        restoreSavedProfile
    );

    copyButton.addEventListener(
        "click",
        copySignature
    );

    downloadButton.addEventListener(
        "click",
        downloadSignature
    );

    aboutButton.addEventListener("click", openAboutDialog);
    aboutClose.addEventListener("click", closeAboutDialog);

    aboutDialog.addEventListener("click", event => {
        if (event.target.hasAttribute("data-close-about")) {
            closeAboutDialog();
        }
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && !aboutDialog.hidden) {
            closeAboutDialog();
        }
    });

    statusToggle.addEventListener(
        "click",
        toggleStatusDetails
    );
}

function populateInitialValues() {
    const savedRecord = loadSavedProfile();

    if (
        savedRecord &&
        savedRecord.remember === true &&
        savedRecord.profile
    ) {
        applyFormData(savedRecord.profile);
        rememberInfo.checked = true;
        restoreSavedButton.disabled = false;
    } else {
        applyFormData(defaults);
        rememberInfo.checked = false;
        restoreSavedButton.disabled = true;
    }

    darkPreview.checked = false;
}

function applyFormData(data) {
    const safeData = {
        ...defaults,
        ...data
    };

    nameInput.value = String(safeData.name || "");
    titleInput.value = String(safeData.title || "");
    phone1Input.value = String(safeData.phone1 || "");
    phone2Input.value = String(safeData.phone2 || "");
    includeAppInput.checked = Boolean(safeData.includeApp);

    const requestedLogo = logoFamilyInputs.find(
        input => input.value === safeData.logoFamily
    );

    const fallbackLogo = logoFamilyInputs.find(
        input => input.value === defaults.logoFamily
    );

    const logoToSelect = requestedLogo || fallbackLogo;

    if (logoToSelect) {
        logoToSelect.checked = true;
    }
}

function handleFormInput(event) {
    if (event.target === rememberInfo) {
        return;
    }

    render();
    saveProfile();
}

function handleRememberChange() {
    if (rememberInfo.checked) {
        const saved = saveProfile();
        restoreSavedButton.disabled = !saved;

        showToast(
            saved
                ? "✓ Information will be remembered on this device."
                : "Unable to save information in this browser."
        );

        return;
    }

    clearSavedProfile();
    restoreSavedButton.disabled = true;

    showToast(
        "Saved information removed."
    );
}

function loadSavedProfile() {
    try {
        const storedValue = localStorage.getItem(STORAGE_KEY);

        if (!storedValue) {
            return null;
        }

        const parsedValue = JSON.parse(storedValue);

        if (
            !parsedValue ||
            typeof parsedValue !== "object" ||
            parsedValue.remember !== true ||
            !parsedValue.profile ||
            typeof parsedValue.profile !== "object"
        ) {
            clearSavedProfile();
            return null;
        }

        return parsedValue;
    } catch (error) {
        console.warn(
            "Unable to read the saved profile:",
            error
        );

        return null;
    }
}

function saveProfile() {
    if (!rememberInfo.checked) {
        return false;
    }

    try {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
                remember: true,
                profile: getFormData()
            })
        );

        restoreSavedButton.disabled = false;
        return true;
    } catch (error) {
        console.warn(
            "Unable to save the profile:",
            error
        );

        return false;
    }
}

function clearSavedProfile() {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        console.warn(
            "Unable to remove the saved profile:",
            error
        );
    }
}

function restoreSavedProfile() {
    const savedRecord = loadSavedProfile();

    if (!savedRecord || !savedRecord.profile) {
        restoreSavedButton.disabled = true;

        showToast(
            "No saved information was found on this device."
        );

        return;
    }

    applyFormData(savedRecord.profile);
    rememberInfo.checked = true;
    restoreSavedButton.disabled = false;

    closeStatusDetails();
    render();

    showToast(
        "✓ Saved information restored."
    );
}

function getFormData() {
    return {
        name: nameInput.value.trim(),
        title: titleInput.value.trim(),
        phone1: phone1Input.value.trim(),
        phone2: phone2Input.value.trim(),
        includeApp: includeAppInput.checked,
        logoFamily: getSelectedLogoFamily()
    };
}

function getSelectedLogoFamily() {
    const selectedLogoInput = logoFamilyInputs.find(
        input => input.checked
    );

    return selectedLogoInput
        ? selectedLogoInput.value
        : defaults.logoFamily;
}

function render() {
    const data = getFormData();
    const isDarkMode = darkPreview.checked;

    let previewGenerated = false;
    let productionHtml = "";

    try {
        preview.innerHTML = generatePreview(
            data,
            isDarkMode
        );

        previewGenerated = true;
    } catch (error) {
        console.error(
            "Unable to generate signature preview:",
            error
        );

        preview.innerHTML = `
            <p style="
                margin:0;
                color:#b42318;
                font-family:Arial, sans-serif;
                font-size:14px;
            ">
                The signature preview could not be generated.
            </p>
        `;
    }

    previewCanvas.classList.toggle(
        "dark",
        isDarkMode
    );

    try {
        productionHtml = generateSignature(data);
    } catch (error) {
        console.error(
            "Unable to generate production signature:",
            error
        );
    }

    updateSignatureStatus({
        data,
        productionHtml,
        previewGenerated
    });
}

function resetForm() {
    applyFormData(defaults);
    darkPreview.checked = false;

    closeStatusDetails();
    render();

    showToast(
        loadSavedProfile()
            ? "Form reset. Use Restore saved to reload your information."
            : "Form reset to the sample defaults."
    );
}


/* ==========================================================
   Signature Status
========================================================== */

function updateSignatureStatus({
    data,
    productionHtml,
    previewGenerated
}) {
    const checks = evaluateSignature({
        data,
        productionHtml,
        previewGenerated
    });

    const errors = checks.filter(
        check => check.level === "error"
    );

    const warnings = checks.filter(
        check => check.level === "warning"
    );

    updateChecklist(checks);

    if (errors.length > 0) {
        setStatus({
            state: "error",
            title: "Signature needs attention",
            message: errors[0].message
        });

        copyButton.disabled = true;
        downloadButton.disabled = true;

        return;
    }

    if (warnings.length > 0) {
        const defaultWarnings = warnings.filter(
            check => check.reason === "default"
        );

        if (defaultWarnings.length > 0) {
            setStatus({
                state: "warning",
                title: "Replace the sample information",
                message: createDefaultWarningMessage(
                    defaultWarnings
                )
            });
        } else {
            setStatus({
                state: "warning",
                title: "Please review your signature",
                message: warnings[0].message
            });
        }

        copyButton.disabled = false;
        downloadButton.disabled = false;

        return;
    }

    setStatus({
        state: "ready",
        title: "Ready for Outlook",
        message: "Your signature is ready to copy or download."
    });

    copyButton.disabled = false;
    downloadButton.disabled = false;
}

function evaluateSignature({
    data,
    productionHtml,
    previewGenerated
}) {
    const checks = [];

    checks.push(
        evaluateName(data.name)
    );

    checks.push(
        evaluateTitle(data.title)
    );

    checks.push(
        evaluatePrimaryPhone(data.phone1)
    );

    const signatureGenerated =
        previewGenerated &&
        Boolean(productionHtml.trim());

    checks.push({
        key: "signature",
        level: signatureGenerated ? "pass" : "error",
        message: signatureGenerated
            ? "Signature HTML generated successfully."
            : "The signature could not be generated. Reload the builder and try again."
    });

    checks.push(
        evaluateStructure(productionHtml)
    );

    checks.push(
        evaluateAssets(productionHtml)
    );

    const secondaryPhoneCheck =
        evaluateSecondaryPhone(data.phone2);

    if (secondaryPhoneCheck) {
        checks.push(secondaryPhoneCheck);
    }

    return checks;
}

function evaluateName(name) {
    if (!name) {
        return {
            key: "name",
            level: "error",
            message:
                "Enter your name before copying or downloading."
        };
    }

    if (isDefaultValue(name, defaults.name)) {
        return {
            key: "name",
            level: "warning",
            reason: "default",
            fieldLabel: "name",
            message:
                "Replace the sample name with your own name."
        };
    }

    return {
        key: "name",
        level: "pass",
        message: "Name is included."
    };
}

function evaluateTitle(title) {
    if (!title) {
        return {
            key: "title",
            level: "error",
            message:
                "Enter your job title before copying or downloading."
        };
    }

    if (isDefaultValue(title, defaults.title)) {
        return {
            key: "title",
            level: "warning",
            reason: "default",
            fieldLabel: "job title",
            message:
                "Replace the sample job title with your own title."
        };
    }

    return {
        key: "title",
        level: "pass",
        message: "Job title is included."
    };
}

function evaluatePrimaryPhone(phone) {
    if (!phone) {
        return {
            key: "phone1",
            level: "error",
            message:
                "Enter a primary phone number before copying or downloading."
        };
    }

    if (isDefaultValue(phone, defaults.phone1)) {
        return {
            key: "phone1",
            level: "warning",
            reason: "default",
            fieldLabel: "primary phone number",
            message:
                "Replace the sample phone number with your own number."
        };
    }

    if (!hasExpectedPhoneCharacters(phone)) {
        return {
            key: "phone1",
            level: "warning",
            message:
                "The primary phone number contains unexpected characters. Please review it."
        };
    }

    if (countPhoneDigits(phone) < 7) {
        return {
            key: "phone1",
            level: "warning",
            message:
                "The primary phone number appears unusually short. Please review it."
        };
    }

    return {
        key: "phone1",
        level: "pass",
        message: "Primary phone is included."
    };
}

function evaluateSecondaryPhone(phone) {
    if (!phone) {
        return null;
    }

    if (!hasExpectedPhoneCharacters(phone)) {
        return {
            key: "phone2",
            level: "warning",
            message:
                "The secondary phone number contains unexpected characters. Please review it."
        };
    }

    if (countPhoneDigits(phone) < 7) {
        return {
            key: "phone2",
            level: "warning",
            message:
                "The secondary phone number appears unusually short. Please review it."
        };
    }

    return null;
}

function createDefaultWarningMessage(defaultWarnings) {
    const fieldLabels = defaultWarnings.map(
        warning => warning.fieldLabel
    );

    if (fieldLabels.length === 1) {
        return `Replace the sample ${fieldLabels[0]} before using the signature.`;
    }

    if (fieldLabels.length === 2) {
        return (
            `Replace the sample ${fieldLabels[0]} and ` +
            `${fieldLabels[1]} before using the signature.`
        );
    }

    const finalLabel = fieldLabels.pop();

    return (
        `Replace the sample ${fieldLabels.join(", ")}, and ` +
        `${finalLabel} before using the signature.`
    );
}

function isDefaultValue(value, defaultValue) {
    return normalizeValue(value) === normalizeValue(defaultValue);
}

function normalizeValue(value) {
    return String(value || "")
        .trim()
        .replace(/\s+/g, " ")
        .toLowerCase();
}

function evaluateStructure(productionHtml) {
    if (!productionHtml) {
        return {
            key: "structure",
            level: "error",
            message:
                "The Outlook-compatible signature layout could not be created."
        };
    }

    const hasTableLayout =
        /<table[\s>]/i.test(productionHtml);

    const hasInlineStyles =
        /style\s*=\s*["']/i.test(productionHtml);

    if (!hasTableLayout || !hasInlineStyles) {
        return {
            key: "structure",
            level: "warning",
            message:
                "The generated signature may be missing part of its Outlook-compatible formatting."
        };
    }

    return {
        key: "structure",
        level: "pass",
        message:
            "Outlook-compatible layout is configured."
    };
}

function evaluateAssets(productionHtml) {
    if (!productionHtml) {
        return {
            key: "assets",
            level: "error",
            message:
                "The signature assets could not be checked."
        };
    }

    const documentParser = new DOMParser();

    const parsedDocument = documentParser.parseFromString(
        productionHtml,
        "text/html"
    );

    const images = Array.from(
        parsedDocument.querySelectorAll("img")
    );

    if (images.length === 0) {
        return {
            key: "assets",
            level: "warning",
            message:
                "No logo or social images were found in the generated signature."
        };
    }

    const missingSource = images.some(
        image => !image.getAttribute("src")?.trim()
    );

    if (missingSource) {
        return {
            key: "assets",
            level: "warning",
            message:
                "One or more signature images are missing their source address."
        };
    }

    const unsafeSource = images.some(image => {
        const source = image
            .getAttribute("src")
            .trim();

        return !(
            source.startsWith("https://") ||
            source.startsWith("/") ||
            source.startsWith("./") ||
            source.startsWith("../")
        );
    });

    if (unsafeSource) {
        return {
            key: "assets",
            level: "warning",
            message:
                "One or more signature images may not use a secure address."
        };
    }

    const missingAltText = images.some(
        image => !image.hasAttribute("alt")
    );

    if (missingAltText) {
        return {
            key: "assets",
            level: "warning",
            message:
                "One or more signature images are missing accessibility text."
        };
    }

    return {
        key: "assets",
        level: "pass",
        message:
            "Logo and social assets are configured."
    };
}

function hasExpectedPhoneCharacters(phone) {
    return /^[0-9+\-().\s]*(?:(?:x|ext\.?)\s*\d+)?$/i.test(
        phone
    );
}

function countPhoneDigits(phone) {
    return (
        String(phone)
            .match(/\d/g) || []
    ).length;
}

function setStatus({
    state,
    title,
    message
}) {
    signatureStatus.classList.remove(
        "status-ready",
        "status-warning",
        "status-error"
    );

    signatureStatus.classList.add(
        `status-${state}`
    );

    statusTitle.textContent = title;
    statusMessage.textContent = message;
}

function updateChecklist(checks) {
    Object.entries(statusChecks).forEach(
        ([key, element]) => {
            const check = checks.find(
                item => item.key === key
            );

            const level = check
                ? check.level
                : "pass";

            element.classList.remove(
                "status-check-pass",
                "status-check-warning",
                "status-check-error"
            );

            element.classList.add(
                `status-check-${level}`
            );

            element.dataset.status = level;
        }
    );
}


/* ==========================================================
   Status Details Disclosure
========================================================== */

function toggleStatusDetails() {
    const isExpanded =
        statusToggle.getAttribute(
            "aria-expanded"
        ) === "true";

    if (isExpanded) {
        closeStatusDetails();
    } else {
        openStatusDetails();
    }
}

function openStatusDetails() {
    statusDetails.hidden = false;

    statusToggle.setAttribute(
        "aria-expanded",
        "true"
    );

    statusToggleLabel.textContent =
        "Hide details";
}

function closeStatusDetails() {
    statusDetails.hidden = true;

    statusToggle.setAttribute(
        "aria-expanded",
        "false"
    );

    statusToggleLabel.textContent =
        "Show details";
}


/* ==========================================================
   About Dialog
========================================================== */

function openAboutDialog() {
    aboutDialog.hidden = false;
    document.body.classList.add("modal-open");
    aboutClose.focus();
}

function closeAboutDialog() {
    aboutDialog.hidden = true;
    document.body.classList.remove("modal-open");
    aboutButton.focus();
}


/* ==========================================================
   Copy for Outlook
========================================================== */

async function copySignature() {
    if (copyButton.disabled) {
        return;
    }

    const productionHtml = generateSignature(
        getFormData()
    );

    const temporaryContainer =
        document.createElement("div");

    temporaryContainer.style.position = "fixed";
    temporaryContainer.style.left = "-9999px";
    temporaryContainer.style.top = "0";
    temporaryContainer.innerHTML = productionHtml;

    document.body.appendChild(
        temporaryContainer
    );

    try {
        if (
            navigator.clipboard &&
            window.ClipboardItem
        ) {
            const htmlBlob = new Blob(
                [productionHtml],
                {
                    type: "text/html"
                }
            );

            const plainTextBlob = new Blob(
                [temporaryContainer.innerText],
                {
                    type: "text/plain"
                }
            );

            const clipboardItem =
                new ClipboardItem({
                    "text/html": htmlBlob,
                    "text/plain": plainTextBlob
                });

            await navigator.clipboard.write([
                clipboardItem
            ]);
        } else {
            legacyCopy(
                temporaryContainer
            );
        }

        showToast(
            "✓ Your Grace signature is ready!<br>" +
            "Paste it into Outlook → Settings → Signatures."
        );
    } catch (error) {
        console.error(
            "Unable to copy signature:",
            error
        );

        try {
            legacyCopy(
                temporaryContainer
            );

            showToast(
                "✓ Signature copied!<br>" +
                "Open Outlook → Settings → Signatures and paste."
            );
        } catch (legacyError) {
            console.error(
                "Legacy copy also failed:",
                legacyError
            );

            showToast(
                "Unable to copy the signature.<br>" +
                "Please try downloading the HTML file instead."
            );
        }
    } finally {
        temporaryContainer.remove();
    }
}

function legacyCopy(element) {
    const range = document.createRange();

    range.selectNodeContents(
        element
    );

    const selection =
        window.getSelection();

    if (!selection) {
        throw new Error(
            "Text selection is unavailable."
        );
    }

    selection.removeAllRanges();
    selection.addRange(range);

    const copied =
        document.execCommand("copy");

    selection.removeAllRanges();

    if (!copied) {
        throw new Error(
            "The browser rejected the copy command."
        );
    }
}


/* ==========================================================
   Download HTML
========================================================== */

function downloadSignature() {
    if (downloadButton.disabled) {
        return;
    }

    const data = getFormData();

    const productionHtml =
        generateSignature(data);

    const completeDocument =
        createHtmlDocument(productionHtml);

    const fileBlob = new Blob(
        [completeDocument],
        {
            type: "text/html;charset=utf-8"
        }
    );

    const downloadUrl =
        URL.createObjectURL(fileBlob);

    const downloadLink =
        document.createElement("a");

    downloadLink.href = downloadUrl;
    downloadLink.download =
        createFilename(data.name);

    document.body.appendChild(
        downloadLink
    );

    downloadLink.click();
    downloadLink.remove();

    URL.revokeObjectURL(
        downloadUrl
    );

    showToast(
        "✓ HTML file downloaded!<br>" +
        "Open the file in a browser to review the signature."
    );
}

function createHtmlDocument(signatureHtml) {
    const generatedDate =
        new Intl.DateTimeFormat(
            "en-US",
            {
                dateStyle: "long",
                timeStyle: "short"
            }
        ).format(new Date());

    return `<!DOCTYPE html>
<!--
Grace Signature Builder v1.0
Generated: ${generatedDate}
-->
<html lang="en">
<head>
    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0">

    <title>Grace Chapel Email Signature</title>
</head>

<body style="margin:24px;background-color:transparent;">
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

    clearTimeout(
        showToast.timer
    );

    showToast.timer = setTimeout(
        () => {
            toast.classList.remove("show");
        },
        4000
    );
}