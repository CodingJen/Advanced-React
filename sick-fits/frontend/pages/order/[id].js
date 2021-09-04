import Order from '../../components/Order';

export default function OrderPage({ query }) {
  return (
    <div>
      <Order id={query.id} />
    </div>
  );
}
