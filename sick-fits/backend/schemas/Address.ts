import { checkbox, relationship, text } from '@keystone-next/fields';
import { list } from '@keystone-next/keystone/schema';
import { isSignedIn, permissions, rules } from '../access';

export const Address = list({
  access: {
    create: isSignedIn,
    read: rules.canManageUsers,
    update: rules.canManageUsers,
    delete: rules.canManageUsers,
  },
  fields: {
    name: text({ isRequired: true }),
    line1: text({ isRequired: true }),
    line2: text(),
    city: text({ isRequired: true }),
    province: text({ isRequired: true }),
    country: text({ isRequired: true }),
    postalcode: text({ isRequired: true }),
    phonenumber: text(),
    instructions: text(),
    user: relationship({ ref: 'User.addresses' }),
    primary: checkbox({ defaultValue: false, isRequired: true }),
  },
});
