//array -> sorted filled sorted array
export const fillArray = (arr) => {
    const sortedArr = arr.sort((a, b) => a - b);
    let filled = [];
    for (let i = Math.min(...sortedArr); i <= Math.max(...sortedArr); i++)
        filled.push(i);
    return filled;
};
