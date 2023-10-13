//GLOBAL VARIABLES
const gallery = document.querySelector('#gallery');
const body = document.querySelector('body');
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
        const template = `
        <div class="card">
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

//===============================MODAL BELOW=================================
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
    </div>
    `;
    gallery.insertAdjacentHTML('afterend', template);
}

//======================EVENT LISTENERS FOR EVERYTHING================

gallery.addEventListener('click', (e)=>{
    if(e.target.closest('.card')){
        const card = e.target.closest('.card');
        const employeeEmail = card.querySelector('.card-text').textContent;
        const find = randomEmployeeData.findIndex(employee => employee.email === employeeEmail);
        modalMarkup(randomEmployeeData[find])
    }
})

body.addEventListener('click', (e)=>{
    if(e.target.closest("div [class='modal']")){
        const modalBox = e.target;
        if(modalBox.textContent === 'X'){
            const modalContainer = e.target.closest('.modal-container');
            modalContainer.remove();
        }
    }
})

//also an event listener for the x clicked to close (or remove the markup that was added)

//same funciton passed here if the user clicks outsid of the modal box^

getRandomEmployees();

