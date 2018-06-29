import validate from 'validate.js';
import moment from 'moment';

validate.extend(validate.validators.datetime, {
  parse(value) {
    return +moment.utc(value);
  },
  format(value) {
    const date = moment(value);
    return date.isValid();
  }
});

export const Sanitize = (data, whitelist) => {
  if (whitelist && whitelist.length) {
    const cleaned = {};
    whitelist.forEach(item => {
      cleaned[item] = true;
    });
    const result = validate.cleanAttributes(data, cleaned);
    // Return special
    result.$limit = data.$limit;
    result.$skip = data.$skip;
    result.$sort = data.$sort;
    result.$or = data.$or;
    return result;
  }
  return data;
};

export const Validate = (data, constraints) => validate(data, constraints);
