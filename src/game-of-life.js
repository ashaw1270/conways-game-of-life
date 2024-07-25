import displayGrid from './display.js';

function arrayContains(coords, row, col) {
    return coords.some(loc => loc[0] === row && loc[1] === col);
}

function coordinatesToGrid(centeredCoords) {
    const rowValues = centeredCoords.map(loc => loc[0]);
    const colValues = centeredCoords.map(loc => loc[1]);

    const minRow = Math.min(...rowValues);
    const maxRow = Math.max(...rowValues);
    const minCol = Math.min(...colValues);
    const maxCol = Math.max(...colValues);

    const translatedCoordinates = centeredCoords.map(loc => [loc[0] - minRow, loc[1] - minCol]);

    const grid = Array(maxRow - minRow + 1).fill().map(() => Array(maxCol - minCol + 1).fill(false));
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[0].length; j++) {
            if (arrayContains(translatedCoordinates, i, j)) {
                grid[i][j] = true;
            }
        }
    }

    return grid;
}


function numNeighbors(centeredCoords, row, col) {
    let count = 0;
    for (let i = row - 1; i <= row + 1; i++) {
        for (let j = col - 1; j <= col + 1; j++) {
            if (i === row && j === col) {
                continue;
            }

            if (arrayContains(centeredCoords, i, j)) {
                count++;
            }
        }
    }
    return count;
}

function nextGeneration(centeredCoords) {
    const rowValues = centeredCoords.map(loc => loc[0]);
    const colValues = centeredCoords.map(loc => loc[1]);

    const minRow = Math.min(...rowValues);
    const maxRow = Math.max(...rowValues);
    const minCol = Math.min(...colValues);
    const maxCol = Math.max(...colValues);

    const output = [];
    for (let i = minRow - 1; i <= maxRow + 1; i++) {
        for (let j = minCol - 1; j <= maxCol + 1; j++) {
            const neighbors = numNeighbors(centeredCoords, i, j);
            if (arrayContains(centeredCoords, i, j)) {
                if (neighbors === 2 || neighbors === 3) {
                    output.push([i, j]);
                }
            } else if (neighbors === 3) {
                output.push([i, j]);
            }
        }
    }
    return output;
}

function simulateGenerations(startingCoordinates, numGenerations) {
    const output = [coordinatesToGrid(startingCoordinates)];
    let currentGeneration = startingCoordinates;
    for (let i = 2; i <= numGenerations; i++) {
        currentGeneration = nextGeneration(currentGeneration);
        output.push(coordinatesToGrid(currentGeneration));
    }
    return output;
}

function displayGenerations(generations, delay) {
    let index = 0;
    const interval = setInterval(() => {
        if (index < generations.length) {
            displayGrid(generations[index]);
            index++;
        } else {
            clearInterval(interval);
        }
    }, delay);
}

function saveGenerations(generations, name) {
    const jsonStr = JSON.stringify(generations);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

async function simulateFromFile(configName, numGenerations) {
    try {
        const response = await fetch(`../starting-configs/${configName}.json`);
        if (!response.ok) {
            throw new Error('File not found');
        }
        const generations = await response.json();
        return simulateGenerations(generations.startingConfiguration, numGenerations);
    } catch (error) {
        console.error(`Error reading file: ${error}`);
    }
}

const starter1 = [
    [0, 0],
    [-1, 1],
    [-1, 2],
    [0, 1],
    [1, 1]
];

const generations = await simulateFromFile('glider-gun', 10);
saveGenerations(generations, 'glider-gun10.json');