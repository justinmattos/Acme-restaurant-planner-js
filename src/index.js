import axios from 'axios';

const userList = document.querySelector('#user-list');
const restaurantList = document.querySelector('#restaurant-list');
const reservationList = document.querySelector('#reservation-list');

let users,
  restaurants,
  hash = window.location.hash.slice(1) * 1 || 1;

const renderUsers = (users) => {
  userList.innerHTML = '';
  users.forEach((user) => {
    const newLi = document.createElement('li');
    const newA = document.createElement('a');
    if (user.id === hash) newLi.classList.toggle('selected');
    newA.innerHTML = user.name;
    newA.href = `#${user.id}`;
    newLi.appendChild(newA);
    userList.appendChild(newLi);
  });
};

const renderRestaurant = (restaurants) => {
  restaurants.forEach((restaurant) => {
    const newLi = document.createElement('li');
    newLi.innerHTML = restaurant.name;
    newLi.id = `rest-${restaurant.id}`;
    restaurantList.appendChild(newLi);
  });
};

const renderReservation = async (hash) => {
  const reservations = (await axios.get(`/api/users/${hash}/reservations`))
    .data;
  reservationList.innerHTML = '';
  reservations.forEach((reservation) => {
    const newLi = document.createElement('li');
    const newButton = document.createElement('button');
    newLi.innerHTML = `${reservation.restaurant.name}`;
    newButton.id = `resv-${reservation.id}`;
    newButton.innerHTML = 'Delete';
    reservationList.appendChild(newLi);
    newLi.appendChild(newButton);
  });
};

const init = async () => {
  try {
    users = (await axios.get('/api/users')).data;
    renderUsers(users);
    restaurants = (await axios.get('/api/restaurants')).data;
    renderRestaurant(restaurants);
    renderReservation(hash);
  } catch (ex) {
    console.log(ex);
  }
};
init();

window.addEventListener('hashchange', () => {
  hash = window.location.hash.slice(1) * 1;
  renderUsers(users);
  renderReservation(hash);
});

document.addEventListener('click', async (event) => {
  const target = event.target,
    targetId = target.id.slice(5) * 1;
  if (target.parentNode.id === 'restaurant-list') {
    axios
      .post(`/api/users/${hash}/reservations`, {
        restaurantId: targetId,
      })
      .then((res) => {
        renderReservation(hash);
      })
      .catch((err) => {
        console.log(err);
      });
  } else if (target.tagName === 'BUTTON') {
    console.log(`Destroying Reservation #${targetId}`);
    axios.delete(`/api/reservations/${targetId}`).then((res) => {
      renderReservation(hash);
    });
  }
});
