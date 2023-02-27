// load the data from a 2D array
// return a array of loadable data
export const loadDataFromArray = async (array) => {
    const node = getDistinctStrings(array);
    let data = [];

    let x = 400;
    let y = 400;
    // add node into data array
    for (let i = 0; i < node.length; i++) {
        data.push({ id: node[i], x: x, y: y, text: node[i], type: "circle", width: 155, height: 155 });
    }

    // add line into data array
    for (let i = 0; i < array.length; i++) {
        if (array[i][1] === "") {
            data.push({
                from: array[i][0], to: array[i][2], forwardArrow: true,
                connectType: "straight"
            });
        } else {
            data.push({
                from: array[i][0], to: array[i][2], forwardArrow: true,
                connectType: "straight", title: { text: [{ text: array[i][1] }] }
            });
        }
    }
    return data;
}



// read the distinct node (strings) from arrays
const getDistinctStrings = (arrays) => {
    const allStrings = arrays.flat().filter((_, i) => i % 3 !== 1);
    return Array.from(new Set(allStrings));
}

// read file csv: return a 2D array of strings
const readCSV = async (fileName) => {
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


// get request from server
const request = (url, params = {}, method = 'GET') => {
    let options = {
        method
    };
    if ('GET' === method) {
        url += '?' + (new URLSearchParams(params)).toString();
    } else {
        options.body = JSON.stringify(params);
    }
    return fetch(url, options).then(response => response.json());
};

// get api from server
export const getAPIDataFromServer = async (url, params, method = 'GET') => request(url, params, 'GET');

// init the data from local storage when reload
export const initData = async (datapath, diagram) => {
    const array = await readCSV(datapath);
    console.log(array);
    const data = await loadDataFromArray(array);
    console.log(data);
    diagram.data.parse(data);
}

const capitalizeFirstLetter = (string) => {
    string = string.toLowerCase();
    return string.charAt(0).toUpperCase() + string.slice(1);
}
// read data from JSON Object and return a 2D array
export const readJsonObject = (jsonObject) => {
    const array = [];
    let count = [];
    console.log(jsonObject);
    for (let i = 0; i < jsonObject.length; i++) {
        jsonObject[i]['head'] = capitalizeFirstLetter(jsonObject[i]['head']);
        jsonObject[i]['tail'] = capitalizeFirstLetter(jsonObject[i]['tail']);

        // only add the difference pair
        let headtail = jsonObject[i]['head'] + jsonObject[i]['tail'];
        let tailhead = jsonObject[i]['tail'] + jsonObject[i]['head'];
        if (count.includes(headtail) || count.includes(tailhead)) {
            continue;
        } else {
            array.push([jsonObject[i]['head'], jsonObject[i]['type'], jsonObject[i]['tail']]);
            count.push(headtail);
            count.push(tailhead);
        }
    }
    console.log("Array after read: ");
    console.log(array);
    return array;
}

// read json file
export const readJsonFile = async (filePath) => {
    try {
        // read json file
        const response = await fetch(filePath);
        // console.log(response);
        const data = response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
}