export const isMobileNumber = number => {
  const pattern = /^\d{10}$/;
  return pattern.test(number);
};

export const isEmailAddress = mail => {
  //const pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
  const pattern = /\w+@\w+\.\w+/;
  return pattern.test(mail);
};

export const isEmailAddress2 = email => {
  const pattern =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  return pattern.test(email);
};

export const isPasswordvalid = password => {
  const pattern = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/;
  return pattern.test(password);
};

export const isNameValid = name => {
  // const pattern = /^[A-Za-z\s]+$/;
  const pattern = /^[aA-zZ]'?[- a-zA-Z]+$/;
  // const pattern = /^[a-zA-Z]{7,15}$/;
  return pattern.test(name);
};
