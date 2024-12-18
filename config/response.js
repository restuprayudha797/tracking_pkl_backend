export const response = (statusCode, code, status, data, message, res) => {
  res.json(statusCode, {
    code: code,
    status: status,
    message: message,
    data: data

  });
};

export const loginResponse = (statusCode, code, status, items, data, message, res) => {
  res.json(statusCode, {
    code: code,
    status: status,
    message: message,
    item: items,
    data: data

  });
};

export const refreshTokenResponse = (statusCode, code, status, items, message, res) => {
  res.json(statusCode, {
    code: code,
    status: status,
    message: message,
    item: items,

  });
};

