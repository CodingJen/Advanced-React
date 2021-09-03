import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import styled from 'styled-components';

const REMOVE_FROM_CART_MUTATION = gql`
  mutation REMOVE_FROM_CART_MUTATION($id: ID!) {
    deleteCartItem(id: $id) {
      id
    }
  }
`;

const BigButton = styled.button`
  font-size: 3rem;
  background: none;
  border: 0;
  margin-right: 1rem;
  &:hover {
    color: var(--red);
    cursor: pointer;
  }
`;

function update(cache, payload) {
  cache.evict(cache.identify(payload.data.deleteCartItem));
}

export default function RemoveFromCart({ id }) {
  const [deleteItem, { data, loading, error }] = useMutation(
    REMOVE_FROM_CART_MUTATION,
    {
      variables: { id },
      update,
      // optimisticResponse: {
      //   deleteCartItem: {
      //     __typename: 'CartItem',
      //     id,
      //   },
      // },
    }
  );
  return (
    <BigButton
      type="button"
      title="Remove this item from cart"
      onClick={deleteItem}
      disabled={loading}
    >
      &times;
    </BigButton>
  );
}
