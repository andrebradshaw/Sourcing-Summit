var yourAppsScriptURl = 'https://script.google.com/macros/s/AKfycbx9wUIbMciY5ng4B2jeCpDcTK6tClIM0PNu0d8sNWEQ/dev?oo=';

var reg = (o, n) => o ? o[n] : '';
var cn = (o, s) => o ? o.getElementsByClassName(s) : console.log(o);
var tn = (o, s) => o ? o.getElementsByTagName(s) : console.log(o);
var gi = (o, s) => o ? o.getElementById(s) : console.log(o);
var rando = (n) => Math.round(Math.random() * n);
var delay = (ms) => new Promise(res => setTimeout(res, ms));
var unq = (arr) => arr.filter((e, p, a) => a.indexOf(e) == p);

var ele = (t) => document.createElement(t);
var attr = (o, k, v) => o.setAttribute(k, v);


function dragElement() {
  var el = this.parentElement;
  var pos1 = 0,  pos2 = 0,  pos3 = 0,  pos4 = 0;
  if (document.getElementById(this.id))  document.getElementById(this.id).onmousedown = dragMouseDown;
  else  this.onmousedown = dragMouseDown;

 function dragMouseDown(e) {
  pos3 = e.clientX;
  pos4 = e.clientY;
  document.onmouseup = closeDragElement;
  document.onmousemove = elementDrag;
 }

 function elementDrag(e) {
  pos1 = pos3 - e.clientX;
  pos2 = pos4 - e.clientY;
  pos3 = e.clientX;
  pos4 = e.clientY;
  el.style.top = (el.offsetTop - pos2) + "px";
  el.style.left = (el.offsetLeft - pos1) + "px";
  el.style.opacity = "0.85";
  el.style.transition = "opacity 700ms";
 }

 function closeDragElement() {
  document.onmouseup = null;
  document.onmousemove = null;
  el.style.opacity = "1";
 }
} 
function aninCloseBtn() {
  var l1 = tn(this, 'path')[0];
  var l2 = tn(this, 'path')[1];
  l1.style.transform = "translate(49px, 50px) rotate(45deg) translate(-49px, -50px)";
  l1.style.transition = "all 233ms";
  l2.style.transform = "translate(49px, 50px) rotate(135deg) translate(-49px, -50px)";
  l2.style.transition = "all 233ms";
}

function anoutCloseBtn() {
  var l1 = tn(this, 'path')[0];
  var l2 = tn(this, 'path')[1];
  l1.style.transform = "translate(49px, 50px) rotate(225deg) translate(-49px, -50px)";
  l1.style.transition = "all 233ms";
  l2.style.transform = "translate(49px, 50px) rotate(225deg) translate(-49px, -50px)";
  l2.style.transition = "all 233ms";
}


async function getProfile() {
  var url = 'https://github.com/'+reg(/(?<=^.+?github\.com\/).+?(?=\/|\?|$)/.exec(window.location.href),0);
  var res = await fetch(url + '?tab=repositories');
  var text = await res.text();
  var doc = new DOMParser().parseFromString(text, 'text/html');
  var repos = doc.getElementsByClassName('col-12 d-flex width-full py-4 border-bottom public source');
  var targetRepos = Array.from(repos).map(itm => itm.getElementsByTagName('a')[0].href + '/commit/master.patch');
  var email = await checkEmailPatch(targetRepos);
  var langs = unq(Array.from(cn(doc,'repo-language-color')).map(el=> el.parentElement.innerText.trim())).toString().replace(/,/g, ', ');
  return [email,langs];
}

async function checkEmailPatch(repos){
  for (var i = (repos.length-1); i >= 0; i--) {
    var email = await getPatches(repos[i]);
    if (email != '') {
      return email;
    }
  }
}

async function getPatches(link) {
  var res = await fetch(link);
  var html = await res.text();
  var email = reg(/(?<=From:.+?)\b[\w\.\-\+]+@[\w\-]+\.[a-zA-Z]{2,13}(\.[a-zA-Z]{2,13}|\b)/.exec(html.replace(/\w+@users.noreply.github.com|\+.+?(?=@)/g, '')),0);
  return email;
}

