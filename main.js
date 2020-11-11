// export const renderLoader = parent => {
//     const loader = `
//         <div class="${elementStrings.loader}">
//             <svg>
//                 <use href="img/icons.svg#icon-cw"></use>
//             </svg>
//         </div>
//     `;
//     parent.insertAdjacentHTML('afterbegin', loader);
// };



// function showPopUpWindow() {
//     document.getElementById('popUpWindow').style.display='block';
// }

// function newItem() {
//     document.getElementById('popUpWindow').style.display='none';
//     var item_name = document.getElementById('habit-name').value;
//     var item_days = document.getElementById('habit-days').value;
// 	var ul = document.getElementById("list");
//     var li = document.createElement('li');
//     console.log(li);
//   li.appendChild(document.createTextNode(item_name+" for "+item_days));
//   ul.appendChild(li);
//   document.getElementById('habit-name').value="";
//   li.onclick = removeItem;
// }

// document.body.onkeyup = function(e){
//       if(e.keyCode == 13){
//         newItem();
//       }
//   }

// function removeItem(e) {
//   e.target.parentElement.removeChild(e.target);
// }

/////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////
const elements = {
    habitName: document.getElementById('habit-name'),
    habitDays: document.getElementById('habit-days'),
    btnForm: document.querySelector('.btn-form'),
    exitBtn: document.querySelector('.exit-btn'),
    habitList: document.querySelector('.habit-list'),
    popupWindow: document.querySelector('.popupWindow')
}
let allItems = [];
let currentItem = {
    name: "",
    value: 0
};

function newItem() {
    currentItem.name = elements.habitName.value;
    currentItem.value = elements.habitDays.value;
    allItems.push(currentItem);
    console.log(allItems);
    return allItems;
}

function renderNewItem() {
    let newRenderedItem = `
    <div class="habit-card-0 habit-card">
        <div class="habit-card__header">
            <div class="habit-card__header--title">
                <h1 class="card-title">${allItems[allItems.length - 1].name}</h1>
            </div>
        <div class="habit-card__header--quantity">
            <div class="card-quantity">
                <div class="card-quantity__number win">12</div>
                <div class="card-quantity__subtitle">ИЙГИЛИКТУУ</div>
            </div>
            <div class="card--quantity">
                <div class="card-quantity__number fail">1</div>
                <div class="card-quantity__subtitle">БОЛБОДУ</div>
            </div>
            <div class="card--quantity">
                <div class="card-quantity__number left">8</div>
                <div class="card-quantity__subtitle">КАЛДЫК</div>
            </div>
        </div>
            </div>
            <hr/>
                <div class="habit-card__progressbar">
                        <svg class="progress-bar" width="182" height="182">
                            <circle class="progress-circle" stroke=#27ae60 stroke-width="15"  cx="91" cy="91" r="76" fill="transparent" />
                        </svg>
                    </div>
                </div>
    `;
    elements.habitList.insertAdjacentHTML("beforeend", newRenderedItem);
}

elements.btnForm.addEventListener("click", function(){
    newItem();
    renderNewItem();
    elements.popupWindow.style.display = "none";
});

elements.exitBtn.addEventListener('click', function(){
    elements.popupWindow.style.display = "none";
});