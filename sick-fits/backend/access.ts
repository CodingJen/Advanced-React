import { permissionList } from './schemas/fields';
import { ListAccessArgs } from './types';

export function isSignedIn({ session }: ListAccessArgs): boolean {
  return !!session;
}

const generatedPermissions = Object.fromEntries(
  permissionList.map((permission) => [
    permission,
    function ({ session }: ListAccessArgs): boolean {
      return !!session?.data.role?.[permission];
    },
  ])
);

// Permissions - check if a user meets a criteria.
export const permissions = {
  ...generatedPermissions,

  // DEMO PERMISSION ADDITION
  isGreat({ session }: ListAccessArgs): boolean {
    if (session?.data.name.includes('Jennifer')) {
      return true;
    }
  },
};

// Rules based
// Rules cn return a boolean or a filter which limits which products they can CRUD
export const rules = {
  canManageProducts({ session }: ListAccessArgs): boolean {
    if (!isSignedIn({ session })) {
      return false;
    }
    // 1. Do they have the permission of canManageProducts
    if (permissions.canManageProducts({ session })) {
      return true;
    }

    // 2 If not, doo they own it
    return { user: { id: session.itemId } };
  },
  canReadProducts({ session }: ListAccessArgs): boolean {
    if (!isSignedIn({ session })) {
      return false;
    }
    if (permissions.canManageProducts({ session })) {
      return true; // they can read everything
    }
    // they should only see available products(based on the status field)
    return { status: 'AVAILABLE' };
  },
  canOrder({ session }: ListAccessArgs): boolean {
    if (!isSignedIn({ session })) {
      return false;
    }
    // 1. Do they have the permission of canManageProducts
    if (permissions.canManageCart({ session })) {
      return true;
    }
    // 2 If not, doo they own it
    return { user: { id: session.itemId } };
  },
  canManageOrderItems({ session }: ListAccessArgs): boolean {
    if (!isSignedIn({ session })) {
      return false;
    }
    // 1. Do they have the permission of canManageProducts
    if (permissions.canManageCart({ session })) {
      return true;
    }

    // 2 If not, doo they own it
    return { order: { user: { id: session.itemId } } };
  },
  canManageUsers({ session }: ListAccessArgs): boolean {
    if (!isSignedIn({ session })) {
      return false;
    }
    // 1. Do they have the permission of canManageProducts
    if (permissions.canManageUsers({ session })) {
      return true;
    }
    // Otherwise they can only update themselves
    return { id: session.itemId };
  },
};
