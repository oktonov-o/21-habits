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
    progressBtnDisplay: "block",
    achievements: {
        win: 0,
        fail: 0,
        left: 0,
    }
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

// If there is data in localStorage it reads and renders to our page
function renderExistedItems(){
    readStorage();
    allItems.forEach((item) => {
        renderCurrentItem(item);
    })
};
renderExistedItems();

function getInputsAndPush(){
    currentItem = {
        id: allItems.length !== 0 ? allItems[allItems.length - 1].id + 1 : 1,
        name: elements.habitName.value,
        value: elements.habitDays.value,
        progress: circleLength,
        today: today,
        progressBtnDisplay: "block",
        achievements: {
            win: 0,
            fail: 0,
            left: elements.habitDays.value,
        }
    }
    if(currentItem.name!="" && currentItem.value!="" && currentItem.value != 0){
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
                <div class="card-quantity__number win">${item.achievements.win}</div>
                <div class="card-quantity__subtitle">ИЙГИЛИКТУУ</div>
            </div>
            <div class="card--quantity">
                <div class="card-quantity__number fail">${item.achievements.fail}</div>
                <div class="card-quantity__subtitle">БОЛБОДУ</div>
            </div>
            <div class="card--quantity">
                <div class="card-quantity__number left">${item.achievements.left}</div>
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
        <button class="btn btn-circle circle-${item.id}" style="display:${item.progressBtnDisplay}">ЖАСАДЫМ</button>
    </div>
</div>
    `;
    elements.habitList.insertAdjacentHTML("beforeend", curItemHtml);
}



function globalAppController(){
    // Get input values and push it into array DATA
    getInputsAndPush();

    //set all Items to Local Storage
    setToLocalStorage(allItems);

    // 3. Render new currently added item
    clearAllAndRenderAgain();

    // 4. hide popup Window
    hidePopupWindow();

    // 5. clear input fields
    clearInputFields();
}

// Event Handlers On clicking  the btn Form
elements.btnForm.addEventListener('click', function(){
    globalAppController();
});
document.addEventListener('keypress', function(event){
    if (event.keyCode === 13 || event.which === 13) {
        globalAppController();
    }
});

// Show and hide popup windows
elements.headerBtn.addEventListener('click', showPopupWindow);
elements.exitBtn.addEventListener('click', hidePopupWindow);



// All events whenn clicking btn in circle will be here:
document.addEventListener('click', function(event){
    if(event.target.classList[1] == "btn-circle"){
       
    // getting all required variables for Progress bar
    let id = event.target.classList[2].split('-')[1];
    let circle = document.querySelector(`.circle-${ event.target.classList[2].split('-')[1]}`).parentNode.childNodes[1].childNodes[1];
    let step = parseFloat(circle.dataset.step);
    let btnProgress = circle.parentNode.parentElement.childNodes[3];
    let previousDate = allItems[id - 1].today.day;

    // Comparing today's DATE with previousDate
    if(previousDate.day != today.day ){
        // 1. hide current element on both DATA and UI && change previousDate's value to today's date
        allItems[id - 1].progressBtnDisplay = "none";
        btnProgress.style.display = "none";
        allItems[id - 1].today.day = today.day;
        console.log(allItems[id - 1].today.day + " new date");
        
        // 2. identifying current progress and changing previous progress with current one
        let currentProgress;
        currentProgress = JSON.parse(localStorage.getItem('allItems'))[id - 1].progress;
        if(currentProgress <= 0){ 
            allItems[id - 1].progressBtnDisplay = "none"; 
            currentProgress = 0;
        }else{
            currentProgress = currentProgress - step;
            allItems[id - 1].achievements.win += 1;
            allItems[id - 1].achievements.left -= 1;
        }
        allItems[id - 1].progress = currentProgress;


        // Calculations
        // adding 1 to win subtracting 1 from left
        let win, fail, left;
        // 2. get new changed values from DATA
        win = allItems[id - 1].achievements.win;
        left = allItems[id - 1].achievements.left;

        // setting new achievement's values into UI
        circle.parentNode.parentElement.parentElement.childNodes[1].childNodes[3].childNodes[1].childNodes[1].innerHTML = win;
        circle.parentNode.parentElement.parentElement.childNodes[1].childNodes[3].childNodes[5].childNodes[1].innerHTML = left;

        
        // setting all changes to localStorage
        setToLocalStorage(allItems);
    
        // On each step these styles will be added
        circle.style.strokeDashoffset = currentProgress;
        circle.style.strokeDasharray = `${circleLength} ${circleLength}`;
        circle.style.stroke = "#27ae60";
    }

    }
});


// on a new entering to our application
// Checking all item's date and their btn's display property
// if the previousDate = today display: none btns
// if user left days not doing progress calculate achievement's LEFT property 

// function for instantly make changes on UI in many items at once
function clearAllAndRenderAgain(){
    elements.habitList.innerHTML = '';
    renderExistedItems();
}

for(let i = 0; i < allItems.length; i++){
    // For each element in all items:
    if(allItems[i].today.day != today.day){
        // display btn and setToLocalStorage();
        
        if(allItems[i].progress <= 0){
            allItems[i].progressBtnDisplay = "none";
            setToLocalStorage(allItems);
            clearAllAndRenderAgain()
        }else {
            allItems[i].progressBtnDisplay = "block";
            setToLocalStorage(allItems);
            clearAllAndRenderAgain();
        }

    }else {console.log("Come back tomorrow")};

    // fining how many days we have left and make calculations
    if(allItems[i].today.day + 1 < today.day){
        allItems[i].achievements.fail += today.day - allItems[i].today.day - 1;
        setToLocalStorage(allItems);
        console.log("You have left some days");

    }else {console.log("You did not fail today")}
}
