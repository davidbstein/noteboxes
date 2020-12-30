const DATA={};
const MD = new showdown.Converter({
  backslashEscapesHTMLTags: false,
  completeHTMLDocument: false,
  disableForced4SpacesIndentedSublists: true,
  emoji: true,
  encodeEmails: true,
  excludeTrailingPunctuationFromURLs: false,
  ghCodeBlocks: true,
  ghCompatibleHeaderId: false,
  ghMentions: false,
  ghMentionsLink: "https://github.com/{u}",
  headerLevelStart: false,
  literalMidWordAsterisks: false,
  literalMidWordUnderscores: false,
  metadata: false,
  noHeaderId: false,
  omitExtraWLInCodeBlocks: false,
  openLinksInNewWindow: false,
  parseImgDimensions: false,
  prefixHeaderId: false,
  rawHeaderId: false,
  rawPrefixHeaderId: false,
  requireSpaceBeforeHeadingText: false,
  simpleLineBreaks: false,
  simplifiedAutoLink: false,
  smartIndentationFix: false,
  smoothLivePreview: false,
  splitAdjacentBlockquotes: false,
  strikethrough: true,
  tables: true,
  tablesHeaderId: false,
  tasklists: true,
  underline: false
});

function redraw(){
  const containter = document.getElementById("container")
  container.innerHTML = (
    DATA.notes.map(
      (note) => `<div class="note" id="note-${note.id}" note-id=${note.id}>
          <div class="edit-view hidden"><textarea>${note.content}</textarea></div>
          <div class="content">${MD.makeHtml(note.content)}</div>
        </div>`).join('')
    +"<button id='addnote' onclick=addNote()>Add Note</button>"
    );
  let el;
  for (el of document.getElementsByClassName("note")){
    const ta = el.getElementsByTagName('textarea')[0]
    el.addEventListener("click", focusHandler.bind(this, el, ta));
    ta.onblur = focusLossHandler.bind(this, el, ta);
    ta.oninput = typingHandler.bind(this, el, ta);
  }
  for (el of document.getElementsByTagName("input")){
    if (el.type=="checkbox" && el.checked) {
      el.parentElement.classList.add('completed-task')
    }
  }
}

async function addNote(){
  document.getElementById("addnote").classList.add("hidden")
  const id_list = DATA.notes.map(note=>note.id)
  let id = _.max(id_list)+1;
  id = id<0?0:id;
  id_list.push(id)
  await save_note(id, `#Note ${id}\n\ncontent.`);
  await save_order(id_list);
  reloadEverything();
  document.getElementById("addnote").classList.remove("hidden")
}

function focusHandler(el, ta, e){
  el.getElementsByClassName("edit-view")[0].classList.remove("hidden")
  el.getElementsByClassName("content")[0].classList.add("hidden")

  ta.focus()
}

function focusLossHandler(el, ta, e){
  el.getElementsByClassName("edit-view")[0].classList.add("hidden")
  el.getElementsByClassName("content")[0].classList.remove("hidden")
  note_id = el.getAttribute("note-id")
  value = ta.value
  save_note(note_id, value)
}

const typingHandler = _.debounce(function(el, ta, e){
  note_id = el.getAttribute("note-id")
  value = ta.value
  render(el.getElementsByClassName("content")[0], value)
}, 500)

function archiveNote(){

}

function render(target, content){
  target.innerHTML = MD.makeHtml(content);
}

async function save_order(id_list){
  await post_data("note_ids", JSON.stringify(id_list))
}

async function save_note(id, content){
  await post_data(id, content)
}

async function post_data(key, value){
  await fetch(new Request(BACKEND,
      params={
        method:"POST",
        mode:'no-cors',
        headers: {"Content-Type": "applicationb/json"},
        body:JSON.stringify([key, value])
      }
    ))
}

async function get_notes(){
  return (await (await fetch(new Request(BACKEND,
      params={
        method:"GET",
      }
    ))).json()).notes
}

function reloadEverything(){
  get_notes().then((notes)=>{
    DATA.notes=notes;
    redraw();
  });
}