import { FC } from 'react';
import { Link } from 'react-router';
import { Box, styled, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { AppState } from 'src/store/Store';
import herbaImage from 'src/assets/images/logos/herba.jpg';

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
  opacity: 0,
  visibility: 'hidden',
}));

const Logo: FC = () => {
  const customizer = useSelector((state: AppState) => state.customizer);

  // Условие для стилей изображения
  const isTextHidden = customizer.isCollapse && !customizer.isSidebarHover;

  return (
    <ParentWrapper>
      <LinkStyled to="/">
        <Box sx={{ height: '35px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'left' }}> 
          <img
            src={herbaImage}
            alt="Herba Logo"
            style={{
              height: '35px',
              width: 'auto',
              // Применяем абсолютное позиционирование, только когда текст скрыт
              position: isTextHidden ? 'absolute' : 'relative',
              left: isTextHidden ? '50%' : 'initial',
              top: isTextHidden ? '8px' : 'initial',
              transform: isTextHidden ? 'translateX(-50%)' : 'initial',
            }}
          />
          <StyledTypography
            style={{
              opacity: !customizer.isCollapse || customizer.isSidebarHover ? 1 : 0,
              visibility: !customizer.isCollapse || customizer.isSidebarHover ? 'visible' : 'hidden',
            }}
          >
            HPS ERP
          </StyledTypography>
        </Box>
      </LinkStyled>
    </ParentWrapper>
  );
};

export default Logo;