function loadingElm() { /*simple loading animation to indicate we are pulling information*/
  if(document.getElementById("loader-elm")) document.body.removeChild(document.getElementById("loader-elm"));
  var loaD = document.createElement("div");
  loaD.setAttribute("id", "loader-elm");
  document.body.appendChild(loaD);
  attr(loaD,'style',`top: 120px; left: 160px; position: fixed; z-index: ${(new Date().getTime()+500000)};`);
  loaD.innerHTML = '<svg version="1.1" id="Layer_1" x="0px" y="0px"     width="200px" height="200px" viewBox="0 0 24 30" style="enable-background:new 0 0 50 50;">    <rect x="0" y="10" width="4" height="0" fill="#333" opacity="0.2">      <animate attributeName="opacity" values="0.2; 1; .2" begin="0s" dur="555ms" repeatCount="indefinite" />      <animate attributeName="height" values="10; 20; 10" begin="0s" dur="555ms" repeatCount="indefinite" />      <animate attributeName="y"values="10; 5; 10" begin="0s" dur="555ms" repeatCount="indefinite" />    </rect>    <rect x="8" y="10" width="4" height="10" fill="#333"  opacity="0.2">      <animate attributeName="opacity" values="0.2; 1; .2" begin="0.15s" dur="555ms" repeatCount="indefinite" />      <animate attributeName="height" values="10; 20; 10" begin="0.15s" dur="555ms" repeatCount="indefinite" />      <animate attributeName="y" values="10; 5; 10" begin="0.15s" dur="555ms" repeatCount="indefinite" />    </rect>    <rect x="16" y="10" width="4" height="10" fill="#333"  opacity="0.2">      <animate attributeName="opacity" values="0.2; 1; .2" begin="0.3s" dur="555ms" repeatCount="indefinite" />      <animate attributeName="height" values="10; 20; 10" begin="0.3s" dur="555ms" repeatCount="indefinite" />      <animate attributeName="y" values="10; 5; 10" begin="0.3s" dur="555ms" repeatCount="indefinite" />    </rect>  </svg>';
}

function killLoader() {
  document.body.removeChild(document.getElementById("loader-elm"));
}

async function getDetails() {
  var prop = (arr, str) => arr.filter(el => el.getAttribute('itemprop') == str).map(el => el ? el.innerText.trim() : '');

  var vcard = cn(document, 'vcard-details ')[0] ? Array.from(tn(cn(document, 'vcard-details ')[0], 'li')) : null;
  var commits = cn(document, 'graph-before-activity-overview')[0] ? Array.from(cn(cn(document, 'graph-before-activity-overview')[0], 'day')).map(el => {
    return {
      date: new Date(el.getAttribute('data-date')).getTime(),
      commits: parseInt(el.getAttribute('data-count'))
    }
  }).filter(el => el.commits) : null;

  var email_elm = vcard && prop(vcard, 'email').length ? prop(vcard, 'email').toString().trim() : '';

  var rearr = await getProfile();
  var langs = rearr[1];
  var email = email_elm ? email_elm : unq(rearr[0]); /*check to see if we got the email from the HTML or from the patch. If HTML, use that, else use the patch email*/

  var detail = {
    fullname: cn(document, 'vcard-fullname')[0] ? cn(document, 'vcard-fullname')[0].innerText : '',
    geo: vcard ? prop(vcard, 'homeLocation').toString().replace(/,\s*/g, ', ') : null,
    email: email,
    website: vcard ? prop(vcard, 'url').toString().replace(/,\s*/g, ', ') : null,
    worksFor: vcard ? prop(vcard, 'worksFor').toString().replace(/,\s*/g, ', ').replace(/^@/, '') : null,
    bio: cn(document, 'p-note user-profile-bio js-user-profile-bio')[0] ? cn(document, 'p-note user-profile-bio js-user-profile-bio')[0].innerText.trim() : '',
    num_commits: commits && commits.length ? commits.map(el => el.commits).reduce((a, b) => a + b) : null,
    percent_active: commits && commits.length ? Math.round((commits.length / (365 - (8 - new Date().getDay()))) * 1000) / 10 : '',
    langs: langs,
    link: reg(/(?<=^.+?github\.com\/).+?(?=\/|\?|$)/.exec(window.location.href),0)
  };
  return detail;
}

