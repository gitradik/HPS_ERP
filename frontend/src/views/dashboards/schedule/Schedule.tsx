import { useTranslation } from 'react-i18next';
import PageContainer from 'src/components/container/PageContainer';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import { ScheduleTimeline } from './ScheduleTimeline';
import { useEffect } from 'react';
import { useDispatch } from 'src/store/Store';
import { toggleLayout } from 'src/store/customizer/CustomizerSlice';

const SchedulePage = () => {
  const { t } = useTranslation();
  const BCrumb = [{ to: '/', title: t('MenuItems.home_page') }, { title: t('MenuItems.schedule') }];
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(toggleLayout('full'));

    return () => {
      dispatch(toggleLayout('boxed'));
    };
  }, []);

  return (
    <PageContainer title={t('MenuItems.schedule')} description={t('MenuItems.schedule_descr')}>
      <Breadcrumb title={t('MenuItems.schedule')} items={BCrumb} />
      <ScheduleTimeline />
    </PageContainer>
  );
};

export default SchedulePage;
