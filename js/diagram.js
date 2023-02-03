import loadData from './dataloader.js';

const datapath = "./common/data/data.csv";
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

// button export to pdf
const buttonExport = document.querySelector("#export-to-pdf");
buttonExport.addEventListener("click", () => {
  test();
});

// button export to pdf
const buttonImport = document.querySelector("#import-csv-file");
buttonImport.addEventListener("click", () => {
  test();
});


editor.events.on("ApplyButton", () => {
    collapse(); 
    diagram.data.parse(editor.serialize());
});

editor.events.on("ResetButton", () => {
    collapse();
});

function test() {
    alert("Chua co gi dau hehe.");
}



// loading data then parse into the editor
loadData(datapath).then(data => {
    console.log(data);
    diagram.data.parse(data);
})
