// File: boardLayout.js

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const boardId = urlParams.get('boardId');
    const closeBoardBtn = document.querySelector('img[alt="Close this board"]').closest('div');
    const confirmModal = document.querySelector('.slideBarCloseBoard');
    const confirmBtn = document.querySelector('.buttonFooterAlert button:first-child');
    const cancelBtn = document.querySelector('.buttonFooterAlert button:last-child');

    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
    const board = currentUser.boards?.find(b => b.id === boardId);

    if (!board) {
        alert('Board không tồn tại!');
        window.location.href = 'dashboard.html';
        return;
    }

    document.querySelector('.headerMain span:first-of-type').textContent = board.title;

    closeBoardBtn.addEventListener('click', (e) => {
        e.preventDefault();
        confirmModal.style.display = 'flex';
    });

    confirmBtn.addEventListener('click', () => {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        currentUser.boards = currentUser.boards.filter(b => b.id !== boardId);
        const updatedUsers = users.map(user =>
            user.id === currentUser.id ? currentUser : user
        );
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        window.location.href = 'dashboard.html';
    });

    cancelBtn.addEventListener('click', () => {
        confirmModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === confirmModal) {
            confirmModal.style.display = 'none';
        }
    });

    const addListBtn = document.querySelector('.addList');
    const addListModal = document.querySelector('.addListModal');
    const listTitleInput = addListModal.querySelector('input');
    const closeListModalBtn = addListModal.querySelector('.buttonAddListModal img');
    const addListSubmitBtn = addListModal.querySelector('.buttonAddListModal button');
    const listsContainer = document.querySelector('.listsContainer');

    const saveData = () => {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const updatedUsers = users.map(user =>
            user.id === currentUser.id ? currentUser : user
        );
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        localStorage.setItem('users', JSON.stringify(updatedUsers));
    };

    const renderLists = () => {
        listsContainer.innerHTML = '';
        board.lists?.forEach(list => {
            const listHTML = `
<div class="toDoList" data-id="${list.id}">
  <div class="headerToDo">
    <span>${list.title}</span>
    <img class="list-options-btn" src="../assets/imgs/fonts/icons/baChamIcon.png" alt="">
    <div class="list-options-menu" style="display: none;">
      <div class="edit-list">✏️ Edit</div>
      <div class="delete-list">🗑️ Delete</div>
    </div>
  </div>
  <div class="bodyToDo">
    ${list.tasks?.map(task => `
      <div class="itemToDo" data-id="${task.id}">
        <img src="../assets/imgs/fonts/icons/vButton.png" alt="">
        <span>${task.title}</span>
      </div>
    `).join('') || ''}
    <div class="footerToDoList">
      <div>
        <div class="addCardTrigger">
          <img src="../assets/imgs/fonts/icons/add.png" alt="">
          <span>Add a card</span>
        </div>
      </div>
    </div>
  </div>
</div>`;
            listsContainer.insertAdjacentHTML('beforeend', listHTML);
        });
    };

    renderLists();

    addListBtn.addEventListener('click', () => {
        addListModal.style.display = 'block';
        listTitleInput.focus();
    });

    const closeListModal = () => {
        addListModal.style.display = 'none';
        listTitleInput.value = '';
    };

    closeListModalBtn.addEventListener('click', closeListModal);
    addListSubmitBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const title = listTitleInput.value.trim();
        if (!title) return alert('Vui lòng nhập tên danh sách');

        if (!board.lists) board.lists = [];
        board.lists.push({ id: Date.now().toString(), title, tasks: [] });

        saveData();
        closeListModal();
        renderLists();
    });

    window.addEventListener('click', (e) => {
        if (e.target === addListModal) closeListModal();
    });

    const addCardModal = document.querySelector('.addCard');
    const addCardInput = addCardModal.querySelector('input');
    const addCardBtn = addCardModal.querySelector('button');
    const closeAddCardBtn = addCardModal.querySelector('img');
    let currentListId = null;

    listsContainer.addEventListener('click', (e) => {
        const taskElement = e.target.closest('.itemToDo');
        if (taskElement) {
            const taskId = taskElement.dataset.id;
            window.location.href = `taskDetailModal.html?taskId=${taskId}&boardId=${boardId}`;
        }
        if (e.target.closest('.footerToDoList')) {
            const toDoList = e.target.closest('.toDoList');
            currentListId = toDoList.dataset.id;
            const rect = toDoList.getBoundingClientRect();
            addCardModal.style.display = 'block';
            addCardModal.style.top = `${rect.bottom + window.scrollY}px`;
            addCardModal.style.left = `${rect.left}px`;
            addCardInput.focus();
        }

        const optionsBtn = e.target.closest('.list-options-btn');
        if (optionsBtn) {
            const menu = optionsBtn.parentElement.querySelector('.list-options-menu');
            document.querySelectorAll('.list-options-menu').forEach(m => m.style.display = 'none');
            menu.style.display = 'block';
        }

        const editBtn = e.target.closest('.edit-list');
        if (editBtn) {
            const listEl = editBtn.closest('.toDoList');
            const listId = listEl.dataset.id;
            const list = board.lists.find(l => l.id === listId);
            const newTitle = prompt('Nhập tiêu đề mới:', list.title);
            if (newTitle?.trim()) {
                list.title = newTitle.trim();
                saveData();
                renderLists();
            }
        }

        const deleteBtn = e.target.closest('.delete-list');
        if (deleteBtn) {
            const listEl = deleteBtn.closest('.toDoList');
            const listId = listEl.dataset.id;
            if (confirm('Bạn có chắc muốn xóa danh sách này?')) {
                board.lists = board.lists.filter(l => l.id !== listId);
                saveData();
                renderLists();
            }
        }
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.headerToDo')) {
            document.querySelectorAll('.list-options-menu').forEach(m => m.style.display = 'none');
        }
    });

    const closeCardModal = () => {
        addCardModal.style.display = 'none';
        addCardInput.value = '';
        currentListId = null;
    };

    closeAddCardBtn.addEventListener('click', closeCardModal);
    window.addEventListener('click', (e) => {
        if (e.target === addCardModal) closeCardModal();
    });

    addCardBtn.addEventListener('click', () => {
        const title = addCardInput.value.trim();
        if (!title || !currentListId) return;

        const list = board.lists.find(l => l.id === currentListId);
        if (!list) return;

        const task = { id: Date.now().toString(), title };
        list.tasks.push(task);
        saveData();
        renderLists();
        closeCardModal();
    });
});
