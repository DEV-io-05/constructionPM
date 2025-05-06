import pkg from '@prisma/client';
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

// Permission constants
export const PERMISSIONS = {
  PROJECTS: {
    CREATE: 'projects:create',
    READ: 'projects:read',
    UPDATE: 'projects:update',
    DELETE: 'projects:delete',
    MANAGE: 'projects:manage'
  },
  TASKS: {
    CREATE: 'tasks:create',
    READ: 'tasks:read',
    UPDATE: 'tasks:update',
    DELETE: 'tasks:delete',
    ASSIGN: 'tasks:assign'
  },
  USERS: {
    CREATE: 'users:create',
    READ: 'users:read',
    UPDATE: 'users:update',
    DELETE: 'users:delete',
    MANAGE: 'users:manage'
  },
  REPORTS: {
    VIEW: 'reports:view',
    GENERATE: 'reports:generate',
    EXPORT: 'reports:export'
  }
};

const ROLE_PERMISSIONS = {
  ADMIN: [
    ...Object.values(PERMISSIONS.PROJECTS),
    ...Object.values(PERMISSIONS.TASKS),
    ...Object.values(PERMISSIONS.USERS),
    ...Object.values(PERMISSIONS.REPORTS)
  ],
  PROJECT_MANAGER: [
    PERMISSIONS.PROJECTS.READ,
    PERMISSIONS.PROJECTS.UPDATE,
    PERMISSIONS.PROJECTS.MANAGE,
    ...Object.values(PERMISSIONS.TASKS),
    PERMISSIONS.USERS.READ,
    PERMISSIONS.REPORTS.VIEW,
    PERMISSIONS.REPORTS.GENERATE
  ],
  TEAM_MEMBER: [
    PERMISSIONS.PROJECTS.READ,
    PERMISSIONS.TASKS.READ,
    PERMISSIONS.TASKS.UPDATE,
    PERMISSIONS.USERS.READ,
    PERMISSIONS.REPORTS.VIEW
  ],
  USER: [
    PERMISSIONS.PROJECTS.READ,
    PERMISSIONS.TASKS.READ,
    PERMISSIONS.USERS.READ
  ]
};

/**
 * Middleware: Check if user has required permissions
 */
export const hasPermission = (requiredPermissions) => {
  return async (req, res, next) => {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({ message: 'Authentication required' });
      }

      const userRoles = user.role;
      const userPermissions = userRoles.reduce((permissions, role) => {
        return [...permissions, ...(ROLE_PERMISSIONS[role] || [])];
      }, []);

      const hasAllPermissions = requiredPermissions.every(
        permission => userPermissions.includes(permission)
      );

      if (!hasAllPermissions) {
        return res.status(403).json({
          message: 'Access denied. Required permissions not found.',
          required: requiredPermissions,
          available: userPermissions
        });
      }

      req.userPermissions = userPermissions;
      next();
    } catch (err) {
      console.error('Permission check error:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
};

/**
 * Middleware: Check project-specific permissions
 */
export const hasProjectPermission = (requiredPermissions) => {
  return async (req, res, next) => {
    try {
      const user = req.user;
      const projectId = req.params.projectId || req.body.projectId;

      if (!projectId) {
        return res.status(400).json({ message: 'Project ID is required' });
      }

      const projectMember = await prisma.projectMember.findFirst({
        where: {
          projectId: projectId,
          userId: user.id
        }
      });

      const isAdmin = user.role.includes('ADMIN');

      if (!projectMember && !isAdmin) {
        return res.status(403).json({
          message: 'Access denied. Not a member of this project.'
        });
      }

      if (!isAdmin) {
        const projectRole = projectMember.role;
        const projectPermissions = ROLE_PERMISSIONS[projectRole] || [];

        const hasRequiredPermissions = requiredPermissions.every(
          permission => projectPermissions.includes(permission)
        );

        if (!hasRequiredPermissions) {
          return res.status(403).json({
            message: 'Insufficient project permissions',
            required: requiredPermissions
          });
        }
      }

      next();
    } catch (err) {
      console.error('Project permission check error:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
};

/**
 * Middleware: Role checking
 */
export function checkRole(allowedRoles) {
  return (req, res, next) => {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({ message: 'Forbidden: Insufficient role' });
    }
    next();
  };
}
