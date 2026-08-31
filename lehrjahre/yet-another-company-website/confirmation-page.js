// Museum edit (2026-08-31): the original wrote the visitor's form values into
// the page with innerHTML; on a public site a crafted link could inject live
// markup that way. Every innerHTML below is now textContent. Nothing else
// changed — the rockets are original.
let params = (new URL(document.location)).searchParams;
console.log("🚀 ~ params:", params);

let email = params.get("email");
console.log("🚀 ~ email:", email);
const emailPlace = document.querySelector(".email")
emailPlace.textContent = email

let fname = params.get("fname");
console.log("🚀 ~ fname:", fname);
const fnamePlace = document.querySelector(".fname")
fnamePlace.textContent = fname

let sname = params.get("sname");
console.log("🚀 ~ sname:", sname);
const snamePlace = document.querySelector(".sname")
snamePlace.textContent = sname

let bday = params.get("bday");
console.log("🚀 ~ bday:", bday);
const bdayPlace = document.querySelector(".bday")
bdayPlace.textContent = `born on ${bday}`

let sex = params.get("sex");
console.log("🚀 ~ sex:", sex);
const sexPlace = document.querySelector(".sex")
sexPlace.textContent = sex

let travellerType = params.get("travellerType");
console.log("🚀 ~ travellerType:", travellerType);
const travellerTypePlace = document.querySelector(".type")
travellerTypePlace.textContent = travellerType

let textArea = params.get("textArea");
console.log("🚀 ~ textArea:", textArea);
const textAreaPlace = document.querySelector(".notes")
textAreaPlace.textContent = `His/her note: ${textArea}`

let checkBox = params.get("treatment");
console.log("🚀 ~ checkBox:", checkBox);
const checkboxPlace = document.querySelector(".treatment")
checkboxPlace.textContent = checkBox



// let age = parseInt(params.get("age")); // is the number 18
// console.log("🚀 ~ age:", age);



