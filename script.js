'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const section1 = document.querySelector('#section--1');


const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach((btn)=> {
  btn.addEventListener('click', openModal)
});

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

btnScrollTo.addEventListener('click', (e) => {
  e.preventDefault();
  section1.scrollIntoView({behavior: "smooth"}) //only works in modern browsers
});

// Page Navigation

document.querySelector('.nav__links').addEventListener('click', (e) => {
  e.preventDefault();
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    console.log(id);
    document.querySelector(id).scrollIntoView({behavior: 'smooth'})
  }
});

// Tabbed Component


tabsContainer.addEventListener('click', (e) => {
  const clicked = e.target.closest('.operations__tab');
  console.log(clicked);
  if(!clicked) return;
  tabsContent.forEach(content => content.classList.remove('operations__content--active')); 

  // Active Tab
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active'); 
  
  // Activate Content Area
  console.log(clicked.dataset.tab);
  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active');
});

// Menu Fade Animation

const handleHover = function(e, opacity) {
  if(e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img') // searching for any img element in the nav element

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = opacity;
      });
      logo.style.opacity = opacity;
    }};

nav.addEventListener('mouseover', e => handleHover(e, 0.5));

nav.addEventListener('mouseout', e => handleHover(e, 1));

// Sticky Navigation

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;
  if( !entry.isIntersecting) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
};

const headerObserver = new IntersectionObserver (stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`
});

headerObserver.observe(header);

// Reveal Sections

const allSections = document.querySelectorAll('.section');
const revealSection = function(entries, observer) {
  const [entry] = entries;
  if(!entry.isIntersecting) return
  else {
    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target);
  }
};

const sectionObserver = new IntersectionObserver (revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function(section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

// Lazy Loading Images
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = entries => {
  const [entry] = entries;
  if (!entry.isIntersecting) return
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', () => {
    entry.target.classList.remove('lazy-img');
  });
  sectionObserver.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
});

imgTargets.forEach(img => imgObserver.observe(img));

// Slider 
const slidesArray = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
let currentSlide = 0; //would handle this with state in a real application
const maxSlide = slidesArray.length;

const goToSlide = currentSlide => {
  slidesArray.forEach((slide, index) => {
    slide.style.transform = `translateX(${100 * (index - currentSlide)}%)`
  });
};

goToSlide(0);

// Next Slide
const nextSlide = () => {
  if (currentSlide == maxSlide - 1) {
    currentSlide = 0;
  } else {
    currentSlide++;
  }
  goToSlide(currentSlide);
};

// Prev Slide
const prevSlide = () => {
  if (currentSlide === 0) {
    currentSlide = maxSlide - 1;
  } else {
    currentSlide--;
  }
  goToSlide(currentSlide);
};

btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);