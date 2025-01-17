/* eslint-disable */
import { KeystoneContext } from '@keystone-next/types';
import { CartItemCreateInput } from '../.keystone/schema-types';
import { Session } from '../types';

async function addToCart(
  root: any,
  { productId }: { productId: string },
  context: KeystoneContext
): Promise<CartItemCreateInput> {
  console.log('ADDING TO CART');

  // Query current user to see if they are signed in
  const sesh = context.session as Session;

  if (!sesh.itemId) {
    throw new Error('You must be logged in to add to add to a cart!');
  }

  // query the current users cart
  const allCartItems = await context.lists.CartItem.findMany({
    where: { user: { id: sesh.itemId }, product: { id: productId } },
    resolveFields: 'id,quantity',
  });

  const [existingCartItem] = allCartItems;

  if (existingCartItem) {
    console.log(existingCartItem);
    console.log(`There are already ${existingCartItem.quantity}`);
    // see if the current item is in their cart
    // if it is increment by 1
    return await context.lists.CartItem.updateOne({
      id: existingCartItem.id,
      data: { quantity: existingCartItem.quantity + 1 },
    });
  }
  // if it isn't create a new cart item
  return await context.lists.CartItem.createOne({
    data: {
      product: { connect: { id: productId } },
      user: { connect: { id: sesh.itemId } },
    },
  });
}

export default addToCart;
