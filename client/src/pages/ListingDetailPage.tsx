import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Card, Badge, Button} from 'react-bootstrap';
import { contractLabel } from '../utils';
import { tagLabels } from '../utils';

type Listing = {
id: number;
  title: string;
  username: string;
  Listing_type: string;
  contract_type: string;
  description: string;
  price_pcm: string;
  address: string;
  bedrooms: number;
  move_in_date: string;
  move_out_date: string;
  en_suite: boolean;
  parking: boolean;
  outdoor_space: boolean;
  kitchen_length_m : number;
  kitchen_width_m : number;
  bedroom_length_m : number;
  bedroom_width_m : number;
  house_rules : string;
  accepts_pets  : boolean;
  accepts_benefits  : boolean
  legislation_declared  : boolean;
  tags: string[];
};

const PropertyDetail = () => {
   const { id } = useParams();
  const [Listing, setListing] = useState<Listing | null>(null);;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get<{ status: string; data: Listing}>(`/api/listings/${id}`)
    .then((res) => setListing(res.data.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);



  if (loading) return <Container ><h1>Loading</h1></Container>;
  if (error) return <Container>{error}</Container>;
 if (!Listing) return <Container>No Shared Homes Found</Container>;

  return (
     <Container>
      <Row >
    <Card className="h-100 p-2">
  <Card.Body>
      <Button href='/listing' className="m-2" variant="primary" size="sm"> Back to Properties</Button>
  
    <Card.Title className="text-center">{Listing.title}</Card.Title>
    <Card.Subtitle >
      £{Listing.price_pcm} pcm
    </Card.Subtitle>
    <Card.Text>
      {contractLabel(Listing.contract_type)} - {Listing.bedrooms} bed
       <br/> {Listing.address}

       <br/> {Listing.move_in_date} to {Listing.move_out_date}
       <br/>   {Listing.description} 
           <br/>  
        
          <h5>Details</h5>
          <ul>
           <li> Kitchen: Length {Listing.kitchen_length_m} m x Width { Listing.kitchen_width_m} m</li>
      <li> Bedroom: Length {Listing.bedroom_length_m} m x Width { Listing.bedroom_width_m} m</li>
            <li>House Rules: (Listing.house_rules)</li>
            <li>Contract: {contractLabel(Listing.contract_type)}</li>
            <li>Bedrooms: {Listing.bedrooms}</li>
            <li>En-suite: {Listing.en_suite ? 'Yes' : 'No'}</li>
            <li>Parking: {Listing.parking ? 'Yes' : 'No'}</li>
            <li>Outdoor space: {Listing.outdoor_space ? 'Yes' : 'No'}</li>
            <li>Accepts pets: {Listing.accepts_pets ? 'Yes' : 'No'}</li>
            <li>Accepts benefits: {Listing.accepts_benefits ? 'Yes' : 'No'}</li>
            <li>Legislation declared: {Listing.legislation_declared ? 'Yes' : 'No'}</li>
          </ul>
          </Card.Text>
    <div>
      {Listing.tags.map((tag) => (
        <Badge key={tag} bg="primary" className="m-1" >
          {tagLabels(tag)}<br/>

        </Badge>
      ))}
    </div>
    <Card.Text className="small text-muted">
      Listed by {Listing.username}
    </Card.Text>
  </Card.Body>

</Card>
  
</Row>
</Container>
  )}

export default PropertyDetail;