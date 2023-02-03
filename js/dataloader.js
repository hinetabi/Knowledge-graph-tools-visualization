// load the data from file csv
// return a array
export default async function loadData(filename){
    const array = await readCSV(filename);
    const node = getDistinctStrings(array); 
    let data = [];
   
    let x = 400; 
    let y = 400;
    // add node into data array
    for (let i = 0; i < node.length; i++) {
        data.push({id : node[i], x : x, y : y, text: node[i], type: "Rectangle"});
        // y = y + 260;
    }

    // add line into data array
    for (let i=0; i<array.length; i++) {
        if (array[i][1] === "") {
            data.push({from: array[i][0], to: array[i][2], forwardArrow : true, 
                connectType: "straight"});
        } else {
            data.push({from: array[i][0], to: array[i][2], forwardArrow : true, 
                connectType: "straight", title : {text : [{text : array[i][1]}]}});
        }
        
    }
    return data;
}


// read the distinct node (strings) from arrays
function getDistinctStrings(arrays) {
    const allStrings = arrays.flat().filter((_, i) => i % 3 !== 1);
    return Array.from(new Set(allStrings));
}

// read file csv: return a 2D array of strings
export async function readCSV(fileName) {
    const response = await fetch(fileName);
    const text = await response.text();
    const lines = text.split("\n");
    const rows = lines.map(line => line.split(","));

    // remove /r in the end of the line
    for (let i = 0; i < rows.length; i++) {
        for (let j = 0; j < rows[i].length; j++) {
            rows[i][j] = rows[i][j].replace(/\r+/, '');
        }
    }
    return rows;
}