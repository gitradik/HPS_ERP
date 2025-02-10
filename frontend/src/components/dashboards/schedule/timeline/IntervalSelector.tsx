import { ToggleButton, ToggleButtonGroup } from '@mui/material';

interface IntervalSelectorProps {
  interval: string;
  handleIntervalChange: (event: any, newInterval: string) => void;
}

export const IntervalSelector = ({ interval, handleIntervalChange }: IntervalSelectorProps) => {
  return (
    <ToggleButtonGroup value={interval} exclusive onChange={handleIntervalChange}>
      <ToggleButton value="year">12 Monate</ToggleButton>
      <ToggleButton value="6months">6 Monate</ToggleButton>
      <ToggleButton value="3months">3 Monate</ToggleButton>
      <ToggleButton value="month">1 Monat</ToggleButton>
      <ToggleButton value="week">1 Woche</ToggleButton>
    </ToggleButtonGroup>
  );
};
