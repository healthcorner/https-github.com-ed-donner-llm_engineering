# To-do list

A simple browser to-do list. Add tasks, check them off, filter by status, and
clear the ones you have finished. Everything is stored in `localStorage`, so it
stays on this device and does not need a backend.

## Run

Open `todo-list/index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8080
```

Then visit [http://localhost:8080/todo-list/](http://localhost:8080/todo-list/).

## Features

- Add a task with **Enter** or the Add button
- Mark a task complete
- Delete a task
- Filter All / Open / Done
- Clear completed tasks
- Remembers tasks after a reload
