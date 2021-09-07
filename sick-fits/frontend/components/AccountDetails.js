import useForm from '../lib/useForm';
import Form from './styles/Form';

export default function AccountDetails({ user }) {
  console.log(user);
  const { iinputs, handleChange } = useForm({});
  return (
    <Form>
      <label htmlFor="Name">
        Name
        <input type="text" id="name" name="name" placeholder="Your Name" />
      </label>
    </Form>
  );
}
