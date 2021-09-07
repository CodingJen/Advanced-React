import { useQuery } from '@apollo/client';
import { CURRENT_USER_QUERY } from '../lib/queries';
import useForm from '../lib/useForm';
import AddressDropdown from './AddressDropdown';
import Form from './styles/Form';

export function useUser() {
  const { data } = useQuery(CURRENT_USER_QUERY);
  return data?.authenticatedItem;
}

export default function User() {
  const user = useUser();
  const { inputs, handleChange } = useForm({
    id: user.id,
    email: user.email,
    name: user.name,
  });

  console.log('user', user.addresses);
  return (
    <Form>
      <label htmlFor="name">
        Name
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Name"
          value={inputs.name}
          onChange={handleChange}
        />
      </label>
      <label htmlFor="email">
        Email
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Email"
          value={inputs.email}
          onChange={handleChange}
          disabled
        />
      </label>
      <AddressDropdown addresses={user.addresses} />
    </Form>
  );
}
