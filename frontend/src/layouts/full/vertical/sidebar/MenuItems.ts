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
  IconUserCheck
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

const Menuitems = () => {
  const { t } = useTranslation();

  const items: MenuitemsType[] = [
    {
      navlabel: true,
      subheader: 'Home',
    },
    {
      id: uniqueId(),
      title: t('MenuItems.schedule_management'), // "Tvarkaraščio valdymas"
      icon: IconCalendar,
      href: '/schedule-management',
    },
    {
      id: uniqueId(),
      title: t('MenuItems.staff_management'), // "Personalas valdymas"
      icon: IconUsers,
      href: '/staff-management',
    },
    {
      id: uniqueId(),
      title: t('MenuItems.time_tracking'), // "Laiko sekimas"
      icon: IconClock,
      href: '/time-tracking',
    },
    {
      id: uniqueId(),
      title: t('MenuItems.employees'), // "Darbuotojai"
      icon: IconUser,
      href: '/employees',
    },
    {
      id: uniqueId(),
      title: t('MenuItems.clients'), // "Klientai"
      icon: IconUserCheck,
      href: '/clients',
    },
  ];

  return items;
}

export default Menuitems;
