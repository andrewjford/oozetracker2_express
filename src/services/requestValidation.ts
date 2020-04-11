const requestValidation = {
  validateCreateExpense(req, res, next) {
    const expectedBodyFormat = {
      category: "number",
      date: "string",
      amount: "number",
      description: "string"
    };

    const errorMessages = [];

    Object.keys(expectedBodyFormat).forEach(key => {
      if (
        (expectedBodyFormat[key] === "number" && !parseFloat(req.body[key])) ||
        (expectedBodyFormat[key] === "string" &&
          typeof req.body[key] !== expectedBodyFormat[key])
      ) {
        errorMessages.push(
          `Invalid request format: ${key} must be provided and of type ${expectedBodyFormat[key]}`
        );
      }
    });

    if (errorMessages.length > 0) {
      return res.status(400).send({
        message: errorMessages
      });
    } else {
      next();
    }
  }
};
export default requestValidation;
