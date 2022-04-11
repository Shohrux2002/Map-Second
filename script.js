'use strict';

// prettier-ignore

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');
const startBtn = document.querySelector('.btn--start');
const formRow = document.querySelectorAll('.form__row');
console.log(formRow[1]);
let latt, longg;
let mapEvent = '';
let map;

let marLat = latt;
let marLong = longg;

let endLat = latt;
let endLong = longg;
let distance;
class App {
  constructor() {
    this._getPosition();
    form.addEventListener('submit', this._renderList);
    inputType.addEventListener('change', this._toggleSelect);

    // form.addEventListener('submit', this._renderList());
  }

  _getPosition() {
    navigator.geolocation.getCurrentPosition(
      this._showMap.bind(this),
      function () {
        alert('Sizni turgan orningizni aniqlay olmadim');
      }
    );
  }
  _showMap(e) {
    [latt, longg] = [e.coords.latitude, e.coords.longitude];
    console.log(latt, longg);
    map = L.map('map', {
      boxZoom: false,
      zoomControl: false,
    }).setView([latt, longg], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
    this._start();
  }

  _start() {
    let marLat = latt;
    let marLong = longg;

    let greenIcon = new L.Icon({
      iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png`,
      shadowUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });
    let startPosition = L.marker([latt, longg], {
      draggable: true,
      icon: greenIcon,
    }).addTo(map);
    startPosition.on('dragend', function (e) {
      marLat = startPosition.getLatLng().lat;
      marLong = startPosition.getLatLng().lng;
      // console.log(marLat);
    });
    let edd = 1;
    document.addEventListener('keydown', function (event) {
      if (event.key == 'Enter') {
        if (edd == 1) {
          edd++;
          map.removeLayer(startPosition);
          let redIcon = new L.Icon({
            iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png`,
            shadowUrl:
              'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41],
          });
          L.marker([marLat, marLong], {
            draggable: false,
            icon: redIcon,
          }).addTo(map);
          let endPosition = L.marker([marLat + 0.01, marLong + 0.01], {
            draggable: true,
            icon: greenIcon,
          }).addTo(map);
          endPosition.on('dragend', function (e) {
            endLat = endPosition.getLatLng().lat;
            endLong = endPosition.getLatLng().lng;
            // console.log(marLat);
          });
        }
        if (edd == 2) {
          document.addEventListener('keydown', function (e) {
            if (e.key == 'Enter') {
              L.Routing.control({
                waypoints: [
                  L.latLng(marLat, marLong),
                  L.latLng(endLat, endLong),
                ],
                createMarker: function () {
                  return null;
                },
              })
                .on('routesfound', function (e) {
                  distance = e.routes[0].summary.totalDistance;
                  console.log(distance);
                })
                .addTo(map);
              form.style.display = 'grid';
              form.classList.remove('hidden');
              startBtn.style.display = 'none';
              edd++;
            }
          });
        }
        if (edd == 3) {
          this._renderList();
        }

        // this._keyEnter();
      }
      startBtn.textContent = `Manzilni belgilang`;
      startBtn.style.letf = `120px`;
    });
  }
  _toggleSelect() {
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
  }
  _renderList(e) {
    e.preventDefault();
    let tezlik =
      inputType.value === 'running' ? inputCadence.value : inputElevation.value;
    let vaqt = distance / tezlik;

    let html = `<li class="workout workout--${
      inputType.value
    }" data-id='${`cjrcec`}'>
    <h2 class="workout__title">${inputType.value}</h2>
    <div class="workout__details">
      <span class="workout__icon">${
        inputType.value === 'running' ? '🏃‍♂️' : '🚴‍♀️'
      }</span>
      <span class="workout__value">${distance}</span>
      <span class="workout__unit">m</span>
    </div>
    <div class="workout__details">
      <span class="workout__icon">⏱</span>
      <span class="workout__value">${vaqt}</span>
      <span class="workout__unit">min</span>
    </div>`;
    if (inputType.value === 'running') {
      html += ` <div class="workout__details">
      <span class="workout__icon">⚡️</span>
      <span class="workout__value">${inputCadence.value}</span>
      <span class="workout__unit">m/min</span>
    </div>
    
  </li>`;
    }
    if (inputType.value === 'cycling') {
      html += `  <div class="workout__details">
      <span class="workout__icon">⚡️</span>
      <span class="workout__value">${inputElevation.value}</span>
      <span class="workout__unit">m/min</span>
    </div>
   
  </li> `;
    }
    form.insertAdjacentHTML('afterend', html);
  }
}

