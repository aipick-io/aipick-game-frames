import { Child } from 'frog/ui/types';

export interface LayoutProps {
  children: JSX.Element | JSX.Element[] | Child;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div
      style={{
        alignItems: 'center',
        background: 'linear-gradient(to right, #432889, #17101F)',
        backgroundSize: '100% 100%',
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'nowrap',
        height: '100%',
        justifyContent: 'center',
        textAlign: 'center',
        width: '100%',
      }}
    >
      {children}
    </div>
  );
};
export default Layout;
