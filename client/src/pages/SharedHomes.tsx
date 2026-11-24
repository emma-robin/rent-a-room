import { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Badge, Button} from 'react-bootstrap';
import { contractLabel } from '../utils';
import { tagLabels } from '../utils';

type SharedHomes = {
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
  bio: string;
  budget_min: string;
  budget_max: string;
  shift_pattern: string;
  has_car: boolean;
};


const SharedHomesResults = () => {
  const [SharedHomes, setSharedHomes] = useState<SharedHomes[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get<{ status: string; data: SharedHomes[] }>('/api/sharedhomes')
      .then((response) => {
        setSharedHomes(response.data.data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <Container ><h1>Loading</h1></Container>;
  if (error) return <Container>{error}</Container>;
return (
     <Container>
      <Row xs={1} md={2} lg={3}>
        {SharedHomes.map((SharedHomes) => (
          <Col key={SharedHomes.id}>
    <Card className="h-100 p-2">
  <Card.Body>

    <Card.Title className="text-center">{SharedHomes.title}</Card.Title>
    <Card.Subtitle >
      £{SharedHomes.price_pcm} pcm
    </Card.Subtitle>
    <Card.Text>
      {contractLabel(SharedHomes.contract_type)} - {SharedHomes.bedrooms} bed
       <br/> {SharedHomes.address}
          </Card.Text>
         About the household:
              <Card.Subtitle >
                {SharedHomes.bio}
              </Card.Subtitle>
              <Card.Text>
              
                {SharedHomes.shift_pattern}
                    </Card.Text>
    <div>
      {SharedHomes.tags.map((tag) => (
        <Badge key={tag} bg="primary" className='m-1' >
          {tagLabels(tag)}

        </Badge>
      ))}
    </div><br/>
    <Card.Text className="small text-muted">
      Advertised by {SharedHomes.username}
    </Card.Text>
  </Card.Body>
  <Button  href={`/sharedhomes/${SharedHomes.id}`} variant="outline-primary">View more Details</Button>
</Card>
    </Col>
  ))}
</Row>
</Container>
  )}

export default SharedHomesResults;