import { uniqueId } from 'lodash';

interface MenuitemsType {
  [x: string]: any;
  id?: string;
  navlabel?: boolean;
  subheader?: string;
  title?: string;
  icon?: any;
  href?: string;
  children?: MenuitemsType[];
  chip?: string;
  chipColor?: string;
  variant?: string;
  external?: boolean;
}
import {
  IconClock,
  IconUsers,
  IconCalendar,
  IconUser,
  IconUserCheck,
  IconFileInvoice,
  IconFilePlus,
  IconFileCheck,
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

const Menuitems = () => {
  const { t } = useTranslation();

  const items: MenuitemsType[] = [
    {
      navlabel: true,
      subheader: 'Bereichsmenü',
    },
    {
      id: uniqueId(),
      title: t('MenuItems.schedule'),
      icon: IconCalendar,
      href: '/schedule',
    },
    {
      id: uniqueId(),
      title: t('MenuItems.staff_management'),
      icon: IconUsers,
      href: '/staff',
    },
    {
      id: uniqueId(),
      title: t('MenuItems.time_tracking'),
      icon: IconClock,
      href: '/time-tracking',
    },
    {
      id: uniqueId(),
      title: t('MenuItems.documents_create'),
      icon: IconFilePlus,
      href: '/documents_create',
      children: [
        {
          id: uniqueId(),
          title: t('MenuItems.documents_create_invoice'),
          icon: IconFileInvoice,
          href: '/documents_create/invoice',
        },
        {
          id: uniqueId(),
          title: t('MenuItems.documents_create_offer'),
          icon: IconFileCheck,
          href: '/documents_create/offer',
        },
      ],
    },
    {
      id: uniqueId(),
      title: t('MenuItems.employees'),
      icon: IconUser,
      href: '/employees',
    },
    {
      id: uniqueId(),
      title: t('MenuItems.clients'),
      icon: IconUserCheck,
      href: '/clients',
    },
  ];

  return items;
};

export default Menuitems;
