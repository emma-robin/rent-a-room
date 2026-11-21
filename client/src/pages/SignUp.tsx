import { useState, FormEvent } from 'react';
import axios from 'axios';

export default function Register() {
  const [username, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      await axios.post('/api/auth/register', { name, email, password });
      // redirect or show success
    } catch (err) {
      setError('Registration failed');
    }
  };
return (
    <div className='container'>
    <h1 style={{ color: 'var(--color-primary)' }}>Create an account to get started</h1>
                    
                    <div className="text-center justify-content-center align-items-center">
                        {/* Error message if not able to login*/}
                       {error && (
  <div className="alert alert-danger">
    {error}
  </div>
)}
                        
                    </div>
                        {/* Registration Form */}
                      <form onSubmit={handleSubmit}>
                           
                            <div className="mb-3">
                                <label htmlFor="username" className="form-label">Username</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    id="username" 
                                    name="username" 
                                    placeholder="Choose a username"
                                 
          value={username}
          onChange={(e) => setName(e.target.value)} required></input>
                            </div>
                            
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email</label>
                                <input 
                                    type="email" 
                                    className="form-control" 
                                    id="email" 
                                    name="email" 
                                    placeholder="Enter your email"
                                                          
          value={email}
          onChange={(e) => setEmail(e.target.value)}
                                     required></input>
                            </div>
                            
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Password</label>
                                <input 
                                    type="password" 
                                    className="form-control" 
                                    id="password" 
                                    name="password" 
                                    placeholder="Enter your password (min 6 characters)" 
                                              value={password}
          onChange={(e) => setPassword(e.target.value)}
                                    required></input>
                                </div>
                            
                            <div className="mb-3">
                                <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                                <input 
                                    type="password" 
                                    className="form-control" 
                                    id="confirmPassword" 
                                    name="confirmPassword" 
                                    placeholder="Confirm your password" 
                                              value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
                                    required></input>
                            </div>
                            
                            <div className="d-flex justify-content-center">
                                <button type="submit" className="btn btn-hero fw-bold">Register</button>
                            </div>
                        </form>
                        
                        <br/>
                        <div className="form-footer">
                            <h5 className="subtitle">Already have an account? <a href="/login">Login here</a></h5>
                        </div>
                        </div>
                    );
                    }