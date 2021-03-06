// copy paste this script into google scripts, publish as web app, add URL to localhost. boom.

function doGet(e) {
  var content = {"notes": getNotes()}
  return ContentService.createTextOutput(JSON.stringify(content))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var data = JSON.parse(e.postData.contents);
  getProps().setProperty(data[0], data[1]);
  return ContentService.createTextOutput(data);
}

function getNotes(){
  const props = getProps().getProperties();
  const note_ids = JSON.parse(props.note_ids) || [];
  return note_ids.map((note_id, idx) => {
    return {id: note_id, content: props[note_id]};
  })
}

/* DANGER ZONE
function clearProps(){
  getProps().deleteAllProperties();
  initProps()
}

function initProps(){
  getProps().setProperty('note_ids', '[]');
}
/**/

function getProps(){
  return PropertiesService.getScriptProperties()
}
