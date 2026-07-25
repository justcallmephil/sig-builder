const preview = document.getElementById("signature-preview");

const fields = {

    name: document.getElementById("name"),

    title: document.getElementById("title"),

    phone1: document.getElementById("phone1"),

    phone2: document.getElementById("phone2")

};

function render(){

    const phone2 =
        fields.phone2.value.trim();

    preview.innerHTML = `

<div class="sig-name">

${fields.name.value || "Phil Davis"}

</div>

<div class="sig-title">

${fields.title.value || "Graphic Designer"}

</div>

<div class="sig-phone">

${fields.phone1.value || "339-970-2301"}

</div>

${
phone2
?
`<div class="sig-phone">${phone2}</div>`
:
""
}

<div class="sig-app">

Download our app:
<a href="https://grace.org/app">

GC Connect

</a>

</div>

<div class="logo-row">

<img
src="assets/logo-default.png"
width="180"
alt="Grace Chapel">

<div class="social">

<img src="assets/instagram.png" width="22">

<img src="assets/youtube.png" width="22">

<img src="assets/facebook.png" width="22">

</div>

</div>

`;

}

Object.values(fields).forEach(field=>{

    field.addEventListener("input",render);

});

render();// JavaScript Document