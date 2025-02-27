import Joi from 'joi';
export const TodoValidation = {
  new: Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string().required()
  }),
  update: Joi.object().keys({
    title: Joi.string().optional(),
    description: Joi.string(),
    completed: Joi.boolean()
  }),
  filter: Joi.object().keys({
    completed: Joi.boolean(),
    page: Joi.number().min(1),
    limit: Joi.number().min(1)
  }),
  id: Joi.object().keys({
    id: Joi.string().required()
  })
};
