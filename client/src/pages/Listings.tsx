import { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Badge, Button, Form, Accordion} from 'react-bootstrap';
import { contractLabel } from '../utils';
import { tagLabels } from '../utils';
import { useSearchParams } from 'react-router-dom';

type Listing = {
  id: number;
  title: string;
  username: string;
  listing_type: string;
  contract_type: string;
  description: string;
  price_pcm: string;
  address: string;
  bedrooms: number;
  legislation_declared  : boolean;
  tags: string[];
};

const ListingsResults = () => {
 
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); 
  //search
  const [searchParams, setSearchParams] = useSearchParams();
    const [maxPriceInput, setMaxPriceInput] = useState('');
     const [minPriceInput, setMinPriceInput] = useState('');
  const [bedroomsInput, setBedroomsInput] = useState('');
  const [contractTypeInput, setContractTypeInput] = useState('');
  const [moveInDateInput, setMoveInDateInput] = useState('');
const [moveOutDateInput, setMoveOutDateInput] = useState('');
  const [enSuiteInput, setEnSuiteInput] = useState(false);
  const [parkingInput, setParkingInput] = useState(false);
   const [outdoorSpaceInput, setOutdoorSpaceInput] = useState(false);
   const [acceptsPetsInput, setAcceptsPetsInput] = useState(false);
  const [acceptsBenefitsInput, setAcceptsBenefitsInput] = useState(false);
  const [legislationDeclaredInput, setLegislationDeclaredInput] = useState(false);
  const [tagsInput, setTagsInput] = useState<string[]>([]);
 const [searchInput, setSearchInput] =  useState('');

  const ALL_TAGS = [
  'en-suite', 'parking-available', 'outdoor-space',
  'non-smoker', 'quiet',
];
  
