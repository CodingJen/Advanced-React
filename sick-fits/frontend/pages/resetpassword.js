import RequestReset from '../components/RequestReset';
import ResetPassword from '../components/ResetPassword';

export default function ResetPasswordPage({ query }) {
  if (!query?.token) {
    return (
      <div>
        <p>Sorry you must supply a token!</p>
        <RequestReset />
      </div>
    );
  }

  console.log(query.token);

  return (
    <div>
      <ResetPassword token={query.token} />
    </div>
  );
}
