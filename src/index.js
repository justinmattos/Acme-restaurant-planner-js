import axios from 'axios'

const userList = document.querySelector('#user-list');
const restaurantList = document.querySelector('#restaurant-list');
const reservationList = document.querySelector('#reservation-list');

const renderUsers = (users) => {
    users.forEach(user => {
        const newLi = document.createElement('li');
        const newA = document.createElement('a');
        newA.innerHTML = user.name;
        newA.href = `#${user.id}`;
        newLi.appendChild(newA);
        userList.appendChild(newLi);
    });
}

const renderRestaurant = (restaurants) => {
    restaurants.forEach(restaurant => {
        const newLi = document.createElement('li');
        newLi.innerHTML = restaurant.name;
        restaurantList.appendChild(newLi);
    });
}

const renderReservation = async(hash) => {
    const resies = (await axios.get(`/api/users/${hash}/reservations`)).data
    reservationList.innerHTML = '';
    resies.forEach(reservation => {
        const newLi = document.createElement('li');
        newLi.innerHTML = `${reservation.restaurant.name}`;
        reservationList.appendChild(newLi);
    });
}

const init = async() => {
    try{
        const users = (await axios.get('/api/users')).data;
        renderUsers(users);

        const restaurants = (await axios.get('/api/restaurants')).data;
        renderRestaurant(restaurants);



    }
    catch(ex){
        console.log(ex);
    }
}
init();

window.addEventListener('hashchange', async()=> {
    const hash = window.location.hash.slice(1)*1;
    renderReservation(hash);
})