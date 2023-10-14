//===================================GLOBAL VARIABLES=================================
const gallery = document.querySelector('#gallery');
const body = document.querySelector('body');
const searchContainer = document.querySelector('.search-container');
let randomEmployeeData; 

//===================================FETCH API DATA===================================

/**
 * getRandomEmployees fetches the data from the Random User API
 */
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
//===============================DISPLAY GALLERY CARDS function==============================
/**
 * 
 * @param {array} employeeArray 
 */
function galleryMarkup(employeeArray) {
    gallery.innerHTML = '';
    employeeArray.forEach(employee =>{
        const fullName = `${employee.name.first}${employee.name.last}`
        const template = `
        <div class="card" id=${fullName}>
            <div class="card-img-container">
                <img class="card-img" src="${employee.picture.large}" alt="profile picture">
            </div>
            <div class="card-info-container">
                <h3 id="name" class="card-name cap">${employee.name.first} ${employee.name.last}</h3>
                <p class="card-text">${employee.email}</p>
                <p class="card-text cap">${employee.location.city}, ${employee.location.state}</p>
            </div>
        </div>
        `;
        gallery.insertAdjacentHTML('beforeend', template);
    })
}
//===============================MODAL CARDS=================================
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

function birthday(dob){
    const dateOfBirth = dob.date.split('T');
    const splitDates = dateOfBirth[0].split('-');
    const newDateOrder = [splitDates[1],splitDates[2],splitDates[0]];
    return newDateOrder.join('/');
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

    const searchMatch = [];

    randomEmployeeData.forEach(employee =>{
        const firstName = employee.name.first;
        const lastName = employee.name.last;
        const fullName = `${firstName.toLowerCase()} ${lastName.toLowerCase()}`;
        
        if(fullName.includes(userInput)){
            searchMatch.push(employee);
        }
    })
    if(searchMatch.length >0){
        galleryMarkup(searchMatch);
    }else{
        gallery.innerHTML = 'Sorry, no results found.'
    }

}
//==============================PREV AND NEXT FUNCTIONS======================

function prevModal(index){
    const currentModal = document.querySelector('.modal-container');
    currentModal.remove();
    if(index === 0){
        const prevBtn = currentModal.querySelector('#modal-prev');
        prevBtn.disabled = true;
    }else{
        modalMarkup(randomEmployeeData[index-1]);
    }
}

function nextModal(index){
    const currentModal = document.querySelector('.modal-container');
    currentModal.remove();
    if(index === 11){
        const nextBtn = currentModal.querySelector('#modal-next');
        nextBtn.disabled = true;
    }else{
        modalMarkup(randomEmployeeData[index+1]);
    }
    
}


/** NEED TO FIGURE OUT HOW TO DISABLE NEXT AND PREV BUTTONS FOR LAST AND FIRST MODALS RESPECTIVELY 
 * 
 * if(index===11){
        const nextBtn = document.querySelector('#modal-next');
        nextBtn.disabled = true;
    }
 */

//======================EVENT LISTENERS FOR EVERYTHING================

let index = null;
gallery.addEventListener('click', (e)=>{
    if(e.target.closest('.card')){
        const card = e.target.closest('.card');
        const employeeEmail = card.querySelector('.card-text').textContent;
        const find = randomEmployeeData.findIndex(employee => employee.email === employeeEmail);
        modalMarkup(randomEmployeeData[find]);
        index = find;
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

body.addEventListener('click', (e)=>{
    if(e.target.closest('#modal-prev')){
        prevModal(index)
        index-=1
    }else if(e.target.closest('#modal-next')){
        nextModal(index)
        index+=1
    }
})

form.addEventListener('submit', ()=>{
    search();
})

form.addEventListener('keyup', ()=>{
    search();
})

getRandomEmployees();

