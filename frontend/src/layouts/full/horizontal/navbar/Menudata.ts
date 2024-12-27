
import {
  IconAperture,
  IconBoxMultiple,
  IconPoint
} from '@tabler/icons-react';
import { uniqueId } from 'lodash';
import { useTranslation } from 'react-i18next';

const Menuitems = () => {
  const { t } = useTranslation(); // Получаем функцию t для перевода

  return [
    {
      id: uniqueId(),
      title: t('Sample Page'),
      icon: IconAperture,
      href: '/sample-page',
    },
    {
      id: uniqueId(),
      title: t('Menu Level'),
      icon: IconBoxMultiple,
      href: '/menulevel/',
      children: [
        {
          id: uniqueId(),
          title: 'Level 1',
          icon: IconPoint,
          href: '/l1',
        },
        {
          id: uniqueId(),
          title: 'Level 1.1',
          icon: IconPoint,
          href: '/l1.1',
          children: [
            {
              id: uniqueId(),
              title: 'Level 2',
              icon: IconPoint,
              href: '/l2',
            },
            {
              id: uniqueId(),
              title: 'Level 2.1',
              icon: IconPoint,
              href: '/l2.1',
              children: [
                {
                  id: uniqueId(),
                  title: 'Level 3',
                  icon: IconPoint,
                  href: '/l3',
                },
                {
                  id: uniqueId(),
                  title: 'Level 3.1',
                  icon: IconPoint,
                  href: '/l3.1',
                },
              ],
            },
          ],
        },
      ],
    },
  ];
}

// const Menuitems = [
//   {
//     id: uniqueId(),
//     title: 'Sample Page',
//     icon: IconAperture,
//     href: '/sample-page',
//   },
//   {
//     id: uniqueId(),
//     title: 'Menu Level',
//     icon: IconBoxMultiple,
//     href: '/menulevel/',
//     children: [
//       {
//         id: uniqueId(),
//         title: 'Level 1',
//         icon: IconPoint,
//         href: '/l1',
//       },
//       {
//         id: uniqueId(),
//         title: 'Level 1.1',
//         icon: IconPoint,
//         href: '/l1.1',
//         children: [
//           {
//             id: uniqueId(),
//             title: 'Level 2',
//             icon: IconPoint,
//             href: '/l2',
//           },
//           {
//             id: uniqueId(),
//             title: 'Level 2.1',
//             icon: IconPoint,
//             href: '/l2.1',
//             children: [
//               {
//                 id: uniqueId(),
//                 title: 'Level 3',
//                 icon: IconPoint,
//                 href: '/l3',
//               },
//               {
//                 id: uniqueId(),
//                 title: 'Level 3.1',
//                 icon: IconPoint,
//                 href: '/l3.1',
//               },
//             ],
//           },
//         ],
//       },
//     ],
//   },
// ];
export default Menuitems;
