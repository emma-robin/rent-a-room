import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';

function MainBar() {
  return (
    
      <Navbar id="navbar"  data-bs-theme="rent-a-room" expand="lg">
        <Container>
                  <Navbar.Brand as={Link} to="/">
          <img
            src="/logo.png"
            alt="Rent-a-Room logo"
            height="100vw"
            className="me-4"
          />
        </Navbar.Brand>
         <Nav className="me-auto">
      <Nav.Link as={Link} to="/properties">
            Properties for Rent
          </Nav.Link>
          <Nav.Link as={Link} to="/shared-homes">
            Shared Homes
          </Nav.Link>
          <Nav.Link as={Link} to="/housemates">
            Find Housemates
          </Nav.Link>
           <Nav.Link as={Link} to="/chats">
            Your Chats
          </Nav.Link>
          <Nav.Link as={Link} to="/dashboard">
            Your Dashboard
          </Nav.Link>
           <Nav.Link as={Link} to="/register">
            Register
          </Nav.Link>
        </Nav>
      </Container>
      </Navbar>
 
  );
}

export default MainBar;