import styled from 'styled-components';

const CheckoutFormStyles = styled.div`
  box-shadow: 0 1px 2pxc 2px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 5px;
  padding: 1rem;
  display: grid;
  grid-gap: 1rem;
`;

export default function Checkout() {
  return (
    <CheckoutFormStyles>
      <p>hey</p>
    </CheckoutFormStyles>
  );
}
