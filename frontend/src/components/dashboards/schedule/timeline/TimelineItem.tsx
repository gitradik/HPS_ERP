import { styled } from '@mui/material';

export const TimelineItem = styled('div')<{ visibleItems: number; isCurrent: boolean }>`
  display: inline-block;
  width: ${(props) => 100 / props.visibleItems}%;
  padding: 10px;
  border-right: 1px solid #ccc;
  text-align: center;
  background-color: ${(props) => (props.isCurrent ? '#ffeb3b' : 'transparent')};
  font-weight: ${(props) => (props.isCurrent ? 'bold' : 'normal')};

  &:last-child {
    border-right: none;
  }
`;
