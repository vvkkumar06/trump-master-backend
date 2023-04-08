const generateShuffleData = (totalCards) => {
    const dataTemplate = new Array(totalCards).fill(0).map((_, i) => i);
    const shuffleData = [];
    for (let i = 0; i < totalCards; i++) {
        shuffleData[i] = shuffle([...dataTemplate]);
    }

    return shuffleData;
};

function shuffle(array) {
    let currentIndex = array.length,
        randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex],
            array[currentIndex],
        ];
    }

    return array;
}

module.exports = {
    generateShuffleData
}