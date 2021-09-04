/* eslint-disable */
import { KeystoneContext } from '@keystone-next/types';
import { CartItemCreateInput, OrderCreateInput } from '../.keystone/schema-types';
import stripeConfig from '../lib/stripe';
import { Session } from '../types';

interface Arguments {
  token: string;
}
const graphql = String.raw;
export default async function checkout(
  root: any,
  { token }: Arguments,
  context: KeystoneContext
): Promise<OrderCreateInput> {
  // 1 make sure they are signed in
  // const session = context.session as Session;

  const userId = context.session.itemId;
  if (!userId) {
    throw new Error('Sorry! You must be signed in to create an order.');
  }

  // query the current user
  const user = await context.lists.User.findOne({
    where: { id: userId },
    resolveFields: graphql`
    id, 
    name,
    email,
    cart {
      id
      quantity
      product {
        id
        name
        price
        description
        photo {
          id
          image {
            id
            publicUrlTransformed
          }
        }
      }
    }`,
  });

  // console.dir(user, { depth: null });

  const cartItems = user.cart.filter((cartItem) => cartItem.product);

  // 2. calculate the total price
  const amount = cartItems.reduce(function (tally: number, cartItem: CartItemCreateInput) {
    return tally + cartItem.quantity * cartItem.product.price;
  }, 0);

  console.log(amount);
  // 3. create the payment with the stripe library

  const charge = await stripeConfig.paymentIntents
    .create({
      amount,
      currency: 'CAD',
      confirm: true,
      payment_method: token,
    })
    .catch((error) => {
      console.error('STRIPE ERROR OUTPUT:', error);
      throw new Error(error.message);
    });

  console.log(charge);
  // 4. convert the cartItems to OrderItems
  const orderItems = cartItems.map((cartItem) => {
    return {
      name: cartItem.product.name,
      description: cartItem.product.description,
      price: cartItem.product.price,
      quantity: cartItem.quantity,
      photo: { connect: { id: cartItem.product.photo.id } },
    };
  });

  // 5. create the order and return it
  const order = await context.lists.Order.createOne({
    data: {
      total: charge.amount,
      charge: charge.id,
      items: { create: orderItems },
      user: { connect: { id: userId } },
    },
  });

  const cartItemIds = user.cart.map((cartItem) => cartItem.id);

  await context.lists.CartItem.deleteMany({
    ids: cartItemIds,
  });

  return order;
}
