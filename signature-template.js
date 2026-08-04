/**
 * ==========================================================
 * Grace Signature Builder
 * signature-template.js
 * Version 1.0
 * ==========================================================
 */

const GRACE_URL = "https://grace.org";
const GC_CONNECT_URL = "https://grace.org/app";

const LOGO_FAMILIES = {
    standard: {
        light: "https://s3.amazonaws.com/account-media/27875/uploaded/g/0e21257247_1783976021_gc-email-sig-220px-light.png",
        dark: "https://s3.amazonaws.com/account-media/27875/uploaded/g/0e21257244_1783976001_gc-email-sig-220px-dark.png",
        glow: "https://s3.amazonaws.com/account-media/27875/uploaded/g/0e21306945_1785423071_gc-email-sig-220px-glow.png"
    },
    alternate: {
        light: "https://s3.amazonaws.com/account-media/27875/uploaded/g/0e21302891_1785265719_gc-email-sig-v2-220px-light.png",
        dark: "https://s3.amazonaws.com/account-media/27875/uploaded/g/0e21302885_1785265683_gc-email-sig-v2-220px-dark.png",
        glow: "https://s3.amazonaws.com/account-media/27875/uploaded/g/0e21302889_1785265700_gc-email-sig-v2-220px-glow.png"
    }
};

const DEFAULT_LOGO_FAMILY = "standard";

const SOCIAL_INSTAGRAM = "https://s3.amazonaws.com/account-media/27875/uploaded/g/0e21319343_1785856502_gc-social-instagram.png";
const SOCIAL_YOUTUBE = "https://s3.amazonaws.com/account-media/27875/uploaded/g/0e21319345_1785856520_gc-social-youtube.png";
const SOCIAL_FACEBOOK = "https://s3.amazonaws.com/account-media/27875/uploaded/g/0e21319341_1785856487_gc-social-facebook.png";

const SIGNATURE_WIDTH = 420;
const LOGO_WIDTH = 180;
const LOGO_COLUMN_WIDTH = 216;
const SOCIAL_BOX_SIZE = 28;
const SOCIAL_ICON_GAP = 10;

const styles = {
    table:
        `width:${SIGNATURE_WIDTH}px;` +
        "border-collapse:collapse;border-spacing:0;" +
        "font-family:Helvetica,Arial,sans-serif;",
    name:
        "margin:0;font-size:16pt;font-weight:bold;" +
        "line-height:20px;mso-line-height-rule:exactly;",
    body:
        "margin:0;font-size:11pt;line-height:18px;" +
        "mso-line-height-rule:exactly;",
    appLink:
        "font-weight:bold;text-decoration:none;",
    logo:
        `display:block;width:${LOGO_WIDTH}px;height:auto;` +
        "margin:0;border:0;outline:none;text-decoration:none;"
};

export function generateSignature(data) {
    const logoFamily = resolveLogoFamily(data.logoFamily);

    return buildSignature(data, {
        logo: getLogoAsset(logoFamily, "glow"),
        textColor: "#333333",
        linkColor: "#0072CE"
    });
}

