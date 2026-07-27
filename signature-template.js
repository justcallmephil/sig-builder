/**
 * ==========================================================
 * Grace Signature Builder
 * signature-template.js
 * Version 0.4
 * ==========================================================
 */

const GRACE_URL = "https://grace.org";
const GC_CONNECT_URL = "https://grace.org/app";

const LOGO_LIGHT =
    "https://s3.amazonaws.com/account-media/27875/uploaded/g/0e21257247_1783976021_gc-email-sig-220px-light.png";

const LOGO_DARK =
    "https://s3.amazonaws.com/account-media/27875/uploaded/g/0e21257244_1783976001_gc-email-sig-220px-dark.png";

const INSTAGRAM =
    "https://s3.amazonaws.com/account-media/27875/uploaded/g/0e21238197_1783532772_gc-inst.png";

const YOUTUBE =
    "https://s3.amazonaws.com/account-media/27875/uploaded/g/0e21238199_1783532772_gc-yt.png";

const FACEBOOK =
    "https://s3.amazonaws.com/account-media/27875/uploaded/g/0e21238195_1783532772_gc-fb.png";

/* ==========================================================
   Inline email styles
========================================================== */

const styles = {
    table:
        "width:420px;border-collapse:collapse;font-family:Helvetica,Arial,sans-serif;",

    name:
        "font-size:16pt;font-weight:bold;line-height:20px;",

    body:
        "font-size:11pt;line-height:18px;",

    appLink:
        "font-weight:bold;text-decoration:none;",

    logo:
        "display:block;border:0;"
};

/* ==========================================================
   Production signature
========================================================== */

export function generateSignature(data) {
    return buildSignature(data, {
        logo: LOGO_LIGHT,
        textColor: "#333333",
        linkColor: "#0072CE"
    });
}

/* ==========================================================
   Preview signature
========================================================== */

export function generatePreview(data, darkMode = false) {
    return buildSignature(data, {
        logo: darkMode ? LOGO_DARK : LOGO_LIGHT,
        textColor: darkMode ? "#FFFFFF" : "#333333",
        linkColor: darkMode ? "#7EC8FF" : "#0072CE"
    });
}

/* ==========================================================
   Shared signature template
========================================================== */

function buildSignature(data, theme) {
    const contactLines = [];

    if (data.phone1) {
        contactLines.push(escapeHtml(data.phone1));
    }

    if (data.phone2) {
        contactLines.push(escapeHtml(data.phone2));
    }

    if (data.includeApp) {
        contactLines.push(
            `Download our app: <a
                href="${GC_CONNECT_URL}"
                target="_blank"
                style="${styles.appLink}color:${theme.linkColor};"
            >GC Connect</a>`
        );
    }

    return `
<table
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="${styles.table}color:${theme.textColor};">

    <tr>
        <td>

            <div style="${styles.name}">
                ${escapeHtml(data.name || "Firstname Lastname")}
            </div>

            <div style="${styles.body}">
                ${escapeHtml(data.title || "Job Title")}
            </div>

        </td>
    </tr>

    <tr>
        <td style="height:14px;font-size:0;line-height:0;">
            &nbsp;
        </td>
    </tr>

    <tr>
        <td style="${styles.body}color:${theme.textColor};">
            ${contactLines.join("<br>")}
        </td>
    </tr>

    <tr>
        <td style="height:22px;font-size:0;line-height:0;">
            &nbsp;
        </td>
    </tr>

    <tr>
        <td>

            <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0">

                <tr>

                    <td align="left" valign="middle">

                        <a
                            href="${GRACE_URL}"
                            target="_blank"
                            style="text-decoration:none;">

                            <img
                                src="${theme.logo}"
                                width="180"
                                alt="Grace Chapel"
                                style="${styles.logo}">

                        </a>

                    </td>

                    <td align="right" valign="middle">

                        <table
                            cellpadding="0"
                            cellspacing="0"
                            border="0">

                            <tr>

                                <td>
                                    <a
                                        href="https://www.instagram.com/wearegrace/"
                                        target="_blank"
                                        style="text-decoration:none;">

                                        <img
                                            src="${INSTAGRAM}"
                                            width="22"
                                            alt="Instagram"
                                            style="display:block;border:0;">

                                    </a>
                                </td>

                                <td width="8"></td>

                                <td>
                                    <a
                                        href="https://www.youtube.com/@GraceChapel"
                                        target="_blank"
                                        style="text-decoration:none;">

                                        <img
                                            src="${YOUTUBE}"
                                            width="22"
                                            alt="YouTube"
                                            style="display:block;border:0;">

                                    </a>
                                </td>

                                <td width="8"></td>

                                <td>
                                    <a
                                        href="https://www.facebook.com/GraceChapelOnline"
                                        target="_blank"
                                        style="text-decoration:none;">

                                        <img
                                            src="${FACEBOOK}"
                                            width="22"
                                            alt="Facebook"
                                            style="display:block;border:0;">

                                    </a>
                                </td>

                            </tr>

                        </table>

                    </td>

                </tr>

            </table>

        </td>
    </tr>

</table>
`;
}

/* ==========================================================
   Utilities
========================================================== */

function escapeHtml(value = "") {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}