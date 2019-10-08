var yourAppsScriptURL = 'https://script.google.com/macros/s/AKfycbx9wUIbMciY5ng4B2jeCpDcTK6tClIM0PNu0d8sNWEQ/dev?';

var reg = (o, n) => o ? o[n] : '';
var cn = (o, s) => o ? o.getElementsByClassName(s) : console.log(o);
var tn = (o, s) => o ? o.getElementsByTagName(s) : console.log(o);
var gi = (o, s) => o ? o.getElementById(s) : console.log(o);
var noHTML = (s) => s.replace(/<.+?>/g, '').replace(/\s+/g, ' ').replace(/&.+?;/g, '');
var delay = (ms) => new Promise(res => setTimeout(res, ms));
var cleanName = (s) => s.replace(/(?<=^.+?)\s+-\s+.+|(?<=^.+?)\s*[sSJj][Rr].+|(?<=^.+?)\s*(III|IV|II).*|(?<=^.+?)\b,.*|(?<=^.+?)\s*\(.*/, '');
var fixCase = (s) => s.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
var timer = new Date().getTime().toString().replace(/\d{4}$/, '0000');
var rando = (n) => Math.round(Math.random() * n);
var fixDate = (s) => s ? s.replace(/[a-zA-Z]+/, s.replace(/(?<=[a-zA-Z]{3}).+/g, '')) : '';
var now = new Date().getTime();
var parseDate = (o) => o ? new Date(o).getTime() : now;
var milsec2Month = (n) => Math.round(n / 2.628e+9);

var reChar = (s) => typeof s == 'string' && s.match(/&#\d+;/g) && s.match(/&#\d+;/g).length > 0 ? s.match(/&#\d+;/g).map(el => [el, String.fromCharCode(reg(/(?<=&#).+?(?=;)/.exec(el),0))]).map(m => s = s.replace(new RegExp(m[0], 'i'), m[1])).pop() : s;
var noHtmlEntities = (s) => typeof s == 'string' ? s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&nbsp;/g, ' ') : s;

var dateString = (s) => new Date(s).toString().replace(/^\S+/, '').replace(/\d\d:\d\d.+/, '').trim().replace(/(?<=[a-zA-Z]{3})\s\d+/, '');

var timeOffset = -(new Date().getTimezoneOffset() / 60);

var ele = (t) => document.createElement(t);
var attr = (o, k, v) => o.setAttribute(k, v);

function genTrackId(n) {
  var s = '';
  var chars = '0123456789abcdefghijklmnpoqrstuvwxyzABCDEFGHIJKLMNOPQRSTVUVWXYZ0123456789';
  for (var i = 0; i <= n; i++) {
    s += chars[rando(72)];
  }
  return s + '==';
}

var clientVersion = reg(/(?<=voyager-web_).+?(?=%)/.exec(document.head.innerHTML), 0); /*DOM Dependancy*/

var trackingId = genTrackId(21);


function creds(pubId) {
  return {
    "credentials": "include",
    "headers": {
      "accept": "application/vnd.linkedin.normalized+json+2.1",
      "accept-language": "en-US,en;q=0.9",
      "csrf-token": reg(/ajax:\d+/.exec(document.cookie), 0),
      "x-li-lang": "en_US",
      "x-li-page-instance": "urn:li:page:d_flagship3_profile_view_base;" + trackingId,
      "x-li-track": "{\"clientVersion\":\"" + clientVersion + "\",\"osName\":\"web\",\"timezoneOffset\":" + timeOffset + ",\"deviceFormFactor\":\"DESKTOP\",\"mpName\":\"voyager-web\"}",
      "x-restli-protocol-version": "2.0.0"
    },
    "referrer": "https://www.linkedin.com/in/" + pubId + "/",
    "referrerPolicy": "no-referrer-when-downgrade",
    "body": null,
    "method": "GET",
    "mode": "cors"
  };
}

function parseTimePeriod(obj) {
  var startObj = obj && obj.startDate ? obj.startDate : '';
  var endObj = obj && obj.endDate ? obj.endDate : '';
  var startM = startObj.month ? startObj.month : 1;
  var startY = startObj.year ? startObj.year : new Date().getFullYear();
  var endM = endObj.month ? endObj.month : (new Date().getMonth() + 1);
  var endY = endObj.year ? endObj.year : 'Present';
  var startDate = new Date(startM + '-28-' + startY).getTime();
  var endDate = endY == 'Present' ? new Date().getTime() : new Date(endM + '-28-' + endY).getTime();
  return [startDate, endDate];
}

function parseBasics(obj) {
console.log(obj);
  var d = obj.data;
  var summarycheckemail = d.summary ? reg(/\b[\w\.\-\+]+@[\w\-]+\.[a-zA-Z]{2,13}(\.[a-zA-Z]{2,13}|\b)/.exec(d.summary),0) : '';

  var o = {
    email: summarycheckemail,
    pid: obj.included && obj.included[0] ? obj.included[0].publicIdentifier : '',
    firs: d.firstName ? d.firstName : '',
    last: d.lastName ? d.lastName : '',
    geo: d.locationName ? d.locationName : '',
  };
  var oc = cleanObject(o);
  return oc;
}

function parseContactInfo(obj) {
  var d = obj.data;
  var phones = d.phoneNumbers ? d.phoneNumbers.map(i => i.number) : [];
  var twitters = d.twitterHandles ? d.twitterHandles.map(i => i.name) : [];
  var websites = d.websites ? d.websites.map(i => i.url) : [];
  var o = {
    email: d.emailAddress ? d.emailAddress : '',
    phone: phones.toString(),
    twit: twitters.toString(),
    web: websites.toString(),
  };
  var oc = cleanObject(o);
  return oc;
}

function parseEmployment(obj) {
  var arr = obj.included.filter(i => i.title);
  var temp = [];
  for (var i = 0; i < arr.length; i++) {
    var obj = {
      title: arr[i].title,
      name: arr[i].companyName ? arr[i].companyName : '',
      cid: arr[i].companyUrn ? arr[i].companyUrn.replace(/\D+/g, '') : '',
      geo: arr[i].geoLocationName,
      start: parseTimePeriod(arr[i].timePeriod)[0],
      end: parseTimePeriod(arr[i].timePeriod)[1],
      mos: milsec2Month(parseTimePeriod(arr[i].timePeriod)[1] - parseTimePeriod(arr[i].timePeriod)[0])
    };
    var oc = cleanObject(obj)
    temp.push(oc);
  }
  temp.sort((a, b) => a.endDate - b.endDate);
  temp.reverse();
  return temp;
}

function parseEducation(obj) {
  console.log(obj);
  var named = obj.included.filter(itm => itm.logo);
  var arr = obj.included.filter(el => el.degreeName != undefined || el.schoolUrn != undefined);
  var temp = [];
  for (var i = 0; i < arr.length; i++) {
    var eduMatch = named.filter(itm => arr[i].schoolUrn && itm.objectUrn.replace(/\D+/g, '') == arr[i].schoolUrn.replace(/\D+/g, ''));
    var eduLogo = eduMatch.length > 0 && eduMatch[0].logo ? eduMatch[0].logo.rootUrl + eduMatch[0].logo.artifacts[0].fileIdentifyingUrlPathSegment : 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    var eduName = eduMatch.length > 0 && eduMatch[0].schoolName ? eduMatch[0].schoolName : '';

    var timePeriod = arr[i].timePeriod ? arr[i].timePeriod : null;
    var start = timePeriod ? timePeriod.startDate : null;
    var end = timePeriod ? timePeriod.endDate : null;
    var endY = end ? end.year : null;
    var startY = start ? start.year : null;
    var o = {
      name: eduName ? eduName : arr[i].schoolName,
      deg: arr[i].degreeName ? arr[i].degreeName : '',
      fos: arr[i].fieldOfStudy ? arr[i].fieldOfStudy : '',
      start: startY ? startY : '',
      end: endY ? endY : ''
    };
    var oc = cleanObject(o)
    temp.push(oc);
  }
  temp.sort((a, b) => a.endYear - b.endYear);
  return temp;
}

function parseSkills(obj) {
  return obj.included.length > 0 ? obj.included.map(i => i.name) : [];
}

function parseLanguages(obj) {
  return obj.included.length ? obj.included.map(i => {
    var o = {
      name: i.name ? i.name : '',
      prof: i.proficiency ? i.proficiency : ''
    };
    var oc = cleanObject(o);
    return oc;
  }) : [];
}


async function getBasics(pubId) {
  var res = await fetch("https://www.linkedin.com/voyager/api/identity/profiles/" + pubId + "/", creds(pubId));
  var d = await res.json();
  return parseBasics(d);
}

async function getEmployments(pubId) {
  var res = await fetch("https://www.linkedin.com/voyager/api/identity/profiles/" + pubId + "/positionGroups?start=0&count=20", creds(pubId));
  var d = await res.json();
  return parseEmployment(d);
}

async function getContactInfo(pubId) {
  var res = await fetch("https://www.linkedin.com/voyager/api/identity/profiles/" + pubId + "/profileContactInfo", creds(pubId));
  var d = await res.json();
  return parseContactInfo(d);
}

async function getEducations(pubId) {
  var res = await fetch("https://www.linkedin.com/voyager/api/identity/profiles/" + pubId + "/educations?count=10&start=0", creds(pubId));
  var d = await res.json();
  return parseEducation(d);
}

async function getSkills(pubId) { 
  var res = await fetch("https://www.linkedin.com/voyager/api/identity/profiles/" + pubId + "/skills?count=50&start=0", creds(pubId));
  var d = await res.json();
  return parseSkills(d);
}
async function getSkills2(pubId,len){
  if(len > 49){
    var res = await fetch("https://www.linkedin.com/voyager/api/identity/profiles/"+pubId+"/skills?count=50&start=50", creds(pubId));
    var d = await res.json();
    return parseSkills(d);
  }else{return []}
}

async function getLanguages(pubId) {
  var res = await fetch("https://www.linkedin.com/voyager/api/identity/profiles/" + pubId + "/languages?count=50&start=0", creds(pubId));
  var d = await res.json();
  return parseLanguages(d);
}
var cleanObject = (ob) =>
  Object.entries(ob).reduce((r, [k, v]) => {
    if (v) {
      r[k] = v;
      return r;
    } else {
      return r;
    }
  }, {});

async function getFullProfileObject(pubId) {
  var basics = await getBasics(pubId);
  var contact = await getContactInfo(pubId);
  var jobs = await getEmployments(pubId);
  var edus = await getEducations(pubId);
  var skills = await getSkills(pubId);
  var langs = await getLanguages(pubId);
  var skills = await getSkills(pubId);
console.log(skills.length)
  var skills2 = await getSkills2(pubId,skills.length);
console.log(skills)
console.log(skills2)
  var sk = skills.concat(skills2);
  
  var obj = {
      basics: basics,
      contact: contact,
      jobs: jobs,
      edus: edus,
      skills: sk,
      langs: langs
  };
console.log(obj);
  return obj;
}

function trunkJSONP(obj){
  var basics = '';
}

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

function loadingElm() {
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
async function createUIHTML(){
  if(gi(document,'confirm_details_cont')) gi(document,'confirm_details_cont').outerHTML = '';
  var cont = ele('div');
  attr(cont,'id','confirm_details_cont');
  attr(cont,'style', `position: fixed; top: 120px; left: 120px; width: 480px; height: 480px; z-index: ${new Date().getTime()};`);
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
  var details = await getFullProfileObject(reg(/linkedin\.com\/in\/(.+?)\//.exec(window.location.href), 1));
  var email_ = details.contact.email;
  var phone_ = details.contact.phone;
  killLoader();
  attr(send,'json_data',JSON.stringify(details));
  send.onclick = updateDataInObj;
  cls.onclick = () => {
	gi(document,'confirm_details_cont').outerHTML = '';
  };

  if(phone_) phone.value = phone_;
  if(email_) email.value = email_;

} 

function updateDataInObj(){
  var dat = JSON.parse(this.getAttribute('json_data'));
  var phone = gi(document,'confirm_phone').value;
  var email = gi(document,'confirm_email').value;
  var note = gi(document,'confirm_note').value;
  if(phone) dat.contact.phone = phone;
  if(email) dat.contact.email = email;
  if(note) dat['note'] = note;
  dat['from'] = 'linkedin';
  console.log(encodeURIComponent(JSON.stringify(dat)).length);
  window.open(yourAppsScriptURL+'oo='+encodeURIComponent(JSON.stringify(dat)));
}

createUIHTML()
