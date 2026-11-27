import { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Badge, Button, Form, Accordion } from 'react-bootstrap';
import { tagLabels, shiftPatternLabel } from '../utils';
import { useSearchParams  } from 'react-router-dom';

type Housemates = {
  id: number;
  username: string;
  bio: string;
  budget_min: string;
  budget_max: string;
  shift_pattern: string;
  has_car: boolean;
  tags: string[];
};

const HousemateResults = () => {
 
  const [housemates, setHousemates] = useState<Housemates[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  //search
  const [searchParams, setSearchParams] = useSearchParams();
    const [maxBudgetInput, setMaxBudgetInput] = useState('');
  const [minBudgetInput, setMinBudgetInput] = useState('');
  const [genderInput, setGenderInput] = useState('');
  const [moveInDateInput, setMoveInDateInput] = useState('');
  const [moveOutDateInput, setMoveOutDateInput] = useState('');
  const [shiftPatternInput, setShiftPatternInput] = useState('');
  const [hasCarInput, setHasCarInput] = useState(false);
  const [profileTagsInput, setProfiletagsInput] = useState<string[]>([]);
 const [searchInput, setSearchInput] =  useState('');

const PROFILE_TAGS = ['non-smoker', 'quiet', 'tidy', 'has-pets',  'highly-social'];
  
//for the filter button
const applyFilters = () => {
  const params: Record<string, string> = {};
  if (searchInput) params.search = searchInput;
  if (maxBudgetInput) params.maxBudget = maxBudgetInput;
  if (minBudgetInput) params.minBudget = minBudgetInput;
  if (genderInput) params.gender = genderInput;
  if (moveInDateInput) params.moveInDate = moveInDateInput;
  if (moveOutDateInput) params.moveOutDate = moveOutDateInput;
  if (shiftPatternInput) params.shiftPattern = shiftPatternInput;
  if (hasCarInput) params.hasCar = 'true';
  if (profileTagsInput.length > 0) params.profileTags = profileTagsInput.join(',');

  setSearchParams(params);
};

  useEffect(() => {
  setLoading(true);
    const params = new URLSearchParams();
  const search = searchParams.get('search') || '';
  const maxBudget = searchParams.get('maxBudget') || '';
    const minBudget = searchParams.get('minBudget') || '';
     const gender = searchParams.get('gender') || '';
    const moveInDate = searchParams.get('moveInDate') || '';
    const moveOutDate = searchParams.get('moveOutDate') || '';
    const shiftPattern = searchParams.get('shiftPattern') || '';
     const hasCar = searchParams.get('hasCar') || '';
     const profileTags = searchParams.get('profileTags') || '';

  if (search) params.append('search', search);
  if (maxBudget) params.append('maxBudget', maxBudget);
  if (minBudget) params.append('minBudget', minBudget);
    if (gender) params.append('gender', gender);
    if (moveInDate) params.append('moveInDate', moveInDate);
      if (moveOutDate) params.append('moveOutDate', moveOutDate);
    if (shiftPattern) params.append('shiftPattern', shiftPattern);
    if (hasCar) params.append('hasCar', hasCar);
    if (profileTags) params.append('profileTags', profileTags);

  const query = params.toString();
  const url = `/api/housemates${query ? '?' + query : ''}`;

  axios.get<{ status: string; data: Housemates[] }>(url)
    .then((res) => setHousemates(res.data.data))
    .catch((err) => setError(err.message))
    .finally(() => setLoading(false));
}, [searchParams]);

  if (loading) return <Container ><h1>Loading</h1></Container>;
  if (error) return <Container>{error}</Container>;

  return (
   
   <div>

<div id="searchContainer" >
    <Container fluid>
           <Form>
           <Row className="align-items-center"><Col xs="1">
       <Form.Label className="mb-0 text-light"> Search:</Form.Label>
    </Col>
    <Col xs="3">
<Form.Control type="text" id="searchbar" className="bg-white text-black"
  value={searchInput} onChange={(e) => setSearchInput(e.target.value)} 
   onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); applyFilters(); } }}/>
