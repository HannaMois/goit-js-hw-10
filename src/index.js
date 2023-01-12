import './css/styles.css';
import Notiflix from 'notiflix';
import fetchCountries from './fetchCountries';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

const countryInput = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

countryInput.addEventListener('input', debounce(onCountryInput, DEBOUNCE_DELAY));

function onCountryInput (evt) {
    // evt.preventDefault();
    let searchQuery = evt.target.value.trim();
    //console.log(searchQuery);

    if (searchQuery) {
        fetchCountries(searchQuery)
        .then(data => {
            if (data.length > 10) {
                Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
                return;
            } else if (data.length >= 2 && data.length <= 10) {
                renderCountryList(data);
                return;
            } else if (data.length === 1) {
                renderCountryCard(data);
                return;
            }
        })
        .catch(error => {
            Notiflix.Notify.failure('Oops, there is no country with that name.')
        })
    } else {
        countryInfo.innerHTML = '';
        countryList.innerHTML = '';
    }
}

// fetchCountries(searchQuery).then().catch(onFetchError);
// function onFetchError(error) {
//     if (error.message === '404') {
//       Notiflix.Notify.failure('Oops, there is no country with that name');
//     }
//   }

function renderCountryList(countries) {
    const markup = countries.map(({ name, flags }) => {
            return `
                <li class = 'card'>
                    <img class = 'img'
                        src = '${flags.svg}'
                        alt = 'country flag'
                        width = 60
                        height = 30
                        
                    />
                    <p class='text'><i>${name}</i></p>
                </li>`
    }).join('');
        countryList.innerHTML = markup;
        countryInfo.innerHTML = '';
        
    };

function renderCountryCard(countries) {
    const markup = countries.map(({ name, capital, population, languages, flags }) => {
        return `<img
                    src='${flags.svg}'
                    alt='country flag'
                    width=150
                />
                <h1 class = 'text'>${name}</h1>
                    <p class = 'info'>Capital: <span class='span'><i>${capital}</i></span></p>
                    <p class = 'info'>Population: <span class='span'><i>${population}</i></span></p>
                    <p class = 'info'>Languages: <span class='span'><i>${Object.values(countries[0].languages).map(elem => elem.name).join(',')}</i></span></p>
           `}).join('');
       
        countryInfo.innerHTML = markup;
        countryList.innerHTML = '';
    }