export function generatePreview(data, darkMode = false) {
    const logoFamily = resolveLogoFamily(data.logoFamily);

    return buildSignature(data, {
        logo: getLogoAsset(logoFamily, darkMode ? "dark" : "light"),
        textColor: darkMode ? "#FFFFFF" : "#333333",
        linkColor: darkMode ? "#7EC8FF" : "#0072CE"
    });
}

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
            `Download our app: <a href="${GC_CONNECT_URL}" target="_blank" style="${styles.appLink}color:${theme.linkColor};">GC Connect</a>`
        );
    }

    return `
<table role="presentation" width="${SIGNATURE_WIDTH}" cellpadding="0" cellspacing="0" border="0" style="${styles.table}color:${theme.textColor};">
    <tr>
        <td style="padding:0;color:${theme.textColor};">
            <div style="${styles.name}color:${theme.textColor};">${escapeHtml(data.name || "Firstname Lastname")}</div>
            <div style="${styles.body}color:${theme.textColor};">${escapeHtml(data.title || "Job Title")}</div>
        </td>
    </tr>
    <tr>
        <td height="14" style="height:14px;padding:0;font-size:0;line-height:0;mso-line-height-rule:exactly;">&nbsp;</td>
    </tr>
    <tr>
        <td style="${styles.body}padding:0;color:${theme.textColor};">${contactLines.join("<br>")}</td>
    </tr>
    <tr>
        <td height="22" style="height:22px;padding:0;font-size:0;line-height:0;mso-line-height-rule:exactly;">&nbsp;</td>
    </tr>
    <tr>
        <td style="padding:0;">
            <table role="presentation" width="${SIGNATURE_WIDTH}" cellpadding="0" cellspacing="0" border="0" style="width:${SIGNATURE_WIDTH}px;border-collapse:collapse;border-spacing:0;">
                <tr>
                    <td width="${LOGO_COLUMN_WIDTH}" align="left" valign="middle" style="width:${LOGO_COLUMN_WIDTH}px;padding:0;vertical-align:middle;">
                        <a href="${GRACE_URL}" target="_blank" style="display:block;text-decoration:none;">
                            <img src="${theme.logo}" width="${LOGO_WIDTH}" alt="Grace Chapel" style="${styles.logo}">
                        </a>
                    </td>
                    <td align="left" valign="middle" style="padding:0;vertical-align:middle;">
                        ${buildSocialRow()}
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
`;
}

function buildSocialRow() {
    return `
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;border-spacing:0;">
    <tr>
        ${buildSocialIcon({
            href: "https://www.instagram.com/wearegrace/",
            source: SOCIAL_INSTAGRAM,
            label: "Instagram",
            imageSize: SOCIAL_BOX_SIZE
        })}
        ${buildSpacerCell()}
        ${buildSocialIcon({
            href: "https://www.youtube.com/@GraceChapel",
            source: SOCIAL_YOUTUBE,
            label: "YouTube",
            imageSize: SOCIAL_BOX_SIZE
        })}
        ${buildSpacerCell()}
        ${buildSocialIcon({
            href: "https://www.facebook.com/GraceChapelOnline",
            source: SOCIAL_FACEBOOK,
            label: "Facebook",
            imageSize: SOCIAL_BOX_SIZE
        })}
    </tr>
</table>
`;
}

function buildSocialIcon({ href, source, label, imageSize }) {
    return `
<td width="${SOCIAL_BOX_SIZE}" height="${SOCIAL_BOX_SIZE}" align="center" valign="middle" style="width:${SOCIAL_BOX_SIZE}px;height:${SOCIAL_BOX_SIZE}px;padding:0;font-size:0;line-height:0;mso-line-height-rule:exactly;vertical-align:middle;">
    <a href="${href}" target="_blank" aria-label="${label}" style="display:block;width:${SOCIAL_BOX_SIZE}px;height:${SOCIAL_BOX_SIZE}px;line-height:0;text-align:center;text-decoration:none;">
        <img src="${source}" width="${imageSize}" height="${imageSize}" hspace="0" vspace="0" alt="${label}" style="display:block;width:${imageSize}px;height:${imageSize}px;margin:0 auto;border:0;outline:none;text-decoration:none;">
    </a>
</td>
`;
}

function buildSpacerCell() {
    return `
<td width="${SOCIAL_ICON_GAP}" height="${SOCIAL_BOX_SIZE}" style="width:${SOCIAL_ICON_GAP}px;height:${SOCIAL_BOX_SIZE}px;padding:0;font-size:0;line-height:0;mso-line-height-rule:exactly;">&nbsp;</td>
`;
}

function resolveLogoFamily(requestedFamily) {
    const normalizedFamily = String(requestedFamily || "")
        .trim()
        .toLowerCase();

    if (Object.prototype.hasOwnProperty.call(LOGO_FAMILIES, normalizedFamily)) {
        return normalizedFamily;
    }

    return DEFAULT_LOGO_FAMILY;
}

function getLogoAsset(familyName, preferredVariant) {
    const family =
        LOGO_FAMILIES[familyName] ||
        LOGO_FAMILIES[DEFAULT_LOGO_FAMILY];

    return (
        family[preferredVariant] ||
        family.glow ||
        family.light ||
        LOGO_FAMILIES[DEFAULT_LOGO_FAMILY].glow ||
        LOGO_FAMILIES[DEFAULT_LOGO_FAMILY].light
    );
}

function escapeHtml(value = "") {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
