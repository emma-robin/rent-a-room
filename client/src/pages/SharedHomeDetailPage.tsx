import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Card, Badge, Button} from 'react-bootstrap';
import { contractLabel } from '../utils';
import { tagLabels } from '../utils';

type SharedHome = {
  id: number;
  title: string;
  username: string;
  listing_type: string;
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
  bio: string;
  gender: string;
  budget_min: string;
  budget_max: string;
  shift_pattern: string;
  has_car: boolean;
};

export default function SharedHomeDetail() {
  const { id } = useParams();
  const [SharedHome, setSharedHome] = useState<SharedHome | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get<{ status: string; data: SharedHome }>(`/api/SharedHomes/${id}`)
      .then((res) => setSharedHome(res.data.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);


  if (loading) return <Container ><h1>Loading</h1></Container>;
  if (error) return <Container>{error}</Container>;
  if (!SharedHome) return <Container>No Shared Homes Found</Container>;
return (
     <Container>
      <Row >
       
    <Card className="h-100 p-2">
  <Card.Body>
          <Button href='/SharedHomes' className="m-2" variant="primary" size="sm"> Back to Shared Homes</Button>
    <Card.Title className="text-center">{SharedHome.title}</Card.Title>
    <Card.Subtitle >
      £{SharedHome.price_pcm} pcm
    </Card.Subtitle>
    <Card.Text>
      {contractLabel(SharedHome.contract_type)} - {SharedHome.bedrooms} bed
       <br/> {SharedHome.address}

       <br/>{new Date(SharedHome.move_in_date).toLocaleDateString('en-GB')} - {new Date(SharedHome.move_out_date).toLocaleDateString('en-GB')}
 <br/>
       <br/> {SharedHome.en_suite}
  <h5>About the household</h5>
          <p>{SharedHome.bio}</p>
          
         
              Household budget: £{SharedHome.budget_min} – £{SharedHome.budget_max}
             <br/> <br/>
          
          <h5>Details</h5>
            <ul>
              <li><strong>Gender of household - {SharedHome.gender}</strong></li>
            <li> Kitchen: Length {SharedHome.kitchen_length_m} m x Width { SharedHome.kitchen_width_m} m</li>
      <li> Bedroom: Length {SharedHome.bedroom_length_m} m x Width { SharedHome.bedroom_width_m} m</li>
            <li>Contract: {contractLabel(SharedHome.contract_type)}</li>
            <li>Bedrooms: {SharedHome.bedrooms}</li>
            <li>En-suite: {SharedHome.en_suite ? 'Yes' : 'No'}</li>
            <li>Parking: {SharedHome.parking ? 'Yes' : 'No'}</li>
            <li>Outdoor space: {SharedHome.outdoor_space ? 'Yes' : 'No'}</li>
            <li>Accepts pets: {SharedHome.accepts_pets ? 'Yes' : 'No'}</li>
            <li>Accepts benefits: {SharedHome.accepts_benefits ? 'Yes' : 'No'}</li>
            <li>Legislation declared: {SharedHome.legislation_declared ? 'Yes' : 'No'}</li>
          </ul>
          </Card.Text>
         About the household:
              <Card.Subtitle >
                {SharedHome.bio}
              </Card.Subtitle>
              <Card.Text>
              
                {SharedHome.shift_pattern}
                    </Card.Text>
    <div>
      {SharedHome.tags.map((tag) => (
              <Badge key={tag} bg="primary" className="me-1">{tagLabels(tag)}</Badge>
            ))}

    </div><br/>
    <Card.Text className="small text-muted">
      Advertised by {SharedHome.username}
    </Card.Text>
  </Card.Body>
  
</Card>

</Row>
</Container>
  )}
