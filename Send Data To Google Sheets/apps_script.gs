var ss = SpreadsheetApp.openById('1x535R9j_VOgoXeU77nWMcySkTJzbjETwoRjrCBzWMZA');
var li_s = ss.getSheetByName('LinkedIn');
var gh_s = ss.getSheetByName('github');
var r_s = ss.getSheetByName('resumes');

var emailx = /\b[\w\.\-\+]+@[\w\-]+\.[a-zA-Z]{2,13}(\.[a-zA-Z]{2,13}|\b)/;
var phonex = /\b[2-9]\d{2}\){0,1}\W{0,1}\d{3}\W{0,1}\d{4}\b/;

function reg(o,n){if(o){return o[n].trim()}else{return '';}}
function flat(arr){  return arr.map(function(t){ return t[0]; });}
function arr(table){  var t  = [];  for(var i=0; i<table.length; i++){t.push(table[i])}  return t; }
//function fixCase(s){  return s.replace(/\w\S*/g, function(txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()} );}
function unq(arr){ return arr.filter(function(e, p, a) { return a.indexOf(e) == p }) }
function objEntries(obj){  
  var entries = typeof obj == 'object' ? Object.keys(obj).map(function(el){ return [el,obj[el]] }) : []; 
  return entries;
}
function fixCase(s){
  return s.split(/\b-\b/).map(function(el){ 
	return el.replace(/\w\S*/g, function(txt){ 
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    })
  }).join('-');
}

function getTableValuesBy(sheet){  return sheet.getRange(1,1,sheet.getLastRow(),sheet.getLastColumn()).getValues(); }
function getColIndexBy(table,headerName){  return arr(table[0]).indexOf(headerName); }

function getFolderIdByName(x){
  var folders = DriveApp.getFolders();
  while (folders.hasNext()) {
    var folder = folders.next();
    if(x.test(folder.getName())){
      return folder.getId();
    }
  }
}

function insertRowByColumnLooper(sheet,arr,row){
  var table = getTableValuesBy(sheet); 
  for(var i=0; i<arr.length; i++){
    var colIndex = getColIndexBy(table,arr[i][0]); 
    if(colIndex > -1){ //insures we found a matching headername   
      sheet.getRange(row, (colIndex+1)).setValue(arr[i][1]);
    }
  }
}

function monthYear(s){
  var now = new Date();
  var months = 'Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec'.split(/,/); //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split
  var dateObj = new Date(s);
  var date = dateObj.getDate();
  if(date == now.getDate()){ //if the timestamp is today, change date to "Present", else return the Month Year
    return "Present";
  }else{
    var month = dateObj.getMonth(); //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getMonth
    var year = dateObj.getFullYear(); //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getFullYear
    var mo_yr = months[month] +' '+ year; 
    return mo_yr;
  }
}
function parseDateAsReadable(date){
  var d = new Date(date);
  var dom = d.getDate();
  var m = d.getMonth() +1;
  var y = d.getFullYear();
  var t = d.toTimeString().replace(/\s+.+/,'')
  return m+'/'+dom+'/'+y+' '+t;
}