</Col><Col xs="auto">
  <Accordion className="accordionButton" >
  <Accordion.Item eventKey="filters">
    <Accordion.Header >Filters</Accordion.Header>
      <Accordion.Collapse eventKey="filters">
                <Card className='p-2'>
                  <Row>
                    <Col xs="6">
                    <Form.Label htmlFor="minBudget">Min budget (£ pcm)</Form.Label>
                      <Form.Control
                        id="minBudget"
                        type="number"
                        placeholder="Min Budget"
                        value={minBudgetInput}
                        onChange={(e) => setMinBudgetInput(e.target.value)}
                            />
                             <Form.Label htmlFor="moveInDate">Move-in date (on or before)</Form.Label>
  <Form.Control
    id="moveInDate"
    type="date"
    value={moveInDateInput}
    onChange={(e) => setMoveInDateInput(e.target.value)}
  />
                             <Form.Select  id="gender" value={genderInput}  onChange={(e) => setGenderInput(e.target.value)}>
       <option >Select Gender</option>
       <option value="Male">Male</option>
       <option value="Female">Female</option>
      <option value="Undeclared">Undeclared</option>
                            </Form.Select>
                                             <Form.Select  id="shiftPattern" value={shiftPatternInput}  onChange={(e) => setShiftPatternInput(e.target.value)}>
                              <option >Select Shift Pattern</option>
                              
       <option value="standard_shift">Standard 9-5</option>
       <option value="nightshift_only">Only works nightshift</option>
      <option value="rotating_shifts">Rotating/Swing Shifts</option>
                              <option value="early_shift">Early Shift</option>
                              <option value="late_shift">Late Shift</option>
                               <option value="flexible">Flexible</option>
        
                            </Form.Select>
</Col>
         
                       <Col xs="6">
                    <Form.Label htmlFor="maxBudget">Max Budget (£ pcm)</Form.Label>
                      <Form.Control
                        id="maxBudget" type="number" placeholder="Max Budget" value={maxBudgetInput}  onChange={(e) => setMaxBudgetInput(e.target.value)}
                            />
                             <Form.Label htmlFor="moveOutDate">Move-Out date (on or after)</Form.Label>
  <Form.Control
    id="moveOutDate"
    type="date"
    value={moveOutDateInput}
    onChange={(e) => setMoveOutDateInput(e.target.value)}
  />
                      <Form.Check type="switch"
          id="hasCar" checked={hasCarInput} onChange={(e) => setHasCarInput(e.target.checked)}
        label="Owns a Car" />
         
                    
                          </Col> <div>
                          <Form.Label>Tags</Form.Label>
 

  {PROFILE_TAGS.map((tag) => (
    <Form.Check
      key={tag}
      inline
      type="checkbox"
      label={tagLabels(tag)}
      checked={profileTagsInput.includes(tag)}
      onChange={(e) => {
        if (e.target.checked) setProfiletagsInput([...profileTagsInput, tag]);
        else setProfiletagsInput(profileTagsInput.filter(t => t !== tag));
      }} />
  ))}
</div>
                       <Col className="d-flex justify-content-center mt-4 ">
  <Button onClick={applyFilters}>Apply Filters</Button>
</Col>
                  </Row>
                  </Card>
</Accordion.Collapse></Accordion.Item>
    </Accordion>
    </Col></Row></Form>
    </Container></div>
     <Container>
      <Row xs={1} md={2} lg={3}>
        {housemates.map((housemates) => (
          <Col key={housemates.id}>
    <Card className="h-100 p-2">
  <Card.Body>
    <Card.Title className="text-center">{housemates.username}</Card.Title>
    <Card.Subtitle >
      {housemates.bio}
    </Card.Subtitle>
    <Card.Text>
     £{housemates.budget_min} - £{housemates.budget_max}
       <br/> {shiftPatternLabel(housemates.shift_pattern)}
          </Card.Text>
    <div>
      {housemates.tags.map((tag) => (
        <Badge key={tag} bg="primary" className="m-1" >
          {tagLabels(tag)}<br/>

        </Badge>
      ))}
    </div>
  
  </Card.Body>
 <Button href={`/housemates/${housemates.id}`} variant="outline-primary">View more Details</Button>
 
</Card>
    </Col>
  ))}
</Row>
</Container></div>
  )}


export default HousemateResults;