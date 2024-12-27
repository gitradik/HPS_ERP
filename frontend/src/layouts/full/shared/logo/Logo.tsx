import { FC } from 'react';
// import { useSelector } from 'src/store/Store';
import { Link } from 'react-router';
import { styled } from '@mui/material';
// import { AppState } from 'src/store/Store';
import herbaImage from 'src/assets/images/logos/herba.jpg';

// Styled parent wrapper
const ParentWrapper = styled('div')(() => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '10px 0 10px 0'
}));

const LinkStyled = styled(Link)(() => ({
  height: '100%', // Adjust height for the parent
  width: 'auto', // Adjust width dynamically
  display: 'block',
}));

const Logo: FC = () => {
  // const customizer = useSelector((state: AppState) => state.customizer);

  return (
    <ParentWrapper>
      <LinkStyled
        to="/"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%'
        }}
      >
        <img
          src={herbaImage}
          alt="Herba Logo"
          style={{
            height: '100%',
            width: 'auto', // Maintain aspect ratio
            maxHeight: '35px', // Limit maximum height
          }}
        />
      </LinkStyled>
    </ParentWrapper>
  );
};

export default Logo;
