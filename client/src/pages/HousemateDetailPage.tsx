import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Card, Badge, Button} from 'react-bootstrap';
import { tagLabels } from '../utils';

type Housemate = {
  id: number;
  username: string;
  bio: string;
  budget_min: string;
  budget_max: string;
  move_in_date: string;
  shift_pattern: string;
  has_car: boolean;
  tags: string[];
  
};

const HousemateDetail = () => {
const { id } = useParams();
  const [Housemate, setHousemate] = useState<Housemate| null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get<{ status: string; data: Housemate }>(`/api/housemates/${id}`)
      .then((res) => setHousemate(res.data.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);   

  if (loading) return <Container ><h1>Loading</h1></Container>;
  if (error) return <Container>{error}</Container>;
 if (!Housemate) return <Container>No Housemate Found</Container>;

  return (
     <Container>
      <Row >
    <Card className="h-100 p-2">
  <Card.Body>
      <Button href='/Housemates' className="m-2" variant="primary" size="sm"> Back to Housemate</Button>
    <Card.Title className="text-center">{Housemate.username}</Card.Title>
    <Card.Subtitle >
      {Housemate.bio}
    </Card.Subtitle>
    <Card.Text>
     £{Housemate.budget_min} - £{Housemate.budget_max}
       <br/> {Housemate.shift_pattern}
          </Card.Text>
    <div>
         {Housemate.tags.map((tag) => (
              <Badge key={tag} bg="primary" className="me-1">{tagLabels(tag)}</Badge>
            ))}
    </div>
  
  </Card.Body>
 
</Card>
   
</Row>
</Container>
  )}


export default HousemateDetail;