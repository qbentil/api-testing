import { AppConstants } from '../constants';
import { Router } from 'express';
import { TodoController } from '../controllers';
import { TodoValidation } from '../validations';
import { ValidationMiddleware } from '../middlewares';

const router = Router();



router.post('/',
    ValidationMiddleware(TodoValidation.new),
    TodoController.createTodo
);

router.put('/:id',
    ValidationMiddleware(TodoValidation.update),
    ValidationMiddleware(TodoValidation.id, AppConstants.REQUEST_TYPE.PARAMS),
    TodoController.updateTodo
);

router.get('/read/:id',
    ValidationMiddleware(TodoValidation.id, AppConstants.REQUEST_TYPE.PARAMS),
    TodoController.getTodo
);

router.get('/',
    ValidationMiddleware(TodoValidation.filter),
    TodoController.getTodos
)
router.delete('/delete/:id',
    ValidationMiddleware(TodoValidation.id, AppConstants.REQUEST_TYPE.PARAMS),
    TodoController.deleteTodo
);

export default router;
