import { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Badge, Button} from 'react-bootstrap';
import { contractLabel } from '../utils';
import { tagLabels } from '../utils';

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

  useEffect(() => {
    axios
      .get<{ status: string; data: Listing[] }>('/api/sharedhomes')
      .then((response) => {
        setListings(response.data.data);
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
  <Button variant="outline-primary">View more Details</Button>
</Card>
    </Col>
  ))}
</Row>
</Container>
  )}

export default ListingsResults;