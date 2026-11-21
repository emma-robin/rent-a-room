import { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card} from 'react-bootstrap';

type Housemates = {
  id: number;
  title: string;
  username: string;
  price_pcm: string;
  address: string;
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
      <Row >
        {housemates.map((housemates) => (
          <Col key={housemates.id}>
                      <Card>
              <Card.Body>
                <Card.Title>{housemates.title}</Card.Title>
                <Card.Text>£{housemates.price_pcm} pcm
                  {housemates.address}
                  Listed by {housemates.username}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default HousemateResults;