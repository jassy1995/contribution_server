import { Hono } from 'hono';
import ContributionController from '../controllers/contribution.ts';
import authenticate from '../middlewares/authenticate.ts';
import validate from '../middlewares/validate.ts';
import { createContributionSchema, getContributionSchema } from '../schemas/contribution.ts';

const router = new Hono();

router.post(
  '/',
  authenticate.admin,
  validate('json', createContributionSchema),
  ContributionController.create,
);
router.get(
  '/',
  authenticate.admin,
  validate('query', getContributionSchema),
  ContributionController.getAll,
);
router.get('/overview', authenticate.admin, ContributionController.getOverView);
export default router;
