import { loadDataFromArray, initData, getAPIDataFromServer, readJsonFile, readJsonObject} from './dataloader.js';
import config from './config.json' assert { type : 'json'};
import data from './data.json' assert { type : 'json'};

// add const variables
const datapath = config.datapath;
const url_server = config.model_server;


const defaults = {
    // the default settings for all shapes of the "rectangle" type
    rectangle: {
        fill: "#CEEFE1",
        stroke: "#0AB169",
        strokeWidth: 2,
        width: 140,
        height: 140,
        text: "Default text"
    },
    // the default settings for all lines of the "line" type
    line: {
        strokeWidth: 2,
        stroke: "#245CE0",
        connectType: "straight"        
    },
    // the default settings for all lines of the "dash" type
    dash: {
        strokeWidth: 3,
        stroke: "#245CE0", 
        connectType: "straight"
    },
    // default settings for all lines of the "circle" type
    circle: {
        strokeWidth: 1,
        fill: "#FFCDD2",
        width: 80,
        height: 80
    },

};

// creating Diagram
const diagram = new dhx.Diagram("diagram", {
    // config options
    type: "mindmap",
    defaults : defaults,
    autoplacement: {
		mode: "direct",
		placeMode: "radial",
        graphPadding: 100,
        autoLayout: true
	}, 
    exportStyles: false
});

// create the editor
const editor = new dhx.DiagramEditor("editor", {
    controls: {
        apply: true,
        reset: true
    },
    // config options
    type: "default",
    defaults : defaults,
    autoplacement: {
		mode: "direct",
		placeMode: "radial",
        graphPadding: 100,
        autoLayout: true
	}, 
    exportStyles: false
});

const editorCont = document.querySelector("#editor");
const diagramCont = document.querySelector("#diagram");
const controls = document.querySelector("#control");
const container = document.querySelector("#container");

const WITH_EDITOR = "dhx_sample-container__with-editor";
const WITHOUT_EDITOR = "dhx_sample-container__without-editor";

function expand() {
    diagramCont.style.display = "none";
    controls.style.display = "none";
    editorCont.style.display = "block";
    container.classList.remove(WITHOUT_EDITOR);
    container.classList.add(WITH_EDITOR);
}

function collapse() {
    diagramCont.style.display = "block";
    controls.style.display = "flex";
    editorCont.style.display = "none";
    container.classList.remove(WITH_EDITOR);
    container.classList.add(WITHOUT_EDITOR);
}

export default function runEditor() {
    expand();
    editor.import(diagram);
}

// button edit
const buttonEdit = document.querySelector("#button-edit");
buttonEdit.addEventListener("click", () => {
  runEditor();
});


// button test with sample data
const buttonExport = document.querySelector("#test-sample-data");
buttonExport.addEventListener("click", async () => {
    console.log("test with sample data");
    // load json object from file
    const jsonObject = await readJsonFile('./js/data.json');
    // load data from json object
    const array = readJsonObject(data); 
    // convert data to json object optional for graph
    const loadableData = await loadDataFromArray(array);
    // load data to editor
    expand();
    editor.parse(loadableData);
});

// button send api to back end
const buttonImport = document.querySelector("#send-api");
buttonImport.addEventListener("click", async () => {

    const input = document.getElementById("input-text");
    let text = input.value;
    if (text === "") {
        alert("Please enter the text");
        return;
    }
    console.log(text);
    // return;

    console.log("connect to server");
    const jsonObject = await getAPIDataFromServer(url_server, {
        "text" : text}, 'GET');
    console.log(jsonObject);

    // load data from json object
    const array = readJsonObject(jsonObject);

    // convert data to json object optional for graph
    const loadableData = await loadDataFromArray(array);
    console.log(loadableData);
    // load data to editor
    expand();
    editor.parse(loadableData);
});


editor.events.on("ApplyButton", () => {
    collapse(); 
    diagram.data.parse(editor.serialize());
});

editor.events.on("ResetButton", () => {
    collapse();
});

// get the csv file
// loading data then reload
document.getElementById("container").addEventListener("load", initData(datapath, diagram))


