import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import useForm from '../lib/useForm';
import DisplayError from './ErrorMessage';
import SignIn from './SignIn';
import Form from './styles/Form';

const PASSWORD_RESET_MUTATION = gql`
  mutation PASSWORD_RESET_MUTATION(
    $email: String!
    $password: String!
    $token: String!
  ) {
    redeemUserPasswordResetToken(
      email: $email
      password: $password
      token: $token
    ) {
      code
      message
    }
  }
`;

export default function ResetPassword({ token }) {
  const { inputs, handleChange, resetForm } = useForm({
    email: '',
    password: '',
    token,
  });

  const [
    changePassword,
    { data, loading, error },
  ] = useMutation(PASSWORD_RESET_MUTATION, { variables: inputs });

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await changePassword().catch(console.error);
    resetForm();
  }
  const successfulError = data?.redeemUserPasswordResetToken?.code
    ? data?.redeemUserPasswordResetToken
    : undefined;
  return (
    <div>
      <Form method="POST" onSubmit={handleSubmit}>
        <h2>Reset Password</h2>
        <DisplayError error={successfulError || error} />
        <fieldset disabled={loading} aria-busy={loading}>
          {data?.redeemUserPasswordResetToken === null && (
            <>
              <p>Success! Password reset. Please login.</p>
            </>
          )}
          <label htmlFor="email">
            Email
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Your Email Address"
              autoComplete="email"
              value={inputs.email}
              onChange={handleChange}
            />
          </label>
          <label htmlFor="password">
            Password
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              value={inputs.password}
              onChange={handleChange}
            />
          </label>
          <button type="submit">Reset Password</button>
        </fieldset>
      </Form>
    </div>
  );
}
