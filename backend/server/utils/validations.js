export const registerSchema = {
  name: {
    isLength: {
      options: {
        min: 3,
        max: 32,
      },
      errorMessage: 'Name must be between 3-32 letters',
    },
    notEmpty: {
      errorMessage: 'Name must be included',
    },
    isString: {
      errorMessage: 'Name must be string',
    },
  },
  phone: {
    notEmpty: {
      errorMessage: 'Phone must be included',
    },
    isLength: {
      options: {
        min: 11,
        max: 11,
      },
      errorMessage: 'Phone must be true',
    },
  },
  email: {
    isEmail: {
      errorMessage: 'Email must be correct',
    },
    notEmpty: {
      errorMessage: 'Email must be included',
    },
  },
  password: {
    notEmpty: {
      errorMessage: 'password is required',
    },
    isLength: {
      options: {
        min: 8,
        max: 32,
      },
      errorMessage: 'Password must be between 8 and 32 characters',
    },
    matches: {
      options: [
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-])[A-Za-z\d@$!%*?&.#_-]+$/,
      ],
      errorMessage:
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    },
  },
};
export const signinSchema = {
  email: {
    notEmpty: {
      errorMessage: 'Email must be included',
    },
    isEmail: {
      errorMessage: 'Email must be correct',
    },
  },
};
export const workspaceSchema = {
  name: {
    notEmpty: {
      errorMessage: 'WorkSpace name must be included',
    },
    isString: {
      errorMessage: 'WorkSpace name must be string',
    },
    isLength: {
      options: {
        min: 3,
        max: 27,
      },
      errorMessage: 'WorkSpace must be between 3-27 charchters',
    },
  },
  slug: {
    notEmpty: {
      errorMessage: 'Slug must be included',
    },
    isString: {
      errorMessage: 'Slug must be string',
    },
    isLength: {
      options: {
        min: 3,
        max: 12,
      },
      errorMessage: 'Slug must be between 3-12 charchters',
    },
  },
};
export const verifyOTPValidation = {
  email: {
    notEmpty: {
      errorMessage: 'Email must be included',
    },
    isEmail: {
      errorMessage: 'Email must be correct',
    },
  },
  otp: {
    isLength: {
      options: {
        min: 5,
        max: 5,
      },
      errorMessage: 'OTP must be 5 numbers',
    },
    isNumeric: {
      errorMessage: 'OTP must be a number',
    },
  },
};
export const resendotpValdition = {
  email: {
    notEmpty: {
      errorMessage: 'Email must be included',
    },
    isEmail: {
      errorMessage: 'Email must be correct',
    },
  },
};
export const teamValidation = {
  name: {
    notEmpty: {
      errorMessage: 'Team name must be included',
    },
    isString: {
      errorMessage: 'Team name must be string',
    },
    isLength: {
      options: {
        min: 4,
        max: 26,
      },
      errorMessage: 'Team name must be between 4-26 charchters',
    },
  },
  description: {
    notEmpty: {
      errorMessage: 'Description must be included',
    },
    isString: {
      errorMessage: 'Description must be string',
    },
  },
};
export const updateTeamSchema = {
  name: {
    optional: true,
    isString: {
      errorMessage: 'Name must be string',
    },
    isLength: {
      options: {
        min: 3,
        max: 50,
      },
      errorMessage: 'Name must be between 3-50 letters',
    },
  },

  description: {
    optional: true,
    isString: {
      errorMessage: 'Description must be string',
    },
    isLength: {
      options: {
        min: 3,
        max: 300,
      },
      errorMessage: 'Description must be between 3-300 letters',
    },
  },
};
export const projectValidation = {
  name: {
    notEmpty: {
      errorMessage: 'Project name is required',
    },
    isString: {
      errorMessage: 'Project name must be a string',
    },
    isLength: {
      options: {
        min: 3,
        max: 100,
      },
      errorMessage: 'Project name must be between 3-100 characters',
    },
  },

  description: {
    notEmpty: {
      errorMessage: 'Project description is required',
    },
    isString: {
      errorMessage: 'Project description must be a string',
    },
    isLength: {
      options: {
        min: 3,
        max: 500,
      },
      errorMessage: 'Project description must be between 3-500 characters',
    },
  },

  status: {
    optional: true,
    isIn: {
      options: [['planning', 'active', 'completed', 'archived']],
      errorMessage: 'Invalid project status',
    },
  },

  startDate: {
    optional: true,
    isISO8601: {
      errorMessage: 'Invalid start date',
    },
  },

  dueDate: {
    optional: true,
    isISO8601: {
      errorMessage: 'Invalid due date',
    },
  },
};
export const updateProjectValidation = {
  name: {
    optional: true,
    isString: {
      errorMessage: 'Project name must be a string',
    },
    isLength: {
      options: {
        min: 3,
        max: 100,
      },
      errorMessage: 'Project name must be between 3-100 characters',
    },
  },

  description: {
    optional: true,
    isString: {
      errorMessage: 'Project description must be a string',
    },
    isLength: {
      options: {
        min: 3,
        max: 500,
      },
      errorMessage: 'Project description must be between 3-500 characters',
    },
  },

  status: {
    optional: true,
    isIn: {
      options: [['planning', 'active', 'completed', 'archived']],
      errorMessage: 'Invalid project status',
    },
  },

  startDate: {
    optional: true,
    isISO8601: {
      errorMessage: 'Invalid start date',
    },
  },

  dueDate: {
    optional: true,
    isISO8601: {
      errorMessage: 'Invalid due date',
    },
  },
};
export const projectTeamsValidation = {
  teamId: {
    notEmpty: {
      errorMessage: 'Team id must be included',
    },
    isMongoId: {
      errorMessage: 'Invalid team id',
    },
  },
};
export const taskValidation = {
  title: {
    notEmpty: {
      errorMessage: 'Task title is required',
    },
    isString: {
      errorMessage: 'Task title must be a string',
    },
    isLength: {
      options: {
        min: 3,
        max: 100,
      },
      errorMessage: 'Task title must be between 3-100 characters',
    },
  },

  description: {
    notEmpty: {
      errorMessage: 'Task description is required',
    },
    isString: {
      errorMessage: 'Task description must be a string',
    },
    isLength: {
      options: {
        min: 3,
        max: 1000,
      },
      errorMessage: 'Task description must be between 3-1000 characters',
    },
  },

  responsibleTeamId: {
    notEmpty: {
      errorMessage: 'Responsible team is required',
    },
    isMongoId: {
      errorMessage: 'Invalid responsible team id',
    },
  },

  assigneeId: {
    notEmpty: {
      errorMessage: 'Assignee is required',
    },
    isMongoId: {
      errorMessage: 'Invalid assignee id',
    },
  },

  priority: {
    notEmpty: {
      errorMessage: 'Priority is required',
    },
    isIn: {
      options: [['high', 'medium', 'a bit']],
      errorMessage: 'Invalid priority',
    },
  },
};
export const updateTaskValidation = {
  title: {
    optional: true,
    isString: {
      errorMessage: 'Task title must be a string',
    },
    isLength: {
      options: {
        min: 3,
        max: 100,
      },
      errorMessage: 'Task title must be between 3-100 characters',
    },
  },

  description: {
    optional: true,
    isString: {
      errorMessage: 'Task description must be a string',
    },
    isLength: {
      options: {
        min: 3,
        max: 1000,
      },
      errorMessage: 'Task description must be between 3-1000 characters',
    },
  },

  responsibleTeamId: {
    optional: true,
    notEmpty: {
      errorMessage: 'Responsible team is required',
    },
    isMongoId: {
      errorMessage: 'Invalid responsible team id',
    },
  },

  assigneeId: {
    optional: true,
    isMongoId: {
      errorMessage: 'Invalid assignee id',
    },
  },

  priority: {
    optional: true,
    isIn: {
      options: [['high', 'medium', 'a bit']],
      errorMessage: 'Invalid priority',
    },
  },
};
export const updateTaskStatusValidation = {
  status: {
    notEmpty: {
      errorMessage: 'Status must be included',
    },
    isIn: {
      options: [['in-progress', 'ready-for-review', 'completed']],
      errorMessage: 'Invalid status',
    },
  },
};
