//GLOBAL VARIABLES
const gallery = document.querySelector('#gallery');
const body = document.querySelector('body');
const searchContainer = document.querySelector('.search-container');
let randomEmployeeData; 

//Retrieves Data of 12 Random Employees
async function getRandomEmployees(){
    try{
        const request = await fetch('https://randomuser.me/api/?results=12&nat=us');
        const promiseData = await request.json();
        const resultData = promiseData.results;
        galleryMarkup(resultData);
        randomEmployeeData = resultData;
        
    }catch(error){
        console.log('There was an error reaching the Random User API - '+ error);
    }
}

//===============================DISPLAY CARDS==============================
/**
 * 
 * @param {array} employeeArray 
 */
function galleryMarkup(employeeArray) {
    employeeArray.forEach(employee =>{
        const fullName = `${employee.name.first} ${employee.name.last}`
        const template = `
        <div class="card">
            <div class="card-img-container">
                <img class="card-img" src="${employee.picture.large}" alt="profile picture">
            </div>
            <div class="card-info-container">
                <h3 id="name" class="card-name cap">${fullName}</h3>
                <p class="card-text">${employee.email}</p>
                <p class="card-text cap">${employee.location.city}, ${employee.location.state}</p>
            </div>
        </div>
        `;
        gallery.insertAdjacentHTML('beforeend', template);
    })
}

//===============================MODAL CARDS=================================
function birthday(dob){
    const dateOfBirth = dob.date.split('T');
    const splitDates = dateOfBirth[0].split('-');
    const newDateOrder = [splitDates[1],splitDates[2],splitDates[0]];
    return newDateOrder.join('/');
}

/**
 * 
 * @param {object} employee - is the object that represents the employee that is selected when the modal div is clicked
 */

function modalMarkup(employee){
    const location = employee.location;
    const employeeDOB = employee.dob;

    const template = `
    <div class="modal-container">
    <div class="modal">
        <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
        <div class="modal-info-container">
            <img class="modal-img" src="${employee.picture.large}" alt="profile picture">
            <h3 id="name" class="modal-name cap">${employee.name.first} ${employee.name.last}</h3>
            <p class="modal-text">${employee.email}</p>
            <p class="modal-text cap">${location.city}</p>
            <hr>
            <p class="modal-text">${employee.cell}</p>
            <p class="modal-text">${location.street.number} ${location.street.name}., ${location.city}, ${location.state} ${location.postcode}</p>
            <p class="modal-text">Birthday: ${birthday(employeeDOB)}</p>
        </div>
        <div class="modal-btn-container">
            <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
            <button type="button" id="modal-next" class="modal-next btn">Next</button>
        </div>
    </div>
    `;
    gallery.insertAdjacentHTML('afterend', template);
}

//=======================SEARCH FEATURE===============================
const searchMarkup = `
    <form action="#" method="get">
        <input type="search" id="search-input" class="search-input" placeholder="Search...">
        <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
    </form>
`;
searchContainer.insertAdjacentHTML('beforeend', searchMarkup); 

const form = document.querySelector('form');
function search(){
    const userInput = form.querySelector('#search-input').value.toLowerCase();
    randomEmployeeData.forEach(employee =>{
        const firstName = employee.name.first;
        const lastName = employee.name.last;
        const fullName = `${firstName.toLowerCase()} ${lastName.toLowerCase()}`;
        if(fullName.includes(userInput)){
            const nameSearch = gallery.querySelectorAll('#name');
            nameSearch.forEach(element => {
                console.log(element.parentNode.parentNode);
            })
        }else{
            //console.log('NOT included'+fullName)
        }
    })
}

function prevAndNext(index){
    body.addEventListener('click', (e)=>{
        if(e.target.closest('#modal-prev')){
            console.log(`the current modal index is ${index} and previous is ${index-1}`)
            //need to be restrictions on if current index is 0 then we disable the prev button
        }else if(e.target.closest('#modal-next')){
            console.log(`the current modal index is ${index} and next is ${index+1}`)
            //restrictions needed to if the current index is 11 then we disabled the next button
        }
        
    })
}


//======================PREV NEXT BUTTONS=========================
//use the same event listener you use for opening up the modal on the gallery and then potentially add if(prev button clicked change the screen displayed, if next change forward)
//======================EVENT LISTENERS FOR EVERYTHING================

gallery.addEventListener('click', (e)=>{
    if(e.target.closest('.card')){
        const card = e.target.closest('.card');
        const employeeEmail = card.querySelector('.card-text').textContent;
        const find = randomEmployeeData.findIndex(employee => employee.email === employeeEmail);
        modalMarkup(randomEmployeeData[find])
        prevAndNext(find)
    }
})

//this event listener removes the current modal container displayed if the x is clicked or outside of the modal container
body.addEventListener('click', (e)=>{
    if(e.target.closest(".modal")){
        const modalBox = e.target;
        if(modalBox.textContent === 'X'){
            const modalContainer = e.target.closest('.modal-container');
            modalContainer.remove();
        }
    }else{
        const modalContainer = e.target.closest('.modal-container');
        if(modalContainer){
            modalContainer.remove();
        }
    }
})



form.addEventListener('submit', ()=>{
    search();
})

getRandomEmployees();

