document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const taskId = urlParams.get('taskId');
    const boardId = urlParams.get('boardId');

    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
    const board = currentUser.boards?.find(b => b.id === boardId);

    if (!board) {
        alert('Board không tồn tại!');
        window.location.href = 'dashboard.html';
        return;
    }

    let foundTask = null;
    let foundList = null;

    for (const list of board.lists) {
        const task = list.tasks.find(t => t.id === taskId);
        if (task) {
            foundTask = task;
            foundList = list;
            break;
        }
    }

    if (!foundTask) {
        alert('Task không tồn tại!');
        window.location.href = 'boardLayout.html?boardId=' + boardId;
        return;
    }


    document.querySelector('.process span:first-child').textContent = foundTask.title;
    document.querySelector('.process span:nth-child(2)').textContent = `in list ${foundList.title}`;
    const textarea = document.querySelector('#processText');
    textarea.value = foundTask.description || "";

    document.querySelector('.buttonTaskModalFooter button:first-child').addEventListener('click', () => {
        foundTask.description = textarea.value;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        alert('Đã lưu!');
    });

    document.querySelector('.buttonTaskModalFooter button:last-child').addEventListener('click', () => {
        textarea.value = foundTask.description || "";
    });

    const deleteImg = document.querySelector('img[alt="Delete Task"]');
    if (deleteImg) {
        deleteImg.addEventListener('click', () => {
            const confirmed = confirm('Bạn có chắc muốn xoá task này không?');
            if (!confirmed) return;


            foundList.tasks = foundList.tasks.filter(t => t.id !== taskId);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));

            alert('Đã xoá task!');
            window.location.href = `boardLayout.html?boardId=${boardId}`;
        });
    } else {
        console.warn('Không tìm thấy nút xoá task với alt="Delete Task"');
    }
    const updateButton = document.querySelector('.updateButtonTask');
    const titleSpan = document.querySelector('.process span:first-child');
    updateButton.addEventListener('click', () => {
        const currentTitle = titleSpan.textContent;
        const newTitle = prompt('Nhập tên mới cho task:', currentTitle);

        if (newTitle !== null) {
            const trimmedTitle = newTitle.trim();
            if (trimmedTitle === '') {
                alert('Tên task không được để trống!');
                return;
            }

            foundTask.title = trimmedTitle;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            titleSpan.textContent = trimmedTitle;
        }
    });

});










