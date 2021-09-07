import AccountDetails from '../components/AccountDetails';
import { SignedInRender } from '../components/SignInPlease';
import User, { useUser } from '../components/User';

export default function AccountPage() {
  // const user = useUser();
  return (
    <div>
      <SignedInRender>
        <User />
      </SignedInRender>
    </div>
  );
}
