import artImg from '../../../../assets/img/filters/art.png';
import histImg from '../../../../assets/img/filters/historical.png';
import archImg from '../../../../assets/img/filters/arch.png';
import cusineImg from '../../../../assets/img/filters/cusine.png';
import dealImg from '../../../../assets/img/filters/deal.png';
import preschoolImg from '../../../../assets/img/filters/prescool.png';
import walkImg from '../../../../assets/img/filters/walk.png';
import bicycleImg from '../../../../assets/img/filters/bicycle.png';
import carImg from '../../../../assets/img/filters/car.png';

const filters = {
  categories: [
    {
      id: 1,
      f_id: 1,
      img: archImg,
      alt: 'arch',
      title: 'Architecture',
      active: false,
    },
    {
      id: 2,
      f_id: 2,
      img: artImg,
      alt: 'art',
      title: 'Art & Culture',
      active: false,
    },
    {
      id: 3,
      f_id: 3,
      img: artImg,
      alt: 'children',
      title: 'Children’s Activities',
      active: false,
    },
    {
      id: 4,
      f_id: 4,
      img: cusineImg,
      alt: 'cusine',
      title: 'Cuisine & Bar',
      active: false,
    },
    {
      id: 5,
      f_id: 5,
      img: cusineImg,
      alt: 'stories',
      title: 'Fictional Storytelling',
      active: false,
    },
    {
      id: 6,
      f_id: 6,
      img: histImg,
      alt: 'history',
      title: 'Historical',
      active: false,
    },
    {
      id: 7,
      f_id: 7,
      img: histImg,
      alt: 'literature',
      title: 'Literature',
      active: false,
    },
    {
      id: 8,
      f_id: 8,
      img: dealImg,
      alt: 'nightlife',
      title: 'Nightlife',
      active: false,
    },
    {
      id: 9,
      f_id: 9,
      img: dealImg,
      alt: 'theme',
      title: 'Special Theme',
      active: false,
    },
  ],
  ages: [
    {
      id: 4,
      f_id: 10,
      img: preschoolImg,
      alt: 'prescool',
      title: 'Preschool',
      active: false,
    },
    {
      id: 5,
      f_id: 11,
      img: preschoolImg,
      alt: 'elementary',
      title: 'Elementary',
      active: false,
    },
    {
      id: 7,
      f_id: 12,
      img: preschoolImg,
      alt: 'adult',
      title: 'Adult',
      active: false,
    },
    {
      id: 6,
      f_id: 13,
      img: preschoolImg,
      alt: 'teen',
      title: 'Teen',
      active: false,
    },
  ],
  mobility: [
    {
      id: 1,
      f_id: 14,
      img: walkImg,
      alt: 'walk',
      title: 'Walking',
      active: false,
    },
    {
      id: 2,
      f_id: 15,
      img: bicycleImg,
      alt: 'bicycle',
      title: 'Bicycle',
      active: false,
    },
    {
      id: 3,
      f_id: 16,
      img: carImg,
      alt: 'car',
      title: 'Car',
      active: false,
    },
  ],
};

export default filters;
