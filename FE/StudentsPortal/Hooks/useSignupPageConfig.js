import emailValidator from './Validators/emailValidator';
import passwordValidator from './Validators/passwordValidator';
import notEmptyValidator from './Validators/notEmptyValidator';
import repeatPasswordValidator from './Validators/repeatPasswordValidator';

function useSignPageConfig() {
  return [
    {
      labelText: 'Username',
      type: 'username',
      validator: notEmptyValidator,
      placeholder: 'username',
      isSecure: false,
      keyboardType: 'default',
    },
    {
      labelText: 'Email',
      type: 'email',
      validator: emailValidator,
      placeholder: 'email@gmail.com',
      isSecure: false,
      keyboardType: 'email-address',
    },
    {
      labelText: 'Password',
      type: 'password',
      validator: passwordValidator,
      placeholder: 'P@2ssword',
      isSecure: true,
      keyboardType: 'default',
    },
    {
      labelText: 'Repeat your Password',
      type: 'repPassword',
      validator: repeatPasswordValidator,
      placeholder: 'Repeat password',
      isSecure: true,
      keyboardType: 'default',
    },
  ];
}
export default useSignPageConfig;
