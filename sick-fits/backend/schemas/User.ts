import { list } from '@keystone-next/keystone/schema';
import { text, password, relationship, timestamp } from '@keystone-next/fields';
import { Product } from './Product';
import { permissions, rules } from '../access';

export const User = list({
  access: {
    create: () => true,
    read: rules.canManageUsers,
    update: rules.canManageUsers,
    // Only people with the permission can delete themselve
    delete: permissions.canManageUsers,
  },
  ui: {
    // hide backend ui from regular users
    hideCreate: (args) => !permissions.canManageUsers(args),
    hideDelete: (args) => !permissions.canManageUsers(args),
  },
  fields: {
    name: text({ isRequired: true }),
    email: text({ isRequired: true, isUnique: true }),
    password: password(),
    joined: timestamp({
      isRequired: true,
      defaultValue: () => new Date().toISOString(),
    }),
    cart: relationship({
      ref: 'CartItem.user',
      many: true,
      ui: {
        createView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'read' },
      },
    }),
    // address: relationship({ ref: 'Address.user', many: true }),
    orders: relationship({ ref: 'Order.user', many: true }),
    // TODO: add roles, cart, orders
    role: relationship({
      ref: 'Role.assignedTo',
      // add access control
      access: {
        create: permissions.canManageUsers,
        update: permissions.canManageUsers,
      },
    }),
    products: relationship({
      ref: 'Product.user',
      many: true,
    }),
    addresses: relationship({
      ref: 'Address.user',
      many: true,
    }),
  },
});
