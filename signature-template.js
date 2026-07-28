/**
 * ==========================================================
 * Grace Signature Builder
 * signature-template.js
 * Version 0.5
 * ==========================================================
 */

const GRACE_URL = "https://grace.org";
const GC_CONNECT_URL = "https://grace.org/app";


/* ==========================================================
   Logo Families
========================================================== */

/*
 * Each logo family supports three variants:
 *
 * light:
 * Used on light backgrounds and in production signatures.
 *
 * dark:
 * Used for the dark-mode preview.
 *
 * glow:
 * Reserved as a fallback for environments where the preferred
 * light or dark asset is unavailable.
 *
 * The current Standard family did not previously define a
 * separate glow URL, so its light asset remains the final
 * fallback until that URL is added.
 */

const LOGO_FAMILIES = {
    standard: {
        light:
            "https://s3.amazonaws.com/account-media/27875/uploaded/g/0e21257247_1783976021_gc-email-sig-220px-light.png",

        dark:
            "https://s3.amazonaws.com/account-media/27875/uploaded/g/0e21257244_1783976001_gc-email-sig-220px-dark.png",

        glow: ""
    },

    alternate: {
        light:
            "https://s3.amazonaws.com/account-media/27875/uploaded/g/0e21302891_1785265719_gc-email-sig-v2-220px-light.png",

        dark:
            "https://s3.amazonaws.com/account-media/27875/uploaded/g/0e21302885_1785265683_gc-email-sig-v2-220px-dark.png",

        glow:
            "https://s3.amazonaws.com/account-media/27875/uploaded/g/0e21302889_1785265700_gc-email-sig-v2-220px-glow.png"
    }
};

const DEFAULT_LOGO_FAMILY = "standard";


/* ==========================================================
   Social Assets
========================================================== */

const INSTAGRAM =
    "https://s3.amazonaws.com/account-media/27875/uploaded/g/0e21238197_1783532772_gc-inst.png";

const YOUTUBE =
    "https://s3.amazonaws.com/account-media/27875/uploaded/g/0e21238199_1783532772_gc-yt.png";

const FACEBOOK =
    "https://s3.amazonaws.com/account-media/27875/uploaded/g/0e21238195_1783532772_gc-fb.png";


/* ==========================================================
   Inline Email Styles
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
        "display:block;border:0;outline:none;text-decoration:none;",

    socialLink:
        "display:inline-block;padding:6px;line-height:0;text-decoration:none;",

    socialIcon:
        "display:block;width:28px;height:28px;border:0;outline:none;text-decoration:none;"
};


/* ==========================================================
   Production Signature
========================================================== */

export function generateSignature(data) {
    const logoFamily = resolveLogoFamily(
        data.logoFamily
    );

    return buildSignature(data, {
        logo: getLogoAsset(
            logoFamily,
            "light"
        ),

        textColor: "#333333",
        linkColor: "#0072CE"
    });
}


/* ==========================================================
   Preview Signature
========================================================== */

export function generatePreview(
    data,
    darkMode = false
) {
    const logoFamily = resolveLogoFamily(
        data.logoFamily
    );

    const logoVariant = darkMode
        ? "dark"
        : "light";

    return buildSignature(data, {
        logo: getLogoAsset(
            logoFamily,
            logoVariant
        ),

        textColor: darkMode
            ? "#FFFFFF"
            : "#333333",

        linkColor: darkMode
            ? "#7EC8FF"
            : "#0072CE"
    });
}


/* ==========================================================
   Shared Signature Template
========================================================== */

function buildSignature(data, theme) {
    const contactLines = [];

    if (data.phone1) {
        contactLines.push(
            escapeHtml(data.phone1)
        );
    }

    if (data.phone2) {
        contactLines.push(
            escapeHtml(data.phone2)
        );
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
    role="presentation"
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
                role="presentation"
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0">

                <tr>

                    <td
                        align="left"
                        valign="middle">

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

                    <td
                        align="right"
                        valign="middle"
                        style="padding-top:2px;">

                        <table
                            role="presentation"
                            cellpadding="0"
                            cellspacing="0"
                            border="0">

                            <tr>

                                <td
                                    align="center"
                                    valign="middle"
                                    style="font-size:0;line-height:0;">

                                    <a
                                        href="https://www.instagram.com/wearegrace/"
                                        target="_blank"
                                        aria-label="Instagram"
                                        style="${styles.socialLink}">

                                        <img
                                            src="${INSTAGRAM}"
                                            width="24"
                                            height="24"
                                            alt="Instagram"
                                            style="${styles.socialIcon}">

                                    </a>

                                </td>

                                <td
                                    width="4"
                                    style="width:4px;font-size:0;line-height:0;">
                                    &nbsp;
                                </td>

                                <td
                                    align="center"
                                    valign="middle"
                                    style="font-size:0;line-height:0;">

                                    <a
                                        href="https://www.youtube.com/@GraceChapel"
                                        target="_blank"
                                        aria-label="YouTube"
                                        style="${styles.socialLink}">

                                        <img
                                            src="${YOUTUBE}"
                                            width="24"
                                            height="24"
                                            alt="YouTube"
                                            style="${styles.socialIcon}">

                                    </a>

                                </td>

                                <td
                                    width="4"
                                    style="width:4px;font-size:0;line-height:0;">
                                    &nbsp;
                                </td>

                                <td
                                    align="center"
                                    valign="middle"
                                    style="font-size:0;line-height:0;">

                                    <a
                                        href="https://www.facebook.com/GraceChapelOnline"
                                        target="_blank"
                                        aria-label="Facebook"
                                        style="${styles.socialLink}">

                                        <img
                                            src="${FACEBOOK}"
                                            width="22"
                                            height="22"
                                            alt="Facebook"
                                            style="${styles.socialIcon}">

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
   Logo Utilities
========================================================== */

function resolveLogoFamily(requestedFamily) {
    const normalizedFamily = String(
        requestedFamily || ""
    )
        .trim()
        .toLowerCase();

    if (
        Object.prototype.hasOwnProperty.call(
            LOGO_FAMILIES,
            normalizedFamily
        )
    ) {
        return normalizedFamily;
    }

    return DEFAULT_LOGO_FAMILY;
}

function getLogoAsset(
    familyName,
    preferredVariant
) {
    const family =
        LOGO_FAMILIES[familyName] ||
        LOGO_FAMILIES[DEFAULT_LOGO_FAMILY];

    /*
     * Preferred order:
     *
     * 1. Requested light or dark variant
     * 2. Glow fallback
     * 3. Light fallback
     * 4. Standard light asset
     */

    return (
        family[preferredVariant] ||
        family.glow ||
        family.light ||
        LOGO_FAMILIES[DEFAULT_LOGO_FAMILY].light
    );
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