//for the filter button
const applyFilters = () => {
  const params: Record<string, string> = {};
  if (searchInput) params.search = searchInput;
  if (maxPriceInput) params.maxPrice = maxPriceInput;
  if (minPriceInput) params.minPrice = minPriceInput;
  if (bedroomsInput) params.bedrooms = bedroomsInput;
  if (moveInDateInput) params.moveInDate = moveInDateInput;
  if (moveOutDateInput) params.moveOutDate = moveOutDateInput;
   if (contractTypeInput) params.contractType = contractTypeInput;
  if (enSuiteInput) params.enSuite = 'true';
  if (parkingInput) params.parking = 'true';
  if (outdoorSpaceInput) params.outdoorSpace = 'true';
  if (acceptsPetsInput) params.acceptsPets = 'true';
  if (acceptsBenefitsInput) params.acceptsBenefits = 'true';
  if (legislationDeclaredInput) params.legislationDeclared = 'true';
  if (tagsInput.length > 0) params.listingTags = tagsInput.join(',');

  setSearchParams(params);
};

  useEffect(() => {
  setLoading(true);
    const params = new URLSearchParams();
  const search = searchParams.get('search') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
    const minPrice = searchParams.get('minPrice') || '';
     const bedrooms = searchParams.get('bedrooms') || '';
    const moveInDate = searchParams.get('moveInDate') || '';
    const moveOutDate = searchParams.get('moveOutDate') || '';
 const contractType = searchParams.get('contractType') || '';
    const enSuite = searchParams.get('enSuite') || '';
    const parking = searchParams.get('parking') || '';
    const outdoorSpace = searchParams.get('outdoorSpace') || '';
    const acceptsPets = searchParams.get('acceptsPets') || '';
    const acceptsBenefits = searchParams.get('acceptsBenefits') || '';
    const legislationDeclared = searchParams.get('legislationDeclared') || '';
    const listingTags = searchParams.get('listingTags') || '';

  if (search) params.append('search', search);
  if (maxPrice) params.append('maxPrice', maxPrice);
  if (minPrice) params.append('minPrice', minPrice);
    if (bedrooms) params.append('bedrooms', bedrooms);
    if (moveInDate) params.append('moveInDate', moveInDate);
      if (moveOutDate) params.append('moveOutDate', moveOutDate);
   if (contractType) params.append('contractType', contractType);
    if (enSuite) params.append('enSuite', enSuite);
    if (parking) params.append('parking', parking);
    if (outdoorSpace) params.append('outdoorSpace', outdoorSpace);
    if (acceptsPets) params.append('acceptsPets', acceptsPets);
    if (acceptsBenefits) params.append('acceptsBenefits', acceptsBenefits);
    if (legislationDeclared) params.append('legislationDeclared', legislationDeclared);
    if (listingTags) params.append('listingTags', listingTags);

  
  const query = params.toString();
  const url = `/api/listings${query ? '?' + query : ''}`;

  axios.get<{ status: string; data: Listing[] }>(url)
    .then((res) => setListings(res.data.data))
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
                    <Form.Label htmlFor="minPrice">Min price (£ pcm)</Form.Label>
                      <Form.Control
                        id="minPrice"
                        type="number"
                        placeholder="Min price"
                        value={minPriceInput}
                        onChange={(e) => setMinPriceInput(e.target.value)}
                            />
                             <Form.Label htmlFor="moveInDate">Move-in date (on or before)</Form.Label>
  <Form.Control
    id="moveInDate"
    type="date"
    value={moveInDateInput}
    onChange={(e) => setMoveInDateInput(e.target.value)}
  />
                           <Form.Label htmlFor="bedrooms">Number of Bedrooms</Form.Label>
                      <Form.Control
                        id="bedrooms" type="number" placeholder="Bedrooms" value={bedroomsInput}  onChange={(e) => setBedroomsInput(e.target.value)}
                      /><Form.Label htmlFor="contractType">Contract Type</Form.Label>

   <Form.Select  id="contractType" value={contractTypeInput}  onChange={(e) => setContractTypeInput(e.target.value)}>
       <option >Select Contract Type</option>
       <option value="fixed_term_twelve_months">Fixed 12 months</option>
       <option value="fixed_term_six_months">Fixed 6 months</option>
      <option value="short_let">Short let</option>
      <option value="rolling_monthly">Rolling monthly</option>
    </Form.Select></Col>
                       <Col xs="6">
                    <Form.Label htmlFor="maxPrice">Max price (£ pcm)</Form.Label>
                      <Form.Control
                        id="maxPrice" type="number" placeholder="Max price" value={maxPriceInput}  onChange={(e) => setMaxPriceInput(e.target.value)}
                            />
                             <Form.Label htmlFor="moveOutDate">Move-Out date (on or after)</Form.Label>
  <Form.Control
    id="moveOutDate"
    type="date"
    value={moveOutDateInput}
    onChange={(e) => setMoveOutDateInput(e.target.value)}
  />
                      <Form.Check type="switch"
          id="enSuite" checked={enSuiteInput} onChange={(e) => setEnSuiteInput(e.target.checked)}
        label="En Suite" />
         
                      <Form.Check type="switch"
          id="parking" checked={parkingInput}  onChange={(e) => setParkingInput(e.target.checked)}
        label="Parking" />
   
                      <Form.Check type="switch"
          id="outdoorSpace"  checked={outdoorSpaceInput} onChange={(e) => setOutdoorSpaceInput(e.target.checked)}
        label="Outdoor Space" />
      
                      <Form.Check type="switch"
          id="acceptsPets" checked={acceptsPetsInput}  onChange={(e) => setAcceptsPetsInput(e.target.checked)}
        label="Accepts Pets" />
      
                      <Form.Check type="switch"
          id="Accepts Benefits" checked={acceptsBenefitsInput}  onChange={(e) => setAcceptsBenefitsInput(e.target.checked)}
        label="Accepts Benefits" />
                      <Form.Check type="switch"
          id="legislationDeclared"  checked={legislationDeclaredInput} onChange={(e) => setLegislationDeclaredInput(e.target.checked)}
        label="Legislation Declared" />
                          </Col>
                          <Form.Label>Tags</Form.Label>
  <div>
    {ALL_TAGS.map((tag) => (
      <Form.Check
        key={tag} inline type="checkbox"
        label={tagLabels(tag)} checked={tagsInput.includes(tag)}
        onChange={(e) => {
          if (e.target.checked) {setTagsInput([...tagsInput, tag]);
          } else {
            setTagsInput(tagsInput.filter(t => t !== tag));
          }}}/> ))}
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
        {listings.map((listing) => (
          <Col key={listing.id}>
    <Card className="h-100 p-2">
  <Card.Body>
    <Card.Title className="text-center">{listing.title}</Card.Title>
    <Card.Subtitle >
      £{listing.price_pcm} pcm
    </Card.Subtitle>
    <Card.Text>
      {contractLabel(listing.contract_type)} - {listing.bedrooms} bed
       <br/> {listing.address}
       <br/> {listing.description}
          </Card.Text>
    <div>
      {listing.tags.map((tag) => (
        <Badge key={tag} bg="primary" className="m-1" >
          {tagLabels(tag)}<br/>

        </Badge>
      ))}
    </div>
    <Card.Text className="small text-muted">
      Listed by {listing.username}
    </Card.Text>
  </Card.Body>
  
  <Button href={`/listings/${listing.id}`} variant="outline-primary">View more Details</Button>
</Card>
    </Col>
  ))}
</Row>
</Container></div>
  )}

export default ListingsResults;