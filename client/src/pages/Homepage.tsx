import { useState } from 'react';
import {Link ,useNavigate } from "react-router-dom";
import { Col, Row, Button , Container, Tab, Tabs , Form  } from 'react-bootstrap';


export default function Homepage() {
  const navigate = useNavigate();
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
      <Container id="homepageContainer" className="py-3 shadow-lg" >
        <Tabs id="homepage-tab" defaultActiveKey="listings" className="mb-3">
          <Tab className="homepage-tabs" eventKey="listings" title="Properties For Rent">
       <Form>
          <Row className="align-items-center">
    <Col xs="auto">
     <Form.Label className="mb-0"> Search:</Form.Label>
    </Col>
    <Col>
      <Form.Control type="text" id="searchbar" className="bg-white text-black w-100" 
      value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
      onKeyDown={(e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    navigate(buildSearchLink('/listings'));
  }
}}/>
     </Col>
 <Col xs="auto" >

</Col><Col xs="auto" >
<Link to={buildSearchLink('/listings')}>
    <Button variant="primary">Find Properties for Rent</Button>
</Link>
       </Col></Row> </Form>
          </Tab>
          <Tab className="homepage-tabs" eventKey="sharedhomes" title="Shared Homes">
                  <Row className="align-items-center">
    <Col xs="auto">
     <Form.Label className="mb-0"> Search:</Form.Label>
    </Col>
    <Col>
<Form.Control type="text" id="searchbar" className="bg-white text-black w-100" 
      value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    navigate(buildSearchLink('/sharedhomes'));
  }
}}/>
    </Col> <Col xs="auto">
            <Link to={buildSearchLink('/sharedhomes')}>
              <Button className="ms-3" variant="primary">Find Shared Homes</Button>
            </Link></Col></Row>
          </Tab>
          <Tab className="homepage-tabs" eventKey="housemates" title="Find Housemates">
       <Row className="align-items-center"><Col xs="auto">
     <Form.Label className="mb-0"> Search:</Form.Label>
    </Col>
    <Col>
<Form.Control type="text" id="searchbar" className="bg-white text-black w-100" 
      value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    navigate(buildSearchLink('/housemates'));
  }
}}/>
    </Col> <Col xs="auto">
            <Link to={buildSearchLink('/housemates')}>
           
              <Button className="ms-3" variant="primary">Find Housemates</Button>
           </Link></Col></Row>
          </Tab>
        </Tabs>
      </Container>
    </div>
  );
}

