import Sidebar from '../components/sidebar.jsx';

export default function WebPrincipalLayout({ children }) {
    return (
      <div>
        <Sidebar></Sidebar> 
        <main>{children}</main>
        
      </div>
      
    );
  }