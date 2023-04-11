const plusButton = document.querySelector(".counter-ui__button--plus");
const minusButton = document.querySelector(".counter-ui__button--minus");
const lapButton = document.querySelector(".counter-ui__button--lap");
const menuButton = document.querySelector(".menu-icon");
const exportButton = document.querySelector(".menu-export");
const resetButton = document.querySelector(".menu-reset");
const statusIcon = document.querySelector(".status-icon");
const menu = document.querySelector(".menu");
const counter = document.querySelector(".count");
const timer = document.querySelector(".time");
const counterLapNr = document.querySelector(".lap-nr")
const counterLapCount = document.querySelector(".lap-count")
const counterLapTimeStart = document.querySelector(".lap-timeS")
const counterLapTimeFinish = document.querySelector(".lap-timeF")
let countTotal = 0;
let countLap = 0;
let timeTotal = parseInt(prompt("Please enter time in minutes"))*60;
const timeInit = timeTotal;
let timeLapS;
let timeLapF;
let lapNr = 0;
let setHistory = [["Set Nr.", "Set Count", "Set Start", "Set End", "Total reps"]];
let first = false;
let onLap = false;
let finished = false;
let timeEnding = false;
let interval;

function saveFile(blob, filename) {
    if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(blob, filename);
    }else{
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.href = url;
        a.download = filename;
        a.click();
        setTimeout(() => {	
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        }, 0);
    }
}
function createCSV(){
    let csvContent = "";
    setHistory.forEach((set) => {
        let row = `${set[0]};${set[1]};${set[2]};${set[3]};${set[4]}\n`
        csvContent += row
    });
    var data = new Blob([csvContent], {type: 'text/csv'});
    saveFile(data, "log.csv");
    menu.classList.add("hidden");
}
function createTime(){
    let min = Math.floor(timeTotal/60);
    let sec = timeTotal%60;
    if (min <= 9){
        min = `0${min}`;
    }
    if (sec <= 9){
        sec = `0${sec}`;
    }
    let time = `${min}:${sec} Min`;
    return time;
}
function lap(){
    if (finished) {return;}
    if (countLap != 0){
        lapNr += 1;
        timeLapF = createTime();
        setHistory.push([lapNr, countLap, timeLapS, timeLapF, countTotal]);
        counterLapNr.innerHTML = lapNr;
        counterLapCount.innerHTML = countLap;
        counterLapTimeStart.innerHTML = timeLapS;
        counterLapTimeFinish.innerHTML = timeLapF;
        countLap = 0;
        onLap = false;
    }
}
function updateInterfaceTime(){
    timer.innerHTML = createTime();
    if (timeTotal == 0){
        clearInterval(interval);
        lap();
        popMenu();
        finished = true;
        alert("Time finished!!")
    }else if (timeTotal <= timeInit*0.1 & timeEnding) {
        timer.classList.add("time-ending");
        timeEnding = true;
    }
}
function start() {
    // if (remainingSeconds === 0) return;
    statusIcon.classList.remove("hidden");
    interval = setInterval( () => {
        timeTotal--;
        updateInterfaceTime();
    }, 1000);
}
function add() {
    if (finished) {return;}
    if (first===false) {
        first = true;
        onLap = true;
        start();
    } else if (onLap === false) {
        onLap = true;
        timeLapS = createTime();
    }
    countLap++;
    countTotal++;
    counter.innerHTML = countTotal;
}
function rest() {
    if (finished) {return;}
    if (countTotal > 0 && countLap > 0) {
        countLap--;
        countTotal--;
        counter.innerHTML = countTotal;
    }
}
function reset() {
    if (confirm("Are you sure you want to reset") === true) {
        if (interval !== undefined){
            clearInterval(interval);
            statusIcon.classList.add("hidden");
        }
        countTotal = 0;
        countLap = 0;
        timeTotal = parseInt(prompt("Please enter time in minutes"));
        timeLapS = timeTotal;
        lapNr = 0;
        csvContent = "";
        setHistory = [["Set Nr.", "Set Count", "Set Start", "Set End", "Total reps"]];
        first = false;
        onLap = false;
        finished = false;

        counter.innerHTML = countTotal;
        counterLapNr.innerHTML = lapNr;
        counterLapCount.innerHTML = countLap;
        counterLapTimeStart.innerHTML = timeLapS;
        counterLapTimeFinish.innerHTML = timeLapS;
        timer.innerHTML = timeLapS;
        menu.classList.add("hidden");
    }
}
function popMenu() {
    if (menu.classList.contains("hidden")){
        menu.classList.remove("hidden");
    }else{
        menu.classList.add("hidden"); 
    }
}
plusButton.addEventListener("click", add);
minusButton.addEventListener("click", rest);
lapButton.addEventListener("click", lap);
menuButton.addEventListener("click", popMenu);
exportButton.addEventListener("click", createCSV);
resetButton.addEventListener("click", reset);

document.addEventListener("keyup", function(e) {
    const key = e.key
    if (key === "+"){
        add();
    }else if (key === "-"){
        rest();
    }else if (key === "s") {
        lap();
    }
});

const time = createTime();
timeLapS = time;
timer.innerHTML = time;
counterLapTimeStart.innerHTML = time;
counterLapTimeFinish.innerHTML = time;