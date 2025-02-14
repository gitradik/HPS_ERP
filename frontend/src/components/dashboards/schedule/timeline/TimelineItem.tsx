import { styled } from '@mui/material';

export const TimelineItem = styled('div')<{
  visibleItems: number;
  isCurrent: boolean;
  isLast: boolean;
}>`
  position: relative;
  display: inline-block;
  width: ${(props) => 100 / props.visibleItems}%;
  padding: 10px;
  border-right: ${(props) => !props.isLast && '1px solid #ccc'};
  text-align: center;
  background-color: ${(props) =>
    props.isCurrent ? props.theme.palette.primary.main : 'transparent'};
  color: ${(props) =>
    props.isCurrent ? props.theme.palette.primary.contrastText : props.theme.palette.grey[600]};
  font-weight: ${(props) => (props.isCurrent ? 'bold' : 'normal')};
  &:last-child {
    border-right: none;
  }

  ${(props) =>
    props.isLast &&
    `
    
    &::after {
      content: "";
      position: absolute;
      right: -1px;
      top: -38px;
      width: 1px;
      height: 100vh;
      opacity: 35%;
      border-right: 1px dotted ${props.theme.palette.grey[600]};
      z-index: 0;
    }
  `}
`;
