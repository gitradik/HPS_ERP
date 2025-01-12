import React from 'react';
import { Snackbar, Alert } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { removeNotification, selectNotifications } from 'src/store/apps/notifications/NotificationsSlice';

const Notifications: React.FC = () => {
  const dispatch = useDispatch();
  const notifications = useSelector(selectNotifications);

  const handleClose = (id: string) => {
    dispatch(removeNotification(id));
  };

  return (
    <>
      {notifications.map((notification) => (
        <Snackbar
          key={notification.id}
          open={true}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          autoHideDuration={notification.autoHideDuration || 6000}
          onClose={() => handleClose(notification.id!)}
        >
          <Alert
            severity={notification.type}
            variant="filled"
            sx={{ width: '100%' }}
            onClose={() => handleClose(notification.id!)}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      ))}
    </>
  );
};

export default Notifications;
