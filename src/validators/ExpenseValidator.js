const ExpenseValidator = {
  onSearch(req) {
    const errors = [];
    if (
      (req.query.startDate && !req.query.endDate) ||
      (!req.query.startDate && req.query.endDate)
    ) {
      errors.push("A start date and end date must be paired");
    }
    return errors;
  }
};

export default ExpenseValidator;
