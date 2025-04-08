// localStorage.clear()
document.addEventListener('DOMContentLoaded', function () {
    const creatNewBoardBtn = document.querySelector('.creatNewBoard');
    const windowNewBoard = document.querySelector('.windowNewBoard');
    const closeBtn = document.querySelector('#close');
    const createBtn = document.querySelector('#create');
    const boardTitleInput = document.querySelector('#text_board_title');
    const boardsContainer = document.querySelector('.bodymain .board');
    let boards = JSON.parse(localStorage.getItem('boards')) || [];
    creatNewBoardBtn.addEventListener('click', function () {
        windowNewBoard.style.display = 'block';
    });
    closeBtn.addEventListener('click', function () {
        windowNewBoard.style.display = 'none';
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
            background: 'default',
            createdAt: new Date().toISOString(),
            lists: []
        };
        boards.push(newBoard);
        localStorage.setItem('boards', JSON.stringify(boards));
        const boardElement = document.createElement('div');
        boardElement.className = 'board-item';
        boardElement.innerHTML = `
            <span>${newBoard.title}</span>
            <button class="edit-board">Edit board</button>
        `;
        boardElement.addEventListener('click', () => {
            window.location.href = `boardLayout.html?boardId=${newBoard.id}`;
        });
        boardsContainer.appendChild(boardElement);
        windowNewBoard.style.display = 'none';
        boardTitleInput.value = '';
    });
    function loadBoards() {
        boards.forEach(board => {
            const boardElement = document.createElement('div');
            boardElement.className = 'board-item';
            boardElement.innerHTML = `
                <span>${board.title}</span>
                <button class="edit-board">Edit board</button>
            `;

            boardElement.addEventListener('click', () => {
                window.location.href = `boardLayout.html?boardId=${board.id}`;
            });

            boardsContainer.appendChild(boardElement);
        });
    }
    loadBoards();
    window.addEventListener('click', function (e) {
        if (e.target === windowNewBoard) {
            windowNewBoard.style.display = 'none';
        }
    });
});