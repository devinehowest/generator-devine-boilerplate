const {User} = require(`mongoose`).models;

const {omit} = require(`lodash`);

const Joi = require(`joi`);
const Boom = require(`boom`);

const base = `/api`;

module.exports = [

  {

    method: `POST`,
    path: `${base}/auth`,

    config: {

      validate: {

        options: {
          abortEarly: false
        },

        payload: {
          login: Joi.string().min(3).required(),
          password: Joi.string().min(3).required(),
          audience: Joi.string().min(3).required()
        }

      }

    },

    handler: (req, res) => {

      const {login, password, audience} = req.payload;
      const isActive = true;

      User.findOne({
        $and: [
          {
            $or: [
              {username: login},
              {email: login}
            ]
          },
          {isActive}
        ]
      }).then(user => {


        if (!user) {
          return res(
            Boom.badRequest(`user/password combination incorrect`)
          );
        }

        user.verifyPassword(password, (err, isValid) => {

          if (err || !isValid) {
            return res(
              Boom.badRequest(`user/password combination incorrect`)
            );
          }

          const {_id: subject} = user;
          user = omit(user.toJSON(), [`__v`, `password`, `isActive`, `_id`, `created`]);

          return res.token(user, {subject, audience});

        });

      }).catch(() => {
        return res(
          Boom.badRequest(`error while authenticating user`)
        );
      });

    }

  }

];
