document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const taskId = urlParams.get('taskId');
    const boardId = urlParams.get('boardId');

    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
    const board = currentUser.boards?.find(b => b.id === boardId);

    if (!board) {
        showCustomAlert('Board không tồn tại!');
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
        showCustomAlert('Task không tồn tại!');
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
        showCustomAlert('Đã lưu!');
    });

    document.querySelector('.buttonTaskModalFooter button:last-child').addEventListener('click', () => {
        textarea.value = foundTask.description || "";
    });

    // XỬ LÝ MODAL XÁC NHẬN XOÁ
    const deleteBtn = document.querySelector('img.delete-task-btn');
    const modalDelete = document.querySelector('.slideBarCloseBoard');
    const confirmDelete = document.getElementById('confirmDelete');
    const cancelDelete = document.getElementById('cancelDelete');

    // Fix lỗi hiển thị modal xoá lúc load trang
    if (modalDelete) {
        modalDelete.style.display = 'none';
    }

    if (deleteBtn) {
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            modalDelete.style.display = 'block';
        });
    }

    confirmDelete.addEventListener('click', () => {
        foundList.tasks = foundList.tasks.filter(t => t.id !== taskId);
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        modalDelete.style.display = 'none';
        window.location.href = `boardLayout.html?boardId=${boardId}`;
    });

    cancelDelete.addEventListener('click', () => {
        modalDelete.style.display = 'none';
    });

    // Đổi tên task
    const updateButton = document.querySelector('.updateButtonTask');
    const titleSpan = document.querySelector('.process span:first-child');
    updateButton.addEventListener('click', () => {
        openUpdateTaskNameModal(taskId, foundTask.title); // Mở modal cập nhật tên task
    });
});

// Hàm hiển thị custom alert
function showCustomAlert(message) {
    const alertModal = document.getElementById('customAlert');
    const alertMessage = document.getElementById('alertMessage');
    alertMessage.textContent = message;
    alertModal.style.display = 'block';

    const closeBtn = document.getElementById('alertCloseBtn');
    closeBtn.addEventListener('click', () => {
        alertModal.style.display = 'none';
    });

    // Tự động đóng sau 3s (tuỳ chọn)
    setTimeout(() => {
        alertModal.style.display = 'none';
    }, 3000);
}

// Mở modal cập nhật tên task
function openUpdateTaskNameModal(taskId, currentTaskName) {
    const modal = document.querySelector('.modal-update-task-name'); // Lấy modal
    const taskNameInput = document.getElementById('task-name-input'); // Lấy ô nhập tên task
    const updateButton = document.getElementById('update-task-name-btn'); // Lấy nút cập nhật
    const cancelButton = document.getElementById('cancel-update-btn'); // Lấy nút hủy

    // Đặt tên task hiện tại vào input
    taskNameInput.value = currentTaskName;

    // Hiển thị modal
    modal.style.display = 'block';

    // Cập nhật tên task khi nhấn nút "Cập nhật"
    updateButton.addEventListener('click', () => {
        const updatedTaskName = taskNameInput.value.trim(); // Lấy tên task mới
        if (updatedTaskName) {
            // Lưu tên task mới vào dữ liệu của bạn (ví dụ trong localStorage hoặc database)
            updateTaskName(taskId, updatedTaskName);
            // Đóng modal
            modal.style.display = 'none';
            showCustomAlert('Tên task đã được cập nhật!');
        } else {
            alert('Tên task không thể để trống'); // Hiển thị thông báo nếu tên task trống
        }
    });

    // Đóng modal khi nhấn nút "Hủy"
    cancelButton.addEventListener('click', () => {
        modal.style.display = 'none'; // Đóng modal khi hủy
    });
}

// Cập nhật tên task trong dữ liệu (ví dụ localStorage)
function updateTaskName(taskId, newName) {
    let boards = JSON.parse(localStorage.getItem('currentUser')).boards; // Lấy boards từ localStorage
    // Tìm task theo taskId và cập nhật tên mới
    boards.forEach(board => {
        board.lists.forEach(list => {
            list.tasks.forEach(task => { // Sửa từ 'list.cards' thành 'list.tasks'
                if (task.id === taskId) {
                    task.title = newName; // Cập nhật tên task
                    // Lưu lại boards vào localStorage sau khi cập nhật
                    localStorage.setItem('currentUser', JSON.stringify({ boards }));
                }
            });
        });
    });
    window.location.reload();
}
// modal Date 
document.addEventListener('DOMContentLoaded', () => {
    const openDateModalBtn = document.getElementById('openDateModalBtn');
    const dateModal = document.querySelector('.detailModal-dates');

    if (openDateModalBtn && dateModal) {
        openDateModalBtn.addEventListener('click', () => {
            dateModal.style.display = 'block'; // hoặc dùng class để bật lên
        });
    }
});
function hideDetailModal() {
    const dateModal = document.querySelector('.detailModal-dates');
    if (dateModal) {
        dateModal.style.display = 'none';
    }
}


