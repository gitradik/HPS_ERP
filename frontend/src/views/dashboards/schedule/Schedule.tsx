import { useTranslation } from 'react-i18next';
import PageContainer from 'src/components/container/PageContainer';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import { ScheduleTimeline } from './ScheduleTimeline';

const SchedulePage = () => {
  const { t } = useTranslation();
  const BCrumb = [{ to: '/', title: t('MenuItems.home_page') }, { title: t('MenuItems.schedule') }];

  return (
    <PageContainer title={t('MenuItems.schedule')} description={t('MenuItems.schedule_descr')}>
      <Breadcrumb title={t('MenuItems.schedule')} items={BCrumb} />
      <ScheduleTimeline />
    </PageContainer>
  );
};

export default SchedulePage;
