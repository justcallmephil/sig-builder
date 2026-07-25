/**
 * ==========================================================
 * Grace Signature Builder
 * main.js
 * Version 0.2
 * ==========================================================
 */

import { generateSignature } from "./signature-template.js";

/* ==========================================================
   Elements
========================================================== */

const form = document.getElementById("signature-form");

const preview = document.getElementById("signature-preview");

const resetButton = document.getElementById("reset-button");

/* ==========================================================
   Default Values
========================================================== */

const defaults = {

    name: "Phil Davis",

    title: "Graphic Designer",

    phone1: "339-970-2301",

    phone2: ""

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

    form.addEventListener("input", render);

    resetButton.addEventListener("click", resetForm);

}

function populateDefaults() {

    document.getElementById("name").value = defaults.name;

    document.getElementById("title").value = defaults.title;

    document.getElementById("phone1").value = defaults.phone1;

    document.getElementById("phone2").value = defaults.phone2;

}

function getFormData() {

    return {

        name: document.getElementById("name").value.trim(),

        title: document.getElementById("title").value.trim(),

        phone1: document.getElementById("phone1").value.trim(),

        phone2: document.getElementById("phone2").value.trim()

    };

}

function render() {

    preview.innerHTML = generateSignature(

        getFormData()

    );

}

function resetForm() {

    populateDefaults();

    render();

}