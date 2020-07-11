'use strict';

// our database
const dataBase = JSON.parse(localStorage.getItem('awito')) || [];

// vars
let counter = dataBase.length;
const modalAdd = document.querySelector('.modal__add'),
      modalBtnSubmit = document.querySelector('.modal__btn-submit'),
      modalSubmit = document.querySelector('.modal__submit'),
      catalog = document.querySelector('.catalog'),
      modalItem = document.querySelector('.modal__item'),
      modalBtnWarning = document.querySelector('.modal__btn-warning'),
      modalFileInput = document.querySelector('.modal__file-input'),
      modalFileBtn = document.querySelector('.modal__file-btn'),
      modalImageAdd = document.querySelector('.modal__image-add'),
      addAd = document.querySelector('.add__ad');
      
const modalHeaderItem = document.querySelector('.modal__header-item'),
      modalImageItem = document.querySelector('.modal__image-item'),
      modalStatusItem = document.querySelector('.modal__status-item'),
      modalDescriptionItem = document.querySelector('.modal__description-item'),
      modalCostItem = document.querySelector('.modal__cost-item');

const searchInput = document.querySelector('.search__input'),
      menuContainer = document.querySelector('.menu__container');

const textFileBtn = modalFileBtn.textContent;
const srcModalImage = modalImageAdd.src;

const elementsModalSubmit = [...modalSubmit.elements].filter(elem => elem.tagName !== 'BUTTON');

const infoPhoto = {};

// save in localstorage 
const saveDB = () => localStorage.setItem('awito', JSON.stringify(dataBase));


// Validation form, all inputs must be filled
const checkForm = () => {
  const validForm = elementsModalSubmit.every(elem => elem.value);
  modalBtnSubmit.disabled = !validForm;
  modalBtnWarning.style.display = validForm ? 'none' : '';
}

//  close modal
const closeModal = event => {
  const target = event.target;

  if (target.closest('.modal__close') ||
    target.classList.contains('modal') ||
    event.code === 'Escape') {
    modalAdd.classList.add('hide');
    modalItem.classList.add('hide');
    document.removeEventListener('keydown', closeModal)
    modalImageAdd.src = srcModalImage;
    modalFileBtn.textContent = textFileBtn;
    modalSubmit.reset();
    checkForm();
  }
};

// render card from our db
const renderCard = (DB = dataBase) => {
  catalog.textContent = '';

  DB.forEach(item => {
    catalog.insertAdjacentHTML('beforeend', `
        <li class="card" data-id="${item.id}">
          <img class="card__image" src="data:image/jpeg;base64,${item.image}" alt="test">
          <div class="card__description">
            <h3 class="card__header">${item.nameItem}</h3>
            <div class="card__price">${item.costItem} ₽</div>
          </div>
        </li>
    `)
  });
}

// listener for search items
searchInput.addEventListener('input', () => {

  const valueSearch = searchInput.value.trim().toLowerCase();

  if (valueSearch.length > 2) {
    const result = dataBase.filter(item => item.nameItem.toLowerCase().includes(valueSearch)||
                                           item.descriptionItem.toLowerCase().includes(valueSearch));
    renderCard(result);
  }

})

// upload image
modalFileInput.addEventListener('change', event => {
  const target = event.target;

  const reader = new FileReader();

  const file = target.files[0];

  infoPhoto.filename = file.name;
  infoPhoto.size = file.size;

  reader.readAsBinaryString(file);

  reader.addEventListener('load', event => {
    if (infoPhoto.size < 200000) {
      modalFileBtn.textContent = infoPhoto.filename;
      infoPhoto.base64 = btoa(event.target.result);
      modalImageAdd.src = `data:image/jpeg;base64,${infoPhoto.base64}`;
    } else {
      modalFileBtn.textContent = 'Файл не должен превышать 200кб';
      modalFileInput.value = ''; 
      checkForm();
    }
  })

})

// listener for validation
modalSubmit.addEventListener('input', checkForm);

// create new card 
modalSubmit.addEventListener('submit', event => {
  event.preventDefault();
  const itemObj = {};
  for (const elem of elementsModalSubmit) {
    itemObj[elem.name] = elem.value;
  }
  itemObj.id = counter++;
  itemObj.image = infoPhoto.base64;
  dataBase.push(itemObj);
  closeModal({target: modalAdd});
  saveDB();
  renderCard();
})

// Open add modal
addAd.addEventListener('click', () => {
  modalAdd.classList.remove('hide');
  modalBtnSubmit.disabled = true;
  document.addEventListener('keydown', closeModal)
})

// listener for category tabs
menuContainer.addEventListener('click', event => {
  const target = event.target;

  if (target.tagName === 'A') {
    const result = dataBase.filter(item => item.category === target.dataset.category)

    renderCard(result);
  }

})

// listeners for closeModal
modalAdd.addEventListener('click', closeModal);
modalItem.addEventListener('click', closeModal);

// open card
catalog.addEventListener('click', event => {
  const target = event.target;
  const card = target.closest('.card');

  if (card) {
    const item = dataBase.find(obj => obj.id === +card.dataset.id);

    modalImageItem.src = `data:image/jpeg;base64,${item.image}`;
    modalHeaderItem.textContent = item.nameItem;
    modalStatusItem.textContent = item.status === 'new' ? 'Новый' : 'Б/У';
    modalDescriptionItem.textContent = item.descriptionItem;
    modalCostItem.textContent = item.costItem + ' ₽';

    modalItem.classList.remove('hide');
    document.addEventListener('keydown', closeModal)
  }
})

// first render card
renderCard();