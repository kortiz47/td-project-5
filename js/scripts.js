//Global Variables
const gallery = document.querySelector('#gallery');

//Retrieves Data of 12 Random Employees

async function getRandomData(){
    const request = await fetch('https://randomuser.me/api/?results=12&nat=us')
        .then(response=>response.json())
        .catch(error => console.error('There was an error reaching the Random User API - '+ error));
    const rawData = await request.results;
    galleryMarkup(rawData);
    modalMarkup(rawData);
}

//Markup
/**
 * 
 * @param {object} employeeArray the data employee promises returned from the fetch api call
 */

//Still need to make sure it loops over and does it for all 12 users and not just 1

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

function birthday(dob){
    const dateOfBirth = dob.date.split('T');
    const splitDates = dateOfBirth[0].split('-');
    const newDateOrder = [splitDates[1],splitDates[2],splitDates[0]];
    return newDateOrder.join('/');
}

function modalMarkup(employeeArray){
    employeeArray.forEach(employee => {
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
        console.log(template);
    })
    
}


//Calling initializing function
getRandomData()
