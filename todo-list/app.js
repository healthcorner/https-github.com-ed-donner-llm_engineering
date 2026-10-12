(() => {
  const STORAGE_KEY = "simple-todo-list";

  const form = document.querySelector("#new-todo-form");
  const input = document.querySelector("#new-todo");
  const list = document.querySelector("#todo-list");
  const emptyMessage = document.querySelector("#empty-message");
  const statusCount = document.querySelector("#status-count");
  const clearCompleted = document.querySelector("#clear-completed");
  const heading = document.querySelector("#today-heading");
  const filterButtons = document.querySelectorAll("[data-filter]");

  let todos = loadTodos();
  let filter = "all";

  heading.textContent = formatToday();
  render();
  input.focus();

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = input.value.trim();
    if (!text) {
      return;
    }

    todos = [
      {
        id: crypto.randomUUID(),
        text,
        done: false,
        createdAt: Date.now(),
      },
      ...todos,
    ];
    persist();
    input.value = "";
    render();
    input.focus();
  });

  list.addEventListener("change", (event) => {
    const checkbox = event.target.closest("input[type='checkbox']");
    if (!checkbox) {
      return;
    }
    const id = checkbox.closest(".todo-item").dataset.id;
    todos = todos.map((todo) =>
      todo.id === id ? { ...todo, done: checkbox.checked } : todo
    );
    persist();
    render();
  });

  list.addEventListener("click", (event) => {
    const button = event.target.closest(".delete-btn");
    if (!button) {
      return;
    }
    const id = button.closest(".todo-item").dataset.id;
    todos = todos.filter((todo) => todo.id !== id);
    persist();
    render();
  });

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filter = button.dataset.filter;
      render();
    });
  });

  clearCompleted.addEventListener("click", () => {
    todos = todos.filter((todo) => !todo.done);
    persist();
    render();
  });

  function render() {
    const visible = todos.filter((todo) => {
      if (filter === "active") return !todo.done;
      if (filter === "completed") return todo.done;
      return true;
    });
    const remaining = todos.filter((todo) => !todo.done).length;
    const completed = todos.length - remaining;

    statusCount.textContent =
      remaining === 1 ? "1 task left" : `${remaining} tasks left`;

    filterButtons.forEach((button) => {
      const active = button.dataset.filter === filter;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });

    list.replaceChildren(
      ...visible.map((todo) => {
        const item = document.createElement("li");
        item.className = `todo-item${todo.done ? " is-done" : ""}`;
        item.dataset.id = todo.id;

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = todo.done;
        checkbox.id = `todo-${todo.id}`;
        checkbox.setAttribute("aria-label", `Mark “${todo.text}” complete`);

        const label = document.createElement("label");
        label.htmlFor = checkbox.id;
        label.textContent = todo.text;

        const remove = document.createElement("button");
        remove.type = "button";
        remove.className = "delete-btn";
        remove.setAttribute("aria-label", `Delete “${todo.text}”`);
        remove.textContent = "×";

        item.append(checkbox, label, remove);
        return item;
      })
    );

    const emptyText = emptyCopy(visible.length, todos.length, filter);
    emptyMessage.hidden = !emptyText;
    emptyMessage.textContent = emptyText;

    clearCompleted.hidden = completed === 0;
  }

  function emptyCopy(visibleCount, totalCount, currentFilter) {
    if (visibleCount > 0) {
      return "";
    }
    if (totalCount === 0) {
      return "Nothing here yet. Add a task above.";
    }
    if (currentFilter === "active") {
      return "Every task is done.";
    }
    if (currentFilter === "completed") {
      return "No completed tasks yet.";
    }
    return "";
  }

  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }

  function loadTodos() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return [];
      }
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        return [];
      }
      return parsed.filter(
        (todo) =>
          todo &&
          typeof todo.id === "string" &&
          typeof todo.text === "string" &&
          typeof todo.done === "boolean"
      );
    } catch {
      return [];
    }
  }

  function formatToday() {
    return new Intl.DateTimeFormat(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
    }).format(new Date());
  }
})();
