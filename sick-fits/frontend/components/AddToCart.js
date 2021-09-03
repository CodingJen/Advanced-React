import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import { useCart } from '../lib/cartState';
import { CURRENT_USER_QUERY } from '../lib/queries';

const ADD_TO_CART_MUTATION = gql`
  mutation ADD_TO_CART_MUTATION($id: ID!) {
    addToCart(productId: $id) {
      id
    }
  }
`;
export default function AddToCart({ id }) {
  const { openCart } = useCart();
  const [addToCart, { data, loading, error }] = useMutation(
    ADD_TO_CART_MUTATION,
    {
      variables: { id },
      refetchQueries: [{ query: CURRENT_USER_QUERY }],
    }
  );

  function handleAddToCart() {
    addToCart();
    // need a delay first so our count animation shows.
    // openCart();
  }

  return (
    <button type="button" onClick={handleAddToCart} disabled={loading}>
      Add{loading && 'ing'} To Cart 🛒
    </button>
  );
}
