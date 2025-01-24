import { FC } from 'react';
import { Link } from 'react-router';
import { styled, Typography } from '@mui/material';

// Styled parent wrapper
const ParentWrapper = styled('div')(() => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '10px 0 10px 0',
  maxHeight: '50px',
  position: 'relative', // Для абсолютного позиционирования изображения
  width: '100%',
}));

const LinkStyled = styled(Link)(() => ({
  height: '100%',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontSize: theme.typography.fontSize,
  fontWeight: theme.typography.fontWeightBold,
  marginLeft: theme.spacing(1),
  whiteSpace: 'nowrap',
  transition: 'opacity 0.3s ease, visibility 0.3s ease',
}));

const AuthLogo: FC = () => {
  return (
    <ParentWrapper>
      <LinkStyled
        to="/"
        sx={{ position: 'relative', alignItems: 'center', justifyContent: 'left' }}
      >
        <StyledTypography>
          HPS ERP
        </StyledTypography>
        {/* </Box> */}
      </LinkStyled>
    </ParentWrapper>
  );
};

export default AuthLogo;
