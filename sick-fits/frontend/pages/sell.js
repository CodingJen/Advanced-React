import CreateProduct from '../components/CreateProduct';
import { SignedInRender } from '../components/SignInPlease';

export default function SellPage() {
  return (
    <div>
      <SignedInRender>
        <CreateProduct />
      </SignedInRender>
    </div>
  );
}
