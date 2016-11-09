const {User} = require(`mongoose`).models;

const {pick, omit} = require(`lodash`);

const Joi = require(`joi`);
const Boom = require(`boom`);

const base = `/api`;

module.exports = [

  {

    method: `POST`,
    path: `${base}/users`,

    config: {

      validate: {

        options: {
          abortEarly: false
        },

        payload: {
          username: Joi.string().alphanum().min(3).required(),
          email: Joi.string().email().required(),
          password: Joi.string().min(3).required()
        }

      }

    },

    handler: (req, res) => {

      const data = pick(req.payload, [`username`, `email`, `password`]);
      const user = new User(data);

      user.save()
        .then(u => {
          if (!u) return res(Boom.badRequest(`cannot save user`));
          u = omit(u.toJSON(), [`__v`, `password`, `isActive`]);
          return res(u);
        })
        .catch(() => res(Boom.badRequest(`cannot save user`)));

    }

  }

];
