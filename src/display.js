export default function displayGrid(array) {
    const rows = array.length;
    const cols = array.reduce((max, row) => Math.max(max, row.length), 0);

    const gridElement = document.getElementById('grid');
    gridElement.innerHTML = '';
    gridElement.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    gridElement.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

    const percentOfScreen = 0.75;
    const squareSize = `${Math.min(window.innerWidth / cols, window.innerHeight / rows) * percentOfScreen}px`;

    array.forEach(row => {
        if (row.length < cols) {
            row.push(...Array(cols - row.length).fill(false));
        }
    });

    array.forEach(row => {
        row.forEach(cell => {
            const square = document.createElement('div');
            square.classList.add('square');
            square.style = `width: ${squareSize}; height: ${squareSize};`;
            square.style.backgroundColor = cell ? 'black' : 'white';
            gridElement.appendChild(square);
        });
    });
}