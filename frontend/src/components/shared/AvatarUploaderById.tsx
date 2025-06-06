import React, { useEffect, useState } from 'react';
import { Avatar, Button, Stack, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';

import { useDispatch } from 'src/store/Store';
import { useUploadPhotoByIdMutation } from 'src/services/api/uploadApi';
import { getUploadsImagesProfilePath } from 'src/utils/uploadsPath';
import { updateAccountSetting } from 'src/store/apps/setting/AccountSettingSlice';
import { User } from 'src/types/user/user';

const AvatarUploaderById = ({ user }: { user: User }) => {
  const initialAvatar = getUploadsImagesProfilePath(user.photo);
  const [avatarPreview, setAvatarPreview] = useState(initialAvatar);
  const [uploadAvatarById, { isLoading }] = useUploadPhotoByIdMutation();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    setAvatarPreview(getUploadsImagesProfilePath(user.photo));
  }, [user.photo]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];

    try {
      if (!user?.id) return;

      const response = await uploadAvatarById({ file, id: user.id }).unwrap();
      const { filename } = response;
      const updatedUser = { ...user, photo: filename };

      dispatch(updateAccountSetting(updatedUser));
      setAvatarPreview(getUploadsImagesProfilePath(filename));

      enqueueSnackbar('Avatar erfolgreich aktualisiert!', {
        variant: 'success',
        autoHideDuration: 3000,
      });
    } catch (err: any) {
      enqueueSnackbar(err?.data?.friendlyMessage || 'Fehler beim Hochladen des Avatars', {
        variant: 'error',
        autoHideDuration: 3000,
      });
    }
  };

  const handleResetAvatar = () => {
    enqueueSnackbar('Avatar zurückgesetzt!', { variant: 'info', autoHideDuration: 3000 });
  };

  return (
    <>
      <Avatar
        src={avatarPreview}
        alt="Benutzeravatar"
        sx={{ width: 120, height: 120, margin: '0 auto' }}
      />
      <Stack direction="row" justifyContent="center" spacing={2} my={3}>
        <Button
          variant="contained"
          color="primary"
          component="label"
          disabled={isLoading}
          loading={isLoading}
        >
          Hochladen
          <input hidden accept="image/*" type="file" onChange={handleFileChange} />
        </Button>
        <Button variant="outlined" color="error" onClick={handleResetAvatar}>
          Zurücksetzen
        </Button>
      </Stack>
      <Typography variant="subtitle1" color="textSecondary" mb={4}>
        Erlaubte Formate: JPG, GIF oder PNG. Maximalgröße: 800K
      </Typography>
    </>
  );
};

export default AvatarUploaderById;
