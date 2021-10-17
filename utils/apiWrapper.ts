import { NextApiRequest, NextApiResponse } from 'next';
import Validator, { ValidationError } from 'fastest-validator';

const v = new Validator();

interface ApiWrapperOpts {
  params?: object;
}

export const apiWrapper =
  (
    fn: (req: NextApiRequest, res: NextApiResponse) => unknown,
    options: ApiWrapperOpts = {},
  ) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      if (options.params) {
        const valid = v.validate(req.body, options.params);
        if (valid !== true) {
          const errors = valid as ValidationError[];
          console.error('Validation error:', errors, req.body);
          throw new Error(errors[0].message);
        }
      }
      return fn(req, res);
    } catch (error: any) {
      res.status(400).json({
        error: error.message,
      });
    }
  };
