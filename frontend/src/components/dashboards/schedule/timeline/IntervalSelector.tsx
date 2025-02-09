import { ToggleButton, ToggleButtonGroup } from '@mui/material';

interface IntervalSelectorProps {
  interval: string;
  handleIntervalChange: (event: any, newInterval: string) => void;
}

export const IntervalSelector = ({ interval, handleIntervalChange }: IntervalSelectorProps) => {
  return (
    <ToggleButtonGroup value={interval} exclusive onChange={handleIntervalChange}>
      <ToggleButton value="year">12 месяцев</ToggleButton>
      <ToggleButton value="6months">6 месяцев</ToggleButton>
      <ToggleButton value="3months">3 месяца</ToggleButton>
      <ToggleButton value="month">1 месяц</ToggleButton>
      <ToggleButton value="week">1 неделя</ToggleButton>
    </ToggleButtonGroup>
  );
};
