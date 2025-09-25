import { body, validationResult } from 'express-validator';

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }));

  return res.status(400).json({
    errors: extractedErrors,
  });
};

const validatePostCreation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('subreddit').notEmpty().withMessage('Subreddit is required'),
  // Add more validation rules as needed
];

export { validate, validatePostCreation };