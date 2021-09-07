import { relationship, text, timestamp } from '@keystone-next/fields';
import { list } from '@keystone-next/keystone/schema';
import { isSignedIn, rules } from '../access';

export const BlogPost = list({
  access: {
    create: isSignedIn,
    read: () => true,
    update: () => false,
    delete: () => false,
  },
  fields: {
    date: timestamp(),
    title: text(),
    post: document(),
    author: relationship({ ref: 'User.blogs' }),
  },
});
