import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { useToast } from '../ui/use-toast';
import { ArrowLeft, UserPlus } from 'lucide-react';
import PasswordStrengthMeter from './PasswordStrengthMeter';
import { createLogger } from '../../utils/logger';

const logger = createLogger('Register');

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const { register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const validatePassword = (password) => {
    logger.debug('Validating password');
    const errors = [];
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    if (errors.length > 0) {
      logger.warn('Password validation failed:', errors);
    } else {
      logger.debug('Password validation passed');
    }
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    logger.debug(`Form field changed: ${name}`);
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'password') {
      const errors = validatePassword(value);
      setPasswordErrors(errors);
      if (formData.confirmPassword) {
        setPasswordsMatch(value === formData.confirmPassword);
      }
    }

    if (name === 'confirmPassword') {
      setPasswordsMatch(value === formData.password);
      if (!value === formData.password) {
        logger.warn('Passwords do not match');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    logger.info('Registration attempt started');

    if (formData.password !== formData.confirmPassword) {
      logger.error('Registration failed: Passwords do not match');
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }

    if (passwordErrors.length > 0) {
      logger.error('Registration failed: Password requirements not met', passwordErrors);
      toast({
        title: "Error",
        description: "Please fix password requirements",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      logger.debug('Sending registration request');
      await register(formData.email, formData.username, formData.password);
      logger.info('Registration successful');
      toast({
        title: "Success",
        description: "Registration successful! Please login.",
      });
      navigate('/login');
    } catch (error) {
      logger.error('Registration failed:', error.message);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <UserPlus className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
          <CardDescription>Enter your details to create your account</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="Choose a username"
                value={formData.username}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={isLoading}
                className={passwordErrors.length > 0 ? 'border-red-500' : ''}
              />
              <PasswordStrengthMeter password={formData.password} />
              {passwordErrors.length > 0 && (
                <ul className="text-sm text-red-500 list-disc pl-5">
                  {passwordErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                disabled={isLoading}
                className={!passwordsMatch && formData.confirmPassword ? 'border-red-500' : ''}
              />
              {!passwordsMatch && formData.confirmPassword && (
                <p className="text-sm text-red-500">Passwords do not match</p>
              )}
              {passwordsMatch && formData.confirmPassword && (
                <p className="text-sm text-green-500">Passwords match</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
            <div className="text-sm text-muted-foreground text-center">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:underline inline-flex items-center">
                <ArrowLeft className="mr-1 h-4 w-4" /> Sign in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Register;
