import { useState } from 'react';
import {Link  } from "react-router-dom";
import { Col, Row, Button , Container, Tab, Tabs , Form ,Dropdown } from 'react-bootstrap';


export default function Homepage() {
   const [searchInput, setSearchInput] =  useState('');
   const buildSearchLink = (basePath: string) => {
    const params = new URLSearchParams();
    if (searchInput) {
      params.append('search', searchInput);    }
    const query = params.toString();
   return query ? `${basePath}?${query}` : basePath;
  };

   return (
    <div>
      <h1>Find your next home!</h1>
      <h2 className="subtitle">
        Whether you're looking to live solo or split a place, find your next home here
      </h2>
      <Container id="homepageContainer" className="py-3 shadow-lg" data->
        <Tabs id="homepage-tab" defaultActiveKey="listings" className="mb-3">
          <Tab className="homepage-tabs" eventKey="listings" title="Properties For Rent">
       <Form>
          <Row className="align-items-center">
        <Col  xs={7} >
     <Form.Label>
  Search: < Form.Control type="text" id="searchbar" className="bg-white text-black"
  value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
  
</Form.Label></Col>
 <Col xs="auto" >
<Dropdown>
      <Dropdown.Toggle className="ms-3" variant="primary" id="dropdown-custom">
       Filters
      </Dropdown.Toggle>

      <Dropdown.Menu id="Dropdown-Menu">
        <Dropdown.Item >Action</Dropdown.Item>
        <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
        <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
</Col><Col xs="auto" >
<Link to={buildSearchLink('/listings')}>
    <Button variant="primary">Find Properties for Rent</Button>
</Link>
       </Col></Row> </Form>
          </Tab>
          <Tab className="homepage-tabs" eventKey="sharedhomes" title="Shared Homes">
            <label>
  Search: < Form.Control type="text" id="searchbar" className="bg-white text-black"
  value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
</label>
            <Link to={buildSearchLink('/sharedhomes')}>
              <Button className="ms-3" variant="secondary">Find Shared Homes</Button>
            </Link>
          </Tab>
          <Tab className="homepage-tabs" eventKey="housemates" title="Find Housemates">
           <label>
  Search: < Form.Control type="text" id="searchbar" className="bg-white text-black"
  value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
</label>
            <Link to={buildSearchLink('/housemates')}>
           
              <Button className="ms-3" variant="secondary">Find Housemates</Button>
            </Link>
          </Tab>
        </Tabs>
      </Container>
    </div>
  );
}

