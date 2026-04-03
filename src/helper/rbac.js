// utils/rbac.js

export const hasPermission = (
  permissions = [],
  moduleName,
  action = "view" // view | add | edit | delete
) => {
  if (!Array.isArray(permissions)) return false;

  const modulePermission = permissions.find(
    (item) => item.module === moduleName
  );

  if (!modulePermission) return false;

  return Boolean(modulePermission[action]);
};
export const canView = (permissions, module) =>
  hasPermission(permissions, module, "view");

export const canAdd = (permissions, module) =>
  hasPermission(permissions, module, "add");

export const canEdit = (permissions, module) =>
  hasPermission(permissions, module, "edit");

export const canDelete = (permissions, module) =>
  hasPermission(permissions, module, "delete");
