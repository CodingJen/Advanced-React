import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import Head from 'next/head';
import styled from 'styled-components';
import Link from 'next/link';
import { siteName } from '../config';
import OrderStyles from './styles/OrderStyles';
import DisplayError from './ErrorMessage';
import formatMoney from '../lib/formatMoney';
import OrderItemStyles from './styles/OrderItemStyles';
import ItemStyles from './styles/ItemStyles';

const USER_ORDERS_QUERY = gql`
  query USER_ORDERS_QUERY {
    allOrders {
      id
      total
      charge
      items {
        id
        name
        description
        price
        quantity
        photo {
          id
          image {
            publicUrlTransformed
          }
        }
      }
    }
  }
`;

const OrderUl = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  grid-gap: 4rem;
`;

function countItemsInOrder(order) {
  const num = order.items.reduce((tally, item) => tally + item.quantity, 0);
  return (
    <p>
      {num} Item{num > 1 ? 's' : ''}
    </p>
  );
}

export default function OrdersPage() {
  const { loading, error, data } = useQuery(USER_ORDERS_QUERY);
  console.log({ loading, error, data });
  if (loading) return <p>Loading...</p>;
  if (error) return <DisplayError error={error} />;
  const { allOrders } = data;
  console.log(data);
  return (
    <div>
      <Head>
        <title>
          {siteName} - Orders ({allOrders.length})
        </title>
      </Head>
      <h2>You have {allOrders.length} orders.</h2>
      <OrderUl>
        {allOrders.map((order) => (
          <OrderItemStyles key={order.id}>
            <Link href={`/order/${order.id}`}>
              <a>
                <div className="order-meta">
                  {countItemsInOrder(order)}
                  <p>
                    {order.items.length} Product
                    {order.items.length > 1 ? 's' : ''}
                  </p>
                  <p>{formatMoney(order.total)}</p>
                </div>
                <div className="images">
                  {order.items.map((item) => (
                    <div key={item.id}>
                      <img
                        src={item?.photo?.image?.publicUrlTransformed}
                        alt={item.name}
                      />
                    </div>
                  ))}
                </div>
              </a>
            </Link>
          </OrderItemStyles>
        ))}
      </OrderUl>
    </div>
  );
}
