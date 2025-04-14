
document.addEventListener('DOMContentLoaded', function () {

    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
    let users = JSON.parse(localStorage.getItem('users')) || [];


    const creatNewBoardBtn = document.querySelector('.creatNewBoard');
    const windowNewBoard = document.querySelector('.windowNewBoard');
    const windowUpdateBoard = document.querySelector('.windowUpdateBoard');
    const closeBtns = document.querySelectorAll('[id^="close"]');
    const createBtn = document.querySelector('#create');
    const updateBtn = document.querySelector('#update');
    const boardTitleInput = document.querySelector('#text_board_title');
    const boardTitleUpdateInput = document.querySelector('#text_board_title_update');
    const boardsContainer = document.querySelector('.bodymain .board');


    let boards = currentUser.boards || [];


    const funcIcon = document.getElementById('funcIcon');
    const mobileMenu = document.getElementById('mobile-menu');

    // funcIcon.addEventListener('click', function (e) {
    //     e.stopPropagation();
    //     mobileMenu.style.display = mobileMenu.style.display === 'block' ? 'none' : 'block';
    // });

    document.addEventListener('click', function (e) {
        if (!mobileMenu.contains(e.target) && e.target !== funcIcon) {
            mobileMenu.style.display = 'none';
        }
    });

    creatNewBoardBtn.addEventListener('click', function () {
        windowNewBoard.style.display = 'block';
    });


    closeBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            windowNewBoard.style.display = 'none';
            windowUpdateBoard.style.display = 'none';
        });
    });


    createBtn.addEventListener('click', function (e) {
        e.preventDefault();
        const title = boardTitleInput.value.trim();

        if (!title) {
            alert('Vui lòng nhập tên board');
            return;
        }

        const newBoard = {
            id: Date.now().toString(),
            title: title,
            description: "",
            backdrop: "https://example.com/default.jpg",
            is_starred: false,
            created_at: new Date().toISOString(),
            lists: []
        };


        boards.push(newBoard);
        currentUser.boards = boards;


        const updatedUsers = users.map(user =>
            user.id === currentUser.id ? currentUser : user
        );

        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        localStorage.setItem('users', JSON.stringify(updatedUsers));


        renderBoard(newBoard);
        windowNewBoard.style.display = 'none';
        boardTitleInput.value = '';
    });


    document.addEventListener('click', function (e) {
        if (e.target.classList.contains('edit-board')) {
            const boardId = e.target.closest('.board-item').dataset.boardId;
            const board = boards.find(b => b.id === boardId);
            openUpdateModal(board);
        }
    });


    function openUpdateModal(board) {
        boardTitleUpdateInput.value = board.title;
        windowUpdateBoard.style.display = 'block';
        windowUpdateBoard.dataset.boardId = board.id;
    }


    updateBtn.addEventListener('click', function (e) {
        e.preventDefault();
        const boardId = windowUpdateBoard.dataset.boardId;
        const newTitle = boardTitleUpdateInput.value.trim();

        if (!newTitle) {
            alert('Vui lòng nhập tên mới');
            return;
        }


        const updatedBoards = boards.map(board =>
            board.id === boardId ? { ...board, title: newTitle } : board
        );

        currentUser.boards = updatedBoards;
        const updatedUsers = users.map(user =>
            user.id === currentUser.id ? currentUser : user
        );


        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        localStorage.setItem('users', JSON.stringify(updatedUsers));


        boardsContainer.innerHTML = '';
        location.reload();
        windowUpdateBoard.style.display = 'none';
    });


    function renderBoard(board) {
        const boardElement = document.createElement('div');
        boardElement.className = 'board-item';
        boardElement.dataset.boardId = board.id;
        boardElement.innerHTML = `
            <span>${board.title}</span>
            <button class="edit-board">Edit board</button>
        `;

        boardElement.addEventListener('click', (e) => {
            if (!e.target.classList.contains('edit-board')) {
                window.location.href = `boardLayout.html?boardId=${board.id}`;
            }
        });

        boardsContainer.appendChild(boardElement);
    }


    function loadBoards() {
        boards.forEach(board => renderBoard(board));
    }


    loadBoards();
    window.addEventListener('click', function (e) {
        if (e.target === windowNewBoard) {
            windowNewBoard.style.display = 'none';
        }
        if (e.target === windowUpdateBoard) {
            windowUpdateBoard.style.display = 'none';
        }
    });
});