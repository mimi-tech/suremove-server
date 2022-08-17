const Joi = require("joi");

require("dotenv").config();

const schema = Joi.object({
  NODE_ENV: Joi.string()
    .valid("development", "production", "test", "provision")
    .default("development"),
  PORT: Joi.number().required(),
  DATABASE_URL: Joi.string().required().description("Database connection URL"),
})
  .unknown()
  .required();

const { error, value: env } = schema.validate(process.env);

if (error) {
  console.error(`Config validation error: ${error.message}`);
  return;
}

const config = {
  env: env.NODE_ENV,
  port: env.PORT,
  sessionSecret: env.SESSION_SECRET,
  dbURL: env.DATABASE_URL,
};

module.exports = config;
