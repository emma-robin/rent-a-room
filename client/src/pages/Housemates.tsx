import { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Badge, Button} from 'react-bootstrap';
import { tagLabels } from '../utils';

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

  useEffect(() => {
    axios
      .get<{ status: string; data: Housemates[] }>('/api/housemates')
      .then((response) => {
        setHousemates(response.data.data);
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
       <br/> {housemates.shift_pattern}
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
</Container>
  )}


export default HousemateResults;