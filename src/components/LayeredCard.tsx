import { Child } from 'frog/ui/types';

export interface LayeredCardProps {
  children?: JSX.Element | JSX.Element[] | Child;
}

const LayeredCard = ({ children }: LayeredCardProps) => {
  return (
    <div
      style={{
        color: '#FFFFFF',
        fontStyle: 'normal',
        letterSpacing: '-0.025em',
        lineHeight: 1.4,
        marginTop: 30,
        width: '90%',
        whiteSpace: 'pre-wrap',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid #9A5DEE',
      }}
    >
      <div
        style={{
          color: 'white',
          fontStyle: 'normal',
          whiteSpace: 'pre-wrap',
          display: 'flex',
          width: '100%',
          flexDirection: 'column',
          border: '1px solid #9A5DEE',
          transform: 'translate(5px, -5px)',
        }}
      >
        <div
          style={{
            color: 'white',
            fontStyle: 'normal',
            whiteSpace: 'pre-wrap',
            display: 'flex',
            justifyContent: 'center',
            padding: 20,
            alignItems: 'center',
            textAlign: 'center',
            width: '100%',
            flexDirection: 'column',
            border: '1px solid #9A5DEE',
            transform: 'translate(5px, -5px)',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default LayeredCard;
