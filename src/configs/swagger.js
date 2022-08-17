const swaggerJsDoc = require("swagger-jsdoc");

const { port } = require("./env");

const swagger = {
  swaggerDefinition: {
    // host: `${process.env.BT_SWAGGER_MS_BASE_URL}/auth`, 
    info: {
      version: "2.0.0",
      title: "SUREMOVE SERVICE API",
      contact: { name: "Miriam Onuoha" },
      servers: [{ url: `http://localhost:${port}` }],
    },
  },
  apis: ["./src/swaggerDocs/**/*.yml"],
};

module.exports = swaggerJsDoc(swagger);
