import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card,Button } from 'react-bootstrap';

type StatusCheck={
status:string;
timestamp:string;
}


export default function App() {
  const [Status, setStatus] = useState<StatusCheck | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const checkBackend = () => {
    setLoading(true);
    setError(null);
    setStatus(null);

    axios
      .get<StatusCheck>('/api/statusCheck')
      .then((res) => setStatus(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    checkBackend();
  }, []);

  return (
      <Card >
        <Card.Body>
          {loading && (
              <h1 >Looking for the server</h1>
          )}

          {!loading && Status && (
           <h1> Found Backend
                <br />
              <code>status: {Status.status}</code>
              <br />
              <code>timestamp: {Status.timestamp}</code>
          </h1>
          )}

          {!loading && error && (
           <h1> Backend not reachable
              <br />
              <code>{error}</code></h1>
          )}

          <Button  onClick={checkBackend}>
            Check again
          </Button>
        </Card.Body>
      </Card>
  );
}