async function createUIHTML(){

  if(gi(document,'confirm_details_cont')) gi(document,'confirm_details_cont').outerHTML = '';
  var cont = ele('div');
  attr(cont,'id','confirm_details_cont');
  attr(cont,'style', `position: fixed; top: 120px; left: 120px; width: 580px; height: 580px; z-index: ${new Date().getTime()};`);
  document.body.appendChild(cont);
  
  var head = ele('div');
  attr(head,'id','confirm_details_head');
  attr(head,'style',`display: grid; grid-template-columns: 92% 7%; background: rgb(0, 119, 181); border: 1px solid #283e4a; border-top-left-radius: 0.4em; border-top-right-radius: 0.4em; cursor: move;`);
  cont.appendChild(head);
  head.onmouseover = dragElement;

  var htext = ele('div');
  attr(htext,'style',`grid-area: 1/1; padding: 9px; color: #fff;`);
  htext.innerText = 'Add Notes & Send to Sheets';
  head.appendChild(htext);

  var cls = ele('div');
  attr(cls,'style',`grid-area: 1/2; width: 38px; height: 38px; cursor: pointer;`);
  cls.innerHTML = `<svg x="0px" y="0px" viewBox="0 0 100 100"><g style="transform: scale(0.85, 0.85)" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"><g transform="translate(2, 2)" stroke="#e21212" stroke-width="8"><path d="M47.806834,19.6743435 L47.806834,77.2743435" transform="translate(49, 50) rotate(225) translate(-49, -50) "/><path d="M76.6237986,48.48 L19.0237986,48.48" transform="translate(49, 50) rotate(225) translate(-49, -50) "/></g></g></svg>`;
  head.appendChild(cls);
  cls.onmouseenter = aninCloseBtn;
  cls.onmouseleave = anoutCloseBtn;

  var cbod = ele('div');
  attr(cbod,'style',`background: #fff; border: 1px solid #283e4a; border-bottom-left-radius: 0.4em; border-bottom-right-radius: 0.4em; padding: 6px;`);
  cont.appendChild(cbod);

  var name = ele('input');
  attr(name,'placeholder','name');
  attr(name,'id','confirm_name');
  attr(name,'style',`width: 100%; border: 1px solid transparent; border-radius: 0.5em; padding: 6px;`);
  cbod.appendChild(name);

  var empl = ele('input');
  attr(empl,'placeholder','employer');
  attr(empl,'id','confirm_empl');
  attr(empl,'style',`width: 100%; border: 1px solid transparent; border-radius: 0.5em; padding: 6px;`);
  cbod.appendChild(empl);

  var email = ele('input');
  attr(email,'placeholder','email');
  attr(email,'id','confirm_email');
  attr(email,'style',`width: 100%; border: 1px solid transparent; border-radius: 0.5em; padding: 6px;`);
  cbod.appendChild(email);

  var phone = ele('input');
  attr(phone,'placeholder','phone');
  attr(phone,'id','confirm_phone');
  attr(phone,'style',`width: 100%; border: 1px solid transparent; border-radius: 0.5em; padding: 6px;`);
  cbod.appendChild(phone);

  var langs = ele('input');
  attr(langs,'placeholder','languages');
  attr(langs,'id','confirm_langs');
  attr(langs,'style',`width: 100%; border: 1px solid transparent; border-radius: 0.5em; padding: 6px;`);
  cbod.appendChild(langs);

  var note = ele('input');
  attr(note,'placeholder','note');
  attr(note,'id','confirm_note');
  attr(note,'style',`width: 100%; border: 1px solid transparent; border-radius: 0.5em; padding: 6px;`);
  cbod.appendChild(note);

  var send = ele('div');
  attr(send,'id','send_to_sheets');
  attr(send,'style',`width: 100%; border: 1px solid transparent; border-radius: 0.4em; background: rgb(0, 119, 181); color: #fff; cursor: pointer; text-align: center; padding: 6px;`);
  cbod.appendChild(send);
  send.innerText = 'Send To Google Sheets';
    loadingElm();
  var obj = await getDetails();
  killLoader();
  name.value = obj.fullname ? obj.fullname : '';
  email.value = obj.email ? obj.email : '';
  empl.value = obj.worksFor ? obj.worksFor : '';
  langs.value = obj.langs ? obj.langs : ''
  obj['from'] = 'github';
  cls.onclick = () => {gi(document,'confirm_details_cont').outerHTML = '';};
  send.onclick = () => {  
    obj['note'] = note.value ? note.value.replace(/\%/g,' percent ') : '';
	obj['email'] = email.value ? email.value : '';
	obj['phone'] = phone.value ? phone.value : '';
	obj['langs'] = langs.value ? langs.value : '';
	obj['worksFor'] = empl.value ? empl.value.replace(/\%/g,' percent ') : '';
	obj['fullname'] = name.value ? name.value.replace(/\%/g,'') : '';
    window.open(yourAppsScriptURl+encodeURIComponent(JSON.stringify(obj)));
};

}
createUIHTML()
