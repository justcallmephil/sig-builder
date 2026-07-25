/**
 * ==========================================================
 * Grace Signature Builder
 * signature-template.js
 * Version 0.2
 * ==========================================================
 */

export function generateSignature(data) {

    const phone2 = data.phone2?.trim();

    return `
        <div class="signature">

            <div class="signature-name">
                ${escapeHtml(data.name || "Phil Davis")}
            </div>

            <div class="signature-title">
                ${escapeHtml(data.title || "Graphic Designer")}
            </div>

            <div class="signature-phone">
                ${escapeHtml(data.phone1 || "339-970-2301")}
            </div>

            ${
                phone2
                    ? `
                    <div class="signature-phone">
                        ${escapeHtml(phone2)}
                    </div>
                    `
                    : ""
            }

            <div class="signature-app">
                Download our app:
                <a
                    href="https://grace.org/app"
                    target="_blank"
                    rel="noopener">
                    GC Connect
                </a>
            </div>

            <div class="signature-footer">

                <div class="signature-logo">

                    <img
                        src="assets/logo-default.png"
                        width="180"
                        alt="Grace Chapel">

                </div>

                <div class="signature-social">

                    <a
                        href="https://www.instagram.com/wearegrace/"
                        target="_blank"
                        rel="noopener">

                        <img
                            src="assets/instagram.png"
                            width="22"
                            alt="Instagram">

                    </a>

                    <a
                        href="https://www.youtube.com/@GraceChapel"
                        target="_blank"
                        rel="noopener">

                        <img
                            src="assets/youtube.png"
                            width="22"
                            alt="YouTube">

                    </a>

                    <a
                        href="https://www.facebook.com/GraceChapelOnline"
                        target="_blank"
                        rel="noopener">

                        <img
                            src="assets/facebook.png"
                            width="22"
                            alt="Facebook">

                    </a>

                </div>

            </div>

        </div>
    `;
}

/**
 * Prevent HTML injection.
 * This lets us safely render user-entered text.
 */
function escapeHtml(value = "") {

    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}