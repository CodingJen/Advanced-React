import { useMutation } from '@apollo/client';
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import gql from 'graphql-tag';
import { useRouter } from 'next/router';
import nProgress from 'nprogress';
import { useState } from 'react';
import styled from 'styled-components';
import { useCart } from '../lib/cartState';
import { CURRENT_USER_QUERY } from '../lib/queries';
import SickButton from './styles/SickButton';

const CheckoutFormStyles = styled.form`
  box-shadow: 0 1px 2pxc 2px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 5px;
  padding: 1rem;
  display: grid;
  grid-gap: 1rem;
`;

const CREATE_ORDER_MUATATION = gql`
  mutation CREATE_ORDER_MUATATION($token: String!) {
    checkout(token: $token) {
      id
      charge
      total
      items {
        id
        name
      }
    }
  }
`;

const stripeLib = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

function CheckoutForm() {
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { closeCart } = useCart();
  const [
    checkout,
    { loading: graphQLLoading, error: graphQLError, data },
  ] = useMutation(CREATE_ORDER_MUATATION, {
    refetchQueries: [{ query: CURRENT_USER_QUERY }],
  });
  async function handleSubmit(e) {
    // stop for from submitting and turn loader on
    e.preventDefault();
    setLoading(true);
    console.log('we gotta do some work');
    // 2 start the page transition
    nProgress.start();
    // 3 create the payment method via stripe token comes back here if successful
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });
    console.log({ paymentMethod, error });
    // 4 hand any errors from stripe
    if (error) {
      setError(error);
      nProgress.done();
    }
    // console.log('token', paymentMethod.id);
    // 5 send the etoke from step 3 to our keystone server via a custom mutation
    const order = await checkout({ variables: { token: paymentMethod.id } });
    console.log('Finished order');
    console.log(order);

    // 6 change the page to view the order
    router.push({
      pathname: `/order/[id]`,
      query: {
        id: order.data.checkout.id,
      },
    });
    // 7 close the cart
    closeCart();
    // 8 turn the loader off
    setLoading(false);
    nProgress.done();
  }

  return (
    <CheckoutFormStyles onSubmit={handleSubmit}>
      {error && <p style={{ fontSize: 12 }}>{error.message}</p>}
      {graphQLError && <p style={{ fontSize: 12 }}>{graphQLError.message}</p>}
      <CardElement />
      <SickButton>Check Out Now</SickButton>
    </CheckoutFormStyles>
  );
}

function Checkout() {
  return (
    <Elements stripe={stripeLib}>
      <CheckoutForm />
    </Elements>
  );
}

export default Checkout;