// class App {
// #mashqlar = [];
// constructor() {
//   startBtn.addEventListener('click', this._start());

// this._getPosition();
// form.addEventListener('submit', this._createObject.bind(this));
// inputType.addEventListener('change', this._toggleSelect);
// containerWorkouts.addEventListener('click', this._moveCenter.bind(this));
// }
//boshlangich nuqtani kirgazish
// _start() {
//   this._getPosition();
// }
// // Hozirgi ornimiz koordinatalarinin olish
// _getPosition() {
//   navigator.geolocation.getCurrentPosition(
//     this._showMap.bind(this),
//     function () {
//       alert('Sizni turgan orningizni aniqlay olmadim');
//     }
//   );
// }

//  ornimiz olgan koordinatalarinin mapga berish
// _showMap(e) {
//   [latt, longg] = [e.coords.latitude, e.coords.longitude];
//   map = L.map('map', {
//     boxZoom: false,
//     zoomControl: false,
//   }).setView([latt, longg], 13);

//   L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     attribution:
//       '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
//   }).addTo(map);
//   this._showForm();
// olish
// this._getLocalStorage();
// }
// formani ochish
// _showForm() {
//   map.on('click', function (e) {
//     mapEvent = e;
//     form.style.display = 'grid';
//     form.classList.remove('hidden');
//     inputDistance.focus();
//   });
// }
// // formani yopish
// _hideForm() {
//   form.classList.add('hidden');
//   form.style.display = 'none';
//   inputDistance.value =
//     inputDuration.value =
//     inputCadence.value =
//     inputElevation.value =
//       '';
// }
// // marker chiqarish
// _submitMap(mashq) {
//   L.marker([mashq.coords[0], mashq.coords[1]], {
//     draggable: true,
//     background: 'red',
//   }).addTo(map);
// L.Routing.control({
//   waypoints: [
//     L.latLng(latt, longg),
//     L.latLng(mashq.coords[0], mashq.coords[1]),
//   ],
// });

//     .addTo(map)
//     .bindPopup(
//       L.popup({
//         maxWidth: 300,
//         minWidth: 100,
//         autoClose: true,
//         closeOnClick: false,
//         className: `${mashq.type}-popup`,
//       })
//         .setLatLng([mashq.coords[0], mashq.coords[1]])
//         .setContent(`${mashq.malumot}`)
//         .openOn(map)
//     )
//     .openPopup();
// }
// _toggleSelect() {
//   inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
//   inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
// }
//form malumotlarinni konstructor orqali obekt yaratish
// _createObject(e) {
//   e.preventDefault();
//   let mashq = '';
//   const checkNumber = (...inputs) => {
//     return inputs.every(val => Number.isFinite(val));
//   };
//   const checkPositive = (...inputs) => {
//     return inputs.every(val => val > 0);
//   };
//   let distance = +inputDistance.value;
//   let duration = +inputDuration.value;
//   let type = inputType.value;
//   if (type === 'running') {
//     let cadance = +inputCadence.value;
//     if (
//       !checkNumber(distance, duration, cadance) &&
//       !checkPositive(distance, duration, cadance)
//     ) {
//       return alert('Musbat sonlarni kiriting');
//     }
//     if (distance == 0 || duration == 0 || cadance == 0) {
//       return alert('Musbat sonlarni kiriting');
//     }
//     mashq = new Piyoda(
//       distance,
//       duration,
//       [mapEvent.latlng.lat, mapEvent.latlng.lng],
//       cadance
//     );
//   }
//   if (type === 'cycling') {
//     let elevation = inputElevation.value;
//     if (
//       !checkNumber(distance, duration, elevation) &&
//       !checkPositive(distance, duration)
//     ) {
//       return alert('Musbat sonlarni kiriting');
//     }
//     if (distance == 0 || duration == 0 || elevation == 0) {
//       return alert('Musbat sonlarni kiriting');
//     }
//     mashq = new Velic(
//       distance,
//       duration,
//       [mapEvent.latlng.lat, mapEvent.latlng.lng],
//       elevation
//     );
//   }

