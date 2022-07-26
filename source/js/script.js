// ==================================
// Input phone mask
// https://github.com/uNmAnNeR/imaskjs
// ==================================
import IMask from 'imask';
const maskInput = document.querySelectorAll('.mask');
maskInput.forEach(function(el, i){
  new IMask(el, { mask: '+{7} (000) 000-00-00' });
})



// ==================================
// Sliders
// https://github.com/nolimits4web/swiper
// ==================================
 import Swiper, { Navigation, Pagination } from 'swiper';
  // import Swiper and modules styles
  import 'swiper/css';
  import 'swiper/css/navigation';
  import 'swiper/css/pagination';

  // configure Swiper to use modules
  Swiper.use([Navigation, Pagination]);

  // init Swiper:
  const swiper = new Swiper({});



// ==================================
// Smooth scroll to anchor
// ==================================
const gotop = document.querySelector('.gotop');

if (gotop) {
  gotop.addEventListener('click', (e) => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  });
}



// ==================================
// Yandex map
// ==================================
import ymaps from 'ymaps';

const map = document.querySelector('.map');
if (map) {
  const coords = JSON.parse(map.dataset.coords);
  const tip = map.dataset.tip;

  ymaps.load("https://api-maps.yandex.ru/2.1/?lang=ru_RU").then(maps => {
    const indexMap = new maps.Map(map, {
      center:coords,
      zoom: 15,
      controls:["zoomControl"]
    });
    indexMap.behaviors.disable("scrollZoom");
    indexMap.behaviors.disable("MultiTouch");

    const marker = new maps.Placemark(coords, {
      hintContent: tip
    }, {
      iconLayout: 'default#image',
      iconImageHref: '../images/map-marker.svg',
      iconImageSize: [68, 71],
      iconImageOffset: [-24, -24],
    });

    indexMap.geoObjects.add(marker);

  })
  .catch(error => console.log('Failed to load Yandex Maps', error));
}



// ==================================
// Lightbox
// ==================================
import GLightbox from 'glightbox';

const lightbox = GLightbox({
  touchNavigation: true,
  loop: true,
  slideEffect: 'fade',
});


