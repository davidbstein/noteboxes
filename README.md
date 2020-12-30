# noteboxes
A notetaking / todo list app that gets everything onto the screen if it can. Because scrolling around a TODO list is frustrating, and kanban is WAY too much overhead.

# Setup
1. copy `backend.gs` into a new project on script.google.com; deploy as webapp, global permissions.
1. run the init script.
1. fork this repo, go to settings, turn on github pages.
1. go to the page, add the URL of your backend to localStorage under the key "BACKEND"

# Use
You can edit notes by clicking on them. All valid github-style markdown works.

You can add notes with the "add note" button at the bottom.

You can rearrange and hide notes by making a list of the note ids you want to see and running the `save_order` command.

That's it.

# bookmarklet

To enable a browser, I use a bookmarklet: 
```
javascript:window.localStorage.setItem('BACKEND', <BACKEND URL>)
```
Since my browser syncs by bookmarks, this is an easy way to give a computer access.