//   // arrayga push qilish
//   this.#mashqlar.push(mashq);
//   // MASHQ OBJECTINI mARKER UCHUN BERISH
//   this._submitMap(mashq);
//   // render qilish
//   this._renderList(mashq);
//   // formni ochirish
//   this._hideForm();
//   // saqlash
//   this._setLocalStorage();
// }
// ROYHAT TUZISH
// _renderList(obj) {
//   let html = `<li class="workout workout--${obj.type}" data-id='${obj.id}'>
//   <h2 class="workout__title">${obj.malumot}</h2>
//   <div class="workout__details">
//     <span class="workout__icon">${obj.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'}</span>
//     <span class="workout__value">${obj.distance}</span>
//     <span class="workout__unit">km</span>
//   </div>
//   <div class="workout__details">
//     <span class="workout__icon">⏱</span>
//     <span class="workout__value">24</span>
//     <span class="workout__unit">${obj.duration}</span>
//   </div>`;
//   if (obj.type === 'running') {
//     html += ` <div class="workout__details">
//     <span class="workout__icon">⚡️</span>
//     <span class="workout__value">${obj.tezlik.toFixed(4)}</span>
//     <span class="workout__unit">min/km</span>
//   </div>
//   <div class="workout__details">
//     <span class="workout__icon">🦶🏼</span>
//     <span class="workout__value">${obj.cadance}</span>
//     <span class="workout__unit">spm</span>
//   </div>
// </li>`;
//   }
//   if (obj.type === 'cycling') {
//     html += `  <div class="workout__details">
//     <span class="workout__icon">⚡️</span>
//     <span class="workout__value">${obj.tezlik.toFixed(4)}</span>
//     <span class="workout__unit">km/h</span>
//   </div>
//   <div class="workout__details">
//     <span class="workout__icon">⛰</span>
//     <span class="workout__value">${obj.elevation}</span>
//     <span class="workout__unit">m</span>
//   </div>
// </li> `;
//   }
//   form.insertAdjacentHTML('afterend', html);
// }
// LocalStoregaga Saqlash
// _setLocalStorage() {
//   localStorage.setItem('MashqArr', JSON.stringify(this.#mashqlar));
// }
// Localstoragedan olish
// _getLocalStorage() {
//   let data = JSON.parse(localStorage.getItem('MashqArr'));
//   if (!data) return;
//   this.#mashqlar = data;

//   this.#mashqlar.forEach(val => {
//     this._submitMap(val);
//     this._renderList(val);
//   });
// }
// _moveCenter(e) {
//   let element = e.target.closest('.workout');
//   console.log(element);
//   if (!element) return;
//   console.log(element.getAttribute('data-id'));

//   let objs = this.#mashqlar.find(val => {
//     return element.getAttribute('data-id') == val.id;
//   });
//   console.log(objs);
//   let cordinata = objs.coords;

//   map.setView(cordinata, 18, {
//     animate: true,
//     pan: {
//       duration: 1,
//     },
//   });
// }
// }
// Ota class
// class Joy {
//   date = new Date();
//   id = (Date.now() + '').slice(-7);
//   constructor(distance, duration, coords) {
//     this.distance = distance;
//     this.duration = duration;
//     this.coords = coords;
//   }
// _setTafsif() {
//   const months = [
//     'January',
//     'February',
//     'March',
//     'April',
//     'May',
//     'June',
//     'July',
//     'August',
//     'September',
//     'October',
//     'November',
//     'December',
//   ];
//   this.malumot = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
//     months[this.date.getMonth()]
//   } ${this.date.getDate()}`;
// }
// }
// Vorislar
// class Piyoda extends Joy {
//   type = 'running';
//   constructor(distance, duration, coords, cadance) {
//     super(distance, duration, coords);
//     this.cadance = cadance;
//     this.calcTime();
//     this._setTafsif();
//   }
//   calcTime() {
//     this.tezlik = this.distance / this.duration / 60;
//     return this.tezlik;
//   }
// }
// class Velic extends Joy {
//   type = 'cycling';
//   constructor(distance, duration, coords, elevation) {
//     super(distance, duration, coords);
//     this.elevation = elevation;
//     this.calcSpeed();
//     this._setTafsif();
//   }
//   calcSpeed() {
//     this.tezlik = this.distance / this.duration / 60;
//     return this.tezlik;
//   }
// }
const magicMap = new App();
