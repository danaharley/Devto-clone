import tw from 'twin.macro';
import { useState, useEffect, useRef } from 'react';
import jwt from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import RouteWrapper from '../../common/RouteWrapper';
import LoadingSpinner from '../../common/LoadingSpinner';
import Error from '../../common/Error';
import { useLoginMutation } from '../../core/features/auth/authApiSlice';
import { setCredentials, setToken } from '../../core/features/auth/authSlice';
import Auth0 from '../../common/Auth0';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [pwd, setPwd] = useState('');
  const [email, setEmail] = useState('');

  const emailRef = useRef(null);

  const [login, { isLoading, isError, isSuccess, reset }] = useLoginMutation();

  useEffect(() => emailRef.current.focus(), []);

  useEffect(() => {
    reset();
    isSuccess && navigate('/');
  }, [email, pwd]);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const payload = await login({ email, pwd }).unwrap();
      const decoded = jwt(payload.token);

      setEmail('');
      setPwd('');

      dispatch(
        setCredentials({
          id: payload.id,
          name: payload.name,
          username: decoded.username,
          email,
          picture: payload.picture,
          bio: payload.bio,
          location: payload.location,
          education: payload.education,
          work: payload.work,
          availableFor: payload.availableFor,
          skills: payload.skills,
          joinDate: payload.joinDate,
        })
      );
      dispatch(setToken(payload.token));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <RouteWrapper>
      {isLoading && <LoadingSpinner />}
      {!isLoading && (
        <Wrapper>
          <Heading>Welcome to DEV Community</Heading>
          <Paragraph>DEV Community is a community of 748,239 amazing developers</Paragraph>

          <Auth0 />

          <Paragraph>Or</Paragraph>

          <Title>Login using an Existing account</Title>
          <form onSubmit={handleSubmit}>
            <InputContainer>
              <Label htmlFor='email'>Email *</Label>
              <Input
                ref={emailRef}
                name='email'
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </InputContainer>

            <InputContainer>
              <Label htmlFor='password'>Password *</Label>
              <Input
                type='password'
                name='password'
                value={pwd}
                onChange={e => setPwd(e.target.value)}
                required
              />
            </InputContainer>

            {isError && <Error>Check your email and password</Error>}

            <Submit>Log in</Submit>
          </form>
        </Wrapper>
      )}
    </RouteWrapper>
  );
};

const Submit = tw.button`bg-blue text-white py-2 mt-8 w-full rounded-lg`;

const Heading = tw.h1`font-bold my-6`;

const Title = tw.h2`my-6`;

const Paragraph = tw.p`my-4`;

const InputContainer = tw.div`text-left mb-8`;

const Label = tw.label`block mb-2`;

const Input = tw.input`outline-none rounded-lg border border-solid border-light-gray w-full py-2 px-3 focus:border-blue`;

const Wrapper = tw.div`bg-white text-center max-w-2xl mx-auto py-12 px-10 rounded-md`;

export default Login;
