export const required = (label) => ({ required: `${label} is required` });

export const emailRules = {
  required: 'Email is required',
  pattern: {
    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Enter a valid email address',
  },
};

export const phoneRules = {
  required: 'Phone is required',
  pattern: {
    value: /^[+\d\s\-().]{5,}(\s*(x|ext\.?)\s*\d+)?$/i,
    message: 'Enter a valid phone number',
  },
};

export const websiteRules = {
  required: 'Website is required',
  pattern: {
    value: /^(https?:\/\/)?([\w\-]+\.)+[\w]{2,}(\/\S*)?$/i,
    message: 'Enter a valid website URL',
  },
};

export const nameRules = {
  required: 'Name is required',
  minLength: { value: 2, message: 'Name must be at least 2 characters' },
};

export const companyRules = {
  required: 'Company name is required',
  minLength: { value: 2, message: 'Company name must be at least 2 characters' },
};