function doGet(e){
  function doubleCheck(obj,obc){return obj && obc ? obc : '';}
  var lr = li_s.getLastRow();
  var dat = JSON.parse(decodeURIComponent(e.parameter.oo));

  if(dat.from == 'linkedin'){
    var note = dat.note ? dat.note : ''; 
    var id = dat.basics && dat.basics.pid ? dat.basics.pid : '';
    var firstname = dat.basics && dat.basics.firs ? dat.basics.firs : '';
    var lastname = dat.basics && dat.basics.last ? dat.basics.last : '';
    var geo = dat.basics && dat.basics.geo ? dat.basics.geo : '';
    var email1 = dat.basics && dat.basics.email ?dat.basics.email : '';
    
    var linkedin = 'http://www.linkedin.com/in/' + id;
    var email2 = email1 ? email1 : dat.contact && dat.contact.email ? dat.contact.email : '';
    var phone = dat.contact && dat.contact.phone ? dat.contact.phone : '';
    var twitter = dat.contact && dat.contact.twit ? dat.contact.twit : '';
    var web = dat.contact && dat.contact.web ? dat.contact.web : '';
    
    var title1 = dat.jobs[0] && dat.jobs[0].title ? dat.jobs[0].title : '';
    var companyname1 = dat.jobs[0] && dat.jobs[0].name ? dat.jobs[0].name : '';
    var cid1 = dat.jobs[0] && dat.jobs[0].cid ? 'https://www.linkedin.com/company/'+dat.jobs[0].cid : '';
    var geo1 = dat.jobs[0] && dat.jobs[0].geo ? dat.jobs[0].geo : '';
    var start1 = dat.jobs[0] && dat.jobs[0].start ? monthYear(dat.jobs[0].start) : '';
    var end1 = dat.jobs[0] && dat.jobs[0].end ? monthYear(dat.jobs[0].end) : '';
    var mos1 = dat.jobs[0] && dat.jobs[0].mos ? dat.jobs[0].mos : '';
  
    var title2 = dat.jobs[1] && dat.jobs[1].title ? dat.jobs[1].title : '';
    var companyname2 = dat.jobs[1] && dat.jobs[1].name ? dat.jobs[1].name : '';
    var cid2 = dat.jobs[1] && dat.jobs[1].cid ? 'https://www.linkedin.com/company/'+dat.jobs[1].cid : '';
    var geo2 = dat.jobs[1] && dat.jobs[1].geo ? dat.jobs[1].geo : '';
    var start2 = dat.jobs[1] && dat.jobs[1].start ? monthYear(dat.jobs[1].start) : '';
    var end2 = dat.jobs[1] && dat.jobs[1].end ? monthYear(dat.jobs[1].end) : '';
    var mos2 = dat.jobs[1] && dat.jobs[1].mos ? dat.jobs[1].mos : '';
  
    var eduname1 = dat.edus[0] && dat.edus[0].name ? dat.edus[0].name : '';
    var degreename1 = dat.edus[0] && dat.edus[0].deg ? dat.edus[0].deg : '';
    var field1 = dat.edus[0] && dat.edus[0].fos ? dat.edus[0].fos : '';
    var startedu1 = dat.edus[0] && dat.edus[0].start ? dat.edus[0].start : '';
    var endedu1 = dat.edus[0] && dat.edus[0].end ? dat.edus[0].end : '';
  
    var eduname2 = dat.edus[1] && dat.edus[1].name ? dat.edus[1].name : '';
    var degreename2 = dat.edus[1] && dat.edus[1].deg ? dat.edus[1].deg : '';
    var field2 = dat.edus[1] && dat.edus[1].fos ? dat.edus[1].fos : '';
    var startedu2 = dat.edus[1] && dat.edus[1].start ? dat.edus[1].start : '';
    var endedu2 = dat.edus[1] && dat.edus[1].end ? dat.edus[1].end : '';
    var skills = dat.skills.length ? JSON.stringify(dat.skills) : '';
    var langs = dat.langs.length ? JSON.stringify(dat.langs) : '';

    var r_basic = [id,new Date(),note,firstname,lastname,geo,linkedin,email2,phone,twitter,web,
  title1,companyname1,cid1,geo1,start1,end1,mos1,title2,companyname2,cid2,geo2,start2,end2,mos2,
  eduname1,degreename1,field1,startedu1,endedu1,eduname2,degreename2,field2,startedu2,endedu2,skills,langs
  ];
    var row = [r_basic];
    li_s.getRange((lr+1),1,row.length,row[0].length).setValues(row);
return HtmlService.createHtmlOutput('<div style="background: #004471; color: #fff; width: 800px; height: 600px;"><div>'+firstname+' '+lastname+' was added to your <a style="color: #fcba03;" href="https://docs.google.com/spreadsheets/d/1x535R9j_VOgoXeU77nWMcySkTJzbjETwoRjrCBzWMZA">spreadsheet</a></div></div>')
  }//if from Linkedin

  if(dat.from == 'github'){
    var lr = gh_s.getLastRow();
    var first = reg(/^\S+/.exec(dat.fullname),0);
    var last = reg(/\s+\S+$/.exec(dat.fullname),0);
    var active = dat.percent_active ? dat.percent_active+'%' : '';
    var r_basic = [dat.link,first,last,dat.phone,dat.email,new Date(),'https://github.com/'+dat.link,dat.geo,dat.worksFor,dat.langs,dat.num_commits,active,dat.website,dat.note];
    var row = [r_basic];  
    gh_s.getRange((lr+1),1,row.length,row[0].length).setValues(row);
    return HtmlService.createHtmlOutput('<div style="background: #004471; color: #fff; width: 800px; height: 600px;"><div>'+dat.fullname+' was added to your <a style="color: #fcba03;" href="https://docs.google.com/spreadsheets/d/1x535R9j_VOgoXeU77nWMcySkTJzbjETwoRjrCBzWMZA">spreadsheet</a></div></div>');
  }// if from github

  if(dat.from == 'search'){
    var targetFolderX = /SOSU Resume Parse/;
    var targetFolderId = getFolderIdByName(targetFolderX);
    var files = targetFolderId.getFiles();
    while (files.hasNext()) {
      var file = files.next();
      Logger.log(file.getName());
    
    booleanSearch(dat.search, file)
  }
  }
}//doGet()
