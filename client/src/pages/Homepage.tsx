import { useState } from 'react';
import axios from 'axios';
import {Button, Container ,Tab,Tabs} from 'react-bootstrap';
import { Link } from 'react-router-dom';

 export default function Homepage() {
  
  return (
    <div>
      <h1>Find your next home!</h1>
      <h2 className='subtitle'>Whether you’re looking to live solo or split a place, find your next home here</h2>
      <Container id="homepageContainer" className="py-3 shadow-lg" data-bs-theme="rent-a-room">
        <Tabs
          id="homepage-tab"
         defaultActiveKey="Properties"
          className="mb-3"
    >
      <Tab className='homepage-tabs' eventKey="Properties" title="Properties For Rent">
        <Link to="/properties">
  <Button variant="primary">Find Properties for Rent</Button>
</Link>
      </Tab>
      <Tab className='homepage-tabs' eventKey="SharedHomes" title="Shared Homes">
       <Link to="/SharedHomes">
  <Button variant="primary">Find Shared Homes</Button>
</Link>
      </Tab>
      <Tab className='homepage-tabs'  eventKey="FindHousemates" title="Find Housemates" >
        
        <Link to="/Housemates">
  <Button variant="primary">Find Housemates</Button>
</Link>
      </Tab>
    </Tabs>
      </Container>        
</div>
 )
}
