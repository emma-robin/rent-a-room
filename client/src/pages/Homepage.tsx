import { Button, Container, Tab, Tabs } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Homepage() {
  return (
    <div>
      <h1>Find your next home!</h1>
      <h2 className="subtitle">
        Whether you're looking to live solo or split a place, find your next home here
      </h2>
      <Container id="homepageContainer" className="py-3 shadow-lg" data-bs-theme="rent-a-room">
        <Tabs id="homepage-tab" defaultActiveKey="listings" className="mb-3">
          <Tab className="homepage-tabs" eventKey="listings" title="Properties For Rent">
            <Link to="/listings">
              <Button variant="info">Find Properties for Rent</Button>
            </Link>
          </Tab>
          <Tab className="homepage-tabs" eventKey="sharedhomes" title="Shared Homes">
            <Link to="/sharedhomes">
              <Button variant="info">Find Shared Homes</Button>
            </Link>
          </Tab>
          <Tab className="homepage-tabs" eventKey="housemates" title="Find Housemates">
            <Link to="/housemates">
              <Button variant="info">Find Housemates</Button>
            </Link>
          </Tab>
        </Tabs>
      </Container>
    </div>
  );
}