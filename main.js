const elements = {
    habitName: document.getElementById('habit-name'),
    habitDays: document.getElementById('habit-days'),
    btnForm: document.querySelector('.btn-form'),
    exitBtn: document.querySelector('.exit-btn'),
    habitList: document.querySelector('.habit-list'),
    popupWindow: document.querySelector('.popupWindow'),
    headerBtn: document.querySelector('.header__btn'),
    circle: document.querySelector('.progress-circle'),
    btnCircle: document.querySelector('.btn-circle')
}
/// properties of circle
const radius = elements.circle.r.baseVal.value;
const circleLength = 2 * Math.PI * radius;

// Data
let allItems = [];
let currentItem = {
    id: 0,
    name: "",
    value: 0,
    progress: circleLength,
    today: {
        year: 0,
        month: 0,
        day: 0
    },
};

// getting current Date
let today = {
    year: 0,
    month: 0,
    day: 0
};
function currentDate(){
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth();
    let day = date.getDate();
    today = {
        year: year,
        month: month,
        day: day
    }
}
currentDate();
console.log(today);

function readStorage() {
    const storage = JSON.parse(localStorage.getItem('allItems'));
    
    // Restoring likes from the localStorage
    if (storage) allItems = storage;
}
function setToLocalStorage(allItems){
    localStorage.setItem("allItems", JSON.stringify(allItems));
}


function showPopupWindow(){
    elements.popupWindow.style.display = "flex";
}
function hidePopupWindow(){
    elements.popupWindow.style.display = "none";
}

function clearInputFields(){
    elements.habitDays.value = "";
    elements.habitName.value = "";
}

function getInputsAndPush(){
    currentItem = {
        id: allItems.length !== 0 ? allItems[allItems.length - 1].id + 1 : 1,
        name: elements.habitName.value,
        value: elements.habitDays.value,
        progress: circleLength
    }
    if(currentItem.name!="" && currentItem.value!=""){
        allItems.push(currentItem);
        elements.popupWindow.style.display = "none";
      } else {
        alert("Адаттын атын же кундордун санын жазганды унуттунуз.");
      }
    console.log(currentItem);
    console.log(allItems)
}

function renderCurrentItem(item){
    let curItemHtml = `
    <div class="habit-card-${item.id} habit-card">
    <div class="habit-card__header">
        <div class="habit-card__header--title">
            <h1 class="card-title">${item.name}</h1>
        </div>
        <div class="habit-card__header--quantity">
            <div class="card-quantity">
                <div class="card-quantity__number win">0</div>
                <div class="card-quantity__subtitle">ИЙГИЛИКТУУ</div>
            </div>
            <div class="card--quantity">
                <div class="card-quantity__number fail">0</div>
                <div class="card-quantity__subtitle">БОЛБОДУ</div>
            </div>
            <div class="card--quantity">
                <div class="card-quantity__number left">${item.value}</div>
                <div class="card-quantity__number left"></div>
                <div class="card-quantity__subtitle">КАЛДЫК</div>
            </div>
        </div>
    </div>
    <hr/>
    <div class="habit-card__progressbar">
        <svg class="progress-bar" width="182" height="182">
            <circle class="progress-circle " stroke=#e5e5e5 stroke-width="15"  cx="91" cy="91" r="76" fill="transparent" data-step="${circleLength / item.value}" style = "stroke-dashoffset:${item.progress}; stroke-dasharray :${circleLength} ${circleLength}; stroke:${item.id == allItems.length + 1? "#e5e5e5": "#27ae60" };"/>
        </svg>
        <button class="btn btn-circle circle-${item.id}">ЖАСАДЫМ</button>
    </div>
</div>
    `;
    elements.habitList.insertAdjacentHTML("beforeend", curItemHtml);
}

// If there is data in localStorage it reads and renders to our page
function renderExistedItems(){
    readStorage();
    allItems.forEach((item) => {
        renderCurrentItem(item);
    })
};
renderExistedItems();


function globalAppController(){
    // Get input values and push it into array DATA
    getInputsAndPush();

    //set all Items to Local Storage
    setToLocalStorage(allItems);

    // 3. Render new currently added item
    renderCurrentItem(currentItem);
}

// Event Handlers On clicking  the btn Form
elements.btnForm.addEventListener('click', function(){
    globalAppController();
    hidePopupWindow();
    clearInputFields();
});
document.addEventListener('keypress', function(event){
    if (event.keyCode === 13 || event.which === 13) {
        globalAppController();
        hidePopupWindow();
        clearInputFields();
    }
});

// Show and hide popup windows
elements.headerBtn.addEventListener('click', showPopupWindow);
elements.exitBtn.addEventListener('click', hidePopupWindow);



// All events whenn clicking btn in circle will be here:
document.addEventListener('click', function(event){
    if(event.target.classList[1] == "btn-circle"){
       
    // getting id, circle, step from clicked(active) progress bar
    let id = event.target.classList[2].split('-')[1];
    let circle = document.querySelector(`.circle-${ event.target.classList[2].split('-')[1]}`).parentNode.childNodes[1].childNodes[1];
    let step = parseFloat(circle.dataset.step);

    // identifying current progress and changing previous progress with current one
    let currentProgress;
    if(!(localStorage.getItem('allItems'))){currentProgress = circleLength;
    }else {currentProgress = JSON.parse(localStorage.getItem('allItems'))[id - 1].progress;
    }
    currentProgress = currentProgress - step;
    allItems[id - 1].progress = currentProgress;
    
    // setting all changes to localStorage
    setToLocalStorage(allItems);
    console.log(currentProgress);

    // On each step these styles will be added
    circle.style.strokeDashoffset = currentProgress;
    circle.style.strokeDasharray = `${circleLength} ${circleLength}`;
    circle.style.stroke = "#27ae60";

    }
});
