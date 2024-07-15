const standartAndShortenerlinksGroup = {};
const linksFromLocalStorage = {};

function inizializeMobileMenu() {
    let mobileButton = document.getElementsByClassName('mobile__button');
    mobileButton[0].addEventListener('click', function(event) {
        event.preventDefault();
        let mainMenu = document.getElementsByClassName('header__main-menu');
        mainMenu[0].classList.toggle('open');
    });
}

inizializeMobileMenu();


document.addEventListener('DOMContentLoaded', function() {
    if (localStorage.length != 0) {
        retrievLinksFromLocalStorage();
        insertLinksInHTML();
        assignClickEventToButtons();
    }
})

function retrievLinksFromLocalStorage() {
    for(link in localStorage) {
        linksFromLocalStorage[link] = localStorage[link];
    }
}

function insertLinksInHTML() {
    let linksItemsList = document.getElementsByClassName('statisticks__links-inner');
    for(standartlink in localStorage) {
        if(localStorage.hasOwnProperty(standartlink)) {
            linksItemsList[0].innerHTML += `
            <div class="link__item">
                <div class="link__first-link">
                    <p>${standartlink}</p>
                </div>
                <div class="link__second-link">
                    <p>${localStorage.getItem(standartlink)}</p>
                </div>
                <div class="link__button">
                    <a href="#" class="button shortener__link-button">Copy</a>
                </div>
            </div>`;
        }
        else {
            continue;
        }
    }
}

let shorternerFormButton = document.getElementsByClassName('statistics__form-button');

shorternerFormButton[0].addEventListener('click', function(event) {
    event.preventDefault();
    let formInputField = document.getElementById('form__input');
    let shorternerForm = document.getElementsByClassName('statistics__form');
    const isOnlySpaceString = formInputField.value.replace(/\s/g, '').length;
    if(formInputField.value == '' || !isOnlySpaceString) {
        formInputField.value = "";
        shorternerForm[0].classList.add('incorrect__input');
    }
    else {
        shorternerForm[0].classList.remove('incorrect__input');
        sendUserLinkAndGetShorternerLink(formInputField.value);
    }
});

function sendUserLinkAndGetShorternerLink(userUrl) {
    const urlToSend = 'https://spoo.me/';
    const data = new URLSearchParams();
    data.append('url', userUrl);
    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", urlToSend, true);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.setRequestHeader('Accept', 'application/json');
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4) {
            if (xhttp.status == 200) {
                setOldAndShortenerLinkInHTML(userUrl, xhttp.responseText);
            } else {
                console.error(`HTTP error! Status: ${xhttp.status}`);
            }
        }
    };
    xhttp.send(data);
}

function setOldAndShortenerLinkInHTML(oldLink, shorternerLink) {
    let oldAndShortenerLinksItem = `
    <div class="link__item">
        <div class="link__first-link">
            <p>${oldLink}</p>
        </div>
        <div class="link__second-link">
            <p>${JSON.parse(shorternerLink).short_url}</p>
        </div>
        <div class="link__button">
            <a href="#" class="button shortener__link-button">Copy</a>
        </div>
    </div>`;
    let linksItemsList = document.getElementsByClassName('statisticks__links-inner');
    linksItemsList[0].innerHTML += oldAndShortenerLinksItem;
    assignClickEventToButtons();
    insertStandartAndShortenerLinksInLinksGroup(oldLink, JSON.parse(shorternerLink).short_url);
    localStorage.setItem(oldLink, JSON.parse(shorternerLink).short_url);
}

function assignClickEventToButtons() {
    let buttons = document.getElementsByClassName('shortener__link-button');
    for (let button of buttons) {
        button.addEventListener('click', function(event){
            event.preventDefault();
            let linksItem = button.closest('.link__item');
            navigator.clipboard.writeText(linksItem.childNodes[3].childNodes[1].textContent);
            for (let button of buttons) {
                button.textContent = 'Copy';
                button.style.background = '#2bd1d1';
                button.style.paddingLeft  = '40px';
                button.style.paddingRight = '40px';
            }
            button.textContent = 'Copied!';
            button.style.background = '#3a3053';
            button.style.paddingLeft  = '28px';
            button.style.paddingRight = '29px';
        });
    }
}

function insertStandartAndShortenerLinksInLinksGroup(regularLink, shortenerLink) {
    standartAndShortenerlinksGroup[regularLink] = shortenerLink;
}