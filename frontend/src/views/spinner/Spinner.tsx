import './spinner.css';

interface SpinnerProps {
  free?: boolean;
}

const Spinner = ({ free }: SpinnerProps) => (
  <div className={`fallback-spinner ${free ? 'fallback-spinner-free' : ''}`}>
    <div className="loading component-loader">
      <div className="effect-1 effects" />
      <div className="effect-2 effects" />
      <div className="effect-3 effects" />
    </div>
  </div>
);
export default Spinner;
