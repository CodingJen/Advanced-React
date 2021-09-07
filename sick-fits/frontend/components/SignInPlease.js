import { useUser } from './User';
import SignIn from './SignIn';

export function SignedInRender({ children }) {
  const user = useUser();
  if (!user) return <SignIn />;
  return children;
}

export function SignedInBlank({ children }) {
  const user = useUser();
  if (!user) return null;
  return children;
}
